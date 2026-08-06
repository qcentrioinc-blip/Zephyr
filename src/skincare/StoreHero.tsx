import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PRODUCTS } from "./data";
import { openSkincareContact } from "./contactEvents";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced: boolean; active: boolean };

/** Survives React Strict Mode remount so the enter animation does not double-play. */
let landingIntroPlayed = false;

/**
 * Landing hero — clinical split layout; enter animation runs once after the gate.
 */
export default function StoreHero({ reduced, active }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  // Hide landing content before first paint when the gate unlocks (avoids flash → re-animate).
  useLayoutEffect(() => {
    if (!active || reduced || !rootRef.current || landingIntroPlayed) return;

    const root = rootRef.current;
    gsap.set(root.querySelector(".sil-land-glow"), { opacity: 0, scale: 0.92 });
    gsap.set(root.querySelector(".sil-land-copy"), { y: 28, opacity: 0 });
    gsap.set(root.querySelectorAll(".sil-land-card"), { y: 36, opacity: 0, force3D: false });
  }, [active, reduced]);

  useGSAP(
    () => {
      if (!active || !rootRef.current) return;

      const copy = rootRef.current.querySelector(".sil-land-copy");
      const cards = rootRef.current.querySelectorAll(".sil-land-card");
      const glow = rootRef.current.querySelector(".sil-land-glow");
      const targets = [glow, copy, ...cards].filter(Boolean);

      if (reduced) {
        gsap.set(targets, { clearProps: "all", opacity: 1, y: 0, scale: 1 });
        landingIntroPlayed = true;
        return;
      }

      if (!landingIntroPlayed) {
        landingIntroPlayed = true;
        gsap.set(glow, { opacity: 0, scale: 0.92 });
        gsap.set(copy, { y: 28, opacity: 0 });
        gsap.set(cards, { y: 36, opacity: 0, force3D: false });

        gsap
          .timeline()
          .to(glow, { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" }, 0)
          .to(copy, { y: 0, opacity: 1, duration: 0.95, ease: "power3.out" }, 0.08)
          .to(
            cards,
            {
              y: 0,
              opacity: 1,
              stagger: 0.12,
              duration: 0.95,
              ease: "power3.out",
              force3D: false,
            },
            0.18,
          );
      }

      gsap.to(cards, {
        y: -14,
        force3D: false,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    },
    { dependencies: [active, reduced], scope: rootRef },
  );

  const lotion = PRODUCTS[0];
  const cream = PRODUCTS[1];

  return (
    <header ref={rootRef} className="sil-land" aria-label="ALFURIN partner overview">
      <div className="sil-land-glow" aria-hidden />

      <div className="sil-land-shell">
        <div className="sil-land-copy">
          <p className="sil-land-eyebrow">Zephyr manufacturing · ALFURIN</p>
          <h1 className="sil-land-title">
            A new approach
            <span>to psoriatic skin</span>
          </h1>
          <p className="sil-land-body">
            Dual-action natural-active care for psoriasis-prone skin. Lotion for daily large-area
            defence. Cream for intensive plaque sites. Limonia acidissima-derived actives and S100
            Protein Technology, manufactured by Zephyr for US distribution, clinic, and
            private-label partners.
          </p>
          <motion.button
            type="button"
            className="sil-cta sil-cta--fill sil-land-cta"
            onClick={() => openSkincareContact()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Partner enquiry
          </motion.button>
        </div>

        <div className="sil-land-products" aria-hidden={false}>
          {lotion ? (
            <article className="sil-land-card sil-land-card--lotion">
              <div className="sil-land-card-media">
                <img src={lotion.image} alt={lotion.name} draggable={false} />
              </div>
              <div className="sil-land-card-meta">
                <span>01</span>
                <h2>{lotion.name}</h2>
              </div>
            </article>
          ) : null}
          {cream ? (
            <article className="sil-land-card sil-land-card--cream">
              <div className="sil-land-card-media">
                <img src={cream.image} alt={cream.name} draggable={false} />
              </div>
              <div className="sil-land-card-meta">
                <span>02</span>
                <h2>{cream.name}</h2>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </header>
  );
}
