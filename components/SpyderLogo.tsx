"use client";

import { clsx } from "clsx";

interface SpyderLogoProps {
  size?: number;
  wordmark?: boolean;
  className?: string;
}

export function SpyderLogo({ size = 36, wordmark = true, className }: SpyderLogoProps) {
  return (
    <div className={clsx("flex items-center gap-2.5 select-none", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Red glow filter */}
          <filter id="red-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#cc0000" floodOpacity="0.8" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Intense glow for body */}
          <filter id="body-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor="#ff1a1a" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Scan line gradient — sweeps across the lens */}
          <linearGradient id="scan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="white" stopOpacity="0" />
            <stop offset="45%"  stopColor="white" stopOpacity="0" />
            <stop offset="50%"  stopColor="white" stopOpacity="0.55" />
            <stop offset="55%"  stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Web background radial */}
          <radialGradient id="web-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#cc0000" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#cc0000" stopOpacity="0" />
          </radialGradient>

          <clipPath id="body-clip">
            <circle cx="40" cy="40" r="12" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes glow-pulse {
            0%, 100% { opacity: 0.7; }
            50%       { opacity: 1; }
          }
          @keyframes body-breathe {
            0%, 100% { transform: scale(1); }
            50%       { transform: scale(1.06); }
          }
          @keyframes leg-l {
            0%,  80%, 100% { transform: rotate(0deg); }
            84% { transform: rotate(-8deg); }
            88% { transform: rotate(5deg); }
            93% { transform: rotate(-3deg); }
            97% { transform: rotate(1deg); }
          }
          @keyframes leg-r {
            0%,  75%, 100% { transform: rotate(0deg); }
            79% { transform: rotate(8deg); }
            83% { transform: rotate(-5deg); }
            88% { transform: rotate(3deg); }
            93% { transform: rotate(-1deg); }
          }
          @keyframes scan-sweep {
            0%   { transform: rotate(-180deg); }
            100% { transform: rotate(180deg); }
          }
          @keyframes iris-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes eye-blink {
            0%, 90%, 100% { transform: scaleY(1); }
            93%           { transform: scaleY(0.08); }
          }
          @keyframes web-pulse {
            0%, 100% { opacity: 0.18; }
            50%       { opacity: 0.35; }
          }
          @keyframes fang-twitch {
            0%, 88%, 100% { transform: rotate(0deg); }
            91% { transform: rotate(-12deg); }
            95% { transform: rotate(6deg); }
          }

          .legs-left  { transform-origin: 40px 40px; animation: leg-l 5.5s ease-in-out infinite; }
          .legs-right { transform-origin: 40px 40px; animation: leg-r 5.5s ease-in-out infinite 0.4s; }
          .body-wrap  { transform-origin: 40px 40px; animation: body-breathe 2.8s ease-in-out infinite; filter: url(#body-glow); }
          .eye-pupil  { transform-origin: 40px 40px; animation: eye-blink 7s ease-in-out infinite 1.5s; }
          .scan-line  { transform-origin: 40px 40px; animation: scan-sweep 3s linear infinite; }
          .iris-ring  { transform-origin: 40px 40px; animation: iris-spin 8s linear infinite; }
          .web-lines  { animation: web-pulse 3s ease-in-out infinite; }
          .fang-left  { transform-origin: 37px 28px; animation: fang-twitch 6s ease-in-out infinite 0.8s; }
          .fang-right { transform-origin: 43px 28px; animation: fang-twitch 6s ease-in-out infinite 1.2s; }
        `}</style>

        {/* ── Web threads (background halo) ── */}
        <g className="web-lines" filter="url(#red-glow)">
          <circle cx="40" cy="40" r="38" stroke="#cc0000" strokeWidth="0.4" strokeDasharray="2 6" fill="none"/>
          <circle cx="40" cy="40" r="30" stroke="#cc0000" strokeWidth="0.3" strokeDasharray="1.5 8" fill="none"/>
          {/* Radial web spokes */}
          {[0,45,90,135,180,225,270,315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x2 = 40 + 38 * Math.cos(rad);
            const y2 = 40 + 38 * Math.sin(rad);
            return (
              <line
                key={i}
                x1="40" y1="40"
                x2={x2} y2={y2}
                stroke="#cc0000"
                strokeWidth="0.3"
                strokeOpacity="0.4"
              />
            );
          })}
        </g>

        {/* ── Left legs ── */}
        <g className="legs-left" filter="url(#red-glow)">
          <path d="M29 33 Q18 22 7 15"   stroke="#cc0000" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M27 40 Q13 37 3 41"   stroke="#cc0000" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M29 47 Q18 57 7 64"   stroke="#cc0000" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M33 53 Q26 66 19 76"  stroke="#cc0000" strokeWidth="2.8" strokeLinecap="round"/>
        </g>

        {/* ── Right legs ── */}
        <g className="legs-right" filter="url(#red-glow)">
          <path d="M51 33 Q62 22 73 15"  stroke="#cc0000" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M53 40 Q67 37 77 41"  stroke="#cc0000" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M51 47 Q62 57 73 64"  stroke="#cc0000" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M47 53 Q54 66 61 76"  stroke="#cc0000" strokeWidth="2.8" strokeLinecap="round"/>
        </g>

        {/* ── Pedipalps / fangs ── */}
        <g className="fang-left" filter="url(#red-glow)">
          <path d="M35 26 Q30 15 26 8" stroke="#cc0000" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
        <g className="fang-right" filter="url(#red-glow)">
          <path d="M45 26 Q50 15 54 8" stroke="#cc0000" strokeWidth="2.5" strokeLinecap="round"/>
        </g>

        {/* ── Body ── */}
        <g className="body-wrap">
          {/* Outer shell */}
          <circle cx="40" cy="40" r="17" fill="#cc0000"/>
          {/* Inner dark lens chamber */}
          <circle cx="40" cy="40" r="12.5" fill="#0a0e1a"/>
          {/* Spinning iris */}
          <circle
            cx="40" cy="40" r="9.5"
            fill="none"
            stroke="#cc0000"
            strokeWidth="1.8"
            strokeDasharray="5 3.5"
            strokeLinecap="round"
            className="iris-ring"
          />
          {/* Scan sweep highlight inside lens */}
          <g clipPath="url(#body-clip)" className="scan-line">
            <rect x="28" y="28" width="24" height="24" fill="url(#scan-grad)" />
          </g>
          {/* Pupil */}
          <circle cx="40" cy="40" r="5.5" fill="#cc0000" />
          {/* Catchlight */}
          <g className="eye-pupil">
            <circle cx="40" cy="40" r="2.8" fill="white"/>
            <circle cx="38.5" cy="38.5" r="1" fill="rgba(255,255,255,0.8)"/>
          </g>
        </g>
      </svg>

      {/* ── Wordmark ── */}
      {wordmark && (
        <div className="flex flex-col leading-none">
          <span
            className="font-display font-bold text-white tracking-widest uppercase"
            style={{ fontSize: size * 0.38, textShadow: "0 0 12px rgba(204,0,0,0.5)" }}
          >
            Spyder
          </span>
          <span
            className="font-display font-semibold text-spyder-red tracking-[0.22em] uppercase"
            style={{ fontSize: size * 0.22 }}
          >
            network
          </span>
        </div>
      )}
    </div>
  );
}
