import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { H1, H3, H4, P } from "../Global/Typography/Typo";

export const TextParallaxContentExample = () => {
  return (
    <div className="bg-white">
      <TextParallaxContent
        imgUrl="/Gallery/LongGallery.png"
        subheading="Capacity"
        heading="Built for scale."
      >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="/Gallery/Gallery2.png"
        subheading="Quality"
        heading="Never compromise."
      >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="/Production/ProductionsHeroLeft.png"
        subheading="Partnership"
        heading="Idea to finished pack."
      >
        <ExampleContent />
      </TextParallaxContent>
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

const TextParallaxContent = ({
  imgUrl,
  subheading,
  heading,
  children,
}: TextParallaxContentProps) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

interface StickyImageProps {
  imgUrl: string;
}

const StickyImage = ({ imgUrl }: StickyImageProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

interface OverlayCopyProps {
  subheading: string;
  heading: string;
}

const OverlayCopy = ({ subheading, heading }: OverlayCopyProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <H4 className="mb-2 text-center text-white md:mb-4 ">
        {subheading}
      </H4>
      <H1 className="text-center">{heading}</H1>
    </motion.div>
  );
};

const ExampleContent = () => (
  <div className="zephyr-container grid max-w-5xl grid-cols-1 gap-8 pb-24 pt-12 md:grid-cols-12">
    <H3 className="col-span-1 md:col-span-4">
      Facilities built for partner scale
    </H3>
    <div className="col-span-1 md:col-span-8">
      <P className="mb-4 ">
        From humidity-controlled dispensing and wet/dry granulation to high-speed
        compression, coating and hard-gel capsule filling — Zephyr’s lines are
        designed for flexible private-label manufacturing.
      </P>
      <P className="mb-8 ">
        Our isolation suite supports segregated ingredients, while packaging
        options spanning jars, sachets, blister, bulk, bottles, Alu Alu and stick
        packs help partners launch ready-to-go products.
      </P>
      <Link
        to="/contact"
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-9 py-4 text-xl text-white shadow-sm transition-all duration-300 hover:gap-3 hover:bg-neutral-700 hover:shadow-lg md:w-fit"
      >
        Enquire / MOQ{" "}
        <FiArrowUpRight className="shrink-0 transition-transform duration-300 group-hover:translate-x-1.5" />
      </Link>
    </div>
  </div>
);
