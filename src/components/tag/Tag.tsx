import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { Icon } from '../../icons';
import { cx } from '../../utils/cx';

export type TagColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

const PRESET_COLORS = new Set<string>([
  'default',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
]);

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Preset name or any CSS color (hex, rgb, hsl, ...). */
  color?: TagColor | string;
  bordered?: boolean;
  closable?: boolean;
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
  icon?: ReactNode;
  children?: ReactNode;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    color = 'default',
    bordered = false,
    closable = false,
    onClose,
    icon,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const isPreset = PRESET_COLORS.has(color);
  const customStyle = !isPreset
    ? ({ ...style, '--rc-tag-color': color } as React.CSSProperties)
    : style;

  return (
    <span
      ref={ref}
      className={cx(
        'rc-tag',
        isPreset && `rc-tag--${color}`,
        !isPreset && 'rc-tag--custom',
        bordered && 'rc-tag--bordered',
        closable && 'rc-tag--closable',
        className,
      )}
      style={customStyle}
      {...rest}
    >
      {icon !== undefined ? <span className="rc-tag__icon">{icon}</span> : null}
      <span className="rc-tag__content">{children}</span>
      {closable ? (
        <button
          type="button"
          className="rc-tag__close"
          aria-label="Remove tag"
          onClick={(event) => {
            event.stopPropagation();
            onClose?.(event);
          }}
        >
          <Icon name="close" size={12} />
        </button>
      ) : null}
    </span>
  );
});
