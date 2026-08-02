import Explore from "../homepage/Explore";
import ProductionShowcase from "../homepage/ProductionShowcase";
// import Stats from "../research/Stats";
import Timeline from "../research/Timeline";
import PageProgress from "../Global/PageProgress";
import HeroSection from "./HeroSection";
import QualityCards from "./QualityCards";
import ManufacturingProcess from "./ManufacturingProcess";
import PartnerAdvantage from "./PartnerAdvantage";

const Production = () => {
  return (
    <div className="page-shell w-full bg-white">
      <PageProgress />
      <HeroSection />
      <ProductionShowcase />
      <QualityCards />
      <ManufacturingProcess />
      <PartnerAdvantage />
      {/* Right-side Stats circles block commented by request — leave commented
      <Stats />
      */}
      <Timeline />
      <Explore />
    </div>
  );
};

export default Production;
