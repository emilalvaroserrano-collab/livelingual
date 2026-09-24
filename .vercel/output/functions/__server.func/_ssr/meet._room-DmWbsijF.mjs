import { i as __toESM } from "../_runtime.mjs";
import { a as savePrefs, i as roomLabel, r as rememberRoom, t as loadPrefs } from "./rooms-Bv8qP-ir.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as Copy, S as Ellipsis, _ as MessageSquare, b as Keyboard, c as Star, d as Settings, f as ScreenShare, g as MicOff, h as Mic, i as Users, l as Smile, m as PhoneOff, n as Video, o as ThumbsUp, p as RectangleHorizontal, r as VideoOff, s as ThumbsDown, t as X, u as SignalHigh, v as Lock, w as ChartNoAxesColumn, x as Hand, y as LayoutGrid } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-CaRyHvPZ.mjs";
import { a as Tile, c as initials, i as StreamVideo, l as useLocalMedia, r as Mark, s as cn, t as Button } from "./tile-B0ev4VGX.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as Trigger, i as Root2, n as Content2, r as Portal, t as Close } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { n as SwitchThumb, t as Switch } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/meet._room-DmWbsijF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var seq = 0;
function uid(prefix) {
	seq += 1;
	return `${prefix}-${seq}`;
}
function persist(state) {
	savePrefs({
		name: state.displayName,
		audio: state.wantAudio,
		video: state.wantVideo,
		mirror: state.mirror
	});
}
function replyFor(text) {
	const value = text.toLowerCase();
	if (value.includes("hello") || value.includes("hi ") || value === "hi") return "Hey — glad you made it in.";
	if (value.includes("?")) return "Good question. Let's settle it before we drop.";
	if (value.includes("mute")) return "I'll stay muted unless I'm talking.";
	if (value.includes("hand")) return "I see you. Go ahead.";
	if (value.includes("share") || value.includes("screen")) return "Go ahead and share whenever you're ready.";
	return "Noted. I'll keep that with the room notes.";
}
function guestToPerson(guest) {
	return {
		id: guest.id,
		name: guest.name,
		role: guest.role,
		local: false,
		moderator: false,
		audio: true,
		video: false,
		hand: false,
		speaking: false,
		reaction: null,
		sharing: false
	};
}
var useMeeting = create((set, get) => ({
	displayName: "Guest",
	wantAudio: true,
	wantVideo: true,
	mirror: true,
	joined: false,
	room: "",
	startedAt: null,
	layout: "tile",
	panel: null,
	recording: false,
	locked: false,
	people: [],
	lobby: [],
	chat: [],
	unread: 0,
	dominantId: null,
	toast: null,
	setDisplayName: (name) => {
		const next = name.slice(0, 40);
		set((state) => ({
			displayName: next,
			people: state.people.map((person) => person.local ? {
				...person,
				name: next || "Guest"
			} : person)
		}));
		persist(get());
	},
	setWantAudio: (value) => {
		set({ wantAudio: value });
		persist(get());
	},
	setWantVideo: (value) => {
		set({ wantVideo: value });
		persist(get());
	},
	setMirror: (value) => {
		set({ mirror: value });
		persist(get());
	},
	hydratePrefs: (prefs) => {
		if (get().joined) return;
		set({
			displayName: prefs.name || "Guest",
			wantAudio: prefs.audio,
			wantVideo: prefs.video,
			mirror: prefs.mirror
		});
	},
	join: (room) => {
		const state = get();
		const name = state.displayName.trim() || "Guest";
		set({
			displayName: name,
			joined: true,
			room,
			startedAt: Date.now(),
			layout: "tile",
			panel: null,
			recording: false,
			locked: false,
			lobby: [],
			chat: [],
			unread: 0,
			dominantId: "local",
			toast: "You are the only moderator.",
			people: [{
				id: "local",
				name,
				local: true,
				moderator: true,
				audio: state.wantAudio,
				video: state.wantVideo,
				hand: false,
				speaking: false,
				reaction: null,
				sharing: false
			}]
		});
		persist(get());
	},
	leave: () => set({
		joined: false,
		room: "",
		startedAt: null,
		people: [],
		lobby: [],
		chat: [],
		unread: 0,
		panel: null,
		recording: false,
		locked: false,
		dominantId: null,
		toast: null,
		layout: "tile"
	}),
	toggleAudio: () => set((state) => {
		const next = !state.wantAudio;
		persist({
			...state,
			wantAudio: next
		});
		return {
			wantAudio: next,
			people: state.people.map((person) => person.local ? {
				...person,
				audio: next,
				speaking: next ? person.speaking : false
			} : person)
		};
	}),
	toggleVideo: () => set((state) => {
		const next = !state.wantVideo;
		persist({
			...state,
			wantVideo: next
		});
		return {
			wantVideo: next,
			people: state.people.map((person) => person.local ? {
				...person,
				video: next
			} : person)
		};
	}),
	toggleHand: () => set((state) => ({ people: state.people.map((person) => person.local ? {
		...person,
		hand: !person.hand
	} : person) })),
	setSharing: (on) => set((state) => ({ people: state.people.map((person) => person.local ? {
		...person,
		sharing: on
	} : person) })),
	setLayout: (layout) => set({ layout }),
	togglePanel: (panel) => set((state) => {
		const next = state.panel === panel ? null : panel;
		return {
			panel: next,
			unread: next === "chat" ? 0 : state.unread
		};
	}),
	closePanel: () => set({ panel: null }),
	setRecording: (value) => set({ recording: value }),
	setLocked: (value) => set({ locked: value }),
	pushChat: (message) => set((state) => ({
		chat: [...state.chat, {
			...message,
			id: uid("chat"),
			at: Date.now()
		}],
		unread: state.panel === "chat" ? state.unread : state.unread + 1
	})),
	sendChat: (text) => {
		const trimmed = text.trim().slice(0, 500);
		if (!trimmed) return;
		const state = get();
		const from = state.people.find((person) => person.local)?.name || state.displayName || "Guest";
		set((current) => ({ chat: [...current.chat, {
			id: uid("chat"),
			fromId: "local",
			from,
			text: trimmed,
			at: Date.now()
		}] }));
		const responders = get().people.filter((person) => !person.local);
		if (responders.length === 0) return;
		const who = responders[get().chat.length % responders.length];
		const reply = replyFor(trimmed);
		window.setTimeout(() => {
			const now = get();
			if (!now.joined || !now.people.some((person) => person.id === who.id)) return;
			now.pushChat({
				fromId: who.id,
				from: who.name,
				text: reply
			});
		}, 900);
	},
	addPerson: (person) => set((state) => {
		if (state.people.some((item) => item.id === person.id)) return state;
		return { people: [...state.people, person] };
	}),
	patchPerson: (id, patch) => set((state) => ({ people: state.people.map((person) => person.id === id ? {
		...person,
		...patch
	} : person) })),
	addLobby: (guest) => set((state) => {
		if (state.lobby.some((item) => item.id === guest.id)) return state;
		if (state.people.some((item) => item.id === guest.id)) return state;
		return { lobby: [...state.lobby, guest] };
	}),
	admit: (id) => {
		const guest = get().lobby.find((item) => item.id === id);
		if (!guest) return;
		set((state) => ({
			lobby: state.lobby.filter((item) => item.id !== id),
			people: state.people.some((item) => item.id === id) ? state.people : [...state.people, guestToPerson(guest)],
			toast: `${guest.name} joined`
		}));
	},
	deny: (id) => {
		const guest = get().lobby.find((item) => item.id === id);
		if (!guest) return;
		set((state) => ({
			lobby: state.lobby.filter((item) => item.id !== id),
			toast: `${guest.name} was not admitted`
		}));
	},
	setSpeaking: (id) => set((state) => ({
		dominantId: id ?? state.people.find((person) => person.local)?.id ?? null,
		people: state.people.map((person) => ({
			...person,
			speaking: person.id === id && person.audio
		}))
	})),
	showToast: (text) => set({ toast: text }),
	clearToast: () => set({ toast: null }),
	react: (id, reaction) => {
		get().patchPerson(id, { reaction });
		window.setTimeout(() => {
			if (get().people.find((item) => item.id === id)?.reaction === reaction) get().patchPerson(id, { reaction: null });
		}, 2200);
	},
	muteAll: () => set((state) => ({
		toast: "Everyone else is muted.",
		people: state.people.map((person) => person.local ? person : {
			...person,
			audio: false,
			speaking: false
		})
	}))
}));
var fieldClass = "h-12 w-full rounded-md border border-strong bg-bg px-3 text-base text-fg outline-none";
function Prejoin({ room, media }) {
	const displayName = useMeeting((state) => state.displayName);
	const setDisplayName = useMeeting((state) => state.setDisplayName);
	const wantAudio = useMeeting((state) => state.wantAudio);
	const wantVideo = useMeeting((state) => state.wantVideo);
	const toggleAudio = useMeeting((state) => state.toggleAudio);
	const toggleVideo = useMeeting((state) => state.toggleVideo);
	const mirror = useMeeting((state) => state.mirror);
	const join = useMeeting((state) => state.join);
	const videoLive = Boolean(media.stream?.getVideoTracks().some((track) => track.readyState === "live"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex h-16 items-center justify-between border-b border-line px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-2 text-fg",
				"aria-label": "Orbit Meeting home",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-base font-medium tracking-tight",
					children: "Orbit Meeting"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-40 truncate text-sm capitalize text-muted",
				children: roomLabel(room)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid w-full max-w-4xl gap-8 px-5 py-8 lg:grid-cols-2 lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-video overflow-hidden rounded-xl bg-subtle",
				children: [wantVideo && videoLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StreamVideo, {
					stream: media.stream,
					mirror
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-4xl font-medium tracking-tight",
						children: initials(displayName || "Guest")
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "absolute inset-x-3 bottom-3 truncate rounded-md bg-bg/80 px-3 py-2 text-sm",
					children: displayName.trim() || "Guest"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "rounded-card border border-line bg-elevated p-4",
				onSubmit: (event) => {
					event.preventDefault();
					if (!displayName.trim()) setDisplayName("Guest");
					rememberRoom(room);
					join(room);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-medium tracking-tight",
						children: "Join meeting"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm capitalize text-muted",
						children: roomLabel(room)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						htmlFor: "display-name",
						className: "mt-5 grid gap-2 text-sm font-medium",
						children: ["Your name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "display-name",
							value: displayName,
							onChange: (event) => setDisplayName(event.target.value),
							maxLength: 40,
							autoComplete: "name",
							className: fieldClass
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: wantAudio ? "secondary" : "danger",
							"aria-pressed": wantAudio,
							onClick: toggleAudio,
							className: "flex-1",
							children: [wantAudio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-4" }), wantAudio ? "Mic on" : "Mic off"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: wantVideo ? "secondary" : "danger",
							"aria-pressed": wantVideo,
							onClick: toggleVideo,
							className: "flex-1",
							children: [wantVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "size-4" }), wantVideo ? "Camera on" : "Camera off"]
						})]
					}),
					media.mics.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 grid gap-2 text-sm font-medium",
						children: ["Microphone", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: fieldClass,
							value: media.micId,
							onChange: (event) => media.setMicId(event.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "System default"
							}), media.mics.map((device) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: device.deviceId,
								children: device.label || "Microphone"
							}, device.deviceId))]
						})]
					}),
					media.cameras.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 grid gap-2 text-sm font-medium",
						children: ["Camera", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: fieldClass,
							value: media.cameraId,
							onChange: (event) => media.setCameraId(event.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "System default"
							}), media.cameras.map((device) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: device.deviceId,
								children: device.label || "Camera"
							}, device.deviceId))]
						})]
					}),
					(media.audioError || media.videoError) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm leading-normal text-muted",
						children: [[media.audioError, media.videoError].filter(Boolean).join(" "), " You can still join."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "primary",
						size: "lg",
						className: "mt-5 w-full",
						children: "Join meeting"
					})
				]
			})]
		})]
	});
}
var CAST = [
	{
		id: "maya",
		name: "Maya Chen",
		role: "Product"
	},
	{
		id: "leo",
		name: "Leo Okonkwo",
		role: "Design"
	},
	{
		id: "priya",
		name: "Priya Shah",
		role: "Engineering"
	}
];
function remote(who) {
	return {
		id: who.id,
		name: who.name,
		role: who.role,
		local: false,
		moderator: false,
		audio: true,
		video: false,
		hand: false,
		speaking: false,
		reaction: null,
		sharing: false
	};
}
function useRoomPresence(active) {
	(0, import_react.useEffect)(() => {
		if (!active) return;
		const seen = /* @__PURE__ */ new Set();
		const timers = [];
		const later = (ms, fn) => {
			timers.push(window.setTimeout(fn, ms));
		};
		const enter = (who) => {
			if (seen.has(who.id)) return;
			const state = useMeeting.getState();
			if (!state.joined) return;
			seen.add(who.id);
			if (state.locked) {
				state.addLobby({
					id: who.id,
					name: who.name,
					role: who.role
				});
				state.showToast(`${who.name} is waiting in the lobby`);
				return;
			}
			state.addPerson(remote(who));
			state.showToast(`${who.name} joined`);
		};
		later(800, () => enter(CAST[0]));
		later(1700, () => enter(CAST[1]));
		later(2600, () => {
			const state = useMeeting.getState();
			if (!state.people.some((person) => person.id === "maya")) return;
			state.pushChat({
				fromId: "maya",
				from: "Maya Chen",
				text: "I'm here. Camera's off on my side."
			});
		});
		later(4300, () => enter(CAST[2]));
		later(5200, () => {
			const state = useMeeting.getState();
			if (!state.people.some((person) => person.id === "leo")) return;
			state.pushChat({
				fromId: "leo",
				from: "Leo Okonkwo",
				text: "Audio only works. I'll raise a hand if I need the floor."
			});
		});
		later(6800, () => {
			if (!useMeeting.getState().people.some((person) => person.id === "leo")) return;
			useMeeting.getState().patchPerson("leo", { hand: true });
		});
		later(10200, () => {
			if (!useMeeting.getState().people.some((person) => person.id === "leo")) return;
			useMeeting.getState().patchPerson("leo", { hand: false });
		});
		const speak = window.setInterval(() => {
			const people = useMeeting.getState().people.filter((person) => !person.local && person.audio);
			if (people.length === 0) {
				useMeeting.getState().setSpeaking(null);
				return;
			}
			const pick = people[Math.floor(Date.now() / 3400) % people.length];
			useMeeting.getState().setSpeaking(pick.id);
		}, 3400);
		return () => {
			timers.forEach((timer) => window.clearTimeout(timer));
			window.clearInterval(speak);
		};
	}, [active]);
}
var SHORTCUTS = [
	["M", "Mute or unmute"],
	["V", "Camera on or off"],
	["C", "Open chat"],
	["P", "Open participants"],
	["R", "Raise or lower hand"],
	["T", "Tile or speaker view"],
	["S", "Share screen"],
	["L", "Copy invite link"],
	["Esc", "Close the panel"]
];
function formatClock(at) {
	return new Date(at).toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit"
	});
}
function formatElapsed(startedAt, now) {
	if (!startedAt) return "00:00";
	const total = Math.max(0, Math.floor((now - startedAt) / 1e3));
	const minutes = Math.floor(total / 60);
	const seconds = total % 60;
	const hours = Math.floor(minutes / 60);
	const mm = String(minutes % 60).padStart(2, "0");
	const ss = String(seconds).padStart(2, "0");
	return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}
