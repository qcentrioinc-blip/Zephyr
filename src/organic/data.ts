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

const IMG = "/homepage/herbal-bottle.webp";
const CATEGORY_IMAGE = IMG;
const f = (formula: string): RawFormula => ({ formula, image: IMG });

function buildCategories(raw: RawCategory[]): FormulaCategory[] {
  return raw
    .map((cat) => ({
      name: cat.name,
      categoryImage: CATEGORY_IMAGE,
      formulas: cat.formulas.map((item, index) => ({
        id: slugify("organic", cat.name, String(index), item.formula.slice(0, 40)),
        formula: item.formula,
        image: item.image,
      })),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const theme: RangeTheme = {
  title: "Organic Products",
  subtitle: "Organic and clean-label private-label manufacturing",
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
      f("Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod"),
      f("Cat's Claw + Bromelain Extract + Ashwagandha Root"),
      f("Rosehip Powder + Ginger + Curcumin + Maca Root"),
      f("Guggul + Sea Buck Thorn + Schindra + Eucalyptus"),
      f("Burdock Root + Moringa Leaf + Willow Bark + Curcumin"),
    ],
  },
  {
    name: "Guduchi",
    formulas: [
      f("Astragalus Root + Aronia Berry + Maitake Mushroom + Holy Basil"),
      f("Neem Leaf + Morinda Citrifolia Fruit + Ashwagandha Root + Moringa Fruit"),
      f("American Ginseng + Kalmegh + Echinacea Root + Spirulina"),
      f("Curcumin + Moringa + Liquorice + Ashwagandha Root"),
    ],
  },
  {
    name: "Magnolia Bark",
    formulas: [
      f("Manjistha Stem + Propolis + Avocado Fruit"),
      f("Aloe Vera + Bamboo Stem + Sesbania Grandiflora + Bearberry"),
      f("Amla + Bhringraj + Brahmi + Grapeseed"),
      f("Orange + Hibiscus + Gingko Biloba + Green Tea"),
    ],
  },
  {
    name: "Horsetail",
    formulas: [
      f("Elderberry + Green Tea + Beetroot"),
      f("Pomegranate + Cranberry + Curcumin"),
      f("Wheat Grass + Acai Berry + Raspberries + Papain"),
      f("Spirulina + Tart Cherry + Bacopa Monnieri"),
    ],
  },
  {
    name: "Gynostemma",
    formulas: [
      f("Punarnava + Astragalus + Cranberry"),
      f("Horse Tail Herb + Birch Leaf + Tulsi Ark"),
      f("Manjistha + Amla + Fennel Seed + Celery"),
    ],
  },
  {
    name: "Holy Basil",
    formulas: [
      f("Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc"),
      f("Folic Acid + Vitamin B12 + Vitamin C"),
      f("Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc"),
      f("Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12"),
    ],
  },
  {
    name: "Triphala",
    formulas: [
      f("Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark"),
      f("Aronia Berry + Piperine + Maitake Mushroom"),
      f("Arjuna + Guggul + Brahmi"),
      f("Fenugreek Seed + Amla + Garlic Powder + Arjuna"),
    ],
  },
  {
    name: "Curcuma Longa",
    formulas: [
      f("Gingko Biloba + Bacopa Monnieri + Shankhpushpi"),
      f("Rosemary Leaf + Gotu Kola + Curcumin + Vacha"),
      f("Bacopa Monnieri + Rhodiola Rosea + Ginseng"),
    ],
  },
  {
    name: "Kalmegh",
    formulas: [
      f("Shatavari + Black Sesame Seed + Liquorice Root + Musta"),
      f("Gokshuru + Holy Basil + Ashwagandha Root + Shalparni"),
      f("Ashoka + Jeevanti + Punarnava + Guduchi"),
    ],
  },
  {
    name: "Gymnema Sylvestre",
    formulas: [
      f("Ashwagandha Root + Mucuna Pruriens + Safed Musli"),
      f("Muira Puama + Gokhru + Shilajit"),
      f("Shilajit + Ashwagandha Root + Ginseng"),
    ],
  },
  {
    name: "Liquorice",
    formulas: [
      f("Bitter Melon + Lucuma + Banaba Leaf"),
      f("Chitrak Root + Fenugreek Seed + Olive Leaf"),
      f("Prickly Pear Leaf + Mulberry Leaf + Cinnamon Bark"),
      f("Gymnema Leaf + Bilberry"),
    ],
  },
  {
    name: "Cinnamon",
    formulas: [
      f("Milk Thistle + Dandelion Root + Green Turmeric"),
      f("Kutki + Schisandra Berry + Nigella Sativa"),
      f("Milk Thistle + Artichoke Fruit + Myrobalan"),
    ],
  },
  {
    name: "Moringa",
    formulas: [
      f("Evening Primrose + Nettle Leaf + Valerian + Wild Yam"),
      f("Flaxseed + Red Clover + Black Cohosh Root + Ginseng"),
      f("Motherwort + Passion Flower + Valerian"),
    ],
  },
  {
    name: "Ashwagandha",
    formulas: [
      f("Kalmegh + Curcumin + Astragalus"),
      f("Ginger + Liquorice + Cardamom"),
      f("Kalmegh + Pippali + Vasaka"),
    ],
  },
  {
    name: "Garcinia Cambogia",
    formulas: [
      f("Goji Berry + Bilberry + Marigold + Carrot"),
      f("Fennel Seed + Bay Berry + Spinach"),
    ],
  },
];

export const categories: FormulaCategory[] = buildCategories(rawCatalog);
