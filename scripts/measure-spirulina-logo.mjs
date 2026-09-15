import sharp from "sharp";
import fs from "fs";
import path from "path";

const assets =
  process.env.USERPROFILE +
  "/.cursor/projects/c-Users-qc-la-OneDrive-Qcentrio-Inc-Desktop-Zephyr/assets";
const spirulina = path.join(assets, "organic-v4-17-spirulina-b.png");

const { data, info } = await sharp(spirulina)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;

for (let yp = 0.16; yp <= 0.23; yp += 0.01) {
  const row = [];
  for (let xp = 0.32; xp <= 0.68; xp += 0.04) {
    const x = Math.floor(w * xp);
    const y = Math.floor(h * yp);
    const i = (y * w + x) * 4;
    row.push(`${data[i]},${data[i + 1]},${data[i + 2]}`);
  }
  console.log(yp.toFixed(2), row.join(" | "));
}

// Find non-cream pixels in logo band (cream is ~190-200)
let minX = w,
  maxX = 0,
  minY = h,
  maxY = 0,
  count = 0;
for (let y = Math.floor(h * 0.165); y < Math.floor(h * 0.225); y++) {
  for (let x = Math.floor(w * 0.3); x < Math.floor(w * 0.7); x++) {
    const i = (y * w + x) * 4;
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const lum = (r + g + b) / 3;
    // not cream/white background of label
    if (lum < 170 && Math.abs(r - g) < 80) {
      count++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log({
  count,
  minX,
  maxX,
  minY,
  maxY,
  logoW: maxX - minX + 1,
  logoH: maxY - minY + 1,
  ratioW: (maxX - minX + 1) / w,
  top: minY / h,
});
