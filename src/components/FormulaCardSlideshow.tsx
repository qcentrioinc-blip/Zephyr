import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { useReducedMotion } from "framer-motion";
import { buildFormulaSlides } from "./packagingSlides";

const CYCLE_MS = 1500;
const FADE_MS = 700;
const HOVER_START_DELAY_MS = 280;
const FADE_EASE = "cubic-bezier(0.25, 0.8, 0.35, 1)";

type FormulaCardSlideshowProps = {
  bottleImage: string;
  alt?: string;
  className?: string;
  imageFit?: "cover" | "contain";
};

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export default function FormulaCardSlideshow({
  bottleImage,
  alt = "",
  className = "",
  imageFit = "cover",
}: FormulaCardSlideshowProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const slides = useMemo(() => buildFormulaSlides(bottleImage), [bottleImage]);
  const packaging = useMemo(() => slides.slice(1), [slides]);
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [packReady, setPackReady] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preloadStarted = useRef(false);

  const imageTransition = reduceMotion
    ? "opacity 0.15s ease"
    : `opacity ${FADE_MS}ms ${FADE_EASE}`;
  const objectClass = imageFit === "contain" ? "object-contain" : "object-cover";

  const clearCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (startDelayRef.current) {
      clearTimeout(startDelayRef.current);
      startDelayRef.current = null;
    }
  };

  const ensurePackaging = () => {
    if (preloadStarted.current) return;
    preloadStarted.current = true;
    void Promise.all(packaging.map(preload)).then(() => setPackReady(true));
  };

  useEffect(() => {
    clearCycle();
    if (reduceMotion || !hovering || !packReady) return;

    startDelayRef.current = setTimeout(() => {
      setIndex((i) => (i === 0 ? 1 : i));
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % slides.length);
      }, CYCLE_MS);
    }, HOVER_START_DELAY_MS);

    return clearCycle;
  }, [hovering, reduceMotion, packReady, slides.length]);

  const onEnter = () => {
    if (reduceMotion) return;
    ensurePackaging();
    setHovering(true);
  };

  const onLeave = () => {
    setHovering(false);
    clearCycle();
    setIndex(0);
  };

  const onTapCycle = (e: MouseEvent | TouchEvent) => {
    if (reduceMotion) return;
    e.preventDefault();
    ensurePackaging();
    setIndex((i) => (i + 1) % slides.length);
  };

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-white ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onTapCycle}
      role="presentation"
    >
      {/* Bottle always present */}
      <img
        src={slides[0]}
        alt={index === 0 ? alt : ""}
        aria-hidden={index !== 0}
        draggable={false}
        decoding="async"
        loading="lazy"
        className={`absolute inset-0 h-full w-full ${objectClass} ${
          index === 0 ? "opacity-100" : "opacity-0"
        }`}
        style={{ transition: imageTransition }}
      />

      {/* Packaging mounts after first hover so cards stay light until needed */}
      {packReady &&
        packaging.map((src, i) => {
          const slideIndex = i + 1;
          return (
            <img
              key={src}
              src={src}
              alt={slideIndex === index ? alt : ""}
              aria-hidden={slideIndex !== index}
              draggable={false}
              decoding="async"
              className={`absolute inset-0 h-full w-full ${objectClass} ${
                slideIndex === index ? "opacity-100" : "opacity-0"
              }`}
              style={{ transition: imageTransition }}
            />
          );
        })}
    </div>
  );
}
