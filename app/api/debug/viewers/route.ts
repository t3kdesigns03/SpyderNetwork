import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { HERO_CAM } from "@/lib/cams";

/**
 * GET /api/debug/viewers   ⚠️ TEMPORARY — testing only, remove later.
 * ─────────────────────────────────────────────────────────────────────────────
 * Read-only snapshot of the viewer-competition state. Scans all live
 * `viewer:{camId}:{sessionId}` keys, tallies active sessions per camera, and
 * returns them sorted highest-first. Also echoes the current hero (from the
 * `hero:current` cache if present, otherwise the live leader) for easy compare.
 *
 * Does NOT write anything and does NOT affect the cache used by /api/current-hero.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HERO_CACHE_KEY = "hero:current";
const SCAN_COUNT = 200;

export async function GET() {
  let redis: ReturnType<typeof getRedis>;
  try {
    redis = getRedis();
  } catch {
    return NextResponse.json({ error: "redis unavailable" }, { status: 503 });
  }

  try {
    // Tally active sessions per camId.
    const counts = new Map<string, number>();
    let cursor = "0";
    do {
      const [next, keys] = await redis.scan(cursor, { match: "viewer:*", count: SCAN_COUNT });
      cursor = String(next);
      for (const key of keys) {
        const firstColon = key.indexOf(":");
        const lastColon = key.lastIndexOf(":");
        if (firstColon === -1 || lastColon <= firstColon) continue;
        const camId = key.slice(firstColon + 1, lastColon);
        if (!camId) continue;
        counts.set(camId, (counts.get(camId) ?? 0) + 1);
      }
    } while (cursor !== "0");

    const cameras = [...counts.entries()]
      .map(([camId, viewers]) => ({ camId, viewers }))
      .sort((a, b) => b.viewers - a.viewers);

    const totalActiveViewers = cameras.reduce((sum, c) => sum + c.viewers, 0);

    // Current hero: prefer the cached value that /api/current-hero serves; else
    // the live leader; else the hard-coded featured cam.
    const cachedHero = await redis.get<string>(HERO_CACHE_KEY);
    const currentHero = cachedHero ?? cameras[0]?.camId ?? HERO_CAM.id;

    return NextResponse.json({
      totalActiveViewers,
      cameras,
      currentHero,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "scan failed" }, { status: 500 });
  }
}
