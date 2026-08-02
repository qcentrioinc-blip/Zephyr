export interface FormulaItem {
  id: string;
  formula: string;
  image: string;
}

export interface FormulaCategory {
  name: string;
  categoryImage: string;
  formulas: FormulaItem[];
}

export interface RangeTheme {
  title: string;
  subtitle: string;
  accent: string;
  accentSoft: string;
  bg: string;
  border: string;
  /** Full-bleed hero photo */
  heroImage: string;
  /** Overlay so headline/body stay readable over the photo */
  overlay: string;
}

interface RawFormula {
  formula: string;
  image: string;
}

interface RawCategory {
  name: string;
  formulas: RawFormula[];
}

function slugify(...parts: string[]): string {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const CATEGORY_IMAGE = "/Homepage/NutraBottle.png";

function buildCategories(raw: RawCategory[]): FormulaCategory[] {
  return raw.map((cat) => ({
    name: cat.name,
    categoryImage: CATEGORY_IMAGE,
    formulas: cat.formulas.map((item, index) => ({
      id: slugify("nutraceutical", cat.name, String(index), item.formula.slice(0, 40)),
      formula: item.formula,
      image: item.image,
    })),
  }));
}

export const theme: RangeTheme = {
  title: "Nutraceutical Products",
  subtitle: "Science. Nutrition. Private label partnerships.",
  accent: "#4AA3A7",
  accentSoft: "#E9F6F7",
  bg: "#edf6fb",
  border: "#2f6f8f",
  heroImage: "/Generated/production-compression.png",
  overlay: "rgba(237,246,251,0.92)",
};

const rawCatalog: RawCategory[] = [
  {
    name: "Joint Care",
    formulas: [
      { formula: "Glucosamine", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Ashwagandha Extract", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Gingko Biloba Extract", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Collagen Peptide", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Methyl Sulphonyl Methane + Minerals", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Curcumin Powder + Boswellia Extract", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Chondroitin + Vitamins", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Chondroitin + Hyaluronic Acid", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Collagen + Vitamins + Minerals", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Chondroitin + Methyl Sulphonyl Methane", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Methyl Sulphonyl Methane + Minerals", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Chondroitin + Vitamins + Minerals", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Chondroitin + Methyl Sulphonyl Methane + Hyaluronic Acid", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Bone Health",
    formulas: [
      { formula: "Coral Calcium + Vitamin D", image: "/Homepage/NutraBottle.png" },
      { formula: "Coral Calcium + Vitamin D + Vitamin B12", image: "/Homepage/NutraBottle.png" },
      { formula: "Coral Calcium + Vitamin D + Magnesium + Zinc", image: "/Homepage/NutraBottle.png" },
      { formula: "Calcium + Vitamin K2 7", image: "/Homepage/NutraBottle.png" },
      { formula: "Calcium + Calcitriol + Zinc", image: "/Homepage/NutraBottle.png" },
      { formula: "Calcium + Soy Isoflavone + Vitamin D", image: "/Homepage/NutraBottle.png" },
      { formula: "Glucosamine + Chondroitin + Calcium", image: "/Homepage/NutraBottle.png" },
      { formula: "Calcium + Magnesium + L-Lysine + Vitamin D", image: "/Homepage/NutraBottle.png" },
      { formula: "Calcium + Magnesium + Boron + Selenium + Copper + Vitamin D", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Immunity Boosters",
    formulas: [
      { formula: "Multiple Strains of Prebiotic + Probiotic", image: "/Homepage/NutraBottle.png" },
      { formula: "Ashwagandha Extract + Shilajit + Beta Carotene + Vitamins", image: "/Homepage/NutraBottle.png" },
      { formula: "L-Carnitine + Vitamins + Minerals", image: "/Homepage/NutraBottle.png" },
      { formula: "Minerals + Folate + Vitamin C + Zinc + Selenium", image: "/Homepage/NutraBottle.png" },
      { formula: "Lycopene + L-Lysine + L-Carnitine + Vitamin C + Vitamin E + Copper + Zinc", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Respiratory Health",
    formulas: [
      { formula: "Citrus Bioflavonoid + Quercetin + Vitamin C + Vitamin D + Iron", image: "/Homepage/NutraBottle.png" },
      { formula: "Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Anti-Oxidants",
    formulas: [
      { formula: "Green Tea Extract + Grapeseed Extract + Vitamins", image: "/Homepage/NutraBottle.png" },
      { formula: "Acai Berry Powder + Vitamin C + Vitamin E + Selenium", image: "/Homepage/NutraBottle.png" },
      { formula: "Aloe Vera Extract + Betaine + L-Arginine + Vitamin C + Vitamin A + Vitamin E + Vitamin B3 + Zinc", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Haematinic",
    formulas: [
      { formula: "Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc", image: "/Homepage/NutraBottle.png" },
      { formula: "Folic Acid + Vitamin B12 + Vitamin C", image: "/Homepage/NutraBottle.png" },
      { formula: "Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc", image: "/Homepage/NutraBottle.png" },
      { formula: "Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Heart Health",
    formulas: [
      { formula: "Ultra L-Carnitine + Alpha Lipoic Acid + Vitamins", image: "/Homepage/NutraBottle.png" },
      { formula: "Omega 3 + Lycopene + Garlic Powder + Plant Sterols", image: "/Homepage/NutraBottle.png" },
      { formula: "Co-Enzyme Q10 + L-Carnitine + Flaxseed Powder + Vitamin D + Folic Acid + Vitamin B12", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Pregnancy Care",
    formulas: [
      { formula: "Calcium + Magnesium + Vitamin D", image: "/Homepage/NutraBottle.png" },
      { formula: "Vitamin B12 + Vitamin D + Zinc + Minerals", image: "/Homepage/NutraBottle.png" },
      { formula: "Vitamin B12 + Folic Acid + Zinc + Selenium + Iodine + Iron", image: "/Homepage/NutraBottle.png" },
      { formula: "Omega 3 DHA + Folic Acid + Vitamin D + Vitamin E + Vitamin K + Iodine", image: "/Homepage/NutraBottle.png" },
      { formula: "Inositol + L-Arginine + Beta Carotene + Vitamin D + Folic Acid + Vitamin B6 + Vitamin B12 + Magnesium + Calcium", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Female Fertility",
    formulas: [
      { formula: "N-Acetylcysteine + L Arginine + Para Aminobenzoic Acid + Vitamin E + Zinc + Chromium", image: "/Homepage/NutraBottle.png" },
      { formula: "Inositol + Para Aminobenzoic Acid + Vitamin C + Folic Acid + Vitamin B12", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Male Fertility",
    formulas: [
      { formula: "Co-Enzyme Q10 + L-Carnitine + Glutathione + Vitamin B12 + Minerals", image: "/Homepage/NutraBottle.png" },
      { formula: "Ginseng Extract + L-Arginine + Lycopene + Vitamin C + Iron + Zinc", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Diabetic Care",
    formulas: [
      { formula: "Fenugreek Powder + Vitamin B3 + Vitamin D + Chromium + Selenium", image: "/Homepage/NutraBottle.png" },
      { formula: "Cinnamon Extract + Bitter Gourd Extract + L-Carnitine + Vitamin D + Calcium Pantothenate + Chromium", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Anti-Ageing",
    formulas: [
      { formula: "L-Carnitine + Grapeseed Extract + Astaxanthin", image: "/Homepage/NutraBottle.png" },
      { formula: "Cranberry Powder + Grapeseed Extract + Vitamin C + Vitamin E + Biotin", image: "/Homepage/NutraBottle.png" },
      { formula: "Hyaluronic Acid + Biotin + Curcumin Powder + Pomegranate Extract + Vitamin A + Vitamin C", image: "/Homepage/NutraBottle.png" },
      { formula: "Co-Enzyme Q10 + Hesperidin + Green Tea Extract + Vitamin A + Vitamin C + Vitamin E", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Brain Health",
    formulas: [
      { formula: "Valerian Extract + Phosphatidylcholine + Sage Extract + L-Arginine + Manganese", image: "/Homepage/NutraBottle.png" },
      { formula: "Alpha Lipoic Acid + Chamomile Extract + Phosphatidylserine + L-Glutathione + Co-Enzyme Q10", image: "/Homepage/NutraBottle.png" },
      { formula: "Ginkgo Biloba Extract + N-Acetylcysteine + 5-Hydroxy Tryptophan + Beta-Carotene + Manganese", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Hair, Skin & Nails",
    formulas: [
      { formula: "Grapeseed Extract + Biotin + Selenium + Zinc", image: "/Homepage/NutraBottle.png" },
      { formula: "Marine Collagen + Keratin + Inositol + Blackcurrant Seed", image: "/Homepage/NutraBottle.png" },
      { formula: "Collagen + Phytosterols + Biotin + Selenium + Copper + Vitamins", image: "/Homepage/NutraBottle.png" },
      { formula: "Collagen + Lycopene + Grapeseed Extract + Green Tea Extract + Essential Vitamins + Minerals", image: "/Homepage/NutraBottle.png" },
      { formula: "Methionine + Lutein + Citrus Bioflavonoid + Collagen + Cranberry Extract + Alpha Lipoic Acid + Vitamin E + Boron", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Vision",
    formulas: [
      { formula: "Zeaxanthin + Vitamin C + Vitamin A + Zinc", image: "/Homepage/NutraBottle.png" },
      { formula: "Bilberry Extract + Lutein + Beta Carotene + Vitamin B1 + Vitamin C", image: "/Homepage/NutraBottle.png" },
      { formula: "Citrus Bioflavonoid + Beta Carotene + Vitamin B3 + Vitamin A + Zinc", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Liver Detox",
    formulas: [
      { formula: "Milk Thistle + L-Glutathione + Dandelion Extract", image: "/Homepage/NutraBottle.png" },
      { formula: "L-Carnitine + Inositol + Choline Bitartrate + Vitamin C", image: "/Homepage/NutraBottle.png" },
      { formula: "Co-Enzyme Q10 + Milk Thistle + Astaxanthin + Calcium Pantothenate + Vitamin D + Selenium", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Menopause",
    formulas: [
      { formula: "Calcium + Soy Isoflavone + Vitamin D", image: "/Homepage/NutraBottle.png" },
      { formula: "Sage Extract + Soy Isoflavone + Lignans + Magnesium + Zinc", image: "/Homepage/NutraBottle.png" },
      { formula: "Para Aminobenzoic Acid + Green Tea Extract + Multi-Vitamins + Multi-Minerals", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Geriatric Care",
    formulas: [
      { formula: "Ginseng Extract + Lecithin + Vitamins + Minerals", image: "/Homepage/NutraBottle.png" },
      { formula: "Omega 3 + Pomegranate Extract + Vitamin C + Magnesium + Zinc", image: "/Homepage/NutraBottle.png" },
      { formula: "Ginseng Extract + Vitamin B12 + Vitamin A + Vitamin C + Vitamin E + Selenium + Chromium", image: "/Homepage/NutraBottle.png" },
      { formula: "L-Carnitine + Biotin + Choline + Citrus Bioflavonoids + Multi-Vitamins + Minerals", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Varicose Veins",
    formulas: [
      { formula: "Hesperidin + Grapeseed Extract + Vitamin C", image: "/Homepage/NutraBottle.png" },
      { formula: "Citrus Bioflavonoid + Lycopene + Vitamin A + Vitamin C", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Kidney Health",
    formulas: [
      { formula: "D-Mannose + Pomegranate Extract + L-Taurine + Vitamin D", image: "/Homepage/NutraBottle.png" },
      { formula: "Cranberry Powder + N-Acetylcysteine + L-Carnitine + Vitamin C", image: "/Homepage/NutraBottle.png" },
    ],
  },
  {
    name: "Digestive Health",
    formulas: [],
  },
  {
    name: "Weight Management",
    formulas: [],
  },
];

export const categories: FormulaCategory[] = buildCategories(rawCatalog);
