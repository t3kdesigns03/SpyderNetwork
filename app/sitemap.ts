import type { MetadataRoute } from "next";
import { CAMS } from "@/lib/cams";
import { SITE } from "@/lib/seo";

/**
 * Dynamic sitemap — homepage + all static routes + every individual cam page.
 * Live cams update constantly, so cam pages get changeFrequency "hourly".
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/", priority: 1, changeFrequency: "hourly" as const },
    { path: "/become-a-broadcaster", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/radar", priority: 0.7, changeFrequency: "daily" as const },
    { path: "/about-us", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/video-collection", priority: 0.5, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const camRoutes: MetadataRoute.Sitemap = CAMS.map((cam) => ({
    url: `${SITE.url}/cams/${cam.slug}`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...camRoutes];
}
