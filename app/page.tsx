import { CamStation }    from "@/components/CamStation";
import { BroadcasterCTA } from "@/components/BroadcasterCTA";
import { Footer }         from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      {/* ── Primary experience: full-viewport live cam station ── */}
      {/* Partners now lives exclusively in the CAMS/MAP/CONDITIONS/PARTNERS
          tab bar inside CamStation, so it's no longer duplicated here. */}
      <CamStation />

      {/* ── Below-the-fold: monetization ─────────────────────────
          Users who scroll past the cam station are high-intent
          (dwell time is high). Keep the tone brand-aligned, not ad-like.
      ─────────────────────────────────────────────────────────── */}
      <BroadcasterCTA />
      <Footer />
    </>
  );
}
