import Link from "next/link";
import { ArrowLeft, Film, ExternalLink } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Saved Videos",
  description:
    "Watch saved highlight videos from SpyderNetwork's Lake of the Ozarks live cams — sunsets, storms, and the best moments on the lake.",
  path: "/video-collection",
});

// Placeholder video collection — link to original
const SAVED_VIDEOS = [
  {
    title: "Lake of the Ozarks Highlights",
    url: "https://www.spydernetwork.com/video-collection/",
    thumb: null,
  },
];

export default function VideoCollectionPage() {
  return (
    <div className="min-h-screen pt-14 sm:pt-16 px-4 sm:px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="pt-8 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-spyder-gray hover:text-white transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-spyder-red/20 rounded-xl flex items-center justify-center">
            <Film className="w-5 h-5 text-spyder-red" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Saved Videos
            </h1>
            <p className="text-spyder-gray text-sm">Lake of the Ozarks highlights &amp; clips</p>
          </div>
        </div>

        <div className="glass-panel p-6 text-center">
          <Film className="w-12 h-12 text-spyder-gray mx-auto mb-3" />
          <h2 className="font-semibold text-white mb-2">Video archive coming soon</h2>
          <p className="text-spyder-gray text-sm mb-4">
            We&apos;re building out the video library. In the meantime, check the original collection.
          </p>
          <a
            href="https://www.spydernetwork.com/video-collection/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm inline-flex"
          >
            <ExternalLink className="w-4 h-4" />
            View on SpyderNetwork.com
          </a>
        </div>
      </div>
    </div>
  );
}
