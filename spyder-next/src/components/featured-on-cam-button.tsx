"use client";

import { Video } from "lucide-react";
import { toast } from "sonner";
import { usePip } from "@/providers/pip-provider";
import { cameras } from "@/data/cameras";

interface FeaturedOnCamButtonProps {
  camId: string;
  className?: string;
}

export function FeaturedOnCamButton({ camId, className = "" }: FeaturedOnCamButtonProps) {
  const { pinCamera } = usePip();
  const cam = cameras.find((c) => c.id === camId);
  if (!cam) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    pinCamera(cam);
    toast.success("Cam pinned", {
      description: `${cam.name} is now playing in the PiP player.`,
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-sm text-[#ff1744] hover:text-[#ff1744]/80 hover:underline font-medium transition-colors ${className}`}
    >
      <Video className="h-4 w-4" />
      Featured on Cam
    </button>
  );
}
