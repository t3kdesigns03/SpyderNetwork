"use client";

import { useRef, useEffect, useCallback } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Camera } from "@/data/cameras";
import { motion } from "framer-motion";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapboxMapProps {
  cameras: Camera[];
  onMarkerClick: (cam: Camera) => void;
  selectedCam: Camera | null;
}

function BoatMarker({ cam, onClick, isSelected }: { cam: Camera; onClick: () => void; isSelected: boolean }) {
  return (
    <Marker longitude={cam.lng} latitude={cam.lat} anchor="bottom" onClick={(e) => { e.originalEvent.stopPropagation(); onClick(); }}>
      <motion.div
        animate={{ scale: isSelected ? 1.2 : 1 }}
        className="cursor-pointer"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className={isSelected ? "drop-shadow-[0_0_8px_#ff1744]" : ""}
        >
          <path
            d="M16 4L8 12v8l8 8 8-8v-8l-8-8z"
            fill={isSelected ? "#ff1744" : "#e11d48"}
            stroke="#111"
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>
    </Marker>
  );
}

export function MapboxMap({ cameras, onMarkerClick, selectedCam }: MapboxMapProps) {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !selectedCam) return;
    mapRef.current.flyTo({
      center: [selectedCam.lng, selectedCam.lat],
      zoom: 15,
      duration: 1000,
    });
  }, [selectedCam]);

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

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: -92.65,
        latitude: 38.15,
        zoom: 10,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
      {cameras.map((cam) => (
        <BoatMarker
          key={cam.id}
          cam={cam}
          onClick={() => onMarkerClick(cam)}
          isSelected={selectedCam?.id === cam.id}
        />
      ))}
      {selectedCam && (
        <Popup
          longitude={selectedCam.lng}
          latitude={selectedCam.lat}
          anchor="top"
          onClose={() => {}}
          closeButton={false}
        >
          <div className="bg-card text-foreground p-2 rounded-lg border border-border min-w-[180px]">
            <h3 className="font-semibold text-sm">{selectedCam.name}</h3>
            <p className="text-xs text-muted-foreground">{selectedCam.location}</p>
            <p className="text-xs text-primary mt-1">PiP opened • Click marker to close</p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
