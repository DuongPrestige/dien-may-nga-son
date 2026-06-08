import sanitizeHtml from "sanitize-html";

export type BlogContentHeading = {
  id: string;
  level: 2 | 3;
  title: string;
};

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;
const HEADING_PATTERN = /<h([23])>([\s\S]*?)<\/h\1>/gi;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function legacyContentToHtml(content: string): string {
  return content
    .trim()
    .split(/\n{2,}/)
    .map((section) => {
      const trimmedSection = section.trim();
      const headingMatch = trimmedSection.match(/^(#{2,3})\s+([\s\S]+)$/);

      if (headingMatch) {
        const level = headingMatch[1].length;
        return `<h${level}>${escapeHtml(headingMatch[2].trim())}</h${level}>`;
      }

      return `<p>${escapeHtml(trimmedSection).replaceAll("\n", "<br>")}</p>`;
    })
    .join("");
}

function normalizeContent(content: string): string {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return "";
  }

  return HTML_TAG_PATTERN.test(trimmedContent)
    ? trimmedContent
    : legacyContentToHtml(trimmedContent);
}

export function sanitizeBlogContent(content: string): string {
  return sanitizeHtml(normalizeContent(content), {
    allowedTags: [
      "p",
      "h2",
      "h3",
      "strong",
      "b",
      "em",
      "i",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "br",
    ],
    allowedAttributes: {
      a: ["href", "title", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: {
          ...attribs,
          rel: "noopener noreferrer",
        },
      }),
      img: (_tagName, attribs) => ({
        tagName: "img",
        attribs: {
          ...attribs,
          alt: attribs.alt?.trim() ?? "",
          loading: "lazy",
        },
      }),
    },
  });
}

function decodeHtmlEntities(value: string): string {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value.replace(
    /&(#x[\da-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi,
    (entity, code: string) => {
      if (code.startsWith("#x")) {
        return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
      }

      if (code.startsWith("#")) {
        return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
      }

      return namedEntities[code.toLowerCase()] ?? entity;
    },
  );
}

function getHeadingText(content: string): string {
  return decodeHtmlEntities(
    sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {},
    }),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function createAnchorId(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

export function prepareBlogContent(content: string): {
  html: string;
  headings: BlogContentHeading[];
} {
  const headings: BlogContentHeading[] = [];
  const anchorCounts = new Map<string, number>();
  const sanitizedHtml = sanitizeBlogContent(content);
  const html = sanitizedHtml.replace(
    HEADING_PATTERN,
    (_heading, rawLevel: string, innerHtml: string) => {
      const level = Number(rawLevel) as 2 | 3;
      const title = getHeadingText(innerHtml);
      const baseId = createAnchorId(title);
      const count = (anchorCounts.get(baseId) ?? 0) + 1;
      const id = count === 1 ? baseId : `${baseId}-${count}`;

      anchorCounts.set(baseId, count);
      if (title) {
        headings.push({ id, level, title });
      }

      return `<h${level} id="${id}">${innerHtml}</h${level}>`;
    },
  );

  return { html, headings };
}

export function hasMeaningfulBlogContent(content: string): boolean {
  const sanitizedContent = sanitizeBlogContent(content);
  const textContent = getHeadingText(sanitizedContent);
  const hasImage = /<img(?:\s|>)/i.test(sanitizedContent);

  return textContent.length > 0 || hasImage;
}
