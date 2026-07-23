"use client";

/**
 * HlsPlayer — a standalone, on-brand HLS video player for SpyderNetwork.
 * ─────────────────────────────────────────────────────────────────────────────
 * This is intentionally SEPARATE from the live `CamEmbed.tsx` (Twitch) so it can
 * be developed and tested in parallel without touching anything currently on the
 * site. When we're ready to migrate to our own HLS streams (Bunny.net, etc.),
 * swap `CamEmbed` for this component.
 *
 * It is fully self-contained:
 *   • No edits to any existing file. Its animations are inlined below, so it does
 *     not even depend on globals.css.
 *   • `hls.js` is loaded via a dynamic import, so this file COMPILES before the
 *     dependency is installed. Before using it at runtime, install the dep:
 *         npm i hls.js
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *   import { HlsPlayer } from "@/components/HlsPlayer";
 *
 *   // Public test stream for development:
 *   <div className="aspect-video w-full">
 *     <HlsPlayer src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
 *   </div>
 *
 *   // Later, with a real Bunny HLS URL — just swap `src`:
 *   <HlsPlayer src={bunnyHlsUrl} autoPlay muted />
 *
 * The parent controls the size (give it an aspect-ratio or fixed height box);
 * the player fills its container.
 *
 * ── Mobile vs desktop behavior ───────────────────────────────────────────────
 *   Mobile (pointer: coarse):
 *     - Video loads CLEAN — no overlay (just a subtle loader until the first
 *       frame is ready).
 *     - The first tap anywhere reveals a glassmorphic overlay with a large,
 *       centered Play button.
 *     - Tapping Play unmutes + plays *inside the tap gesture*, satisfying iOS
 *       Safari's autoplay policy, then retires the overlay so native controls
 *       become usable.
 *   Desktop (pointer: fine):
 *     - The branded overlay shows on load and auto-fades after ~2.6s (playback
 *       has already begun muted). Clicking it plays with sound immediately.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Play } from "lucide-react";
import { clsx } from "clsx";
import { SpyderLoader } from "./SpyderLoader";

// Where the persistent top-right branding links to.
const SITE_URL = "https://spydernetwork.t3kdesigns.app";

/* ── Minimal local types for hls.js ───────────────────────────────────────────
   hls.js ships its own types once installed, but we type only the surface we use
   so this file compiles even before `npm i hls.js`. */
interface HlsErrorData { fatal?: boolean; type?: string }
interface HlsInstance {
  loadSource(src: string): void;
  attachMedia(media: HTMLMediaElement): void;
  on(event: string, cb: (event: string, data: HlsErrorData) => void): void;
  startLoad(): void;
  recoverMediaError(): void;
  destroy(): void;
}
interface HlsStatic {
  new (config?: Record<string, unknown>): HlsInstance;
  isSupported(): boolean;
  Events: { MANIFEST_PARSED: string; ERROR: string };
  ErrorTypes: { NETWORK_ERROR: string; MEDIA_ERROR: string };
}

