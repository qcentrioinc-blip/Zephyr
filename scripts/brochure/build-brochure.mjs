/**
 * Vitalcore print catalog brochure builder (marketing Hybrid C layout).
 * Parses range data.ts + image manifests, writes print HTML, renders A4 PDF via Playwright.
 *
 * Usage: node scripts/brochure/build-brochure.mjs
 * Optional: BROCHURE_SKIP_PDF=1 to only write HTML
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "dist", "brochure");
const CONTACT_PATH = path.join(__dirname, "contact.json");
const THEME_CSS_PATH = path.join(__dirname, "theme.css");

/** Short category blurbs where site copy already exists (no invented claims). */
const CATEGORY_BLURBS = {
  "Joint Care":
    "Botanical actives suited to mobility and joint-support positioning.",
  "Joint Pain":
    "Botanical actives suited to mobility and joint-support positioning.",
  "Immunity Boosters":
    "Vitamin, mineral, and botanical stacks for seasonal immune positioning.",
  Immunity:
    "Vitamin, mineral, and botanical stacks for seasonal immune positioning.",
  "Digestive Health":
    "Probiotic, enzyme, and fiber formats for gut-health portfolios.",
  Digestive:
    "Probiotic, enzyme, and fiber formats for gut-health portfolios.",
  "Heart Health":
    "Omega, plant sterol, and antioxidant formulas for cardiovascular positioning.",
  "Weight Management":
    "Fiber, protein, and metabolic-support blends for weight-wellness lines.",
  "Hair, Skin & Nails":
    "Collagen, biotin, and antioxidant complexes for beauty-from-within lines.",
  Organic:
    "Certified organic-compliant manufacturing workflows for clean-label programs.",
};

