import type { ReactNode } from 'react';
import type { NamePath } from '../../utils/object';
import type { InputSize } from '../input/Input';

export type FormValues = Record<string, unknown>;
export type FormLayout = 'horizontal' | 'vertical' | 'inline';
export type FormSize = InputSize;
export type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating';

export interface FormRule {
  required?: boolean;
  message?: string;
  type?: 'string' | 'number' | 'email' | 'url';
  /** Minimum length (string/array) or minimum value (number). */
  min?: number;
  /** Maximum length (string/array) or maximum value (number). */
  max?: number;
  /** Exact length for strings and arrays. */
  len?: number;
  pattern?: RegExp;
  /** Rejects strings made only of whitespace. */
  whitespace?: boolean;
  transform?: (value: unknown) => unknown;
  validator?: (
    rule: FormRule,
    value: unknown,
    values: FormValues,
  ) => void | string | Promise<void | string>;
}

export interface FormErrorField {
  name: NamePath;
  errors: string[];
}

export interface FormErrorInfo {
  values: FormValues;
  errorFields: FormErrorField[];
}

export interface FormInstance<Values extends FormValues = FormValues> {
  getFieldValue: (name: NamePath) => unknown;
  getFieldsValue: () => Values;
  setFieldValue: (
    name: NamePath,
    value: unknown,
    options?: { touch?: boolean; clearErrors?: boolean },
  ) => void;
  setFieldsValue: (values: Partial<Values>) => void;
  resetFields: (names?: NamePath[]) => void;
  validateFields: (names?: NamePath[]) => Promise<Values>;
  getFieldError: (name: NamePath) => string[];
  isFieldTouched: (name: NamePath) => boolean;
  submit: () => void;
}

export interface FormItemRenderProps {
  label?: ReactNode;
  required?: boolean;
}
