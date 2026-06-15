type AiName = "ChatGPT" | "Gemini" | "Perplexity" | "Claude" | "Google AI" | "Copilot";
type OrbitNode = { label: AiName; angle: number };

const OUTER: OrbitNode[] = [
  { label: "ChatGPT", angle: -30 },
  { label: "Gemini", angle: 95 },
  { label: "Perplexity", angle: 210 },
];

const INNER: OrbitNode[] = [
  { label: "Claude", angle: 40 },
  { label: "Google AI", angle: 215 },
  { label: "Copilot", angle: 320 },
];

function AiIcon({ label }: { label: AiName }) {
  switch (label) {
    case "ChatGPT":
      return (
        <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" aria-hidden>
          <path
            d="M12 4.2c2.1-1.8 5.4-.4 5.5 2.4 2.8.7 3.6 4.2 1.3 5.9 1 2.7-1.8 5.1-4.4 4.1-2 1.9-5.4.4-5.5-2.4-2.8-.7-3.6-4.2-1.3-5.9-1-2.7 1.8-5.1 4.4-4.1Z"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinejoin="round"
          />
          <path d="m8.7 8.9 3.3-1.9 3.3 1.9v3.8L12 14.6l-3.3-1.9V8.9Z" stroke="currentColor" strokeWidth="1.25" />
          <path d="M12 7v7.6m-3.3-5.7 6.6 3.8m0-3.8-6.6 3.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    case "Gemini":
      return (
        <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" aria-hidden>
          <path
            d="M12 3.4c.7 4.5 3.1 6.9 7.6 7.6-4.5.7-6.9 3.1-7.6 7.6-.7-4.5-3.1-6.9-7.6-7.6 4.5-.7 6.9-3.1 7.6-7.6Z"
            fill="currentColor"
          />
          <path d="M18.2 3.8c.3 1.6 1.1 2.4 2.7 2.7-1.6.3-2.4 1.1-2.7 2.7-.3-1.6-1.1-2.4-2.7-2.7 1.6-.3 2.4-1.1 2.7-2.7Z" fill="currentColor" opacity="0.7" />
        </svg>
      );
    case "Perplexity":
      return (
        <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" aria-hidden>
          <path d="M6 4.5h12v15H6z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
          <path d="M6 9.2h12M12 4.5v15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          <path d="m8.4 9.2 3.6 3.4 3.6-3.4M8.4 19.5l3.6-3.4 3.6 3.4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Claude":
      return (
        <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          <path
            d="M12 3.8v4.1M12 16.1v4.1M3.8 12h4.1M16.1 12h4.1M6.2 6.2l2.9 2.9m5.8 5.8 2.9 2.9m0-11.6-2.9 2.9m-5.8 5.8-2.9 2.9"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Google AI":
      return (
        <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" aria-hidden>
          <path d="M12 4.8a7.2 7.2 0 0 1 5.1 2.1" stroke="#4285F4" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M18.2 9.9H12" stroke="#4285F4" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M18.2 9.9a6.4 6.4 0 0 1-1.7 6.2" stroke="#34A853" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M16.5 16.1A7.2 7.2 0 0 1 5.8 14" stroke="#FBBC05" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M5.8 14A7.2 7.2 0 0 1 6.9 6.9" stroke="#EA4335" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "Copilot":
      return (
        <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" aria-hidden>
          <path
            d="M7.4 5.2c2.1-2.3 5.8-1.5 6.8 1.5l.8 2.4H9.6C6.6 9.1 5.3 7.4 7.4 5.2Z"
            fill="#27C3F3"
          />
          <path
            d="M16.6 5.2c-2.1-2.3-5.8-1.5-6.8 1.5L9 9.1h5.4c3 0 4.3-1.7 2.2-3.9Z"
            fill="#7C3AED"
            opacity="0.92"
          />
          <path
            d="M6.3 18.1c1.7 2.5 5.4 2.2 6.7-.5l1.1-2.3H8.8c-3 0-4.1 1.9-2.5 2.8Z"
            fill="#22C55E"
          />
          <path
            d="M17.7 18.1c-1.7 2.5-5.4 2.2-6.7-.5l-1.1-2.3h5.3c3 0 4.1 1.9 2.5 2.8Z"
            fill="#FF4FA3"
            opacity="0.95"
          />
          <path d="M8.4 9.1h7.2c1.8 0 3.2 1.4 3.2 3.1 0 1.7-1.4 3.1-3.2 3.1H8.4c-1.8 0-3.2-1.4-3.2-3.1 0-1.7 1.4-3.1 3.2-3.1Z" fill="currentColor" opacity="0.18" />
        </svg>
      );
  }
}

function Pill({ label }: { label: AiName }) {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.08] py-1.5 pl-1.5 pr-3 text-[11px] font-semibold text-white shadow-[0_6px_18px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/15 bg-gradient-to-br from-white/20 to-white/5 text-brand-pink shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_18px_rgba(255,79,163,0.26)]">
        <AiIcon label={label} />
      </span>
      {label}
    </span>
  );
}

function Orbit({
  nodes,
  radius,
  duration,
  reverse,
}: {
  nodes: OrbitNode[];
  radius: number;
  duration: number;
  reverse?: boolean;
}) {
  const spin = reverse
    ? `spin-reverse ${duration}s linear infinite`
    : `spin-slow ${duration}s linear infinite`;
  const counter = reverse
    ? `spin-slow ${duration}s linear infinite`
    : `spin-reverse ${duration}s linear infinite`;

  return (
    <div className="absolute inset-0" style={{ animation: spin }}>
      {nodes.map((node) => (
        <div
          key={node.label}
          className="absolute left-1/2 top-1/2"
          style={{ transform: `rotate(${node.angle}deg) translateX(${radius}px)` }}
        >
          <div style={{ transform: `rotate(${-node.angle}deg)` }}>
            <div className="-translate-x-1/2 -translate-y-1/2" style={{ animation: counter }}>
              <Pill label={node.label} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AiOrbit() {
  return (
    <div className="relative mx-auto h-[290px] w-[290px] select-none sm:h-[380px] sm:w-[380px]">
      <div className="absolute inset-0 origin-center scale-[0.76] sm:scale-100">
        <div className="relative h-full w-full">
          <div
            aria-hidden
            className="absolute inset-[-40px]"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,79,163,0.22), rgba(139,92,246,0.10) 45%, transparent 70%)",
            }}
          />

          <div className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15" />
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border-2 border-brand-pink/40"
              style={{ animation: "ping-ring 3.2s ease-out infinite" }}
            />
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border-2 border-brand-purple/40"
              style={{ animation: "ping-ring 3.2s ease-out 1.6s infinite" }}
            />
            <div className="relative grid h-[78px] w-[78px] place-items-center rounded-[24px] bg-brand text-3xl font-extrabold text-white shadow-[0_14px_40px_-10px_rgba(255,79,163,0.7)]">
              S
            </div>
          </div>

          <Orbit nodes={OUTER} radius={150} duration={38} />
          <Orbit nodes={INNER} radius={95} duration={26} reverse />
        </div>
      </div>
    </div>
  );
}
