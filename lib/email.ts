import type { Cam } from "@/types";

/**
 * Resend email helpers for camera offline alerts.
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses the Resend REST API directly (no SDK dependency). Requires RESEND_API_KEY.
 * Recipient / sender are configurable via env with sensible defaults so it works
 * out of the box:
 *   ALERT_EMAIL_TO    (default: b.reilly03@gmail.com)
 *   ALERT_EMAIL_FROM  (default: SpyderNetwork Alerts <onboarding@resend.dev>)
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const ADMIN_URL = "https://spydernetwork.com/admin/viewers";

// Sends from the verified alerts.spydernetwork.com domain (verified in the Resend
// account whose RESEND_API_KEY is configured in Netlify). The from-domain MUST
// match the verified domain. Override the local part / display name via env.
const FROM = process.env.ALERT_EMAIL_FROM ?? "SpyderNetwork Alerts <noreply@alerts.spydernetwork.com>";
// Recipients. ALERT_EMAIL_TO may be a single address or a comma-separated list;
// split into individual trimmed addresses so Resend gets a proper string[]
// (Resend rejects a single comma-joined string).
const TO_RAW = process.env.ALERT_EMAIL_TO ?? "b.reilly03@gmail.com";
const TO_LIST = TO_RAW.split(",").map((addr) => addr.trim()).filter(Boolean);
const TO_DISPLAY = TO_LIST.join(", ");

/** ms → "1 hour 12 minutes" / "45 minutes" / "1 day 3 hours". */
export function formatDuration(ms: number): string {
  const totalMin = Math.max(0, Math.floor(ms / 60_000));
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const minutes = totalMin % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  // Once we're measuring in days, drop minutes for brevity.
  if (minutes && !days) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  if (parts.length === 0) return "less than a minute";
  return parts.join(" ");
}

function friendlyName(cam: Cam): string {
  return cam.name ? `${cam.business} – ${cam.name}` : cam.business;
}

/** Central-time (lake local) formatted timestamp, e.g. "Jul 21, 2026, 10:37 AM CDT". */
function centralTime(ms: number): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "medium",
      timeStyle: "short",
      timeZoneName: "short",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toUTCString();
  }
}

/** Dark, branded HTML email. Table + inline styles for broad client support. */
function renderOfflineEmail(cam: Cam, downtimeMs: number, sinceMs: number): string {
  const camName = friendlyName(cam);
  const duration = formatDuration(downtimeMs);
  const since = centralTime(sinceMs);

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#05060a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#05060a;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#0a0e1a;border:1px solid rgba(204,0,0,0.35);border-radius:14px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
            <!-- Header -->
            <tr>
              <td style="padding:22px 28px;background:linear-gradient(90deg,#140406,#0a0e1a);border-bottom:1px solid rgba(204,0,0,0.35);">
                <span style="font-size:18px;font-weight:800;letter-spacing:3px;color:#ffffff;text-transform:uppercase;">
                  SPYDER<span style="color:#ff1a1a;">NETWORK</span>
                </span>
              </td>
            </tr>

            <!-- Alert badge -->
            <tr>
              <td style="padding:28px 28px 8px 28px;">
                <span style="display:inline-block;background:#cc0000;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:6px 12px;border-radius:6px;">
                  ● Camera Offline
                </span>
              </td>
            </tr>

            <!-- Camera name -->
            <tr>
              <td style="padding:12px 28px 4px 28px;">
                <div style="font-size:24px;font-weight:800;color:#ffffff;line-height:1.25;">${camName}</div>
                <div style="font-size:13px;color:#9ca3af;font-family:'Courier New',monospace;margin-top:6px;">${cam.id}</div>
              </td>
            </tr>

            <!-- Detail card -->
            <tr>
              <td style="padding:20px 28px 4px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0d1526;border:1px solid rgba(255,255,255,0.08);border-radius:10px;">
                  <tr>
                    <td style="padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.06);">
                      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Offline for</div>
                      <div style="font-size:20px;font-weight:700;color:#ff4d4d;margin-top:4px;">${duration}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Offline since</div>
                      <div style="font-size:15px;font-weight:600;color:#ffffff;margin-top:4px;">${since}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:22px 28px 8px 28px;">
                <a href="${ADMIN_URL}" style="display:inline-block;background:#cc0000;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 22px;border-radius:8px;">
                  Open Viewer Monitor →
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 28px 26px 28px;">
                <div style="font-size:12px;color:#6b7280;line-height:1.6;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;">
                  Automated alert from the SpyderNetwork monitoring system.
                  You're receiving this because ${camName} has been reporting offline.
                  It will resolve automatically when the camera comes back online.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export interface SendResult {
  ok: boolean;
  status?: number;
  detail?: string;
  from: string;
  to: string;
}

/**
 * Sends the offline alert email. Returns { ok } plus diagnostics (HTTP status +
 * Resend's response body on failure, and the from/to used) so callers can report
 * exactly why a send failed. Only records the alert / 24h cooldown when ok.
 */
export async function sendOfflineAlertEmail(
  cam: Cam,
  downtimeMs: number,
  sinceMs: number
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, detail: "RESEND_API_KEY is not set in this environment", from: FROM, to: TO_DISPLAY };
  }

  const camName = friendlyName(cam);
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: TO_LIST,
        subject: `Camera Offline Alert – ${camName}`,
        html: renderOfflineEmail(cam, downtimeMs, sinceMs),
      }),
    });

    if (res.ok) return { ok: true, status: res.status, from: FROM, to: TO_DISPLAY };

    // Surface Resend's actual error (e.g. unverified domain, recipient
    // restricted to the account owner, bad key) instead of a generic message.
    let detail = `Resend responded ${res.status}`;
    try {
      const body = await res.text();
      if (body) detail += `: ${body.slice(0, 400)}`;
    } catch {
      /* ignore body read errors */
    }
    return { ok: false, status: res.status, detail, from: FROM, to: TO_DISPLAY };
  } catch (err) {
    return { ok: false, detail: `request error: ${String(err)}`, from: FROM, to: TO_DISPLAY };
  }
}
