import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SKINCARE_CONTACT_LOCK,
  type SkincareContactLockDetail,
} from "../contactEvents";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll scoped to /skincare mount lifetime.
 * Pauses while the contact drawer is open so background sections don't scroll.
 */
export function useSkincareLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 0.95,
      smoothWheel: true,
      touchMultiplier: 1.15,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    document.documentElement.classList.add("skincare-lenis");

    const onLock = (e: Event) => {
      const locked = (e as CustomEvent<SkincareContactLockDetail>).detail?.locked;
      if (locked) lenis.stop();
      else lenis.start();
    };
    window.addEventListener(SKINCARE_CONTACT_LOCK, onLock);

    return () => {
      window.removeEventListener(SKINCARE_CONTACT_LOCK, onLock);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      document.documentElement.classList.remove("skincare-lenis");
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ScrollTrigger.refresh();
    };
  }, [enabled]);
}
