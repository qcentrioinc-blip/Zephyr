// import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import { ArrowRight } from "lucide-react";
import { H2, H3, P } from "../components/Typography/Typo";
import { PACKAGING_IMAGES } from "../components/packagingSlides";

type ShowcaseItem = {
  name: string;
  image: string;
};

const dosageFormats: ShowcaseItem[] = [
  { name: "Tablets", image: PACKAGING_IMAGES.tablet },
  { name: "Capsules", image: PACKAGING_IMAGES.capsule },
  { name: "Powders", image: PACKAGING_IMAGES.powder },
  { name: "Gummies", image: PACKAGING_IMAGES.gummy },
  { name: "Jelly", image: PACKAGING_IMAGES.jelly },
];

const packagingOptions: ShowcaseItem[] = [
  { name: "Jars", image: PACKAGING_IMAGES.jar },
  { name: "Sachets", image: PACKAGING_IMAGES.sachets },
  { name: "Blister", image: PACKAGING_IMAGES.blisters },
  { name: "Bulk Packs", image: PACKAGING_IMAGES.bulkPacks },
  { name: "Bottle Packs", image: PACKAGING_IMAGES.bottlePacks },
  { name: "Alu Alu", image: PACKAGING_IMAGES.aluAlu },
  { name: "Stick Packs", image: PACKAGING_IMAGES.stickPack },
];

function MarqueeRow({
  items,
  direction,
}: {
  items: ShowcaseItem[];
  direction: "left" | "right";
}) {
  // Four copies ensures the strip always overflows the viewport so the
  // seamless -25% translate never shows a bare end, even on ultra-wide screens.
  const loop = [...items, ...items, ...items, ...items];
  const animClass =
    direction === "left" ? "zephyr-marquee-left" : "zephyr-marquee-right";

  return (
    <div className="zephyr-marquee-pause relative overflow-hidden">
      <div className={`flex w-max gap-3 sm:gap-4 ${animClass}`}>
        {loop.map((item, index) => (
          <article
            key={`${item.name}-${index}`}
            className="group w-[140px] shrink-0 sm:w-[168px] md:w-[190px]"
          >
            <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-[#F7F8F2] shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
              <div className="aspect-square overflow-hidden bg-white">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-2 py-2.5 text-center sm:px-3 sm:py-3">
                <P className="zephyr-type-support font-semibold tracking-wide text-[#113227]">
                  {item.name}
                </P>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function ProductionShowcase() {
  return (
    <section className="zephyr-section overflow-hidden bg-white">
      <div className="zephyr-container">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 1, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15, margin: "100px 0px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <H2 className="text-black">Dosage forms and finished-goods packaging</H2>
          {/* <P className="mx-auto mt-3 max-w-2xl text-gray-600">
            From dosage forms to finished packaging. Flexible manufacturing
            options ready for private label and contract scale.
          </P> */}
        </motion.div>

        <motion.div
          className="mt-8 space-y-8 md:mt-10 md:space-y-10"
          initial={{ opacity: 1, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: "100px 0px" }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <H3 className="mb-4 text-[#113227]">Dosage formats</H3>
            <MarqueeRow items={dosageFormats} direction="left" />
          </div>

          <div>
            <H3 className="mb-4 text-[#113227]">Packaging options</H3>
            <MarqueeRow items={packagingOptions} direction="right" />
          </div>
        </motion.div>

        {/* <motion.div
          className="mt-8 flex justify-center md:mt-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to="/production"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#113227] px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#0d281f] sm:w-auto"
          >
            Explore production
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div> */}
      </div>
    </section>
  );
}
