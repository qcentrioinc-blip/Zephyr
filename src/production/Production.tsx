import Explore from "../homepage/Explore"
import HeroSection from "./HeroSection"
import ManufacturingHighlight from "./ManufacturingHighlight"
import { TextParallaxContentExample } from "./TextParallaxContentExample"
import { H2, H3, P } from "../Global/Typography/Typo"

const dosageFormats = ["Tablets", "Capsules", "Sachets", "Powders", "Gummies", "Jelly"];
const packaging = ["Jars", "Sachets", "Blister", "Bulk Packs", "Bottle Packs", "Alu Alu", "Stick Packs"];
const qa =
  "End-to-end testing of the raw material, in-process and finished products is carried out during each step by our highly trained quality team which ensures zero contamination. We also follow G.M.P. and ISO protocols. Well qualified, having decades of experience in the field of quality managements, cGMP compliance, audit managements and validation managements. Our QUALITY ASSURANCE team ensures products are manufactured as per GMP regulations and good quality products are released to the market.";
const qc =
  "Our quality team, working together with our experienced production team, are committed to ensuring that we supply you with products of the highest quality. We have a dedicated quality department with excellent in-house laboratory facilities and experienced people comprising analytical chemists and qualified persons. This combination of fully equipped laboratory facilities together with our comprehensive quality systems and experienced teams enable us to provide you with everything you need to ensure the quality of your products. Your products are in safe hands with us.";

const Production = () => {
  return (
    <div className="page-shell w-full">
      <HeroSection/>
      <TextParallaxContentExample/>
      <ManufacturingHighlight/>

      <section className="zephyr-container zephyr-section space-y-12">
        <div>
          <H2 className="mb-3">Dosage formats</H2>
          <P className="mb-6 text-gray-600">Flexible formats for private-label and contract partners.</P>
          <div className="flex flex-wrap gap-3">
            {dosageFormats.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#547A3D]/30 bg-[#EDFAEB] px-4 py-2 text-sm font-semibold text-[#547A3D]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <H2 className="mb-3">Packaging options</H2>
          <P className="mb-6 text-gray-600">Finished-pack flexibility from bulk to retail-ready formats.</P>
          <div className="flex flex-wrap gap-3">
            {packaging.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#4AA3A7]/30 bg-[#edf6fb] px-4 py-2 text-sm font-semibold text-[#247D7D]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <H3 className="mb-3">Quality Assurance</H3>
            <P className="text-gray-600">{qa}</P>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <H3 className="mb-3">Quality Control</H3>
            <P className="text-gray-600">{qc}</P>
          </div>
        </div>
      </section>

      <Explore/>
    </div>
  )
}

export default Production
