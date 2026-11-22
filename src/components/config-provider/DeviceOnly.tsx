import type { ReactNode } from 'react';
import { useDevice } from '../../hooks/useDevice';

export interface DeviceOnlyProps {
  children?: ReactNode;
  /** Rendered when the current device does not match. */
  fallback?: ReactNode;
}

/** Renders its children only when the resolved device is mobile. */
export function MobileOnly({ children, fallback = null }: DeviceOnlyProps) {
  const { isMobile } = useDevice();
  return <>{isMobile ? children : fallback}</>;
}

/** Renders its children only when the resolved device is desktop. */
export function DesktopOnly({ children, fallback = null }: DeviceOnlyProps) {
  const { isMobile } = useDevice();
  return <>{isMobile ? fallback : children}</>;
}
