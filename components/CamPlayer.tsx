"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Cam } from "@/types";
import { CamEmbed } from "./CamEmbed";
import { HlsPlayer } from "./HlsPlayer";
import { SpyderLoader } from "./SpyderLoader";

/**
 * CamPlayer — smart player wrapper.
 * ─────────────────────────────────────────────────────────────────────────────
 * Goal: make the cams muted-autoplay reliably (like /hls-demo), which the raw
 * Twitch iframe can't guarantee. For a Twitch cam we:
 *   1. Ask our server route (/api/twitch-hls) for a native HLS (.m3u8) URL.
 *   2. Play it in a native <video> via HlsPlayer → browsers always allow muted
 *      autoplay, so it just starts. No play button, works on mobile + desktop.
 *
 * Safety net: if the HLS resolve fails, times out, or playback errors (expired
 * token, CORS, Twitch API change, channel offline…), we fall straight back to
 * the original Twitch <CamEmbed> iframe. So this can NEVER leave the live site
 * worse off than the iframe-only version — it only ever upgrades the experience.
 */

interface CamPlayerProps {
  cam:       Cam;
  onLoad?:   () => void;
  autoplay?: boolean;
}

type Mode = "resolving" | "hls" | "iframe";

// If the token/HLS resolve hasn't returned by this point, give up and show the
// iframe so the viewer is never stuck staring at a spinner.
const RESOLVE_TIMEOUT_MS = 5000;

export function CamPlayer({ cam, onLoad, autoplay = true }: CamPlayerProps) {
  const isTwitch = cam.streamProvider === "twitch" && !!cam.twitchChannel;

  const [mode, setMode]       = useState<Mode>(isTwitch ? "resolving" : "iframe");
  const [hlsUrl, setHlsUrl]   = useState<string | null>(null);
  const [hlsReady, setHlsReady] = useState(false);
  // Auto-retry the token a couple of times before falling back to the iframe.
  // A fresh token can dodge a transient/ad-conditioned segment 403 (the reason
  // one otherwise-identical channel can get stuck on the play-button iframe),
  // keeping the cam on the muted-autoplay HLS player.
  const retriesRef = useRef(0);
  const MAX_TOKEN_RETRIES = 2;

  // If the stream hasn't actually started playing this long after we switch to
  // HLS, assume it's not going to (bad URL, CORS, hls.js stuck retrying) and
  // fall back to the iframe. hls.js swallows some network errors by retrying
  // silently, so we can't rely on onError alone.
  const PLAYBACK_WATCHDOG_MS = 8000;

  const resolve = useCallback(
    async (signal: AbortSignal) => {
      if (!isTwitch) return;
      try {
        const res = await fetch(
          `/api/twitch-hls?channel=${encodeURIComponent(cam.twitchChannel!)}`,
          { signal, cache: "no-store" }
        );
        if (!res.ok) throw new Error(`resolve ${res.status}`);
        const data = (await res.json()) as { url?: string };
        if (!data.url) throw new Error("no url");
        setHlsReady(false);
        setHlsUrl(data.url);
        setMode("hls");
      } catch {
        // Any failure → iframe fallback (still autoplays muted where Twitch allows).
        setMode("iframe");
      }
    },
    [cam.twitchChannel, isTwitch]
  );

  // Resolve on cam change (Twitch only), bounded by a hard timeout.
  useEffect(() => {
    retriesRef.current = 0;
    if (!isTwitch) {
      setMode("iframe");
      return;
    }
    setMode("resolving");
    setHlsUrl(null);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), RESOLVE_TIMEOUT_MS);
    void resolve(ctrl.signal).finally(() => clearTimeout(timer));
    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [cam.id, isTwitch, resolve]);

  // Watchdog: once in HLS mode, if playback hasn't started in time, fall back.
  useEffect(() => {
    if (mode !== "hls" || hlsReady) return;
    const timer = setTimeout(() => setMode("iframe"), PLAYBACK_WATCHDOG_MS);
    return () => clearTimeout(timer);
  }, [mode, hlsReady]);

  const handleHlsReady = useCallback(() => {
    setHlsReady(true);
    onLoad?.();
  }, [onLoad]);

  // HlsPlayer hit a fatal error (expired token, CDN/CORS, decode…). Try ONE
  // fresh token; if that also fails, fall back to the iframe.
  const handleHlsError = useCallback(() => {
    if (retriesRef.current >= MAX_TOKEN_RETRIES) {
      setMode("iframe");
      return;
    }
    retriesRef.current += 1;
    setMode("resolving");
    setHlsUrl(null);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), RESOLVE_TIMEOUT_MS);
    void resolve(ctrl.signal).finally(() => clearTimeout(timer));
  }, [resolve]);

  // ── Fallback: original Twitch iframe ────────────────────────────────────────
  if (mode === "iframe") {
    return <CamEmbed cam={cam} onLoad={onLoad} autoplay={autoplay} />;
  }

  // ── Native HLS playback (the reliable-autoplay path) ────────────────────────
  if (mode === "hls" && hlsUrl) {
    return (
      <HlsPlayer
        key={hlsUrl}
        src={hlsUrl}
        autoPlay={autoplay}
        muted
        label={cam.name ? `${cam.business} – ${cam.name}` : cam.business}
        onReady={handleHlsReady}
        onError={handleHlsError}
      />
    );
  }

  // ── Resolving — branded loader (bounded by RESOLVE_TIMEOUT_MS → iframe) ──────
  return (
    <div className="relative h-full w-full min-h-[200px] bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <SpyderLoader size={84} label="Loading live feed…" />
      </div>
    </div>
  );
}

export default CamPlayer;
