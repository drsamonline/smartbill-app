/* RETIRED AS A RETROFIT TEST, LIVE AS A GUARD — 2026-10-28, rewritten 2026-11-09.
 *
 * This file used to assert that both of smartbill-app's exports reach
 * export-kit's Export.save() instead of hand-rolling the Blob ->
 * createObjectURL -> <a download> dance. That was the "retrofit: adopt
 * export-kit" change (e225a6e), and the owner's rule of 2026-10-28 reverses it:
 * kits are one-way, they learn from repositories and are used to build new apps,
 * and a kit is never retrofitted into a repository. There is no exception for a
 * retrofit that would be safe or additive.
 *
 * It then became a file that logged "retired" and exited 0 — a green tick that
 * asserted nothing, which is worse than no test, because the suite reports it as
 * coverage. The rule it was retired for is what is checked here instead: the
 * app's own exports are its own, and nothing in the page loads or calls a kit.
 *
 * The history is the evidence: commits d55428e, 5fde56f, e225a6e, and the repair
 * that replaced this file.
 *
 *   node tests/retrofit-export-kit.test.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.dirname(__dirname);
const pages = ["index.html", path.join("docs", "play", "index.html")];

let failed = 0;
const ok = (name, cond, detail) => {
  if (cond) return console.log("  ok   " + name);
  failed++;
  console.log("  FAIL " + name + (detail ? "  <- " + detail : ""));
};

console.log("\nthe rule: a kit is never retrofitted into this repository");
for (const rel of pages) {
  const file = path.join(root, rel);
  const text = fs.readFileSync(file, "utf8");

  ok(`${rel} loads no kit script`, !/<script[^>]+src=["'][^"']*(?:export-kit|web-kit)/i.test(text));
  ok(`${rel} calls no kit export`, !/\bExport\s*\.\s*save\s*\(/.test(text) && !/\bWebKit\s*\./.test(text));
}

console.log("\nand the app keeps its own implementation");
const app = fs.readFileSync(path.join(root, "index.html"), "utf8");
ok("exportWord builds the Word document itself", /const\s+exportWord\s*=\s*\(\s*\)\s*=>/.test(app));
ok("and downloads it through a Blob", /new\s+Blob\(\s*\[[^\]]*\]\s*,\s*\{\s*type:\s*['"]application\/msword['"]/.test(app));
ok("backup still serialises JSON itself", /new\s+Blob\(\s*\[\s*JSON\.stringify/.test(app));

console.log(failed === 0 ? "\nretrofit guard: OK" : `\n${failed} problem(s) found.`);
process.exit(failed === 0 ? 0 : 1);
