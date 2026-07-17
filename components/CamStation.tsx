"use client";

import { useState, useEffect, useRef, useCallback, useMemo, type CSSProperties } from "react";
import {
  Star, Search, Play, Pause, SkipBack, SkipForward, RotateCcw, Maximize2,
  Map, Video, Thermometer, X, Cast, ExternalLink, ChevronDown, Zap, Loader2, Tv2, Handshake,
} from "lucide-react";
import { clsx } from "clsx";
import { ALL_CAMS, CAMS_BY_BUSINESS, CAM_BUSINESSES, HERO_CAM } from "@/lib/cams";
import { withUTM, trackPartnerSite, trackTwitchClick, trackCastClick, toUTMContent } from "@/lib/analytics";
import { CamPlayer } from "./CamPlayer";
import { SponsorList } from "./SponsorList";
import { SponsorBadge } from "./SponsorBadge";
import type { Cam } from "@/types";
import { useIsLandscapeMobile } from "@/hooks/useOrientation";

// ─── Interval options ─────────────────────────────────────────────────────────
const INTERVALS = [
  { label: "15s", value: 15 },
  { label: "30s", value: 30 },
  { label: "1m", value: 60 },
  { label: "2m", value: 120 },
  { label: "5m", value: 300 },
];

type Tab = "cams" | "map" | "conditions" | "partners";

