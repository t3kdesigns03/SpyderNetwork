import { CamStation }    from "@/components/CamStation";
import { BroadcasterCTA } from "@/components/BroadcasterCTA";
import { SponsorList }    from "@/components/SponsorList";
import { Footer }         from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      {/* ── Primary experience: full-viewport live cam station ── */}
      <CamStation />

      {/* ── Below-the-fold: partner & monetization sections ──────
          Users who scroll past the cam station are high-intent
          (dwell time is high). Partners is elevated directly beneath the
          cam station so it reads as a prominent, intentional band before
          the broadcaster CTA. Keep the tone brand-aligned, not ad-like.
      ─────────────────────────────────────────────────────────── */}
      <SponsorList />
      <BroadcasterCTA />
      <Footer />
    </>
  );
}
