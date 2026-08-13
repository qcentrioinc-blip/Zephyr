import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LetterStrip } from "../components/LetterStrip";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced?: boolean; active?: boolean };

const FACTS = [
  { k: "01", label: "Active", value: "Limonia acidissima-derived extract" },
  { k: "02", label: "Platform", value: "S100 Protein Technology" },
  { k: "03", label: "Focus", value: "Psoriasis-prone skin support" },
  { k: "04", label: "Validation", value: "Phase III clinically validated" },
  { k: "05", label: "Recognition", value: "Cream: NPF Seal of Recognition" },
  { k: "06", label: "System", value: "Lotion defence · Cream intensive" },
] as const;

/**
 * Formulation facts — clinical dossier / specification-board infographic.
 * Typography and grid rules carry the graphic; no images or icons.
 */
export default function ProofBand({ reduced = false, active = true }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!active || reduced || !rootRef.current) return;

      const head = rootRef.current.querySelector(".sil-proof-head");
      const cells = rootRef.current.querySelectorAll(".sil-proof-cell");

      gsap.fromTo(
        head,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
            end: "top 52%",
            scrub: 0.45,
          },
        },
      );

      cells.forEach((cell, index) => {
        gsap.fromTo(
          cell,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: cell,
              start: "top 92%",
              end: "top 62%",
              scrub: 0.4,
            },
          },
        );

        ScrollTrigger.create({
          trigger: cell,
          start: "top 75%",
          end: "bottom 45%",
          onEnter: () => cell.classList.add("is-active"),
          onEnterBack: () => cell.classList.add("is-active"),
          onLeave: () => {
            if (index < cells.length - 1) cell.classList.remove("is-active");
          },
          onLeaveBack: () => cell.classList.remove("is-active"),
        });
      });
    },
    { dependencies: [active, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="sil-proof" aria-label="Clinical formulation facts">
      <div className="sil-proof-shell">
        <header className="sil-proof-head">
          <p className="sil-proof-eyebrow">Partner evaluation</p>
          <LetterStrip as="h2" text="Formulation facts" className="sil-proof-title" />
          <p className="sil-proof-lead">
            Credentials partners typically request when evaluating Alfurin for distribution
            or clinic programs.
          </p>
        </header>

        <ol className="sil-proof-board" aria-label="Formulation specification board">
          {FACTS.map((fact) => (
            <li key={fact.k} className="sil-proof-cell">
              <span className="sil-proof-cell-index" aria-hidden>
                {fact.k}
              </span>
              <span className="sil-proof-cell-label">{fact.label}</span>
              <p className="sil-proof-cell-value">{fact.value}</p>
              <span className="sil-proof-cell-bar" aria-hidden />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
