import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { openSkincareContact } from "./contactEvents";
import { LetterStrip } from "../components/LetterStrip";

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
              <LetterStrip
                as="h2"
                text="Two products. One complete system."
                className="sil-sys-story-title"
              />
              <p className="sil-sys-story-body">
                Formulated to work together for daily programs: lotion for large-area defence,
                cream for intensive sites. The shared active story is Limonia acidissima extract
                with S100 Protein Technology. Alfurin is available through Zephyr distribution for
                partners who need a clear two-product range story.
              </p>
            </div>

            <div className="sil-sys-cards">
              <article className="sil-sys-card">
                <LetterStrip as="h3" text="Lotion" />
                <p>Daily defence and prevention for large areas.</p>
              </article>
              <article className="sil-sys-card">
                <LetterStrip as="h3" text="Cream" />
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
            <img
              className="sil-sys-video"
              src="/products/info-img-skincare1.png"
              alt="Alfurin dual system: lotion and cream"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
