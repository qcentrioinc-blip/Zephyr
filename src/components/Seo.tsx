import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://zephyr.vercel.app";
const DEFAULT_OG = `${SITE_URL}/brand/logo.png`;

type PageMeta = {
  title: string;
  description: string;
};

const META: Record<string, PageMeta> = {
  "/": {
    title: "Zephyr | CDMO & Private-Label Manufacturing Partner",
    description:
      "Zephyr manufactures nutraceutical, herbaceutical, and organic dietary supplements for US brand owners. 65,000 sq ft facility, GMP/ISO systems, and MOQ-ready private-label programs.",
  },
  "/research": {
    title: "R&D and New Product Development | Zephyr",
    description:
      "Pilot labs, stability testing, validation, and commercial transfer for dietary supplement brand partners. Concept formulas through full-scale manufacturing.",
  },
  "/production": {
    title: "Production & Facilities | Zephyr",
    description:
      "Humidity-controlled dispensing, granulation, compression, coating, capsule filling, and finished-goods packaging for private-label scale-up. Capacity up to 5B tablets per month.",
  },
  // Gallery page disabled
  // "/gallery": {
  //   title: "Facility Gallery | Zephyr",
  //   description:
  //     "Manufacturing floors, packaging lines, and laboratory environments supporting nutraceutical, herbaceutical, and organic partner programs.",
  // },
  "/contact": {
    title: "Request MOQ | Zephyr Contact",
    description:
      "Start a manufacturing inquiry for private-label or contract production. Share your dosage form, packaging, and estimated volume.",
  },
  "/herbaceutical": {
    title: "Herbaceutical Formulas | Zephyr",
    description:
      "Botanical dietary supplement catalog for private-label and contract manufacturing. MOQ and manufacturing on inquiry.",
  },
  "/nutraceutical": {
    title: "Nutraceutical Formulas | Zephyr",
    description:
      "Vitamins, minerals, and specialty dietary supplement formulas for commercial brand portfolios. Private label & contract manufacturing.",
  },
  "/organic": {
    title: "Organic Formulas | Zephyr",
    description:
      "Organic and clean-label private-label manufacturing catalog. MOQ and manufacturing on inquiry.",
  },
};

const FALLBACK: PageMeta = META["/"]!;

export default function Seo() {
  const { pathname } = useLocation();
  const meta = META[pathname] ?? FALLBACK;
  const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

  return (
    <Helmet>
      <html lang="en" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content="index,follow" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Zephyr" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={DEFAULT_OG} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={DEFAULT_OG} />
    </Helmet>
  );
}
