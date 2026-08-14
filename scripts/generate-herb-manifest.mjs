import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const imageRoot = path.join(root, "public/product-images/Herbaceutical");
const outFile = path.join(root, "src/herbaceutical/imageManifest.ts");

/** data.ts category → disk folder */
const FOLDER_BY_CATEGORY = {
  "Joint Care": "Joint care",
  "Immunity Boosters": "Immunity booster",
  "Hair, Skin & Nails": "Hair,skin , nails",
  "Anti-Oxidants": "Anti Oxidents",
  "Kidney Health": "Kidney Health",
  Haematinic: "Haematinic",
  "Heart Health": "Heart Health",
  "Brain Health": "Brain Health",
  "Female Fertility": "Female fertility",
  "Male Fertility": "male fertility",
  "Diabetic Care": "Diabetic care",
  "Liver Health": "Liver Health",
  Menopause: "Menopause",
  "Respiratory Health": "Respiratory Health",
  Vision: "Vision",
  "Digestive Health": "Digestive Health",
  "Weight Management": "Weight management",
};

/** formula display text overrides where filename differs */
const FORMULA_FILENAME = {
  "Joint care|Cat's Claw + Bromelain Extract + Ashwagandha Root":
    "Cat\u2019s Claw + Bromelain Extract + Ashwagandha Root",
  "Female fertility|Gokshuru + Holy Basil + Ashwagandha Root + Shalparni":
    "Gokshuru + Holy Basil + Ashwagandha Root + Shalparni",
};

function normalizeStem(name) {
  return name.replace(/\.(jpe?g|png|webp|avif)$/i, "");
}

function listImages(folder) {
  const dir = path.join(imageRoot, folder);
  if (!fs.existsSync(dir)) return new Map();
  const map = new Map();
  for (const file of fs.readdirSync(dir)) {
    if (!/\.(jpe?g|png|webp|avif)$/i.test(file)) continue;
    map.set(normalizeStem(file), file);
  }
  return map;
}

function publicUrl(folder, filename) {
  return `/product-images/Herbaceutical/${folder}/${filename}`;
}

