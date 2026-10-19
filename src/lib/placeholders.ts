/**
 * Square-bracket placeholders stand in for values nobody has supplied yet.
 */

/** True when a value is a placeholder such as `[Vendor URL]`. */
export function isPlaceholder(value: string | undefined): boolean {
  return value !== undefined && /^\[[^\]]+\]$/.test(value);
}
