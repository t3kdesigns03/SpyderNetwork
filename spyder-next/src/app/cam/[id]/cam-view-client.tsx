"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Pin, Heart } from "lucide-react";
import { Camera } from "@/data/cameras";
import { Badge } from "@/components/ui/badge";
import { usePip } from "@/providers/pip-provider";
import { useFavorites } from "@/providers/favorites-provider";
import { cn } from "@/lib/utils";

const crowdVariant = { Low: "low", Medium: "medium", High: "high", Packed: "packed" } as const;

export function CamViewClient({ camera }: { camera: Camera }) {
  const { pinCamera } = usePip();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="min-h-screen">
      <div className="container py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Live Cams
        </Link>

        <div className="rounded-2xl overflow-hidden border border-border bg-card">
          <div className="aspect-video relative">
            <video
              src={camera.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="gradient-overlay absolute inset-0" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 backdrop-blur-sm">
                <span className="live-pulse h-2 w-2 rounded-full bg-primary" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                  Live
                </span>
              </div>
              <Badge variant={crowdVariant[camera.crowdLevel]}>{camera.crowdLevel}</Badge>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <motion.button
                onClick={() => pinCamera(camera)}
                className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-[#ff1744]/90 hover:bg-[#ff1744] text-white border-2 border-[#ff1744] shadow-[0_0_15px_rgba(255,23,68,0.4)] hover:shadow-[0_0_25px_rgba(255,23,68,0.6)] transition-all duration-200 touch-manipulation"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Pin className="h-4 w-4" />
                Pin to Float
              </motion.button>
              <motion.button
                className={cn(
                  "inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-2 px-4 py-2 rounded-lg font-semibold text-sm border-2 transition-all touch-manipulation",
                  isFavorite(camera.id)
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-secondary/80 border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                )}
                onClick={() => toggleFavorite(camera.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className={cn("h-4 w-4", isFavorite(camera.id) && "fill-current")} />
                {isFavorite(camera.id) ? "Saved" : "Favorite"}
              </motion.button>
            </div>
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">{camera.name}</h1>
            <p className="text-muted-foreground mt-1">{camera.location}</p>
            {camera.description && (
              <p className="mt-4 text-muted-foreground">{camera.description}</p>
            )}
            {camera.website && (
              <a
                href={camera.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                Visit Website →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
