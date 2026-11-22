import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'horizontal' | 'vertical';
  /** Position of the text when children are provided. */
  orientation?: 'left' | 'center' | 'right';
  dashed?: boolean;
  /** Renders the text in a lighter, smaller style. */
  plain?: boolean;
  children?: ReactNode;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  {
    type = 'horizontal',
    orientation = 'center',
    dashed = false,
    plain = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const vertical = type === 'vertical';
  const hasText = !vertical && children !== undefined && children !== null;

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      className={cx(
        'rc-divider',
        vertical && 'rc-divider--vertical',
        !vertical && 'rc-divider--horizontal',
        dashed && 'rc-divider--dashed',
        hasText && 'rc-divider--with-text',
        hasText && `rc-divider--${orientation}`,
        plain && 'rc-divider--plain',
        className,
      )}
      {...rest}
    >
      {hasText ? <span className="rc-divider__text">{children}</span> : null}
    </div>
  );
});
