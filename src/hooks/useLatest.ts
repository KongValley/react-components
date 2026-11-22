import { useRef } from 'react';

/** Keeps a mutable ref in sync with the latest render value. */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
