import sharp from "sharp";
import fs from "fs";
import path from "path";
import os from "os";

const brandLogo =
  "C:/Users/qc_la/OneDrive - Qcentrio Inc/Desktop/Zephyr/public/brand/vitalcore-logo-clear.png";
const src =
  "C:/Users/qc_la/.cursor/projects/c-Users-qc-la-OneDrive-Qcentrio-Inc-Desktop-Zephyr/assets/explore-herb-blank-logo.png";
const outDir =
  "C:/Users/qc_la/OneDrive - Qcentrio Inc/Desktop/Zephyr/public/homepage";
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "herb-logo-"));

const meta = await sharp(src).metadata();
const W = meta.width;
const H = meta.height;

const { data } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
let r = 0,
  g = 0,
  b = 0,
  n = 0;
for (let y = Math.floor(H * 0.34); y < Math.floor(H * 0.38); y++) {
  for (let x = Math.floor(W * 0.55); x < Math.floor(W * 0.62); x++) {
    const i = (y * W + x) * 4;
    if (data[i + 3] > 200 && data[i] + data[i + 1] + data[i + 2] > 500) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      n++;
    }
  }
}
const fill = n
  ? `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`
  : "#F7F4EC";
console.log("sampled cream", fill, "n", n);

const patchX = Math.round(W * 0.31);
const patchY = Math.round(H * 0.305);
const patchW = Math.round(W * 0.38);
const patchH = Math.round(H * 0.11);
const patchSvg = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><rect x="${patchX}" y="${patchY}" width="${patchW}" height="${patchH}" rx="18" fill="${fill}"/></svg>`,
);

const logoBuf = await sharp(brandLogo)
  .resize({ width: Math.round(W * 0.27) })
  .png()
  .toBuffer();
const lm = await sharp(logoBuf).metadata();
const logoX = Math.round((W - lm.width) / 2);
const logoY = Math.round(H * 0.315);

const composed = path.join(tmp, "herb.png");
await sharp(src)
  .composite([
    { input: patchSvg, top: 0, left: 0 },
    { input: logoBuf, top: logoY, left: logoX },
  ])
  .png()
  .toFile(composed);

const webpTmp = path.join(tmp, "herbal.webp");
await sharp(composed)
  .resize(1024, 1024, { fit: "cover", position: "centre" })
  .webp({ quality: 88 })
  .toFile(webpTmp);
fs.copyFileSync(webpTmp, path.join(outDir, "herbal.webp"));
console.log("OK herbal.webp");
