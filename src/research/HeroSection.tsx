import React from 'react';
import { H1, H3, P } from '../Global/Typography/Typo';

interface ProjectCard {
  id: number;
  title: string;
  description: string;
}

const HeroSection: React.FC = () => {
  const projects: ProjectCard[] = [
    {
      id: 1,
      title: 'Pilot labs',
      description: 'Fully equipped small-scale pilot facility for development trials',
    },
    {
      id: 2,
      title: 'Stability',
      description: 'In-house stability testing before commercial transfer',
    },
    {
      id: 3,
      title: 'Scale-up',
      description: 'Development-led transfer to full manufacturing',
    },
    {
      id: 4,
      title: 'Regulatory',
      description: 'Dedicated regulatory and packaging artwork support',
    },
  ];

  return (
    <section className="relative w-full ">
      {/* Top Content Area - Heading and Description */}
      <div className="zephyr-container pt-28 pb-0 xl:pt-24">
        <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-16 lg:mb-20">
          <H1 className="mb-4 sm:mb-6 ">
            R&D and New Product Development
          </H1>
          <P className="max-w-2xl mx-auto">
            Zephyr works closely with customers to develop successful products — from trend-led concept formulations to pilot trials, validation and full-scale manufacturing transfer.
          </P>
        </div>
      </div>

      {/* Image Container with Floating Cards */}
      <div className="relative w-full ">
        {/* Hero Image */}
        <div className="w-full pt-8 ">
          <div className="zephyr-container h-96 overflow-hidden pt-20 sm:h-[200px] lg:h-[300px] xl:h-full">
            <img
              src="/Research.png"
              alt="Project showcase"
              className="w-full h-full object-cover rounded-t-3xl sm:rounded-t-4xl"
            />
          </div>

      
        </div>

        {/* Cards Grid - Floating over image */}
        <div className="absolute top-0 left-0 right-0 z-20 flex -translate-y-10 justify-center">
          <div className="zephyr-container">
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-4xl p-6 sm:p-8 lg:p-10 shadow-lg border-2 border-[#B0A8A8]">
              {/* Grid with responsive columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {projects.map((project) => (
                  <div key={project.id} className="flex flex-col">
                    <H3 className=" mb-2 sm:mb-3">
                      {project.title}
                    </H3>
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
