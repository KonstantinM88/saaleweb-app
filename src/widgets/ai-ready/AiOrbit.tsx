type OrbitNode = { label: string; angle: number };

const OUTER: OrbitNode[] = [
  { label: "ChatGPT", angle: -30 },
  { label: "Gemini", angle: 95 },
  { label: "Perplexity", angle: 210 },
];

const INNER: OrbitNode[] = [
  { label: "Claude", angle: 40 },
  { label: "Google AI", angle: 215 },
];

function Pill({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_6px_18px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
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
