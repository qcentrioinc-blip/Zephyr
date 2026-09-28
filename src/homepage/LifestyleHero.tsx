import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const VIDEOS = [
  { id: "slide-1", src: "/videos/slide-1.mp4" },
  { id: "slide-2", src: "/videos/slide-2.mp4" },
  { id: "slide-3", src: "/videos/slide-3.mp4" },
] as const;

const FADE_MS = 450;
const REVEAL_FALLBACK_MS = 1500;
const HAVE_CURRENT_DATA = 2;

type LifestyleHeroProps = {
  /** False while page-lock gate is open — content may load, but videos stay paused. */
  playbackAllowed?: boolean;
};

export default function LifestyleHero({
  playbackAllowed = true,
}: LifestyleHeroProps) {
  const [index, setIndex] = useState(0);
  const [shownIndex, setShownIndex] = useState(0);
  const reduceMotion = Boolean(useReducedMotion());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const fadeLock = useRef(false);

  const beginClip = useCallback((nextIndex: number) => {
    const showing = videoRefs.current[shownIndex];
    const next = videoRefs.current[nextIndex];
    if (showing && showing !== next) showing.pause();
    if (next) {
      if (next.readyState < HAVE_CURRENT_DATA) next.load();
      if (next.readyState >= HAVE_CURRENT_DATA && next.currentTime > 0.05) {
        try {
          next.currentTime = 0;
        } catch {
          /* iOS can reject a seek before the first frame exists */
        }
      }
      void next.play().catch(() => {});
    }
    setIndex(nextIndex);
  }, [shownIndex]);

  /* Hold the current picture until the next clip has a frame, then crossfade. */
  useEffect(() => {
    if (index === shownIndex) return;
    const video = videoRefs.current[index];
    if (!video) return;

    let settled = false;
    const reveal = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(fallback);
      video.removeEventListener("loadeddata", onFrame);
      video.removeEventListener("canplay", onFrame);
      video.removeEventListener("timeupdate", onFrame);
      video.removeEventListener("seeked", onFrame);
      setShownIndex(index);
    };

    const onFrame = () => {
      if (video.readyState >= HAVE_CURRENT_DATA) reveal();
    };

    const fallback = window.setTimeout(() => {
      void video.play().catch(() => {});
      reveal();
    }, REVEAL_FALLBACK_MS);

    video.addEventListener("loadeddata", onFrame);
    video.addEventListener("canplay", onFrame);
    video.addEventListener("timeupdate", onFrame);
    video.addEventListener("seeked", onFrame);

    if (video.readyState < HAVE_CURRENT_DATA) {
      video.load();
      void video.play().catch(() => {});
    } else if (video.currentTime <= 0.05) {
      reveal();
    }

    return () => {
      settled = true;
      window.clearTimeout(fallback);
      video.removeEventListener("loadeddata", onFrame);
      video.removeEventListener("canplay", onFrame);
      video.removeEventListener("timeupdate", onFrame);
      video.removeEventListener("seeked", onFrame);
    };
  }, [index, shownIndex]);

  useEffect(() => {
    fadeLock.current = true;
    const delay = reduceMotion ? 0 : FADE_MS;
    const id = window.setTimeout(() => {
      fadeLock.current = false;
    }, delay);
    return () => window.clearTimeout(id);
  }, [shownIndex, reduceMotion]);

  const go = useCallback(
    (dir: number) => {
      if (!playbackAllowed || fadeLock.current || index !== shownIndex) return;
      beginClip((index + dir + VIDEOS.length) % VIDEOS.length);
    },
    [playbackAllowed, index, shownIndex, beginClip],
  );

  const advance = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  /* Keep the requested clip playing. Pause the others, including while it is still hidden. */
  useEffect(() => {
    if (!playbackAllowed) {
      videoRefs.current.forEach((video) => video?.pause());
      return;
    }
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        if (video.paused) void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [index, playbackAllowed]);

  useEffect(() => {
    const video = videoRefs.current[shownIndex];
    if (!video || !playbackAllowed || index !== shownIndex) return;
    video.addEventListener("ended", advance);
    return () => video.removeEventListener("ended", advance);
  }, [shownIndex, index, playbackAllowed, advance]);

  useEffect(() => {
    const onVisibility = () => {
      const video = videoRefs.current[shownIndex];
      if (!video || !playbackAllowed || index !== shownIndex) return;
      if (document.hidden) video.pause();
      else void video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [shownIndex, index, playbackAllowed]);

  return (
    <section
      className="lifestyle-hero"
      aria-roledescription="carousel"
      aria-label="Zephyr product videos"
    >
      <div className="lifestyle-hero__frame">
        {VIDEOS.map((video, i) => (
          <div
            key={video.id}
            className={`lifestyle-hero__slide${i === shownIndex ? " is-shown" : ""}`}
          >
            <video
              ref={(node) => {
                videoRefs.current[i] = node;
                if (node) node.setAttribute("webkit-playsinline", "true");
              }}
              className="lifestyle-hero__video"
              src={video.src}
              muted
              playsInline
              preload="auto"
              aria-hidden
            />
          </div>
        ))}

        <div
          className="lifestyle-hero__dots"
          role="tablist"
          aria-label="Video progress"
        >
          {VIDEOS.map((v, i) => (
            <span
              key={v.id}
              role="tab"
              aria-selected={i === shownIndex}
              aria-label={`Video ${i + 1} of ${VIDEOS.length}`}
              className={`lifestyle-hero__dot${i === shownIndex ? " is-active" : ""}`}
            />
          ))}
        </div>

        <div className="lifestyle-hero__arrows" role="group" aria-label="Slide controls">
          <button
            type="button"
            className="lifestyle-hero__arrow"
            onClick={prev}
            aria-label="Previous video"
          >
            <svg viewBox="0 0 40 40" aria-hidden className="lifestyle-hero__arrow-icon">
              <path
                d="M24 12 L16 20 L24 28 M16 20 H28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="lifestyle-hero__arrow"
            onClick={next}
            aria-label="Next video"
          >
            <svg viewBox="0 0 40 40" aria-hidden className="lifestyle-hero__arrow-icon">
              <path
                d="M16 12 L24 20 L16 28 M12 20 H24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
