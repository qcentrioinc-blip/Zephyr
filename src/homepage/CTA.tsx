"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { interpolate } from "flubber";
import { motion } from "framer-motion";
import { H2, P } from "../Global/Typography/Typo";

type GalleryImage = {
  src: string;
  alt: string;
};

const images: GalleryImage[] = [
  {
    src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    alt: "Back Support",
  },
  {
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    alt: "Strength",
  },
  {
    src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    alt: "Heart Support",
  },
  {
    src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    alt: "Fitness",
  },
  {
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    alt: "Workout",
  },
];

/** Smooth decelerating ease — premium, no snap */
const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
const AUTOPLAY_MS = 3600;

/** Horizontal gap between card edges */
const CARD_GAP = 12;
const SIDE_SCALE = 0.72;
const FAR_SCALE = 0.54;

type CoverflowMetrics = {
  cardW: number;
  cardH: number;
  xNear: number;
  xFar: number;
  radius: number;
};

function gapOffset(cardW: number, scale: number, gap: number) {
  return cardW / 2 + (cardW * scale) / 2 + gap;
}

function getMetrics(width: number): CoverflowMetrics {
  if (width >= 1280) {
    const cardW = 340;
    return {
      cardW,
      cardH: 440,
      xNear: gapOffset(cardW, SIDE_SCALE, CARD_GAP),
      xFar: gapOffset(cardW, FAR_SCALE, CARD_GAP * 2.6),
      radius: 36,
    };
  }
  if (width >= 1024) {
    const cardW = 300;
    return {
      cardW,
      cardH: 400,
      xNear: gapOffset(cardW, SIDE_SCALE, CARD_GAP),
      xFar: gapOffset(cardW, FAR_SCALE, CARD_GAP * 2.4),
      radius: 32,
    };
  }
  if (width >= 640) {
    const cardW = 230;
    return {
      cardW,
      cardH: 320,
      xNear: gapOffset(cardW, SIDE_SCALE, 64),
      xFar: gapOffset(cardW, FAR_SCALE, 110),
      radius: 28,
    };
  }
  const cardW = 200;
  return {
    cardW,
    cardH: 290,
    xNear: gapOffset(cardW, SIDE_SCALE, 48),
    xFar: gapOffset(cardW, FAR_SCALE, 88),
    radius: 22,
  };
}

