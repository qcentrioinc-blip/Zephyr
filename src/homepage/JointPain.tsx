import { H2, P } from "../Global/Typography/Typo";

const JointPain = () => {
  return (
    <section className="zephyr-section overflow-hidden">
      <div className="zephyr-container">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
          <div className="flex w-full justify-center lg:w-auto">
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
              <div className="h-40 w-24 flex-shrink-0 overflow-hidden rounded-[999px] shadow-lg sm:h-48 sm:w-28 md:h-64 md:w-36 lg:h-72 lg:w-40">
                <img
                  src="/Production/ProductionsHeroLeft.png"
                  alt="Zephyr laboratory"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-40 w-24 flex-shrink-0 overflow-hidden rounded-[999px] shadow-lg sm:h-48 sm:w-28 md:h-64 md:w-36 lg:h-72 lg:w-40">
                <img
                  src="/Gallery/Gallery1.png"
                  alt="Manufacturing facility"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-40 w-24 flex-shrink-0 overflow-hidden rounded-[999px] shadow-lg sm:h-48 sm:w-28 md:h-64 md:w-36 lg:h-72 lg:w-40">
                <img
                  src="/Gallery/Gallery3.png"
                  alt="Production capability"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-3xl text-center lg:text-left">
            <div className="mx-auto mb-1 h-[1px] w-20 bg-gray-500 md:w-28 lg:mx-0" />
            <H2 className="mb-3">About Zephyr</H2>
            <P className="mb-3">
              <span className="font-para text-[10px] font-bold leading-[120%] tracking-[0.05em] md:text-[12px] md:leading-[20px] lg:text-[14px]">
                Contract manufacturing partner for custom dietary supplement
                brands.
                <br />
              </span>
              Zephyr operates a 65,000 sq ft production facility and laboratories
              focused on nutraceutical, herbaceutical, and organic products. We
              tailor-make vitamins, minerals, health supplements, and specialty
              tablets for private label and brand owners. Customer focus and
              quality sit at the center of every program.
            </P>
            <P className="mb-3">
              We build long-term partnerships with international nutraceutical,
              herbaceutical, and organic brand owners, including US marketers and
              procurement teams that need reliable finished goods supply.
            </P>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl space-y-4 text-center lg:text-left">
          <P className="mb-3">
            Zephyr is a full-service manufacturing partner for the healthcare and
            organic industry. Our vitamin, mineral, health supplement, and
            specialty tablet solutions, together with advanced packaging
            technologies, support US private label and contract manufacturing
            launches.
          </P>
          <P className="mb-3">
            We work in true partnership from the first product idea to the
            finished ready-to-go product. We share market insights, identify
            opportunities, and apply formulation expertise to bring new ideas to
            market.
          </P>
          <P>
            As we produce millions of tablets each year, we continue to optimize
            manufacturing processes and invest in our licensed facility in a safe
            and sustainable way.
          </P>
        </div>
      </div>
    </section>
  );
};

export default JointPain;
