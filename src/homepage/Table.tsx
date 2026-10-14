import { Link } from "react-router-dom";
import { P } from "../components/Typography/Typo";

function QualitySeal() {
  return (
    <svg viewBox="0 0 80 100" aria-hidden="true" className="h-[8.4rem] w-[6.6rem]">
      <path d="M27 51 L16 84 L25 79 L22 94 L36 72 L38 53 Z" fill="#b9dff3" />
      <path d="M53 51 L64 84 L55 79 L58 94 L44 72 L42 53 Z" fill="#8ec8ea" />
      <path
        d="M40 8 L44.19 12.91 L49.95 9.98 L51.94 16.12 L58.38 15.62 L57.88 22.06 L64.02 24.05 L61.09 29.81 L66 34 L61.09 38.19 L64.02 43.95 L57.88 45.94 L58.38 52.38 L51.94 51.88 L49.95 58.02 L44.19 55.09 L40 60 L35.81 55.09 L30.05 58.02 L28.06 51.88 L21.62 52.38 L22.12 45.94 L15.98 43.95 L18.91 38.19 L14 34 L18.91 29.81 L15.98 24.05 L22.12 22.06 L21.62 15.62 L28.06 16.12 L30.05 9.98 L35.81 12.91 Z"
        fill="#8ec8ea"
      />
      <circle cx="40" cy="34" r="16.2" fill="#eef8fd" />
      <circle cx="40" cy="34" r="13.2" fill="none" stroke="#d7eef8" strokeWidth="2.4" />
      <path
        d="M40 23.4 L42.5 30.1 L49.7 30.4 L44 35 L45.9 42 L40 38.1 L34.1 42 L36 35 L30.3 30.4 L37.5 30.1 Z"
        fill="#4aa4d8"
      />
    </svg>
  );
}

export default function Table() {
  return (
    <section className="zephyr-section relative overflow-hidden bg-white">
      <div className="zephyr-container relative">
        <h2 className="zephyr-type-h2 mb-5 font-manrope font-semibold text-[#1a3d32] md:mb-6">
          Manufacturing capacity at a glance
        </h2>

        <div className="grid grid-cols-1 items-stretch gap-3 md:gap-4 lg:grid-cols-[1.02fr_1fr_0.98fr] lg:gap-4">
          <div className="relative flex min-h-0 flex-col justify-between rounded-[22px] bg-gradient-to-br from-[#f6faf3] to-[#e3f0dc] px-5 py-6 text-[#1e3d32] sm:px-6 sm:py-7 lg:min-h-[440px]">
            <div>
              <p className="font-para text-[15px] font-semibold leading-[1.45] text-[#1a3d32] sm:text-[16px]">
                5 billion tablets, 100 million capsules, 60 million sachets, and 1 million jars per month.
              </p>
              <P className="mt-3 text-[#3d5248]">
                Capacity planned for private-label and contract programs that need dependable throughout month after month. Built for partners who need reliable scale without compromising quality, documentation, or commercial release timing. From early formulation through finished goods packaging, programs stay aligned to MOQ, dosage form, and market requirements.
              </P>
            </div>

            <div className="mt-6 border-t border-[#c5dcc0] pt-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-manrope text-[15px] font-semibold text-[#1a3d32] sm:text-[16px]">
                  Manufactured by
                </p>
                <img
                  src="/brand/logo.png"
                  alt="Zephyr"
                  className="h-10 w-auto max-w-[46%] object-contain object-right sm:h-12"
                />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[22px] bg-[#d7ebe3]">
            <img
              src="/facility/productions-hero-right.webp"
              alt="Gloved technicians capping bottles of tablets on a production line"
              width={800}
              height={1000}
              loading="lazy"
              className="h-[220px] w-full object-cover sm:h-[280px] lg:h-full lg:min-h-[440px]"
            />
          </div>

          <div className="flex flex-col gap-3 lg:h-full">
            <article className="relative flex flex-1 items-center overflow-hidden rounded-[22px] bg-[#e7f4fb] px-4 py-5 sm:px-5">
              <svg viewBox="0 0 240 170" aria-hidden="true" className="pointer-events-none absolute -right-16 -top-8 h-40 w-64">
                <path
                  d="M36 22C118 4 188 36 228 128"
                  fill="none"
                  stroke="#c5e6f6"
                  strokeWidth="46"
                  strokeLinecap="round"
                />
              </svg>
              <div className="relative min-w-0 pr-[7.2rem]">
                <p className="font-manrope text-[26px] font-bold leading-tight text-[#16382d] sm:text-[28px]">
                  cGMP / ISO
                </p>
                <p className="mt-1.5 font-para text-[15px] leading-[1.4] text-[#4e5f58] sm:text-[16px]">
                  Validated processes, QA/QC coverage, and audit-ready documentation for commercial release.
                </p>
              </div>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                <QualitySeal />
              </div>
            </article>

            <article className="relative flex flex-1 items-center overflow-hidden rounded-[22px] bg-gradient-to-br from-[#fbf6ee] to-[#f0e2cc] px-5 py-4 sm:px-6">
              <svg viewBox="0 0 240 170" aria-hidden="true" className="pointer-events-none absolute -right-14 -top-10 h-36 w-56">
                <path
                  d="M28 30C110 8 176 42 214 132"
                  fill="none"
                  stroke="#e7d2ae"
                  strokeWidth="44"
                  strokeLinecap="round"
                />
              </svg>
              <svg viewBox="0 0 180 140" aria-hidden="true" className="pointer-events-none absolute -bottom-8 -left-10 h-28 w-44">
                <path
                  d="M16 112C48 46 118 34 168 86"
                  fill="none"
                  stroke="#f4e6cf"
                  strokeWidth="36"
                  strokeLinecap="round"
                />
              </svg>
              <div className="relative min-w-0">
                <p className="font-manrope text-[26px] font-bold leading-tight text-[#16382d] sm:text-[28px]">
                  3 ranges
                </p>
                <p className="mt-1.5 font-para text-[15px] leading-[1.4] text-[#4e5f58] sm:text-[16px]">
                  Nutraceutical, Herbaceutical and Organic custom formulations.
                </p>
              </div>
            </article>

            <Link
              to="/contact"
              className="group relative flex min-h-[78px] shrink-0 items-center justify-between gap-3 overflow-hidden rounded-[22px] bg-gradient-to-r from-[#062416] via-[#0c4328] to-[#1a7a46] px-5 text-white sm:px-6 lg:min-h-[86px]"
            >
              <span className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M7 3.5h7.2L19 8.2V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" strokeLinejoin="round" />
                  <path d="M14 3.5V8h4.8M8.2 12.5h7.2M8.2 16h5" strokeLinecap="round" />
                </svg>
                <span className="font-manrope text-[20px] font-semibold sm:text-[22px]">Request MOQ</span>
              </span>
              <svg viewBox="0 0 24 24" className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
