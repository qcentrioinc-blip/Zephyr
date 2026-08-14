export const SKINCARE_MAIN_IMAGE = "/skincare/dual-system-poster.svg";
export const SKINCARE_LOTION_IMAGE = "/skincare/cream-l.svg";
export const SKINCARE_CREAM_IMAGE = "/skincare/cream-s.svg";

export const CONTACT = {
  lotion: `/contact?subject=${encodeURIComponent("Alfurin Moisturizing Lotion: distribution enquiry")}`,
  cream: `/contact?subject=${encodeURIComponent("Alfurin Moisturizing Cream: distribution enquiry")}`,
  range: `/contact?subject=${encodeURIComponent("Alfurin range: distribution / supply enquiry")}`,
} as const;

export const TRUST_BADGES = [
  "Dermatologically tested",
  "Gentle on sensitive skin",
  "S100 Protein Technology",
  "Limonia acidissima-derived actives",
  "Phase III clinically validated",
] as const;

export const SCIENCE_CREDENTIALS = [
  {
    id: "derm",
    title: "Dermatologically tested",
    detail: "Formulation screening suited to sensitive and psoriasis-prone skin programs.",
    image: "/skincare/cred-derm.png?v=flip2",
    alt: "Clinical dermatology screening of calm, psoriasis-prone skin",
  },
  {
    id: "sensitive",
    title: "Gentle on sensitive skin",
    detail: "Built for partners who need a clear daily and intensive care story without harsh positioning.",
    image: "/skincare/cred-sensitive.png?v=flip2",
    alt: "Soft hydrated skin surface suggesting gentle sensitive-skin care",
  },
  {
    id: "s100",
    title: "S100 Protein Technology",
    detail: "Shared technology story across lotion and cream for dual-action calm and restore support.",
    image: "/skincare/cred-s100.png?v=flip2",
    alt: "Abstract protein technology visualization in soft clinical light",
  },
  {
    id: "limonia",
    title: "Limonia acidissima-derived actives",
    detail: "Shared botanical active base across lotion and cream for a consistent two-product range.",
    image: "/skincare/cred-limonia.png?v=flip2",
    alt: "Limonia acidissima botanical fruit and leaves for active extract story",
  },
  {
    id: "phase3",
    title: "Phase III clinically validated",
    detail: "Clinical validation language partners can cite in evaluation and launch materials.",
    image: "/skincare/cred-phase3.png?v=flip2",
    alt: "Clinical research dossier materials for partner review",
  },
] as const;

export const RITUAL_STEPS = [
  {
    num: "01",
    label: "Prep",
    title: "Cleanse",
    detail:
      "Gently clean affected areas with lukewarm water. Pat dry with a soft towel before either product goes on.",
    image: "/skincare/ritual-cleanse.png?v=alfurin",
    alt: "Clean hands preparing skin with a soft towel before application",
  },
  {
    num: "02",
    label: "Daytime",
    title: "Apply the Lotion",
    detail:
      "Pump two to three times and massage evenly into skin. Suited to morning use and large-area daily defence.",
    image: "/skincare/ritual-lotion.svg",
    alt: "Alfurin Moisturizing Lotion pump bottle applied to psoriasis-prone skin",
  },
  {
    num: "03",
    label: "Intensive",
    title: "Apply the Cream",
    detail:
      "Use on thicker plaques or as overnight care for intensive sites. Position cream as the targeted follow-on SKU.",
    image: "/skincare/ritual-cream.svg",
    alt: "Alfurin cream tube with intensive care application on plaque-prone skin",
  },
] as const;

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
    role: "Daily defence and prevention",
    volume: "Large-area daily use",
    image: SKINCARE_LOTION_IMAGE,
    ingredients: [
      "Lightweight, fast-absorbing formula for broad coverage",
      "Helps reduce flaking and surface scaling",
      "Calms visible redness and chronic irritation",
      "Lower extract level designed for ongoing prevention",
    ],
    enquireHref: CONTACT.lotion,
    nutrition: [
      { label: "Format", value: "Lotion · pump" },
      { label: "Active base", value: "Limonia acidissima extract" },
      { label: "Platform", value: "S100 Protein Technology" },
      { label: "Focus", value: "Psoriasis-prone skin" },
      { label: "Partner use", value: "Daily defence SKU" },
    ],
  },
  {
    id: "cream",
    num: "02",
    ref: "ALF-CRM-02",
    name: "Moisturizing Cream",
    role: "Intensive targeted relief",
    volume: "Plaque areas and overnight care",
    image: SKINCARE_CREAM_IMAGE,
    ingredients: [
      "Targets thick plaque formation with lasting hydration",
      "Supports deep moisture retention overnight",
      "Dual anti-inflammatory action in a non-greasy finish",
      "National Psoriasis Foundation Seal of Recognition",
    ],
    enquireHref: CONTACT.cream,
    showNpf: true,
    nutrition: [
      { label: "Format", value: "Cream · tube" },
      { label: "Active base", value: "Limonia acidissima extract" },
      { label: "Platform", value: "S100 Protein Technology" },
      { label: "Focus", value: "Psoriasis-prone skin" },
      { label: "Partner use", value: "Intensive SKU" },
    ],
  },
];

