export type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | Record<string, boolean | null | undefined>;

/** Tiny class name combiner: cx('a', cond && 'b', { c: true }) -> 'a b c'. */
export function cx(...values: ClassValue[]): string {
  const result: string[] = [];
  for (const value of values) {
    if (!value) continue;
    if (typeof value === 'string' || typeof value === 'number') {
      result.push(String(value));
    } else {
      for (const key of Object.keys(value)) {
        if (value[key]) result.push(key);
      }
    }
  }
  return result.join(' ');
}
