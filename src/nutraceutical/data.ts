import { publicAssetSrc } from "@/lib/publicAssetSrc";
import { NUTRA_PRODUCT_IMAGES } from "./imageManifest";

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

export function nutraProductImage(folder: string, formula: string): string {
  const src = NUTRA_PRODUCT_IMAGES[`${folder}|${formula}`] ?? "";
  return src ? publicAssetSrc(src) : "";
}

function slugify(...parts: string[]): string {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const f = (folder: string, formula: string): RawFormula => ({
  formula,
  image: nutraProductImage(folder, formula),
});

function buildCategories(raw: RawCategory[]): FormulaCategory[] {
  return raw
    .map((cat) => ({
      name: cat.name,
      categoryImage: cat.formulas.find((item) => item.image)?.image ?? "",
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
      f("Joint care", "Glucosamine"),
      f("Joint care", "Glucosamine + Ashwagandha Extract"),
      f("Joint care", "Glucosamine + Gingko Biloba Extract"),
      f("Joint care", "Glucosamine + Collagen Peptide"),
      f("Joint care", "Glucosamine + Methyl Sulphonyl Methane + Minerals"),
      f("Joint care", "Glucosamine + Curcumin Powder + Boswellia Extract"),
      f("Joint care", "Glucosamine + Chondroitin + Vitamins"),
      f("Joint care", "Glucosamine + Chondroitin + Hyaluronic Acid"),
      f("Joint care", "Glucosamine + Collagen + Vitamins + Minerals"),
      f("Joint care", "Glucosamine + Chondroitin + Methyl Sulphonyl Methane"),
      f("Joint care", "Glucosamine + Methyl Sulphonyl Methane + Minerals"),
      f("Joint care", "Glucosamine + Chondroitin + Vitamins + Minerals"),
      f("Joint care", "Glucosamine + Chondroitin + Methyl Sulphonyl Methane + Hyaluronic Acid"),
    ],
  },
  {
    name: "Bone Health",
    formulas: [
      f("Bone Health", "Coral Calcium + Vitamin D"),
      f("Bone Health", "Coral Calcium + Vitamin D + Vitamin B12"),
      f("Bone Health", "Coral Calcium + Vitamin D + Magnesium + Zinc"),
      f("Bone Health", "Calcium + Vitamin K2 7"),
      f("Bone Health", "Calcium + Calcitriol + Zinc"),
      f("Bone Health", "Calcium + Soy Isoflavone + Vitamin D"),
      f("Bone Health", "Glucosamine + Chondroitin + Calcium"),
      f("Bone Health", "Calcium + Magnesium + L-Lysine + Vitamin D"),
      f("Bone Health", "Calcium + Magnesium + Boron + Selenium + Copper + Vitamin D"),
    ],
  },
  {
    name: "Immunity Boosters",
    formulas: [
      f("Immunity Boosters", "Multiple Strains of Prebiotic + Probiotic"),
      f("Immunity Boosters", "Ashwagandha Extract + Shilajit + Beta Carotene + Vitamins"),
      f("Immunity Boosters", "L-Carnitine + Vitamins + Minerals"),
      f("Immunity Boosters", "Minerals + Folate + Vitamin C + Zinc + Selenium"),
      f("Immunity Boosters", "Lycopene + L-Lysine + L-Carnitine + Vitamin C + Vitamin E + Copper + Zinc"),
    ],
  },
  {
    name: "Respiratory Health",
    formulas: [
      f("Respiratory Health", "Citrus Bioflavonoid + Quercetin + Vitamin C + Vitamin D + Iron"),
      f("Respiratory Health", "Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc"),
    ],
  },
  {
    name: "Anti-Oxidants",
    formulas: [
      f("Anti oxidants", "Green Tea Extract + Grapeseed Extract + Vitamins"),
      f("Anti oxidants", "Acai Berry Powder + Vitamin C + Vitamin E + Selenium"),
      f("Anti oxidants", "Aloe Vera Extract + Betaine + L-Arginine + Vitamin C + Vitamin A + Vitamin E + Vitamin B3 + Zinc"),
    ],
  },
  {
    name: "Haematinic",
    formulas: [
      f("Haematinic", "Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc"),
      f("Haematinic", "Folic Acid + Vitamin B12 + Vitamin C"),
      f("Haematinic", "Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc"),
      f("Haematinic", "Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12"),
    ],
  },
  {
    name: "Heart Health",
    formulas: [
      f("Heart Health", "Ultra L-Carnitine + Alpha Lipoic Acid + Vitamins"),
      f("Heart Health", "Omega 3 + Lycopene + Garlic Powder + Plant Sterols"),
      f("Heart Health", "Co-Enzyme Q10 + L-Carnitine + Flaxseed Powder + Vitamin D + Folic Acid + Vitamin B12"),
    ],
  },
  {
    name: "Pregnancy Care",
    formulas: [
      f("Pregnancy Care", "Calcium + Magnesium + Vitamin D"),
      f("Pregnancy Care", "Vitamin B12 + Vitamin D + Zinc + Minerals"),
      f("Pregnancy Care", "Vitamin B12 + Folic Acid + Zinc + Selenium + Iodine + Iron"),
      f("Pregnancy Care", "Omega 3 DHA + Folic Acid + Vitamin D + Vitamin E + Vitamin K + Iodine"),
      f("Pregnancy Care", "Inositol + L-Arginine + Beta Carotene + Vitamin D + Folic Acid + Vitamin B6 + Vitamin B12 + Magnesium + Calcium"),
    ],
  },
  {
    name: "Female Fertility",
    formulas: [
      f("Female Fertility", "N-Acetylcysteine + L Arginine + Para Aminobenzoic Acid + Vitamin E + Zinc + Chromium"),
      f("Female Fertility", "Inositol + Para Aminobenzoic Acid + Vitamin C + Folic Acid + Vitamin B12"),
    ],
  },
  {
    name: "Male Fertility",
    formulas: [
      f("Male fertility", "Co-Enzyme Q10 + L-Carnitine + Glutathione + Vitamin B12 + Minerals"),
      f("Male fertility", "Ginseng Extract + L-Arginine + Lycopene + Vitamin C + Iron + Zinc"),
    ],
  },
  {
    name: "Diabetic Care",
    formulas: [
      f("Diabetic Care", "Fenugreek Powder + Vitamin B3 + Vitamin D + Chromium + Selenium"),
      f("Diabetic Care", "Cinnamon Extract + Bitter Gourd Extract + L-Carnitine + Vitamin D + Calcium Pantothenate + Chromium"),
    ],
  },
  {
    name: "Anti-Ageing",
    formulas: [
      f("Anti-Ageing", "L-Carnitine + Grapeseed Extract + Astaxanthin"),
      f("Anti-Ageing", "Cranberry Powder + Grapeseed Extract + Vitamin C + Vitamin E + Biotin"),
      f("Anti-Ageing", "Hyaluronic Acid + Biotin + Curcumin Powder + Pomegranate Extract + Vitamin A + Vitamin C"),
      f("Anti-Ageing", "Co-Enzyme Q10 + Hesperidin + Green Tea Extract + Vitamin A + Vitamin C + Vitamin E"),
    ],
  },
  {
    name: "Brain Health",
    formulas: [
      f("Brain health", "Valerian Extract + Phosphatidylcholine + Sage Extract + L-Arginine + Manganese"),
      f("Brain health", "Alpha Lipoic Acid + Chamomile Extract + Phosphatidylserine + L-Glutathione + Co-Enzyme Q10"),
      f("Brain health", "Ginkgo Biloba Extract + N-Acetylcysteine + 5-Hydroxy Tryptophan + Beta-Carotene + Manganese"),
    ],
  },
  {
    name: "Hair, Skin & Nails",
    formulas: [
      f("Hair, Skin & Nails", "Grapeseed Extract + Biotin + Selenium + Zinc"),
      f("Hair, Skin & Nails", "Marine Collagen + Keratin + Inositol + Blackcurrant Seed"),
      f("Hair, Skin & Nails", "Collagen + Phytosterols + Biotin + Selenium + Copper + Vitamins"),
      f("Hair, Skin & Nails", "Collagen + Lycopene + Grapeseed Extract + Green Tea Extract + Essential Vitamins + Minerals"),
      f("Hair, Skin & Nails", "Methionine + Lutein + Citrus Bioflavonoid + Collagen + Cranberry Extract + Alpha Lipoic Acid + Vitamin E + Boron"),
    ],
  },
  {
    name: "Vision",
    formulas: [
      f("Vision", "Zeaxanthin + Vitamin C + Vitamin A + Zinc"),
      f("Vision", "Bilberry Extract + Lutein + Beta Carotene + Vitamin B1 + Vitamin C"),
      f("Vision", "Citrus Bioflavonoid + Beta Carotene + Vitamin B3 + Vitamin A + Zinc"),
    ],
  },
  {
    name: "Liver Detox",
    formulas: [
      f("Liver Detox", "Milk Thistle + L-Glutathione + Dandelion Extract"),
      f("Liver Detox", "L-Carnitine + Inositol + Choline Bitartrate + Vitamin C"),
      f("Liver Detox", "Co-Enzyme Q10 + Milk Thistle + Astaxanthin + Calcium Pantothenate + Vitamin D + Selenium"),
    ],
  },
  {
    name: "Menopause",
    formulas: [
      f("Menopause", "Calcium + Soy Isoflavone + Vitamin D"),
      f("Menopause", "Sage Extract + Soy Isoflavone + Lignans + Magnesium + Zinc"),
      f("Menopause", "Para Aminobenzoic Acid + Green Tea Extract + Multi-Vitamins + Multi-Minerals"),
    ],
  },
  {
    name: "Geriatric Care",
    formulas: [
      f("Geriatric Care", "Ginseng Extract + Lecithin + Vitamins + Minerals"),
      f("Geriatric Care", "Omega 3 + Pomegranate Extract + Vitamin C + Magnesium + Zinc"),
      f("Geriatric Care", "Ginseng Extract + Vitamin B12 + Vitamin A + Vitamin C + Vitamin E + Selenium + Chromium"),
      f("Geriatric Care", "L-Carnitine + Biotin + Choline + Citrus Bioflavonoids + Multi-Vitamins + Minerals"),
    ],
  },
  {
    name: "Varicose Veins",
    formulas: [
      f("Varicose Veins", "Hesperidin + Grapeseed Extract + Vitamin C"),
      f("Varicose Veins", "Citrus Bioflavonoid + Lycopene + Vitamin A + Vitamin C"),
    ],
  },
  {
    name: "Kidney Health",
    formulas: [
      f("Kidney Health", "D-Mannose + Pomegranate Extract + L-Taurine + Vitamin D"),
      f("Kidney Health", "Cranberry Powder + N-Acetylcysteine + L-Carnitine + Vitamin C"),
    ],
  },
  {
    name: "Digestive Health",
    formulas: [
      f("Digestive Health", "Pre-biotic"),
      f("Digestive Health", "Pro-biotic"),
      f("Digestive Health", "Bromelain + Papain + Amylase"),
    ],
  },
  {
    name: "Weight Management",
    formulas: [
      f("Weight Management", "Whey Protein"),
      f("Weight Management", "Fenugreek + Green Coffee"),
    ],
  },
];

export const categories: FormulaCategory[] = buildCategories(rawCatalog);
