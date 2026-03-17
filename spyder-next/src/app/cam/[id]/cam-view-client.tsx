"use client";

import Link from "next/link";
import { ArrowLeft, Pin, Heart } from "lucide-react";
import { Camera } from "@/data/cameras";
import { Button } from "@/components/ui/button";
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
              <Button
                size="sm"
                variant="secondary"
                className="backdrop-blur-sm"
                onClick={() => pinCamera(camera)}
              >
                <Pin className="h-4 w-4 mr-1" />
                Pin to Float
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className={cn("backdrop-blur-sm", isFavorite(camera.id) && "text-primary")}
                onClick={() => toggleFavorite(camera.id)}
              >
                <Heart className={cn("h-4 w-4 mr-1", isFavorite(camera.id) && "fill-current")} />
                {isFavorite(camera.id) ? "Saved" : "Favorite"}
              </Button>
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
