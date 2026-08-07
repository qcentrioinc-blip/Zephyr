import { H2, H3, P } from "../Global/Typography/Typo";
import Reveal from "../Global/Reveal";

const pillars = [
  {
    title: "Concept to pilot",
    body: "Market-led concept formulas, supplier assessment, and lab refinement before you commit to a commercial batch.",
    image: "/Research/Research1.png",
  },
  {
    title: "Validate with confidence",
    body: "In-house stability testing, analytical method development, and validation support help keep partner dossiers complete.",
    image: "/Research/ResearchStats.png",
  },
  {
    title: "Clear manufacturing transfer",
    body: "Development-led scale up, artwork support, and a dedicated regulatory team finalize product, process, and pack specs.",
    image: "/Gallery/Gallery5.png",
  },
];

export default function RdNarrative() {
  return (
    <section className="zephyr-section bg-white">
      <div className="zephyr-container">
        <Reveal className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#547A3D]">
            Research & development
          </p>
          <H2>From formulation brief to commercial dossier</H2>
          <P className="mt-4 text-gray-600">
            Zephyr product development labs connect market insight, pilot
            science, and manufacturing transfer so US brand partners can move
            from idea to finished specification with clarity.
          </P>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <article className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_8px_28px_rgba(17,50,39,0.05)]">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <H3 className="mb-2 text-[#113227]">{item.title}</H3>
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
