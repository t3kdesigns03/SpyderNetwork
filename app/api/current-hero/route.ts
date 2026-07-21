import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { HERO_CAM } from "@/lib/cams";

/**
 * GET /api/current-hero
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns the camId with the most currently-active viewer sessions — the
 * "viewer competition" winner that the featured/hero slot should show.
 *
 * How it's computed:
 *   1. Serve a cached winner if one was computed in the last ~12s (a single
 *      Redis GET) so we don't SCAN on every request under load.
 *   2. On a cache miss, SCAN all live `viewer:{camId}:{sessionId}` keys, tally
 *      the count per camId, and pick the highest. Keys carry a 45s TTL, so the
 *      scan only ever sees genuinely-active sessions — expired viewers vanish
 *      automatically.
 *   3. If there are no active viewers (or Redis is unavailable), fall back to
 *      the hard-coded featured cam so the UI always has a sensible hero.
 *
 * Response: { camId, cached, viewers, fallback }
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_KEY = "hero:current";
const CACHE_TTL_SECONDS = 12; // ~10–15s window to smooth out load
const SCAN_COUNT = 200; // keys per SCAN page

type Redis = ReturnType<typeof getRedis>;

async function computeHero(redis: Redis): Promise<{ camId: string | null; viewers: number }> {
  const counts = new Map<string, number>();

  let cursor = "0";
  do {
    const [next, keys] = await redis.scan(cursor, { match: "viewer:*", count: SCAN_COUNT });
    cursor = String(next);
    for (const key of keys) {
      // key = viewer:{camId}:{sessionId} — camId is the middle segment.
      const firstColon = key.indexOf(":");
      const lastColon = key.lastIndexOf(":");
      if (firstColon === -1 || lastColon <= firstColon) continue;
      const camId = key.slice(firstColon + 1, lastColon);
      if (!camId) continue;
      counts.set(camId, (counts.get(camId) ?? 0) + 1);
    }
  } while (cursor !== "0");

  let winner: string | null = null;
  let max = 0;
  for (const [camId, n] of counts) {
    if (n > max) {
      max = n;
      winner = camId;
    }
  }
  return { camId: winner, viewers: max };
}

export async function GET() {
  const fallback = HERO_CAM.id;

  let redis: Redis;
  try {
    redis = getRedis();
  } catch {
    return NextResponse.json({ camId: fallback, cached: false, viewers: 0, fallback: true });
  }

  try {
    const cached = await redis.get<string>(CACHE_KEY);
    if (cached) {
      return NextResponse.json({ camId: cached, cached: true });
    }

    const { camId, viewers } = await computeHero(redis);
    const winner = camId ?? fallback;

    // Short-lived cache so bursts of requests collapse into one SCAN.
    await redis.set(CACHE_KEY, winner, { ex: CACHE_TTL_SECONDS });

    return NextResponse.json({
      camId: winner,
      cached: false,
      viewers,
      fallback: camId === null,
    });
  } catch {
    return NextResponse.json({ camId: fallback, cached: false, viewers: 0, fallback: true });
  }
}
