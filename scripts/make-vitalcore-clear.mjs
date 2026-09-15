import sharp from "sharp";
import fs from "node:fs";

async function makeClear(src, dest) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 235 && g > 235 && b > 235) data[i + 3] = 0;
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(dest);
  console.log("clear", dest, fs.statSync(dest).size);
}

for (const letter of ["a", "b", "c"]) {
  await makeClear(
    `public/brand/vitalcore-logo-${letter}.png`,
    `public/brand/vitalcore-logo-${letter}-clear.png`,
  );
}
console.log(
  "logos",
  fs.readdirSync("public/brand").filter((f) => f.startsWith("vitalcore")),
);
console.log("refs", fs.readdirSync("public/brand/ref-bottles"));
