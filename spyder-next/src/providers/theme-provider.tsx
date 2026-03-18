"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeMode = "light" | "after-dark";
type ColorScheme = "dark" | "light";

interface ThemeContextValue {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem("spyder-after-dark") as ThemeMode | null;
    const savedScheme = localStorage.getItem("spyder-color-scheme") as ColorScheme | null;
    if (savedMode === "after-dark") setMode("after-dark");
    if (savedScheme === "light") setColorScheme("light");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("spyder-after-dark", mode);
    document.documentElement.classList.toggle("after-dark", mode === "after-dark");
  }, [mode, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("spyder-color-scheme", colorScheme);
    document.documentElement.classList.toggle("light-theme", colorScheme === "light");
  }, [colorScheme, mounted]);

  const toggleMode = () => setMode((m) => (m === "after-dark" ? "light" : "after-dark"));
  const toggleColorScheme = () => setColorScheme((c) => (c === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ mode, colorScheme, toggleMode, setMode, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
