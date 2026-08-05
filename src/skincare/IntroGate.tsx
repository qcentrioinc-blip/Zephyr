import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GATE_FLOATS } from "./data";

type Props = {
  onEnter: () => void;
  reduced: boolean;
};

/**
 * Gate: orbit + soft settle around lockup.
 * Images stay straight / front-facing (product-page view) the whole time.
 */
export default function IntroGate({ onEnter, reduced }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const unlocking = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!orbitRef.current) return;
    const orbit = orbitRef.current;
    const items = Array.from(orbit.querySelectorAll<HTMLElement>(".sil-orbit-item"));
    const inners = Array.from(orbit.querySelectorAll<HTMLElement>(".sil-orbit-inner"));

    const rOrbit = Math.min(window.innerWidth * 0.34, 240);
    const rSettle = Math.min(window.innerWidth * 0.17, 122);

    if (reduced) {
      gsap.set(orbit, { rotation: 0 });
      gsap.set(items, { autoAlpha: 0.95, ["--orbit-r" as string]: rSettle, force3D: false });
      gsap.set(inners, { rotation: 0, y: 0, force3D: false });
      return;
    }

    const ctx = gsap.context(() => {
      // force3D:false — WebKit can paint gray shade boxes behind product PNGs on GPU layers
      gsap.set(orbit, { rotation: 0, force3D: false });
      gsap.set(inners, { rotation: 0, y: 0, rotateX: 0, rotateY: 0, force3D: false });
      gsap.set(items, {
        ["--orbit-r" as string]: rOrbit,
        autoAlpha: 0,
        scale: 0.9,
        force3D: false,
      });

      const tl = gsap.timeline();

      tl.to(items, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.75,
        stagger: 0.07,
        ease: "power3.out",
        force3D: false,
      });

      // Orbit ~3s — counter-rotate inners so packs stay upright/straight
      tl.to(orbit, { rotation: 360, duration: 3, ease: "power1.inOut", force3D: false }, 0.3);
      tl.to(inners, { rotation: -360, duration: 3, ease: "power1.inOut", force3D: false }, 0.3);

      // Soft settle near lockup (still straight)
      tl.to(
        items,
        {
          ["--orbit-r" as string]: rSettle,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.04,
          force3D: false,
        },
        "-=0.15",
      );

      // Soft idle — vertical only
      tl.to(
        inners,
        {
          y: (i) => (i % 2 === 0 ? -7 : 7),
          duration: 3.2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: 0.18,
          force3D: false,
        },
        "+=0.08",
      );
    }, orbitRef);

    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const circle = circleRef.current;
    if (!circle) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      gsap.set(circle, {
        xPercent: -50,
        yPercent: -50,
        left: "50%",
        top: "78%",
        x: 0,
        y: 0,
      });
      return;
    }

    gsap.set(circle, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth * 0.58,
      y: window.innerHeight * 0.4,
    });

    const move = (e: MouseEvent) => {
      gsap.to(circle, {
        x: e.clientX,
        y: e.clientY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [reduced]);

  const enter = () => {
    if (unlocking.current) return;
    unlocking.current = true;
    const root = rootRef.current;
    if (!root || reduced) {
      document.body.style.overflow = "";
      onEnter();
      return;
    }

    const items = orbitRef.current?.querySelectorAll(".sil-orbit-item");
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onEnter();
      },
    });
    if (items?.length) {
      tl.to(
        items,
        {
          scale: 0.92,
          autoAlpha: 0,
          stagger: 0.04,
          duration: 0.4,
          ease: "power2.in",
          force3D: false,
        },
        0,
      );
    }
    tl.to(root, { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power4.inOut" }, 0.12);
  };

  return (
    <div
      ref={rootRef}
      className="sil-gate"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      onClick={enter}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          enter();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Click to enter ALFURIN skincare store"
    >
      <div ref={orbitRef} className="sil-orbit" aria-hidden>
        {GATE_FLOATS.map((item, i) => (
          <div
            key={item.src}
            className="sil-orbit-item"
            style={{ ["--orbit-i" as string]: i }}
          >
            <div className="sil-orbit-inner">
              <img src={item.src} alt="" draggable={false} />
            </div>
          </div>
        ))}
      </div>

      <div className="sil-gate-lockup">
        <h1 className="sil-gate-title">ALFURIN ® SKINCARE</h1>
      </div>

      <div ref={circleRef} className="sil-enter-circle" aria-hidden>
        <span>Click to enter!</span>
      </div>
    </div>
  );
}
