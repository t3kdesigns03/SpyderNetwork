"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Play } from "lucide-react";
import { clsx } from "clsx";
import type { Cam } from "@/types";

interface CamEmbedProps {
  cam: Cam;
  onLoad?: () => void;
  autoplay?: boolean;
}

export function CamEmbed({ cam, onLoad, autoplay = true }: CamEmbedProps) {
  const [error, setError] = useState(false);
  const [hostname, setHostname] = useState("spydernetwork.com");
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayFading, setOverlayFading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Pessimistic default: treat as mobile until hydration proves otherwise.
  // This prevents the desktop auto-fade timer from firing before we know
  // the device type, and ensures the iframe is never mounted outside a
  // user gesture on mobile.
  const [isMobile, setIsMobile] = useState(true);

  // iframeReady = false on mobile until the user taps (gesture required).
  // On desktop it flips to true immediately after hydration.
  const [iframeReady, setIframeReady] = useState(false);

  // ── Hydration: detect real device, unlock iframe gate on desktop ──────────
  useEffect(() => {
    const h = window.location.hostname || "spydernetwork.com";
    setHostname(h);

    // coarse pointer = touch device
    const mobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    setIsMobile(mobile);

    if (!mobile) {
      // Desktop: mount iframe immediately — autoplay works without gesture.
      setIframeReady(true);
    }
    // Mobile: iframeReady stays false until user taps the overlay.
  }, []);

  // ── Reset on cam change ───────────────────────────────────────────────────
  useEffect(() => {
    setError(false);
    setOverlayVisible(true);
    setOverlayFading(false);

    if (isMobile) {
      // Mobile: gate the new cam behind a fresh tap — new iframe needs a new gesture.
      setIframeReady(false);
      return;
    }

    // Desktop: auto-fade overlay once Twitch's info card has dismissed (~2.8 s).
    const t1 = setTimeout(() => setOverlayFading(true), 2800);
    const t2 = setTimeout(() => setOverlayVisible(false), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [cam.id, isMobile]);

  // ── Overlay tap ───────────────────────────────────────────────────────────
  // Runs inside a user-gesture stack → browser allows autoplay.
  const handleOverlayTap = () => {
    setIframeReady(true);        // mount (or keep) the iframe
    setIframeKey((k) => k + 1); // force a fresh mount inside this gesture
    setOverlayFading(true);
    setTimeout(() => setOverlayVisible(false), 350);
  };

  // ── Embed URL ─────────────────────────────────────────────────────────────
  const getEmbedUrl = (): string => {
    if (cam.streamProvider === "twitch" && cam.twitchChannel) {
      const p = new URLSearchParams({
        channel: cam.twitchChannel,
        parent: hostname,
        autoplay: autoplay ? "true" : "false",
        muted: "true",
      });
      return `https://player.twitch.tv/?${p.toString()}`;
    }
    if (cam.iframeUrl) return cam.iframeUrl;
    return "";
  };

  const embedUrl = getEmbedUrl();

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

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-spyder-navy-card z-10 px-4 text-center">
          <AlertCircle className="w-8 h-8 text-spyder-red" />
          <p className="text-white text-sm font-semibold mt-2">Stream unavailable</p>
          <p className="text-spyder-gray text-xs mt-1">Check your connection or try again later.</p>
        </div>
      )}

      {/*
        Branded overlay
        ─────────────────────────────────────────────────────────────────────
        Desktop: auto-fades at 2.8 s (Twitch info card gone, video playing).
        Mobile:  stays until tapped. The tap IS the user gesture that satisfies
                 iOS Safari / Android Chrome autoplay policy. The iframe is not
                 rendered until after the tap.
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

          {/* Status */}
          <div className="flex items-center gap-2 text-spyder-gray text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-spyder-red animate-ping shrink-0" />
            {isMobile ? "Live now — tap to watch" : "Connecting to live feed…"}
          </div>

          {/* Play pill */}
          <div className="flex items-center gap-2 bg-spyder-red/90 border border-spyder-red rounded-full px-5 py-2.5 mt-1 shadow-[0_0_12px_rgba(204,0,0,0.5)]">
            <Play className="w-4 h-4 text-white fill-white shrink-0" />
            <span className="text-white text-sm font-semibold">
              {isMobile ? "Tap to play" : "Tap to play now"}
            </span>
          </div>
        </button>
      )}

      {/*
        iframe — only rendered when iframeReady=true.
        On mobile that only happens AFTER handleOverlayTap fires (user gesture),
        satisfying iOS Safari + Android Chrome autoplay policy.
      */}
      {iframeReady && (
        <iframe
          key={`${cam.id}-${iframeKey}`}
          src={embedUrl}
          className="twitch-embed-frame"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; web-share"
          title={`${cam.business}${cam.name ? ` – ${cam.name}` : ""} live cam`}
          onLoad={() => onLoad?.()}
          onError={() => { setError(true); setOverlayVisible(false); }}
        />
      )}
    </div>
  );
}
