import sharp from "sharp";
import fs from "fs";
import path from "path";
import os from "os";

const assets =
  "C:/Users/qc_la/.cursor/projects/c-Users-qc-la-OneDrive-Qcentrio-Inc-Desktop-Zephyr/assets";
const outDir =
  "C:/Users/qc_la/OneDrive - Qcentrio Inc/Desktop/Zephyr/public/homepage";
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "explore-labels-"));

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function toWebp(src, destName) {
  const tmpFile = path.join(tmp, destName);
  await sharp(src)
    .resize(1024, 1024, { fit: "cover", position: "centre" })
    .webp({ quality: 88 })
    .toFile(tmpFile);
  const dest = path.join(outDir, destName);
  for (let i = 0; i < 8; i++) {
    try {
      fs.copyFileSync(tmpFile, dest);
      console.log("OK", destName);
      return;
    } catch {
      await sleep(400 * (i + 1));
    }
  }
  console.log("FAIL", destName);
}

// Fix Nutra misspelling by covering the bad word and overlaying correct text
const nutraSrc = path.join(assets, "explore-nutra-label-v6.png");
const meta = await sharp(nutraSrc).metadata();
const w = meta.width;
const h = meta.height;

// Cream patch + correct word over the misspelled area (approx lower half of label circle)
const overlaySvg = Buffer.from(`
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect x="${Math.round(w * 0.28)}" y="${Math.round(h * 0.48)}" width="${Math.round(w * 0.44)}" height="${Math.round(h * 0.12)}" rx="8" fill="#F4F7F6"/>
  <text x="${Math.round(w * 0.5)}" y="${Math.round(h * 0.565)}"
    text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
    font-size="${Math.round(w * 0.045)}" font-weight="700" fill="#1A7A7A"
    letter-spacing="0.5">Nutraceutical</text>
</svg>`);

const nutraFixed = path.join(tmp, "nutra-fixed.png");
await sharp(nutraSrc)
  .composite([{ input: overlaySvg, top: 0, left: 0 }])
  .png()
  .toFile(nutraFixed);

await toWebp(path.join(assets, "explore-herb-label-v2.png"), "herbal.webp");
await toWebp(nutraFixed, "nuetra.webp");
await toWebp(path.join(assets, "explore-organic-label-v2.png"), "organic.webp");
