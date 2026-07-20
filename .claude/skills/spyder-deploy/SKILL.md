---
name: spyder-deploy
description: SpyderNetwork build, deploy, SEO, and API/config reference. Use when deploying to Vercel or Netlify, changing the canonical domain, setting env vars, working with the conditions/cam-status/twitch-hls API routes, updating SEO metadata/sitemap/robots, or running the build/test checklist.
---

# SpyderNetwork Deploy, SEO & Config

Next.js 15 (App Router) + TypeScript + Tailwind. Deployable on both Vercel and Netlify. Node 20.

## Build / test checklist

```bash
npm install
npm run dev      # local dev
npm run build    # production build — MUST pass before deploy
npm run lint     # eslint (eslint-config-next)
npx tsc --noEmit # type-check without emitting
```

Always run `npm run build` (or at least `tsc --noEmit`) after editing cams, components, or SEO — the `[slug]` route, map pins, and business groups are derived at build time.

## Environment variables (`.env.example` -> `.env.local`)

- `NEXT_PUBLIC_SITE_DOMAIN` — production domain, used for the Twitch embed `parent` param (default `spydernetwork.com`).
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 Measurement ID (`G-XXXXXXXXXX`). Consumed by `lib/analytics.ts`.
- `WATER_TEMP_API_KEY` — optional/future, for a paid water-temp source.

Set the same vars in the Vercel/Netlify dashboard for production.

## Hosting config (already in repo)

- **`vercel.json`** — framework `nextjs`, region `iad1`, security headers (X-Content-Type-Options, X-Frame-Options SAMEORIGIN, Referrer-Policy) and 1-year immutable cache for static assets.
- **`netlify.toml`** — `npm run build`, publish `.next`, Node 20, `@netlify/plugin-nextjs`.

## API routes (`app/api/*/route.ts`) — all server-side, cached, no client keys

- **`/api/conditions`** — live Lake conditions. Free sources, no key: Open-Meteo (air temp/wind/humidity, coords 38.15/-92.62 near Osage Beach), NOAA NWPS gauge `lksm7` (Bagnell Dam pool elevation; normal pool 660 ft). Water temp returns `null` ("coming soon" — no free lake source). `revalidate = 600` (10 min). Each source fails independently.
- **`/api/cam-status`** — health check for each cam (online/offline/unknown). CDN-cached ~60s; the client (`CamStation`) re-polls every ~75s.
- **`/api/twitch-hls`** — HLS proxy/resolver for the `HlsPlayer` / `/hls-demo` path.

## SEO — `lib/seo.ts` is the single source of truth

`SITE.url` drives every canonical, OG/Twitter URL, sitemap (`app/sitemap.ts`), robots (`app/robots.ts`), and JSON-LD `@id`. Change it in ONE place to move domains — everything else derives from it.

**Current canonical: `https://beta.spydernetwork.com`.** All other hosts should 301 to it. There is a pending task (`reverse_cutover_seo_apexdomain.txt`) to switch the canonical back to `https://spydernetwork.com` when going to the apex domain — change only `SITE.url` (and confirm sitemap uses the same base); change no other logic.

JSON-LD is rendered via `components/JsonLd.tsx` using builders in `lib/seo.ts`. `docs/spydernetwork-seo` has additional SEO notes.

## Deploy checklist

1. `npm run build` passes locally.
2. Env vars set in host dashboard (`NEXT_PUBLIC_SITE_DOMAIN`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`).
3. New production domain added to `TWITCH_PARENTS` in `components/CamEmbed.tsx` (else Twitch embeds break) AND to `SITE.url` in `lib/seo.ts` if it's the new canonical.
4. Push to the connected Vercel/Netlify project; verify security headers and asset caching are applied.
5. Mobile smoke test: portrait phone load on cellular, live dot animating, tap-for-sound, cycle + interval controls, landscape immersive mode, conditions tab, cast icons.
