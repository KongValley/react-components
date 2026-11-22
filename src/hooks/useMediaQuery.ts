import { useEffect, useState } from 'react';
import { canUseDOM } from '../utils/dom';

/** Tracks a CSS media query and re-renders when it changes. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (!canUseDOM || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!canUseDOM || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener?.(update);
    return () => media.removeListener?.(update);
  }, [query]);

  return matches;
}
