export type AiAgentDefinition = {
  key: string;
  label: string;
  userAgentPatterns: RegExp[];
  referrerHosts: string[];
};

export const AI_AGENTS: AiAgentDefinition[] = [
  {
    key: "openai",
    label: "ChatGPT / OpenAI",
    userAgentPatterns: [/gptbot/i, /chatgpt-user/i, /oai-searchbot/i],
    referrerHosts: ["chatgpt.com"],
  },
  {
    key: "anthropic",
    label: "Claude / Anthropic",
    userAgentPatterns: [/claudebot/i, /claude-user/i, /claude-searchbot/i, /anthropic-ai/i],
    referrerHosts: ["claude.ai"],
  },
  {
    key: "perplexity",
    label: "Perplexity",
    userAgentPatterns: [/perplexitybot/i, /perplexity-user/i],
    referrerHosts: ["perplexity.ai"],
  },
  {
    key: "google-ai",
    label: "Google AI / Gemini",
    // Googlebot is regular Search crawling. Google-Extended is a robots.txt
    // control token and has no distinct HTTP user agent. User-triggered
    // Google-Agent and NotebookLM are the identifiable AI-adjacent fetchers.
    userAgentPatterns: [/google-agent/i, /google-notebooklm/i],
    referrerHosts: ["gemini.google.com", "bard.google.com", "ai.google"],
  },
  {
    key: "microsoft-copilot",
    label: "Copilot / Bing",
    // Bingbot is the regular Bing Search crawler and is not proof of a
    // Copilot citation or AI-generated answer.
    userAgentPatterns: [],
    referrerHosts: ["copilot.microsoft.com"],
  },
  {
    key: "apple",
    label: "Apple Intelligence / Applebot",
    // Applebot powers search, Spotlight, Siri and possible AI use. A plain
    // Applebot request cannot be attributed specifically to Apple Intelligence.
    userAgentPatterns: [],
    referrerHosts: [],
  },
  {
    key: "meta",
    label: "Meta AI",
    userAgentPatterns: [/meta-externalagent/i, /meta-externalfetcher/i],
    // Only meta.ai counts as an AI referral. facebook.com and link-preview
    // fetchers are social traffic, not Meta AI traffic.
    referrerHosts: ["meta.ai"],
  },
  {
    key: "xai",
    label: "Grok / xAI",
    userAgentPatterns: [/grokbot/i, /xai-?crawler/i],
    referrerHosts: ["grok.com", "x.ai"],
  },
  {
    key: "deepseek",
    label: "DeepSeek",
    userAgentPatterns: [/deepseekbot/i, /deepseek-ai/i],
    referrerHosts: ["chat.deepseek.com"],
  },
  {
    key: "mistral",
    label: "Mistral / Le Chat",
    userAgentPatterns: [/mistralai/i],
    referrerHosts: ["chat.mistral.ai"],
  },
  {
    key: "other-ai",
    label: "Other AI bot",
    userAgentPatterns: [/bytespider/i, /youbot/i],
    referrerHosts: ["you.com", "phind.com", "duck.ai"],
  },
];

export function detectAiAgent(userAgent?: string | null): string | null {
  if (!userAgent) return null;
  const agent = AI_AGENTS.find((item) => item.userAgentPatterns.some((pattern) => pattern.test(userAgent)));
  return agent?.label ?? null;
}

export function detectAiReferrer(referrer?: string | null): string | null {
  if (!referrer) return null;
  let hostname: string;
  try {
    hostname = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
  const agent = AI_AGENTS.find((item) =>
    item.referrerHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`)),
  );
  return agent?.label ?? null;
}
