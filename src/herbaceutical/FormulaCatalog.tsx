import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ListFilter, Search, Send, X } from "lucide-react";
import { theme, categories as allCategories, type FormulaCategory, type FormulaItem } from "./data";
import { H1, H3, P } from "../Global/Typography/Typo";

type FormulaCardProps = {
  item: FormulaItem;
  category: string;
  enquireHref: (formula: string, category: string) => string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function FormulaCard({ item, category, enquireHref }: FormulaCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22, ease: EASE }}
      className="group mx-auto flex h-full w-full max-w-[220px] flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
    >
      <div className="relative h-[160px] w-full overflow-hidden bg-white sm:h-[190px] lg:h-[210px]">
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <h4 className="line-clamp-3 text-[13px] font-semibold leading-snug text-gray-900">
          {item.formula}
        </h4>
        <Link
          to={enquireHref(item.formula, category)}
          className="mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: theme.accent }}
        >
          Enquire / MOQ
          <Send className="h-3 w-3" />
        </Link>
      </div>
    </motion.article>
  );
}

type CategoryListProps = {
  categories: FormulaCategory[];
  activeCategory: string;
  onSelect: (name: string) => void;
};

function CategoryList({ categories, activeCategory, onSelect }: CategoryListProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => onSelect("All")}
        className={`mb-1 w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
          activeCategory === "All"
            ? "text-white"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        style={
          activeCategory === "All" ? { backgroundColor: theme.accent } : undefined
        }
      >
        All categories
      </button>
      {categories.map((c) => (
        <button
          key={c.name}
          type="button"
          onClick={() => onSelect(c.name)}
          className={`mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
            activeCategory === c.name
              ? "font-semibold text-white"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          style={
            activeCategory === c.name
              ? { backgroundColor: theme.accent }
              : undefined
          }
        >
          <span className="pr-2">{c.name}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] ${
              activeCategory === c.name
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {c.formulas.length}
          </span>
        </button>
      ))}
    </>
  );
}

