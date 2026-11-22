import {
  forwardRef,
  useRef,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons';
import { useControllableState } from '../../hooks/useControllableState';
import { useMergedRef } from '../../hooks/useMergedRef';
import { cx } from '../../utils/cx';

export interface SearchBarProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'size' | 'onSubmit'
  > {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onCancel?: () => void;
  cancelText?: ReactNode;
  showCancel?: boolean;
  allowClear?: boolean;
}

/** Touch-friendly search input with clear and cancel actions. */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  {
    value,
    defaultValue = '',
    onChange,
    onSearch,
    onCancel,
    cancelText = 'Cancel',
    showCancel = true,
    allowClear = true,
    placeholder = 'Search',
    disabled = false,
    className,
    style,
    onFocus,
    onBlur,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const [currentValue, setCurrentValue] = useControllableState({
    value,
    defaultValue,
    onChange,
  });
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(forwardedRef, inputRef);

  const handleClear = () => {
    setCurrentValue('');
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleCancel = () => {
    setCurrentValue('');
    inputRef.current?.blur();
    onCancel?.();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(currentValue);
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    // Do not submit while an IME composition is still active.
    if (event.key === 'Enter' && event.nativeEvent.isComposing) {
      event.preventDefault();
    }
  };

  return (
    <form
      className={cx(
        'rc-search-bar',
        focused && 'rc-search-bar--focused',
        disabled && 'rc-search-bar--disabled',
        className,
      )}
      style={style}
      role="search"
      onSubmit={handleSubmit}
    >
      <div className="rc-search-bar__field">
        <span className="rc-search-bar__icon" aria-hidden="true">
          <Icon name="search" size={16} />
        </span>
        <input
          {...rest}
          ref={mergedRef}
          type="search"
          className="rc-search-bar__input"
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          enterKeyHint={rest.enterKeyHint ?? 'search'}
          onChange={(event) => setCurrentValue(event.target.value)}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onKeyDown={handleKeyDown}
        />
        {allowClear && currentValue.length > 0 && !disabled ? (
          <button
            type="button"
            className="rc-search-bar__clear"
            aria-label="Clear search"
            onClick={handleClear}
          >
            <Icon name="close" size={12} />
          </button>
        ) : null}
      </div>
      {showCancel ? (
        <button
          type="button"
          className="rc-search-bar__cancel"
          onClick={handleCancel}
        >
          {cancelText}
        </button>
      ) : null}
    </form>
  );
});
