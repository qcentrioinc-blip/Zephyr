import { H2, H3, P } from "../components/Typography/Typo";
import Reveal from "../components/Reveal";

const steps = [
  {
    step: "01",
    title: "Humidity-controlled dispensing",
    body: "Accurate, contamination-aware dispensing bays for raw material intake.",
    image: "/Generated/rd-lab-bench.png",
  },
  {
    step: "02",
    title: "Wet & dry granulation",
    body: "Flexible granulation routes tuned to formula and dosage format.",
    image: "/facility/gallery-2.png",
  },
  {
    step: "03",
    title: "High-speed compression",
    body: "Tablet compression built for partner volumes and consistent quality.",
    image: "/Generated/production-compression.png",
  },
  {
    step: "04",
    title: "Film & sugar coating",
    body: "Coating capability for performance, stability and finished look.",
    image: "/facility/gallery-3.png",
  },
  {
    step: "05",
    title: "Hard-gel capsule filling",
    body: "Beadlet and powder filling into hard-gel capsules at scale.",
    image: "/packaging/capsule.webp",
  },
  {
    step: "06",
    title: "Finished packaging",
    body: "Jars, sachets, blister, bulk, bottles, Alu Alu and stick packs.",
    image: "/Generated/packaging-flatlay.png",
  },
];

export default function ManufacturingProcess() {
  return (
    <section className="zephyr-section bg-[#F7F8F2]">
      <div className="zephyr-container">
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#547A3D]">
            Manufacturing flow
          </p>
          <H2>From dispensing to finished pack</H2>
          <P className="mt-3 text-gray-600">
            Controlled process flow from dispensing through finished-goods
            packaging for private-label partners: humidity-controlled dispensing,
            granulation, compression, coating, hard-gel capsule filling, and
            flexible finished-goods packaging.
          </P>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((item, index) => (
            <Reveal key={item.step} delay={Math.min(index * 0.05, 0.25)}>
              <article className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-[0_6px_24px_rgba(17,50,39,0.04)]">
                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <span className="text-xs font-semibold tracking-[0.14em] text-[#547A3D]">
                    {item.step}
                  </span>
                  <H3 className="mt-1 mb-2 !text-[16px] md:!text-[18px] text-[#113227]">
                    {item.title}
                  </H3>
                  <P className="text-gray-600">{item.body}</P>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
