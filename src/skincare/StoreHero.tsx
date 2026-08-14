import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PRODUCTS } from "./data";
import { openSkincareContact } from "./contactEvents";
import { LetterStrip } from "../components/LetterStrip";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced: boolean; active: boolean };

/** Only set true after the enter timeline finishes — avoids blank hero on Strict Mode remount. */
let landingIntroPlayed = false;

/**
 * Landing hero — clinical split layout with enter animation on first visit.
 */
export default function StoreHero({ reduced, active }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  // Hide content before first paint so the reveal animation is clean.
  useLayoutEffect(() => {
    if (!active || reduced || !rootRef.current || landingIntroPlayed) return;

    const root = rootRef.current;
    gsap.set(root.querySelector(".sil-land-glow"), { opacity: 0, scale: 0.92 });
    gsap.set(root.querySelector(".sil-land-copy"), { y: 36, opacity: 0 });
    gsap.set(root.querySelectorAll(".sil-land-card"), {
      y: 48,
      opacity: 0,
      force3D: false,
    });
  }, [active, reduced]);

  // Allow enter animation again on the next visit to /skincare
  useLayoutEffect(() => {
    return () => {
      landingIntroPlayed = false;
    };
  }, []);

  useGSAP(
    () => {
      if (!active || !rootRef.current) return;

      const copy = rootRef.current.querySelector(".sil-land-copy");
      const cards = rootRef.current.querySelectorAll(".sil-land-card");
      const glow = rootRef.current.querySelector(".sil-land-glow");
      const targets = [glow, copy, ...cards].filter(Boolean);

      const showStatic = () => {
        gsap.set(targets, {
          clearProps: "transform,opacity,scale",
          opacity: 1,
          y: 0,
          scale: 1,
        });
      };

      if (reduced) {
        showStatic();
        landingIntroPlayed = true;
        return;
      }

      if (landingIntroPlayed) {
        showStatic();
      } else {
        gsap.set(glow, { opacity: 0, scale: 0.92 });
        gsap.set(copy, { y: 36, opacity: 0 });
        gsap.set(cards, { y: 48, opacity: 0, force3D: false });

        gsap
          .timeline({
            onComplete: () => {
              landingIntroPlayed = true;
            },
          })
          .to(glow, { opacity: 1, scale: 1, duration: 1.15, ease: "power2.out" }, 0)
          .to(copy, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0.1)
          .to(
            cards,
            {
              y: 0,
              opacity: 1,
              stagger: 0.14,
              duration: 1,
              ease: "power3.out",
              force3D: false,
            },
            0.22,
          );
      }

      gsap.to(cards, {
        y: -14,
        force3D: false,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    },
    { dependencies: [active, reduced], scope: rootRef },
  );

  const lotion = PRODUCTS[0];
  const cream = PRODUCTS[1];

  return (
    <header ref={rootRef} className="sil-land" aria-label="Alfurin distribution overview">
      <div className="sil-land-glow" aria-hidden />

      <div className="sil-land-shell">
        <div className="sil-land-copy">
          {/* <p className="sil-land-eyebrow">Zephyr distribution · Alfurin</p> */}
          <h1 className="sil-land-title">
            <LetterStrip
              as="span"
              text="A new approach"
              immediate
              className="sil-land-title-line"
            />
            <LetterStrip
              as="span"
              text="to psoriatic skin"
              immediate
              className="sil-land-title-line sil-land-title-line--accent"
            />
          </h1>
          <p className="sil-land-body">
            Alfurin — psoriasis-prone skincare, Zephyr distribution. Dual-action natural-active
            care: lotion for daily large-area defence, cream for intensive plaque sites. Limonia
            acidissima-derived actives and S100 Protein Technology, available through Zephyr for
            US distribution and clinic partners.
          </p>
          <motion.button
            type="button"
            className="sil-cta sil-cta--fill sil-land-cta"
            onClick={() => openSkincareContact()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Partner enquiry
          </motion.button>
        </div>

        <div className="sil-land-products" aria-hidden={false}>
          {lotion ? (
            <article className="sil-land-card sil-land-card--lotion">
              <div className="sil-land-card-media">
                <img
                  src={lotion.image}
                  alt={lotion.name}
                  draggable={false}
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
              <div className="sil-land-card-meta">
                <LetterStrip as="h2" text={lotion.name} className="sil-land-card-name" />
              </div>
            </article>
          ) : null}
          {cream ? (
            <article className="sil-land-card sil-land-card--cream">
              <div className="sil-land-card-media">
                <img
                  src={cream.image}
                  alt={cream.name}
                  draggable={false}
                  decoding="async"
                  loading="lazy"
                />
              </div>
              <div className="sil-land-card-meta">
                <LetterStrip as="h2" text={cream.name} className="sil-land-card-name" />
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </header>
  );
}
