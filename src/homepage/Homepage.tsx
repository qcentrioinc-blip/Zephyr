import MainSec from "./MainSec";
import JointPain from "./JointPain";
import FeaturesSection from "./FeatureCards";
import Showreel from "./Showreel";
import Table from "./Table";
import ProductionShowcase from "./ProductionShowcase";
// import CTA from "./CTA";
import Explore from "./Explore";
import FAQ from "./FAQ";

export default function Homepage() {
  return (
    <div className="min-h-screen">
      <main>
        <MainSec />
        <JointPain />
        <FeaturesSection />
        <Showreel />
        <Table />
        <ProductionShowcase />
        {/* <CTA /> */}
        
        <Explore />
        <FAQ />
      </main>
    </div>
  );
}
