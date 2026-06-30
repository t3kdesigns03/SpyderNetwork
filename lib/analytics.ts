// ─── SpyderNetwork Analytics & UTM utilities ─────────────────────────────────
// Central hub for all outbound click tracking and UTM parameter injection.
//
// Setup:
//   1. Create a GA4 property at analytics.google.com
//   2. Add your Measurement ID to .env.local:
//        NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
//   3. GA4 script is loaded in app/layout.tsx
//
// Every outbound link in the site should call:
//   href  = withUTM(url, { content: toUTMContent(business), term: placement })
//   onClick = () => trackPartnerSite(business, url, placement)
// ─────────────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

/** Where on the site the click originated */
export type Placement =
  | "sponsor-list"     // Homepage partner grid
  | "cam-sidebar"      // Business group "Visit Website" strip
  | "player-bar"       // "Visit Site" link in the player header bar
  | "cast-button"      // "Cast" / Twitch player popup button
  | "twitch-strip"     // "Watch on Twitch" action strip in sidebar
  | "broadcaster-cta"  // Become a Broadcaster section
  | "map-tab";         // Map tab "Full Map" external link

/** What kind of destination the link points to */
export type LinkType = "partner-site" | "twitch" | "cast";

// ─── UTM builder ──────────────────────────────────────────────────────────────
/**
 * Appends SpyderNetwork UTM params to any outbound URL.
 * Safe — returns original URL unchanged if parsing fails.
 *
 * @example
 * withUTM("https://backwaterjacks.com", {
 *   content: "backwater-jacks",
 *   term: "sponsor-list",
 * })
 * // → "https://backwaterjacks.com/?utm_source=spydernetwork&utm_medium=referral
 * //     &utm_campaign=partner-network&utm_content=backwater-jacks&utm_term=sponsor-list"
 */
export function withUTM(
  url: string,
  {
    campaign = "partner-network",
    content,
    term,
    medium = "referral",
  }: {
    campaign?: string;
    content?: string;
    term?: Placement;
    medium?: string;
  } = {}
): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "spydernetwork");
    u.searchParams.set("utm_medium", medium);
    u.searchParams.set("utm_campaign", campaign);
    if (content) u.searchParams.set("utm_content", content);
    if (term)    u.searchParams.set("utm_term", term);
    return u.toString();
  } catch {
    // Malformed URL — return as-is rather than throw
    return url;
  }
}

// ─── Core click tracker ───────────────────────────────────────────────────────
/**
 * Fires a GA4 `outbound_click` event.
 * Silent no-op if GA4 hasn't loaded yet (e.g. ad blocker, slow connection).
 */
export function trackClick({
  business,
  placement,
  url,
  linkType = "partner-site",
}: {
  business: string;
  placement: Placement;
  url: string;
  linkType?: LinkType;
}): void {
  if (typeof window === "undefined") return;

  // GA4 custom event
  window.gtag?.("event", "outbound_click", {
    business,
    placement,
    link_type: linkType,
    url,
    // GA4 also automatically collects page_location, session_id, etc.
  });

  // Dev console — swap for your own logger if needed
  if (process.env.NODE_ENV === "development") {
    console.log("[SpyderNetwork analytics] outbound_click", {
      business,
      placement,
      linkType,
      url,
    });
  }
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

/**
 * Track a click to a partner's own website.
 * Use this for "Visit Website" links and sponsor list cards.
 */
export function trackPartnerSite(
  business: string,
  url: string,
  placement: Placement
): void {
  trackClick({ business, placement, url, linkType: "partner-site" });
}

/**
 * Track a click that opens a Twitch channel page (twitch.tv/channel).
 * Use this for "Watch on Twitch" strip links.
 */
export function trackTwitchClick(channel: string, placement: Placement): void {
  trackClick({
    business: channel,
    placement,
    url: `https://twitch.tv/${channel}`,
    linkType: "twitch",
  });
}

/**
 * Track a Cast / Twitch player popup click.
 * Use this for the "Cast" button in the player header bar.
 */
export function trackCastClick(channel: string, placement: Placement): void {
  trackClick({
    business: channel,
    placement,
    url: `https://player.twitch.tv/?channel=${channel}`,
    linkType: "cast",
  });
}

// ─── Slug helper ──────────────────────────────────────────────────────────────
/**
 * Converts a business name to a URL-safe utm_content value.
 * "Backwater Jacks" → "backwater-jacks"
 */
export function toUTMContent(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
