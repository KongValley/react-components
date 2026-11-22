import { describe, expect, it } from 'vitest';
import { getValue, isEmptyValue, setValue } from '../object';

describe('object utils', () => {
  it('reads nested values', () => {
    const source = { user: { profile: { name: 'Ada' } } };
    expect(getValue(source, ['user', 'profile', 'name'])).toBe('Ada');
    expect(getValue(source, 'user')).toEqual({ profile: { name: 'Ada' } });
    expect(getValue(source, ['missing', 'key'])).toBeUndefined();
  });

  it('writes nested values immutably', () => {
    const source = { user: { name: 'Ada', age: 30 }, other: { a: 1 } };
    const next = setValue(source, ['user', 'name'], 'Grace');

    expect(next).not.toBe(source);
    expect(next.user).not.toBe(source.user);
    expect(next.other).toBe(source.other);
    expect(next.user).toEqual({ name: 'Grace', age: 30 });
    expect(source.user.name).toBe('Ada');
  });

  it('creates arrays for numeric path segments', () => {
    const next = setValue({}, ['items', 0, 'name'], 'first');
    expect(next).toEqual({ items: [{ name: 'first' }] });
  });

  it('ignores prototype-polluting paths', () => {
    const source = {};
    expect(setValue(source, ['__proto__'], 'polluted')).toBe(source);
  });

  it('detects empty values for required validation', () => {
    expect(isEmptyValue(undefined)).toBe(true);
    expect(isEmptyValue(null)).toBe(true);
    expect(isEmptyValue('   ')).toBe(true);
    expect(isEmptyValue([])).toBe(true);
    expect(isEmptyValue(0)).toBe(false);
    expect(isEmptyValue('x')).toBe(false);
  });
});
