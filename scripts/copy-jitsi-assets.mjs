import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "vendor/jitsi");
const functionsRoot = join(root, ".vercel/output/functions");

if (!existsSync(join(src, "index.html")) || !existsSync(join(src, "orbit-translator.js"))) {
  throw new Error("[jitsi-assets] vendor/jitsi is incomplete");
}

if (!existsSync(functionsRoot)) {
  throw new Error(
    "[jitsi-assets] Vercel function output was not generated. Ensure Nitro uses the Vercel preset.",
  );
}

const functionDirs = readdirSync(functionsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.endsWith(".func"))
  .map((entry) => join(functionsRoot, entry.name));

const serverFunction =
  functionDirs.find((dir) => existsSync(join(dir, "index.mjs"))) ??
  functionDirs.find((dir) => /server/i.test(dir));

if (!serverFunction) {
  throw new Error("[jitsi-assets] Could not locate the Nitro server function in .vercel/output/functions");
}

const dest = join(serverFunction, "vendor/jitsi");
mkdirSync(dirname(dest), { recursive: true });
cpSync(src, dest, { recursive: true });

for (const required of ["index.html", "orbit-translator.js", "lang/main-en.json"]) {
  if (!existsSync(join(dest, required))) {
    throw new Error(`[jitsi-assets] Missing copied asset: ${required}`);
  }
}

console.log(`[jitsi-assets] copied vendor/jitsi -> ${dest}`);
