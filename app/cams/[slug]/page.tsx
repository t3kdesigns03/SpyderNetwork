import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCamBySlug, CAMS } from "@/lib/cams";
import { CamCard } from "@/components/CamCard";
import { CamEmbed } from "@/components/CamEmbed";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE, absoluteUrl, camUrl, camCategoryLabel, camMetaDescription,
  camVideoSchema, camPlaceSchema, breadcrumbSchema,
} from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Cast, MapPin, Star, Radar, Map as MapIcon } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CAMS.map((cam) => ({ slug: cam.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cam = getCamBySlug(slug);
  if (!cam) return { title: "Cam Not Found", robots: { index: false, follow: false } };

  const title = `${cam.business} – ${cam.name} Live Cam | ${SITE.area.name}`;
  const description = camMetaDescription(cam);
  const path = `/cams/${cam.slug}`;
  const image = cam.thumbnailUrl ?? "/og-image.png";

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "video.other",
      url: absoluteUrl(path),
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${cam.business} live cam — ${cam.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CamPage({ params }: Props) {
  const { slug } = await params;
  const cam = getCamBySlug(slug);
  if (!cam) notFound();

  // Related cams from same business
  const related = CAMS.filter((c) => c.business === cam.business && c.id !== cam.id).slice(0, 4);

  // ── Structured data: live VideoObject + venue Place + breadcrumb trail ──
  const schema = [
    camVideoSchema(cam),
    camPlaceSchema(cam),
    breadcrumbSchema([
      { name: "Home", url: SITE.url },
      { name: "Live Cams", url: absoluteUrl("/#cams") },
      { name: `${cam.business} – ${cam.name}`, url: camUrl(cam) },
    ]),
  ].filter(Boolean) as object[];

  const kind = camCategoryLabel(cam);

  return (
    <div className="min-h-screen pt-14 sm:pt-16">
      <JsonLd data={schema} />

      {/* Breadcrumb + back nav */}
      <div className="px-4 sm:px-6 max-w-7xl mx-auto pt-4">
        <nav aria-label="Breadcrumb" className="text-xs text-spyder-gray mb-2">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li aria-hidden className="text-spyder-gray/50">/</li>
            <li><Link href="/#cams" className="hover:text-white transition-colors">Live Cams</Link></li>
            <li aria-hidden className="text-spyder-gray/50">/</li>
            <li className="text-white/80">{cam.business} — {cam.name}</li>
          </ol>
        </nav>
        <Link
          href="/#cams"
          className="inline-flex items-center gap-2 text-sm text-spyder-gray hover:text-white transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all cams
        </Link>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-6 max-w-7xl mx-auto py-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stream */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-spyder-navy-card">
              <div className="aspect-video-cam">
                <CamEmbed cam={cam} autoplay />
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {cam.isLive && (
                        <span className="live-badge">
                          <span className="live-dot" />
                          LIVE
                        </span>
                      )}
                      {cam.mile && (
                        <span className="flex items-center gap-1 text-xs text-spyder-teal">
                          <MapPin className="w-3 h-3" />
                          Mile {cam.mile}
                        </span>
                      )}
                    </div>
                    <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
                      {cam.business} <span className="text-spyder-red">Live Cam</span>
                    </h1>
                    <p className="text-spyder-gray text-sm mt-1">
                      {cam.name} · {SITE.area.name}, {SITE.area.regionName}
                    </p>
                    {cam.description && (
                      <p className="text-spyder-gray/80 text-sm mt-2">{cam.description}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {cam.websiteUrl && (
                    <a
                      href={cam.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm py-2.5 px-5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit {cam.business}
                    </a>
                  )}
                  <a
                    href={`https://player.twitch.tv/?channel=${cam.twitchChannel}&parent=spydernetwork.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm py-2.5 px-5"
                  >
                    <Cast className="w-4 h-4" />
                    Cast to TV
                  </a>
                  {cam.spyderPageUrl && (
                    <a
                      href={cam.spyderPageUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="btn-secondary text-sm py-2.5 px-5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      More details
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Answer-first summary — extractable by Google + AI, entity-rich */}
            <section className="mt-4 rounded-2xl border border-white/10 bg-spyder-navy-card p-5">
              <h2 className="font-display text-lg font-bold text-white mb-2">
                What this cam shows
              </h2>
              <p className="text-spyder-gray/90 text-sm leading-relaxed">
                The <strong className="text-white">{cam.business} live cam</strong> streams the {kind} at {cam.business} in
                real time from {SITE.area.name}, {SITE.area.regionName}
                {cam.mile ? ` near mile marker ${cam.mile}` : ""}.{" "}
                {cam.description ? `${cam.description} ` : ""}
                It&apos;s one of 60+ free, no-signup live webcams on SpyderNetwork covering
                bars &amp; grills, marinas, pools, docks, and lakefront venues around the lake.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Link href="/" className="btn-secondary text-xs py-2 px-4">
                  <MapIcon className="w-3.5 h-3.5" />
                  All live cams &amp; map
                </Link>
                <Link href="/radar" className="btn-secondary text-xs py-2 px-4">
                  <Radar className="w-3.5 h-3.5" />
                  Lake radar &amp; conditions
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Connection tip */}
            <div className="glass-panel p-4 text-sm text-spyder-gray">
              <p className="font-semibold text-white mb-1">📶 Watching on mobile?</p>
              <p>If the stream is slow, toggle <strong className="text-white">Airplane Mode</strong> off/on to reconnect to the nearest cell tower.</p>
            </div>

            {/* TV casting info */}
            <div className="glass-panel p-4">
              <p className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
                <Cast className="w-4 h-4 text-spyder-red" />
                Cast to TV
              </p>
              <p className="text-spyder-gray text-xs leading-relaxed">
                Open the Cast link above on your phone, then use your browser&apos;s Cast function
                (Chrome → 3 dots → Cast) to send to your TV.
              </p>
            </div>

            {/* Related cams from same business */}
            {related.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  More from {cam.business}
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {related.map((c) => (
                    <Link key={c.id} href={`/cams/${c.slug}`}>
                      <CamCard cam={c} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
