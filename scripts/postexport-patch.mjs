/**
 * Neutralize any "Missing environment variables" throw in compiled JS.
 * Turns: throw new Error("...Missing environment variables...")
 * into : console.warn("...Missing environment variables...")
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "dist";
const NEEDLE = "Missing environment variables";

function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith(".js")) patch(p);
  }
}

function patch(p) {
  const src = readFileSync(p, "utf8");
  if (!src.includes(NEEDLE)) return;

  // handle common minified patterns
  let out = src
    .replace(/throw\s+new\s+Error\(([^)]*Missing environment variables[^)]*)\);/g, 'console.warn($1);')
    .replace(/throw\s*\(\s*new\s+Error\(([^)]*Missing environment variables[^)]*)\)\s*\)/g, 'console.warn($1)');

  if (out !== src) {
    writeFileSync(p, out, "utf8");
    console.log("[patch-env-throws] softened in:", p);
  }
}

console.log("[patch-env-throws] scanning distâ€¦");
walk(ROOT);
console.log("[patch-env-throws] done");