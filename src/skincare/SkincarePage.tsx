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

    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };

    const raf = window.requestAnimationFrame(refresh);
    const t = window.setTimeout(refresh, 400);
    void document.fonts?.ready?.then(refresh);

    // Re-measure after product / mood images decode (first-scroll pin hitch).
    const imgs = document.querySelectorAll<HTMLImageElement>(
      ".skincare-silencio img",
    );
    let pending = 0;
    const onImg = () => {
      pending -= 1;
      if (pending <= 0) refresh();
    };
    imgs.forEach((img) => {
      if (img.complete) return;
      pending += 1;
      img.addEventListener("load", onImg, { once: true });
      img.addEventListener("error", onImg, { once: true });
    });
    if (pending === 0) refresh();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t);
      imgs.forEach((img) => {
        img.removeEventListener("load", onImg);
        img.removeEventListener("error", onImg);
      });
    };
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
