import { useCallback, useRef, useState, type SetStateAction } from 'react';

export interface UseControllableStateOptions<T> {
  /** Controlled value. Passing `undefined` switches to uncontrolled mode. */
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/**
 * Unifies controlled and uncontrolled state. The setter accepts a value or an
 * updater function, mirrors React's setState semantics and only notifies when
 * the value actually changes.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: SetStateAction<T>) => void] {
  const [innerValue, setInnerValue] = useState<T>(defaultValue);
  // Once a value prop has been supplied, the component stays controlled even if
  // the parent later passes undefined (e.g. a form field being reset).
  const wasControlledRef = useRef(value !== undefined);
  if (value !== undefined) wasControlledRef.current = true;
  const isControlled = wasControlledRef.current;
  const currentValue = isControlled ? (value as T) : innerValue;
  const currentRef = useRef(currentValue);
  currentRef.current = currentValue;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const resolved =
        typeof next === 'function'
          ? (next as (previous: T) => T)(currentRef.current)
          : next;

      if (Object.is(resolved, currentRef.current)) return;

      if (!isControlled) {
        setInnerValue(resolved);
      }
      onChangeRef.current?.(resolved);
    },
    [isControlled],
  );

  return [currentValue, setValue];
}
