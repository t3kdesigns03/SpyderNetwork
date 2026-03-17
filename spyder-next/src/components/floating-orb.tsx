"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Moon, Zap, Heart, X } from "lucide-react";
import { usePip } from "@/providers/pip-provider";
import { useFavorites } from "@/providers/favorites-provider";
import { useTheme } from "@/providers/theme-provider";
import { useRouter } from "next/navigation";
import { cameras } from "@/data/cameras";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FloatingOrb() {
  const [expanded, setExpanded] = useState(false);
  const { pinCamera } = usePip();
  const { favorites, toggleFavorite } = useFavorites();
  const { mode, toggleMode } = useTheme();
  const router = useRouter();

  const randomCam = () => {
    const cam = cameras[Math.floor(Math.random() * cameras.length)];
    pinCamera(cam);
    setExpanded(false);
  };

  const nightlifeMode = () => {
    toggleMode();
    setExpanded(false);
  };

  const happeningNow = () => {
    const packed = cameras.filter((c) => c.crowdLevel === "Packed" || c.crowdLevel === "High");
    if (packed.length) {
      pinCamera(packed[Math.floor(Math.random() * packed.length)]);
    }
    setExpanded(false);
  };

  const myFavorites = () => {
    if (favorites.length) {
      const favCam = cameras.find((c) => c.id === favorites[0]);
      if (favCam) pinCamera(favCam);
      router.push("/favorites");
    } else {
      router.push("/favorites");
    }
    setExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 flex flex-col gap-2 p-2 rounded-xl glass border border-border min-w-[180px]"
          >
            <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={randomCam}>
              <Shuffle className="h-4 w-4" />
              Random Cam
            </Button>
            <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={nightlifeMode}>
              <Moon className="h-4 w-4" />
              Nightlife Mode
            </Button>
            <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={happeningNow}>
              <Zap className="h-4 w-4" />
              Happening Now
            </Button>
            <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={myFavorites}>
              <Heart className="h-4 w-4" />
              My Favorites
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 transition-colors",
          mode === "after-dark"
            ? "bg-primary/20 border-primary text-primary hover:bg-primary/30 animate-neon-glow"
            : "bg-primary border-primary/50 text-primary-foreground hover:bg-primary/90"
        )}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Floating Control Orb"
      >
        {expanded ? <X className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
