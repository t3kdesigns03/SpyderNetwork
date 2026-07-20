---
name: spyder-components
description: SpyderNetwork React component architecture and mobile-first patterns. Use when building or editing components/pages, embedding Twitch/iframe feeds, working on the cam browser, cycling, favorites, map, casting, or landscape handling. Covers which components are live vs deprecated and the project's mobile conventions.
---

# SpyderNetwork Components & Mobile Patterns

Next.js 15 App Router + TypeScript + Tailwind. Client components use `"use client"`. Icons come from `lucide-react`. Class merging uses `clsx` / `tailwind-merge`. Import alias is `@/` (root). Styling tokens come from the **spyder-brand** skill; cam data from the **spyder-cams** skill.

## Architecture

`app/page.tsx` is thin — it renders `CamStation` (the whole interactive browser), `BroadcasterCTA`, `HomeSeoContent`, `Footer`. Individual cam pages live at `app/cams/[slug]` and resolve via `getCamBySlug`.

### Live components (edit these)
- **`CamStation.tsx`** — the heart of the site. Owns tabs (`cams | map | conditions | partners`), business-group accordions, search, favorites, cycling (interval control), cast, and landscape mode. State: `selected`, `enabled` (cycle opt-in set), `favorites`, `isCycling`, `cycleMode` (`selected|favorites`), `intervalSecs`, `tab`. Cycle selection persists to `localStorage` under `spyder:cycleEnabled` (hydrated in `useEffect`, NOT the `useState` initializer, to avoid SSR hydration mismatch).
- **`CamEmbed.tsx`** — renders the actual stream iframe. Owns Twitch parent handling (see below) and the mute/tap-for-sound autoplay flow.
- **`CamPlayer.tsx`** — player wrapper used by CamStation/CamModal.
- **`CamCard.tsx`** — cam thumbnail/tile (supports `expanded` full-embed mode, favorite toggle, cast).
- **`CamModal.tsx`** — fullscreen single-cam view with prev/next across `CAMS`.
- **`LakeConditions.tsx`** — conditions dashboard (temp, wind, lake level). Fetches USGS + the `/api/conditions` route.
- **`HlsPlayer.tsx`** — hls.js player for non-Twitch/HLS feeds (`/api/twitch-hls`, `/hls-demo`).
- Others: `Hero`, `NavBar`, `Footer`, `BroadcasterCTA`, `SponsorBadge`, `SponsorList`, `SpyderLogo`, `SpyderLoader`, `JsonLd`, `HomeSeoContent`, `CamStation`.

### Deprecated stubs (do NOT use — they export `{}`)
`CamGrid.tsx`, `CamCycleBar.tsx`, `FeaturedStream.tsx`, `MapView.tsx`. Their functionality was folded into `CamStation`. Don't reintroduce them; extend CamStation instead.

## Twitch embedding (critical)

`CamEmbed.tsx` builds the player URL with `player.twitch.tv/?channel=...`. Twitch requires a `parent=` value that **exactly matches the page hostname**. All valid hosts are hardcoded in the `TWITCH_PARENTS` array (spydernetwork.com, www., beta., the t3kdesigns preview) and appended as multiple `parent=` params — this avoids async hostname detection so the iframe renders on first paint. **When the site gets a new domain, add it to `TWITCH_PARENTS`.**

Mobile autoplay: the embed starts with `muted=true` (required for gesture-free autostart). A "Tap for sound" tap counts as the user gesture and rebuilds the URL with `muted=false`. The hero cam is pre-selected on mount so its iframe loads under the page-navigation gesture.

## Mobile-first conventions (the whole point of the project)

- Design for portrait phone, one-handed use, cellular load first. Large tap targets, big live thumbnails, smooth scroll, collapsible business groups (accordions default collapsed).
- **`useIsLandscapeMobile()`** (`hooks/useOrientation.ts`) triple-guards (orientation + `pointer: coarse` + `innerHeight < 600`) to detect a phone rotated to landscape and switch to an immersive fullscreen player. Reuse this hook rather than re-detecting.
- Always show the `animate-pulse-live` red LIVE dot on live feeds.
- Cast support: a `Cast` icon indicates TV-castable feeds; cast clicks are tracked via `lib/analytics.ts` (`trackCastClick`).
- Analytics: use `lib/analytics.ts` helpers (`withUTM`, `trackPartnerSite`, `trackCastClick`, `toUTMContent`) — don't inline GA calls.

## Conventions

- `"use client"` only where interactivity/hooks are needed; keep pages server components where possible for SEO.
- Colors/fonts/animations via `spyder-*` tokens (spyder-brand skill). No inline hex.
- Keep the cam data flow one-directional: `lib/cams.ts` -> derived exports -> components. Never hardcode a channel in a component.
- Avoid `localStorage` in `useState` initializers (hydration mismatch) — read it in `useEffect`.
