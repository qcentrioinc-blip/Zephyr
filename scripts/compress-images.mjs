/**
 * Compress key public PNGs to WebP (and optional max-width variants for LCP).
 * Run: node scripts/compress-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");

/** @type {{ rel: string; maxWidth?: number; quality?: number }[]} */
const targets = [
  // Homepage LCP heroes — display ~400px, keep 900 for retina
  { rel: "herbal.png", maxWidth: 900, quality: 78 },
  { rel: "nuetra.png", maxWidth: 900, quality: 78 },
  { rel: "organic.png", maxWidth: 900, quality: 78 },
  // Explore / bottles
  { rel: "Homepage/Herbal.png", maxWidth: 800, quality: 78 },
  { rel: "Homepage/Nutra.png", maxWidth: 800, quality: 78 },
  { rel: "Homepage/Organic.png", maxWidth: 800, quality: 78 },
  { rel: "Homepage/HerbalBottle.png", maxWidth: 700, quality: 78 },
  { rel: "Homepage/NutraBottle.png", maxWidth: 700, quality: 78 },
  { rel: "Homepage/OrganicBottle.png", maxWidth: 700, quality: 78 },
  // Production showcase + packaging slides
  { rel: "Homepage/production/tablet.png", maxWidth: 600, quality: 75 },
  { rel: "Homepage/production/capsule.png", maxWidth: 600, quality: 75 },
  { rel: "Homepage/production/sachet.png", maxWidth: 600, quality: 75 },
  { rel: "Homepage/production/powder.png", maxWidth: 600, quality: 75 },
  { rel: "Homepage/production/gummy.png", maxWidth: 600, quality: 75 },
  { rel: "Homepage/production/jelly.png", maxWidth: 600, quality: 75 },
  { rel: "Homepage/production/jar.png", maxWidth: 600, quality: 75 },
  { rel: "Homepage/production/pack-sachet.png", maxWidth: 600, quality: 75 },
  { rel: "Homepage/production/blister.png", maxWidth: 600, quality: 75 },
  { rel: "Homepage/production/bulk.png", maxWidth: 600, quality: 75 },
  { rel: "Homepage/production/bottle.png", maxWidth: 600, quality: 75 },
  { rel: "Homepage/production/alu-alu.png", maxWidth: 600, quality: 75 },
  { rel: "Homepage/production/stick-pack.png", maxWidth: 600, quality: 75 },
  // Other heavy heroes
  { rel: "Production/production-hero-wide.png", maxWidth: 1600, quality: 72 },
  { rel: "Production/ProductionsHeroRight.png", maxWidth: 1200, quality: 75 },
  { rel: "Production/ProductionsHeroLeft.png", maxWidth: 800, quality: 75 },
  { rel: "Research/research-hero.png", maxWidth: 1600, quality: 72 },
  { rel: "Generated/showreel-formulation.png", maxWidth: 1200, quality: 75 },
];

async function compressOne({ rel, maxWidth = 1200, quality = 75 }) {
  const input = path.join(publicDir, rel);
  if (!fs.existsSync(input)) {
    console.warn("skip missing", rel);
    return;
  }
  const outRel = rel.replace(/\.png$/i, ".webp");
  const output = path.join(publicDir, outRel);
  const before = fs.statSync(input).size;

  let pipeline = sharp(input).rotate();
  const meta = await sharp(input).metadata();
  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await pipeline.webp({ quality, effort: 4 }).toFile(output);
  const after = fs.statSync(output).size;
  console.log(
    `${rel} → ${outRel}  ${(before / 1e6).toFixed(2)}MB → ${(after / 1e6).toFixed(2)}MB`
  );
}

async function main() {
  for (const t of targets) {
    await compressOne(t);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
