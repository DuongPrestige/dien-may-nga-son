function extractUrl(value: string): string {
  const trimmed = value.trim();
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);

  return srcMatch?.[1]?.trim() ?? trimmed;
}

export function isGoogleMapsEmbedUrl(value: string): boolean {
  try {
    const url = new URL(extractUrl(value));
    const isGoogleHost =
      url.hostname === "www.google.com" ||
      url.hostname === "google.com" ||
      url.hostname === "maps.google.com";

    return (
      url.protocol === "https:" &&
      isGoogleHost &&
      (url.pathname.startsWith("/maps/embed") ||
        url.searchParams.get("output") === "embed")
    );
  } catch {
    return false;
  }
}

export function isGoogleMapsShareUrl(value: string): boolean {
  try {
    const url = new URL(extractUrl(value));

    return (
      url.protocol === "https:" &&
      (url.hostname === "maps.app.goo.gl" ||
        url.hostname === "goo.gl" ||
        (url.hostname.endsWith("google.com") &&
          url.pathname.startsWith("/maps/") &&
          !isGoogleMapsEmbedUrl(value)))
    );
  } catch {
    return false;
  }
}

export function getGoogleMapsEmbedUrl(
  value: string,
  address: string,
): string {
  const extractedUrl = extractUrl(value);

  if (isGoogleMapsEmbedUrl(extractedUrl)) {
    return extractedUrl;
  }

  if (isGoogleMapsShareUrl(extractedUrl) && address.trim()) {
    return `https://www.google.com/maps?q=${encodeURIComponent(
      address.trim(),
    )}&output=embed`;
  }

  return "";
}
