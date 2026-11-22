import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export type SafeAreaPosition = 'top' | 'bottom' | 'both';

export interface SafeAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Which edges should respect the device safe area. */
  position?: SafeAreaPosition;
}

/**
 * Padding placeholder for notches and home indicators. Uses
 * `env(safe-area-inset-*)` through the shared `--rcui-safe-area-*` tokens, so it
 * degrades to 0px on devices without insets.
 */
export const SafeArea = forwardRef<HTMLDivElement, SafeAreaProps>(function SafeArea(
  { position = 'bottom', className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('rcui-safe-area', `rcui-safe-area--${position}`, className)}
      {...rest}
    />
  );
});
