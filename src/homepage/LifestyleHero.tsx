import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const VIDEOS = [
  { id: "slide-1", src: "/videos/slide-1.mp4" },
  { id: "slide-2", src: "/videos/slide-2.mp4" },
  { id: "slide-3", src: "/videos/slide-3.mp4" },
] as const;

const SLIDE_MS = 720;
/** Give up and keep the current picture. Never reveal the next slide on this timer. */
const STAY_MS = 8000;
const HAVE_CURRENT_DATA = 2;

type StillPhase = "off" | "hold" | "go";

type LifestyleHeroProps = {
  /** False while page-lock gate is open — content may load, but videos stay paused. */
  playbackAllowed?: boolean;
};

function slideOf(video: HTMLVideoElement) {
  return video.parentElement;
}

function showIncoming(video: HTMLVideoElement) {
  const slide = slideOf(video);
  if (!slide) return;
  slide.style.visibility = "";
  slide.style.opacity = "1";
}

function hideOutgoing(video: HTMLVideoElement) {
  const slide = slideOf(video);
  if (slide) slide.style.visibility = "hidden";
}

function clearIncoming(videos: Array<HTMLVideoElement | null>) {
  videos.forEach((video) => {
    const slide = video ? slideOf(video) : null;
    if (slide) slide.style.opacity = "";
  });
}

function drawFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement | null) {
  if (!canvas) return false;
  const width = video.videoWidth;
  const height = video.videoHeight;
  if (!width || !height || video.readyState < HAVE_CURRENT_DATA) return false;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return false;
  try {
    ctx.drawImage(video, 0, 0, width, height);
    const pixel = ctx.getImageData(Math.floor(width / 2), Math.floor(height / 2), 1, 1).data;
    if (pixel[3] === 0) return false;
  } catch {
    return false;
  }
  return true;
}

function waitUntilPlaying(started: Promise<void>, video: HTMLVideoElement) {
  return new Promise<void>((resolve, reject) => {
    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
      fn();
    };
    const onPlaying = () => {
      if (video.seeking) return;
      finish(resolve);
    };
    const onError = () => finish(() => reject(new Error("media")));
    const timer = window.setTimeout(() => finish(() => reject(new Error("stay"))), STAY_MS);

    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);
    started.then(
      () => {
        if (!video.paused && !video.seeking && video.readyState >= HAVE_CURRENT_DATA) {
          finish(resolve);
        }
      },
      () => finish(() => reject(new Error("play"))),
    );
    if (!video.paused && !video.seeking && video.readyState >= HAVE_CURRENT_DATA) {
      finish(resolve);
    }
  });
}

