import { useEffect, useState } from 'react';
import { canUseDOM } from '../utils/dom';

const QUERY = '(prefers-reduced-motion: reduce)';

/** Tracks the user's reduced-motion preference, including live changes. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (!canUseDOM || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (!canUseDOM || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia(QUERY);
    const onChange = () => setReduced(media.matches);
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}
