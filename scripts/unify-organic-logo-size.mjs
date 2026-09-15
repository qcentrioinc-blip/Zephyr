/**
 * Unify Zephyr logo size relative to bottle width (Spirulina-calibrated).
 * node scripts/unify-organic-logo-size.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const assetsDir = path.join(
  process.env.USERPROFILE || "",
  ".cursor/projects/c-Users-qc-la-OneDrive-Qcentrio-Inc-Desktop-Zephyr/assets",
);

const briefs = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/organic-image-briefs.json"), "utf8"),
);

/** Absolute logo width in px — matched to Spirulina on 864px-wide frames */
const FIXED_LOGO_WIDTH = 133;
/** Label band starts below cap (~30% down the bottle silhouette) */
const LOGO_TOP_OF_BOTTLE = 0.3;

const STEM_BY_ID = {
  1: "organic-v5-01",
  2: "organic-v5-02",
  3: "organic-v5-03",
  4: "organic-v5-04",
  5: "organic-v5-05",
  6: "organic-v5-06",
  7: "organic-v5-07",
  8: "organic-v5-08",
  9: "organic-v5-09",
  10: "organic-v5-10",
  11: "organic-v5-11",
  12: "organic-v5-12",
  13: "organic-v5-13",
  14: "organic-v5-14-elderberry",
  15: "organic-v5-15-pomegranate",
  16: "organic-v5-16-wheatgrass",
  17: "organic-v5-17-spirulina",
  18: "organic-v5-18",
  19: "organic-v5-19",
  20: "organic-v5-20",
  21: "organic-v5-21-iron",
  22: "organic-v5-22",
  23: "organic-v5-23",
  24: "organic-v5-24",
  25: "organic-v5-25",
  26: "organic-v5-26",
  27: "organic-v5-27",
  28: "organic-v5-28",
  29: "organic-v5-29",
  30: "organic-v5-30",
  31: "organic-v5-31",
  32: "organic-v5-32",
  33: "organic-v5-33",
  34: "organic-v5-34",
  35: "organic-v5-35",
  36: "organic-v5-36",
  37: "organic-v5-37",
  38: "organic-v5-38",
  39: "organic-v5-39",
  40: "organic-v5-40",
  41: "organic-v5-41",
  42: "organic-v5-42",
  43: "organic-v5-43",
  44: "organic-v5-44",
  45: "organic-v5-45",
  46: "organic-v5-46",
  47: "organic-v5-47",
  48: "organic-v5-48-kalmegh",
  49: "organic-v5-49",
  50: "organic-v5-50",
  51: "organic-v5-51",
  52: "organic-v5-52",
};

async function ensureClearLogo() {
  const out = path.join(root, "public/brand/zephyr-logo-organic-clear.png");
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
    .toFile(out);
  return out;
}

/** Approximate bottle bbox via vertical amber/white-cap mass in center. */
function detectBottle(data, w, h) {
  const colScore = new Array(w).fill(0);
  for (let y = Math.floor(h * 0.08); y < Math.floor(h * 0.9); y++) {
    for (let x = Math.floor(w * 0.15); x < Math.floor(w * 0.85); x++) {
      const i = (y * w + x) * 4;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const lum = (r + g + b) / 3;
      // amber plastic or white cap or label cream
      const amber = r > 120 && r > g && r > b && g > 70 && b < 180;
      const whiteish = lum > 200 && Math.abs(r - g) < 25;
      const cream = lum > 175 && lum < 245 && r > 170;
      if (amber || whiteish || cream) colScore[x]++;
    }
  }
  const thresh = h * 0.12;
  let left = Math.floor(w * 0.2);
  let right = Math.floor(w * 0.8);
  for (let x = 0; x < w; x++) {
    if (colScore[x] > thresh) {
      left = x;
      break;
    }
  }
  for (let x = w - 1; x >= 0; x--) {
    if (colScore[x] > thresh) {
      right = x;
      break;
    }
  }
  // tighten to central peak
  const mid = Math.floor((left + right) / 2);
  let bestL = left,
    bestR = right,
    best = -1;
  const win = Math.max(80, Math.floor((right - left) * 0.55));
  for (let l = left; l + win < right; l += 4) {
    let s = 0;
    for (let x = l; x < l + win; x++) s += colScore[x];
    if (s > best) {
      best = s;
      bestL = l;
      bestR = l + win;
    }
  }
  // Prefer window centered near image center
  const centered = Math.abs((bestL + bestR) / 2 - w / 2) < w * 0.12;
  if (!centered) {
    bestL = Math.max(0, mid - Math.floor(win / 2));
    bestR = Math.min(w - 1, bestL + win);
  }

  // vertical extent
  let top = Math.floor(h * 0.05);
  let bottom = Math.floor(h * 0.92);
  const rowScore = new Array(h).fill(0);
  for (let y = 0; y < h; y++) {
    for (let x = bestL; x <= bestR; x++) {
      const i = (y * w + x) * 4;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const lum = (r + g + b) / 3;
      const amber = r > 120 && r > g && g > 70;
      const whiteish = lum > 200;
      const cream = lum > 175 && lum < 245;
      if (amber || whiteish || cream) rowScore[y]++;
    }
  }
  const rThresh = (bestR - bestL) * 0.25;
  for (let y = 0; y < h; y++) {
    if (rowScore[y] > rThresh) {
      top = y;
      break;
    }
  }
  for (let y = h - 1; y >= 0; y--) {
    if (rowScore[y] > rThresh) {
      bottom = y;
      break;
    }
  }

  return {
    left: bestL,
    right: bestR,
    top,
    bottom,
    width: bestR - bestL + 1,
    height: bottom - top + 1,
  };
}

