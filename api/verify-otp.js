import { isCompanyEmail, normalizeEmail } from "./_lib/companyEmail.js";
import { json, setCors } from "./_lib/http.js";
import {
  hashOtp,
  OTP_MAX_ATTEMPTS,
  OTP_VERIFIED_TTL_SECONDS,
  safeEqualHex,
} from "./_lib/otp.js";
import {
  getRedis,
  otpCodeKey,
  otpVerifiedKey,
} from "./_lib/redis.js";

function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export default async function handler(req, res) {
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
    const otpRaw = typeof body.otp === "string" ? body.otp : "";
    const email = normalizeEmail(emailRaw);
    const otp = otpRaw.trim();

    if (!isCompanyEmail(email)) {
      return json(res, 400, {
        error: "Please use a company email address.",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return json(res, 400, { error: "Enter the 6-digit verification code." });
    }

    const redis = getRedis();
    const codeKey = otpCodeKey(email);
    const record = await redis.get(codeKey);

    if (!record?.hash) {
      return json(res, 400, {
        error: "Code expired or not found. Request a new one.",
      });
    }

    const attempts = Number(record.attempts ?? 0) + 1;
    if (attempts > OTP_MAX_ATTEMPTS) {
      await redis.del(codeKey);
      return json(res, 429, {
        error: "Too many attempts. Request a new code.",
      });
    }

    const candidate = hashOtp(otp, email);
    const match = safeEqualHex(candidate, record.hash);

    if (!match) {
      const ttl = await redis.ttl(codeKey);
      const next = { hash: record.hash, attempts };
      if (ttl > 0) {
        await redis.set(codeKey, next, { ex: ttl });
      } else {
        await redis.del(codeKey);
        return json(res, 400, {
          error: "Code expired or not found. Request a new one.",
        });
      }
      return json(res, 400, {
        error: "Incorrect code. Please try again.",
        attemptsRemaining: Math.max(0, OTP_MAX_ATTEMPTS - attempts),
      });
    }

    await redis.del(codeKey);
    await redis.set(otpVerifiedKey(email), "1", {
      ex: OTP_VERIFIED_TTL_SECONDS,
    });

    return json(res, 200, { ok: true, verified: true });
  } catch (err) {
    console.error("verify-otp error:", err);
    return json(res, 500, {
      error: "Could not verify code. Please try again.",
    });
  }
}
