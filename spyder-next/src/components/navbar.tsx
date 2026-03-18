"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Video, Map, Moon, Calendar, Heart, Sun } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/providers/theme-provider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Live Cams", icon: Video },
  { href: "/map", label: "Interactive Map", icon: Map },
  { href: "/nightlife", label: "Nightlife", icon: Moon },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/favorites", label: "My Favorites", icon: Heart },
];

export function Navbar() {
  const pathname = usePathname();
  const { mode, colorScheme, toggleMode, toggleColorScheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        mode === "after-dark" ? "glass-after-dark border-primary/20" : "glass border-border"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight">
            <span className="text-[#e11d48]">Spyder</span>
            <span className="text-[#111111] dark:text-white"> Network</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <div className="flex items-center gap-4 pl-4 border-l border-border">
            <button
              onClick={toggleColorScheme}
              className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              aria-label={colorScheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {colorScheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">After Dark</span>
              <Switch checked={mode === "after-dark"} onCheckedChange={toggleMode} />
            </div>
          </div>
        </nav>

        <button
          className="md:hidden p-3 min-w-[48px] min-h-[48px] -mr-2 flex items-center justify-center text-foreground touch-manipulation"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <div className="container flex flex-col gap-3 py-4">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium",
                    pathname === href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => { toggleColorScheme(); setMobileOpen(false); }}
                  className="flex items-center gap-2 text-sm text-muted-foreground py-2 min-h-[44px]"
                >
                  {colorScheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {colorScheme === "dark" ? "Light mode" : "Dark mode"}
                </button>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">After Dark</span>
                  <Switch checked={mode === "after-dark"} onCheckedChange={toggleMode} />
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