// ─── Main component ───────────────────────────────────────────────────────────
export function CamStation() {
  // Pre-select hero cam so iframe loads with the page navigation gesture — enables mobile autoplay
  const [selected, setSelected] = useState<Cam | null>(HERO_CAM);
  const [enabled, setEnabled] = useState<Set<string>>(
    () => new Set(ALL_CAMS.map((c) => c.id))
  );
  // Track which business groups are expanded (all collapsed by default)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set<string>()
  );
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isCycling, setIsCycling] = useState(false);
  const [cycleMode, setCycleMode] = useState<"selected" | "favorites">("selected");
  const [intervalSecs, setIntervalSecs] = useState(30);
  const [elapsed, setElapsed] = useState(0);
  const [search, setSearch] = useState("");
  const [favOnly, setFavOnly] = useState(false);
  const [tab, setTab] = useState<Tab>("cams");
  // Landscape mobile: video goes fullscreen, all other UI collapses
  const isLandscape = useIsLandscapeMobile();

  // 1. Toggle a class on <html> so CSS can hide the NavBar header as a
  //    belt-and-suspenders measure (our z-9999 overlay already covers it,
  //    but this removes it from the paint tree on iOS too).
  useEffect(() => {
    if (isLandscape) {
      document.documentElement.classList.add("landscape-video-mode");
    } else {
      document.documentElement.classList.remove("landscape-video-mode");
      // If we entered native fullscreen, exit it when rotating back.
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    }
    return () => { document.documentElement.classList.remove("landscape-video-mode"); };
  }, [isLandscape]);

  // 2. Fire requestFullscreen() from ALL three orientation-change event
  //    surfaces simultaneously. Different Android Chrome versions treat
  //    different events as "user gesture" context — covering all three
  //    maximises the chance that at least one call is granted permission.
  //    Calls are synchronous (no setTimeout) to stay in the gesture stack.
  //    iOS Safari ignores requestFullscreen on non-<video> elements — for
  //    iOS our z-[9999] CSS overlay + header hiding is the fallback.
  useEffect(() => {
    const isMobileLandscape = () =>
      window.matchMedia("(orientation: landscape)").matches &&
      window.matchMedia("(pointer: coarse)").matches &&
      window.innerHeight < 600;

    const tryEnter = () => {
      if (isMobileLandscape() && !document.fullscreenElement) {
        document.documentElement
          .requestFullscreen?.({ navigationUI: "hide" })
          .catch(() => {}); // Silently ignore — blocked on iOS / strict Android
      }
    };

    const tryExit = () => {
      if (!isMobileLandscape() && document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    };

    const onOrientationEvent = () => { tryEnter(); tryExit(); };

    // Surface 1: legacy orientationchange (widest browser support)
    window.addEventListener("orientationchange", onOrientationEvent);
    // Surface 2: matchMedia orientation change (Chrome 79+)
    const mq = window.matchMedia("(orientation: landscape)");
    mq.addEventListener("change", onOrientationEvent);
    // Surface 3: Screen Orientation API (Chrome 38+, Firefox 43+)
    try { screen.orientation?.addEventListener("change", onOrientationEvent); } catch {}

    return () => {
      window.removeEventListener("orientationchange", onOrientationEvent);
      mq.removeEventListener("change", onOrientationEvent);
      try { screen.orientation?.removeEventListener("change", onOrientationEvent); } catch {}
    };
  }, []);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleGroup = (biz: string) =>
    setExpandedGroups((prev) => {
      const n = new Set(prev);
      n.has(biz) ? n.delete(biz) : n.add(biz);
      return n;
    });

  // Build active cycle list (non-hero cams only)
  const cycleList = useMemo(
    () =>
      cycleMode === "favorites"
        ? ALL_CAMS.filter((c) => favorites.has(c.id))
        : ALL_CAMS.filter((c) => enabled.has(c.id)),
    [cycleMode, enabled, favorites]
  );

  const cycleIdx = selected ? cycleList.findIndex((c) => c.id === selected.id) : 0;

  const goNext = useCallback(() => {
    if (!cycleList.length) return;
    setSelected(cycleList[(cycleIdx + 1) % cycleList.length]);
    setElapsed(0);
  }, [cycleList, cycleIdx]);

  const goPrev = useCallback(() => {
    if (!cycleList.length) return;
    setSelected(cycleList[(cycleIdx - 1 + cycleList.length) % cycleList.length]);
    setElapsed(0);
  }, [cycleList, cycleIdx]);

  // Cycle timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (elapsedRef.current) clearInterval(elapsedRef.current);
    setElapsed(0);
    if (isCycling && cycleList.length > 1) {
      timerRef.current = setInterval(goNext, intervalSecs * 1000);
      elapsedRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [isCycling, intervalSecs, goNext, cycleList.length]);

  // Scroll selected cam row into sidebar view
  useEffect(() => {
    if (!selected) return;
    document
      .getElementById(`cam-row-${selected.id}`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  // When a cam is selected on mobile, jump the scroll container back to the top
  // so the video is immediately visible without any manual scrolling.
  // We ref the overflow-y-auto container directly and call scrollTo — much more
  // reliable than scrollIntoView on a child inside a custom scroll container.
  useEffect(() => {
    if (!selected || !scrollContainerRef.current) return;
    if (window.innerWidth >= 1024) return; // desktop: side-by-side, always visible
    scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [selected]);

  const toggleEnabled = (id: string) =>
    setEnabled((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleFav = (id: string) =>
    setFavorites((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const displayList = useMemo(() => {
    let list = ALL_CAMS;
    if (favOnly) list = list.filter((c) => favorites.has(c.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.business.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, favOnly, favorites]);

  // When searching/filtering, show flat list; otherwise show grouped
  const isFiltering = favOnly || search.trim().length > 0;

  const progressPct = Math.min((elapsed / intervalSecs) * 100, 100);

  return (
    <div
      className={clsx(
        "web-bg flex flex-col",
        // In landscape mobile: fixed overlay covers navbar + everything else
        // !fixed uses Tailwind's important modifier so it wins over the
        // unlayered ".web-bg { position: relative }" in globals.css.
        // z-[9999] beats the NavBar header's z-50.
        isLandscape && "!fixed inset-0 z-[9999] bg-black"
      )}
      style={isLandscape ? { height: "100dvh", width: "100dvw" } : { height: "calc(100dvh - 56px)" }}
    >
      {/* ── Tab bar — hidden in landscape mobile ─────────── */}
      <div className={clsx("flex shrink-0", isLandscape && "!hidden")} style={{ background: "#050810", borderBottom: "2px solid rgba(0,212,255,0.35)", boxShadow: "0 0 20px rgba(0,212,255,0.2), 0 4px 20px rgba(0,0,0,0.6)" }}>
        {/* Silver "chrome" gradient shared by the Partners tab icon + label. */}
        <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="partners-chrome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#ffffff" />
              <stop offset="45%"  stopColor="#e8edf3" />
              <stop offset="52%"  stopColor="#8b95a3" />
              <stop offset="60%"  stopColor="#d3dae3" />
              <stop offset="100%" stopColor="#7c8794" />
            </linearGradient>
          </defs>
        </svg>
        {(
          [
            { key: "cams", label: "CAMS", Icon: Video },
            { key: "map", label: "MAP", Icon: Map },
            { key: "conditions", label: "CONDITIONS", Icon: Thermometer },
            { key: "partners", label: "PARTNERS", Icon: Handshake },
          ] as const
        ).map(({ key, label, Icon }) => {
          const isActive = tab === key;
          // The PARTNERS tab label gets the premium chrome/metallic treatment
          // (matching the SpyderNetwork "PARTNERS" branding) instead of the flat
          // tab color. Applied to the label text only, so the icon keeps its
          // active/inactive state color. Red glow intensifies when active.
          const metallicLabel: CSSProperties | undefined =
            key === "partners"
              ? {
                  // Bigger + bolder than sibling tabs so the chrome actually
                  // reads at tab size (a 12px gradient looks like flat grey).
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  // Sharp "chrome horizon" gradient (light → steel flip at 50%)
                  // is what makes small text look metallic.
                  backgroundImage:
                    "linear-gradient(180deg,#ffffff 0%,#f2f5f9 42%,#8b95a3 50%,#c9d2dd 58%,#6c7787 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  // Dark glyph shadow = bevel depth; red glow ties it to brand.
                  textShadow: "0 1px 1px rgba(0,0,0,0.65)",
                  filter: isActive
                    ? "drop-shadow(0 0 9px rgba(204,0,0,0.85))"
                    : "drop-shadow(0 0 5px rgba(204,0,0,0.45))",
                }
              : undefined;

          // Portrait-mobile treatment: below `sm` the Partners tab collapses to
          // a chrome ICON only (the wordmark is too big for a ~95px tab). The
          // icon takes the same silver gradient stroke + red glow as the label.
          const chromeIcon: CSSProperties | undefined =
            key === "partners"
              ? {
                  stroke: "url(#partners-chrome)",
                  filter: isActive
                    ? "drop-shadow(0 0 7px rgba(204,0,0,0.85))"
                    : "drop-shadow(0 0 4px rgba(204,0,0,0.5))",
                }
              : undefined;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-widest border-b-[3px] transition-all min-h-[48px] touch-manipulation",
                isActive ? "border-spyder-cyan text-spyder-cyan" : "text-spyder-gray border-transparent"
              )}
              // Skip the cyan text-glow on PARTNERS so it doesn't fight the
              // metallic label; the cyan underline + icon still signal "active".
              style={isActive && key !== "partners" ? { textShadow: "0 0 10px #00d4ff, 0 0 24px rgba(0,212,255,0.5)", filter: "drop-shadow(0 2px 6px rgba(0,212,255,0.4))" } : {}}
            >
              <Icon
                className={clsx("shrink-0", key === "partners" ? "w-5 h-5 sm:w-3.5 sm:h-3.5" : "w-3.5 h-3.5")}
                style={chromeIcon}
              />
              {key === "partners" ? (
                /* Portrait mobile → chrome icon only; chrome wordmark from sm up. */
                <span className="hidden sm:inline" style={metallicLabel}>{label}</span>
              ) : (
                <>
                  <span className="hidden xs:inline">{label}</span>
                  <span className="xs:hidden">{label.slice(0, 4)}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* ── CAMS tab — also shown (fullscreen video) when landscape mobile ── */}
      {(tab === "cams" || isLandscape) && (
        <div ref={scrollContainerRef} className={clsx(
          "flex-1 min-h-0 overscroll-contain",
          isLandscape
            ? "overflow-hidden flex flex-col"
            : "overflow-y-auto lg:overflow-hidden lg:flex lg:flex-row"
        )}>

          {/* LEFT: Player ──────────────────────────────── */}
          <div className={clsx(
            "flex flex-col shrink-0",
            isLandscape ? "flex-1 min-h-0" : "lg:flex-1 lg:min-h-0"
          )}>
            {/* Player header — hero bar; hidden in landscape mobile */}
            <div className={clsx("neon-player-header flex items-center justify-between px-3 sm:px-4 py-2 shrink-0", isLandscape && "!hidden")}>
              <div className="flex items-center gap-2 min-w-0">
                {selected ? (
                  <>
                    <span className="live-badge shrink-0 text-[10px]" style={{ boxShadow: "0 0 8px rgba(204,0,0,0.9), 0 0 20px rgba(204,0,0,0.5), 0 0 40px rgba(204,0,0,0.2)" }}><span className="live-dot" />LIVE</span>
                    <span className="font-display font-bold text-white text-sm tracking-wider uppercase truncate">
                      {selected.business}
                    </span>
                    {selected.name && (
                      <span className="text-spyder-gray text-xs truncate hidden xs:inline">&nbsp;— {selected.name}</span>
                    )}
                  </>
                ) : (
                  <span className="text-spyder-gray text-xs">Select a cam below ↓</span>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {isCycling && cycleList.length > 0 && (
                  <span className="text-xs text-spyder-gray tabular-nums font-mono">{cycleIdx + 1}/{cycleList.length}</span>
                )}
                {selected?.twitchChannel && (
                  <a
                    href={`https://player.twitch.tv/?channel=${selected.twitchChannel}&parent=spydernetwork.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-spyder-gray hover:text-white transition-colors min-h-[36px] px-1"
                    title="Cast to TV"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackCastClick(selected.twitchChannel!, "cast-button");
                    }}
                  >
                    <Cast className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-xs">Cast</span>
                  </a>
                )}
              </div>
            </div>

            {/* Video area — 16:9 on mobile portrait, fills height on desktop, fullscreen in landscape mobile */}
            <div className={clsx(
              "neon-frame relative bg-black w-full",
              isLandscape
                ? "flex-1 min-h-0"
                : "aspect-video lg:aspect-auto lg:flex-1 lg:min-h-0"
            )}>
              {selected ? (
                <CamPlayer cam={selected} key={selected.id} autoplay />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
                  <div className="w-16 h-16 rounded-2xl bg-spyder-red/10 border border-spyder-red/20 flex items-center justify-center">
                    <Video className="w-7 h-7 text-spyder-red/60" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base">Pick a cam to start</p>
                    <p className="text-spyder-gray text-sm mt-1">
                      <span className="lg:hidden">Select a camera from the list below ↓</span>
                      <span className="hidden lg:inline">Select a camera from the list →</span>
                    </p>
                  </div>
                </div>
              )}

              {/* ── Landscape mobile chrome ─────────────────────────────────
                  Gradient bars float over the video — top shows cam identity,
                  bottom has prev/next controls + a rotate-back hint.
                  pointer-events-none on the top bar keeps taps reaching the video.
              ──────────────────────────────────────────────────────────────── */}
              {isLandscape && (
                <>
                  {/* Top bar — LIVE badge + cam name */}
                  <div
                    className="landscape-chrome-enter absolute inset-x-0 top-0 z-30 flex items-center gap-2 px-4 py-2.5 pointer-events-none"
                    style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, transparent 100%)" }}
                  >
                    {selected ? (
                      <>
                        <span
                          className="live-badge shrink-0 text-[10px]"
                          style={{ boxShadow: "0 0 8px rgba(204,0,0,0.9), 0 0 20px rgba(204,0,0,0.5)" }}
                        >
                          <span className="live-dot" />LIVE
                        </span>
                        <span className="font-display font-bold text-white text-sm tracking-wider uppercase truncate drop-shadow-lg">
                          {selected.business}
                        </span>
                        {selected.name && (
                          <span className="text-white/55 text-xs truncate drop-shadow">
                            &nbsp;— {selected.name}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-white/40 text-xs">No cam selected</span>
                    )}
                  </div>

                  {/* Bottom bar — prev / position / next + rotate hint */}
                  <div
                    className="landscape-chrome-enter absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-5 px-4 py-2.5"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)" }}
                  >
                    <button
                      onClick={goPrev}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 active:bg-white/25 transition-colors touch-manipulation"
                      aria-label="Previous cam"
                    >
                      <SkipBack className="w-5 h-5 text-white" />
                    </button>

                    {cycleList.length > 0 && (
                      <span className="text-white/70 text-xs tabular-nums font-mono min-w-[36px] text-center drop-shadow">
                        {cycleIdx + 1} / {cycleList.length}
                      </span>
                    )}

                    <button
                      onClick={goNext}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 active:bg-white/25 transition-colors touch-manipulation"
                      aria-label="Next cam"
                    >
                      <SkipForward className="w-5 h-5 text-white" />
                    </button>

                    {/* Fullscreen button — tapping enters native browser fullscreen
                        which hides the address bar (Android Chrome).
                        On iOS the iframe's own ⛶ button does the same. */}
                    <button
                      onClick={() => {
                        if (!document.fullscreenElement) {
                          document.documentElement
                            .requestFullscreen?.({ navigationUI: "hide" })
                            .catch(() => {});
                        } else {
                          document.exitFullscreen?.().catch(() => {});
                        }
                      }}
                      className="absolute right-3 flex items-center gap-1.5 text-white/50 active:text-white text-[11px] touch-manipulation transition-colors"
                      aria-label="Enter fullscreen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Fullscreen</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Progress bar — hidden in landscape mobile */}
            <div className={clsx("h-0.5 bg-white/10 shrink-0", isLandscape && "!hidden")}>
              <div
                className="h-full bg-spyder-red transition-all duration-1000 ease-linear"
                style={{ width: isCycling ? `${progressPct}%` : "0%" }}
              />
            </div>

            {/* Controls bar — single row on all breakpoints; hidden in landscape mobile */}
            <div className={clsx("neon-controls flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 shrink-0 min-h-[48px] overflow-x-auto scrollbar-hide", isLandscape && "!hidden")}>
              {/* Prev / Next */}
              <button
                onClick={goPrev}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Previous cam"
              >
                <SkipBack className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={goNext}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Next cam"
              >
                <SkipForward className="w-4 h-4 text-white" />
              </button>

              <div className="w-px h-5 bg-white/15" />

              {/* Cycle toggle */}
              <button
                onClick={() => setIsCycling((v) => !v)}
                className={clsx(
                  "flex items-center gap-2 px-3 h-9 rounded-lg text-xs font-semibold transition-all",
                  isCycling
                    ? "bg-spyder-red text-white shadow-live"
                    : "bg-white/10 text-spyder-gray hover:text-white"
                )}
              >
                {isCycling ? (
                  <Pause className="w-3.5 h-3.5 fill-white" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                {isCycling ? "Cycling" : "Off"}
              </button>

              <div className="w-px h-5 bg-white/15" />

              {/* Interval picker */}
              <div className="flex gap-1 shrink-0">
                {INTERVALS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setIntervalSecs(value)}
                    className={clsx(
                      "px-1.5 sm:px-2 h-8 min-w-[28px] sm:min-w-[32px] rounded text-xs font-mono transition-all touch-manipulation",
                      intervalSecs === value
                        ? "bg-spyder-red text-white"
                        : "bg-white/10 text-spyder-gray hover:text-white"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Spacer + external link */}
              <div className="ml-auto">
                {selected?.websiteUrl && (
                  <a
                    href={withUTM(selected.websiteUrl, {
                      content: toUTMContent(selected.business),
                      term: "player-bar",
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackPartnerSite(
                      selected.business,
                      selected.websiteUrl!,
                      "player-bar"
                    )}
                    className="flex items-center gap-1.5 text-xs text-spyder-gray hover:text-white transition-colors min-h-[36px] px-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Visit Site</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Cam list — hidden in landscape mobile ── */}
          <div className={clsx("neon-sidebar relative flex flex-col w-full lg:w-72 xl:w-80 lg:min-h-0", isLandscape && "!hidden")} style={{ borderTop: "2px solid rgba(168,85,247,0.4)", boxShadow: "0 -4px 20px rgba(168,85,247,0.15)" }}>

            {/* List header */}
            <div className="neon-list-header px-3 pt-3 pb-2 shrink-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold tracking-widest uppercase" style={{ color: "#a855f7", textShadow: "0 0 10px #a855f7, 0 0 24px rgba(168,85,247,0.6)", letterSpacing: "0.15em" }}>
                  {ALL_CAMS.length} CAMS · {CAM_BUSINESSES.length} LOCATIONS
                </span>
              </div>

              {/* Cycle Selected / Cycle Favorites */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCycleMode("selected");
                    setIsCycling(true);
                  }}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all min-h-[36px] border",
                    cycleMode === "selected" && isCycling
                      ? "neon-cycle-active"
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  )}
                >
                  <Play className="w-3 h-3 fill-current" />
                  Cycle Selected
                </button>
                <button
                  onClick={() => {
                    setCycleMode("favorites");
                    setIsCycling(true);
                  }}
                  disabled={favorites.size === 0}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all min-h-[36px] border",
                    cycleMode === "favorites" && isCycling
                      ? "bg-spyder-red border-spyder-red text-white"
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  )}
                >
                  <Star className="w-3 h-3 fill-current" />
                  Cycle Favorites
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-spyder-gray pointer-events-none" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Find a camera..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-8 py-2
                             text-sm text-white placeholder:text-spyder-gray/50
                             focus:outline-none focus:border-spyder-red/50 transition-colors min-h-[36px]"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-spyder-gray hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Favorites Only toggle */}
              <button
                onClick={() => setFavOnly((v) => !v)}
                className={clsx(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[32px] border",
                  favOnly
                    ? "bg-spyder-gold/15 border-spyder-gold/40 text-spyder-gold"
                    : "bg-white/5 border-white/10 text-spyder-gray hover:text-white hover:bg-white/10"
                )}
              >
                <Star className={clsx("w-3.5 h-3.5", favOnly && "fill-current")} />
                Favorites Only
                {favorites.size > 0 && (
                  <span className="ml-auto text-xs opacity-70">({favorites.size})</span>
                )}
              </button>
            </div>

            {/* Mobile: expands naturally; desktop: scrolls inside sidebar */}
            <div className="flex-1 lg:overflow-y-auto overscroll-contain pb-safe">

              {/* ── Sticky now-playing strip (mobile only) ── */}
              {selected && (
                <div className="sticky top-0 z-10 lg:hidden flex items-center gap-2 px-3 py-2 bg-spyder-black/90 backdrop-blur border-b border-spyder-red/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-spyder-red animate-pulse shrink-0" />
                  <span className="text-xs text-white font-medium truncate">
                    {selected.business}{selected.name ? ` · ${selected.name}` : ""}
                  </span>
                  <span className="ml-auto text-xs text-spyder-red font-bold shrink-0">LIVE</span>
                </div>
              )}

              {/* ── Hero / Featured cam ── */}
              <button
                onClick={() => { setSelected(HERO_CAM); setIsCycling(false); }}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-3 border-b-2 transition-all duration-150",
                  selected?.id === HERO_CAM.id
                    ? "bg-spyder-red/15 border-b-spyder-red"
                    : "bg-spyder-red/5 hover:bg-spyder-red/10 border-b-spyder-red/30"
                )}
              >
                <Zap className="w-4 h-4 text-spyder-red shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-bold text-spyder-red tracking-widest uppercase">Featured</p>
                  <p className="text-xs text-spyder-gray truncate">SpyderNetwork Main Feed</p>
                </div>
                {selected?.id === HERO_CAM.id && (
                  <span className="live-badge text-xs shrink-0">
                    <span className="live-dot" />LIVE
                  </span>
                )}
              </button>

              {/* ── Grouped or flat list ── */}
              {isFiltering ? (
                // Flat filtered list
                <>
                  {displayList.length === 0 && (
                    <div className="py-12 text-center text-spyder-gray text-sm">No cams found.</div>
                  )}
                  {displayList.map((cam) => (
                    <CamRow
                      key={cam.id}
                      cam={cam}
                      showBusiness
                      isSelected={selected?.id === cam.id}
                      isEnabled={enabled.has(cam.id)}
                      isFavorite={favorites.has(cam.id)}
                      onSelect={() => { setSelected(cam); setIsCycling(false); }}
                      onToggleEnabled={() => toggleEnabled(cam.id)}
                      onToggleFav={() => toggleFav(cam.id)}
                    />
                  ))}
                </>
              ) : (
                // Grouped by business
                CAM_BUSINESSES.map((biz) => {
                  const cams = CAMS_BY_BUSINESS[biz] ?? [];
                  if (!cams.length) return null;
                  const isOpen = expandedGroups.has(biz);
                  const activeCam = cams.find((c) => c.id === selected?.id);

                  // Pull business-level metadata from first cam (shared across the group)
                  const bizUrl     = cams[0]?.websiteUrl;
                  const bizTier    = cams[0]?.sponsorTier;
                  const bizTwitch  = cams.find((c) => c.twitchChannel)?.twitchChannel;
                  const hasPaidTier = bizTier && bizTier !== "basic";

                  // Left border shifts: active > premium > featured > none
                  const headerStyle = activeCam
                    ? { borderLeft: "3px solid #00d4ff", boxShadow: "inset 4px 0 16px rgba(0,212,255,0.15)", background: "linear-gradient(90deg,rgba(0,212,255,0.09) 0%,rgba(9,13,28,0.97) 100%)" }
                    : bizTier === "premium"
                    ? { borderLeft: "3px solid rgba(168,85,247,0.45)" }
                    : bizTier === "featured"
                    ? { borderLeft: "3px solid rgba(0,212,255,0.3)" }
                    : { borderLeft: "3px solid transparent" };

                  return (
                    <div key={biz}>
                      {/* Business group header — split into toggle zone + link zone */}
                      <div
                        className="biz-header flex items-center gap-1 pr-2 transition-all active:bg-white/[0.05]"
                        style={headerStyle}
                      >
                        {/* Toggle button (chevron + name) */}
                        <button
                          onClick={() => toggleGroup(biz)}
                          className="flex items-center gap-2 flex-1 min-w-0 pl-3 py-2.5 min-h-[44px] text-left touch-manipulation"
                        >
                          <ChevronDown
                            className={clsx(
                              "w-3.5 h-3.5 text-spyder-gray transition-transform shrink-0",
                              !isOpen && "-rotate-90"
                            )}
                          />
                          <span
                            className="biz-name flex-1 text-left text-xs font-bold tracking-wide truncate"
                            style={activeCam ? { color: "#00d4ff", textShadow: "0 0 8px #00d4ff, 0 0 20px rgba(0,212,255,0.5)" } : { color: "white" }}
                          >
                            {biz}
                          </span>
                        </button>

                        {/* Sponsor badge */}
                        {hasPaidTier && <SponsorBadge tier={bizTier!} size="sm" />}

                        {/* Website link icon — shown for every business that has one */}
                        {bizUrl && (
                          <a
                            href={withUTM(bizUrl, {
                              content: toUTMContent(biz),
                              term: "cam-sidebar",
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Visit ${biz}`}
                            onClick={() => trackPartnerSite(biz, bizUrl, "cam-sidebar")}
                            className="shrink-0 flex items-center justify-center w-7 h-7 rounded text-spyder-gray/40 hover:text-white transition-colors touch-manipulation"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <span className="text-xs text-spyder-gray/70 shrink-0 tabular-nums">{cams.length}</span>
                        {activeCam && (
                          <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ background: "#00d4ff", boxShadow: "0 0 8px #00d4ff, 0 0 16px rgba(0,212,255,0.7)" }} />
                        )}
                      </div>

                      {/* Paid-tier action strip — appears when group is expanded */}
                      {isOpen && hasPaidTier && (bizUrl || bizTwitch) && (
                        <div className="flex gap-2 px-3 pb-2 pt-0.5 flex-wrap">
                          {bizUrl && (
                            <a
                              href={withUTM(bizUrl, {
                                content: toUTMContent(biz),
                                term: "cam-sidebar",
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => trackPartnerSite(biz, bizUrl, "cam-sidebar")}
                              className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all touch-manipulation hover:brightness-125"
                              style={bizTier === "premium"
                                ? { background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7" }
                                : { background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff" }
                              }
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              Visit Website
                            </a>
                          )}
                          {bizTwitch && (
                            <a
                              href={`https://twitch.tv/${bizTwitch}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => trackTwitchClick(bizTwitch, "twitch-strip")}
                              className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all touch-manipulation hover:brightness-125"
                              style={{ background: "rgba(145,70,255,0.1)", border: "1px solid rgba(145,70,255,0.25)", color: "#9147ff" }}
                            >
                              <Tv2 className="w-2.5 h-2.5" />
                              Watch on Twitch
                            </a>
                          )}
                        </div>
                      )}

                      {/* Sub-cams */}
                      {isOpen && cams.map((cam) => (
                        <CamRow
                          key={cam.id}
                          cam={cam}
                          showBusiness={false}
                          isSelected={selected?.id === cam.id}
                          isEnabled={enabled.has(cam.id)}
                          isFavorite={favorites.has(cam.id)}
                          onSelect={() => { setSelected(cam); setIsCycling(false); }}
                          onToggleEnabled={() => toggleEnabled(cam.id)}
                          onToggleFav={() => toggleFav(cam.id)}
                        />
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MAP tab — not rendered in landscape (video already fullscreen) ── */}
      {!isLandscape && tab === "map" && <MapTab onSelectCam={(cam) => { setSelected(cam); setTab("cams"); }} />}

      {/* ── CONDITIONS tab ───────────────────────────────── */}
      {!isLandscape && tab === "conditions" && <ConditionsTab />}

      {/* ── PARTNERS tab ─────────────────────────────────────
          Same branded SponsorList section, surfaced as a first-class tab so
          it's always one tap away (id differs from the below-fold instance to
          keep DOM ids unique). */}
      {!isLandscape && tab === "partners" && (
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <SponsorList id="partners-tab" />
        </div>
      )}
    </div>
  );
}

// ─── SpyderSwitch ─────────────────────────────────────────────────────────────
// A branded toggle that uses a mini spider icon as its knob.
// Track glows red with web-thread decoration when active.
function SpyderSwitch({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={clsx(
        "relative shrink-0 w-11 h-6 rounded-full border transition-all duration-300 touch-manipulation",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-spyder-red",
        checked
          ? "bg-spyder-red/20 border-spyder-red/60 shadow-[0_0_8px_rgba(204,0,0,0.35)]"
          : "bg-white/8 border-white/15"
      )}
    >
      {/* Web-thread lines on the track when active */}
      {checked && (
        <span className="absolute inset-0 rounded-full overflow-hidden opacity-30 pointer-events-none" aria-hidden>
          <svg width="100%" height="100%" viewBox="0 0 44 24" preserveAspectRatio="none">
            <line x1="0" y1="12" x2="44" y2="12" stroke="#cc0000" strokeWidth="0.8" strokeDasharray="3 4" />
            <line x1="11" y1="0" x2="11" y2="24" stroke="#cc0000" strokeWidth="0.5" strokeDasharray="2 3" />
            <line x1="22" y1="0" x2="22" y2="24" stroke="#cc0000" strokeWidth="0.5" strokeDasharray="2 3" />
            <line x1="33" y1="0" x2="33" y2="24" stroke="#cc0000" strokeWidth="0.5" strokeDasharray="2 3" />
          </svg>
        </span>
      )}

      {/* Spider knob */}
      <span
        aria-hidden
        className={clsx(
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center",
          "shadow-md transition-all duration-300",
          checked
            ? "translate-x-5 bg-spyder-red shadow-[0_0_6px_rgba(204,0,0,0.8)]"
            : "translate-x-0 bg-[#1e2433]"
        )}
      >
        {/* Mini spider SVG — legs + body + lens */}
        <svg viewBox="0 0 20 20" width="13" height="13" fill="none">
          {/* Legs */}
          <path d="M7.5 7.5 Q5 5 3 3"   stroke={checked ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.18)"} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M7 10   Q4 9.5 2 10"  stroke={checked ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.18)"} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M7.5 12.5 Q5 15 3 17" stroke={checked ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.18)"} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M12.5 7.5 Q15 5 17 3"   stroke={checked ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.18)"} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M13 10   Q16 9.5 18 10"  stroke={checked ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.18)"} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M12.5 12.5 Q15 15 17 17" stroke={checked ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.18)"} strokeWidth="1.1" strokeLinecap="round" />
          {/* Body shell */}
          <circle cx="10" cy="10" r="4.5" fill={checked ? "white" : "#3a4055"} />
          {/* Lens chamber */}
          <circle cx="10" cy="10" r="2.6" fill={checked ? "#cc0000" : "#1a1f2e"} />
          {/* Pupil */}
          <circle cx="10" cy="10" r="1.2" fill={checked ? "white" : "#2a2f40"} />
          {/* Catchlight */}
          <circle cx="8.9" cy="8.9" r="0.6" fill={checked ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)"} />
        </svg>
      </span>
    </button>
  );
}


// ─── Cam row ─────────────────────────────────────────────────────────────────
function CamRow({
  cam,
  showBusiness,
  isSelected,
  isEnabled,
  isFavorite,
  onSelect,
  onToggleEnabled,
  onToggleFav,
}: {
  cam: Cam;
  showBusiness: boolean;
  isSelected: boolean;
  isEnabled: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleEnabled: () => void;
  onToggleFav: () => void;
}) {
  return (
    <div
      id={`cam-row-${cam.id}`}
      className={clsx(
        "cam-row-hover flex items-center gap-2 px-3 py-2.5 border-b border-white/5 transition-all duration-150 min-h-[48px]",
        !showBusiness && "pl-8",
        "border-l-[3px]",
        isSelected ? "cam-row-selected" : "border-l-transparent"
      )}
      style={isSelected ? { background: "linear-gradient(90deg,rgba(0,212,255,0.14) 0%,rgba(0,212,255,0.03) 100%)", borderLeftColor: "#00d4ff", boxShadow: "inset 4px 0 20px rgba(0,212,255,0.18)" } : {}}
    >
      {/* Spyder switch */}
      <SpyderSwitch
        checked={isEnabled}
        onToggle={onToggleEnabled}
        label={isEnabled ? "Remove from cycle" : "Add to cycle"}
      />

      {/* Favorite */}
      <button
        onClick={onToggleFav}
        className={clsx(
          "shrink-0 w-7 h-7 flex items-center justify-center rounded-md transition-colors touch-manipulation",
          isFavorite
            ? "text-spyder-gold"
            : "text-white/20 hover:text-spyder-gold/70"
        )}
        aria-label={isFavorite ? "Unfavorite" : "Favorite"}
      >
        <Star className={clsx("w-3.5 h-3.5", isFavorite && "fill-current")} />
      </button>

      {/* Name — clicking selects the cam */}
      <button onClick={onSelect} className="flex-1 text-left min-w-0">
        {showBusiness ? (
          <>
            <p className="cam-name text-sm font-medium leading-snug truncate transition-colors" style={isSelected ? { color: "#00d4ff", textShadow: "0 0 8px #00d4ff" } : { color: "rgba(255,255,255,0.8)" }}>
              {cam.business}
            </p>
            <p className="text-xs text-spyder-gray truncate">{cam.name}</p>
          </>
        ) : (
          <p className="cam-name text-sm leading-snug truncate transition-colors" style={isSelected ? { color: "#00d4ff", textShadow: "0 0 8px #00d4ff", fontWeight: 600 } : { color: "#9ca3af" }}>
            {cam.name}
          </p>
        )}
      </button>

      {/* Live indicator */}
      {cam.isLive && (
        <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={isSelected ? { background: "var(--neon-cyan)", boxShadow: "0 0 6px rgba(0,212,255,0.8)" } : { background: "#cc0000", boxShadow: "0 0 4px rgba(204,0,0,0.6)" }} />
      )}
    </div>
  );
}

// ─── Map tab (Google My Maps embed) ──────────────────────────────────────────
// Displays the classic SpyderNetwork Google My Maps — all cam locations marked
// with the iconic red spider icons, exactly as seen on the original site.
//
// ── HOW TO GET THE MAP ID ────────────────────────────────────────────────────
// 1. Visit spydernetwork.com in your browser
// 2. Right-click the Google map → "View Frame Source" (or Inspect Element)
// 3. Find the iframe src — it contains "maps/d/embed?mid=XXXXXXXXX"
// 4. Copy the value after "mid=" and paste it below
// ─────────────────────────────────────────────────────────────────────────────
const SPYDER_MAP_MID = "1LUHg37sagphltfKVv_DVM1ZtCyFerPA";

function MapTab({ onSelectCam }: { onSelectCam: (cam: Cam) => void }) {
  const mappedCamCount = ALL_CAMS.filter((c) => c.lat && c.lng).length;
  const hasMapId = SPYDER_MAP_MID.length > 0;

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: "#050810" }}>

      {/* ── Branded header ──────────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: "rgba(204,0,0,0.3)", boxShadow: "0 2px 16px rgba(204,0,0,0.1)" }}
      >
        {/* Spider icon badge */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(204,0,0,0.15)", border: "1px solid rgba(204,0,0,0.4)" }}
        >
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
            <path d="M7.5 7.5 Q5 5 3 3"      stroke="#cc0000" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M7 10 Q4 9.5 2 10"       stroke="#cc0000" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M7.5 12.5 Q5 15 3 17"    stroke="#cc0000" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M12.5 7.5 Q15 5 17 3"    stroke="#cc0000" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M13 10 Q16 9.5 18 10"    stroke="#cc0000" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M12.5 12.5 Q15 15 17 17" stroke="#cc0000" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="10" cy="10" r="4.5" fill="#cc0000" />
            <circle cx="10" cy="10" r="2.6"  fill="rgba(0,0,0,0.75)" />
            <circle cx="10" cy="10" r="1.2"  fill="white" />
            <circle cx="8.9" cy="8.9" r="0.55" fill="rgba(255,255,255,0.9)" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="font-display text-sm font-bold tracking-widest uppercase leading-tight"
            style={{ color: "#ffffff", textShadow: "0 0 12px rgba(204,0,0,0.45)" }}
          >
            SpyderNetwork Live Cams Map
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
            {ALL_CAMS.length} cams · {mappedCamCount} locations around Lake of the Ozarks
          </p>
        </div>

        {/* Open full map externally */}
        {hasMapId && (
          <a
            href={`https://www.google.com/maps/d/viewer?mid=${SPYDER_MAP_MID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all touch-manipulation hover:brightness-125 active:scale-95"
            style={{ background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.35)", color: "#cc0000" }}
            title="Open full map in Google My Maps"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden xs:inline text-[11px] font-semibold">Full Map</span>
          </a>
        )}
      </div>

      {/* ── Map area — fills all remaining height ────────────────────────────── */}
      <div className="flex-1 min-h-0 relative">
        {hasMapId ? (
          /* Classic SpyderNetwork Google My Maps with red spider markers */
          <iframe
            title="SpyderNetwork Live Cams Map — Lake of the Ozarks"
            src={`https://www.google.com/maps/d/embed?mid=${SPYDER_MAP_MID}&ll=38.175%2C-92.635&z=11`}
            loading="lazy"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
            style={{ colorScheme: "normal" }}
          />
        ) : (
          /* Shown until SPYDER_MAP_MID is filled in */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)" }}
            >
              <Map className="w-7 h-7 text-spyder-red" />
            </div>
            <div className="space-y-2 max-w-xs">
              <p className="font-display font-bold text-white text-base tracking-wide">One step to activate</p>
              <p className="text-spyder-gray text-sm leading-relaxed">
                On spydernetwork.com, right-click the Google map → <em>View Frame Source</em>.
                Find the value after <code className="text-spyder-cyan text-xs bg-white/5 px-1 py-0.5 rounded">mid=</code> and
                paste it into <code className="text-spyder-cyan text-xs bg-white/5 px-1 py-0.5 rounded">SPYDER_MAP_MID</code> in{" "}
                <code className="text-white/60 text-xs">CamStation.tsx</code>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer bar ───────────────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center justify-between gap-3 px-4 py-2.5 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(5,8,16,0.98)" }}
      >
        <p className="text-xs leading-snug" style={{ color: "#6b7280" }}>
          {hasMapId
            ? "Tap a red spider icon on the map to see cam details"
            : "Add the map ID above to show all cam locations"}
        </p>
        {/* Switches back to the CAMS tab and loads the featured cam */}
        <button
          onClick={() => onSelectCam(HERO_CAM)}
          className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all touch-manipulation hover:brightness-125 active:scale-95"
          style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}
        >
          <Video className="w-3 h-3" />
          Watch Live
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ConditionsTab
// ─────────────────────────────────────────────────────────────────────────────
interface Conditions {
  waterTempF: number | null;
  airTempF: number | null;
  humidityPct: number | null;
  windSpeedMph: number | null;
  windGustMph: number | null;
  windDir: string | null;
  lakeLevel: number | null;
  lakeLevelNormal: number | null;
  lakeLevelValidTime: string | null;
  weatherDesc: string | null;
  updatedAt: string | null; // ISO timestamp of the reading
}

// Pulls live conditions from our cached server route (/api/conditions), which
// aggregates Open-Meteo (weather) + NOAA NWPS Bagnell Dam gauge (lake level).
function useConditions() {
  const [data, setData] = useState<Conditions>({
    waterTempF: null, airTempF: null, humidityPct: null,
    windSpeedMph: null, windGustMph: null, windDir: null,
    lakeLevel: null, lakeLevelNormal: 660, lakeLevelValidTime: null,
    weatherDesc: null, updatedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/conditions");
        if (!res.ok) throw new Error(`conditions ${res.status}`);
        const j = await res.json();
        if (!alive) return;
        setData({
          waterTempF:         j.waterTempF ?? null,
          airTempF:           j.airTempF ?? null,
          humidityPct:        j.humidityPct ?? null,
          windSpeedMph:       j.windSpeedMph ?? null,
          windGustMph:        j.windGustMph ?? null,
          windDir:            j.windDir ?? null,
          lakeLevel:          j.lakeLevelFt ?? null,
          lakeLevelNormal:    j.lakeLevelNormalFt ?? 660,
          lakeLevelValidTime: j.lakeLevelValidTime ?? null,
          weatherDesc:        j.weatherDesc ?? null,
          updatedAt:          j.updatedAt ?? null,
        });
      } catch {
        // Whole request failed — leave everything null so the UI shows "—".
        if (alive) setError(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { data, loading, error };
}

// ISO timestamp → "just now" / "5 min ago" / "2 hrs ago".
function timeAgo(iso: string | null): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return mins === 1 ? "1 min ago" : `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  return hrs === 1 ? "1 hr ago" : `${hrs} hrs ago`;
}

function ConditionsTab() {
  const { data, loading, error } = useConditions();

  const fmt = (v: number | null, unit: string) =>
    v == null ? "—" : `${v}${unit}`;

  const updated = timeAgo(data.updatedAt);

  const levelDiff = data.lakeLevel != null && data.lakeLevelNormal != null
    ? (data.lakeLevel - data.lakeLevelNormal).toFixed(1)
    : null;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-white uppercase tracking-widest">
          Lake Conditions
        </h3>
        {updated && (
          <span className="text-xs text-spyder-gray">Updated {updated}</span>
        )}
      </div>

      {error && !loading && (
        <p className="text-xs text-spyder-red/80 leading-relaxed">
          Live conditions are temporarily unavailable — showing placeholders.
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-spyder-red animate-spin" />
          <span className="ml-2 text-spyder-gray text-sm">Fetching conditions…</span>
        </div>
      ) : (
        <>
          {/* Current weather */}
          <div className="bg-spyder-navy-card rounded-xl p-4 border border-white/10">
            <p className="text-xs text-spyder-gray uppercase tracking-widest mb-3">Weather</p>
            <div className="grid grid-cols-2 gap-3">
              <CondCard label="Air Temp" value={fmt(data.airTempF, "°F")} />
              <CondCard label="Water Temp" value={fmt(data.waterTempF, "°F")} note="coming soon" />
              <CondCard
                label="Wind"
                value={data.windSpeedMph != null ? `${data.windSpeedMph} mph` : "—"}
                note={
                  [data.windDir, data.windGustMph != null ? `gusts ${data.windGustMph}` : null]
                    .filter(Boolean)
                    .join(" · ") || undefined
                }
              />
              <CondCard
                label="Conditions"
                value={data.weatherDesc ?? "—"}
                note={data.humidityPct != null ? `${data.humidityPct}% humidity` : undefined}
              />
            </div>
          </div>

          {/* Lake level */}
          <div className="bg-spyder-navy-card rounded-xl p-4 border border-white/10">
            <p className="text-xs text-spyder-gray uppercase tracking-widest mb-3">Lake Level</p>
            <div className="grid grid-cols-2 gap-3">
              <CondCard
                label="Current"
                value={data.lakeLevel != null ? `${data.lakeLevel} ft` : "—"}
              />
              <CondCard
                label="vs Normal Pool"
                value={levelDiff != null
                  ? `${parseFloat(levelDiff) >= 0 ? "+" : ""}${levelDiff} ft`
                  : "—"}
                highlight={levelDiff != null && parseFloat(levelDiff) >= 0}
              />
            </div>
            <p className="text-xs text-spyder-gray mt-3 leading-relaxed">
              Normal pool: {data.lakeLevelNormal ?? 660} ft. Data via NOAA / USGS gauge at Bagnell Dam
              {data.lakeLevelValidTime && timeAgo(data.lakeLevelValidTime)
                ? ` · reading ${timeAgo(data.lakeLevelValidTime)}`
                : ""}.
            </p>
          </div>
          <div className="bg-spyder-navy-card rounded-xl overflow-hidden border border-white/10">
            <p className="text-xs text-spyder-gray uppercase tracking-widest p-3 pb-0">
              Radar
            </p>
            <iframe
              src="https://embed.windy.com/embed2.html?lat=38.103&lon=-92.627&detailLat=38.103&detailLon=-92.627&width=100%25&height=280&zoom=8&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=mph&metricTemp=%25C2%25B0F&radarRange=-1"
              className="w-full h-64 border-t border-white/10"
              title="Lake of the Ozarks Radar"
            />
          </div>
        </>
      )}
    </div>
  );
}

interface CondCardProps {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}

function CondCard({ label, value, note, highlight }: CondCardProps) {
  return (
    <div className="bg-spyder-black/40 rounded-lg p-3">
      <p className="text-[10px] text-spyder-gray uppercase tracking-wider mb-1">{label}</p>
      <p
        className="font-display text-lg font-bold leading-none"
        style={highlight ? { color: "#00d4ff", textShadow: "0 0 8px rgba(0,212,255,0.6)" } : { color: "white" }}
      >
        {value}
      </p>
      {note && <p className="text-[10px] text-spyder-gray/60 mt-1 leading-tight">{note}</p>}
    </div>
  );
}
