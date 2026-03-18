"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { cameras } from "@/data/cameras";
import { usePip } from "@/providers/pip-provider";
import type { Camera } from "@/data/cameras";

const MapboxMap = dynamic(() => import("./mapbox-map").then((m) => m.MapboxMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a1428]">
      <div className="text-muted-foreground">Loading map...</div>
    </div>
  ),
});

export function MapView() {
  const { pinCamera } = usePip();
  const [selectedCam, setSelectedCam] = useState<Camera | null>(null);

  const handleMarkerClick = useCallback(
    (cam: Camera) => {
      setSelectedCam(cam);
      pinCamera(cam);
      toast.success("Cam pinned", { description: `${cam.name} is now playing in the PiP player.` });
    },
    [pinCamera]
  );

  return (
    <div className="fixed inset-0 z-0 w-full h-full min-h-[100dvh]">
      <MapboxMap cameras={cameras} onMarkerClick={handleMarkerClick} selectedCam={selectedCam} />
    </div>
  );
}
