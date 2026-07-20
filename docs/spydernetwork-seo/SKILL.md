---
name: spydernetwork-seo
description: Complete SEO system for SpyderNetwork (Next.js 15 App Router live webcam network for Lake of the Ozarks). Use for any SEO work, metadata, JSON-LD, sitemaps, cam pages, domain strategy, GA4 setup, content patterns, or future site revamps on beta.spydernetwork.com or spydernetwork.com.
---

# SpyderNetwork SEO Skill

This skill captures the full SEO architecture, decisions, and patterns developed for SpyderNetwork so they can be reused and extended on future revamps.

## Core Principles
- Never break the live site. Prefer surgical, reversible changes.
- All metadata and JSON-LD must be server-rendered (never client-only).
- Keep one source of truth for domain, site identity, and schema helpers.
- Optimize for both classic Google SEO and AI search (clear entities, answer-first content, strong structured data).

## Current Domain Strategy
- Active SEO domain: `https://beta.spydernetwork.com`
- Future production domain: `https://spydernetwork.com`
- Canonicals, Open Graph, Twitter cards, and sitemap must always use the currently active domain.
- When cutting over to production:
  1. Change the base domain in `lib/seo.ts`
  2. Deploy
  3. Set up 301 redirects from beta → apex and from old WordPress paths → new `/cams/[slug]` routes

## Key Files
- `lib/seo.ts` — Single source of truth (site config, base URL, schema builders, `pageMetadata`, `camMetaDescription`)
- `components/JsonLd.tsx` — Server component that outputs JSON-LD
- `app/sitemap.ts` — Dynamic sitemap (homepage + static pages + all cam pages)
- `app/robots.ts`
- `app/layout.tsx` — Site-wide Organization + WebSite schema
- `app/cams/[slug]/page.tsx` — Individual cam pages
- Homepage SEO content lives in a dedicated server component (e.g. `HomeSeoContent`)

## Required Schema Patterns

### Homepage
- Organization
- WebSite
- ItemList (full list of cams)
- FAQPage

### Individual Cam Pages
- VideoObject (must include `isLiveBroadcast: true` + BroadcastEvent)
- Place (with GeoCoordinates when available)
- BreadcrumbList
- Link back to the Organization via `@id`

### Other Pages
- FAQPage on Become a Broadcaster
- Appropriate schema on About, Radar/Conditions, etc.

## Metadata Standards
Cam page title format:
`{Venue} – {View} Live Cam | Lake of the Ozarks`

Examples:
- Dog Days – Dock Live Cam | Lake of the Ozarks
- Backwater Jacks – Pool Live Cam | Lake of the Ozarks

Every page must have:
- Unique title
- Meta description
- Canonical
- Full Open Graph + Twitter card tags

## Content Patterns
- Homepage must contain a fully crawlable directory of every cam (critical for internal linking and AI cataloguing).
- Every cam page needs a clear "What this cam shows" section written in answer-first, entity-rich language.
- Mention specific Lake of the Ozarks locations (Bagnell Dam Strip, Lake Ozark, Osage Beach, etc.) where natural.
- Keep the live cam player as the hero — SEO content goes below the fold.

## Technical Rules
- Use Next.js 15 App Router `generateMetadata` and the Metadata API.
- JSON-LD must be rendered via a server component.
- Twitch embeds must keep the correct `parent` parameters for all domains (beta, apex, www, t3kdesigns.app).
- Prefer `loading="lazy"` on non-hero embeds.
- Never remove or break the existing GA measurement ID (`NEXT_PUBLIC_GA_MEASUREMENT_ID`).

## GA4 + Multi-Subdomain
- Use **one** GA4 Measurement ID across all `*.spydernetwork.com` properties.
- In GA4 → Data Streams → Configure tag settings → Configure your domains → add `spydernetwork.com`.
- Filter reports by the `hostname` dimension when you need to separate beta vs production traffic.

## Future Revamp Guidelines
When doing a major redesign or new feature:
1. Preserve the SEO foundation in `lib/seo.ts` and the JsonLd component.
2. Keep the cam page URL structure (`/cams/[slug]`) stable if possible.
3. Re-validate all schema with Google's Rich Results Test after major changes.
4. Update the sitemap if new page types are added.
5. Maintain the crawlable cam directory on the homepage.

## Common Pitfalls
- Hardcoding the production domain while still on beta
- Putting JSON-LD only in client components
- Breaking Twitch parent domain parameters
- Removing the GA measurement ID during refactors
- Losing the full cam directory on the homepage
- Creating thin cam pages without unique descriptive content
