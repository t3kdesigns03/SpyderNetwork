import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cameras, PLACEHOLDER_THUMBNAIL } from "@/data/cameras";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Nightlife",
  description: "Lake of the Ozarks nightlife hotspots. Live cams from bars, stages, and pools.",
};

const nightlifeCams = cameras.filter(
  (c) =>
    c.category === "Bars & Grills" ||
    c.category === "Stages" ||
    c.category === "Pools"
);

export default function NightlifePage() {
  return (
    <div className="container py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Nightlife</h1>
        <p className="text-muted-foreground mt-1">
          Live cams from bars, stages, and pools across the Lake
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nightlifeCams.map((cam) => (
          <Link key={cam.id} href={`/cam/${cam.id}`}>
            <Card className="overflow-hidden hover:border-primary/50 transition-colors">
              <div className="aspect-video relative">
                <Image
                  src={cam.thumbnailUrl ?? PLACEHOLDER_THUMBNAIL}
                  alt={cam.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw, 33vw"
                  className="object-cover"
                />
                <div className="gradient-overlay absolute inset-0" />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary">{cam.category}</Badge>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1">
                  <span className="live-pulse h-2 w-2 rounded-full bg-primary" />
                  <span className="font-mono text-[10px] font-bold uppercase text-primary">Live</span>
                </div>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-foreground">{cam.name}</h3>
                <p className="text-sm text-muted-foreground">{cam.location}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
