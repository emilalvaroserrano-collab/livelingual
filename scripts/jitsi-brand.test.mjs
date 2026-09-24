import test from "node:test";
import assert from "node:assert/strict";
import { handleJitsiRequest, passesThrough } from "./jitsi-brand.mjs";

test("Orbit prejoin routes are not swallowed by the Jitsi HTML middleware", () => {
  assert.equal(passesThrough("/meet"), true);
  assert.equal(passesThrough("/meet/design-review"), true);
});

test("real single-segment room paths are still handled by Jitsi", () => {
  assert.equal(passesThrough("/design-review"), false);
});


test("serves the Orbit translator client without embedding a permanent API key", async () => {
  const result = await handleJitsiRequest("/orbit-translator.js", "GET", "*/*");
  assert.equal(result?.status, 200);
  assert.match(String(result?.headers?.["content-type"]), /javascript/);
  const source = result?.body?.toString("utf8") ?? "";
  assert.match(source, /orbit-translator/);
  assert.match(source, /gemini-3\.5-live-translate-preview/);
  assert.doesNotMatch(source, /GEMINI_API_KEY/);
  assert.doesNotMatch(source, /x-goog-api-key/);
});
