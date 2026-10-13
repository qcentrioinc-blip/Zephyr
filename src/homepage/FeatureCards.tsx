import type { FC } from "react";
import { H3, P } from "../components/Typography/Typo";
import JointPain from "./JointPain";

type FeatureCard = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  imageFit: string;
  imageWidth: string;
  wash: string;
  glow: string;
  Icon: FC<{ className?: string }>;
};

function FlaskGif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M19 6h10v10l8 18a7 7 0 0 1-6.3 10H17.3A7 7 0 0 1 11 34l8-18V6z"
        fill="none"
        stroke="#0F766E"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M17 6h14" stroke="#0F766E" strokeWidth="2.2" strokeLinecap="round" />
      <path fill="#14B8A6" opacity="0.35">
        <animate
          attributeName="d"
          dur="2.4s"
          repeatCount="indefinite"
          values="M14.5 34c2-3 5-4 9.5-4s7.5 1 9.5 4v2.5c-1.5 4-5 6.5-9.5 6.5S16 40.5 14.5 36.5V34z;M14.5 30c2-3 5-4 9.5-4s7.5 1 9.5 4v6.5c-1.5 4-5 6.5-9.5 6.5S16 40.5 14.5 36.5V30z;M14.5 34c2-3 5-4 9.5-4s7.5 1 9.5 4v2.5c-1.5 4-5 6.5-9.5 6.5S16 40.5 14.5 36.5V34z"
        />
      </path>
      <circle cx="22" cy="36" r="1.4" fill="#0F766E">
        <animate attributeName="cy" values="36;28;36" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="28" cy="34" r="1.1" fill="#0F766E">
        <animate attributeName="cy" values="34;26;34" dur="2.1s" begin="0.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.15;0.8" dur="2.1s" begin="0.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="25" cy="38" r="0.9" fill="#0F766E">
        <animate attributeName="cy" values="38;30;38" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function FactoryGif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M6 40V22l10 6V22l10 6V14h16v26H6z"
        fill="none"
        stroke="#1E3A5F"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M30 20h4M30 25h4M30 30h4" stroke="#5BA4C9" strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="14" r="2.2" fill="#D97706">
        <animate attributeName="cy" values="16;8;16" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0;0.9" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="r" values="1.5;3;1.5" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="12" r="2" fill="#D97706">
        <animate attributeName="cy" values="14;6;14" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.75;0;0.75" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="r" values="1.2;2.8;1.2" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function ShieldGif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 6l14 5v11c0 9-6.2 15.6-14 18-7.8-2.4-14-9-14-18V11l14-5z"
        fill="none"
        stroke="#166534"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 24.5l5 5 10-11"
        fill="none"
        stroke="#16A34A"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="28"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="28;0;0;28"
          keyTimes="0;0.35;0.75;1"
          dur="2.6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;1;1;0.3"
          keyTimes="0;0.35;0.75;1"
          dur="2.6s"
          repeatCount="indefinite"
        />
      </path>
      <circle cx="24" cy="24" r="3" fill="#22C55E" opacity="0.12">
        <animate attributeName="r" values="2;7;2" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="2.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "CUSTOM FORMULATION",
    description:
      "From concept to commercial scale, Vitalcore develops herbaceuticals, nutraceuticals, and organic specialty tablets for US private-label and contract partners.",
    image: "/homepage/card-formulation.webp?v=1",
    imageAlt: "Green leaves beside a bowl of botanical powder",
    imagePosition: "right center",
    imageFit: "object-cover",
    imageWidth: "w-[48%]",
    wash: "linear-gradient(100deg, #f4fbf6 0%, #eef6ea 55%, #e4f0e2 100%)",
    glow: "rgba(17,187,138,0.38)",
    Icon: FlaskGif,
  },
  {
    title: "LICENSED FACILITY",
    description:
      "Humidity-controlled dispensing, granulation, compression, coating, and capsule filling under GMP and ISO quality systems.",
    image: "/homepage/card-facility.webp?v=1",
    imageAlt: "Green and white capsules on a production line",
    imagePosition: "right center",
    imageFit: "object-cover",
    imageWidth: "w-[48%]",
    wash: "linear-gradient(100deg, #f4f8fc 0%, #e7eef6 55%, #d5e2ee 100%)",
    glow: "rgba(59,130,196,0.38)",
    Icon: FactoryGif,
  },
  {
    title: "QA / QC SYSTEMS",
    description:
      "End-to-end raw material, in-process, and finished-product testing under GMP and ISO protocols by an experienced QA/QC team.",
    image: "/homepage/card-qaqc.webp?v=1",
    imageAlt: "A gloved hand holding a green and white capsule",
    imagePosition: "right center",
    imageFit: "object-cover",
    imageWidth: "w-[48%]",
    wash: "linear-gradient(100deg, #fffaf3 0%, #f6f4ef 55%, #ece8e2 100%)",
    glow: "rgba(212,160,23,0.4)",
    Icon: ShieldGif,
  },
];

export default function FeaturesSection() {
  return (
    <section className="zephyr-section">
      <div className="zephyr-container">
        <JointPain />
        <div className="grid grid-cols-1 gap-4 md:flex md:snap-x md:snap-mandatory md:gap-5 md:overflow-x-auto md:overscroll-x-contain lg:grid lg:grid-cols-3 lg:overflow-visible">
          {FEATURE_CARDS.map((card) => {
            const { Icon } = card;
            return (
              <article
                key={card.title}
                className="group relative flex min-h-[15.5rem] flex-col overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-1 sm:p-6 md:w-[min(26rem,82%)] md:shrink-0 md:snap-start lg:w-auto"
                style={{
                  background: card.wash,
                  boxShadow: `0 0 0 1px ${card.glow}`,
                }}
              >
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className={`pointer-events-none absolute right-0 top-0 h-full ${card.imageWidth} ${card.imageFit}`}
                  style={{
                    objectFit: card.imageFit === "object-contain" ? "contain" : "cover",
                    objectPosition: card.imagePosition,
                    transform: "translateX(18px)",
                    maskImage:
                      "linear-gradient(90deg, transparent 0%, #000 18%)",
                    WebkitMaskImage:
                      "linear-gradient(90deg, transparent 0%, #000 18%)",
                  }}
                />
                <div className="relative z-10 flex max-w-[78%] flex-col">
                  <div className="mb-3 flex items-center gap-3">
                    <Icon className="h-10 w-10 shrink-0" />
                    <H3 className="uppercase leading-[1.15] text-[#111111]">
                      {card.title}
                    </H3>
                  </div>
                  <P className="max-w-[88%] text-gray-700">{card.description}</P>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
