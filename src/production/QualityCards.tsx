import { motion } from "framer-motion";
import { ShieldCheck, FlaskConical } from "lucide-react";
import { H3, P } from "../components/Typography/Typo";
import Reveal from "../components/Reveal";

const cards = [
  {
    title: "Quality Assurance",
    icon: ShieldCheck,
    accent: "#113227",
    soft: "#EDFAEB",
    body: "QA covers raw-material, in-process, and finished-goods testing under GMP and ISO protocols, with cGMP compliance, audit support, and validation. Experienced quality managers oversee release so products are manufactured to agreed specifications before commercial shipment.",
  },
  {
    title: "Quality Control",
    icon: FlaskConical,
    accent: "#247D7D",
    soft: "#edf6fb",
    body: "In-house QC labs with analytical chemists and qualified personnel support batch release documentation your partners can take to audit. Production and quality teams work together so finished goods meet agreed specs for private-label and contract programs.",
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
