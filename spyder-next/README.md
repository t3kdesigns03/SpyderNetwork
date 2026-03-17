# Spyder Network — Lake of the Ozarks Live Cams

Next.js 15 App Router rebuild of the Spyder Network live cam site. Lake glassmorphism theme with deep navy (#0a1428), Spyder red (#e11d48), and black (#111111) brand colors.

## Features

- **Full-screen hero** with featured live cam (Backwater Jack's Stage) + real-time stats overlay
- **Floating PiP Player** — draggable, minimizable, stays on screen across navigation
- **Floating Control Orb** — Random Cam, Nightlife Mode, Happening Now, My Favorites
- **57 cameras** — Bars & Grills, Pools, Stages, Docks, Views, Other
- **Interactive Map** — Mapbox with pulsing boat icons, click to open PiP
- **Nightlife & Events** — 2026 events calendar with "Featured on Cam" links
- **After Dark mode** — neon red glows, firefly particles
- **PWA** — Install as "Lake TV"

## Setup

```bash
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

Get a free token at [mapbox.com](https://mapbox.com).

## Run

```bash
npm run dev
```

## Replace Demo Video URLs

Edit `src/data/cameras.ts` and replace the `DEMO_VIDEO` URL with your real HLS streams. Each camera has a `videoUrl` field.

## Build

```bash
npm run build
```

