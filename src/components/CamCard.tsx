import { Camera } from "@/data/cameras";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface CamCardProps {
  camera: Camera;
  index: number;
}

const PREVIEW_URL = "id-preview--a02b6ca8-b5bb-40e1-b224-447fc589a8b7.lovable.app";

const CamCard = ({ camera, index }: CamCardProps) => {
  const thumbnailUrl = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${camera.twitchChannel}-440x248.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.2, 0, 0, 1] }}
    >
      <Link
        to={`/cam/${camera.id}`}
        className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:scale-[1.02]"
      >
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden bg-secondary">
          <img
            src={thumbnailUrl}
            alt={camera.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.classList.add("flex", "items-center", "justify-center");
              const placeholder = document.createElement("div");
              placeholder.className = "text-muted-foreground text-sm font-mono";
              placeholder.textContent = "OFFLINE";
              target.parentElement!.appendChild(placeholder);
            }}
          />

          {/* Gradient overlay */}
          <div className="gradient-overlay absolute inset-0" />

          {/* Live badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 backdrop-blur-sm">
            <span className="live-pulse h-2 w-2 rounded-full bg-primary" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
              Live
            </span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              {camera.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {camera.location}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CamCard;
