import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Sticky top progress bar for long pages (Production / R&D).
 */
export default function PageProgress() {
  const [progress, setProgress] = useState(0);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[110] h-[3px] bg-transparent">
      <motion.div
        className="h-full origin-left bg-[#113227]"
        style={{ scaleX: progress }}
      />
    </div>
  );
}
