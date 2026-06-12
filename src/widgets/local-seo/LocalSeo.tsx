import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type City = { name: string; x: number; y: number; major?: boolean; delay: number };

const CITIES: City[] = [
  { name: "Halle (Saale)", x: 26, y: 30, major: true, delay: 0 },
  { name: "Leipzig", x: 70, y: 40, major: true, delay: 0.8 },
  { name: "Merseburg", x: 23, y: 47, delay: 1.5 },
  { name: "Schkeuditz", x: 50, y: 28, delay: 2.1 },
  { name: "Delitzsch", x: 61, y: 14, delay: 2.7 },
  { name: "Markkleeberg", x: 74, y: 55, delay: 3.3 },
  { name: "Landsberg", x: 40, y: 18, delay: 3.9 },
];

function CityDot({ city }: { city: City }) {
  const size = city.major ? 14 : 8;

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
              : "absolute top-full mt-1.5 whitespace-nowrap text-[10px] font-medium text-white/55"
          }
        >
          {city.name}
        </span>
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
                <path
                  d="M 26 30 C 38 24, 56 30, 70 40"
                  fill="none"
                  stroke="rgba(255,79,163,0.65)"
                  strokeWidth="0.9"
                  strokeDasharray="2.5 3.5"
                  strokeLinecap="round"
                  style={{ animation: "dash-march 1.4s linear infinite" }}
                />
                <circle r="1.5" fill="#FF4FA3" className="map-travel" />
              </svg>

              {CITIES.map((city) => (
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
