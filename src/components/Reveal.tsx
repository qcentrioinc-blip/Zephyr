import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/**
 * Scroll-in reveal tuned for Safari/Mac:
 * - Opacity stays at 1 so nested LetterStrip headings can animate without a parent fade fight.
 * - Subtle Y lift only; large rootMargin for early trigger.
 * - Fallback forces visible only for sections already near the viewport.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 12,
}: RevealProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement>(null);
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;

    const revealIfNear = () => {
      const rect = el.getBoundingClientRect();
      const near =
        rect.top < window.innerHeight + 160 && rect.bottom > -120;
      if (near) setForceVisible(true);
    };

    // Catch Safari IO flakes after first layout / font swap.
    const t1 = window.setTimeout(revealIfNear, 200);
    const t2 = window.setTimeout(revealIfNear, 800);
    window.addEventListener("load", revealIfNear, { once: true });
    void document.fonts?.ready?.then(revealIfNear);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("load", revealIfNear);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 1, y }}
      animate={forceVisible ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: "120px 0px" }}
      transition={{ duration: 0.4, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
