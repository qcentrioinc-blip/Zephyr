import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { openSkincareContact } from "./contactEvents";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced: boolean; active: boolean };

/** Dual system — desktop-only pin/scrub; static below lg. */
export default function PinnedSystem({ reduced, active }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active || !sectionRef.current || !stageRef.current) return;

      const story = stageRef.current.querySelector(".sil-sys-story");
      const cards = stageRef.current.querySelectorAll(".sil-sys-card");
      const media = stageRef.current.querySelector(".sil-sys-media");
      const targets = [story, ...cards, media].filter(Boolean);

      const setStatic = () => {
        gsap.set(targets, {
          clearProps: "transform,opacity,x,y,scale",
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
        });
      };

      if (reduced) {
        setStatic();
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(max-width: 1399px)", () => {
        setStatic();
      });

      mm.add("(min-width: 1400px)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=105%",
              pin: stageRef.current,
              scrub: 0.5,
              anticipatePin: 1,
            },
          })
          .fromTo(story, { y: 32, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0)
          .fromTo(
            cards,
            { y: -80, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, ease: "none" },
            0.2,
          )
          .fromTo(
            media,
            { opacity: 0.35, scale: 1.06, y: 24 },
            { opacity: 1, scale: 1, y: 0, ease: "none" },
            0.1,
          );

        return () => {
          setStatic();
        };
      });

      return () => mm.revert();
    },
    { dependencies: [active, reduced], scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="product-03" className="sil-sys-section" aria-label="System">
      <div ref={stageRef} className="sil-sys-stage">
        <div className="sil-sys-layout">
          <div className="sil-sys-copy">
            <div className="sil-sys-story">
              <h2 className="sil-sys-story-title">Two products. One complete system.</h2>
              <p className="sil-sys-story-body">
                Formulated to work together for daily programs: lotion for large-area defence,
                cream for intensive sites. The shared active story is Limonia acidissima extract
                with S100 Protein Technology, manufactured by Zephyr for partners who need a clear
                dual-SKU narrative.
              </p>
            </div>

            <div className="sil-sys-cards">
              <article className="sil-sys-card">
                <h3>Lotion</h3>
                <p>Daily defence and prevention for large areas.</p>
              </article>
              <article className="sil-sys-card">
                <h3>Cream</h3>
                <p>Intensive relief for plaques and overnight care.</p>
              </article>
            </div>

            <motion.button
              type="button"
              className="sil-cta"
              onClick={() => openSkincareContact()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Enquire full range
            </motion.button>
          </div>

          <div className="sil-sys-media">
            <video
              className="sil-sys-video"
              src="/skincare/dual-system.mp4?v=alfurin"
              poster="/skincare/dual-system-poster.png?v=alfurin"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="ALFURIN dual system film: lotion and cream"
            />
            <p className="sil-sys-media-caption">
              ALFURIN · lotion defence + cream intensive
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
