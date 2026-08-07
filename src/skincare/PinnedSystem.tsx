import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { openSkincareContact } from "./contactEvents";

type Props = { reduced: boolean; active: boolean };

const EASE = [0.22, 1, 0.36, 1] as const;

/** Dual system — slide-in reveals replay every time the section enters view. */
export default function PinnedSystem({ reduced, active }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = Boolean(useReducedMotion());
  const noMotion = reduced || prefersReduced || !active;

  const inView = useInView(sectionRef, {
    amount: 0.28,
    margin: "0px 0px -8% 0px",
    once: false,
  });

  const show = noMotion || inView;

  return (
    <section
      ref={sectionRef}
      id="product-03"
      className="sil-sys-section"
      aria-label="System"
    >
      <div className="sil-sys-stage">
        <div className="sil-sys-layout">
          <motion.div
            className="sil-sys-copy"
            initial={false}
            animate={
              show
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -36 }
            }
            transition={{ duration: noMotion ? 0 : 0.7, ease: EASE }}
          >
            <div className="sil-sys-story">
              <h2 className="sil-sys-story-title">Two products. One complete system.</h2>
              <p className="sil-sys-story-body">
                Formulated to work together for daily programs: lotion for large-area defence,
                cream for intensive sites. The shared active story is Limonia acidissima extract
                with S100 Protein Technology, manufactured by Zephyr for partners who need a clear
                two-product range story.
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

            <button
              type="button"
              className="sil-cta"
              onClick={() => openSkincareContact()}
            >
              Enquire full range
            </button>
          </motion.div>

          <motion.div
            className="sil-sys-media"
            initial={false}
            animate={
              show
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: 40 }
            }
            transition={{
              duration: noMotion ? 0 : 0.75,
              delay: show && !noMotion ? 0.06 : 0,
              ease: EASE,
            }}
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
