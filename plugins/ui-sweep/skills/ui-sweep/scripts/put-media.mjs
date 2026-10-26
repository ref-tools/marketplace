#!/usr/bin/env node
/**
 * PUT local files to signed upload URLs from Ref Media `upload`, then write media.json.
 *
 * Usage:
 *   node scripts/put-media.mjs uploads.json
 *
 * uploads.json shape:
 *   [
 *     {
 *       "mediaId": "…",
 *       "file": "/abs/path/to/shot.png",
 *       "uploadUrl": "https://…",
 *       "contentType": "image/png",
 *       "contentLengthRange": "0,10485760"   // optional; sent as x-goog-content-length-range
 *     }
 *   ]
 *
 * Writes media.json next to uploads.json:
 *   { "<file basename or mediaId>": { "mediaId", "file", "ok", "status" }, … }
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("usage: node scripts/put-media.mjs uploads.json");
  process.exit(2);
}

const uploads = JSON.parse(await readFile(inputPath, "utf8"));
if (!Array.isArray(uploads)) {
  console.error("uploads.json must be an array");
  process.exit(2);
}

const media = {};

for (const item of uploads) {
  const { mediaId, file, uploadUrl, contentType, contentLengthRange } = item;
  if (!mediaId || !file || !uploadUrl) {
    throw new Error(`missing mediaId/file/uploadUrl in ${JSON.stringify(item)}`);
  }
  const body = await readFile(file);
  const headers = {
    "content-type": contentType || "application/octet-stream",
  };
  if (contentLengthRange) {
    headers["x-goog-content-length-range"] = contentLengthRange;
  }
  headers["content-length"] = String(body.byteLength);

  const res = await fetch(uploadUrl, { method: "PUT", headers, body });
  const key = path.basename(file);
  media[key] = {
    mediaId,
    file,
    ok: res.ok,
    status: res.status,
  };
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`PUT failed ${res.status} for ${file}: ${text.slice(0, 200)}`);
  } else {
    console.log(`uploaded ${key} → ${mediaId}`);
  }
}

const outPath = path.join(path.dirname(path.resolve(inputPath)), "media.json");
await writeFile(outPath, JSON.stringify(media, null, 2) + "\n", "utf8");
console.log(`wrote ${outPath}`);
