import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { TextRotate } from "@/components/ui/text-rotate";
import "./pageLoader.css";

const MIN_LOADER_MS = 1200;

const ROTATING_TEXTS = [
  "Herbaceutical",
  "Nutraceutical",
  "Organic",
  "Skin-care",
];

type PageLoaderProps = {
  ready: boolean;
  onEnter: () => void;
};

export default function PageLoader({ ready, onEnter }: PageLoaderProps) {
  const reduced = Boolean(useReducedMotion());
  const enteredRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mountedAt = useRef(Date.now());
  const [canEnter, setCanEnter] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduced) {
      video.pause();
      return;
    }

    void video.play().catch(() => {});
  }, [reduced]);

  useEffect(() => {
    return () => {
      videoRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const elapsed = Date.now() - mountedAt.current;
    const wait = Math.max(0, MIN_LOADER_MS - elapsed);
    const t = window.setTimeout(() => setCanEnter(true), wait);
    return () => window.clearTimeout(t);
  }, [ready]);

  useEffect(() => {
    if (!canEnter) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const setFromPoint = (x: number, y: number) => setCursor({ x, y });

    if (isTouch) {
      setFromPoint(window.innerWidth * 0.5, window.innerHeight * 0.78);
      return;
    }

    setFromPoint(window.innerWidth * 0.58, window.innerHeight * 0.4);

    const onMouse = (e: MouseEvent) => setFromPoint(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setFromPoint(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [canEnter]);

  const enter = useCallback(() => {
    if (!canEnter || enteredRef.current) return;
    enteredRef.current = true;
    setExiting(true);
    document.body.style.overflow = "";
    window.setTimeout(onEnter, reduced ? 120 : 420);
  }, [canEnter, onEnter, reduced]);

  useEffect(() => {
    if (!canEnter) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canEnter, enter]);

  return createPortal(
    <div
      className={`zephyr-page-loader${canEnter ? " is-ready" : ""}${exiting ? " zephyr-page-loader--exit" : ""}`}
      onClick={canEnter ? enter : undefined}
      onKeyDown={(e) => {
        if (!canEnter) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          enter();
        }
      }}
      role={canEnter ? "button" : undefined}
      tabIndex={canEnter ? 0 : -1}
      aria-busy={!canEnter}
      aria-label={canEnter ? "Click to enter Zephyr" : undefined}
    >
      <div className="zephyr-page-loader__media" aria-hidden>
        <video
          ref={videoRef}
          className="zephyr-page-loader__video"
          src="/videos/page-lock.mp4"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
        />
        <div className="zephyr-page-loader__overlay" />
      </div>

      <div className="zephyr-page-loader__copy">
        <img
          src="/brand/logo.png"
          alt=""
          className="zephyr-page-loader__logo"
          draggable={false}
        />
        <LayoutGroup>
          <motion.p
            className="zephyr-page-loader__headline"
            layout
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          >
            <motion.span
              className="zephyr-page-loader__lead"
              layout
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
            >
              Partner for
            </motion.span>
            <TextRotate
              texts={ROTATING_TEXTS}
              mainClassName="text-white px-2 sm:px-2 md:px-3 bg-white/15 border border-white/25 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
              auto={!reduced}
            />
          </motion.p>
        </LayoutGroup>
        <p className="zephyr-page-loader__tagline">
          CDMO &amp; private-label manufacturing
        </p>
      </div>

      {canEnter ? (
        <div
          className="zephyr-page-loader__enter-circle-wrap"
          aria-hidden
          style={{
            transform: `translate(${cursor.x}px, ${cursor.y}px) translate(-50%, -50%)`,
          }}
        >
          <motion.div
            className="zephyr-page-loader__enter-circle"
            initial={reduced ? false : { opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              reduced
                ? { duration: 0.2 }
                : { type: "spring", damping: 22, stiffness: 320, mass: 0.85 }
            }
          >
            <span>Click to enter</span>
          </motion.div>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
