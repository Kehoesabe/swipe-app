import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
const ROOT = process.cwd();
const REQUIRED = [
  ".cursorrules",
  "DEVELOPMENT-WORKFLOW.md",
  "SECURITY-GUIDELINES.md",
  "TESTING-GUIDELINES.md",
];

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (/node_modules|\.git|\.next|dist|build|coverage|\.turbo|\.vercel|\.cache|\.venv/i.test(p)) return [];
      return walk(p);
    }
    return p.endsWith(".md") || p.endsWith(".mdx") ? [p] : [];
  });
}

const missing = REQUIRED.filter((f) => {
  try { readFileSync(join(ROOT, f), "utf8"); return false; }
  catch { return true; }
});

const md = walk(ROOT);
const deprecated = md
  .filter((p) =>
    /(docs\/AGENT\.md$|(^|\/)CONTRIBUTING\.md$|PRE_?FLIGHT_?CHECK\.md$)/i.test(p)
  )
  .filter((p) => !/DEPRECATED/i.test(readFileSync(p, "utf8")));

if (missing.length || deprecated.length) {
  console.error("Guardrails check failed:");
  if (missing.length) console.error("- Missing:", missing.join(", "));
  if (deprecated.length) console.error("- Deprecated files missing banner:\n  " + deprecated.join("\n  "));
  process.exit(1);
}