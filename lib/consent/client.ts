"use client";

import {
  DEFAULT_CONSENT,
  OPTIONAL_PURPOSES,
  type ConsentMethod,
  type ConsentState,
  type LocalConsentEntry,
} from "./types";

/** The purposes that map onto a cookie category in `ConsentState`. */
type CookiePurpose = keyof ConsentState;

/**
 * Browser-side consent storage.
 *
 * - `dn_consent` cookie: the current choice, so the server could read it later.
 * - `dn_visitor` cookie: an anonymous id that links the reader's ledger rows.
 * - `dn_consent_log` localStorage: the reader's own timestamped history, which
 *   the "आपकी सहमतियां" page shows them (global rule §3).
 *
 * All three are strictly necessary and listed in the Cookie Policy.
 */

export const CONSENT_COOKIE = "dn_consent";
export const VISITOR_COOKIE = "dn_visitor";
export const CONSENT_LOG_KEY = "dn_consent_log";

const YEAR = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${YEAR}; SameSite=Lax${secure}`;
}

function getCookie(name: string): string | null {
  const row = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));
  return row ? decodeURIComponent(row.slice(name.length + 1)) : null;
}

/** `null` means the reader has not decided yet → show the banner. */
export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const raw = getCookie(CONSENT_COOKIE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      necessary: true,
      analytics: parsed.analytics === true,
      ads: parsed.ads === true,
      personalisation: parsed.personalisation === true,
    };
  } catch {
    return null;
  }
}

export function writeConsent(state: ConsentState) {
  setCookie(CONSENT_COOKIE, JSON.stringify(state));
}

export function getVisitorId(): string {
  const existing = getCookie(VISITOR_COOKIE);
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `v-${Math.random().toString(36).slice(2)}-${Date.now()}`;
  setCookie(VISITOR_COOKIE, id);
  return id;
}

export function readLocalLog(): LocalConsentEntry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(CONSENT_LOG_KEY);
    return raw ? (JSON.parse(raw) as LocalConsentEntry[]) : [];
  } catch {
    return [];
  }
}

function appendLocalLog(entries: LocalConsentEntry[]) {
  if (typeof localStorage === "undefined") return;
  try {
    const next = [...entries, ...readLocalLog()].slice(0, 200);
    localStorage.setItem(CONSENT_LOG_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked — the server ledger is the record of truth.
  }
}

/**
 * Records a decision: writes the cookie, appends to the local history and
 * sends one append-only row per purpose to the server ledger.
 */
export async function recordConsent(
  previous: ConsentState | null,
  next: ConsentState,
  method: ConsentMethod,
  noticeVersion: string,
): Promise<void> {
  writeConsent(next);

  const createdAt = new Date().toISOString();
  const entries: LocalConsentEntry[] = OPTIONAL_PURPOSES.map((purpose) => {
    const granted = next[purpose as keyof ConsentState] === true;
    const wasGranted = previous?.[purpose as keyof ConsentState] === true;
    const status = granted ? "granted" : wasGranted ? "withdrawn" : "denied";
    return { purpose, status, method, noticeVersion, createdAt };
  });

  appendLocalLog(entries);

  try {
    await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: getVisitorId(),
        method,
        noticeVersion,
        purposes: entries.map(({ purpose, status }) => ({ purpose, status })),
      }),
      keepalive: true,
    });
  } catch {
    // Never block the reader's choice on a network failure; the cookie and the
    // local history already reflect it and the UI stops the trackers at once.
  }
}

export const acceptAll = (): ConsentState => ({
  necessary: true,
  analytics: true,
  ads: true,
  personalisation: true,
});

export const rejectAll = (): ConsentState => ({ ...DEFAULT_CONSENT });

/** Whether a cookie category is currently allowed to load its scripts. */
export function allowed(
  state: ConsentState | null,
  purpose: CookiePurpose,
): boolean {
  if (purpose === "necessary") return true;
  return state?.[purpose] === true;
}
