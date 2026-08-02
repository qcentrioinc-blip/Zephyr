import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { H3, P } from "../Global/Typography/Typo";

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
      "Pure botanical formulations crafted to promote natural wellness, immunity, and holistic health.",
    image: "/Homepage/Organic.png",
    color: "bg-[#C38046]",
    borderColor: "#C38046",
    textColor: "#C38046",
    link: "/herbaceutical",
  },
  {
    title: "Nutraceutical",
    description:
      "Science-backed vitamins, minerals, and supplements designed to support optimal health and daily nutrition.",
    image: "/Homepage/Nutra.png",
    color: "bg-[#4AA3A7]",
    borderColor: "#4AA3A7",
    textColor: "#4AA3A7",
    link: "/nutraceutical",
  },
  {
    title: "Organic",
    description:
      "Innovative blends of herbal extracts and nutritional science for targeted health and enhanced well-being.",
    image: "/Homepage/Herbal.png",
    color: "bg-[#547A3D]",
    borderColor: "#547A3D",
    textColor: "#547A3D",
    link: "/organic",
  },
];

const ROTATION_ON_HOVER = 25;
const ROTATION_TRANSITION = {
  duration: 1.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

function CircularLabel({
  title,
  index,
  textColor,
  borderColor,
  rotated,
}: {
  title: string;
  index: number;
  textColor: string;
  borderColor: string;
  rotated: boolean;
}) {
  const pathId = `circlePath-${index}`;

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

      <text fill={textColor} fontSize="13" letterSpacing="4.2" fontWeight="400">
        <textPath href={`#${pathId}`} startOffset="0%">
          {`${title} • `.repeat(20)}
        </textPath>
      </text>
    </motion.svg>
  );
}

function ExploreCard({
  item,
  index,
  sizeClassName,
  insetClassName,
}: {
  item: ExploreItem;
  index: number;
  sizeClassName: string;
  insetClassName: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={item.link}
      className="group flex cursor-pointer flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className={`relative ${sizeClassName}`}>
        <CircularLabel
          title={item.title}
          index={index}
          textColor={item.textColor}
          borderColor={item.borderColor}
          rotated={isHovered}
        />

        <div className={`absolute ${insetClassName} overflow-hidden rounded-full shadow-lg`}>
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500"
          />

          <div
            className={`absolute inset-0 ${item.color} flex flex-col items-center justify-center p-3 text-center transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0%_0_0_0)] sm:p-4 md:p-6`}
          >
            <H3 className="mb-1.5 text-white sm:mb-2 md:mb-3">{item.title}</H3>
            <P className="text-white">{item.description}</P>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MobileArcLayout({ items }: { items: ExploreItem[] }) {
  const [left, center, right] = items;

  return (
    <div className="flex justify-center sm:hidden">
      <div className="relative h-[200px] w-full max-w-[340px]">
        <div className="absolute bottom-0 left-0 z-10">
          <ExploreCard
            item={left}
            index={0}
            sizeClassName="h-[105px] w-[105px]"
            insetClassName="inset-[15px]"
          />
        </div>

        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
          <ExploreCard
            item={center}
            index={1}
            sizeClassName="h-[150px] w-[150px]"
            insetClassName="inset-[21px]"
          />
        </div>

        <div className="absolute bottom-0 right-0 z-10">
          <ExploreCard
            item={right}
            index={2}
            sizeClassName="h-[105px] w-[105px]"
            insetClassName="inset-[15px]"
          />
        </div>
      </div>
    </div>
  );
}

function TabletRowLayout({ items }: { items: ExploreItem[] }) {
  return (
    <div className="hidden items-end justify-center gap-5 sm:flex md:gap-8 lg:hidden">
      {items.map((item, index) => (
        <ExploreCard
          key={item.title}
          item={item}
          index={index}
          sizeClassName="h-[190px] w-[190px] md:h-[230px] md:w-[230px]"
          insetClassName="inset-[27px] md:inset-[33px]"
        />
      ))}
    </div>
  );
}

function DesktopGridLayout({ items }: { items: ExploreItem[] }) {
  return (
    <div className="hidden place-items-center gap-8 lg:grid lg:grid-cols-3">
      {items.map((item, index) => (
        <ExploreCard
          key={item.title}
          item={item}
          index={index}
          sizeClassName="h-[350px] w-[350px]"
          insetClassName="inset-[49px]"
        />
      ))}
    </div>
  );
}

export default function Explore() {
  return (
    <section className="zephyr-section">
      <div className="zephyr-container">
        <MobileArcLayout items={ITEMS} />
        <TabletRowLayout items={ITEMS} />
        <DesktopGridLayout items={ITEMS} />
      </div>
    </section>
  );
}
