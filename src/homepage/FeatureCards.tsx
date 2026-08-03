import type { FC } from "react";
import { H3, P } from "../Global/Typography/Typo";

type FeatureCard = {
  title: string;
  description: string;
  Icon: FC<{ className?: string }>;
};

function FlaskGif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M19 6h10v10l8 18a7 7 0 0 1-6.3 10H17.3A7 7 0 0 1 11 34l8-18V6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M17 6h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path fill="currentColor" opacity="0.35">
        <animate
          attributeName="d"
          dur="2.4s"
          repeatCount="indefinite"
          values="M14.5 34c2-3 5-4 9.5-4s7.5 1 9.5 4v2.5c-1.5 4-5 6.5-9.5 6.5S16 40.5 14.5 36.5V34z;M14.5 30c2-3 5-4 9.5-4s7.5 1 9.5 4v6.5c-1.5 4-5 6.5-9.5 6.5S16 40.5 14.5 36.5V30z;M14.5 34c2-3 5-4 9.5-4s7.5 1 9.5 4v2.5c-1.5 4-5 6.5-9.5 6.5S16 40.5 14.5 36.5V34z"
        />
      </path>
      <circle cx="22" cy="36" r="1.4" fill="currentColor">
        <animate attributeName="cy" values="36;28;36" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="28" cy="34" r="1.1" fill="currentColor">
        <animate attributeName="cy" values="34;26;34" dur="2.1s" begin="0.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.15;0.8" dur="2.1s" begin="0.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="25" cy="38" r="0.9" fill="currentColor">
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
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M30 20h4M30 25h4M30 30h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="14" r="2.2" fill="currentColor" opacity="0.25">
        <animate attributeName="cy" values="16;8;16" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0;0.35" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="r" values="1.5;3;1.5" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="12" r="2" fill="currentColor" opacity="0.2">
        <animate attributeName="cy" values="14;6;14" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="r" values="1.2;2.8;1.2" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
        <animate
          attributeName="d"
          dur="1.4s"
          repeatCount="indefinite"
          values="M10 40h4M18 40h4M26 40h4;M14 40h4M22 40h4M30 40h4;M10 40h4M18 40h4M26 40h4"
        />
      </path>
    </svg>
  );
}

function ShieldGif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 6l14 5v11c0 9-6.2 15.6-14 18-7.8-2.4-14-9-14-18V11l14-5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 24.5l5 5 10-11"
        fill="none"
        stroke="currentColor"
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
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.12">
        <animate attributeName="r" values="2;7;2" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="2.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "CUSTOM FORMULATION SUPPORT",
    description:
      "From concept to commercial scale, Zephyr develops herbaceuticals, nutraceuticals, and organic specialty tablets for US private-label and contract partners.",
    Icon: FlaskGif,
  },
  {
    title: "LICENSED FACILITY",
    description:
      "65,000 sq ft production and laboratories with humidity-controlled dispensing, granulation, compression, coating, and capsule filling.",
    Icon: FactoryGif,
  },
  {
    title: "QA / QC SYSTEMS",
    description:
      "End-to-end raw material, in-process, and finished-product testing under GMP and ISO protocols by an experienced QA/QC team.",
    Icon: ShieldGif,
  },
];

export default function FeaturesSection() {
  return (
    <section className="zephyr-section">
      <div className="zephyr-container">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {FEATURE_CARDS.map((card) => {
            const { Icon } = card;
            return (
              <article
                key={card.title}
                className="group flex flex-col rounded-2xl border border-[#6d6d6d] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <H3 className="whitespace-pre-line uppercase leading-tight text-[#111111]">
                    {card.title}
                  </H3>
                  <Icon className="h-12 w-12 shrink-0 text-black sm:h-14 sm:w-14" />
                </div>
                <P>{card.description}</P>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
