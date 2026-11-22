import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Icon } from '../../icons';
import { useControllableState } from '../../hooks/useControllableState';
import { useLatest } from '../../hooks/useLatest';
import { cx } from '../../utils/cx';

export interface StepperProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Decimal places to keep. Defaults to the precision of `step`. */
  precision?: number;
  disabled?: boolean;
  readOnly?: boolean;
  /** Width of the editable value input. */
  inputWidth?: number | string;
  /** Accelerates while a button is held down. Defaults to true. */
  longPress?: boolean;
}

const HOLD_DELAY = 450;
const REPEAT_INTERVAL = 80;

/** Compact quantity stepper with direct input and press-and-hold acceleration. */
export const Stepper = forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  {
    value,
    defaultValue = 0,
    onChange,
    min = 0,
    max = Number.POSITIVE_INFINITY,
    step = 1,
    precision,
    disabled = false,
    readOnly = false,
    inputWidth,
    longPress = true,
    className,
    ...rest
  },
  ref,
) {
  const stepValue = step > 0 ? step : 1;
  const decimals =
    precision ??
    (() => {
      const text = String(stepValue);
      const dot = text.indexOf('.');
      return dot >= 0 ? text.length - dot - 1 : 0;
    })();

  const round = (input: number) => {
    const factor = 10 ** decimals;
    return Math.round((input + Number.EPSILON) * factor) / factor;
  };
  const clamp = (input: number) => round(Math.min(max, Math.max(min, input)));

  const [currentValue, setCurrentValue] = useControllableState({
    value,
    defaultValue: clamp(defaultValue),
    onChange,
  });
  const [draft, setDraft] = useState<string | null>(null);
  const holdTimerRef = useRef<number | undefined>(undefined);
  const repeatTimerRef = useRef<number | undefined>(undefined);

  const format = (input: number) => {
    if (decimals > 0) return input.toFixed(decimals);
    return String(round(input));
  };

  const applyDelta = (delta: number) => {
    if (disabled) return;
    setDraft(null);
    setCurrentValue(clamp(currentValue + delta));
  };
  const applyDeltaRef = useLatest(applyDelta);
  const currentValueRef = useLatest(currentValue);

  const stopRepeat = () => {
    window.clearTimeout(holdTimerRef.current);
    window.clearInterval(repeatTimerRef.current);
    holdTimerRef.current = undefined;
    repeatTimerRef.current = undefined;
  };

  useEffect(() => stopRepeat, []);

  const startPress = (delta: number) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (disabled || event.button !== 0) return;
    applyDelta(delta);
    if (!longPress) return;
    stopRepeat();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    holdTimerRef.current = window.setTimeout(() => {
      repeatTimerRef.current = window.setInterval(() => {
        const current = currentValueRef.current;
        if ((delta > 0 && current >= max) || (delta < 0 && current <= min)) {
          stopRepeat();
          return;
        }
        applyDeltaRef.current(delta);
      }, REPEAT_INTERVAL);
    }, HOLD_DELAY);
  };

  const commitDraft = () => {
    if (draft === null) return;
    const parsed = Number(draft);
    if (draft.trim() !== '' && Number.isFinite(parsed)) {
      setCurrentValue(clamp(parsed));
    }
    setDraft(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitDraft();
      event.currentTarget.blur();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setDraft(null);
      event.currentTarget.blur();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      applyDelta(stepValue);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      applyDelta(-stepValue);
    }
  };

  const display = draft ?? format(currentValue);
  const atMin = currentValue <= min;
  const atMax = currentValue >= max;
  const decreaseDisabled = disabled || atMin;
  const increaseDisabled = disabled || atMax;

  const inputStyle: CSSProperties | undefined =
    inputWidth !== undefined ? { width: inputWidth } : undefined;
  const inputLabel =
    typeof rest['aria-label'] === 'string' ? rest['aria-label'] : 'Value';

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('rc-stepper', disabled && 'rc-stepper--disabled', className)}
      role="group"
    >
      <button
        type="button"
        className="rc-stepper__button"
        aria-label="Decrease value"
        disabled={decreaseDisabled}
        onPointerDown={startPress(-stepValue)}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        onLostPointerCapture={stopRepeat}
        onClick={(event) => {
          // Keyboard activation (Enter/Space) has no pointer event.
          if (event.detail === 0) applyDelta(-stepValue);
        }}
      >
        <Icon name="minus" size={16} />
      </button>
      <input
        className="rc-stepper__input"
        style={inputStyle}
        type="text"
        inputMode="decimal"
        aria-label={inputLabel}
        value={display}
        disabled={disabled}
        readOnly={readOnly}
        onFocus={() => {
          setDraft(format(currentValue));
        }}
        onBlur={() => {
          commitDraft();
        }}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={readOnly ? undefined : handleKeyDown}
      />
      <button
        type="button"
        className="rc-stepper__button"
        aria-label="Increase value"
        disabled={increaseDisabled}
        onPointerDown={startPress(stepValue)}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        onLostPointerCapture={stopRepeat}
        onClick={(event) => {
          if (event.detail === 0) applyDelta(stepValue);
        }}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
});
