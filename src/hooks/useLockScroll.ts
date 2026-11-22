import { useEffect } from 'react';
import { canUseDOM, getScrollbarWidth } from '../utils/dom';

let lockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

/** Locks body scrolling while enabled; nested locks are reference counted. */
export function useLockScroll(enabled: boolean): void {
  useEffect(() => {
    if (!enabled || !canUseDOM) return;

    const body = document.body;

    if (lockCount === 0) {
      originalOverflow = body.style.overflow;
      originalPaddingRight = body.style.paddingRight;
      const scrollbarWidth = getScrollbarWidth();
      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        const paddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
        body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
      }
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        body.style.overflow = originalOverflow;
        body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [enabled]);
}
