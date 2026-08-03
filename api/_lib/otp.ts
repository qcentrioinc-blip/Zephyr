import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export const OTP_TTL_SECONDS = 10 * 60;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_MAX_SENDS_PER_HOUR = 5;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_VERIFIED_TTL_SECONDS = 15 * 60;

export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashOtp(otp: string, email: string): string {
  const secret = process.env["OTP_SECRET"]?.trim();
  if (!secret) {
    throw new Error("OTP_SECRET is not configured");
  }
  return createHmac("sha256", secret)
    .update(`${email}:${otp}`)
    .digest("hex");
}

export function safeEqualHex(a: string, b: string): boolean {
  try {
    const left = Buffer.from(a, "hex");
    const right = Buffer.from(b, "hex");
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}
