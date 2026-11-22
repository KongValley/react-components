import { isEmptyValue } from '../../utils/object';
import type { FormRule, FormValues } from './types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function displayName(label: unknown): string {
  return typeof label === 'string' && label.trim() ? label : 'This field';
}

function isUrl(value: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Runs a field's rules sequentially and collects every error message.
 * Async custom validators are awaited.
 */
export async function validateRules(
  rules: FormRule[],
  value: unknown,
  values: FormValues,
  label?: unknown,
): Promise<string[]> {
  const name = displayName(label);
  const messages: string[] = [];

  for (const rule of rules) {
    const fieldValue = rule.transform ? rule.transform(value) : value;

    const empty = isEmptyValue(fieldValue) || fieldValue === false;
    if (rule.required && empty) {
      messages.push(rule.message ?? `${name} is required.`);
      continue;
    }

    if (
      rule.whitespace &&
      typeof fieldValue === 'string' &&
      fieldValue.trim() === ''
    ) {
      messages.push(rule.message ?? `${name} cannot be blank.`);
      continue;
    }

    if (isEmptyValue(fieldValue)) continue;

    if (rule.type) {
      let valid = true;
      if (rule.type === 'string') valid = typeof fieldValue === 'string';
      else if (rule.type === 'number') {
        valid = typeof fieldValue === 'number' && !Number.isNaN(fieldValue);
      } else if (rule.type === 'email') {
        valid = typeof fieldValue === 'string' && EMAIL_PATTERN.test(fieldValue);
      } else if (rule.type === 'url') {
        valid = typeof fieldValue === 'string' && isUrl(fieldValue);
      }

      if (!valid) {
        const defaults: Record<NonNullable<FormRule['type']>, string> = {
          string: `${name} must be a string.`,
          number: `${name} must be a number.`,
          email: 'Please enter a valid email address.',
          url: 'Please enter a valid URL.',
        };
        messages.push(rule.message ?? defaults[rule.type]);
        continue;
      }
    }

    const length =
      typeof fieldValue === 'string' || Array.isArray(fieldValue)
        ? fieldValue.length
        : undefined;

    if (typeof rule.min === 'number') {
      if (typeof fieldValue === 'number' && fieldValue < rule.min) {
        messages.push(rule.message ?? `${name} must be at least ${rule.min}.`);
      } else if (length !== undefined && length < rule.min) {
        messages.push(rule.message ?? `${name} must be at least ${rule.min} characters.`);
      }
    }

    if (typeof rule.max === 'number') {
      if (typeof fieldValue === 'number' && fieldValue > rule.max) {
        messages.push(rule.message ?? `${name} must be at most ${rule.max}.`);
      } else if (length !== undefined && length > rule.max) {
        messages.push(rule.message ?? `${name} must be at most ${rule.max} characters.`);
      }
    }

    if (typeof rule.len === 'number' && length !== undefined && length !== rule.len) {
      messages.push(rule.message ?? `${name} must be exactly ${rule.len} characters.`);
    }

    if (rule.pattern) {
      rule.pattern.lastIndex = 0;
      if (typeof fieldValue !== 'string' || !rule.pattern.test(fieldValue)) {
        messages.push(rule.message ?? `${name} has an invalid format.`);
      }
    }

    if (rule.validator) {
      try {
        const result = await rule.validator(rule, fieldValue, values);
        if (typeof result === 'string' && result) messages.push(result);
      } catch (error) {
        messages.push(
          rule.message ??
            (error instanceof Error ? error.message : String(error ?? 'Validation failed.')),
        );
      }
    }
  }

  return messages;
}
