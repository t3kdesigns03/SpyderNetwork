"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { cameras } from "@/data/cameras";
import { useFavorites } from "@/providers/favorites-provider";
import { CamCard } from "@/components/cam-card";

export function FavoritesClient() {
  const { favorites } = useFavorites();
  const favCams = cameras.filter((c) => favorites.includes(c.id));

  return (
    <div className="container py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Favorites</h1>
        <p className="text-muted-foreground mt-1">
          {favCams.length} camera{favCams.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {favCams.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {favCams.map((cam, i) => (
            <CamCard key={cam.id} camera={cam} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground mb-2">No favorites yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Click the heart on any cam to add it here
          </p>
          <Link
            href="/"
            className="inline-block text-primary hover:underline font-medium"
          >
            Browse Live Cams →
          </Link>
        </div>
      )}
    </div>
  );
}
