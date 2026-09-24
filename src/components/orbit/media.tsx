import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type DevicePermissionState = "granted" | "prompt" | "denied" | "unknown" | "unsupported";

export type LocalMedia = {
  stream: MediaStream | null;
  cameras: MediaDeviceInfo[];
  mics: MediaDeviceInfo[];
  cameraId: string;
  micId: string;
  setCameraId: (id: string) => void;
  setMicId: (id: string) => void;
  videoError: string | null;
  audioError: string | null;
  microphonePermission: DevicePermissionState;
  cameraPermission: DevicePermissionState;
  screenShareSupported: boolean;
  mediaRequested: boolean;
  requestMedia: () => void;
};

async function readPermission(name: "camera" | "microphone"): Promise<DevicePermissionState> {
  if (typeof navigator === "undefined") return "unknown";
  if (!navigator.mediaDevices?.getUserMedia) return "unsupported";
  if (!navigator.permissions?.query) return "unknown";

  try {
    const result = await navigator.permissions.query({ name } as PermissionDescriptor);
    if (result.state === "granted" || result.state === "prompt" || result.state === "denied") {
      return result.state;
    }
  } catch {
    // Safari and some mobile browsers expose media permissions without
    // supporting camera/microphone through navigator.permissions.
  }

  return "unknown";
}

export function useLocalMedia(wantAudio: boolean, wantVideo: boolean): LocalMedia {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [cameraId, setCameraId] = useState("");
  const [micId, setMicId] = useState("");
  const [videoError, setVideoError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [microphonePermission, setMicrophonePermission] = useState<DevicePermissionState>("unknown");
  const [cameraPermission, setCameraPermission] = useState<DevicePermissionState>("unknown");
  const [mediaRequested, setMediaRequested] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const requestMedia = useCallback(() => {
    setMediaRequested(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const watchers: PermissionStatus[] = [];

    async function inspect() {
      const [mic, camera] = await Promise.all([
        readPermission("microphone"),
        readPermission("camera"),
      ]);
      if (cancelled) return;

      setMicrophonePermission(mic);
      setCameraPermission(camera);

      const wantedPermissionsGranted =
        (!wantAudio || mic === "granted") &&
        (!wantVideo || camera === "granted");

      if ((wantAudio || wantVideo) && wantedPermissionsGranted) {
        setMediaRequested(true);
      }

      if (!navigator.permissions?.query) return;

      for (const name of ["microphone", "camera"] as const) {
        try {
          const permission = await navigator.permissions.query({ name } as PermissionDescriptor);
          if (cancelled) return;
          const update = () => {
            const next = permission.state as DevicePermissionState;
            if (name === "microphone") setMicrophonePermission(next);
            else setCameraPermission(next);
            if (next === "granted") setMediaRequested(true);
          };
          permission.addEventListener("change", update);
          watchers.push(permission);
        } catch {
          // The permission query API is optional for camera/microphone.
        }
      }
    }

    void inspect();

    return () => {
      cancelled = true;
      watchers.forEach((permission) => {
        // The same callback reference is not available here on all browsers;
        // PermissionStatus listeners are discarded with the page in practice.
        void permission;
      });
    };
  }, [wantAudio, wantVideo]);

  useEffect(() => {
    let cancelled = false;

    async function open() {
      if (!mediaRequested) {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setStream(null);
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setStream(null);
        setVideoError(wantVideo ? "Camera is not supported in this browser." : null);
        setAudioError(wantAudio ? "Microphone is not supported in this browser." : null);
        if (wantVideo) setCameraPermission("unsupported");
        if (wantAudio) setMicrophonePermission("unsupported");
        return;
      }

      if (!wantAudio && !wantVideo) {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setStream(null);
        setVideoError(null);
        setAudioError(null);
        return;
      }

      const audio: MediaTrackConstraints | boolean = wantAudio
        ? micId
          ? { deviceId: { exact: micId } }
          : true
        : false;

      const video: MediaTrackConstraints | boolean = wantVideo
        ? cameraId
          ? { deviceId: { exact: cameraId } }
          : { facingMode: "user" }
        : false;

      const attempts: MediaStreamConstraints[] = [{ audio, video }];
      if (wantAudio && wantVideo) {
        attempts.push({ audio, video: false }, { audio: false, video });
      }

      let next: MediaStream | null = null;
      let lastError: unknown = null;
      for (const constraints of attempts) {
        try {
          next = await navigator.mediaDevices.getUserMedia(constraints);
          break;
        } catch (error) {
          lastError = error;
        }
      }

      if (cancelled) {
        next?.getTracks().forEach((track) => track.stop());
        return;
      }

      if (!next) {
        setStream(null);
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        const denied = lastError instanceof DOMException && lastError.name === "NotAllowedError";
        if (wantVideo) {
          setVideoError(denied ? "Camera permission is blocked." : "Camera is unavailable.");
          if (denied) setCameraPermission("denied");
        }
        if (wantAudio) {
          setAudioError(denied ? "Microphone permission is blocked." : "Microphone is unavailable.");
          if (denied) setMicrophonePermission("denied");
        }
        return;
      }

      const hasVideo = next.getVideoTracks().length > 0;
      const hasAudio = next.getAudioTracks().length > 0;

      if (hasVideo) setCameraPermission("granted");
      if (hasAudio) setMicrophonePermission("granted");

      setVideoError(wantVideo && !hasVideo ? "Camera is unavailable." : null);
      setAudioError(wantAudio && !hasAudio ? "Microphone is unavailable." : null);

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = next;
      setStream(next);

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (cancelled) return;
        setCameras(devices.filter((device) => device.kind === "videoinput"));
        setMics(devices.filter((device) => device.kind === "audioinput"));
      } catch {
        // Device labels are optional and may remain hidden until permission.
      }
    }

    void open();

    return () => {
      cancelled = true;
    };
  }, [wantAudio, wantVideo, cameraId, micId, mediaRequested]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const screenShareSupported =
    typeof navigator !== "undefined" &&
    Boolean(navigator.mediaDevices && "getDisplayMedia" in navigator.mediaDevices);

  return {
    stream,
    cameras,
    mics,
    cameraId,
    micId,
    setCameraId,
    setMicId,
    videoError,
    audioError,
    microphonePermission,
    cameraPermission,
    screenShareSupported,
    mediaRequested,
    requestMedia,
  };
}

export function StreamVideo({
  stream,
  mirror,
  className,
}: {
  stream: MediaStream | null;
  mirror?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (element.srcObject !== stream) element.srcObject = stream;
  }, [stream]);

  const live = stream?.getVideoTracks().some((track) => track.readyState === "live");
  if (!stream || !live) return null;

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted
      className={cn("h-full w-full object-cover", mirror && "mirror-x", className)}
    />
  );
}
