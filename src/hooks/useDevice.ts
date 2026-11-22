import { useContext, useMemo } from 'react';
import {
  DEFAULT_MOBILE_BREAKPOINT,
  DeviceContext,
  type DeviceContextValue,
} from '../internal/device-context';
import { useMediaQuery } from './useMediaQuery';

/**
 * Resolves the current device. Uses the nearest `ConfigProvider` when present,
 * otherwise falls back to automatic viewport detection.
 */
export function useDevice(): DeviceContextValue {
  const context = useContext(DeviceContext);
  const breakpoint = context?.breakpoint ?? DEFAULT_MOBILE_BREAKPOINT;
  const autoMobile = useMediaQuery(
    `(max-width: ${Math.max(0, breakpoint - 0.5)}px)`,
  );

  const fallback = useMemo<DeviceContextValue>(
    () => ({
      device: autoMobile ? 'mobile' : 'desktop',
      isMobile: autoMobile,
      breakpoint,
      adaptive: false,
      source: 'auto',
    }),
    [autoMobile, breakpoint],
  );

  return context ?? fallback;
}
