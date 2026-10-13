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
          <video
  src="/videos/research-hero.mp4"
  autoPlay
  muted
  playsInline
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
