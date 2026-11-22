export const canUseDOM = typeof window !== 'undefined' && typeof document !== 'undefined';

/** Best-effort, non-reactive reduced-motion check for imperative APIs. */
export function prefersReducedMotion(): boolean {
  if (!canUseDOM || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  'summary',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute('disabled') &&
      element.getAttribute('aria-hidden') !== 'true' &&
      (element.offsetParent !== null || element === document.activeElement),
  );
}

export function focusElement(element: HTMLElement | null | undefined): void {
  if (!element) return;
  element.focus({ preventScroll: true });
}

/** Measures the browser scrollbar width; returns 0 when it cannot be measured. */
export function getScrollbarWidth(): number {
  if (!canUseDOM) return 0;
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}
