import { H2, P } from "../Global/Typography/Typo";


const JointPain = () => {
  return (
    <section className="zephyr-section overflow-hidden">
      <div className="zephyr-container">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12 xl:gap-16">
          <div className="w-full lg:w-auto flex justify-center">
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
              <div className="w-24 h-40 sm:w-28 sm:h-48 md:w-36 md:h-64 lg:w-40 lg:h-72 overflow-hidden rounded-[999px] shadow-lg flex-shrink-0">
                <img
                  src="/Production/ProductionsHeroLeft.png"
                  alt="Zephyr laboratory"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-24 h-40 sm:w-28 sm:h-48 md:w-36 md:h-64 lg:w-40 lg:h-72 overflow-hidden rounded-[999px] shadow-lg flex-shrink-0">
                <img
                  src="/Gallery/Gallery1.png"
                  alt="Manufacturing facility"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-24 h-40 sm:w-28 sm:h-48 md:w-36 md:h-64 lg:w-40 lg:h-72 overflow-hidden rounded-[999px] shadow-lg flex-shrink-0">
                <img
                  src="/Gallery/Gallery3.png"
                  alt="Production capability"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-3xl text-center lg:text-left">
            <div className="w-20 md:w-28 h-[1px] bg-gray-500 mx-auto lg:mx-0 mb-1" />

            <H2 className="mb-3">About Zephyr</H2>
            <P className="mb-3">
              <span className="font-para font-bold
      leading-[120%] md:leading-[20px]
      text-[10px] md:text-[12px] lg:text-[14px]
      tracking-[0.05em]">India’s leading manufacturer and supplier of custom healthcare products. <br />
              </span>
              Zephyr Life Sciences Pvt Ltd. built a 65,000 sq ft production facility and laboratories, a professionally managed company engaged in manufacturing and marketing nutraceutical, herbaceutical, and organic products. We tailor-make vitamins, minerals, health supplements, and specialty tablets. Zephyr develops and manufactures custom healthcare brands. The two things that matter the most to us are customer focus and quality.            </P>
            <P className="mb-3">
            Zephyr works worldwide to build long-term partnerships with international nutraceutical, herbaceutical, and organic brand owners with a focus on caring for their business health.            </P>
          </div>
        </div>

        <div className="mt-10 max-w-7xl mx-auto space-y-4 text-center lg:text-left">
          <P className="mb-3">
          We are a full-service manufacturing partner for the healthcare and organic industry. Our tailor-made vitamins, minerals, health supplements, and specialty tablet solutions together with advanced packaging technologies make us a proud leader in manufacturing for the nutraceutical and organic industry.

With a strong focus on our customers’ requirements, we work in true partnership from the first product idea to the finished ready to go product. We share our market insights, identify opportunities and apply our expertise in new product development and formulations to bring innovative ideas to the market.

As we are producing millions of tablets each year, we have optimised the manufacturing process and are continuing to invest in our high-quality licensed facility in a safe and sustainable way.          </P>
        </div>
      </div>
    </section>
  );
};

export default JointPain;
