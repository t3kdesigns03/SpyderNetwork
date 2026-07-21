import { useEffect, useState } from "react";
import { ALL_CAMS, HERO_CAM } from "@/lib/cams";

/**
 * useCurrentHero — silent hero resolver.
 * ─────────────────────────────────────────────────────────────────────────────
 * Polls GET /api/current-hero and returns the winning camId (the camera with the
 * most active viewers). There is NO UI — no counts, no ranking, no badges. The
 * caller just uses the returned id to decide which stream the featured slot plays.
 *
 *   • Validates the returned id against our cam list; ignores anything unknown.
 *   • Defaults to the hard-coded featured cam until/unless a winner is known.
 *   • Polls every ~17s while the tab is visible; refreshes on tab re-show.
 */

const POLL_MS = 17_000;

export function useCurrentHero(): string {
  const [heroId, setHeroId] = useState<string>(HERO_CAM.id);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/current-hero", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { camId?: string };
        const id = data?.camId;
        if (!alive || !id) return;
        // Only accept ids we actually have a cam for.
        if (id === HERO_CAM.id || ALL_CAMS.some((c) => c.id === id)) {
          setHeroId(id);
        }
      } catch {
        /* transient error — keep the last known hero */
      }
    };

    load();
    const timer = setInterval(load, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return heroId;
}
