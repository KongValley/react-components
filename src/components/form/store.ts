import { getValue, setValue, toPath, type NamePath } from '../../utils/object';
import type {
  FormErrorField,
  FormErrorInfo,
  FormInstance,
  FormValues,
} from './types';

export interface FormFieldEntity {
  name: NamePath;
  initialValue?: unknown;
  validate: () => Promise<string[]>;
}

export interface FormStore<Values extends FormValues = FormValues>
  extends FormInstance<Values> {
  subscribe: (listener: () => void) => () => void;
  getVersion: () => number;
  registerField: (field: FormFieldEntity) => () => void;
  setSubmitHandler: (handler: (() => void) | null) => void;
  setInitialValues: (values: Partial<Values> | undefined) => void;
  setFieldTouched: (name: NamePath, touched: boolean) => void;
  getFieldErrors: (name: NamePath) => string[];
}

const EMPTY_ERRORS: string[] = [];

function keyOf(name: NamePath): string {
  return JSON.stringify(toPath(name));
}

/**
 * Framework-agnostic form store. All fields subscribe to a single version
 * counter, which keeps nested update semantics simple and avoids stale
 * per-field snapshots.
 */
export function createFormStore<Values extends FormValues = FormValues>(
  initialValues?: Partial<Values>,
): FormStore<Values> {
  let values: FormValues = { ...(initialValues ?? {}) };
  let initial: FormValues = { ...(initialValues ?? {}) };
  const touched = new Set<string>();
  const errors = new Map<string, string[]>();
  const fields = new Map<string, FormFieldEntity>();
  const listeners = new Set<() => void>();
  let version = 0;
  let submitHandler: (() => void) | null = null;

  const notify = () => {
    version += 1;
    for (const listener of Array.from(listeners)) listener();
  };

  const store: FormStore<Values> = {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getVersion() {
      return version;
    },

    registerField(field) {
      const key = keyOf(field.name);
      fields.set(key, field);
      if (
        field.initialValue !== undefined &&
        getValue(values, field.name) === undefined
      ) {
        values = setValue(values, field.name, field.initialValue);
      }
      notify();
      return () => {
        if (fields.get(key) === field) fields.delete(key);
      };
    },

    setSubmitHandler(handler) {
      submitHandler = handler;
    },

    setInitialValues(next) {
      if (!next) return;
      initial = { ...initial, ...next };
      for (const [key, value] of Object.entries(next)) {
        if (getValue(values, key) === undefined) {
          values = setValue(values, key, value);
        }
      }
      notify();
    },

    getFieldValue(name) {
      return getValue(values, name);
    },

    getFieldsValue() {
      return values as Values;
    },

    setFieldValue(name, value, options) {
      values = setValue(values, name, value);
      const key = keyOf(name);
      if (options?.touch) touched.add(key);
      if (options?.clearErrors !== false) errors.delete(key);
      notify();
    },

    setFieldsValue(next) {
      values = { ...values, ...(next as FormValues) };
      errors.clear();
      notify();
    },

    resetFields(names) {
      if (!names || names.length === 0) {
        values = { ...initial };
        for (const field of fields.values()) {
          if (field.initialValue !== undefined) {
            values = setValue(values, field.name, field.initialValue);
          }
        }
        touched.clear();
        errors.clear();
      } else {
        for (const name of names) {
          const key = keyOf(name);
          const field = fields.get(key);
          const nextValue =
            field?.initialValue !== undefined
              ? field.initialValue
              : getValue(initial, name);
          values = setValue(values, name, nextValue);
          touched.delete(key);
          errors.delete(key);
        }
      }
      notify();
    },

    async validateFields(names) {
      const keys = names ? names.map(keyOf) : Array.from(fields.keys());
      const results = await Promise.all(
        keys.map(async (key) => {
          const field = fields.get(key);
          if (!field) return null;
          touched.add(key);

          let fieldErrors: string[] = [];
          try {
            fieldErrors = await field.validate();
          } catch (error) {
            fieldErrors = [
              error instanceof Error ? error.message : String(error ?? 'Validation failed.'),
            ];
          }

          if (fieldErrors.length > 0) errors.set(key, fieldErrors);
          else errors.delete(key);

          return { name: field.name, errors: fieldErrors };
        }),
      );

      notify();

      const errorFields: FormErrorField[] = results
        .filter((result): result is { name: NamePath; errors: string[] } => result !== null)
        .filter((result) => result.errors.length > 0)
        .map((result) => ({ name: result.name, errors: result.errors }));

      if (errorFields.length > 0) {
        const info: FormErrorInfo = {
          values: values as FormValues,
          errorFields,
        };
        throw info;
      }

      return values as Values;
    },

    getFieldError(name) {
      return errors.get(keyOf(name)) ?? EMPTY_ERRORS;
    },

    getFieldErrors(name) {
      return errors.get(keyOf(name)) ?? EMPTY_ERRORS;
    },

    isFieldTouched(name) {
      return touched.has(keyOf(name));
    },

    setFieldTouched(name, isTouched) {
      const key = keyOf(name);
      if (isTouched) touched.add(key);
      else touched.delete(key);
      notify();
    },

    submit() {
      submitHandler?.();
    },
  };

  return store;
}
