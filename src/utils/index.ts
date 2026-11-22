export { cx, type ClassValue } from './cx';
export { canUseDOM, getFocusableElements, focusElement, getScrollbarWidth } from './dom';
export {
  getValue,
  setValue,
  toPath,
  isNil,
  isEmptyValue,
  type NamePath,
} from './object';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === null || value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { then?: unknown }).then === 'function'
  );
}
