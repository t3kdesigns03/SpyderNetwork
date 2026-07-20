import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

/**
 * robots.txt — allow crawling everywhere except internal API + the throwaway
 * HLS demo harness. Points crawlers (and AI crawlers) at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/hls-demo"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
