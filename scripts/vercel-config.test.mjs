import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("Vercel deployment enables meeting media capabilities", () => {
  const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
  const headers = config.headers?.flatMap((entry) => entry.headers ?? []) ?? [];
  const policy = headers.find((header) => header.key === "Permissions-Policy")?.value ?? "";

  for (const directive of [
    "camera=(self)",
    "microphone=(self)",
    "display-capture=(self)",
    "fullscreen=(self)",
    "picture-in-picture=(self)",
    "autoplay=(self)",
  ]) {
    assert.match(policy, new RegExp(directive.replace(/[()]/g, "\\$&")));
  }
});
