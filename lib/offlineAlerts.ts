import { getRedis } from "@/lib/redis";
import { ALL_CAMS } from "@/lib/cams";
import { sendOfflineAlertEmail } from "@/lib/email";

/**
 * Offline-alert engine.
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads the existing status source of truth (/api/cam-status), tracks how long
 * each camera has been offline in Redis, and emails an alert per the timing rules:
 *   • First alert once a camera has been offline ≥ 45 minutes.
 *   • At most one alert per rolling 24h window per camera (so if it's still down
 *     ~24h later, one more alert goes out — and not more often than daily).
 *   • State auto-resets the moment a camera reports online again.
 *
 * Redis keys (both TTL'd to 7 days as a safety net; refreshed while relevant):
 *   offline:since:{camId} → epoch ms the camera first went offline
 *   alert:last:{camId}    → epoch ms of the last alert sent
 */

type Status = "online" | "offline" | "unknown";

const MINUTE_MS = 60_000;
const OFFLINE_THRESHOLD_MS = 45 * MINUTE_MS; // first alert after 45 min
const ALERT_COOLDOWN_MS = 24 * 60 * MINUTE_MS; // one alert per 24h
const STATE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface OfflineCheckResult {
  checkedAt: number;
  camerasChecked: number;
  offlineCount: number;
  alertsSent: string[];
}

export async function runOfflineCheck(baseUrl: string): Promise<OfflineCheckResult> {
  // 1. Pull the current online/offline map from the existing status system.
  const res = await fetch(`${baseUrl}/api/cam-status`, { cache: "no-store" });
  if (!res.ok) throw new Error(`cam-status responded ${res.status}`);
  const { statuses } = (await res.json()) as { statuses: Record<string, Status> };

  const redis = getRedis();
  const now = Date.now();
  const result: OfflineCheckResult = {
    checkedAt: now,
    camerasChecked: 0,
    offlineCount: 0,
    alertsSent: [],
  };

  for (const cam of ALL_CAMS) {
    const status = statuses[cam.id];
    result.camerasChecked++;

    // Recovered (or now online) → clear tracking so the next outage starts clean.
    if (status === "online") {
      await redis.del(`offline:since:${cam.id}`, `alert:last:${cam.id}`);
      continue;
    }

    // "unknown" is neutral — never start a timer or alert on uncertain data.
    if (status !== "offline") continue;

    result.offlineCount++;

    // 2. Record first-seen-offline atomically (only writes if absent).
    const sinceKey = `offline:since:${cam.id}`;
    await redis.set(sinceKey, now, { nx: true, ex: STATE_TTL_SECONDS });
    const since = Number(await redis.get<number>(sinceKey)) || now;
    const downtime = now - since;

    // 3. Not down long enough yet.
    if (downtime < OFFLINE_THRESHOLD_MS) continue;

    // 4. Respect the 24h cooldown (first alert allowed when none recorded yet).
    const alertKey = `alert:last:${cam.id}`;
    const lastAlert = Number(await redis.get<number>(alertKey)) || 0;
    const dueForAlert = lastAlert === 0 || now - lastAlert >= ALERT_COOLDOWN_MS;
    if (!dueForAlert) continue;

    // 5. Send, and only record the alert on real success (so a failed send
    //    retries next run instead of silently starting the cooldown).
    const sent = await sendOfflineAlertEmail(cam, downtime, since);
    if (sent) {
      await redis.set(alertKey, now, { ex: STATE_TTL_SECONDS });
      result.alertsSent.push(cam.id);
    }
  }

  return result;
}
