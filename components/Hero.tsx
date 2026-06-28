"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, MapPin, ChevronDown, Wifi } from "lucide-react";
import { CAMS } from "@/lib/cams";

const LIVE_COUNT = CAMS.filter((c) => c.isLive).length;

export function Hero() {
  const [tick, setTick] = useState(0);

  // Animate the live cam count ticker
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background video/image layer */}
      <div className="absolute inset-0 z-0">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-spyder-navy/80 to-spyder-navy z-10" />
        {/* Animated water shimmer */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3CforeignObject%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3C/foreignObject%3E%3C/svg%3E')] opacity-10" />
        {/* Red glow from bottom */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 opacity-60"
          style={{ background: "radial-gradient(ellipse at center bottom, rgba(204,0,0,0.3) 0%, transparent 70%)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 pt-20 pb-10 max-w-4xl mx-auto">
        {/* Network indicator */}
        <div className="flex items-center gap-2 mb-6 animate-fade-in">
          <div className="live-badge text-xs px-3 py-1">
            <span className="live-dot" />
            {LIVE_COUNT} CAMS LIVE NOW
          </div>
        </div>

        {/* Main headline */}
        <h1 className="font-display text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-4 animate-slide-up">
          Lake of the Ozarks
          <br />
          <span className="text-spyder-red">Live&nbsp;Cams</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-base sm:text-lg text-spyder-gray max-w-xl mt-4 mb-8 leading-relaxed animate-fade-in">
          The largest network of live webcams at&nbsp;LOTO.
          Watch the action at bars, marinas, pools &amp; docks —
          right from your boat or dock.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col xs:flex-row gap-3 w-full xs:w-auto animate-slide-up">
          <Link href="/#cams" className="btn-primary text-base px-8 py-4">
            <Play className="w-5 h-5 fill-white" />
            Watch Live
          </Link>
          <Link href="/#map" className="btn-secondary text-base px-8 py-4">
            <MapPin className="w-5 h-5" />
            View Map
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 xs:gap-10 mt-10 pt-8 border-t border-white/10 w-full justify-center">
          <Stat label="Live Cams" value={`${LIVE_COUNT}+`} />
          <div className="w-px h-8 bg-white/10" />
          <Stat label="Locations" value="30+" />
          <div className="w-px h-8 bg-white/10" />
          <Stat label="Mile Markers" value="4–17" />
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#cams"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10
                   flex flex-col items-center gap-1 text-white/40 hover:text-white/80
                   transition-colors duration-200 animate-bounce"
        aria-label="Scroll to cams"
      >
        <ChevronDown className="w-6 h-6" />
      </a>

      {/* SpyderNetwork featured embed preview strip */}
      <div className="absolute bottom-0 inset-x-0 z-10 h-24 sm:h-32 overflow-hidden opacity-30 pointer-events-none">
        <div className="flex gap-2 h-full items-stretch px-2 animate-slide-up">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-spyder-navy-card rounded-t-lg border-t border-x border-white/10 overflow-hidden"
            >
              <div className="w-full h-full bg-gradient-to-b from-spyder-red/10 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl sm:text-3xl font-bold text-white">{value}</div>
           <p className="text-xs text-spyder-gray mt-1 uppercase tracking-widest">{label}</p>
    </div>
  );
}
