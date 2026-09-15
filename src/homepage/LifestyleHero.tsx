import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const VIDEOS = [
  { id: "slide-1", src: "/videos/slide-1.mp4" },
  { id: "slide-2", src: "/videos/slide-2.mp4" },
  { id: "slide-3", src: "/videos/slide-3.mp4" },
] as const;

/** Match slide 1 (21:9) so every slide keeps the same frame height */
const HERO_ASPECT = "21 / 9";

const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "100%" : "-100%",
  }),
  center: {
    x: 0,
    transition: {
      x: { type: "tween", duration: 0.55, ease: [0.25, 1, 0.5, 1] },
    },
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%",
    transition: {
      x: { type: "tween", duration: 0.55, ease: [0.25, 1, 0.5, 1] },
    },
  }),
};

const instantVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
};

function VideoSlide({
  src,
  isActive,
  onEnded,
  registerActiveRef,
}: {
  src: string;
  isActive: boolean;
  onEnded: () => void;
  registerActiveRef?: (node: HTMLVideoElement | null) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const isPresent = useIsPresent();
  const shouldPlay = isActive && isPresent;

  useEffect(() => {
    if (shouldPlay) registerActiveRef?.(ref.current);
    return () => {
      if (shouldPlay) registerActiveRef?.(null);
    };
  }, [shouldPlay, registerActiveRef]);

  useEffect(() => {
    const video = ref.current;
    if (!video || !shouldPlay) return;

    const handleEnded = () => onEnded();
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [shouldPlay, onEnded]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (shouldPlay) {
      video.currentTime = 0;
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  return (
    <video
      ref={ref}
      className="lifestyle-hero__video"
      src={src}
      muted
      playsInline
      preload="auto"
      aria-hidden
    />
  );
}

export default function LifestyleHero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = Boolean(useReducedMotion());
  const lockRef = useRef(false);
  const preloadRef = useRef<HTMLVideoElement | null>(null);

  const slide = VIDEOS[index];
  const currentId = slide.id;
  const variants = reduceMotion ? instantVariants : slideVariants;
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  const setActiveVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      activeVideoRef.current = node;
    },
    [],
  );

  const go = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      lockRef.current = true;
      setDirection(dir);
      setIndex((i) => (i + dir + VIDEOS.length) % VIDEOS.length);
      window.setTimeout(() => {
        lockRef.current = false;
      }, reduceMotion ? 80 : 580);
    },
    [reduceMotion],
  );

  const advance = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  /* Preload next video */
  useEffect(() => {
    const nextSrc = VIDEOS[(index + 1) % VIDEOS.length].src;
    if (!preloadRef.current) {
      preloadRef.current = document.createElement("video");
      preloadRef.current.muted = true;
      preloadRef.current.preload = "auto";
    }
    preloadRef.current.src = nextSrc;
    preloadRef.current.load();
  }, [index]);

  /* Pause when tab hidden; resume active slide when visible */
  useEffect(() => {
    const onVisibility = () => {
      const video = activeVideoRef.current;
      if (!video) return;
      if (document.hidden) video.pause();
      else void video.play().catch(() => {});
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [index]);

  return (
    <section
      className="lifestyle-hero"
      aria-roledescription="carousel"
      aria-label="Zephyr product videos"
    >
      <div
        className="lifestyle-hero__frame"
        style={{ aspectRatio: HERO_ASPECT }}
      >
        <AnimatePresence mode="sync" custom={direction} initial={false}>
          <motion.div
            key={slide.id}
            className="lifestyle-hero__slide"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ willChange: reduceMotion ? "opacity" : "transform" }}
          >
            <VideoSlide
              src={slide.src}
              isActive={slide.id === currentId}
              onEnded={advance}
              registerActiveRef={setActiveVideoRef}
            />
          </motion.div>
        </AnimatePresence>

        <div
          className="lifestyle-hero__dots"
          role="tablist"
          aria-label="Video progress"
        >
          {VIDEOS.map((v, i) => (
            <span
              key={v.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Video ${i + 1} of ${VIDEOS.length}`}
              className={`lifestyle-hero__dot${i === index ? " is-active" : ""}`}
            />
          ))}
        </div>

        <div className="lifestyle-hero__arrows" role="group" aria-label="Slide controls">
          <button
            type="button"
            className="lifestyle-hero__arrow"
            onClick={prev}
            aria-label="Previous video"
          >
            <svg viewBox="0 0 40 40" aria-hidden className="lifestyle-hero__arrow-icon">
              <path
                d="M24 12 L16 20 L24 28 M16 20 H28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="lifestyle-hero__arrow"
            onClick={next}
            aria-label="Next video"
          >
            <svg viewBox="0 0 40 40" aria-hidden className="lifestyle-hero__arrow-icon">
              <path
                d="M16 12 L24 20 L16 28 M12 20 H24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
