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
  {
    id: 4,
    title: "SKIN CARE",
    description:
      "ALFURIN lotion and cream: a dual-action system for psoriasis-prone skin with barrier support, manufactured by Zephyr for US distribution, clinic, and private-label partners.",
    color: "#1F5F8B",
    image: "/Skincare.png?v=user1",
    buttonText: "Explore range",
    link: "/skincare",
  },
];

const AUTOPLAY_DELAY = 5000;
const TRANSITION_MS_DESKTOP = 820;
const TRANSITION_MS_MOBILE = 480;

/**
 * Desktop: overlapping enter/exit (sync) for continuous handoff.
 * Exit finishes a beat sooner so the incoming bottle never hits a dead pause.
 */
const desktopImageVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 118 : -118,
    y: 42,
    scale: 0.78,
    rotateY: dir > 0 ? 26 : -26,
    rotateZ: dir > 0 ? 5 : -5,
    opacity: 0,
  }),
  center: {
    x: 0,
    y: 0,
    scale: 1,
    rotateY: 0,
    rotateZ: 0,
    opacity: 1,
    transition: {
      duration: TRANSITION_MS_DESKTOP / 1000,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -100 : 100,
    y: 28,
    scale: 0.8,
    rotateY: dir > 0 ? -22 : 22,
    rotateZ: dir > 0 ? -4 : 4,
    opacity: 0,
    transition: {
      duration: (TRANSITION_MS_DESKTOP * 0.72) / 1000,
      ease: [0.4, 0, 0.2, 1] as const,
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
  const isNarrow = useIsNarrow(1280);
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
      }, transitionMs + 100);
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
      <div className="relative z-10 mx-auto h-full max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-18 sm:pb-14 md:pt-20 md:pb-16 lg:px-8 lg:pt-20 lg:pb-16 xl:pt-12 xl:pb-0">
        <div className="flex min-h-[3.4rem] xs:min-h-[3.8rem] sm:min-h-[4.6rem] md:min-h-[5.8rem] lg:min-h-[5.8rem] xl:min-h-[8.5rem] 2xl:min-h-[9.5rem] items-end justify-center">
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
                lg:pt-8
                xl:pt-10
                whitespace-nowrap
                font-manrope
                font-bold
                leading-[1.05]
                lg:leading-[1.05]
                xl:leading-none
                text-white/30
                text-[34px]
                xs:text-[38px]
                sm:text-[52px]
                md:text-[70px]
                lg:text-[70px]
                xl:text-[148px]
                2xl:text-[162px]
                text-center
                px-2
                sm:px-4
              "
            >
              {product.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="relative z-30 mt-4 sm:mt-5 md:mt-6 max-w-xl mx-auto text-center xl:max-w-md xl:mx-0 xl:text-left">
          <div className="min-h-[4.75rem] sm:min-h-[5rem] md:min-h-[5.25rem] lg:min-h-[5.25rem] xl:min-h-[4.5rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`desc-${product.id}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: useLiteMotion ? 0.25 : 0.35, delay: 0.05 }}
                className="text-[13px] sm:text-[14px] text-white md:text-[16px] lg:text-[16px] xl:text-[12px] px-2 sm:px-0 font-para font-normal leading-[120%] md:leading-[18px] tracking-wide"
              >
                {product.description}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-5 lg:mt-5 xl:mt-6 flex min-h-[2.5rem] justify-center xl:justify-start">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`btn-${product.id}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: useLiteMotion ? 0.25 : 0.35, delay: 0.08 }}
                className="inline-flex"
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
                    className="inline-flex w-fit items-center rounded-full bg-white px-4 py-2 sm:px-5 sm:py-2 text-sm font-medium text-black shadow-sm xl:text-base"
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
        </div>

        <button
          type="button"
          onClick={prevSlide}
          disabled={isAnimating}
          aria-label="Previous product"
          className={`absolute left-2 sm:left-4 md:left-4 lg:left-4 xl:left-6 top-[68%] sm:top-[74%] md:top-[74%] lg:top-[74%] xl:top-[80%] z-40 flex h-9 w-9 sm:h-11 sm:w-11 lg:h-11 lg:w-11 xl:h-[50px] xl:w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/15 transition hover:bg-white/25 ${
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
          className={`absolute right-2 sm:right-4 md:right-4 lg:right-4 xl:right-6 top-[68%] sm:top-[74%] md:top-[74%] lg:top-[74%] xl:top-[80%] z-40 flex h-9 w-9 sm:h-11 sm:w-11 lg:h-11 lg:w-11 xl:h-[50px] xl:w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/15 transition hover:bg-white/25 ${
            isAnimating ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </button>

        <div className="pointer-events-none relative -mt-6 sm:-mt-10 md:-mt-18 lg:-mt-18 xl:-mt-24 flex h-[300px] xs:h-[320px] sm:h-[360px] md:h-[460px] lg:h-[460px] xl:h-[min(62dvh,720px)] justify-center overflow-visible">
          {/* Soft fully-blurred white blob behind product images */}
          <div
            className="pointer-events-none absolute left-1/2 top-[48%] z-10 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 blur-[48px] sm:h-[320px] sm:w-[320px] sm:blur-[56px] md:h-[400px] md:w-[400px] md:blur-[64px] lg:h-[400px] lg:w-[400px] lg:blur-[64px] xl:top-[46%] xl:h-[min(56dvh,680px)] xl:w-[min(56dvh,680px)] xl:blur-[80px]"
            aria-hidden
          />

          {/* Orbit: mobile/tablet below xl; large product treatment from xl up */}
          <div className="pointer-events-none absolute inset-0 z-[11] flex items-center justify-center" aria-hidden>
            <svg
              className="absolute h-[170px] w-[300px] translate-y-28 sm:h-[200px] sm:w-[460px] sm:translate-y-16 md:h-[230px] md:w-[520px] md:translate-y-48 lg:h-[230px] lg:w-[520px] lg:translate-y-48 xl:h-[300px] xl:w-[700px] xl:translate-y-36 -rotate-6"
              viewBox="0 0 1200 420"
              fill="none"
            >
              <ellipse
                cx="600"
                cy="210"
                rx="470"
                ry="110"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="2"
              />
              <circle cx="140" cy="200" r="8" fill="white" fillOpacity="0.95" />
              <circle cx="1060" cy="195" r="8" fill="white" fillOpacity="0.95" />
            </svg>
          </div>

          <div
            className="mainsec-product-stage relative z-20 flex h-[250px] w-[180px] translate-y-10 items-center justify-center bg-transparent sm:h-[340px] sm:w-[240px] sm:translate-y-12 md:h-[420px] md:w-[280px] md:translate-y-16 lg:h-[420px] lg:w-[280px] lg:translate-y-16 xl:h-[min(64dvh,780px)] xl:w-[500px] xl:-translate-y-12"
            style={
              useLiteMotion
                ? undefined
                : { perspective: 1400, perspectiveOrigin: "50% 45%" }
            }
          >
            {/* sync = enter/exit overlap — continuous premium handoff, no dead pause */}
            <AnimatePresence mode="sync" custom={direction} initial={false}>
              <motion.div
                key={product.id}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                onAnimationComplete={(definition) => {
                  if (definition === "center") handleAnimationComplete();
                }}
                className="mainsec-product-motion absolute inset-0 flex items-center justify-center bg-transparent"
                style={
                  useLiteMotion
                    ? {
                        WebkitBackfaceVisibility: "hidden",
                        backfaceVisibility: "hidden",
                      }
                    : {
                        transformStyle: "preserve-3d",
                        transformOrigin: "50% 70%",
                        WebkitBackfaceVisibility: "hidden",
                        backfaceVisibility: "hidden",
                      }
                }
              >
                <img
                  src={product.image}
                  alt={product.title}
                  draggable={false}
                  width={360}
                  height={470}
                  fetchPriority={current === 0 ? "high" : "auto"}
                  decoding="async"
                  className="
                    mainsec-product-img
                    pointer-events-none
                    select-none
                    h-full
                    w-auto
                    max-h-full
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

      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 sm:bottom-3 md:bottom-5 lg:bottom-5 xl:left-auto xl:translate-x-0 xl:right-6 xl:bottom-6 flex gap-2.5 sm:gap-3 z-30">
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
