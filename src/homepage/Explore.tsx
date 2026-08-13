import { useState } from "react";
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
}

const ITEMS: ExploreItem[] = [
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
    title: "Organic",
    description:
      "Organic and clean-label manufacturing for private-label launch.",
    image: "/homepage/organic.webp",
    color: "bg-[#547A3D]",
    borderColor: "#547A3D",
    textColor: "#547A3D",
    link: "/organic",
  },
  {
    title: "Skin Care",
    description:
      "Alfurin — psoriasis-prone skincare, Zephyr distribution.",
    image: "/homepage/skincare-main.png",
    color: "bg-[#1F5F8B]",
    borderColor: "#1F5F8B",
    textColor: "#1F5F8B",
    link: "/skincare",
  },
];

const ROTATION_ON_HOVER = 25;
const ROTATION_TRANSITION = {
  duration: 1.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

function CircularLabel({
  title,
  pathKey,
  textColor,
  borderColor,
  rotated,
}: {
  title: string;
  pathKey: string;
  textColor: string;
  borderColor: string;
  rotated: boolean;
}) {
  const pathId = `circlePath-${pathKey}`;

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

      <text fill={textColor} fontSize="14" letterSpacing="3.5" fontWeight="400">
        <textPath href={`#${pathId}`} startOffset="0%">
          {`${title} • `.repeat(20)}
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
}: {
  item: ExploreItem;
  pathKey: string;
  sizeClassName: string;
  insetClassName: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={item.link}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className={`relative rounded-full bg-white ${sizeClassName}`}>
        <CircularLabel
          title={item.title}
          pathKey={pathKey}
          textColor={item.textColor}
          borderColor={item.borderColor}
          rotated={isHovered}
        />

        <div
          className={`absolute ${insetClassName} flex items-center justify-center overflow-hidden rounded-full bg-white`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="h-[95%] w-[95%] bg-white object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />

          <div
            className={`absolute inset-0 ${item.color} flex flex-col items-center justify-center p-2 text-center transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0%_0_0_0)] sm:p-3 md:p-4`}
          >
            <H3 className="mb-1 text-white !text-[11px] sm:!text-[13px] md:!text-[15px] lg:!text-[16px]" animate={false}>{item.title}</H3>
            <P className="text-white !text-[9px] sm:!text-[10px] md:!text-[11px] lg:!text-[12px]">{item.description}</P>
          </div>
        </div>
      </div>
    </Link>
  );
}

/** Mobile: static 2×2 grid, no animation */
function MobileGridLayout({ items }: { items: ExploreItem[] }) {
  return (
    <div className="grid grid-cols-2 place-items-center gap-3 sm:hidden">
      {items.map((item) => (
        <ExploreCard
          key={item.title}
          item={item}
          pathKey={`mob-${item.title}`}
          sizeClassName="h-[170px] w-[170px]"
          insetClassName="inset-[28px]"
        />
      ))}
    </div>
  );
}

function TabletRowLayout({ items }: { items: ExploreItem[] }) {
  return (
    <div className="hidden grid-cols-2 place-items-center gap-8 sm:grid md:gap-10 lg:hidden">
      {items.map((item) => (
        <ExploreCard
          key={item.title}
          item={item}
          pathKey={`tablet-${item.title}`}
          sizeClassName="h-[200px] w-[200px] md:h-[250px] md:w-[250px]"
          insetClassName="inset-[32px] md:inset-[40px]"
        />
      ))}
    </div>
  );
}

function DesktopGridLayout({ items }: { items: ExploreItem[] }) {
  return (
    <div className="hidden place-items-center gap-10 lg:grid lg:grid-cols-4 xl:gap-12">
      {items.map((item) => (
        <ExploreCard
          key={item.title}
          item={item}
          pathKey={`desk-${item.title}`}
          sizeClassName="h-[230px] w-[230px] xl:h-[270px] xl:w-[270px]"
          insetClassName="inset-[36px] xl:inset-[42px]"
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
