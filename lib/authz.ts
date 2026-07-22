/**
 * Shared secret gate for internal endpoints (cron + debug).
 * ─────────────────────────────────────────────────────────────────────────────
 * Requires CRON_SECRET via the `x-cron-secret` header or a `?secret=` query
 * param. If CRON_SECRET isn't configured, the endpoint is open (so local dev
 * still works) — set it in production to lock these down.
 */
export function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = req.headers.get("x-cron-secret");
  const q = new URL(req.url).searchParams.get("secret");
  return header === secret || q === secret;
}
