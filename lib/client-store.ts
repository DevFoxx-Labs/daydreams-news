"use client";

import { useState, useSyncExternalStore } from "react";

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

const ALWAYS_FALSE = () => false;

/** One mount flag per component instance, flipped when React subscribes. */
function createMountStore() {
  const listeners = new Set<() => void>();
  let mounted = false;

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (!mounted) {
        mounted = true;
        for (const notify of listeners) notify();
      }
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => mounted,
  };
}

/**
 * `false` on the server **and on the hydration render**, `true` from the first
 * render after this component mounted.
 *
 * Why this exists rather than reading a store value directly: a component
 * inside a `<Suspense>` boundary can hydrate *after* an unrelated store has
 * already swapped in its browser value (the provider above the boundary
 * hydrates first). The boundary's render then produces more markup than the
 * server sent, and React reports a hydration mismatch. Gating on a flag that
 * is always `false` during hydration keeps the two renders identical, and the
 * real value is applied in the commit right after.
 */
export function useHasMounted(): boolean {
  const [store] = useState(createMountStore);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, ALWAYS_FALSE);
}
