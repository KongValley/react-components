import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { Icon } from '../../icons';
import { useControllableState } from '../../hooks/useControllableState';
import { cx } from '../../utils/cx';
import type { InputSize, InputStatus } from '../input/Input';

export interface InputNumberProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'type'
  > {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  size?: InputSize;
  status?: InputStatus;
  /** Shows the up/down stepper buttons. */
  controls?: boolean;
  /** Formats the displayed value, e.g. thousands separators. */
  formatter?: (value: number | string) => string;
  /** Converts user input back to a number. Required when formatter is used. */
  parser?: (display: string) => number | string;
  onPressEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

function normalize(value: number, min?: number, max?: number, precision?: number): number {
  let next = value;
  if (typeof precision === 'number') {
    const factor = 10 ** precision;
    next = Math.round(next * factor) / factor;
  }
  if (typeof min === 'number' && next < min) next = min;
  if (typeof max === 'number' && next > max) next = max;
  return next;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  function InputNumber(
    {
      value,
      defaultValue,
      onChange,
      min,
      max,
      step = 1,
      precision,
      size = 'middle',
      status,
      controls = true,
      formatter,
      parser,
      onPressEnter,
      disabled = false,
      readOnly = false,
      className,
      style,
      onFocus,
      onBlur,
      onKeyDown,
      ...rest
    },
    forwardedRef,
  ) {
    const [numeric, setNumeric] = useControllableState<number | null>({
      value,
      defaultValue: defaultValue ?? null,
      onChange,
    });
    const focusedRef = useRef(false);
    const currentValue = numeric ?? null;

    const format = (input: number | null): string => {
      if (input === null || Number.isNaN(input)) return '';
      const text = typeof precision === 'number' ? input.toFixed(precision) : String(input);
      return formatter ? formatter(text) : text;
    };

    const parse = (display: string): number | null => {
      const trimmed = display.trim();
      if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') return null;
      const parsed = parser ? parser(trimmed) : Number(trimmed.replace(/,/g, ''));
      const result = typeof parsed === 'number' ? parsed : Number(parsed);
      return Number.isFinite(result) ? result : null;
    };

    const [display, setDisplay] = useState<string>(() => format(currentValue));

    // Keep the text in sync when the value changes externally and the field is
    // not being edited.
    useEffect(() => {
      if (focusedRef.current) return;
      setDisplay(format(currentValue));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValue, precision, formatter]);

    const commit = () => {
      const parsed = parse(display);
      const next = parsed === null ? null : normalize(parsed, min, max, precision);
      if (!Object.is(next, currentValue)) setNumeric(next);
      setDisplay(format(next));
    };

    const changeBy = (direction: 1 | -1) => {
      const base = currentValue ?? (direction > 0 ? (min ?? 0) : (max ?? 0));
      const next = normalize(base + direction * step, min, max, precision);
      setNumeric(next);
      setDisplay(format(next));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        changeBy(1);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        changeBy(-1);
      } else if (event.key === 'Enter') {
        commit();
        onPressEnter?.(event);
      } else if (event.key === 'Escape') {
        setDisplay(format(currentValue));
      }
    };

    const upDisabled = disabled || (max !== undefined && currentValue !== null && currentValue >= max);
    const downDisabled = disabled || (min !== undefined && currentValue !== null && currentValue <= min);

    return (
      <span
        className={cx(
          'rc-input-number',
          size !== 'middle' && `rc-input-number--${size}`,
          status && `rc-input-number--${status}`,
          disabled && 'rc-input-number--disabled',
          className,
        )}
        style={style}
      >
        <input
          ref={forwardedRef}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          role="spinbutton"
          className="rc-input-number__inner"
          value={display}
          disabled={disabled}
          readOnly={readOnly}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue ?? undefined}
          aria-invalid={status === 'error' || undefined}
          onChange={(event) => {
            const raw = event.target.value;
            setDisplay(raw);
            const parsed = parse(raw);
            if (parsed !== null) setNumeric(parsed);
            else if (raw.trim() === '') setNumeric(null);
          }}
          onFocus={(event) => {
            focusedRef.current = true;
            onFocus?.(event);
          }}
          onBlur={(event) => {
            focusedRef.current = false;
            commit();
            onBlur?.(event);
          }}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        {controls ? (
          <span className="rc-input-number__controls" aria-hidden="true">
            <button
              type="button"
              tabIndex={-1}
              className="rc-input-number__control"
              disabled={upDisabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => changeBy(1)}
            >
              <Icon name="chevron-up" size={12} />
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="rc-input-number__control"
              disabled={downDisabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => changeBy(-1)}
            >
              <Icon name="chevron-down" size={12} />
            </button>
          </span>
        ) : null}
      </span>
    );
  },
);
