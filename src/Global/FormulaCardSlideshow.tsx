import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { buildFormulaSlides } from "./packagingSlides";

const CYCLE_MS = 700;
const EASE = [0.22, 1, 0.36, 1] as const;

type FormulaCardSlideshowProps = {
  bottleImage: string;
  alt?: string;
  className?: string;
};

export default function FormulaCardSlideshow({
  bottleImage,
  alt = "",
  className = "",
}: FormulaCardSlideshowProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const slides = useMemo(() => buildFormulaSlides(bottleImage), [bottleImage]);
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    clearCycle();
    if (reduceMotion || !hovering) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, CYCLE_MS);
    return clearCycle;
  }, [hovering, reduceMotion, slides.length]);

  const onLeave = () => {
    setHovering(false);
    clearCycle();
    setIndex(0);
  };

  const onTapCycle = (e: MouseEvent | TouchEvent) => {
    if (reduceMotion) return;
    e.preventDefault();
    setIndex((i) => (i + 1) % slides.length);
  };

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-white ${className}`}
      onMouseEnter={() => {
        if (!reduceMotion) setHovering(true);
      }}
      onMouseLeave={onLeave}
      onClick={onTapCycle}
      role="presentation"
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.img
          key={slides[index]}
          src={slides[index]}
          alt={alt}
          loading="lazy"
          draggable={false}
          initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
}
