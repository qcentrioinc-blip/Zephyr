import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isCompanyEmail, normalizeEmail } from "./_lib/companyEmail";
import { sendOtpEmail } from "./_lib/emailjs";
import { json, setCors } from "./_lib/http";
import {
  generateOtp,
  hashOtp,
  OTP_MAX_SENDS_PER_HOUR,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_TTL_SECONDS,
} from "./_lib/otp";
import {
  getRedis,
  otpCodeKey,
  otpHourKey,
  otpRateKey,
  type OtpRecord,
} from "./_lib/redis";

function readBody(req: VercelRequest): Record<string, unknown> {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return req.body as Record<string, unknown>;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = readBody(req);
    const emailRaw = typeof body.email === "string" ? body.email : "";
    const firstName =
      typeof body.firstName === "string" ? body.firstName : "";
    const email = normalizeEmail(emailRaw);

    if (!isCompanyEmail(email)) {
      return json(res, 400, {
        error:
          "Please use a company email address. Free domains are not accepted.",
      });
    }

    const redis = getRedis();
    const rateKey = otpRateKey(email);
    const hourKey = otpHourKey(email);

    const cooldown = await redis.get(rateKey);
    if (cooldown) {
      return json(res, 429, {
        error: "Please wait before requesting another code.",
        retryAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS,
      });
    }

    const hourCount = Number((await redis.get(hourKey)) ?? 0);
    if (hourCount >= OTP_MAX_SENDS_PER_HOUR) {
      return json(res, 429, {
        error: "Too many OTP requests. Try again later.",
      });
    }

    const otp = generateOtp();
    const record: OtpRecord = {
      hash: hashOtp(otp, email),
      attempts: 0,
    };

    // Send first so a failed EmailJS call does not burn rate limits
    await sendOtpEmail({ toEmail: email, otp, firstName });

    await redis.set(otpCodeKey(email), record, { ex: OTP_TTL_SECONDS });
    await redis.set(rateKey, "1", { ex: OTP_RESEND_COOLDOWN_SECONDS });

    if (hourCount === 0) {
      await redis.set(hourKey, 1, { ex: 60 * 60 });
    } else {
      await redis.incr(hourKey);
    }

    return json(res, 200, {
      ok: true,
      expiresInSeconds: OTP_TTL_SECONDS,
      retryAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS,
    });
  } catch (err) {
    console.error("send-otp error:", err);
    const message =
      err instanceof Error && err.message.startsWith("EmailJS")
        ? err.message
        : "Could not send verification code. Please try again.";
    return json(res, 500, { error: message });
  }
}
