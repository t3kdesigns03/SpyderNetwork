"use client";

import { useState, useCallback } from "react";
import { Star, ExternalLink, MapPin, Play, Cast } from "lucide-react";
import { clsx } from "clsx";
import type { Cam } from "@/types";
import { CamEmbed } from "./CamEmbed";

interface CamCardProps {
  cam: Cam;
  /** If true, renders the full embed (used on individual cam page / cycle view) */
  expanded?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onClick?: (cam: Cam) => void;
}

export function CamCard({
  cam,
  expanded = false,
  isFavorite = false,
  onToggleFavorite,
  onClick,
}: CamCardProps) {
  const [embedLoaded, setEmbedLoaded] = useState(false);

  const handleCardClick = useCallback(() => {
    if (onClick) onClick(cam);
  }, [cam, onClick]);

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite?.(cam.id);
    },
    [cam.id, onToggleFavorite]
  );

  const categoryLabel: Record<string, string> = {
    "bar-grill": "Bar & Grill",
    marina: "Marina",
    pool: "Pool",
    dock: "Dock",
    stage: "Stage",
    shop: "Shop",
    "real-estate": "Real Estate",
    radio: "Radio",
    shelter: "Shelter",
    "lake-view": "Lake View",
  };

  return (
    <div
      className={clsx(
        "cam-card group",
        expanded ? "aspect-auto" : "aspect-video-cam"
      )}
      onClick={!expanded ? handleCardClick : undefined}
      role={!expanded ? "button" : undefined}
      tabIndex={!expanded ? 0 : undefined}
      onKeyDown={
        !expanded
          ? (e) => (e.key === "Enter" || e.key === " ") && handleCardClick()
          : undefined
      }
    >
      {/* Video embed (expanded) or thumbnail placeholder (collapsed) */}
      {expanded ? (
        <div className="relative w-full aspect-video-cam">
          <CamEmbed cam={cam} onLoad={() => setEmbedLoaded(true)} />
        </div>
      ) : (
        <div className="absolute inset-0 bg-spyder-navy-card flex items-center justify-center">
          {/* Placeholder with play icon */}
          <div className="flex flex-col items-center gap-2 text-white/30 group-hover:text-white/60 transition-colors">
            <Play className="w-10 h-10 fill-current" />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-card-gradient" />
        </div>
      )}

      {/* Overlay info */}
      <div className={clsx(expanded ? "relative p-4 bg-spyder-navy-card border-t border-white/10" : "absolute inset-x-0 bottom-0 p-3")}>
        {/* Live badge + favorite */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            {cam.isLive && (
              <span className="live-badge">
                <span className="live-dot" />
                LIVE
              </span>
            )}
            <span className="text-xs text-spyder-gray bg-black/40 px-2 py-0.5 rounded-full">
              {categoryLabel[cam.category] || cam.category}
            </span>
          </div>

          <button
            onClick={handleFavorite}
            className={clsx(
              "w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 shrink-0",
              isFavorite
                ? "text-spyder-gold bg-spyder-gold/20"
                : "text-white/40 hover:text-spyder-gold hover:bg-white/10"
            )}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
          >
            <Star className={clsx("w-4 h-4", isFavorite && "fill-current")} />
          </button>
        </div>

        {/* Business name + cam name */}
        <div>
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-1">
            {cam.business}
          </h3>
          <p className="text-xs text-spyder-gray mt-0.5 line-clamp-1">{cam.name}</p>
        </div>

        {/* Mile marker */}
        {cam.mile && (
          <div className="flex items-center gap-1 mt-1 text-xs text-spyder-teal">
            <MapPin className="w-3 h-3" />
            Mile {cam.mile}
          </div>
        )}

        {/* Expanded links */}
        {expanded && (
          <div className="flex gap-2 mt-3">
            {cam.websiteUrl && (
              <a
                href={cam.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-secondary text-xs py-2 px-3 min-h-[36px]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Visit Site
              </a>
            )}
            <a
              href={`https://player.twitch.tv/?channel=${cam.twitchChannel}&parent=spydernetwork.com`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn-secondary text-xs py-2 px-3 min-h-[36px]"
            >
              <Cast className="w-3.5 h-3.5" />
              Cast to TV
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
