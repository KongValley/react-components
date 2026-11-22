import { useCallback, useRef, type Ref, type RefCallback } from 'react';

/** Assigns one DOM node to several refs (callback or object refs). */
export function useMergedRef<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  const refsRef = useRef(refs);
  refsRef.current = refs;

  return useCallback((node: T | null) => {
    for (const ref of refsRef.current) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as { current: T | null }).current = node;
      }
    }
  }, []);
}
