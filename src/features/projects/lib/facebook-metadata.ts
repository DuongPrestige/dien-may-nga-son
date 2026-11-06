import { decodeHtmlEntities, escapeHtml } from "@/src/lib/html-entities";
import { limitText, truncateText } from "@/src/lib/text-truncate";

export const FACEBOOK_ALLOWED_HOSTS: ReadonlySet<string> = new Set([
  "facebook.com",
  "www.facebook.com",
  "m.facebook.com",
  "web.facebook.com",
  "fb.watch",
]);

export const FACEBOOK_IMPORT_FALLBACK_TITLE = "Công trình từ Facebook";
export const FACEBOOK_IMPORT_TITLE_MAX_LENGTH = 255;
export const FACEBOOK_IMPORT_EXCERPT_MAX_LENGTH = 200;
const MAX_IMAGE_URL_LENGTH = 2048;

const TRACKING_PARAM_NAMES = new Set([
  "fbclid",
  "mibextid",
  "rdid",
  "share_url",
  "sfnsn",
  "ref",
  "refsrc",
]);

const LOGIN_WALL_PATTERNS = [
  /\blog\s?in(to)?\b/i,
  /rời khỏi facebook/i,
  /leaving facebook/i,
  /đăng nhập/i,
  /sign up/i,
  /đăng ký/i,
  /không tìm thấy nội dung/i,
  /content (isn'?t|not) available/i,
  /trang (này )?không (hiển thị|khả dụng)/i,
];

export type FacebookMetadata = {
  title: string;
  description: string;
  imageUrl: string | null;
  hasOpenGraph: boolean;
};

/** Returns true when the URL is an https Facebook URL safe to fetch. */
export function isAllowedFacebookUrl(url: URL): boolean {
  return (
    url.protocol === "https:" &&
    url.username === "" &&
    url.password === "" &&
    (url.port === "" || url.port === "443") &&
    FACEBOOK_ALLOWED_HOSTS.has(url.hostname.toLowerCase())
  );
}

/** Removes fragments and tracking parameters so the stored URL is stable. */
export function canonicalizeFacebookUrl(input: string): string {
  const url = new URL(input);
  url.hash = "";

  for (const key of Array.from(url.searchParams.keys())) {
    if (TRACKING_PARAM_NAMES.has(key.toLowerCase()) || key.startsWith("__")) {
      url.searchParams.delete(key);
    }
  }

  return url.toString();
}

/** A redirect to these paths means Facebook is asking the crawler to log in. */
export function isFacebookLoginPath(url: URL): boolean {
  return /^\/(login|checkpoint|recover)(\/|\.php|$)/i.test(url.pathname);
}

/**
 * Facebook utility pages (home, link-out warnings, generic video tab) carry
 * OpenGraph tags that do not describe a post, so they must not be imported.
 */
export function isFacebookNonContentUrl(url: URL): boolean {
  const path = url.pathname.replace(/\/+$/, "").toLowerCase();

  if (path === "" || path === "/home.php" || path === "/l.php") {
    return true;
  }
  if (path.startsWith("/flx/") || path.startsWith("/sharer")) {
    return true;
  }
  return path === "/watch" && !url.searchParams.has("v");
}

function parseAttributes(tag: string): Map<string, string> {
  const attributes = new Map<string, string>();
  const attributePattern =
    /([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

  for (const match of tag.matchAll(attributePattern)) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    if (!attributes.has(name)) {
      attributes.set(name, value);
    }
  }

  return attributes;
}

/** Collects `<meta property|name="..." content="...">` pairs (first wins). */
export function extractMetaTags(html: string): Map<string, string> {
  const metaTags = new Map<string, string>();

  for (const match of html.matchAll(/<meta\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const key = (
      attributes.get("property") ??
      attributes.get("name") ??
      attributes.get("itemprop")
    )
      ?.trim()
      .toLowerCase();
    const content = attributes.get("content");

    if (key && content !== undefined && !metaTags.has(key)) {
      metaTags.set(key, decodeHtmlEntities(content));
    }
  }

  return metaTags;
}

function extractTitleTag(html: string): string {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtmlEntities(match[1]) : "";
}

function normalizeInline(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeMultiline(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[^\S\n]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** og:image must come from Facebook's own CDN before it is re-hosted on Cloudinary. */
const IMAGE_HOST_SUFFIXES = [".fbcdn.net", ".facebook.com", ".fbsbx.com"] as const;

function isFacebookImageHost(hostname: string): boolean {
  return IMAGE_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}

function normalizeImageUrl(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value.trim());
    if (
      url.protocol !== "https:" ||
      url.href.length > MAX_IMAGE_URL_LENGTH ||
      !isFacebookImageHost(url.hostname)
    ) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

/** Parses OpenGraph metadata, falling back to `<title>` and meta description. */
export function extractFacebookMetadata(html: string): FacebookMetadata {
  const metaTags = extractMetaTags(html);
  const ogTitle = normalizeInline(metaTags.get("og:title") ?? "");
  const ogDescription = normalizeMultiline(
    metaTags.get("og:description") ?? "",
  );
  const ogImage = metaTags.get("og:image") ?? metaTags.get("og:image:url");

  return {
    title:
      ogTitle ||
      normalizeInline(metaTags.get("twitter:title") ?? "") ||
      normalizeInline(extractTitleTag(html)),
    description:
      ogDescription ||
      normalizeMultiline(metaTags.get("twitter:description") ?? "") ||
      normalizeMultiline(metaTags.get("description") ?? ""),
    imageUrl: normalizeImageUrl(ogImage ?? metaTags.get("twitter:image")),
    hasOpenGraph: Boolean(ogTitle || ogDescription),
  };
}

function looksLikeLoginWall(value: string): boolean {
  return LOGIN_WALL_PATTERNS.some((pattern) => pattern.test(value));
}

/**
 * A page is usable only when it carries real post metadata. Login walls and
 * "content unavailable" pages expose generic titles/descriptions instead.
 */
export function isUsableFacebookMetadata(metadata: FacebookMetadata): boolean {
  if (!metadata.title && !metadata.description) {
    return false;
  }

  if (looksLikeLoginWall(metadata.title)) {
    return false;
  }

  if (/^facebook$/i.test(metadata.title) && !metadata.description) {
    return false;
  }

  if (
    !metadata.hasOpenGraph &&
    /^(log in|log into|đăng nhập|see posts|xem bài viết)/i.test(
      metadata.description,
    )
  ) {
    return false;
  }

  return true;
}

/** Converts plain text into escaped `<p>` paragraphs with `<br>` line breaks. */
export function plainTextToParagraphHtml(text: string): string {
  return normalizeMultiline(text)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p>${paragraph.split("\n").map(escapeHtml).join("<br>")}</p>`,
    )
    .join("");
}

export type FacebookProjectDraftContent = {
  title: string;
  excerpt: string;
  content: string;
};

export function buildFacebookProjectDraftContent(
  metadata: FacebookMetadata,
): FacebookProjectDraftContent {
  const title =
    limitText(metadata.title, FACEBOOK_IMPORT_TITLE_MAX_LENGTH).trim() ||
    FACEBOOK_IMPORT_FALLBACK_TITLE;
  const body = metadata.description || title;

  return {
    title,
    excerpt: truncateText(body, FACEBOOK_IMPORT_EXCERPT_MAX_LENGTH),
    content: plainTextToParagraphHtml(body),
  };
}
