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
      className="fixed bottom-4 left-4 right-4 z-[140] sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-[740px] lg:max-w-[820px]"
      role="dialog"
      aria-label="Privacy and cookie consent"
      initial={reduced ? false : { opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex flex-col gap-3.5 overflow-hidden rounded-[22px] sm:rounded-full border border-white/90 bg-gradient-to-tl from-[#e4f5ed]/95 via-[#f5fbf8]/95 to-white/95 px-6 py-4 shadow-[0_16px_45px_rgba(15,50,38,0.16)] backdrop-blur-md sm:py-4.5 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-7">

        {/* Soft bottom-right ambient gradient glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_90%_90%,rgba(17,187,138,0.18),rgba(20,184,166,0.06)_50%,transparent_80%)]"
          aria-hidden="true"
        />

        {/* Single paragraph with US pharma/CDMO data standard compliance wording */}
        <div className="relative z-10 flex-1">
          <p className="text-[12.5px] leading-relaxed text-[#354f44] sm:text-[13px]">
            <span className="font-semibold text-[#0f3429]">We value your privacy.</span>{" "}
            We use essential cookies to maintain secure sessions, verify company inquiries, and optimize platform performance.
          </p>
        </div>

        {/* Side-by-Side Action Buttons with Pointer Cursor */}
        <div className="relative z-10 flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onAccept}
            className="cursor-pointer inline-flex min-w-[88px] sm:min-w-[96px] items-center justify-center rounded-full border border-[#0a4233] bg-transparent px-4 py-2 text-[13.5px] font-semibold text-[#0a4233] transition-all duration-200 hover:bg-[#0a4233]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11BB8A]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="cursor-pointer inline-flex min-w-[88px] sm:min-w-[96px] items-center justify-center rounded-full bg-[#0a4233] px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#063327] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11BB8A]"
          >
            Accept
          </button>
        </div>

      </div>
    </motion.div>
  );
}
