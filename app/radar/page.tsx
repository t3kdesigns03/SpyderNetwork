import Link from "next/link";
import { ArrowLeft, CloudRain } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lake Radar & Conditions",
  description:
    "Live weather radar and wind conditions for Lake of the Ozarks, Missouri. Check the forecast and lake conditions before you head out on the water.",
  path: "/radar",
});

export default function RadarPage() {
  return (
    <div className="min-h-screen pt-14 sm:pt-16 px-4 sm:px-6 pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="pt-8 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-spyder-gray hover:text-white transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-spyder-teal/20 rounded-xl flex items-center justify-center">
            <CloudRain className="w-5 h-5 text-spyder-teal" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Lake Radar
            </h1>
            <p className="text-spyder-gray text-sm">Live weather for Lake of the Ozarks</p>
          </div>
        </div>

        {/* Radar embed — NWS/Weather.gov */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-spyder-navy-card">
          <div className="aspect-video w-full min-h-[400px]">
            <iframe
              src="https://radar.weather.gov/ridge/standard/KSGF_loop.gif"
              className="w-full h-full border-0"
              title="Lake of the Ozarks Weather Radar"
              loading="lazy"
            />
          </div>
          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-spyder-gray">
              Radar data via NOAA/NWS. Station: KSGF (Springfield, MO). Updates every ~5 minutes.
            </p>
          </div>
        </div>

        {/* Secondary: Windy embed */}
        <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 bg-spyder-navy-card">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="font-semibold text-white text-sm">Wind &amp; Conditions Map (Windy)</h2>
          </div>
          <div className="aspect-video w-full min-h-[400px]">
            <iframe
              src="https://embed.windy.com/embed2.html?lat=38.18&lon=-92.63&detailLat=38.18&detailLon=-92.63&width=650&height=450&zoom=9&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=mph&metricTemp=%C2%B0F&radarRange=-1"
              className="w-full h-full border-0"
              title="Lake of the Ozarks Wind Map"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
