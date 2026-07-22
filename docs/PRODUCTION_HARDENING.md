# Production Hardening Checklist

Follow-ups from the viewer-competition + offline-alert build. None block current
functionality, but close these out before treating the system as long-term
production. Check items off as you go.

## 1. Rotate exposed secrets (do this first)

These values appeared in plain text in git history (the redacted scratch file
`reverse_cutover_seo_apexdomain.txt`). Redacting the file did **not** remove them
from history, so treat all of them as compromised and rotate:

- [ ] **RESEND_API_KEY** — revoke the exposed key(s) in Resend (both
      `re_j4SszcsF…` and `re_As1zyRAw…`), generate a fresh key **in the account
      that owns the verified `alerts.spydernetwork.com` domain**, and update
      `RESEND_API_KEY` in Netlify.
- [ ] **CRON_SECRET** — set a new random value in Netlify, replacing
      `spyder_offline_7f3k9x2m`.
- [ ] Redeploy so functions pick up the new env values.
- [ ] (Optional) Purge the old values from git history with `git filter-repo` /
      BFG + force-push. Rotating first makes the leaked values worthless, so this
      is only needed if the Netlify secrets scanner keeps flagging history.

## 2. Remove or lock the temporary surfaces

All added for testing; each is unauthenticated beyond the cron secret.

- [ ] **`?test=1` mode** in `app/api/cron/offline-check/route.ts` — remove the
      test branch (and `runTestAlert` in `lib/offlineAlerts.ts`) once alerting is
      trusted, or gate it behind an env flag.
- [ ] **`/api/debug/viewers`** (`app/api/debug/viewers/route.ts`) — delete, or
      require a secret/admin check. Exposes raw viewer tallies.
- [ ] **`/api/debug/offline-state`** (`app/api/debug/offline-state/route.ts`) —
      delete, or require a secret/admin check. Exposes offline-tracking state.
- [ ] **`/admin/viewers`** (`app/admin/viewers/*`) — add auth, or remove. It's
      `noindex` but otherwise open, and it depends on `/api/debug/viewers`.

## 3. Confirm production config

- [ ] Netlify env set: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`,
      `RESEND_API_KEY`, `CRON_SECRET`, `ALERT_EMAIL_FROM`
      (`SpyderNetwork Alerts <noreply@alerts.spydernetwork.com>`), `ALERT_EMAIL_TO`
      (comma-separated recipients).
- [ ] Resend shows `alerts.spydernetwork.com` **Verified**, in the same account
      as `RESEND_API_KEY`.
- [ ] Netlify scheduled function `offline-check` is running every 15 min
      (Functions → Scheduled).
- [ ] Netlify secrets scanning passes on the latest commit.

## 4. Nice-to-have / future

- [ ] If viewer volume ever spikes, replace the `current-hero` / `debug/viewers`
      `SCAN` tallies with per-cam counters or a sorted set.
- [ ] Decide the follow-up cadence: current rule sends daily while a cam stays
      offline (≤1/24h). Tighten to "45-min + one 24-h follow-up only" if desired.
- [ ] Move any pasted-secret scratch notes straight into Netlify env instead of a
      local file (scratch files are gitignored, but keys shouldn't sit on disk).
