/**
 * Convert herb-*.png / nutra-*.png assets → review WebP, optional logo unify,
 * then promote review → live and regen manifests.
 *
 * node scripts/convert-herb-nutra-generated.mjs
 * node scripts/convert-herb-nutra-generated.mjs --promote
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
const FIXED_LOGO_WIDTH = 133;

const briefs = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/herb-nutra-image-briefs.json"), "utf8"),
);

const logoClear = path.join(root, "public/brand/zephyr-logo-organic-clear.png");
const logoSrc = path.join(root, "public/brand/zephyr-logo-organic.png");

async function ensureClearLogo() {
  if (fs.existsSync(logoClear)) return;
  const { data, info } = await sharp(logoSrc)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 240 && g > 240 && b > 240) data[i + 3] = 0;
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(logoClear);
}

async function toWebp(inPath, outPath) {
  // Keep AI-rendered teal logo as-is (avoids double-logo overlays).
  await sharp(inPath).webp({ quality: 84 }).toFile(outPath);
}

function findAsset(prefix, id) {
  const files = fs.readdirSync(assetsDir).filter((f) => f.startsWith(prefix) && f.endsWith(".png"));
  const exact = files.find((f) => f.match(new RegExp(`^${prefix}-${String(id).padStart(2, "0")}[-.]`)));
  if (exact) return exact;
  // also allow herb-52-amla.png style
  const loose = files.find((f) => {
    const m = f.match(new RegExp(`^${prefix}-(\\d+)`));
    return m && Number(m[1]) === id;
  });
  return loose || null;
}

async function convertRange(items, prefix) {
  let n = 0;
  for (const p of items) {
    if (p.status === "copied_from_organic") continue;
    const file = findAsset(prefix, p.id);
    if (!file) continue;
    const outPath = path.join(root, p.outPath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    await toWebp(path.join(assetsDir, file), outPath);
    p.status = "generated";
    p.asset = file;
    n++;
    console.log("OK", prefix, p.id, file, "→", p.outPath);
  }
  return n;
}

await ensureClearLogo();

// Isabgol: herb-53 used for both Digestive (53) and Weight (56)
const isabgolSrc = findAsset("herb", 53);
if (isabgolSrc) {
  const weight = briefs.herbaceutical.find((p) => p.id === 56);
  if (weight) {
    // Convert 53 normally; 56 will be copied after
  }
}

const herbN = await convertRange(briefs.herbaceutical, "herb");
const nutraN = await convertRange(briefs.nutraceutical, "nutra");

// Copy Isabgol digestive → weight management
const digIsabgol = briefs.herbaceutical.find((p) => p.id === 53);
const wtIsabgol = briefs.herbaceutical.find((p) => p.id === 56);
if (digIsabgol && wtIsabgol && fs.existsSync(path.join(root, digIsabgol.outPath))) {
  const dest = path.join(root, wtIsabgol.outPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(root, digIsabgol.outPath), dest);
  wtIsabgol.status = "copied_from_digestive_isabgol";
  console.log("Copied Isabgol → Weight management");
}

fs.writeFileSync(
  path.join(root, "scripts/herb-nutra-image-briefs.json"),
  JSON.stringify(briefs, null, 2),
);

console.log(`Converted herb=${herbN} nutra=${nutraN}`);

if (promote) {
  for (const p of [...briefs.herbaceutical, ...briefs.nutraceutical]) {
    const src = path.join(root, p.outPath);
    const dest = path.join(root, p.livePath);
    if (!fs.existsSync(src)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
  console.log("Promoted review → live");
  execSync("node scripts/generate-range-manifests.mjs", { cwd: root, stdio: "inherit" });
}
