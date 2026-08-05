import { useRef } from "react";
import img1 from "/Gallery/Gallery1.png";
import img2 from "/Gallery/Gallery2.png";
import img3 from "/Gallery/Gallery3.png";
import img4 from "/Gallery/LongGallery.png";
import img5 from "/Gallery/Gallery5.png";

import {
  CalendarDays,
  BarChart3,
  FileText,
  Mail,
} from "lucide-react";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { P } from "../Global/Typography/Typo";

const ManufacturingHighlight = () => {
  const cards = [
    {
      icon: CalendarDays,
      title: "Humidity-controlled dispensing & granulation lines",
    },
    {
      icon: BarChart3,
      title: "High-speed compression with film & sugar coating",
    },
    {
      icon: FileText,
      title: "Isolation suite for segregated ingredients",
    },
    {
      icon: Mail,
      title: "Beadlet & powder filling into hard gel capsules",
    },
  ];

  // --- Entrance variants (images stagger in one after another, then content) ---
  const imageVariant = {
    hidden: { opacity: 0.001, scale: 1.08 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const collageStagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.18, delayChildren: 0.05 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  // Total time the collage takes to finish "fitting" into place: last image
  // starts at delayChildren(0.05) + 4 * staggerChildren(0.18) = 0.77s, and
  // each image's own entrance takes 1.1s, so the last one settles at ~1.87s.
  // Content waits until that's done before it starts revealing.
  const IMAGES_SETTLE_AT = 1.9;

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.25, delayChildren: IMAGES_SETTLE_AT },
    },
  };

  // Used only for the cards grid's own internal stagger — the 1.9s
  // "wait for images" delay is already applied once, at the outer content
  // level, so this one stays plain to avoid stacking that delay twice.
  const cardsStagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.18 },
    },
  };

  // Cards reveal with a 3D flip-open instead of the heading/paragraph's
  // slide-up, so the four boxes feel like a distinct, separate motion.
  const cardFlip = {
    hidden: { opacity: 0, rotateX: -75, scale: 0.92 },
    visible: {
      opacity: 1,
      rotateX: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  // --- Scroll-pin + parallax setup ---
  // The outer section is only slightly taller than the viewport — just
  // enough extra scroll room for the sticky panel to lock in place. Once
  // it's pinned, every reveal (images → overlay/content → cards) plays out
  // purely on a timer (the `delay`/`delayChildren` values below), not on
  // further scroll position. That means there's no leftover "dead" scroll
  // distance after everything has appeared, and the cards always follow
  // the heading/description automatically rather than waiting on more
  // scrolling.
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  });

  // Subtle Ken-Burns zoom on the collage as the user scrolls through the
  // pinned section, and a gentle parallax drift on the content.
  const collageScale = useTransform(smoothProgress, [0, 1], [1, 1.18]);
  const contentY = useTransform(smoothProgress, [0, 1], [24, -24]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[130vh] sm:h-[140vh] lg:h-[150vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background Collage */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: collageScale }}
          variants={collageStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 h-1/2">
            <motion.img
              variants={imageVariant}
              src={img1}
              alt=""
              className="w-full h-full object-cover"
            />
            <motion.img
              variants={imageVariant}
              src={img2}
              alt=""
              className="w-full h-full object-cover"
            />
            <motion.img
              variants={imageVariant}
              src={img3}
              alt=""
              className="hidden sm:block w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 h-1/2">
            <motion.div variants={imageVariant} className="sm:col-span-2">
              <img
                src={img4}
                alt=""
                className="hidden sm:block w-full h-full object-cover"
              />
            </motion.div>

            <motion.div variants={imageVariant}>
              <img src={img5} alt="" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </motion.div>

        {/* Gray overlay — stays completely hidden while the images are still
            animating in, then fades in once they've finished settling, at
            the same moment the content starts revealing. */}
        <motion.div
          className="absolute inset-0 z-10 bg-neutral-900"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: 1,
            delay: IMAGES_SETTLE_AT,
            ease: "easeOut",
          }}
        />

        {/* Content */}
        <motion.div
          className="relative z-20 flex h-full w-full items-center"
          style={{ y: contentY }}
        >
          <motion.div
            className="zephyr-container py-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Heading */}
            <div className="max-w-5xl mx-auto text-center">
              <motion.h2
                variants={fadeUp}
                className="text-white text-[20px] md:text-[24px] lg:text-[32px] font-manrope font-semibold leading-[120%] tracking-normal"
              >
                End-to-end CDMO capability
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-3 sm:mt-4 text-white/90 text-[16px] md:text-[12px] lg:text-[12px] font-para font-normal leading-[120%] md:leading-[18px] tracking-normal"
              >
                From humidity-controlled dispensing and granulation to compression,
                coating, capsule filling, and finished goods packaging. Zephyr
                delivers flexible private label manufacturing with GMP and ISO
                quality systems for nutraceutical, herbaceutical, and organic
                partners.
              </motion.p>
            </div>

            {/* Cards */}
            <motion.div
              className="mt-10 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-8 max-w-4xl mx-auto"
              style={{ perspective: 1000 }}
              variants={cardsStagger}
            >
              {cards.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={index}
                    variants={cardFlip}
                    style={{ transformOrigin: "top center" }}
                    className="
                      flex items-center gap-4 sm:gap-5
                      rounded-3xl
                      border border-white/40
                      bg-white/10
                      backdrop-blur-md
                      px-5 py-4 sm:px-6 sm:py-5
                      transition-all duration-300
                      hover:bg-white/15
                    "
                  >
                    <Icon size={28} className="text-white flex-shrink-0 sm:hidden" />
                    <Icon
                      size={32}
                      className="text-white flex-shrink-0 hidden sm:block"
                    />

                    <P className="text-white py-2 sm:py-4 ">
                      {item.title}
                    </P>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ManufacturingHighlight;
