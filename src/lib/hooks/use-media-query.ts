'use client';

import { useCallback, useSyncExternalStore } from 'react';

const subscribeToHydration = () => () => {};

/**
 * Subscribes to a media query without a mount-time state update.
 * The server snapshot is always `false`, so components must not rely on the
 * value for critical markup that has to match before hydration.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onStoreChange);
      return () => mediaQuery.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** False during SSR and hydration, true once the client is running. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
}
