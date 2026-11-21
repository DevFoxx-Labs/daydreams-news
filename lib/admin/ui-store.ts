"use client";

import { createClientStore } from "@/lib/client-store";

/**
 * Panel chrome preferences.
 *
 * Read through `useSyncExternalStore` rather than an effect: the server
 * renders the default, the browser swaps in the stored value on hydration,
 * and nothing cascades a render (the `react-hooks/set-state-in-effect` rule).
 *
 * The theme class itself is applied by the inline script in `app/admin/layout`
 * before paint, so there is no flash either way.
 */

export const THEME_KEY = "ks-admin-theme";
export const COLLAPSED_KEY = "ks-admin-sidebar-collapsed";

export const adminThemeStore = createClientStore<boolean>(
  () => document.documentElement.classList.contains("dark"),
  false,
);

export function setAdminTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch {
    // Storage blocked — the class still applies for this page view.
  }
  adminThemeStore.refresh();
}

export const adminSidebarStore = createClientStore<boolean>(() => {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}, false);

export function setSidebarCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(COLLAPSED_KEY, String(collapsed));
  } catch {
    // Ignored — the sidebar still toggles for this page view.
  }
  adminSidebarStore.refresh();
}
