"use client";

import { cn } from "@/lib/utils";

/** Minimal neon red spider SVG for Spyder branding. #ff1744 glow + black outline. */
export function SpiderIcon({
  className,
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {/* Body - oval */}
      <ellipse
        cx="12"
        cy="14"
        rx="4"
        ry="5"
        fill="#ff1744"
        stroke="#111"
        strokeWidth="0.8"
        style={{
          filter: "drop-shadow(0 0 4px #ff1744) drop-shadow(0 0 8px rgba(255,23,68,0.6))",
        }}
      />
      {/* Head */}
      <circle
        cx="12"
        cy="9"
        r="2.5"
        fill="#ff1744"
        stroke="#111"
        strokeWidth="0.6"
        style={{
          filter: "drop-shadow(0 0 3px #ff1744)",
        }}
      />
      {/* Legs - 8 simple lines */}
      {[
        [8, 11, 4, 4],
        [8, 13, 3, 14],
        [8, 15, 4, 20],
        [8, 17, 6, 22],
        [16, 11, 20, 4],
        [16, 13, 21, 14],
        [16, 15, 20, 20],
        [16, 17, 18, 22],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#ff1744"
          strokeWidth="0.5"
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 2px #ff1744)",
          }}
        />
      ))}
    </svg>
  );
}
