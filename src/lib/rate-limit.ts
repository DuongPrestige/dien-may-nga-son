import "server-only";

import { createHash } from "node:crypto";

import { prisma } from "@/src/lib/prisma";

export type RateLimitRule = {
  name: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export const RATE_LIMIT_RULES = {
  leadByIp: { name: "lead:ip", limit: 5, windowSeconds: 10 * 60 },
  leadByPhone: { name: "lead:phone", limit: 3, windowSeconds: 60 * 60 },
  loginByIp: { name: "login:ip", limit: 10, windowSeconds: 15 * 60 },
  loginByEmail: { name: "login:email", limit: 5, windowSeconds: 15 * 60 },
} as const satisfies Record<string, RateLimitRule>;

const CLEANUP_PROBABILITY = 0.02;
const UNKNOWN_CLIENT = "unknown";

type RateLimitRow = {
  count: number;
  reset_at: Date;
  now: Date;
};

type HeaderReader = Pick<Headers, "get">;

/** Identifiers are hashed so raw IPs, phones and emails are never stored. */
function buildKey(rule: RateLimitRule, identifier: string): string {
  const digest = createHash("sha256")
    .update(identifier.trim().toLowerCase())
    .digest("hex")
    .slice(0, 40);

  return `${rule.name}:${digest}`;
}

export function getClientIp(headers: HeaderReader): string {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (forwardedFor) {
    return forwardedFor;
  }

  return headers.get("x-real-ip")?.trim() || UNKNOWN_CLIENT;
}

async function deleteExpiredBuckets(): Promise<void> {
  await prisma.rateLimit.deleteMany({
    where: { resetAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
  });
}

/**
 * Atomically counts one attempt in a fixed window. Fails open on database
 * errors so a rate-limit outage never blocks customers from contacting the store.
 */
export async function consumeRateLimit(
  rule: RateLimitRule,
  identifier: string,
): Promise<RateLimitResult> {
  const key = buildKey(rule, identifier);

  try {
    const rows = await prisma.$queryRaw<RateLimitRow[]>`
      INSERT INTO rate_limits (key, count, reset_at)
      VALUES (${key}, 1, LOCALTIMESTAMP + ${rule.windowSeconds} * INTERVAL '1 second')
      ON CONFLICT (key) DO UPDATE SET
        count = CASE
          WHEN rate_limits.reset_at <= LOCALTIMESTAMP THEN 1
          ELSE rate_limits.count + 1
        END,
        reset_at = CASE
          WHEN rate_limits.reset_at <= LOCALTIMESTAMP
            THEN LOCALTIMESTAMP + ${rule.windowSeconds} * INTERVAL '1 second'
          ELSE rate_limits.reset_at
        END
      RETURNING count, reset_at, LOCALTIMESTAMP AS now`;

    if (Math.random() < CLEANUP_PROBABILITY) {
      void deleteExpiredBuckets().catch((error: unknown) => {
        console.error("Failed to clean up rate limit buckets", error);
      });
    }

    const row = rows[0];

    if (!row) {
      return { allowed: true, retryAfterSeconds: 0 };
    }

    const retryAfterSeconds = Math.max(
      0,
      Math.ceil((row.reset_at.getTime() - row.now.getTime()) / 1000),
    );

    return {
      allowed: row.count <= rule.limit,
      retryAfterSeconds,
    };
  } catch (error) {
    console.error("Rate limit check failed", error);

    return { allowed: true, retryAfterSeconds: 0 };
  }
}

/** Clears a bucket, e.g. the per-email login counter after a successful sign-in. */
export async function resetRateLimit(
  rule: RateLimitRule,
  identifier: string,
): Promise<void> {
  try {
    await prisma.rateLimit.deleteMany({
      where: { key: buildKey(rule, identifier) },
    });
  } catch (error) {
    console.error("Failed to reset rate limit", error);
  }
}

export function formatRetryAfter(seconds: number): string {
  const minutes = Math.max(1, Math.ceil(seconds / 60));

  return `${minutes} phút`;
}
