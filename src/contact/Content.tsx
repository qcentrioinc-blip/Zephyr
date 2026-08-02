import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { H2, H3, P } from "../Global/Typography/Typo";

const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.in",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "pm.me",
  "aol.com",
  "gmx.com",
  "mail.com",
  "yandex.com",
  "zoho.com",
  "rediffmail.com",
];

function isCompanyEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return false;
  const domain = trimmed.split("@")[1];
  if (!domain) return false;
  return !FREE_EMAIL_DOMAINS.includes(domain);
}

type Status = "idle" | "loading" | "success" | "error";
type Step = 1 | 2;

const Content = () => {
  const [params] = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: params.get("subject") ?? "",
    message: params.get("message") ?? "",
  });
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const goNext = () => {
    setFormError("");
    if (!form.firstName.trim() || !form.phone.trim()) {
      setFormError("Please complete your name and phone to continue.");
      setStatus("error");
      return;
    }
    if (!isCompanyEmail(form.email)) {
      setEmailError(
        "Please use a company email address. Free domains (Gmail, Yahoo, Outlook, etc.) are not accepted."
      );
      setStatus("error");
      return;
    }
    setEmailError("");
    setStatus("idle");
    setStep(2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.subject.trim()) {
      setFormError("Please add a subject for your enquiry.");
      setStatus("error");
      return;
    }
    if (!isCompanyEmail(form.email)) {
      setEmailError(
        "Please use a company email address. Free domains are not accepted."
      );
      setStep(1);
      setStatus("error");
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
  };

  const fieldClass =
    "w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#11BB8A]/50 focus:bg-white/15 focus:ring-2 focus:ring-[#11BB8A]/20";

  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden bg-[#0d241c]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(17,187,138,0.35), transparent 42%), radial-gradient(circle at 85% 10%, rgba(84,122,61,0.28), transparent 40%)",
        }}
      />
      <img
        src="/Production/production-hero-wide.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="zephyr-container relative z-10 flex min-h-[calc(100vh-5rem)] items-center py-16 sm:py-20">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9ad485]">
              Get in touch
            </p>
            <H2 className="text-white">Start a manufacturing enquiry</H2>
            <P className="mx-auto mt-3 max-w-md text-white/65">
              A two-step partnership form. Company email required.
            </P>
          </div>

          <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
            {status === "success" ? (
              <div className="py-6 text-center">
                <H3 className="text-white">Enquiry received</H3>
                <P className="mt-3 text-white/70">
                  Thank you. Our team will follow up on your company email.
                </P>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setStep(1);
                    setForm({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      company: "",
                      subject: "",
                      message: "",
                    });
                  }}
                  className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#113227]"
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center gap-2">
                  {[1, 2].map((n) => (
                    <div key={n} className="flex flex-1 items-center gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                          step >= n
                            ? "bg-[#11BB8A] text-[#0d241c]"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {n}
                      </span>
                      <span className="hidden text-xs text-white/60 sm:inline">
                        {n === 1 ? "Your details" : "Project brief"}
                      </span>
                      {n === 1 && (
                        <div className="h-px flex-1 bg-white/15" />
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <input
                            required
                            value={form.firstName}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                firstName: e.target.value,
                              }))
                            }
                            placeholder="First name *"
                            className={fieldClass}
                          />
                          <input
                            value={form.lastName}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                lastName: e.target.value,
                              }))
                            }
                            placeholder="Last name"
                            className={fieldClass}
                          />
                        </div>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => {
                            setForm((f) => ({ ...f, email: e.target.value }));
                            if (emailError) setEmailError("");
                          }}
                          placeholder="Company email *"
                          className={fieldClass}
                        />
                        {emailError ? (
                          <p className="text-sm text-red-300">{emailError}</p>
                        ) : (
                          <p className="text-xs text-white/45">
                            Business domains only. Free mail providers are blocked.
                          </p>
                        )}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <input
                            required
                            type="tel"
                            value={form.phone}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, phone: e.target.value }))
                            }
                            placeholder="Mobile *"
                            className={fieldClass}
                          />
                          <input
                            value={form.company}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                company: e.target.value,
                              }))
                            }
                            placeholder="Company"
                            className={fieldClass}
                          />
                        </div>
                        {formError && step === 1 && (
                          <p className="text-sm text-red-300">{formError}</p>
                        )}
                        <button
                          type="button"
                          onClick={goNext}
                          className="mt-2 w-full rounded-full bg-white py-3.5 text-sm font-semibold text-[#113227] transition hover:bg-[#EDFAEB]"
                        >
                          Continue
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <input
                          required
                          value={form.subject}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, subject: e.target.value }))
                          }
                          placeholder="Subject * (e.g. MOQ - Nutraceutical tablets)"
                          className={fieldClass}
                        />
                        <textarea
                          rows={5}
                          value={form.message}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, message: e.target.value }))
                          }
                          placeholder="Dosage format, estimated volumes / MOQ, target markets…"
                          className={`${fieldClass} resize-none`}
                        />
                        {formError && step === 2 && (
                          <p className="text-sm text-red-300">{formError}</p>
                        )}
                        <div className="flex gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 rounded-full border border-white/20 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={status === "loading"}
                            className="flex-[1.4] rounded-full bg-[#11BB8A] py-3.5 text-sm font-semibold text-[#0d241c] transition hover:bg-[#14d09a] disabled:opacity-70"
                          >
                            {status === "loading" ? "Sending…" : "Send enquiry"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </>
            )}
          </div>

          <P className="mt-6 text-center text-white/40">
            Factory: Plot #168-P5, Vemgal Industrial Area, Kolar · CIN
            U24100KA2019PTC120330
          </P>
        </div>
      </div>
    </div>
  );
};

export default Content;
