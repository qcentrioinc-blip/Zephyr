import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { H1, H3, P } from "../components/Typography/Typo";

type Panel = {
  imgUrl: string;
  subheading: string;
  heading: string;
  title: string;
  p1: string;
  p2: string;
  imageSide: "left" | "right";
};

const panels: Panel[] = [
  {
    imgUrl: "/Generated/rd-lab-bench.png",
    subheading: "Formulation",
    heading: "Formulation before commercial scale.",
    title: "Concept formulas shaped with partners",
    p1: "Zephyr uses market analysis and supplier assessment to provide concept formulas for new product development and existing product optimization.",
    p2: "Our product development manager and laboratory teams turn briefs into workable formulas ready for pilot evaluation.",
    imageSide: "left",
  },
  {
    imgUrl: "/Generated/rd-pilot-validate.webp",
    subheading: "Pilot & validate",
    heading: "Pilot, stability, and analytics.",
    title: "Pilot trials, stability, and analytics",
    p1: "Formulas are refined, developed, piloted, and production-trialed in our dedicated product development laboratory facilities.",
    p2: "In-house stability testing, pre-production samples, analytical method development, and validation support keep every transfer grounded in data.",
    imageSide: "right",
  },
  {
    imgUrl: "/Generated/packaging-flatlay.png",
    subheading: "Transfer",
    heading: "Ready for manufacturing.",
    title: "Scale-up and regulatory finish",
    p1: "Our production team transfers the product to full-scale manufacturing and finalizes product, process, and packaging specifications.",
    p2: "Artwork packaging expertise and a dedicated regulatory team help partners close the loop from R&D dossier to finished goods pack.",
    imageSide: "left",
  },
];

/** Ease-out — decelerates into the docked position */
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

/** Scroll progress helpers — animate early, ease into hold state */
function lerp(
  progress: number,
  start: number,
  end: number,
  from: number,
  to: number,
  ease = easeOutQuart,
) {
  if (progress <= start) return from;
  if (progress >= end) return to;
  const t = ease((progress - start) / (end - start));
  return from + (to - from) * t;
}

/** Spring config — smooth on the way down */
const SCROLL_SPRING = {
  stiffness: 100,
  damping: 30,
  mass: 0.32,
  restDelta: 0.001,
};

/**
 * >1 compresses reverse progress so undocking finishes with less upward scroll.
 * Downward scroll uses progress as-is.
 */
const UP_SCROLL_POWER = 1.85;

function useIsDesktop(minWidth = 1024) {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(`(min-width: ${minWidth}px)`).matches
      : true,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [minWidth]);

  return isDesktop;
}

export const TextParallaxContentExample = () => {
  return (
    <div className="bg-white">
      {panels.map((panel, index) => (
        <TextParallaxContent key={panel.heading} panel={panel} index={index} />
      ))}
    </div>
  );
};

const PAD = 20;
/** Equal vertical inset once docked — top and bottom match */
const DOCK_INSET = 4;

/** Longer scroll windows = slower, more premium dock */
const IMAGE_ANIM_START = 0.06;
const IMAGE_ANIM_END = 0.62;
const CONTENT_ANIM_START = 0.28;
const CONTENT_ANIM_END = 0.68;

