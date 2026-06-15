import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type City = { name: string; x: number; y: number; major?: boolean; delay: number };

const HALLE: City = { name: "Halle (Saale)", x: 26, y: 30, major: true, delay: 0 };

const CITIES: City[] = [
  HALLE,
  { name: "Leipzig", x: 70, y: 40, major: true, delay: 0.8 },
  { name: "Merseburg", x: 23, y: 47, delay: 1.5 },
  { name: "Schkeuditz", x: 50, y: 28, delay: 2.1 },
  { name: "Delitzsch", x: 61, y: 14, delay: 2.7 },
  { name: "Markkleeberg", x: 74, y: 55, delay: 3.3 },
  { name: "Landsberg", x: 40, y: 18, delay: 3.9 },
];

const HUB = { x: HALLE.x, y: HALLE.y };
const REACH_CITIES = CITIES.filter((city) => city.name !== HALLE.name);
const MAP_CITIES = CITIES.filter((city) => city.name !== HALLE.name);

function reachPath(city: City, index: number) {
  const midX = (HUB.x + city.x) / 2;
  const midY = (HUB.y + city.y) / 2;
  const bend = [-5, 5, -4, -8, 8, -6][index] ?? 0;

  return `M ${HUB.x} ${HUB.y} Q ${midX} ${midY + bend} ${city.x} ${city.y}`;
}

function CityDot({ city }: { city: City }) {
  const size = city.major ? 13 : 9;

  return (
    <div
      className="absolute"
      style={{ left: `${city.x}%`, top: `${(city.y / 70) * 100}%`, transform: "translate(-50%, -50%)" }}
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
              ? "absolute top-full mt-2 whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm"
              : "absolute top-full mt-1.5 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/70 backdrop-blur-sm"
          }
        >
          {city.name}
        </span>
      </div>
    </div>
  );
}

function HubMarker() {
  return (
    <div
      aria-hidden
      className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
      style={{ left: `${HUB.x}%`, top: `${(HUB.y / 70) * 100}%` }}
    >
      <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-brand text-[12px] font-black text-white shadow-[0_0_34px_rgba(255,79,163,0.72)]">
        <span className="absolute inset-[-9px] rounded-[22px] border border-brand-pink/50 bg-brand-pink/10 animate-pulse" />
        <span className="absolute inset-[-17px] rounded-[28px] border border-brand-purple/25" />
        <span className="relative tracking-[0.08em]">SEO</span>
      </div>
      <span className="whitespace-nowrap rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-extrabold text-white shadow-card backdrop-blur-sm">
        Halle (Saale)
      </span>
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

            <div className="relative aspect-[10/7] w-full">
              <svg
                aria-hidden
                viewBox="0 0 100 70"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                <path
                  d="M 22 0 C 27 12, 21 24, 25 36 C 29 48, 22 58, 26 70"
                  fill="none"
                  stroke="rgba(96,165,250,0.30)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path d="M 4 46 C 30 38, 60 28, 96 20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <path d="M 56 0 C 60 24, 62 46, 67 70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <g>
                  {REACH_CITIES.map((city, index) => {
                    const path = reachPath(city, index);

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
                <circle cx={HUB.x} cy={HUB.y} r="2.8" fill="#FF4FA3" opacity="0.35" />
                <circle cx={HUB.x} cy={HUB.y} r="1.65" fill="#FF4FA3" />
              </svg>

              <HubMarker />

              {MAP_CITIES.map((city) => (
                <CityDot key={city.name} city={city} />
              ))}

              <div className="absolute right-4 top-4 flex animate-bob items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[12px] font-semibold text-white shadow-card backdrop-blur-sm">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand text-[10px]">SEO</span>
                {t("floatA")}
              </div>
              <div className="absolute bottom-4 left-4 flex animate-bob items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[12px] font-semibold text-white shadow-card backdrop-blur-sm [animation-delay:0.5s]">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand text-[10px]">50</span>
                {t("floatB")}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
