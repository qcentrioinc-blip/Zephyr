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

async function postJson<T>(
  url: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; data: T }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, data };
}

const SUBJECT_OPTIONS = [
  { label: "Full range / MOQ", value: "Skincare — ALFURIN range / MOQ" },
  { label: "Lotion", value: "Skincare — ALFURIN Moisturizing Lotion" },
  { label: "Cream", value: "Skincare — ALFURIN Moisturizing Cream" },
] as const;

/** Right-side cream contact drawer — same OTP flow as /contact. */
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
  const [otpSent, setOtpSent] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<Status>("idle");

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
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("input,button")?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove("skincare-drawer-open");
      setSkincareContactLock(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const resetForm = () => {
    setStatus("idle");
    setStep(1);
    setOtp("");
    setOtpSent(false);
    setVerifiedEmail("");
    setEmailError("");
    setFormError("");
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

  const close = () => setOpen(false);

  const validateDetails = (): boolean => {
    setFormError("");
    setEmailError("");
    if (!form.firstName.trim() || !form.phone.trim()) {
      setFormError("Please complete your name and phone to continue.");
      setStatus("error");
      return false;
    }
    if (!isCompanyEmail(form.email)) {
      setEmailError(
        "Please use a company email address. Free domains (Gmail, Yahoo, Outlook, etc.) are not accepted.",
      );
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

  const requestOtp = async () => {
    if (!validateDetails()) return;
    setStatus("loading");
    setFormError("");
    try {
      const { ok, data } = await postJson<{ error?: string }>("/api/send-otp", {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
      });
      if (!ok) {
        setStatus("error");
        setFormError(data.error || "Could not send verification code.");
        return;
      }
      setOtp("");
      setOtpSent(true);
      setVerifiedEmail(form.email.trim().toLowerCase());
      setStatus("idle");
    } catch {
      setStatus("error");
      setFormError("Could not reach verification service. Please try again.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!otpSent || verifiedEmail !== form.email.trim().toLowerCase()) {
      await requestOtp();
      return;
    }
    setFormError("");
    if (!/^\d{6}$/.test(otp.trim())) {
      setFormError("Enter the 6-digit verification code from your email.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const { ok, data } = await postJson<{ error?: string }>("/api/verify-otp", {
        email: form.email.trim(),
        otp: otp.trim(),
      });
      if (!ok) {
        setStatus("error");
        setFormError(data.error || "Verification failed.");
        return;
      }
      await sendEnquiry();
    } catch {
      setStatus("error");
      setFormError("Could not verify or send your inquiry. Please try again.");
    }
  };

  const showOtpField = otpSent && verifiedEmail === form.email.trim().toLowerCase();

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
                <p className="sil-contact-eyebrow">Get in touch</p>
                <h2 id={titleId} className="sil-drawer-title">
                  ALFURIN enquiry
                </h2>
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
                    <p className="sil-contact-queued">Enquiry queued</p>
                    <h3>Thanks — we&apos;ll be in touch</h3>
                    <p>
                      Your ALFURIN / skincare inquiry was received. Our team will follow up on your
                      company email within one to two business days.
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
                      Company email required. Same secure OTP flow as Zephyr contact.
                    </p>
                    <div className="sil-contact-grid">
                      <input
                        required
                        value={form.firstName}
                        onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                        placeholder="First name *"
                        className="sil-field"
                      />
                      <input
                        value={form.lastName}
                        onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                        placeholder="Last name"
                        className="sil-field"
                      />
                    </div>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        const next = e.target.value;
                        setForm((f) => ({ ...f, email: next }));
                        if (emailError) setEmailError("");
                        if (otpSent && next.trim().toLowerCase() !== verifiedEmail) {
                          setOtp("");
                          setOtpSent(false);
                          setVerifiedEmail("");
                        }
                      }}
                      placeholder="Company email *"
                      className="sil-field"
                    />
                    {emailError ? (
                      <p className="sil-field-error">{emailError}</p>
                    ) : (
                      <p className="sil-field-hint">
                        Business domains only. Free mail providers are blocked.
                      </p>
                    )}
                    <div className="sil-contact-grid">
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="Phone *"
                        className="sil-field"
                      />
                      <input
                        value={form.company}
                        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                        placeholder="Company"
                        className="sil-field"
                      />
                    </div>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className="sil-field"
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
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Project brief — volumes / MOQ, markets, packaging…"
                      className="sil-field sil-field--area"
                    />

                    {showOtpField && (
                      <div className="sil-otp">
                        <p>
                          We sent a 6-digit code to <strong>{form.email.trim()}</strong>. Enter it
                          below to verify and send.
                        </p>
                        <input
                          required
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          pattern="\d{6}"
                          maxLength={6}
                          value={otp}
                          onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                          }
                          placeholder="6-digit code *"
                          className="sil-field sil-field--otp"
                          aria-label="Verification code"
                        />
                        <button
                          type="button"
                          disabled={status === "loading"}
                          onClick={() => void requestOtp()}
                          className="sil-otp-resend"
                        >
                          Resend code
                        </button>
                      </div>
                    )}

                    {formError && <p className="sil-field-error">{formError}</p>}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="sil-cta sil-cta--fill sil-contact-submit"
                    >
                      {status === "loading"
                        ? showOtpField
                          ? "Verifying…"
                          : "Sending code…"
                        : showOtpField
                          ? "Verify & send inquiry"
                          : "Send verification code"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
