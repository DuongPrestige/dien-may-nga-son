import sanitizeHtml from "sanitize-html";

import { decodeHtmlEntities } from "@/src/lib/html-entities";

const BLOCK_BOUNDARY_PATTERN =
  /<\/(p|div|h[1-6]|li|blockquote|tr|section|article)>|<br\s*\/?>/gi;

/** Strips HTML tags and entities, keeping paragraph breaks as newlines. */
export function htmlToPlainText(html: string): string {
  const withBreaks = html.replace(BLOCK_BOUNDARY_PATTERN, "\n");
  const stripped = sanitizeHtml(withBreaks, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return decodeHtmlEntities(stripped)
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
