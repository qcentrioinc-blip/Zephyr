import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const KEY_PREFIX = "zephyr:scroll:";

function storageKey(pathname: string) {
  return `${KEY_PREFIX}${pathname}`;
}

function readSaved(pathname: string): number {
  try {
    const raw = sessionStorage.getItem(storageKey(pathname));
    const y = Number(raw);
    return Number.isFinite(y) && y > 0 ? y : 0;
  } catch {
    return 0;
  }
}

function writeSaved(pathname: string, y: number) {
  try {
    sessionStorage.setItem(storageKey(pathname), String(Math.max(0, Math.round(y))));
  } catch {
    /* private mode / quota */
  }
}

function clearPending() {
  document.documentElement.classList.remove("scroll-restore-pending");
}

function markPending() {
  document.documentElement.classList.add("scroll-restore-pending");
}

/**
 * - Refresh / first load: restore last scroll for this path without flashing the top.
 * - In-app route change: scroll to top.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const previousPathname = useRef<string | null>(null);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Persist scroll while the user moves through the page.
  useEffect(() => {
    let raf = 0;
    const persist = () => writeSaved(pathname, window.scrollY || window.pageYOffset || 0);
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(persist);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", persist);
    window.addEventListener("beforeunload", persist);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", persist);
      window.removeEventListener("beforeunload", persist);
      persist();
    };
  }, [pathname]);

  useLayoutEffect(() => {
    const isClientNav =
      previousPathname.current !== null && previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (isClientNav) {
      clearPending();
      window.scrollTo(0, 0);
      writeSaved(pathname, 0);
      return;
    }

    const target = readSaved(pathname);
    if (target <= 0) {
      clearPending();
      return;
    }

    // Hide until we sit at the saved offset (avoids hero → section jump).
    markPending();
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 90;

    const apply = () => {
      if (cancelled) return;
      window.scrollTo(0, target);
      attempts += 1;

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const clamped = Math.min(target, maxScroll);
      const closeEnough = Math.abs((window.scrollY || 0) - clamped) <= 2;
      const pageTallEnough = maxScroll >= target - 8 || attempts > 45;

      if ((closeEnough && pageTallEnough) || attempts >= maxAttempts) {
        window.scrollTo(0, clamped);
        // One more frame so layout settles, then reveal.
        requestAnimationFrame(() => {
          if (!cancelled) {
            window.scrollTo(0, Math.min(target, Math.max(0, document.documentElement.scrollHeight - window.innerHeight)));
            clearPending();
          }
        });
        return;
      }

      requestAnimationFrame(apply);
    };

    apply();

    const onLoad = () => {
      if (!cancelled) apply();
    };
    window.addEventListener("load", onLoad);
    const t1 = window.setTimeout(apply, 50);
    const t2 = window.setTimeout(apply, 150);
    const t3 = window.setTimeout(apply, 400);
    const failSafe = window.setTimeout(() => {
      if (cancelled) return;
      window.scrollTo(0, target);
      clearPending();
    }, 1500);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(failSafe);
    };
  }, [pathname]);

  return null;
}
