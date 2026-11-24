import Image from "next/image";
import chatgpt from "@/assets/sections/chatgpt-icon.webp";
import claude from "@/assets/sections/claude-icon.webp";
import copilot from "@/assets/sections/copilot-icon.webp";
import google from "@/assets/sections/google-ai-icon.webp";
import perplexity from "@/assets/sections/perplexity-icon.webp";

export type AiPlatform = "chatgpt" | "gemini" | "claude" | "perplexity" | "copilot" | "google";

const marks = { chatgpt, claude, copilot, google, perplexity };

/** Existing local artwork; no third-party image or model requests. */
export function AiPlatformMark({ platform }: { platform: AiPlatform }) {
  if (platform === "gemini") {
    return <svg viewBox="0 0 48 48" width="30" height="30" fill="none" aria-hidden>
      <defs><linearGradient id="av-gemini-mark" x1="8" y1="8" x2="40" y2="40"><stop stopColor="#4285F4" /><stop offset="0.5" stopColor="#9464ef" /><stop offset="1" stopColor="#f484ac" /></linearGradient></defs>
      <path d="M24 4C26 16 32 22 44 24 32 26 26 32 24 44 22 32 16 26 4 24 16 22 22 16 24 4Z" fill="url(#av-gemini-mark)" />
    </svg>;
  }
  return <Image src={marks[platform]} alt="" width={32} height={32} sizes="32px" className="size-8 object-contain" />;
}
