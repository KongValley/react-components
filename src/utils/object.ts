export type NamePath = string | number | (string | number)[];

/** Normalizes a form field name into an array of path segments. */
export function toPath(name: NamePath): (string | number)[] {
  return Array.isArray(name) ? name : [name];
}

/** Reads a possibly nested value, e.g. getValue(values, ['user', 'name']). */
export function getValue(source: unknown, path: NamePath): unknown {
  let current: any = source;
  for (const key of toPath(path)) {
    if (current == null) return undefined;
    current = current[key];
  }
  return current;
}

function cloneContainer(value: unknown, nextKey: string | number): any {
  if (Array.isArray(value)) return value.slice();
  if (value !== null && typeof value === 'object') return { ...(value as Record<string, unknown>) };
  return typeof nextKey === 'number' ? [] : {};
}

/**
 * Immutably writes a nested value. Every container along the path is cloned,
 * untouched branches keep their identity. Supports object and array indexes.
 */
export function setValue<T>(source: T, path: NamePath, value: unknown): T {
  const keys = toPath(path);
  if (keys.length === 0) return source;

  const root = cloneContainer(source, keys[0]);
  let cursor: any = root;
  let currentSource: any = source;

  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];

    if (index === keys.length - 1) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') return source;
      cursor[key] = value;
      break;
    }

    const childSource = currentSource == null ? undefined : currentSource[key];
    const childClone = cloneContainer(childSource, keys[index + 1]);
    cursor[key] = childClone;
    cursor = childClone;
    currentSource = childSource;
  }

  return root as T;
}

export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/** A value is considered empty for `required` validation purposes. */
export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}
