import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BENEFITS } from "./data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced: boolean; active: boolean };

/**
 * Use cases — title stays at section top; cards keep scrub enter motion.
 */
export default function Benefits({ reduced, active }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!active || reduced || !rootRef.current) return;

      const section = rootRef.current;
      const cards = section.querySelectorAll<HTMLElement>(".sil-benefit-card");
      const media = section.querySelectorAll<HTMLElement>(".sil-benefit-media");

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
    <section ref={rootRef} className="sil-benefits" aria-label="Use cases">
      <div className="sil-benefits-inner">
        <h2 className="sil-section-title sil-benefits-title">Use cases</h2>

        <ul className="sil-benefit-grid">
          {BENEFITS.map((card, index) => {
            const hideTitle = index >= 4 || card.id === "swiss" || card.id === "moq";
            return (
              <li
                key={card.id}
                className={`sil-benefit-card${hideTitle ? " sil-benefit-card--no-title" : ""}`}
              >
                <div className="sil-benefit-media">
                  <img src={card.image} alt="" draggable={false} />
                  <span className="sil-benefit-tag">{card.category}</span>
                </div>
                <div className="sil-benefit-copy">
                  <p className="sil-benefit-year">{card.year}</p>
                  {!hideTitle ? <h3>{card.title}</h3> : null}
                  <p>{card.line}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