function useCoverflowMetrics() {
  const [metrics, setMetrics] = useState<CoverflowMetrics>(() =>
    typeof window !== "undefined" ? getMetrics(window.innerWidth) : getMetrics(390)
  );

  useEffect(() => {
    const update = () => setMetrics(getMetrics(window.innerWidth));
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return metrics;
}

function circularOffset(index: number, active: number, total: number) {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

function slotFor(pos: number, m: CoverflowMetrics) {
  const abs = Math.abs(pos);
  if (pos === 0) {
    return {
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
      opacity: 1,
      zIndex: 50,
      shadow: 0.28,
    };
  }
  if (abs === 1) {
    return {
      x: pos * m.xNear,
      y: 10,
      scale: SIDE_SCALE,
      rotateY: pos * -8,
      opacity: 0.88,
      zIndex: 30,
      shadow: 0.16,
    };
  }
  return {
    x: Math.sign(pos || 1) * m.xFar,
    y: 18,
    scale: FAR_SCALE,
    rotateY: Math.sign(pos || 1) * -14,
    opacity: 0.48,
    zIndex: 10,
    shadow: 0.1,
  };
}

function CoverflowCarousel() {
  const [active, setActive] = useState(2);
  const metrics = useCoverflowMetrics();

  useEffect(() => {
    images.forEach((img) => {
      const el = new Image();
      el.src = img.src;
    });
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        setActive((prev) => (prev + 1) % images.length);
      }, AUTOPLAY_MS);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (timer) clearInterval(timer);
        timer = null;
      } else {
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="mt-7 sm:mt-8 lg:mt-10">
      <div
        className="relative mx-auto w-full overflow-visible"
        style={{ height: metrics.cardH, perspective: 1600 }}
      >
        {images.map((img, index) => {
          const pos = circularOffset(index, active, images.length);
          const slot = slotFor(pos, metrics);

          return (
            <motion.div
              key={img.src}
              className="absolute left-1/2 top-0 overflow-hidden will-change-transform"
              style={{
                width: metrics.cardW,
                height: metrics.cardH,
                marginLeft: -metrics.cardW / 2,
                borderRadius: metrics.radius,
                zIndex: slot.zIndex,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              animate={{
                x: slot.x,
                y: slot.y,
                scale: slot.scale,
                rotateY: slot.rotateY,
                opacity: slot.opacity,
                boxShadow: `0 ${28 * slot.shadow * 4}px ${60 * slot.shadow * 4}px rgba(0,0,0,${slot.shadow})`,
              }}
              transition={{
                x: { duration: 1.05, ease: EASE_PREMIUM },
                y: { duration: 1.05, ease: EASE_PREMIUM },
                scale: { duration: 1.05, ease: EASE_PREMIUM },
                rotateY: { duration: 1.1, ease: EASE_PREMIUM },
                opacity: { duration: 0.7, ease: EASE_PREMIUM },
                boxShadow: { duration: 1.05, ease: EASE_PREMIUM },
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                draggable={false}
                decoding="async"
                className="h-full w-full object-cover"
              />

              {pos !== 0 && (
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-[#0b2a22]/20"
                  animate={{ opacity: absOverlay(pos) }}
                  transition={{ duration: 0.7, ease: EASE_PREMIUM }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function absOverlay(pos: number) {
  return Math.abs(pos) === 1 ? 0.18 : 0.32;
}

/** Leaf outline → horizontal capsule — continuous morph like a loop GIF */
const LEAF_PATH =
  "M80 8C52 26 40 52 46 74C52 90 66 96 80 96C94 96 108 90 114 74C120 52 108 26 80 8Z";
const CAPSULE_PATH =
  "M28 50C28 34 40 26 52 26H108C120 26 132 34 132 50C132 66 120 74 108 74H52C40 74 28 66 28 50Z";

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Looping leaf→capsule conversion (product-GIF feel):
 * sway → morph into capsule → shine hold → morph back.
 */
function LeafToCapsuleMorph() {
  const fillRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGPathElement>(null);
  const veinRef = useRef<SVGGElement>(null);
  const shellRef = useRef<SVGGElement>(null);
  const shineRef = useRef<SVGRectElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const morph = useMemo(
    () =>
      interpolate(LEAF_PATH, CAPSULE_PATH, {
        maxSegmentLength: 1.2,
      }),
    [],
  );

  useEffect(() => {
    const duration = 4000;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const p = ((now - start) % duration) / duration;

      let morphT: number;
      let scale: number;
      let vein: number;
      let shell: number;
      let shineX = -30;
      let shineOp = 0;
      let glow = 0.35;
      let shadow = 0.55;
      let sway = 0;

      if (p < 0.14) {
        const u = p / 0.14;
        morphT = 0;
        sway = Math.sin(u * Math.PI * 2) * 5;
        scale = 1 + Math.sin(u * Math.PI) * 0.025;
        vein = 1;
        shell = 0;
      } else if (p < 0.4) {
        const u = easeInOutCubic((p - 0.14) / 0.26);
        morphT = u;
        sway = 0;
        scale = 1 + Math.sin(u * Math.PI) * 0.07;
        vein = Math.max(0, 1 - u * 1.35);
        shell = Math.max(0, (u - 0.28) / 0.72);
        glow = 0.35 + u * 0.4;
        shadow = 0.55 + u * 0.55;
      } else if (p < 0.66) {
        const u = (p - 0.4) / 0.26;
        morphT = 1;
        scale = 1 + Math.sin(Math.min(1, u * 1.8) * Math.PI) * 0.05;
        vein = 0;
        shell = 1;
        shineX = -30 + u * 160;
        shineOp = u < 0.85 ? 0.75 : 0;
        glow = 0.78;
        shadow = 1.15;
      } else {
        const u = easeInOutCubic((p - 0.66) / 0.34);
        morphT = 1 - u;
        scale = 1;
        vein = Math.min(1, u * 1.2);
        shell = Math.max(0, 1 - u * 1.5);
        shineOp = 0;
        glow = 0.78 - u * 0.43;
        shadow = 1.15 - u * 0.6;
      }

      const d = morph(morphT);
      if (fillRef.current) fillRef.current.setAttribute("d", d);
      if (clipRef.current) clipRef.current.setAttribute("d", d);
      if (veinRef.current) veinRef.current.style.opacity = String(vein);
      if (shellRef.current) shellRef.current.style.opacity = String(shell);
      if (shineRef.current) {
        shineRef.current.setAttribute("x", String(shineX));
        shineRef.current.style.opacity = String(shineOp);
      }
      if (glowRef.current) {
        glowRef.current.style.opacity = String(glow);
        glowRef.current.style.transform = `scale(${0.88 + morphT * 0.4})`;
      }
      if (shadowRef.current) {
        shadowRef.current.style.transform = `scaleX(${shadow})`;
        shadowRef.current.style.opacity = String(0.22 + morphT * 0.35);
      }
      if (wrapRef.current) {
        wrapRef.current.style.transform = `rotate(${sway}deg) scale(${scale})`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [morph]);

  return (
    <div className="mt-8 flex justify-center px-4 sm:mt-9 lg:mt-10" aria-hidden="true">
      <div className="relative flex h-[140px] w-[300px] items-center justify-center sm:h-[150px] sm:w-[340px]">
        <div
          ref={glowRef}
          className="pointer-events-none absolute h-28 w-28 rounded-full bg-[#9ad485]/35 blur-2xl"
        />

        <div
          ref={wrapRef}
          className="absolute z-20 will-change-transform"
          style={{ transformOrigin: "50% 55%" }}
        >
          <svg
            viewBox="0 0 160 104"
            className="h-[92px] w-[148px] drop-shadow-[0_8px_16px_rgba(17,50,39,0.22)] sm:h-[100px] sm:w-[160px]"
          >
            <defs>
              <linearGradient id="leafFillGif" x1="22%" y1="0%" x2="78%" y2="100%">
                <stop offset="0%" stopColor="#9be06f" />
                <stop offset="48%" stopColor="#3fa85a" />
                <stop offset="100%" stopColor="#1d6a36" />
              </linearGradient>
              <linearGradient id="capLeftGif" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6ad4ad" />
                <stop offset="100%" stopColor="#1f6b4d" />
              </linearGradient>
              <linearGradient id="capRightGif" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbfffc" />
                <stop offset="100%" stopColor="#c5e8d6" />
              </linearGradient>
              <linearGradient id="shineGif" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="white" stopOpacity="0.85" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <clipPath id="morphClipGif">
                <path ref={clipRef} d={LEAF_PATH} />
              </clipPath>
            </defs>

            <path ref={fillRef} d={LEAF_PATH} fill="url(#leafFillGif)" />

            <g ref={veinRef}>
              <path
                d="M80 20C80 42 80 64 80 86"
                stroke="#f4fce8"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
                opacity="0.85"
              />
              <path
                d="M80 38C70 48 62 58 58 66M80 56C90 66 98 74 102 82"
                stroke="#f4fce8"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
                opacity="0.55"
              />
            </g>

            {/* Capsule paint clipped to the morphing silhouette */}
            <g ref={shellRef} clipPath="url(#morphClipGif)" opacity={0}>
              <rect x="0" y="0" width="80" height="104" fill="url(#capLeftGif)" />
              <rect x="80" y="0" width="80" height="104" fill="url(#capRightGif)" />
              <rect x="78.5" y="30" width="3" height="44" rx="1.5" fill="#113227" opacity="0.18" />
              <ellipse cx="52" cy="40" rx="14" ry="8" fill="white" opacity="0.35" />
              <ellipse cx="108" cy="40" rx="12" ry="7" fill="white" opacity="0.45" />
              <rect
                ref={shineRef}
                x={-30}
                y="18"
                width="28"
                height="68"
                fill="url(#shineGif)"
                opacity={0}
                transform="skewX(-18)"
              />
            </g>
          </svg>
        </div>

        <div
          ref={shadowRef}
          className="absolute bottom-4 h-2.5 w-20 rounded-full bg-[#113227]/15 blur-[3px]"
        />
      </div>
    </div>
  );
}

const CTA = () => {
  return (
    <section className="zephyr-section overflow-hidden bg-white">
      <div className="zephyr-container">
        <div className="mx-auto max-w-5xl text-center">
          <H2 className="text-black">Built for brand partnerships</H2>

          <P className="mx-auto mt-3 max-w-4xl">
            Zephyr is a full-service manufacturing partner for the healthcare and
            organic industry. We tailor-make vitamins, minerals, health
            supplements, and specialty tablets with advanced packaging
            technologies for private label brands.
          </P>
        </div>

        <CoverflowCarousel />
        <LeafToCapsuleMorph />
      </div>
    </section>
  );
};

export default CTA;
