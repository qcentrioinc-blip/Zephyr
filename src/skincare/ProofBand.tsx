import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced?: boolean; active?: boolean };

const FACTS = [
  { k: "01", label: "Active", value: "Limonia bark extract" },
  { k: "02", label: "Origin", value: "Swiss formulation" },
  { k: "03", label: "Focus", value: "Psoriasis-prone skin support" },
  { k: "04", label: "Seal", value: "Cream — NPF Seal of Recognition" },
  { k: "05", label: "System", value: "Lotion = defence · Cream = intensive" },
] as const;

/** After Use cases — label facts with scroll-scrub text like other store sections. */
export default function ProofBand({ reduced = false, active = true }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!active || reduced || !rootRef.current) return;

      const eyebrow = rootRef.current.querySelector(".sil-proof-eyebrow");
      const title = rootRef.current.querySelector(".sil-proof-title");
      const lead = rootRef.current.querySelector(".sil-proof-lead");
      const rows = rootRef.current.querySelectorAll(".sil-proof-row");
      const disclaimer = rootRef.current.querySelector(".sil-proof .sil-disclaimer");
      const media = rootRef.current.querySelector(".sil-proof-media");
      const tag = rootRef.current.querySelector(".sil-proof-media-tag");

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 78%",
            end: "top 38%",
            scrub: 0.5,
          },
        })
        .fromTo(
          eyebrow,
          { y: 24, opacity: 0, xPercent: -8 },
          { y: 0, opacity: 1, xPercent: 0, ease: "none" },
          0,
        )
        .fromTo(
          title,
          { y: 48, opacity: 0 },
          { y: 0, opacity: 1, ease: "none" },
          0.05,
        )
        .fromTo(
          lead,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, ease: "none" },
          0.12,
        )
        .fromTo(
          rows,
          { y: 32, opacity: 0, x: -18 },
          { y: 0, opacity: 1, x: 0, stagger: 0.07, ease: "none" },
          0.18,
        )
        .fromTo(
          disclaimer,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, ease: "none" },
          0.42,
        )
        .fromTo(
          media,
          { opacity: 0.25, scale: 1.08, x: 36 },
          { opacity: 1, scale: 1, x: 0, ease: "none" },
          0.08,
        )
        .fromTo(
          tag,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, ease: "none" },
          0.35,
        );
    },
    { dependencies: [active, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="sil-proof" aria-label="Label facts">
      <div className="sil-proof-shell">
        <div className="sil-proof-copy">
          <p className="sil-proof-eyebrow">Calm · Nourish · Protect</p>
          <h2 className="sil-proof-title">Label facts</h2>
          <p className="sil-proof-lead">
            What sits on the pack — formulated for partners who need a clear defence + intensive
            story.
          </p>

          <ul className="sil-proof-rows">
            {FACTS.map((fact) => (
              <li key={fact.k} className="sil-proof-row">
                <span className="sil-proof-num">{fact.k}</span>
                <span className="sil-proof-key">{fact.label}</span>
                <span className="sil-proof-val">{fact.value}</span>
              </li>
            ))}
          </ul>

          <p className="sil-disclaimer">
            Not a substitute for medical advice. For diagnosis and treatment, consult a healthcare
            professional.
          </p>
        </div>

        <div className="sil-proof-media">
          <video
            className="sil-proof-video"
            src="/skincare/proof-mood.mp4"
            poster="/skincare/foliage-mood.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
          <div className="sil-proof-media-veil" aria-hidden />
          <p className="sil-proof-media-tag">Swiss · Limonia</p>
        </div>
      </div>
    </section>
  );
}
