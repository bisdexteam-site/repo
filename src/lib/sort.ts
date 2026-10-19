/**
 * Alphabetical ordering of source names.
 */

interface Named {
  name: string;
  sortName?: string;
}

/** The key a source sorts by: its sort name or name, without a leading "The". */
export function sortKey(source: Named): string {
  return (source.sortName ?? source.name).replace(/^the\s+/i, "").trim();
}

/** Compare two sources for A to Z order. */
export function compareSources(a: Named, b: Named): number {
  return sortKey(a).localeCompare(sortKey(b), "en", { sensitivity: "base" });
}

/** The index letter a source is grouped under; "#" for names not starting with a letter. */
export function indexLetter(source: Named): string {
  const first = sortKey(source).charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "#";
}
