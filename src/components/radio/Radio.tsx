import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from 'react';
import { cx } from '../../utils/cx';

export type RadioValue = string | number;

interface RadioGroupContextValue {
  value: RadioValue | undefined;
  disabled?: boolean;
  name: string;
  optionType: 'default' | 'button';
  buttonStyle: 'outline' | 'solid';
  size: 'small' | 'middle' | 'large';
  select: (value: RadioValue) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange' | 'value'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Identifies this radio inside a Radio.Group. */
  value?: RadioValue;
  children?: ReactNode;
}

export interface RadioOption {
  label: ReactNode;
  value: RadioValue;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options?: Array<RadioOption | RadioValue>;
  value?: RadioValue;
  defaultValue?: RadioValue;
  onChange?: (value: RadioValue) => void;
  name?: string;
  disabled?: boolean;
  optionType?: 'default' | 'button';
  buttonStyle?: 'outline' | 'solid';
  size?: 'small' | 'middle' | 'large';
  children?: ReactNode;
}

const RadioRoot = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    checked,
    defaultChecked = false,
    onChange,
    value,
    disabled = false,
    name,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const group = useContext(RadioGroupContext);
  const [innerChecked, setInnerChecked] = useState(defaultChecked);
  const wasControlledRef = useRef(checked !== undefined);
  if (checked !== undefined) wasControlledRef.current = true;

  const inGroup = group !== null && value !== undefined;
  const isChecked = inGroup
    ? group.value === value
    : wasControlledRef.current
      ? Boolean(checked)
      : innerChecked;
  const isDisabled = disabled || Boolean(group?.disabled);
  const isButton = group?.optionType === 'button';

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (inGroup) group.select(value as RadioValue);
    else if (!wasControlledRef.current) setInnerChecked(true);
    onChange?.(event);
  };

  return (
    <label
      className={cx(
        'rc-radio',
        isChecked && 'rc-radio--checked',
        isDisabled && 'rc-radio--disabled',
        isButton && 'rc-radio--button',
        isButton && group?.buttonStyle === 'solid' && 'rc-radio--solid',
        className,
      )}
      style={style}
    >
      <span className="rc-radio__control">
        <input
          ref={ref}
          type="radio"
          className="rc-radio__input"
          checked={isChecked}
          disabled={isDisabled}
          name={group?.name ?? name}
          value={value}
          onChange={handleChange}
          {...rest}
        />
        <span className="rc-radio__mark" aria-hidden="true" />
      </span>
      {children !== undefined ? <span className="rc-radio__label">{children}</span> : null}
    </label>
  );
});

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    options,
    value,
    defaultValue,
    onChange,
    name,
    disabled,
    optionType = 'default',
    buttonStyle = 'outline',
    size = 'middle',
    className,
    children,
    ...rest
  },
  ref,
) {
  const generatedName = useId();
  const [innerValue, setInnerValue] = useState<RadioValue | undefined>(defaultValue);
  const wasControlledRef = useRef(value !== undefined);
  if (value !== undefined) wasControlledRef.current = true;
  const isControlled = wasControlledRef.current;
  const current = isControlled ? value : innerValue;

  const select = (next: RadioValue) => {
    if (!isControlled) setInnerValue(next);
    onChange?.(next);
  };

  const normalizedOptions = options?.map((option) =>
    typeof option === 'object' && option !== null && 'label' in option
      ? option
      : { label: option as ReactNode, value: option as RadioValue, disabled: false },
  );

  const button = optionType === 'button';

  return (
    <RadioGroupContext.Provider
      value={{ value: current, disabled, name: name ?? generatedName, optionType, buttonStyle, size, select }}
    >
      <div
        ref={ref}
        className={cx(
          'rc-radio-group',
          button && 'rc-radio-group--button',
          button && `rc-radio-group--${size}`,
          className,
        )}
        {...rest}
      >
        {normalizedOptions
          ? normalizedOptions.map((option) => (
              <Radio
                key={String(option.value)}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </Radio>
            ))
          : children}
      </div>
    </RadioGroupContext.Provider>
  );
});

type RadioComponent = ForwardRefExoticComponent<RadioProps & RefAttributes<HTMLInputElement>> & {
  Group: typeof RadioGroup;
};

export const Radio = Object.assign(RadioRoot, { Group: RadioGroup }) as RadioComponent;
