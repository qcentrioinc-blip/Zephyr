import { useEffect, useRef } from "react";
import { H1, H3, P } from "../components/Typography/Typo";
import Reveal from "../components/Reveal";
import { retryPlay } from "@/lib/play-video";

interface ProjectCard {
  id: number;
  title: string;
  description: string;
}

const PROJECTS: ProjectCard[] = [
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

function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
      {PROJECTS.map((project) => (
        <div key={project.id} className="flex flex-col">
          <H3 className="mb-2 sm:mb-2.5 font-manrope font-semibold !text-[#0f3429]">
            {project.title}
          </H3>
          <P className="pt-2.5 sm:pt-3 text-[14px] leading-relaxed sm:text-[15px] border-t border-[#11BB8A]/45 text-[#244238]">
            {project.description}
          </P>
        </div>
      ))}
    </div>
  );
}

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.setAttribute("webkit-playsinline", "true");
    return retryPlay(video);
  }, []);

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

      <div className="relative z-10 zephyr-container pb-8 sm:pb-10">
        <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl shadow-xl">
          <div className="relative aspect-video w-full max-h-[min(56vw,70dvh)]">
            <video
              ref={videoRef}
              src="/videos/research-hero.mp4"
              poster="/facility/research-hero.webp"
              muted
              playsInline
              preload="metadata"
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Soft lighting gradient from top so the light glass container stands out cleanly */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 hidden h-[48%] bg-gradient-to-b from-black/25 via-black/10 to-transparent md:block"
              aria-hidden
            />
          </div>

          {/* Desktop/Tablet: Crisp white container */}
          <div className="absolute inset-x-0 top-0 z-10 hidden p-4 sm:p-6 lg:p-7 md:block">
            <div className="rounded-2xl border border-white/90 bg-white/95 p-5 backdrop-blur-md shadow-[0_8px_30px_rgba(15,52,41,0.08)] sm:rounded-3xl sm:p-6 lg:p-7">
              <ProjectGrid />
            </div>
          </div>
        </div>

        {/* Mobile: Matching white card */}
        <div className="mt-4 rounded-2xl border border-white/90 bg-white/95 p-5 backdrop-blur-md shadow-md sm:rounded-3xl sm:p-7 md:hidden">
          <ProjectGrid />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
