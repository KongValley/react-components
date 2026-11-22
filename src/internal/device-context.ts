import { createContext } from 'react';

export type DeviceType = 'mobile' | 'desktop';

export interface DeviceContextValue {
  /** Resolved device type. */
  device: DeviceType;
  isMobile: boolean;
  /** Viewport width below which `auto` mode resolves to mobile. */
  breakpoint: number;
  /** Whether adaptive components should switch to their mobile form. */
  adaptive: boolean;
  source: 'auto' | 'manual';
}

export const DEFAULT_MOBILE_BREAKPOINT = 768;

export const DeviceContext = createContext<DeviceContextValue | null>(null);
