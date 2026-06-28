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
        // SpyderNetwork brand palette (pulled from site: dark navy/black bg, red accent, white text)
        spyder: {
          black: "#000000",
          navy: "#0a0e1a",
          "navy-light": "#111827",
          "navy-card": "#0d1526",
          red: "#cc0000",
          "red-bright": "#ff1a1a",
          "red-dark": "#990000",
          gold: "#f5a623",
          "gold-light": "#fbbf24",
          white: "#ffffff",
          gray: "#9ca3af",
          "gray-dark": "#374151",
          "gray-light": "#d1d5db",
          teal: "#0ea5e9",    // water/lake accent
          "teal-dark": "#0284c7",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Oswald", "Impact", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(10,14,26,0.95) 100%)",
        "card-gradient": "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.9) 100%)",
        "red-glow": "radial-gradient(ellipse at center, rgba(204,0,0,0.3) 0%, transparent 70%)",
      },
      animation: {
        "pulse-live": "pulse-live 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "boat-sail": "boat-sail 20s linear infinite",
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(0.95)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "boat-sail": {
          "0%": { transform: "translateX(-100px)" },
          "100%": { transform: "translateX(calc(100vw + 100px))" },
        },
      },
      boxShadow: {
        "red-glow": "0 0 20px rgba(204,0,0,0.4)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.6)",
        "live": "0 0 8px rgba(255,26,26,0.8)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
