import { forwardRef, useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons';
import { cx } from '../../utils/cx';

export type SpinSize = 'small' | 'default' | 'large';

const SIZE_MAP: Record<SpinSize, number> = {
  small: 14,
  default: 20,
  large: 28,
};

export interface SpinProps extends HTMLAttributes<HTMLDivElement> {
  spinning?: boolean;
  size?: SpinSize;
  tip?: ReactNode;
  /** Milliseconds to wait before showing the spinner (avoids flicker). */
  delay?: number;
  children?: ReactNode;
}

export const Spin = forwardRef<HTMLDivElement, SpinProps>(function Spin(
  {
    spinning = true,
    size = 'default',
    tip,
    delay = 0,
    className,
    children,
    ...rest
  },
  ref,
) {
  const [visible, setVisible] = useState(() => spinning && delay === 0);

  useEffect(() => {
    if (!spinning) {
      setVisible(false);
      return;
    }
    if (delay === 0) {
      setVisible(true);
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [spinning, delay]);

  const hasChildren = children !== undefined && children !== null;
  const iconSize = SIZE_MAP[size];

  const spinner = visible ? (
    <div className={cx('rcui-spin', `rcui-spin--${size}`, className)} role="status" aria-live="polite">
      <Icon name="loading" spin size={iconSize} className="rcui-spin__icon" />
      {tip !== undefined ? <div className="rcui-spin__tip">{tip}</div> : null}
    </div>
  ) : null;

  if (!hasChildren) {
    return <div ref={ref} {...rest}>{spinner}</div>;
  }

  return (
    <div
      ref={ref}
      className={cx('rcui-spin-wrapper', spinning && 'rcui-spin-wrapper--spinning')}
      aria-busy={spinning || undefined}
      {...rest}
    >
      <div className="rcui-spin-wrapper__content">{children}</div>
      {spinner ? <div className="rcui-spin-wrapper__overlay">{spinner}</div> : null}
    </div>
  );
});
