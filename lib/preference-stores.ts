"use client";

import { createClientStore } from "@/lib/client-store";
import { PREF_COOKIES, PREF_STORAGE, readCookie, writeCookie } from "@/lib/preferences";
import { site } from "@/lib/site";

/**
 * Stores for the reader's saved preferences (strictly necessary storage).
 * Defined once so the utility bar, the home strip and the mobile menu all
 * read and write the same value.
 */

export const cityStore = createClientStore<string>(
  () => readCookie(PREF_COOKIES.city) ?? "nayi-dilli",
  "nayi-dilli",
);

export function setCity(slug: string) {
  writeCookie(PREF_COOKIES.city, slug);
  cityStore.refresh();
}

export const stateStore = createClientStore<string>(
  () => readCookie(PREF_COOKIES.state) ?? site.defaultStateSlug,
  site.defaultStateSlug,
);

export function setStatePreference(slug: string) {
  writeCookie(PREF_COOKIES.state, slug);
  stateStore.refresh();
}

/** FR-A5 — article font-size step (0 | 1 | 2). */
export const fontStepStore = createClientStore<number>(() => {
  try {
    const raw = localStorage.getItem(PREF_STORAGE.fontStep);
    const parsed = Number.parseInt(raw ?? "0", 10);
    return Number.isFinite(parsed) && parsed >= 0 && parsed <= 2 ? parsed : 0;
  } catch {
    return 0;
  }
}, 0);

export function setFontStep(step: number) {
  try {
    localStorage.setItem(PREF_STORAGE.fontStep, String(step));
  } catch {
    // Storage blocked — the choice still applies to this page view.
  }
  fontStepStore.refresh();
}
