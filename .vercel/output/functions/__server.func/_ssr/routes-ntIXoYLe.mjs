import { i as __toESM } from "../_runtime.mjs";
import { i as roomLabel, n as loadRecent, o as slugify, r as rememberRoom } from "./rooms-Bv8qP-ir.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { h as Mic, m as PhoneOff, n as Video } from "../_libs/lucide-react.mjs";
import { c as initials, n as Eq, o as Wordmark, t as Button } from "./tile-B0ev4VGX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-ntIXoYLe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PREVIEW = [
	{
		name: "Maya Chen",
		speaking: true
	},
	{
		name: "Leo Okonkwo",
		speaking: false
	},
	{
		name: "Priya Shah",
		speaking: false
	},
	{
		name: "You",
		speaking: false
	}
];
function WelcomePage() {
	const navigate = useNavigate();
	const [draft, setDraft] = (0, import_react.useState)("");
	const [recent, setRecent] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setRecent(loadRecent());
	}, []);
	function start(raw) {
		const slug = slugify(raw);
		setRecent(rememberRoom(slug));
		navigate({
			to: "/meet/$room",
			params: { room: slug }
		});
	}
	function onSubmit(event) {
		event.preventDefault();
		start(draft);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-16 items-center justify-between border-b border-line px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden text-sm text-muted sm:block",
					children: "No account required"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid w-full max-w-6xl gap-10 px-5 py-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-muted",
						children: "Video meetings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 max-w-xl text-3xl font-medium tracking-tight text-fg sm:text-4xl",
						children: "Secure, high-quality meetings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-lg text-base leading-normal text-muted",
						children: "Start a room, share the name, and meet in the browser. No account and no install. You moderate what you start."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-8 rounded-card border border-line bg-elevated p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "meeting-name",
								className: "text-sm font-medium text-fg",
								children: "Meeting name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "meeting-name",
								value: draft,
								onChange: (event) => setDraft(event.target.value),
								placeholder: "design-review",
								autoComplete: "off",
								className: "mt-2 h-12 w-full rounded-md border border-strong bg-bg px-3 text-base text-fg outline-none placeholder:text-faint"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "primary",
								size: "lg",
								className: "mt-3 w-full",
								children: "Start meeting"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-faint",
								children: "Leave it blank and a name is chosen for you. You are the only moderator."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8",
						"aria-labelledby": "recent-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "recent-heading",
							className: "text-sm font-medium text-muted",
							children: "Recent"
						}), recent === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-faint",
							children: "Loading recent rooms"
						}) : recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-md text-sm leading-normal text-muted",
							children: "No recent rooms yet. Start one and it stays on this device."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 divide-y divide-line border-y border-line",
							children: recent.map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-medium capitalize",
										children: roomLabel(room.slug)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm text-faint",
										children: room.slug
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									onClick: () => start(room.slug),
									children: "Join"
								})]
							}, room.slug))
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "hidden lg:block",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-card border border-line bg-elevated p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center justify-between px-1 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "design-review" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: "12:04"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: PREVIEW.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `relative flex h-36 items-center justify-center rounded-lg border-2 bg-subtle ${person.speaking ? "border-accent" : "border-transparent"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-2xl font-medium",
											children: initials(person.name === "You" ? "Alex Morgan" : person.name)
										}),
										person.speaking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute right-2 top-2 rounded-sm bg-bg/80 px-1.5 py-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eq, {})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute inset-x-2 bottom-2 truncate rounded-sm bg-bg/80 px-2 py-1 text-sm",
											children: person.name
										})
									]
								}, person.name))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex justify-center gap-2 text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex size-10 items-center justify-center rounded-full bg-subtle",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex size-10 items-center justify-center rounded-full bg-subtle",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex size-10 items-center justify-center rounded-full bg-danger text-danger-fg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-4" })
									})
								]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto grid w-full max-w-6xl gap-px bg-line px-5 pb-16 sm:grid-cols-3",
				children: [
					["No account", "Join with a display name. The room name is the invite."],
					["You run the room", "Mute everyone, hold guests in the lobby, or end it when you're done."],
					["Familiar controls", "Mic, camera, screen share, chat, raise hand, and tile view."]
				].map(([title, copy]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bg py-5 sm:px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium text-fg",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-normal text-muted",
						children: copy
					})]
				}, title))
			})
		]
	});
}
var SplitComponent = WelcomePage;
//#endregion
export { SplitComponent as component };
