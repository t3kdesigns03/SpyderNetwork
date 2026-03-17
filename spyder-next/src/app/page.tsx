import { Suspense } from "react";
import { HeroSection } from "@/components/hero-section";
import { CamGrid } from "@/components/cam-grid";
import { FilterBar } from "@/components/filter-bar";
import { cameras } from "@/data/cameras";

const featuredCam = cameras.find((c) => c.id === "backwater-jacks-stage")!;

export default function HomePage() {
  return (
    <>
      <HeroSection featuredCam={featuredCam} />
      <Suspense fallback={<div className="h-14 border-b border-border" />}>
        <FilterBar />
      </Suspense>
      <Suspense fallback={<div className="container py-12 animate-pulse">Loading cameras...</div>}>
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                All Cameras
                <span className="ml-2 font-mono text-sm text-muted-foreground">({cameras.length})</span>
              </h2>
            </div>
            <CamGrid cameras={cameras.filter((c) => c.id !== featuredCam.id)} />
          </div>
        </section>
      </Suspense>
      <footer className="border-t border-border py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Spyder Network — Lake of the Ozarks&apos; Largest Network of Live Cams
          </p>
          <div className="mt-3 flex justify-center gap-4">
            <a
              href="https://www.facebook.com/SpyderNetwork-1444576605779205/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com/spyder_network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://www.instagram.com/spyder_network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