/* ── Brand spider-eye — crisp inline SVG, tint/glow-able with CSS. ── */
function SpyderEye({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="hlspEyeLens" cx="42%" cy="38%" r="65%">
          <stop offset="0%"  stopColor="#ff5a5a" />
          <stop offset="45%" stopColor="#cc0000" />
          <stop offset="100%" stopColor="#3d0000" />
        </radialGradient>
        <linearGradient id="hlspEyeRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#d7dde6" />
          <stop offset="50%" stopColor="#7c8794" />
          <stop offset="100%" stopColor="#2b323c" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18"   fill="url(#hlspEyeRing)" />
      <circle cx="20" cy="20" r="14.5" fill="#0a0e1a" />
      <circle cx="20" cy="20" r="12"   fill="url(#hlspEyeLens)" />
      <circle cx="20" cy="20" r="4.6"  fill="#1a0303" />
      <circle cx="16.6" cy="16.2" r="2.4" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

/* ── Self-contained animations (prefixed so they never collide with globals) ──
   All three are GPU-friendly (filter / transform / box-shadow only) → 60fps. */
const PLAYER_STYLES = `
@keyframes hlsp-eye-pulse {
  0%,100% { filter: drop-shadow(0 0 2px rgba(255,26,26,0.55)) drop-shadow(0 0 5px rgba(204,0,0,0.35)); }
  50%     { filter: drop-shadow(0 0 5px rgba(255,26,26,0.95)) drop-shadow(0 0 14px rgba(204,0,0,0.60)); }
}
.hlsp-glow { animation: hlsp-eye-pulse 2.4s ease-in-out infinite; will-change: filter; }
@keyframes hlsp-rise {
  from { opacity: 0; transform: translateY(10px) scale(0.985); }
  to   { opacity: 1; transform: translateY(0)    scale(1);     }
}
.hlsp-rise { animation: hlsp-rise 0.45s cubic-bezier(0.16,0.84,0.44,1) both; }
@keyframes hlsp-ring {
  0%   { box-shadow: 0 0 0 0    rgba(204,0,0,0.50); }
  70%  { box-shadow: 0 0 0 18px rgba(204,0,0,0);    }
  100% { box-shadow: 0 0 0 0    rgba(204,0,0,0);    }
}
.hlsp-ring { animation: hlsp-ring 2.2s ease-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .hlsp-glow, .hlsp-rise, .hlsp-ring { animation: none !important; }
}
`;

export interface HlsPlayerProps {
  /** HLS manifest URL (.m3u8). */
  src: string;
  /** Optional poster shown before the first frame. */
  poster?: string;
  /** Attempt muted autoplay on load. Default: true. */
  autoPlay?: boolean;
  /** Start muted (required for autoplay). User Play unmutes. Default: true. */
  muted?: boolean;
  /** Loop the stream (useful for VOD test clips). Default: false. */
  loop?: boolean;
  /** Expose native controls once playback has started. Default: true. */
  controls?: boolean;
  /** Accessible label for the video. Default: "Live video". */
  label?: string;
  /** Where the "Powered by" badge links. Default: spydernetwork.t3kdesigns.app. */
  brandHref?: string;
  /** Extra classes for the outer container. */
  className?: string;
  onReady?: () => void;
  onError?: (err: unknown) => void;
}

export function HlsPlayer({
  src,
  poster,
  autoPlay = true,
  muted = true,
  loop = false,
  controls = true,
  label = "Live video",
  brandHref = SITE_URL,
  className,
  onReady,
  onError,
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // `mounted` keeps SSR and first client render identical (just the <video>),
  // avoiding hydration mismatch / overlay flash.
  const [mounted,        setMounted]        = useState(false);
  const [isTouch,        setIsTouch]        = useState(false);
  const [ready,          setReady]          = useState(false);
  const [error,          setError]          = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayFading,  setOverlayFading]  = useState(false);
  // Once dismissed, the overlay + tap-catcher are removed and native controls
  // (if enabled) become interactive.
  const [dismissed,      setDismissed]      = useState(false);

  // Detect pointer type once, client-side only.
  useEffect(() => {
    setIsTouch(window.matchMedia?.("(pointer: coarse)").matches ?? false);
    setMounted(true);
  }, []);

  // ── Desktop: kill double-click-to-fullscreen ────────────────────────────────
  // Chromium toggles fullscreen when a <video> is double-clicked; double-clicking
  // again to exit can leave the HLS <video> frozen. We intercept `dblclick` in
  // the CAPTURE phase on the container (an ancestor of the video), so the event
  // never reaches the browser's built-in media-controls handler — no fullscreen
  // toggle happens. Single clicks are untouched, so the control-bar fullscreen
  // button keeps working. Gated to fine (mouse) pointers, so MOBILE fullscreen /
  // flip behavior is left completely unchanged.
  useEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    if (!el) return;
    const finePointer = window.matchMedia?.("(pointer: fine)").matches ?? false;
    if (!finePointer) return; // desktop only — never affect touch devices

    const blockFullscreenDblClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    el.addEventListener("dblclick", blockFullscreenDblClick, true);
    return () => el.removeEventListener("dblclick", blockFullscreenDblClick, true);
  }, [mounted]);

  // ── HLS attach / detach ─────────────────────────────────────────────────────
  // Prefers native HLS on Safari/iOS (lower power, better battery); falls back to
  // hls.js everywhere else. hls.js does adaptive bitrate out of the box.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setError(false);
    setReady(false);
    let hls: HlsInstance | null = null;
    let cancelled = false;

    // Safari / iOS play HLS natively via a plain source URL.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      const onLoaded = () => { if (!cancelled) { setReady(true); onReady?.(); } };
      video.addEventListener("loadedmetadata", onLoaded);
      return () => {
        cancelled = true;
        video.removeEventListener("loadedmetadata", onLoaded);
        video.removeAttribute("src");
        video.load();
      };
    }

    // Everywhere else: hls.js (loaded lazily so it never blocks SSR/first paint).
    (async () => {
      try {
        // @ts-ignore — hls.js is an optional runtime dependency (npm i hls.js).
        const mod = await import("hls.js");
        if (cancelled) return;
        const Hls = (mod.default ?? mod) as unknown as HlsStatic;

        if (!Hls.isSupported()) {
          setError(true);
          onError?.(new Error("HLS is not supported in this browser."));
          return;
        }

        hls = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 90 });
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!cancelled) { setReady(true); onReady?.(); }
        });
        // Bounded self-heal. A single segment 403 (e.g. an ad-conditioned
        // segment on a monetized channel) shouldn't nuke the stream — hls.js
        // can often recover by reloading. But if recovery keeps failing we must
        // surface onError so CamPlayer can try a fresh token (a new token may
        // dodge a transient 403) and, ultimately, fall back — instead of
        // looping startLoad() forever behind a frozen frame.
        let networkRetries = 0;
        let mediaRetries = 0;
        const MAX_NETWORK_RETRIES = 3;
        const MAX_MEDIA_RETRIES = 2;
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (!data?.fatal) return; // non-fatal: hls.js self-heals silently
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            if (networkRetries++ < MAX_NETWORK_RETRIES) { hls?.startLoad(); return; }
            setError(true); onError?.(data); hls?.destroy();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            if (mediaRetries++ < MAX_MEDIA_RETRIES) { hls?.recoverMediaError(); return; }
            setError(true); onError?.(data); hls?.destroy();
          } else {
            setError(true); onError?.(data); hls?.destroy();
          }
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } catch (e) {
        if (!cancelled) { setError(true); onError?.(e); }
      }
    })();

    return () => { cancelled = true; hls?.destroy(); };
    // onReady/onError are treated as stable; re-attaching only on src change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // ── Overlay lifecycle (mirrors the mobile/desktop split above) ──────────────
  useEffect(() => {
    if (!mounted) return;
    setDismissed(false);
    setOverlayFading(false);

    if (isTouch) {
      setOverlayVisible(false); // clean video; tap-catcher waits for the first tap
      return;
    }
    setOverlayVisible(true); // desktop: show, then auto-fade
    const t1 = setTimeout(() => setOverlayFading(true), 2600);
    const t2 = setTimeout(() => { setOverlayVisible(false); setDismissed(true); }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [src, mounted, isTouch]);

  // Mobile: first tap reveals the play overlay.
  const revealOverlay = useCallback(() => {
    setOverlayFading(false);
    setOverlayVisible(true);
  }, []);

  // User pressed Play: unmute + play *within the gesture* (iOS-safe), then dismiss.
  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    setOverlayFading(true);
    if (video) {
      video.muted = false;
      const p = video.play();
      // If playing with sound is blocked, fall back to muted playback.
      if (p && typeof p.catch === "function") {
        p.catch(() => { video.muted = true; video.play().catch(() => {}); });
      }
    }
    window.setTimeout(() => { setOverlayVisible(false); setDismissed(true); }, 320);
  }, []);

  const showCatcher   = mounted && isTouch && !dismissed && !overlayVisible && !error;
  const showLoader    = !ready && !error && !overlayVisible;
  const nativeControls = controls && dismissed;

  return (
    <div ref={containerRef} className={clsx("relative h-full w-full overflow-hidden bg-black", className)}>
      {/* Self-contained animation keyframes */}
      <style>{PLAYER_STYLES}</style>

      {/* ── Video element ──────────────────────────────────────────────────────
          playsInline is essential on iOS (keeps playback in-page, not fullscreen). */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full bg-black object-contain"
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        controls={nativeControls}
        aria-label={label}
      />

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-spyder-navy-card px-4 text-center">
          <AlertCircle className="h-8 w-8 text-spyder-red" />
          <p className="mt-2 text-sm font-semibold text-white">Stream unavailable</p>
          <p className="mt-1 text-xs text-spyder-gray">Check your connection or try again later.</p>
        </div>
      )}

      {/* Branded loader until the first frame is ready (mostly visible on the
          clean mobile state; desktop shows the overlay instead). */}
      {showLoader && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <SpyderLoader size={76} />
        </div>
      )}

      {/* ── Mobile first-tap catcher — invisible; reveals the overlay ────────── */}
      {showCatcher && (
        <button
          type="button"
          onClick={revealOverlay}
          aria-label="Show play controls"
          className="absolute inset-0 z-20 h-full w-full cursor-pointer bg-transparent"
        />
      )}

      {/* ── Tap-to-play / branded overlay ─────────────────────────────────────
          The outer div is the convenience tap area; the inner <button> is the
          accessible, focusable control. Sibling of the branding link → no
          event-bubbling conflicts between the two overlays. */}
      {overlayVisible && !error && (
        <div
          onClick={startPlayback}
          className={clsx(
            "absolute inset-0 z-20 flex cursor-pointer select-none flex-col items-center justify-center gap-3 px-6 text-center sm:gap-4",
            "bg-gradient-to-b from-black/75 via-spyder-navy/80 to-black/85 backdrop-blur-[3px]",
            "transition-opacity duration-500",
            overlayFading ? "pointer-events-none opacity-0" : "opacity-100 hlsp-rise"
          )}
        >
          {/* Branded spider/web loader — replaces the old pulsing red-dot eye.
              Its own web + crawling spider carry the motion, so no separate
              web backdrop is needed. */}
          <SpyderLoader size={66} className="relative" />

          {/* Hero play button — large, premium, mobile-first (64–80px) */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); startPlayback(); }}
            aria-label="Play video"
            className={clsx(
              "relative flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20",
              "border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
              "transition-transform duration-200 hover:scale-105 active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-spyder-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            )}
          >
            <span aria-hidden className="hlsp-ring absolute inset-0 rounded-full" />
            <span
              aria-hidden
              className="absolute inset-1 rounded-full bg-gradient-to-br from-spyder-red to-spyder-red-bright opacity-95 shadow-[0_0_20px_rgba(204,0,0,0.6)]"
            />
            <Play className="relative h-7 w-7 translate-x-0.5 fill-white text-white sm:h-8 sm:w-8" />
          </button>

          <div className="relative flex items-center gap-2 text-xs font-medium text-spyder-gray">
            {isTouch ? (
              <span className="tracking-wide text-white/90">Tap to Play</span>
            ) : (
              <span className="tracking-wide">Connecting to live feed…</span>
            )}
          </div>
        </div>
      )}

      {/* ── Soft corner scrim — keeps branding legible over bright scenes ────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-20 h-16 w-36 bg-gradient-to-bl from-black/45 via-black/10 to-transparent sm:h-20 sm:w-48"
      />

      {/* ── Persistent top-right branding ─────────────────────────────────────
          Spider-eye + "Powered by SpyderNetwork". Clickable → opens the site.
          z-30 stays above the tap-catcher + overlay so it is always visible and
          tappable. Desktop: subtle, brightens + glows on hover. Mobile: higher
          opacity for readability; the p-2 padding gives a ≥44px tap target while
          the pill stays small. Safe areas respected. */}
      <a
        href={brandHref}
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
        <span
          className={clsx(
            "flex min-h-[28px] items-center gap-1.5 rounded-full px-2 py-1",
            "border border-white/10 bg-black/40 backdrop-blur-md",
            "opacity-90 transition-all duration-300",
            "md:opacity-60 md:group-hover:opacity-100",
            "group-hover:border-spyder-red/50 group-hover:shadow-[0_0_14px_rgba(204,0,0,0.35)] group-active:opacity-100"
          )}
        >
          <SpyderEye className="hlsp-glow h-4 w-4 shrink-0" />
          <span className="flex flex-col items-start leading-none">
            <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-white/60">
              Powered by
            </span>
            <span className="text-[11px] font-semibold leading-tight tracking-wide text-white">
              SpyderNetwork
            </span>
          </span>
        </span>
      </a>
    </div>
  );
}

export default HlsPlayer;
