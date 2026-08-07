import sharp from "sharp";

const { data, info } = await sharp("public/skincare-accordion.webp")
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const w = info.width;
const h = info.height;
const px = (x, y) => (y * w + x) * 4;

for (let y = 200; y < h; y += 150) {
  const parts = [];
  for (let x = 200; x < w - 200; x += 150) {
    const i = px(x, y);
    parts.push(`(${x},${y}) a=${data[i + 3]} rgb=${data[i]},${data[i + 1]},${data[i + 2]}`);
  }
  console.log(parts.join(" | "));
}
