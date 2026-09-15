import LifestyleHero from "./LifestyleHero";
import JointPain from "./JointPain";
import FeaturesSection from "./FeatureCards";
import Showreel from "./Showreel";
import Table from "./Table";
import ProductionShowcase from "./ProductionShowcase";
import Explore from "./Explore";
import FAQ from "./FAQ";
import Reveal from "../components/Reveal";

/**
 * Eager sections so refresh-at-footer has full page height on first layout
 * (avoids restore fighting lazy chunk mount).
 *
 * Hero: LifestyleHero (video carousel) on all breakpoints.
 * MainSec / ProductAccordion kept in repo but unused on the homepage for now.
 */
export default function Homepage() {
  return (
    <main className="min-h-screen bg-white">
      <LifestyleHero />
      <JointPain />
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
  );
}
