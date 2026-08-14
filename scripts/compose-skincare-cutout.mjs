import sharp from "sharp";
import fs from "fs";

/** Remove near-black studio backdrop from product PNGs. */
async function cutBlackBg(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const visited = new Uint8Array(w * h);
  const q = [];

  const isBg = (i) => data[i] < 28 && data[i + 1] < 28 && data[i + 2] < 28;

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const id = y * w + x;
    if (visited[id]) return;
    if (!isBg(id * 4)) return;
    visited[id] = 1;
    q.push(id);
  };

  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  while (q.length) {
    const id = q.pop();
    data[id * 4 + 3] = 0;
    const x = id % w;
    const y = (id / w) | 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim({
    threshold: 0,
  });
}

async function cutLightBg(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const visited = new Uint8Array(w * h);
  const q = [];
  const bg = [data[0], data[1], data[2]];

  const isBg = (i) => {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const dist = Math.hypot(r - bg[0], g - bg[1], b - bg[2]);
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return dist <= 36 && chroma <= 20 && lum >= 195;
  };

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const id = y * w + x;
    if (visited[id]) return;
    if (!isBg(id * 4)) return;
    visited[id] = 1;
    q.push(id);
  };

  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  while (q.length) {
    const id = q.pop();
    data[id * 4 + 3] = 0;
    const x = id % w;
    const y = (id / w) | 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim({
    threshold: 0,
  });
}

async function makeContactShadow(width, height, strength = 175) {
  const w = Math.max(8, Math.round(width));
  const h = Math.max(4, Math.round(height));
  const raw = Buffer.alloc(w * h * 4);
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  const rx = Math.max(1, w / 2);
  const ry = Math.max(1, h / 2);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      const d = nx * nx + ny * ny;
      const i = (y * w + x) * 4;
      if (d > 1) {
        raw[i + 3] = 0;
        continue;
      }
      const edge = 1 - d;
      raw[i] = 40;
      raw[i + 1] = 32;
      raw[i + 2] = 24;
      raw[i + 3] = Math.round(Math.pow(edge, 1.05) * strength);
    }
  }

  return sharp(raw, { raw: { width: w, height: h, channels: 4 } })
    .blur(2.4)
    .png()
    .toBuffer();
}

const W = 900;
const H = 1208;

const baseSrc =
  process.argv[2] ||
  "C:/Users/qc_la/.cursor/projects/c-Users-qc-la-OneDrive-Qcentrio-Inc-Desktop-Zephyr/assets/packshot-base.png";

// Match herbal/nutra/organic subject scale: tall bottles filling ~1080px of height.
const lotionCut = await (await cutBlackBg("public/skincare/lotion-bottle.png"))
  .resize({ height: 920, fit: "inside" })
  .png()
  .toBuffer();
const creamCut = await (await cutBlackBg("public/skincare/cream-s.svg"))
  .resize({ height: 850, fit: "inside" })
  .png()
  .toBuffer();
const baseCut = await (await cutLightBg(baseSrc))
  .resize({ width: 820, fit: "inside" })
  .png()
  .toBuffer();

const lotionMeta = await sharp(lotionCut).metadata();
const creamMeta = await sharp(creamCut).metadata();
const baseMeta = await sharp(baseCut).metadata();

const lw = lotionMeta.width || 0;
const lh = lotionMeta.height || 0;
const cw = creamMeta.width || 0;
const ch = creamMeta.height || 0;
const bw = baseMeta.width || 0;
const bh = baseMeta.height || 0;

const gap = 40;
const pairWidth = lw + gap + cw;
const pairLeft = Math.round((W - pairWidth) / 2);
const baseLeft = Math.round((W - bw) / 2);

// Keep subject near full frame like other packshots (small top/bottom margins).
const topMargin = 56;
const baseTop = H - bh - 52;
const seatY = baseTop + Math.round(bh * 0.46);
const plant = 42;

const lotionLeft = pairLeft;
const creamLeft = pairLeft + lw + gap;
const lotionTop = Math.min(seatY - lh + plant, topMargin + 20);
const creamTop = Math.min(seatY - ch + plant, topMargin + 60);

