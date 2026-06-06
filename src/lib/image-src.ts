export function isValidImageSrc(
  src: string | null | undefined,
): src is string {
  if (!src) {
    return false;
  }

  const trimmedSrc = src.trim();

  if (!trimmedSrc) {
    return false;
  }

  if (trimmedSrc.startsWith("/")) {
    return !trimmedSrc.startsWith("//");
  }

  try {
    const url = new URL(trimmedSrc);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getSafeImageSrc(
  src: string | null | undefined,
): string | null {
  return isValidImageSrc(src) ? src.trim() : null;
}

export function shouldUseUnoptimizedImage(src: string): boolean {
  return (
    src.startsWith("http://") ||
    (src.startsWith("https://") &&
      !src.startsWith("https://res.cloudinary.com/"))
  );
}
