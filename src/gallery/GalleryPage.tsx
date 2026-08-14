// Gallery page disabled — route/nav commented out in App, Navbar, Footer, Seo, Breadcrumbs, sitemap.

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Reveal from "../components/Reveal";
import { H1, H3, P } from "../components/Typography/Typo";

type GalleryCategory = "Factory Tour" | "Production Facility" | "Equipment";

const CATEGORY_ORDER: GalleryCategory[] = [
  "Factory Tour",
  "Production Facility",
  "Equipment",
];

type GalleryItem = {
  id: string;
  src: string;
  title: string;
  category: GalleryCategory;
  caption: string;
  featured?: boolean;
  productShot?: boolean;
};

/** Gallery disabled — full tile list preserved in comment below for re-enable. */
const GALLERY: GalleryItem[] = [];

/*
const GALLERY_DISABLED: GalleryItem[] = [
  {
    id: "end-to-end",
    src: "/Gallery/gallery-end-to-end-partner.webp",
    title: "End-to-end manufacturing partner",
    category: "Production Facility",
    caption: "Integrated compression, packaging, and release under one documented quality system.",
    featured: true,
  },
  {
    id: "rd-analytical",
    src: "/facility/gallery-rd-analytical-labs.webp",
    title: "R&D and analytical labs",
    category: "Equipment",
    caption: "HPLC, method development, and stability analytics before commercial scale-up.",
    featured: true,
  },
  {
    id: "hall",
    src: "/Gallery/gallery-production-hall.webp",
    title: "Integrated production hall",
    category: "Production Facility",
    caption: "High-volume bays configured for tablets, capsules, and finished goods.",
    featured: true,
  },
  // Factory Tour
  {
    id: "g1",
    src: "/facility/gallery-1.png",
    title: "Controlled manufacturing bay",
    category: "Factory Tour",
    caption: "Climate-managed suites prepared for partner batch production runs.",
  },
  {
    id: "g5",
    src: "/facility/gallery-5.png",
    title: "Quality-ready workspace",
    category: "Factory Tour",
    caption: "Documented workflows aligned to cGMP and partner audit expectations.",
  },
  {
    id: "exterior",
    src: "/facility/productions-hero-right.webp",
    title: "Facility exterior & scale",
    category: "Factory Tour",
    caption: "65,000 sq ft manufacturing footprint in Karnataka, India.",
  },
  {
    id: "rd-lab",
    src: "/facility/gallery-rd-lab.webp",
    title: "Development laboratory",
    category: "Factory Tour",
    caption: "Pilot formulation suites bridging concept to commercial transfer.",
  },
  {
    id: "formulation",
    src: "/Generated/showreel-formulation.webp",
    title: "Formulation weighing suite",
    category: "Factory Tour",
    caption: "Precision weighing for R&D and pilot-scale batch preparation.",
  },
  {
    id: "pack-flat",
    src: "/Generated/packaging-flatlay.png",
    title: "Pack format library",
    category: "Factory Tour",
    caption: "Dosage forms and packaging options for MOQ and launch planning.",
    productShot: true,
  },
  // Production Facility
  {
    id: "long",
    src: "/facility/long-gallery.png",
    title: "Production floor overview",
    category: "Production Facility",
    caption: "Clear circulation between compression, packaging, and quality zones.",
  },
  {
    id: "g3",
    src: "/facility/gallery-3.png",
    title: "Packaging & finishing area",
    category: "Production Facility",
    caption: "Secondary packaging, labelling, and finished-goods staging.",
  },
  {
    id: "compression",
    src: "/Generated/production-compression.png",
    title: "Compression suite operations",
    category: "Production Facility",
    caption: "Commercial-scale tablet compression configured for partner SKUs.",
  },
  {
    id: "blister",
    src: "/packaging/Blisters.jpg",
    title: "Blister packaging lines",
    category: "Production Facility",
    caption: "Thermoform and cold-form blister formats for retail-ready packs.",
    productShot: true,
  },
  {
    id: "bottle",
    src: "/packaging/Bottle%20packs.jpg",
    title: "Bottle packing lines",
    category: "Production Facility",
    caption: "Liquids, syrups, and bottle finished goods with in-line checks.",
    productShot: true,
  },
  {
    id: "jar",
    src: "/packaging/jar.jpg",
    title: "Jar finishing & labelling",
    category: "Production Facility",
    caption: "Powders, gummies, and jarred formats through secondary packaging.",
    productShot: true,
  },
  // Equipment
  {
    id: "g2",
    src: "/facility/gallery-2.png",
    title: "High-speed compression line",
    category: "Equipment",
    caption: "Tablet compression with in-line weight and hardness monitoring.",
  },
  {
    id: "lab-bench",
    src: "/facility/productions-hero-left.webp",
    title: "Analytical laboratory",
    category: "Equipment",
    caption: "Bench-scale development and analytical method support.",
  },
  {
    id: "research-hero",
    src: "/facility/research-hero.webp",
    title: "Analytical research hall",
    category: "Equipment",
    caption: "Method development and release testing for commercial batches.",
  },
  {
    id: "rd-bench",
    src: "/Generated/rd-lab-bench.png",
    title: "Development benches",
    category: "Equipment",
    caption: "Concept formulas refined before pilot and stability trials.",
  },
  {
    id: "rd-pilot",
    src: "/Generated/rd-pilot-validate.webp",
    title: "Pilot validation & analytics",
    category: "Equipment",
    caption: "Data-led pilot runs and stability readouts before scale-up.",
  },
  {
    id: "capsule",
    src: "/packaging/capsule.webp",
    title: "Capsule filling equipment",
    category: "Equipment",
    caption: "Hard-gel and specialty capsule formats on dedicated lines.",
    productShot: true,
  },
  {
    id: "tablet",
    src: "/packaging/tablet.webp",
    title: "Tablet compression formats",
    category: "Equipment",
    caption: "Multiple compression profiles for private-label tablet SKUs.",
    productShot: true,
  },
];
*/

