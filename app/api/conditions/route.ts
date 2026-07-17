import { NextResponse } from "next/server";

/**
 * GET /api/conditions
 * ─────────────────────────────────────────────────────────────────────────────
 * Live Lake of the Ozarks conditions for the Conditions tab. Runs server-side so
 * we can cache the response and keep third-party keys/URLs off the client.
 *
 * DATA SOURCES (all free, no API key):
 *   • Weather (air temp, humidity, wind, gusts, conditions)
 *       → Open-Meteo  https://open-meteo.com   (coords near Osage Beach, MO)
 *   • Lake level (pool elevation at Bagnell Dam)
 *       → NOAA National Water Prediction Service, gauge "lksm7"
 *         (Osage River at Bagnell Dam). observed.primary is the headwater/pool
 *         elevation in ft (~660 = normal pool). This is the only free source
 *         actually reporting current Lake of the Ozarks elevation — the USGS
 *         reservoir gauge (06925500) has stopped publishing recent values, and
 *         06926510 is a downstream river gauge (not the lake).
 *   • Water temperature → no reliable free lake source, returned as null so the
 *     UI can show "coming soon".
 *
 * Caching: revalidated every 10 minutes (route + upstream fetches) so we never
 * hammer the external APIs. Each source fails independently — if one is down its
 * fields come back null and the rest still render.
 */

export const revalidate = 600; // 10 minutes

// Osage Beach / Lake Ozark area.
const LAT = 38.15;
const LON = -92.62;
// Normal pool elevation for Lake of the Ozarks (ft above datum).
const NORMAL_POOL_FT = 660;

export interface ConditionsPayload {
  airTempF:           number | null;
  humidityPct:        number | null;
  windSpeedMph:       number | null;
  windGustMph:        number | null;
  windDir:            string | null; // compass, e.g. "NW"
  weatherDesc:        string | null; // e.g. "Partly Cloudy"
  waterTempF:         number | null; // null → "coming soon"
  lakeLevelFt:        number | null;
  lakeLevelNormalFt:  number;
  lakeLevelValidTime: string | null; // ISO time of the lake reading
  updatedAt:          string;        // ISO time this payload was built
  sources: { weather: boolean; lakeLevel: boolean };
}

// Degrees → 8-point compass.
function windDegToCompass(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

// WMO weather interpretation codes (Open-Meteo `weather_code`) → readable text.
const WMO_CODES: Record<number, string> = {
  0: "Clear", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime Fog",
  51: "Light Drizzle", 53: "Drizzle", 55: "Heavy Drizzle",
  56: "Freezing Drizzle", 57: "Freezing Drizzle",
  61: "Light Rain", 63: "Rain", 65: "Heavy Rain",
  66: "Freezing Rain", 67: "Freezing Rain",
  71: "Light Snow", 73: "Snow", 75: "Heavy Snow", 77: "Snow Grains",
  80: "Light Showers", 81: "Showers", 82: "Heavy Showers",
  85: "Snow Showers", 86: "Snow Showers",
  95: "Thunderstorm", 96: "Thunderstorm", 99: "Severe Thunderstorm",
};

type WeatherPart = Pick<
  ConditionsPayload,
  "airTempF" | "humidityPct" | "windSpeedMph" | "windGustMph" | "windDir" | "weatherDesc"
>;

async function fetchWeather(): Promise<WeatherPart> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code` +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago`;

  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`open-meteo ${res.status}`);
  const j = (await res.json()) as {
    current?: {
      temperature_2m?: number;
      relative_humidity_2m?: number;
      wind_speed_10m?: number;
      wind_gusts_10m?: number;
      wind_direction_10m?: number;
      weather_code?: number;
    };
  };
  const c = j.current ?? {};
  const round = (v: number | undefined) => (typeof v === "number" ? Math.round(v) : null);
  return {
    airTempF:     round(c.temperature_2m),
    humidityPct:  round(c.relative_humidity_2m),
    windSpeedMph: round(c.wind_speed_10m),
    windGustMph:  round(c.wind_gusts_10m),
    windDir:      typeof c.wind_direction_10m === "number" ? windDegToCompass(c.wind_direction_10m) : null,
    weatherDesc:  typeof c.weather_code === "number" ? (WMO_CODES[c.weather_code] ?? null) : null,
  };
}

type LakePart = Pick<ConditionsPayload, "lakeLevelFt" | "lakeLevelValidTime">;

async function fetchLakeLevel(): Promise<LakePart> {
  // NOAA NWPS gauge at Bagnell Dam. observed.primary = pool elevation (ft).
  const res = await fetch("https://api.water.noaa.gov/nwps/v1/gauges/lksm7", {
    next: { revalidate },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`nwps ${res.status}`);
  const j = (await res.json()) as {
    observed?: { primary?: number; primaryUnit?: string; validTime?: string };
    status?: { observed?: { primary?: number; validTime?: string } };
  };
  const obs = j.observed ?? j.status?.observed;
  const raw = obs?.primary;
  // NOAA uses -999 as its "no data" sentinel.
  if (typeof raw !== "number" || raw <= 0 || raw <= -900) {
    return { lakeLevelFt: null, lakeLevelValidTime: null };
  }
  return {
    lakeLevelFt: Math.round(raw * 10) / 10,
    lakeLevelValidTime: obs?.validTime ?? null,
  };
}

export async function GET() {
  // Fetch both sources independently — one failing must not sink the other.
  const [weatherRes, lakeRes] = await Promise.allSettled([fetchWeather(), fetchLakeLevel()]);

  const weather = weatherRes.status === "fulfilled" ? weatherRes.value : null;
  const lake = lakeRes.status === "fulfilled" ? lakeRes.value : null;

  const payload: ConditionsPayload = {
    airTempF:           weather?.airTempF ?? null,
    humidityPct:        weather?.humidityPct ?? null,
    windSpeedMph:       weather?.windSpeedMph ?? null,
    windGustMph:        weather?.windGustMph ?? null,
    windDir:            weather?.windDir ?? null,
    weatherDesc:        weather?.weatherDesc ?? null,
    waterTempF:         null, // no reliable free lake water-temp source yet
    lakeLevelFt:        lake?.lakeLevelFt ?? null,
    lakeLevelNormalFt:  NORMAL_POOL_FT,
    lakeLevelValidTime: lake?.lakeLevelValidTime ?? null,
    updatedAt:          new Date().toISOString(),
    sources: {
      weather: weather != null,
      lakeLevel: lake?.lakeLevelFt != null,
    },
  };

  return NextResponse.json(payload, {
    headers: {
      // Edge/CDN cache for 10 min, serve stale for another 5 while revalidating.
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
    },
  });
}
