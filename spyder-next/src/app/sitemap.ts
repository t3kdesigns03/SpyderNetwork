import type { MetadataRoute } from "next";
import { cameras } from "@/data/cameras";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://spydernetwork.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const camPages = cameras.map((cam) => ({
    url: `${BASE_URL}/cam/${cam.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/nightlife`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/favorites`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...camPages,
  ];
}
