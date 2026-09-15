/**
 * Build herbaceutical + nutraceutical briefs; copy Organic overlaps into Herb.
 * node scripts/setup-herb-nutra-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const herbCatalog = [
  ["Joint care", "Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod"],
  ["Joint care", "Cat's Claw + Bromelain Extract + Ashwagandha Root"],
  ["Joint care", "Rosehip Powder + Ginger + Curcumin + Maca Root"],
  ["Joint care", "Guggul + Sea Buck Thorn + Schindra + Eucalyptus"],
  ["Joint care", "Burdock Root + Moringa Leaf + Willow Bark + Curcumin"],
  ["Immunity booster", "Astragalus Root + Aronia Berry + Maitake Mushroom + Holy Basil"],
  ["Immunity booster", "Neem Leaf + Morinda Citrifolia Fruit + Ashwagandha Root + Moringa Fruit"],
  ["Immunity booster", "American Ginseng + Kalmegh + Echinacea Root + Spirulina"],
  ["Immunity booster", "Curcumin + Moringa + Liquorice + Ashwagandha Root"],
  ["Hair,skin , nails", "Manjistha Stem + Propolis + Avocado Fruit"],
  ["Hair,skin , nails", "Aloe Vera + Bamboo Stem + Sesbania Grandiflora + Bearberry"],
  ["Hair,skin , nails", "Amla + Bhringraj + Brahmi + Grapeseed"],
  ["Hair,skin , nails", "Orange + Hibiscus + Gingko Biloba + Green Tea"],
  ["Anti Oxidents", "Elderberry + Green Tea + Beetroot"],
  ["Anti Oxidents", "Wheat Grass + Acai Berry + Raspberries + Papain"],
  ["Anti Oxidents", "Spirulina + Tart Cherry + Bacopa Monnieri"],
  ["Kidney Health", "Punarnava + Astragalus + Cranberry"],
  ["Kidney Health", "Horse Tail Herb + Birch Leaf + Tulsi Ark"],
  ["Kidney Health", "Manjistha + Amla + Fennel Seed + Celery"],
  ["Haematinic", "Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc"],
  ["Haematinic", "Folic Acid + Vitamin B12 + Vitamin C"],
  ["Haematinic", "Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc"],
  ["Haematinic", "Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12"],
  ["Heart Health", "Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark"],
  ["Heart Health", "Aronia Berry + Piperine + Maitake Mushroom"],
  ["Heart Health", "Arjuna + Guggul + Brahmi"],
  ["Heart Health", "Fenugreek Seed + Amla + Garlic Powder + Arjuna"],
  ["Brain Health", "Gingko Biloba + Bacopa Monnieri + Shankhpushpi"],
  ["Brain Health", "Rosemary Leaf + Gotu Kola + Curcumin + Vacha"],
  ["Brain Health", "Bacopa Monnieri + Rhodiola Rosea + Ginseng"],
  ["Female fertility", "Shatavari + Black Sesame Seed + Liquorice Root + Musta"],
  ["Female fertility", "Gokshuru + Holy Basil + Ashwagandha Root + Shalparni"],
  ["Female fertility", "Ashoka + Jeevanti + Punarnava + Guduchi"],
  ["male fertility", "Ashwagandha Root + Mucuna Pruriens + Safed Musli"],
  ["male fertility", "Muira Puama + Gokhru + Shilajit"],
  ["male fertility", "Shilajit + Ashwagandha Root + Ginseng"],
  ["Diabetic care", "Bitter Melon + Lucuma + Banaba Leaf"],
  ["Diabetic care", "Chitrak Root + Fenugreek Seed + Olive Leaf"],
  ["Diabetic care", "Prickly Pear Leaf + Mulberry Leaf + Cinnamon Bark"],
  ["Diabetic care", "Gymnema Leaf + Bilberry"],
  ["Liver Health", "Milk Thistle + Dandelion Root + Green Turmeric"],
  ["Liver Health", "Kutki + Schisandra Berry + Nigella Sativa"],
  ["Liver Health", "Milk Thistle + Artichoke Fruit + Myrobalan"],
  ["Menopause", "Evening Primrose + Nettle Leaf + Valerian + Wild Yam"],
  ["Menopause", "Flaxseed + Red Clover + Black Cohosh Root + Ginseng"],
  ["Menopause", "Motherwort + Passion Flower + Valerian"],
  ["Respiratory Health", "Kalmegh + Curcumin + Astragalus"],
  ["Respiratory Health", "Ginger + Liquorice + Cardamom"],
  ["Respiratory Health", "Kalmegh + Pippali + Vasaka"],
  ["Vision", "Goji Berry + Bilberry + Marigold + Carrot"],
  ["Vision", "Fennel Seed + Bay Berry + Spinach"],
  ["Digestive Health", "Amla + Pippali + Ajwain"],
  ["Digestive Health", "Isabgol"],
  ["Digestive Health", "Ginger + Pudina + Fennel"],
  ["Digestive Health", "Liquorice + Fennel + Ajwain"],
  ["Weight management", "Isabgol"],
  ["Weight management", "Garcinia Cambogia"],
  ["Weight management", "Green Tea + Garcinia Cambogia + Chitosan"],
];

const nutraCatalog = [
  ["Joint care", "Glucosamine"],
  ["Joint care", "Glucosamine + Ashwagandha Extract"],
  ["Joint care", "Glucosamine + Gingko Biloba Extract"],
  ["Joint care", "Glucosamine + Collagen Peptide"],
  ["Joint care", "Glucosamine + Methyl Sulphonyl Methane + Minerals"],
  ["Joint care", "Glucosamine + Curcumin Powder + Boswellia Extract"],
  ["Joint care", "Glucosamine + Chondroitin + Vitamins"],
  ["Joint care", "Glucosamine + Chondroitin + Hyaluronic Acid"],
  ["Joint care", "Glucosamine + Collagen + Vitamins + Minerals"],
  ["Joint care", "Glucosamine + Chondroitin + Methyl Sulphonyl Methane"],
  ["Joint care", "Glucosamine + Chondroitin + Vitamins + Minerals"],
  ["Joint care", "Glucosamine + Chondroitin + Methyl Sulphonyl Methane + Hyaluronic Acid"],
  ["Bone Health", "Coral Calcium + Vitamin D"],
  ["Bone Health", "Coral Calcium + Vitamin D + Vitamin B12"],
  ["Bone Health", "Coral Calcium + Vitamin D + Magnesium + Zinc"],
  ["Bone Health", "Calcium + Vitamin K2 7"],
  ["Bone Health", "Calcium + Calcitriol + Zinc"],
  ["Bone Health", "Calcium + Soy Isoflavone + Vitamin D"],
  ["Bone Health", "Glucosamine + Chondroitin + Calcium"],
  ["Bone Health", "Calcium + Magnesium + L-Lysine + Vitamin D"],
  ["Bone Health", "Calcium + Magnesium + Boron + Selenium + Copper + Vitamin D"],
  ["Immunity Boosters", "Multiple Strains of Prebiotic + Probiotic"],
  ["Immunity Boosters", "Ashwagandha Extract + Shilajit + Beta Carotene + Vitamins"],
  ["Immunity Boosters", "L-Carnitine + Vitamins + Minerals"],
  ["Immunity Boosters", "Minerals + Folate + Vitamin C + Zinc + Selenium"],
  ["Immunity Boosters", "Lycopene + L-Lysine + L-Carnitine + Vitamin C + Vitamin E + Copper + Zinc"],
  ["Respiratory Health", "Citrus Bioflavonoid + Quercetin + Vitamin C + Vitamin D + Iron"],
  ["Respiratory Health", "Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc"],
  ["Anti oxidants", "Green Tea Extract + Grapeseed Extract + Vitamins"],
  ["Anti oxidants", "Acai Berry Powder + Vitamin C + Vitamin E + Selenium"],
  ["Anti oxidants", "Aloe Vera Extract + Betaine + L-Arginine + Vitamin C + Vitamin A + Vitamin E + Vitamin B3 + Zinc"],
  ["Haematinic", "Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc"],
  ["Haematinic", "Folic Acid + Vitamin B12 + Vitamin C"],
  ["Haematinic", "Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc"],
  ["Haematinic", "Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12"],
  ["Heart Health", "Ultra L-Carnitine + Alpha Lipoic Acid + Vitamins"],
  ["Heart Health", "Omega 3 + Lycopene + Garlic Powder + Plant Sterols"],
  ["Heart Health", "Co-Enzyme Q10 + L-Carnitine + Flaxseed Powder + Vitamin D + Folic Acid + Vitamin B12"],
  ["Pregnancy Care", "Calcium + Magnesium + Vitamin D"],
  ["Pregnancy Care", "Vitamin B12 + Vitamin D + Zinc + Minerals"],
  ["Pregnancy Care", "Vitamin B12 + Folic Acid + Zinc + Selenium + Iodine + Iron"],
  ["Pregnancy Care", "Omega 3 DHA + Folic Acid + Vitamin D + Vitamin E + Vitamin K + Iodine"],
  ["Pregnancy Care", "Inositol + L-Arginine + Beta Carotene + Vitamin D + Folic Acid + Vitamin B6 + Vitamin B12 + Magnesium + Calcium"],
  ["Female Fertility", "N-Acetylcysteine + L Arginine + Para Aminobenzoic Acid + Vitamin E + Zinc + Chromium"],
  ["Female Fertility", "Inositol + Para Aminobenzoic Acid + Vitamin C + Folic Acid + Vitamin B12"],
  ["Male fertility", "Co-Enzyme Q10 + L-Carnitine + Glutathione + Vitamin B12 + Minerals"],
  ["Male fertility", "Ginseng Extract + L-Arginine + Lycopene + Vitamin C + Iron + Zinc"],
  ["Diabetic Care", "Fenugreek Powder + Vitamin B3 + Vitamin D + Chromium + Selenium"],
  ["Diabetic Care", "Cinnamon Extract + Bitter Gourd Extract + L-Carnitine + Vitamin D + Calcium Pantothenate + Chromium"],
  ["Anti-Ageing", "L-Carnitine + Grapeseed Extract + Astaxanthin"],
  ["Anti-Ageing", "Cranberry Powder + Grapeseed Extract + Vitamin C + Vitamin E + Biotin"],
  ["Anti-Ageing", "Hyaluronic Acid + Biotin + Curcumin Powder + Pomegranate Extract + Vitamin A + Vitamin C"],
  ["Anti-Ageing", "Co-Enzyme Q10 + Hesperidin + Green Tea Extract + Vitamin A + Vitamin C + Vitamin E"],
  ["Brain health", "Valerian Extract + Phosphatidylcholine + Sage Extract + L-Arginine + Manganese"],
  ["Brain health", "Alpha Lipoic Acid + Chamomile Extract + Phosphatidylserine + L-Glutathione + Co-Enzyme Q10"],
  ["Brain health", "Ginkgo Biloba Extract + N-Acetylcysteine + 5-Hydroxy Tryptophan + Beta-Carotene + Manganese"],
  ["Hair, Skin & Nails", "Grapeseed Extract + Biotin + Selenium + Zinc"],
  ["Hair, Skin & Nails", "Marine Collagen + Keratin + Inositol + Blackcurrant Seed"],
  ["Hair, Skin & Nails", "Collagen + Phytosterols + Biotin + Selenium + Copper + Vitamins"],
  ["Hair, Skin & Nails", "Collagen + Lycopene + Grapeseed Extract + Green Tea Extract + Essential Vitamins + Minerals"],
  ["Hair, Skin & Nails", "Methionine + Lutein + Citrus Bioflavonoid + Collagen + Cranberry Extract + Alpha Lipoic Acid + Vitamin E + Boron"],
  ["Vision", "Zeaxanthin + Vitamin C + Vitamin A + Zinc"],
  ["Vision", "Bilberry Extract + Lutein + Beta Carotene + Vitamin B1 + Vitamin C"],
  ["Vision", "Citrus Bioflavonoid + Beta Carotene + Vitamin B3 + Vitamin A + Zinc"],
  ["Liver Detox", "Milk Thistle + L-Glutathione + Dandelion Extract"],
  ["Liver Detox", "L-Carnitine + Inositol + Choline Bitartrate + Vitamin C"],
  ["Liver Detox", "Co-Enzyme Q10 + Milk Thistle + Astaxanthin + Calcium Pantothenate + Vitamin D + Selenium"],
  ["Menopause", "Calcium + Soy Isoflavone + Vitamin D"],
  ["Menopause", "Sage Extract + Soy Isoflavone + Lignans + Magnesium + Zinc"],
  ["Menopause", "Para Aminobenzoic Acid + Green Tea Extract + Multi-Vitamins + Multi-Minerals"],
  ["geiragtic care", "Ginseng Extract + Lecithin + Vitamins + Minerals"],
  ["geiragtic care", "Omega 3 + Pomegranate Extract + Vitamin C + Magnesium + Zinc"],
  ["geiragtic care", "Ginseng Extract + Vitamin B12 + Vitamin A + Vitamin C + Vitamin E + Selenium + Chromium"],
  ["geiragtic care", "L-Carnitine + Biotin + Choline + Citrus Bioflavonoids + Multi-Vitamins + Minerals"],
  ["varicouse veins", "Hesperidin + Grapeseed Extract + Vitamin C"],
  ["varicouse veins", "Citrus Bioflavonoid + Lycopene + Vitamin A + Vitamin C"],
  ["kidney health", "D-Mannose + Pomegranate Extract + L-Taurine + Vitamin D"],
  ["kidney health", "Cranberry Powder + N-Acetylcysteine + L-Carnitine + Vitamin C"],
  ["digestive health", "Pre-biotic"],
  ["digestive health", "Pro-biotic"],
  ["digestive health", "Bromelain + Papain + Amylase"],
  ["weight management", "Whey Protein"],
  ["weight management", "Fenugreek + Green Coffee"],
];

function leadOf(formula) {
  return formula.split(" + ")[0].trim();
}

function secondaryOf(formula) {
  const parts = formula.split(" + ").map((s) => s.trim());
  return parts.slice(1).map((p) => `+ ${p}`).join(" ");
}

function buildProducts(range, catalog) {
  return catalog.map(([folder, formula], i) => ({
    id: i + 1,
    range,
    folder,
    formula,
    lead: leadOf(formula),
    secondary: secondaryOf(formula),
    status: "pending",
    outPath: `public/product-images/${range}-review/${folder}/${formula}.webp`,
    livePath: `public/product-images/${range}/${folder}/${formula}.webp`,
  }));
}

const herb = buildProducts("Herbaceutical", herbCatalog);
const nutra = buildProducts("Nutraceutical", nutraCatalog);

// Index Organic images by formula filename
const organicRoot = path.join(root, "public/product-images/Organic");
const organicByFormula = new Map();
for (const folder of fs.readdirSync(organicRoot)) {
  const dir = path.join(organicRoot, folder);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".webp")) continue;
    const formula = file.replace(/\.webp$/i, "");
    organicByFormula.set(formula, path.join(dir, file));
  }
}

let copied = 0;
let needGenHerb = [];
for (const p of herb) {
  const reviewDir = path.join(root, "public/product-images/Herbaceutical-review", p.folder);
  fs.mkdirSync(reviewDir, { recursive: true });
  const dest = path.join(reviewDir, `${p.formula}.webp`);
  const src = organicByFormula.get(p.formula);
  if (src && fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    p.status = "copied_from_organic";
    p.source = src;
    copied++;
  } else {
    needGenHerb.push(p);
  }
}

for (const p of nutra) {
  const reviewDir = path.join(root, "public/product-images/Nutraceutical-review", p.folder);
  fs.mkdirSync(reviewDir, { recursive: true });
}

const out = {
  version: 1,
  generatedAt: new Date().toISOString(),
  style: "Same as Organic v5: amber packer bottle, colorful label, teal Zephyr logo, lifestyle props, NO capsule/tablet counts",
  herbaceutical: herb,
  nutraceutical: nutra,
  herbNeedGenerate: needGenHerb.map((p) => ({ id: p.id, folder: p.folder, formula: p.formula, lead: p.lead })),
  nutraNeedGenerate: nutra.map((p) => ({ id: p.id, folder: p.folder, formula: p.formula, lead: p.lead })),
};

fs.writeFileSync(
  path.join(root, "scripts/herb-nutra-image-briefs.json"),
  JSON.stringify(out, null, 2),
);

console.log(`Organic formula index: ${organicByFormula.size}`);
console.log(`Herb: ${herb.length} total, ${copied} copied from Organic, ${needGenHerb.length} to generate`);
console.log(`Nutra: ${nutra.length} to generate`);
console.log("Herb remaining:");
needGenHerb.forEach((p) => console.log(`  - [${p.folder}] ${p.formula}`));
