import { cacheLife } from "next/cache";

import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { weatherCities } from "@/lib/data/states";
import { t } from "@/lib/i18n";
import type {
  Aqi,
  AqiLevel,
  Market,
  Scorecard,
  ServiceResult,
  Weather,
} from "./types";

/**
 * Mock widget adapters (FR-U1, FR-U3, FR-U4).
 *
 * Each function is the seam where a real provider plugs in: replace the body
 * with a fetch (cached, timed out, failing closed) and drop `isDemo`. Until
 * then every widget is labelled "डेमो" in the UI.
 *
 * `cacheLife('minutes')` matches the 30-minute cache the PRD asks for while
 * staying prerenderable; the real adapters should use `cacheTag` per city so
 * they can be revalidated independently.
 */

const DEMO_WEATHER: Record<string, Omit<Weather, "city" | "cityName">> = {
  "nayi-dilli": { tempC: 18, condition: "कोहरा", icon: "fog", minC: 8, maxC: 21 },
  lucknow: { tempC: 16, condition: "कोहरा", icon: "fog", minC: 7, maxC: 20 },
  patna: { tempC: 19, condition: "धुंध", icon: "fog", minC: 9, maxC: 23 },
  jaipur: { tempC: 20, condition: "साफ़", icon: "sun", minC: 10, maxC: 25 },
  bhopal: { tempC: 21, condition: "आंशिक बादल", icon: "cloud", minC: 11, maxC: 26 },
  mumbai: { tempC: 29, condition: "साफ़", icon: "sun", minC: 23, maxC: 32 },
  kolkata: { tempC: 24, condition: "आंशिक बादल", icon: "cloud", minC: 17, maxC: 28 },
  bengaluru: { tempC: 23, condition: "बादल", icon: "cloud", minC: 17, maxC: 27 },
  dehradun: { tempC: 14, condition: "ठंडी हवा", icon: "snow", minC: 6, maxC: 19 },
  ranchi: { tempC: 17, condition: "साफ़", icon: "sun", minC: 9, maxC: 24 },
};

const DEMO_AQI: Record<string, number> = {
  "nayi-dilli": 212,
  lucknow: 186,
  patna: 164,
  jaipur: 132,
  bhopal: 98,
  mumbai: 121,
  kolkata: 148,
  bengaluru: 74,
  dehradun: 88,
  ranchi: 96,
};

export function aqiLevel(value: number): { level: AqiLevel; label: string } {
  if (value <= 50) return { level: "good", label: t.widgets.aqiGood };
  if (value <= 100)
    return { level: "satisfactory", label: t.widgets.aqiSatisfactory };
  if (value <= 200) return { level: "moderate", label: t.widgets.aqiModerate };
  if (value <= 300) return { level: "poor", label: t.widgets.aqiPoor };
  if (value <= 400) return { level: "veryPoor", label: t.widgets.aqiVeryPoor };
  return { level: "severe", label: t.widgets.aqiSevere };
}

function resolveCity(slug: string) {
  return (
    weatherCities.find((c) => c.slug === slug) ?? weatherCities[0]
  );
}

export async function getWeather(
  citySlug: string,
): Promise<ServiceResult<Weather>> {
  "use cache";
  cacheLife("minutes");
  const city = resolveCity(citySlug);
  const demo = DEMO_WEATHER[city.slug] ?? DEMO_WEATHER["nayi-dilli"];
  return {
    data: { city: city.slug, cityName: city.name, ...demo },
    updatedAt: MOCK_NOW_ISO,
    isDemo: true,
  };
}

export async function getAqi(citySlug: string): Promise<ServiceResult<Aqi>> {
  "use cache";
  cacheLife("minutes");
  const city = resolveCity(citySlug);
  const value = DEMO_AQI[city.slug] ?? 150;
  const { level, label } = aqiLevel(value);
  return {
    data: { city: city.slug, cityName: city.name, value, level, label },
    updatedAt: MOCK_NOW_ISO,
    isDemo: true,
  };
}

export async function getMarket(): Promise<ServiceResult<Market>> {
  "use cache";
  cacheLife("minutes");
  return {
    data: {
      delayMinutes: 15,
      rows: [
        { key: "sensex", label: t.widgets.sensex, value: 80_412, changePercent: 0.74 },
        { key: "nifty", label: t.widgets.nifty, value: 24_310, changePercent: 0.68 },
        {
          key: "gold",
          label: t.widgets.gold,
          value: 76_250,
          changePercent: -1.2,
          isCurrency: true,
        },
        {
          key: "silver",
          label: t.widgets.silver,
          value: 89_100,
          changePercent: -0.9,
          isCurrency: true,
        },
      ],
    },
    updatedAt: MOCK_NOW_ISO,
    isDemo: true,
  };
}

export async function getScorecard(): Promise<ServiceResult<Scorecard>> {
  "use cache";
  cacheLife("minutes");
  return {
    data: {
      matchLabel: "दूसरा वनडे · सैंपल स्कोर",
      status: "live",
      teams: [
        { name: "भारत", chip: "#ff9933", score: "287/4", overs: "42.3" },
        { name: "विपक्षी टीम", chip: "#ffcd00", score: "—" },
      ],
      statusLine: "भारत ने टॉस जीतकर बल्लेबाज़ी चुनी",
    },
    updatedAt: MOCK_NOW_ISO,
    isDemo: true,
  };
}
