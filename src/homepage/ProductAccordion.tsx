import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PRODUCT_ACCORDION_ITEMS, type ProductAccordionItem } from "./productAccordionData";

const EASE = [0.22, 1, 0.36, 1] as const;
const DEFAULT_ACTIVE_ID = PRODUCT_ACCORDION_ITEMS[0].id;
const DESKTOP_MIN = 1400;
const DESKTOP_AUTOPLAY_DELAY = 3000;

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

type CardHandlers = {
  onActivate: () => void;
  onViewMore: (item: ProductAccordionItem) => void;
};

function DesktopAccordionCard({
  item,
  active,
  onActivate,
  onViewMore,
}: { item: ProductAccordionItem; active: boolean } & CardHandlers) {
  const reduceMotion = Boolean(useReducedMotion());

  const handleCta = (e: MouseEvent) => {
    e.stopPropagation();
    onViewMore(item);
  };

  return (
    <article
      className={`product-accordion-card${active ? " is-active" : ""}`}
      style={{ "--card-accent": item.color } as CSSProperties}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      tabIndex={0}
      aria-label={`${item.title}: ${item.subtitle}`}
    >
      <div className="product-accordion-card__inner">
        <div className="product-accordion-card__media" aria-hidden={!active}>
          <motion.img
            src={item.image}
            alt=""
            initial={false}
            animate={
              active
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : 0.92 }
            }
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: EASE }}
            className="product-accordion-card__image"
            decoding="async"
          />
        </div>

        <div className="product-accordion-card__content">
          <span className="product-accordion-card__index">{item.index}</span>
          <h2 className="product-accordion-card__title">{item.title}</h2>
          <p className="product-accordion-card__subtitle">{item.subtitle}</p>

          <AnimatePresence initial={false}>
            {active ? (
              <motion.p
                key="desc"
                className="product-accordion-card__description"
                initial={reduceMotion ? false : { opacity: 0, y: 8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 6, height: 0 }}
                transition={{ duration: reduceMotion ? 0.15 : 0.4, ease: EASE }}
              >
                {item.description}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <button type="button" onClick={handleCta} className="product-accordion-card__cta">
            View more
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

/** Desktop (≥1400px) product accordion. Mobile/tablet/iPad Pro use MainSec as the hero. */
export default function ProductAccordion() {
  const navigate = useNavigate();
  const reduceMotion = Boolean(useReducedMotion());
  const isDesktop = useMediaQuery(`(min-width: ${DESKTOP_MIN}px)`);
  const [activeId, setActiveId] = useState(DEFAULT_ACTIVE_ID);
  const [desktopPaused, setDesktopPaused] = useState(false);
  const activeIdRef = useRef(activeId);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    PRODUCT_ACCORDION_ITEMS.forEach((item) => {
      const img = new Image();
      img.src = item.image;
    });
  }, []);

  useEffect(() => {
    if (!isDesktop || reduceMotion || desktopPaused) return;

    const timer = window.setInterval(() => {
      const items = PRODUCT_ACCORDION_ITEMS;
      const currentIndex = items.findIndex((item) => item.id === activeIdRef.current);
      const nextIndex = (currentIndex + 1) % items.length;
      setActiveId(items[nextIndex].id);
    }, DESKTOP_AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [isDesktop, reduceMotion, desktopPaused]);

  const handleViewMore = useCallback(
    (item: ProductAccordionItem) => {
      navigate(item.route);
    },
    [navigate],
  );

  if (!isDesktop) return null;

  return (
    <section
      className="product-accordion-section product-accordion-section--desktop"
      aria-label="Product ranges"
    >
      <div
        className="product-accordion-row"
        onMouseEnter={() => setDesktopPaused(true)}
        onMouseLeave={() => setDesktopPaused(false)}
        onFocus={() => setDesktopPaused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDesktopPaused(false);
          }
        }}
      >
        {PRODUCT_ACCORDION_ITEMS.map((item) => (
          <DesktopAccordionCard
            key={item.id}
            item={item}
            active={activeId === item.id}
            onActivate={() => setActiveId(item.id)}
            onViewMore={handleViewMore}
          />
        ))}
      </div>
    </section>
  );
}
