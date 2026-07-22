---
name: spyder-autoplay
description: Diagnose and fix SpyderNetwork live-cam autoplay problems — a cam stuck on a play button, showing Twitch's "minimum requirements for autoplay were not met: style visibility", or falling back to the Twitch iframe instead of muted-autoplaying. Use for anything touching CamPlayer, CamEmbed, HlsPlayer, or app/api/twitch-hls.
---

# SpyderNetwork Cam Autoplay — Diagnosis & Fix Playbook

## How playback works (read this first)

A cam is meant to muted-autoplay with **no user click**. The pipeline:

```
CamStation -> CamPlayer (smart wrapper) -> HlsPlayer (native <video>, RELIABLE)
                                        \-> CamEmbed  (Twitch iframe, FALLBACK, UNRELIABLE)
```

- **`HlsPlayer`** plays a native `<video>` fed a Twitch HLS (`.m3u8`) URL. Browsers **always** allow a muted `<video>` to autoplay with no gesture. This is the path every working cam uses.
- **`CamEmbed`** is the raw Twitch `player.twitch.tv` iframe. It is only a fallback and **cannot reliably gesture-free autoplay** — Twitch applies its own autoplay gate and refuses with:
  > Autoplay disabled. The following minimum requirements for autoplay were not met: style visibility
- **`CamPlayer`** resolves an HLS URL from `/api/twitch-hls`; if HLS fails it drops to the `CamEmbed` iframe.

**Key mental model:** if a cam won't autoplay, it's almost always because it fell off the HLS `<video>` path onto the Twitch iframe. The goal is to keep it on the `<video>` path — NOT to "fix the iframe."

## The trap: do NOT chase CSS / "style visibility"

The Twitch error says "style visibility", which *looks* like a CSS/z-index/overlay bug. It is not (verified 2026-07-22 with live DOM instrumentation on beta):

- When the iframe renders it is **full-size, `visibility:visible`, `opacity:1`, `transform:none`**, and **no ancestor** has any transform/opacity/filter/visibility/will-change. The page CSS is clean.
- A pristine full-viewport Twitch iframe with zero siblings/overlays **still** won't gesture-free autoplay. The iframe is inherently an unreliable autoplay surface — that's the whole reason the HLS-first architecture exists.

So: **deferring/removing overlays, tweaking z-index, or removing animations will NOT fix autoplay.** Don't spend time there. (There is also a page/tab visibility requirement — an unfocused/background tab blocks autoplay, which matters when testing in automation but not for real users.)

## The real root cause

The failing cam's **HLS path is failing** — usually Twitch serves an **ad-signed segment that returns 403**, which kills hls.js and forces the iframe. Twitch conditions those ad-403 segments partly on the access-token **`playerType`** used to mint the stream token.

The original resolver hard-coded `playerType: "embed"`. Some channels (e.g. Angels / `spydernetwork72`) get ad-403'd under `"embed"` and need a cleaner context.

## The fix (playerType escalation)

Keep the cam on native HLS by requesting a cleaner `playerType` that returns ad-free segments.

1. **`app/api/twitch-hls/route.ts`** — accepts `?pt=`, **allow-listed** to `{embed, frontpage, site, autoplay}`, default `embed`. Passed into the GraphQL `PlaybackAccessToken` request as `playerType`. Default keeps every existing caller unchanged.
2. **`types/index.ts`** — `Cam.hlsPlayerType?: string` (optional per-cam hint).
3. **`lib/cams.ts`** — pin the hint on a problem cam, e.g. Angels:
   ```ts
   hlsPlayerType: "frontpage",
   ```
4. **`components/CamPlayer.tsx`** — an escalation ladder, tried in order, instead of retrying the same failing token:
   ```
   [ cam.hlsPlayerType ?? default("embed") ]  ->  "frontpage"  ->  "site"
   ```
   First attempt is unchanged for a normal cam. On an HLS error it escalates to the next `playerType`; the Twitch **iframe is the last resort** only after the ladder is exhausted. `startAttempt(index)` drives this; `handleHlsError` calls `startAttempt(attemptRef.current + 1)`.

This hardened **all** cams, not just Angels — any channel that later gets ad-403'd now self-heals through the ladder before falling to the iframe.

## Fixing a NEW misbehaving cam — checklist

1. Confirm the symptom: the cam shows a play button / "style visibility", other cams autoplay fine.
2. Confirm it's the iframe fallback (HLS died), not a genuinely offline channel. If `/api/twitch-hls?channel=<login>` returns a `url` (HTTP 200), the channel is live and the problem is downstream segments.
3. Don't touch CSS/overlays. Pin `hlsPlayerType` for that cam in `lib/cams.ts` — try `"frontpage"` first, then `"site"`.
4. Verify on a **real, focused browser tab** (not background/automation — that blocks autoplay independently). Deploy to beta and select the cam; it should start muted with no click and **not** fall back to the iframe.

## If it regresses later

Twitch changes ad conditioning per channel over time. The ladder auto-tries `site` after `frontpage`, but a persistent change may need a different `playerType` pinned. Add new values to the route's allow-list (`ALLOWED_PLAYER_TYPES`) before using them.

## Constraints / notes

- The HLS resolver uses Twitch's private/undocumented API (against ToS; used only for SpyderNetwork's own channels). Tokens are short-lived; the client re-resolves on error.
- Related: `.claude/skills/spyder-cams` (cam data model), `.claude/skills/spyder-components` (component structure).
