import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { Icon } from '../../icons';
import { useMergedRef } from '../../hooks/useMergedRef';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils';

export type InputSize = 'small' | 'middle' | 'large';
export type InputStatus = 'error' | 'warning';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?: InputSize;
  status?: InputStatus;
  allowClear?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  /** Shows current length / maxLength beneath the control. */
  showCount?: boolean;
  onPressEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: InputSize;
  status?: InputStatus;
  /** Grows with content; optionally clamps between minRows and maxRows. */
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  showCount?: boolean;
}

export interface PasswordProps extends Omit<InputProps, 'type'> {
  visibilityToggle?: boolean;
  iconRender?: (visible: boolean) => ReactNode;
}

function useNativeValue(
  value: string | number | readonly string[] | undefined,
  defaultValue: string | number | readonly string[] | undefined,
) {
  const [inner, setInner] = useState<string | number | readonly string[]>(defaultValue ?? '');
  const wasControlledRef = useRef(value !== undefined);
  if (value !== undefined) wasControlledRef.current = true;
  const isControlled = wasControlledRef.current;
  const current = isControlled ? (value ?? '') : inner;
  return { current, isControlled, setInner };
}

/** Clears a native input in a way React's change event system observes. */
function clearNativeInput(input: HTMLInputElement | HTMLTextAreaElement) {
  const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement;
  const setter = Object.getOwnPropertyDescriptor(proto.prototype, 'value')?.set;
  if (setter) setter.call(input, '');
  else input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

const InputRoot = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'middle',
    status,
    allowClear = false,
    prefix,
    suffix,
    addonBefore,
    addonAfter,
    showCount = false,
    onPressEnter,
    onClear,
    disabled = false,
    readOnly = false,
    maxLength,
    value,
    defaultValue,
    onChange,
    onKeyDown,
    className,
    style,
    ...rest
  },
  forwardedRef,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(inputRef, forwardedRef);
  const { current, isControlled, setInner } = useNativeValue(value, defaultValue);

  const displayValue = current === undefined ? '' : String(current);
  const showClear = allowClear && displayValue.length > 0 && !disabled && !readOnly;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInner(event.target.value);
    onChange?.(event);
  };

  const handleClear = () => {
    if (!inputRef.current) return;
    clearNativeInput(inputRef.current);
    onClear?.();
    inputRef.current.focus({ preventScroll: true });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.key === 'Enter' && !event.defaultPrevented) onPressEnter?.(event);
  };

  return (
    <span
      className={cx(
        'rcui-input',
        size !== 'middle' && `rcui-input--${size}`,
        status && `rcui-input--${status}`,
        disabled && 'rcui-input--disabled',
        readOnly && 'rcui-input--readonly',
        (addonBefore !== undefined || addonAfter !== undefined) && 'rcui-input--group',
        className,
      )}
      style={style}
    >
      {addonBefore !== undefined ? (
        <span className="rcui-input__addon rcui-input__addon--before">{addonBefore}</span>
      ) : null}
      <span className="rcui-input__affix">
        {prefix !== undefined ? <span className="rcui-input__prefix">{prefix}</span> : null}
        <input
          ref={mergedRef}
          className="rcui-input__inner"
          value={current as string | number | undefined}
          defaultValue={undefined}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          aria-invalid={status === 'error' || undefined}
          {...rest}
        />
        {suffix !== undefined ? <span className="rcui-input__suffix">{suffix}</span> : null}
        {showCount ? (
          <span className="rcui-input__count">
            {displayValue.length}
            {maxLength ? ` / ${maxLength}` : ''}
          </span>
        ) : null}
        {showClear ? (
          <button
            type="button"
            className="rcui-input__clear"
            aria-label="Clear input"
            tabIndex={-1}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleClear}
          >
            <Icon name="close" size={12} />
          </button>
        ) : null}
      </span>
      {addonAfter !== undefined ? (
        <span className="rcui-input__addon rcui-input__addon--after">{addonAfter}</span>
      ) : null}
    </span>
  );
});

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    size = 'middle',
    status,
    autoSize = false,
    showCount = false,
    disabled = false,
    maxLength,
    value,
    defaultValue,
    onChange,
    className,
    style,
    rows,
    ...rest
  },
  forwardedRef,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mergedRef = useMergedRef(textareaRef, forwardedRef);
  const { current, isControlled, setInner } = useNativeValue(value, defaultValue);
  const displayValue = current === undefined ? '' : String(current);

  useIsomorphicLayoutEffect(() => {
    if (!autoSize) return;
    const element = textareaRef.current;
    if (!element) return;

    element.style.height = 'auto';
    const style = window.getComputedStyle(element);
    const lineHeight = Number.parseFloat(style.lineHeight) || 20;
    const padding =
      (Number.parseFloat(style.paddingTop) || 0) +
      (Number.parseFloat(style.paddingBottom) || 0) +
      (Number.parseFloat(style.borderTopWidth) || 0) +
      (Number.parseFloat(style.borderBottomWidth) || 0);
    const options = typeof autoSize === 'object' ? autoSize : {};
    const minHeight = options.minRows ? options.minRows * lineHeight + padding : 0;
    const maxHeight = options.maxRows ? options.maxRows * lineHeight + padding : Number.POSITIVE_INFINITY;
    const height = clamp(element.scrollHeight, minHeight, maxHeight);

    element.style.height = `${height}px`;
    element.style.overflowY = element.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [autoSize, displayValue]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setInner(event.target.value);
    onChange?.(event);
  };

  return (
    <span
      className={cx(
        'rcui-textarea',
        size !== 'middle' && `rcui-textarea--${size}`,
        status && `rcui-textarea--${status}`,
        disabled && 'rcui-textarea--disabled',
        autoSize && 'rcui-textarea--autosize',
        className,
      )}
      style={style}
    >
      <textarea
        ref={mergedRef}
        className="rcui-textarea__inner"
        value={current as string | number | undefined}
        defaultValue={undefined}
        onChange={handleChange}
        disabled={disabled}
        maxLength={maxLength}
        rows={autoSize ? 1 : (rows ?? 3)}
        aria-invalid={status === 'error' || undefined}
        {...rest}
      />
      {showCount ? (
        <span className="rcui-textarea__count">
          {displayValue.length}
          {maxLength ? ` / ${maxLength}` : ''}
        </span>
      ) : null}
    </span>
  );
});

const Password = forwardRef<HTMLInputElement, PasswordProps>(function Password(
  { visibilityToggle = true, iconRender, suffix, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);

  const toggle = visibilityToggle ? (
    <button
      type="button"
      className="rcui-input__action"
      aria-label={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
      tabIndex={-1}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => setVisible((previous) => !previous)}
    >
      {iconRender ? iconRender(visible) : <Icon name={visible ? 'eye-off' : 'eye'} size={16} />}
    </button>
  ) : null;

  return (
    <Input
      ref={ref}
      type={visible ? 'text' : 'password'}
      suffix={
        <>
          {suffix}
          {toggle}
        </>
      }
      {...rest}
    />
  );
});

type InputComponent = ForwardRefExoticComponent<InputProps & RefAttributes<HTMLInputElement>> & {
  TextArea: typeof TextArea;
  Password: typeof Password;
};

export const Input = Object.assign(InputRoot, { TextArea, Password }) as InputComponent;
