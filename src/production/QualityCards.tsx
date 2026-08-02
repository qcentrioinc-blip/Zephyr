import { motion } from "framer-motion";
import { ShieldCheck, FlaskConical } from "lucide-react";
import { H3, P } from "../Global/Typography/Typo";
import Reveal from "../Global/Reveal";

const cards = [
  {
    title: "Quality Assurance",
    icon: ShieldCheck,
    accent: "#113227",
    soft: "#EDFAEB",
    body: "End-to-end testing of the raw material, in-process and finished products is carried out during each step by our highly trained quality team which ensures zero contamination. We also follow G.M.P. and ISO protocols. Well qualified, having decades of experience in the field of quality managements, cGMP compliance, audit managements and validation managements. Our QUALITY ASSURANCE team ensures products are manufactured as per GMP regulations and good quality products are released to the market.",
  },
  {
    title: "Quality Control",
    icon: FlaskConical,
    accent: "#247D7D",
    soft: "#edf6fb",
    body: "Our quality team, working together with our experienced production team, are committed to ensuring that we supply you with products of the highest quality. We have a dedicated quality department with excellent in-house laboratory facilities and experienced people comprising analytical chemists and qualified persons. This combination of fully equipped laboratory facilities together with our comprehensive quality systems and experienced teams enable us to provide you with everything you need to ensure the quality of your products. Your products are in safe hands with us.",
  },
];

export default function QualityCards() {
  return (
    <section className="zephyr-section bg-white">
      <div className="zephyr-container">
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <H3 className="text-[#113227]">Quality that partners can audit</H3>
          <P className="mt-3 text-gray-600">
            Dedicated QA and QC systems from raw material intake through finished
            goods release. Built for private label and contract manufacturing
            partners.
          </P>
        </Reveal>

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={index * 0.08} className="h-full">
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgba(17,50,39,0.06)] sm:p-8"
                >
                  <div
                    className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: card.soft, color: card.accent }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <H3 className="mb-3" style={{ color: card.accent }}>
                    {card.title}
                  </H3>
                  <P className="flex-1 text-gray-600 leading-relaxed">
                    {card.body}
                  </P>
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                    style={{ backgroundColor: card.soft }}
                  />
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
