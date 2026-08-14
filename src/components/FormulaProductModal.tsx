import { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Send, X } from "lucide-react";
import type { FormulaItem, FormulaRangeId, RangeTheme } from "./formulaTypes";
import { getFormulaDetails } from "./formulaCopy";
import { LetterStrip } from "./LetterStrip";
import { P } from "./Typography/Typo";
import FormulaModalGallery from "./FormulaModalGallery";

type Props = {
  open: boolean;
  onClose: () => void;
  item: FormulaItem | null;
  category: string;
  theme: RangeTheme;
  rangeId: FormulaRangeId;
  enquireHref: (formula: string, category: string) => string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FormulaProductModal({
  open,
  onClose,
  item,
  category,
  theme,
  rangeId,
  enquireHref,
}: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    panelRef.current.focus();
  }, [open, item?.id]);

  if (!item) return null;

  const { description, benefits } = getFormulaDetails(
    item.formula,
    category,
    rangeId,
    item,
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            aria-label="Close dialog"
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE }}
            className="relative z-10 flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border bg-white shadow-2xl sm:rounded-2xl"
            style={{ borderColor: `${theme.accent}44` }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2 lg:items-stretch">
              <FormulaModalGallery
                bottleImage={item.image}
                gallery={item.gallery}
                alt={item.formula}
                accent={theme.accent}
              />

              <div className="flex min-h-0 flex-col overflow-y-auto p-5 sm:p-6 lg:p-7">
                <p
                  className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: theme.accent }}
                >
                  {category}
                </p>

                <LetterStrip
                  as="h2"
                  id={titleId}
                  text={item.formula}
                  immediate
                  variant="inherit"
                  className="font-manrope text-[18px] font-semibold leading-[1.1] tracking-wide text-gray-900 sm:text-[22px] lg:text-[24px]"
                />

                <P className="mt-4 text-gray-600">{description}</P>

                <ul className="mt-5 space-y-2.5">
                  {benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-2.5 text-[13px] leading-snug text-gray-700 sm:text-sm"
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: theme.accentSoft,
                          color: theme.accent,
                        }}
                      >
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <Link
                    to={enquireHref(item.formula, category)}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: theme.accent }}
                  >
                    Request MOQ
                    <Send className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
