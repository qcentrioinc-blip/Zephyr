import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { H3, P } from "../Global/Typography/Typo";

const content = {
  title: "PREMIUM FORMULATIONS, EXCEPTIONAL STANDARDS",
  description:
    "Operating to the highest quality and manufacturing standards, Biofern offers one of the industry's broadest ranges of vitamin, mineral, and dietary supplement formulations across a wide variety of product formats. Our commitment to innovation, precision, and excellence ensures every product is developed to deliver superior quality, safety, and effectiveness for diverse health and wellness needs.",
  buttonText: "VIEW",
};

export default function Showreel() {
  return (
    <section className="zephyr-section bg-white">
      <div className="zephyr-container">
        <div className="overflow-hidden rounded-[10px]">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative min-h-[220px] md:min-h-[340px]">
              <img
                src="/Research.png"
                alt="Zephyr research and development"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent" />
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
      </div>
    </section>
  );
}
