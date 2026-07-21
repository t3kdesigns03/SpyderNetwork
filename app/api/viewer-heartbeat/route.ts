import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

/**
 * POST /api/viewer-heartbeat
 * ─────────────────────────────────────────────────────────────────────────────
 * Called periodically by an active viewer's browser (well inside the TTL, e.g.
 * every ~20s) to signal "this session is still watching this camera".
 *
 * Body: { camId: string, sessionId: string }
 *
 * Writes a per-session key that auto-expires after 45s:
 *   viewer:{camId}:{sessionId} = camId   (EX 45)
 *
 * Because the key expires on its own, a viewer who closes the tab simply stops
 * refreshing and drops out of the count within one TTL window — no explicit
 * "leave" call or cleanup job needed. The stored value (camId) is redundant with
 * the key but handy for debugging.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTL_SECONDS = 45;
const MAX_ID_LEN = 128;

/**
 * Ids must be non-empty, bounded, and free of ":" (our key delimiter) so a
 * crafted id can't inject extra key segments or break the current-hero parser.
 * Real cam ids (e.g. "bwj-pool") and client session ids (uuid-like) both pass.
 */
function cleanId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  if (!t || t.length > MAX_ID_LEN) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(t)) return null;
  return t;
}

export async function POST(req: Request) {
  let body: { camId?: unknown; sessionId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const camId = cleanId(body.camId);
  const sessionId = cleanId(body.sessionId);
  if (!camId || !sessionId) {
    return NextResponse.json(
      { ok: false, error: "camId and sessionId are required" },
      { status: 400 }
    );
  }

  try {
    await getRedis().set(`viewer:${camId}:${sessionId}`, camId, { ex: TTL_SECONDS });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "store failed" }, { status: 500 });
  }
}
