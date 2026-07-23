"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, VolumeX } from "lucide-react";
import type { Cam } from "@/types";

// ─── All domains where this embed may be hosted ───────────────────────────────
// Twitch requires parent= to exactly match the page hostname.
// Listing all environments here means no async hostname detection is needed —
// the iframe can render immediately with autoplay=true on the first paint.
const TWITCH_PARENTS = [
  "spydernetwork.com",
  "www.spydernetwork.com",
  "beta.spydernetwork.com",
  "spydernetwork.t3kdesigns.app",
];

// Where the persistent top-right branding links to.
const SITE_URL = "https://spydernetwork.t3kdesigns.app";

function buildTwitchUrl(channel: string, autoplay: boolean, muted: boolean): string {
  const params = new URLSearchParams({
    channel,
    autoplay: autoplay ? "true" : "false",
    // muted=true is what lets the stream autostart with no user gesture. Once
    // the viewer taps "Tap for sound" we rebuild this URL with muted=false —
    // allowed because that tap counts as the required user gesture.
    muted:    muted ? "true" : "false",
  });
  // Twitch accepts multiple parent= values in a single URL
  TWITCH_PARENTS.forEach((p) => params.append("parent", p));
  return `https://player.twitch.tv/?${params.toString()}`;
}

interface CamEmbedProps {
  cam:      Cam;
  onLoad?:  () => void;
  autoplay?: boolean;
  /** Permit the iframe to enter fullscreen itself. Default true (mobile relies
   *  on it, esp. iOS). Desktop passes false so Twitch's double-click / fullscreen
   *  button can't fullscreen — and freeze — the iframe; the parent owns
   *  fullscreen by fullscreening the wrapper instead. */
  allowFullscreen?: boolean;
}

/**
 * CamEmbed — live stream player.
 *
 * Autoplay:
 *   The iframe is rendered immediately with autoplay=true + muted=true, which
 *   is the strongest signal we can give Twitch's embedded player to start on
 *   its own. NOTE: this component is the FALLBACK behind CamPlayer/HlsPlayer —
 *   the reliable no-play-button autoplay comes from the native HLS path; here
 *   we just give Twitch's iframe its best shot.
 *
 * Audio:
 *   Browsers forbid gesture-free autoplay WITH sound, so the stream starts
 *   muted. A small "Tap for sound" button reloads the iframe unmuted on the
 *   user's tap (a valid gesture); after that the viewer uses Twitch's own
 *   native controls to re-mute / adjust volume.
 */
