"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Map, { Marker, Popup, Source, Layer, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Camera } from "@/data/cameras";
import { motion } from "framer-motion";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

interface MapboxMapProps {
  cameras: Camera[];
  onMarkerClick: (cam: Camera) => void;
  selectedCam: Camera | null;
}

function BoatMarker({
  cam,
  onClick,
  isSelected,
  isHovered,
  onHover,
}: {
  cam: Camera;
  onClick: () => void;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}) {
  const { mode } = useTheme();
  const isAfterDark = mode === "after-dark";

  return (
    <Marker
      longitude={cam.lng}
      latitude={cam.lat}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick();
      }}
    >
      <motion.div
        animate={{
          scale: isSelected ? 1.25 : isHovered ? 1.1 : 1,
          filter: isAfterDark
            ? `drop-shadow(0 0 6px #ff1744) drop-shadow(0 0 12px rgba(255,23,68,0.6))`
            : isSelected || isHovered
              ? "drop-shadow(0 0 8px #ff1744)"
              : "none",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="cursor-pointer relative"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        {/* Boat-shaped SVG - hull with red accent, responsive scaling */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          className={cn(
            "w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-all",
            (isAfterDark || isSelected || isHovered) && "animate-pulse"
          )}
        >
          {/* Hull - boat shape */}
          <path
            d="M18 4L8 14v6c0 2 2 4 4 4h12c2 0 4-2 4-4v-6L18 4z"
            fill={isSelected || isHovered ? "#ff1744" : "#e11d48"}
            stroke="#111"
            strokeWidth="1.5"
          />
          {/* Cabin/deck accent */}
          <path
            d="M14 18h8v4h-8z"
            fill="#111"
            stroke="#111"
            strokeWidth="0.5"
          />
        </svg>
        {/* After Dark firefly glow */}
        {isAfterDark && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(255,23,68,0.4) 0%, transparent 70%)",
              width: 48,
              height: 48,
              left: -6,
              top: -6,
            }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </Marker>
  );
}

export function MapboxMap({ cameras, onMarkerClick, selectedCam }: MapboxMapProps) {
  const mapRef = useRef<any>(null);
  const [hoveredCam, setHoveredCam] = useState<Camera | null>(null);
  const { mode } = useTheme();
  const isAfterDark = mode === "after-dark";

  useEffect(() => {
    if (!mapRef.current || !selectedCam) return;
    mapRef.current.flyTo({
      center: [selectedCam.lng, selectedCam.lat],
      zoom: 15,
      duration: 1000,
    });
  }, [selectedCam]);

  const heatmapData = useCallback(() => {
    const maxViewers = Math.max(...cameras.map((c) => c.viewerCount ?? 50));
    return {
      type: "FeatureCollection" as const,
      features: cameras.map((cam) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [cam.lng, cam.lat],
        },
        properties: {
          magnitude: ((cam.viewerCount ?? 50) / maxViewers) * 3,
        },
      })),
    };
  }, [cameras]);

  const heatmapPaint = {
    "heatmap-weight": ["interpolate", ["linear"], ["get", "magnitude"], 0, 0, 1, 1, 3, 1.5],
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 0.5, 9, 1.5, 15, 2],
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(255,23,68,0)",
      0.2,
      "rgba(255,23,68,0.15)",
      0.4,
      "rgba(255,23,68,0.35)",
      0.6,
      "rgba(255,23,68,0.55)",
      0.8,
      "rgba(255,23,68,0.75)",
      1,
      "rgba(255,23,68,0.95)",
    ],
    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 8, 9, 25, 15, 50],
    "heatmap-opacity": isAfterDark ? 0.6 : 0.4,
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a1428] text-muted-foreground">
        <div className="text-center p-8">
          <p className="mb-2">Mapbox token required.</p>
          <p className="text-sm">Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local</p>
        </div>
      </div>
    );
  }

  const showPopup = hoveredCam || selectedCam;
  const popupCam = selectedCam ?? hoveredCam;

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: -92.65,
        latitude: 38.15,
        zoom: 10,
      }}
      style={{ width: "100%", height: "100%", minHeight: "100dvh" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
      <NavigationControl position="top-right" showCompass={false} />
      {/* Heat layer - neon red glow based on viewer count */}
      <Source id="cam-heatmap" type="geojson" data={heatmapData()}>
        {/* @ts-expect-error Mapbox heatmap paint types are strict */}
        <Layer id="cam-heatmap-layer" type="heatmap" paint={heatmapPaint} />
      </Source>

      {cameras.map((cam) => (
        <BoatMarker
          key={cam.id}
          cam={cam}
          onClick={() => onMarkerClick(cam)}
          isSelected={selectedCam?.id === cam.id}
          isHovered={hoveredCam?.id === cam.id}
          onHover={(hovered) => setHoveredCam(hovered ? cam : null)}
        />
      ))}

      {/* Tooltip on hover: cam name + pulsing Live badge */}
      {/* Tooltip on click: live info + PiP opened */}
      {showPopup && popupCam && (
        <Popup
          longitude={popupCam.lng}
          latitude={popupCam.lat}
          anchor="top"
          onClose={() => {}}
          closeButton={false}
          className="spyder-map-popup"
        >
          <div
            className={cn(
              "bg-card text-foreground p-3 rounded-lg border min-w-[200px]",
              isAfterDark ? "glass-after-dark border-primary/40 shadow-[0_0_20px_rgba(255,23,68,0.2)]" : "border-border"
            )}
          >
            <h3 className="font-semibold text-sm">{popupCam.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{popupCam.location}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium live-pulse">
                Live
              </span>
              <span className="text-xs text-muted-foreground">
                {(popupCam.viewerCount ?? 50).toLocaleString()} watching
              </span>
            </div>
            {selectedCam?.id === popupCam.id && (
              <p className="text-xs text-primary mt-1.5">PiP opened • Click marker to close</p>
            )}
          </div>
        </Popup>
      )}
    </Map>
  );
}
