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
                  src="/Production/ProductionsHeroLeft.webp"
                  alt="Zephyr laboratory"
                  loading="lazy"
                  width={320}
                  height={576}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-40 w-24 flex-shrink-0 overflow-hidden rounded-[999px] shadow-lg sm:h-48 sm:w-28 md:h-64 md:w-36 lg:h-72 lg:w-40">
                <img
                  src="/Gallery/Gallery1.png"
                  alt="Manufacturing facility"
                  loading="lazy"
                  width={320}
                  height={576}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-40 w-24 flex-shrink-0 overflow-hidden rounded-[999px] shadow-lg sm:h-48 sm:w-28 md:h-64 md:w-36 lg:h-72 lg:w-40">
                <img
                  src="/Gallery/Gallery3.png"
                  alt="Production capability"
                  loading="lazy"
                  width={320}
                  height={576}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-3xl text-center lg:text-left">
            <div className="mx-auto mb-1 h-[1px] w-20 bg-gray-500 md:w-28 lg:mx-0" />
            <H2 className="mb-3">Contract manufacturing partner</H2>
            <P className="mb-3">
              <span className="font-para text-[10px] font-bold leading-[120%] tracking-[0.05em] md:text-[12px] md:leading-[20px] lg:text-[14px]">
                CDMO partner for private-label dietary supplement brands.
                <br />
              </span>
              Zephyr operates a 65,000 sq ft production facility and laboratories
              focused on nutraceutical, herbaceutical, and organic products. We
              manufacture vitamins, minerals, specialty dosages, and finished
              supplements for private-label and brand owners. Quality systems and
              commercial reliability sit at the center of every program.
            </P>
            <P className="mb-3">
              We support long-term partnerships with nutraceutical,
              herbaceutical, and organic brand owners, including US marketers and
              procurement teams that need dependable finished-goods supply.
            </P>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl space-y-4 text-center lg:text-left">
          <P className="mb-3">
            Zephyr is a full-service CDMO for dietary supplement brand owners and
            marketers. Vitamin, mineral, specialty tablet, and packaging
            capabilities support US private-label and contract manufacturing
            launches.
          </P>
          <P className="mb-3">
            Programs run from formulation brief through commercial release of
            finished goods. We align process, pack specs, and documentation to
            your target market and channel.
          </P>
          <P>
            With large-scale tablet, capsule, sachet, and jar capacity, we
            continue to optimize manufacturing processes and invest in our
            licensed facility for safe, consistent commercial supply.
          </P>
        </div>
      </div>
    </section>
  );
};

export default JointPain;
