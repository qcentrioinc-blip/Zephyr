import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BENEFITS } from "./data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced: boolean; active: boolean };

/**
 * Common psoriasis symptoms — staggered media cards with scrub enter motion.
 */
export default function Benefits({ reduced, active }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!active || reduced || !rootRef.current) return;

      const section = rootRef.current;
      const head = section.querySelector(".sil-benefits-head");
      const cards = section.querySelectorAll<HTMLElement>(".sil-benefit-card");
      const media = section.querySelectorAll<HTMLElement>(".sil-benefit-media");

      if (head) {
        gsap.fromTo(
          head,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 52%",
              scrub: 0.45,
            },
          },
        );
      }

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            scale: 0.5,
            rotateX: 90,
            transformPerspective: 4000,
            transformOrigin: "center top",
          },
          {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 48%",
              scrub: 0.45,
            },
          },
        );
      });

      media.forEach((el) => {
        const img = el.querySelector("img");
        if (!img) return;
        gsap.fromTo(
          img,
          { scale: 1.12 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              end: "top 40%",
              scrub: 0.45,
            },
          },
        );
      });
    },
    { dependencies: [active, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="sil-benefits" aria-label="Common symptoms">
      <div className="sil-benefits-inner">
        <header className="sil-benefits-head">
          <p className="sil-benefits-eyebrow">Signs &amp; symptoms</p>
          <h2 className="sil-section-title sil-benefits-title">Common symptoms</h2>
          <p className="sil-benefits-lead">
            Symptoms can vary depending on the type and severity of the condition. People living
            with psoriasis may experience any combination of the following. Use these cues when
            briefing ALFURIN for clinic education and retail programs.
          </p>
        </header>

        <ul className="sil-benefit-grid">
          {BENEFITS.map((card) => (
            <li key={card.id} className="sil-benefit-card">
              <div className="sil-benefit-media">
                <img src={card.image} alt={card.alt} draggable={false} loading="lazy" decoding="async" />
                <span className="sil-benefit-tag">{card.category}</span>
              </div>
              <div className="sil-benefit-copy">
                <p className="sil-benefit-year">{card.year}</p>
                <h3>{card.title}</h3>
                <p>{card.line}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
