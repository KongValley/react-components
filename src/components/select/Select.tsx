import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons';
import { Popup as FloatingPopup } from '../../internal/Popup';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useControllableState } from '../../hooks/useControllableState';
import { useDevice } from '../../hooks/useDevice';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useMergedRef } from '../../hooks/useMergedRef';
import { cx } from '../../utils/cx';
import type { Placement } from '../../hooks/useFloating';
import type { InputSize, InputStatus } from '../input/Input';
import { Button } from '../button/Button';
import { Popup } from '../popup/Popup';
import { SearchBar } from '../search-bar/SearchBar';

export type SelectValue = string | number;
export type SelectMode = 'single' | 'multiple';

export interface SelectOption {
  label: ReactNode;
  value: SelectValue;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: ReactNode;
  options: SelectOption[];
}

export interface SelectProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'onChange' | 'defaultValue' | 'value' | 'onSelect'
  > {
  options?: Array<SelectOption | SelectOptionGroup>;
  value?: SelectValue | SelectValue[] | null;
  defaultValue?: SelectValue | SelectValue[] | null;
  onChange?: (value: SelectValue | SelectValue[] | null) => void;
  mode?: SelectMode;
  placeholder?: ReactNode;
  disabled?: boolean;
  allowClear?: boolean;
  showSearch?: boolean;
  filterOption?: boolean | ((input: string, option: SelectOption) => boolean);
  notFoundContent?: ReactNode;
  loading?: boolean;
  size?: InputSize;
  status?: InputStatus;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  name?: string;
  placement?: Placement;
  onSearch?: (value: string) => void;
  /** Uses a bottom-sheet option list on mobile devices. */
  adaptive?: boolean;
  /** Title shown in the mobile bottom sheet. Defaults to `placeholder`. */
  mobileTitle?: ReactNode;
}

function isOptionGroup(option: SelectOption | SelectOptionGroup): option is SelectOptionGroup {
  return Array.isArray((option as SelectOptionGroup).options);
}

