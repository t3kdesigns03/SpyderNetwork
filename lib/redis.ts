import { Redis } from "@upstash/redis";

/**
 * Shared Upstash Redis (REST) client.
 * ─────────────────────────────────────────────────────────────────────────────
 * The Upstash REST client is stateless HTTP, so a single instance is safely
 * reused across serverless invocations. It's created lazily (on first use)
 * rather than at import time so that `next build` never crashes when the two
 * env vars aren't present in the build environment — they only need to exist at
 * request time (they're set in Netlify).
 *
 * Requires:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */
let client: Redis | null = null;

export function getRedis(): Redis {
  if (!client) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error(
        "Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN environment variables"
      );
    }
    client = new Redis({ url, token });
  }
  return client;
}
