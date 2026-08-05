import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Marquee from "./Marquee";
import { openSkincareContact } from "./contactEvents";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced: boolean; active: boolean };

/** Dual system — bark-to-balm story copy + cinematic origin film. */
export default function PinnedSystem({ reduced, active }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active || reduced || !sectionRef.current || !stageRef.current) return;

      const story = stageRef.current.querySelector(".sil-sys-story");
      const cards = stageRef.current.querySelectorAll(".sil-sys-card");
      const media = stageRef.current.querySelector(".sil-sys-media");

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
        .fromTo(
          story,
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, ease: "none" },
          0,
        )
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
    },
    { dependencies: [active, reduced], scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="product-03" className="sil-sys-section" aria-label="System">
      <div ref={stageRef} className="sil-sys-stage">
        <div className="sil-sys-layout">
          <div className="sil-sys-copy">
            <div className="sil-sys-story">
              <h2 className="sil-sys-story-title">From bark to balm.</h2>
              <p className="sil-sys-story-body">
                The heart of Alfurin is a single plant extract — drawn only from the bark of the
                Indian wood apple tree (<em>Limonia acidissima</em>). See where it comes from.
              </p>
            </div>

            <div className="sil-sys-cards">
              <article className="sil-sys-card">
                <h3>Lotion</h3>
                <p>Daily defence & prevention for large areas.</p>
              </article>
              <article className="sil-sys-card">
                <h3>Cream</h3>
                <p>Intensive relief for plaques & overnight care.</p>
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
              src="/skincare/bark-to-balm.mp4"
              poster="/skincare/bark-to-balm-poster.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="From bark to balm — Limonia acidissima origin story"
            />
            <p className="sil-sys-media-caption">Limonia acidissima · From bark to balm</p>
          </div>
        </div>

        <Marquee
          className="sil-sys-marquee"
          items={["LOTION", "CREAM", "SYSTEM", "MOQ", "SWISS", "LIMONIA"]}
          speed="fast"
        />
      </div>
    </section>
  );
}
