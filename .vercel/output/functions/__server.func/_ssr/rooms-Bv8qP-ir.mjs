//#region node_modules/.nitro/vite/services/ssr/assets/rooms-Bv8qP-ir.js
var PREFS_KEY = "orbit-meeting-prefs";
var RECENT_KEY = "orbit-meeting-recent";
var LEFT = [
	"quiet",
	"north",
	"glass",
	"cedar",
	"plain",
	"inner",
	"clear",
	"late",
	"open",
	"silver"
];
var RIGHT = [
	"harbor",
	"ledger",
	"archive",
	"studio",
	"table",
	"brief",
	"forum",
	"hall",
	"desk",
	"room"
];
function randomRoom() {
	return `${LEFT[Math.floor(Math.random() * LEFT.length)]}-${RIGHT[Math.floor(Math.random() * RIGHT.length)]}`;
}
function slugify(input) {
	return input.trim().toLowerCase().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || randomRoom();
}
function roomLabel(slug) {
	return slug.replace(/-/g, " ");
}
function loadPrefs() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(PREFS_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed.name !== "string") return null;
		return {
			name: parsed.name.slice(0, 40) || "Guest",
			audio: parsed.audio !== false,
			video: parsed.video !== false,
			mirror: parsed.mirror !== false
		};
	} catch {
		return null;
	}
}
function savePrefs(prefs) {
	if (typeof window === "undefined") return;
	localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}
function loadRecent() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(RECENT_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((item) => item && typeof item.slug === "string").slice(0, 5);
	} catch {
		return [];
	}
}
function rememberRoom(slug) {
	const next = [{
		slug,
		at: Date.now()
	}, ...loadRecent().filter((item) => item.slug !== slug)].slice(0, 5);
	localStorage.setItem(RECENT_KEY, JSON.stringify(next));
	return next;
}
//#endregion
export { savePrefs as a, roomLabel as i, loadRecent as n, slugify as o, rememberRoom as r, loadPrefs as t };
