import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { P } from "../components/Typography/Typo";
import Reveal from "../components/Reveal";

const content = {
  description:
    "Zephyr manufactures to GMP and ISO quality standards for US dietary supplement brands. We offer vitamin, mineral, and specialty formulations across multiple dosage forms, with documentation focused on safety, batch consistency, and finished-goods performance.",
  buttonText: "Explore R&D",
};

export default function Showreel() {
  return (
    <section className="zephyr-section bg-white">
      <div className="zephyr-container">
        <Reveal>
          <div className="overflow-hidden rounded-[10px]">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative min-h-[220px] md:min-h-[380px]">
                <img
                  src="/Generated/showreel-formulation.webp?v=2"
                  alt="A technician weighing formulation powder beside capsules and softgels"
                  width={906}
                  height={523}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <div className="relative flex min-h-[280px] flex-col justify-center overflow-hidden bg-[#f4f7f2] px-5 py-8 sm:px-8 md:min-h-[380px] md:px-10 lg:px-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#e5efe4]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-72 rounded-full bg-[#eef4ec]"
                />
                <img
                  src="/Generated/showreel-corner.webp"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 right-0 z-0 w-[34%] max-w-[128px] object-contain object-right-bottom sm:max-w-[148px] lg:w-[44%] lg:max-w-[230px]"
                />

                <div className="relative z-10 max-w-xl lg:pr-28">
                  <h2 className="font-manrope font-semibold zephyr-type-h2 text-[#16342a]">
                    Formulation depth.
                    <br />
                    Audit-ready quality systems.
                  </h2>
                  <div
                    aria-hidden="true"
                    className="mt-4 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#1c8f86] via-[#7c9a45] to-[#e0a24a] sm:w-28"
                  />
                  <P className="mt-5 max-w-lg text-[#3e4a44]">{content.description}</P>
                  <div className="mt-6">
                    <Link
                      to="/research"
                      className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#113227] px-5 py-2.5 font-para font-normal zephyr-type-btn text-white shadow-sm transition-all duration-300 hover:gap-3 hover:shadow-lg"
                    >
                      {content.buttonText}
                      <ArrowRight
                        size={16}
                        className="shrink-0 transition-transform duration-300 group-hover:translate-x-1.5"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
