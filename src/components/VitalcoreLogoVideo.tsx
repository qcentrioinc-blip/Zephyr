import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const LOGO_VIDEO = "/videos/Vitalcore_logo.mp4";
const LOGO_STILL = "/brand/vitalcore-logo.svg";

type VitalcoreLogoVideoProps = {
  className?: string;
  /** Clip to play. Defaults to the navbar / lock-screen mark. */
  src?: string;
  /** When false, the clip does not start. */
  play?: boolean;
  /**
   * When false, nothing is shown until the clip is allowed to play.
   * Avoids a still-image flash before the animation.
   */
  still?: boolean;
  /** Fires when the clip finishes, or when playback cannot start. */
  onPlaybackSettled?: () => void;
};

function keyBlack(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const m = Math.max(r, g, b);
    if (m < 16) {
      data[i + 3] = 0;
      continue;
    }
    // Keep the filmed teal. Boosting RGB to "un-premultiply" was washing the
    // mark out on the white navbar. Only the dark fringe fades.
    const alpha = m >= 78 ? 255 : Math.round(((m - 16) / 62) * 255);
    data[i + 3] = alpha;
  }
}

export default function VitalcoreLogoVideo({
  className,
  src = LOGO_VIDEO,
  play = true,
  still = true,
  onPlaybackSettled,
}: VitalcoreLogoVideoProps) {
  const reduced = Boolean(useReducedMotion());
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settledRef = useRef(onPlaybackSettled);
  const [useStill, setUseStill] = useState(reduced);
  settledRef.current = onPlaybackSettled;

  useEffect(() => {
    if (reduced || !play) settledRef.current?.();
  }, [reduced, play]);

  useEffect(() => {
    if (reduced || !play) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      settledRef.current?.();
      return;
    }
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      setUseStill(true);
      settledRef.current?.();
      return;
    }

    const scratch = document.createElement("canvas");
    const sctx = scratch.getContext("2d", { willReadFrequently: true });
    if (!sctx) {
      setUseStill(true);
      settledRef.current?.();
      return;
    }

    let raf = 0;
    let stopped = false;
    let looping = false;
    let painted = false;
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      settledRef.current?.();
    };

    const paint = () => {
      const frameW = video.videoWidth;
      const frameH = video.videoHeight;
      if (video.readyState < 2 || !frameW || !frameH) return;
      if (canvas.width < 2 || canvas.height < 2) return;
      if (scratch.width !== frameW || scratch.height !== frameH) {
        scratch.width = frameW;
        scratch.height = frameH;
      }
      sctx.imageSmoothingEnabled = true;
      sctx.imageSmoothingQuality = "high";
      sctx.drawImage(video, 0, 0, frameW, frameH);
      const frame = sctx.getImageData(0, 0, frameW, frameH);
      const pixels = frame.data;
      let lit = 0;
      for (let i = 0; i < pixels.length; i += 64) {
        if (Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) > 20) lit += 1;
      }
      // The clip opens and closes on black. Don't wipe a painted frame with that.
      if (lit < 8) return;
      keyBlack(pixels);
      sctx.putImageData(frame, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(scratch, 0, 0, canvas.width, canvas.height);
      painted = true;
    };

    // On-screen bitmap is the CSS size × pixel density, never larger than the file.
    // The black key runs on the native frame first so the navbar shrink stays sharp.
    const applySize = () => {
      const frameW = video.videoWidth;
      const frameH = video.videoHeight;
      if (!frameW || !frameH) return;
      const boxW = canvas.clientWidth;
      const boxH = canvas.clientHeight;
      if (boxW < 2 || boxH < 2) return;

      const aspect = frameW / frameH;
      let fittedW = boxW;
      let fittedH = boxW / aspect;
      if (fittedH > boxH) {
        fittedH = boxH;
        fittedW = boxH * aspect;
      }

      const viewScale = window.visualViewport?.scale || 1;
      const pixelsPerCss = (window.devicePixelRatio || 1) * viewScale;
      const limit = Math.min(1, frameW / (fittedW * pixelsPerCss), frameH / (fittedH * pixelsPerCss));
      const w = Math.max(2, Math.round(fittedW * pixelsPerCss * limit));
      const h = Math.max(2, Math.round(fittedH * pixelsPerCss * limit));

      canvas.style.aspectRatio = `${frameW} / ${frameH}`;
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      paint();
    };

    const pump = () => {
      if (stopped) return;
      paint();
      if (video.ended) {
        looping = false;
        finish();
        return;
      }
      if (video.paused) {
        looping = false;
        return;
      }
      raf = requestAnimationFrame(pump);
    };

    const ensureLoop = () => {
      if (stopped || looping) return;
      looping = true;
      pump();
    };

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    let retryTimer = 0;
    let playTries = 0;
    const start = () => {
      if (stopped || video.ended) return;
      if (!video.paused) {
        ensureLoop();
        return;
      }
      const attempt = video.play();
      if (!attempt) {
        ensureLoop();
        return;
      }
      void attempt.then(ensureLoop).catch((err: unknown) => {
        if (stopped || painted || !video.paused) {
          ensureLoop();
          return;
        }
        const name = err instanceof DOMException ? err.name : "";
        if ((name === "AbortError" || name === "NotAllowedError") && playTries < 4) {
          playTries += 1;
          retryTimer = window.setTimeout(start, 400 * playTries);
          return;
        }
        finish();
        setUseStill(true);
      });
    };

    const onPause = () => {
      if (stopped || video.ended || !painted || document.hidden) return;
      looping = false;
      window.clearTimeout(retryTimer);
      retryTimer = window.setTimeout(start, 250);
    };

    let capTimer = 0;
    const armCap = () => {
      window.clearTimeout(capTimer);
      const duration = video.duration;
      const ms =
        Number.isFinite(duration) && duration > 0
          ? Math.min(Math.max(duration * 1000 + 800, 2500), 20000)
          : 12000;
      capTimer = window.setTimeout(() => {
        if (!stopped) finish();
      }, ms);
    };

    const resizeObserver = new ResizeObserver(() => applySize());
    resizeObserver.observe(canvas);

    let resolutionQuery: MediaQueryList | null = null;
    const onResolution = () => {
      resolutionQuery?.removeEventListener("change", onResolution);
      bindResolution();
      applySize();
    };
    const bindResolution = () => {
      resolutionQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      resolutionQuery.addEventListener("change", onResolution);
    };
    bindResolution();

    const onViewport = () => applySize();
    window.visualViewport?.addEventListener("resize", onViewport);
    window.addEventListener("resize", onViewport);

    applySize();
    start();
    if (video.readyState >= 1) armCap();
    video.addEventListener("loadedmetadata", applySize);
    video.addEventListener("loadedmetadata", armCap);
    video.addEventListener("canplay", ensureLoop);
    video.addEventListener("playing", ensureLoop);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", finish);

    const giveUp = window.setTimeout(() => {
      if (stopped || painted || video.currentTime > 0.2) return;
      finish();
      setUseStill(true);
    }, 8000);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(giveUp);
      window.clearTimeout(retryTimer);
      window.clearTimeout(capTimer);
      resizeObserver.disconnect();
      resolutionQuery?.removeEventListener("change", onResolution);
      window.visualViewport?.removeEventListener("resize", onViewport);
      window.removeEventListener("resize", onViewport);
      video.removeEventListener("loadedmetadata", applySize);
      video.removeEventListener("loadedmetadata", armCap);
      video.removeEventListener("canplay", ensureLoop);
      video.removeEventListener("playing", ensureLoop);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", finish);
      video.pause();
    };
  }, [reduced, play, src]);

  if (reduced || useStill || !play) {
    if (!still && !reduced && !useStill) return null;
    return <img src={LOGO_STILL} alt="Vitalcore" className={className} draggable={false} />;
  }

  return (
    <span className="relative inline-flex items-center">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        aria-hidden
        width={1024}
        height={576}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        style={{ opacity: 0 }}
      />
      <canvas
        ref={canvasRef}
        width={1024}
        height={576}
        className={className}
        style={{ aspectRatio: "1024 / 576" }}
        role="img"
        aria-label="Vitalcore"
      />
    </span>
  );
}