const EASE = [0.22, 1, 0.36, 1] as const;
const FEATURED = GALLERY.filter((i) => i.featured);

function GalleryTile({
  item,
  onOpen,
  wide,
}: {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={`gallery-scroll-card group flex shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white text-left shadow-[0_2px_12px_rgba(17,50,39,0.06)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#11BB8A]/40 hover:shadow-[0_12px_32px_rgba(17,50,39,0.1)] active:scale-[0.98] ${
        wide ? "w-full min-w-0" : "w-[min(78vw,260px)] sm:w-[280px]"
      }`}
    >
      {/*
        Safari/Mac: do NOT use position:absolute + loading=lazy inside overflow-x rows —
        WebKit often never paints those images. Keep img in normal flow with a fixed aspect box.
      */}
      <div
        className={`w-full overflow-hidden bg-[#e8ece6] ${wide ? "aspect-[16/10]" : "aspect-[4/3]"}`}
      >
        <img
          src={item.src}
          alt={item.title}
          width={wide ? 800 : 560}
          height={wide ? 500 : 420}
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          style={{ display: "block", WebkitTransform: "translateZ(0)" }}
        />
      </div>
      <div className="border-t border-gray-100 px-4 py-3.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#547A3D]">
          {item.category}
        </span>
        <p className="mt-1.5 line-clamp-2 font-manrope text-[13px] font-semibold leading-snug text-[#113227] sm:text-sm">
          {item.title}
        </p>
      </div>
    </button>
  );
}

function ScrollRow({
  title,
  subtitle,
  items,
  onOpen,
}: {
  title: string;
  subtitle: string;
  items: GalleryItem[];
  onOpen: (item: GalleryItem) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".gallery-scroll-card");
    const step = card ? card.offsetWidth + 16 : Math.min(el.clientWidth * 0.8, 300);
    el.scrollTo({ left: el.scrollLeft + dir * step, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className="mb-10 sm:mb-14">
      <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
        <div>
          <H3 className="text-[#113227]">{title}</H3>
          <P className="mt-1 !text-sm text-gray-600">{subtitle}</P>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scroll(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-[#113227] shadow-sm transition-colors duration-200 hover:border-[#11BB8A] hover:text-[#11BB8A]"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scroll(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-[#113227] shadow-sm transition-colors duration-200 hover:border-[#11BB8A] hover:text-[#11BB8A]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-8 bg-gradient-to-r from-[#f4f7f2] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-8 bg-gradient-to-l from-[#f4f7f2] to-transparent"
          aria-hidden
        />
        <div
          ref={trackRef}
          className="gallery-scroll-track flex gap-4 overflow-x-auto snap-x snap-proximity overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <GalleryTile key={item.id} item={item} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const rows = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        title: cat,
        subtitle: `${GALLERY.filter((i) => i.category === cat && !i.featured).length} documented views`,
        items: GALLERY.filter((i) => i.category === cat && !i.featured),
      })),
    [],
  );

  const openLightbox = useCallback((item: GalleryItem) => setLightbox(item), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <div className="relative min-h-[100dvh] bg-[#f4f7f2]">
      {/* Static gradient — single layer, no blur */}
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(17,187,138,0.12),transparent_42%),radial-gradient(circle_at_88%_8%,rgba(84,122,61,0.1),transparent_38%),linear-gradient(180deg,#f4f7f2_0%,#f7faf5_50%,#f4f7f2_100%)]"
        aria-hidden
      />

      <div className="relative z-[1]">
        {/* Header */}
        <section className="zephyr-container py-12 sm:py-16 lg:py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#547A3D]">
              Facility gallery
            </p>
            <H1 className="mt-4 text-[#113227]">Manufacturing &amp; lab environments</H1>
            <P className="mt-4 text-gray-600">
              Production floors, packaging lines, and development labs for nutraceutical,
              herbaceutical, and organic partner programs. Scroll each row or tap to expand.
            </P>
          </Reveal>
        </section>

        {/* Featured — no Reveal wrapper: Safari can skip painting images inside opacity-animated parents */}
        <section className="zephyr-container pb-4 sm:pb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#547A3D]">
            Core capabilities
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {FEATURED.map((item) => (
              <GalleryTile key={item.id} item={item} onOpen={openLightbox} wide />
            ))}
          </div>
        </section>

        {/* Rows by environment type */}
        <section className="zephyr-container pb-14 sm:pb-20">
          {rows.map((row) => (
            <ScrollRow
              key={row.title}
              title={row.title}
              subtitle={row.subtitle}
              items={row.items}
              onOpen={openLightbox}
            />
          ))}
        </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0d241c]/92 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="relative w-full max-w-5xl rounded-2xl bg-white p-2 shadow-2xl sm:p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close"
                onClick={closeLightbox}
                className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#113227] shadow-md hover:text-[#11BB8A]"
              >
                <X size={18} />
              </button>
              <div className="overflow-hidden rounded-xl bg-[#e8ece6]">
                <img
                  src={lightbox.src}
                  alt={lightbox.title}
                  className="max-h-[70vh] w-full object-cover object-center"
                />
              </div>
              <div className="px-4 py-4 sm:px-5 sm:py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#547A3D]">
                  {lightbox.category}
                </p>
                <p className="mt-1.5 font-manrope text-lg font-semibold text-[#113227]">
                  {lightbox.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{lightbox.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
