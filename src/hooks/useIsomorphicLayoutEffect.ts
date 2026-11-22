import { useEffect, useLayoutEffect } from 'react';
import { canUseDOM } from '../utils/dom';

/** useLayoutEffect on the client, useEffect during SSR to avoid warnings. */
export const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
