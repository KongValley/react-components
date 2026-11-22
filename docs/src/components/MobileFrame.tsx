import type { CSSProperties, ReactNode } from 'react';

export interface MobileFrameProps {
  children: ReactNode;
  /** Height of the phone screen. Defaults to a responsive 440px minimum. */
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

/** Phone-sized preview frame used by the mobile component examples. */
export function MobileFrame({ children, height, className, style }: MobileFrameProps) {
  return (
    <div className={className ? `docs-phone ${className}` : 'docs-phone'}>
      <div
        className="docs-phone__screen"
        style={{ ...(height !== undefined ? { height } : null), ...style }}
      >
        {children}
      </div>
    </div>
  );
}
