import { CamStation }    from "@/components/CamStation";
import { BroadcasterCTA } from "@/components/BroadcasterCTA";
import { SponsorList }    from "@/components/SponsorList";
import { Footer }         from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      {/* ── Primary experience: full-viewport live cam station ── */}
      <CamStation />

      {/* ── Below-the-fold: monetization & partner sections ──────
          Users who scroll past the cam station are high-intent
          (dwell time is high). Keep the tone brand-aligned, not ad-like.
      ─────────────────────────────────────────────────────────── */}
      <BroadcasterCTA />
      <SponsorList />
      <Footer />
    </>
  );
}
