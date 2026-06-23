import { BrandLogo } from "@/shared/ui/BrandLogo";

const imageSrc = "/images/sections/ai-search-ecosystem.webp";

type AiNode = {
  label: string;
  desktopPosition: string;
  mobilePosition: string;
  className: string;
  Icon: () => React.ReactNode;
};

const nodeBaseClass =
  "absolute grid h-14 w-14 place-items-center rounded-[20px] border bg-white/[0.78] text-dark shadow-[0_24px_70px_-28px_rgba(17,24,39,0.55)] backdrop-blur-xl transition-all duration-700 hover:-translate-y-1.5 hover:scale-110 md:h-16 md:w-16 md:rounded-[24px]";

const nodes: AiNode[] = [
  {
    label: "ChatGPT",
    desktopPosition: "md:left-[15%] md:top-[28%]",
    mobilePosition: "left-[9%] top-[27%]",
    className: "border-[#10A37F]/50 shadow-[0_22px_70px_-30px_rgba(16,163,127,0.95)] hover:border-[#10A37F]/80",
    Icon: ChatGptIcon,
  },
  {
    label: "Gemini",
    desktopPosition: "md:left-[50%] md:top-[13%]",
    mobilePosition: "left-[47%] top-[16%]",
    className: "border-[#8E75FF]/50 shadow-[0_22px_70px_-30px_rgba(142,117,255,0.98)] hover:border-[#8E75FF]/80",
    Icon: GeminiIcon,
  },
  {
    label: "Claude",
    desktopPosition: "md:right-[15%] md:top-[32%]",
    mobilePosition: "right-[8%] top-[30%]",
    className: "border-[#D97745]/50 shadow-[0_22px_70px_-30px_rgba(217,119,69,0.95)] hover:border-[#D97745]/80",
    Icon: ClaudeIcon,
  },
  {
    label: "Perplexity",
    desktopPosition: "md:left-[28%] md:bottom-[17%]",
    mobilePosition: "left-[13%] bottom-[21%]",
    className: "border-[#20C7B2]/50 shadow-[0_22px_70px_-30px_rgba(32,199,178,0.95)] hover:border-[#20C7B2]/80",
    Icon: PerplexityIcon,
  },
  {
    label: "Google AI",
    desktopPosition: "md:right-[28%] md:bottom-[16%]",
    mobilePosition: "right-[13%] bottom-[20%]",
    className: "border-[#4285F4]/50 shadow-[0_22px_70px_-30px_rgba(66,133,244,0.9)] hover:border-[#4285F4]/80",
    Icon: GoogleAiIcon,
  },
  {
    label: "Copilot",
    desktopPosition: "md:left-[50%] md:bottom-[9%]",
    mobilePosition: "left-[47%] bottom-[8%]",
    className: "border-[#27C3F3]/50 shadow-[0_22px_70px_-30px_rgba(39,195,243,0.95)] hover:border-[#27C3F3]/80",
    Icon: CopilotIcon,
  },
];

function ChatGptIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9 md:h-10 md:w-10" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#10A37F" />
      <path
        d="M24.3 10.2c3.8-3.3 9.8-.8 10 4.3 5 1.2 6.5 7.6 2.3 10.7 1.8 4.9-3.3 9.2-7.9 7.4-3.7 3.5-9.8.8-10-4.3-5-1.2-6.5-7.6-2.3-10.7-1.8-4.9 3.3-9.2 7.9-7.4Z"
        stroke="white"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="m18.4 18.7 5.9-3.5 5.9 3.5v6.9l-5.9 3.5-5.9-3.5v-6.9Z" stroke="white" strokeWidth="2.2" />
      <path d="M24.3 15.2V29m-5.9-10.3 11.8 6.9m0-6.9-11.8 6.9" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function GeminiIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9 md:h-10 md:w-10" fill="none" aria-hidden>
      <defs>
        <linearGradient id="geminiGradient" x1="9" x2="39" y1="8" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5EA1FF" />
          <stop offset="0.46" stopColor="#A855F7" />
          <stop offset="1" stopColor="#FF4FA3" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#geminiGradient)" opacity="0.16" />
      <path
        d="M23.4 7.2c1.4 9.2 6.2 14 15.4 15.4-9.2 1.4-14 6.2-15.4 15.4-1.4-9.2-6.2-14-15.4-15.4 9.2-1.4 14-6.2 15.4-15.4Z"
        fill="url(#geminiGradient)"
      />
      <path
        d="M35.7 9.5c.5 3 2.1 4.7 5.1 5.1-3 .5-4.7 2.1-5.1 5.1-.5-3-2.1-4.7-5.1-5.1 3-.4 4.7-2.1 5.1-5.1Z"
        fill="url(#geminiGradient)"
        opacity="0.78"
      />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9 md:h-10 md:w-10" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#FAF2E8" />
      <circle cx="24" cy="24" r="4.4" fill="#D97745" />
      <path
        d="M24 7.8v8.3M24 31.9v8.3M7.8 24h8.3M31.9 24h8.3M12.5 12.5l5.9 5.9m11.2 11.2 5.9 5.9m0-23-5.9 5.9m-11.2 11.2-5.9 5.9"
        stroke="#D97745"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PerplexityIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9 md:h-10 md:w-10" fill="none" aria-hidden>
      <rect x="7" y="7" width="34" height="34" rx="10" fill="#102A2A" />
      <path d="M14 10.8h20v26.4H14z" stroke="#20C7B2" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M14 18.9h20M24 10.8v26.4" stroke="#20C7B2" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="m17.8 18.9 6.2 6 6.2-6M17.8 37.2l6.2-6 6.2 6"
        stroke="#E7FFFB"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleAiIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9 md:h-10 md:w-10" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="21" fill="white" />
      <path d="M24 10.7a13.3 13.3 0 0 1 9.4 3.8" stroke="#4285F4" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M35.3 21.5H24" stroke="#4285F4" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M35.3 21.5a11.9 11.9 0 0 1-3.2 11.4" stroke="#34A853" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M32.1 32.9A13.3 13.3 0 0 1 12.5 29" stroke="#FBBC05" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M12.5 29A13.3 13.3 0 0 1 14.5 14.5" stroke="#EA4335" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

function CopilotIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9 md:h-10 md:w-10" fill="none" aria-hidden>
      <path d="M14.8 10.2c4.2-4.7 11.6-3 13.6 3l1.6 4.8H19.2c-6 0-8.6-3.4-4.4-7.8Z" fill="#27C3F3" />
      <path d="M33.2 10.2c-4.2-4.7-11.6-3-13.6 3L18 18h10.8c6 0 8.6-3.4 4.4-7.8Z" fill="#7C3AED" opacity="0.94" />
      <path d="M12.6 36.1c3.4 5 10.8 4.4 13.4-1l2.2-4.6H17.6c-6 0-8.2 3.8-5 5.6Z" fill="#22C55E" />
      <path d="M35.4 36.1c-3.4 5-10.8 4.4-13.4-1l-2.2-4.6h10.6c6 0 8.2 3.8 5 5.6Z" fill="#FF4FA3" />
      <path
        d="M16.8 18h14.4c3.6 0 6.4 2.8 6.4 6.2 0 3.5-2.8 6.3-6.4 6.3H16.8c-3.6 0-6.4-2.8-6.4-6.3 0-3.4 2.8-6.2 6.4-6.2Z"
        fill="#111827"
        opacity="0.2"
      />
    </svg>
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
          style={{ backgroundImage: `url(${imageSrc})` }}
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
