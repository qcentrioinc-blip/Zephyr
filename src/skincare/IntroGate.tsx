import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GATE_FLOATS } from "./data";

type Props = {
  onEnter: () => void;
  reduced: boolean;
};

/**
 * Gate: two products flanking the lockup with a soft mirrored float.
 * (Orbit spin looked sparse / uneven with only two SKUs.)
 */
export default function IntroGate({ onEnter, reduced }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const unlocking = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!stageRef.current) return;

    const stage = stageRef.current;
    const items = Array.from(stage.querySelectorAll<HTMLElement>(".sil-orbit-item"));
    const inners = Array.from(stage.querySelectorAll<HTMLElement>(".sil-orbit-inner"));
    const imgs = Array.from(stage.querySelectorAll<HTMLImageElement>("img"));

    const spanX = Math.min(window.innerWidth * 0.28, 250);
    const enterY = 56;

    let cancelled = false;

    const placeFlanking = (spread: number, y = 0) => {
      items.forEach((item, i) => {
        const dir = i === 0 ? -1 : 1;
        gsap.set(item, {
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          x: dir * spread,
          y,
          rotation: 0,
          force3D: false,
        });
      });
    };

    const ctx = gsap.context(() => {
      const run = () => {
        if (cancelled) return;

        gsap.set(inners, { rotation: 0, x: 0, y: 0, scale: 1, force3D: false });

        if (reduced) {
          placeFlanking(spanX, 0);
          gsap.set(items, { autoAlpha: 0.95, scale: 1, force3D: false });
          return;
        }

        placeFlanking(spanX * 0.72, enterY);
        gsap.set(items, { autoAlpha: 0, scale: 0.88, force3D: false });
        gsap.set(inners, {
          rotation: (i) => (i === 0 ? -8 : 8),
          force3D: false,
        });

        const tl = gsap.timeline();

        // Rise into flanking positions beside the lockup
        tl.to(items, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          x: (i) => (i === 0 ? -spanX : spanX),
          duration: 1.05,
          stagger: 0.12,
          ease: "power3.out",
          force3D: false,
        });

        tl.to(
          inners,
          {
            rotation: 0,
            duration: 1.05,
            stagger: 0.12,
            ease: "power3.out",
            force3D: false,
          },
          "<",
        );

        // Soft mirrored float — opposite vertical drift + gentle counter-tilt
        tl.to(
          inners,
          {
            y: (i) => (i === 0 ? -14 : 14),
            rotation: (i) => (i === 0 ? -3.5 : 3.5),
            duration: 3.2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            stagger: {
              each: 0.2,
              from: "start",
            },
            force3D: false,
          },
          "-=0.15",
        );

        // Subtle breathing scale on the wrappers (out of phase)
        tl.to(
          items,
          {
            scale: (i) => (i === 0 ? 1.035 : 0.975),
            duration: 3.2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            stagger: 0.2,
            force3D: false,
          },
          "<",
        );
      };

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
    }, stageRef);

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

    const items = stageRef.current?.querySelectorAll(".sil-orbit-item");
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
          x: (i) => (i === 0 ? "-=48" : "+=48"),
          scale: 0.9,
          autoAlpha: 0,
          stagger: 0.05,
          duration: 0.42,
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
      aria-label="Enter ALFURIN clinical range overview"
    >
      <div ref={stageRef} className="sil-orbit sil-orbit--duo" aria-hidden>
        {GATE_FLOATS.map((item) => (
          <div key={item.className} className={`sil-orbit-item ${item.className}`}>
            <div className="sil-orbit-inner">
              <img src={item.src} alt="" draggable={false} />
            </div>
          </div>
        ))}
      </div>

      <div className="sil-gate-lockup">
        <p className="sil-gate-eyebrow">Zephyr manufacturing</p>
        <h1 className="sil-gate-title">ALFURIN</h1>
        <p className="sil-gate-sub">Care for psoriasis-prone skin</p>
      </div>

      <div ref={circleRef} className="sil-enter-circle" aria-hidden>
        <span>Click to enter!</span>
      </div>
    </div>
  );
}
