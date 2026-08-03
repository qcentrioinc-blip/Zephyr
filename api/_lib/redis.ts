import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (redis) return redis;

  const url = process.env["UPSTASH_REDIS_REST_URL"];
  const token = process.env["UPSTASH_REDIS_REST_TOKEN"];
  if (!url || !token) {
    throw new Error("Upstash Redis is not configured");
  }

  redis = new Redis({ url, token });
  return redis;
}

export function otpCodeKey(email: string): string {
  return `otp:code:${email}`;
}

export function otpRateKey(email: string): string {
  return `otp:rate:${email}`;
}

export function otpHourKey(email: string): string {
  return `otp:hour:${email}`;
}

export function otpVerifiedKey(email: string): string {
  return `otp:verified:${email}`;
}

export type OtpRecord = {
  hash: string;
  attempts: number;
};