export default function LifestyleHero({
  playbackAllowed = true,
}: LifestyleHeroProps) {
  const [index, setIndex] = useState(0);
  const [stillPhase, setStillPhase] = useState<StillPhase>("off");
  const [stillDir, setStillDir] = useState<1 | -1>(1);
  const reduceMotion = Boolean(useReducedMotion());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const stillRef = useRef<HTMLCanvasElement>(null);
  const indexRef = useRef(0);
  const busy = useRef(false);
  const runRef = useRef(0);
  const leavingFrom = useRef(0);
  const stillPhaseRef = useRef<StillPhase>("off");
  const stillDirRef = useRef<1 | -1>(1);
  const reduceMotionRef = useRef(reduceMotion);
  reduceMotionRef.current = reduceMotion;
  indexRef.current = index;
  stillDirRef.current = stillDir;

  const setPhase = useCallback((phase: StillPhase) => {
    stillPhaseRef.current = phase;
    setStillPhase(phase);
  }, []);

  const finishSlide = useCallback(() => {
    if (stillPhaseRef.current === "off") return;
    const outgoing = videoRefs.current[leavingFrom.current];
    if (outgoing) {
      outgoing.pause();
      hideOutgoing(outgoing);
    }
    const canvas = stillRef.current;
    /* Drop the still while it is still off-screen. Resetting its position first paints the old frame again. */
    if (canvas) {
      canvas.style.transition = "none";
      canvas.style.opacity = "0";
    }
    setPhase("off");
    busy.current = false;
  }, [setPhase]);

  const go = useCallback(
    (dir: number) => {
      if (!playbackAllowed || busy.current) return;
      const from = indexRef.current;
      const to = (from + dir + VIDEOS.length) % VIDEOS.length;
      const next = videoRefs.current[to];
      const current = videoRefs.current[from];
      if (!next || !current) return;

      busy.current = true;
      const run = ++runRef.current;

      /* Opacity 0 clips never reach `playing` on iPhone. Unhide before play(). */
      showIncoming(next);
      if (next.readyState === 0) next.load();
      if (next.currentTime > 0.05) {
        try {
          next.currentTime = 0;
        } catch {
          /* iOS can reject a seek before the first frame exists */
        }
      }
      const started = next.play();

      void (async () => {
        try {
          await waitUntilPlaying(started, next);
          if (run !== runRef.current) return;
          if (next.paused || next.readyState < HAVE_CURRENT_DATA) {
            throw new Error("not playing");
          }

          leavingFrom.current = from;
          indexRef.current = to;
          const drawn = !reduceMotionRef.current && drawFrame(current, stillRef.current);
          clearIncoming(videoRefs.current);

          if (!drawn) {
            setIndex(to);
            window.requestAnimationFrame(() => {
              if (run !== runRef.current) return;
              current.pause();
              try {
                current.currentTime = 0;
              } catch {
                /* ignore */
              }
              busy.current = false;
            });
            return;
          }

          setStillDir(dir > 0 ? 1 : -1);
          setPhase("hold");
          setIndex(to);
        } catch {
          if (run !== runRef.current) return;
          if (!next.paused) next.pause();
          clearIncoming(videoRefs.current);
          busy.current = false;
        }
      })();
    },
    [playbackAllowed, setPhase],
  );

  useEffect(() => {
    if (stillPhase !== "hold") return;
    const canvas = stillRef.current;
    const outgoing = videoRefs.current[leavingFrom.current];
    const start = () => {
      if (stillPhaseRef.current !== "hold" || !canvas) return;
      outgoing?.pause();
      const width = canvas.getBoundingClientRect().width || canvas.offsetWidth;
      const shift = stillDirRef.current > 0 ? -width : width;
      canvas.style.transform = `translate3d(${shift}px, 0, 0)`;
      setPhase("go");
    };
    /* Hold is already painted. A timer covers browsers that skip this frame callback. */
    const frame = window.requestAnimationFrame(start);
    const timer = window.setTimeout(start, 48);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [stillPhase, setPhase]);

  useEffect(() => {
    if (stillPhase !== "off") return;
    const canvas = stillRef.current;
    if (!canvas) return;
    canvas.style.transform = "";
    canvas.style.opacity = "";
    canvas.style.transition = "";
    const outgoing = videoRefs.current[leavingFrom.current];
    if (outgoing && outgoing !== videoRefs.current[indexRef.current]) {
      try {
        outgoing.currentTime = 0;
      } catch {
        /* a hidden clip can reject a seek before its next visit */
      }
    }
  }, [stillPhase]);

  useEffect(() => {
    if (stillPhase !== "go") return;
    const id = window.setTimeout(finishSlide, SLIDE_MS + 120);
    return () => window.clearTimeout(id);
  }, [stillPhase, finishSlide]);

  useEffect(() => {
    if (!playbackAllowed) {
      runRef.current += 1;
      busy.current = false;
      setPhase("off");
      videoRefs.current.forEach((video) => video?.pause());
      return;
    }
    const video = videoRefs.current[index];
    if (video?.paused) void video.play().catch(() => {});
  }, [playbackAllowed, index, setPhase]);

  useEffect(() => {
    const video = videoRefs.current[index];
    if (!video || !playbackAllowed) return;
    const onEnded = () => go(1);
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [index, playbackAllowed, go]);

  useEffect(() => {
    const onVisibility = () => {
      const video = videoRefs.current[indexRef.current];
      if (!video || !playbackAllowed || busy.current) return;
      if (document.hidden) video.pause();
      else void video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [playbackAllowed]);

  useEffect(() => {
    const refs = videoRefs.current;
    return () => {
      runRef.current += 1;
      refs.forEach((video) => video?.pause());
    };
  }, []);

  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

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
            className={`lifestyle-hero__slide${i === index ? " is-shown" : ""}`}
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

        <canvas
          ref={stillRef}
          className={`lifestyle-hero__still${stillPhase === "hold" ? " is-hold" : ""}${stillPhase === "go" ? " is-go" : ""}`}
          aria-hidden
          onTransitionEnd={(event) => {
            if (event.propertyName !== "transform") return;
            if (event.target !== event.currentTarget) return;
            finishSlide();
          }}
        />

        <div
          className="lifestyle-hero__dots"
          role="tablist"
          aria-label="Video progress"
        >
          {VIDEOS.map((v, i) => (
            <span
              key={v.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Video ${i + 1} of ${VIDEOS.length}`}
              className={`lifestyle-hero__dot${i === index ? " is-active" : ""}`}
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
