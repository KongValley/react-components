import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons';
import { useControllableState } from '../../hooks/useControllableState';
import { cx } from '../../utils/cx';

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type' | 'value'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'small' | 'default';
  loading?: boolean;
  checkedChildren?: ReactNode;
  unCheckedChildren?: ReactNode;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onChange,
    size = 'default',
    loading = false,
    checkedChildren,
    unCheckedChildren,
    disabled = false,
    className,
    onClick,
    ...rest
  },
  ref,
) {
  const [checkedState, setChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange,
  });
  const isChecked = Boolean(checkedState);

  const hasLabel = checkedChildren !== undefined || unCheckedChildren !== undefined;

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-busy={loading || undefined}
      className={cx(
        'rc-switch',
        isChecked && 'rc-switch--checked',
        size === 'small' && 'rc-switch--small',
        loading && 'rc-switch--loading',
        disabled && 'rc-switch--disabled',
        className,
      )}
      disabled={disabled || loading}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setChecked(!isChecked);
      }}
      {...rest}
    >
      <span className="rc-switch__handle">
        {loading ? <Icon name="loading" spin size={size === 'small' ? 8 : 10} /> : null}
      </span>
      {hasLabel ? (
        <span className="rc-switch__label" aria-hidden="true">
          {isChecked ? checkedChildren : unCheckedChildren}
        </span>
      ) : null}
    </button>
  );
});
