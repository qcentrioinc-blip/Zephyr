import { ORGANIC_PRODUCT_IMAGES } from "./imageManifest";

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

export function organicProductImage(folder: string, formula: string): string {
  return ORGANIC_PRODUCT_IMAGES[`${folder}|${formula}`] ?? "";
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
  image: organicProductImage(folder, formula),
});

function buildCategories(raw: RawCategory[]): FormulaCategory[] {
  return raw
    .map((cat) => ({
      name: cat.name,
      categoryImage: cat.formulas.find((item) => item.image)?.image ?? "",
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
      f("Liverwort", "Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod"),
      f("Liverwort", "Cat's Claw + Bromelain Extract + Ashwagandha Root"),
      f("Liverwort", "Rosehip Powder + Ginger + Curcumin + Maca Root"),
      f("Liverwort", "Guggul + Sea Buck Thorn + Schindra + Eucalyptus"),
      f("Liverwort", "Burdock Root + Moringa Leaf + Willow Bark + Curcumin"),
    ],
  },
  {
    name: "Guduchi",
    formulas: [
      f("Guduchi", "Astragalus Root + Aronia Berry + Maitake Mushroom + Holy Basil"),
      f("Guduchi", "Neem Leaf + Morinda Citrifolia Fruit + Ashwagandha Root + Moringa Fruit"),
      f("Guduchi", "American Ginseng + Kalmegh + Echinacea Root + Spirulina"),
      f("Guduchi", "Curcumin + Moringa + Liquorice + Ashwagandha Root"),
    ],
  },
  {
    name: "Magnolia Bark",
    formulas: [
      f("Magnolia Bark", "Manjistha Stem + Propolis + Avocado Fruit"),
      f("Magnolia Bark", "Aloe Vera + Bamboo Stem + Sesbania Grandiflora + Bearberry"),
      f("Magnolia Bark", "Amla + Bhringraj + Brahmi + Grapeseed"),
      f("Magnolia Bark", "Orange + Hibiscus + Gingko Biloba + Green Tea"),
    ],
  },
  {
    name: "Horsetail",
    formulas: [
      f("Horsetail", "Elderberry + Green Tea + Beetroot"),
      f("Horsetail", "Pomegranate + Cranberry + Curcumin"),
      f("Horsetail", "Wheat Grass + Acai Berry + Raspberries + Papain"),
      f("Horsetail", "Spirulina + Tart Cherry + Bacopa Monnieri"),
    ],
  },
  {
    name: "Gynostemma",
    formulas: [
      f("Gynoestemma", "Punarnava + Astragalus + Cranberry"),
      f("Gynoestemma", "Horse Tail Herb + Birch Leaf + Tulsi Ark"),
      f("Gynoestemma", "Manjistha + Amla + Fennel Seed + Celery"),
    ],
  },
  {
    name: "Holy Basil",
    formulas: [
      f("Holy Basil", "Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc"),
      f("Holy Basil", "Folic Acid + Vitamin B12 + Vitamin C"),
      f("Holy Basil", "Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc"),
      f("Holy Basil", "Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12"),
    ],
  },
  {
    name: "Triphala",
    formulas: [
      f("Triphala", "Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark"),
      f("Triphala", "Aronia Berry + Piperine + Maitake Mushroom"),
      f("Triphala", "Arjuna + Guggul + Brahmi"),
      f("Triphala", "Fenugreek Seed + Amla + Garlic Powder + Arjuna"),
    ],
  },
  {
    name: "Curcuma Longa",
    formulas: [
      f("Curcuma Longa", "Gingko Biloba + Bacopa Monnieri + Shankhpushpi"),
      f("Curcuma Longa", "Rosemary Leaf + Gotu Kola + Curcumin + Vacha"),
      f("Curcuma Longa", "Bacopa Monnieri + Rhodiola Rosea + Ginseng"),
    ],
  },
  {
    name: "Kalmegh",
    formulas: [
      f("Kalmegh", "Shatavari + Black Sesame Seed + Liquorice Root + Musta"),
      f("Kalmegh", "Gokshuru + Holy Basil + Ashwagandha Root + Shalparni"),
      f("Kalmegh", "Ashoka + Jeevanti + Punarnava + Guduchi"),
    ],
  },
  {
    name: "Gymnema Sylvestre",
    formulas: [
      f("Gymnema Sylvestre", "Ashwagandha Root + Mucuna Pruriens + Safed Musli"),
      f("Gymnema Sylvestre", "Muira Puama + Gokhru + Shilajit"),
      f("Gymnema Sylvestre", "Shilajit + Ashwagandha Root + Ginseng"),
    ],
  },
  {
    name: "Liquorice",
    formulas: [
      f("Liquorice", "Bitter Melon + Lucuma + Banaba Leaf"),
      f("Liquorice", "Chitrak Root + Fenugreek Seed + Olive Leaf"),
      f("Liquorice", "Prickly Pear Leaf + Mulberry Leaf + Cinnamon Bark"),
      f("Liquorice", "Gymnema Leaf + Bilberry"),
    ],
  },
  {
    name: "Cinnamon",
    formulas: [
      f("Cinnamon", "Milk Thistle + Dandelion Root + Green Turmeric"),
      f("Cinnamon", "Kutki + Schisandra Berry + Nigella Sativa"),
      f("Cinnamon", "Milk Thistle + Artichoke Fruit + Myrobalan"),
    ],
  },
  {
    name: "Moringa",
    formulas: [
      f("Moringa", "Evening Primrose + Nettle Leaf + Valerian + Wild Yam"),
      f("Moringa", "Flaxseed + Red Clover + Black Cohosh Root + Ginseng"),
      f("Moringa", "Motherwort + Passion Flower + Valerian"),
    ],
  },
  {
    name: "Ashwagandha",
    formulas: [
      f("Ashwagandha", "Kalmegh + Curcumin + Astragalus"),
      f("Ashwagandha", "Ginger + Liquorice + Cardamom"),
      f("Ashwagandha", "Kalmegh + Pippali + Vasaka"),
    ],
  },
  {
    name: "Garcinia Cambogia",
    formulas: [
      f("Garcinia Cambogia", "Goji Berry + Bilberry + Marigold + Carrot"),
      f("Garcinia Cambogia", "Fennel Seed + Bay Berry + Spinach"),
    ],
  },
];

export const categories: FormulaCategory[] = buildCategories(rawCatalog);
