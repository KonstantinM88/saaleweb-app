type Segment = { width: number; className: string };

const KW = "bg-brand-purple/80";
const FN = "bg-sky-400/80";
const STR = "bg-brand-pink/80";
const PL = "bg-white/25";
const NUM = "bg-amber-400/80";
const CM = "bg-white/15";

const LINES: { indent: number; segments: Segment[] }[] = [
  { indent: 0, segments: [{ width: 42, className: KW }, { width: 92, className: FN }, { width: 26, className: PL }] },
  { indent: 0, segments: [{ width: 36, className: KW }, { width: 56, className: PL }, { width: 112, className: STR }] },
  { indent: 1, segments: [{ width: 52, className: KW }, { width: 72, className: FN }, { width: 30, className: PL }] },
  { indent: 2, segments: [{ width: 118, className: STR }, { width: 40, className: PL }, { width: 26, className: NUM }] },
  { indent: 1, segments: [{ width: 64, className: FN }, { width: 30, className: NUM }, { width: 46, className: PL }] },
  { indent: 0, segments: [{ width: 20, className: PL }] },
  { indent: 0, segments: [{ width: 138, className: CM }] },
];

export function CodeWindow() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-white/10 bg-dark shadow-lift">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5">
          <i className="block h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="block h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="block h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <div className="flex gap-1.5 font-mono text-[11px]">
          <span className="rounded-md bg-white/10 px-2 py-1 font-semibold text-white">page.tsx</span>
          <span className="hidden rounded-md px-2 py-1 text-gray-400 sm:block">schema.prisma</span>
          <span className="hidden rounded-md px-2 py-1 text-gray-400 sm:block">api.ts</span>
        </div>
      </div>

      <div className="space-y-2.5 px-5 py-5">
        {LINES.map((line, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
            style={{
              paddingLeft: line.indent * 18,
              animation: "code-cascade 8s ease-in-out infinite",
              animationDelay: `${index * 0.55 - 8}s`,
            }}
          >
            <span className="w-3 shrink-0 text-right font-mono text-[10px] leading-none text-white/25">
              {index + 1}
            </span>
            {line.segments.map((segment, segmentIndex) => (
              <span
                key={segmentIndex}
                className={`h-2.5 rounded-[4px] ${segment.className}`}
                style={{ width: segment.width }}
              />
            ))}
          </div>
        ))}
        <div className="flex items-center gap-2 pl-[18px]">
          <span className="w-3" />
          <span
            className="h-3.5 w-[7px] rounded-[2px] bg-brand-pink"
            style={{ animation: "caret-blink 1.1s steps(1) infinite" }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 font-mono text-[11px]">
        <span className="flex items-center gap-2 font-semibold text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success [animation:pulse-dot_2.2s_ease-out_infinite]" />
          Build - 0.4 s
        </span>
        <span className="text-gray-400">PageSpeed 100 / 100</span>
      </div>
    </div>
  );
}
