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
type HomepageProps = {
  /** False while page-lock is open — hero may load but must not play. */
  playbackAllowed?: boolean;
};

export default function Homepage({ playbackAllowed = true }: HomepageProps) {
  return (
    <main className="min-h-screen bg-white">
      <LifestyleHero playbackAllowed={playbackAllowed} />
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
