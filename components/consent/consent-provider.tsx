"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import {
  acceptAll,
  readConsent,
  readLocalLog,
  recordConsent,
  rejectAll,
} from "@/lib/consent/client";
import type {
  ConsentMethod,
  ConsentState,
  LocalConsentEntry,
} from "@/lib/consent/types";
import { createClientStore, useClientStore } from "@/lib/client-store";
import { NOTICE_VERSION_STRING } from "@/lib/legal/notices";

/**
 * Consent state for the whole app.
 *
 * The current choice and the local history live in an external store, read
 * through `useSyncExternalStore`: the server renders "not decided yet" and the
 * browser swaps in the real value on hydration, with no flash of the banner
 * for readers who already chose.
 *
 * `consent === null` means the reader has not decided → the banner shows.
 */

type ConsentSnapshot = {
  consent: ConsentState | null;
  history: LocalConsentEntry[];
};

/** Stable empty snapshot for the server render. */
const SERVER_SNAPSHOT: ConsentSnapshot = { consent: null, history: [] };

const consentStore = createClientStore<ConsentSnapshot>(
  () => ({ consent: readConsent(), history: readLocalLog() }),
  SERVER_SNAPSHOT,
);

type ConsentContextValue = {
  consent: ConsentState | null;
  /** False only once the browser has confirmed there is no stored choice. */
  decided: boolean;
  hydrated: boolean;
  history: LocalConsentEntry[];
  panelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  save: (next: ConsentState, method: ConsentMethod) => Promise<void>;
  acceptAllPurposes: (method: ConsentMethod) => Promise<void>;
  rejectAllPurposes: (method: ConsentMethod) => Promise<void>;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useClientStore(consentStore);
  const [panelOpen, setPanelOpen] = useState(false);
  const hydrated = snapshot !== SERVER_SNAPSHOT;

  const save = useCallback(
    async (next: ConsentState, method: ConsentMethod) => {
      const previous = snapshot.consent;
      setPanelOpen(false);
      await recordConsent(previous, next, method, NOTICE_VERSION_STRING);
      consentStore.refresh();

      // Withdrawal must take effect immediately: a purpose that was on and is
      // now off may already have loaded a third-party script, so reload once
      // to unload it and drop its cookies (global rule §4).
      const turnedOff = (["analytics", "ads", "personalisation"] as const).some(
        (purpose) => previous?.[purpose] === true && next[purpose] === false,
      );
      if (turnedOff) location.reload();
    },
    [snapshot.consent],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent: snapshot.consent,
      decided: snapshot.consent !== null,
      hydrated,
      history: snapshot.history,
      panelOpen,
      openPanel: () => setPanelOpen(true),
      closePanel: () => setPanelOpen(false),
      save,
      acceptAllPurposes: (method) => save(acceptAll(), method),
      rejectAllPurposes: (method) => save(rejectAll(), method),
    }),
    [snapshot, hydrated, panelOpen, save],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used inside <ConsentProvider>");
  }
  return context;
}
