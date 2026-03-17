"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pin, Heart } from "lucide-react";
import { Camera } from "@/data/cameras";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePip } from "@/providers/pip-provider";
import { useFavorites } from "@/providers/favorites-provider";
import { cn } from "@/lib/utils";

const crowdVariant = {
  Low: "low",
  Medium: "medium",
  High: "high",
  Packed: "packed",
} as const;

interface CamCardProps {
  camera: Camera;
  index: number;
}

export function CamCard({ camera, index }: CamCardProps) {
  const { pinCamera } = usePip();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.2, 0, 0, 1] }}
    >
      <div className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:scale-[1.02]">
        <Link href={`/cam/${camera.id}`} className="block">
          <div className="aspect-video relative overflow-hidden bg-secondary">
            <video
              src={camera.videoUrl}
              muted
              loop
              playsInline
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              poster=""
            />
            <div className="gradient-overlay absolute inset-0" />
            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 backdrop-blur-sm">
              <span className="live-pulse h-2 w-2 rounded-full bg-primary" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                Live
              </span>
            </div>
            <div className="absolute top-3 left-3">
              <Badge variant={crowdVariant[camera.crowdLevel]} className="text-[10px]">
                {camera.crowdLevel}
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-sm font-semibold text-foreground leading-tight">{camera.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{camera.location}</p>
            </div>
          </div>
        </Link>
        <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              pinCamera(camera);
            }}
            title="Pin to Float"
          >
            <Pin className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className={cn("h-8 w-8", isFavorite(camera.id) && "text-primary")}
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(camera.id);
            }}
            title="Add to Favorites"
          >
            <Heart className={cn("h-4 w-4", isFavorite(camera.id) && "fill-current")} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
