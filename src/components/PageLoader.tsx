import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "framer-motion";
import SpinnerMorph from "@/components/ui/spinner-morph";
import "./pageLoader.css";

const MIN_SPINNER_MS = 1200;

type PageLoaderProps = {
  /** App shell + route content is mounted and ready behind the loader. */
  ready: boolean;
  onEnter: () => void;
};

export default function PageLoader({ ready, onEnter }: PageLoaderProps) {
  const reduced = Boolean(useReducedMotion());
  const rootRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(false);
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
    if (!ready) return;
    const elapsed = Date.now() - mountedAt.current;
    const wait = Math.max(0, MIN_SPINNER_MS - elapsed);
    const t = window.setTimeout(() => setCanEnter(true), wait);
    return () => window.clearTimeout(t);
  }, [ready]);

  useEffect(() => {
    if (!canEnter || reduced) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const move = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };

    move({ clientX: window.innerWidth * 0.58, clientY: window.innerHeight * 0.4 } as MouseEvent);
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [canEnter, reduced]);

  const enter = useCallback(() => {
    if (!canEnter || enteredRef.current) return;
    enteredRef.current = true;
    setExiting(true);
    document.body.style.overflow = "";
    window.setTimeout(onEnter, reduced ? 120 : 420);
  }, [canEnter, onEnter, reduced]);

  useEffect(() => {
    if (!canEnter || reduced) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canEnter, enter, reduced]);

  const coarse =
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  return createPortal(
    <div
      ref={rootRef}
      className={`zephyr-page-loader${canEnter ? " is-ready" : ""}${exiting ? " zephyr-page-loader--exit" : ""}`}
      onClick={canEnter ? enter : undefined}
      onKeyDown={(e) => {
        if (!canEnter) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          enter();
        }
      }}
      role="button"
      tabIndex={canEnter ? 0 : -1}
      aria-label="Click to view Zephyr"
      aria-busy={!canEnter}
    >
      <div className="zephyr-page-loader__spinner" aria-hidden={canEnter}>
        <SpinnerMorph
          size={240}
          fill="#113227"
          bg="transparent"
          rotateDur="6s"
          morphDur="6s"
        />
      </div>

      {canEnter ? (
        <div
          ref={circleRef}
          className="zephyr-page-loader__cursor"
          aria-hidden
          style={
            coarse || reduced
              ? undefined
              : {
                  transform: `translate(${cursor.x}px, ${cursor.y}px) translate(-50%, -50%)`,
                }
          }
        >
          <span>Click to view</span>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
