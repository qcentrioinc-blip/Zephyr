import React from 'react';
import { H2, P } from '../Global/Typography/Typo';

interface TimelineEntry {
  year: string;
  description: string;
  fullDescription?: string;
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const Timeline: React.FC = () => {
  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      src: '/Research/Research1.png',
      alt: 'Laboratory research',
    },
    {
      id: 2,
      src: '/Gallery/Gallery2.png',
      alt: 'Production equipment',
    },
    {
      id: 3,
      src: '/Gallery/Gallery5.png',
      alt: 'Manufacturing environment',
    },
  ];

  const timelineData: TimelineEntry[] = [
    {
      year: '01',
      description: 'Trend & market analysis with concept formulations.',
    },
    {
      year: '02',
      description: 'Pilot development, refinement and production trials.',
      fullDescription: 'In-house product development laboratories refine, pilot and trial formulations before scale-up.',
    },
    {
      year: '03',
      description: 'Stability testing, analytical methods & validation.',
      fullDescription: 'Pre-production samples, analytical method development and validation support.',
    },
    {
      year: '04',
      description: 'Scale-up manufacturing with packaging & regulatory.',
      fullDescription: 'Transfer to full-scale production with artwork packaging expertise and a dedicated regulatory team.',
    },
  ];

  return (
    <section className="zephyr-section bg-white">
      <div className="zephyr-container">
        {/* Image Gallery */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-square sm:aspect-auto sm:h-64 lg:h-full group"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <H2 className=" mb-4 sm:mb-6">
            From a retail store to the global chain of stores
          </H2>
          <P className=" max-w-full">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </P>
        </div>

        {/* Timeline Data / Text Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-8 sm:gap-y-10">
          {timelineData.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl sm:text-2xl font-semibold text-black">
                  {item.year}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-black ml-1 sm:ml-2 mr-3 sm:mr-4">
                  :
                </span>
              </div>
              <div className="flex-1 pt-1">
                <P className="">
                  {item.description}
                </P>
                {item.fullDescription && (
                  <P className=" mt-1">
                    {item.fullDescription}
                  </  P>
                )}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Timeline;
