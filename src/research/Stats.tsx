import { H2, H3, P } from "../Global/Typography/Typo";
import Reveal from "../Global/Reveal";

interface StatCard {
  number: string;
  description: string;
}

/** GIF assets ready for re-enable of right-side circles */
export const STATS_CIRCLE_GIFS = {
  formulate: "/Production/icons/formulate.gif",
  ranges: "/Production/icons/ranges.gif",
  quality: "/Production/icons/quality.gif",
} as const;

const Stats = () => {
  const statCards: StatCard[] = [
    {
      number: "65K",
      description:
        "Square feet of production facility and laboratories supporting partner manufacturing.",
    },
    {
      number: "3",
      description:
        "Custom ranges for Nutraceutical, Herbaceutical, and Organic private label brands.",
    },
  ];

  return (
    <section className="zephyr-section bg-white">
      <div className="zephyr-container">
        <div className="mx-auto max-w-4xl space-y-8">
          <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl bg-[#EDFAEB] p-6 transition-shadow duration-300 hover:shadow-lg sm:p-8"
              >
                <H3 className="mb-2 text-[#113227]">{stat.number}</H3>
                <P>{stat.description}</P>
              </div>
            ))}
          </Reveal>

          <Reveal>
            <div className="rounded-3xl bg-[#F4F4F4] p-6 transition-shadow duration-300 hover:shadow-lg sm:p-8">
              <H2 className="text-[#113227]">Capacity built for partners</H2>
              <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
                  <P className="flex-1 text-gray-600">
                    From humidity-controlled dispensing and granulation to
                    high-speed compression, coating, and hard-gel capsule filling.
                    Zephyr lines support flexible private label manufacturing with
                    GMP and ISO quality systems.
                  </P>
                <div className="w-full shrink-0 sm:w-40 lg:w-48">
                  <img
                    src="/Research/ResearchStats.png"
                    alt="Zephyr manufacturing capability"
                    className="h-auto w-full object-contain shadow-md"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right-side circular GIF cluster commented by request.
              Assets updated: STATS_CIRCLE_GIFS.formulate / .ranges / .quality
          */}
        </div>
      </div>
    </section>
  );
};

export default Stats;
