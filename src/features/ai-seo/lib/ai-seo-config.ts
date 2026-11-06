import "server-only";

export const AI_SEO_MODEL = "claude-haiku-5-5";

/** The AI SEO generator is optional: it is enabled only when a key is set. */
export function isAiSeoEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}
