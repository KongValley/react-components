import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from 'react';
import { Icon } from '../../icons';
import { useMergedRef } from '../../hooks/useMergedRef';
import { cx } from '../../utils/cx';

export type CheckboxValue = string | number;

interface CheckboxGroupContextValue {
  value: CheckboxValue[];
  disabled?: boolean;
  name?: string;
  toggle: (value: CheckboxValue, checked: boolean) => void;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange' | 'value'> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Identifies this checkbox inside a Checkbox.Group. */
  value?: CheckboxValue;
  children?: ReactNode;
}

export interface CheckboxOption {
  label: ReactNode;
  value: CheckboxValue;
  disabled?: boolean;
}

export interface CheckboxGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options?: Array<CheckboxOption | CheckboxValue>;
  value?: CheckboxValue[];
  defaultValue?: CheckboxValue[];
  onChange?: (value: CheckboxValue[]) => void;
  name?: string;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
  children?: ReactNode;
}

const CheckboxRoot = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = false,
    indeterminate = false,
    onChange,
    value,
    disabled = false,
    name,
    className,
    style,
    children,
    ...rest
  },
  forwardedRef,
) {
  const group = useContext(CheckboxGroupContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(inputRef, forwardedRef);
  const [innerChecked, setInnerChecked] = useState(defaultChecked);
  const wasControlledRef = useRef(checked !== undefined);
  if (checked !== undefined) wasControlledRef.current = true;

  const inGroup = group !== null && value !== undefined;
  const isChecked = inGroup
    ? group.value.includes(value as CheckboxValue)
    : wasControlledRef.current
      ? Boolean(checked)
      : innerChecked;
  const isDisabled = disabled || Boolean(group?.disabled);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (inGroup) {
      group.toggle(value as CheckboxValue, event.target.checked);
    } else if (!wasControlledRef.current) {
      setInnerChecked(event.target.checked);
    }
    onChange?.(event);
  };

  return (
    <label
      className={cx(
        'rcui-checkbox',
        isChecked && 'rcui-checkbox--checked',
        indeterminate && 'rcui-checkbox--indeterminate',
        isDisabled && 'rcui-checkbox--disabled',
        className,
      )}
      style={style}
    >
      <span className="rcui-checkbox__box">
        <input
          ref={mergedRef}
          type="checkbox"
          className="rcui-checkbox__input"
          checked={isChecked}
          disabled={isDisabled}
          name={name ?? group?.name}
          value={value}
          onChange={handleChange}
          {...rest}
        />
        <span className="rcui-checkbox__mark" aria-hidden="true">
          {indeterminate ? <Icon name="minus" size={12} /> : <Icon name="check" size={12} />}
        </span>
      </span>
      {children !== undefined ? <span className="rcui-checkbox__label">{children}</span> : null}
    </label>
  );
});

const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  {
    options,
    value,
    defaultValue = [],
    onChange,
    name,
    disabled,
    direction = 'horizontal',
    className,
    children,
    ...rest
  },
  ref,
) {
  const [innerValue, setInnerValue] = useState<CheckboxValue[]>(defaultValue);
  const wasControlledRef = useRef(value !== undefined);
  if (value !== undefined) wasControlledRef.current = true;
  const isControlled = wasControlledRef.current;
  const current = isControlled ? (value ?? []) : innerValue;

  const toggle = (optionValue: CheckboxValue, checked: boolean) => {
    const next = checked
      ? [...current.filter((item) => item !== optionValue), optionValue]
      : current.filter((item) => item !== optionValue);
    if (!isControlled) setInnerValue(next);
    onChange?.(next);
  };

  const normalizedOptions = options?.map((option) =>
    typeof option === 'object' && option !== null && 'label' in option
      ? option
      : { label: option as ReactNode, value: option as CheckboxValue, disabled: false },
  );

  return (
    <CheckboxGroupContext.Provider value={{ value: current, disabled, name, toggle }}>
      <div
        ref={ref}
        className={cx(
          'rcui-checkbox-group',
          direction === 'vertical' && 'rcui-checkbox-group--vertical',
          className,
        )}
        {...rest}
      >
        {normalizedOptions
          ? normalizedOptions.map((option) => (
              <Checkbox
                key={String(option.value)}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </Checkbox>
            ))
          : children}
      </div>
    </CheckboxGroupContext.Provider>
  );
});

type CheckboxComponent = ForwardRefExoticComponent<CheckboxProps & RefAttributes<HTMLInputElement>> & {
  Group: typeof CheckboxGroup;
};

export const Checkbox = Object.assign(CheckboxRoot, { Group: CheckboxGroup }) as CheckboxComponent;
