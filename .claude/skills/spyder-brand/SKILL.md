---
name: spyder-brand
description: SpyderNetwork design system — exact brand colors, fonts, animations, gradients, and voice. Use whenever styling, theming, or writing copy for the SpyderNetwork Lake of the Ozarks live-cam site, or when a new component/page needs to match the existing look and feel.
---

# SpyderNetwork Brand & Design System

SpyderNetwork is a Lake of the Ozarks live-cam network. The look is **dark, neon, nightlife-on-the-water** — deep navy/black backgrounds, a bold spider-red primary, and electric cyan/purple/gold accents. Everything below is already wired into `tailwind.config.ts` as the `spyder` palette. Use the token names (`spyder-red`), not raw hex, in JSX. Do not invent new colors or fonts.

## Color tokens (Tailwind: `spyder-*`)

Core brand:
- `spyder-black` `#000000`
- `spyder-navy` `#0a0e1a` — default page background
- `spyder-navy-light` `#111827`
- `spyder-navy-card` `#0d1526` — card surfaces
- `spyder-red` `#cc0000` — primary / CTA
- `spyder-red-bright` `#ff1a1a` — hover / active
- `spyder-red-dark` `#990000`

Accents (use sparingly, for glow and highlights):
- `spyder-cyan` `#00d4ff` — "electric lake water", live indicators, links
- `spyder-cyan-dim` `#0099cc`
- `spyder-purple` `#a855f7` — "spider-eye" secondary
- `spyder-purple-dim` `#7c3aed`
- `spyder-gold` `#f5a623` — "sunset dock", ratings/badges
- `spyder-gold-light` `#fbbf24`

Neutrals:
- `spyder-white` `#ffffff`, `spyder-gray` `#9ca3af`, `spyder-gray-dark` `#374151`, `spyder-gray-light` `#d1d5db`

## Fonts

- `font-sans` -> **Inter** (body, UI)
- `font-display` -> **Oswald** (headings, hero, condensed bold uppercase). Use for section titles and "LIVE" energy.

## Gradients (bg utilities)

- `bg-hero-gradient` — dark top-to-bottom overlay for hero over video
- `bg-card-gradient` — bottom fade for cam-card captions over thumbnails
- `bg-red-glow` / `bg-cyan-glow` — radial glow behind featured elements

## Animations (Tailwind `animate-*`)

`animate-pulse-live` (the red LIVE dot — always use for live indicators), `animate-slide-up`, `animate-fade-in`, `animate-boat-sail`, `animate-web-breathe` (subtle spider-web bg texture), `animate-neon-flicker`, `animate-eye-glow`. Reuse these; do not hand-roll new keyframes unless a genuinely new motion is needed — then add it to `tailwind.config.ts` alongside these.

## Voice

Energetic, local, boater-friendly — Lake of the Ozarks nightlife and daytime-on-the-water. Short, punchy, present-tense ("Live right now", "Tap to watch", "See who's at the dock"). Reference real businesses and mile markers. Never corporate or stiff. Keep the SpyderNetwork name and identity exactly as-is.

## Non-negotiables

- Mobile-first, dark theme, touch-friendly. Large tap targets, big live thumbnails.
- Red is the brand anchor; cyan/purple/gold are accents only.
- Always show an `animate-pulse-live` red dot + "LIVE" on live feeds.
- Keep contrast high (white / gray-light text on navy).
