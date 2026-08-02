import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const products = [
  {
    id: 1,
    title: "HERBACEUTICAL",
    description:
      "Plant-based custom formulations for brand owners — from traditional extracts to finished specialty tablets, manufactured to partnership standards. Plant-based custom formulations for brand owners — from traditional extracts to finished specialty tablets, manufactured to partnership standards.",
    color: "#FFA43D",
    image: "/herbal.png",
    buttonText: "Explore Range",
    link: "/herbaceutical",
  },
  {
    id: 2,
    title: "NUTRACEUTICAL",
    description:
      "Science-led vitamins, minerals and specialty supplements — tailor-made for private label partners with flexible dosage and pack formats. Science-led vitamins, minerals and specialty supplements — tailor-made for private label partners with flexible dosage and pack formats.",
    color: "#247D7D", 
    image: "/nuetra.png",
    buttonText: "Explore Range",
    link: "/nutraceutical",
  },
  {
    id: 3,
    title: "ORGANIC MEDICINES",
    description:
      "Organic-focused manufacturing partnerships for clean-label healthcare brands — concept to commercial scale under one roof. Organic-focused manufacturing partnerships for clean-label healthcare brands — concept to commercial scale under one roof.",
    color: "#3FB369" ,
    image: "/organic.png",
    buttonText: "Explore Range",
    link: "/organic",
  },
];

const AUTOPLAY_DELAY = 5000;
const TRANSITION_DURATION = 900; // ms, matches the framer-motion transition below

