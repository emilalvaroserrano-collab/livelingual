import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  Mic,
  MicOff,
  MonitorUp,
  Settings2,
  ShieldCheck,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { rememberRoom, roomLabel } from "@/lib/rooms";
import { useMeeting } from "@/lib/meeting-store";
import { Button } from "@/components/ui/button";
import {
  StreamVideo,
  type DevicePermissionState,
  type LocalMedia,
} from "@/components/orbit/media";
import { initials } from "@/components/orbit/tile";

const fieldClass =
  "h-12 w-full rounded-lg border border-strong bg-subtle px-3 text-base text-fg outline-none focus:border-accent";

function permissionText(state: DevicePermissionState) {
  if (state === "granted") return "Allowed";
  if (state === "denied") return "Blocked";
  if (state === "unsupported") return "Unavailable";
  return "Needs access";
}

function PermissionDot({ state }: { state: DevicePermissionState }) {
  const className =
    state === "granted"
      ? "bg-live"
      : state === "denied" || state === "unsupported"
        ? "bg-danger"
        : "bg-faint";

  return <span className={`size-2 rounded-full ${className}`} aria-hidden="true" />;
}

export function Prejoin({ room, media }: { room: string; media: LocalMedia }) {
  const [showDevices, setShowDevices] = useState(false);
  const displayName = useMeeting((state) => state.displayName);
  const setDisplayName = useMeeting((state) => state.setDisplayName);
  const wantAudio = useMeeting((state) => state.wantAudio);
  const wantVideo = useMeeting((state) => state.wantVideo);
  const toggleAudio = useMeeting((state) => state.toggleAudio);
  const toggleVideo = useMeeting((state) => state.toggleVideo);
  const mirror = useMeeting((state) => state.mirror);

  const videoLive = Boolean(
    media.stream?.getVideoTracks().some((track) => track.readyState === "live"),
  );
  const audioLive = Boolean(
    media.stream?.getAudioTracks().some((track) => track.readyState === "live"),
  );

  const permissionBlocked =
    (wantAudio && media.microphonePermission === "denied") ||
    (wantVideo && media.cameraPermission === "denied");

  const shouldAskForMedia =
    !media.mediaRequested &&
    ((wantAudio && media.microphonePermission !== "granted") ||
      (wantVideo && media.cameraPermission !== "granted"));

  function joinMeeting() {
    const name = displayName.trim() || "Guest";
    if (name !== displayName) setDisplayName(name);
    rememberRoom(room);

    const params = new URLSearchParams();
    params.set("userInfo.displayName", JSON.stringify(name));
    params.set("config.prejoinConfig.enabled", "false");
    params.set("config.startWithAudioMuted", String(!wantAudio));
    params.set("config.startWithVideoMuted", String(!wantVideo));
    window.location.assign(`/${encodeURIComponent(room)}#${params.toString()}`);
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-bg text-fg md:flex md:min-h-screen md:items-stretch">
      <header className="safe-top fixed inset-x-0 top-0 z-30 bg-gradient-to-b from-black/70 to-transparent md:absolute">
        <div className="relative flex h-14 items-center justify-center px-3">
          <Link
            to="/"
            aria-label="Close prejoin"
            className="absolute left-2 inline-flex size-11 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur active:scale-95"
          >
            <X className="size-5" />
          </Link>
          <div className="max-w-[65vw] text-center">
            <p className="truncate text-[15px] font-semibold capitalize text-white">
              {roomLabel(room)}
            </p>
            <p className="text-[11px] text-white/65">Orbit Meeting</p>
          </div>
        </div>
      </header>

      <section className="relative h-[48dvh] min-h-[310px] w-full overflow-hidden bg-[#171b20] md:h-screen md:min-h-0 md:w-1/2 lg:w-[58%]">
        {wantVideo && videoLive ? (
          <StreamVideo stream={media.stream} mirror={mirror} />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,#26303a_0%,#15191e_62%,#0d1014_100%)]">
            <span className="inline-flex size-24 items-center justify-center rounded-full bg-[#35404b] text-3xl font-semibold text-white">
              {initials(displayName || "Guest")}
            </span>
          </div>
        )}

        {shouldAskForMedia && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/72 px-6 pt-12 backdrop-blur-sm">
            <div className="w-full max-w-sm text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck className="size-8 text-white" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-white">Allow meeting access</h2>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/70">
                Orbit needs access to the devices you turned on so you can be seen and heard in the meeting.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/10 px-3 py-3 text-left">
                  <Mic className="size-5 text-white" />
                  <p className="mt-2 text-sm font-medium text-white">Microphone</p>
                  <p className="text-xs text-white/55">
                    {wantAudio ? permissionText(media.microphonePermission) : "Currently off"}
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 px-3 py-3 text-left">
                  <Video className="size-5 text-white" />
                  <p className="mt-2 text-sm font-medium text-white">Camera</p>
                  <p className="text-xs text-white/55">
                    {wantVideo ? permissionText(media.cameraPermission) : "Currently off"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={media.requestMedia}
                className="mt-5 h-12 w-full rounded-lg bg-[#2d8cff] px-4 text-base font-semibold text-white active:scale-[0.99]"
              >
                Allow camera & microphone
              </button>
              <p className="mt-3 text-xs leading-normal text-white/45">
                Your browser will show the secure system permission prompt.
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center px-4">
          <div className="flex h-[60px] items-center gap-3 rounded-2xl bg-[#20262d]/95 px-3 shadow-2xl backdrop-blur">
            <button
              type="button"
              aria-label={wantAudio ? "Mute microphone" : "Unmute microphone"}
              aria-pressed={!wantAudio}
              onClick={() => {
                if (!media.mediaRequested && !wantAudio) media.requestMedia();
                toggleAudio();
              }}
              className={`inline-flex size-11 items-center justify-center rounded-full transition-colors active:scale-95 ${
                wantAudio ? "bg-[#3a424b] text-white" : "bg-danger text-white"
              }`}
            >
              {wantAudio ? <Mic className="size-5" /> : <MicOff className="size-5" />}
            </button>

            <button
              type="button"
              aria-label={wantVideo ? "Turn camera off" : "Turn camera on"}
              aria-pressed={!wantVideo}
              onClick={() => {
                if (!media.mediaRequested && !wantVideo) media.requestMedia();
                toggleVideo();
              }}
              className={`inline-flex size-11 items-center justify-center rounded-full transition-colors active:scale-95 ${
                wantVideo ? "bg-[#3a424b] text-white" : "bg-danger text-white"
              }`}
            >
              {wantVideo ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            </button>
          </div>
        </div>

        <div className="absolute bottom-5 left-4 z-20 hidden rounded-md bg-black/45 px-2.5 py-1.5 text-sm text-white backdrop-blur md:block">
          {displayName.trim() || "Guest"}
        </div>
      </section>

      <main className="safe-bottom flex min-h-[52dvh] w-full flex-col bg-[#111418] px-4 pb-5 pt-5 md:min-h-screen md:w-1/2 md:justify-center md:px-8 lg:w-[42%]">
        <form
          className="mx-auto w-full max-w-[352px]"
          onSubmit={(event) => {
            event.preventDefault();
            joinMeeting();
          }}
        >
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight">Join meeting</h1>
            <p className="mt-1 truncate text-sm capitalize text-muted">{roomLabel(room)}</p>
          </div>

          <label htmlFor="display-name" className="mt-5 block">
            <span className="sr-only">Your name</span>
            <input
              id="display-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={40}
              autoComplete="name"
              placeholder="Your name"
              className={`${fieldClass} text-center`}
            />
          </label>

          {permissionBlocked && (
            <div className="mt-3 rounded-lg border border-danger/35 bg-danger/10 px-3 py-3 text-sm leading-normal text-danger-fg">
              Camera or microphone access is blocked. Open this site's browser permissions and allow the device, then try again. You can still join muted.
            </div>
          )}

          <div className="mt-4 overflow-hidden rounded-xl bg-elevated">
            <div className="flex min-h-12 items-center gap-3 border-b border-line px-3">
              <Mic className="size-4 text-muted" />
              <span className="flex-1 text-sm">Microphone</span>
              <span className="inline-flex items-center gap-2 text-xs text-muted">
                <PermissionDot state={media.microphonePermission} />
                {wantAudio
                  ? audioLive
                    ? "Ready"
                    : permissionText(media.microphonePermission)
                  : "Off"}
              </span>
            </div>

            <div className="flex min-h-12 items-center gap-3 border-b border-line px-3">
              <Video className="size-4 text-muted" />
              <span className="flex-1 text-sm">Camera</span>
              <span className="inline-flex items-center gap-2 text-xs text-muted">
                <PermissionDot state={media.cameraPermission} />
                {wantVideo
                  ? videoLive
                    ? "Ready"
                    : permissionText(media.cameraPermission)
                  : "Off"}
              </span>
            </div>

            <div className="flex min-h-12 items-center gap-3 px-3">
              <MonitorUp className="size-4 text-muted" />
              <span className="flex-1 text-sm">Screen sharing</span>
              <span className="text-xs text-muted">
                {media.screenShareSupported ? "Ask when used" : "Browser unsupported"}
              </span>
            </div>
          </div>

          {(media.mics.length > 1 || media.cameras.length > 1) && (
            <div className="mt-3 overflow-hidden rounded-xl bg-elevated">
              <button
                type="button"
                onClick={() => setShowDevices((value) => !value)}
                className="flex h-12 w-full items-center gap-3 px-3 text-left"
              >
                <Settings2 className="size-4 text-muted" />
                <span className="flex-1 text-sm font-medium">Device settings</span>
                <ChevronDown
                  className={`size-4 text-muted transition-transform ${showDevices ? "rotate-180" : ""}`}
                />
              </button>

              {showDevices && (
                <div className="grid gap-3 border-t border-line px-3 py-3">
                  {media.mics.length > 1 && (
                    <label className="grid gap-1.5 text-xs font-medium text-muted">
                      Microphone
                      <select
                        className={fieldClass}
                        value={media.micId}
                        onChange={(event) => media.setMicId(event.target.value)}
                      >
                        <option value="">System default</option>
                        {media.mics.map((device) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label || "Microphone"}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {media.cameras.length > 1 && (
                    <label className="grid gap-1.5 text-xs font-medium text-muted">
                      Camera
                      <select
                        className={fieldClass}
                        value={media.cameraId}
                        onChange={(event) => media.setCameraId(event.target.value)}
                      >
                        <option value="">System default</option>
                        {media.cameras.map((device) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label || "Camera"}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
              )}
            </div>
          )}

          {(media.audioError || media.videoError) && !permissionBlocked && (
            <p className="mt-3 text-center text-xs leading-normal text-muted">
              {[media.audioError, media.videoError].filter(Boolean).join(" ")} You can still join.
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-5 w-full bg-[#2d8cff] text-white hover:opacity-95"
          >
            Join meeting
          </Button>

          <p className="mt-3 text-center text-xs leading-normal text-faint">
            Screen sharing permission is requested only when you choose Share Screen inside the meeting.
          </p>
        </form>
      </main>
    </div>
  );
}
