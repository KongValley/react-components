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
        'rcui-divider',
        vertical && 'rcui-divider--vertical',
        !vertical && 'rcui-divider--horizontal',
        dashed && 'rcui-divider--dashed',
        hasText && 'rcui-divider--with-text',
        hasText && `rcui-divider--${orientation}`,
        plain && 'rcui-divider--plain',
        className,
      )}
      {...rest}
    >
      {hasText ? <span className="rcui-divider__text">{children}</span> : null}
    </div>
  );
});
