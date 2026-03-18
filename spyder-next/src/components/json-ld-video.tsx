import type { Camera } from "@/data/cameras";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://spydernetwork.com";

export function JsonLdVideo({ camera }: { camera: Camera }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: camera.name,
    description: camera.description || `Watch ${camera.name} live at ${camera.location}.`,
    thumbnailUrl: `${BASE_URL}/placeholder.svg`,
    uploadDate: new Date().toISOString(),
    contentUrl: camera.videoUrl,
    embedUrl: `${BASE_URL}/cam/${camera.id}`,
    publisher: {
      "@type": "Organization",
      name: "Spyder Network",
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
