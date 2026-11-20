"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny external store for values that live in cookies or localStorage.
 *
 * Reading those during render is not allowed (the server has no `document`),
 * and reading them in an effect with `setState` causes a cascading render.
 * `useSyncExternalStore` is the supported way: the server renders the default,
 * the client swaps in the stored value on hydration, and `set()` notifies
 * every component that uses the same store.
 */
export type ClientStore<T> = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  /** Re-read the source and notify subscribers. */
  refresh: () => void;
};

export function createClientStore<T>(
  read: () => T,
  serverValue: T,
): ClientStore<T> {
  const listeners = new Set<() => void>();
  let cache: T = serverValue;
  let primed = false;

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      if (!primed) {
        cache = read();
        primed = true;
      }
      return cache;
    },
    getServerSnapshot: () => serverValue,
    refresh() {
      cache = read();
      primed = true;
      for (const listener of listeners) listener();
    },
  };
}

export function useClientStore<T>(store: ClientStore<T>): T {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}
