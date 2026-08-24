import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition, type Transition } from "framer-motion";
import { ArrowRight, Leaf, Pill, Sprout } from "lucide-react";
import { PRODUCT_ACCORDION_ITEMS, type ProductAccordionItem } from "./productAccordionData";
import { LetterStrip } from "../components/LetterStrip";
import { HERO_DESKTOP_MIN_PX } from "./heroBreakpoints";

const EASE = [0.22, 1, 0.36, 1] as const;
const DEFAULT_ACTIVE_ID = PRODUCT_ACCORDION_ITEMS[0].id;
const DESKTOP_MIN = HERO_DESKTOP_MIN_PX;
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

const RANGE_ICONS: Record<string, { Icon: React.ElementType; animation: TargetAndTransition; transition: Transition }> = {
  herbaceutical: {
    Icon: Leaf,
    animation: { rotate: [0, -8, 8, 0] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
  nutraceutical: {
    Icon: Pill,
    animation: { y: [0, -6, 0] },
    transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
  },
  organic: {
    Icon: Sprout,
    animation: { scale: [1, 1.12, 1] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

/** Industry-specific animated icon shown in inactive state */
function RangeIcon({ id, color }: { id: string; color: string }) {
  const config = RANGE_ICONS[id] ?? RANGE_ICONS.herbaceutical;
  const { Icon, animation, transition } = config;
  return (
    <motion.div
      className="accordion-icon-wrap"
      animate={animation}
      transition={transition}
      style={{ color }}
      aria-hidden
    >
      <Icon strokeWidth={1.5} className="accordion-icon-svg" />
    </motion.div>
  );
}

/** Subtle full-card video for inactive panels — src loads only while inactive. */
function InactivePanelVideo({
  src,
  visible,
  reduceMotion,
}: {
  src: string;
  visible: boolean;
  reduceMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || reduceMotion) {
      setActiveSrc(null);
      videoRef.current?.pause();
      return;
    }
    setActiveSrc(src);
  }, [visible, reduceMotion, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeSrc || reduceMotion || !visible) return;
    void video.play().catch(() => {});
  }, [activeSrc, visible, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div
      className="product-accordion-card__video-wrap"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      aria-hidden
    >
      {activeSrc ? (
        <video
          ref={videoRef}
          className="product-accordion-card__video"
          src={activeSrc}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          onLoadedData={(e) => {
            if (visible) void e.currentTarget.play().catch(() => {});
          }}
        />
      ) : null}
    </motion.div>
  );
}

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
      style={
        {
          "--card-accent": item.color,
          "--card-bg": `url("${item.panelBg}")`,
        } as CSSProperties
      }
      onMouseEnter={onActivate}
      onFocus={onActivate}
      tabIndex={0}
      aria-label={`${item.title}: ${item.subtitle}`}
    >
      <InactivePanelVideo
        src={item.panelVideo}
        visible={!active}
        reduceMotion={reduceMotion}
      />
      <div className="product-accordion-card__inner">
        {/* Inactive: animated industry icon */}
        {!active ? (
          <div className="product-accordion-card__icon" aria-hidden>
            <RangeIcon id={item.id} color={item.color} />
          </div>
        ) : null}

        {/* Active: product photo */}
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
          {/* Active: title + subtitle side-by-side, no number */}
          {active ? (
            <div className="product-accordion-card__heading product-accordion-card__heading--active">
              <div className="product-accordion-card__heading-copy">
                <LetterStrip
                  key={`acc-active-${item.id}`}
                  as="h2"
                  text={item.title}
                  variant="inherit"
                  immediate
                  className="product-accordion-card__title"
                />
                <p className="product-accordion-card__subtitle">{item.subtitle}</p>
              </div>
            </div>
          ) : (
            /* Inactive: title + subtitle stacked, no number */
            <div className="product-accordion-card__heading">
              <div className="product-accordion-card__heading-copy">
                <LetterStrip
                  as="h2"
                  text={item.title}
                  variant="inherit"
                  className="product-accordion-card__title"
                />
                <p className="product-accordion-card__subtitle">{item.subtitle}</p>
              </div>
            </div>
          )}

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

/** Desktop (≥1200px) product accordion. Below that, MainSec is the hero. */
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
    let cancelled = false;
    const preloadImages = () => {
      if (cancelled) return;
      PRODUCT_ACCORDION_ITEMS.forEach((item, index) => {
        window.setTimeout(() => {
          if (cancelled) return;
          const product = new Image();
          product.src = item.image;
          const bg = new Image();
          bg.src = item.panelBg;
        }, index * 120);
      });
    };

    const ric = window.requestIdleCallback?.(preloadImages, { timeout: 2500 });
    const t = ric == null ? window.setTimeout(preloadImages, 800) : undefined;

    return () => {
      cancelled = true;
      if (ric != null) window.cancelIdleCallback?.(ric);
      if (t != null) window.clearTimeout(t);
    };
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
      <div className="product-accordion-shell">
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
      </div>
    </section>
  );
}
