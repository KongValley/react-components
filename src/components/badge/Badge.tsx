import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count?: ReactNode;
  dot?: boolean;
  overflowCount?: number;
  showZero?: boolean;
  /** Custom badge color (CSS color). */
  color?: string;
  /** Wraps children and anchors the badge to their top-right corner. */
  children?: ReactNode;
}

function formatCount(count: ReactNode, overflowCount: number): ReactNode {
  if (typeof count === 'number' && count > overflowCount) return `${overflowCount}+`;
  return count;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    count,
    dot = false,
    overflowCount = 99,
    showZero = false,
    color,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const hasChildren = children !== undefined && children !== null;
  const hidden =
    !dot &&
    (count === null ||
      count === undefined ||
      count === '' ||
      (count === 0 && !showZero));

  const badge = hidden ? null : (
    <span
      key={dot ? 'dot' : String(count)}
      className={cx('rc-badge__count', dot && 'rc-badge__count--dot')}
      style={color ? { background: color } : undefined}
    >
      {dot ? null : formatCount(count, overflowCount)}
    </span>
  );

  if (!hasChildren) {
    return (
      <span
        ref={ref}
        className={cx('rc-badge', 'rc-badge--standalone', className)}
        style={style}
        {...rest}
      >
        {badge}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={cx('rc-badge', 'rc-badge--wrapper', className)}
      style={style}
      {...rest}
    >
      {children}
      {badge}
    </span>
  );
});
