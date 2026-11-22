import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons';
import { cx } from '../../utils/cx';

export interface CellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  /** Secondary text on the right side of the title row. */
  value?: ReactNode;
  icon?: ReactNode;
  /** Free-form trailing content, rendered before the arrow. */
  extra?: ReactNode;
  arrow?: boolean;
  /** Defaults to true when an `onClick` handler is provided. */
  clickable?: boolean;
  disabled?: boolean;
  align?: 'center' | 'start';
}

/**
 * A single row in a mobile list. Clickable cells are keyboard operable and
 * expose a button role.
 */
export const Cell = forwardRef<HTMLDivElement, CellProps>(function Cell(
  {
    title,
    description,
    value,
    icon,
    extra,
    arrow = false,
    clickable,
    disabled = false,
    align = 'center',
    className,
    children,
    onClick,
    onKeyDown,
    tabIndex,
    ...rest
  },
  ref,
) {
  const isClickable = !disabled && (clickable ?? onClick !== undefined);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !isClickable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        'rcui-cell',
        `rcui-cell--align-${align}`,
        isClickable && 'rcui-cell--clickable',
        disabled && 'rcui-cell--disabled',
        className,
      )}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? (tabIndex ?? 0) : tabIndex}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
    >
      {icon !== undefined ? <span className="rcui-cell__icon">{icon}</span> : null}
      <div className="rcui-cell__body">
        {title !== undefined || value !== undefined ? (
          <div className="rcui-cell__line">
            <span className="rcui-cell__title">{title}</span>
            {value !== undefined ? <span className="rcui-cell__value">{value}</span> : null}
          </div>
        ) : null}
        {description !== undefined ? (
          <div className="rcui-cell__description">{description}</div>
        ) : null}
        {children}
      </div>
      {extra !== undefined ? <span className="rcui-cell__extra">{extra}</span> : null}
      {arrow ? (
        <span className="rcui-cell__arrow" aria-hidden="true">
          <Icon name="chevron-right" size={16} />
        </span>
      ) : null}
    </div>
  );
});
