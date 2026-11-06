import {
  isAllowedFacebookUrl,
  isFacebookLoginPath,
  isFacebookNonContentUrl,
} from "@/src/features/projects/lib/facebook-metadata";

const MAX_REDIRECTS = 3;
const FETCH_TIMEOUT_MS = 8000;
const MAX_BODY_BYTES = 1.5 * 1024 * 1024;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const FACEBOOK_CRAWLER_USER_AGENT = "facebookexternalhit/1.1";

export const FACEBOOK_UNREADABLE_MESSAGE =
  "Không đọc được bài viết. Hãy kiểm tra bài đăng ở chế độ Công khai hoặc nhập thủ công.";

export type FacebookImportErrorReason =
  | "blocked-host"
  | "unreadable"
  | "network";

const ERROR_MESSAGES: Record<FacebookImportErrorReason, string> = {
  "blocked-host":
    "Chỉ hỗ trợ liên kết HTTPS từ facebook.com hoặc fb.watch.",
  unreadable: FACEBOOK_UNREADABLE_MESSAGE,
  network: "Không kết nối được tới Facebook. Vui lòng thử lại sau.",
};

/** Error whose `message` is safe to show to admins (Vietnamese). */
export class FacebookImportError extends Error {
  readonly reason: FacebookImportErrorReason;

  constructor(reason: FacebookImportErrorReason, cause?: unknown) {
    super(ERROR_MESSAGES[reason], { cause });
    this.name = "FacebookImportError";
    this.reason = reason;
  }
}

export type FacebookPageResult = {
  html: string;
  finalUrl: string;
};

async function readLimitedText(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    return "";
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (totalBytes < MAX_BODY_BYTES) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const remaining = MAX_BODY_BYTES - totalBytes;
    const chunk =
      value.byteLength > remaining ? value.subarray(0, remaining) : value;
    chunks.push(chunk);
    totalBytes += chunk.byteLength;
  }

  if (totalBytes >= MAX_BODY_BYTES) {
    await reader.cancel();
  }

  return new TextDecoder("utf-8").decode(Buffer.concat(chunks));
}

async function discardBody(response: Response): Promise<void> {
  try {
    await response.body?.cancel();
  } catch {
    // The body is irrelevant for redirects; a failed cancel needs no handling.
  }
}

function resolveRedirect(response: Response, currentUrl: URL): URL {
  const location = response.headers.get("location");
  if (!location) {
    throw new FacebookImportError("unreadable");
  }

  let nextUrl: URL;
  try {
    nextUrl = new URL(location, currentUrl);
  } catch (error) {
    throw new FacebookImportError("unreadable", error);
  }

  if (!isAllowedFacebookUrl(nextUrl)) {
    throw new FacebookImportError("blocked-host");
  }
  if (isFacebookLoginPath(nextUrl) || isFacebookNonContentUrl(nextUrl)) {
    throw new FacebookImportError("unreadable");
  }

  return nextUrl;
}

/**
 * Fetches a public Facebook page as the Facebook crawler (which receives
 * OpenGraph tags). Redirects are followed manually so every hop is
 * re-validated against the Facebook host allow-list (SSRF guard).
 */
export async function fetchFacebookPageHtml(
  rawUrl: string,
): Promise<FacebookPageResult> {
  let currentUrl: URL;
  try {
    currentUrl = new URL(rawUrl);
  } catch (error) {
    throw new FacebookImportError("blocked-host", error);
  }
  if (!isAllowedFacebookUrl(currentUrl)) {
    throw new FacebookImportError("blocked-host");
  }
  if (isFacebookNonContentUrl(currentUrl)) {
    throw new FacebookImportError("unreadable");
  }

  const signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    let response: Response;
    try {
      response = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal,
        cache: "no-store",
        headers: {
          "User-Agent": FACEBOOK_CRAWLER_USER_AGENT,
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
        },
      });
    } catch (error) {
      throw new FacebookImportError("network", error);
    }

    if (REDIRECT_STATUSES.has(response.status)) {
      await discardBody(response);
      currentUrl = resolveRedirect(response, currentUrl);
      continue;
    }

    if (!response.ok) {
      await discardBody(response);
      throw new FacebookImportError("unreadable");
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
      await discardBody(response);
      throw new FacebookImportError("unreadable");
    }

    try {
      return {
        html: await readLimitedText(response),
        finalUrl: currentUrl.toString(),
      };
    } catch (error) {
      throw new FacebookImportError("network", error);
    }
  }

  throw new FacebookImportError("unreadable");
}
