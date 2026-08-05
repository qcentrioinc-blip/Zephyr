import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import emailjs from "@emailjs/browser";
import { Home } from "lucide-react";
import { H2, H3, P } from "../Global/Typography/Typo";
import CelebrationBurst from "../Global/CelebrationBurst";
import OtpVerifyModal from "./OtpVerifyModal";
import {
  COMPANY_EMAIL_ERROR,
  isCompanyEmail,
  sendOtpRequest,
  verifyOtpRequest,
} from "./companyEmail";

type Status = "idle" | "loading" | "success" | "error";
type Step = 1 | 2;

const STEP_LABELS: Record<Step, string> = {
  1: "Inquiry",
  2: "Confirmation",
};

const Content = () => {
  const [params] = useSearchParams();
  const reduceMotion = Boolean(useReducedMotion());
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
  const [otp, setOtp] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [otpLoading, setOtpLoading] = useState(false);

  const detailsUnlocked =
    emailVerified && verifiedEmail === form.email.trim().toLowerCase();

  const resetOtpGate = () => {
    setOtp("");
    setOtpModalOpen(false);
    setEmailVerified(false);
    setVerifiedEmail("");
    setOtpError("");
  };

  const resetForm = () => {
    setStatus("idle");
    setStep(1);
    resetOtpGate();
    setEmailError("");
    setFormError("");
    setOtpLoading(false);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    });
  };

  const handleEmailChange = (next: string) => {
    setForm((f) => ({ ...f, email: next }));
    if (emailError) setEmailError("");
    if (emailVerified || otpModalOpen) {
      resetOtpGate();
    }
  };

  const requestOtp = async () => {
    setFormError("");
    setEmailError("");
    setOtpError("");

    if (!isCompanyEmail(form.email)) {
      setEmailError(COMPANY_EMAIL_ERROR);
      setStatus("error");
      return false;
    }

    setOtpLoading(true);
    try {
      const { ok, data } = await sendOtpRequest(form.email);
      if (!ok) {
        setEmailError(data.error || "Could not send verification code.");
        setStatus("error");
        return false;
      }
      setOtp("");
      setVerifiedEmail(form.email.trim().toLowerCase());
      setEmailVerified(false);
      setOtpModalOpen(true);
      setStatus("idle");
      return true;
    } catch {
      setEmailError("Could not reach verification service. Please try again.");
      setStatus("error");
      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyClick = async () => {
    await requestOtp();
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setOtpError("");
    if (!/^\d{6}$/.test(otp.trim())) {
      setOtpError("Enter the 6-digit verification code from your email.");
      return;
    }

    setOtpLoading(true);
    try {
      const { ok, data } = await verifyOtpRequest(form.email, otp);
      if (!ok) {
        setOtpError(data.error || "Verification failed.");
        return;
      }
      setEmailVerified(true);
      setVerifiedEmail(form.email.trim().toLowerCase());
      setOtpModalOpen(false);
      setStatus("idle");
    } catch {
      setOtpError("Could not verify code. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const validateDetails = (): boolean => {
    setFormError("");
    setEmailError("");

    if (!detailsUnlocked) {
      setFormError("Please verify your company email before submitting.");
      setStatus("error");
      return false;
    }
    if (!form.firstName.trim() || !form.phone.trim()) {
      setFormError("Please complete your name and phone to continue.");
      setStatus("error");
      return false;
    }
    if (!isCompanyEmail(form.email)) {
      setEmailError(COMPANY_EMAIL_ERROR);
      setStatus("error");
      return false;
    }
    if (!form.subject.trim()) {
      setFormError("Please add a subject for your inquiry.");
      setStatus("error");
      return false;
    }
    return true;
  };

  const sendEnquiry = async () => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setFormError("Email service is not configured. Please try again later.");
      setStatus("error");
      return;
    }

    await emailjs.send(
      serviceId,
      templateId,
      {
        subject: form.subject,
        first_name: form.firstName,
        last_name: form.lastName,
        company: form.company || "—",
        email: form.email,
        phone: form.phone,
        message: form.message || "—",
      },
      { publicKey },
    );
    setStatus("success");
    setStep(2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateDetails()) return;

    setStatus("loading");
    try {
      await sendEnquiry();
    } catch {
      setStatus("error");
      setFormError("Could not send your inquiry. Please try again.");
    }
  };

  const fieldClass =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-[#113227] placeholder:text-gray-400 outline-none transition focus:border-[#11BB8A] focus:bg-white focus:ring-2 focus:ring-[#11BB8A]/20";

  const disabledFieldClass = `${fieldClass} cursor-not-allowed opacity-50`;

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#0d241c]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(17,187,138,0.35), transparent 42%), radial-gradient(circle at 85% 10%, rgba(84,122,61,0.28), transparent 40%)",
        }}
      />
      <img
        src="/Production/production-hero-wide.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="zephyr-container relative z-10 flex min-h-[100dvh] items-start justify-center pt-[calc(var(--zephyr-nav-h)+1.5rem)] pb-12 sm:items-center sm:py-16 sm:pt-[calc(var(--zephyr-nav-h)+2rem)]">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9ad485]">
              Get in touch
            </p>
            <H2 className="text-white">Start a manufacturing inquiry</H2>
            <P className="mx-auto mt-3 max-w-md text-white/65">
              Company email required. We verify your email before unlocking the
              inquiry form.
            </P>
          </div>

          <div className="rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-8">
            <div className="mb-6 flex w-full items-center justify-center gap-2 sm:gap-3">
              {([1, 2] as Step[]).map((n, idx) => (
                <div key={n} className="flex items-center gap-2 sm:gap-2.5">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      step >= n
                        ? "bg-[#11BB8A] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {n}
                  </span>
                  <span
                    className={`hidden whitespace-nowrap text-xs font-semibold sm:inline ${
                      step >= n ? "text-[#113227]" : "text-gray-700"
                    }`}
                  >
                    {STEP_LABELS[n]}
                  </span>
                  {idx < 1 && (
                    <div className="mx-1 h-[2px] w-6 bg-gray-500 sm:mx-2 sm:w-10" />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 2 || status === "success" ? (
                <motion.div
                  key="confirmation"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="py-2 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <CelebrationBurst reduceMotion={reduceMotion} />
                  <H3 className="text-[#113227]">Enquiry received</H3>
                  <P className="mx-auto mt-3 max-w-sm text-gray-600">
                    Thank you for contacting Zephyr. Your manufacturing inquiry
                    has been received. Our team will follow up on your company
                    email within one to two business days.
                  </P>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-full bg-[#113227] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d281f]"
                    >
                      Send another
                    </button>
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-[#113227] transition hover:border-[#11BB8A] hover:text-[#11BB8A]"
                    >
                      <Home className="h-4 w-4" />
                      Back to Home
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <div className="relative">
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="Company email *"
                        className={`${fieldClass} pr-20`}
                        aria-invalid={Boolean(emailError)}
                      />
                      <button
                        type="button"
                        onClick={() => void handleVerifyClick()}
                        disabled={otpLoading || !form.email.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#547A3D] transition hover:text-[#11BB8A] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {otpLoading && !otpModalOpen
                          ? "…"
                          : detailsUnlocked
                            ? "Verified"
                            : "Verify"}
                      </button>
                    </div>
                    {emailError ? (
                      <p className="mt-1.5 text-sm text-red-600">{emailError}</p>
                    ) : detailsUnlocked ? (
                      <p className="mt-1.5 text-xs font-medium text-[#547A3D]">
                        Email verified — you can complete your inquiry below.
                      </p>
                    ) : (
                      <p className="mt-1.5 text-xs text-gray-500">
                        Business domains only. Click Verify to unlock the form.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      required
                      value={form.firstName}
                      disabled={!detailsUnlocked}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          firstName: e.target.value,
                        }))
                      }
                      placeholder="First name *"
                      className={detailsUnlocked ? fieldClass : disabledFieldClass}
                    />
                    <input
                      value={form.lastName}
                      disabled={!detailsUnlocked}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          lastName: e.target.value,
                        }))
                      }
                      placeholder="Last name"
                      className={detailsUnlocked ? fieldClass : disabledFieldClass}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      disabled={!detailsUnlocked}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="Phone *"
                      className={detailsUnlocked ? fieldClass : disabledFieldClass}
                    />
                    <input
                      value={form.company}
                      disabled={!detailsUnlocked}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          company: e.target.value,
                        }))
                      }
                      placeholder="Company"
                      className={detailsUnlocked ? fieldClass : disabledFieldClass}
                    />
                  </div>
                  <input
                    required
                    value={form.subject}
                    disabled={!detailsUnlocked}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="Subject * (e.g. MOQ - Nutraceutical tablets)"
                    className={detailsUnlocked ? fieldClass : disabledFieldClass}
                  />
                  <textarea
                    rows={5}
                    value={form.message}
                    disabled={!detailsUnlocked}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Project brief — dosage format, estimated volumes / MOQ, target markets…"
                    className={`${detailsUnlocked ? fieldClass : disabledFieldClass} resize-none`}
                  />

                  {formError && (
                    <p className="text-sm text-red-600">{formError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading" || !detailsUnlocked}
                    className="mt-2 w-full rounded-full bg-[#113227] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d281f] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "loading" ? "Sending…" : "Send inquiry"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* <P className="mt-6 text-center text-white/40">
            Factory: Plot #168-P5, Vemgal Industrial Area, Kolar · CIN
            U24100KA2019PTC120330
          </P> */}
        </div>
      </div>

      <OtpVerifyModal
        open={otpModalOpen}
        email={form.email.trim()}
        otp={otp}
        onOtpChange={setOtp}
        onVerify={handleVerifyOtp}
        onResend={() => void requestOtp()}
        onClose={() => setOtpModalOpen(false)}
        loading={otpLoading}
        error={otpError}
        tone="global"
      />
    </div>
  );
};

export default Content;
