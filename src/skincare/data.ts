export const CONTACT = {
  lotion: `/contact?subject=${encodeURIComponent("Skincare — ALFURIN Moisturizing Lotion")}`,
  cream: `/contact?subject=${encodeURIComponent("Skincare — ALFURIN Moisturizing Cream")}`,
  range: `/contact?subject=${encodeURIComponent("Skincare — ALFURIN range / MOQ")}`,
} as const;

export type StoreProduct = {
  id: string;
  num: string;
  ref: string;
  name: string;
  role: string;
  volume: string;
  image: string;
  ingredients: string[];
  enquireHref: string;
  showNpf?: boolean;
  nutrition: { label: string; value: string }[];
};

export const PRODUCTS: StoreProduct[] = [
  {
    id: "lotion",
    num: "01",
    ref: "ALF-LOT-01",
    name: "Moisturizing Lotion",
    role: "Daily defence & prevention",
    volume: "Daily use · large areas",
    image: "/skincare/lotion-bottle.png?v=cutout",
    ingredients: [
      "Fast-absorbing formula for daily use",
      "Supports reduced flaking and surface scaling",
      "Helps calm visible redness and irritation",
      "Prevention-minded extract level for ongoing care",
    ],
    enquireHref: CONTACT.lotion,
    nutrition: [
      { label: "Origin", value: "Swiss" },
      { label: "Actives", value: "Limonia bark extract" },
      { label: "Focus", value: "Calm · Nourish · Protect" },
      { label: "Use", value: "Psoriasis-prone skin" },
      { label: "Role", value: "Defence" },
    ],
  },
  {
    id: "cream",
    num: "02",
    ref: "ALF-CRM-02",
    name: "Moisturizing Cream",
    role: "Intensive targeted relief",
    volume: "75 ml · plaque & overnight",
    image: "/skincare/cream-jar.png?v=cutout",
    ingredients: [
      "Limonia bark extract–powered calming care",
      "Targets thick, rough patches with lasting hydration",
      "Absorbs without a greasy finish",
      "National Psoriasis Foundation Seal of Recognition",
    ],
    enquireHref: CONTACT.cream,
    showNpf: true,
    nutrition: [
      { label: "Origin", value: "Swiss" },
      { label: "Actives", value: "Limonia bark extract" },
      { label: "Focus", value: "Calm · Nourish · Protect" },
      { label: "Use", value: "Psoriasis-prone skin" },
      { label: "Seal", value: "NPF Seal of Recognition" },
      { label: "Role", value: "Intensive" },
    ],
  },
];

export const GATE_FLOATS = [
  { src: "/skincare/cream-jar.png?v=cutout", className: "sil-float sil-float--a" },
  { src: "/skincare/lotion-bottle.png?v=cutout", className: "sil-float sil-float--b" },
  { src: "/skincare/cream-tube.png?v=cutout", className: "sil-float sil-float--c" },
  { src: "/skincare/lotion-pouch.png?v=cutout", className: "sil-float sil-float--d" },
] as const;

export const INDEX = [
  { num: "01", label: "Lotion", href: "#product-01" },
  { num: "02", label: "Cream", href: "#product-02" },
  { num: "03", label: "System", href: "#product-03" },
] as const;

export const BENEFIT_CATEGORIES = [
  "All",
  "Defence",
  "Intensive",
  "System",
  "Barrier",
  "Swiss",
  "MOQ",
] as const;

export type BenefitCategory = (typeof BENEFIT_CATEGORIES)[number];

export type BenefitCard = {
  id: string;
  title: string;
  line: string;
  year: string;
  category: Exclude<BenefitCategory, "All">;
  image: string;
};

export const BENEFITS: BenefitCard[] = [
  {
    id: "defence",
    title: "Daily defence",
    line: "Fast-absorbing lotion for large-area, prevention-minded care.",
    year: "2024",
    category: "Defence",
    image: "/skincare/benefit-defence.png",
  },
  {
    id: "intensive",
    title: "Overnight intensive",
    line: "Cream for thick, rough patches — lasting hydration without grease.",
    year: "2024",
    category: "Intensive",
    image: "/skincare/benefit-intensive.png",
  },
  {
    id: "system",
    title: "Dual system",
    line: "Lotion by day, cream by night — defence plus intensive in one range.",
    year: "2025",
    category: "System",
    image: "/skincare/benefit-system.png",
  },
  {
    id: "barrier",
    title: "Barrier-first care",
    line: "Calm · nourish · protect for psoriasis-prone skin routines.",
    year: "2025",
    category: "Barrier",
    image: "/skincare/benefit-barrier.png",
  },
  {
    id: "swiss",
    title: "Swiss · Limonia",
    line: "Limonia bark extract in a Swiss formulation story partners trust.",
    year: "2023",
    category: "Swiss",
    image: "/skincare/benefit-swiss.png",
  },
  {
    id: "moq",
    title: "MOQ partner launch",
    line: "Private-label and distribution enquiries routed through Zephyr.",
    year: "2025",
    category: "MOQ",
    image: "/skincare/benefit-moq.png",
  },
];

