import React, { useState } from 'react';
import { H2, H3, P } from '../Global/Typography/Typo';

interface StatCard {
  number: string;
  description: string;
}

interface CircleData {
  id: number;
  text: string;
  position: string;
}

const Stats: React.FC = () => {
  const [hoveredCircle, setHoveredCircle] = useState<number | null>(null);

  const statCards: StatCard[] = [
    {
      number: '9',
      description:
        'Core R&D capability pillars — from pilot labs and stability testing to regulatory and artwork support.',
    },
    {
      number: '65K',
      description:
        'Square feet of production and laboratory infrastructure supporting partner product development.',
    },
  ];

  const circleData: CircleData[] = [
    { id: 1, text: 'FORMULATE • PILOT • VALIDATE • SCALE • PARTNER • ZEPHYR', position: 'top' },
    { id: 2, text: 'NUTRACEUTICAL • HERBACEUTICAL • ORGANIC • CUSTOM', position: 'bottom-left' },
    { id: 3, text: 'QUALITY • GMP • ISO • STABILITY • REGULATORY', position: 'bottom-right' },
  ];

  const CircleWithText: React.FC<{ data: CircleData }> = ({ data }) => {
    const isHovered = hoveredCircle === data.id;
    const ref = React.useRef<HTMLDivElement | null>(null);

    const handleMove = (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // consider the interactive radius slightly smaller than half width
      const radius = Math.min(rect.width, rect.height) / 2 * 0.9;
      if (distance <= radius) {
        setHoveredCircle(data.id);
      } else {
        setHoveredCircle(null);
      }
    };

    const handleLeave = () => setHoveredCircle(null);

    return (
      <div
        ref={ref}
        className="relative w-48 h-48    sm:w-56 sm:h-56 lg:w-72 lg:h-72 transition-transform duration-500"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{
            filter: isHovered ? 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1))' : 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))',
            transition: 'filter 0.3s ease',
          }}
        >
          {/* Circle border */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="white"
            stroke="#333"
            strokeWidth="1"
          />

          {/* Rotating text path - Inner circumference */}
          <defs>
            <path
              id={`textPath-${data.id}`}
              d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
              fill="white"
            />
            <style>{`
              @keyframes rotate-${data.id} {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
              
              .circle-${data.id} {
                animation: ${isHovered ? `rotate-${data.id}` : 'none'} 8s linear infinite;
                transform-origin: 100px 100px;
              }
            `}</style>
          </defs>

          {/* Animated text */}
          <text
            className={`circle-${data.id}`}
            fontSize="12"
            fill="#333"
            letterSpacing="4"
            style={{
              animation: isHovered ? `rotate-${data.id} 8s linear infinite` : 'none',
              transformOrigin: '100px 100px',
            }}
          >
            <textPath href={`#textPath-${data.id}`} startOffset="0%">
              {data.text}
            </textPath>
          </text>

          {/* Center heart */}
          <g>
            <path
              d="M100,130 C85,110 70,105 70,95 C70,85 78,80 85,80 C92,80 100,88 100,88 C100,88 108,80 115,80 C122,80 130,85 130,95 C130,105 115,110 100,130 Z"
              fill="#000"
            />
          </g>
        </svg>
      </div>
    );
  };

  return (
    <section className="zephyr-section bg-white">
      <div className="zephyr-container">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 items-center">
          {/* Left Side - Stats & Content */}
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-blue-100 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <H3 className="mb-2">
                    {stat.number}
                  </H3>
                  <P className="">
                    {stat.description}
                  </P>
                </div>
              ))}
            </div>

            {/* Content Section */}
            <div className="  bg-[#F4F4F4] rounded-3xl   p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300">
              <H2 className="">
                Title
              </H2>
              <div className="flex flex-col  sm:flex-row gap-6 items-center">
                <P className="flex-1">
                 Lorem ipsum dolor amet, consectetur adipiscing elit. Faucibus in libero. Lorem ipsum dolor amet, consectetur adipiscing elit. Lorem ipsum dolor amet. Lorem ipsum dolor amet.
                </P>
                <div className="w-full sm:w-40 lg:w-48 flex-shrink-0">
                  <img
                    src="/Research/ResearchStats.png"
                    alt="Content showcase"
                    className="w-full h-auto object-contain shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Animated Circles */}
          <div className="flex justify-center items-center">
            <div className="relative w-96 h-96 sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[500px]">
              {/* Top Circle */}
              <div className="absolute    bottom-10    md:bottom-0 left-1/2 transform   -translate-x-1/2 z-40">
                <CircleWithText data={circleData[0]} />
              </div>

              {/* Bottom Left Circle */}
              <div className="absolute  top-0  -left-2 md:left-0 z-20">
                <CircleWithText data={circleData[1]} />
              </div>

              {/* Bottom Right Circle */}
              <div className="absolute top-0  -right-2 md:right-10 z-10">
                <CircleWithText data={circleData[2]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
