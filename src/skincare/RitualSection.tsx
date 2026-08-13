import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RITUAL_STEPS } from "./data";
import { LetterStrip } from "../components/LetterStrip";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced: boolean; active: boolean };

/** Everyday program — image-led protocol steps with scroll motion. */
export default function RitualSection({ reduced, active }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!active || !rootRef.current) return;

      const head = rootRef.current.querySelector(".sil-ritual-head");
      const steps = rootRef.current.querySelectorAll<HTMLElement>(".sil-ritual-step");
      const spine = rootRef.current.querySelector(".sil-ritual-spine-fill");

      if (reduced) {
        gsap.set([head, steps], { clearProps: "all", opacity: 1 });
        steps.forEach((step) => step.classList.add("is-active"));
        if (spine) gsap.set(spine, { scaleY: 1 });
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
            start: "top 78%",
            end: "top 48%",
            scrub: 0.45,
          },
        },
      );

      if (spine) {
        gsap.fromTo(
          spine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current.querySelector(".sil-ritual-board"),
              start: "top 70%",
              end: "bottom 55%",
              scrub: 0.5,
            },
          },
        );
      }

      steps.forEach((step, index) => {
        const media = step.querySelector(".sil-ritual-media img");
        const copy = step.querySelector(".sil-ritual-copy");
        const fromX = index % 2 === 0 ? -40 : 40;

        gsap.fromTo(
          step,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: step,
              start: "top 88%",
              end: "top 55%",
              scrub: 0.45,
            },
          },
        );

        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.14 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: step,
                start: "top 85%",
                end: "top 40%",
                scrub: 0.5,
              },
            },
          );
        }

        if (copy) {
          gsap.fromTo(
            copy,
            { x: fromX, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: step,
                start: "top 86%",
                end: "top 52%",
                scrub: 0.45,
              },
            },
          );
        }

        ScrollTrigger.create({
          trigger: step,
          start: "top 68%",
          end: "bottom 42%",
          onEnter: () => step.classList.add("is-active"),
          onEnterBack: () => step.classList.add("is-active"),
          onLeave: () => {
            if (index < steps.length - 1) step.classList.remove("is-active");
          },
          onLeaveBack: () => step.classList.remove("is-active"),
        });
      });
    },
    { dependencies: [active, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="sil-ritual" aria-label="Developed for everyday programs">
      <div className="sil-ritual-inner">
        <header className="sil-ritual-head">
          <p className="sil-ritual-eyebrow">Daily ritual</p>
          <LetterStrip
            as="h2"
            text="Developed for everyday programs"
            className="sil-ritual-title"
          />
          <p className="sil-ritual-body">
            Alfurin is built for regular use on psoriasis-prone skin. A non-greasy, dermatologically
            tested system partners can brief for clinic protocols, retail education, and home
            routines: cleanse, lotion for large areas, cream where plaque is thicker.
          </p>
        </header>

        <div className="sil-ritual-board">
          <div className="sil-ritual-spine" aria-hidden>
            <span className="sil-ritual-spine-fill" />
          </div>

          <ol className="sil-ritual-steps">
            {RITUAL_STEPS.map((step, index) => (
              <li
                key={step.num}
                className={`sil-ritual-step${index % 2 === 1 ? " sil-ritual-step--flip" : ""}`}
              >
                <figure className="sil-ritual-media">
                  <img src={step.image} alt={step.alt} loading="lazy" decoding="async" />
                  <span className="sil-ritual-media-num">{step.num}</span>
                </figure>

                <div className="sil-ritual-copy">
                  <span className="sil-ritual-label">{step.label}</span>
                  <LetterStrip as="h3" text={step.title} />
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
