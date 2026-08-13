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
  heroImage: string;
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

const IMG = "/homepage/nutra-bottle.webp";
const CATEGORY_IMAGE = IMG;
const f = (formula: string): RawFormula => ({ formula, image: IMG });

function buildCategories(raw: RawCategory[]): FormulaCategory[] {
  return raw
    .map((cat) => ({
      name: cat.name,
      categoryImage: CATEGORY_IMAGE,
      formulas: cat.formulas.map((item, index) => ({
        id: slugify("nutraceutical", cat.name, String(index), item.formula.slice(0, 40)),
        formula: item.formula,
        image: item.image,
      })),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const theme: RangeTheme = {
  title: "Nutraceutical Products",
  subtitle: "Dietary supplement manufacturing for private-label partners",
  accent: "#4AA3A7",
  accentSoft: "#E9F6F7",
  bg: "#edf6fb",
  border: "#2f6f8f",
  heroImage: "/Generated/production-compression.png",
  overlay: "rgba(237,246,251,0.92)",
};

const rawCatalog: RawCategory[] = [
  {
    name: "Joint Pain",
    formulas: [
      f("Glucosamine"),
      f("Glucosamine + Ashwagandha Extract"),
      f("Glucosamine + Gingko Biloba Extract"),
      f("Glucosamine + Collagen Peptide"),
      f("Glucosamine + Methyl Sulphonyl Methane + Minerals"),
      f("Glucosamine + Curcumin Powder + Boswellia Extract"),
      f("Glucosamine + Chondroitin + Vitamins"),
      f("Glucosamine + Chondroitin + Hyaluronic Acid"),
      f("Glucosamine + Collagen + Vitamins + Minerals"),
      f("Glucosamine + Chondroitin + Methyl Sulphonyl Methane"),
      f("Glucosamine + Methyl Sulphonyl Methane + Minerals"),
      f("Glucosamine + Chondroitin + Vitamins + Minerals"),
      f("Glucosamine + Chondroitin + Methyl Sulphonyl Methane + Hyaluronic Acid"),
    ],
  },
  {
    name: "Bone Health",
    formulas: [
      f("Coral Calcium + Vitamin D"),
      f("Coral Calcium + Vitamin D + Vitamin B12"),
      f("Coral Calcium + Vitamin D + Magnesium + Zinc"),
      f("Calcium + Vitamin K2 7"),
      f("Calcium + Calcitriol + Zinc"),
      f("Calcium + Soy Isoflavone + Vitamin D"),
      f("Glucosamine + Chondroitin + Calcium"),
      f("Calcium + Magnesium + L-Lysine + Vitamin D"),
      f("Calcium + Magnesium + Boron + Selenium + Copper + Vitamin D"),
    ],
  },
  {
    name: "Immunity Boosters",
    formulas: [
      f("Multiple Strains of Prebiotic + Probiotic"),
      f("Ashwagandha Extract + Shilajit + Beta Carotene + Vitamins"),
      f("L-Carnitine + Vitamins + Minerals"),
      f("Minerals + Folate + Vitamin C + Zinc + Selenium"),
      f("Lycopene + L-Lysine + L-Carnitine + Vitamin C + Vitamin E + Copper + Zinc"),
    ],
  },
  {
    name: "Respiratory Health",
    formulas: [
      f("Citrus Bioflavonoid + Quercetin + Vitamin C + Vitamin D + Iron"),
      f("Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc"),
    ],
  },
  {
    name: "Anti-Oxidants",
    formulas: [
      f("Green Tea Extract + Grapeseed Extract + Vitamins"),
      f("Acai Berry Powder + Vitamin C + Vitamin E + Selenium"),
      f("Aloe Vera Extract + Betaine + L-Arginine + Vitamin C + Vitamin A + Vitamin E + Vitamin B3 + Zinc"),
    ],
  },
  {
    name: "Haematinic",
    formulas: [
      f("Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc"),
      f("Folic Acid + Vitamin B12 + Vitamin C"),
      f("Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc"),
      f("Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12"),
    ],
  },
  {
    name: "Heart Health",
    formulas: [
      f("Ultra L-Carnitine + Alpha Lipoic Acid + Vitamins"),
      f("Omega 3 + Lycopene + Garlic Powder + Plant Sterols"),
      f("Co-Enzyme Q10 + L-Carnitine + Flaxseed Powder + Vitamin D + Folic Acid + Vitamin B12"),
    ],
  },
  {
    name: "Pregnancy Care",
    formulas: [
      f("Calcium + Magnesium + Vitamin D"),
      f("Vitamin B12 + Vitamin D + Zinc + Minerals"),
      f("Vitamin B12 + Folic Acid + Zinc + Selenium + Iodine + Iron"),
      f("Omega 3 DHA + Folic Acid + Vitamin D + Vitamin E + Vitamin K + Iodine"),
      f("Inositol + L-Arginine + Beta Carotene + Vitamin D + Folic Acid + Vitamin B6 + Vitamin B12 + Magnesium + Calcium"),
    ],
  },
  {
    name: "Female Fertility",
    formulas: [
      f("N-Acetylcysteine + L Arginine + Para Aminobenzoic Acid + Vitamin E + Zinc + Chromium"),
      f("Inositol + Para Aminobenzoic Acid + Vitamin C + Folic Acid + Vitamin B12"),
    ],
  },
  {
    name: "Male Fertility",
    formulas: [
      f("Co-Enzyme Q10 + L-Carnitine + Glutathione + Vitamin B12 + Minerals"),
      f("Ginseng Extract + L-Arginine + Lycopene + Vitamin C + Iron + Zinc"),
    ],
  },
  {
    name: "Diabetic Care",
    formulas: [
      f("Fenugreek Powder + Vitamin B3 + Vitamin D + Chromium + Selenium"),
      f("Cinnamon Extract + Bitter Gourd Extract + L-Carnitine + Vitamin D + Calcium Pantothenate + Chromium"),
    ],
  },
  {
    name: "Anti-Ageing",
    formulas: [
      f("L-Carnitine + Grapeseed Extract + Astaxanthin"),
      f("Cranberry Powder + Grapeseed Extract + Vitamin C + Vitamin E + Biotin"),
      f("Hyaluronic Acid + Biotin + Curcumin Powder + Pomegranate Extract + Vitamin A + Vitamin C"),
      f("Co-Enzyme Q10 + Hesperidin + Green Tea Extract + Vitamin A + Vitamin C + Vitamin E"),
    ],
  },
  {
    name: "Brain Health",
    formulas: [
      f("Valerian Extract + Phosphatidylcholine + Sage Extract + L-Arginine + Manganese"),
      f("Alpha Lipoic Acid + Chamomile Extract + Phosphatidylserine + L-Glutathione + Co-Enzyme Q10"),
      f("Ginkgo Biloba Extract + N-Acetylcysteine + 5-Hydroxy Tryptophan + Beta-Carotene + Manganese"),
    ],
  },
  {
    name: "Hair, Skin & Nails",
    formulas: [
      f("Grapeseed Extract + Biotin + Selenium + Zinc"),
      f("Marine Collagen + Keratin + Inositol + Blackcurrant Seed"),
      f("Collagen + Phytosterols + Biotin + Selenium + Copper + Vitamins"),
      f("Collagen + Lycopene + Grapeseed Extract + Green Tea Extract + Essential Vitamins + Minerals"),
      f("Methionine + Lutein + Citrus Bioflavonoid + Collagen + Cranberry Extract + Alpha Lipoic Acid + Vitamin E + Boron"),
    ],
  },
  {
    name: "Vision",
    formulas: [
      f("Zeaxanthin + Vitamin C + Vitamin A + Zinc"),
      f("Bilberry Extract + Lutein + Beta Carotene + Vitamin B1 + Vitamin C"),
      f("Citrus Bioflavonoid + Beta Carotene + Vitamin B3 + Vitamin A + Zinc"),
    ],
  },
  {
    name: "Liver Detox",
    formulas: [
      f("Milk Thistle + L-Glutathione + Dandelion Extract"),
      f("L-Carnitine + Inositol + Choline Bitartrate + Vitamin C"),
      f("Co-Enzyme Q10 + Milk Thistle + Astaxanthin + Calcium Pantothenate + Vitamin D + Selenium"),
    ],
  },
  {
    name: "Menopause",
    formulas: [
      f("Calcium + Soy Isoflavone + Vitamin D"),
      f("Sage Extract + Soy Isoflavone + Lignans + Magnesium + Zinc"),
      f("Para Aminobenzoic Acid + Green Tea Extract + Multi-Vitamins + Multi-Minerals"),
    ],
  },
  {
    name: "Geriatric Care",
    formulas: [
      f("Ginseng Extract + Lecithin + Vitamins + Minerals"),
      f("Omega 3 + Pomegranate Extract + Vitamin C + Magnesium + Zinc"),
      f("Ginseng Extract + Vitamin B12 + Vitamin A + Vitamin C + Vitamin E + Selenium + Chromium"),
      f("L-Carnitine + Biotin + Choline + Citrus Bioflavonoids + Multi-Vitamins + Minerals"),
    ],
  },
  {
    name: "Varicose Veins",
    formulas: [
      f("Hesperidin + Grapeseed Extract + Vitamin C"),
      f("Citrus Bioflavonoid + Lycopene + Vitamin A + Vitamin C"),
    ],
  },
  {
    name: "Kidney Health",
    formulas: [
      f("D-Mannose + Pomegranate Extract + L-Taurine + Vitamin D"),
      f("Cranberry Powder + N-Acetylcysteine + L-Carnitine + Vitamin C"),
    ],
  },
  {
    name: "Digestive Health",
    formulas: [
      f("Pre-biotic"),
      f("Pro-biotic"),
      f("Bromelain + Papain + Amylase"),
    ],
  },
  {
    name: "Weight Management",
    formulas: [f("Whey Protein"), f("Fenugreek + Green Coffee")],
  },
];

export const categories: FormulaCategory[] = buildCategories(rawCatalog);
