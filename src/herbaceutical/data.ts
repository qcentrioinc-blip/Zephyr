import { HERB_PRODUCT_IMAGES } from "./imageManifest";

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

export function herbProductImage(folder: string, formula: string): string {
  return HERB_PRODUCT_IMAGES[`${folder}|${formula}`] ?? "";
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
  image: herbProductImage(folder, formula),
});

function buildCategories(raw: RawCategory[]): FormulaCategory[] {
  return raw
    .map((cat) => ({
      name: cat.name,
      categoryImage: cat.formulas.find((item) => item.image)?.image ?? "",
      formulas: cat.formulas.map((item, index) => ({
        id: slugify("herbaceutical", cat.name, String(index), item.formula.slice(0, 40)),
        formula: item.formula,
        image: item.image,
      })),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const theme: RangeTheme = {
  title: "Herbaceutical Products",
  subtitle: "Botanical supplement manufacturing to commercial standards",
  accent: "#C38046",
  accentSoft: "#FCF8F2",
  bg: "#fbf3e5",
  border: "#8a5a2b",
  heroImage: "/Generated/rd-lab-bench.png",
  overlay: "rgba(251,243,229,0.92)",
};

const rawCatalog: RawCategory[] = [
  {
    name: "Joint Care",
    formulas: [
      f("Joint care", "Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod"),
      f("Joint care", "Cat's Claw + Bromelain Extract + Ashwagandha Root"),
      f("Joint care", "Rosehip Powder + Ginger + Curcumin + Maca Root"),
      f("Joint care", "Guggul + Sea Buck Thorn + Schindra + Eucalyptus"),
      f("Joint care", "Burdock Root + Moringa Leaf + Willow Bark + Curcumin"),
    ],
  },
  {
    name: "Immunity Boosters",
    formulas: [
      f("Immunity booster", "Astragalus Root + Aronia Berry + Maitake Mushroom + Holy Basil"),
      f("Immunity booster", "Neem Leaf + Morinda Citrifolia Fruit + Ashwagandha Root + Moringa Fruit"),
      f("Immunity booster", "American Ginseng + Kalmegh + Echinacea Root + Spirulina"),
      f("Immunity booster", "Curcumin + Moringa + Liquorice + Ashwagandha Root"),
    ],
  },
  {
    name: "Hair, Skin & Nails",
    formulas: [
      f("Hair,skin , nails", "Manjistha Stem + Propolis + Avocado Fruit"),
      f("Hair,skin , nails", "Aloe Vera + Bamboo Stem + Sesbania Grandiflora + Bearberry"),
      f("Hair,skin , nails", "Amla + Bhringraj + Brahmi + Grapeseed"),
      f("Hair,skin , nails", "Orange + Hibiscus + Gingko Biloba + Green Tea"),
    ],
  },
  {
    name: "Anti-Oxidants",
    formulas: [
      f("Anti Oxidents", "Elderberry + Green Tea + Beetroot"),
      f("Anti Oxidents", "Pomegranate + Cranberry + Curcumin"),
      f("Anti Oxidents", "Wheat Grass + Acai Berry + Raspberries + Papain"),
      f("Anti Oxidents", "Spirulina + Tart Cherry + Bacopa Monnieri"),
    ],
  },
  {
    name: "Kidney Health",
    formulas: [
      f("Kidney Health", "Punarnava + Astragalus + Cranberry"),
      f("Kidney Health", "Horse Tail Herb + Birch Leaf + Tulsi Ark"),
      f("Kidney Health", "Manjistha + Amla + Fennel Seed + Celery"),
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
      f("Heart Health", "Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark"),
      f("Heart Health", "Aronia Berry + Piperine + Maitake Mushroom"),
      f("Heart Health", "Arjuna + Guggul + Brahmi"),
      f("Heart Health", "Fenugreek Seed + Amla + Garlic Powder + Arjuna"),
    ],
  },
  {
    name: "Brain Health",
    formulas: [
      f("Brain Health", "Gingko Biloba + Bacopa Monnieri + Shankhpushpi"),
      f("Brain Health", "Rosemary Leaf + Gotu Kola + Curcumin + Vacha"),
      f("Brain Health", "Bacopa Monnieri + Rhodiola Rosea + Ginseng"),
    ],
  },
  {
    name: "Female Fertility",
    formulas: [
      f("Female fertility", "Shatavari + Black Sesame Seed + Liquorice Root + Musta"),
      f("Female fertility", "Gokshuru + Holy Basil + Ashwagandha Root + Shalparni"),
      f("Female fertility", "Ashoka + Jeevanti + Punarnava + Guduchi"),
    ],
  },
  {
    name: "Male Fertility",
    formulas: [
      f("male fertility", "Ashwagandha Root + Mucuna Pruriens + Safed Musli"),
      f("male fertility", "Muira Puama + Gokhru + Shilajit"),
      f("male fertility", "Shilajit + Ashwagandha Root + Ginseng"),
    ],
  },
  {
    name: "Diabetic Care",
    formulas: [
      f("Diabetic care", "Bitter Melon + Lucuma + Banaba Leaf"),
      f("Diabetic care", "Chitrak Root + Fenugreek Seed + Olive Leaf"),
      f("Diabetic care", "Prickly Pear Leaf + Mulberry Leaf + Cinnamon Bark"),
      f("Diabetic care", "Gymnema Leaf + Bilberry"),
    ],
  },
  {
    name: "Liver Health",
    formulas: [
      f("Liver Health", "Milk Thistle + Dandelion Root + Green Turmeric"),
      f("Liver Health", "Kutki + Schisandra Berry + Nigella Sativa"),
      f("Liver Health", "Milk Thistle + Artichoke Fruit + Myrobalan"),
    ],
  },
  {
    name: "Menopause",
    formulas: [
      f("Menopause", "Evening Primrose + Nettle Leaf + Valerian + Wild Yam"),
      f("Menopause", "Flaxseed + Red Clover + Black Cohosh Root + Ginseng"),
      f("Menopause", "Motherwort + Passion Flower + Valerian"),
    ],
  },
  {
    name: "Respiratory Health",
    formulas: [
      f("Respiratory Health", "Kalmegh + Curcumin + Astragalus"),
      f("Respiratory Health", "Ginger + Liquorice + Cardamom"),
      f("Respiratory Health", "Kalmegh + Pippali + Vasaka"),
    ],
  },
  {
    name: "Vision",
    formulas: [
      f("Vision", "Goji Berry + Bilberry + Marigold + Carrot"),
      f("Vision", "Fennel Seed + Bay Berry + Spinach"),
    ],
  },
  {
    name: "Digestive Health",
    formulas: [
      f("Digestive Health", "Amla + Pippali + Ajwain"),
      f("Digestive Health", "Isabgol"),
      f("Digestive Health", "Ginger + Pudina + Fennel"),
      f("Digestive Health", "Liquorice + Fennel + Ajwain"),
    ],
  },
  {
    name: "Weight Management",
    formulas: [
      f("Weight management", "Isabgol"),
      f("Weight management", "Garcinia Cambogia"),
      f("Weight management", "Green Tea + Garcinia Cambogia + Chitosan"),
    ],
  },
];

export const categories: FormulaCategory[] = buildCategories(rawCatalog);
