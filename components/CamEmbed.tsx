"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import type { Cam } from "@/types";

interface CamEmbedProps {
  cam: Cam;
  onLoad?: () => void;
  autoplay?: boolean;
}

export function CamEmbed({ cam, onLoad, autoplay = true }: CamEmbedProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hostname, setHostname] = useState("spydernetwork.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostname(window.location.hostname || "spydernetwork.com");
    }
  }, []);

  // Reset on cam change (cycle advances)
  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [cam.id]);

  const getEmbedUrl = (): string => {
    if (cam.streamProvider === "twitch" && cam.twitchChannel) {
      const params = new URLSearchParams({
        channel: cam.twitchChannel,
        parent: hostname,
        autoplay: autoplay ? "true" : "false",
        muted: "true", // required for browser autoplay policy; Twitch shows its own unmute button
      });
      return `https://player.twitch.tv/?${params.toString()}`;
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
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-spyder-navy-card z-10 pointer-events-none">
          <Loader2 className="w-8 h-8 text-spyder-red animate-spin" />
          <p className="text-spyder-gray text-sm mt-2">Loading stream…</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-spyder-navy-card z-10 px-4 text-center">
          <AlertCircle className="w-8 h-8 text-spyder-red" />
          <p className="text-white text-sm font-semibold mt-2">Stream unavailable</p>
          <p className="text-spyder-gray text-xs mt-1">Check your connection or try again later.</p>
        </div>
      )}

      <iframe
        key={cam.id}
        src={embedUrl}
        className="twitch-embed-frame"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture"
        title={`${cam.business} – ${cam.name} live cam`}
        onLoad={() => { setLoading(false); onLoad?.(); }}
        onError={() => { setLoading(false); setError(true); }}
      />
    </div>
  );
}
