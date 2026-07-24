"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  /** Allow the Twitch iframe fallback its own fullscreen. Default true; desktop
   *  passes false so the iframe can't fullscreen (and freeze) — the parent owns
   *  fullscreen instead. The native-video (HLS) path is unaffected. */
  allowFullscreen?: boolean;
  /** Reports whether the active player is the Twitch iframe fallback, so the
   *  parent can show its own fullscreen control only where it's needed. */
  onIframeFallback?: (isIframe: boolean) => void;
}

type Mode = "resolving" | "hls" | "iframe";

// If the token/HLS resolve hasn't returned by this point, give up and show the
// iframe so the viewer is never stuck staring at a spinner.
const RESOLVE_TIMEOUT_MS = 5000;

// Clean starting playerType for every cam's first HLS attempt. See the
// escalation-ladder note below for why "frontpage" (not "embed") is the default.
const DEFAULT_PLAYER_TYPE = "frontpage";

export function CamPlayer({ cam, onLoad, autoplay = true, allowFullscreen = true, onIframeFallback }: CamPlayerProps) {
  const isTwitch = cam.streamProvider === "twitch" && !!cam.twitchChannel;

  const [mode, setMode]       = useState<Mode>(isTwitch ? "resolving" : "iframe");
  const [hlsUrl, setHlsUrl]   = useState<string | null>(null);
  const [hlsReady, setHlsReady] = useState(false);

  // Let the parent know when we're on the Twitch iframe fallback (vs the native
  // <video>), so it can surface its own fullscreen control only for that path.
  useEffect(() => { onIframeFallback?.(mode === "iframe"); }, [mode, onIframeFallback]);

  // If the stream hasn't actually started playing this long after we switch to
  // HLS, assume it's not going to (bad URL, CORS, hls.js stuck retrying) and
  // fall back to the iframe. hls.js swallows some network errors by retrying
  // silently, so we can't rely on onError alone.
  const PLAYBACK_WATCHDOG_MS = 8000;

  // ── PlayerType escalation ladder ────────────────────────────────────────────
  // Twitch conditions ad-signed segments (whose 403 kills the native player and
  // forces the iframe — the surface that can't reliably muted-autoplay) partly
  // on the access-token `playerType`. So instead of retrying the SAME failing
  // request, we walk a ladder of progressively cleaner playerTypes, keeping the
  // cam on the reliable <video> path.
  //
  // The FIRST attempt is now the clean "frontpage" context (the one that fixed
  // Angels), applied to EVERY cam — because once the network went live on the
  // public production domain, Twitch began ad-403'ing the old default "embed"
  // across most channels, flashing them onto the iframe. Starting on the clean
  // context keeps them on native HLS from the first frame. A per-cam
  // `hlsPlayerType` hint still overrides the start. After that we escalate to
  // "site", then finally retry the original "embed" as a last HLS attempt, so a
  // cam is never left worse off than before — the iframe stays the last resort.
  const attempts = useMemo<(string | null)[]>(() => {
    const seq: (string | null)[] = [cam.hlsPlayerType ?? DEFAULT_PLAYER_TYPE];
    for (const t of ["frontpage", "site", "embed"]) {
      if (!seq.includes(t)) seq.push(t);
    }
    return seq;
  }, [cam.hlsPlayerType]);

  // Index into `attempts` for the request currently in flight / playing.
  const attemptRef = useRef(0);
  // The in-flight resolve, so cam changes / unmounts can abort cleanly.
  const activeCtrl = useRef<AbortController | null>(null);
  const activeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearActive = useCallback(() => {
    activeCtrl.current?.abort();
    activeCtrl.current = null;
    if (activeTimer.current) {
      clearTimeout(activeTimer.current);
      activeTimer.current = null;
    }
  }, []);

  // Resolve `attempts[index]`. On any failure, escalate to the next playerType;
  // once the ladder is exhausted, fall back to the Twitch iframe.
  const startAttempt = useCallback(
    (index: number) => {
      if (!isTwitch || index >= attempts.length) {
        setMode("iframe");
        return;
      }
      attemptRef.current = index;
      clearActive();
      setMode("resolving");
      setHlsUrl(null);

      const ctrl = new AbortController();
      activeCtrl.current = ctrl;
      activeTimer.current = setTimeout(() => ctrl.abort(), RESOLVE_TIMEOUT_MS);
      const pt = attempts[index] ?? null;

      (async () => {
        try {
          const qs = new URLSearchParams({ channel: cam.twitchChannel! });
          if (pt) qs.set("pt", pt);
          const res = await fetch(`/api/twitch-hls?${qs.toString()}`, {
            signal: ctrl.signal,
            cache: "no-store",
          });
          if (!res.ok) throw new Error(`resolve ${res.status}`);
          const data = (await res.json()) as { url?: string };
          if (!data.url) throw new Error("no url");
          setHlsReady(false);
          setHlsUrl(data.url);
          setMode("hls");
        } catch {
          if (ctrl.signal.aborted) return; // superseded by a newer attempt
          startAttempt(index + 1); // escalate playerType, or → iframe when exhausted
        } finally {
          if (activeTimer.current) {
            clearTimeout(activeTimer.current);
            activeTimer.current = null;
          }
        }
      })();
    },
    [attempts, cam.twitchChannel, isTwitch, clearActive]
  );

  // Resolve on cam change (Twitch only). Starts at the top of the ladder.
  useEffect(() => {
    if (!isTwitch) {
      setMode("iframe");
      return;
    }
    startAttempt(0);
    return () => clearActive();
  }, [cam.id, isTwitch, startAttempt, clearActive]);

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

  // HlsPlayer hit a fatal error (ad-signed segment 403, expired token, CDN/CORS,
  // decode…). Escalate to the next playerType on the ladder; when it's exhausted
  // startAttempt falls back to the iframe on its own.
  const handleHlsError = useCallback(() => {
    startAttempt(attemptRef.current + 1);
  }, [startAttempt]);

  // ── Fallback: original Twitch iframe ────────────────────────────────────────
  if (mode === "iframe") {
    return <CamEmbed cam={cam} onLoad={onLoad} autoplay={autoplay} allowFullscreen={allowFullscreen} />;
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
