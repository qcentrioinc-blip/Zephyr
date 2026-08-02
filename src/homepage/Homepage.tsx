import MainSec from "./MainSec";
import JointPain from "./JointPain";
import FeaturesSection from "./FeatureCards";
import Showreel from "./Showreel";
import Table from "./Table";
import ProductionShowcase from "./ProductionShowcase";
import Explore from "./Explore";
import FAQ from "./FAQ";
import Reveal from "../Global/Reveal";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <MainSec />
        <Reveal>
          <JointPain />
        </Reveal>
        <Reveal>
          <FeaturesSection />
        </Reveal>
        <Showreel />
        <Reveal>
          <Table />
        </Reveal>
        <Reveal>
          <ProductionShowcase />
        </Reveal>
        <Reveal>
          <Explore />
        </Reveal>
        <Reveal>
          <FAQ />
        </Reveal>
      </main>
    </div>
  );
}
