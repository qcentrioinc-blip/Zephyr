import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GATE_FLOATS } from "./data";

type Props = {
  onEnter: () => void;
  reduced: boolean;
};

/**
 * Gate: orbit + soft settle around lockup.
 * Spin runs on an inner wrapper so GSAP never wipes the outer centering transform
 * (that caused first-load orbit positions to break until refresh).
 */
export default function IntroGate({ onEnter, reduced }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const unlocking = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!orbitRef.current || !spinRef.current) return;

    const orbit = orbitRef.current;
    const spin = spinRef.current;
    const items = Array.from(orbit.querySelectorAll<HTMLElement>(".sil-orbit-item"));
    const inners = Array.from(orbit.querySelectorAll<HTMLElement>(".sil-orbit-inner"));
    const imgs = Array.from(orbit.querySelectorAll<HTMLImageElement>("img"));

    // Cardinal positions around the center text; after a full turn land here, then ease outward
    const rStart = Math.min(window.innerWidth * 0.3, 220);
    const rOut = Math.min(window.innerWidth * 0.38, 280);
    // Top, right, bottom, left (relative to center lockup)
    const cardinalAngle = (i: number) => (i * Math.PI) / 2 - Math.PI / 2;

    let cancelled = false;

    const placeItems = (radius: number) => {
      items.forEach((item, i) => {
        const angle = cardinalAngle(i);
        gsap.set(item, {
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          rotation: 0,
          force3D: false,
        });
      });
    };

    const ctx = gsap.context(() => {
      const run = () => {
        if (cancelled) return;

        gsap.set(spin, { rotation: 0, force3D: false });
        gsap.set(inners, { rotation: 0, x: 0, y: 0, force3D: false });
        placeItems(reduced ? rOut : rStart);

        if (reduced) {
          gsap.set(items, { autoAlpha: 0.95, scale: 1, force3D: false });
          return;
        }

        gsap.set(items, { autoAlpha: 0, scale: 0.9, force3D: false });

        const tl = gsap.timeline();

        tl.to(items, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.75,
          stagger: 0.07,
          ease: "power3.out",
          force3D: false,
        });

        // Full turn — ends exactly where they started
        tl.to(
          spin,
          { rotation: 360, duration: 3.6, ease: "power2.inOut", force3D: false },
          0.3,
        );
        tl.to(
          inners,
          { rotation: -360, duration: 3.6, ease: "power2.inOut", force3D: false },
          0.3,
        );

        // Soft drift a bit farther out from the start positions
        tl.to(
          items,
          {
            x: (_i, el) => {
              const i = items.indexOf(el as HTMLElement);
              return Math.cos(cardinalAngle(i)) * rOut;
            },
            y: (_i, el) => {
              const i = items.indexOf(el as HTMLElement);
              return Math.sin(cardinalAngle(i)) * rOut;
            },
            duration: 1.6,
            ease: "power3.out",
            force3D: false,
          },
          "-=1.2",
        );

        tl.to(
          inners,
          {
            y: (i) => (i % 2 === 0 ? -7 : 7),
            duration: 3.4,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            stagger: 0.18,
            force3D: false,
          },
          "-=0.2",
        );
      };

      // First visit: wait for decode so layout matches refresh (cached images)
      const ready = Promise.all(
        imgs.map((img) => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return (
            img.decode?.().catch(() => undefined) ??
            new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            })
          );
        }),
      );

      void ready.then(() => {
        if (cancelled) return;
        requestAnimationFrame(() => requestAnimationFrame(run));
      });
    }, orbitRef);

    return () => {
      cancelled = true;
      ctx.revert();
    };
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
        <div ref={spinRef} className="sil-orbit-spin">
          {GATE_FLOATS.map((item) => (
            <div key={item.src} className="sil-orbit-item">
              <div className="sil-orbit-inner">
                <img src={item.src} alt="" draggable={false} />
              </div>
            </div>
          ))}
        </div>
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
