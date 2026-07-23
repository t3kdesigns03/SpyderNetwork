"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tv2, Menu, X, Info, Phone } from "lucide-react";
import Image from "next/image";
import { clsx } from "clsx";
import { CAMS } from "@/lib/cams";

const LIVE_COUNT = CAMS.filter((c) => c.isLive).length;

const NAV_ITEMS = [
  { href: "/about-us",             label: "About",               Icon: Info  },
  { href: "/become-a-broadcaster", label: "Become a Broadcaster", Icon: Tv2   },
  { href: "/contact",              label: "Contact",             Icon: Phone },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/*
        Header bar
        ─ Black base with a cyan neon underline glow so it "floats" above content.
        ─ Logo stays brand-red/black; everything else can use accent colors.
      */}
      <header
        className="fixed top-0 inset-x-0 z-50 h-14 flex items-center px-4 sm:px-6"
        style={{
          background: "linear-gradient(180deg, #000000 0%, rgba(10,14,26,0.97) 100%)",
          borderBottom: "1px solid rgba(0,212,255,0.18)",
          boxShadow: "0 1px 0 rgba(0,212,255,0.08), 0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Logo ── */}
        <Link href="/" className="shrink-0 mr-6 group" onClick={() => setOpen(false)}>
          {/* logo-lightning: white streak sweeps across every ~4 s */}
          <div className="logo-lightning rounded overflow-hidden">
            <Image
              src="/images/SpyderNetworkLogo.png"
              alt="SpyderNetwork"
              width={631}
              height={200}
              priority
              className="h-9 w-auto object-contain block"
            />
          </div>
        </Link>

        {/* ── Live cam count badge ── */}
        <div
          className="live-badge text-xs mr-auto"
          style={{ boxShadow: "0 0 10px rgba(204,0,0,0.5), 0 0 24px rgba(204,0,0,0.2)" }}
        >
          <span className="live-dot" />
          {LIVE_COUNT} LIVE
        </div>

        {/* ── Center tagline (desktop) ──────────────────────────────────────
            Sits between the LIVE cam-count and the nav. Absolutely centered so
            it stays perfectly balanced regardless of the flex items on either
            side, and pointer-events-none so it never intercepts nav clicks.
            Shown on lg+ where there's room; on smaller screens the same tagline
            appears as a banner strip beneath the header (see CamStation). */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[42%] justify-center pointer-events-none select-none">
          <span className="spyder-tagline whitespace-nowrap text-[13px] xl:text-sm leading-none">
            Lake of The Ozarks <span className="opacity-50 font-normal">-</span> Largest Network of <span className="hl">LIVE</span> Cameras
          </span>
        </div>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "relative px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200",
                "text-spyder-gray hover:text-white",
                // Subtle cyan glow on hover via group/pseudo trick
                "hover:bg-[rgba(0,212,255,0.06)] hover:shadow-[0_0_8px_rgba(0,212,255,0.15)]"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={clsx(
            "md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all ml-3",
            open
              ? "bg-[rgba(0,212,255,0.12)] shadow-[0_0_8px_rgba(0,212,255,0.3)]"
              : "bg-white/10 hover:bg-white/20"
          )}
          style={open ? { border: "1px solid rgba(0,212,255,0.3)" } : { border: "1px solid transparent" }}
          aria-label="Menu"
        >
          {open
            ? <X    className="w-4 h-4 text-spyder-cyan" />
            : <Menu className="w-4 h-4 text-white" />
          }
        </button>
      </header>

      {/* ── Mobile slide-in menu ── */}
      <div className={clsx(
        "fixed inset-0 z-40 md:hidden transition-all duration-300",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}>
        {/* Backdrop */}
        <div
          className={clsx("absolute inset-0 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <div className={clsx(
          "absolute top-14 right-0 bottom-0 w-64 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
          style={{
            background: "linear-gradient(180deg, #050810 0%, #0a0e1a 100%)",
            borderLeft: "1px solid rgba(0,212,255,0.15)",
            boxShadow: "-4px 0 32px rgba(0,0,0,0.7), -1px 0 0 rgba(0,212,255,0.06)",
          }}
        >
          {/* Subtle web bg inside drawer */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden rounded-none">
            <svg width="100%" height="100%" viewBox="0 0 256 600" preserveAspectRatio="xMidYMid slice">
              <g stroke="#00d4ff" strokeWidth="0.5" fill="none">
                {[40,80,120,160,200].map(r => <circle key={r} cx="128" cy="120" r={r}/>)}
                {[0,45,90,135,180,225,270,315].map(deg => {
                  const rad = deg * Math.PI / 180;
                  return <line key={deg} x1="128" y1="120" x2={128+220*Math.cos(rad)} y2={120+220*Math.sin(rad)}/>;
                })}
              </g>
            </svg>
          </div>

          <nav className="relative flex flex-col p-3 gap-1">
            {NAV_ITEMS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl text-spyder-gray",
                  "hover:text-white transition-all min-h-[52px] text-sm font-medium",
                  "hover:bg-[rgba(0,212,255,0.06)] hover:border-[rgba(0,212,255,0.2)]",
                  "border border-transparent"
                )}
              >
                <Icon className="w-4 h-4 text-spyder-cyan opacity-70" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Bottom accent line */}
          <div className="mt-auto mx-4 mb-8">
            <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)" }} />
            <p className="text-center text-[10px] text-spyder-gray/40 mt-3 tracking-widest uppercase">
              Lake of the Ozarks
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
