---
name: spyder-cams
description: SpyderNetwork cam data model and content ops. Use whenever adding, editing, removing, grouping, or reordering live cameras; changing categories, providers, sponsor tiers, or map pins; or working in lib/cams.ts and types/index.ts. This is the source-of-truth reference for how a cam is represented.
---

# SpyderNetwork Cam Data Model

`lib/cams.ts` is the **single source of truth** for every live stream on the site. The whole UI (hero, cam grid, business groups, map, cycling) derives from the exported `CAMS` array. Edit cams here — never hardcode a channel anywhere else. Type is defined in `types/index.ts`.

## The `Cam` object

```ts
interface Cam {
  id: string;            // stable unique id, e.g. "bwj-pool"
  name: string;          // short label within a business, e.g. "Pool", "Dock 2"
  business: string;      // business/group name, e.g. "Backwater Jacks"
  slug: string;          // URL slug -> /cams/[slug], matches spydernetwork.com path
  category: CamCategory; // see list below
  streamProvider: StreamProvider; // "twitch" | "youtube" | "iframe" | "direct"
  twitchChannel?: string;   // e.g. "spydernetwork3" (required for twitch provider)
  iframeUrl?: string;       // for provider "iframe" (e.g. ipcamlive feeds)
  description?: string;      // one-line, boater-voice (see spyder-brand)
  mile?: string;             // lake mile marker
  lat?: number; lng?: number;// map pin coords
  isLive?: boolean;          // set true for active feeds
  isFeatured?: boolean;      // HERO ONLY — see gotcha below
  sponsorTier?: SponsorTier; // "basic" | "featured" | "premium" — badge + placement
  thumbnailUrl?: string;
  websiteUrl?: string;       // the business's own site
  spyderPageUrl?: string;    // original spydernetwork.com page
}
```

## Categories (`CamCategory`)

`bar-grill` | `marina` | `pool` | `dock` | `stage` | `shop` | `real-estate` | `radio` | `shelter` | `lake-view`

Pick the category that matches how a boater would browse. Grouping in the UI is by `business`, filtering/icons by `category`.

## Providers (`StreamProvider`)

- `twitch` — the default. Requires `twitchChannel` (channel name like `spydernetwork14`). Embedding/parent handling lives in `components/CamEmbed.tsx` (see spyder-components).
- `iframe` — third-party embed via `iframeUrl` (e.g. JB Hooks uses ipcamlive: `jbhooksbridge`, `jbhooksleft`).
- `youtube` / `direct` — reserved for future feeds.

## Sponsor tiers (`SponsorTier`)

`basic` | `featured` | `premium`. Drives the sponsor badge (`SponsorBadge.tsx`/`SponsorList.tsx`) and placement priority. This is how paying broadcasters get promoted — NOT `isFeatured`.

## Channel map

The top of `lib/cams.ts` has a big comment block mapping every business/cam to its `spydernetworkNN` channel (scraped from spydernetwork.com). Keep this comment updated whenever a channel is added or changed. Unmapped channels (e.g. spydernetwork22, 30, 41, 46-48, 67, 71) are listed under "STILL UNMAPPED" — investigate before reusing a number.

## Derived exports (do not duplicate)

- `HERO_CAM` = the one cam with `isFeatured:true`
- `ALL_CAMS` = every cam EXCEPT the hero (used for grid + cycling)
- `CAM_BUSINESSES` = unique business names, alphabetical
- `CAMS_BY_BUSINESS` = cams keyed by business
- `getCamBySlug(slug)` = lookup for `/cams/[slug]` pages

## CRITICAL gotchas

1. **`isFeatured` is reserved for the single hero cam only.** `ALL_CAMS` filters out `isFeatured:true`, so any non-hero cam that sets it will VANISH from its business group and the grid. To promote a normal cam, use `sponsorTier` instead. This mistake is called out inline in cams.ts (Backwater Jacks Pool note).
2. **Keep `slug` aligned with the real spydernetwork.com path** so `spyderPageUrl` and SEO stay consistent.
3. **Every business's cams share the same/near coords** — reuse the business lat/lng when adding a new angle.
4. Descriptions use the boater voice from the spyder-brand skill.

## Adding a new cam — checklist

1. Add the channel to the comment map at the top of `cams.ts`.
2. Append a `Cam` object to `CAMS` under the right business section.
3. Set `id`, `name`, `business`, `slug`, `category`, `streamProvider`, and channel/url.
4. Add `lat`/`lng` (copy from siblings), `isLive:true`, a voice-matched `description`, `websiteUrl`, `spyderPageUrl`.
5. Use `sponsorTier` (not `isFeatured`) if it's a paid placement.
6. Run `npm run build` (or `npx tsc --noEmit`) — the map pins, groups, and `[slug]` route pick it up automatically.
