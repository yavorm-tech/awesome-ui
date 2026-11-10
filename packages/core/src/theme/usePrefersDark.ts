import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-color-scheme: dark)';

const noop = () => undefined;
const noopSubscribe = () => noop;

function subscribe(onChange: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return noop;
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => {
    media.removeEventListener('change', onChange);
  };
}

const getSnapshot = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(QUERY).matches
    : false;

const getServerSnapshot = () => false;

/** Whether the OS prefers a dark color scheme. Only subscribes when `enabled`. */
export function usePrefersDark(enabled: boolean): boolean {
  return useSyncExternalStore(
    enabled ? subscribe : noopSubscribe,
    enabled ? getSnapshot : getServerSnapshot,
    getServerSnapshot,
  );
}
