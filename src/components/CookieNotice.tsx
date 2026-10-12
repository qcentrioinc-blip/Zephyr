import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

type CookieNoticeProps = {
  onAccept: () => void;
};

export default function CookieNotice({ onAccept }: CookieNoticeProps) {
  const reduced = Boolean(useReducedMotion());

  useEffect(() => {
    document.documentElement.classList.add("zephyr-cookie-open");
    return () => document.documentElement.classList.remove("zephyr-cookie-open");
  }, []);

  return (
    <motion.div
      className="fixed bottom-4 left-20 right-4 z-[140] sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-[26rem]"
      role="dialog"
      aria-label="Cookie notice"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_12px_40px_rgba(17,50,39,0.12)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#11BB8A]">
          Essential only
        </p>
        <h2 className="mt-2 font-manrope text-lg font-semibold text-[#113227]">
          Cookies on this site
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Vitalcore uses essential cookies to load the site, remember that you
          have entered, and keep your place while you browse. We do not use
          advertising cookies.
        </p>
        <button
          type="button"
          onClick={onAccept}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-[#113227] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d281f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11BB8A] focus-visible:ring-offset-2"
        >
          Accept
        </button>
      </div>
    </motion.div>
  );
}
