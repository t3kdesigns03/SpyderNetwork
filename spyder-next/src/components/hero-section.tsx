"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera } from "@/data/cameras";
import { Badge } from "@/components/ui/badge";
import { Pin } from "lucide-react";
import { usePip } from "@/providers/pip-provider";

interface HeroSectionProps {
  featuredCam: Camera;
}

export function HeroSection({ featuredCam }: HeroSectionProps) {
  const { pinCamera } = usePip();

  return (
    <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] overflow-hidden border-b border-border">
      <div className="absolute inset-0 z-0">
        <video
          src={featuredCam.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
        <div className="gradient-overlay absolute inset-0" />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                <span className="live-pulse mr-1.5 inline-block h-2 w-2 rounded-full bg-primary" />
                Featured Live
              </Badge>
              <Badge variant="secondary">Backwater Jack&apos;s Stage</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-6xl drop-shadow-lg">
              <span className="text-[#e11d48]">Live.</span> Lake of the Ozarks
            </h1>
            <p className="mt-4 text-base text-white/90 sm:text-lg md:text-xl">
              The largest network of live cameras at the Lake of the Ozarks. Real-time views 24/7.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl bg-black/40 backdrop-blur-sm px-4 py-3 border border-white/10">
              <span className="text-sm text-white/90 font-medium">2,847 watching</span>
              <span className="text-white/50">•</span>
              <span className="text-sm text-white/90">Water 68°</span>
              <span className="text-white/50">•</span>
              <span className="text-sm text-white/90">Tonight: Lazy Gators Pub Crawl</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/cam/${featuredCam.id}`}>
                <motion.span
                  className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] px-6 py-3 rounded-lg font-semibold text-white bg-[#e11d48] hover:bg-[#ff1744] border-2 border-[#ff1744]/50 shadow-[0_0_20px_rgba(255,23,68,0.3)] hover:shadow-[0_0_30px_rgba(255,23,68,0.5)] transition-all duration-200 touch-manipulation"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Watch Full Screen
                </motion.span>
              </Link>
              <motion.button
                onClick={() => pinCamera(featuredCam)}
                className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#ff1744]/80 hover:bg-[#ff1744] border-2 border-[#ff1744] shadow-[0_0_15px_rgba(255,23,68,0.3)] hover:shadow-[0_0_25px_rgba(255,23,68,0.5)] transition-all duration-200 touch-manipulation"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Pin className="h-4 w-4" />
                Pin to Float
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
