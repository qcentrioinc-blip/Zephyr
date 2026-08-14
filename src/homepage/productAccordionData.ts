export type ProductAccordionItem = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  watermark: string;
  headline: string;
  description: string;
  color: string;
  image: string;
  panelBg: string;
  panelVideo: string;
  route: string;
  connectHref: string;
};

export const PRODUCT_ACCORDION_ITEMS: ProductAccordionItem[] = [
  {
    id: "herbaceutical",
    index: "01",
    title: "Herbaceutical",
    subtitle: "Botanical supplements",
    watermark: "HERBACEUTICAL",
    headline: "Botanical manufacturing",
    description:
      "Private label and contract manufacturing for botanical dietary supplements. From formula brief and MOQ planning to finished tablets, capsules, and specialty dosages.",
    color: "#FFA43D",
    image: "/homepage/herbal.webp",
    panelBg: "/backgrounds/bg1.png",
    panelVideo: "/videos/herbal1-vid.mp4",
    route: "/herbaceutical",
    connectHref: `/contact?subject=${encodeURIComponent("MOQ inquiry - Herbaceutical")}`,
  },
  {
    id: "nutraceutical",
    index: "02",
    title: "Nutraceutical",
    subtitle: "Vitamins & minerals",
    watermark: "NUTRACEUTICAL",
    headline: "Commercial supplement range",
    description:
      "Turnkey manufacturing for vitamins, minerals, and specialty dietary supplements with flexible dosage forms, finished goods packaging, and practical MOQ support.",
    color: "#247D7D",
    image: "/homepage/nuetra.webp",
    panelBg: "/backgrounds/bg2.png",
    panelVideo: "/videos/nuetra1-vid.mp4",
    route: "/nutraceutical",
    connectHref: `/contact?subject=${encodeURIComponent("MOQ inquiry - Nutraceutical")}`,
  },
  {
    id: "organic",
    index: "03",
    title: "Organic",
    subtitle: "Clean-label manufacturing",
    watermark: "ORGANIC",
    headline: "Organic & clean-label",
    description:
      "Organic and clean-label supplement manufacturing for US markets. Private label support from early formulation through finished goods packaging and commercial production.",
    color: "#3FB369",
    image: "/homepage/organic.webp",
    panelBg: "/backgrounds/bg3.png",
    panelVideo: "/videos/organic1-vid.mp4",
    route: "/organic",
    connectHref: `/contact?subject=${encodeURIComponent("MOQ inquiry - Organic")}`,
  },
  {
    id: "skincare",
    index: "04",
    title: "Skin care",
    subtitle: "Alfurin — Zephyr distribution",
    watermark: "SKIN CARE",
    headline: "Alfurin — psoriasis-prone skincare",
    description:
      "Alfurin lotion and cream: a dual-action system for psoriasis-prone skin with barrier support. Available through Zephyr for US distribution and clinic partners.",
    color: "#1F5F8B",
    image: "/skincare/dual-system-poster.svg",
    panelBg: "/backgrounds/bg4.png",
    panelVideo: "/videos/skin-care-vid.mp4",
    route: "/skincare",
    connectHref: `/contact?subject=${encodeURIComponent("Alfurin range: distribution / supply enquiry")}`,
  },
];

export function getAccordionItemByRoute(route: string): ProductAccordionItem | undefined {
  return PRODUCT_ACCORDION_ITEMS.find((item) => item.route === route);
}
