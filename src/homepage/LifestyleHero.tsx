import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const VIDEOS = [
  { id: "slide-1", src: "/videos/slide-1.mp4" },
  { id: "slide-2", src: "/videos/slide-2.mp4" },
  { id: "slide-3", src: "/videos/slide-3.mp4" },
] as const;

const FADE_MS = 450;
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

  const revealWhenReady = useCallback((video: HTMLVideoElement, reveal: () => void) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("seeked", onSeeked);
      reveal();
    };

    const onSeeked = () => finish();

    const onReady = () => {
      if (video.currentTime > 0.05) {
        video.addEventListener("seeked", onSeeked);
        video.currentTime = 0;
        return;
      }
      finish();
    };

    if (video.readyState < HAVE_CURRENT_DATA) {
      video.addEventListener("loadeddata", onReady);
      return () => {
        settled = true;
        video.removeEventListener("loadeddata", onReady);
        video.removeEventListener("seeked", onSeeked);
      };
    }

    if (video.currentTime > 0.05) {
      video.addEventListener("seeked", onSeeked);
      try {
        video.currentTime = 0;
      } catch {
        finish();
      }
    } else {
      finish();
    }

    return () => {
      settled = true;
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  /* Hold the current clip until the next one has a decoded frame. */
  useEffect(() => {
    if (index === shownIndex) return;
    const video = videoRefs.current[index];
    if (!video) return;
    return revealWhenReady(video, () => setShownIndex(index));
  }, [index, shownIndex, revealWhenReady]);

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
      setIndex((i) => (i + dir + VIDEOS.length) % VIDEOS.length);
    },
    [playbackAllowed, index, shownIndex],
  );

  const advance = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  /* Play only the visible clip, and only after the entry gate opens. */
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      const active = i === shownIndex && playbackAllowed && index === shownIndex;
      if (active) {
        if (video.paused) void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [shownIndex, index, playbackAllowed]);

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
