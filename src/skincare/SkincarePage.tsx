import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./silencio.css";
import IntroGate from "./IntroGate";
import StoreHero from "./StoreHero";
import PinnedProductCan from "./PinnedProductCan";
import PinnedSystem from "./PinnedSystem";
import Benefits from "./Benefits";
import ProofBand from "./ProofBand";
import CartFinale from "./CartFinale";
import SkincareContact from "./SkincareContact";
import { PRODUCTS } from "./data";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useSkincareLenis } from "./hooks/useSkincareLenis";

gsap.registerPlugin(ScrollTrigger);

export default function SkincarePage() {
  const reduced = usePrefersReducedMotion();
  const [entered, setEntered] = useState(reduced);

  useSkincareLenis(entered && !reduced);

  useEffect(() => {
    if (!entered) return;
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, [entered]);

  return (
    <main className={`skincare-silencio ${entered ? "is-open" : "is-gated"}`}>
      {!entered ? <IntroGate onEnter={() => setEntered(true)} reduced={reduced} /> : null}

      <div className="sil-store" aria-hidden={!entered}>
        <StoreHero reduced={reduced} active={entered} />

        {PRODUCTS.map((product) => (
          <PinnedProductCan
            key={product.id}
            product={product}
            reduced={reduced}
            active={entered}
          />
        ))}

        <PinnedSystem reduced={reduced} active={entered} />
        <Benefits reduced={reduced} active={entered} />
        <ProofBand reduced={reduced} active={entered} />
        <CartFinale reduced={reduced} active={entered} />
      </div>

      <SkincareContact />
    </main>
  );
}
