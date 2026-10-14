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
    <svg viewBox="0 0 48 52" className={className} aria-hidden="true" style={{ overflow: "visible" }}>
      {/* Flask outline & neck */}
      <path
        d="M19 12h10v10l8.5 18a7 7 0 0 1-6.3 10H16.8A7 7 0 0 1 10.5 40L19 22V12z"
        fill="none"
        stroke="#0F766E"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M17 12h14" stroke="#0F766E" strokeWidth="2.2" strokeLinecap="round" />

      {/* Liquid fluid base with animated wave motion */}
      <path fill="#14B8A6" opacity="0.4">
        <animate
          attributeName="d"
          dur="2.4s"
          repeatCount="indefinite"
          values="M14.5 40c2-3 5-4 9.5-4s7.5 1 9.5 4v2.5c-1.5 4-5 6.5-9.5 6.5S16 46.5 14.5 42.5V40z;M14.5 37c2-2.5 5-3.5 9.5-3.5s7.5 1 9.5 3.5v5.5c-1.5 4-5 6.5-9.5 6.5S16 46.5 14.5 42.5V37z;M14.5 40c2-3 5-4 9.5-4s7.5 1 9.5 4v2.5c-1.5 4-5 6.5-9.5 6.5S16 46.5 14.5 42.5V40z"
        />
      </path>

      {/* Internal Rising Bubbles */}
      <circle cx="20" cy="42" r="1.3" fill="#0D9488">
        <animate attributeName="cy" values="44;30;20" dur="2.1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.9;0.5;0" keyTimes="0;0.2;0.8;1" dur="2.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="28" cy="43" r="1.4" fill="#0F766E">
        <animate attributeName="cy" values="45;32;22" dur="2.3s" begin="0.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.85;0.6;0" keyTimes="0;0.2;0.8;1" dur="2.3s" begin="0.4s" repeatCount="indefinite" />
      </circle>

      {/* BUBBLES EMERGING & ESCAPING OUT OF THE GLASS INTO THE AIR */}
      {/* Escaping Bubble 1 - Floats straight up out of the neck */}
      <circle cx="24" cy="14" r="1.6" fill="#14B8A6">
        <animate attributeName="cy" values="18;8;0;-8" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="cx" values="24;23;25;23" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="r" values="1.2;1.8;2.2;1.5" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0.85;0" keyTimes="0;0.25;0.8;1" dur="2.6s" repeatCount="indefinite" />
      </circle>

      {/* Escaping Bubble 2 - Floats out and drifts left */}
      <circle cx="23" cy="16" r="1.4" fill="#2DD4BF">
        <animate attributeName="cy" values="19;10;2;-5" dur="3s" begin="0.8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="23;20;16;14" dur="3s" begin="0.8s" repeatCount="indefinite" />
        <animate attributeName="r" values="1;1.6;1.9;1.2" dur="3s" begin="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.95;0.75;0" keyTimes="0;0.2;0.75;1" dur="3s" begin="0.8s" repeatCount="indefinite" />
      </circle>

      {/* Escaping Bubble 3 - Floats out and drifts right */}
      <circle cx="25" cy="17" r="1.5" fill="#0D9488">
        <animate attributeName="cy" values="20;11;3;-6" dur="2.8s" begin="1.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="25;27;31;34" dur="2.8s" begin="1.5s" repeatCount="indefinite" />
        <animate attributeName="r" values="1.1;1.7;2;1.4" dur="2.8s" begin="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.9;0.7;0" keyTimes="0;0.25;0.8;1" dur="2.8s" begin="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Escaping Micro Bubble 4 - Small airy bubble fluttering high */}
      <circle cx="24" cy="15" r="1" fill="#5EEAD4">
        <animate attributeName="cy" values="16;7;-1;-10" dur="2.4s" begin="1.9s" repeatCount="indefinite" />
        <animate attributeName="cx" values="24;26;23;27" dur="2.4s" begin="1.9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0.8;0" keyTimes="0;0.2;0.7;1" dur="2.4s" begin="1.9s" repeatCount="indefinite" />
      </circle>

      {/* Effervescent vapor ring popping above the mouth */}
      <ellipse cx="24" cy="10" rx="3.5" ry="1.2" fill="none" stroke="#2DD4BF" strokeWidth="1.2">
        <animate attributeName="cy" values="11;4;-2" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="rx" values="2.5;5;7" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.35;0" dur="2.2s" repeatCount="indefinite" />
      </ellipse>
    </svg>
  );
}

