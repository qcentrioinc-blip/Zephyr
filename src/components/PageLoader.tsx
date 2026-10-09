import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { TextRotate } from "@/components/ui/text-rotate";
import VitalcoreLogoVideo from "@/components/VitalcoreLogoVideo";
import { retryPlay } from "@/lib/play-video";
import "./pageLoader.css";

const MIN_LOADER_MS = 1200;
/** Leaf travel, then the overlay fade finishes. Homepage appears under a second. */
const ENTER_AFTER_MS = 860;
/** Compact screens have no capsule, so the overlay only needs its fade. */
const COMPACT_EXIT_MS = 280;
const COMPACT_LOCK_QUERY = "(max-width: 1366px)";

const ROTATING_TEXTS = [
  "Herbaceutical",
  "Nutraceutical",
  "Organic",
];

type PageLoaderProps = {
  ready: boolean;
  onEnter: () => void;
};

const ENTER_LEAF = "/brand/enter-leaf.jpg";

export default function PageLoader({ ready, onEnter }: PageLoaderProps) {
  const reduced = Boolean(useReducedMotion());
  const enteredRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(Date.now());
  const [canEnter, setCanEnter] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showLine, setShowLine] = useState(reduced);
  const [logoSettled, setLogoSettled] = useState(reduced);
  const [finePointer] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(pointer: fine)").matches;
  });
  const [compact, setCompact] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(COMPACT_LOCK_QUERY).matches;
  });
  const [holdBackground, setHoldBackground] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia(COMPACT_LOCK_QUERY);
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduced || holdBackground) {
      video.pause();
      return;
    }

    const cancel = retryPlay(video);
    return () => {
      cancel();
      video.pause();
    };
  }, [reduced, holdBackground]);

  useEffect(() => {
    if (!ready) return;
    const elapsed = Date.now() - mountedAt.current;
    const wait = Math.max(0, MIN_LOADER_MS - elapsed);
    const t = window.setTimeout(() => setCanEnter(true), wait);
    return () => window.clearTimeout(t);
  }, [ready]);

  const dismiss = useCallback(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    setExiting(true);
    const compactNow = window.matchMedia(COMPACT_LOCK_QUERY).matches;
    const wait = reduced ? 120 : compactNow ? COMPACT_EXIT_MS : ENTER_AFTER_MS;
    window.setTimeout(onEnter, wait);
  }, [onEnter, reduced]);

  const enter = useCallback(() => {
    if (!canEnter || compact) return;
    dismiss();
  }, [canEnter, compact, dismiss]);

  useEffect(() => {
    if (!compact || !ready || exiting) return;
    if (!reduced && !logoSettled) return;
    dismiss();
  }, [compact, ready, reduced, logoSettled, exiting, dismiss]);

  useEffect(() => {
    if (!canEnter || compact) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canEnter, compact, enter]);

  useEffect(() => {
    if (!canEnter || !finePointer || compact) return;
    const node = cursorRef.current;
    if (!node) return;
    node.style.transform = `translate3d(${window.innerWidth * 0.58}px, ${window.innerHeight * 0.4}px, 0) translate(-50%, -50%)`;
    node.classList.add("is-on");
  }, [canEnter, finePointer, compact]);

  const showEnterCursor = finePointer && !compact;

  const moveCursor = (e: MouseEvent) => {
    const node = cursorRef.current;
    if (!node) return;
    node.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    node.classList.add("is-on");
  };

  return createPortal(
    <div
      className={`zephyr-page-loader${canEnter ? " is-ready" : ""}${exiting ? " zephyr-page-loader--exit" : ""}${compact ? " zephyr-page-loader--compact" : ""}${showEnterCursor ? " has-enter-cursor" : ""}`}
      onMouseMove={showEnterCursor ? moveCursor : undefined}
      onClick={!compact && canEnter ? enter : undefined}
      onKeyDown={(e) => {
        if (compact || !canEnter) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          enter();
        }
      }}
      role={!compact && canEnter ? "button" : undefined}
      tabIndex={!compact && canEnter ? 0 : -1}
      aria-busy={compact ? !exiting : !canEnter}
      aria-label={!compact && canEnter ? "For a better tomorrow" : undefined}
    >
      <div className="zephyr-page-loader__media" aria-hidden>
        <video
          ref={videoRef}
          className="zephyr-page-loader__video"
          src="/videos/page-lock.mp4"
          muted
          loop
          playsInline
          preload={holdBackground ? "none" : "auto"}
        />
        <div className="zephyr-page-loader__overlay" />
      </div>

      {showEnterCursor && canEnter ? (
        <div ref={cursorRef} className="zephyr-page-loader__cursor" aria-hidden>
          <div className="zephyr-page-loader__enter-circle">
            <span>Click to enter</span>
          </div>
        </div>
      ) : null}

      <div className="zephyr-page-loader__copy">
        <VitalcoreLogoVideo
          className="zephyr-page-loader__logo"
          onPlaybackSettled={() => {
            setHoldBackground(false);
            setLogoSettled(true);
            if (!window.matchMedia(COMPACT_LOCK_QUERY).matches) setShowLine(true);
          }}
        />
        {compact ? null : (
        <LayoutGroup>
          <motion.p
            className="zephyr-page-loader__headline"
            initial={false}
            animate={{ opacity: showLine ? 1 : 0, y: showLine ? 0 : 12 }}
            transition={
              reduced ? { duration: 0.2 } : { duration: 0.45, ease: "easeOut" }
            }
            aria-hidden={!showLine}
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
              mainClassName="text-white overflow-hidden justify-center"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
              auto={showLine && !reduced}
            />
          </motion.p>
        </LayoutGroup>
        )}
        {!compact && showLine && canEnter ? (
          <motion.div
            className="zephyr-page-loader__capsule"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0.2 }
                : { type: "spring", damping: 22, stiffness: 320, mass: 0.85 }
            }
            aria-hidden
          >
            <span className="zephyr-page-loader__track">
              <span
                className="zephyr-page-loader__reveal"
                style={{ backgroundImage: `url("${ENTER_LEAF}")` }}
              />
              <span
                className="zephyr-page-loader__capsule-knob"
                style={{ backgroundImage: `url("${ENTER_LEAF}")` }}
              />
              <span className="zephyr-page-loader__capsule-label">FOR A BETTER TOMORROW</span>
            </span>
          </motion.div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
