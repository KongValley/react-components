import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
  useContext,
  type CSSProperties,
  type FormEvent,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  type ForwardRefExoticComponent,
} from 'react';
import { Icon } from '../../icons';
import { useLatest } from '../../hooks/useLatest';
import { cx } from '../../utils/cx';
import { toPath, type NamePath } from '../../utils/object';
import { createFormStore, type FormStore } from './store';
import { validateRules } from './validate';
import type {
  FormErrorInfo,
  FormInstance,
  FormLayout,
  FormRule,
  FormSize,
  FormValidateStatus,
  FormValues,
} from './types';

interface FormContextValue {
  store: FormStore;
  layout: FormLayout;
  size: FormSize;
  disabled: boolean;
  labelAlign: 'left' | 'right';
  requiredMark: boolean;
}

const FormContext = createContext<FormContextValue | null>(null);

export interface FormProps
  extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form?: FormInstance<any>;
  initialValues?: FormValues;
  layout?: FormLayout;
  /** Label column width for horizontal layouts. */
  labelWidth?: number | string;
  labelAlign?: 'left' | 'right';
  size?: FormSize;
  disabled?: boolean;
  /** Set to false to hide required asterisks (validation still runs). */
  requiredMark?: boolean;
  onFinish?: (values: FormValues) => void;
  onFinishFailed?: (info: FormErrorInfo) => void;
  children?: ReactNode;
}

export interface FormItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  name?: NamePath;
  label?: ReactNode;
  rules?: FormRule[];
  required?: boolean;
  initialValue?: unknown;
  help?: ReactNode;
  extra?: ReactNode;
  validateStatus?: FormValidateStatus;
  hasFeedback?: boolean;
  /** Prop injected as the field value. Use `checked` for Checkbox/Switch. */
  valuePropName?: string;
  /** Event prop that updates the field. */
  trigger?: string;
  getValueFromEvent?: (...args: any[]) => unknown;
  /** Renders only the control, without label/help wrappers. */
  noStyle?: boolean;
  children?: ReactNode;
}

function defaultGetValueFromEvent(valuePropName: string, args: unknown[]): unknown {
  const first = args[0];
  if (first && typeof first === 'object') {
    const target = (first as { target?: unknown }).target;
    if (target && typeof target === 'object' && valuePropName in (target as object)) {
      return (target as Record<string, unknown>)[valuePropName];
    }
    const currentTarget = (first as { currentTarget?: unknown }).currentTarget;
    if (
      currentTarget &&
      typeof currentTarget === 'object' &&
      valuePropName in (currentTarget as object)
    ) {
      return (currentTarget as Record<string, unknown>)[valuePropName];
    }
  }
  return first;
}

