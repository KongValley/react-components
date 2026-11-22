import { useEffect, type RefObject } from 'react';
import { canUseDOM } from '../utils/dom';
import { useLatest } from './useLatest';

type Target = RefObject<HTMLElement | null> | Array<RefObject<HTMLElement | null>>;

/**
 * Calls `handler` on pointer interactions outside every given ref. Useful for
 * popups where the trigger and the floating panel both count as "inside".
 */
export function useClickOutside(
  refs: Target,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true,
): void {
  const handlerRef = useLatest(handler);
  const refsRef = useLatest(refs);

  useEffect(() => {
    if (!enabled || !canUseDOM) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const list = Array.isArray(refsRef.current) ? refsRef.current : [refsRef.current];
      if (list.some((ref) => ref.current?.contains(target))) return;
      handlerRef.current(event);
    };

    document.addEventListener('mousedown', listener, true);
    document.addEventListener('touchstart', listener, { capture: true, passive: true });
    return () => {
      document.removeEventListener('mousedown', listener, true);
      document.removeEventListener('touchstart', listener, true);
    };
  }, [enabled, handlerRef, refsRef]);
}
