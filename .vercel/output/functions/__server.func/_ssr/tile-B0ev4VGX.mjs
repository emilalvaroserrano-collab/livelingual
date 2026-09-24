import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { g as MicOff, x as Hand } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tile-B0ev4VGX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Button({ variant = "secondary", size = "md", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex items-center justify-center gap-2 font-medium transition-[transform,background-color,opacity,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40", size === "md" && "h-11 rounded-md px-4 text-sm", size === "lg" && "h-12 rounded-md px-5 text-base", size === "icon" && "size-11 shrink-0 rounded-full", variant === "primary" && "bg-accent text-ink hover:opacity-90", variant === "secondary" && "border border-strong bg-subtle text-fg hover:bg-elevated", variant === "ghost" && "bg-transparent text-fg hover:bg-subtle", variant === "danger" && "bg-danger text-danger-fg hover:opacity-90", className),
		...props
	});
}
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-6", className),
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "16",
			cy: "16.4",
			r: "9.2",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.4"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "22.2",
			cy: "10.2",
			r: "2.5",
			fill: "currentColor"
		})]
	});
}
function Wordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2 text-fg", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-base font-medium tracking-tight",
			children: "Orbit Meeting"
		})]
	});
}
function useLocalMedia(wantAudio, wantVideo) {
	const [stream, setStream] = (0, import_react.useState)(null);
	const [cameras, setCameras] = (0, import_react.useState)([]);
	const [mics, setMics] = (0, import_react.useState)([]);
	const [cameraId, setCameraId] = (0, import_react.useState)("");
	const [micId, setMicId] = (0, import_react.useState)("");
	const [videoError, setVideoError] = (0, import_react.useState)(null);
	const [audioError, setAudioError] = (0, import_react.useState)(null);
	const streamRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function open() {
			if (!navigator.mediaDevices?.getUserMedia) {
				setStream(null);
				setVideoError(wantVideo ? "No camera in this browser" : null);
				setAudioError(wantAudio ? "No microphone in this browser" : null);
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
			const audio = wantAudio ? micId ? { deviceId: { exact: micId } } : true : false;
			const video = wantVideo ? cameraId ? { deviceId: { exact: cameraId } } : { facingMode: "user" } : false;
			const attempts = [{
				audio,
				video
			}];
			if (wantAudio && wantVideo) attempts.push({
				audio,
				video: false
			}, {
				audio: false,
				video
			});
			let next = null;
			for (const constraints of attempts) try {
				next = await navigator.mediaDevices.getUserMedia(constraints);
				break;
			} catch (error) {}
			if (cancelled) {
				next?.getTracks().forEach((track) => track.stop());
				return;
			}
			if (!next) {
				setStream(null);
				streamRef.current?.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
				if (wantVideo) setVideoError("Camera unavailable");
				if (wantAudio) setAudioError("Microphone unavailable");
				return;
			}
			const hasVideo = next.getVideoTracks().length > 0;
			const hasAudio = next.getAudioTracks().length > 0;
			setVideoError(wantVideo && !hasVideo ? "Camera unavailable" : null);
			setAudioError(wantAudio && !hasAudio ? "Microphone unavailable" : null);
			streamRef.current?.getTracks().forEach((track) => track.stop());
			streamRef.current = next;
			setStream(next);
			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				if (cancelled) return;
				setCameras(devices.filter((device) => device.kind === "videoinput"));
				setMics(devices.filter((device) => device.kind === "audioinput"));
			} catch {}
		}
		open();
		return () => {
			cancelled = true;
		};
	}, [
		wantAudio,
		wantVideo,
		cameraId,
		micId
	]);
	(0, import_react.useEffect)(() => {
		return () => {
			streamRef.current?.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		};
	}, []);
	return {
		stream,
		cameras,
		mics,
		cameraId,
		micId,
		setCameraId,
		setMicId,
		videoError,
		audioError
	};
}
function StreamVideo({ stream, mirror, className }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const element = ref.current;
		if (!element) return;
		if (element.srcObject !== stream) element.srcObject = stream;
	}, [stream]);
	const live = stream?.getVideoTracks().some((track) => track.readyState === "live");
	if (!stream || !live) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		ref,
		autoPlay: true,
		playsInline: true,
		muted: true,
		className: cn("h-full w-full object-cover", mirror && "mirror-x", className)
	});
}
var REACTION_LABEL = {
	yes: "Yes",
	no: "No",
	here: "Here",
	noted: "Noted"
};
function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";
}
function Eq() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "eq",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
		]
	});
}
function Tile({ person, stream, mirror, compact, className }) {
	const showVideo = Boolean(person.local && person.video && stream);
	const label = person.local ? `${person.name} (you)` : person.name;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		"data-speaking": person.speaking ? "true" : "false",
		className: cn("relative flex min-h-36 overflow-hidden rounded-lg border-2 bg-subtle", person.speaking ? "border-accent" : "border-transparent", className),
		children: [
			showVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StreamVideo, {
				stream: stream ?? null,
				mirror
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full w-full items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-medium tracking-tight text-fg", compact ? "text-lg" : "text-3xl"),
					children: initials(person.name)
				})
			}),
			person.hand && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute left-2 top-2 inline-flex items-center gap-1 rounded-sm bg-bg/80 px-2 py-1 text-xs font-medium text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hand, {
					className: "size-3.5",
					"aria-hidden": "true"
				}), "Hand"]
			}),
			person.speaking && person.audio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute right-2 top-2 rounded-sm bg-bg/80 px-1.5 py-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eq, {})
			}),
			person.reaction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-strong bg-elevated px-3 py-1.5 text-sm font-medium text-fg",
				children: REACTION_LABEL[person.reaction]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-sm bg-bg/80 px-2 py-1 text-sm text-fg",
				children: [!person.audio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, {
					className: "size-3.5 shrink-0 text-danger",
					"aria-label": "Muted"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: label
				})]
			})
		]
	});
}
//#endregion
export { Tile as a, initials as c, StreamVideo as i, useLocalMedia as l, Eq as n, Wordmark as o, Mark as r, cn as s, Button as t };
