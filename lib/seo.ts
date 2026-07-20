import type { Metadata } from "next";
import type { Cam } from "@/types";

/**
 * Central SEO configuration + JSON-LD schema builders.
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for the canonical domain, site identity, and all
 * structured data. Route files import from here so metadata, canonicals,
 * sitemap, robots, OG URLs, and schema never drift apart.
 *
 * Canonical domain: beta.spydernetwork.com. All other hosts should 301-redirect
 * here so this stays authoritative. Change SITE.url below to move every SEO URL
 * (canonicals, OG/Twitter, sitemap, robots, schema @ids) to a new domain.
 */

export const SITE = {
  url: "https://beta.spydernetwork.com",
  name: "SpyderNetwork",
  legalName: "SpyderNetwork",
  description:
    "The largest network of live webcams at Lake of the Ozarks. Watch 60+ real-time feeds from bars, marinas, pools, docks, and lakefront venues — free on any device.",
  email: "info@spydernetwork.com",
  twitterHandle: "@spyder_network",
  // Region the network covers — used for local SEO + Place schema.
  area: {
    name: "Lake of the Ozarks",
    region: "MO",
    regionName: "Missouri",
    country: "US",
    // Rough centroid of the lake (Bagnell Dam area) for GeoCoordinates fallback.
    lat: 38.13,
    lng: -92.69,
  },
  sameAs: [
    "https://x.com/spyder_network",
    "https://twitter.com/spyder_network",
  ],
} as const;

/** Stable publication date for live VideoObjects (Google requires uploadDate). */
export const SITE_LAUNCH_ISO = "2025-06-01T00:00:00-05:00";

/** Resolve a path to an absolute URL on the canonical domain. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}

/** Human-readable venue type for a cam, used in copy + descriptions. */
const CATEGORY_LABEL: Record<Cam["category"], string> = {
  "bar-grill": "bar & grill",
  marina: "marina",
  pool: "poolside",
  dock: "dock",
  stage: "live music stage",
  shop: "shop",
  "real-estate": "lakefront property",
  radio: "radio studio",
  shelter: "animal shelter",
  "lake-view": "lakefront",
};

export function camCategoryLabel(cam: Pick<Cam, "category">): string {
  return CATEGORY_LABEL[cam.category] ?? "lakefront";
}

/** Answer-first, entity-rich meta description for a cam page (~150–160 chars). */
export function camMetaDescription(cam: Cam): string {
  const where = cam.mile ? ` (mile marker ${cam.mile})` : "";
  const kind = camCategoryLabel(cam);
  return `Watch ${cam.business} live at ${SITE.area.name}${where} — a real-time ${kind} webcam (${cam.name}) streaming free on SpyderNetwork. No signup, any device.`;
}

/** A cam's canonical page URL. */
export function camUrl(cam: Pick<Cam, "slug">): string {
  return absoluteUrl(`/cams/${cam.slug}`);
}

/** DRY metadata for a static page: canonical + OG + Twitter from one call. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const { title, description, path, image = "/og-image.png" } = opts;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      title: `${title} | ${SITE.name}`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${title} — ${SITE.name}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

// ─── Schema builders (return plain JSON-LD objects) ──────────────────────────

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: absoluteUrl("/android-chrome-512x512.png"),
    image: absoluteUrl("/og-image.png"),
    description: SITE.description,
    email: SITE.email,
    sameAs: SITE.sameAs,
    areaServed: {
      "@type": "Place",
      name: `${SITE.area.name}, ${SITE.area.regionName}`,
    },
    knowsAbout: [
      "Lake of the Ozarks live cams",
      "Lake of the Ozarks webcams",
      "Lake of the Ozarks conditions",
      "Lake of the Ozarks nightlife and marinas",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: "en-US",
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(qas: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** Live-stream VideoObject for an individual cam page. */
export function camVideoSchema(cam: Cam) {
  const title = `${cam.business} – ${cam.name} Live Cam`;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description:
      cam.description ??
      `Live streaming webcam from ${cam.business} at ${SITE.area.name}, ${SITE.area.regionName}.`,
    thumbnailUrl: [cam.thumbnailUrl ?? absoluteUrl("/og-image.png")],
    uploadDate: SITE_LAUNCH_ISO,
    contentUrl: camUrl(cam),
    embedUrl: cam.twitchChannel
      ? `https://player.twitch.tv/?channel=${cam.twitchChannel}`
      : cam.iframeUrl,
    isLiveBroadcast: true,
    publication: {
      "@type": "BroadcastEvent",
      name: title,
      isLiveBroadcast: true,
      startDate: SITE_LAUNCH_ISO,
    },
    publisher: { "@id": `${SITE.url}/#organization` },
    regionsAllowed: "US",
  };
}

/** ItemList of every cam — lets Google + AI see the full catalog as one entity. */
export function camListSchema(cams: Cam[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.area.name} Live Cams`,
    description: `The full directory of ${cams.length}+ live webcams at ${SITE.area.name}, ${SITE.area.regionName}.`,
    numberOfItems: cams.length,
    itemListElement: cams.map((cam, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: camUrl(cam),
      name: `${cam.business} – ${cam.name} Live Cam`,
    })),
  };
}

/** Place schema for the venue a cam is located at (needs coordinates). */
export function camPlaceSchema(cam: Cam) {
  if (typeof cam.lat !== "number" || typeof cam.lng !== "number") return null;
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: cam.business,
    ...(cam.websiteUrl ? { url: cam.websiteUrl } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.area.name,
      addressRegion: SITE.area.region,
      addressCountry: SITE.area.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: cam.lat,
      longitude: cam.lng,
    },
  };
}
