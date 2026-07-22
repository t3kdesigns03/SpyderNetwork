"use client";

import { useCallback, useEffect, useState } from "react";
import { CAMS, HERO_CAM } from "@/lib/cams";

/**
 * /admin/viewers — internal live monitor for the viewer-competition system.
 * Read-only. Polls /api/debug/viewers every ~12s and renders the current hero
 * plus a table of every camera with active viewers. No auth (internal use).
 */

type Row = { camId: string; viewers: number };
type Data = {
  totalActiveViewers: number;
  cameras: Row[];
  currentHero: string;
  generatedAt: string;
};

const REFRESH_MS = 12_000;

// camId → friendly "Business – View" label (falls back to the raw id).
const NAME_BY_ID = new Map(
  CAMS.map((c) => [c.id, c.name ? `${c.business} – ${c.name}` : c.business])
);
const friendly = (id: string) => NAME_BY_ID.get(id) ?? id;

export function ViewersDashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const [needsSecret, setNeedsSecret] = useState(false);

  const load = useCallback(async () => {
    try {
      // The debug endpoint is gated by CRON_SECRET. Pass it through from this
      // page's own ?secret= param so the operator supplies it via the URL
      // (kept out of the client bundle).
      const secret = new URLSearchParams(window.location.search).get("secret") ?? "";
      const url = secret
        ? `/api/debug/viewers?secret=${encodeURIComponent(secret)}`
        : "/api/debug/viewers";
      const res = await fetch(url, { cache: "no-store" });
      if (res.status === 401) {
        setNeedsSecret(true);
        setError(true);
        return;
      }
      if (!res.ok) throw new Error(`status ${res.status}`);
      const json = (await res.json()) as Data;
      setData(json);
      setError(false);
      setNeedsSecret(false);
      setUpdatedAt(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const heroId = data?.currentHero ?? HERO_CAM.id;
  const heroViewers = data?.cameras.find((c) => c.camId === heroId)?.viewers ?? 0;
  const cameras = data?.cameras ?? [];
  const total = data?.totalActiveViewers ?? 0;

  return (
    <main className="min-h-screen bg-spyder-navy text-white px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="font-display text-lg sm:text-xl font-bold uppercase tracking-widest text-white">
              Viewer Monitor
            </h1>
            <p className="text-xs text-spyder-gray mt-0.5">Live viewer-competition status · internal</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-spyder-gray">
            <span className="w-1.5 h-1.5 rounded-full bg-spyder-red animate-pulse" />
            auto · {Math.round(REFRESH_MS / 1000)}s
          </span>
        </div>

        {/* Current hero */}
        <div
          className="rounded-xl border p-4 sm:p-5 mb-6"
          style={{
            borderColor: "rgba(204,0,0,0.4)",
            background: "linear-gradient(90deg, rgba(204,0,0,0.10), rgba(13,21,38,0.6))",
            boxShadow: "0 0 20px rgba(204,0,0,0.12)",
          }}
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-spyder-red mb-1">
            Current Featured / Hero
          </p>
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-white truncate">{friendly(heroId)}</p>
              <p className="text-xs font-mono text-spyder-gray truncate mt-0.5">{heroId}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display text-3xl font-bold leading-none text-white tabular-nums">
                {heroViewers}
              </p>
              <p className="text-[11px] uppercase tracking-wider text-spyder-gray mt-1">
                viewer{heroViewers === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>

        {/* Error banner (non-blocking — last good data stays on screen) */}
        {needsSecret ? (
          <p className="text-xs text-spyder-red/90 mb-4">
            This page is protected. Open it as{" "}
            <span className="font-mono">/admin/viewers?secret=YOUR_CRON_SECRET</span>.
          </p>
        ) : error ? (
          <p className="text-xs text-spyder-red/90 mb-4">
            Couldn&apos;t reach the viewer feed on the last refresh — showing the most recent data.
          </p>
        ) : null}

        {/* Table / empty state */}
        {loading && !data ? (
          <p className="text-sm text-spyder-gray py-10 text-center">Loading…</p>
        ) : cameras.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] py-14 px-6 text-center">
            <p className="text-white font-semibold">No active viewers right now</p>
            <p className="text-sm text-spyder-gray mt-1">
              Nobody is watching any camera. Rows will appear here as sessions come online.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-spyder-gray bg-white/[0.03]">
                  <th className="font-semibold px-3 sm:px-4 py-2.5 w-8">#</th>
                  <th className="font-semibold px-1 py-2.5">Camera</th>
                  <th className="font-semibold px-3 sm:px-4 py-2.5 text-right w-20">Viewers</th>
                </tr>
              </thead>
              <tbody>
                {cameras.map((row, i) => {
                  const isHero = row.camId === heroId;
                  return (
                    <tr
                      key={row.camId}
                      className="border-t border-white/5"
                      style={
                        isHero
                          ? { background: "rgba(204,0,0,0.08)", boxShadow: "inset 3px 0 0 #ff1a1a" }
                          : undefined
                      }
                    >
                      <td className="px-3 sm:px-4 py-2.5 text-xs font-mono text-spyder-gray tabular-nums align-middle">
                        {i + 1}
                      </td>
                      <td className="px-1 py-2.5 align-middle min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          {isHero && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-spyder-red border border-spyder-red/40 rounded px-1 py-[1px] shrink-0">
                              Hero
                            </span>
                          )}
                          <span className="text-sm font-medium text-white truncate">
                            {friendly(row.camId)}
                          </span>
                        </div>
                        <span className="block text-[11px] font-mono text-spyder-gray/80 truncate mt-0.5">
                          {row.camId}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2.5 text-right align-middle">
                        <span className="font-display text-base font-bold text-white tabular-nums">
                          {row.viewers}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer meta */}
        <div className="flex items-center justify-between gap-3 mt-4 text-[11px] text-spyder-gray">
          <span className="tabular-nums">
            {total} active viewer{total === 1 ? "" : "s"} · {cameras.length} camera
            {cameras.length === 1 ? "" : "s"}
          </span>
          <span>
            {updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : "—"}
          </span>
        </div>
      </div>
    </main>
  );
}
