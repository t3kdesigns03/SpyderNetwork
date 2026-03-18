"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Pin, Heart } from "lucide-react";
import { Camera, PLACEHOLDER_THUMBNAIL } from "@/data/cameras";
import { Badge } from "@/components/ui/badge";
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
  const thumbnail = camera.thumbnailUrl ?? PLACEHOLDER_THUMBNAIL;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.2, 0, 0, 1] }}
    >
      <div className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:scale-[1.02] focus-within:border-primary/50">
        <Link href={`/cam/${camera.id}`} className="block">
          <div className="aspect-video relative overflow-hidden bg-secondary">
            <Image
              src={thumbnail}
              alt={camera.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized={thumbnail.startsWith("data:")}
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
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              pinCamera(camera);
              toast.success("Cam pinned", { description: `${camera.name} is now playing in the PiP player.` });
            }}
            className="flex-1 flex items-center justify-center gap-2 min-h-[48px] py-2.5 px-4 rounded-lg font-semibold text-sm bg-[#ff1744]/90 hover:bg-[#ff1744] text-white border-2 border-[#ff1744] shadow-[0_0_15px_rgba(255,23,68,0.4)] hover:shadow-[0_0_25px_rgba(255,23,68,0.6),0_0_40px_rgba(255,23,68,0.25)] pin-float-hover transition-all duration-200 touch-manipulation"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title="Pin to Float"
          >
            <Pin className="h-4 w-4" />
            Pin to Float
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(camera.id);
            }}
            className={cn(
              "p-2.5 min-w-[48px] min-h-[48px] rounded-lg border-2 transition-all touch-manipulation flex items-center justify-center",
              isFavorite(camera.id)
                ? "bg-primary/20 border-primary/50 text-primary"
                : "bg-secondary/80 border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
            )}
            title="Add to Favorites"
          >
            <Heart className={cn("h-4 w-4", isFavorite(camera.id) && "fill-current")} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