// Moved outside the component: this object never depends on props/state,
// so recreating it on every render was pure waste. `dir` is supplied at
// call-time via the `custom` prop on AnimatePresence/motion.div.
const imageVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 300 : -300,
    y: 60,
    scale: 0.45,
    rotateY: dir > 0 ? 35 : -35,
    rotateZ: dir > 0 ? 8 : -8,
    opacity: 0,
    filter: "blur(8px)",
  }),

  center: {
    x: 0,
    y: 0,
    scale: 1,
    rotateY: 0,
    rotateZ: 0,
    opacity: 1,
    filter: "blur(0px)",

    transition: {
      duration: 0.9,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },

  exit: (dir: number) => ({
    x: dir > 0 ? -300 : 300,
    y: 60,
    scale: 0.45,
    rotateY: dir > 0 ? -35 : 35,
    rotateZ: dir > 0 ? -8 : 8,
    opacity: 0,
    filter: "blur(8px)",

    transition: {
      duration: 0.9,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  }),
};

const MainSec: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs avoid the stale-closure problem that state has inside setInterval /
  // rapid-fire click handlers. The ref is always read synchronously and is
  // the single source of truth for "are we mid-transition right now".
  const isAnimatingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unlockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Central, race-condition-safe slide changer. Every navigation path
  // (autoplay, prev/next buttons, indicator dots) goes through this.
  const goToSlide = useCallback(
    (resolveIndex: (current: number) => number, dir: number) => {
      if (isAnimatingRef.current) return;

      isAnimatingRef.current = true;
      setIsAnimating(true);
      setDirection(dir);
      setCurrent(resolveIndex);

      // Safety-net unlock: in case onAnimationComplete never fires (e.g. tab
      // backgrounded, animation interrupted by unmount), don't leave the
      // carousel stuck locked forever.
      if (unlockTimeoutRef.current) clearTimeout(unlockTimeoutRef.current);
      unlockTimeoutRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
        setIsAnimating(false);
      }, TRANSITION_DURATION + 150);
    },
    []
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
      // Functional-update comparison avoids needing `current` in the
      // dependency array, so this callback stays referentially stable.
      setCurrent((prevIndex) => {
        if (index === prevIndex || isAnimatingRef.current) return prevIndex;
        goToSlide(() => index, index > prevIndex ? 1 : -1);
        return prevIndex;
      });
    },
    [goToSlide]
  );

  // Autoplay: starts on mount, restarts every time the user manually
  // navigates so a manual click never races against a pending tick.
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
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="relative overflow-hidden h-auto xl:h-screen"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0  flex items-center justify-center">
        <motion.div
          key={product.id}
          initial={{
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            scale: 1.1,
            opacity: 1,
          }}
          transition={{
            duration: 1.2,
          }}
          className="absolute h-[400px] w-[400px] sm:h-[560px] sm:w-[560px] md:h-[650px] md:w-[650px] lg:h-[800px] lg:w-[800px] rounded-full bg-white/50 blur-[120px] sm:blur-[160px] md:blur-[190px] lg:blur-[220px]"
        />
      </div>

      <div className="relative z-10 mx-auto h-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 sm:pt-18 sm:pb-20 md:pt-20 lg:px-8 lg:pt-16 lg:pb-0 xl:pt-12">
        {/* Heading */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={product.id}
              initial={{
                clipPath: "inset(100% 0 0 0)",
                opacity: 0,
              }}
              animate={{
                clipPath: "inset(0% 0 0 0)",
                opacity: 1,
              }}
              exit={{
                clipPath: "inset(0 0 100% 0)",
                opacity: 0,
              }}
              transition={{
                duration: 0.7,
              }}
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

        {/* Description */}
        <div className="mt-4 sm:mt-5 md:mt-6 max-w-xl xl:max-w-md mx-auto lg:mx-0 text-center lg:text-left">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`desc-${product.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="text-[13px] sm:text-[14px] text-white md:text-[16px] lg:text-[12px] xl:text-[12px] px-6 sm:px-0 font-para font-normal leading-[120%] md:leading-[18px] tracking-wide"
            >
              {product.description}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`btn-${product.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
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

        {/* Navigation — now visible from the smallest breakpoint up.
            Position/size scale down for mobile & tablet; the lg: values
            below are identical to the original desktop-only styling. */}
        <button
          type="button"
          onClick={prevSlide}
          disabled={isAnimating}
          aria-label="Previous product"
          className={`absolute left-2 sm:left-4 lg:left-6 top-[68%] sm:top-[74%] lg:top-[80%] flex h-9 w-9 sm:h-11 sm:w-11 lg:h-[50px] lg:w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-white/50 backdrop-blur-md transition hover:bg-white/10 ${
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
          className={`absolute right-2 sm:right-4 lg:right-6 top-[68%] sm:top-[74%] lg:top-[80%] flex h-9 w-9 sm:h-11 sm:w-11 lg:h-[50px] lg:w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-white/50 backdrop-blur-md transition hover:bg-white/10 ${
            isAnimating ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </button>

        {/* Product Area */}
        <div className="relative -mt-14 sm:-mt-20 md:-mt-24 lg:-mt-32 flex h-[300px] xs:h-[330px] sm:h-[360px] md:h-[420px] lg:h-[500px] justify-center">
          {/* Fixed Orbit */}
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

          {/* Product Image */}
          {/* `perspective` must live on a non-animating PARENT wrapper.
              Putting it on the same element that rotates (as the old code
              did) means the rotation has no real depth to project onto,
              which is what produced the abrupt "glitchy" snap, especially
              when a transition was interrupted mid-flight. */}
          <div
            className="relative z-20 translate-y-20 sm:translate-y-30 md:translate-y-16 lg:translate-y-14 xl:-translate-y-2"
            style={{ perspective: 1200 }}
          >
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.div
                key={product.id}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                onAnimationComplete={handleAnimationComplete}
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity, filter",
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  draggable={false}
                  className="
                    pointer-events-none
                    select-none
                    w-[200px]
                    sm:w-[280px]
                    md:w-[300px]
                    lg:w-[300px]
                    xl:w-[400px]
                    object-contain
                    drop-shadow-[0_50px_100px_rgba(0,0,0,0.25)]
                  "
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Indicators (centered on mobile, bottom-right on desktop) */}
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
