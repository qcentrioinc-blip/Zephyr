/**
 * Convert vital-org-*.png → Organic-review WebP, promote live, regen manifests.
 * node scripts/promote-organic-v2.mjs
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

const organic = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/organic-image-briefs.json"), "utf8"),
);

function findAsset(id) {
  if (!fs.existsSync(assetsDir)) return null;
  const files = fs
    .readdirSync(assetsDir)
    .filter((f) => f.startsWith("vital-org-") && f.endsWith(".png"));
  return (
    files.find((f) => {
      const m = f.match(/^vital-org-(\d+)/);
      return m && Number(m[1]) === id;
    }) || null
  );
}

let n = 0;
const missing = [];
for (const p of organic.products) {
  if (!p.outPath) {
    p.outPath = `public/product-images/Organic-review/${p.folder}/${p.formula}.webp`;
  }
  if (!p.livePath) {
    p.livePath = `public/product-images/Organic/${p.folder}/${p.formula}.webp`;
  }
  const file = findAsset(p.id);
  if (!file) {
    missing.push(p.id);
    continue;
  }
  const inPath = path.join(assetsDir, file);
  const outPath = path.join(root, p.outPath);
  const livePath = path.join(root, p.livePath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(inPath).webp({ quality: 84 }).toFile(outPath);
  fs.mkdirSync(path.dirname(livePath), { recursive: true });
  fs.copyFileSync(outPath, livePath);
  p.status = "vitalcore_v2";
  p.asset = file;
  n++;
  console.log("OK", p.id, file);
}

fs.writeFileSync(
  path.join(root, "scripts/organic-image-briefs.json"),
  JSON.stringify(organic, null, 2),
);

console.log(`organic converted+promoted ${n}; missing ${missing.join(",") || "none"}`);
execSync("node scripts/generate-range-manifests.mjs", { cwd: root, stdio: "inherit" });
