import { NextResponse } from "next/server";
import { runOfflineCheck } from "@/lib/offlineAlerts";

/**
 * GET|POST /api/cron/offline-check
 * ─────────────────────────────────────────────────────────────────────────────
 * Runs the offline-alert engine: checks every camera's live status, tracks
 * downtime in Redis, and emails alerts per the 45-min / 24h rules.
 *
 * Triggered on a schedule by the Netlify scheduled function
 * (netlify/functions/offline-check.mjs). Can also be hit manually to test.
 *
 * Auth: if CRON_SECRET is set, the request must supply it via the
 * `x-cron-secret` header or a `?secret=` query param; otherwise the route is
 * open (set CRON_SECRET in prod to lock it down).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = req.headers.get("x-cron-secret");
  const q = new URL(req.url).searchParams.get("secret");
  return header === secret || q === secret;
}

async function handle(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    const result = await runOfflineCheck(baseUrl);
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ ok: false, error: "check failed" }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
