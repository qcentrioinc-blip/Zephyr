import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PRODUCT_ACCORDION_ITEMS, type ProductAccordionItem } from "./productAccordionData";

const EASE = [0.22, 1, 0.36, 1] as const;
const DEFAULT_ACTIVE_ID = PRODUCT_ACCORDION_ITEMS[0].id;
const DESKTOP_MIN = 1280;
const AUTOPLAY_DELAY = 5000;
const DESKTOP_AUTOPLAY_DELAY = 3000;
const TRANSITION_MS = 550;

const heroImageVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 72 : -72,
    opacity: 0,
    scale: 0.94,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: TRANSITION_MS / 1000,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -72 : 72,
    opacity: 0,
    scale: 0.94,
    transition: {
      duration: TRANSITION_MS / 1000,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  }),
};

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
      aria-label={`${item.title} — ${item.subtitle}`}
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

function MobileHeroCarousel({
  onViewMore,
}: {
  onViewMore: (item: ProductAccordionItem) => void;
}) {
  const reduceMotion = Boolean(useReducedMotion());
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const isAnimatingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unlockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const item = PRODUCT_ACCORDION_ITEMS[current];
  const transitionMs = reduceMotion ? 300 : TRANSITION_MS;

  const clearAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const goToSlide = useCallback(
    (resolveIndex: (c: number) => number, dir: number) => {
      if (isAnimatingRef.current) return;

      isAnimatingRef.current = true;
      setIsAnimating(true);
      setDirection(dir);
      setCurrent(resolveIndex);

      if (unlockTimeoutRef.current) clearTimeout(unlockTimeoutRef.current);
      unlockTimeoutRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
        setIsAnimating(false);
      }, transitionMs + 120);
    },
    [transitionMs],
  );

  const startAutoplay = useCallback(() => {
    clearAutoplay();
    intervalRef.current = setInterval(() => {
      goToSlide((c) => (c + 1) % PRODUCT_ACCORDION_ITEMS.length, 1);
    }, AUTOPLAY_DELAY);
  }, [clearAutoplay, goToSlide]);

  const handleAnimationComplete = useCallback(() => {
    if (unlockTimeoutRef.current) {
      clearTimeout(unlockTimeoutRef.current);
      unlockTimeoutRef.current = null;
    }
    isAnimatingRef.current = false;
    setIsAnimating(false);
  }, []);

  const nextSlide = useCallback(
    () => goToSlide((c) => (c + 1) % PRODUCT_ACCORDION_ITEMS.length, 1),
    [goToSlide],
  );
  const prevSlide = useCallback(
    () =>
      goToSlide(
        (c) => (c === 0 ? PRODUCT_ACCORDION_ITEMS.length - 1 : c - 1),
        -1,
      ),
    [goToSlide],
  );

  const goToIndex = useCallback(
    (index: number) => {
      setCurrent((prevIndex) => {
        if (index === prevIndex || isAnimatingRef.current) return prevIndex;
        goToSlide(() => index, index > prevIndex ? 1 : -1);
        return prevIndex;
      });
    },
    [goToSlide],
  );

  useEffect(() => {
    startAutoplay();
    return clearAutoplay;
  }, [current, startAutoplay, clearAutoplay]);

  useEffect(() => {
    return () => {
      clearAutoplay();
      if (unlockTimeoutRef.current) clearTimeout(unlockTimeoutRef.current);
    };
  }, [clearAutoplay]);

  const navDisabled = isAnimating;

  return (
    <motion.section
      className="product-accordion-hero mainsec-hero relative overflow-hidden h-auto"
      animate={{ backgroundColor: item.color }}
      transition={{
        duration: reduceMotion ? 0.35 : 0.65,
        ease: "easeInOut",
      }}
      aria-label="Product ranges"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          animate={{ opacity: reduceMotion ? 0.75 : 1 }}
          transition={{ duration: reduceMotion ? 0.4 : 1, ease: "easeOut" }}
          className="absolute left-1/2 top-[36%] h-[min(110vw,920px)] w-[min(110vw,920px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.14) 42%, transparent 72%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-6 sm:px-6 sm:pt-20 sm:pb-8 md:pt-24 md:pb-10 lg:px-8 lg:pt-20 lg:pb-10">
        <div className="flex justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={item.id}
              initial={
                reduceMotion ? false : { clipPath: "inset(100% 0 0 0)", opacity: 0 }
              }
              animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { clipPath: "inset(0 0 100% 0)", opacity: 0 }
              }
              transition={{ duration: reduceMotion ? 0.25 : 0.55 }}
              className="product-accordion-hero__watermark px-2 sm:px-4 text-center"
            >
              {item.watermark}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="relative z-30 mt-3 sm:mt-4 max-w-xl mx-auto text-center lg:max-w-2xl">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`headline-${item.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.04 }}
              className="product-accordion-hero__headline"
            >
              {item.headline}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`desc-${item.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, delay: 0.06 }}
              className="product-accordion-hero__description mt-3 sm:mt-4 px-2 sm:px-0"
            >
              {item.description}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`cta-${item.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, delay: 0.08 }}
              className="mt-5 sm:mt-6 flex justify-center"
            >
              <button
                type="button"
                onClick={() => onViewMore(item)}
                className="product-accordion-hero__cta"
              >
                View more
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={prevSlide}
          disabled={navDisabled}
          aria-label="Previous product"
          className={`product-accordion-hero__nav product-accordion-hero__nav--prev${
            navDisabled ? " is-disabled" : ""
          }`}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          disabled={navDisabled}
          aria-label="Next product"
          className={`product-accordion-hero__nav product-accordion-hero__nav--next${
            navDisabled ? " is-disabled" : ""
          }`}
        >
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </button>

        <div className="pointer-events-none relative -mt-10 sm:-mt-16 md:-mt-20 lg:-mt-24 flex h-[280px] xs:h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px] justify-center">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <svg
              className="absolute h-[200px] w-[350px] translate-y-36 sm:h-[230px] sm:w-[560px] sm:translate-y-16 md:h-[270px] md:w-[550px] md:translate-y-40 lg:h-[300px] lg:w-[700px] lg:translate-y-32 -rotate-6"
              viewBox="0 0 1200 420"
              fill="none"
              aria-hidden
            >
              <ellipse
                cx="600"
                cy="210"
                rx="520"
                ry="120"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
              />
              <circle cx="85" cy="200" r="10" fill="white" />
              <circle cx="1115" cy="195" r="10" fill="white" />
            </svg>
          </div>

          <div
            className="mainsec-product-stage relative z-20 flex h-[240px] w-[190px] translate-y-16 items-center justify-center overflow-hidden bg-transparent sm:h-[340px] sm:w-[270px] sm:translate-y-24 md:h-[400px] md:w-[300px] md:translate-y-12 lg:h-[440px] lg:w-[320px] lg:translate-y-8"
          >
            <AnimatePresence mode="sync" custom={direction} initial={false}>
              <motion.div
                key={item.id}
                custom={direction}
                variants={heroImageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                onAnimationComplete={handleAnimationComplete}
                className="mainsec-product-motion absolute inset-0 flex items-center justify-center bg-transparent"
                style={{
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  draggable={false}
                  width={400}
                  height={520}
                  fetchPriority={current === 0 ? "high" : "auto"}
                  decoding="async"
                  className="mainsec-product-img pointer-events-none select-none h-auto w-full max-w-full bg-transparent object-contain [background-color:transparent]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-5 sm:pt-6 z-30">
          {PRODUCT_ACCORDION_ITEMS.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              onClick={() => goToIndex(index)}
              disabled={navDisabled}
              aria-label={`${slide.title} — slide ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
              className={`product-accordion-hero__dot${
                current === index ? " is-active" : ""
              }${navDisabled ? " is-disabled" : ""}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

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

  // Desktop only: cycle accordion cards every 3s (paused while hovering a card).
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

  return (
    <section
      className={`product-accordion-section${
        isDesktop ? " product-accordion-section--desktop" : ""
      }`}
      aria-label="Product ranges"
    >
      {isDesktop ? (
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
      ) : (
        <MobileHeroCarousel onViewMore={handleViewMore} />
      )}
    </section>
  );
}
