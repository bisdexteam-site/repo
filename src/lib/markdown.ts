/**
 * Renders Markdown strings from content frontmatter to HTML.
 */
import { marked } from "marked";

/** Block Markdown: paragraphs, lists and so on. */
export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false });
}

/** Inline Markdown only (no wrapping paragraph), for short values. */
export function renderInline(source: string): string {
  return marked.parseInline(source, { async: false });
}