function SidePanel({ now }) {
	const panel = useMeeting((state) => state.panel);
	const closePanel = useMeeting((state) => state.closePanel);
	if (!panel) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "panel-in absolute inset-0 z-20 flex min-h-0 flex-col bg-elevated sm:static sm:w-96 sm:border-l sm:border-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex h-14 shrink-0 items-center justify-between border-b border-line px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-medium",
				children: panel === "chat" ? "Chat" : panel === "people" ? "Participants" : panel === "settings" ? "Settings" : panel === "shortcuts" ? "Shortcuts" : "Stats"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				"aria-label": "Close panel",
				onClick: closePanel,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col overflow-hidden",
			children: [
				panel === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, {}),
				panel === "people" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeoplePanel, {}),
				panel === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {}),
				panel === "shortcuts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutsPanel, {}),
				panel === "stats" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsPanel, { now })
			]
		})]
	});
}
function ChatPanel() {
	const chat = useMeeting((state) => state.chat);
	const sendChat = useMeeting((state) => state.sendChat);
	const [draft, setDraft] = (0, import_react.useState)("");
	const endRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		endRef.current?.scrollIntoView({ block: "end" });
	}, [chat.length]);
	function onSubmit(event) {
		event.preventDefault();
		sendChat(draft);
		setDraft("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "scroll-thin min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4",
			children: [chat.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-normal text-muted",
				children: "No messages yet. Say hello to the room."
			}) : chat.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-baseline justify-between gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: message.from
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
					className: "shrink-0 text-xs tabular-nums text-faint",
					dateTime: new Date(message.at).toISOString(),
					children: formatClock(message.at)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-normal text-muted",
				children: message.text
			})] }, message.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: endRef })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "flex gap-2 border-t border-line p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "sr-only",
					htmlFor: "chat-input",
					children: "Message"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "chat-input",
					value: draft,
					onChange: (event) => setDraft(event.target.value),
					placeholder: "Message the room",
					maxLength: 500,
					className: "h-11 min-w-0 flex-1 rounded-md border border-strong bg-bg px-3 text-sm text-fg outline-none placeholder:text-faint"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "primary",
					children: "Send"
				})
			]
		})]
	});
}
function PeoplePanel() {
	const people = useMeeting((state) => state.people);
	const lobby = useMeeting((state) => state.lobby);
	const admit = useMeeting((state) => state.admit);
	const deny = useMeeting((state) => state.deny);
	const muteAll = useMeeting((state) => state.muteAll);
	const locked = useMeeting((state) => state.locked);
	const setLocked = useMeeting((state) => state.setLocked);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "scroll-thin h-full overflow-y-auto px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [people.length, " in the room"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: muteAll,
					children: "Mute all"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: people.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md bg-subtle px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-sm font-medium",
						children: [person.name, person.local ? " (you)" : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-faint",
						children: [
							person.moderator ? "Moderator" : person.role || "Guest",
							!person.audio ? " · Muted" : "",
							person.hand ? " · Hand raised" : ""
						]
					})]
				}, person.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Lobby"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-faint",
					children: locked ? "New guests wait" : "Room is open"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: locked,
					onCheckedChange: setLocked,
					"aria-label": locked ? "Unlock room" : "Lock room",
					className: "relative h-6 w-11 rounded-full border border-strong bg-bg data-[state=checked]:bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "block size-5 translate-x-0.5 rounded-full bg-fg transition-transform duration-150 data-[state=checked]:translate-x-5 data-[state=checked]:bg-ink" })
				})]
			}),
			lobby.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: lobby.map((guest) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md border border-line px-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: guest.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-faint",
							children: [guest.role || "Guest", " is waiting"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "primary",
								onClick: () => admit(guest.id),
								children: "Admit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => deny(guest.id),
								children: "Deny"
							})]
						})
					]
				}, guest.id))
			})
		]
	});
}
function SettingsPanel() {
	const displayName = useMeeting((state) => state.displayName);
	const setDisplayName = useMeeting((state) => state.setDisplayName);
	const mirror = useMeeting((state) => state.mirror);
	const setMirror = useMeeting((state) => state.setMirror);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 px-4 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			htmlFor: "settings-name",
			className: "grid gap-2 text-sm font-medium",
			children: ["Display name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "settings-name",
				value: displayName,
				maxLength: 40,
				onChange: (event) => setDisplayName(event.target.value),
				className: "h-12 rounded-md border border-strong bg-bg px-3 text-base font-normal text-fg outline-none"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: "Mirror my video"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-faint",
				children: "Only you see the flipped view"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: mirror,
				onCheckedChange: setMirror,
				"aria-label": "Mirror my video",
				className: "relative h-6 w-11 rounded-full border border-strong bg-bg data-[state=checked]:bg-accent",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "block size-5 translate-x-0.5 rounded-full bg-fg transition-transform duration-150 data-[state=checked]:translate-x-5 data-[state=checked]:bg-ink" })
			})]
		})]
	});
}
function ShortcutsPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "scroll-thin h-full divide-y divide-line overflow-y-auto px-4",
		children: SHORTCUTS.map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-center justify-between gap-3 py-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
				className: "rounded-sm border border-strong bg-bg px-2 py-1 font-mono text-xs text-muted",
				children: key
			})]
		}, key))
	});
}
function StatsPanel({ now }) {
	const room = useMeeting((state) => state.room);
	const startedAt = useMeeting((state) => state.startedAt);
	const people = useMeeting((state) => state.people);
	const [downlink, setDownlink] = (0, import_react.useState)(1.6);
	(0, import_react.useEffect)(() => {
		const timer = window.setInterval(() => {
			const wobble = Date.now() / 800 % 5 / 10;
			setDownlink(Number((1.45 + wobble).toFixed(2)));
		}, 1e3);
		return () => window.clearInterval(timer);
	}, []);
	const rows = [
		["Room", roomLabel(room)],
		["Duration", formatElapsed(startedAt, now)],
		["Participants", String(people.length)],
		["Quality", "Good"],
		["Downlink", `${downlink.toFixed(2)} Mb/s`],
		["Packet loss", "0.1%"]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
		className: "divide-y divide-line px-4",
		children: rows.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 py-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-muted",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "font-medium tabular-nums capitalize",
				children: value
			})]
		}, label))
	});
}
var REACTIONS = [
	{
		id: "yes",
		label: "Yes",
		icon: ThumbsUp
	},
	{
		id: "no",
		label: "No",
		icon: ThumbsDown
	},
	{
		id: "here",
		label: "Here",
		icon: Hand
	},
	{
		id: "noted",
		label: "Noted",
		icon: Star
	}
];
function elapsedLabel(startedAt, now) {
	if (!startedAt) return "00:00";
	const total = Math.max(0, Math.floor((now - startedAt) / 1e3));
	const minutes = Math.floor(total / 60);
	const seconds = total % 60;
	const hours = Math.floor(minutes / 60);
	const mm = String(minutes % 60).padStart(2, "0");
	const ss = String(seconds).padStart(2, "0");
	return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}