// Import formula list from raw catalog structure — inline categories
const catalog = [
  ["Joint Care", ["Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod", "Cat's Claw + Bromelain Extract + Ashwagandha Root", "Rosehip Powder + Ginger + Curcumin + Maca Root", "Guggul + Sea Buck Thorn + Schindra + Eucalyptus", "Burdock Root + Moringa Leaf + Willow Bark + Curcumin"]],
  ["Immunity Boosters", ["Astragalus Root + Aronia Berry + Maitake Mushroom + Holy Basil", "Neem Leaf + Morinda Citrifolia Fruit + Ashwagandha Root + Moringa Fruit", "American Ginseng + Kalmegh + Echinacea Root + Spirulina", "Curcumin + Moringa + Liquorice + Ashwagandha Root"]],
  ["Hair, Skin & Nails", ["Manjistha Stem + Propolis + Avocado Fruit", "Aloe Vera + Bamboo Stem + Sesbania Grandiflora + Bearberry", "Amla + Bhringraj + Brahmi + Grapeseed", "Orange + Hibiscus + Gingko Biloba + Green Tea"]],
  ["Anti-Oxidants", ["Elderberry + Green Tea + Beetroot", "Pomegranate + Cranberry + Curcumin", "Wheat Grass + Acai Berry + Raspberries + Papain", "Spirulina + Tart Cherry + Bacopa Monnieri"]],
  ["Kidney Health", ["Punarnava + Astragalus + Cranberry", "Horse Tail Herb + Birch Leaf + Tulsi Ark", "Manjistha + Amla + Fennel Seed + Celery"]],
  ["Haematinic", ["Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc", "Folic Acid + Vitamin B12 + Vitamin C", "Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc", "Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12"]],
  ["Heart Health", ["Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark", "Aronia Berry + Piperine + Maitake Mushroom", "Arjuna + Guggul + Brahmi", "Fenugreek Seed + Amla + Garlic Powder + Arjuna"]],
  ["Brain Health", ["Gingko Biloba + Bacopa Monnieri + Shankhpushpi", "Rosemary Leaf + Gotu Kola + Curcumin + Vacha", "Bacopa Monnieri + Rhodiola Rosea + Ginseng"]],
  ["Female Fertility", ["Shatavari + Black Sesame Seed + Liquorice Root + Musta", "Gokshuru + Holy Basil + Ashwagandha Root + Shalparni", "Ashoka + Jeevanti + Punarnava + Guduchi"]],
  ["Male Fertility", ["Ashwagandha Root + Mucuna Pruriens + Safed Musli", "Muira Puama + Gokhru + Shilajit", "Shilajit + Ashwagandha Root + Ginseng"]],
  ["Diabetic Care", ["Bitter Melon + Lucuma + Banaba Leaf", "Chitrak Root + Fenugreek Seed + Olive Leaf", "Prickly Pear Leaf + Mulberry Leaf + Cinnamon Bark", "Gymnema Leaf + Bilberry"]],
  ["Liver Health", ["Milk Thistle + Dandelion Root + Green Turmeric", "Kutki + Schisandra Berry + Nigella Sativa", "Milk Thistle + Artichoke Fruit + Myrobalan"]],
  ["Menopause", ["Evening Primrose + Nettle Leaf + Valerian + Wild Yam", "Flaxseed + Red Clover + Black Cohosh Root + Ginseng", "Motherwort + Passion Flower + Valerian"]],
  ["Respiratory Health", ["Kalmegh + Curcumin + Astragalus", "Ginger + Liquorice + Cardamom", "Kalmegh + Pippali + Vasaka"]],
  ["Vision", ["Goji Berry + Bilberry + Marigold + Carrot", "Fennel Seed + Bay Berry + Spinach"]],
  ["Digestive Health", ["Amla + Pippali + Ajwain", "Isabgol", "Ginger + Pudina + Fennel", "Liquorice + Fennel + Ajwain"]],
  ["Weight Management", ["Isabgol", "Garcinia Cambogia", "Green Tea + Garcinia Cambogia + Chitosan"]],
];

const manifest = {};
const missing = [];
const folderCache = new Map();

for (const [category, formulas] of catalog) {
  const folder = FOLDER_BY_CATEGORY[category];
  if (!folderCache.has(folder)) folderCache.set(folder, listImages(folder));
  const files = folderCache.get(folder);

  for (const formula of formulas) {
    const key = `${folder}|${formula}`;
    const stem =
      FORMULA_FILENAME[key] ??
      (files.has(formula) ? formula : undefined);
    let filename = null;
    if (stem && files.has(stem)) {
      filename = files.get(stem);
    } else if (files.has(formula)) {
      filename = files.get(formula);
    } else {
      // fuzzy: match by normalized stem
      for (const [fileStem, file] of files) {
        if (fileStem === formula || fileStem === FORMULA_FILENAME[key]) {
          filename = file;
          break;
        }
      }
    }

    if (!filename) {
      missing.push(`${category} → ${formula}`);
      continue;
    }

    manifest[key] = publicUrl(folder, filename);
  }
}

if (missing.length) {
  console.error("Missing images:");
  for (const m of missing) console.error(" ", m);
  process.exit(1);
}

const body = Object.entries(manifest)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, url]) => `  ${JSON.stringify(key)}: ${JSON.stringify(url)},`)
  .join("\n");

fs.writeFileSync(
  outFile,
  `/** Auto-generated by scripts/generate-herb-manifest.mjs — do not edit by hand */\nexport const HERB_PRODUCT_IMAGES: Record<string, string> = {\n${body}\n};\n`,
);

console.log(`Wrote ${Object.keys(manifest).length} entries to ${path.relative(root, outFile)}`);
