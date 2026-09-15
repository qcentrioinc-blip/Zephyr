/**
 * Convert vitalcore herb/nutra/organic PNGs → review WebP (plain, no logo overlay),
 * promote, manifests.
 *
 * Logo is AI-painted on Herb/Nutra labels — do NOT composite a second Vitalcore.
 *
 * node scripts/convert-vitalcore-v2.mjs
 * node scripts/convert-vitalcore-v2.mjs --promote
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const assetsDir = path.join(
  process.env.USERPROFILE || "",
  ".cursor/projects/c-Users-qc-la-OneDrive-Qcentrio-Inc-Desktop-Zephyr/assets",
);
const promote = process.argv.includes("--promote");

const herbNutra = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/herb-nutra-image-briefs.json"), "utf8"),
);
const organic = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/organic-image-briefs.json"), "utf8"),
);

function findAsset(prefix, id) {
  if (!fs.existsSync(assetsDir)) return null;
  const files = fs.readdirSync(assetsDir).filter((f) => f.startsWith(prefix) && f.endsWith(".png"));
  return (
    files.find((f) => {
      const m = f.match(new RegExp(`^${prefix}-(\\d+)`));
      return m && Number(m[1]) === id;
    }) || null
  );
}

async function toWebpPlain(inPath, outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(inPath).webp({ quality: 84 }).toFile(outPath);
}

async function convertList(items, prefix) {
  let n = 0;
  for (const p of items) {
    const file = findAsset(prefix, p.id);
    if (!file) continue;
    const outPath = path.join(root, p.outPath);
    const inPath = path.join(assetsDir, file);
    await toWebpPlain(inPath, outPath);
    p.status = "vitalcore_v3";
    p.asset = file;
    n++;
    console.log("OK", prefix, p.id, file);
  }
  return n;
}

// Organic products use outPath under Organic-review
for (const p of organic.products) {
  if (!p.outPath) {
    p.outPath = `public/product-images/Organic-review/${p.folder}/${p.formula}.webp`;
  }
  if (!p.livePath) {
    p.livePath = `public/product-images/Organic/${p.folder}/${p.formula}.webp`;
  }
}

const herbN = await convertList(herbNutra.herbaceutical, "vital-herb");
const nutraN = await convertList(herbNutra.nutraceutical, "vital-nutra");
const orgN = await convertList(organic.products, "vital-org");

fs.writeFileSync(
  path.join(root, "scripts/herb-nutra-image-briefs.json"),
  JSON.stringify(herbNutra, null, 2),
);
fs.writeFileSync(
  path.join(root, "scripts/organic-image-briefs.json"),
  JSON.stringify(organic, null, 2),
);

console.log(`Converted herb=${herbN} nutra=${nutraN} organic=${orgN}`);

if (promote) {
  for (const p of [
    ...herbNutra.herbaceutical,
    ...herbNutra.nutraceutical,
    ...organic.products,
  ]) {
    const src = path.join(root, p.outPath);
    const dest = path.join(root, p.livePath);
    if (!fs.existsSync(src)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
  console.log("Promoted review → live");
  execSync("node scripts/generate-herb-manifest.mjs", { cwd: root, stdio: "inherit" });
  execSync("node scripts/generate-range-manifests.mjs", { cwd: root, stdio: "inherit" });
}
