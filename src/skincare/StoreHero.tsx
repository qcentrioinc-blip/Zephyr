import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PRODUCTS } from "./data";
import Marquee from "./Marquee";
import { openSkincareContact } from "./contactEvents";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced: boolean; active: boolean };

/** Post-gate landing — lockup + copy/CTA + dual product anchors + marquees. */
export default function StoreHero({ reduced, active }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!active || reduced || !rootRef.current) return;
      const lockup = rootRef.current.querySelector(".sil-hero-lockup");
      const left = rootRef.current.querySelector(".sil-hero-anchor--left");
      const right = rootRef.current.querySelector(".sil-hero-anchor--right");
      const floats = rootRef.current.querySelectorAll(".sil-hero-anchor-float");
      const rule = rootRef.current.querySelector(".sil-hero-rule");

      gsap
        .timeline()
        .fromTo(
          lockup,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.05, ease: "power3.out" },
          0,
        )
        .fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: "power2.out" },
          0.12,
        )
        .fromTo(
          [left, right],
          { opacity: 0, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            stagger: 0.12,
            duration: 1.1,
            ease: "power3.out",
          },
          0.1,
        );

      gsap.to([left, right], {
        y: (i) => (i === 0 ? -32 : 32),
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.45,
        },
      });

      gsap.to(floats, {
        y: (i) => (i === 0 ? -8 : 8),
        duration: 3.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.35,
        delay: 1.2,
      });
    },
    { dependencies: [active, reduced], scope: rootRef },
  );

  const lotion = PRODUCTS[0];
  const cream = PRODUCTS[1];

  return (
    <header ref={rootRef} className="sil-hero" aria-label="ALFURIN store">
      <div className="sil-hero-stage">
        {lotion ? (
          <div className="sil-hero-anchor sil-hero-anchor--left">
            <div className="sil-hero-anchor-float">
              <img src={lotion.image} alt="" draggable={false} />
            </div>
            <p>{lotion.name}</p>
          </div>
        ) : null}
        {cream ? (
          <div className="sil-hero-anchor sil-hero-anchor--right">
            <div className="sil-hero-anchor-float">
              <img src={cream.image} alt="" draggable={false} />
            </div>
            <p>{cream.name}</p>
          </div>
        ) : null}
      </div>

      <div className="sil-hero-lockup">
        <p className="sil-hero-eyebrow">Zephyr × Swiss skincare</p>
        <h1 className="sil-hero-brand">ALFURIN®</h1>
        <div className="sil-hero-rule" aria-hidden />
        <p className="sil-hero-sub">Calm · Nourish · Protect — partner MOQ enquiries</p>
        <p className="sil-hero-body">
          ALFURIN brings a Swiss-formulated dual system for psoriasis-prone skin: a daily lotion for
          large-area defence, and an intensive cream for plaques and overnight care. Built around
          Limonia bark extract and a calm · nourish · protect routine, the range is ready for
          private-label and distribution partners who need a clear MOQ path. Zephyr routes
          enquiries, packaging conversations, and launch volumes through one cream-facing
          storefront — so you can evaluate the system, then move straight.
        </p>
        <motion.button
          type="button"
          className="sil-cta sil-cta--fill sil-hero-cta"
          onClick={() => openSkincareContact()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Enquire MOQ
        </motion.button>
      </div>

      <div className="sil-hero-marquees">
        <Marquee
          items={["welcome", "ALFURIN", "Limonia", "Swiss", "calm · nourish · protect"]}
          speed="med"
        />
        <Marquee
          items={["lotion", "cream", "dual system", "MOQ enquiries"]}
          reverse
          speed="slow"
        />
      </div>
    </header>
  );
}
