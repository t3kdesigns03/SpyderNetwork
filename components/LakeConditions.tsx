"use client";

import { useState, useEffect } from "react";
import { Thermometer, Wind, Droplets, Activity, RefreshCw, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import type { LakeConditions } from "@/types";

const USGS_STATION = "06926510"; // Lake of the Ozarks at Bagnell Dam

async function fetchLakeConditions(): Promise<Partial<LakeConditions>> {
  try {
    // USGS Water Services API – publicly available, no key needed
    const res = await fetch(
      `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${USGS_STATION}&parameterCd=00065,00060&siteStatus=all`,
      { next: { revalidate: 900 } } // 15 min cache
    );
    if (!res.ok) throw new Error("USGS fetch failed");
    const data = await res.json();
    const timeSeries = data?.value?.timeSeries ?? [];

    let lakeLevelFt: number | null = null;
    let dischargeCfs: number | null = null;

    for (const ts of timeSeries) {
      const code = ts?.variable?.variableCode?.[0]?.value;
      const val = parseFloat(ts?.values?.[0]?.value?.[0]?.value ?? "");
      if (!isNaN(val)) {
        if (code === "00065") lakeLevelFt = val;
        if (code === "00060") dischargeCfs = val;
      }
    }

    return { lakeLevelFt, dischargeCfs };
  } catch {
    return {};
  }
}

async function fetchWeather(): Promise<Partial<LakeConditions>> {
  try {
    // Open-Meteo – free, no key needed. Lat/lng: Lake Ozarks area
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=38.18&longitude=-92.63&current=temperature_2m,wind_speed_10m,wind_direction_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=1",
      { next: { revalidate: 900 } }
    );
    if (!res.ok) throw new Error("Weather fetch failed");
    const data = await res.json();
    const c = data?.current;
    const windDirs = ["N","NE","E","SE","S","SW","W","NW"];
    const dir = windDirs[Math.round((c?.wind_direction_10m ?? 0) / 45) % 8];
    return {
      airTempF: c?.temperature_2m ? Math.round(c.temperature_2m) : null,
      windMph: c?.wind_speed_10m ? Math.round(c.wind_speed_10m) : null,
      windDirection: dir,
    };
  } catch {
    return {};
  }
}

export function LakeConditions() {
  const [conditions, setConditions] = useState<Partial<LakeConditions>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [expanded, setExpanded] = useState(true);

  const load = async () => {
    setLoading(true);
    const [weather, usgs] = await Promise.all([fetchWeather(), fetchLakeConditions()]);
    setConditions({ ...weather, ...usgs });
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15 * 60 * 1000); // refresh every 15 min
    return () => clearInterval(interval);
  }, []);

  const stats: {
    label: string;
    value: string;
    unit?: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[] = [
    {
      label: "Air Temp",
      value: conditions.airTempF != null ? `${conditions.airTempF}` : "--",
      unit: "°F",
      icon: Thermometer,
      color: "text-orange-400",
    },
    {
      label: "Water Temp",
      value: conditions.waterTempF != null ? `${conditions.waterTempF}` : "--",
      unit: "°F",
      icon: Droplets,
      color: "text-spyder-teal",
    },
    {
      label: "Wind",
      value: conditions.windMph != null
        ? `${conditions.windMph}${conditions.windDirection ? ` ${conditions.windDirection}` : ""}`
        : "--",
      unit: "mph",
      icon: Wind,
      color: "text-green-400",
    },
    {
      label: "Lake Level",
      value: conditions.lakeLevelFt != null ? `${conditions.lakeLevelFt.toFixed(1)}` : "--",
      unit: "ft",
      icon: Activity,
      color: "text-blue-400",
    },
  ];

  return (
    <section id="conditions" className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="glass-panel overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-4 sm:py-5 text-left
                     hover:bg-white/5 transition-colors touch-manipulation min-h-[60px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-spyder-teal/20 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-spyder-teal" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white tracking-wide text-base sm:text-lg">
                Lake Conditions
              </h2>
              <p className="text-xs text-spyder-gray">
                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : "Loading…"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); load(); }}
              className={clsx(
                "w-8 h-8 flex items-center justify-center rounded-lg text-spyder-gray hover:text-white",
                "hover:bg-white/10 transition-all touch-manipulation",
                loading && "animate-spin"
              )}
              aria-label="Refresh conditions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <ChevronDown
              className={clsx(
                "w-5 h-5 text-spyder-gray transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
          </div>
        </button>

        {/* Stats grid */}
        {expanded && (
          <div className="border-t border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/10">
              {stats.map(({ label, value, unit, icon: Icon, color }) => (
                <div key={label} className="px-4 py-5 flex flex-col items-center gap-1 text-center">
                  <Icon className={clsx("w-5 h-5 mb-1", color)} />
                  <div className="flex items-baseline gap-0.5">
                    <span
                      className={clsx(
                        "font-display font-bold text-2xl sm:text-3xl text-white tabular-nums",
                        loading && "opacity-40 animate-pulse"
                      )}
                    >
                      {value}
                    </span>
                    {unit && value !== "--" && (
                      <span className="text-sm text-spyder-gray">{unit}</span>
                    )}
                  </div>
                  <span className="text-xs text-spyder-gray">{label}</span>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="px-4 py-2 border-t border-white/5 text-xs text-spyder-gray/60 text-center">
              Weather via Open-Meteo · Lake level via USGS · Refreshes every 15 min
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