export const GATE_FLOATS = [
  { src: SKINCARE_LOTION_IMAGE, className: "sil-orbit-item--lotion", side: "left" as const },
  { src: SKINCARE_CREAM_IMAGE, className: "sil-orbit-item--cream", side: "right" as const },
] as const;

export const INDEX = [
  { num: "01", label: "Lotion", href: "#product-01" },
  { num: "02", label: "Cream", href: "#product-02" },
  { num: "03", label: "System", href: "#product-03" },
] as const;

export const BENEFIT_CATEGORIES = [
  "All",
  "Plaque",
  "Scale",
  "Sensation",
  "Barrier",
  "Nails",
  "Course",
] as const;

export type BenefitCategory = (typeof BENEFIT_CATEGORIES)[number];

export type BenefitCard = {
  id: string;
  title: string;
  line: string;
  year: string;
  category: Exclude<BenefitCategory, "All">;
  image: string;
  alt: string;
};

export const BENEFITS: BenefitCard[] = [
  {
    id: "inflamed",
    title: "Red, inflamed patches",
    line: "Well-defined red patches are a common plaque-psoriasis signal. Partners use this cue when briefing daily defence lotion on broader involved areas.",
    year: "01",
    category: "Plaque",
    image: "/skincare/symptom-inflamed.png?v=symptoms",
    alt: "Clinical view of well-defined red inflamed skin patches",
  },
  {
    id: "scales",
    title: "Thick silvery-white scales",
    line: "Raised plaques with silvery scale are a hallmark presentation. Intensive cream is positioned for thicker, scale-prone sites in the two-product system.",
    year: "02",
    category: "Scale",
    image: "/skincare/symptom-scales.png?v=symptoms",
    alt: "Clinical view of raised plaques with thick silvery-white scales",
  },
  {
    id: "itch",
    title: "Itching, burning, and soreness",
    line: "Persistent itch, burn, and soreness often drive clinic visits. Framing Alfurin as calm, non-greasy daily care helps partners address comfort-led demand.",
    year: "03",
    category: "Sensation",
    image: "/skincare/symptom-itch.png?v=symptoms",
    alt: "Clinical view of irritated skin associated with itching and burning",
  },
  {
    id: "cracked",
    title: "Dry or cracked skin",
    line: "Dryness and fissures can worsen discomfort and barrier stress. Moisture-forward lotion and cream support help partners discuss barrier care without overclaiming.",
    year: "04",
    category: "Barrier",
    image: "/skincare/symptom-cracked.png?v=symptoms",
    alt: "Clinical view of dry cracked skin that may bleed",
  },
  {
    id: "nails",
    title: "Thickened, pitted, or ridged nails",
    line: "Nail pitting, ridging, and thickening appear in many psoriasis programs. Include nail changes in education so partners recognize related skin involvement.",
    year: "05",
    category: "Nails",
    image: "/skincare/symptom-nails.png?v=symptoms",
    alt: "Clinical view of pitted, ridged, and thickened nails",
  },
  {
    id: "flares",
    title: "Cyclic flares and remission",
    line: "Symptoms often cycle between flare and quieter periods. A simple cleanse, lotion, cream protocol helps partners brief consistent use across changing skin days.",
    year: "06",
    category: "Course",
    image: "/skincare/symptom-flares.png?v=symptoms",
    alt: "Clinical view suggesting cyclic flare and quieter skin periods",
  },
];
