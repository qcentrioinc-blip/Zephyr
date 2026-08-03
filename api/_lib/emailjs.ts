import { OTP_TTL_SECONDS } from "./otp";

type SendOtpEmailParams = {
  toEmail: string;
  otp: string;
  firstName?: string;
};

export async function sendOtpEmail({
  toEmail,
  otp,
  firstName,
}: SendOtpEmailParams): Promise<void> {
  // Bracket access — Vite SSR can statically replace process.env.VITE_* with undefined
  const env = process.env;
  const serviceId = env["EMAILJS_SERVICE_ID"] || env["VITE_EMAILJS_SERVICE_ID"];
  const templateId = env["EMAILJS_OTP_TEMPLATE_ID"];
  const publicKey = env["EMAILJS_PUBLIC_KEY"] || env["VITE_EMAILJS_PUBLIC_KEY"];
  const privateKey = env["EMAILJS_PRIVATE_KEY"];

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS OTP is not configured");
  }

  const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);
  const timeLabel = expiresAt.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Keys must match EmailJS template vars exactly (case-sensitive): OTP, time, email
  const templateParams: Record<string, string> = {
    OTP: otp,
    otp,
    passcode: otp,
    time: timeLabel,
    email: toEmail,
    to_email: toEmail,
    first_name: firstName || "",
  };

  const body: Record<string, unknown> = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams,
  };

  if (privateKey) {
    body.accessToken = privateKey;
  }

  const response = await fetch(
    "https://api.emailjs.com/api/v1.0/email/send",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    if (response.status === 403 && /non-browser/i.test(detail)) {
      throw new Error(
        "EmailJS blocked server send. Enable API access for non-browser environments in EmailJS → Account → Security."
      );
    }
    if (response.status === 403 && /Private Key/i.test(detail)) {
      throw new Error(
        "EmailJS strict mode requires EMAILJS_PRIVATE_KEY in .env (Account → General → API keys)."
      );
    }
    throw new Error(
      `EmailJS send failed (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }
}
