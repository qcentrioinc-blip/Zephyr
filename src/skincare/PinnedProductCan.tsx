import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { StoreProduct } from "./data";
import { openSkincareContact } from "./contactEvents";
import { LetterStrip } from "../components/LetterStrip";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  product: StoreProduct;
  reduced: boolean;
  active: boolean;
};

/** Pinned product can — desktop-only parallax scrub; static below lg. */
export default function PinnedProductCan({ product, reduced, active }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ingsRef = useRef<HTMLUListElement>(null);

  const mirrored = product.id === "cream";

  useGSAP(
    () => {
      if (!active || !sectionRef.current || !stageRef.current) return;

      const img = imgRef.current;
      const meta = metaRef.current;
      const ings = ingsRef.current?.querySelectorAll("li");
      const staticTargets = [img, meta, ...(ings ? Array.from(ings) : [])].filter(Boolean);

      const setStatic = () => {
        gsap.set(staticTargets, {
          clearProps: "transform,opacity,x,y,rotate,scale",
          opacity: 1,
          y: 0,
          x: 0,
          rotate: 0,
          scale: 1,
        });
      };

      if (reduced) {
        setStatic();
        return;
      }

      const mm = gsap.matchMedia();

      // Phone / tablet / iPad Pro: no pin, no scrub — fully static.
      mm.add("(max-width: 1399px)", () => {
        setStatic();
      });

      // Large desktop only: keep existing scroll-pinned motion.
      mm.add("(min-width: 1400px)", () => {
        const flip = mirrored ? -1 : 1;

        const headerOffset = () => {
          const styles = getComputedStyle(document.documentElement);
          const toPx = (value: string) => {
            const raw = value.trim();
            const n = parseFloat(raw);
            if (!Number.isFinite(n)) return 0;
            if (raw.endsWith("rem")) {
              const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
              return n * root;
            }
            return n;
          };
          return (
            toPx(styles.getPropertyValue("--zephyr-nav-h")) +
            toPx(styles.getPropertyValue("--zephyr-crumb-h"))
          );
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => `top top+=${headerOffset()}`,
            end: "+=88%",
            pin: stageRef.current,
            scrub: 0.32,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        if (img) {
          const yFrom = mirrored ? 88 : 108;
          const yTo = mirrored ? 8 : 28;

          tl.fromTo(
            img,
            { y: yFrom, rotate: 4 * flip, scale: 0.76, x: -12 * flip, force3D: false },
            {
              y: yTo,
              rotate: -3 * flip,
              scale: 0.88,
              x: 10 * flip,
              ease: "none",
              force3D: false,
            },
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

        return () => {
          setStatic();
        };
      });

      return () => mm.revert();
    },
    { dependencies: [active, reduced, product.id, mirrored], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={`product-${product.num}`}
      className="sil-can-section"
      aria-label={product.name}
    >
      <div ref={stageRef} className="sil-can-stage">
        <div className={`sil-can-grid${mirrored ? " sil-can-grid--mirror" : ""}`}>
          <div className={`sil-can-visual${mirrored ? " sil-can-visual--cream" : ""}`}>
            <img
              ref={imgRef}
              src={product.image}
              alt={product.name}
              className="sil-can-img"
              draggable={false}
              decoding="async"
              loading="lazy"
              width={360}
              height={690}
            />
          </div>

          <div className="sil-can-label">
            <div ref={metaRef} className="sil-can-meta">
              <p className="sil-can-ref">REF {product.ref}</p>
              <LetterStrip as="h2" text={product.name} className="sil-can-name" />
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

            <div className="sil-scan-row">
              <button
                type="button"
                className="sil-cta"
                onClick={() =>
                  openSkincareContact({
                    subject: `Alfurin ${product.name}: distribution enquiry`,
                  })
                }
              >
                Partner enquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