export function CamEmbed({ cam, onLoad, autoplay = true, allowFullscreen = true }: CamEmbedProps) {
  const [error, setError] = useState(false);
  // Starts muted so the stream can autoplay with no gesture. The viewer flips
  // this to false via "Tap for sound", which reloads the Twitch iframe with
  // audio on. Resets per-cam because CamStation remounts CamEmbed on select.
  const [muted, setMuted] = useState(true);

  // ── Autoplay-safe overlay gating ────────────────────────────────────────────
  // Twitch gates gesture-free autoplay behind an IntersectionObserver-v2
  // "isVisible" check that runs the moment its player boots. That check reports
  // the iframe as NOT visible if anything overlaps it — even a decorative corner
  // element — and Twitch then disables autoplay with:
  //   "…minimum requirements for autoplay were not met: style visibility".
  // Our corner scrim + branding + "Tap for sound" chrome sit ON TOP of the
  // iframe (z-20/z-30), so at boot they partially obscure it and trip the check.
  //
  // The native-HLS path (HlsPlayer) plays a first-party <video> that Twitch
  // never inspects, so it's immune — which is why ONLY the Twitch-iframe
  // fallback fails, and in practice only Angels (spydernetwork72) reaches that
  // fallback (its monetised channel returns an ad-signed segment 403 that knocks
  // the HLS path out; every other cam stays on the immune HLS player).
  //
  // Fix: keep the iframe 100% unobscured until it has loaded and Twitch's
  // boot-time visibility check has passed, THEN reveal the chrome. Autoplay is
  // already granted by that point, so the later overlays can't revoke it.
  const [chromeReady, setChromeReady] = useState(false);
  const revealTimers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    // Reset when the cam changes, and guarantee the branding eventually appears
    // even if `onLoad` never fires (network stall, blocked iframe, etc.).
    setChromeReady(false);
    const timers = revealTimers.current;
    const safety = setTimeout(() => setChromeReady(true), 4000);
    timers.push(safety);
    return () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
    };
  }, [cam.id]);

  const isTwitch = cam.streamProvider === "twitch" && !!cam.twitchChannel;

  // autoplay + muted are the strongest autoplay signal we can send Twitch.
  // embedUrl is rebuilt when `muted` toggles (Tap for sound).
  const embedUrl = isTwitch
    ? buildTwitchUrl(cam.twitchChannel!, autoplay, muted)
    : (cam.iframeUrl ?? "");

  if (!embedUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-spyder-navy-card text-spyder-gray">
        <AlertCircle className="w-8 h-8" />
        <span className="ml-2 text-sm">Stream unavailable</span>
      </div>
    );
  }

  const camLabel = cam.name ? `${cam.business} – ${cam.name}` : cam.business;

  return (
    <div className="relative w-full h-full min-h-[200px] bg-black">

      {/*
        ── iframe — the ONLY playback surface ────────────────────────────────
        Rendered immediately with autoplay=true + muted=true so Twitch starts
        the stream on its own wherever its policy allows. Multiple parent=
        params avoid any async hostname lookup, so the frame renders on the
        first paint. Native Twitch controls (unmute, fullscreen, quality) are
        fully interactive because nothing overlays the player.
      */}
      <iframe
        key={`${cam.id}-${muted ? "muted" : "unmuted"}`}
        src={embedUrl}
        className="twitch-embed-frame"
        allowFullScreen={allowFullscreen}
        allow={allowFullscreen
          ? "autoplay; fullscreen; picture-in-picture; encrypted-media"
          : "autoplay; picture-in-picture; encrypted-media"}
        referrerPolicy="no-referrer-when-downgrade"
        // Autoplaying players MUST load eagerly: a lazy iframe can still be in a
        // deferred / not-yet-painted state when Twitch runs its autoplay
        // eligibility check, which then fails "style visibility" and disables
        // autoplay (the Angels symptom). Only embeds explicitly created with
        // autoplay={false} — e.g. off-screen / below-fold cards — stay lazy to
        // protect Core Web Vitals; they aren't trying to autostart anyway.
        loading={autoplay ? "eager" : "lazy"}
        title={`${camLabel} live cam`}
        onLoad={() => {
          onLoad?.();
          // Twitch runs its autoplay eligibility check a beat AFTER the iframe
          // document loads (once its player JS boots). Hold the overlay chrome
          // back until that window has passed so the check sees a fully visible,
          // unobscured, full-size player and grants gesture-free autoplay.
          const t = setTimeout(() => setChromeReady(true), 1500);
          revealTimers.current.push(t);
        }}
        onError={() => setError(true)}
      />

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-spyder-navy-card z-20 px-4 text-center">
          <AlertCircle className="w-8 h-8 text-spyder-red" />
          <p className="text-white text-sm font-semibold mt-2">Stream unavailable</p>
          <p className="text-spyder-gray text-xs mt-1">Check your connection or try again later.</p>
        </div>
      )}

      {/*
        ── "Tap for sound" — lightweight unmute affordance ───────────────────
        Shown only while the stream is muted (its natural autostart state) and
        only for the Twitch player. Tapping reloads the iframe unmuted inside
        the tap gesture, which browsers permit. It then disappears; the viewer
        can re-mute via Twitch's own native controls. Bottom-LEFT so it clears
        the top-right branding and Twitch's bottom-right control bar. ≥44px tap
        target, safe-area aware for phones.
      */}
      {isTwitch && muted && !error && chromeReady && (
        <button
          type="button"
          onClick={() => setMuted(false)}
          aria-label={`Turn on sound for ${camLabel}`}
          className="chrome-fade-in group/sound absolute bottom-3 left-3 z-30 flex items-center gap-2 rounded-full border border-white/20 bg-black/65 px-3.5 py-2.5 text-xs font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.55)] backdrop-blur-md transition-transform duration-150 hover:scale-105 active:scale-95"
          style={{
            left:   "max(0.75rem, env(safe-area-inset-left))",
            bottom: "max(0.75rem, env(safe-area-inset-bottom))",
          }}
        >
          <span aria-hidden className="animate-play-ring absolute inset-0 rounded-full" />
          <VolumeX className="relative h-4 w-4 text-spyder-red" />
          <span className="relative tracking-wide">Tap for sound</span>
        </button>
      )}

      {/*
        ── Soft corner scrim ─────────────────────────────────────────────────
        A subtle dark gradient in the top-right corner so the branding stays
        legible over bright daytime scenes without needing a boxy pill. Barely
        visible on dark video; just enough contrast on bright video. Scales down
        on phones so it never darkens too much of a small frame. Decorative and
        pointer-events-none, so it never blocks taps or player controls.
      */}
      {chromeReady && (
        <div
          aria-hidden="true"
          className="chrome-fade-in pointer-events-none absolute right-0 top-0 z-20 h-16 w-36 bg-gradient-to-bl from-black/45 via-black/10 to-transparent sm:h-20 sm:w-48"
        />
      )}

      {/*
        ── Persistent top-right branding ─────────────────────────────────────
        "Powered by" micro-label stacked above the SpyderNetwork logo. Anchored
        TOP-RIGHT on purpose: SpyderNetwork's feeds burn a timestamp / location
        caption into the BOTTOM of the frame, and cameras that stamp their own
        label favor the top-LEFT — so the top-right stays clear of both. This is
        the ONLY place the wordmark appears. Clickable → opens the site. z-30
        stays above the corner scrim.
        · Desktop: subtle (70%), lifts to full opacity + red glow on hover.
        · Mobile:  higher opacity (90%) for readability; the transparent p-2
                   padding gives a ≥44px tap target while the logo stays small.
        · Text drop-shadows + the corner scrim keep it legible over bright scenes.
        · Safe areas respected via max(…, env(safe-area-inset-*)).
      */}
      {chromeReady && (
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Powered by SpyderNetwork — opens spydernetwork.t3kdesigns.app in a new tab"
        className="chrome-fade-in group absolute right-0 top-0 z-30 flex items-center p-2"
        style={{
          top:   "max(0.25rem, env(safe-area-inset-top))",
          right: "max(0.25rem, env(safe-area-inset-right))",
        }}
      >
        <span className="flex flex-col items-end gap-0.5 opacity-90 transition-all duration-300 md:opacity-70 md:group-hover:opacity-100">
          <span className="text-[8px] font-semibold uppercase leading-none tracking-[0.16em] text-white/75 [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]">
            Powered by
          </span>
          <img
            src="/images/spyder-network-logo.svg"
            alt="SpyderNetwork"
            draggable={false}
            className="h-5 w-auto select-none drop-shadow-[0_1px_5px_rgba(0,0,0,0.95)] transition-all duration-300 sm:h-6 md:group-hover:drop-shadow-[0_0_10px_rgba(204,0,0,0.55)]"
          />
        </span>
      </a>
      )}
    </div>
  );
}
