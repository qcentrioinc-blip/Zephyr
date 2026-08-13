import Explore from "../homepage/Explore";
import { TextParallaxContentExample } from "../production/TextParallaxContentExample";
import PageProgress from "../components/PageProgress";
import DevelopWithYou from "./DevelopWithYou";
import HeroSection from "./HeroSection";
import RdNarrative from "./RdNarrative";

const Research = () => {
  return (
    <div className="page-shell w-full bg-white">
      <PageProgress />
      <HeroSection />
      <DevelopWithYou />
      <RdNarrative />
      <TextParallaxContentExample />
      <Explore />
    </div>
  );
};

export default Research;
