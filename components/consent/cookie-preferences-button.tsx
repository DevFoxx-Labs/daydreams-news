"use client";

import { useConsent } from "@/components/consent/consent-provider";
import { t } from "@/lib/i18n";

/**
 * "कुकी प्रेफ़रेंस" — in the footer of every page so the reader can reopen the
 * banner and change or withdraw consent at any time (global rule §4).
 */
export function CookiePreferencesButton({ className }: { className?: string }) {
  const { openPanel } = useConsent();
  return (
    <button
      type="button"
      onClick={openPanel}
      className={className ?? "text-start hover:text-white"}
    >
      {t.consent.managePreferences}
    </button>
  );
}
