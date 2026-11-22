import { useEffect } from 'react';
import { canUseDOM } from '../utils/dom';
import { useLatest } from './useLatest';

/** Invokes `handler` when Escape is pressed while enabled. */
export function useEscapeKey(handler: (event: KeyboardEvent) => void, enabled = true): void {
  const handlerRef = useLatest(handler);

  useEffect(() => {
    if (!enabled || !canUseDOM) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' && event.key !== 'Esc') return;
      handlerRef.current(event);
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [enabled, handlerRef]);
}
