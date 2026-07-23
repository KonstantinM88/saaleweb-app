import type { ReactNode } from "react";
import Image from "next/image";
import aiSearchEcosystem from "@/assets/sections/ai-search-ecosystem.webp";
import chatGptIcon from "@/assets/sections/chatgpt-icon.webp";
import claudeIcon from "@/assets/sections/claude-icon.webp";
import copilotIcon from "@/assets/sections/copilot-icon.webp";
import googleAiIcon from "@/assets/sections/google-ai-icon.webp";
import perplexityIcon from "@/assets/sections/perplexity-icon.webp";
import { BrandLogo } from "@/shared/ui/BrandLogo";

type AiNode = {
  label: string;
  desktopPosition: string;
  mobilePosition: string;
  className: string;
  Icon: () => ReactNode;
};

const nodeBaseClass =
  "absolute grid h-[62px] w-[62px] place-items-center rounded-[22px] border border-white/[0.55] bg-white/[0.72] text-dark shadow-[0_28px_90px_-32px_rgba(17,24,39,0.62)] backdrop-blur-2xl transition-all duration-700 hover:-translate-y-2 hover:scale-110 hover:bg-white/[0.86] md:h-[72px] md:w-[72px] md:rounded-[26px]";

const nodes: AiNode[] = [
  {
    label: "ChatGPT",
    desktopPosition: "md:left-[15%] md:top-[28%]",
    mobilePosition: "left-[9%] top-[27%]",
    className: "shadow-[0_24px_80px_-30px_rgba(0,0,0,0.95)] hover:border-black/30",
    Icon: ChatGptIcon,
  },
  {
    label: "Gemini",
    desktopPosition: "md:left-[50%] md:top-[13%]",
    mobilePosition: "left-[47%] top-[16%]",
    className: "shadow-[0_24px_80px_-30px_rgba(142,117,255,1)] hover:border-[#8E75FF]/70",
    Icon: GeminiIcon,
  },
  {
    label: "Claude",
    desktopPosition: "md:right-[15%] md:top-[32%]",
    mobilePosition: "right-[8%] top-[30%]",
    className: "shadow-[0_24px_80px_-30px_rgba(217,119,69,1)] hover:border-[#D97745]/70",
    Icon: ClaudeIcon,
  },
  {
    label: "Perplexity",
    desktopPosition: "md:left-[28%] md:bottom-[17%]",
    mobilePosition: "left-[13%] bottom-[21%]",
    className: "shadow-[0_24px_80px_-30px_rgba(32,199,178,1)] hover:border-[#20C7B2]/70",
    Icon: PerplexityIcon,
  },
  {
    label: "Google AI",
    desktopPosition: "md:right-[28%] md:bottom-[16%]",
    mobilePosition: "right-[13%] bottom-[20%]",
    className: "shadow-[0_24px_80px_-30px_rgba(66,133,244,0.95)] hover:border-[#4285F4]/70",
    Icon: GoogleAiIcon,
  },
  {
    label: "Copilot",
    desktopPosition: "md:left-[50%] md:bottom-[9%]",
    mobilePosition: "left-[47%] bottom-[8%]",
    className: "shadow-[0_24px_80px_-30px_rgba(39,195,243,1)] hover:border-[#27C3F3]/70",
    Icon: CopilotIcon,
  },
];

function PremiumIconShell({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <span
      className={`relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_18px_42px_-24px_rgba(15,23,42,0.95)] ring-1 ring-white/[0.55] md:h-12 md:w-12 ${className}`}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.78),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.16),transparent_56%)]" />
      <span className="absolute inset-x-2 top-1 h-px bg-white/[0.55]" />
      <span className="relative">{children}</span>
    </span>
  );
}

function ChatGptIcon() {
  return (
    <PremiumIconShell className="bg-gradient-to-br from-white via-[#F8FAFC] to-[#EEF2F7] ring-black/10">
      <Image
        src={chatGptIcon}
        alt=""
        width={40}
        height={40}
        sizes="40px"
        unoptimized
        className="h-9 w-9 rounded-full object-cover shadow-[0_12px_28px_-18px_rgba(0,0,0,0.95)] md:h-10 md:w-10"
      />
    </PremiumIconShell>
  );
}

function GeminiIcon() {
  return (
    <PremiumIconShell className="bg-gradient-to-br from-[#E9E4FF] via-white to-[#F5D5FF]">
      <svg viewBox="0 0 48 48" className="h-9 w-9 md:h-10 md:w-10" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="geminiPremiumGradient" x1="8" x2="40" y1="7" y2="41" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5EA1FF" />
            <stop offset="0.42" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#FF4FA3" />
          </linearGradient>
        </defs>
        <path
          d="M23.7 6.4c1.5 9.8 6.6 14.9 16.4 16.4-9.8 1.5-14.9 6.6-16.4 16.4-1.5-9.8-6.6-14.9-16.4-16.4 9.8-1.5 14.9-6.6 16.4-16.4Z"
          fill="url(#geminiPremiumGradient)"
        />
        <path
          d="M36.8 8.8c.5 3.1 2.2 4.8 5.3 5.3-3.1.5-4.8 2.2-5.3 5.3-.5-3.1-2.2-4.8-5.3-5.3 3.1-.5 4.8-2.2 5.3-5.3Z"
          fill="url(#geminiPremiumGradient)"
          opacity="0.8"
        />
      </svg>
    </PremiumIconShell>
  );
}