function Room({ room, media }) {
	const navigate = useNavigate();
	const joined = useMeeting((state) => state.joined);
	const people = useMeeting((state) => state.people);
	const layout = useMeeting((state) => state.layout);
	const panel = useMeeting((state) => state.panel);
	const recording = useMeeting((state) => state.recording);
	const locked = useMeeting((state) => state.locked);
	const unread = useMeeting((state) => state.unread);
	const toast = useMeeting((state) => state.toast);
	const startedAt = useMeeting((state) => state.startedAt);
	const dominantId = useMeeting((state) => state.dominantId);
	const mirror = useMeeting((state) => state.mirror);
	const wantAudio = useMeeting((state) => state.wantAudio);
	const wantVideo = useMeeting((state) => state.wantVideo);
	const toggleAudio = useMeeting((state) => state.toggleAudio);
	const toggleVideo = useMeeting((state) => state.toggleVideo);
	const toggleHand = useMeeting((state) => state.toggleHand);
	const setSharing = useMeeting((state) => state.setSharing);
	const setLayout = useMeeting((state) => state.setLayout);
	const togglePanel = useMeeting((state) => state.togglePanel);
	const closePanel = useMeeting((state) => state.closePanel);
	const setRecording = useMeeting((state) => state.setRecording);
	const setLocked = useMeeting((state) => state.setLocked);
	const showToast = useMeeting((state) => state.showToast);
	const clearToast = useMeeting((state) => state.clearToast);
	const react = useMeeting((state) => state.react);
	const muteAll = useMeeting((state) => state.muteAll);
	const leave = useMeeting((state) => state.leave);
	const pushChat = useMeeting((state) => state.pushChat);
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const [shareStream, setShareStream] = (0, import_react.useState)(null);
	const [confirmEnd, setConfirmEnd] = (0, import_react.useState)(false);
	const handNoted = (0, import_react.useRef)(false);
	const localHand = people.find((person) => person.local)?.hand ?? false;
	useRoomPresence(joined);
	(0, import_react.useEffect)(() => {
		const timer = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(timer);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!toast) return;
		const timer = window.setTimeout(() => clearToast(), 2600);
		return () => window.clearTimeout(timer);
	}, [toast, clearToast]);
	(0, import_react.useEffect)(() => {
		return () => {
			shareStream?.getTracks().forEach((track) => track.stop());
		};
	}, [shareStream]);
	(0, import_react.useEffect)(() => {
		if (!localHand || handNoted.current) return;
		if (!people.some((person) => person.id === "maya")) return;
		handNoted.current = true;
		pushChat({
			fromId: "maya",
			from: "Maya Chen",
			text: "I see your hand — go ahead."
		});
	}, [
		localHand,
		people,
		pushChat
	]);
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			const target = event.target;
			if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) return;
			const key = event.key.toLowerCase();
			if (key === "escape") {
				closePanel();
				setConfirmEnd(false);
				return;
			}
			const action = {
				m: toggleAudio,
				v: toggleVideo,
				c: () => togglePanel("chat"),
				p: () => togglePanel("people"),
				r: toggleHand,
				t: () => setLayout(useMeeting.getState().layout === "tile" ? "speaker" : "tile"),
				s: () => void toggleShare(),
				l: () => void copyInvite()
			}[key];
			if (!action) return;
			event.preventDefault();
			action();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
	function exit() {
		shareStream?.getTracks().forEach((track) => track.stop());
		setShareStream(null);
		setSharing(false);
		leave();
		navigate({ to: "/" });
	}
	async function copyInvite() {
		const url = `${window.location.origin}/meet/${room}`;
		try {
			await navigator.clipboard.writeText(url);
			showToast("Invite link copied");
		} catch {
			showToast(`Share this room: ${room}`);
		}
	}
	async function toggleShare() {
		if (shareStream) {
			shareStream.getTracks().forEach((track) => track.stop());
			setShareStream(null);
			setSharing(false);
			return;
		}
		if (!navigator.mediaDevices?.getDisplayMedia) {
			showToast("Screen share isn't available here");
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: false
			});
			setShareStream(stream);
			setSharing(true);
			stream.getVideoTracks()[0]?.addEventListener("ended", () => {
				setShareStream(null);
				setSharing(false);
			});
		} catch {
			showToast("Screen share was cancelled");
		}
	}
	const sharing = Boolean(shareStream);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "sr-only",
				children: [roomLabel(room), " meeting"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-14 shrink-0 items-center gap-2 border-b border-line px-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						"aria-label": "Leave and go home",
						className: "inline-flex items-center gap-2",
						onClick: () => {
							shareStream?.getTracks().forEach((track) => track.stop());
							leave();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-sm font-medium sm:inline",
							children: "Orbit"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "min-w-0 flex-1 truncate text-center text-sm font-medium capitalize",
						children: roomLabel(room)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2",
						children: [
							recording && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-danger",
								children: "Recording"
							}),
							locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
								className: "size-4 text-muted",
								"aria-label": "Room locked"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm tabular-nums text-muted",
								children: elapsedLabel(startedAt, now)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								"aria-label": "Copy invite link",
								onClick: () => void copyInvite(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalHigh, {
								className: "size-4 text-live",
								"aria-label": "Connection good"
							})
						]
					})
				]
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "pointer-events-none absolute left-1/2 top-16 z-30 -translate-x-1/2 rounded-full border border-strong bg-elevated px-3 py-1.5 text-sm shadow-panel",
				children: toast
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("min-w-0 flex-1 p-3", panel && "hidden sm:block"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stage, {
						layout: sharing ? "speaker" : layout,
						people,
						dominantId,
						stream: media.stream,
						shareStream,
						mirror
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidePanel, { now })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "dock flex shrink-0 items-center justify-center gap-2 px-3 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 max-w-full items-center gap-1 overflow-x-auto rounded-card border border-line bg-elevated p-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButton, {
							label: wantAudio ? "Mute microphone" : "Unmute microphone",
							pressed: wantAudio,
							danger: !wantAudio,
							onClick: toggleAudio,
							children: wantAudio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButton, {
							label: wantVideo ? "Turn camera off" : "Turn camera on",
							pressed: wantVideo,
							danger: !wantVideo,
							onClick: toggleVideo,
							children: wantVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButton, {
							label: sharing ? "Stop sharing" : "Share screen",
							pressed: sharing,
							onClick: () => void toggleShare(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenShare, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButton, {
							label: localHand ? "Lower hand" : "Raise hand",
							pressed: localHand,
							onClick: toggleHand,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hand, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButton, {
								label: "Reactions",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "size-5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
							side: "top",
							sideOffset: 12,
							className: "z-40 flex gap-1 rounded-lg border border-line bg-elevated p-1.5 shadow-panel",
							children: REACTIONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Close, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									"aria-label": item.label,
									onClick: () => react("local", item.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" })
								})
							}, item.id))
						}) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToolButton, {
							label: "Chat",
							pressed: panel === "chat",
							onClick: () => togglePanel("chat"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-5" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-medium text-ink",
								children: unread > 9 ? "9+" : unread
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButton, {
							label: "Participants",
							pressed: panel === "people",
							onClick: () => togglePanel("people"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButton, {
							label: layout === "tile" ? "Speaker view" : "Tile view",
							pressed: layout === "speaker",
							onClick: () => setLayout(layout === "tile" ? "speaker" : "tile"),
							children: layout === "tile" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RectangleHorizontal, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButton, {
								label: "More",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2, {
							side: "top",
							align: "end",
							sideOffset: 12,
							className: "z-40 w-56 rounded-lg border border-line bg-elevated p-1 shadow-panel",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									icon: Settings,
									label: "Settings",
									onClick: () => togglePanel("settings")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									icon: Keyboard,
									label: "Shortcuts",
									onClick: () => togglePanel("shortcuts")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									icon: ChartNoAxesColumn,
									label: "Stats",
									onClick: () => togglePanel("stats")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									icon: Lock,
									label: locked ? "Unlock room" : "Lock room",
									onClick: () => {
										setLocked(!locked);
										showToast(locked ? "Room unlocked" : "Room locked. New guests wait.");
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									icon: Users,
									label: "Mute everyone",
									onClick: muteAll
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									icon: SignalHigh,
									label: recording ? "Stop recording" : "Start recording",
									onClick: () => {
										setRecording(!recording);
										showToast(recording ? "Recording stopped" : "Recording started");
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									icon: PhoneOff,
									label: "End meeting for all",
									danger: true,
									onClick: () => setConfirmEnd(true)
								})
							]
						}) })] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "shrink-0 rounded-card border border-line bg-elevated p-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButton, {
						label: "Leave meeting",
						danger: true,
						onClick: exit,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-5" })
					})
				})]
			}),
			confirmEnd && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-4 sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "end-title",
					className: "w-full max-w-sm rounded-card border border-line bg-elevated p-5 shadow-panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "end-title",
							className: "text-lg font-medium",
							children: "End the meeting?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-normal text-muted",
							children: "Everyone will leave this room, including you."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setConfirmEnd(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: exit,
								children: "End meeting"
							})]
						})
					]
				})
			})
		]
	});
}
function Stage({ layout, people, dominantId, stream, shareStream, mirror }) {
	if (people.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-full place-items-center text-sm text-muted",
		children: "Connecting"
	});
	if (layout === "speaker") {
		const dominant = people.find((person) => person.id === dominantId) ?? people[0];
		const film = shareStream ? people : people.filter((person) => person.id !== dominant.id);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full min-h-0 flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative min-h-0 flex-1",
				children: shareStream ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-full overflow-hidden rounded-lg border-2 border-accent bg-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StreamVideo, { stream: shareStream }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "absolute inset-x-2 bottom-2 rounded-sm bg-bg/80 px-2 py-1 text-sm",
						children: "Your screen"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					person: dominant,
					stream,
					mirror,
					className: "h-full"
				})
			}), film.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-32 shrink-0 gap-2 overflow-x-auto",
				children: film.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					person,
					stream,
					mirror,
					compact: true,
					className: "h-full w-36 shrink-0"
				}, person.id))
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("stage-grid grid h-full gap-2 overflow-y-auto", people.length <= 1 ? "grid-cols-1" : people.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"),
		children: people.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
			person,
			stream,
			mirror,
			className: "h-full"
		}, person.id))
	});
}
function ToolButton({ label, children, onClick, pressed, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		size: "icon",
		variant: danger ? "danger" : pressed ? "primary" : "secondary",
		"aria-label": label,
		"aria-pressed": pressed,
		title: label,
		onClick,
		className: "relative",
		children
	});
}
function MenuItem({ icon: Icon, label, onClick, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Close, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick,
			className: cn("flex h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm", danger ? "text-danger hover:bg-subtle" : "text-fg hover:bg-subtle"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: "size-4",
				"aria-hidden": "true"
			}), label]
		})
	});
}
function MeetPage() {
	const { room } = Route.useParams();
	const joined = useMeeting((state) => state.joined && state.room === room);
	const wantAudio = useMeeting((state) => state.wantAudio);
	const wantVideo = useMeeting((state) => state.wantVideo);
	const hydratePrefs = useMeeting((state) => state.hydratePrefs);
	const media = useLocalMedia(wantAudio, wantVideo);
	(0, import_react.useEffect)(() => {
		const prefs = loadPrefs();
		if (prefs) hydratePrefs(prefs);
	}, [hydratePrefs]);
	(0, import_react.useEffect)(() => {
		const state = useMeeting.getState();
		if (state.joined && state.room !== room) state.leave();
	}, [room]);
	if (!joined) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prejoin, {
		room,
		media
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Room, {
		room,
		media
	});
}
//#endregion
export { MeetPage as component };
