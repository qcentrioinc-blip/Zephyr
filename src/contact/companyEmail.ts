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

export function isCompanyEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return false;
  const domain = trimmed.split("@")[1];
  if (!domain) return false;
  return !FREE_EMAIL_DOMAINS.includes(domain);
}

export const COMPANY_EMAIL_ERROR =
  "Please use a company email address. Free domains (Gmail, Yahoo, Outlook, etc.) are not accepted.";

export async function postJson<T>(
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

export async function sendOtpRequest(email: string, firstName = "") {
  return postJson<{ error?: string }>("/api/send-otp", {
    email: email.trim(),
    firstName: firstName.trim(),
  });
}

export async function verifyOtpRequest(email: string, otp: string) {
  return postJson<{ error?: string }>("/api/verify-otp", {
    email: email.trim(),
    otp: otp.trim(),
  });
}
