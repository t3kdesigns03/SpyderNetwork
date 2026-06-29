import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        spyder: {
          // ── Core brand (logo & primary) ──────────────────
          black:       "#000000",
          navy:        "#0a0e1a",
          "navy-light":"#111827",
          "navy-card": "#0d1526",
          red:         "#cc0000",
          "red-bright":"#ff1a1a",
          "red-dark":  "#990000",
          // ── Accent palette ───────────────────────────────
          cyan:        "#00d4ff",   // electric lake water
          "cyan-dim":  "#0099cc",
          purple:      "#a855f7",   // spider-eye secondary
          "purple-dim":"#7c3aed",
          gold:        "#f5a623",   // sunset dock
          "gold-light":"#fbbf24",
          // ── Neutrals ────────────────────────────────────
          white:       "#ffffff",
          gray:        "#9ca3af",
          "gray-dark": "#374151",
          "gray-light":"#d1d5db",
        },
      },
      fontFamily: {
        sans:    ["Inter",  "system-ui", "sans-serif"],
        display: ["Oswald", "Impact",    "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(10,14,26,0.95) 100%)",
        "card-gradient": "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.9) 100%)",
        "red-glow":      "radial-gradient(ellipse at center, rgba(204,0,0,0.3) 0%, transparent 70%)",
        "cyan-glow":     "radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)",
      },
      animation: {
        "pulse-live":  "pulse-live 2s ease-in-out infinite",
        "slide-up":    "slide-up 0.3s ease-out",
        "fade-in":     "fade-in 0.4s ease-out",
        "boat-sail":   "boat-sail 20s linear infinite",
        "web-breathe": "web-breathe 6s ease-in-out infinite",
        "neon-flicker":"neon-flicker 4s ease-in-out infinite",
        "eye-glow":    "eye-glow 2.5s ease-in-out infinite",
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1",   transform: "scale(1)" },
          "50%":       { opacity: "0.7", transform: "scale(0.95)" },
        },
        "slide-up": {
          "0%":   { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "boat-sail": {
          "0%":   { transform: "translateX(-100px)" },
          "100%": { transform: "translateX(calc(100vw + 100px))" },
        },
        "web-breathe": {
          "0%, 100%": { opacity: "0.04" },
          "50%":       { opacity: "0.08" },
        },
        "neon-flicker": {
          "0%, 90%, 100%": { opacity: "1" },
          "92%":            { opacity: "0.6" },
          "94%":            { opacity: "1" },
          "96%":            { opacity: "0.7" },
        },
        "eye-glow": {
          "0%, 100%": { boxShadow: "0 0 6px rgba(0,212,255,0.6),  0 0 12px rgba(0,212,255,0.3)" },
          "50%":       { boxShadow: "0 0 10px rgba(0,212,255,0.9), 0 0 24px rgba(0,212,255,0.5)" },
        },
      },
      boxShadow: {
        "red-glow":   "0 0 20px rgba(204,0,0,0.4)",
        "cyan-glow":  "0 0 16px rgba(0,212,255,0.5), 0 0 32px rgba(0,212,255,0.2)",
        "cyan-sm":    "0 0 8px  rgba(0,212,255,0.4)",
        "purple-glow":"0 0 16px rgba(168,85,247,0.5), 0 0 32px rgba(168,85,247,0.2)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.6)",
        "live":        "0 0 8px rgba(255,26,26,0.8)",
        "glass":       "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
