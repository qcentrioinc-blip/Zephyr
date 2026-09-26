import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Package, X } from "lucide-react";
import type { FormulaItem, FormulaRangeId } from "../components/formulaTypes";
import FormulaProductModal from "../components/FormulaProductModal";
import { FLOATING_CONTROLS_SHOW_AFTER_PX } from "../components/ScrollToTopButton";
import {
  FEATURED_RANGES,
  enquireHrefForRange,
  getCategoriesForRange,
  getRangeMeta,
} from "./featuredProducts";

type ProductLauncherProps = {
  /** False while page-lock is open — launcher stays hidden. */
  enabled?: boolean;
};

type ModalState = {
  rangeId: FormulaRangeId;
  category: string;
  item: FormulaItem;
} | null;

const EASE = [0.22, 1, 0.36, 1] as const;

const SCROLL_CLASS: Record<FormulaRangeId, string> = {
  nutraceutical: "zephyr-scroll-nutra",
  herbaceutical: "zephyr-scroll-herba",
  organic: "zephyr-scroll-organic",
};

export default function ProductLauncher({ enabled = true }: ProductLauncherProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listScrollRef = useRef<HTMLDivElement>(null);
  const categoryHeaderRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [open, setOpen] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(false);
  const [activeRange, setActiveRange] =
    useState<FormulaRangeId>("nutraceutical");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [isMobile, setIsMobile] = useState(false);

  const categories = getCategoriesForRange(activeRange);
  const rangeMeta = getRangeMeta(activeRange);
  const controlsVisible = enabled && scrollVisible;

  const setCategoryHeaderRef = useCallback(
    (name: string, el: HTMLButtonElement | null) => {
      if (el) categoryHeaderRefs.current.set(name, el);
      else categoryHeaderRefs.current.delete(name);
    },
    [],
  );

  /* First category expanded whenever range tab changes */
  useEffect(() => {
    const first = getCategoriesForRange(activeRange)[0]?.name ?? null;
    setExpandedCategory(first);
  }, [activeRange]);

  /* Keep expanded category header + first formulas visible in the list */
  useEffect(() => {
    if (!expandedCategory) return;

    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
    const scrollExpandedIntoView = () => {
      const list = listScrollRef.current;
      const header = categoryHeaderRefs.current.get(expandedCategory);
      if (!list || !header) return;
      const listTop = list.getBoundingClientRect().top;
      const headerTop = header.getBoundingClientRect().top;
      list.scrollTo({
        top: list.scrollTop + (headerTop - listTop),
        behavior,
      });
    };

    /* Wait for previous accordion collapse / layout before scrolling */
    const delay = reduceMotion ? 0 : 240;
    const id = window.setTimeout(scrollExpandedIntoView, delay);
    return () => window.clearTimeout(id);
  }, [expandedCategory, reduceMotion, activeRange]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* Same scroll threshold as ScrollToTopButton */
  useEffect(() => {
    const onScroll = () => {
      setScrollVisible(window.scrollY > FLOATING_CONTROLS_SHOW_AFTER_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  const togglePanel = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  /* Open panel by default when floating controls appear; close when they hide */
  useEffect(() => {
    setOpen(controlsVisible);
  }, [controlsVisible]);

  /* Close panel on Escape; keep modal Escape handled by FormulaProductModal */
  useEffect(() => {
    if (!open || modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, modal, closePanel]);

  /* Desktop: click outside panel + trigger closes */
  useEffect(() => {
    if (!open || isMobile || modal) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      closePanel();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open, isMobile, modal, closePanel]);

  /* Body scroll lock only for mobile sheet */
  useEffect(() => {
    if (!open || !isMobile || modal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobile, modal]);

  /* Focus panel when opened */
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
  }, [open]);

  if (!enabled) return null;

  const openProduct = (
    rangeId: FormulaRangeId,
    category: string,
    item: FormulaItem,
  ) => {
    setModal({ rangeId, category, item });
  };

  const toggleCategory = (name: string) => {
    setExpandedCategory((prev) => (prev === name ? null : name));
  };

  const panelContent = (
    <div className="flex h-[min(80vh,42rem)] flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/5 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#113227]/70">
            Product ranges
          </p>
          <p className="product-launcher__shine mt-0.5 text-[15px] font-semibold sm:text-base">
            High-Demand Formulations
          </p>
        </div>
        <button
          type="button"
          onClick={closePanel}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#113227]/70 transition hover:bg-black/5 hover:text-[#113227]"
          aria-label="Close products panel"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div
        className="flex shrink-0 gap-1 px-2.5 pt-3 sm:gap-1.5 sm:px-3"
        role="tablist"
        aria-label="Product range"
      >
        {FEATURED_RANGES.map((range) => {
          const active = range.id === activeRange;
          return (
            <button
              key={range.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveRange(range.id)}
              className="min-w-0 flex-1 rounded-full px-1.5 py-2 text-[11px] font-semibold leading-tight tracking-wide transition sm:px-2 sm:text-xs"
              style={
                active
                  ? {
                      backgroundColor: range.theme.accent,
                      color: "#fff",
                    }
                  : {
                      backgroundColor: range.theme.accentSoft,
                      color: range.theme.accent,
                    }
              }
            >
              <span className="block truncate">{range.shortLabel}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={listScrollRef}
        className={`mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2 ${SCROLL_CLASS[activeRange]}`}
      >
        <ul className="flex flex-col" role="list">
          {categories.map((cat) => {
            const isExpanded = expandedCategory === cat.name;
            return (
              <li
                key={cat.name}
                className="border-b border-black/[0.06] last:border-b-0"
              >
                <button
                  type="button"
                  ref={(el) => setCategoryHeaderRef(cat.name, el)}
                  aria-expanded={isExpanded}
                  onClick={() => toggleCategory(cat.name)}
                  className="flex w-full items-center justify-between gap-2 px-2 py-3 text-left transition hover:bg-black/[0.03]"
                >
                  <span className="text-[13px] font-semibold text-[#113227] sm:text-sm">
                    {cat.name}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    style={{ color: rangeMeta.theme.accent }}
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded ? (
                    <motion.div
                      key={`${cat.name}-formulas`}
                      initial={
                        reduceMotion ? false : { height: 0, opacity: 0 }
                      }
                      animate={{ height: "auto", opacity: 1 }}
                      exit={
                        reduceMotion
                          ? undefined
                          : { height: 0, opacity: 0 }
                      }
                      transition={{ duration: 0.22, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <ul
                        className="flex flex-col gap-0.5 px-1 pb-2"
                        role="list"
                      >
                        {cat.formulas.map((item) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() =>
                                openProduct(activeRange, cat.name, item)
                              }
                              className="group w-full rounded-lg px-2.5 py-2 text-left text-[12px] font-medium leading-snug whitespace-normal text-[#113227]/90 transition hover:bg-black/[0.04] sm:text-[13px]"
                              style={
                                {
                                  ["--hover-accent"]: rangeMeta.theme.accent,
                                } as CSSProperties
                              }
                            >
                              <span className="group-hover:text-[color:var(--hover-accent)]">
                                {item.formula}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="shrink-0 border-t border-black/5 px-4 py-3">
        <Link
          to={rangeMeta.href}
          onClick={closePanel}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
          style={{ backgroundColor: rangeMeta.theme.accent }}
        >
          View all {rangeMeta.label}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {controlsVisible ? (
          <motion.div
            key="product-launcher"
            className="pointer-events-none fixed bottom-5 left-5 z-[105] sm:bottom-6 sm:left-6"
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <div className="pointer-events-auto relative">
              <AnimatePresence>
                {open && !isMobile ? (
                  <motion.div
                    key="desktop-panel"
                    ref={panelRef}
                    id={panelId}
                    role="dialog"
                    aria-modal="false"
                    aria-label="High-Demand Formulations"
                    tabIndex={-1}
                    initial={
                      reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={
                      reduceMotion
                        ? undefined
                        : { opacity: 0, y: 8, scale: 0.97 }
                    }
                    transition={{ duration: 0.22, ease: EASE }}
                    className="absolute bottom-[calc(100%+0.75rem)] left-0 w-[min(24rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_16px_48px_rgba(17,50,39,0.18)] outline-none"
                  >
                    {panelContent}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.button
                ref={triggerRef}
                type="button"
                onClick={togglePanel}
                aria-expanded={open}
                aria-controls={open ? panelId : undefined}
                aria-label={
                  open
                    ? "Close products"
                    : "Browse high-demand formulations"
                }
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                className="flex items-center gap-2 rounded-full bg-[#113227] py-3 pl-3.5 pr-4 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(17,50,39,0.28)] transition hover:bg-[#0d281f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11BB8A] focus-visible:ring-offset-2"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                  {open ? (
                    <X className="h-4 w-4" strokeWidth={2} />
                  ) : (
                    <Package className="h-4 w-4" strokeWidth={1.8} />
                  )}
                </span>
                Products
              </motion.button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Mobile bottom sheet + scrim */}
      <AnimatePresence>
        {open && isMobile && controlsVisible ? (
          <motion.div
            key="mobile-sheet"
            className="fixed inset-0 z-[105] sm:hidden"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-[#0d241c]/45"
              aria-label="Close products panel"
              onClick={closePanel}
            />
            <motion.div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label="High-Demand Formulations"
              tabIndex={-1}
              initial={reduceMotion ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduceMotion ? undefined : { y: "100%" }}
              transition={{ duration: 0.28, ease: EASE }}
              className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-3xl bg-white shadow-[0_-12px_40px_rgba(17,50,39,0.2)] outline-none"
            >
              <div className="flex justify-center pt-3" aria-hidden>
                <span className="h-1 w-10 rounded-full bg-black/15" />
              </div>
              {panelContent}
              <div className="h-[max(0.5rem,env(safe-area-inset-bottom))]" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <FormulaProductModal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        item={modal?.item ?? null}
        category={modal?.category ?? ""}
        theme={modal ? getRangeMeta(modal.rangeId).theme : rangeMeta.theme}
        rangeId={modal?.rangeId ?? "nutraceutical"}
        enquireHref={(formula, category) =>
          enquireHrefForRange(
            modal?.rangeId ?? "nutraceutical",
            formula,
            category,
          )
        }
      />
    </>
  );
}
