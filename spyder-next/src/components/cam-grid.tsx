"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Camera, CameraCategory, categories } from "@/data/cameras";
import { CamCard } from "@/components/cam-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CamGridProps {
  cameras: Camera[];
}

export function CamGrid({ cameras }: CamGridProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const activeCategory = (searchParams.get("category") as CameraCategory) || "All";

  const filteredCameras = useMemo(() => {
    return cameras
      .filter((cam) => activeCategory === "All" || cam.category === activeCategory)
      .filter(
        (cam) =>
          !searchQuery ||
          cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cam.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [cameras, activeCategory, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cameras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 min-h-[48px]"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredCameras.map((camera, i) => (
          <CamCard key={camera.id} camera={camera} index={i} />
        ))}
      </div>
      {filteredCameras.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No cameras match your filters.</p>
      )}
    </div>
  );
}
