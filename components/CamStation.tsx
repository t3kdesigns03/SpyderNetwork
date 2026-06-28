"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Star, Search, Play, Pause, SkipBack, SkipForward,
  Map, Video, Thermometer, X, Cast, ExternalLink, ChevronDown, Zap, Loader2,
} from "lucide-react";
import { clsx } from "clsx";
import { ALL_CAMS, CAMS_BY_BUSINESS, CAM_BUSINESSES, HERO_CAM } from "@/lib/cams";
import { CamEmbed } from "./CamEmbed";
import type { Cam } from "@/types";

// ─── Interval options ─────────────────────────────────────────────────────────
const INTERVALS = [
  { label: "15s", value: 15 },
  { label: "30s", value: 30 },
  { label: "1m", value: 60 },
  { label: "2m", value: 120 },
  { label: "5m", value: 300 },
];

type Tab = "cams" | "map" | "conditions";

// ─── Main component ───────────────────────────────────────────────────────────
export function CamStation() {
  const [selected, setSelected] = useState<Cam | null>(null);
  const [enabled, setEnabled] = useState<Set<string>>(
    () => new Set(ALL_CAMS.map((c) => c.id))
  );
  // Track which business groups are expanded (all open by default)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(CAM_BUSINESSES)
  );
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isCycling, setIsCycling] = useState(false);
  const [cycleMode, setCycleMode] = useState<"selected" | "favorites">("selected");
  const [intervalSecs, setIntervalSecs] = useState(30);
  const [elapsed, setElapsed] = useState(0);
  const [search, setSearch] = useState("");
  const [favOnly, setFavOnly] = useState(false);
  const [tab, setTab] = useState<Tab>("cams");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Scroll selected row into view
  useEffect(() => {
    if (!selected) return;
    document
      .getElementById(`cam-row-${selected.id}`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
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
    <div className="flex flex-col" style={{ height: "calc(100dvh - 56px)" }}>
      {/* ── Tab bar ─────────────────────────────────────── */}
      <div className="flex shrink-0 border-b border-white/10 bg-spyder-black">
        {(
          [
            { key: "cams", label: "CAMS", Icon: Video },
            { key: "map", label: "MAP", Icon: Map },
            { key: "conditions", label: "CONDITIONS", Icon: Thermometer },
          ] as const
        ).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-widest border-b-2 transition-all min-h-[48px] touch-manipulation",
              tab === key
                ? "text-white border-spyder-red"
                : "text-spyder-gray border-transparent hover:text-white hover:border-white/20"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{label}</span>
            <span className="xs:hidden">{label.slice(0, 4)}</span>
          </button>
        ))}
      </div>

      {/* ── CAMS tab ─────────────────────────────────────── */}
      {tab === "cams" && (
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">

          {/* LEFT: Player ──────────────────────────────── */}
          <div className="flex flex-col lg:flex-1 min-h-0">
            {/* Player header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-spyder-navy-card border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className={clsx("w-2 h-2 rounded-full shrink-0", selected ? "bg-spyder-red animate-pulse" : "bg-white/20")} />
                <span className="font-display font-bold text-white text-sm tracking-wider uppercase truncate">
                  {selected ? (
                    <>
                      {selected.business}
                      {selected.name && (
                        <span className="text-spyder-gray font-normal normal-case tracking-normal ml-2 text-xs">
                          — {selected.name}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-spyder-gray font-normal normal-case tracking-normal text-xs">
                      Select a cam from the list →
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {isCycling && cycleList.length > 0 && (
                  <span className="text-xs text-spyder-gray tabular-nums">
                    {cycleIdx + 1} / {cycleList.length}
                  </span>
                )}
                {selected?.twitchChannel && (
                  <a
                    href={`https://player.twitch.tv/?channel=${selected.twitchChannel}&parent=spydernetwork.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-spyder-gray hover:text-white transition-colors"
                    title="Cast to TV"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Cast className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Cast</span>
                  </a>
                )}
              </div>
            </div>

            {/* Video area — 16:9 on mobile (capped), fills remaining on desktop */}
            <div className="relative bg-black min-h-0 aspect-video max-h-[38svh] lg:max-h-none lg:flex-1 lg:aspect-auto">
              {selected ? (
                <CamEmbed cam={selected} key={selected.id} autoplay />
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
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-white/10 shrink-0">
              <div
                className="h-full bg-spyder-red transition-all duration-1000 ease-linear"
                style={{ width: isCycling ? `${progressPct}%` : "0%" }}
              />
            </div>

            {/* Controls bar */}
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-spyder-navy-card border-t border-white/10 shrink-0 min-h-[48px]">
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
              <div className="flex gap-1">
                {INTERVALS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setIntervalSecs(value)}
                    className={clsx(
                      "px-2 h-8 min-w-[32px] rounded text-xs font-mono transition-all touch-manipulation",
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
                    href={selected.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-spyder-gray hover:text-white transition-colors min-h-[36px] px-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Visit Site</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Cam list ────────────────────────────── */}
          <div className="flex flex-col w-full lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-l border-white/10 bg-spyder-navy-card min-h-0">

            {/* List header */}
            <div className="px-3 pt-3 pb-2 border-b border-white/10 shrink-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold tracking-widest text-white">
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
                      ? "bg-spyder-red border-spyder-red text-white"
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

            {/* Scrollable cam list */}
            <div className="flex-1 overflow-y-auto overscroll-contain pb-safe">

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
                  return (
                    <div key={biz}>
                      {/* Business group header */}
                      <button
                        onClick={() => toggleGroup(biz)}
                        className={clsx(
                          "w-full flex items-center gap-2 px-3 py-2.5 border-b border-white/5 transition-all min-h-[44px] touch-manipulation",
                          "bg-spyder-navy hover:bg-white/[0.04] active:bg-white/[0.07]"
                        )}
                      >
                        <ChevronDown
                          className={clsx(
                            "w-3.5 h-3.5 text-spyder-gray transition-transform shrink-0",
                            !isOpen && "-rotate-90"
                          )}
                        />
                        <span className="flex-1 text-left text-xs font-bold text-white tracking-wide truncate">
                          {biz}
                        </span>
                        <span className="text-xs text-spyder-gray shrink-0">
                          {cams.length}
                        </span>
                        {activeCam && (
                          <span className="w-1.5 h-1.5 rounded-full bg-spyder-red shrink-0 animate-pulse" />
                        )}
                      </button>
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

      {/* ── MAP tab ──────────────────────────────────────── */}
      {tab === "map" && <MapTab onSelectCam={(cam) => { setSelected(cam); setTab("cams"); }} />}

      {/* ── CONDITIONS tab ───────────────────────────────── */}
      {tab === "conditions" && <ConditionsTab />}
    </div>
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
        "flex items-center gap-2 px-3 py-2.5 border-b border-white/5 transition-all duration-150 min-h-[48px]",
        !showBusiness && "pl-7", // indent sub-cams under business header
        isSelected
          ? "bg-spyder-red/10 border-l-2 border-l-spyder-red"
          : "hover:bg-white/[0.04] border-l-2 border-l-transparent"
      )}
    >
      {/* Toggle switch */}
      <button
        onClick={onToggleEnabled}
        className={clsx(
          "relative shrink-0 w-9 h-5 rounded-full transition-colors duration-200 touch-manipulation",
          isEnabled ? "bg-spyder-red" : "bg-white/20"
        )}
        aria-label={isEnabled ? "Remove from cycle" : "Add to cycle"}
        aria-pressed={isEnabled}
      >
        <span
          className={clsx(
            "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
            isEnabled && "translate-x-4"
          )}
        />
      </button>

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
            <p className={clsx("text-sm font-medium leading-snug truncate transition-colors", isSelected ? "text-white" : "text-white/80")}>
              {cam.business}
            </p>
            <p className="text-xs text-spyder-gray truncate">{cam.name}</p>
          </>
        ) : (
          <p className={clsx("text-sm leading-snug truncate transition-colors", isSelected ? "text-white font-medium" : "text-spyder-gray")}>
            {cam.name}
          </p>
        )}
      </button>

      {/* Live indicator */}
      {cam.isLive && isSelected && (
        <span className="w-1.5 h-1.5 rounded-full bg-spyder-red shrink-0 animate-pulse" />
      )}
    </div>
  );
}

// ─── Map tab (inline, full height) ───────────────────────────────────────────
function MapTab({ onSelectCam }: { onSelectCam: (cam: Cam) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<import("leaflet").Map | null>(null);
  const [ready, setReady] = useState(false);
  const [hoveredCam, setHoveredCam] = useState<Cam | null>(null);

  const mappedCams = ALL_CAMS.filter((c) => c.lat && c.lng);

  const CAT_COLORS: Record<string, string> = {
    "bar-grill": "#cc0000",
    marina: "#0ea5e9",
    pool: "#22d3ee",
    dock: "#f5a623",
    stage: "#a855f7",
    shop: "#22c55e",
    "real-estate": "#f59e0b",
    radio: "#ec4899",
    "lake-view": "#64748b",
  };
  const CAT_EMOJI: Record<string, string> = {
    "bar-grill": "🍺", marina: "⛵", pool: "🏊", dock: "⚓",
    stage: "🎸", shop: "🛍️", "real-estate": "🏠", radio: "📻", "lake-view": "🌊",
  };

  useEffect(() => {
    if (leafletMapRef.current || !mapRef.current) return;
    let alive = true;

    (async () => {
      const L = (await import("leaflet")).default;
      // leaflet CSS loaded via globals.css
      if (!alive || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [38.175, -92.635],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.attribution({ position: "bottomleft", prefix: "© OpenStreetMap" }).addTo(map);

      for (const cam of mappedCams) {
        const color = CAT_COLORS[cam.category] ?? "#cc0000";
        const emoji = CAT_EMOJI[cam.category] ?? "📹";
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:34px;height:34px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.5),0 0 10px ${color}55;display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:13px">${emoji}</span></div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
        });
        L.marker([cam.lat!, cam.lng!], { icon })
          .addTo(map)
          .on("click", () => {
            setHoveredCam(cam);
            map.flyTo([cam.lat!, cam.lng!], 15, { animate: true, duration: 0.6 });
          });
      }

      leafletMapRef.current = map;
      setReady(true);
    })();

    return () => { alive = false; };
  }, []);

  useEffect(() => () => { leafletMapRef.current?.remove(); leafletMapRef.current = null; }, []);

  return (
    <div className="relative flex-1 bg-spyder-navy">
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-spyder-navy z-10">
          <div className="text-center">
            <Map className="w-8 h-8 text-spyder-red mx-auto mb-2 animate-bounce" />
            <p className="text-spyder-gray text-sm">Loading map…</p>
          </div>
        </div>
      )}

      {hoveredCam && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-72 z-20
                        bg-spyder-black/95 backdrop-blur border border-white/20 rounded-xl p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="font-semibold text-white text-sm">{hoveredCam.business}</p>
                   <p className="text-xs text-spyder-gray mt-0.5">{hoveredCam.name}</p>
              {hoveredCam.mile && (
                <p className="text-xs text-spyder-teal mt-1">Mile {hoveredCam.mile}</p>
              )}
            </div>
            <button onClick={() => setHoveredCam(null)} className="text-spyder-gray hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => { onSelectCam(hoveredCam); setHoveredCam(null); }}
            className="w-full btn-primary text-sm py-2.5"
          >
            <Play className="w-4 h-4 fill-white" />
            Watch Live
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ConditionsTab
// ─────────────────────────────────────────────────────────────────────────────
interface Conditions {
  waterTempF: number | null;
  airTempF: number | null;
  windSpeedMph: number | null;
  windDir: string | null;
  lakeLevel: number | null;
  lakeLevelNormal: number | null;
  weatherDesc: string | null;
  updatedAt: string | null;
}

function useConditions() {
  const [data, setData] = useState<Conditions>({
    waterTempF: null, airTempF: null, windSpeedMph: null, windDir: null,
    lakeLevel: null, lakeLevelNormal: null, weatherDesc: null, updatedAt: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // NOAA weather for Lake of the Ozarks area (Osage Beach, MO)
        const wRes = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=38.103&longitude=-92.627&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago"
        );
        const wJson = await wRes.json();

        // USGS lake level — Bagnell Dam gauge (site 06926510)
        const gRes = await fetch(
          "https://waterservices.usgs.gov/nwis/iv/?sites=06926510&parameterCd=00065&format=json&period=PT1H"
        );
        const gJson = await gRes.json();
        const timeSeries = gJson?.value?.timeSeries?.[0];
        const rawLevel = parseFloat(timeSeries?.values?.[0]?.value?.[0]?.value ?? "NaN");

        const windDegMap = (deg: number): string => {
          const dirs = ["N","NE","E","SE","S","SW","W","NW"];
          return dirs[Math.round(deg / 45) % 8];
        };

        if (!alive) return;
        setData({
          waterTempF: null, // USGS water temp gauge separate — placeholder
          airTempF: Math.round(wJson.current.temperature_2m),
          windSpeedMph: Math.round(wJson.current.wind_speed_10m),
          windDir: windDegMap(wJson.current.wind_direction_10m),
          lakeLevel: isNaN(rawLevel) ? null : Math.round(rawLevel * 10) / 10,
          lakeLevelNormal: 660.0, // Normal pool elevation ft NGVD
          weatherDesc: wJson.current.weather_code != null
            ? weatherCodeToDesc(wJson.current.weather_code)
            : null,
          updatedAt: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        });
      } catch {
        // Silently fail — UI shows dashes
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { data, loading };
}

function weatherCodeToDesc(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 9) return "Foggy";
  if (code <= 19) return "Drizzle";
  if (code <= 29) return "Rain";
  if (code <= 39) return "Snow";
  if (code <= 49) return "Fog";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 84) return "Rain Showers";
  if (code <= 94) return "Thunderstorms";
  return "Severe Storms";
}

function ConditionsTab() {
  const { data, loading } = useConditions();

  const fmt = (v: number | null, unit: string) =>
    v == null ? "—" : `${v}${unit}`;

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
        {data.updatedAt && (
          <span className="text-xs text-spyder-gray">Updated {data.updatedAt}</span>
        )}
      </div>

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
                note={data.windDir ?? undefined}
              />
              <CondCard label="Conditions" value={data.weatherDesc ?? "—"} />
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
              Normal pool elevation: 660 ft (NGVD). Data via USGS gauge at Bagnell Dam.
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
      <p className="text-xs text-spyder-gray mb-1">{label}</p>
      <p className={clsx("font-display font-bold text-lg", highlight ? "text-green-400" : "text-white")}>
        {value}
      </p>
      {note && <p className="text-xs text-spyder-gray mt-0.5">{note}</p>}
    </div>
  );
}
