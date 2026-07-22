export type CamCategory =
  | "bar-grill"
  | "marina"
  | "pool"
  | "dock"
  | "stage"
  | "shop"
  | "real-estate"
  | "radio"
  | "shelter"
  | "lake-view";

export type StreamProvider = "twitch" | "youtube" | "iframe" | "direct";

/** Broadcaster tier — drives badge visibility and placement priority */
export type SponsorTier = "basic" | "featured" | "premium";

export interface Cam {
  id: string;
  name: string;
  business: string;
  slug: string;
  category: CamCategory;
  twitchChannel?: string;
  iframeUrl?: string;
  streamProvider: StreamProvider;
  /**
   * Optional Twitch access-token `playerType` used when resolving this cam's
   * native HLS stream (see /api/twitch-hls). Twitch conditions ad-signed
   * segments — which return a 403 that kills the native player and forces the
   * unreliable Twitch iframe — partly on the playerType. Most cams resolve fine
   * with the default ("embed"); a channel that gets ad-403'd (e.g. Angels /
   * spydernetwork72) can pin a cleaner type like "frontpage" here so it keeps
   * playing on the reliable muted-autoplay <video> path instead of falling back
   * to the iframe. Allow-listed server-side.
   */
  hlsPlayerType?: string;
  description?: string;
  mile?: string; // mile marker on lake
  lat?: number;
  lng?: number;
  isLive?: boolean;
  isFeatured?: boolean;
  /** Paid broadcaster tier — shows a badge and affects placement priority */
  sponsorTier?: SponsorTier;
  thumbnailUrl?: string;
  websiteUrl?: string;
  spyderPageUrl?: string; // original spydernetwork.com page
}

export interface LakeConditions {
  waterTempF: number | null;
  airTempF: number | null;
  windMph: number | null;
  windDirection: string | null;
  lakeLevelFt: number | null;
  dischargeCfs: number | null;
  updatedAt: string | null;
}

export interface CycleSettings {
  interval: number; // seconds
  selectedCams: string[]; // cam IDs
  isFavoritesMode: boolean;
}

export interface MapPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: CamCategory;
  camIds: string[];
}
