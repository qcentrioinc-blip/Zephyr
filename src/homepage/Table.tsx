import { Link } from "react-router-dom";
import { H2, H4, P } from "../Global/Typography/Typo";

export default function Table() {
  const facilityImage = "/Production/ProductionsHeroRight.webp";

  return (
    <section className="zephyr-section bg-white">
      <div className="zephyr-container">
        <div className="mb-4 md:mb-6">
          <H2 className="text-[#000000]">
            Manufacturing capacity at a glance
          </H2>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-3 md:gap-4 lg:grid-cols-[1.02fr_1.02fr_1fr] lg:gap-6">
          <div className="relative flex min-h-0 flex-col justify-between rounded-[14px] bg-[#F7F8F2] px-4 py-5 text-[#163925] shadow-[0_2px_10px_rgba(0,0,0,0.04)] sm:py-6 md:px-7 md:py-8 lg:min-h-[480px]">
            <H4 className="max-w-full md:p-2">
              5 billion tablets, 100 million capsules, 60 million sachets, and 1
              million jars per month. Built for partners who need reliable scale
              without compromising quality.
            </H4>

            <div className="flex items-end justify-between gap-4 pt-4 md:pt-6">
              <div>
                <H4 className="">Contract manufacturing partner</H4>
              </div>

              <img
                src="/Global/Logo.png"
                alt="Zephyr"
                className="h-8 w-auto object-contain sm:h-16"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-[14px] bg-[#E6DCCD] shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <img
              src={facilityImage}
              alt="Zephyr production facility"
              width={800}
              height={1000}
              loading="lazy"
              className="h-[200px] w-full object-cover sm:h-[260px] md:h-[320px] lg:h-full lg:min-h-[480px]"
            />
          </div>

          <div className="flex flex-col gap-3 lg:h-full lg:justify-between">
            <div className="rounded-[14px] bg-[#F7F8F2] px-4 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:px-5 sm:py-5 md:flex-1 md:px-7 md:py-6">
              <p className="font-manrope text-[24px] font-bold leading-[120%] tracking-wide text-[#000000] md:text-[32px] lg:text-[46px]">
                65K sq ft
              </p>
              <P className="mt-2 max-w-full sm:mt-3 xl:max-w-[290px]">
                Production facility and laboratories for partner manufacturing.
              </P>
            </div>

            <div className="rounded-[14px] bg-[#F7F8F2] px-4 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:px-5 sm:py-5 md:flex-1 md:px-7 md:py-6">
              <p className="font-manrope text-[24px] font-bold leading-[120%] tracking-wide text-[#000000] md:text-[32px] lg:text-[46px]">
                3 ranges
              </p>
              <P className="mt-2 max-w-full sm:mt-3 xl:max-w-[290px]">
                Nutraceutical, Herbaceutical and Organic custom formulations.
              </P>
            </div>

            <Link
              to="/contact"
              className="flex h-[64px] shrink-0 items-center justify-between rounded-[14px] bg-[#113227] px-4 text-left text-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-transform duration-200 hover:translate-y-[4px] sm:h-[72px] sm:px-5 md:h-[88px] md:flex-1 md:min-h-[88px] md:px-7 lg:h-auto lg:min-h-[100px]"
            >
              <span className="text-[16px] font-normal tracking-normal sm:text-[18px] md:text-[21px]">
                Request MOQ
              </span>

              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h16" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
