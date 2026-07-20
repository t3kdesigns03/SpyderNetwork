import { NextResponse } from "next/server";
import { ALL_CAMS } from "@/lib/cams";

/**
 * GET /api/cam-status
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight, batched health check that reports whether each camera is live.
 * Returns: { statuses: { [camId]: "online" | "offline" | "unknown" }, checkedAt }
 *
 * DESIGN — don't hammer the streams:
 *   • Twitch cams: ONE batched GraphQL request checks every channel's live state
 *     at once (aliased user(login:){ stream }), instead of N requests. Server-side
 *     only — the browser can't call gql.twitch.tv cross-origin.
 *   • iframe cams (e.g. ipcamlive): a single GET with a short timeout; a healthy
 *     response = reachable. Best-effort availability (can't see inside the feed).
 *   • The response is CDN-cached (s-maxage) so many viewers polling every ~75s
 *     collapse into at most one upstream check per minute.
 *
 * NOTE: uses Twitch's public web Client-ID (same undocumented flow as
 * /api/twitch-hls). If the GQL call fails, those cams report "unknown" (neutral)
 * rather than a false "offline".
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";
const TIMEOUT_MS = 6000;

type Status = "online" | "offline" | "unknown";

function sanitizeLogin(login: string): string {
  return login.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

/** One batched GQL request → { login: isLive }. Empty object if the call fails. */
async function checkTwitch(logins: string[]): Promise<{ ok: boolean; live: Record<string, boolean> }> {
  const live: Record<string, boolean> = {};
  if (!logins.length) return { ok: true, live };

  const fields = logins
    .map((login, i) => `c${i}: user(login: "${login}") { login stream { id } }`)
    .join("\n");
  const query = `query CamLiveCheck {\n${fields}\n}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch("https://gql.twitch.tv/gql", {
      method: "POST",
      headers: { "Client-ID": CLIENT_ID, "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      cache: "no-store",
      signal: ctrl.signal,
    });
    if (!res.ok) return { ok: false, live };
    const json = (await res.json()) as {
      data?: Record<string, { login?: string; stream?: { id?: string } | null } | null>;
    };
    const data = json?.data ?? {};
    for (const key of Object.keys(data)) {
      const node = data[key];
      if (node?.login) live[node.login.toLowerCase()] = node.stream != null;
    }
    return { ok: true, live };
  } catch {
    return { ok: false, live };
  } finally {
    clearTimeout(timer);
  }
}

/** Reachability probe for an iframe-hosted cam. */
async function checkIframe(url: string): Promise<Status> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store", signal: ctrl.signal });
    return res.ok ? "online" : "offline";
  } catch {
    return "offline";
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const twitchCams = ALL_CAMS.filter((c) => c.streamProvider === "twitch" && c.twitchChannel);
  const iframeCams = ALL_CAMS.filter((c) => c.streamProvider === "iframe" && c.iframeUrl);

  const logins = Array.from(
    new Set(twitchCams.map((c) => sanitizeLogin(c.twitchChannel!)).filter(Boolean))
  );

  // Run the Twitch batch and all iframe probes in parallel.
  const [twitch, iframeResults] = await Promise.all([
    checkTwitch(logins),
    Promise.all(iframeCams.map(async (c) => [c.id, await checkIframe(c.iframeUrl!)] as const)),
  ]);

  const statuses: Record<string, Status> = {};

  for (const cam of twitchCams) {
    if (!twitch.ok) {
      statuses[cam.id] = "unknown"; // GQL failed — don't cry wolf
    } else {
      const login = sanitizeLogin(cam.twitchChannel!);
      statuses[cam.id] = twitch.live[login] ? "online" : "offline";
    }
  }

  for (const [camId, status] of iframeResults) {
    statuses[camId] = status;
  }

  // Anything else (no provider we can probe) → unknown.
  for (const cam of ALL_CAMS) {
    if (!(cam.id in statuses)) statuses[cam.id] = "unknown";
  }

  return NextResponse.json(
    { statuses, checkedAt: Date.now() },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
  );
}
