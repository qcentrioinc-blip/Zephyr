import Explore from "../homepage/Explore"
import HeroSection from "./HeroSection"
import LorumText from "./LorumText"
import Stats from "./Stats"
import Timeline from "./Timeline"
import { H2, P } from "../Global/Typography/Typo"

const rdIntro =
  "Zephyr team works closely with our customers — we help them develop successful products. We utilise trend and market analysis alongside new supplier assessment by our Product development manager to provide concept formulations for new product development and existing product optimisation. These formulations are then further refined and developed, piloted and production-trialled by our in-house product development team in our dedicated product development laboratory facilities. We then use the extensive internal expertise and experience within our production team to transfer the product to full scale production and finalise product, process, and packaging specifications.";

const rdHighlights = [
  "Fully equipped, small scale pilot facility and extensive development laboratories",
  "Experienced team of Development Technicians",
  "In house stability testing",
  "Pre-production sample creation",
  "Analytical method development",
  "Validation support",
  "Development-led transfer to scale up manufacturing",
  "Artwork packaging and design expertise",
  "Dedicated regulatory team",
];

const Research = () => {
  return (
    <div className="page-shell w-full">
      <HeroSection/>
      <Stats/>
      <section className="zephyr-container zephyr-section">
        <H2 className="mb-4">How Zephyr develops with you</H2>
        <P className="max-w-4xl text-gray-600 mb-8">{rdIntro}</P>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rdHighlights.map((item, index) => (
            <div
              key={item}
              className="rounded-2xl border border-gray-200 bg-[#F7F8F2] px-4 py-4"
            >
              <P className="text-xs font-semibold uppercase tracking-wide text-[#547A3D] mb-2">
                {String(index + 1).padStart(2, "0")}
              </P>
              <P className="font-medium text-gray-800">{item}</P>
            </div>
          ))}
        </div>
      </section>
      <Timeline/>
      <LorumText/>
      <Explore/>
    </div>
  )
}

export default Research
