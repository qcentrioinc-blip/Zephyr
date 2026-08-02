import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function GalleryPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const visible = useMemo(
    () =>
      filter === "All" ? ITEMS : ITEMS.filter((item) => item.category === filter),
    [filter]
  );

  return (
    <div className="w-full bg-white">
      <section className="zephyr-section relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(84,122,61,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(74,163,167,0.12),transparent_40%)]" />
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

      <section className="zephyr-container pb-16">
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 auto-rows-[220px]">
          <AnimatePresence mode="popLayout">
            {visible.map((item, index) => (
              <motion.article
                layout
                key={`${item.src}-${item.title}`}
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, delay: index * 0.04, ease }}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-3xl bg-gray-100 ${item.span ?? ""}`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 transition group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mb-2 inline-block rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                    {item.category}
                  </span>
                  <H3 className="text-white text-lg sm:text-xl">{item.title}</H3>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <P className="mt-10 text-center text-sm text-gray-500">
          * Images depicted are for indicative purposes only and do not represent
          actual products, services or categories.
        </P>
      </section>
    </div>
  );
}
