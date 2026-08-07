import sharp from "sharp";
import fs from "fs";

/**
 * Edge flood-fill cutout with strict near-white background matching.
 * Protects pale product bodies by requiring high similarity to corner color
 * AND low chroma (true studio gray/white), not just any light pixel.
 */
const srcPath = process.argv[2] || "public/skincare-accordion-src.png";
const outPng = process.argv[3] || "public/skincare-accordion.png";
const outWebp = process.argv[4] || "public/skincare-accordion.webp";

const img = sharp(srcPath);
const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;
const N = w * h;

const px = (x, y) => (y * w + x) * 4;

function sample(x, y) {
  const i = px(x, y);
  return [data[i], data[i + 1], data[i + 2]];
}

const cornerSamples = [
  sample(4, 4),
  sample(w - 5, 4),
  sample(4, h - 5),
  sample(w - 5, h - 5),
  sample((w / 2) | 0, 4),
  sample(4, (h / 2) | 0),
  sample(w - 5, (h / 2) | 0),
  sample((w / 2) | 0, h - 5),
];

const bg = cornerSamples
  .reduce((a, c) => [a[0] + c[0], a[1] + c[1], a[2] + c[2]], [0, 0, 0])
  .map((v) => v / cornerSamples.length);

function isBgPixel(i) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const dr = r - bg[0];
  const dg = g - bg[1];
  const db = b - bg[2];
  const dist = Math.sqrt(dr * dr + dg * dg + db * db);
  const maxc = Math.max(r, g, b);
  const minc = Math.min(r, g, b);
  const chroma = maxc - minc;
  // Studio backdrop: very close to corner color, low chroma, high luminance
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return dist <= 28 && chroma <= 14 && lum >= 210;
}

const visited = new Uint8Array(N);
const q = new Int32Array(N);
let qh = 0;
let qt = 0;

function tryPush(x, y) {
  if (x < 0 || y < 0 || x >= w || y >= h) return;
  const id = y * w + x;
  if (visited[id]) return;
  if (!isBgPixel(id * 4)) return;
  visited[id] = 1;
  q[qt++] = id;
}

for (let x = 0; x < w; x++) {
  tryPush(x, 0);
  tryPush(x, h - 1);
}
for (let y = 0; y < h; y++) {
  tryPush(0, y);
  tryPush(w - 1, y);
}

while (qh < qt) {
  const id = q[qh++];
  const x = id % w;
  const y = (id / w) | 0;
  data[id * 4 + 3] = 0;
  tryPush(x + 1, y);
  tryPush(x - 1, y);
  tryPush(x, y + 1);
  tryPush(x, y - 1);
}

// Feather: soften transition on bg-adjacent fringe
for (let y = 1; y < h - 1; y++) {
  for (let x = 1; x < w - 1; x++) {
    const id = y * w + x;
    const i = id * 4;
    if (data[i + 3] === 0) continue;
    let nearT = false;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      if (data[px(x + dx, y + dy) + 3] === 0) {
        nearT = true;
        break;
      }
    }
    if (!nearT) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const dr = r - bg[0];
    const dg = g - bg[1];
    const db = b - bg[2];
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist < 40) {
      data[i + 3] = Math.max(0, Math.min(255, Math.round(((dist - 10) / 30) * 255)));
    }
  }
}

await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(outPng);
await sharp(data, { raw: { width: w, height: h, channels: 4 } })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(outWebp);

let opaque = 0;
let transparent = 0;
for (let i = 3; i < data.length; i += 4) {
  if (data[i] === 0) transparent++;
  else opaque++;
}
console.log(
  JSON.stringify({
    src: srcPath,
    outPng,
    outWebp,
    bg: bg.map((v) => Math.round(v)),
    opaque,
    transparent,
    pctTransparent: ((100 * transparent) / (opaque + transparent)).toFixed(1),
    pngBytes: fs.statSync(outPng).size,
    webpBytes: fs.statSync(outWebp).size,
  }),
);
