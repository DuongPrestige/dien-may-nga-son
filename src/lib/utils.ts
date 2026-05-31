type ClassDictionary = Record<string, boolean | null | undefined>;
type ClassArray = ClassValue[];
type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassDictionary
  | ClassArray;

function toClassName(value: ClassValue): string[] {
  if (!value || typeof value === "boolean") {
    return [];
  }

  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap(toClassName);
  }

  return Object.entries(value)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([className]) => className);
}

export function cn(...values: ClassValue[]): string {
  return values.flatMap(toClassName).join(" ");
}

