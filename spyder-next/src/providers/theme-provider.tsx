"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeMode = "light" | "after-dark";

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("spyder-after-dark") as ThemeMode | null;
    if (saved === "after-dark") setMode("after-dark");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("spyder-after-dark", mode);
    document.documentElement.classList.toggle("after-dark", mode === "after-dark");
  }, [mode, mounted]);

  const toggleMode = () => setMode((m) => (m === "after-dark" ? "light" : "after-dark"));

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