export default function FormulaCatalog() {
  const categories = allCategories;
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const filterRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => Object.fromEntries(categories.map((c) => [c.name, true]))
  );

  const totalFormulas = categories.reduce((n, c) => n + c.formulas.length, 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => activeCategory === "All" || c.name === activeCategory)
      .map((c) => ({
        ...c,
        formulas: c.formulas.filter(
          (f) =>
            !q ||
            f.formula.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q)
        ),
      }))
      .filter((c) => c.formulas.length > 0);
  }, [categories, activeCategory, query]);

  const visibleCount = filtered.reduce((n, c) => n + c.formulas.length, 0);

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const selectCategory = (name: string) => {
    setActiveCategory(name);
    setFilterOpen(false);
    if (name !== "All") {
      setOpenCategories((prev) => ({ ...prev, [name]: true }));
      requestAnimationFrame(() => {
        const el = sectionRefs.current[name];
        if (!el) return;
        // Offset for sticky Navbar (~65px) + Breadcrumbs (~42px)
        const STICKY_OFFSET = 120;
        const top = el.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      });
    }
  };

  useEffect(() => {
    if (!filterOpen) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilterOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [filterOpen]);

  const enquireHref = (formula: string, category: string) =>
    `/contact?subject=${encodeURIComponent(
      `MOQ enquiry - ${theme.title}: ${category}`
    )}&message=${encodeURIComponent(
      `I would like to enquire about manufacturing / MOQ for:\n${formula}\n\nRange: ${theme.title}\nCategory: ${category}`
    )}`;

  return (
    <div className="w-full bg-white">
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${theme.heroImage})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(105deg, ${theme.bg}f2 0%, ${theme.bg}d9 34%, ${theme.bg}66 62%, ${theme.bg}14 82%, transparent 100%)`,
          }}
          aria-hidden="true"
        />

        <div className="zephyr-container relative z-10 pt-10 pb-8 sm:pt-12 sm:pb-10">
          <div className="mx-auto flex min-h-[280px] max-w-7xl flex-col justify-center py-12 sm:min-h-[320px] sm:py-16 lg:min-h-[360px] lg:py-20">
            <P
              className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]"
              style={{ color: theme.accent }}
            >
              Product range · Private label & custom formulations
            </P>
            <H1 className="max-w-3xl text-gray-900">{theme.title}</H1>
            <P className="mt-4 max-w-2xl text-gray-800" style={{ color: theme.border }}>
              {theme.subtitle}
            </P>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-700">
              <span
                className="rounded-full px-3 py-1 font-medium text-white"
                style={{ backgroundColor: theme.accent }}
              >
                {categories.length} categories
              </span>
              <span
                className="rounded-full px-3 py-1 font-medium"
                style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
              >
                {totalFormulas} formulas
              </span>
              <span className="font-medium text-gray-700">
                MOQ & manufacturing on enquiry · No retail pricing
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="zephyr-container zephyr-section">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Desktop sidebar — unchanged */}
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-28 space-y-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search formulas…"
                  className="w-full rounded-full border border-gray-200 bg-[#F7F8F9] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div className="zephyr-scroll-herba max-h-[min(78vh,calc(100vh-9rem))] min-h-[420px] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-3">
                <CategoryList
                  categories={categories}
                  activeCategory={activeCategory}
                  onSelect={selectCategory}
                />
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {/* Mobile / tablet toolbar */}
            <div className="mb-4 flex flex-col gap-3 lg:hidden">
              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search formulas…"
                    className="w-full rounded-full border border-gray-200 bg-[#F7F8F9] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-400"
                  />
                </div>

                <div className="relative shrink-0" ref={filterRef}>
                  <button
                    type="button"
                    onClick={() => setFilterOpen((o) => !o)}
                    aria-expanded={filterOpen}
                    aria-haspopup="listbox"
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm"
                  >
                    <ListFilter className="h-4 w-4" style={{ color: theme.accent }} />
                    Filter
                    {activeCategory !== "All" && (
                      <span
                        className="ml-0.5 max-w-[72px] truncate rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                        style={{ backgroundColor: theme.accent }}
                      >
                        {activeCategory}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {filterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="absolute right-0 z-40 mt-2 w-[min(86vw,300px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
                        role="listbox"
                      >
                        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5">
                          <span className="text-sm font-semibold text-gray-800">
                            Categories
                          </span>
                          <button
                            type="button"
                            onClick={() => setFilterOpen(false)}
                            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                            aria-label="Close filter"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="zephyr-scroll-herba max-h-[70vh] overflow-y-auto p-2">
                          <CategoryList
                            categories={categories}
                            activeCategory={activeCategory}
                            onSelect={selectCategory}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <P className="text-gray-500">
                Showing{" "}
                <strong className="text-gray-800">{visibleCount}</strong>{" "}
                formula{visibleCount === 1 ? "" : "s"}
                {activeCategory !== "All" && (
                  <span className="text-gray-400"> · {activeCategory}</span>
                )}
              </P>
              <Link
                to={`/contact?subject=${encodeURIComponent(
                  `Partnership enquiry - ${theme.title}`
                )}`}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: theme.accent }}
              >
                Enquire about this range
                <Send className="h-3.5 w-3.5" />
              </Link>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
                No formulas match your search.
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((category) => {
                  const open = openCategories[category.name] ?? true;
                  return (
                    <div
                      key={category.name}
                      ref={(el) => {
                        sectionRefs.current[category.name] = el;
                      }}
                      className="scroll-mt-28 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                    >
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.name)}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left sm:px-5"
                        style={{ backgroundColor: theme.accentSoft }}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <H3 className="text-base sm:text-lg">
                              {category.name}
                            </H3>
                            <span
                              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                              style={{
                                backgroundColor: theme.accent,
                                boxShadow: `0 0 0 1px ${theme.accent}55, 0 0 16px ${theme.accent}66`,
                              }}
                            >
                              {category.formulas.length} formulation
                              {category.formulas.length === 1 ? "" : "s"}
                            </span>
                          </div>
                        </div>
                        <motion.span
                          animate={{ rotate: open ? 180 : 0 }}
                          transition={{ duration: 0.22, ease: EASE }}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
                          style={{ color: theme.accent }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-2 justify-items-center gap-3 border-t border-gray-100 bg-white p-3 sm:grid-cols-3 sm:p-4 lg:grid-cols-4">
                              {category.formulas.map((item) => (
                                <FormulaCard
                                  key={item.id}
                                  item={item}
                                  category={category.name}
                                  enquireHref={enquireHref}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