// If products still leave a gap above the base, pull them down to the seat.
const lotionTopFinal = Math.max(lotionTop, seatY - lh + plant);
const creamTopFinal = Math.max(creamTop, seatY - ch + plant);

const lotionShadow = await makeContactShadow(lw * 1.05, Math.max(48, bh * 0.4));
const creamShadow = await makeContactShadow(cw * 1.0, Math.max(46, bh * 0.38));
const lotionContact = await makeContactShadow(lw * 0.55, Math.max(20, bh * 0.14), 200);
const creamContact = await makeContactShadow(cw * 0.52, Math.max(18, bh * 0.13), 200);

const lotionShadowMeta = await sharp(lotionShadow).metadata();
const creamShadowMeta = await sharp(creamShadow).metadata();
const lotionContactMeta = await sharp(lotionContact).metadata();
const creamContactMeta = await sharp(creamContact).metadata();

const productBottom = Math.max(lotionTopFinal + lh, creamTopFinal + ch);
const lotionShadowLeft = Math.round(lotionLeft + (lw - (lotionShadowMeta.width || 0)) / 2);
const creamShadowLeft = Math.round(creamLeft + (cw - (creamShadowMeta.width || 0)) / 2);
const lotionContactLeft = Math.round(lotionLeft + (lw - (lotionContactMeta.width || 0)) / 2);
const creamContactLeft = Math.round(creamLeft + (cw - (creamContactMeta.width || 0)) / 2);
const lotionShadowTop = productBottom - Math.round((lotionShadowMeta.height || 0) * 0.62);
const creamShadowTop = productBottom - Math.round((creamShadowMeta.height || 0) * 0.62);
const lotionContactTop = productBottom - Math.round((lotionContactMeta.height || 0) * 0.75);
const creamContactTop = productBottom - Math.round((creamContactMeta.height || 0) * 0.75);

const composed = await sharp({
  create: {
    width: W,
    height: H,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    { input: baseCut, left: baseLeft, top: baseTop },
    { input: lotionShadow, left: lotionShadowLeft, top: lotionShadowTop },
    { input: creamShadow, left: creamShadowLeft, top: creamShadowTop },
    { input: lotionContact, left: lotionContactLeft, top: lotionContactTop },
    { input: creamContact, left: creamContactLeft, top: creamContactTop },
    { input: lotionCut, left: lotionLeft, top: lotionTopFinal },
    { input: creamCut, left: creamLeft, top: creamTopFinal },
  ])
  .png()
  .toBuffer();

// Trim empty margins, then scale content to match herbal fill (~840x1088 on 900x1208).
const trimmed = await sharp(composed).trim({ threshold: 0 }).png().toBuffer();
const trimmedMeta = await sharp(trimmed).metadata();

const targetContentH = 1088;
const targetContentW = 840;
const scale = Math.min(
  targetContentW / (trimmedMeta.width || 1),
  targetContentH / (trimmedMeta.height || 1),
);
const scaledW = Math.round((trimmedMeta.width || 1) * scale);
const scaledH = Math.round((trimmedMeta.height || 1) * scale);

const scaled = await sharp(trimmed)
  .resize({ width: scaledW, height: scaledH, fit: "fill" })
  .png()
  .toBuffer();

const left = Math.round((W - scaledW) / 2);
const top = Math.round((H - scaledH) / 2) - 10;

const out = await sharp({
  create: {
    width: W,
    height: H,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: scaled, left, top: Math.max(40, top) }])
  .png()
  .toBuffer();

await sharp(out).png().toFile("public/skincare-accordion.png");
await sharp(out)
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile("public/skincare-accordion.webp");

const { data, info } = await sharp(out).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let minX = info.width;
let minY = info.height;
let maxX = 0;
let maxY = 0;
let opaque = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const a = data[(y * info.width + x) * 4 + 3];
    if (a > 8) {
      opaque++;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(
  JSON.stringify({
    canvas: `${info.width}x${info.height}`,
    content: `${maxX - minX + 1}x${maxY - minY + 1}`,
    fill: `${((100 * opaque) / (info.width * info.height)).toFixed(1)}%`,
    ySpan: `${minY}-${maxY}`,
    png: fs.statSync("public/skincare-accordion.png").size,
    webp: fs.statSync("public/skincare-accordion.webp").size,
  }),
);
