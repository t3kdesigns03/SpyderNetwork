"use client";

import { useEffect, useCallback } from "react";
import { X, ExternalLink, Cast, Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import type { Cam } from "@/types";
import { CamPlayer } from "./CamPlayer";
import { CAMS } from "@/lib/cams";

interface CamModalProps {
  cam: Cam;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

export function CamModal({ cam, isFavorite, onToggleFavorite, onClose }: CamModalProps) {
  const currentIndex = CAMS.findIndex((c) => c.id === cam.id);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`${cam.business} – ${cam.name}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel — full screen on mobile, constrained on desktop */}
      <div className="relative z-10 w-full sm:max-w-4xl sm:mx-4 sm:rounded-2xl overflow-hidden
                      bg-spyder-navy-card border border-white/10 flex flex-col
                      h-full sm:h-auto sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
          <div className="min-w-0">
            <h2 className="font-semibold text-white text-base leading-tight truncate">
              {cam.business}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              {cam.isLive && (
                <span className="live-badge text-xs">
                  <span className="live-dot" />
                  LIVE
                </span>
              )}
              {cam.mile && (
                <span className="flex items-center gap-1 text-xs text-spyder-teal">
                  <MapPin className="w-3 h-3" />
                  Mile {cam.mile}
                </span>
              )}
              <span className="text-xs text-spyder-gray">{cam.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleFavorite(cam.id)}
              className={clsx(
                "btn-icon w-10 h-10",
                isFavorite && "text-spyder-gold bg-spyder-gold/20 border-spyder-gold/30"
              )}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={clsx("w-4 h-4", isFavorite && "fill-current")} />
            </button>
            <button
              onClick={onClose}
              className="btn-icon w-10 h-10"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Stream */}
        <div className="w-full aspect-video-cam bg-black shrink-0">
          <CamPlayer cam={cam} />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-white/10 shrink-0">
          {cam.websiteUrl && (
            <a
              href={cam.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm py-2 px-4 min-h-[40px]"
            >
              <ExternalLink className="w-4 h-4" />
              {cam.business} Website
            </a>
          )}
          <a
            href={`https://player.twitch.tv/?channel=${cam.twitchChannel}&parent=spydernetwork.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm py-2 px-4 min-h-[40px]"
          >
            <Cast className="w-4 h-4" />
            Cast to TV
          </a>
          {cam.spyderPageUrl && (
            <a
              href={cam.spyderPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm py-2 px-4 min-h-[40px]"
            >
              <ExternalLink className="w-4 h-4" />
              Chat
            </a>
          )}
        </div>

        {/* Connection tip */}
        <div className="px-4 pb-3 pb-safe shrink-0">
          <p className="text-xs text-spyder-gray bg-white/5 rounded-lg px-3 py-2">
            💡 <strong>Tip:</strong> On cellular? Toggle airplane mode off/on to connect to
            the nearest tower for the best stream.
          </p>
        </div>
      </div>
    </div>
  );
}
