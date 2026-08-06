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

const IMG = "/Homepage/2.png";
const CATEGORY_IMAGE = IMG;
const f = (formula: string): RawFormula => ({ formula, image: IMG });

function buildCategories(raw: RawCategory[]): FormulaCategory[] {
  return raw
    .map((cat) => ({
      name: cat.name,
      categoryImage: CATEGORY_IMAGE,
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
      f("Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod"),
      f("Cat's Claw + Bromelain Extract + Ashwagandha Root"),
      f("Rosehip Powder + Ginger + Curcumin + Maca Root"),
      f("Guggul + Sea Buck Thorn + Schindra + Eucalyptus"),
      f("Burdock Root + Moringa Leaf + Willow Bark + Curcumin"),
    ],
  },
  {
    name: "Immunity Boosters",
    formulas: [
      f("Astragalus Root + Aronia Berry + Maitake Mushroom + Holy Basil"),
      f("Neem Leaf + Morinda Citrifolia Fruit + Ashwagandha Root + Moringa Fruit"),
      f("American Ginseng + Kalmegh + Echinacea Root + Spirulina"),
      f("Curcumin + Moringa + Liquorice + Ashwagandha Root"),
    ],
  },
  {
    name: "Hair, Skin & Nails",
    formulas: [
      f("Manjistha Stem + Propolis + Avocado Fruit"),
      f("Aloe Vera + Bamboo Stem + Sesbania Grandiflora + Bearberry"),
      f("Amla + Bhringraj + Brahmi + Grapeseed"),
      f("Orange + Hibiscus + Gingko Biloba + Green Tea"),
    ],
  },
  {
    name: "Anti-Oxidants",
    formulas: [
      f("Elderberry + Green Tea + Beetroot"),
      f("Pomegranate + Cranberry + Curcumin"),
      f("Wheat Grass + Acai Berry + Raspberries + Papain"),
      f("Spirulina + Tart Cherry + Bacopa Monnieri"),
    ],
  },
  {
    name: "Kidney Health",
    formulas: [
      f("Punarnava + Astragalus + Cranberry"),
      f("Horse Tail Herb + Birch Leaf + Tulsi Ark"),
      f("Manjistha + Amla + Fennel Seed + Celery"),
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
      f("Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark"),
      f("Aronia Berry + Piperine + Maitake Mushroom"),
      f("Arjuna + Guggul + Brahmi"),
      f("Fenugreek Seed + Amla + Garlic Powder + Arjuna"),
    ],
  },
  {
    name: "Brain Health",
    formulas: [
      f("Gingko Biloba + Bacopa Monnieri + Shankhpushpi"),
      f("Rosemary Leaf + Gotu Kola + Curcumin + Vacha"),
      f("Bacopa Monnieri + Rhodiola Rosea + Ginseng"),
    ],
  },
  {
    name: "Female Fertility",
    formulas: [
      f("Shatavari + Black Sesame Seed + Liquorice Root + Musta"),
      f("Gokshuru + Holy Basil + Ashwagandha Root + Shalparni"),
      f("Ashoka + Jeevanti + Punarnava + Guduchi"),
    ],
  },
  {
    name: "Male Fertility",
    formulas: [
      f("Ashwagandha Root + Mucuna Pruriens + Safed Musli"),
      f("Muira Puama + Gokhru + Shilajit"),
      f("Shilajit + Ashwagandha Root + Ginseng"),
    ],
  },
  {
    name: "Diabetic Care",
    formulas: [
      f("Bitter Melon + Lucuma + Banaba Leaf"),
      f("Chitrak Root + Fenugreek Seed + Olive Leaf"),
      f("Prickly Pear Leaf + Mulberry Leaf + Cinnamon Bark"),
      f("Gymnema Leaf + Bilberry"),
    ],
  },
  {
    name: "Liver Health",
    formulas: [
      f("Milk Thistle + Dandelion Root + Green Turmeric"),
      f("Kutki + Schisandra Berry + Nigella Sativa"),
      f("Milk Thistle + Artichoke Fruit + Myrobalan"),
    ],
  },
  {
    name: "Menopause",
    formulas: [
      f("Evening Primrose + Nettle Leaf + Valerian + Wild Yam"),
      f("Flaxseed + Red Clover + Black Cohosh Root + Ginseng"),
      f("Motherwort + Passion Flower + Valerian"),
    ],
  },
  {
    name: "Respiratory Health",
    formulas: [
      f("Kalmegh + Curcumin + Astragalus"),
      f("Ginger + Liquorice + Cardamom"),
      f("Kalmegh + Pippali + Vasaka"),
    ],
  },
  {
    name: "Vision",
    formulas: [
      f("Goji Berry + Bilberry + Marigold + Carrot"),
      f("Fennel Seed + Bay Berry + Spinach"),
    ],
  },
  {
    name: "Digestive Health",
    formulas: [
      f("Amla + Pippali + Ajwain"),
      f("Isabgol"),
      f("Ginger + Pudina + Fennel"),
      f("Liquorice + Fennel + Ajwain"),
    ],
  },
  {
    name: "Weight Management",
    formulas: [
      f("Isabgol"),
      f("Garcinia Cambogia"),
      f("Green Tea + Garcinia Cambogia + Chitosan"),
    ],
  },
];

export const categories: FormulaCategory[] = buildCategories(rawCatalog);