function ClaudeIcon() {
  return (
    <PremiumIconShell className="bg-gradient-to-br from-white via-[#FFF7ED] to-[#F6E5D2]">
      <Image
        src={claudeIcon}
        alt=""
        width={42}
        height={42}
        sizes="42px"
        unoptimized
        className="h-10 w-10 object-contain drop-shadow-[0_10px_18px_rgba(217,119,69,0.18)] md:h-11 md:w-11"
      />
    </PremiumIconShell>
  );
}

function PerplexityIcon() {
  return (
    <PremiumIconShell className="bg-gradient-to-br from-white via-[#F8FAFC] to-[#E5F8F5]">
      <Image
        src={perplexityIcon}
        alt=""
        width={42}
        height={42}
        sizes="42px"
        unoptimized
        className="h-10 w-10 object-contain drop-shadow-[0_10px_18px_rgba(15,23,42,0.24)] md:h-11 md:w-11"
      />
    </PremiumIconShell>
  );
}

function GoogleAiIcon() {
  return (
    <PremiumIconShell className="bg-gradient-to-br from-white via-[#F8FAFC] to-[#EAF2FF]">
      <Image
        src={googleAiIcon}
        alt=""
        width={42}
        height={42}
        sizes="42px"
        unoptimized
        className="h-10 w-10 object-contain drop-shadow-[0_10px_18px_rgba(66,133,244,0.22)] md:h-11 md:w-11"
      />
    </PremiumIconShell>
  );
}

function CopilotIcon() {
  return (
    <PremiumIconShell className="bg-gradient-to-br from-white via-[#ECFEFF] to-[#F3E8FF]">
      <Image
        src={copilotIcon}
        alt=""
        width={42}
        height={42}
        sizes="42px"
        unoptimized
        className="h-10 w-10 object-contain drop-shadow-[0_10px_18px_rgba(39,195,243,0.2)] md:h-11 md:w-11"
      />
    </PremiumIconShell>
  );
}

export function AiSearchWindow({
  label,
  metric,
  caption,
}: {
  label: string;
  metric: string;
  caption: string;
}) {
  return (
    <div className="group mt-10 md:mt-14">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-2.5 shadow-[0_34px_100px_-68px_rgba(139,92,246,0.88)] transition-all duration-700 hover:border-brand-purple/40 hover:shadow-[0_50px_130px_-72px_rgba(255,79,163,0.72)] md:rounded-[34px] md:p-3">
        <div
          role="img"
          aria-label={label}
          className="relative min-h-[500px] overflow-hidden rounded-[22px] bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.015] sm:min-h-[560px] md:min-h-[560px] md:bg-fixed"
          style={{ backgroundImage: `url(${aiSearchEcosystem.src})` }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,79,163,0.05),transparent_36%),linear-gradient(180deg,rgba(17,24,39,0.00)_0%,rgba(17,24,39,0.03)_48%,rgba(17,24,39,0.22)_100%)]" />

          <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-3 rounded-full border border-white/30 bg-white/[0.38] px-3 py-2.5 text-dark shadow-[inset_0_1px_0_rgba(255,255,255,0.48)] backdrop-blur-xl sm:left-4 sm:right-4 md:left-6 md:right-6 md:top-6 md:px-4 md:py-3">
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-pink" />
              <span className="h-2.5 w-2.5 rounded-full bg-dark/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-purple" />
            </div>
            <span className="hidden text-xs font-black uppercase tracking-[0.24em] text-dark/[0.55] sm:inline">
              {label}
            </span>
            <span className="rounded-full border border-white/60 bg-white/[0.62] px-3 py-1 text-[11px] font-bold text-dark/75 shadow-card backdrop-blur md:text-xs">
              {metric}
            </span>
          </div>

          <div className="absolute left-1/2 top-1/2 grid h-[86px] w-[86px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[28px] border border-white/30 bg-white/[0.24] text-white shadow-[0_0_90px_rgba(255,79,163,0.42)] backdrop-blur-xl md:h-[104px] md:w-[104px] md:rounded-[34px]">
            <span className="absolute inset-[-16px] rounded-[38px] border border-brand-pink/40" />
            <span className="absolute inset-[-32px] rounded-[54px] border border-brand-purple/20" />
            <BrandLogo variant="icon" tone="light" animated={false} className="relative h-14 w-14 md:h-16 md:w-16" />
          </div>

          <div aria-hidden="true" className="absolute inset-0">
            {nodes.map((node) => (
              <div
                key={node.label}
                className={`${nodeBaseClass} ${node.className} ${node.mobilePosition} ${node.desktopPosition}`}
                title={node.label}
              >
                <node.Icon />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur md:mt-5 md:p-5">
          <p className="text-sm font-semibold leading-6 text-white/[0.82] md:text-base">{caption}</p>
        </div>
      </div>
    </div>
  );
}
