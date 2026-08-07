import { Globe2, Store, Truck } from "lucide-react";
import { H2, H3, P } from "../Global/Typography/Typo";
import Reveal from "../Global/Reveal";

interface TimelineEntry {
  step: string;
  title: string;
  description: string;
}

const galleryImages = [
  {
    id: 1,
    src: "/Research/Research1.png",
    alt: "Partner brand development environment",
  },
  {
    id: 2,
    src: "/Gallery/Gallery2.png",
    alt: "High-speed manufacturing equipment",
  },
  {
    id: 3,
    src: "/Gallery/Gallery5.png",
    alt: "Quality-controlled production workspace",
  },
];

const timelineData: TimelineEntry[] = [
  {
    step: "01",
    title: "Private label brief",
    description:
      "Share your target market, dosage format, and pack goals. We turn the brief into a manufacturable plan.",
  },
  {
    step: "02",
    title: "Pilot & process lock",
    description:
      "Pilot development, refinement, and production trials establish process, quality, and packaging specifications.",
  },
  {
    step: "03",
    title: "Quality release systems",
    description:
      "Stability support, analytical methods, and validation keep every batch ready for partner audits and market release.",
  },
  {
    step: "04",
    title: "Scale across channels",
    description:
      "Transfer to full-scale manufacturing with artwork support so partners can grow from boutique retail to multi-market distribution.",
  },
];

const highlights = [
  {
    icon: Store,
    title: "Retail packs",
    body: "Jars, sachets, blister, bottles, Alu Alu, and stick packs for shelf launch.",
  },
  {
    icon: Truck,
    title: "Contract volume",
    body: "Monthly capacity of 5B tablets, 100M capsules, 60M sachets, and 1M jars.",
  },
  {
    icon: Globe2,
    title: "Global partner footprint",
    body: "India manufacturing with commercial presence supporting Spain and USA partners.",
  },
];

const Timeline = () => {
  return (
    <section className="zephyr-section bg-white">
      <div className="zephyr-container">
        <Reveal className="mb-10 grid gap-4 sm:mb-14 sm:grid-cols-3">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-[24px] bg-gray-100"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="aspect-[4/3] h-full w-full object-cover transition duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </Reveal>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <Reveal>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#547A3D]">
              Scale path
            </p>
            <H2>From first retail SKU to broader distribution</H2>
            <P className="mt-5 text-gray-600 leading-relaxed">
              Zephyr helps brand owners move beyond a single SKU launch. Flexible
              dosage formats, finished goods packaging, and GMP quality systems
              help private label lines expand across retailers, chains, and
              international markets with one manufacturing partner.
            </P>

            <div className="mt-8 space-y-4">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-gray-200 bg-[#F7F8F2] p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#113227]">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <H3 className="!text-[16px] md:!text-[18px]">
                        {item.title}
                      </H3>
                      <P className="mt-1 text-gray-600">{item.body}</P>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <ol className="relative space-y-5">
            <div
              className="pointer-events-none absolute bottom-8 left-[27px] top-8 w-px bg-[#113227]/15"
              aria-hidden="true"
            />
            {timelineData.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.06}>
                <li className="relative z-10 flex gap-5 rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_6px_24px_rgba(17,50,39,0.04)]">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#113227] text-sm font-semibold text-white">
                    {item.step}
                  </span>
                  <div>
                    <H3 className="mb-2 text-[#113227]">{item.title}</H3>
                    <P className="text-gray-600">{item.description}</P>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
