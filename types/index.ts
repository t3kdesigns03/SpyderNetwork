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
