import test from "node:test";
import assert from "node:assert/strict";
import { passesThrough } from "./jitsi-brand.mjs";

test("Orbit prejoin routes are not swallowed by the Jitsi HTML middleware", () => {
  assert.equal(passesThrough("/meet"), true);
  assert.equal(passesThrough("/meet/design-review"), true);
});

test("real single-segment room paths are still handled by Jitsi", () => {
  assert.equal(passesThrough("/design-review"), false);
});
