import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { H1, H3, H4, P } from "../Global/Typography/Typo";

type Panel = {
  imgUrl: string;
  subheading: string;
  heading: string;
  title: string;
  p1: string;
  p2: string;
};

const panels: Panel[] = [
  {
    imgUrl: "/Generated/rd-lab-bench.png",
    subheading: "Formulation",
    heading: "Formulation before commercial scale.",
    title: "Concept formulas shaped with partners",
    p1: "Zephyr uses trend and market analysis, plus new supplier assessment, to provide concept formulas for new product development and existing product optimization.",
    p2: "Our product development manager and laboratory teams turn briefs into workable formulas ready for pilot evaluation.",
  },
  {
    imgUrl: "/Generated/rd-pilot-validate.webp",
    subheading: "Pilot & validate",
    heading: "Pilot, stability, and analytics.",
    title: "Pilot trials, stability, and analytics",
    p1: "Formulas are refined, developed, piloted, and production-trialed in our dedicated product development laboratory facilities.",
    p2: "In-house stability testing, pre-production samples, analytical method development, and validation support keep every transfer grounded in data.",
  },
  {
    imgUrl: "/Generated/packaging-flatlay.png",
    subheading: "Transfer",
    heading: "Ready for manufacturing.",
    title: "Development-led scale up and regulatory finish",
    p1: "We use extensive internal expertise within our production team to transfer the product to full scale production and finalize product, process, and packaging specifications.",
    p2: "Artwork packaging expertise and a dedicated regulatory team help partners close the loop from R&D dossier to finished goods pack.",
  },
];

export const TextParallaxContentExample = () => {
  return (
    <div className="bg-white">
      {panels.map((panel) => (
        <TextParallaxContent
          key={panel.heading}
          imgUrl={panel.imgUrl}
          subheading={panel.subheading}
          heading={panel.heading}
        >
          <PanelContent title={panel.title} p1={panel.p1} p2={panel.p2} />
        </TextParallaxContent>
      ))}
    </div>
  );
};

const IMG_PADDING = 12;

interface TextParallaxContentProps {
  imgUrl: string;
  subheading: string;
  heading: string;
  children: ReactNode;
}

/**
 * Scroll choreography (one sticky viewport):
 * 1) Dark overlay + text fade in / scroll up
 * 2) Text + overlay both leave — image stays fully clear
 * 3) Near the end, ONLY the photo scales down (overlay is already gone / not scaled)
 */
const TextParallaxContent = ({
  imgUrl,
  subheading,
  heading,
  children,
}: TextParallaxContentProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Text: appear early, hold, then leave
  const textY = useTransform(scrollYProgress, [0, 0.45], [120, -160]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.28, 0.42],
    [0, 1, 1, 0],
  );

  // Overlay only during text; pinned at 0 for the entire clear + scale phase
  const veilOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.28, 0.4, 0.42, 1],
    [0.7, 0.7, 0.7, 0.12, 0, 0],
  );

  // Hard-remove overlay before scale starts so Safari can’t paint a residual veil
  const [showVeil, setShowVeil] = useState(true);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setShowVeil(v < 0.45);
  });

  // Scale the photo layer only — never the overlay
  const imageScale = useTransform(scrollYProgress, [0.72, 1], [1, 0.85]);

  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div ref={sectionRef} className="relative h-[220vh]">
        <div
          className="sticky z-0 overflow-hidden rounded-3xl"
          style={{
            height: `calc(100dvh - ${IMG_PADDING * 2}px)`,
            top: IMG_PADDING,
          }}
        >
          {/* Photo scales on exit; no dark layer here */}
          <motion.div
            style={{
              backgroundImage: `url(${imgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              scale: imageScale,
            }}
            className="absolute inset-0 origin-center"
          />

          {/* Unmounted after text leaves — cannot reappear during scale-down */}
          {showVeil ? (
            <motion.div
              className="pointer-events-none absolute inset-0 z-[1] bg-black"
              style={{ opacity: veilOpacity }}
              aria-hidden
            />
          ) : null}

          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-white"
          >
            <H4 className="mb-2 text-center text-white md:mb-4">{subheading}</H4>
            <H1 className="text-center text-[32px] sm:text-[44px] md:text-[56px] lg:text-[72px] xl:text-[84px] !leading-[1.05]">
              {heading}
            </H1>
          </motion.div>
        </div>
      </div>
      {children}
    </div>
  );
};

const PanelContent = ({
  title,
  p1,
  p2,
}: {
  title: string;
  p1: string;
  p2: string;
}) => (
  <div className="zephyr-container grid max-w-5xl grid-cols-1 gap-8 pb-24 pt-12 md:grid-cols-12">
    <H3 className="col-span-1 md:col-span-4">{title}</H3>
    <div className="col-span-1 md:col-span-8">
      <P className="mb-4 !text-[14px] !leading-relaxed text-gray-700 md:!text-[16px] lg:!text-[18px]">
        {p1}
      </P>
      <P className="mb-6 !text-[14px] !leading-relaxed text-gray-700 md:!text-[16px] lg:!text-[18px]">
        {p2}
      </P>
      <Link
        to="/contact"
        className="group inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:gap-2.5 hover:bg-neutral-700 md:w-fit"
      >
        Request MOQ{" "}
        <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  </div>
);
