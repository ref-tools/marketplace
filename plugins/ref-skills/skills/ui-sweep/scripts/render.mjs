#!/usr/bin/env node
/**
 * Turn shot manifests into per-shot markdown blocks.
 *
 * Usage:
 *   node scripts/render.mjs <captures-root> [media.json] > shots.md
 *
 * Walks <captures-root>/* /manifest.json. If media.json maps basename → { mediaId },
 * emits ![title](ref-media://mediaId); otherwise a local-path placeholder.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.argv[2];
const mediaPath = process.argv[3];
if (!root) {
  console.error("usage: node scripts/render.mjs <captures-root> [media.json]");
  process.exit(2);
}

let media = {};
if (mediaPath) {
  media = JSON.parse(await readFile(mediaPath, "utf8"));
}

const groups = (await readdir(root, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const blocks = [];

for (const group of groups) {
  const manifestPath = path.join(root, group, "manifest.json");
  let shots;
  try {
    shots = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    continue;
  }
  if (!Array.isArray(shots)) continue;

  for (const shot of shots) {
    const entry = media[shot.file] || media[path.basename(shot.file)];
    const img = entry?.mediaId
      ? `![${shot.title}](ref-media://${entry.mediaId})`
      : `![${shot.title}](${path.join(root, group, shot.file)})`;
    const bugs =
      Array.isArray(shot.bugs) && shot.bugs.length
        ? shot.bugs
            .map(
              (b) =>
                `- **${b.severity}**: ${b.repro} → \`${b.suspectedFile}\` — ${b.fixProposal}`,
            )
            .join("\n")
        : "_none_";
    blocks.push(
      [
        `### ${shot.title}`,
        "",
        img,
        "",
        `${shot.description} · \`${shot.viewport}\` · ${shot.area} / ${shot.state}`,
        "",
        "Bugs:",
        bugs,
        "",
        `<!-- group:${group} file:${shot.file} area:${shot.area} -->`,
        "",
      ].join("\n"),
    );
  }
}

process.stdout.write(blocks.join("\n"));
