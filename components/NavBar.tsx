"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tv2, Menu, X, Info, Phone, Film } from "lucide-react";
import Image from "next/image";
import { clsx } from "clsx";
import { CAMS } from "@/lib/cams";

const LIVE_COUNT = CAMS.filter((c) => c.isLive).length;

const NAV_ITEMS = [
  { href: "/about-us", label: "About", Icon: Info },
  { href: "/video-collection", label: "Saved Videos", Icon: Film },
  { href: "/become-a-broadcaster", label: "Become a Broadcaster", Icon: Tv2 },
  { href: "/contact", label: "Contact", Icon: Phone },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 h-14 bg-spyder-black border-b border-white/10 flex items-center px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="shrink-0 mr-6" onClick={() => setOpen(false)}>
          <Image
            src="/images/SpyderLogo.png"
            alt="SpyderNetwork"
            width={160}
            height={44}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Live badge */}
        <div className="live-badge text-xs mr-auto">
          <span className="live-dot" />
          {LIVE_COUNT} LIVE
        </div>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 text-xs font-medium text-spyder-gray hover:text-white rounded-lg hover:bg-white/10 transition-all"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors ml-3"
          aria-label="Menu"
        >
          {open ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
        </button>
      </header>

      {/* Mobile menu */}
      <div className={clsx(
        "fixed inset-0 z-40 md:hidden transition-all duration-300",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}>
        <div
          className={clsx("absolute inset-0 bg-black/70 transition-opacity", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <div className={clsx(
          "absolute top-14 right-0 bottom-0 w-64 bg-spyder-black border-l border-white/10 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}>
          <nav className="flex flex-col p-3 gap-1">
            {NAV_ITEMS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-spyder-gray hover:text-white hover:bg-white/10 transition-all min-h-[52px] text-sm font-medium"
              >
                <Icon className="w-4 h-4 text-spyder-red" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
