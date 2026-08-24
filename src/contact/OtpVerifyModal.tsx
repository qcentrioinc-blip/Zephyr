import { useEffect, useId, useRef, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  email: string;
  otp: string;
  onOtpChange: (value: string) => void;
  onVerify: (e: FormEvent) => void;
  onResend: () => void;
  onClose: () => void;
  loading?: boolean;
  error?: string;
};

/** OTP verification popup for the contact inquiry form. */
export default function OtpVerifyModal({
  open,
  email,
  otp,
  onOtpChange,
  onVerify,
  onResend,
  onClose,
  loading = false,
  error = "",
}: Props) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div
          className="pointer-events-auto fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="presentation"
        >
          <motion.button
            type="button"
            aria-label="Close verification"
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[1] w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3
                  id={titleId}
                  className="font-manrope text-xl font-semibold text-[#113227]"
                >
                  Verify your email
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  We sent a 6-digit code to{" "}
                  <strong className="text-[#113227]">
                    {email}
                  </strong>
                  . Enter it below to unlock the inquiry form.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-[#113227]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={onVerify} className="space-y-4" noValidate>
              <input
                ref={inputRef}
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                value={otp}
                onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code *"
                aria-label="Verification code"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm tracking-[0.35em] text-[#113227] outline-none transition placeholder:text-gray-400 focus:border-[#11BB8A] focus:bg-white focus:ring-2 focus:ring-[#11BB8A]/20"
              />

              {error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#113227] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d281f] disabled:opacity-70"
              >
                {loading ? "Verifying…" : "Verify code"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={onResend}
                className="text-sm font-medium text-[#547A3D] transition hover:text-[#11BB8A] disabled:opacity-70"
              >
                Resend code
              </button>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
