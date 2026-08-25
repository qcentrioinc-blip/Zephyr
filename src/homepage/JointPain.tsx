import { H2, P } from "../components/Typography/Typo";
import Reveal from "../components/Reveal";

const JointPain = () => {
  return (
    <section className="zephyr-section overflow-x-hidden">
      <div className="zephyr-container">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
          <Reveal className="flex w-full justify-center lg:w-auto">
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
              <div className="h-44 w-28 flex-shrink-0 overflow-hidden rounded-[999px] shadow-lg sm:h-52 sm:w-32 md:h-64 md:w-36 lg:h-80 lg:w-44">
                <img
                  src="/facility/jointpain-cdmo-lab.webp"
                  alt="CDMO manufacturing laboratory"
                  loading="lazy"
                  decoding="async"
                  width={320}
                  height={576}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-44 w-28 flex-shrink-0 overflow-hidden rounded-[999px] shadow-lg sm:h-52 sm:w-32 md:h-64 md:w-36 lg:h-80 lg:w-44">
                <img
                  src="/facility/gallery-1.png"
                  alt="Manufacturing facility"
                  loading="lazy"
                  width={320}
                  height={576}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-44 w-28 flex-shrink-0 overflow-hidden rounded-[999px] shadow-lg sm:h-52 sm:w-32 md:h-64 md:w-36 lg:h-80 lg:w-44">
                <img
                  src="/facility/gallery-rd-analytical-labs.webp"
                  alt="R&D and analytical laboratories"
                  loading="lazy"
                  width={320}
                  height={576}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          <div className="w-full max-w-3xl text-center lg:text-left">
            <div className="mx-auto mb-1 h-[1px] w-20 bg-gray-500 md:w-28 lg:mx-0" />
            <H2 className="mb-3">Contract manufacturing partner</H2>
            <Reveal>
              <P className="mb-3">
                <span className="font-para font-bold">
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
            </Reveal>
          </div>
        </div>

        {/* <Reveal className="zephyr-prose mx-auto mt-10 w-full space-y-4 text-center lg:mx-0 lg:text-left">
          <P>
            Zephyr is a full-service CDMO for dietary supplement brand owners and
            marketers. Vitamin, mineral, specialty tablet, and packaging
            capabilities support US private-label and contract manufacturing
            launches. Programs run from formulation brief through commercial release of
            finished goods. We align process, pack specs, and documentation to
            your target market and channel. With large-scale tablet, capsule, and jar capacity, we
            continue to optimize manufacturing processes and invest in our
            licensed facility for safe, consistent commercial supply.
          </P>
        </Reveal> */}
      </div>
    </section>
  );
};

export default JointPain;
