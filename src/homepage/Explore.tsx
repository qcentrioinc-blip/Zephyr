import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { H3, P } from "../components/Typography/Typo";

interface ExploreItem {
  title: string;
  description: string;
  image: string;
  color: string;
  borderColor: string;
  textColor: string;
  link: string;
  comingSoon?: boolean;
}

const ITEMS: ExploreItem[] = [
  {
    title: "Nutraceutical",
    description:
      "Vitamins, minerals, and specialty supplements for commercial brand portfolios.",
    image: "/homepage/nuetra.webp",
    color: "bg-[#4AA3A7]",
    borderColor: "#4AA3A7",
    textColor: "#4AA3A7",
    link: "/nutraceutical",
  },
  {
    title: "Herbaceutical",
    description:
      "Botanical dietary supplements for private-label brand programs.",
    image: "/homepage/herbal.webp",
    color: "bg-[#C38046]",
    borderColor: "#C38046",
    textColor: "#C38046",
    link: "/herbaceutical",
  },
  {
    title: "Organic",
    description:
      "Organic and clean label manufacturing for private label launch.",
    image: "/homepage/organic.webp",
    color: "bg-[#547A3D]",
    borderColor: "#547A3D",
    textColor: "#547A3D",
    link: "/organic",
  },
  {
    title: "Bioceuticals",
    description:
      "Next-generation bio-fermented and bio-enhanced formulations. Launching soon.",
    image: "/homepage/bioceutical.webp",
    color: "bg-[#1E5D57]",
    borderColor: "#1E5D57",
    textColor: "#1E5D57",
    link: "#",
    comingSoon: true,
  },
];

