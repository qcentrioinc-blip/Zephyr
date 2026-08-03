// import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import { ArrowRight } from "lucide-react";
import { H2, H3, P } from "../Global/Typography/Typo";

type ShowcaseItem = {
  name: string;
  image: string;
};

const dosageFormats: ShowcaseItem[] = [
  { name: "Tablets", image: "/Homepage/production/branded/tablet.png" },
  { name: "Capsules", image: "/Homepage/production/branded/capsule.png" },
  { name: "Sachets", image: "/Homepage/production/branded/sachet.png" },
  { name: "Powders", image: "/Homepage/production/branded/powder.png" },
  { name: "Gummies", image: "/Homepage/production/branded/gummy.png" },
  { name: "Jelly", image: "/Homepage/production/branded/jelly.png" },
];

const packagingOptions: ShowcaseItem[] = [
  { name: "Jars", image: "/Homepage/production/branded/jar.png" },
  { name: "Sachets", image: "/Homepage/production/branded/pack-sachet.png" },
  { name: "Blister", image: "/Homepage/production/branded/blister.png" },
  { name: "Bulk Packs", image: "/Homepage/production/branded/bulk.png" },
  { name: "Bottle Packs", image: "/Homepage/production/branded/bottle.png" },
  { name: "Alu Alu", image: "/Homepage/production/branded/alu-alu.png" },
  { name: "Stick Packs", image: "/Homepage/production/branded/stick-pack.png" },
];

function MarqueeRow({
  items,
  direction,
}: {
  items: ShowcaseItem[];
  direction: "left" | "right";
}) {
  const loop = [...items, ...items];
  const animClass =
    direction === "left" ? "zephyr-marquee-left" : "zephyr-marquee-right";

  return (
    <div className="zephyr-marquee-pause relative overflow-hidden">
      <div
        className={`flex w-max gap-3 sm:gap-4 ${animClass}`}
        style={{ willChange: "transform" }}
      >
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
                <P className="!text-[12px] font-semibold tracking-wide text-[#113227] sm:!text-[13px]">
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
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <H2 className="text-black">Formats built for brand partners</H2>
          {/* <P className="mx-auto mt-3 max-w-2xl text-gray-600">
            From dosage forms to finished packaging. Flexible manufacturing
            options ready for private label and contract scale.
          </P> */}
        </motion.div>

        <motion.div
          className="mt-8 space-y-8 md:mt-10 md:space-y-10"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
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
