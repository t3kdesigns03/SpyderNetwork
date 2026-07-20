import type { Metadata } from "next";
import { CamStation }      from "@/components/CamStation";
import { BroadcasterCTA }  from "@/components/BroadcasterCTA";
import { HomeSeoContent }  from "@/components/HomeSeoContent";
import { Footer }          from "@/components/Footer";

export const metadata: Metadata = {
  // Homepage is the canonical entry point for the whole cam network.
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* ── Primary experience: full-viewport live cam station (the hero) ── */}
      <CamStation />

      {/* ── Below-the-fold: monetization CTA ── */}
      <BroadcasterCTA />

      {/* ── Below-the-fold: crawlable SEO/AI content (H1, directory, FAQ).
          Server-rendered text + internal links only — no iframes, so it never
          touches the cam station's performance or its simple main purpose. ── */}
      <HomeSeoContent />

      <Footer />
    </>
  );
}
