"use client";

import { clsx } from "clsx";

/**
 * SpyderLoader — branded loading animation for live camera feeds.
 * ─────────────────────────────────────────────────────────────────────────────
 * Replaces the old red-dot / plain-spinner loaders. On brand with the redesigned
 * SpyderNetwork mark: a metallic spider-eye glows at the hub while a spider
 * crawls the rim spinning silk — the web strands draw themselves in on a loop.
 *
 * Fully self-contained: inline SVG + scoped keyframes (all prefixed `spl-` so
 * they never collide with globals). Every animation is transform / opacity /
 * filter only, so it composites on the GPU and stays at 60fps. Honors
 * prefers-reduced-motion. Decorative + pointer-events-none so it never blocks
 * taps or the video underneath.
 */

const LOADER_STYLES = `
/* Web strands draw in, hold, then fade — like silk being spun, on a loop. */
@keyframes spl-web-draw {
  0%   { stroke-dashoffset: 340; opacity: 0; }
  30%  { opacity: 0.85; }
  55%  { stroke-dashoffset: 0;   opacity: 0.85; }
  80%  { stroke-dashoffset: 0;   opacity: 0.85; }
  100% { stroke-dashoffset: 0;   opacity: 0; }
}
/* Spider crawls around the rim, spinning as it goes. */
@keyframes spl-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
/* Metallic eye breathes a red neon glow. */
@keyframes spl-eye {
  0%, 100% { filter: drop-shadow(0 0 2px rgba(255,26,26,0.55)) drop-shadow(0 0 6px rgba(204,0,0,0.35)); }
  50%      { filter: drop-shadow(0 0 5px rgba(255,26,26,0.95)) drop-shadow(0 0 16px rgba(204,0,0,0.60)); }
}
/* Subtle leg scuttle. */
@keyframes spl-legs { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(0.9); } }

.spl-web line, .spl-web polygon { stroke-dasharray: 340; animation: spl-web-draw 3.4s ease-in-out infinite; }
.spl-spider { transform-origin: 50px 50px; animation: spl-orbit 3.4s linear infinite; }
.spl-legs   { transform-origin: center; animation: spl-legs 0.5s ease-in-out infinite; }
.spl-eye    { transform-origin: 50px 50px; animation: spl-eye 1.9s ease-in-out infinite; will-change: filter; }

@media (prefers-reduced-motion: reduce) {
  .spl-web line, .spl-web polygon, .spl-spider, .spl-legs, .spl-eye { animation: none !important; }
  .spl-web line, .spl-web polygon { stroke-dashoffset: 0; opacity: 0.7; }
}
`;

const SPOKES = [0, 45, 90, 135, 180, 225, 270, 315];
const ring = (rad: number) =>
  SPOKES.map((d) => {
    const r = (d * Math.PI) / 180;
    return `${(50 + rad * Math.cos(r)).toFixed(1)},${(50 + rad * Math.sin(r)).toFixed(1)}`;
  }).join(" ");

interface SpyderLoaderProps {
  /** Rendered SVG size in px. Default 84. */
  size?: number;
  /** Optional caption below the mark, e.g. "Loading live feed…". */
  label?: string;
  className?: string;
}

export function SpyderLoader({ size = 84, label, className }: SpyderLoaderProps) {
  return (
    <div
      className={clsx(
        "pointer-events-none flex select-none flex-col items-center justify-center gap-2.5",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <style>{LOADER_STYLES}</style>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="splLens" cx="42%" cy="38%" r="65%">
            <stop offset="0%"   stopColor="#ff5a5a" />
            <stop offset="45%"  stopColor="#cc0000" />
            <stop offset="100%" stopColor="#3d0000" />
          </radialGradient>
          <linearGradient id="splRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#d7dde6" />
            <stop offset="50%"  stopColor="#7c8794" />
            <stop offset="100%" stopColor="#2b323c" />
          </linearGradient>
        </defs>

        {/* ── Web: radial spokes + concentric octagon rings, drawn on a loop ── */}
        <g className="spl-web" stroke="#cc0000" strokeWidth="0.7" fill="none" strokeLinecap="round">
          {SPOKES.map((deg) => {
            const r = (deg * Math.PI) / 180;
            return (
              <line key={deg} x1="50" y1="50" x2={(50 + 42 * Math.cos(r)).toFixed(1)} y2={(50 + 42 * Math.sin(r)).toFixed(1)} />
            );
          })}
          {[14, 24, 33, 42].map((rad) => (
            <polygon key={rad} points={ring(rad)} />
          ))}
        </g>

        {/* ── Spider crawling the rim, trailing a silk thread to the hub ── */}
        <g className="spl-spider">
          <g transform="translate(50 8)">
            {/* silk thread back to the web hub */}
            <line x1="0" y1="3.5" x2="0" y2="42" stroke="#cc0000" strokeWidth="0.4" opacity="0.3" />
            {/* legs */}
            <g className="spl-legs" stroke="#cc0000" strokeWidth="0.9" strokeLinecap="round" fill="none">
              <path d="M-1.6 0 L-6 -3 L-8.5 1" />
              <path d="M-1.6 1 L-6.5 1 L-9 4" />
              <path d="M-1.6 2 L-5.5 4 L-7.5 7.5" />
              <path d="M-1.6 3 L-4.5 6 L-6 10" />
              <path d="M1.6 0 L6 -3 L8.5 1" />
              <path d="M1.6 1 L6.5 1 L9 4" />
              <path d="M1.6 2 L5.5 4 L7.5 7.5" />
              <path d="M1.6 3 L4.5 6 L6 10" />
            </g>
            {/* body: abdomen + head, metallic with a red dorsal glint */}
            <ellipse cx="0" cy="2" rx="2.4" ry="3.2" fill="url(#splRing)" />
            <ellipse cx="0" cy="2" rx="1.1" ry="1.7" fill="#cc0000" opacity="0.7" />
            <circle cx="0" cy="-2" r="1.7" fill="#2b323c" />
          </g>
        </g>

        {/* ── Hub: the metallic SpyderNetwork spider-eye, breathing red glow ── */}
        <g className="spl-eye">
          <circle cx="50" cy="50" r="9"   fill="url(#splRing)" />
          <circle cx="50" cy="50" r="7"   fill="#0a0e1a" />
          <circle cx="50" cy="50" r="5.5" fill="url(#splLens)" />
          <circle cx="50" cy="50" r="2"   fill="#1a0303" />
          <circle cx="48.4" cy="48.4" r="1.2" fill="rgba(255,255,255,0.9)" />
        </g>
      </svg>

      {label && (
        <p className="text-[11px] font-medium tracking-wide text-white/80 [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
          {label}
        </p>
      )}
      <span className="sr-only">Loading live camera feed…</span>
    </div>
  );
}

export default SpyderLoader;
