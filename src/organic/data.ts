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

const CATEGORY_IMAGE = "/Homepage/HerbalBottle.png";

function buildCategories(raw: RawCategory[]): FormulaCategory[] {
  return raw.map((cat) => ({
    name: cat.name,
    categoryImage: CATEGORY_IMAGE,
    formulas: cat.formulas.map((item, index) => ({
      id: slugify("organic", cat.name, String(index), item.formula.slice(0, 40)),
      formula: item.formula,
      image: item.image,
    })),
  }));
}

export const theme: RangeTheme = {
  title: "Organic Products",
  subtitle: "Pure. Natural. Custom private label formulas.",
  accent: "#547A3D",
  accentSoft: "#EFF7ED",
  bg: "#f8f9ef",
  border: "#4a5f35",
  heroImage: "/Generated/organic-hero.png",
  overlay: "rgba(248,249,239,0.92)",
};

const rawCatalog: RawCategory[] = [
  {
    name: "Liverwort",
    formulas: [
      { formula: "Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod", image: "/Homepage/HerbalBottle.png" },
      { formula: "Cat's Claw + Bromelain Extract + Ashwagandha Root", image: "/Homepage/HerbalBottle.png" },
      { formula: "Rosehip Powder + Ginger + Curcumin + Maca Root", image: "/Homepage/HerbalBottle.png" },
      { formula: "Guggul + Sea Buck Thorn + Schindra + Eucalyptus", image: "/Homepage/HerbalBottle.png" },
      { formula: "Burdock Root + Moringa Leaf + Willow Bark + Curcumin", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Guduchi",
    formulas: [
      { formula: "Astragalus Root + Aronia Berry + Maitake Mushroom + Holy Basil", image: "/Homepage/HerbalBottle.png" },
      { formula: "Neem Leaf + Morinda Citrifolia Fruit + Ashwagandha Root + Moringa Fruit", image: "/Homepage/HerbalBottle.png" },
      { formula: "American Ginseng + Kalmegh + Echinacea Root + Spirulina", image: "/Homepage/HerbalBottle.png" },
      { formula: "Curcumin + Moringa + Liquorice + Ashwagandha Root", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Magnolia Bark",
    formulas: [
      { formula: "Manjistha Stem + Propolis + Avocado Fruit", image: "/Homepage/HerbalBottle.png" },
      { formula: "Aloe Vera + Bamboo Stem + Sesbania Grandiflora + Bearberry", image: "/Homepage/HerbalBottle.png" },
      { formula: "Amla + Bhringraj + Brahmi + Grapeseed", image: "/Homepage/HerbalBottle.png" },
      { formula: "Orange + Hibiscus + Gingko Biloba + Green Tea", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Horsetail",
    formulas: [
      { formula: "Elderberry + Green Tea + Beetroot", image: "/Homepage/HerbalBottle.png" },
      { formula: "Pomegranate + Cranberry + Curcumin", image: "/Homepage/HerbalBottle.png" },
      { formula: "Wheat Grass + Acai Berry + Raspberries + Papain", image: "/Homepage/HerbalBottle.png" },
      { formula: "Spirulina + Tart Cherry + Bacopa Monnieri", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Gynostemma",
    formulas: [
      { formula: "Punarnava + Astragalus + Cranberry", image: "/Homepage/HerbalBottle.png" },
      { formula: "Horse Tail Herb + Birch Leaf + Tulsi Ark", image: "/Homepage/HerbalBottle.png" },
      { formula: "Manjistha + Amla + Fennel Seed + Celery", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Holy Basil",
    formulas: [
      { formula: "Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc", image: "/Homepage/HerbalBottle.png" },
      { formula: "Folic Acid + Vitamin B12 + Vitamin C", image: "/Homepage/HerbalBottle.png" },
      { formula: "Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc", image: "/Homepage/HerbalBottle.png" },
      { formula: "Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Triphala",
    formulas: [
      { formula: "Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark", image: "/Homepage/HerbalBottle.png" },
      { formula: "Aronia Berry + Piperine + Maitake Mushroom", image: "/Homepage/HerbalBottle.png" },
      { formula: "Arjuna + Guggul + Brahmi", image: "/Homepage/HerbalBottle.png" },
      { formula: "Fenugreek Seed + Amla + Garlic Powder + Arjuna", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Curcuma Longa",
    formulas: [
      { formula: "Gingko Biloba + Bacopa Monnieri + Shankhpushpi", image: "/Homepage/HerbalBottle.png" },
      { formula: "Rosemary Leaf + Gotu Kola + Curcumin + Vacha", image: "/Homepage/HerbalBottle.png" },
      { formula: "Bacopa Monnieri + Rhodiola Rosea + Ginseng", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Kalmegh",
    formulas: [
      { formula: "Shatavari + Black Sesame Seed + Liquorice Root + Musta", image: "/Homepage/HerbalBottle.png" },
      { formula: "Gokshuru + Holy Basil + Ashwagandha Root + Shalparni", image: "/Homepage/HerbalBottle.png" },
      { formula: "Ashoka + Jeevanti + Punarnava + Guduchi", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Gymnema Sylvestre",
    formulas: [
      { formula: "Ashwagandha Root + Mucuna Pruriens + Safed Musli", image: "/Homepage/HerbalBottle.png" },
      { formula: "Muira Puama + Gokhru + Shilajit", image: "/Homepage/HerbalBottle.png" },
      { formula: "Shilajit + Ashwagandha Root + Ginseng", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Liquorice",
    formulas: [
      { formula: "Bitter Melon + Lucuma + Banaba Leaf", image: "/Homepage/HerbalBottle.png" },
      { formula: "Chitrak Root + Fenugreek Seed + Olive Leaf", image: "/Homepage/HerbalBottle.png" },
      { formula: "Prickly Pear Leaf + Mulberry Leaf + Cinnamon Bark", image: "/Homepage/HerbalBottle.png" },
      { formula: "Gymnema Leaf + Bilberry", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Cinnamon",
    formulas: [
      { formula: "Milk Thistle + Dandelion Root + Green Turmeric", image: "/Homepage/HerbalBottle.png" },
      { formula: "Kutki + Schisandra Berry + Nigella Sativa", image: "/Homepage/HerbalBottle.png" },
      { formula: "Milk Thistle + Artichoke Fruit + Myrobalan", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Moringa",
    formulas: [
      { formula: "Evening Primrose + Nettle Leaf + Valerian + Wild Yam", image: "/Homepage/HerbalBottle.png" },
      { formula: "Flaxseed + Red Clover + Black Cohosh Root + Ginseng", image: "/Homepage/HerbalBottle.png" },
      { formula: "Motherwort + Passion Flower + Valerian", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Ashwagandha",
    formulas: [
      { formula: "Kalmegh + Curcumin + Astragalus", image: "/Homepage/HerbalBottle.png" },
      { formula: "Ginger + Liquorice + Cardamom", image: "/Homepage/HerbalBottle.png" },
      { formula: "Kalmegh + Pippali + Vasaka", image: "/Homepage/HerbalBottle.png" },
    ],
  },
  {
    name: "Garcinia Cambogia",
    formulas: [
      { formula: "Goji Berry + Bilberry + Marigold + Carrot", image: "/Homepage/HerbalBottle.png" },
      { formula: "Fennel Seed + Bay Berry + Spinach", image: "/Homepage/HerbalBottle.png" },
    ],
  },
];

export const categories: FormulaCategory[] = buildCategories(rawCatalog);
