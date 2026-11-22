import { useEffect, type RefObject } from 'react';
import { canUseDOM, getFocusableElements } from '../utils/dom';

/**
 * Traps Tab focus within the container while enabled, focuses the first
 * focusable element on activation and restores focus to the previously active
 * element on deactivation.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): void {
  useEffect(() => {
    if (!enabled || !canUseDOM) return;
    const container = containerRef.current;
    if (!container) return;

    const previousActive = document.activeElement as HTMLElement | null;

    const focusFirst = () => {
      const focusable = getFocusableElements(container);
      const target = focusable[0] ?? container;
      target.focus({ preventScroll: true });
    };

    const frame = window.requestAnimationFrame(focusFirst);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || active === container) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    container.addEventListener('keydown', onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      container.removeEventListener('keydown', onKeyDown);
      if (previousActive && typeof previousActive.focus === 'function') {
        previousActive.focus({ preventScroll: true });
      }
    };
  }, [containerRef, enabled]);
}
