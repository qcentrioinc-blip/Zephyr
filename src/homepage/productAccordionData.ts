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
    image: "/herbal.webp",
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
    image: "/nuetra.webp",
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
    image: "/organic.webp",
    route: "/organic",
    connectHref: `/contact?subject=${encodeURIComponent("MOQ inquiry - Organic")}`,
  },
  {
    id: "skincare",
    index: "04",
    title: "Skin care",
    subtitle: "Psoriasis-prone skin. Zephyr manufacturing.",
    watermark: "SKIN CARE",
    headline: "Clinical derm care for psoriasis-prone skin",
    description:
      "ALFURIN lotion and cream: a dual-action system for psoriasis-prone skin with barrier support, manufactured by Zephyr for US distribution, clinic, and private-label partners.",
    color: "#1F5F8B",
    image: "/Skincare.png?v=user1",
    route: "/skincare",
    connectHref: `/contact?subject=${encodeURIComponent("ALFURIN range: manufacturing / MOQ")}`,
  },
];

export function getAccordionItemByRoute(route: string): ProductAccordionItem | undefined {
  return PRODUCT_ACCORDION_ITEMS.find((item) => item.route === route);
}
