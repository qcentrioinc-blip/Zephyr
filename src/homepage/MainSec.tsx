import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const products = [
  {
    id: 1,
    title: "HERBACEUTICAL",
    description:
      "Private label and contract manufacturing for botanical dietary supplements. From formula brief and MOQ planning to finished tablets, capsules, and specialty dosages for US brand launches.",
    color: "#FFA43D",
    image: "/herbal.webp",
    buttonText: "Request MOQ",
    link: `/contact?subject=${encodeURIComponent("MOQ inquiry - Herbaceutical")}`,
  },
  {
    id: 2,
    title: "NUTRACEUTICAL",
    description:
      "Turnkey manufacturing for vitamins, minerals, and specialty dietary supplements. Flexible dosage forms, finished goods packaging, and practical MOQ support for US brand owners.",
    color: "#247D7D",
    image: "/nuetra.webp",
    buttonText: "Request MOQ",
    link: `/contact?subject=${encodeURIComponent("MOQ inquiry - Nutraceutical")}`,
  },
  {
    id: 3,
    title: "ORGANIC",
    description:
      "Organic and clean-label supplement manufacturing for US markets. Private label support from early formulation through finished goods packaging and commercial production.",
    color: "#3FB369",
    image: "/organic.webp",
    buttonText: "Request MOQ",
    link: `/contact?subject=${encodeURIComponent("MOQ inquiry - Organic")}`,
  },
];

const AUTOPLAY_DELAY = 5000;
const TRANSITION_MS_DESKTOP = 900;
const TRANSITION_MS_MOBILE = 550;

/** Desktop: light 3D. No CSS filter blur — that causes gray haze + jank on mobile GPUs. */
const desktopImageVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 220 : -220,
    y: 36,
    scale: 0.72,
    rotateY: dir > 0 ? 22 : -22,
    opacity: 0,
  }),
  center: {
    x: 0,
    y: 0,
    scale: 1,
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: TRANSITION_MS_DESKTOP / 1000,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -220 : 220,
    y: 36,
    scale: 0.72,
    rotateY: dir > 0 ? -22 : 22,
    opacity: 0,
    transition: {
      duration: TRANSITION_MS_DESKTOP / 1000,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  }),
};

/** Mobile: 2D only — opacity + translate. Avoids preserve-3d / blur stutter. */
const mobileImageVariants: Variants = {
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
      duration: TRANSITION_MS_MOBILE / 1000,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -72 : 72,
    opacity: 0,
    scale: 0.94,
    transition: {
      duration: TRANSITION_MS_MOBILE / 1000,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  }),
};

