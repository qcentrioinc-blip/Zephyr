const RETRYABLE = new Set(["AbortError", "NotAllowedError"]);

/**
 * Start a muted clip, and try again if autoplay is blocked or interrupted.
 * Returns a cancel function for the pending retry.
 */
export function retryPlay(
  video: HTMLVideoElement,
  options?: { attempts?: number; shouldStop?: () => boolean },
): () => void {
  const attempts = options?.attempts ?? 5;
  const shouldStop = options?.shouldStop ?? (() => false);
  let timer = 0;
  let n = 0;
  let cancelled = false;

  const kick = () => {
    if (cancelled || shouldStop()) return;
    video.muted = true;
    const attempt = video.play();
    if (!attempt) return;
    void attempt.catch((err: unknown) => {
      if (cancelled || shouldStop() || n >= attempts - 1) return;
      const name = err instanceof DOMException ? err.name : "";
      if (!RETRYABLE.has(name)) return;
      n += 1;
      timer = window.setTimeout(kick, 400 * n);
    });
  };

  kick();
  return () => {
    cancelled = true;
    window.clearTimeout(timer);
  };
}
