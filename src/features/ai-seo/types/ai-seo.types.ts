export const AI_SEO_ENTITY_TYPES = [
  "project",
  "service",
  "post",
  "product",
] as const;

export type AiSeoEntityType = (typeof AI_SEO_ENTITY_TYPES)[number];

export const AI_SEO_LIMITS = {
  seoTitle: 60,
  seoDescription: 155,
  excerpt: 200,
  contentChars: 4000,
} as const;

export type AiSeoSuggestion = {
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
};

export type AiSeoInput = {
  entityType: AiSeoEntityType;
  title: string;
  location?: string;
  content?: string;
};

export type AiSeoResult =
  | { success: true; data: AiSeoSuggestion }
  | { success: false; message: string };
