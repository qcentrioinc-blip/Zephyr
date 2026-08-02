

import heroImg from "/Production/ProductionsHeroRight.png";
import labImg from "/Production/ProductionsHeroLeft.png";
import { H1, H3, P } from "../Global/Typography/Typo";

const HeroSection = () => {
  return (
   <section className="relative w-full overflow-hidden">
  <div className="zephyr-container py-12 md:py-20 lg:py-10 xl:py-24">

    {/* Heading */}
    <div className="max-w-full">
      <H1 className="">
        Production & Facilities
      </H1>

      <P className="mt-6  lg:mb-4 xl:mb-0 max-w-full  lg:max-w-2xl xl:max-w-lg">
        Zephyr operates a high-capacity manufacturing and packaging environment built for private-label and contract partners — delivering quality, flexibility and scale for nutraceutical, herbaceutical and organic brands.
      </P>
    </div>

    {/* Layout Area */}
    <div className="relative mt-10 xl:mt-0 xl:h-[750px]">

      {/* RIGHT IMAGE */}
      <div className="absolute xl:right-0 xl:top-[-180px]">
        <img
          src={heroImg}
          alt=""
          className="
            w-full
            xl:w-[500px]
            xl:w-[560px]
            2xl:w-[620px]
            h-auto
            object-cover
          "
        />
      </div>

      {/* LEFT IMAGE */}
      <div className="mt-10 xl:absolute xl:left-0 xl:top-[120px]">
        <img
          src={labImg}
          alt=""
          className="
            w-full
            xl:w-[430px]
            xl:w-[500px]
            2xl:w-[560px]
            h-auto
            object-cover
          "
        />
      </div>

      {/* GLASS CARD */}
      <div
      style={{
  background:
    "linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(153,149,149,0.9) 100%)",
  backdropFilter: "blur(24px)",
}}
        className="
          mt-6
          xl:absolute
          xl:left-[220px]
          xl:left-[450px]
          lg:bottom-0
          w-full
          lg:w-[700px]
          xl:w-[850px]
          md:rounded-full
          backdrop-blur-xl
          bg-[#999595]
          border border-white/40
          shadow-2xl
          p-6 md:p-10
        "
      >
        <div className="grid grid-cols-1 py-4 px-10 sm:grid-cols-3 gap-10">

          <div>
            <H3 className="">5B+</H3>
            <div className="w-10 h-[3px] bg-gray-800 my-4" />
            <P className="">
              Tablets manufacturing capacity per month.
            </P>
          </div>

          <div>
            <H3 className="">100M</H3>
            <div className="w-10 h-[3px] bg-gray-800 my-4" />
            <P className="">
              Capsules capacity per month for partner brands.
            </P>
          </div>

          <div>
            <H3 className="">60M</H3>
            <div className="w-10 h-[3px] bg-gray-800 my-4" />
            <P className="">
              Sachets per month, plus 1M jars packaging capacity.
            </P>
          </div>

        </div>
      </div>

    </div>
  </div>
</section>
  );
};

export default HeroSection;
