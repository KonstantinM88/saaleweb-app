import Image from "next/image";
import { ExternalLink, FolderCheck, ShieldCheck } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/shared/config/site";
import { EDITORIAL_REVIEW_DATE } from "@/shared/config/editorial";
import {
  getHomeHref,
  getLocalizedHref,
} from "@/shared/lib/localizedPath";

type Props = {
  locale: AppLocale;
  authorName?: string | null;
  authorRole?: string | null;
  authorBio?: string | null;
  authorAvatar?: string | null;
  reviewedAt?: string | null;
  id?: string;
};

const copy = {
  de: {
    eyebrow: "Verantwortung & Nachweise",
    title: "Fachlich geprüft. Persönlich verantwortet.",
    intro:
      "Unsere Empfehlungen beruhen auf realen Webprojekten, technischen Prüfungen und nachvollziehbaren Quellen — nicht auf pauschalen Ranking-Versprechen.",
    role: "Gründer & Webentwickler",
    responsible: "Fachlich verantwortlich",
    reviewed: "Zuletzt geprüft",
    method: "Grundlage",
    methodValue: "Projektpraxis · technische Audits · offizielle Plattform-Dokumentation",
    projects: "Reale Projekte ansehen",
    profile: "Google-Unternehmensprofil",
    disclaimer:
      "Suchpositionen und Nennungen in KI-Antworten hängen auch von externen Systemen ab und können nicht garantiert werden.",
  },
  en: {
    eyebrow: "Responsibility & evidence",
    title: "Expert-reviewed. Personally accountable.",
    intro:
      "Our recommendations are based on real web projects, technical reviews and traceable sources — not blanket ranking promises.",
    role: "Founder & web developer",
    responsible: "Editorial responsibility",
    reviewed: "Last reviewed",
    method: "Basis",
    methodValue: "Project practice · technical audits · official platform documentation",
    projects: "View real projects",
    profile: "Google Business Profile",
    disclaimer:
      "Search positions and mentions in AI answers also depend on external systems and cannot be guaranteed.",
  },
  ru: {
    eyebrow: "Ответственность и доказательства",
    title: "Проверено специалистом. С личной ответственностью.",
    intro:
      "Рекомендации основаны на реальных веб-проектах, технических проверках и проверяемых источниках, а не на общих обещаниях позиций.",
    role: "Основатель и веб-разработчик",
    responsible: "Ответственный за содержание",
    reviewed: "Последняя проверка",
    method: "Основание",
    methodValue: "Практика проектов · технические аудиты · официальная документация платформ",
    projects: "Посмотреть реальные проекты",
    profile: "Профиль компании в Google",
    disclaimer:
      "Позиции в поиске и упоминания в ответах ИИ зависят также от внешних систем и не могут быть гарантированы.",
  },
} satisfies Record<AppLocale, Record<string, string>>;

function formatDate(locale: AppLocale, value: string): string {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  }).format(date);
}

export function EditorialTrust({
  locale,
  authorName = siteConfig.founder,
  authorRole,
  authorBio,
  authorAvatar,
  reviewedAt = EDITORIAL_REVIEW_DATE,
  id = "editorial-trust-title",
}: Props) {
  const labels = copy[locale];
  const homeHref = getHomeHref(locale);
  const founderHref = `${homeHref}#founder`;
  const projectsHref = getLocalizedHref(locale, "projects");
  // Keep this shared trust block compatible with the current Next Image setup,
  // which intentionally has no broad remote-image allowlist.
  const avatar = authorAvatar?.startsWith("/")
    ? authorAvatar
    : "/images/sections/founder-avatar.webp";

  return (
    <aside
      className="overflow-hidden rounded-[26px] border border-brand-purple/15 bg-white shadow-[0_30px_90px_-68px_rgba(88,28,135,0.65)]"
      aria-labelledby={id}
    >
      <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:p-8">
        <div>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#6D28D9]">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {labels.eyebrow}
          </span>
          <h2 id={id} className="mt-3 text-[clamp(23px,3vw,34px)] font-extrabold tracking-tight text-dark">
            {labels.title}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{labels.intro}</p>

          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-surface p-3.5">
            <Image
              src={avatar}
              alt={authorName || siteConfig.founder}
              width={56}
              height={56}
              sizes="56px"
              className="h-14 w-14 shrink-0 rounded-2xl object-cover"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                {labels.responsible}
              </p>
              <a href={founderHref} className="mt-1 block font-extrabold text-dark hover:text-[#6D28D9]">
                {authorName || siteConfig.founder}
              </a>
              <p className="text-[13px] text-muted">{authorRole || labels.role}</p>
            </div>
          </div>
          {authorBio ? <p className="mt-3 text-[14px] leading-relaxed text-muted">{authorBio}</p> : null}
        </div>

        <div className="rounded-[22px] border border-line bg-surface/70 p-5 md:p-6">
          <dl className="grid gap-4">
            {reviewedAt ? (
              <div>
                <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#6D28D9]">
                  {labels.reviewed}
                </dt>
                <dd className="mt-1 text-[15px] font-semibold text-ink">
                  <time dateTime={reviewedAt}>{formatDate(locale, reviewedAt)}</time>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#6D28D9]">
                {labels.method}
              </dt>
              <dd className="mt-1 text-[14px] leading-relaxed text-ink">{labels.methodValue}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <a
              href={projectsHref}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] font-bold text-dark transition hover:-translate-y-0.5 hover:border-brand-purple/35 hover:text-[#6D28D9]"
            >
              <FolderCheck className="h-4 w-4" aria-hidden />
              {labels.projects}
            </a>
            <a
              href={siteConfig.googleBusiness.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] font-bold text-dark transition hover:-translate-y-0.5 hover:border-brand-purple/35 hover:text-[#6D28D9]"
            >
              {labels.profile}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
          <p className="mt-5 border-t border-line pt-4 text-[12.5px] leading-relaxed text-muted">
            {labels.disclaimer}
          </p>
        </div>
      </div>
    </aside>
  );
}
