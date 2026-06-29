"use client";

import { useState, useEffect } from "react";
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
  "spydern3twork.netlify.app",
  "localhost",
  "127.0.0.1",
];

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

interface CamEmbedProps {
  cam:      Cam;
  onLoad?:  () => void;
  autoplay?: boolean;
}

export function CamEmbed({ cam, onLoad, autoplay = true }: CamEmbedProps) {
  const [error,          setError]          = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayFading,  setOverlayFading]  = useState(false);
  const [iframeKey,      setIframeKey]      = useState(0);

  // Build embed URL once — no async hostname lookup needed
  const embedUrl =
    cam.streamProvider === "twitch" && cam.twitchChannel
      ? buildTwitchUrl(cam.twitchChannel, autoplay)
      : (cam.iframeUrl ?? "");

  // ── Overlay lifecycle ───────────────────────────────────────────────────────
  // Resets on every cam change. Auto-fades at 2.8 s (Twitch info card clears).
  useEffect(() => {
    setError(false);
    setOverlayVisible(true);
    setOverlayFading(false);

    const t1 = setTimeout(() => setOverlayFading(true),   2800);
    const t2 = setTimeout(() => setOverlayVisible(false), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [cam.id]);

  // Tap: dismiss overlay immediately + reload iframe inside a user-gesture
  // context — satisfies iOS Safari's autoplay policy for muted video.
  const handleOverlayTap = () => {
    setOverlayFading(true);
    setTimeout(() => setOverlayVisible(false), 350);
    setIframeKey((k) => k + 1);
  };

  if (!embedUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-spyder-navy-card text-spyder-gray">
        <AlertCircle className="w-8 h-8" />
        <span className="ml-2 text-sm">Stream unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[200px] bg-black">

      {/*
        ── iframe — FIRST child, no ready-state gate ─────────────────────────
        Rendering the iframe first (before the overlay) means the browser
        registers it as the primary content on page load. autoplay=true +
        muted=true satisfies Chrome/Firefox autoplay policy immediately.
        Multiple parent= params remove the need for any async hostname lookup.
      */}
      <iframe
        key={`${cam.id}-${iframeKey}`}
        src={embedUrl}
        className="twitch-embed-frame"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${cam.business}${cam.name ? ` – ${cam.name}` : ""} live cam`}
        onLoad={() => onLoad?.()}
        onError={() => { setError(true); setOverlayVisible(false); }}
      />

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-spyder-navy-card z-10 px-4 text-center">
          <AlertCircle className="w-8 h-8 text-spyder-red" />
          <p className="text-white text-sm font-semibold mt-2">Stream unavailable</p>
          <p className="text-spyder-gray text-xs mt-1">Check your connection or try again later.</p>
        </div>
      )}

      {/*
        ── Branded overlay — rendered AFTER the iframe ────────────────────────
        z-20 puts it visually on top. Auto-fades at 2.8 s revealing the
        already-playing video. Tap reloads the iframe in a gesture context
        (helps on iOS Safari which sometimes needs the gesture hint for audio).
      */}
      {overlayVisible && !error && (
        <button
          onClick={handleOverlayTap}
          aria-label="Tap to play"
          className={clsx(
            "absolute inset-0 z-20 w-full flex flex-col items-center justify-center gap-3",
            "bg-spyder-navy cursor-pointer select-none",
            "transition-opacity duration-500",
            overlayFading ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          {/* Spider-web bg */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" aria-hidden="true">
            <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
              <g stroke="#cc0000" strokeWidth="0.5" fill="none">
                {[20, 40, 60, 80, 100].map((r) => (
                  <circle key={r} cx="100" cy="100" r={r} />
                ))}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <line key={deg} x1="100" y1="100"
                      x2={100 + 110 * Math.cos(rad)}
                      y2={100 + 110 * Math.sin(rad)} />
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Spider icon */}
          <svg width="52" height="52" viewBox="0 0 80 80" fill="none"
            className="drop-shadow-[0_0_10px_rgba(204,0,0,0.7)]" aria-hidden="true">
            <g stroke="#cc0000" strokeWidth="3" strokeLinecap="round" opacity="0.7">
              <path d="M29 33 Q18 22 7 15" />
              <path d="M27 40 Q13 37 3 41" />
              <path d="M29 47 Q18 57 7 64" />
              <path d="M51 33 Q62 22 73 15" />
              <path d="M53 40 Q67 37 77 41" />
              <path d="M51 47 Q62 57 73 64" />
            </g>
            <circle cx="40" cy="40" r="17" fill="#cc0000" />
            <circle cx="40" cy="40" r="12.5" fill="#0a0e1a" />
            <circle cx="40" cy="40" r="5.5" fill="#cc0000" />
            <circle cx="40" cy="40" r="2.8" fill="white" />
            <circle cx="38.5" cy="38.5" r="1" fill="rgba(255,255,255,0.8)" />
          </svg>

          {/* Cam info */}
          <div className="text-center px-6">
            <p className="text-white font-bold text-sm tracking-wide leading-tight">{cam.business}</p>
            {cam.name && <p className="text-spyder-gray text-xs mt-0.5">{cam.name}</p>}
          </div>

          {/* Connecting pulse */}
          <div className="flex items-center gap-2 text-spyder-gray text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-spyder-red animate-ping shrink-0" />
            Connecting to live feed…
          </div>

          {/* Tap-to-skip pill */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mt-1">
            <Play className="w-3.5 h-3.5 text-white fill-white shrink-0" />
            <span className="text-white text-xs font-medium">Tap to skip wait</span>
          </div>
        </button>
      )}
    </div>
  );
}
