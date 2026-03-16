import { Camera } from "@/data/cameras";
import { Link } from "react-router-dom";

interface FeaturedStreamProps {
  camera: Camera;
  parentDomain: string;
}

const FeaturedStream = ({ camera, parentDomain }: FeaturedStreamProps) => {
  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1">
            <span className="live-pulse h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
              Featured Live
            </span>
          </div>
          <h2 className="text-lg font-semibold text-foreground md:text-xl">
            {camera.name}
          </h2>
        </div>

        <Link
          to={`/cam/${camera.id}`}
          className="group relative block overflow-hidden rounded-2xl border border-border transition-all hover:border-primary/50"
        >
          <div className="aspect-video w-full">
            <iframe
              src={`https://player.twitch.tv/?channel=${camera.twitchChannel}&parent=${parentDomain}&muted=true&autoplay=true`}
              className="h-full w-full"
              allowFullScreen
              title={camera.name}
            />
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm p-4 flex items-center justify-between border-t border-border">
            <div>
              <h3 className="font-semibold text-foreground">{camera.name}</h3>
              <p className="text-sm text-muted-foreground">{camera.location}</p>
            </div>
            {camera.description && (
              <p className="hidden text-sm text-muted-foreground max-w-md md:block">
                {camera.description}
              </p>
            )}
          </div>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedStream;