function useIsNarrow(breakpointPx = 768) {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${breakpointPx - 1}px)`).matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpointPx]);

  return narrow;
}

const MainSec: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const isNarrow = useIsNarrow(768);
  const useLiteMotion = reduceMotion || isNarrow;
  const transitionMs = useLiteMotion
    ? TRANSITION_MS_MOBILE
    : TRANSITION_MS_DESKTOP;
  const imageVariants = useLiteMotion
    ? mobileImageVariants
    : desktopImageVariants;

  const isAnimatingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unlockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Decode all hero bottles up front so slide changes never flash a gray decode box
  useEffect(() => {
    products.forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });
  }, []);

  const clearAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const goToSlide = useCallback(
    (resolveIndex: (current: number) => number, dir: number) => {
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
    [transitionMs]
  );

  const startAutoplay = useCallback(() => {
    clearAutoplay();
    intervalRef.current = setInterval(() => {
      goToSlide((c) => (c + 1) % products.length, 1);
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
    () => goToSlide((c) => (c + 1) % products.length, 1),
    [goToSlide]
  );
  const prevSlide = useCallback(
    () => goToSlide((c) => (c === 0 ? products.length - 1 : c - 1), -1),
    [goToSlide]
  );

  const goToIndex = useCallback(
    (index: number) => {
      setCurrent((prevIndex) => {
        if (index === prevIndex || isAnimatingRef.current) return prevIndex;
        goToSlide(() => index, index > prevIndex ? 1 : -1);
        return prevIndex;
      });
    },
    [goToSlide]
  );

  useEffect(() => {
    startAutoplay();
    return clearAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    return () => {
      clearAutoplay();
      if (unlockTimeoutRef.current) clearTimeout(unlockTimeoutRef.current);
    };
  }, [clearAutoplay]);

  const product = products[current];

  return (
    <motion.section
      animate={{
        backgroundColor: product.color,
      }}
      transition={{
        duration: useLiteMotion ? 0.45 : 0.8,
        ease: "easeInOut",
      }}
      className="mainsec-hero relative overflow-hidden h-auto xl:h-screen"
    >
      {/* Soft center glow — gradient only (no CSS filter blur: Safari paints a rectangular filter region that shows as a shade patch in the top-right corner). */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          animate={{ opacity: useLiteMotion ? 0.75 : 1, scale: useLiteMotion ? 1 : 1.04 }}
          transition={{ duration: useLiteMotion ? 0.5 : 1.2, ease: "easeOut" }}
          className="absolute left-1/2 top-[38%] h-[min(110vw,920px)] w-[min(110vw,920px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.14) 42%, transparent 72%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto h-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 sm:pt-18 sm:pb-20 md:pt-20 lg:px-8 lg:pt-16 lg:pb-0 xl:pt-12">
        <div className="flex justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={product.id}
              initial={
                reduceMotion
                  ? false
                  : { clipPath: "inset(100% 0 0 0)", opacity: 0 }
              }
              animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { clipPath: "inset(0 0 100% 0)", opacity: 0 }
              }
              transition={{ duration: useLiteMotion ? 0.35 : 0.7 }}
              className="
                pt-4
                sm:pt-6
                md:pt-8
                lg:pt-10
                whitespace-normal
                break-words
                lg:whitespace-nowrap
                font-manrope
                font-bold
                leading-[1.05]
                lg:leading-none
                text-white/30
                text-[34px]
                xs:text-[38px]
                sm:text-[52px]
                md:text-[70px]
                lg:text-[92px]
                xl:text-[140px]
                2xl:text-[150px]
                text-center
                px-2
                sm:px-4
              "
            >
              {product.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="relative z-30 mt-4 sm:mt-5 md:mt-6 max-w-xl xl:max-w-md mx-auto lg:mx-0 text-center lg:text-left">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`desc-${product.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: useLiteMotion ? 0.25 : 0.35, delay: 0.05 }}
              className="text-[13px] sm:text-[14px] text-white md:text-[16px] lg:text-[12px] xl:text-[12px] px-2 sm:px-0 font-para font-normal leading-[120%] md:leading-[18px] tracking-wide"
            >
              {product.description}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`btn-${product.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: useLiteMotion ? 0.25 : 0.35, delay: 0.08 }}
              className="mt-5 lg:mt-6 flex justify-center lg:justify-start"
            >
              <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="inline-flex"
              >
                <Link
                  to={product.link}
                  aria-label={product.buttonText}
                  className="inline-flex w-fit items-center rounded-full bg-white px-4 py-2 sm:px-5 sm:py-2 text-sm font-medium text-black shadow-sm lg:text-base"
                >
                  <motion.span
                    variants={{
                      rest: { gap: "8px" },
                      hover: { gap: "12px" },
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-center"
                  >
                    {product.buttonText}
                    <motion.span
                      variants={{
                        rest: { x: 0 },
                        hover: { x: 6 },
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex shrink-0"
                    >
                      <ArrowRight size={16} />
                    </motion.span>
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={prevSlide}
          disabled={isAnimating}
          aria-label="Previous product"
          className={`absolute left-2 sm:left-4 lg:left-6 top-[68%] sm:top-[74%] lg:top-[80%] z-40 flex h-9 w-9 sm:h-11 sm:w-11 lg:h-[50px] lg:w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/15 transition hover:bg-white/25 ${
            isAnimating ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          disabled={isAnimating}
          aria-label="Next product"
          className={`absolute right-2 sm:right-4 lg:right-6 top-[68%] sm:top-[74%] lg:top-[80%] z-40 flex h-9 w-9 sm:h-11 sm:w-11 lg:h-[50px] lg:w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/15 transition hover:bg-white/25 ${
            isAnimating ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </button>

        <div className="pointer-events-none relative -mt-14 sm:-mt-20 md:-mt-24 lg:-mt-32 flex h-[300px] xs:h-[330px] sm:h-[360px] md:h-[420px] lg:h-[500px] justify-center">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <svg
              className="absolute h-[200px] w-[350px] translate-y-40 sm:h-[230px] sm:w-[560px] sm:translate-y-18 md:h-[270px] md:w-[550px] md:translate-y-48 lg:h-[300px] lg:w-[700px] lg:translate-y-34 xl:h-[360px] xl:w-[900px] xl:translate-y-46 -rotate-6"
              viewBox="0 0 1200 420"
              fill="none"
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

          {/* Clip 3D carousel layers — Safari extends transformed GPU bounds beyond the bottle and tints corners */}
          <div
            className="mainsec-product-stage relative z-20 flex h-[260px] w-[200px] translate-y-20 items-center justify-center overflow-hidden bg-transparent sm:h-[360px] sm:w-[280px] sm:translate-y-30 md:h-[400px] md:w-[300px] md:translate-y-16 lg:h-[420px] lg:w-[300px] lg:translate-y-14 xl:h-[520px] xl:w-[400px] xl:-translate-y-2"
            style={useLiteMotion ? undefined : { perspective: 1200 }}
          >
            <AnimatePresence mode="sync" custom={direction} initial={false}>
              <motion.div
                key={product.id}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                onAnimationComplete={handleAnimationComplete}
                className="mainsec-product-motion absolute inset-0 flex items-center justify-center bg-transparent"
                style={
                  useLiteMotion
                    ? {
                        WebkitBackfaceVisibility: "hidden",
                        backfaceVisibility: "hidden",
                      }
                    : {
                        transformStyle: "preserve-3d",
                        WebkitBackfaceVisibility: "hidden",
                        backfaceVisibility: "hidden",
                      }
                }
              >
                <img
                  src={product.image}
                  alt={product.title}
                  draggable={false}
                  width={400}
                  height={520}
                  fetchPriority={current === 0 ? "high" : "auto"}
                  decoding="async"
                  className="
                    mainsec-product-img
                    pointer-events-none
                    select-none
                    h-auto
                    w-full
                    max-w-full
                    bg-transparent
                    object-contain
                    [background-color:transparent]
                  "
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-5 lg:left-auto lg:translate-x-0 lg:right-6 lg:bottom-6 flex gap-2.5 sm:gap-3 z-30">
        {products.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => goToIndex(index)}
            disabled={isAnimating}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${
              current === index
                ? "w-8 sm:w-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                : "w-2 bg-white/50"
            } ${isAnimating ? "pointer-events-none" : ""}`}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default MainSec;
