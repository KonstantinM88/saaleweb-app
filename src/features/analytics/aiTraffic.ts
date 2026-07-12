export type AiAgentDefinition = {
  key: string;
  label: string;
  userAgentPatterns: RegExp[];
  referrerPatterns: RegExp[];
};

export const AI_AGENTS: AiAgentDefinition[] = [
  {
    key: "openai",
    label: "ChatGPT / OpenAI",
    userAgentPatterns: [/gptbot/i, /chatgpt-user/i, /oai-searchbot/i],
    referrerPatterns: [/chatgpt\.com/i, /openai\.com/i],
  },
  {
    key: "anthropic",
    label: "Claude / Anthropic",
    userAgentPatterns: [/claudebot/i, /claude-user/i, /claude-searchbot/i, /anthropic-ai/i],
    referrerPatterns: [/claude\.ai/i, /anthropic\.com/i],
  },
  {
    key: "perplexity",
    label: "Perplexity",
    userAgentPatterns: [/perplexitybot/i, /perplexity-user/i],
    referrerPatterns: [/perplexity\.ai/i],
  },
  {
    key: "google-ai",
    label: "Google AI / Gemini",
    userAgentPatterns: [/google-extended/i, /googleother/i, /google-inspectiontool/i, /googlebot/i],
    referrerPatterns: [/gemini\.google\.com/i, /bard\.google\.com/i, /ai\.google/i],
  },
  {
    key: "microsoft-copilot",
    label: "Copilot / Bing",
    userAgentPatterns: [/bingbot/i, /bingpreview/i, /msnbot/i, /microsoftpreview/i],
    referrerPatterns: [/copilot\.microsoft\.com/i],
  },
  {
    key: "apple",
    label: "Apple Intelligence / Applebot",
    userAgentPatterns: [/applebot/i],
    // Note: no referrer patterns — a click from apple.com is regular web
    // traffic, not an AI-assistant referral.
    referrerPatterns: [],
  },
  {
    key: "meta",
    label: "Meta AI",
    userAgentPatterns: [/meta-externalagent/i, /facebookexternalhit/i, /facebookbot/i],
    // Note: only meta.ai counts as an AI referral. facebook.com referrers are
    // social traffic and previously inflated the AI numbers.
    referrerPatterns: [/meta\.ai/i],
  },
  {
    key: "xai",
    label: "Grok / xAI",
    userAgentPatterns: [/grokbot/i, /xai-?crawler/i],
    referrerPatterns: [/grok\.com/i, /x\.ai/i],
  },
  {
    key: "deepseek",
    label: "DeepSeek",
    userAgentPatterns: [/deepseekbot/i, /deepseek-ai/i],
    referrerPatterns: [/deepseek\.com/i],
  },
  {
    key: "mistral",
    label: "Mistral / Le Chat",
    userAgentPatterns: [/mistralai/i],
    referrerPatterns: [/mistral\.ai/i],
  },
  {
    key: "other-ai",
    label: "Other AI bot",
    userAgentPatterns: [/bytespider/i, /ccbot/i, /diffbot/i, /youbot/i],
    referrerPatterns: [/you\.com/i, /phind\.com/i, /duck\.ai/i],
  },
];

export function detectAiAgent(userAgent?: string | null): string | null {
  if (!userAgent) return null;
  const agent = AI_AGENTS.find((item) => item.userAgentPatterns.some((pattern) => pattern.test(userAgent)));
  return agent?.label ?? null;
}

export function detectAiReferrer(referrer?: string | null): string | null {
  if (!referrer) return null;
  const agent = AI_AGENTS.find((item) => item.referrerPatterns.some((pattern) => pattern.test(referrer)));
  return agent?.label ?? null;
}
