import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCamBySlug, CAMS } from "@/lib/cams";
import { CamCard } from "@/components/CamCard";
import { CamEmbed } from "@/components/CamEmbed";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Cast, MapPin, Star } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CAMS.map((cam) => ({ slug: cam.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cam = getCamBySlug(slug);
  if (!cam) return { title: "Cam Not Found" };
  return {
    title: `${cam.business} – ${cam.name} Live Cam`,
    description: `Watch ${cam.business} live on SpyderNetwork. Real-time webcam from Lake of the Ozarks.`,
  };
}

export default async function CamPage({ params }: Props) {
  const { slug } = await params;
  const cam = getCamBySlug(slug);
  if (!cam) notFound();

  // Related cams from same business
  const related = CAMS.filter((c) => c.business === cam.business && c.id !== cam.id).slice(0, 4);

  return (
    <div className="min-h-screen pt-14 sm:pt-16">
      {/* Back nav */}
      <div className="px-4 sm:px-6 max-w-7xl mx-auto pt-4">
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
                      {cam.business}
                    </h1>
                    <p className="text-spyder-gray text-sm mt-1">{cam.name}</p>
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
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm py-2.5 px-5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Twitch Chat
                    </a>
                  )}
                </div>
              </div>
            </div>
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
