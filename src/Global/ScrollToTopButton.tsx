import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const SHOW_AFTER_PX = 420;

/** Fixed bottom-right control to smoothly return to the top of the page. */
export default function ScrollToTopButton() {
  const reduceMotion = Boolean(useReducedMotion());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          key="scroll-top"
          initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.94 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollUp}
          aria-label="Scroll to top"
          className="fixed bottom-5 right-5 z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-[#113227] text-white shadow-[0_8px_24px_rgba(17,50,39,0.28)] transition hover:bg-[#0d281f] hover:shadow-[0_10px_28px_rgba(17,50,39,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11BB8A] focus-visible:ring-offset-2 sm:bottom-6 sm:right-6 sm:h-12 sm:w-12"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.25} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
