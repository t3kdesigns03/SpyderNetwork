import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Tv2 } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About SpyderNetwork",
  description:
    "SpyderNetwork is the largest network of live webcams at Lake of the Ozarks, Missouri — 60+ free real-time streams from the lake's bars, marinas, pools, and docks.",
  path: "/about-us",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-14 sm:pt-16 px-4 sm:px-6 pb-16">
      <div className="max-w-2xl mx-auto">
        <div className="pt-8 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-spyder-gray hover:text-white transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
        </div>

        <div className="mb-8">
          {/* Branded SpyderNetwork logo with the same electric lightning sweep
              + red glow as the site header (replaces the old Wifi icon). */}
          <div className="mb-5">
            <div className="logo-lightning rounded-lg">
              <Image
                src="/images/SpyderNetworkLogo.png"
                alt="SpyderNetwork"
                width={631}
                height={200}
                priority
                className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_0_20px_rgba(204,0,0,0.35)]"
              />
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            About SpyderNetwork
          </h1>
          <p className="text-spyder-gray text-sm mt-1">Lake of the Ozarks Live Cams</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-spyder-gray leading-relaxed">
          <p className="text-white text-base">
            SpyderNetwork (often searched as "Spyder Network" or "Spider Network") provides
            live webcams from Lake of the Ozarks, including marinas, pools, waterfront bars,
            and popular lake destinations.
          </p>
          <p>
            Watch real-time activity from locations like Dog Days, Lazy Gators, Fish and Company,
            Backwater Jacks, and 60+ more — all in one place.
          </p>
          <p>
            SpyderNetwork was recently featured on{" "}
            <strong className="text-white">Ozark Law</strong>, the TV series.
          </p>
          <p>
            Our mission is simple: give lake lovers instant access to what&apos;s happening on the
            water right now — whether you&apos;re planning your day, watching from the dock, or
            checking conditions from home.
          </p>
        </div>

        <div className="mt-10">
          <Link href="/become-a-broadcaster" className="btn-primary text-sm">
            <Tv2 className="w-4 h-4" />
            Want to join? Become a Broadcaster
          </Link>
        </div>
      </div>
    </div>
  );
}
