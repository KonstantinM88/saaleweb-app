import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type LabelPosition = "above" | "below" | "left" | "right";
type City = { name: string; x: number; y: number; major?: boolean; delay: number; labelPosition?: LabelPosition };

const DESKTOP_HALLE: City = { name: "Halle (Saale)", x: 26, y: 30, major: true, delay: 0 };

const DESKTOP_CITIES: City[] = [
  DESKTOP_HALLE,
  { name: "Leipzig", x: 70, y: 40, major: true, delay: 0.8 },
  { name: "Merseburg", x: 23, y: 47, delay: 1.5 },
  { name: "Schkeuditz", x: 50, y: 28, delay: 2.1 },
  { name: "Delitzsch", x: 61, y: 14, delay: 2.7 },
  { name: "Markkleeberg", x: 74, y: 55, delay: 3.3 },
  { name: "Landsberg", x: 40, y: 18, delay: 3.9 },
];

const MOBILE_HALLE: City = { name: "Halle (Saale)", x: 25, y: 43, major: true, delay: 0 };

const MOBILE_CITIES: City[] = [
  MOBILE_HALLE,
  { name: "Leipzig", x: 76, y: 58, major: true, delay: 0.8, labelPosition: "above" },
  { name: "Merseburg", x: 22, y: 66, delay: 1.5, labelPosition: "right" },
  { name: "Schkeuditz", x: 55, y: 44, delay: 2.1, labelPosition: "below" },
  { name: "Delitzsch", x: 69, y: 24, delay: 2.7, labelPosition: "right" },
  { name: "Markkleeberg", x: 79, y: 80, delay: 3.3, labelPosition: "above" },
  { name: "Landsberg", x: 42, y: 25, delay: 3.9, labelPosition: "left" },
];

function reachPath(hub: City, city: City, index: number) {
  const midX = (hub.x + city.x) / 2;
  const midY = (hub.y + city.y) / 2;
  const bend = [-5, 5, -4, -8, 8, -6][index] ?? 0;

  return `M ${hub.x} ${hub.y} Q ${midX} ${midY + bend} ${city.x} ${city.y}`;
}

function labelPositionClass(position: LabelPosition) {
  const positions: Record<LabelPosition, string> = {
    above: "bottom-full mb-1.5",
    below: "top-full mt-1.5",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };

  return positions[position];
}

function CityDot({ city, mapHeight }: { city: City; mapHeight: number }) {
  const size = city.major ? 13 : 9;
  const position = city.labelPosition ?? "below";

  return (
    <div
      className="absolute"
      style={{ left: `${city.x}%`, top: `${(city.y / mapHeight) * 100}%`, transform: "translate(-50%, -50%)" }}
    >
      <div className="relative grid place-items-center">
        <span
          aria-hidden
          className="absolute rounded-full border-2 border-brand-pink/50"
          style={{
            height: size + 10,
            width: size + 10,
            animation: `ping-ring 2.8s ease-out ${city.delay}s infinite`,
          }}
        />
        <span
          className="relative rounded-full bg-brand shadow-[0_0_14px_rgba(255,79,163,0.8)]"
          style={{ height: size, width: size }}
        />
        <span
          className={
            city.major
              ? `absolute ${labelPositionClass(position)} whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white shadow-card backdrop-blur-sm md:text-[11px]`
              : `absolute ${labelPositionClass(position)} whitespace-nowrap rounded-full border border-white/10 bg-dark/40 px-1.5 py-0.5 text-[9px] font-semibold text-white/75 backdrop-blur-sm md:bg-white/5 md:px-2 md:text-[10px]`
          }
        >
          {city.name}
        </span>
      </div>
    </div>
  );
}

function HubMarker({ hub, mapHeight, compact = false }: { hub: City; mapHeight: number; compact?: boolean }) {
  return (
    <div
      aria-hidden
      className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
      style={{ left: `${hub.x}%`, top: `${(hub.y / mapHeight) * 100}%` }}
    >
      <div
        className={
          compact
            ? "relative grid h-14 w-14 place-items-center rounded-2xl bg-brand text-[13px] font-black text-white shadow-[0_0_34px_rgba(255,79,163,0.72)]"
            : "relative grid h-12 w-12 place-items-center rounded-2xl bg-brand text-[12px] font-black text-white shadow-[0_0_34px_rgba(255,79,163,0.72)]"
        }
      >
        <span className="absolute inset-[-9px] rounded-[22px] border border-brand-pink/50 bg-brand-pink/10 animate-pulse" />
        <span className="absolute inset-[-17px] rounded-[28px] border border-brand-purple/25" />
        <span className="relative tracking-[0.08em]">SEO</span>
      </div>
      <span className="whitespace-nowrap rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-card backdrop-blur-sm md:px-3 md:text-[11px]">
        Halle (Saale)
      </span>
    </div>
  );
}

