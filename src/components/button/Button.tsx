import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons';
import { cx } from '../../utils/cx';

export type ButtonVariant = 'default' | 'primary' | 'dashed' | 'text' | 'link';
export type ButtonSize = 'small' | 'middle' | 'large';
export type ButtonShape = 'default' | 'round' | 'circle';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Visual style of the button. */
  variant?: ButtonVariant;
  /** Applies the danger (destructive) color treatment. */
  danger?: boolean;
  size?: ButtonSize;
  shape?: ButtonShape;
  /** Shows a spinner and disables interaction. */
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  /** Stretches the button to the full width of its container. */
  block?: boolean;
  /** Native button type. */
  htmlType?: 'button' | 'submit' | 'reset';
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'default',
    danger = false,
    size = 'middle',
    shape = 'default',
    loading = false,
    icon,
    iconPosition = 'start',
    block = false,
    htmlType = 'button',
    disabled = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const iconOnly = children === null || children === undefined || children === false;
  const showSpinner = loading;
  const startIcon = showSpinner ? <Icon name="loading" spin /> : iconPosition === 'start' ? icon : null;
  const endIcon = !showSpinner && iconPosition === 'end' ? icon : null;

  return (
    <button
      ref={ref}
      type={htmlType}
      className={cx(
        'rcui-btn',
        `rcui-btn--${variant}`,
        size !== 'middle' && `rcui-btn--${size}`,
        danger && 'rcui-btn--danger',
        shape !== 'default' && `rcui-btn--${shape}`,
        block && 'rcui-btn--block',
        loading && 'rcui-btn--loading',
        iconOnly && 'rcui-btn--icon-only',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {startIcon ? <span className="rcui-btn__icon">{startIcon}</span> : null}
      {iconOnly ? null : <span className="rcui-btn__content">{children}</span>}
      {endIcon ? <span className="rcui-btn__icon">{endIcon}</span> : null}
    </button>
  );
});