const ROTATION_ON_HOVER = 25;
const ROTATION_TRANSITION = {
  duration: 1.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

// Radius is 118, circumference is 2 * PI * 118 = ~741.42
const CIRCLE_CIRCUMFERENCE = 741.42;

function CircularLabel({
  title,
  pathKey,
  textColor,
  borderColor,
  rotated,
  isMobile = false,
}: {
  title: string;
  pathKey: string;
  textColor: string;
  borderColor: string;
  rotated: boolean;
  isMobile?: boolean;
}) {
  const pathId = `circlePath-${pathKey}`;
  // Exact repetitions so words evenly fill the circle perimeter without overflowing or merging
  const repetitions = title.toLowerCase() === "organic" ? 6 : 4;
  const repeatedText = `${title} • `.repeat(repetitions);

  return (
    <motion.svg
      viewBox="0 0 300 300"
      className="absolute inset-0 h-full w-full"
      animate={{ rotate: rotated ? ROTATION_ON_HOVER : 0 }}
      transition={ROTATION_TRANSITION}
      aria-hidden="true"
    >
      <defs>
        <path
          id={pathId}
          d="
            M 150,150
            m -118,0
            a 118,118 0 1,1 236,0
            a 118,118 0 1,1 -236,0
          "
        />
      </defs>

      <circle cx="150" cy="150" r="145" fill="none" stroke={borderColor} strokeWidth="1" />
      <circle cx="150" cy="150" r="108" fill="none" stroke={borderColor} strokeWidth="1" />

      <text
        fill={textColor}
        fontSize={isMobile ? "11.5" : "13"}
        letterSpacing={isMobile ? "2" : "3"}
        fontWeight={isMobile ? "600" : "500"}
        textLength={CIRCLE_CIRCUMFERENCE}
        lengthAdjust="spacing"
        className="font-manrope select-none"
      >
        <textPath href={`#${pathId}`} startOffset="0%">
          {repeatedText}
        </textPath>
      </text>
    </motion.svg>
  );
}

function ExploreCard({
  item,
  pathKey,
  sizeClassName,
  insetClassName,
  hoverFx = false,
  isMobile = false,
}: {
  item: ExploreItem;
  pathKey: string;
  sizeClassName: string;
  insetClassName: string;
  /** Desktop-only: ring text spin + colored overlay reveal */
  hoverFx?: boolean;
  isMobile?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const showFx = hoverFx && isHovered;

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (item.comingSoon) {
      setCursorPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCursorPos(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!item.comingSoon) return;
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const cardInner = (
    <div
      className={`relative rounded-full bg-white ${sizeClassName} ${
        item.comingSoon ? "cursor-none" : ""
      }`}
    >
      <CircularLabel
        title={item.title}
        pathKey={pathKey}
        textColor={item.textColor}
        borderColor={item.borderColor}
        rotated={showFx}
        isMobile={isMobile}
      />

      <div
        className={`absolute ${insetClassName} flex items-center justify-center overflow-hidden rounded-full bg-white`}
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className={`h-full w-full rounded-full object-cover transition-all duration-500 ${
            showFx ? "scale-[1.03]" : "scale-100"
          }`}
        />

        {/* Regular hover reveal overlay for other items */}
        {!item.comingSoon ? (
          <div
            className={`absolute inset-0 ${item.color} flex flex-col items-center justify-center p-2 text-center transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-3 md:p-4 ${
              showFx ? "[clip-path:inset(0%_0_0_0)]" : "[clip-path:inset(100%_0_0_0)]"
            }`}
          >
            <H3 className="mb-1 text-white !text-[12px] sm:!text-[14px] md:!text-[15px] lg:!text-[16px]" animate={false}>
              {item.title}
            </H3>
            <P className="text-white !text-[11px] sm:!text-[12px] md:!text-[13px]">{item.description}</P>
          </div>
        ) : null}
      </div>
    </div>
  );

  if (item.comingSoon) {
    return (
      <div
        className="group relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {cardInner}

        {/* Premium Floating circular badge right at pointer position */}
        {isHovered && cursorPos && typeof document !== "undefined"
          ? createPortal(
              <div
                className="pointer-events-none fixed top-0 left-0 z-[99999] opacity-100 will-change-transform"
                style={{
                  transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) translate(-50%, -50%)`,
                  transition: "transform 0.08s linear",
                }}
                aria-hidden="true"
              >
                <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full border border-white/75 bg-[#0e271f]/85 shadow-[0_12px_32px_rgba(0,0,0,0.38)] backdrop-blur-md animate-in fade-in zoom-in-75 duration-200">
                  <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.09em] leading-tight text-white text-center max-w-[8ch]">
                    Coming Soon
                  </span>
                </div>
              </div>,
              document.body
            )
          : null}
      </div>
    );
  }

  return (
    <Link
      to={item.link}
      className={hoverFx ? "group" : undefined}
      onMouseEnter={hoverFx ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverFx ? () => setIsHovered(false) : undefined}
    >
      {cardInner}
    </Link>
  );
}

/** Mobile: 2-column grid; 4 items fit nicely into a 2x2 grid */
function MobileGridLayout({ items }: { items: ExploreItem[] }) {
  return (
    <div className="grid grid-cols-2 place-items-center gap-3 sm:hidden">
      {items.map((item) => (
        <div key={item.title}>
          <ExploreCard
            item={item}
            pathKey={`mob-${item.title}`}
            sizeClassName="h-[160px] w-[160px] xs:h-[168px] xs:w-[168px]"
            insetClassName="inset-[26px] xs:inset-[27px]"
            isMobile={true}
          />
        </div>
      ))}
    </div>
  );
}

function TabletRowLayout({ items }: { items: ExploreItem[] }) {
  return (
    <div className="hidden place-items-center gap-5 sm:grid sm:grid-cols-2 md:grid-cols-4 md:gap-6 lg:hidden">
      {items.map((item) => (
        <ExploreCard
          key={item.title}
          item={item}
          pathKey={`tablet-${item.title}`}
          sizeClassName="h-[175px] w-[175px] md:h-[190px] md:w-[190px]"
          insetClassName="inset-[28px] md:inset-[30px]"
        />
      ))}
    </div>
  );
}

function DesktopGridLayout({ items }: { items: ExploreItem[] }) {
  return (
    <div className="hidden place-items-center justify-center gap-6 lg:grid lg:grid-cols-4 xl:gap-8 2xl:gap-10">
      {items.map((item) => (
        <ExploreCard
          key={item.title}
          item={item}
          pathKey={`desk-${item.title}`}
          sizeClassName="h-[210px] w-[210px] xl:h-[240px] xl:w-[240px] 2xl:h-[260px] 2xl:w-[260px]"
          insetClassName="inset-[34px] xl:inset-[38px] 2xl:inset-[40px]"
          hoverFx={true}
        />
      ))}
    </div>
  );
}

export default function Explore() {
  return (
    <section className="zephyr-section">
      <div className="zephyr-container">
        <MobileGridLayout items={ITEMS} />
        <TabletRowLayout items={ITEMS} />
        <DesktopGridLayout items={ITEMS} />
      </div>
    </section>
  );
}
