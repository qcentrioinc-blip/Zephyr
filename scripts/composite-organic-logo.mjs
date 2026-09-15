/**
 * Composite exact teal Zephyr logo onto Organic-review product images.
 * Usage:
 *   node scripts/composite-organic-logo.mjs
 *   node scripts/composite-organic-logo.mjs --from-assets organic-v2-*.png
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const assetsDir =
  process.env.CURSOR_ASSETS ||
  path.join(
    process.env.USERPROFILE || "",
    ".cursor/projects/c-Users-qc-la-OneDrive-Qcentrio-Inc-Desktop-Zephyr/assets",
  );

const logoClear = path.join(root, "public/brand/zephyr-logo-organic-clear.png");
const briefs = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/organic-image-briefs.json"), "utf8"),
);

const STEM_TO_ID = {
  "organic-v2-elderberry": 14,
  "organic-v2-elderberry-b": 14,
  "organic-v2-spirulina": 17,
  "organic-v2-wheatgrass": 16,
  "organic-v2-pomegranate": 15,
  "organic-v2-iron": 21,
  "organic-v2-kalmegh": 48,
  "organic-01-cissus": 1,
  "organic-02-cats-claw": 2,
  "organic-03-rosehip": 3,
  "organic-04-guggul": 4,
  "organic-05-burdock": 5,
  "organic-06-astragalus": 6,
  "organic-07-neem": 7,
  "organic-08-ginseng": 8,
  "organic-09-curcumin": 9,
  "organic-10-manjistha-stem": 10,
  "organic-11-aloe": 11,
  "organic-12-amla": 12,
  "organic-13-orange": 13,
  "organic-18-punarnava": 18,
  "organic-19-horsetail-herb": 19,
  "organic-20-manjistha": 20,
  "organic-22-folic": 22,
  "organic-23-folic-iron": 23,
  "organic-24-vitamin-b": 24,
  "organic-25-horse-chestnut": 25,
  "organic-26-aronia": 26,
  "organic-27-arjuna": 27,
  "organic-28-fenugreek": 28,
  "organic-29-gingko": 29,
  "organic-30-rosemary": 30,
  "organic-31-bacopa": 31,
  "organic-32-shatavari": 32,
  "organic-33-gokshuru": 33,
  "organic-34-ashoka": 34,
  "organic-35-ashwagandha-root": 35,
  "organic-36-muira": 36,
  "organic-37-shilajit": 37,
  "organic-38-bitter-melon": 38,
  "organic-39-chitrak": 39,
  "organic-40-prickly-pear": 40,
  "organic-41-gymnema-leaf": 41,
  "organic-42-milk-thistle": 42,
  "organic-43-kutki": 43,
  "organic-44-milk-thistle-artichoke": 44,
  "organic-45-evening-primrose": 45,
  "organic-46-flaxseed": 46,
  "organic-47-motherwort": 47,
  "organic-49-ginger": 49,
  "organic-50-kalmegh-pippali": 50,
  "organic-51-goji": 51,
  "organic-52-fennel": 52,
};

// v3 amber-packer regen stems
for (let id = 1; id <= 52; id++) {
  STEM_TO_ID[`organic-v3-${String(id).padStart(2, "0")}`] = id;
}

async function ensureClearLogo() {
  if (fs.existsSync(logoClear)) return;
  const src = path.join(root, "public/brand/zephyr-logo-organic.png");
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] < 40 && data[i + 1] < 40 && data[i + 2] < 40) data[i + 3] = 0;
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(logoClear);
}

export async function compositeOnto(inPath, outPath) {
  const meta = await sharp(inPath).metadata();
  const logoW = Math.round(meta.width * 0.12);
  const logoBuf = await sharp(logoClear)
    .resize({ width: logoW })
    .png()
    .toBuffer();
  const lm = await sharp(logoBuf).metadata();
  const left = Math.round((meta.width - lm.width) / 2);
  const top = Math.round(meta.height * 0.16);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(inPath)
    .composite([{ input: logoBuf, left, top }])
    .webp({ quality: 84 })
    .toFile(outPath);
}

await ensureClearLogo();

const byId = Object.fromEntries(briefs.products.map((p) => [p.id, p]));
let n = 0;

for (const [stem, id] of Object.entries(STEM_TO_ID)) {
  const png = path.join(assetsDir, `${stem}.png`);
  if (!fs.existsSync(png)) continue;
  const product = byId[id];
  if (!product) continue;
  const outPath = path.join(
    root,
    "public/product-images/Organic-review",
    product.folder,
    `${product.formula}.webp`,
  );
  await compositeOnto(png, outPath);
  product.status = "generated";
  n++;
  console.log("OK", id, stem);
}

fs.writeFileSync(
  path.join(root, "scripts/organic-image-briefs.json"),
  JSON.stringify(briefs, null, 2),
);
console.log(`Composited ${n} images with exact teal logo`);