function FactoryGif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" style={{ overflow: "visible" }}>
      {/* Iconic Industrial Facility / Manufacturing Plant Silhouette */}

      {/* Main Factory Structure with Classic Sawtooth Roof + Chimney Towers */}
      <path
        d="M5 40V23l8 5V21l9 5V14h7v7l9-5v23H5z"
        fill="none"
        stroke="#1E3A5F"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Ground plinth */}
      <path d="M3 40h42" stroke="#1E3A5F" strokeWidth="2.2" strokeLinecap="round" />

      {/* Industrial Warehouse Roller Gate */}
      <rect x="22" y="30" width="7" height="10" rx="1" fill="#E2E8F0" stroke="#1E3A5F" strokeWidth="1.6" />
      <line x1="22" y1="33" x2="29" y2="33" stroke="#1E3A5F" strokeWidth="1" />
      <line x1="22" y1="36" x2="29" y2="36" stroke="#1E3A5F" strokeWidth="1" />

      {/* Factory Grid Windows with Warm Production Glow */}
      {/* Left Bay Windows */}
      <rect x="8" y="29" width="4" height="4" rx="0.5" fill="#38BDF8" opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.85;0.4" dur="2.4s" repeatCount="indefinite" />
      </rect>
      <rect x="14" y="29" width="4" height="4" rx="0.5" fill="#38BDF8" opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.85;0.4" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
      </rect>

      {/* Right Tower Windows */}
      <rect x="31" y="24" width="4" height="4" rx="0.5" fill="#38BDF8" opacity="0.7">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
      </rect>
      <rect x="31" y="31" width="4" height="4" rx="0.5" fill="#38BDF8" opacity="0.7">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.4s" begin="0.3s" repeatCount="indefinite" />
      </rect>

      {/* Tall Chimney Smoke Stack on central roof */}
      <rect x="24" y="9" width="3" height="5" fill="#1E3A5F" />
      <line x1="23" y1="9" x2="28" y2="9" stroke="#1E3A5F" strokeWidth="1.5" strokeLinecap="round" />

      {/* Smoothly Rising Cloud Puffs from Chimney */}
      {/* Puff 1 - Main ascending cloud */}
      <circle cx="25.5" cy="7" r="1.8" fill="#5BA4C9">
        <animate attributeName="cy" values="7;1;-5;-11" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="cx" values="25.5;27;29;32" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="r" values="1.6;2.5;3.2;3.8" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.85;0.7;0.4;0" keyTimes="0;0.35;0.75;1" dur="2.4s" repeatCount="indefinite" />
      </circle>

      {/* Puff 2 - Trailing cloud */}
      <circle cx="25.5" cy="7" r="1.5" fill="#93C5FD">
        <animate attributeName="cy" values="7;2;-4;-9" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="25.5;24;22;19" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
        <animate attributeName="r" values="1.4;2.2;2.9;3.5" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.65;0.35;0" keyTimes="0;0.35;0.75;1" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
      </circle>

      {/* Puff 3 - Micro cloud */}
      <circle cx="25.5" cy="7" r="1.2" fill="#BAE6FD">
        <animate attributeName="cy" values="7;3;-2;-7" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
        <animate attributeName="cx" values="25.5;26.5;28;30" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
        <animate attributeName="r" values="1.2;1.8;2.4;3" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.75;0.6;0.3;0" keyTimes="0;0.35;0.75;1" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function ShieldGif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {/* Green Shield container as original */}
      <path
        d="M24 6l14 5v11c0 9-6.2 15.6-14 18-7.8-2.4-14-9-14-18V11l14-5z"
        fill="#15803D"
        opacity="0.14"
      />
      <path
        d="M24 6l14 5v11c0 9-6.2 15.6-14 18-7.8-2.4-14-9-14-18V11l14-5z"
        fill="none"
        stroke="#166534"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Gentle green pulse ring */}
      <circle cx="24" cy="24" r="10" fill="none" stroke="#22C55E" strokeWidth="1.2" opacity="0.25">
        <animate attributeName="r" values="8;13;8" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2.6s" repeatCount="indefinite" />
      </circle>

      {/* Green Animated Checkmark */}
      <path
        d="M16.5 24.5l5 5 10-11"
        fill="none"
        stroke="#16A34A"
        strokeWidth="3.4"
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
          values="0.4;1;1;0.4"
          keyTimes="0;0.35;0.75;1"
          dur="2.6s"
          repeatCount="indefinite"
        />
      </path>

      {/* Center green pulse behind the checkmark */}
      <circle cx="24" cy="24" r="3" fill="#22C55E" opacity="0.2">
        <animate attributeName="r" values="3;9;3" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "CUSTOM FORMULATION",
    description:
      "From concept to commercial scale, Zephyr develops herbaceuticals, nutraceuticals, and organic specialty tablets for US private label and contract partners.",
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
    imageWidth: "w-[45%]",
    wash: "linear-gradient(100deg, #f4f8fc 0%, #e7eef6 55%, #d5e2ee 100%)",
    glow: "rgba(59,130,196,0.38)",
    Icon: FactoryGif,
  },
  {
    title: "QA / QC SYSTEMS",
    description:
      "End-to-end raw material, in process, and finished product testing under GMP and ISO protocols by an experienced QA/QC team.",
    image: "/homepage/card-qaqc.webp?v=1",
    imageAlt: "A gloved hand holding a green and white capsule",
    imagePosition: "right center",
    imageFit: "object-cover",
    imageWidth: "w-[48%]",
    wash: "linear-gradient(100deg, #fffaf3 0%, #f6f4ef 55%, #ece8e2 100%)",
    glow: "rgba(22,163,74,0.38)",
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
