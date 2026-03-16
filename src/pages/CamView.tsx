import { useParams, Link, Navigate } from "react-router-dom";
import { cameras } from "@/data/cameras";
import Header from "@/components/Header";
import CamCard from "@/components/CamCard";
import { ArrowLeft, ExternalLink } from "lucide-react";

const getParentDomain = () => {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }
  return "localhost";
};

const CamView = () => {
  const { camId } = useParams<{ camId: string }>();
  const parentDomain = getParentDomain();

  const camera = cameras.find((c) => c.id === camId);

  if (!camera) {
    return <Navigate to="/" replace />;
  }

  // Get related cameras from same location/category
  const relatedCams = cameras
    .filter((c) => c.id !== camera.id)
    .filter(
      (c) =>
        c.name.split(" ")[0] === camera.name.split(" ")[0] ||
        c.category === camera.category
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-6">
        {/* Back button */}
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to all cameras
        </Link>

        {/* Stream */}
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="aspect-video w-full">
            <iframe
              src={`https://player.twitch.tv/?channel=${camera.twitchChannel}&parent=${parentDomain}&muted=false&autoplay=true`}
              className="h-full w-full"
              allowFullScreen
              title={camera.name}
            />
          </div>
        </div>

        {/* Info bar */}
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1">
                <span className="live-pulse h-2 w-2 rounded-full bg-primary" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                  Live
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground md:text-2xl">
                {camera.name}
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {camera.location}
            </p>
            {camera.description && (
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                {camera.description}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            {camera.website && (
              <a
                href={camera.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <ExternalLink size={14} />
                Visit Website
              </a>
            )}
            <a
              href={`https://www.twitch.tv/${camera.twitchChannel}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open on Twitch
            </a>
          </div>
        </div>

        {/* Chat embed */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <iframe
            src={`https://www.twitch.tv/embed/${camera.twitchChannel}/chat?parent=${parentDomain}&darkpopout`}
            className="h-[400px] w-full"
            title={`${camera.name} Chat`}
          />
        </div>

        {/* Related Cameras */}
        {relatedCams.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Related Cameras
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCams.map((cam, i) => (
                <CamCard key={cam.id} camera={cam} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-border py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Spyder Network — Lake of the Ozarks' Largest Network of Live Cams
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CamView;
