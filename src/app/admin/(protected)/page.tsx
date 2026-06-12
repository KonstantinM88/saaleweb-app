import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDashboardAnalytics, type DayPoint } from "@/features/admin/analytics/data";
import { cn } from "@/shared/lib/cn";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { adminCard } from "@/widgets/admin/ui";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90];

async function count(fn: () => Promise<number>): Promise<number> {
  try {
    return await fn();
  } catch {
    return 0;
  }
}

function Bars({ data, color }: { data: DayPoint[]; color: string }) {
  const width = 720;
  const height = 130;
  const max = Math.max(1, ...data.map((point) => point.count));
  const gap = data.length > 45 ? 1 : 2;
  const barWidth = (width - (data.length - 1) * gap) / data.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full" preserveAspectRatio="none">
      {data.map((point, index) => {
        const barHeight = Math.round((point.count / max) * (height - 8));
        return (
          <rect
            key={point.day}
            x={index * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={1.5}
            fill={color}
          >
            <title>{`${point.day}: ${point.count}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const sp = await searchParams;
  const range = RANGES.includes(Number(sp.range)) ? Number(sp.range) : 30;

  const [analytics, services, industries, posts, projects] = await Promise.all([
    getDashboardAnalytics(range),
    count(() => prisma.service.count()),
    count(() => prisma.industry.count()),
    count(() => prisma.blogPost.count()),
    count(() => prisma.project.count()),
  ]);

  const metrics = [
    { label: `Aufrufe (${range} T.)`, value: analytics.viewsTotal },
    { label: `Eindeutige Besucher (${range} T.)`, value: analytics.uniqueTotal },
    { label: `Anfragen (${range} T.)`, value: analytics.leadsTotal },
    { label: "Neue Anfragen", value: analytics.leadsNew, href: "/admin/leads" },
  ];

  const formatDay = (value: string) => value.slice(5).replace("-", ".");

  return (
    <>
      <PageHeader title="Uebersicht" subtitle="Aufrufe und Anfragen im Zeitverlauf." />

      <div className="mb-6 flex gap-2">
        {RANGES.map((item) => (
          <Link
            key={item}
            href={`/admin?range=${item}`}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition",
              item === range
                ? "border-transparent bg-brand text-white"
                : "border-line bg-white text-ink hover:border-brand-purple",
            )}
          >
            {item} Tage
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const inner = (
            <>
              <div className="text-3xl font-bold text-dark">{metric.value}</div>
              <div className="mt-1 text-sm text-muted">{metric.label}</div>
            </>
          );

          return metric.href ? (
            <Link
              key={metric.label}
              href={metric.href}
              className={`${adminCard} p-5 transition hover:-translate-y-0.5 hover:shadow-sm`}
            >
              {inner}
            </Link>
          ) : (
            <div key={metric.label} className={`${adminCard} p-5`}>
              {inner}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className={`${adminCard} p-5`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-dark">Aufrufe</h2>
            <span className="text-sm text-muted">{analytics.viewsTotal}</span>
          </div>
          <Bars data={analytics.viewsSeries} color="#FF4FA3" />
          <div className="mt-1 flex justify-between text-[11px] text-muted">
            <span>
              {analytics.viewsSeries.length ? formatDay(analytics.viewsSeries[0].day) : ""}
            </span>
            <span>
              {analytics.viewsSeries.length
                ? formatDay(analytics.viewsSeries[analytics.viewsSeries.length - 1].day)
                : ""}
            </span>
          </div>
        </div>

        <div className={`${adminCard} p-5`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-dark">Eindeutige Besucher</h2>
            <span className="text-sm text-muted">{analytics.uniqueTotal}</span>
          </div>
          <Bars data={analytics.uniqueSeries} color="#10B981" />
          <div className="mt-1 flex justify-between text-[11px] text-muted">
            <span>
              {analytics.uniqueSeries.length ? formatDay(analytics.uniqueSeries[0].day) : ""}
            </span>
            <span>
              {analytics.uniqueSeries.length
                ? formatDay(analytics.uniqueSeries[analytics.uniqueSeries.length - 1].day)
                : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className={`${adminCard} p-5`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-dark">Anfragen</h2>
            <span className="text-sm text-muted">
              {analytics.leadsTotal} - gesamt {analytics.leadsAllTime}
            </span>
          </div>
          <Bars data={analytics.leadsSeries} color="#8B5CF6" />
          <div className="mt-1 flex justify-between text-[11px] text-muted">
            <span>
              {analytics.leadsSeries.length ? formatDay(analytics.leadsSeries[0].day) : ""}
            </span>
            <span>
              {analytics.leadsSeries.length
                ? formatDay(analytics.leadsSeries[analytics.leadsSeries.length - 1].day)
                : ""}
            </span>
          </div>
        </div>

        <div className={`${adminCard} p-5`}>
          <h2 className="mb-3 font-semibold text-dark">Top-Seiten ({range} T.)</h2>
          {analytics.topPaths.length === 0 ? (
            <p className="text-sm text-muted">Noch keine Daten.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {analytics.topPaths.map((path) => (
                <li key={path.path} className="flex items-center justify-between gap-3">
                  <span className="truncate font-mono text-xs text-ink">{path.path}</span>
                  <span className="shrink-0 font-semibold text-dark">{path.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className={`${adminCard} p-5`}>
          <h2 className="mb-3 font-semibold text-dark">Inhalte</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <Link href="/admin/services" className="text-ink hover:text-brand-purple">
                Leistungen
              </Link>
              <span className="font-semibold">{services}</span>
            </li>
            <li className="flex justify-between">
              <Link href="/admin/industries" className="text-ink hover:text-brand-purple">
                Branchen
              </Link>
              <span className="font-semibold">{industries}</span>
            </li>
            <li className="flex justify-between">
              <Link href="/admin/projects" className="text-ink hover:text-brand-purple">
                Projekte
              </Link>
              <span className="font-semibold">{projects}</span>
            </li>
            <li className="flex justify-between">
              <Link href="/admin/blog" className="text-ink hover:text-brand-purple">
                Artikel
              </Link>
              <span className="font-semibold">{posts}</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