function labelToText(label: ReactNode, fallback: SelectValue): string {
  if (typeof label === 'string' || typeof label === 'number') return String(label);
  return String(fallback);
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
  {
    options = [],
    value,
    defaultValue,
    onChange,
    mode = 'single',
    placeholder = 'Please select',
    disabled = false,
    allowClear = false,
    showSearch = false,
    filterOption = true,
    notFoundContent,
    loading = false,
    size = 'middle',
    status,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    name,
    placement = 'bottom-start',
    onSearch,
    adaptive,
    mobileTitle,
    className,
    style,
    onClick,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const { isMobile, adaptive: contextAdaptive } = useDevice();
  const mobile = (adaptive ?? contextAdaptive) && isMobile;
  const isMultiple = mode === 'multiple';
  const triggerRef = useRef<HTMLDivElement>(null);
  const mergedTriggerRef = useMergedRef(triggerRef, forwardedRef);
  const popupRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const [currentValue, setCurrentValue] = useControllableState<
    SelectValue | SelectValue[] | null
  >({
    value,
    defaultValue: isMultiple
      ? ((defaultValue as SelectValue[] | undefined) ?? [])
      : ((defaultValue as SelectValue | undefined) ?? null),
    onChange,
  });

  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const groups = useMemo(() => {
    return options.map((option) =>
      isOptionGroup(option)
        ? option
        : { label: undefined as ReactNode, options: [option] },
    );
  }, [options]);

  const optionMap = useMemo(() => {
    const map = new Map<SelectValue, SelectOption>();
    for (const group of groups) for (const option of group.options) map.set(option.value, option);
    return map;
  }, [groups]);

  const selectedValues: SelectValue[] = isMultiple
    ? Array.isArray(currentValue)
      ? (currentValue as SelectValue[])
      : []
    : [];
  const singleValue =
    !isMultiple &&
    currentValue !== null &&
    currentValue !== undefined &&
    !Array.isArray(currentValue)
      ? (currentValue as SelectValue)
      : null;
  const hasValue = isMultiple ? selectedValues.length > 0 : singleValue !== null;

  const filteredGroups = useMemo(() => {
    if (!showSearch || !search) return groups;
    const query = search.toLowerCase();
    const matches = (option: SelectOption) => {
      if (typeof filterOption === 'function') return filterOption(search, option);
      if (filterOption === false) return true;
      const text =
        typeof option.label === 'string' || typeof option.label === 'number'
          ? String(option.label)
          : String(option.value);
      return text.toLowerCase().includes(query);
    };
    return groups
      .map((group) => ({ ...group, options: group.options.filter(matches) }))
      .filter((group) => group.options.length > 0);
  }, [groups, showSearch, search, filterOption]);

  const flatOptions = useMemo(
    () => filteredGroups.flatMap((group) => group.options),
    [filteredGroups],
  );

  const close = () => setOpen(false);

  const openDropdown = () => {
    if (disabled) return;
    setOpen(true);
  };

  const toggleOpen = () => {
    if (disabled) return;
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const selectedIndex = flatOptions.findIndex(
      (option) =>
        !option.disabled &&
        (isMultiple ? selectedValues.includes(option.value) : option.value === singleValue),
    );
    const firstEnabled = flatOptions.findIndex((option) => !option.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : Math.max(0, firstEnabled));
    // Reset the highlight when the panel opens or the filtered list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, search, flatOptions]);

  useEffect(() => {
    if (!open || !showSearch || mobile) return;
    const frame = window.requestAnimationFrame(() => {
      searchRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, showSearch, mobile]);

  useEffect(() => {
    if (!open || mobile) return;
    const node = optionRefs.current[activeIndex];
    if (typeof node?.scrollIntoView === 'function') {
      node.scrollIntoView({ block: 'nearest' });
    }
  }, [open, activeIndex, mobile]);

  useClickOutside([triggerRef, popupRef], close, open && !mobile);
  useEscapeKey(() => {
    if (!open) return;
    close();
    triggerRef.current?.focus({ preventScroll: true });
  }, open && !mobile);

  const emitValue = (next: SelectValue | SelectValue[] | null) => {
    setCurrentValue(next);
  };

  const selectOption = (option: SelectOption) => {
    if (option.disabled) return;
    if (isMultiple) {
      const exists = selectedValues.includes(option.value);
      emitValue(
        exists
          ? selectedValues.filter((item) => item !== option.value)
          : [...selectedValues, option.value],
      );
      setSearch('');
      onSearch?.('');
    } else {
      emitValue(option.value);
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    }
  };

  const removeValue = (optionValue: SelectValue) => {
    emitValue(selectedValues.filter((item) => item !== optionValue));
  };

  const clearValue = () => {
    emitValue(isMultiple ? [] : null);
  };

  const handleSearchChange = (next: string) => {
    setSearch(next);
    onSearch?.(next);
    if (!open) openDropdown();
  };

  const moveActive = (direction: 1 | -1) => {
    if (flatOptions.length === 0) return;
    let index = activeIndex;
    for (let step = 1; step <= flatOptions.length; step += 1) {
      const candidate = (index + direction * step + flatOptions.length * step) % flatOptions.length;
      if (!flatOptions[candidate].disabled) {
        index = candidate;
        break;
      }
    }
    setActiveIndex(index);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;

    if (mobile) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();
        if (!open) openDropdown();
        return;
      }
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        close();
        triggerRef.current?.focus({ preventScroll: true });
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) openDropdown();
        else moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) openDropdown();
        else moveActive(-1);
        break;
      case 'Enter':
        event.preventDefault();
        if (!open) {
          openDropdown();
        } else {
          const option = flatOptions[activeIndex];
          if (option) selectOption(option);
        }
        break;
      case ' ':
        if (!showSearch) {
          event.preventDefault();
          if (!open) openDropdown();
          else {
            const option = flatOptions[activeIndex];
            if (option) selectOption(option);
          }
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          close();
          triggerRef.current?.focus({ preventScroll: true });
        }
        break;
      case 'Backspace':
        if (isMultiple && search === '' && selectedValues.length > 0) {
          event.preventDefault();
          removeValue(selectedValues[selectedValues.length - 1]);
        }
        break;
      case 'Tab':
        if (open) close();
        break;
      default:
        break;
    }
  };

  const handleTriggerClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    const target = event.target as HTMLElement;
    if (target.closest('[data-select-remove]')) return;
    if (target.closest('.rc-select__search')) {
      if (!open) openDropdown();
      return;
    }
    toggleOpen();
  };

  const selectedOption =
    singleValue !== null ? optionMap.get(singleValue) : undefined;
  const selectedLabel = selectedOption?.label ?? singleValue;
  const showClear = allowClear && hasValue && !disabled;

  let optionIndex = -1;

  return (
    <>
      <div
        {...rest}
        ref={mergedTriggerRef}
        className={cx(
          'rc-select',
          `rc-select--${mode}`,
          size !== 'middle' && `rc-select--${size}`,
          status && `rc-select--${status}`,
          disabled && 'rc-select--disabled',
          open && 'rc-select--open',
          className,
        )}
        style={style}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={open}
        aria-haspopup={mobile ? 'dialog' : 'listbox'}
        aria-controls={open ? (mobile ? `${listboxId}-sheet` : listboxId) : undefined}
        aria-activedescendant={
          !mobile && open && flatOptions[activeIndex]
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        aria-disabled={disabled || undefined}
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
      >
        <div className="rc-select__selector">
          {isMultiple ? (
            <>
              {selectedValues.map((item) => {
                const option = optionMap.get(item);
                return (
                  <span key={String(item)} className="rc-select__tag">
                    <span className="rc-select__tag-label">{option?.label ?? item}</span>
                    {!disabled ? (
                      <button
                        type="button"
                        data-select-remove
                        className="rc-select__tag-remove"
                        tabIndex={-1}
                        aria-label={`Remove ${labelToText(option?.label, item)}`}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          removeValue(item);
                        }}
                      >
                        <Icon name="close" size={10} />
                      </button>
                    ) : null}
                  </span>
                );
              })}
              {showSearch ? (
                <input
                  ref={searchRef}
                  className="rc-select__search"
                  value={search}
                  placeholder={hasValue ? undefined : typeof placeholder === 'string' ? placeholder : undefined}
                  disabled={disabled}
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-label="Search options"
                  onChange={(event) => handleSearchChange(event.target.value)}
                />
              ) : !hasValue ? (
                <span className="rc-select__placeholder">{placeholder}</span>
              ) : null}
            </>
          ) : showSearch && open ? (
            <input
              ref={searchRef}
              className="rc-select__search"
              value={search}
              placeholder={
                hasValue
                  ? labelToText(selectedOption?.label ?? selectedLabel, singleValue as SelectValue)
                  : typeof placeholder === 'string'
                    ? placeholder
                    : undefined
              }
              disabled={disabled}
              autoComplete="off"
              aria-autocomplete="list"
              aria-label="Search options"
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          ) : (
            <span
              className={cx(
                'rc-select__value',
                !hasValue && 'rc-select__placeholder',
              )}
            >
              {hasValue ? selectedLabel : placeholder}
            </span>
          )}
        </div>
        <span className="rc-select__suffix">
          {loading ? <Icon name="loading" spin size={14} /> : null}
          {showClear ? (
            <button
              type="button"
              className="rc-select__clear"
              tabIndex={-1}
              aria-label="Clear selection"
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();
                clearValue();
              }}
            >
              <Icon name="close" size={12} />
            </button>
          ) : null}
          <Icon name="chevron-down" size={14} className="rc-select__arrow" />
        </span>
        {name ? (
          <input
            type="hidden"
            name={name}
            value={
              isMultiple ? selectedValues.join(',') : singleValue === null ? '' : String(singleValue)
            }
          />
        ) : null}
      </div>

      {mobile ? (
        <Popup
          open={open}
          position="bottom"
          title={mobileTitle ?? placeholder}
          closable
          maskClosable
          onClose={close}
          className="rc-select-sheet"
          bodyStyle={{ padding: 0 }}
        >
          {showSearch ? (
            <div className="rc-select-sheet__search">
              <SearchBar
                value={search}
                onChange={handleSearchChange}
                showCancel={false}
                autoFocus
                placeholder="Search"
              />
            </div>
          ) : null}
          {flatOptions.length === 0 ? (
            <div className="rc-select-sheet__empty">
              {loading ? <Icon name="loading" spin size={14} /> : null}
              {notFoundContent ?? (loading ? 'Loading...' : 'No data')}
            </div>
          ) : (
            <div
              className="rc-select-sheet__list"
              id={`${listboxId}-sheet`}
              role="listbox"
              aria-multiselectable={isMultiple || undefined}
            >
              {filteredGroups.map((group, groupIndex) => (
                <div className="rc-select-sheet__group" key={groupIndex}>
                  {group.label !== undefined ? (
                    <div className="rc-select-sheet__group-label">{group.label}</div>
                  ) : null}
                  {group.options.map((option) => {
                    const selected = isMultiple
                      ? selectedValues.includes(option.value)
                      : option.value === singleValue;
                    return (
                      <button
                        key={String(option.value)}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        aria-disabled={option.disabled || undefined}
                        disabled={option.disabled}
                        className={cx(
                          'rc-select-sheet__option',
                          selected && 'rc-select-sheet__option--selected',
                          option.disabled && 'rc-select-sheet__option--disabled',
                        )}
                        onClick={() => selectOption(option)}
                      >
                        <span className="rc-select-sheet__option-label">{option.label}</span>
                        {selected ? <Icon name="check" size={16} /> : null}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          {isMultiple ? (
            <div className="rc-select-sheet__footer">
              <Button
                onClick={clearValue}
                disabled={selectedValues.length === 0}
              >
                Clear
              </Button>
              <Button variant="primary" onClick={close}>
                Done
              </Button>
            </div>
          ) : null}
        </Popup>
      ) : (
        <FloatingPopup
          ref={popupRef}
          open={open}
          anchorRef={triggerRef}
          placement={placement}
          offset={4}
          matchAnchorWidth
          className="rc-select-dropdown"
          id={listboxId}
          role="listbox"
          aria-multiselectable={isMultiple || undefined}
        >
          {flatOptions.length === 0 ? (
            <div className="rc-select-dropdown__empty">
              {loading ? <Icon name="loading" spin size={14} /> : null}
              {notFoundContent ?? (loading ? 'Loading...' : 'No data')}
            </div>
          ) : (
            filteredGroups.map((group, groupIndex) => (
              <div className="rc-select-dropdown__group" key={groupIndex}>
                {group.label !== undefined ? (
                  <div className="rc-select-dropdown__group-label">{group.label}</div>
                ) : null}
                {group.options.map((option) => {
                  optionIndex += 1;
                  const index = optionIndex;
                  const selected = isMultiple
                    ? selectedValues.includes(option.value)
                    : option.value === singleValue;
                  return (
                    <div
                      key={String(option.value)}
                      ref={(node) => {
                        optionRefs.current[index] = node;
                      }}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={selected}
                      aria-disabled={option.disabled || undefined}
                      data-active={index === activeIndex || undefined}
                      className={cx(
                        'rc-select-dropdown__option',
                        selected && 'rc-select-dropdown__option--selected',
                        option.disabled && 'rc-select-dropdown__option--disabled',
                      )}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectOption(option)}
                    >
                      <span className="rc-select-dropdown__option-label">{option.label}</span>
                      {selected ? <Icon name="check" size={14} /> : null}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </FloatingPopup>
      )}
    </>
  );
});