function MapScene({
  cities,
  hub,
  mapHeight,
  compact = false,
  className,
  floatA,
  floatB,
}: {
  cities: City[];
  hub: City;
  mapHeight: number;
  compact?: boolean;
  className?: string;
  floatA: string;
  floatB: string;
}) {
  const reachCities = cities.filter((city) => city.name !== hub.name);
  const mapCities = cities.filter((city) => city.name !== hub.name);
  const riverPath =
    mapHeight === 100
      ? "M 24 0 C 31 17, 22 34, 27 50 C 33 66, 23 82, 28 100"
      : "M 22 0 C 27 12, 21 24, 25 36 C 29 48, 22 58, 26 70";

  return (
    <div className={className}>
      <svg
        aria-hidden
        viewBox={`0 0 100 ${mapHeight}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d={riverPath}
          fill="none"
          stroke="rgba(96,165,250,0.30)"
          strokeWidth={mapHeight === 100 ? "2.1" : "1.6"}
          strokeLinecap="round"
        />
        <path
          d={mapHeight === 100 ? "M 4 61 C 28 51, 62 38, 96 29" : "M 4 46 C 30 38, 60 28, 96 20"}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <path
          d={mapHeight === 100 ? "M 57 0 C 61 34, 64 68, 70 100" : "M 56 0 C 60 24, 62 46, 67 70"}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <g>
          {reachCities.map((city, index) => {
            const path = reachPath(hub, city, index);

            return (
              <g key={`reach-${city.name}`}>
                <path
                  d={path}
                  fill="none"
                  stroke="rgba(255,79,163,0.62)"
                  strokeWidth={city.major ? "0.95" : "0.72"}
                  strokeDasharray="2.2 3.2"
                  strokeLinecap="round"
                  style={{ animation: `dash-march 1.6s linear ${index * 0.12}s infinite` }}
                />
                <circle r={city.major ? "1.25" : "0.95"} fill="#FF4FA3" opacity="0.95">
                  <animateMotion
                    begin={`${index * 0.28}s`}
                    dur={`${3.4 + index * 0.12}s`}
                    path={path}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}
        </g>
        <circle cx={hub.x} cy={hub.y} r="2.8" fill="#FF4FA3" opacity="0.35" />
        <circle cx={hub.x} cy={hub.y} r="1.65" fill="#FF4FA3" />
      </svg>

      <HubMarker hub={hub} mapHeight={mapHeight} compact={compact} />

      {mapCities.map((city) => (
        <CityDot key={city.name} city={city} mapHeight={mapHeight} />
      ))}

      <div className="absolute right-3 top-3 flex animate-bob items-center gap-2 rounded-xl border border-white/15 bg-dark/40 px-2.5 py-2 text-[11px] font-semibold text-white shadow-card backdrop-blur-sm md:right-4 md:top-4 md:bg-white/10 md:px-3 md:text-[12px]">
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand text-[10px]">SEO</span>
        <span className="max-w-[150px] leading-tight md:max-w-none">{floatA}</span>
      </div>
      <div className="absolute bottom-3 left-3 flex animate-bob items-center gap-2 rounded-xl border border-white/15 bg-dark/40 px-2.5 py-2 text-[11px] font-semibold text-white shadow-card backdrop-blur-sm [animation-delay:0.5s] md:bottom-4 md:left-4 md:bg-white/10 md:px-3 md:text-[12px]">
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand text-[10px]">50</span>
        <span className="leading-tight">{floatB}</span>
      </div>
    </div>
  );
}

export function LocalSeo() {
  const t = useTranslations("LocalSeo");

  return (
    <section id="local" className="py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <Reveal className="mx-auto max-w-[880px]">
          <div className="relative overflow-hidden rounded-[26px] bg-dark shadow-lift">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(420px 280px at 28% 38%, rgba(255,79,163,0.16), transparent 65%), radial-gradient(420px 280px at 72% 55%, rgba(139,92,246,0.16), transparent 65%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />

            <MapScene
              cities={MOBILE_CITIES}
              hub={MOBILE_HALLE}
              mapHeight={100}
              compact
              className="relative h-[420px] w-full sm:h-[500px] md:hidden"
              floatA={t("floatA")}
              floatB={t("floatB")}
            />
            <MapScene
              cities={DESKTOP_CITIES}
              hub={DESKTOP_HALLE}
              mapHeight={70}
              className="relative hidden aspect-[10/7] w-full md:block"
              floatA={t("floatA")}
              floatB={t("floatB")}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
