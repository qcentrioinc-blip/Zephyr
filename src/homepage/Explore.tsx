import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
      "Botanical formulas for private label wellness, immunity, and holistic health brands.",
    image: "/Homepage/Organic.png",
    color: "bg-[#C38046]",
    borderColor: "#C38046",
    textColor: "#C38046",
    link: "/herbaceutical",
  },
  {
    title: "Nutraceutical",
    description:
      "Science-backed vitamins, minerals, and dietary supplements for everyday nutrition brands.",
    image: "/Homepage/Nutra.png",
    color: "bg-[#4AA3A7]",
    borderColor: "#4AA3A7",
    textColor: "#4AA3A7",
    link: "/nutraceutical",
  },
  {
    title: "Organic",
    description:
      "Organic-focused formulas and clean-label manufacturing for health and wellness brands.",
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
const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
const LOOP_MS = 4500;

const SPRING_SOFT = { type: "spring" as const, stiffness: 120, damping: 22, mass: 0.9 };

const centerMotion = {
  initial: { opacity: 0, scale: 0.92, y: 12 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...SPRING_SOFT, opacity: { duration: 0.55, ease: EASE_PREMIUM } },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: -8,
    transition: { duration: 0.5, ease: EASE_PREMIUM },
  },
};

const sideMotion = {
  initial: { opacity: 0, scale: 0.94 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_PREMIUM },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.45, ease: EASE_PREMIUM },
  },
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
      className="group flex cursor-pointer flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className={`relative ${sizeClassName}`}>
        <CircularLabel
          title={item.title}
          pathKey={pathKey}
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
  const reduceMotion = Boolean(useReducedMotion());
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % items.length);
    }, LOOP_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused, items.length]);

  if (reduceMotion) {
    return (
      <div className="flex items-end justify-center gap-3 sm:hidden">
        {items.map((item) => (
          <ExploreCard
            key={item.title}
            item={item}
            pathKey={`eq-${item.title}`}
            sizeClassName="h-[110px] w-[110px]"
            insetClassName="inset-[15px]"
          />
        ))}
      </div>
    );
  }

  const center = items[featuredIndex];
  const left = items[(featuredIndex + items.length - 1) % items.length];
  const right = items[(featuredIndex + 1) % items.length];

  return (
    <div
      className="flex justify-center sm:hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative h-[200px] w-full max-w-[340px]">
        <div className="absolute bottom-0 left-0 z-10 h-[105px] w-[105px]">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={`left-${left.title}`}
              className="absolute inset-0"
              variants={sideMotion}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ExploreCard
                item={left}
                pathKey={`left-${left.title}-${featuredIndex}`}
                sizeClassName="h-[105px] w-[105px]"
                insetClassName="inset-[15px]"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute left-1/2 top-0 z-20 h-[150px] w-[150px] -translate-x-1/2">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={`center-${center.title}`}
              className="absolute inset-0 origin-center"
              variants={centerMotion}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ willChange: "transform, opacity" }}
            >
              <motion.div
                className="h-full w-full rounded-full"
                animate={{
                  y: [0, -4, 0],
                  boxShadow: [
                    `0 8px 24px ${center.borderColor}22`,
                    `0 14px 36px ${center.borderColor}33`,
                    `0 8px 24px ${center.borderColor}22`,
                  ],
                }}
                transition={{
                  duration: 3.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              >
                <ExploreCard
                  item={center}
                  pathKey={`center-${center.title}-${featuredIndex}`}
                  sizeClassName="h-[150px] w-[150px]"
                  insetClassName="inset-[21px]"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-0 right-0 z-10 h-[105px] w-[105px]">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={`right-${right.title}`}
              className="absolute inset-0"
              variants={sideMotion}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ExploreCard
                item={right}
                pathKey={`right-${right.title}-${featuredIndex}`}
                sizeClassName="h-[105px] w-[105px]"
                insetClassName="inset-[15px]"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function TabletRowLayout({ items }: { items: ExploreItem[] }) {
  return (
    <div className="hidden items-end justify-center gap-5 sm:flex md:gap-8 lg:hidden">
      {items.map((item) => (
        <ExploreCard
          key={item.title}
          item={item}
          pathKey={`tablet-${item.title}`}
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
      {items.map((item) => (
        <ExploreCard
          key={item.title}
          item={item}
          pathKey={`desk-${item.title}`}
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