const RANGES = [
  {
    id: "nutraceutical",
    label: "Nutraceutical",
    dataFile: path.join(ROOT, "src/nutraceutical/data.ts"),
    manifestFile: path.join(ROOT, "src/nutraceutical/imageManifest.ts"),
    imageDir: "Nutraceutical",
    accent: "#4AA3A7",
    accentSoft: "#E9F6F7",
    bg: "#edf6fb",
    dark: "#1a3d42",
    subtitle:
      "Vitamins, minerals, and specialty supplements for commercial brand portfolios.",
  },
  {
    id: "herbaceutical",
    label: "Herbaceutical",
    dataFile: path.join(ROOT, "src/herbaceutical/data.ts"),
    manifestFile: path.join(ROOT, "src/herbaceutical/imageManifest.ts"),
    imageDir: "Herbaceutical",
    accent: "#C38046",
    accentSoft: "#FCF8F2",
    bg: "#fbf3e5",
    dark: "#4a2e16",
    subtitle:
      "Botanical dietary supplements for private-label brand programs.",
  },
  {
    id: "organic",
    label: "Organic",
    dataFile: path.join(ROOT, "src/organic/data.ts"),
    manifestFile: path.join(ROOT, "src/organic/imageManifest.ts"),
    imageDir: "Organic",
    accent: "#547A3D",
    accentSoft: "#EFF7ED",
    bg: "#f8f9ef",
    dark: "#2a3d1f",
    subtitle:
      "Organic and clean-label manufacturing for private-label launch.",
  },
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function categoryBlurb(name) {
  if (CATEGORY_BLURBS[name]) return CATEGORY_BLURBS[name];
  const key = Object.keys(CATEGORY_BLURBS).find(
    (k) =>
      name.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(name.toLowerCase()),
  );
  return key ? CATEGORY_BLURBS[key] : "";
}

function parseManifest(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  const map = {};
  const re = /"((?:\\.|[^"\\])*)"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let m;
  while ((m = re.exec(src))) {
    const key = m[1].replace(/\\"/g, '"');
    const val = m[2].replace(/\\"/g, '"');
    if (key.includes("|") && val.startsWith("/product-images/")) {
      map[key] = val;
    }
  }
  return map;
}

function parseCatalog(dataFile) {
  const src = fs.readFileSync(dataFile, "utf8");
  const start = src.indexOf("const rawCatalog");
  if (start < 0) throw new Error(`rawCatalog not found in ${dataFile}`);
  const slice = src.slice(start);

  const categories = [];
  const catRe =
    /name:\s*"((?:\\.|[^"\\])*)"\s*,\s*formulas:\s*\[([\s\S]*?)\]\s*,?\s*\}/g;
  let catMatch;
  while ((catMatch = catRe.exec(slice))) {
    const name = catMatch[1].replace(/\\"/g, '"');
    const body = catMatch[2];
    const formulas = [];
    const fRe =
      /f\(\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"\s*\)/g;
    let fMatch;
    while ((fMatch = fRe.exec(body))) {
      formulas.push({
        folder: fMatch[1].replace(/\\"/g, '"'),
        formula: fMatch[2].replace(/\\"/g, '"'),
      });
    }
    if (formulas.length) {
      categories.push({ name, formulas });
    }
  }

  categories.sort((a, b) => a.name.localeCompare(b.name));
  return categories;
}

function resolveSourceImage(manifest, folder, formula, imageDir) {
  const key = `${folder}|${formula}`;
  let rel = manifest[key];
  if (!rel) {
    const dir = path.join(ROOT, "public", "product-images", imageDir, folder);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const match = files.find(
        (f) =>
          f === `${formula}.webp` ||
          f.startsWith(`${formula}.`) ||
          f.replace(/\.(v\d+\.)?webp$/i, "") === formula,
      );
      if (match) rel = `/product-images/${imageDir}/${folder}/${match}`;
    }
  }
  if (!rel) return null;
  const abs = path.join(ROOT, "public", rel.replace(/^\//, ""));
  if (!fs.existsSync(abs)) {
    const altDir = path.dirname(abs);
    const base = path.basename(abs, path.extname(abs)).replace(/\.v\d+$/, "");
    if (fs.existsSync(altDir)) {
      const found = fs.readdirSync(altDir).find((f) => f.startsWith(base));
      if (found) return path.join(altDir, found);
    }
    return null;
  }
  return abs;
}

/** Dense 4-col print tiles — ~480px wide is enough at A4. */
async function preparePrintImage(srcAbs, rangeId, folder, formula, sharp) {
  if (!srcAbs) return null;
  const safeFolder = folder.replace(/[<>:"/\\|?*]/g, "_");
  const safeName = formula.replace(/[<>:"/\\|?*]/g, "_").slice(0, 120);
  const outRel = path.join("images", rangeId, safeFolder, `${safeName}.jpg`);
  const outAbs = path.join(OUT_DIR, outRel);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  await sharp(srcAbs)
    .rotate()
    .resize({ width: 480, height: 640, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outAbs);
  return pathToFileURL(outAbs).href;
}

function loadContact() {
  const raw = JSON.parse(fs.readFileSync(CONTACT_PATH, "utf8"));
  return {
    email: raw.email || "[YOUR EMAIL]",
    phone: raw.phone || "[YOUR PHONE]",
    website: raw.website || "https://www.zephyrlabsinc.com",
    address:
      raw.address ||
      "Plot #168-P5, Vemgal Industrial Area, Kolar District, Karnataka, India",
  };
}

function logoUrl() {
  const candidates = [
    path.join(ROOT, "public/brand/vitalcore-logo.svg"),
    path.join(ROOT, "public/brand/logo.png"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return pathToFileURL(p).href;
  }
  return "";
}

async function buildRanges(sharp) {
  const ranges = [];
  for (const range of RANGES) {
    const manifest = parseManifest(range.manifestFile);
    const categories = [];
    for (const cat of parseCatalog(range.dataFile)) {
      const formulas = [];
      for (const item of cat.formulas) {
        const src = resolveSourceImage(
          manifest,
          item.folder,
          item.formula,
          range.imageDir,
        );
        const image = await preparePrintImage(
          src,
          range.id,
          item.folder,
          item.formula,
          sharp,
        );
        formulas.push({ formula: item.formula, image });
      }
      categories.push({
        name: cat.name,
        blurb: categoryBlurb(cat.name),
        formulas,
      });
    }
    const formulaCount = categories.reduce((n, c) => n + c.formulas.length, 0);
    const withImages = categories.flatMap((c) =>
      c.formulas.filter((f) => f.image),
    );
    const heroImages = [];
    const step = Math.max(1, Math.floor(withImages.length / 3));
    for (let i = 0; i < withImages.length && heroImages.length < 3; i += step) {
      heroImages.push(withImages[i]);
    }
    while (heroImages.length < 3 && withImages[heroImages.length]) {
      heroImages.push(withImages[heroImages.length]);
    }
    ranges.push({
      ...range,
      categories,
      formulaCount,
      heroImages,
      heroImage: heroImages[0]?.image ?? null,
    });
  }
  return ranges;
}

function contactBlock(contact, className = "contact-block") {
  const webLabel = contact.website.replace(/^https?:\/\//, "");
  return `
    <div class="${className}">
      <div class="contact-row"><span class="contact-label">Email</span><span>${escapeHtml(contact.email)}</span></div>
      <div class="contact-row"><span class="contact-label">Phone</span><span>${escapeHtml(contact.phone)}</span></div>
      <div class="contact-row"><span class="contact-label">Web</span><span>${escapeHtml(webLabel)}</span></div>
      <div class="contact-row"><span class="contact-label">Address</span><span>${escapeHtml(contact.address)}</span></div>
    </div>`;
}

function pickMosaic(ranges, count = 5) {
  const picks = [];
  for (const r of ranges) {
    for (const c of r.categories) {
      for (const f of c.formulas) {
        if (f.image) picks.push({ ...f, accent: r.accent, range: r.label });
      }
    }
  }
  const step = Math.max(1, Math.floor(picks.length / count));
  const out = [];
  for (let i = 0; i < picks.length && out.length < count; i += step) {
    out.push(picks[i]);
  }
  return out.slice(0, count);
}

function leafSvg(cls) {
  return `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true"><path fill="currentColor" d="M32 4c-14 16-18 32-0 56 18-24 14-40 0-56z"/><path fill="none" stroke="#fff" stroke-width="2" opacity=".45" d="M32 14v34"/></svg>`;
}

function renderCover(contact, ranges, logo) {
  const total = ranges.reduce((n, r) => n + r.formulaCount, 0);
  const stack = pickMosaic(ranges, 5)
    .map(
      (m, i) =>
        `<figure class="cover-stack__item cover-stack__item--${i + 1}" style="--a:${m.accent}"><img src="${m.image}" alt="" /></figure>`,
    )
    .join("");
  const rangeRows = ranges
    .map(
      (r) => `
      <div class="cover-range-row" style="--a:${r.accent}">
        <span class="cover-range-name">${escapeHtml(r.label)}</span>
        <span class="cover-range-n">${r.formulaCount}</span>
      </div>`,
    )
    .join("");

  return `
  <section class="page cover">
    <div class="cover-blob cover-blob--1" aria-hidden="true"></div>
    <div class="cover-blob cover-blob--2" aria-hidden="true"></div>
    ${leafSvg("cover-leaf cover-leaf--1")}
    ${leafSvg("cover-leaf cover-leaf--2")}
    <div class="cover-grid">
      <div class="cover-left">
        ${logo ? `<img class="cover-logo" src="${logo}" alt="Vitalcore" />` : `<div class="cover-wordmark">Vitalcore</div>`}
        <p class="cover-by">by ZEPHYR</p>
        <h1 class="cover-h1">Formula<br/><span>Catalog</span></h1>
        <p class="cover-lead">Private-label &amp; contract manufacturing · ${total} reference formulas</p>
        <div class="cover-range-list">${rangeRows}</div>
        ${contactBlock(contact, "contact-block contact-block--cover")}
      </div>
      <div class="cover-right">
        <div class="cover-stack">${stack}</div>
        <p class="cover-stamp">CDMO · USA · INDIA</p>
      </div>
    </div>
  </section>`;
}

function renderBack(contact, logo) {
  return `
  <section class="page back-cover">
    <div class="cover-blob cover-blob--1" aria-hidden="true"></div>
    ${leafSvg("cover-leaf cover-leaf--1")}
    <div class="back-center">
      ${logo ? `<img class="back-logo" src="${logo}" alt="Vitalcore" />` : ""}
      <p class="cover-by">Vitalcore, by ZEPHYR</p>
      <p class="back-tag">B2B manufacturing partner · Nutraceutical · Herbaceutical · Organic</p>
      ${contactBlock(contact, "contact-block contact-block--back")}
      <p class="back-web">${escapeHtml(contact.website.replace(/^https?:\/\//, ""))}</p>
    </div>
  </section>`;
}

function renderRangeHero(range) {
  const shots = (range.heroImages || [])
    .slice(0, 3)
    .map(
      (h, i) =>
        `<figure class="opener-shot opener-shot--${i + 1}"><img src="${h.image}" alt="${escapeHtml(h.formula)}" /><figcaption>${escapeHtml(h.formula.split("+")[0].trim())}</figcaption></figure>`,
    )
    .join("");

  return `
  <section class="page range-opener" style="--a:${range.accent};--soft:${range.accentSoft};--bg:${range.bg};--dark:${range.dark}">
    <div class="opener-wash" aria-hidden="true"></div>
    <p class="opener-watermark" aria-hidden="true">${escapeHtml(range.label)}</p>
    <div class="opener-ribbon"><span>Product Range</span></div>
    <div class="opener-body">
      <div class="opener-copy">
        <h2 class="opener-title">${escapeHtml(range.label)}</h2>
        <p class="opener-sub">${escapeHtml(range.subtitle)}</p>
        <div class="opener-stats">
          <div><strong>${range.formulaCount}</strong><span>Formulas</span></div>
          <div><strong>${range.categories.length}</strong><span>Categories</span></div>
        </div>
      </div>
      <div class="opener-gallery">${shots}</div>
    </div>
  </section>`;
}

function tile(item, index, size = "md") {
  const img = item.image
    ? `<img src="${item.image}" alt="${escapeHtml(item.formula)}" />`
    : `<div class="ph">—</div>`;
  return `
  <article class="tile tile--${size}">
    <span class="tile-num">${String(index).padStart(2, "0")}</span>
    <div class="tile-media">${img}</div>
    <h4 class="tile-name">${escapeHtml(item.formula)}</h4>
  </article>`;
}

function listRow(item, index) {
  const img = item.image
    ? `<img src="${item.image}" alt="${escapeHtml(item.formula)}" />`
    : `<div class="ph">—</div>`;
  return `
  <article class="row-item">
    <span class="row-num">${String(index).padStart(2, "0")}</span>
    <div class="row-media">${img}</div>
    <h4 class="row-name">${escapeHtml(item.formula)}</h4>
  </article>`;
}

/** Alternating magazine templates per category */
function renderCategory(cat, range, catIndex) {
  const mode = catIndex % 3;
  const blurb = cat.blurb
    ? `<p class="mod-blurb">${escapeHtml(cat.blurb)}</p>`
    : "";
  const featured = cat.formulas[0];
  const rest = cat.formulas.slice(1);

  if (mode === 0 && cat.formulas.length >= 3) {
    // Showcase: large hero + mini grid (Avon/Elastine hybrid)
    const minis = rest.map((f, i) => tile(f, i + 2, "sm")).join("");
    return `
    <section class="mod mod-showcase">
      <header class="mod-head">
        <div class="mod-pod"><h3>${escapeHtml(cat.name)}</h3></div>
        <span class="mod-count">${cat.formulas.length}</span>
      </header>
      ${blurb}
      <div class="showcase-grid">
        <article class="showcase-hero">
          <span class="tile-num">01</span>
          <div class="showcase-hero-media">${featured.image ? `<img src="${featured.image}" alt="${escapeHtml(featured.formula)}" />` : ""}</div>
          <h4>${escapeHtml(featured.formula)}</h4>
        </article>
        <div class="showcase-minis">${minis}</div>
      </div>
    </section>`;
  }

  if (mode === 1) {
    // Color block gallery (Falcon/Elastine color panel)
    const tiles = cat.formulas.map((f, i) => tile(f, i + 1, "md")).join("");
    return `
    <section class="mod mod-block">
      <div class="block-banner">
        <h3>${escapeHtml(cat.name)}</h3>
        <span>${cat.formulas.length} formulas</span>
      </div>
      ${blurb}
      <div class="gallery-3">${tiles}</div>
    </section>`;
  }

  // Dense editorial rows (Elastine list modules)
  const rows = cat.formulas.map((f, i) => listRow(f, i + 1)).join("");
  return `
  <section class="mod mod-rows">
    <header class="mod-head mod-head--line">
      <h3>${escapeHtml(cat.name)}</h3>
      <span class="mod-count">${cat.formulas.length}</span>
    </header>
    ${blurb}
    <div class="row-grid">${rows}</div>
  </section>`;
}

function renderRangeCatalog(range) {
  const cats = range.categories
    .map((c, i) => renderCategory(c, range, i))
    .join("");
  return `
  <section class="range-catalog" data-range="${range.id}" style="--a:${range.accent};--soft:${range.accentSoft};--bg:${range.bg};--dark:${range.dark}">
    ${cats}
  </section>`;
}

function buildHtml(ranges, contact) {
  const css = fs.readFileSync(THEME_CSS_PATH, "utf8");
  const logo = logoUrl();
  const total = ranges.reduce((n, r) => n + r.formulaCount, 0);
  const body = [
    renderCover(contact, ranges, logo),
    ...ranges.flatMap((r) => [renderRangeHero(r), renderRangeCatalog(r)]),
    renderBack(contact, logo),
  ].join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Vitalcore Product Catalog · ${total} formulas</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>${css}</style>
</head>
<body>
  <main class="brochure">${body}</main>
</body>
</html>`;
}

async function renderPdf(htmlPath, pdfPath) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(htmlPath).href, {
      waitUntil: "networkidle",
      timeout: 180_000,
    });
    await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.addEventListener("load", res);
                img.addEventListener("error", res);
              }),
        ),
      );
    });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log("Building Vitalcore marketing brochure…");
  const sharp = (await import("sharp")).default;
  const contact = loadContact();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log("Preparing print images…");
  const ranges = await buildRanges(sharp);

  let missing = 0;
  let total = 0;
  for (const r of ranges) {
    for (const c of r.categories) {
      for (const f of c.formulas) {
        total += 1;
        if (!f.image) missing += 1;
      }
    }
    console.log(
      `  ${r.label}: ${r.formulaCount} formulas / ${r.categories.length} categories`,
    );
  }
  console.log(
    `  Total formulas: ${total}${missing ? ` (${missing} missing images)` : ""}`,
  );

  const html = buildHtml(ranges, contact);
  const htmlPath = path.join(OUT_DIR, "catalog.html");
  fs.writeFileSync(htmlPath, html, "utf8");
  console.log(`Wrote ${htmlPath}`);

  if (process.env.BROCHURE_SKIP_PDF === "1") {
    console.log("BROCHURE_SKIP_PDF=1 — skipping PDF render");
    return;
  }

  const pdfPath = path.join(OUT_DIR, "Vitalcore-Product-Catalog.pdf");
  console.log("Rendering PDF with Playwright…");
  await renderPdf(htmlPath, pdfPath);
  const sizeMb = (fs.statSync(pdfPath).size / (1024 * 1024)).toFixed(1);
  console.log(`Wrote ${pdfPath} (${sizeMb} MB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