const TextParallaxContent = ({
  panel,
  index,
}: {
  panel: Panel;
  index: number;
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop(1024);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Directional progress: down = linear, up = compressed (faster reverse)
  const directedProgress = useMotionValue(0);
  const lastProgress = useRef(0);
  const directionRef = useRef<"down" | "up">("down");

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const prev = lastProgress.current;
    lastProgress.current = v;

    if (v < prev - 0.0004) directionRef.current = "up";
    else if (v > prev + 0.0004) directionRef.current = "down";

    const clamped = Math.max(0, Math.min(1, v));
    if (directionRef.current === "up") {
      directedProgress.set(Math.pow(clamped, UP_SCROLL_POWER));
    } else {
      directedProgress.set(clamped);
    }
  });

  useEffect(() => {
    const v = scrollYProgress.get();
    lastProgress.current = v;
    directedProgress.set(v);
  }, [scrollYProgress, directedProgress]);

  // Spring-smooth so flicks ease in; reverse still feels quicker via remapping
  const smoothProgress = useSpring(directedProgress, SCROLL_SPRING);

  const imageLeft = panel.imageSide === "left";
  const dockHeight = 100 - DOCK_INSET * 2;

  const imageWidth = useTransform(smoothProgress, (v) => {
    const pct = lerp(v, IMAGE_ANIM_START, IMAGE_ANIM_END, 100, 46);
    return `${pct}%`;
  });

  const imageHeight = useTransform(smoothProgress, (v) => {
    const pct = lerp(v, IMAGE_ANIM_START, IMAGE_ANIM_END, 100, dockHeight);
    return `${pct}%`;
  });

  const imageRadius = useTransform(smoothProgress, (v) =>
    lerp(v, IMAGE_ANIM_START, IMAGE_ANIM_END, 24, 28),
  );

  const imageLeftPos = useTransform(smoothProgress, (v) => {
    const dockLeft = imageLeft ? 0 : 54;
    const pct = lerp(v, IMAGE_ANIM_START, IMAGE_ANIM_END, 0, dockLeft);
    return `${pct}%`;
  });

  const imageTopPos = useTransform(smoothProgress, (v) => {
    const pct = lerp(v, IMAGE_ANIM_START, IMAGE_ANIM_END, 0, DOCK_INSET);
    return `${pct}%`;
  });

  const contentOpacity = useTransform(smoothProgress, (v) =>
    lerp(v, CONTENT_ANIM_START, CONTENT_ANIM_END, 0, 1),
  );

  const contentX = useTransform(smoothProgress, (v) => {
    const offset = imageLeft ? 48 : -48;
    return lerp(v, CONTENT_ANIM_START, CONTENT_ANIM_END, offset, 0);
  });

  const contentY = useTransform(smoothProgress, (v) =>
    lerp(v, CONTENT_ANIM_START, CONTENT_ANIM_END, 20, 0),
  );

  if (reduced || !isDesktop) {
    return <StaticPanel panel={panel} index={index} />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[280vh] bg-white"
      aria-label={panel.title}
    >
      <div
        className="sticky z-0 px-5"
        style={{
          /* Sit below fixed navbar + breadcrumb so the stage is not clipped */
          top: `calc(var(--zephyr-nav-h) + var(--zephyr-crumb-h) + ${PAD}px)`,
          height: `calc(100dvh - var(--zephyr-nav-h) - var(--zephyr-crumb-h) - ${PAD * 2}px)`,
        }}
      >
        <div className="relative h-full w-full overflow-hidden bg-transparent">
          <motion.div
            className="absolute z-[1] overflow-hidden will-change-[width,height,left,top]"
            style={{
              width: imageWidth,
              height: imageHeight,
              left: imageLeftPos,
              top: imageTopPos,
              borderRadius: imageRadius,
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${panel.imgUrl})` }}
              role="img"
              aria-label={panel.heading}
            />
          </motion.div>

          <PanelCopy
            panel={panel}
            index={index}
            imageLeft={imageLeft}
            opacity={contentOpacity}
            x={contentX}
            y={contentY}
          />
        </div>
      </div>
    </section>
  );
};

const PanelCopy = ({
  panel,
  index,
  imageLeft,
  opacity,
  x,
  y,
}: {
  panel: Panel;
  index: number;
  imageLeft: boolean;
  opacity: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
}) => (
  <motion.div
    className={`absolute z-[2] flex w-[48%] items-center px-8 lg:px-12 xl:px-16 ${
      imageLeft ? "right-0" : "left-0"
    }`}
    style={{
      opacity,
      x,
      y,
      top: `${DOCK_INSET}%`,
      bottom: `${DOCK_INSET}%`,
      height: `${100 - DOCK_INSET * 2}%`,
    }}
  >
    <div className="w-full max-w-md">
      <p className="mb-3 font-manrope text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1f5f8b]">
        {String(index + 1).padStart(2, "0")} · {panel.subheading}
      </p>
      <H1 className="mb-3 !text-[26px] !leading-[1.12] text-neutral-900 lg:!text-[34px]">
        {panel.heading}
      </H1>
      <H3 className="mb-4 !text-[20px] !leading-snug text-neutral-800 lg:!text-[24px]">
        {panel.title}
      </H3>
      <P className="mb-3 !text-[14px] !leading-relaxed text-neutral-600 lg:!text-[16px]">
        {panel.p1}
      </P>
      <P className="mb-7 !text-[14px] !leading-relaxed text-neutral-600 lg:!text-[16px]">
        {panel.p2}
      </P>
      <Link
        to="/contact"
        className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:gap-2.5 hover:bg-neutral-700"
      >
        Request MOQ
        <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  </motion.div>
);

/** Mobile / reduced-motion: clear image + text beside / below */
const StaticPanel = ({ panel, index }: { panel: Panel; index: number }) => {
  const imageLeft = panel.imageSide === "left";

  return (
    <section
      className="bg-white px-4 py-10 md:px-6 md:py-14"
      aria-label={panel.title}
    >
      <div
        className={`mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-12 ${
          imageLeft ? "" : "md:[&>*:first-child]:order-2"
        }`}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:aspect-[3/4]">
          <img
            src={panel.imgUrl}
            alt={panel.heading}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
        <div className="max-w-md md:py-4">
          <p className="mb-3 font-manrope text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1f5f8b]">
            {String(index + 1).padStart(2, "0")} · {panel.subheading}
          </p>
          <H1 className="mb-3 !text-[26px] !leading-tight text-neutral-900 md:!text-[32px]">
            {panel.heading}
          </H1>
          <H3 className="mb-4 !text-[22px] text-neutral-900 lg:!text-[28px]">
            {panel.title}
          </H3>
          <P className="mb-3 !text-[14px] !leading-relaxed text-neutral-600 lg:!text-[16px]">
            {panel.p1}
          </P>
          <P className="mb-7 !text-[14px] !leading-relaxed text-neutral-600 lg:!text-[16px]">
            {panel.p2}
          </P>
          <Link
            to="/contact"
            className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:gap-2.5 hover:bg-neutral-700"
          >
            Request MOQ
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
