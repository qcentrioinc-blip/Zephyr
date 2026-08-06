import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PRODUCTS } from "./data";
import { openSkincareContact } from "./contactEvents";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { reduced: boolean; active: boolean };

/** Quiet partner-enquiry panel (no retail receipt metaphor). */
export default function CartFinale({ reduced, active }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!active || reduced || !sectionRef.current) return;
      const bill = sectionRef.current.querySelector(".sil-receipt");
      const talk = sectionRef.current.querySelector(".sil-talk");
      const thumbs = sectionRef.current.querySelectorAll(".sil-receipt-thumb");
      const rows = sectionRef.current.querySelectorAll(".sil-receipt-row");

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            end: "top 36%",
            scrub: 0.45,
          },
        })
        .fromTo(bill, { x: -40, opacity: 0 }, { x: 0, opacity: 1, ease: "none" }, 0)
        .fromTo(talk, { x: 40, opacity: 0 }, { x: 0, opacity: 1, ease: "none" }, 0.05)
        .fromTo(
          thumbs,
          { y: -70, opacity: 0, scale: 0.88 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.08, ease: "none" },
          0.1,
        )
        .fromTo(
          rows,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, ease: "none" },
          0.2,
        );
    },
    { dependencies: [active, reduced], scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="sil-cart" aria-label="Partner enquiry">
      <div className="sil-cart-split">
        <div className="sil-receipt sil-partner-summary">
          <p className="sil-receipt-thanks">ALFURIN range</p>
          <div className="sil-receipt-head">
            <span>Zephyr manufacturing</span>
            <span>B2B</span>
          </div>

          <div className="sil-receipt-thumbs" aria-hidden>
            {PRODUCTS.map((p) => (
              <img
                key={p.id}
                src={p.image}
                alt=""
                className="sil-receipt-thumb"
                draggable={false}
              />
            ))}
          </div>

          <ul className="sil-receipt-list">
            {PRODUCTS.map((p) => (
              <li key={p.id} className="sil-receipt-row">
                <strong>{p.name}</strong>
                <span>{p.role}</span>
              </li>
            ))}
          </ul>

          <p className="sil-receipt-note">
            Discuss availability, distribution, clinic programs, and manufacturing MOQ for the
            dual-SKU system.
          </p>
        </div>

        <div className="sil-talk">
          <h2 className="sil-talk-title">Partner with Zephyr</h2>
          <p className="sil-talk-sub">
            Share your market, volumes, and packaging needs. We will follow up on your company
            email.
          </p>
          <motion.button
            type="button"
            className="sil-cta sil-cta--fill"
            onClick={() => openSkincareContact()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Open partner enquiry
          </motion.button>
        </div>
      </div>
    </section>
  );
}
