/**
 * Convert organic-v4-*.png assets → Organic-review WebP using briefs.
 * node scripts/convert-organic-v4.mjs
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

const briefs = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/organic-image-briefs.json"), "utf8"),
);
const byId = Object.fromEntries(briefs.products.map((p) => [p.id, p]));

const alias = {
  "organic-v4-14-elderberry": 14,
  "organic-v4-15-pomegranate": 15,
  "organic-v4-16-wheatgrass-b": 16,
  "organic-v4-17-spirulina-b": 17,
  "organic-v4-21-iron": 21,
  "organic-v4-48-kalmegh": 48,
};

let n = 0;
const files = fs.readdirSync(assetsDir).filter((f) => f.startsWith("organic-v4-") && f.endsWith(".png"));

for (const file of files) {
  const stem = file.replace(/\.png$/i, "");
  let id = alias[stem];
  if (!id) {
    const m = stem.match(/^organic-v4-(\d{2})(?:-|$)/);
    if (m) id = Number(m[1]);
  }
  if (!id || !byId[id]) continue;
  const product = byId[id];
  const outPath = path.join(
    root,
    "public/product-images/Organic-review",
    product.folder,
    `${product.formula}.webp`,
  );
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(path.join(assetsDir, file)).webp({ quality: 84 }).toFile(outPath);
  product.status = "generated";
  n++;
  console.log("OK", id, file);
}

fs.writeFileSync(
  path.join(root, "scripts/organic-image-briefs.json"),
  JSON.stringify(briefs, null, 2),
);
const pending = briefs.products.filter((p) => p.status === "pending").length;
console.log(`Converted ${n}. Still pending: ${pending}`);
