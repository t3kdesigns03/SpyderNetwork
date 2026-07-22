import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { CAMS } from "@/lib/cams";
import { formatDuration } from "@/lib/email";
import { isAuthorized } from "@/lib/authz";

/**
 * GET /api/debug/offline-state   ⚠️ TEMPORARY — monitoring only, remove later.
 * ─────────────────────────────────────────────────────────────────────────────
 * Read-only view of what the offline-alert tracker currently remembers. Scans
 * `offline:since:*`, and for each camera reports how long it's been down, whether
 * an alert has been sent, and when the next alert is due — so you can confirm
 * real (non-test) tracking + alerting is working without waiting on inboxes.
 *
 * Does NOT write anything. These keys are created by the real scheduled check
 * (runOfflineCheck), so if a camera isn't listed here, the tracker hasn't
 * recorded it offline yet.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MINUTE_MS = 60_000;
const OFFLINE_THRESHOLD_MS = 45 * MINUTE_MS; // must match lib/offlineAlerts.ts
const ALERT_COOLDOWN_MS = 24 * 60 * MINUTE_MS;
const SINCE_PREFIX = "offline:since:";
const SCAN_COUNT = 200;

const NAME_BY_ID = new Map(
  CAMS.map((c) => [c.id, c.name ? `${c.business} – ${c.name}` : c.business])
);

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let redis: ReturnType<typeof getRedis>;
  try {
    redis = getRedis();
  } catch {
    return NextResponse.json({ error: "redis unavailable" }, { status: 503 });
  }

  try {
    const now = Date.now();

    // Collect all tracked "offline since" keys.
    const sinceKeys: string[] = [];
    let cursor = "0";
    do {
      const [next, keys] = await redis.scan(cursor, { match: `${SINCE_PREFIX}*`, count: SCAN_COUNT });
      cursor = String(next);
      sinceKeys.push(...keys);
    } while (cursor !== "0");

    const cameras = await Promise.all(
      sinceKeys.map(async (key) => {
        const camId = key.slice(SINCE_PREFIX.length);
        const since = Number(await redis.get<number>(key)) || 0;
        const lastAlert = Number(await redis.get<number>(`alert:last:${camId}`)) || 0;
        const downtimeMs = since ? now - since : 0;

        // Mirror the engine's decision logic.
        const pastThreshold = downtimeMs >= OFFLINE_THRESHOLD_MS;
        let nextAlertAt: number | null;
        if (lastAlert === 0) {
          nextAlertAt = pastThreshold ? now : since + OFFLINE_THRESHOLD_MS; // due now vs at 45-min mark
        } else {
          nextAlertAt = lastAlert + ALERT_COOLDOWN_MS; // 24h after last alert
        }

        return {
          camId,
          camName: NAME_BY_ID.get(camId) ?? camId,
          offlineSince: since ? new Date(since).toISOString() : null,
          offlineFor: formatDuration(downtimeMs),
          downtimeMs,
          alerted: lastAlert > 0,
          lastAlertAt: lastAlert ? new Date(lastAlert).toISOString() : null,
          nextAlertDue: nextAlertAt ? new Date(nextAlertAt).toISOString() : null,
          nextAlertInMs: nextAlertAt ? Math.max(0, nextAlertAt - now) : null,
        };
      })
    );

    cameras.sort((a, b) => b.downtimeMs - a.downtimeMs);

    return NextResponse.json({
      trackedOffline: cameras.length,
      cameras,
      rules: { firstAlertAfter: "45 minutes", repeatEvery: "24 hours", checkCadence: "15 minutes" },
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "scan failed" }, { status: 500 });
  }
}
