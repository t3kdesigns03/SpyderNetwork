"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pin } from "lucide-react";
import { cameras, PLACEHOLDER_THUMBNAIL } from "@/data/cameras";
import { usePip } from "@/providers/pip-provider";
import { useTheme } from "@/providers/theme-provider";
import { SpiderIcon } from "@/components/spider-icon";
import { cn } from "@/lib/utils";

const nightlifeCams = cameras.filter(
  (c) =>
    c.category === "Bars & Grills" ||
    c.category === "Stages" ||
    c.category === "Pools"
);

const categories = [
  { id: "all", label: "All" },
  { id: "bars", label: "Bars & Grills" },
  { id: "stages", label: "Stages" },
  { id: "pools", label: "Pools" },
] as const;

export function NightlifeClient() {
  const { pinCamera } = usePip();
  const { setMode, mode } = useTheme();
  const isAfterDark = mode === "after-dark";

  useEffect(() => {
    setMode("after-dark");
    return () => setMode("light");
  }, [setMode]);

  const filteredByCategory = (cat: string) => {
    if (cat === "all") return nightlifeCams;
    if (cat === "bars") return nightlifeCams.filter((c) => c.category === "Bars & Grills");
    if (cat === "stages") return nightlifeCams.filter((c) => c.category === "Stages");
    if (cat === "pools") return nightlifeCams.filter((c) => c.category === "Pools");
    return nightlifeCams;
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Nightlife</h1>
        <p className="text-muted-foreground mt-1">
          Live cams from bars, stages, and pools across the Lake
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-4 bg-secondary/50 border border-[#ff1744]/20">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="data-[state=active]:bg-[#ff1744]/20 data-[state=active]:text-[#ff1744] data-[state=active]:shadow-[0_0_12px_rgba(255,23,68,0.3)]"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredByCategory(cat.id).map((cam) => (
                <motion.div
                  key={cam.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Card
                    className={cn(
                      "overflow-hidden transition-all duration-300 hover:border-[#ff1744]/50",
                      "shadow-[0_0_20px_rgba(255,23,68,0.08)] hover:shadow-[0_0_30px_rgba(255,23,68,0.15)]"
                    )}
                  >
                    <Link href={`/cam/${cam.id}`}>
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
                          <Badge className="bg-[#ff1744]/20 text-[#ff1744] border-[#ff1744]/30">
                            {cam.category}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-[#ff1744]/20 px-2.5 py-1 backdrop-blur-sm border border-[#ff1744]/30">
                          <span className="live-pulse h-2 w-2 rounded-full bg-[#ff1744]" />
                          <span className="font-mono text-[10px] font-bold uppercase text-[#ff1744]">
                            Live
                          </span>
                        </div>
                        {isAfterDark && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-2 right-14 pointer-events-none"
                          >
                            <motion.div
                              animate={{
                                y: [0, -4, 0],
                                boxShadow: [
                                  "0 0 8px rgba(255,23,68,0.5)",
                                  "0 0 14px rgba(255,23,68,0.8)",
                                  "0 0 8px rgba(255,23,68,0.5)",
                                ],
                              }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                              className="rounded-full bg-[#111]/90 p-1 border border-[#ff1744]/50"
                            >
                              <SpiderIcon size={14} />
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </Link>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-foreground">{cam.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{cam.location}</p>
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          pinCamera(cam);
                          toast.success("Cam pinned", { description: `${cam.name} is now playing in the PiP player.` });
                        }}
                        className="mt-3 inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg font-semibold text-sm bg-[#ff1744]/90 hover:bg-[#ff1744] text-white border-2 border-[#ff1744] shadow-[0_0_12px_rgba(255,23,68,0.3)] hover:shadow-[0_0_20px_rgba(255,23,68,0.5)] transition-all touch-manipulation"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Pin className="h-4 w-4" />
                        Pin to Float
                      </motion.button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
