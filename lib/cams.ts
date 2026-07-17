import type { Cam } from "@/types";

// ─── Channel map (scraped from spydernetwork.com – complete as of 2026-07-13) ──
//
// This is the single source of truth for every live stream we embed.
// Keep this block updated whenever a new camera is added or a channel changes.
// Format: slug / name                        → channel / provider
//
// ── HERO ────────────────────────────────────────────────────────────────────
// featured                                   → spydernetwork68
//
// ── BACKWATER JACKS ─────────────────────────────────────────────────────────
// backwater-jacks-pool                       → spydernetwork3
// backwater-jacks-stage                      → spydernetwork5
// backwater-jacks-dock                       → spydernetwork12
// backwater-jacks-dock-1                     → spydernetwork13
// backwater-jacks-level-five                 → spydernetwork66
//
// ── DOG DAYS ────────────────────────────────────────────────────────────────
// dog-days-pool                              → spydernetwork31
// dog-days-stage                             → spydernetwork27
// dog-days-dock                              → spydernetwork29
// dog-days-dock-1                            → spydernetwork28
//
// ── LAZY GATORS ─────────────────────────────────────────────────────────────
// lazy-gators-pool                           → spydernetwork4
// lazy-gators-stage                          → spydernetwork15
// lazy-gators-dock-1                         → spydernetwork16
// lazy-gators-dock-2                         → spydernetwork17
//
// ── FISH AND COMPANY ────────────────────────────────────────────────────────
// fish-and-company-stage                     → spydernetwork35
// fish-and-company-patio                     → spydernetwork11
// fish-and-company-dock-1                    → spydernetwork23
// fish-and-company-dock-2                    → spydernetwork26
//
// ── ALHONNA RESORT & MARINA ─────────────────────────────────────────────────
// alhonna-indoor-pool                        → spydernetwork65
// alhonna-outdoor-pool                       → spydernetwork61
//
// ── ENCORE ──────────────────────────────────────────────────────────────────
// encore-stage                               → spydernetwork10
// encore-pool                                → spydernetwork9
// encore-pool-bar                            → spydernetwork8
//
// ── NEON TACO ───────────────────────────────────────────────────────────────
// neon-taco-stage                            → spydernetwork18
// neon-taco-docks                            → spydernetwork19
// neon-taco-bar                              → spydernetwork20
//
// ── WICKED WILLIE'S ─────────────────────────────────────────────────────────
// wicked-willies-bar                         → spydernetwork1
// wicked-willies-restaurant                  → spydernetwork36
// wicked-willies-patio                       → spydernetwork49
//
// ── KRMS RADIO ──────────────────────────────────────────────────────────────
// krms-studio                                → spydernetwork53
// krms-north                                 → spydernetwork50
// krms-east                                  → spydernetwork51
// krms-southeast                             → spydernetwork52
//
// ── TUCKER'S SHUCKERS ───────────────────────────────────────────────────────
// tucker-shuckers-north                      → spydernetwork2
// tucker-shuckers-south                      → spydernetwork32
//
// ── JB HOOKS (non-Twitch) ───────────────────────────────────────────────────
// jb-hooks-bridge                            → ipcamlive (jbhooksbridge)
// jb-hooks-left                              → ipcamlive (jbhooksleft)
//
// ── NEW CAMERAS ADDED 2026-07-13 (28) ───────────────────────────────────────
// angels-mexican-restaurant                  → spydernetwork72
// annamarie-hopkins-real-estate              → spydernetwork33
// bridgeview-marina                          → spydernetwork69
// camdenton-glass-north                      → spydernetwork58
// camdenton-glass-south                      → spydernetwork57
// dock-glide                                 → spydernetwork21
// dogwood-animal-shelter                     → spydernetwork59
// double-ds-roadhouse                        → spydernetwork60
// ellerman-mm17                              → spydernetwork34
// lake-billiards                             → spydernetwork6
// lake-and-land-inside                       → spydernetwork56
// lake-and-land-outside                      → spydernetwork54
// linn-creek-cove / spydernetwork-dock       → spydernetwork62
// lucys-at-the-lake                          → spydernetwork63
// marty-byrdes-street                        → spydernetwork24
// marty-byrdes-bar                           → spydernetwork25
// michaels-steak-chalet-patio                → spydernetwork39
// michaels-steak-chalet-lake-view            → spydernetwork38
// outlaws-mens-outpost                       → spydernetwork55
// paradise-east                              → spydernetwork45
// paradise-north                             → spydernetwork44
// split-arrow-boutique                       → spydernetwork7
// cactus-blossom-boutique                    → spydernetwork64
// the-hatch                                  → spydernetwork14
// topsider-condos                            → spydernetwork37
// rip-tavern                                 → spydernetwork40
// spydernetwork-ptz                          → spydernetwork70
// roaming-cam                                → spydernetwork          (base channel)
//
// ── STILL UNMAPPED / NEEDS INVESTIGATION ────────────────────────────────────
// spydernetwork22, 30, 41, 46, 47, 48, 67, 71  (and any higher numbers)
// These channels exist but were not attached to a public business page at scrape time.
export const CAMS: Cam[] = [
  // ── HERO / FEATURED ───────────────────────────────────────────────────────
  // spydernetwork68 is the primary SpyderNetwork broadcast channel.
  // Shown as the hero feed above the grouped cam list.
  {
    id: "hero-featured",
    name: "Featured",
    business: "SpyderNetwork",
    slug: "featured",
    category: "lake-view",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork68",
    isFeatured: true,
    isLive: true,
    description: "SpyderNetwork flagship live feed — Lake of the Ozarks",
    spyderPageUrl: "https://spydernetwork.com",
    lat: 38.1030,
    lng: -92.6272,
  },

  // ── BACKWATER JACKS ───────────────────────────────────────────────────────
  {
    id: "bwj-pool",
    name: "Pool",
    business: "Backwater Jacks",
    slug: "backwater-jacks-pool",
    category: "pool",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork3",
    isLive: true,
    // NOTE: isFeatured is reserved for the single hero cam only. Any cam with
    // isFeatured:true is stripped from ALL_CAMS and would vanish from its
    // business group — so pool cams must NOT set it (they use sponsorTier).
    sponsorTier: "premium",
    description: "Pool deck & swim area — poolside cocktails, live music, legendary sunsets",
    websiteUrl: "https://backwaterjacks.com",
    spyderPageUrl: "https://spydernetwork.com/backwater-jacks-pool/",
    lat: 38.169,
    lng: -92.620,
  },
  {
    id: "bwj-stage",
    name: "Stage",
    business: "Backwater Jacks",
    slug: "backwater-jacks-stage",
    category: "stage",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork5",
    isLive: true,
    description: "Stage & patio — live bands, crowds, Lake Ozarks nightlife",
    websiteUrl: "https://backwaterjacks.com",
    spyderPageUrl: "https://spydernetwork.com/backwater-jacks-stage/",
    lat: 38.169,
    lng: -92.620,
  },
  {
    id: "bwj-dock1",
    name: "Dock",
    business: "Backwater Jacks",
    slug: "backwater-jacks-dock",
    category: "dock",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork12",
    isLive: true,
    description: "Main dock — boat traffic & waterfront activity",
    websiteUrl: "https://backwaterjacks.com",
    spyderPageUrl: "https://spydernetwork.com/backwater-jacks-dock/",
    lat: 38.169,
    lng: -92.621,
  },
  {
    id: "bwj-dock2",
    name: "Dock 2",
    business: "Backwater Jacks",
    slug: "backwater-jacks-dock-1",
    category: "dock",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork13",
    isLive: true,
    description: "Boat parking dock — check availability before you arrive",
    websiteUrl: "https://backwaterjacks.com",
    spyderPageUrl: "https://spydernetwork.com/backwater-jacks-dock-1/",
    lat: 38.1685,
    lng: -92.621,
  },
  {
    id: "bwj-level5",
    name: "Level Five",
    business: "Backwater Jacks",
    slug: "backwater-jacks-level-five",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork66",
    isLive: true,
    description: "Level Five rooftop bar — elevated views, pool parties, dance floor",
    websiteUrl: "https://www.level5loz.com",
    spyderPageUrl: "https://spydernetwork.com/backwater-jacks-level-five-lake-ozarks/",
    lat: 38.1692,
    lng: -92.6205,
  },

  // ── DOG DAYS ──────────────────────────────────────────────────────────────
  {
    id: "dd-pool",
    name: "Pool",
    business: "Dog Days",
    slug: "dog-days-pool",
    category: "pool",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork31",
    isLive: true,
    // isFeatured removed: reserved for the hero cam (see Backwater Jacks Pool note).
    sponsorTier: "featured",
    description: "Poolside at Dog Days — the ultimate lakeside experience",
    websiteUrl: "https://dogdays.ws",
    spyderPageUrl: "https://spydernetwork.com/dog-days-pool/",
    lat: 38.1048,
    lng: -92.6291,
  },
  {
    id: "dd-stage",
    name: "Stage",
    business: "Dog Days",
    slug: "dog-days-stage",
    category: "stage",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork27",
    isLive: true,
    description: "Live entertainment stage — cocktails, crowds & music",
    websiteUrl: "https://dogdays.ws",
    spyderPageUrl: "https://spydernetwork.com/dog-days-stage/",
    lat: 38.1048,
    lng: -92.6291,
  },
  {
    id: "dd-dock1",
    name: "Dock",
    business: "Dog Days",
    slug: "dog-days-dock",
    category: "dock",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork29",
    isLive: true,
    description: "Dock & lakefront — see boat parking availability",
    websiteUrl: "https://dogdays.ws",
    spyderPageUrl: "https://spydernetwork.com/dog-days-dock/",
    lat: 38.1043,
    lng: -92.6296,
  },
  {
    id: "dd-dock2",
    name: "Dock 2",
    business: "Dog Days",
    slug: "dog-days-dock-1",
    category: "dock",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork28",
    isLive: true,
    description: "Second dock view — waterfront lake activity",
    websiteUrl: "https://dogdays.ws",
    spyderPageUrl: "https://spydernetwork.com/dog-days-dock-1/",
    lat: 38.1040,
    lng: -92.6298,
  },

  // ── LAZY GATORS ───────────────────────────────────────────────────────────
  {
    id: "lg-pool",
    name: "Pool",
    business: "Lazy Gators",
    slug: "lazy-gators-pool",
    category: "pool",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork4",
    isLive: true,
    // isFeatured removed: reserved for the hero cam (see Backwater Jacks Pool note).
    sponsorTier: "featured",
    description: "Pool cam — fun in the sun at Lazy Gators",
    websiteUrl: "https://lazygators.com",
    spyderPageUrl: "https://spydernetwork.com/lazy-gators-pool/",
    lat: 38.1318,
    lng: -92.6481,
  },
  {
    id: "lg-stage",
    name: "Stage",
    business: "Lazy Gators",
    slug: "lazy-gators-stage",
    category: "stage",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork15",
    isLive: true,
    description: "Stage & bar area — live music and waterfront vibes",
    websiteUrl: "https://lazygators.com",
    spyderPageUrl: "https://spydernetwork.com/lazy-gators/",
    lat: 38.1318,
    lng: -92.648,
  },
  {
    id: "lg-dock1",
    name: "Dock",
    business: "Lazy Gators",
    slug: "lazy-gators-dock-1",
    category: "dock",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork16",
    isLive: true,
    description: "Dock cam — boat parking and lake views",
    websiteUrl: "https://lazygators.com",
    spyderPageUrl: "https://spydernetwork.com/lazy-gators-dock-1/",
    lat: 38.1315,
    lng: -92.6485,
  },
  {
    id: "lg-dock2",
    name: "Dock 2",
    business: "Lazy Gators",
    slug: "lazy-gators-dock-2",
    category: "dock",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork17",
    isLive: true,
    description: "Second dock — additional boat parking view",
    websiteUrl: "https://lazygators.com",
    spyderPageUrl: "https://spydernetwork.com/lazy-gators-dock-2/",
    lat: 38.1312,
    lng: -92.6487,
  },

  // ── FISH AND COMPANY ──────────────────────────────────────────────────────
  {
    id: "fc-stage",
    name: "Stage",
    business: "Fish and Company",
    slug: "fish-and-company-stage",
    category: "stage",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork35",
    isLive: true,
    description: "\"Dale Blue\" stage — live entertainment at this 31MM landmark",
    websiteUrl: "https://thefishandcompany.com",
    spyderPageUrl: "https://spydernetwork.com/fish-and-company-stage/",
    lat: 38.1601,
    lng: -92.6667,
  },
  {
    id: "fc-patio",
    name: "Patio",
    business: "Fish and Company",
    slug: "fish-and-company-patio",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork11",
    isLive: true,
    description: "Restaurant patio — dining, dancing, great food at the lake",
    websiteUrl: "https://thefishandcompany.com",
    spyderPageUrl: "https://spydernetwork.com/fish-and-company-patio/",
    lat: 38.1601,
    lng: -92.6668,
  },
  {
    id: "fc-dock1",
    name: "Dock",
    business: "Fish and Company",
    slug: "fish-and-company-dock-1",
    category: "dock",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork23",
    isLive: true,
    description: "Dock with waverunner lifts — boat activity at this popular destination",
    websiteUrl: "https://thefishandcompany.com",
    spyderPageUrl: "https://spydernetwork.com/fish-and-company-dock-1/",
    lat: 38.1598,
    lng: -92.6671,
  },
  {
    id: "fc-dock2",
    name: "Dock 2",
    business: "Fish and Company",
    slug: "fish-and-company-dock-2",
    category: "dock",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork26",
    isLive: true,
    description: "Boat parking dock — real-time availability view",
    websiteUrl: "https://thefishandcompany.com",
    spyderPageUrl: "https://spydernetwork.com/fish-and-company/",
    lat: 38.1596,
    lng: -92.6673,
  },


  // ── ALHONNA RESORT & MARINA ───────────────────────────────────────────────
  {
    id: "alhonna-indoor",
    name: "Indoor Pool",
    business: "Alhonna Resort & Marina",
    slug: "alhonna-indoor-pool",
    category: "pool",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork65",
    isLive: true,
    description: "Indoor pool — famous Alhonna resort, featured in TV show Ozark",
    websiteUrl: "https://thealhonnaresort.com",
    spyderPageUrl: "https://spydernetwork.com/alhonna-resort-marina-indoor-pool/",
    lat: 38.178,
    lng: -92.614,
  },
  {
    id: "alhonna-outdoor",
    name: "Outdoor Pool",
    business: "Alhonna Resort & Marina",
    slug: "alhonna-outdoor-pool",
    category: "pool",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork61",
    isLive: true,
    description: "Outdoor pool & lake conditions — home of the Blue Cat Lounge",
    websiteUrl: "https://thealhonnaresort.com",
    spyderPageUrl: "https://spydernetwork.com/alhonna-resort-marina-outdoor-pool/",
    lat: 38.1782,
    lng: -92.6138,
  },

  // ── ENCORE LAKESIDE GRILL ─────────────────────────────────────────────────
  {
    id: "encore-stage",
    name: "Stage",
    business: "Encore",
    slug: "encore-stage",
    category: "stage",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork10",
    isLive: true,
    description: "Encore Skybar stage — top bands, outdoor venue, Lake Ozarks",
    websiteUrl: "https://theencoregrill.com",
    spyderPageUrl: "https://spydernetwork.com/encore-lakeside-grill-stage-live-cam-top-bands-lake-of-the-ozarks/",
    lat: 38.1218,
    lng: -92.6315,
  },
  {
    id: "encore-pool",
    name: "Pool",
    business: "Encore",
    slug: "encore-pool",
    category: "pool",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork9",
    isLive: true,
    description: "Pool bar — Encore's famous outdoor pool entertainment complex",
    websiteUrl: "https://theencoregrill.com",
    spyderPageUrl: "https://spydernetwork.com/encore-lakeside-grill-pool-bar-live-cam-top-bands-lake-of-the-ozarks/",
    lat: 38.1220,
    lng: -92.6313,
  },
  {
    id: "encore-poolbar",
    name: "Pool Bar",
    business: "Encore",
    slug: "encore-pool-bar",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork8",
    isLive: true,
    description: "Pool bar view — live music, dancing, amazing sunsets",
    websiteUrl: "https://theencoregrill.com",
    spyderPageUrl: "https://spydernetwork.com/encore-lakeside-grill-pool-live-cam-top-bands-lake-of-the-ozarks/",
    lat: 38.1222,
    lng: -92.6311,
  },

  // ── NEON TACO ─────────────────────────────────────────────────────────────
  {
    id: "nt-stage",
    name: "Stage",
    business: "Neon Taco",
    slug: "neon-taco-stage",
    category: "stage",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork18",
    isLive: true,
    description: "Neon Taco stage — live music on the Bagnell Dam Strip",
    websiteUrl: "https://www.theneontaco.com",
    spyderPageUrl: "https://spydernetwork.com/neon-taco-stage/",
    lat: 38.1962,
    lng: -92.6110,
  },
  {
    id: "nt-docks",
    name: "Docks",
    business: "Neon Taco",
    slug: "neon-taco-docks",
    category: "dock",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork19",
    isLive: true,
    description: "Dock cam — boat parking and lake views on the strip",
    websiteUrl: "https://www.theneontaco.com",
    spyderPageUrl: "https://spydernetwork.com/neon-taco-docks/",
    lat: 38.1960,
    lng: -92.6112,
  },
  {
    id: "nt-bar",
    name: "Bar",
    business: "Neon Taco",
    slug: "neon-taco-bar",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork20",
    isLive: true,
    description: "Lakeside bar — relaxed atmosphere, tacos, Bagnell Dam Strip",
    websiteUrl: "https://www.theneontaco.com",
    spyderPageUrl: "https://spydernetwork.com/neon-taco-bar/",
    lat: 38.1963,
    lng: -92.6108,
  },

  // ── WICKED WILLIE'S ───────────────────────────────────────────────────────
  {
    id: "ww-bar",
    name: "Bar",
    business: "Wicked Willie's",
    slug: "wicked-willies-bar",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork1",
    isLive: true,
    description: "Sports bar with 36 HD TVs — the go-to spot in Osage Beach",
    websiteUrl: "https://wickedwilliessportsgrill.com",
    spyderPageUrl: "https://spydernetwork.com/wicked-willies-bar/",
    lat: 38.1038,
    lng: -92.6298,
  },
  {
    id: "ww-restaurant",
    name: "Restaurant",
    business: "Wicked Willie's",
    slug: "wicked-willies-restaurant",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork36",
    isLive: true,
    description: "Dining room — sports, food & family fun in Osage Beach",
    websiteUrl: "https://wickedwilliessportsgrill.com",
    spyderPageUrl: "https://spydernetwork.com/wicked-willies-restaurant/",
    lat: 38.1040,
    lng: -92.6296,
  },
  {
    id: "ww-patio",
    name: "Patio",
    business: "Wicked Willie's",
    slug: "wicked-willies-patio",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork49",
    isLive: true,
    description: "Outdoor patio — 3 massive projection screens, live sports",
    websiteUrl: "https://wickedwilliessportsgrill.com",
    spyderPageUrl: "https://spydernetwork.com/wicked-willies-patio/",
    lat: 38.1036,
    lng: -92.6300,
  },

  // ── KRMS RADIO ────────────────────────────────────────────────────────────
  {
    id: "krms-studio",
    name: "Studio",
    business: "KRMS Radio",
    slug: "krms-studio",
    category: "radio",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork53",
    isLive: true,
    description: "Live broadcast studio — Lake of the Ozarks local radio",
    websiteUrl: "https://www.krmsradio.com",
    spyderPageUrl: "https://spydernetwork.com/krms-radio/",
    lat: 38.1052,
    lng: -92.6381,
  },
  {
    id: "krms-north",
    name: "North Tower",
    business: "KRMS Radio",
    slug: "krms-north",
    category: "lake-view",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork50",
    isLive: true,
    description: "Panoramic north view from KRMS tower — expansive Osage Beach skyline",
    websiteUrl: "https://www.krmsradio.com",
    spyderPageUrl: "https://spydernetwork.com/krms-radio-north/",
    lat: 38.1054,
    lng: -92.6379,
  },
  {
    id: "krms-east",
    name: "East Tower",
    business: "KRMS Radio",
    slug: "krms-east",
    category: "lake-view",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork51",
    isLive: true,
    description: "East view from KRMS tower — city and lake panorama",
    websiteUrl: "https://www.krmsradio.com",
    spyderPageUrl: "https://spydernetwork.com/krms-radio-east/",
    lat: 38.1056,
    lng: -92.6377,
  },
  {
    id: "krms-southeast",
    name: "SE Tower",
    business: "KRMS Radio",
    slug: "krms-southeast",
    category: "lake-view",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork52",
    isLive: true,
    description: "Southeast view from KRMS tower — stunning aerial lake view",
    websiteUrl: "https://www.krmsradio.com",
    spyderPageUrl: "https://spydernetwork.com/krms-radio-south-east/",
    lat: 38.1050,
    lng: -92.6375,
  },

  // ── TUCKER'S SHUCKERS ─────────────────────────────────────────────────────
  {
    id: "ts-north",
    name: "North",
    business: "Tucker's Shuckers",
    slug: "tucker-shuckers-north",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork2",
    isLive: true,
    description: "Bagnell Strip street view north — fresh oysters, 28 beers on tap",
    websiteUrl: "https://tuckersshuckers.com",
    spyderPageUrl: "https://spydernetwork.com/tucker-shuckers-north/",
    lat: 38.1921,
    lng: -92.6132,
  },
  {
    id: "ts-south",
    name: "South",
    business: "Tucker's Shuckers",
    slug: "tucker-shuckers-south",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork32",
    isLive: true,
    description: "Bagnell Strip street view south — historic strip live action",
    websiteUrl: "https://tuckersshuckers.com",
    spyderPageUrl: "https://spydernetwork.com/tucker-shuckers-south/",
    lat: 38.1919,
    lng: -92.6134,
  },

  // ── JB HOOKS ──────────────────────────────────────────────────────────────
  // JB Hooks uses ipcamlive (not Twitch) — embedded as iframes
  {
    id: "jbh-bridge",
    name: "Bridge View",
    business: "JB Hooks",
    slug: "jb-hooks-bridge",
    category: "lake-view",
    streamProvider: "iframe",
    iframeUrl: "https://g1.ipcamlive.com/player/player.php?alias=jbhooksbridge",
    isLive: true,
    description: "Bridge cam — scenic lake and dam views at JB Hooks",
    websiteUrl: "https://www.jbhooks.com",
    spyderPageUrl: "https://spydernetwork.com/jb-hooks/",
    lat: 38.1938,
    lng: -92.6118,
  },
  {
    id: "jbh-left",
    name: "Left Cam",
    business: "JB Hooks",
    slug: "jb-hooks-left",
    category: "bar-grill",
    streamProvider: "iframe",
    iframeUrl: "https://g1.ipcamlive.com/player/player.php?alias=jbhooksleft",
    isLive: true,
    description: "Restaurant & dock left cam — fine dining, Bagnell Dam area",
    websiteUrl: "https://www.jbhooks.com",
    spyderPageUrl: "https://spydernetwork.com/jb-hooks/",
    lat: 38.1936,
    lng: -92.6120,
  },

  // ── ANGELS MEXICAN RESTAURANT ─────────────────────────────────────────────
  {
    id: "angels-lakeview",
    name: "Lake View",
    business: "Angels Mexican Restaurant",
    slug: "angels-mexican-restaurant",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork72",
    isLive: true,
    description: "Lake view from Angels Mexican Restaurant — Lake of the Ozarks",
    websiteUrl: "https://www.facebook.com/profile.php?id=61577060969567",
    spyderPageUrl: "https://spydernetwork.com/angels-mexican-restaurant-lake-view-lake-ozarks/",
    lat: 38.1580,
    lng: -92.6390,
  },

  // ── ANNAMARIE HOPKINS REAL ESTATE ─────────────────────────────────────────
  {
    id: "annamarie-hopkins",
    name: "Strip View",
    business: "Annamarie Hopkins Real Estate",
    slug: "annamarie-hopkins-real-estate",
    category: "real-estate",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork33",
    isLive: true,
    description: "Bagnell Dam Strip street view — sponsored by Anna Marie Hopkins Real Estate",
    websiteUrl: "https://asmartermove.com",
    spyderPageUrl: "https://spydernetwork.com/annamarie-hopkins-smarter-move-real-estate/",
    lat: 38.1958,
    lng: -92.6116,
  },

  // ── BRIDGEVIEW MARINA ─────────────────────────────────────────────────────
  {
    id: "bridgeview-marina",
    name: "Gas Dock",
    business: "Bridgeview Marina",
    slug: "bridgeview-marina",
    category: "marina",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork69",
    isLive: true,
    description: "Fuel dock & waterfront — best marina and staff on the lake",
    websiteUrl: "https://www.facebook.com/pages/Bridgeview%20Marina/157000694367289/",
    spyderPageUrl: "https://spydernetwork.com/bridgeview-marina/",
    lat: 38.1300,
    lng: -92.6900,
  },

  // ── CAMDENTON GLASS ───────────────────────────────────────────────────────
  {
    id: "camdenton-glass-north",
    name: "North",
    business: "Camdenton Glass",
    slug: "camdenton-glass-north",
    category: "shop",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork58",
    isLive: true,
    description: "Hwy 54 street view north through Camdenton — sponsored by Camdenton Glass",
    websiteUrl: "https://camdentonglass.com",
    spyderPageUrl: "https://spydernetwork.com/camdenton-glass-north/",
    lat: 38.0080,
    lng: -92.7440,
  },
  {
    id: "camdenton-glass-south",
    name: "South",
    business: "Camdenton Glass",
    slug: "camdenton-glass-south",
    category: "shop",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork57",
    isLive: true,
    description: "Hwy 54 street view south through Camdenton — sponsored by Camdenton Glass",
    websiteUrl: "https://camdentonglass.com",
    spyderPageUrl: "https://spydernetwork.com/camdenton-glass-south/",
    lat: 38.0050,
    lng: -92.7445,
  },

  // ── DOCK GLIDE ────────────────────────────────────────────────────────────
  {
    id: "dock-glide",
    name: "Lake View",
    business: "Dock Glide",
    slug: "dock-glide",
    category: "lake-view",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork21",
    isLive: true,
    mile: "4",
    description: "Live lake view at Mile Marker 4 — sponsored by Dock Glide",
    websiteUrl: "https://dockglide.com",
    spyderPageUrl: "https://spydernetwork.com/dock-glide/",
    lat: 38.1980,
    lng: -92.6280,
  },

  // ── DOGWOOD ANIMAL SHELTER ────────────────────────────────────────────────
  {
    id: "dogwood-shelter",
    name: "Puppy Cam",
    business: "Dogwood Animal Shelter",
    slug: "dogwood-animal-shelter",
    category: "shelter",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork59",
    isLive: true,
    description: "Watch playful pups live — adopt a pet at Dogwood Animal Shelter",
    websiteUrl: "https://www.daslakeoftheozarks.com",
    spyderPageUrl: "https://spydernetwork.com/dogwood-animal-shelter/",
    lat: 38.1450,
    lng: -92.6170,
  },

  // ── DOUBLE D'S ROADHOUSE ──────────────────────────────────────────────────
  {
    id: "double-ds",
    name: "Bar",
    business: "Double D's Roadhouse",
    slug: "double-ds-roadhouse",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork60",
    isLive: true,
    description: "Neighborhood bar & grill — live music, karaoke and good times",
    websiteUrl: "https://www.facebook.com/profile.php?id=61580721951243",
    spyderPageUrl: "https://spydernetwork.com/double-ds-roadhouse/",
    lat: 38.1500,
    lng: -92.6600,
  },

  // ── ELLERMAN VRBO RENTAL ──────────────────────────────────────────────────
  {
    id: "ellerman-lakeview",
    name: "Lake View",
    business: "Ellerman VRBO Rental",
    slug: "ellerman-lake-view",
    category: "lake-view",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork34",
    isLive: true,
    mile: "17",
    description: "Lake view from Ellerman VRBO vacation rental — Lake of the Ozarks",
    websiteUrl: "https://www.vrbo.com/1342280?noDates=true",
    spyderPageUrl: "https://spydernetwork.com/ellerman/",
    lat: 38.0900,
    lng: -92.7000,
  },

  // ── LAKE BILLIARDS SPORTS BAR & GRILL ─────────────────────────────────────
  {
    id: "lake-billiards",
    name: "Sports Bar",
    business: "Lake Billiards Sports Bar & Grill",
    slug: "lake-billiards",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork6",
    isLive: true,
    description: "Pool tables, darts, great food — Lake Billiards in Osage Beach",
    websiteUrl: "https://lakebilliards.com/index.html",
    spyderPageUrl: "https://spydernetwork.com/lake-billiards/",
    lat: 38.1350,
    lng: -92.6570,
  },

  // ── LAKE & LAND TRADING COMPANY ───────────────────────────────────────────
  {
    id: "lake-land-inside",
    name: "Inside",
    business: "Lake & Land Trading Company",
    slug: "lake-land-trading-inside",
    category: "shop",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork56",
    isLive: true,
    description: "Inside the boutique — upscale lake decor, gear, clothing and gifts",
    websiteUrl: "https://www.facebook.com/LakeandLandTradingCompany",
    spyderPageUrl: "https://spydernetwork.com/lake-land-trading-company/",
    lat: 38.1420,
    lng: -92.6420,
  },
  {
    id: "lake-land-outside",
    name: "Outside",
    business: "Lake & Land Trading Company",
    slug: "lake-land-trading-outside",
    category: "shop",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork54",
    isLive: true,
    description: "Outdoor view at Lake & Land Trading Company boutique — Osage Beach",
    websiteUrl: "https://www.facebook.com/LakeandLandTradingCompany",
    spyderPageUrl: "https://spydernetwork.com/lake-land-trading-company-lot/",
    lat: 38.1421,
    lng: -92.6421,
  },

  // ── LINN CREEK COVE (SpyderNetwork Dock) ──────────────────────────────────
  {
    id: "linn-creek-cove",
    name: "Cove",
    business: "Linn Creek Cove",
    slug: "linn-creek-cove",
    category: "lake-view",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork62",
    isLive: true,
    mile: "31",
    description: "Linn Creek Cove & Fish & Company boat traffic at the 31MM",
    websiteUrl: "https://spydernetwork.com",
    spyderPageUrl: "https://spydernetwork.com/spydernetwork-dock/",
    lat: 38.1595,
    lng: -92.6665,
  },

  // ── LUCY'S AT THE LAKE ────────────────────────────────────────────────────
  {
    id: "lucys-at-the-lake",
    name: "Strip View",
    business: "Lucy's At The Lake",
    slug: "lucys-at-the-lake",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork63",
    isLive: true,
    description: "Bagnell Dam Strip street view — the lake's only martini bar",
    websiteUrl: "https://www.facebook.com/lucysbagnelldamstrip/",
    spyderPageUrl: "https://spydernetwork.com/lucys-at-the-lake/",
    lat: 38.1954,
    lng: -92.6119,
  },

  // ── MARTY BYRDE'S GASTROPUB ───────────────────────────────────────────────
  {
    id: "marty-byrdes-street",
    name: "Street",
    business: "Marty Byrde's",
    slug: "marty-byrdes-street",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork24",
    isLive: true,
    description: "Bagnell Dam Strip street view — Ozark-inspired gastropub, as seen on Ozark Law",
    websiteUrl: "https://martybyrde.com",
    spyderPageUrl: "https://spydernetwork.com/marty-byrds-outside/",
    lat: 38.1951,
    lng: -92.6121,
  },
  {
    id: "marty-byrdes-bar",
    name: "Bar",
    business: "Marty Byrde's",
    slug: "marty-byrdes-bar",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork25",
    isLive: true,
    description: "Outdoor bar area — signature cocktails inspired by the Netflix series Ozark",
    websiteUrl: "https://martybyrde.com",
    spyderPageUrl: "https://spydernetwork.com/marty-byrds-inside/",
    lat: 38.1951,
    lng: -92.6122,
  },

  // ── MICHAEL'S STEAK CHALET ────────────────────────────────────────────────
  {
    id: "michaels-patio",
    name: "Patio",
    business: "Michael's Steak Chalet",
    slug: "michaels-steak-chalet-patio",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork39",
    isLive: true,
    description: "Outdoor patio live music — hand-cut steaks and chalet-style charm",
    websiteUrl: "https://steakchalet.com",
    spyderPageUrl: "https://spydernetwork.com/michaels-steak-chalet/",
    lat: 38.1520,
    lng: -92.6400,
  },
  {
    id: "michaels-view",
    name: "Lake View",
    business: "Michael's Steak Chalet",
    slug: "michaels-steak-chalet-view",
    category: "lake-view",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork38",
    isLive: true,
    mile: "28",
    description: "Stunning lake views and sunsets at the 28MM — Michael's Steak Chalet",
    websiteUrl: "https://steakchalet.com",
    spyderPageUrl: "https://spydernetwork.com/michaels-steak-chalet-view/",
    lat: 38.1500,
    lng: -92.6420,
  },

  // ── OUTLAW MEN'S OUTPOST ──────────────────────────────────────────────────
  {
    id: "outlaw-mens-outpost",
    name: "Strip View",
    business: "Outlaw Men's Outpost",
    slug: "outlaw-mens-outpost",
    category: "shop",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork55",
    isLive: true,
    description: "Bagnell Dam Strip street view — men's apparel and western decor, as seen on Ozark Law",
    websiteUrl: "https://www.facebook.com/profile.php?id=100090091344256",
    spyderPageUrl: "https://spydernetwork.com/outlaws-mens-outpost/",
    lat: 38.1948,
    lng: -92.6123,
  },

  // ── PARADISE RESTAURANT & BAR ─────────────────────────────────────────────
  {
    id: "paradise-east",
    name: "East",
    business: "Paradise Restaurant & Bar",
    slug: "paradise-east",
    category: "dock",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork45",
    isLive: true,
    mile: "24",
    description: "Waterfront dock activity at the 24MM — Paradise Restaurant & Bar",
    websiteUrl: "https://www.paradiseatthelake.com",
    spyderPageUrl: "https://spydernetwork.com/paradise-restaurant-bar/",
    lat: 38.1330,
    lng: -92.6600,
  },
  {
    id: "paradise-north",
    name: "North",
    business: "Paradise Restaurant & Bar",
    slug: "paradise-north",
    category: "dock",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork44",
    isLive: true,
    mile: "24",
    description: "Dock & boating activity at the 24MM — Paradise Restaurant & Bar",
    websiteUrl: "https://www.paradiseatthelake.com",
    spyderPageUrl: "https://spydernetwork.com/paradise-restaurant-bar-2/",
    lat: 38.1331,
    lng: -92.6601,
  },

  // ── SPLIT ARROW BOUTIQUE ──────────────────────────────────────────────────
  {
    id: "split-arrow-boutique",
    name: "Strip View",
    business: "Split Arrow Boutique",
    slug: "split-arrow-boutique",
    category: "shop",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork7",
    isLive: true,
    description: "Bagnell Dam Strip street view — women's boutique, as seen on Ozark Law",
    websiteUrl: "https://www.facebook.com/pages/Split-Arrow-Boutique/1952593311687661",
    spyderPageUrl: "https://spydernetwork.com/split-arrow-boutique-3/",
    lat: 38.1946,
    lng: -92.6125,
  },

  // ── THE CACTUS BLOSSOM BOUTIQUE ───────────────────────────────────────────
  {
    id: "cactus-blossom-boutique",
    name: "Strip View",
    business: "The Cactus Blossom Boutique",
    slug: "cactus-blossom-boutique",
    category: "shop",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork64",
    isLive: true,
    description: "Bagnell Dam Strip street view — Southern charm meets Western chic boutique",
    websiteUrl: "https://www.facebook.com/CactusBlossomBtq/",
    spyderPageUrl: "https://spydernetwork.com/the-cactus-blossom-boutique/",
    lat: 38.1944,
    lng: -92.6126,
  },

  // ── THE HATCH AT MILLER'S LANDING ─────────────────────────────────────────
  {
    id: "the-hatch",
    name: "Dock & Lake View",
    business: "The Hatch at Miller's Landing",
    slug: "the-hatch",
    category: "marina",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork14",
    isLive: true,
    description: "Live activity and boat traffic at The Hatch at Miller's Landing Marina",
    websiteUrl: "https://www.facebook.com/TheHatchLOZ",
    spyderPageUrl: "https://spydernetwork.com/the-hatch/",
    lat: 38.1480,
    lng: -92.6550,
  },

  // ── TOPSIDER CONDOS ───────────────────────────────────────────────────────
  {
    id: "topsider-condos",
    name: "Bridge View",
    business: "Topsider Condos",
    slug: "topsider-condos",
    category: "lake-view",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork37",
    isLive: true,
    description: "Boating activity at the Phylicia Carson Memorial / Grand Glaze Bridge, Osage Beach",
    websiteUrl: "https://www.paradiseatthelake.com",
    spyderPageUrl: "https://spydernetwork.com/topsiders-condos/",
    lat: 38.1380,
    lng: -92.6360,
  },

  // ── RIP TAVERN ────────────────────────────────────────────────────────────
  {
    id: "rip-tavern",
    name: "Strip View",
    business: "RIP Tavern",
    slug: "rip-tavern",
    category: "bar-grill",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork40",
    isLive: true,
    description: "Bagnell Dam Strip street view from RIP Tavern — Lake Ozark",
    websiteUrl: "https://www.facebook.com/profile.php?id=61557375811392",
    spyderPageUrl: "https://spydernetwork.com/rip-tavern/",
    lat: 38.1950,
    lng: -92.6120,
  },

  // ── SPYDERNETWORK SPECIAL / ROAMING ───────────────────────────────────────
  {
    id: "spydernetwork-ptz",
    name: "PTZ Cam",
    business: "SpyderNetwork Special",
    slug: "spydernetwork-ptz",
    category: "lake-view",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork70",
    isLive: true,
    description: "SpyderNetwork PTZ / special events camera — Lake of the Ozarks",
    spyderPageUrl: "https://spydernetwork.com/spydernetwork-ptz/",
    lat: 38.1030,
    lng: -92.6272,
  },
  {
    id: "roaming-cam",
    name: "Roaming Cam",
    business: "SpyderNetwork Special",
    slug: "roaming-cam",
    category: "lake-view",
    streamProvider: "twitch",
    twitchChannel: "spydernetwork",
    isLive: true,
    description: "SpyderNetwork roaming camera — live from around Lake of the Ozarks",
    spyderPageUrl: "https://spydernetwork.com/roaming-cam/",
    lat: 38.1030,
    lng: -92.6272,
  },
];

// ── Grouping helpers ──────────────────────────────────────────────────────────

/** The hero / featured cam */
export const HERO_CAM = CAMS.find((c) => c.isFeatured)!;

/** All non-hero cams for cycling and cam lists */
export const ALL_CAMS = CAMS.filter((c) => !c.isFeatured);

/** Unique business names in strict alphabetical (A–Z) display order (hero excluded) */
export const CAM_BUSINESSES = Array.from(
  new Set(ALL_CAMS.map((c) => c.business))
).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

/** Cams keyed by business name */
export const CAMS_BY_BUSINESS = CAM_BUSINESSES.reduce<Record<string, Cam[]>>(
  (acc, biz) => {
    acc[biz] = ALL_CAMS.filter((c) => c.business === biz);
    return acc;
  },
  {});

export function getCamBySlug(slug: string): Cam | undefined {
  return CAMS.find((c) => c.slug === slug);
}
