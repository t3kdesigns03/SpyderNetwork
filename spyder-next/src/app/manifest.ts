import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lake TV",
    short_name: "Lake TV",
    description: "Spyder Network - Lake of the Ozarks Live Cams. Watch 57+ live cameras 24/7.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1428",
    theme_color: "#e11d48",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
        purpose: "any",
      },
      {
        src: "/spyder-logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/spyder-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
