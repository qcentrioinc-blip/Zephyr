import { Link } from "react-router-dom";
import { ArrowRight, Building2, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { H2, H3, P } from "../Global/Typography/Typo";
import Reveal from "../Global/Reveal";

const advantages = [
  {
    icon: Building2,
    title: "65K sq ft facility",
    body: "Production facility and laboratories built for partner manufacturing programs.",
  },
  {
    icon: Gauge,
    title: "Capacity at scale",
    body: "5 billion tablets, 100 million capsules, 60 million sachets, and 1 million jars per month.",
  },
  {
    icon: ShieldCheck,
    title: "cGMP & ISO systems",
    body: "End-to-end QA/QC with cGMP compliance, audit support, and validation coverage.",
  },
  {
    icon: Sparkles,
    title: "Private label flexibility",
    body: "Nutraceutical, herbaceutical, and organic ranges with dosage and pack options for US brand launch.",
  },
];

export default function PartnerAdvantage() {
  return (
    <section className="zephyr-section bg-white">
      <div className="zephyr-container">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#547A3D]">
              Partner advantage
            </p>
            <H2>Built for brands that need reliable scale</H2>
            <P className="mt-4 max-w-xl text-gray-600">
              Zephyr combines high capacity manufacturing with development-led
              transfer and quality systems US brand owners can take to audit.
              Private label and contract partners move from brief to finished
              goods with a clear path.
            </P>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {advantages.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-gray-200 bg-[#F7F8F2] p-4"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#113227]">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <H3 className="mb-1 !text-[15px] md:!text-[17px]">{item.title}</H3>
                    <P className="text-gray-600">{item.body}</P>
                  </div>
                );
              })}
            </div>

            <Link
              to="/contact"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#113227] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d281f]"
            >
              Enquire / MOQ
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-[28px]">
              <img
                src="/Production/production-hero-wide.png"
                alt="Zephyr manufacturing facility"
                className="aspect-[4/5] h-full w-full object-cover sm:aspect-[5/6]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
