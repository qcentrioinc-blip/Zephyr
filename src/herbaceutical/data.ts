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

const CATEGORY_IMAGE = "/Homepage/OrganicBottle.png";

function buildCategories(raw: RawCategory[]): FormulaCategory[] {
  return raw.map((cat) => ({
    name: cat.name,
    categoryImage: CATEGORY_IMAGE,
    formulas: cat.formulas.map((item, index) => ({
      id: slugify("herbaceutical", cat.name, String(index), item.formula.slice(0, 40)),
      formula: item.formula,
      image: item.image,
    })),
  }));
}

export const theme: RangeTheme = {
  title: "Herbaceutical Products",
  subtitle: "Traditional wisdom. Modern manufacturing standards.",
  accent: "#C38046",
  accentSoft: "#FCF8F2",
  bg: "#fbf3e5",
  border: "#8a5a2b",
  heroImage:
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1800&q=80",
  overlay:
    "linear-gradient(105deg, rgba(251,243,229,0.97) 0%, rgba(251,243,229,0.92) 38%, rgba(251,243,229,0.55) 62%, rgba(251,243,229,0.18) 82%, rgba(251,243,229,0.05) 100%)",
};

const rawCatalog: RawCategory[] = [
  {
    name: "Joint Care",
    formulas: [
      { formula: "Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod", image: "/Homepage/OrganicBottle.png" },
      { formula: "Cat's Claw + Bromelain Extract + Ashwagandha Root", image: "/Homepage/OrganicBottle.png" },
      { formula: "Rosehip Powder + Ginger + Curcumin + Maca Root", image: "/Homepage/OrganicBottle.png" },
      { formula: "Guggul + Sea Buck Thorn + Schindra + Eucalyptus", image: "/Homepage/OrganicBottle.png" },
      { formula: "Burdock Root + Moringa Leaf + Willow Bark + Curcumin", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Immunity Boosters",
    formulas: [
      { formula: "Astragalus Root + Aronia Berry + Maitake Mushroom + Holy Basil", image: "/Homepage/OrganicBottle.png" },
      { formula: "Neem Leaf + Morinda Citrifolia Fruit + Ashwagandha Root + Moringa Fruit", image: "/Homepage/OrganicBottle.png" },
      { formula: "American Ginseng + Kalmegh + Echinacea Root + Spirulina", image: "/Homepage/OrganicBottle.png" },
      { formula: "Curcumin + Moringa + Liquorice + Ashwagandha Root", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Hair, Skin & Nails",
    formulas: [
      { formula: "Manjistha Stem + Propolis + Avocado Fruit", image: "/Homepage/OrganicBottle.png" },
      { formula: "Aloe Vera + Bamboo Stem + Sesbania Grandiflora + Bearberry", image: "/Homepage/OrganicBottle.png" },
      { formula: "Amla + Bhringraj + Brahmi + Grapeseed", image: "/Homepage/OrganicBottle.png" },
      { formula: "Orange + Hibiscus + Gingko Biloba + Green Tea", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Anti-Oxidants",
    formulas: [
      { formula: "Elderberry + Green Tea + Beetroot", image: "/Homepage/OrganicBottle.png" },
      { formula: "Pomegranate + Cranberry + Curcumin", image: "/Homepage/OrganicBottle.png" },
      { formula: "Wheat Grass + Acai Berry + Raspberries + Papain", image: "/Homepage/OrganicBottle.png" },
      { formula: "Spirulina + Tart Cherry + Bacopa Monnieri", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Kidney Health",
    formulas: [
      { formula: "Punarnava + Astragalus + Cranberry", image: "/Homepage/OrganicBottle.png" },
      { formula: "Horse Tail Herb + Birch Leaf + Tulsi Ark", image: "/Homepage/OrganicBottle.png" },
      { formula: "Manjistha + Amla + Fennel Seed + Celery", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Haematinic",
    formulas: [
      { formula: "Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc", image: "/Homepage/OrganicBottle.png" },
      { formula: "Folic Acid + Vitamin B12 + Vitamin C", image: "/Homepage/OrganicBottle.png" },
      { formula: "Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc", image: "/Homepage/OrganicBottle.png" },
      { formula: "Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Heart Health",
    formulas: [
      { formula: "Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark", image: "/Homepage/OrganicBottle.png" },
      { formula: "Aronia Berry + Piperine + Maitake Mushroom", image: "/Homepage/OrganicBottle.png" },
      { formula: "Arjuna + Guggul + Brahmi", image: "/Homepage/OrganicBottle.png" },
      { formula: "Fenugreek Seed + Amla + Garlic Powder + Arjuna", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Brain Health",
    formulas: [
      { formula: "Gingko Biloba + Bacopa Monnieri + Shankhpushpi", image: "/Homepage/OrganicBottle.png" },
      { formula: "Rosemary Leaf + Gotu Kola + Curcumin + Vacha", image: "/Homepage/OrganicBottle.png" },
      { formula: "Bacopa Monnieri + Rhodiola Rosea + Ginseng", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Female Fertility",
    formulas: [
      { formula: "Shatavari + Black Sesame Seed + Liquorice Root + Musta", image: "/Homepage/OrganicBottle.png" },
      { formula: "Gokshuru + Holy Basil + Ashwagandha Root + Shalparni", image: "/Homepage/OrganicBottle.png" },
      { formula: "Ashoka + Jeevanti + Punarnava + Guduchi", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Male Fertility",
    formulas: [
      { formula: "Ashwagandha Root + Mucuna Pruriens + Safed Musli", image: "/Homepage/OrganicBottle.png" },
      { formula: "Muira Puama + Gokhru + Shilajit", image: "/Homepage/OrganicBottle.png" },
      { formula: "Shilajit + Ashwagandha Root + Ginseng", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Diabetic Care",
    formulas: [
      { formula: "Bitter Melon + Lucuma + Banaba Leaf", image: "/Homepage/OrganicBottle.png" },
      { formula: "Chitrak Root + Fenugreek Seed + Olive Leaf", image: "/Homepage/OrganicBottle.png" },
      { formula: "Prickly Pear Leaf + Mulberry Leaf + Cinnamon Bark", image: "/Homepage/OrganicBottle.png" },
      { formula: "Gymnema Leaf + Bilberry", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Liver Health",
    formulas: [
      { formula: "Milk Thistle + Dandelion Root + Green Turmeric", image: "/Homepage/OrganicBottle.png" },
      { formula: "Kutki + Schisandra Berry + Nigella Sativa", image: "/Homepage/OrganicBottle.png" },
      { formula: "Milk Thistle + Artichoke Fruit + Myrobalan", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Menopause",
    formulas: [
      { formula: "Evening Primrose + Nettle Leaf + Valerian + Wild Yam", image: "/Homepage/OrganicBottle.png" },
      { formula: "Flaxseed + Red Clover + Black Cohosh Root + Ginseng", image: "/Homepage/OrganicBottle.png" },
      { formula: "Motherwort + Passion Flower + Valerian", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Respiratory Health",
    formulas: [
      { formula: "Kalmegh + Curcumin + Astragalus", image: "/Homepage/OrganicBottle.png" },
      { formula: "Ginger + Liquorice + Cardamom", image: "/Homepage/OrganicBottle.png" },
      { formula: "Kalmegh + Pippali + Vasaka", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Vision",
    formulas: [
      { formula: "Goji Berry + Bilberry + Marigold + Carrot", image: "/Homepage/OrganicBottle.png" },
      { formula: "Fennel Seed + Bay Berry + Spinach", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Digestive Health",
    formulas: [
      { formula: "Amla + Pippali + Ajwain", image: "/Homepage/OrganicBottle.png" },
      { formula: "Isabgol", image: "/Homepage/OrganicBottle.png" },
      { formula: "Ginger + Pudina + Fennel", image: "/Homepage/OrganicBottle.png" },
      { formula: "Liquorice + Fennel + Ajwain", image: "/Homepage/OrganicBottle.png" },
    ],
  },
  {
    name: "Weight Management",
    formulas: [
      { formula: "Isabgol", image: "/Homepage/OrganicBottle.png" },
      { formula: "Garcinia Cambogia", image: "/Homepage/OrganicBottle.png" },
      { formula: "Green Tea + Garcinia Cambogia + Chitosan", image: "/Homepage/OrganicBottle.png" },
    ],
  },
];

export const categories: FormulaCategory[] = buildCategories(rawCatalog);
