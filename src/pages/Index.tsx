import { useState, useMemo } from "react";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import CamGrid from "@/components/CamGrid";
import FeaturedStream from "@/components/FeaturedStream";
import { cameras, CameraCategory } from "@/data/cameras";

const getParentDomain = () => {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }
  return "localhost";
};

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<CameraCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const parentDomain = getParentDomain();

  // Featured cam — Backwater Jack's Stage (popular one)
  const featuredCam = cameras.find((c) => c.id === "backwater-jacks-stage")!;

  const filteredCameras = useMemo(() => {
    return cameras
      .filter((cam) => cam.id !== featuredCam.id)
      .filter((cam) => activeCategory === "All" || cam.category === activeCategory)
      .filter(
        (cam) =>
          !searchQuery ||
          cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cam.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container py-12 md:py-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-4">
              <img
                src="/spyder-logo.png"
                alt="Spyder Network"
                className="h-20 w-auto object-contain drop-shadow-lg"
              />
              <h1 className="text-4xl font-bold tracking-tighter text-foreground md:text-6xl text-balance">
                <span className="text-primary">Live.</span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground md:text-xl">
              The largest network of live cameras at the Lake of the Ozarks. Real-time views 24/7.
            </p>

            {/* Search */}
            <div className="mt-8 max-w-md">
              <input
                type="text"
                placeholder="Search cameras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stream */}
      <FeaturedStream camera={featuredCam} parentDomain={parentDomain} />

      {/* Filter + Grid */}
      <FilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <section className="py-8 md:py-12">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground md:text-2xl">
              All Cameras
              <span className="ml-2 font-mono text-sm text-muted-foreground">
                ({filteredCameras.length})
              </span>
            </h2>
          </div>
          <CamGrid cameras={filteredCameras} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Spyder Network — Lake of the Ozarks' Largest Network of Live Cams
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
    </div>
  );
};

export default Index;
