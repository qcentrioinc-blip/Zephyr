import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { buildFormulaSlides } from "./packagingSlides";

const AUTOPLAY_MS = 3000;
const SLIDE_LABELS = [
  "Product",
  "Jar",
  "Sachet",
  "Blister",
  "Bulk pack",
  "Bottle",
  "Alu Alu",
  "Stick pack",
] as const;

type Props = {
  bottleImage: string;
  gallery?: string[];
  alt: string;
  accent: string;
};

export default function FormulaModalGallery({
  bottleImage,
  gallery,
  alt,
  accent,
}: Props) {
  const reduceMotion = Boolean(useReducedMotion());
  const slides = useMemo(
    () => gallery ?? buildFormulaSlides(bottleImage),
    [bottleImage, gallery],
  );
  const labels = useMemo(
    () => SLIDE_LABELS.slice(0, slides.length),
    [slides.length],
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIndex(0);
    setLoaded(false);
    void Promise.all(
      slides.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
          }),
      ),
    ).then(() => setLoaded(true));
  }, [slides]);

  const go = useCallback(
    (dir: -1 | 1) => {
      setPaused(true);
      setIndex((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (reduceMotion || paused || !loaded || slides.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [reduceMotion, paused, loaded, slides.length]);

  return (
    <div
      className="relative flex h-full min-h-[220px] flex-col bg-[#f7f8f9] sm:min-h-[280px] lg:min-h-[360px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex flex-1 items-center justify-center p-6 sm:p-8">
        {slides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === 0 ? alt : `${alt} — ${labels[i] ?? "packaging"}`}
            className={`absolute max-h-[min(52vw,280px)] w-auto max-w-[85%] object-contain transition-opacity duration-500 lg:max-h-[320px] ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            draggable={false}
          />
        ))}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-sm transition hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-sm transition hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200/80 px-4 py-3">
          <p className="text-xs font-medium text-gray-500">
            {labels[index] ?? "Packaging"} · {index + 1} / {slides.length}
          </p>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setPaused(true);
                  setIndex(i);
                }}
                className="h-2 w-2 rounded-full transition"
                style={{
                  backgroundColor: i === index ? accent : "#d1d5db",
                }}
                aria-label={`Show slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
