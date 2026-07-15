"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Play } from "lucide-react";
import { clsx } from "clsx";
import type { Cam } from "@/types";

// ─── All domains where this embed may be hosted ───────────────────────────────
// Twitch requires parent= to exactly match the page hostname.
// Listing all environments here means no async hostname detection is needed —
// the iframe can render immediately with autoplay=true on the first paint.
const TWITCH_PARENTS = [
  "spydernetwork.com",
  "www.spydernetwork.com",
  "spydernetwork.t3kdesigns.app",
];

// Where the persistent top-right branding links to.
const SITE_URL = "https://spydernetwork.t3kdesigns.app";

function buildTwitchUrl(channel: string, autoplay: boolean): string {
  const params = new URLSearchParams({
    channel,
    autoplay: autoplay ? "true" : "false",
    muted:    "true",   // required by all browser autoplay policies
  });
  // Twitch accepts multiple parent= values in a single URL
  TWITCH_PARENTS.forEach((p) => params.append("parent", p));
  return `https://player.twitch.tv/?${params.toString()}`;
}

/* ── Brand spider-eye — crisp inline SVG so it stays sharp at any size and can
   be tinted / glowed with CSS. Used by the tap-to-play overlay. ── */
function SpyderEye({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="eyeLens" cx="42%" cy="38%" r="65%">
          <stop offset="0%"  stopColor="#ff5a5a" />
          <stop offset="45%" stopColor="#cc0000" />
          <stop offset="100%" stopColor="#3d0000" />
        </radialGradient>
        <linearGradient id="eyeRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#d7dde6" />
          <stop offset="50%" stopColor="#7c8794" />
          <stop offset="100%" stopColor="#2b323c" />
        </linearGradient>
      </defs>
      {/* metallic ring */}
      <circle cx="20" cy="20" r="18" fill="url(#eyeRing)" />
      <circle cx="20" cy="20" r="14.5" fill="#0a0e1a" />
      {/* red lens */}
      <circle cx="20" cy="20" r="12" fill="url(#eyeLens)" />
      {/* inner pupil + catch-light */}
      <circle cx="20" cy="20" r="4.6" fill="#1a0303" />
      <circle cx="16.6" cy="16.2" r="2.4" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

interface CamEmbedProps {
  cam:      Cam;
  onLoad?:  () => void;
  autoplay?: boolean;
}

export function CamEmbed({ cam, onLoad, autoplay = true }: CamEmbedProps) {
  // `mounted` gates all overlay UI so the server render and the first client
  // render are identical (just the iframe) — no hydration mismatch, no flash.
  const [mounted,        setMounted]        = useState(false);
  // Touch devices get the tap-to-reveal flow; pointer devices get the classic
  // show-then-fade overlay. Detected via `pointer: coarse` (same signal the
  // existing useIsLandscapeMobile hook trusts).
  const [isTouch,        setIsTouch]        = useState(false);
  const [error,          setError]          = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayFading,  setOverlayFading]  = useState(false);
  // Once dismissed, both the overlay and the invisible tap-catcher are removed
  // so the native Twitch controls become interactive underneath.
  const [dismissed,      setDismissed]      = useState(false);
  const [iframeKey,      setIframeKey]      = useState(0);

  // Build embed URL once — no async hostname lookup needed
  const embedUrl =
    cam.streamProvider === "twitch" && cam.twitchChannel
      ? buildTwitchUrl(cam.twitchChannel, autoplay)
      : (cam.iframeUrl ?? "");

  // Detect the pointer type a single time, client-side only.
  useEffect(() => {
    setIsTouch(window.matchMedia?.("(pointer: coarse)").matches ?? false);
    setMounted(true);
  }, []);

  // ── Per-cam overlay lifecycle ───────────────────────────────────────────────
  //  Desktop  → branded overlay shows on load, then auto-fades once Twitch's own
  //             info card has cleared (~2.8 s).
  //  Mobile   → the video stays clean; we wait for the user's first tap to reveal
  //             the play overlay (proper iOS gesture handling on the actual tap).
  useEffect(() => {
    if (!mounted) return;
    setError(false);
    setDismissed(false);
    setOverlayFading(false);

    if (isTouch) {
      setOverlayVisible(false); // clean video; the tap-catcher waits for a tap
      return;
    }

    setOverlayVisible(true);
    const t1 = setTimeout(() => setOverlayFading(true), 2800);
    const t2 = setTimeout(() => { setOverlayVisible(false); setDismissed(true); }, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [cam.id, mounted, isTouch]);

  // Mobile: first tap on the clean video reveals the branded play overlay.
  const revealOverlay = () => { setOverlayFading(false); setOverlayVisible(true); };

  // Start playback. Reloading the iframe *inside* the tap handler keeps us in the
  // browser's "user gesture" context, which is what iOS Safari needs to allow
  // muted→audible playback. Then we retire the overlay so the player is usable.
  const startPlayback = () => {
    setOverlayFading(true);
    setIframeKey((k) => k + 1);
    window.setTimeout(() => { setOverlayVisible(false); setDismissed(true); }, 320);
  };

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
        ── iframe — FIRST child, no ready-state gate ─────────────────────────
        Rendering the iframe first means the browser registers it as the primary
        content on page load. autoplay=true + muted=true satisfies Chrome/Firefox
        autoplay policy immediately. Multiple parent= params remove the need for
        any async hostname lookup.
      */}
      <iframe
        key={`${cam.id}-${iframeKey}`}
        src={embedUrl}
        className="twitch-embed-frame"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${camLabel} live cam`}
        onLoad={() => onLoad?.()}
        onError={() => { setError(true); setOverlayVisible(false); setDismissed(true); }}
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
        ── Mobile first-tap catcher ──────────────────────────────────────────
        Invisible full-bleed hit area that sits above the clean video and turns
        the user's first tap into "reveal the play overlay". Removed once the
        stream is dismissed so native player gestures pass straight through.
        z-20 keeps it below the corner branding (z-30), so the logo stays tappable.
      */}
      {mounted && isTouch && !dismissed && !overlayVisible && !error && (
        <button
          type="button"
          onClick={revealOverlay}
          aria-label="Show play controls"
          className="absolute inset-0 z-20 h-full w-full cursor-pointer bg-transparent"
        />
      )}

      {/*
        ── Tap-to-play / branded overlay ─────────────────────────────────────
        Glassmorphic dark gradient over the video with the hero play button.
        Tapping anywhere (the div) plays; the inner <button> is the accessible,
        keyboard-focusable control. It is a sibling of the branding link below,
        so there is no event-bubbling conflict between the two overlay systems.
      */}
      {overlayVisible && !error && (
        <div
          onClick={startPlayback}
          className={clsx(
            "absolute inset-0 z-20 flex cursor-pointer select-none flex-col items-center justify-center gap-3 px-6 text-center sm:gap-4",
            "bg-gradient-to-b from-black/75 via-spyder-navy/80 to-black/85 backdrop-blur-[3px]",
            "transition-opacity duration-500",
            overlayFading ? "opacity-0 pointer-events-none" : "opacity-100 animate-overlay-rise"
          )}
        >
          {/* Elegant spider-web backdrop */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden="true">
            <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
              <g stroke="#cc0000" strokeWidth="0.5" fill="none">
                {[20, 40, 60, 80, 100].map((r) => <circle key={r} cx="100" cy="100" r={r} />)}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <line key={deg} x1="100" y1="100"
                      x2={100 + 110 * Math.cos(rad)} y2={100 + 110 * Math.sin(rad)} />
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Enhanced spider eye with the signature neon glow pulse */}
          <SpyderEye className="spyder-glow-pulse relative h-11 w-11 sm:h-14 sm:w-14" />

          {/* Hero play button — large, premium, mobile-first tap target (64–80px) */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); startPlayback(); }}
            aria-label={`Play ${camLabel} live stream`}
            className={clsx(
              "group/play relative flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20",
              "border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
              "transition-transform duration-200 hover:scale-105 active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-spyder-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            )}
          >
            {/* pulsing red halo invites the tap */}
            <span aria-hidden className="animate-play-ring absolute inset-0 rounded-full" />
            {/* red glass core */}
            <span
              aria-hidden
              className="absolute inset-1 rounded-full bg-gradient-to-br from-spyder-red to-spyder-red-bright opacity-95 shadow-[0_0_20px_rgba(204,0,0,0.6)]"
            />
            <Play className="relative h-7 w-7 translate-x-0.5 fill-white text-white sm:h-8 sm:w-8" />
          </button>

          {/* Cam identity */}
          <div className="relative">
            <p className="text-sm font-bold leading-tight tracking-wide text-white">{cam.business}</p>
            {cam.name && <p className="mt-0.5 text-xs text-spyder-gray">{cam.name}</p>}
          </div>

          {/* Contextual status line: an explicit CTA on touch, a "connecting"
              hint on desktop where playback has already auto-started. */}
          <div className="relative flex items-center gap-2 text-xs font-medium text-spyder-gray">
            {isTouch ? (
              <span className="tracking-wide text-white/90">Tap to Play</span>
            ) : (
              <>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-spyder-red animate-ping" />
                Connecting to live feed…
              </>
            )}
          </div>
        </div>
      )}

      {/*
        ── Soft corner scrim ─────────────────────────────────────────────────
        A subtle dark gradient in the top-right corner so the branding stays
        legible over bright daytime scenes without needing a boxy pill. Barely
        visible on dark video; just enough contrast on bright video. Scales down
        on phones so it never darkens too much of a small frame. Decorative and
        pointer-events-none, so it never blocks taps or player controls.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-20 h-16 w-36 bg-gradient-to-bl from-black/45 via-black/10 to-transparent sm:h-20 sm:w-48"
      />

      {/*
        ── Persistent top-right branding ─────────────────────────────────────
        "Powered by" micro-label stacked above the SpyderNetwork logo. Anchored
        TOP-RIGHT on purpose: SpyderNetwork's feeds burn a timestamp / location
        caption into the BOTTOM of the frame, and cameras that stamp their own
        label favor the top-LEFT — so the top-right stays clear of both. This is
        the ONLY place the wordmark appears. Clickable → opens the site. z-30
        stays above the tap-catcher + overlays.
        · Desktop: subtle (70%), lifts to full opacity + red glow on hover.
        · Mobile:  higher opacity (90%) for readability; the transparent p-2
                   padding gives a ≥44px tap target while the logo stays small.
        · Text drop-shadows + the corner scrim keep it legible over bright scenes.
        · Safe areas respected via max(…, env(safe-area-inset-*)).
      */}
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Powered by SpyderNetwork — opens spydernetwork.t3kdesigns.app in a new tab"
        className="group absolute right-0 top-0 z-30 flex items-center p-2"
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
    </div>
  );
}
