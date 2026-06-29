"use client";

import Link from "next/link";
import { ExternalLink, Tv2, ArrowRight } from "lucide-react";

interface Partner {
  name: string;
  url: string;
  sponsorTier?: "featured" | "premium";
}

const PARTNERS: Partner[] = [
  { name: "Backwater Jacks",           url: "https://backwaterjacks.com/",           sponsorTier: "premium" },
  { name: "Dog Days",                  url: "https://dogdays.ws/",                   sponsorTier: "featured" },
  { name: "Lazy Gators",              url: "https://lazygators.com/",                sponsorTier: "featured" },
  { name: "Alhonna Resort & Marina",  url: "https://thealhonnaresort.com/" },
  { name: "Alley Cats",              url: "https://www.alleycatsonthestrip.com/" },
  { name: "Angels Mexican Restaurant",url: "https://www.facebook.com/profile.php?id=61577060969567" },
  { name: "Annamarie Hopkins Real Estate", url: "https://asmartermove.com/" },
  { name: "Bridgeview Marina",        url: "https://www.facebook.com/pages/Bridgeview%20Marina/157000694367289/" },
  { name: "Camdenton Glass",         url: "https://camdentonglass.com/" },
  { name: "Dock Glide",              url: "https://dockglide.com" },
  { name: "Dogwood Animal Shelter",   url: "https://www.daslakeoftheozarks.com/" },
  { name: "Encore Lakeside Grill",    url: "https://theencoregrill.com/" },
  { name: "Fish and Company",         url: "https://thefishandcompany.com/" },
  { name: "JB Hooks",                url: "https://www.jbhooks.com/" },
  { name: "KRMS Radio",              url: "https://www.krmsradio.com/" },
  { name: "Lake Billiards Sports Bar",url: "https://lakebilliards.com/" },
  { name: "Marty Byrde's",           url: "https://martybyrde.com/" },
  { name: "Michael's Steak Chalet",   url: "https://steakchalet.com/" },
  { name: "Neon Taco",               url: "https://www.theneontaco.com/" },
  { name: "Paradise",                url: "https://www.paradiseatthelake.com/" },
  { name: "Tucker's Shuckers",        url: "https://tuckersshuckers.com/" },
  { name: "Wicked Willie's",          url: "https://wickedwilliessportsgrill.com/" },
];

const PREMIUM  = PARTNERS.filter((p) => p.sponsorTier === "premium");
const FEATURED = PARTNERS.filter((p) => p.sponsorTier === "featured");
const NETWORK  = PARTNERS.filter((p) => !p.sponsorTier);

function PartnerCard({ partner, size = "sm" }: { partner: Partner; size?: "sm" | "lg" }) {
  const isPremium  = partner.sponsorTier === "premium";
  const isFeatured = partner.sponsorTier === "featured";

  const borderColor = isPremium
    ? "rgba(168,85,247,0.35)"
    : isFeatured
    ? "rgba(0,212,255,0.25)"
    : "rgba(255,255,255,0.08)";

  const badgeBg    = isPremium ? "rgba(168,85,247,0.12)" : "rgba(0,212,255,0.08)";
  const badgeBdr   = isPremium ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(0,212,255,0.25)";
  const badgeColor = isPremium ? "#a855f7" : "#00d4ff";
  const badgeLabel = isPremium ? "◆ Premium" : "★ Featured";

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 rounded-xl transition-all duration-200 touch-manipulation hover:brightness-110"
      style={{
        background: "rgba(13,21,38,0.7)",
        border: `1px solid ${borderColor}`,
        minHeight: size === "lg" ? "64px" : "52px",
        padding: size === "lg" ? "0 1.25rem" : "0 1rem",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className="text-sm font-medium leading-tight truncate transition-colors group-hover:text-white"
          style={{ color: (isPremium || isFeatured) ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.65)" }}
        >
          {partner.name}
        </span>
        {(isPremium || isFeatured) && (
          <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ background: badgeBg, border: badgeBdr, color: badgeColor }}>
            {badgeLabel}
          </span>
        )}
      </div>
      <ExternalLink className="w-3.5 h-3.5 shrink-0 transition-colors"
        style={{ color: (isPremium || isFeatured) ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.2)" }} />
    </a>
  );
}

export function SponsorList() {
  return (
    <section className="py-14 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{ color: "rgba(204,0,0,0.8)" }}>
              Supporting Local LOTO Businesses
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Our Partners</h2>
          </div>
          <Link
            href="/become-a-broadcaster"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors whitespace-nowrap min-h-[44px] text-spyder-cyan hover:text-white"
          >
            <Tv2 className="w-4 h-4" /> Become a Partner <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Premium tier */}
        {PREMIUM.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-spyder-purple mb-3">
              &#9670; Premium Broadcaster
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PREMIUM.map((p) => <PartnerCard key={p.name} partner={p} size="lg" />)}
            </div>
          </div>
        )}

        {/* Featured tier */}
        {FEATURED.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-spyder-cyan mb-3">
              &#9733; Featured Partners
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FEATURED.map((p) => <PartnerCard key={p.name} partner={p} size="lg" />)}
            </div>
          </div>
        )}

        {/* Network partners */}
        {NETWORK.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-spyder-gray/60 mb-3">
              SpyderNetwork Partners
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {NETWORK.map((p) => <PartnerCard key={p.name} partner={p} size="sm" />)}
            </div>
          </div>
        )}

        <p className="text-xs text-spyder-gray/40 mt-8 text-center leading-relaxed max-w-2xl mx-auto">
          Disclaimer: Any concerns regarding external links should be directed to the respective site administrator.
          All cams are in a public setting. Please use discretion when viewing.
        </p>
      </div>
    </section>
  );
}