const FEEDBACK_ICONS: Record<FormValidateStatus, ReactNode> = {
  error: <Icon name="error" size={16} />,
  warning: <Icon name="warning" size={16} />,
  success: <Icon name="success" size={16} />,
  validating: <Icon name="loading" size={16} spin />,
};

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(function FormItem(
  {
    name,
    label,
    rules,
    required,
    initialValue,
    help,
    extra,
    validateStatus,
    hasFeedback = false,
    valuePropName = 'value',
    trigger = 'onChange',
    getValueFromEvent,
    noStyle = false,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('Form.Item must be rendered inside a <Form>.');
  }

  const { store, layout, size, disabled, labelAlign, requiredMark } = context;
  const nameKey = name === undefined ? undefined : JSON.stringify(toPath(name));

  useSyncExternalStore(store.subscribe, store.getVersion, store.getVersion);

  const errors = name !== undefined ? store.getFieldError(name) : [];
  const fieldValue = name !== undefined ? store.getFieldValue(name) : undefined;
  const baseId = useId();
  const controlId = `${baseId}-control`;
  const errorId = `${baseId}-error`;

  const rulesRef = useLatest(rules);
  const labelRef = useLatest(label);

  useEffect(() => {
    if (name === undefined) return;
    return store.registerField({
      name,
      initialValue,
      validate: () => {
        store.setFieldTouched(name, true);
        return validateRules(
          rulesRef.current ?? [],
          store.getFieldValue(name),
          store.getFieldsValue(),
          labelRef.current,
        );
      },
    });
    // Re-register only when the field identity changes; rules/label are read
    // through refs so validation always uses the latest props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, nameKey]);

  const status: FormValidateStatus | undefined =
    validateStatus ?? (errors.length > 0 ? 'error' : undefined);
  const isRequired = required ?? Boolean(rules?.some((rule) => rule.required));
  const message = status === 'error' ? (errors[0] ?? help) : help;

  let control = children;

  if (name !== undefined && isValidElement(children)) {
    const element = children as ReactElement<Record<string, unknown>>;
    const originalProps = element.props;
    const originalHandler = originalProps[trigger];

    const handleChange = (...args: any[]) => {
      const next = getValueFromEvent
        ? getValueFromEvent(...args)
        : defaultGetValueFromEvent(valuePropName, args);
      store.setFieldValue(name, next, { touch: true });
      if (typeof originalHandler === 'function') {
        (originalHandler as (...handlerArgs: any[]) => void)(...args);
      }
    };

    const injected: Record<string, unknown> = {
      [valuePropName]: fieldValue,
      [trigger]: handleChange,
    };

    if (originalProps.id === undefined) injected.id = controlId;
    if (status !== undefined && status !== 'validating') injected.status = status;
    if (status === 'error') {
      injected['aria-invalid'] = true;
      if (originalProps['aria-describedby'] === undefined) {
        injected['aria-describedby'] = errorId;
      }
    }
    if (disabled) injected.disabled = true;
    if (size !== 'middle' && originalProps.size === undefined) injected.size = size;

    control = cloneElement(element, injected);
  }

  if (noStyle) {
    return <>{control}</>;
  }

  return (
    <div
      ref={ref}
      className={cx(
        'rcui-form-item',
        `rcui-form-item--${layout}`,
        `rcui-form-item--label-${labelAlign}`,
        status && `rcui-form-item--${status}`,
        className,
      )}
      style={style}
      {...rest}
    >
      {label !== undefined ? (
        <label
          className="rcui-form-item__label"
          htmlFor={name !== undefined ? controlId : undefined}
        >
          {isRequired && requiredMark ? (
            <span className="rcui-form-item__required" aria-hidden="true">
              *
            </span>
          ) : null}
          {label}
        </label>
      ) : null}
      <div className="rcui-form-item__control">
        <div className="rcui-form-item__content">
          {control}
          {hasFeedback && status ? (
            <span className={cx('rcui-form-item__feedback', `rcui-form-item__feedback--${status}`)}>
              {FEEDBACK_ICONS[status]}
            </span>
          ) : null}
        </div>
        {message !== undefined && message !== null && message !== '' ? (
          <div
            key={status === 'error' ? `error-${errors[0] ?? 'help'}` : 'help'}
            id={status === 'error' ? errorId : undefined}
            role={status === 'error' ? 'alert' : undefined}
            className={cx(
              'rcui-form-item__message',
              status === 'error' && 'rcui-form-item__message--error',
            )}
          >
            {message}
          </div>
        ) : null}
        {extra !== undefined ? <div className="rcui-form-item__extra">{extra}</div> : null}
      </div>
    </div>
  );
});

const FormRoot = forwardRef<HTMLFormElement, FormProps>(function Form(
  {
    form,
    initialValues,
    layout = 'vertical',
    labelWidth,
    labelAlign = 'right',
    size = 'middle',
    disabled = false,
    requiredMark = true,
    onFinish,
    onFinishFailed,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const [internalForm] = useState(() => createFormStore(initialValues));
  const store = (form ?? internalForm) as FormStore;

  const onFinishRef = useLatest(onFinish);
  const onFinishFailedRef = useLatest(onFinishFailed);

  useEffect(() => {
    if (initialValues) store.setInitialValues(initialValues);
    // Initial values are applied once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  useEffect(() => {
    store.setSubmitHandler(() => {
      store.validateFields().then(
        (values) => {
          onFinishRef.current?.(values);
        },
        (info: FormErrorInfo) => {
          onFinishFailedRef.current?.(info);
        },
      );
    });
    return () => store.setSubmitHandler(null);
  }, [store, onFinishRef, onFinishFailedRef]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    store.submit();
  };

  const contextValue = useMemo<FormContextValue>(
    () => ({ store, layout, size, disabled, labelAlign, requiredMark }),
    [store, layout, size, disabled, labelAlign, requiredMark],
  );

  const formStyle = useMemo(() => {
    const width =
      typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth;
    return {
      ...(width ? { '--rcui-form-label-width': width } : {}),
      ...style,
    } as CSSProperties;
  }, [labelWidth, style]);

  return (
    <FormContext.Provider value={contextValue}>
      <form
        ref={ref}
        noValidate
        className={cx(
          'rcui-form',
          `rcui-form--${layout}`,
          size !== 'middle' && `rcui-form--${size}`,
          disabled && 'rcui-form--disabled',
          labelAlign === 'left' && 'rcui-form--label-left',
          className,
        )}
        style={formStyle}
        onSubmit={handleSubmit}
        {...rest}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
});

export function useForm<Values extends FormValues = FormValues>(
  initialValues?: Partial<Values>,
): [FormInstance<Values>] {
  const [form] = useState(() => createFormStore<Values>(initialValues));
  return [form];
}

type FormComponent = ForwardRefExoticComponent<FormProps & RefAttributes<HTMLFormElement>> & {
  Item: typeof FormItem;
  useForm: typeof useForm;
};

export const Form = Object.assign(FormRoot, { Item: FormItem, useForm }) as FormComponent;
