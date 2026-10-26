#!/usr/bin/env node
/**
 * Regroup rendered shot markdown into collapsed sections by UI element.
 *
 * Usage:
 *   node scripts/regroup.mjs shots.md map.json > catalog-body.md
 *
 * map.json:
 *   {
 *     "Look at these": ["settings-billing-empty.png", …],
 *     "Billing settings": ["settings-billing-empty.png", "settings-billing-ok.png"],
 *     "Checkout": ["…"]
 *   }
 *
 * Shot blocks in shots.md must carry `<!-- group:… file:… area:… -->`.
 * "Look at these" (if present in the map) is emitted first; other keys become
 * :::collapse sections with an "N screens — states covered" header.
 */
import { readFile } from "node:fs/promises";

const shotsPath = process.argv[2];
const mapPath = process.argv[3];
if (!shotsPath || !mapPath) {
  console.error("usage: node scripts/regroup.mjs shots.md map.json");
  process.exit(2);
}

const raw = await readFile(shotsPath, "utf8");
const map = JSON.parse(await readFile(mapPath, "utf8"));

/** @type {Map<string, string>} */
const byFile = new Map();
const parts = raw.split(/(?=^### )/m).filter(Boolean);
for (const part of parts) {
  const m = part.match(/<!--\s*group:\S+\s+file:(\S+)\s+area:[^\s>]+\s*-->/);
  if (m) byFile.set(m[1], part.trim());
}

function blocksFor(files) {
  return (files || [])
    .map((f) => byFile.get(f))
    .filter(Boolean)
    .join("\n\n");
}

const keys = Object.keys(map);
const lookKey = keys.find((k) => /^look at these$/i.test(k));
const out = [];

if (lookKey) {
  out.push("## Look at these", "", blocksFor(map[lookKey]), "");
}

for (const key of keys) {
  if (key === lookKey) continue;
  const files = map[key] || [];
  const body = blocksFor(files);
  const n = files.filter((f) => byFile.has(f)).length;
  const states = [
    ...new Set(
      files
        .map((f) => {
          const b = byFile.get(f);
          const m = b?.match(/·\s*`[^`]+`\s*·\s*[^/]+\/\s*([^\n]+)/);
          return m?.[1]?.trim();
        })
        .filter(Boolean),
    ),
  ];
  out.push(
    ":::collapse",
    `### ${key} — ${n} screens — states covered: ${states.join(", ") || "see shots"}`,
    ":::",
    "",
    body,
    "",
    ":::end",
    "",
  );
}

process.stdout.write(out.join("\n"));
