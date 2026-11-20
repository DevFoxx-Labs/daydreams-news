/**
 * Reader preferences stored on the device.
 *
 * All of these are **strictly necessary** cookies/storage under the cookie
 * policy: they only remember a choice the reader made in the UI, carry no
 * identifier and are never shared. They therefore load before consent, and
 * are listed as such in the Cookie Policy.
 */

export const PREF_COOKIES = {
  /** FR-G4 — selected city for weather/AQI. */
  city: "ks_city",
  /** FR-H3 — selected state for the home strip. */
  state: "ks_state",
} as const;

export const PREF_STORAGE = {
  /** FR-A5 — article font-size step (0 | 1 | 2). */
  fontStep: "ks_font_step",
} as const;

export const COOKIE_MAX_AGE_YEAR = 60 * 60 * 24 * 365;

/** Reads a cookie in the browser. Returns null on the server. */
export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/**
 * Writes a preference cookie. `SameSite=Lax` and no `Secure` on localhost so
 * it works in development; in production the site is HTTPS-only.
 */
export function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE_YEAR}; SameSite=Lax${secure}`;
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}
