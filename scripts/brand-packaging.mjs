/**
 * One-off script: composite Zephyr logo onto packaging / dosage studio shots.
 * Run: node scripts/brand-packaging.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcDir = path.join(root, "public", "Homepage", "production");
const outDir = path.join(srcDir, "branded");
const logoPath = path.join(root, "public", "Global", "Logo.png");

fs.mkdirSync(outDir, { recursive: true });

async function transparentLogo() {
  const { data, info } = await sharp(logoPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Knock out near-black studio background
    if (r < 45 && g < 45 && b < 45) {
      data[i + 3] = 0;
    }
  }

  return sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

/** @type {Record<string, { widthRatio: number; topRatio: number }>} */
const placements = {
  // Packaging
  "jar.png": { widthRatio: 0.42, topRatio: 0.38 },
  "pack-sachet.png": { widthRatio: 0.36, topRatio: 0.36 },
  "blister.png": { widthRatio: 0.34, topRatio: 0.28 },
  "bulk.png": { widthRatio: 0.4, topRatio: 0.36 },
  "bottle.png": { widthRatio: 0.4, topRatio: 0.38 },
  "alu-alu.png": { widthRatio: 0.28, topRatio: 0.34 },
  "stick-pack.png": { widthRatio: 0.26, topRatio: 0.4 },
  // Dosage formats (subtler corner / center mark)
  "tablet.png": { widthRatio: 0.28, topRatio: 0.72 },
  "capsule.png": { widthRatio: 0.28, topRatio: 0.72 },
  "sachet.png": { widthRatio: 0.3, topRatio: 0.68 },
  "powder.png": { widthRatio: 0.28, topRatio: 0.7 },
  "gummy.png": { widthRatio: 0.28, topRatio: 0.7 },
  "jelly.png": { widthRatio: 0.28, topRatio: 0.7 },
};

async function brandOne(file, logoBase) {
  const input = path.join(srcDir, file);
  if (!fs.existsSync(input)) {
    console.warn("skip missing", file);
    return;
  }

  const meta = await sharp(input).metadata();
  const w = meta.width ?? 1024;
  const h = meta.height ?? 1024;
  const cfg = placements[file] ?? { widthRatio: 0.32, topRatio: 0.4 };
  const logoW = Math.round(w * cfg.widthRatio);
  const logoBuf = await logoBase
    .clone()
    .resize({ width: logoW, withoutEnlargement: false })
    .png()
    .toBuffer();
  const logoMeta = await sharp(logoBuf).metadata();
  const logoH = logoMeta.height ?? Math.round(logoW * 0.35);
  const left = Math.max(0, Math.round((w - logoW) / 2));
  const top = Math.max(0, Math.min(h - logoH, Math.round(h * cfg.topRatio)));

  await sharp(input)
    .composite([{ input: logoBuf, left, top, blend: "over" }])
    .png()
    .toFile(path.join(outDir, file));

  console.log("branded", file, `${logoW}x${logoH}@(${left},${top})`);
}

async function main() {
  const logoBase = await transparentLogo();
  // Cache a png buffer pipeline we can clone via re-read
  const logoPngPath = path.join(outDir, "_logo-cutout.png");
  await logoBase.toFile(logoPngPath);

  for (const file of Object.keys(placements)) {
    const logo = sharp(logoPngPath);
    await brandOne(file, logo);
  }

  console.log("done →", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