function sampleLabelCream(data, w, h, bottle) {
  const cx = Math.floor((bottle.left + bottle.right) / 2);
  const cy = Math.floor(bottle.top + bottle.height * 0.35);
  const samples = [];
  for (const [dx, dy] of [
    [0, 0],
    [-12, 8],
    [12, 8],
    [0, 16],
    [-20, 0],
    [20, 0],
  ]) {
    const x = Math.min(w - 1, Math.max(0, cx + dx));
    const y = Math.min(h - 1, Math.max(0, cy + dy));
    const i = (y * w + x) * 4;
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const lum = (r + g + b) / 3;
    if (lum > 160) samples.push([r, g, b]);
  }
  if (!samples.length) return { r: 245, g: 240, b: 232 };
  const avg = [0, 0, 0];
  for (const s of samples) {
    avg[0] += s[0];
    avg[1] += s[1];
    avg[2] += s[2];
  }
  return {
    r: Math.round(avg[0] / samples.length),
    g: Math.round(avg[1] / samples.length),
    b: Math.round(avg[2] / samples.length),
  };
}

async function unifyOne(inPath, outPath, logoClearPath) {
  const { data, info } = await sharp(inPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const bottle = detectBottle(data, w, h);
  const cream = sampleLabelCream(data, w, h, bottle);

  const logoW = FIXED_LOGO_WIDTH;
  const logoBuf = await sharp(logoClearPath)
    .resize({ width: logoW })
    .png()
    .toBuffer();
  const lm = await sharp(logoBuf).metadata();

  const cx = Math.round((bottle.left + bottle.right) / 2);
  const left = Math.round(cx - lm.width / 2);
  const top = Math.round(bottle.top + bottle.height * LOGO_TOP_OF_BOTTLE);

  // Tight cream wipe only over old AI logo
  const logoCoverW = Math.round(lm.width * 1.35);
  const logoCoverH = Math.round(lm.height * 1.45);
  const logoCoverLeft = Math.round(cx - logoCoverW / 2);
  const logoCoverTop = Math.max(0, top - Math.round(lm.height * 0.12));
  const logoCover = await sharp({
    create: {
      width: logoCoverW,
      height: logoCoverH,
      channels: 3,
      background: cream,
    },
  })
    .png()
    .toBuffer();

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(inPath)
    .composite([
      {
        input: logoCover,
        left: Math.max(0, logoCoverLeft),
        top: Math.max(0, logoCoverTop),
      },
      { input: logoBuf, left: Math.max(0, left), top: Math.max(0, top) },
    ])
    .webp({ quality: 84 })
    .toFile(outPath);

  return { logoW, bottleW: bottle.width, left, top };
}

const logoClear = await ensureClearLogo();
const byId = Object.fromEntries(briefs.products.map((p) => [p.id, p]));
let n = 0;

for (const [idStr, stem] of Object.entries(STEM_BY_ID)) {
  const id = Number(idStr);
  const product = byId[id];
  if (!product) continue;
  const png = path.join(assetsDir, `${stem}.png`);
  if (!fs.existsSync(png)) {
    console.warn("missing", stem);
    continue;
  }
  const outPath = path.join(
    root,
    "public/product-images/Organic-review",
    product.folder,
    `${product.formula}.webp`,
  );
  const info = await unifyOne(png, outPath, logoClear);
  product.status = "logo_unified";
  n++;
  console.log(
    "OK",
    id,
    `logo=${info.logoW}px (fixed) bottle≈${info.bottleW}px`,
  );
}

fs.writeFileSync(
  path.join(root, "scripts/organic-image-briefs.json"),
  JSON.stringify(briefs, null, 2),
);
console.log(`\nUnified ${n}/52 at fixed logo width ${FIXED_LOGO_WIDTH}px (Spirulina size)`);
