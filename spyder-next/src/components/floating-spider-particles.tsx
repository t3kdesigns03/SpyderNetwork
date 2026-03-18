"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { SpiderIcon } from "@/components/spider-icon";

const SPIDER_COUNT = 10;
const SPRING = { type: "spring" as const, stiffness: 80, damping: 20 };

function useSpiderPositions() {
  return useMemo(() => {
    const positions: { x: number; y: number; dx: number; dy: number; size: number; duration: number }[] = [];
    for (let i = 0; i < SPIDER_COUNT; i++) {
      positions.push({
        x: 0,
        y: 0,
        dx: (Math.random() - 0.5) * 120,
        dy: (Math.random() - 0.5) * 100,
        size: 12 + Math.random() * 6,
        duration: 5 + Math.random() * 5,
      });
    }
    return positions;
  }, []);
}

export function FloatingSpiderParticles() {
  const spiders = useSpiderPositions();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      {spiders.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${5 + (i * 9) % 85}%`,
            top: `${8 + (i * 13) % 78}%`,
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [0, s.dx, -s.dx * 0.5, s.dx * 0.3, 0],
            y: [0, s.dy, -s.dy * 0.5, s.dy * 0.3, 0],
            opacity: [0.4, 0.9, 0.5, 0.8, 0.4],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.3,
            ...SPRING,
          }}
        >
          <SpiderIcon size={s.size} />
        </motion.div>
      ))}
    </div>
  );
}
