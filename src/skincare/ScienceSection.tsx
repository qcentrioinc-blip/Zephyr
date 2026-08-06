import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SCIENCE_CREDENTIALS } from "./data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced: boolean; active: boolean };

/** Science credentials — scroll-driven clinical readout for B2B diligence. */
export default function ScienceSection({ reduced, active }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!active || !rootRef.current) return;

      const head = rootRef.current.querySelector(".sil-science-head");
      const cards = rootRef.current.querySelectorAll<HTMLElement>(".sil-science-card");

      if (reduced) {
        gsap.set([head, cards], { clearProps: "all", opacity: 1 });
        return;
      }

      gsap.fromTo(
        head,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            end: "top 45%",
            scrub: 0.5,
          },
        },
      );

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 48, opacity: 0, rotateX: 12, transformPerspective: 900 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 55%",
              scrub: 0.45,
            },
          },
        );

        ScrollTrigger.create({
          trigger: card,
          start: "top 70%",
          end: "bottom 45%",
          onEnter: () => card.classList.add("is-active"),
          onEnterBack: () => card.classList.add("is-active"),
          onLeave: () => {
            if (index < cards.length - 1) card.classList.remove("is-active");
          },
          onLeaveBack: () => card.classList.remove("is-active"),
        });
      });
    },
    { dependencies: [active, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="sil-science" aria-label="Science and credentials">
      <div className="sil-science-shell">
        <header className="sil-science-head">
          <p className="sil-science-eyebrow">Science</p>
          <h2 className="sil-science-title">Credentials partners evaluate</h2>
          <p className="sil-science-body">
            A diligence-ready readout of the ALFURIN platform. Built for clinic onboarding,
            distribution briefs, and launch materials.
          </p>
        </header>

        <div className="sil-science-board">
          <ul className="sil-science-grid">
            {SCIENCE_CREDENTIALS.map((item, index) => (
              <li key={item.id} className="sil-science-card">
                <div className="sil-science-card-index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="sil-science-card-body">
                  <span className="sil-science-num">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
                <span className="sil-science-card-bar" aria-hidden />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
