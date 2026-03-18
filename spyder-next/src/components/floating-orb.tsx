"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Moon, Zap, Heart, X } from "lucide-react";
import { usePip } from "@/providers/pip-provider";
import { useFavorites } from "@/providers/favorites-provider";
import { useTheme } from "@/providers/theme-provider";
import { useRouter } from "next/navigation";
import { cameras } from "@/data/cameras";
import { cn } from "@/lib/utils";

const springBounce = { type: "spring" as const, stiffness: 400, damping: 15 };
const springSmooth = { type: "spring" as const, stiffness: 300, damping: 25 };

export function FloatingOrb() {
  const [expanded, setExpanded] = useState(false);
  const { pinCamera } = usePip();
  const { favorites } = useFavorites();
  const { mode, toggleMode } = useTheme();
  const router = useRouter();
  const isAfterDark = mode === "after-dark";

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
    }
    router.push("/favorites");
    setExpanded(false);
  };

  const actions = [
    { icon: Shuffle, label: "Random Cam", onClick: randomCam },
    { icon: Moon, label: "Nightlife Mode", onClick: nightlifeMode },
    { icon: Zap, label: "Happening Now", onClick: happeningNow },
    { icon: Heart, label: "My Favorites", onClick: myFavorites },
  ];

  return (
    <div className="fixed bottom-6 right-4 md:right-6 z-50 flex flex-col items-end gap-3 pb-safe-orb">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={springSmooth}
            className={cn(
              "flex flex-col gap-1 p-2 rounded-xl min-w-[200px] border-2",
              isAfterDark
                ? "glass-after-dark border-primary/40 shadow-[0_0_25px_rgba(255,23,68,0.25)]"
                : "glass border-border bg-[#111]/95"
            )}
          >
            {actions.map(({ icon: Icon, label, onClick }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, ...springSmooth }}
                onClick={onClick}
                className={cn(
                  "flex items-center gap-2 w-full px-4 py-3 min-h-[48px] rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation",
                  "hover:bg-[#ff1744]/20 hover:text-[#ff1744]",
                  "focus:outline-none focus:ring-2 focus:ring-[#ff1744]/50 focus:ring-offset-2 focus:ring-offset-[#111]",
                  "hover:shadow-[0_0_12px_rgba(255,23,68,0.4)]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orb - bouncy spring physics, neon red glow, black base */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center min-w-[48px] min-h-[48px]",
          "border-2 border-[#111]",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0a1428]",
          "touch-manipulation select-none",
          "active:scale-95"
        )}
        style={{
          background: "linear-gradient(145deg, #1a1a1a 0%, #111 100%)",
          boxShadow: isAfterDark
            ? "0 0 25px #ff1744, 0 0 50px rgba(255,23,68,0.4), inset 0 0 15px rgba(255,23,68,0.15)"
            : "0 0 20px #ff1744, 0 0 40px rgba(255,23,68,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
        whileHover={{
          scale: 1.08,
          boxShadow: isAfterDark
            ? "0 0 35px #ff1744, 0 0 70px rgba(255,23,68,0.5)"
            : "0 0 30px #ff1744, 0 0 60px rgba(255,23,68,0.4)",
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: isAfterDark ? [0, -8, 0] : [0, -4, 0],
        }}
        transition={{
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          ...springBounce,
        }}
        aria-label={expanded ? "Close orb" : "Open floating control orb"}
      >
        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(255,23,68,0.4), transparent 70%)",
          }}
        />
        {/* After Dark: neon red firefly particles around orb */}
        {isAfterDark && (
          <>
            {[...Array(6)].map((_, i) => {
              const angle = (i * 2 * Math.PI) / 6;
              const r = 22;
              const dx = r * Math.cos(angle);
              const dy = r * Math.sin(angle);
              return (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                  style={{
                    left: `calc(50% + ${dx}px)`,
                    top: `calc(50% + ${dy}px)`,
                    transform: "translate(-50%, -50%)",
                    background: "#ff1744",
                    boxShadow: "0 0 8px #ff1744, 0 0 16px rgba(255,23,68,0.6)",
                  }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </>
        )}
        {expanded ? (
          <X className="h-6 w-6 sm:h-7 sm:w-7 text-[#ff1744] relative z-10" />
        ) : (
          <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-[#ff1744] relative z-10" />
        )}
      </motion.button>
    </div>
  );
}
