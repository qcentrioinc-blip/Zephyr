import {
  FlaskConical,
  Users,
  Thermometer,
  PackageCheck,
  Microscope,
  BadgeCheck,
  Factory,
  Palette,
  Scale,
} from "lucide-react";
import { H2, H3, P } from "../Global/Typography/Typo";
import Reveal from "../Global/Reveal";

const intro =
  "Zephyr works closely with customers to move concepts to commercial manufacturing. We start with market-led concept formulas, run pilot trials, complete validation work, and transfer programs into full-scale production.";

const capabilities = [
  { title: "Pilot facility & labs", detail: "Fully equipped small-scale pilot facility and development laboratories.", icon: FlaskConical },
  { title: "Development technicians", detail: "Experienced development technicians guiding every brief.", icon: Users },
  { title: "Stability testing", detail: "In-house stability programs before commercial transfer.", icon: Thermometer },
  { title: "Pre-production samples", detail: "Sample creation for partner review before scale up.", icon: PackageCheck },
  { title: "Analytical methods", detail: "Method development aligned to product and market needs.", icon: Microscope },
  { title: "Validation support", detail: "Support across process, packaging, and quality systems.", icon: BadgeCheck },
  { title: "Scale up transfer", detail: "Development-led transfer into manufacturing.", icon: Factory },
  { title: "Artwork & packaging", detail: "Artwork and finished goods packaging support.", icon: Palette },
  { title: "Regulatory team", detail: "Dedicated regulatory specialists for partner documentation.", icon: Scale },
];

export default function DevelopWithYou() {
  return (
    <section className="zephyr-section bg-white">
      <div className="zephyr-container">
        <Reveal className="mx-auto mb-8 max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#547A3D]">
            Partner development
          </p>
          <H2>Development-to-manufacturing transfer</H2>
          <P className="mt-3 text-gray-600">{intro}</P>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="flex gap-3 rounded-2xl border border-gray-200 bg-[#F7F8F2] p-4 transition-colors hover:border-[#113227]/25 hover:bg-white"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#113227] shadow-sm">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-0.5 flex items-baseline gap-2">
                      <span className="text-[10px] font-semibold tracking-wide text-[#547A3D]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <H3 className="!text-[14px] md:!text-[16px]">{item.title}</H3>
                    </div>
                    <P className="text-gray-600 !text-[11px] md:!text-[12px]">{item.detail}</P>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
