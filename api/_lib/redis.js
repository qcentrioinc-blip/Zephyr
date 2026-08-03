import { Redis } from "@upstash/redis";

let redis = null;

export function getRedis() {
  if (redis) return redis;

  const url = process.env["UPSTASH_REDIS_REST_URL"];
  const token = process.env["UPSTASH_REDIS_REST_TOKEN"];
  if (!url || !token) {
    throw new Error("Upstash Redis is not configured");
  }

  redis = new Redis({ url, token });
  return redis;
}

export function otpCodeKey(email) {
  return `otp:code:${email}`;
}

export function otpRateKey(email) {
  return `otp:rate:${email}`;
}

export function otpHourKey(email) {
  return `otp:hour:${email}`;
}

export function otpVerifiedKey(email) {
  return `otp:verified:${email}`;
}
