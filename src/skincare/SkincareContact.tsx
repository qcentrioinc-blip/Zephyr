import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { X } from "lucide-react";
import {
  SKINCARE_OPEN_CONTACT,
  setSkincareContactLock,
  type SkincareContactDetail,
} from "./contactEvents";
import OtpVerifyModal from "../contact/OtpVerifyModal";
import {
  COMPANY_EMAIL_ERROR,
  isCompanyEmail,
  sendOtpRequest,
  verifyOtpRequest,
} from "../contact/companyEmail";
import { LetterStrip } from "../components/LetterStrip";

type Status = "idle" | "loading" | "success" | "error";
type Step = 1 | 2;

const SUBJECT_OPTIONS = [
  { label: "Full range / supply", value: "Alfurin range: distribution / supply enquiry" },
  { label: "Lotion", value: "Alfurin Moisturizing Lotion: distribution enquiry" },
  { label: "Cream", value: "Alfurin Moisturizing Cream: distribution enquiry" },
] as const;

/** Right-side cream contact drawer — OTP-gated like /contact. */
export default function SkincareContact() {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: SUBJECT_OPTIONS[0].value as string,
    message: "",
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

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<SkincareContactDetail>).detail;
      if (detail?.subject) {
        setForm((f) => ({ ...f, subject: detail.subject! }));
      }
      setOpen(true);
    };
    window.addEventListener(SKINCARE_OPEN_CONTACT, onOpen);
    return () => window.removeEventListener(SKINCARE_OPEN_CONTACT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("skincare-drawer-open");
    setSkincareContactLock(true);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !otpModalOpen) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("input,button")?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove("skincare-drawer-open");
      setSkincareContactLock(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, otpModalOpen]);

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
      subject: SUBJECT_OPTIONS[0].value,
      message: "",
    });
  };

  const close = () => {
    setOtpModalOpen(false);
    setOpen(false);
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
        company: form.company || "N/A",
        email: form.email,
        phone: form.phone,
        message: form.message || "N/A",
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

  return (
    <AnimatePresence>
      {open ? (
        <div className="sil-drawer-root" role="presentation">
          <motion.button
            type="button"
            className="sil-drawer-scrim"
            aria-label="Close contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
            onClick={close}
          />
          <motion.aside
            ref={panelRef}
            className="sil-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? undefined : { x: "100%" }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="sil-drawer-head">
              <div>
                <p className="sil-contact-eyebrow">Zephyr distribution</p>
                <LetterStrip
                  as="h2"
                  text="Alfurin partner enquiry"
                  immediate
                  className="sil-drawer-title"
                  id={titleId}
                />
              </div>
              <button type="button" className="sil-drawer-close" onClick={close} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="sil-drawer-body">
              <AnimatePresence mode="wait">
                {step === 2 || status === "success" ? (
                  <motion.div
                    key="ok"
                    className="sil-contact-success"
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    role="status"
                  >
                    <p className="sil-contact-queued">Enquiry received</p>
                    <LetterStrip as="h3" text="We will follow up shortly" immediate />
                    <p>
                      Your Alfurin partner enquiry was received. Our distribution team will reply
                      on your company email within one to two business days.
                    </p>
                    <div className="sil-talk-ctas">
                      <button type="button" className="sil-cta" onClick={resetForm}>
                        Send another
                      </button>
                      <Link to="/" className="sil-cta sil-cta--fill" onClick={close}>
                        Back to Home
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="sil-contact-form"
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <p className="sil-contact-lead">
                      Verify your company email first. Remaining fields unlock after OTP.
                    </p>

                    <div className="sil-email-verify-wrap">
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="Company email *"
                        className="sil-field sil-field--email-verify"
                        aria-invalid={Boolean(emailError)}
                      />
                      <button
                        type="button"
                        onClick={() => void requestOtp()}
                        disabled={otpLoading || !form.email.trim()}
                        className="sil-email-verify-action"
                      >
                        {otpLoading && !otpModalOpen
                          ? "…"
                          : detailsUnlocked
                            ? "Verified"
                            : "Verify"}
                      </button>
                    </div>
                    {emailError ? (
                      <p className="sil-field-error">{emailError}</p>
                    ) : detailsUnlocked ? (
                      <p className="sil-field-hint sil-field-hint--ok">
                        Email verified. Complete your inquiry below.
                      </p>
                    ) : (
                      <p className="sil-field-hint">
                        Business domains only. Click Verify to unlock the form.
                      </p>
                    )}

                    <div className="sil-contact-grid">
                      <input
                        required
                        value={form.firstName}
                        disabled={!detailsUnlocked}
                        onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                        placeholder="First name *"
                        className={`sil-field${detailsUnlocked ? "" : " sil-field--disabled"}`}
                      />
                      <input
                        value={form.lastName}
                        disabled={!detailsUnlocked}
                        onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                        placeholder="Last name"
                        className={`sil-field${detailsUnlocked ? "" : " sil-field--disabled"}`}
                      />
                    </div>
                    <div className="sil-contact-grid">
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        disabled={!detailsUnlocked}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="Phone *"
                        className={`sil-field${detailsUnlocked ? "" : " sil-field--disabled"}`}
                      />
                      <input
                        value={form.company}
                        disabled={!detailsUnlocked}
                        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                        placeholder="Company"
                        className={`sil-field${detailsUnlocked ? "" : " sil-field--disabled"}`}
                      />
                    </div>
                    <select
                      required
                      value={form.subject}
                      disabled={!detailsUnlocked}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className={`sil-field${detailsUnlocked ? "" : " sil-field--disabled"}`}
                      aria-label="Enquiry subject"
                    >
                      {SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <textarea
                      rows={4}
                      value={form.message}
                      disabled={!detailsUnlocked}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Brief: volumes / MOQ, markets, packaging, clinic or retail channel…"
                      className={`sil-field sil-field--area${detailsUnlocked ? "" : " sil-field--disabled"}`}
                    />

                    {formError && <p className="sil-field-error">{formError}</p>}

                    <button
                      type="submit"
                      disabled={status === "loading" || !detailsUnlocked}
                      className="sil-cta sil-cta--fill sil-contact-submit"
                    >
                      {status === "loading" ? "Sending…" : "Send inquiry"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>

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
            tone="skincare"
          />
        </div>
      ) : null}
    </AnimatePresence>
  );
}
