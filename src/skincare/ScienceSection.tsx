import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SCIENCE_CREDENTIALS } from "./data";
import { LetterStrip } from "../components/LetterStrip";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced: boolean; active: boolean };

/** Science credentials — flip cards reveal content-matched imagery on hover. */
export default function ScienceSection({ reduced, active }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!active || !rootRef.current) return;

      const head = rootRef.current.querySelector(".sil-science-head");
      const cards = rootRef.current.querySelectorAll<HTMLElement>(".sil-science-card");
      const bodies = rootRef.current.querySelectorAll<HTMLElement>(".sil-science-card-body");

      if (reduced) {
        gsap.set([head, bodies], { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        head,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 78%",
            end: "top 50%",
            scrub: 0.45,
          },
        },
      );

      // Animate inner body copy only — keep face transforms free for CSS 3D flip
      bodies.forEach((body, index) => {
        const card = cards[index];
        if (!card) return;
        gsap.fromTo(
          body,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 62%",
              scrub: 0.4,
            },
          },
        );
      });
    },
    { dependencies: [active, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="sil-science" aria-label="Science and credentials">
      <div className="sil-science-shell">
        <header className="sil-science-head">
          <p className="sil-science-eyebrow">Science</p>
          <LetterStrip
            as="h2"
            text="Credentials partners evaluate"
            className="sil-science-title"
          />
          <p className="sil-science-body">
            Key credentials for the Alfurin range. Built for clinic onboarding,
            distribution briefs, and launch materials.
          </p>
        </header>

        <div className="sil-science-board">
          <ul className="sil-science-grid">
            {SCIENCE_CREDENTIALS.map((item, index) => (
              <li key={item.id} className="sil-science-card">
                <div className="sil-science-flip">
                  <div className="sil-science-face sil-science-face--front">
                    <div className="sil-science-card-index" aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="sil-science-card-body">
                      <LetterStrip as="h3" text={item.title} />
                      <p>{item.detail}</p>
                    </div>
                  </div>
                  <div className="sil-science-face sil-science-face--back" aria-hidden>
                    <img src={item.image} alt={item.alt} loading="lazy" decoding="async" draggable={false} />
                    <div className="sil-science-face-caption">
                      <p>{item.title}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
