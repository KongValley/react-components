import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface PresenceState {
  /** Whether the element should be in the DOM at all. */
  mounted: boolean;
  /** Whether the "visible" class should be applied (drives CSS transitions). */
  active: boolean;
}

/**
 * Keeps an element mounted long enough to play its exit transition.
 *
 * - open=true  -> mount inactive, activate on the next frame
 * - open=false -> deactivate, unmount after `duration`
 */
export function usePresence(open: boolean, duration = 200): PresenceState {
  const [mounted, setMounted] = useState(open);
  const [active, setActive] = useState(open);
  const timeoutRef = useRef<number | undefined>(undefined);
  const frameRef = useRef<number | undefined>(undefined);
  const firstRunRef = useRef(true);
  const reducedMotion = useReducedMotion();
  const effectiveDuration = reducedMotion ? 0 : duration;

  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      if (open) return;
    }

    window.clearTimeout(timeoutRef.current);
    if (frameRef.current !== undefined) window.cancelAnimationFrame(frameRef.current);

    if (open) {
      setMounted(true);
      if (reducedMotion) {
        setActive(true);
        return;
      }
      setActive(false);
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = window.requestAnimationFrame(() => setActive(true));
      });
      return () => {
        if (frameRef.current !== undefined) window.cancelAnimationFrame(frameRef.current);
      };
    }

    setActive(false);
    if (mounted) {
      if (effectiveDuration <= 0) {
        setMounted(false);
        return;
      }
      timeoutRef.current = window.setTimeout(() => setMounted(false), effectiveDuration);
    }

    return () => {
      window.clearTimeout(timeoutRef.current);
    };
    // `mounted` intentionally excluded: toggling it must not restart the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, effectiveDuration, reducedMotion]);

  return { mounted, active };
}
