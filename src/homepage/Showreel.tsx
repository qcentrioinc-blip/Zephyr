import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { H3, P } from "../components/Typography/Typo";
import Reveal from "../components/Reveal";

const content = {
  title: "Formulation depth. Audit-ready quality systems.",
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
              <div className="relative min-h-[220px] md:min-h-[340px]">
                <img
                  src="/Generated/showreel-formulation.webp"
                  alt="Zephyr formulation laboratory"
                  width={800}
                  height={600}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <div className="flex min-h-[220px] flex-col justify-center bg-[#F7F8F2] px-5 py-6 sm:px-7 md:min-h-[340px] md:px-8 lg:px-10">
                <H3>{content.title}</H3>
                <P className="mt-6 max-w-lg">{content.description}</P>
                <div className="mt-6">
                  <Link
                    to="/research"
                    className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#113227] px-5 py-2 text-[14px] font-para font-normal leading-[140%] text-white shadow-sm transition-all duration-300 hover:gap-3 hover:shadow-lg md:text-[16px]"
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
        </Reveal>
      </div>
    </section>
  );
}
