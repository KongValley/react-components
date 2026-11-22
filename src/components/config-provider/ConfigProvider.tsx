import { useEffect, useMemo, type ReactNode } from 'react';
import {
  DEFAULT_MOBILE_BREAKPOINT,
  DeviceContext,
  type DeviceContextValue,
  type DeviceType,
} from '../../internal/device-context';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { canUseDOM } from '../../utils/dom';

export type ConfigProviderDevice = 'auto' | DeviceType;

export interface ConfigProviderProps {
  children?: ReactNode;
  /** `auto` follows the viewport; `mobile` / `desktop` force a device. */
  device?: ConfigProviderDevice;
  /** Viewport width used by `device="auto"`. */
  breakpoint?: number;
  /** Makes adaptive components (Modal, Select) use their mobile form. */
  adaptive?: boolean;
  /** Mirrors the resolved device to `data-rcui-device` on `<html>`. */
  applyToRoot?: boolean;
}

/**
 * Supplies multi-device context for adaptive components. Components can also
 * detect the viewport on their own, so this provider is optional.
 */
export function ConfigProvider({
  children,
  device = 'auto',
  breakpoint = DEFAULT_MOBILE_BREAKPOINT,
  adaptive = false,
  applyToRoot = false,
}: ConfigProviderProps) {
  const safeBreakpoint =
    Number.isFinite(breakpoint) && breakpoint > 0
      ? breakpoint
      : DEFAULT_MOBILE_BREAKPOINT;
  const autoMobile = useMediaQuery(
    `(max-width: ${Math.max(0, safeBreakpoint - 0.5)}px)`,
  );
  const resolvedDevice: DeviceType =
    device === 'auto' ? (autoMobile ? 'mobile' : 'desktop') : device;

  useEffect(() => {
    if (!applyToRoot || !canUseDOM) return;
    const root = document.documentElement;
    const previous = root.getAttribute('data-rcui-device');
    root.setAttribute('data-rcui-device', resolvedDevice);
    return () => {
      if (previous === null) root.removeAttribute('data-rcui-device');
      else root.setAttribute('data-rcui-device', previous);
    };
  }, [applyToRoot, resolvedDevice]);

  const value = useMemo<DeviceContextValue>(
    () => ({
      device: resolvedDevice,
      isMobile: resolvedDevice === 'mobile',
      breakpoint: safeBreakpoint,
      adaptive,
      source: device === 'auto' ? 'auto' : 'manual',
    }),
    [resolvedDevice, safeBreakpoint, adaptive, device],
  );

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}
