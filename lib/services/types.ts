/**
 * Widget service contracts (PRD §11, FR-U1 … FR-U4).
 *
 * Every widget reads through one of these adapters. The mock adapter sets
 * `isDemo: true`, which the UI must surface as a visible "डेमो" label, and
 * every payload carries `updatedAt` so no widget can show stale data without
 * an "अपडेटेड <time>" stamp (FR-H7).
 */

export type ServiceResult<T> = {
  data: T;
  updatedAt: string;
  isDemo: boolean;
};

export type Weather = {
  city: string;
  cityName: string;
  tempC: number;
  condition: string;
  /** Single glyph used in the compact utility bar. */
  icon: "sun" | "cloud" | "rain" | "fog" | "snow";
  minC: number;
  maxC: number;
};

export type AqiLevel =
  | "good"
  | "satisfactory"
  | "moderate"
  | "poor"
  | "veryPoor"
  | "severe";

export type Aqi = {
  city: string;
  cityName: string;
  value: number;
  level: AqiLevel;
  label: string;
};

export type MarketRow = {
  key: "sensex" | "nifty" | "gold" | "silver";
  label: string;
  value: number;
  changePercent: number;
  /** Currency values render with ₹; index values don't. */
  isCurrency?: boolean;
};

export type Market = {
  rows: MarketRow[];
  /** FR-U4 — delay must be disclosed. */
  delayMinutes: number;
};

export type ScoreTeam = {
  name: string;
  /** Flat colour chip instead of a real flag — no third-party emblems. */
  chip: string;
  score?: string;
  overs?: string;
};

export type Scorecard = {
  matchLabel: string;
  status: "live" | "upcoming" | "ended";
  teams: ScoreTeam[];
  statusLine: string;
};
