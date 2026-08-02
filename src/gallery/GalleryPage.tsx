import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { H1, H3, P } from "../Global/Typography/Typo";

const FILTERS = ["All", "Factory Tour", "Production Facility", "Equipment"] as const;

type Filter = (typeof FILTERS)[number];

type GalleryItem = {
  src: string;
  title: string;
  category: Exclude<Filter, "All">;
  span?: string;
};

const ITEMS: GalleryItem[] = [
  {
    src: "/Gallery/LongGallery.png",
    title: "Production floor overview",
    category: "Production Facility",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/Gallery/Gallery1.png",
    title: "Controlled manufacturing bay",
    category: "Factory Tour",
  },
  {
    src: "/Gallery/Gallery2.png",
    title: "High-speed compression line",
    category: "Equipment",
  },
  {
    src: "/Gallery/Gallery3.png",
    title: "Packaging & finishing",
    category: "Production Facility",
  },
  {
    src: "/Gallery/Gallery5.png",
    title: "Quality-ready workspace",
    category: "Factory Tour",
  },
  {
    src: "/Production/ProductionsHeroLeft.png",
    title: "Laboratory environment",
    category: "Equipment",
  },
  {
    src: "/Production/ProductionsHeroRight.png",
    title: "Facility exterior & scale",
    category: "Factory Tour",
    span: "md:col-span-2",
  },
  {
    src: "/Production.png",
    title: "End-to-end manufacturing partner",
    category: "Production Facility",
  },
  {
    src: "/Research.png",
    title: "R&D and analytical labs",
    category: "Equipment",
  },
  {
    src: "/Research/Research1.png",
    title: "Formulation development suite",
    category: "Factory Tour",
  },
  {
    src: "/Research/ResearchStats.png",
    title: "In-process quality checkpoints",
    category: "Equipment",
  },
  {
    src: "/Homepage/production/blister.png",
    title: "Blister packaging capability",
    category: "Production Facility",
  },
  {
    src: "/Homepage/production/bottle.png",
    title: "Bottle packing lines",
    category: "Production Facility",
  },
  {
    src: "/Homepage/production/capsule.png",
    title: "Hard-gel capsule filling",
    category: "Equipment",
  },
  {
    src: "/Homepage/production/tablet.png",
    title: "Tablet compression formats",
    category: "Equipment",
  },
  {
    src: "/Homepage/production/jar.png",
    title: "Jar finishing & labelling readiness",
    category: "Production Facility",
  },
  {
    src: "/Generated/showreel-formulation.png",
    title: "Formulation weighing suite",
    category: "Factory Tour",
  },
  {
    src: "/Research/research-hero.png",
    title: "Analytical research hall",
    category: "Equipment",
    span: "md:col-span-2",
  },
  {
    src: "/Generated/rd-lab-bench.png",
    title: "Analytical development benches",
    category: "Equipment",
  },
  {
    src: "/Generated/production-compression.png",
    title: "Compression suite operations",
    category: "Production Facility",
    span: "md:col-span-2",
  },
  {
    src: "/Generated/packaging-flatlay.png",
    title: "Finished-pack format library",
    category: "Factory Tour",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function GalleryPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const visible = useMemo(
    () =>
      filter === "All" ? ITEMS : ITEMS.filter((item) => item.category === filter),
    [filter]
  );

  return (
    <div className="relative w-full overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(84,122,61,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(74,163,167,0.12),transparent_40%)]" />

      <section className="zephyr-section relative overflow-hidden">
        <div className="zephyr-container relative py-6 text-center sm:py-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#547A3D]"
          >
            Photos & Videos
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease }}
          >
            <H1>Inside Zephyr</H1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease }}
            className="mx-auto mt-4 max-w-2xl"
          >
            <P className="text-gray-600">
              A look at our manufacturing environment, production capability, and
              the equipment that powers custom nutraceutical, herbaceutical, and
              organic partnerships.
            </P>
          </motion.div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === f
                    ? "bg-[#113227] text-white"
                    : "bg-[#F1F3F4] text-gray-600 hover:bg-[#E8EAED]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="zephyr-container relative pb-16">
        <motion.div
          layout
          className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((item, index) => (
              <motion.article
                layout
                key={`${item.src}-${item.title}`}
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, delay: index * 0.03, ease }}
                whileHover={{ y: -4 }}
                onClick={() => setActive(item)}
                className={`group relative cursor-pointer overflow-hidden rounded-3xl bg-gray-100 ${item.span ?? ""}`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/55 opacity-90 transition group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mb-2 inline-block rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                    {item.category}
                  </span>
                  <H3 className="text-lg text-white sm:text-xl">{item.title}</H3>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease }}
              className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close gallery lightbox"
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-2 text-white backdrop-blur-sm transition hover:bg-white/25"
              >
                <X size={18} />
              </button>
              <img
                src={active.src}
                alt={active.title}
                className="max-h-[78vh] w-full object-contain"
              />
              <div className="border-t border-white/10 bg-black/80 px-5 py-4 text-white">
                <p className="text-xs uppercase tracking-wide text-white/60">
                  {active.category}
                </p>
                <H3 className="mt-1 text-white">{active.title}</H3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
