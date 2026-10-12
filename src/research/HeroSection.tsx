import React from "react";
import { H1, H3, P } from "../components/Typography/Typo";
import Reveal from "../components/Reveal";

interface ProjectCard {
  id: number;
  title: string;
  description: string;
}

const HeroSection: React.FC = () => {
  const projects: ProjectCard[] = [
    {
      id: 1,
      title: "Pilot labs",
      description:
        "Fully equipped small-scale pilot facility for development trials",
    },
    {
      id: 2,
      title: "Stability",
      description: "In-house stability testing before commercial transfer",
    },
    {
      id: 3,
      title: "Commercial",
      description: "Development-led transfer to full manufacturing",
    },
    {
      id: 4,
      title: "Regulatory",
      description: "Dedicated regulatory and packaging artwork support",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#e7f4ee]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_48%_42%_at_8%_12%,rgba(17,187,138,0.34),transparent_70%),radial-gradient(ellipse_40%_46%_at_94%_8%,rgba(17,50,39,0.14),transparent_68%),linear-gradient(180deg,#cfe8dc_0%,#e7f4ee_46%,#f4f8f5_78%,#ffffff_100%)]" />
        <svg
          className="absolute -left-3 top-[22.5rem] h-24 w-16 text-[#113227] sm:left-[4%] sm:top-[16%] sm:h-36 sm:w-24 lg:left-[8%] lg:top-[12%] lg:h-44 lg:w-28"
          viewBox="150 100 100 170"
          fill="none"
          aria-hidden
        >
          <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.5">
            <path d="M186 112h28" />
            <path d="M194 112v58M206 112v58" />
            <circle cx="200" cy="208" r="46" />
            <path d="M162 214c14 30 62 30 76 0" fill="#11BB8A" fillOpacity="0.3" stroke="none" />
          </g>
        </svg>
        <svg
          className="absolute right-1 top-2 h-9 w-9 text-[#113227] sm:right-[14%] sm:top-[5%] sm:h-20 sm:w-20 lg:right-[18%]"
          viewBox="290 40 96 96"
          fill="none"
          aria-hidden
        >
          <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" opacity="0.42">
            <path d="M308 70l30 18 30-18v-34l-30-18-30 18v34z" />
            <circle cx="308" cy="70" r="3" fill="currentColor" stroke="none" />
            <circle cx="338" cy="52" r="3" fill="#11BB8A" stroke="none" />
            <circle cx="368" cy="70" r="3" fill="currentColor" stroke="none" />
            <circle cx="368" cy="104" r="3" fill="currentColor" stroke="none" />
            <circle cx="338" cy="122" r="3" fill="#11BB8A" stroke="none" />
            <circle cx="308" cy="104" r="3" fill="currentColor" stroke="none" />
          </g>
        </svg>
        <svg
          className="absolute -right-2 top-[24rem] h-20 w-20 text-[#113227] sm:right-[2%] sm:top-[18%] sm:h-32 sm:w-28 lg:right-[8%] lg:top-[14%] lg:h-36 lg:w-32"
          viewBox="1076 74 120 110"
          fill="none"
          aria-hidden
        >
          <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
            <path d="M1088 86h72" />
            <path d="M1098 86l-12 84h76l-12-84" />
            <path d="M1094 138h60" />
          </g>
        </svg>
        <svg
          className="absolute left-[8%] top-[2%] hidden h-16 w-16 text-[#113227] sm:block lg:left-[20%] lg:h-20 lg:w-20"
          viewBox="1248 44 96 108"
          fill="none"
          aria-hidden
        >
          <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" opacity="0.4">
            <path d="M1260 78l34 20 34-20v-40l-34-20-34 20v40z" />
            <circle cx="1260" cy="78" r="3.5" fill="currentColor" stroke="none" />
            <circle cx="1294" cy="58" r="3.5" fill="#11BB8A" stroke="none" />
            <circle cx="1328" cy="78" r="3.5" fill="currentColor" stroke="none" />
            <circle cx="1328" cy="118" r="3.5" fill="currentColor" stroke="none" />
            <circle cx="1294" cy="138" r="3.5" fill="#11BB8A" stroke="none" />
            <circle cx="1260" cy="118" r="3.5" fill="currentColor" stroke="none" />
          </g>
        </svg>
        <div className="absolute left-[6%] top-[42%] h-2 w-2 rounded-full bg-[#11BB8A]/70 sm:left-[10%] sm:top-[36%]" />
        <div className="absolute right-[8%] top-[48%] h-2.5 w-2.5 rounded-full bg-[#11BB8A]/60 sm:right-[12%] sm:top-[40%]" />
      </div>
      <div className="relative z-10 zephyr-container pt-10 pb-0 sm:pt-12 xl:pt-10">
        <Reveal className="mx-auto mb-8 max-w-4xl text-center sm:mb-10 lg:mb-12">
          <H1 className="mb-4 sm:mb-5">R&D and New Product Development</H1>
          <P className="mx-auto max-w-2xl">
            Vitalcore works closely with customers to develop commercial-ready
            formulations, from market-led concept formulas to pilot trials,
            validation, and full-scale manufacturing transfer.
          </P>
        </Reveal>
      </div>

      <div className="relative w-full">
        <div className="w-full">
          <div className="zephyr-container overflow-hidden">
            <img
              src="/facility/research-hero.webp"
              alt="Vitalcore research and development laboratory"
              className="h-[160px] w-full rounded-t-3xl object-cover sm:h-[200px] sm:rounded-t-4xl md:h-[240px] lg:h-[280px]"
            />
          </div>
        </div>

        <div className="relative z-20 -mt-10 flex justify-center sm:-mt-12 lg:-mt-14">
          <div className="zephyr-container">
            <div className="mx-auto w-full max-w-6xl">
              <div className="rounded-2xl border-2 border-[#B0A8A8] bg-white p-5 shadow-lg sm:rounded-4xl sm:p-7 lg:p-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
                  {projects.map((project) => (
                    <div key={project.id} className="flex flex-col">
                      <H3 className="mb-2 sm:mb-3">{project.title}</H3>
                      <P className="border-t border-gray-400 pt-3 sm:pt-4">
                        {project.description}
                      </P>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
