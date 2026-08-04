import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { StoreProduct } from "./data";
import Barcode from "./Barcode";
import { openSkincareContact } from "./contactEvents";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ScanState = "idle" | "scanning" | "purchased";

type Props = {
  product: StoreProduct;
  reduced: boolean;
  active: boolean;
};

/** Pinned product can — parallax scrub, barcode scan → skincare contact drawer. */
export default function PinnedProductCan({ product, reduced, active }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ingsRef = useRef<HTMLUListElement>(null);
  const [scan, setScan] = useState<ScanState>("idle");

  const mirrored = product.id === "cream";

  useGSAP(
    () => {
      if (!active || reduced || !sectionRef.current || !stageRef.current) return;

      const img = imgRef.current;
      const meta = metaRef.current;
      const ings = ingsRef.current?.querySelectorAll("li");
      const flip = mirrored ? -1 : 1;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=130%",
          pin: stageRef.current,
          scrub: 0.55,
          anticipatePin: 1,
        },
      });

      if (img) {
        tl.fromTo(
          img,
          { y: 72, rotate: 4 * flip, scale: 0.9, x: -12 * flip },
          { y: -44, rotate: -3 * flip, scale: 1.08, x: 10 * flip, ease: "none" },
          0,
        );
      }
      if (meta) {
        tl.fromTo(
          meta,
          { y: 36, opacity: 0, x: 18 * flip },
          { y: 0, opacity: 1, x: 0, ease: "none" },
          0.12,
        );
      }
      if (ings?.length) {
        tl.fromTo(
          ings,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, ease: "none" },
          0.22,
        );
      }
    },
    { dependencies: [active, reduced, product.id, mirrored], scope: sectionRef },
  );

  const runScan = () => {
    if (scan !== "idle") return;
    setScan("scanning");
    window.setTimeout(() => {
      setScan("purchased");
      window.setTimeout(() => {
        openSkincareContact({ subject: `Skincare — ALFURIN ${product.name}` });
        setScan("idle");
      }, 600);
    }, 1100);
  };

  return (
    <section
      ref={sectionRef}
      id={`product-${product.num}`}
      className="sil-can-section"
      aria-label={product.name}
    >
      <div ref={stageRef} className="sil-can-stage">
        <div className={`sil-can-grid${mirrored ? " sil-can-grid--mirror" : ""}`}>
          <div className="sil-can-visual">
            <img
              ref={imgRef}
              src={product.image}
              alt={product.name}
              className="sil-can-img"
              draggable={false}
            />
          </div>

          <div className="sil-can-label">
            <div ref={metaRef} className="sil-can-meta">
              <p className="sil-can-ref">REF {product.ref}</p>
              <h2 className="sil-can-name">{product.name}</h2>
              <p className="sil-can-role">{product.role}</p>
              <p className="sil-can-vol">{product.volume}</p>
            </div>

            <table className="sil-nutrition">
              <tbody>
                {product.nutrition.map((row) => (
                  <tr key={row.label}>
                    <th>{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul ref={ingsRef} className="sil-ings">
              {product.ingredients.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            {product.showNpf ? (
              <p className="sil-disclaimer">
                The National Psoriasis Foundation Seal of Recognition does not constitute medical
                advice. Consult a healthcare professional for diagnosis and treatment.
              </p>
            ) : null}

            <div className="sil-scan-row">
              <Barcode interactive onClick={runScan} />
              <motion.button
                type="button"
                className="sil-scan-cta"
                onClick={runScan}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={scan !== "idle"}
              >
                {scan === "idle" && "Click to scan"}
                {scan === "scanning" && "Scanning…"}
                {scan === "purchased" && "Enquiry queued"}
              </motion.button>
            </div>

            <AnimatePresence>
              {scan === "scanning" || scan === "purchased" ? (
                <motion.div
                  className="sil-scan-progress"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="sil-scan-bar"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: scan === "purchased" ? 1 : 0.72 }}
                    transition={{
                      duration: scan === "purchased" ? 0.25 : 1.05,
                      ease: "easeInOut",
                    }}
                  />
                  <p>
                    {scan === "purchased" ? "Purchased · opening enquiry" : "Reading label…"}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
