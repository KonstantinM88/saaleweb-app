import {
  CheckCircle2,
  Eye,
  Gauge,
  LayoutPanelTop,
  ListChecks,
  MapPinned,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/shared/config/site";
import { FaqAccordion } from "@/widgets/faq/FaqAccordion";
import { AuditLeadForm } from "./AuditLeadForm";
import type { AuditLandingCopy } from "./auditContent";

const problemIcons = [Eye, ShieldCheck, Smartphone, Search];
const deliverableIcons = [Eye, LayoutPanelTop, Smartphone, MapPinned, Gauge, ListChecks];

export function AuditLandingPage({ copy, locale }: { copy: AuditLandingCopy; locale: string }) {
  return (
    <main>
      {/* ---------------- Hero ---------------- */}
      <section
        className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fb_60%,#ffffff_100%)] pb-14 pt-16 md:pb-20 md:pt-24"
        aria-labelledby="audit-hero-title"
      >
        <Container>
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="eyebrow">{copy.eyebrow}</span>
            <h1
              id="audit-hero-title"
              className="mt-4 text-[clamp(32px,5.2vw,56px)] font-extrabold leading-tight tracking-tight text-dark"
            >
              {copy.h1}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink">{copy.subtitle}</p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#audit-form"
                className="btn-shine inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-7 py-3 text-[15.5px] font-bold text-white shadow-[0_18px_38px_-18px_rgba(139,92,246,0.85)] transition hover:-translate-y-0.5 sm:w-auto"
              >
                {copy.ctaPrimary}
              </a>
              <a
                href={siteConfig.phone.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-line bg-white px-7 py-3 text-[15.5px] font-bold text-dark transition hover:-translate-y-0.5 hover:border-brand-purple/40 sm:w-auto"
              >
                {copy.ctaSecondary}
              </a>
            </div>

            <p className="mt-5 text-[13.5px] font-semibold text-muted">{copy.trustLine}</p>

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {copy.badges.map((badge) => (
                <li
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[12.5px] font-bold text-ink"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-purple" aria-hidden />
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ---------------- Problems ---------------- */}
      <section className="py-14 md:py-20" aria-labelledby="audit-problems-title">
        <Container>
          <h2
            id="audit-problems-title"
            className="mx-auto max-w-3xl text-center text-[clamp(26px,3.6vw,40px)] font-extrabold leading-tight tracking-tight text-dark"
          >
            {copy.problem.title}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.problem.cards.map((card, index) => {
              const Icon = problemIcons[index] ?? Sparkles;
              return (
                <article
                  key={card.title}
                  className="rounded-[18px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/25 hover:shadow-[0_22px_62px_-48px_rgba(139,92,246,0.58)]"
                >
                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-brand-soft text-brand-purple">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-extrabold text-dark">{card.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{card.text}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ---------------- Deliverables ---------------- */}
      <section className="bg-surface py-14 md:py-20" aria-labelledby="audit-get-title">
        <Container>
          <h2
            id="audit-get-title"
            className="mx-auto max-w-3xl text-center text-[clamp(26px,3.6vw,40px)] font-extrabold leading-tight tracking-tight text-dark"
          >
            {copy.deliverables.title}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.deliverables.cards.map((card, index) => {
              const Icon = deliverableIcons[index] ?? Sparkles;
              return (
                <article key={card.title} className="rounded-[18px] border border-line bg-white p-5">
                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-brand-soft text-brand-purple">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-extrabold text-dark">{card.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{card.text}</p>
                </article>
              );
            })}
          </div>
          <p className="mx-auto mt-8 max-w-2xl rounded-2xl border border-brand-purple/20 bg-brand-soft/60 px-6 py-4 text-center text-[15px] font-semibold leading-relaxed text-dark">
            {copy.deliverables.note}
          </p>
        </Container>
      </section>

      {/* ---------------- For whom + Process ---------------- */}
      <section className="py-14 md:py-20" aria-labelledby="audit-forwhom-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
            <div>
              <h2
                id="audit-forwhom-title"
                className="text-[clamp(24px,3vw,34px)] font-extrabold leading-tight tracking-tight text-dark"
              >
                {copy.forWhom.title}
              </h2>
              <ul className="mt-6 grid gap-3">
                {copy.forWhom.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15.5px] leading-relaxed text-ink">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-[clamp(24px,3vw,34px)] font-extrabold leading-tight tracking-tight text-dark">
                {copy.process.title}
              </h2>
              <ol className="mt-6 grid gap-4">
                {copy.process.steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4 rounded-[18px] border border-line bg-white p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-[14px] font-extrabold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-dark">{step.title}</h3>
                      <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- Trust / projects ---------------- */}
      <section className="bg-surface py-14 md:py-20" aria-labelledby="audit-trust-title">
        <Container>
          <h2
            id="audit-trust-title"
            className="mx-auto max-w-3xl text-center text-[clamp(24px,3vw,34px)] font-extrabold leading-tight tracking-tight text-dark"
          >
            {copy.trust.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[15.5px] text-muted">{copy.trust.text}</p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {copy.trust.projects.map((project) => (
              <li
                key={project.name}
                className="rounded-2xl border border-line bg-white px-5 py-3 text-center"
              >
                <span className="block font-extrabold text-dark">{project.name}</span>
                <span className="block text-[12.5px] font-semibold text-muted">{project.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 text-center">
            <Link
              href="/projekte"
              className="text-[14.5px] font-bold text-brand-purple underline-offset-4 hover:underline"
            >
              {copy.trust.linkLabel} →
            </Link>
          </div>
        </Container>
      </section>

      {/* ---------------- Form ---------------- */}
      <section id="audit-form" className="scroll-mt-24 py-14 md:py-20" aria-labelledby="audit-form-title">
        <Container>
          <div className="mx-auto max-w-xl rounded-[26px] border border-line bg-white p-6 shadow-[0_26px_82px_-58px_rgba(15,23,42,0.55)] md:p-8">
            <h2 id="audit-form-title" className="text-2xl font-extrabold tracking-tight text-dark">
              {copy.form.title}
            </h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{copy.form.subtitle}</p>
            <div className="mt-6">
              <AuditLeadForm copy={copy.form} locale={locale} />
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="bg-surface py-14 md:py-20" aria-labelledby="audit-faq-title">
        <Container>
          <h2
            id="audit-faq-title"
            className="mx-auto max-w-3xl text-center text-[clamp(24px,3vw,34px)] font-extrabold leading-tight tracking-tight text-dark"
          >
            {copy.faqTitle}
          </h2>
          <div className="mx-auto mt-8 max-w-3xl">
            <FaqAccordion items={copy.faq} />
          </div>
        </Container>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="py-14 md:py-20" aria-labelledby="audit-final-title">
        <Container>
          <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/[0.86] p-8 text-center shadow-[0_34px_100px_-66px_rgba(139,92,246,0.72)] md:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(620px 320px at 0% 0%, rgba(255,79,163,0.14), transparent 62%), radial-gradient(620px 320px at 100% 100%, rgba(139,92,246,0.14), transparent 62%)",
              }}
            />
            <h2
              id="audit-final-title"
              className="relative mx-auto max-w-2xl text-[clamp(24px,3.2vw,36px)] font-extrabold leading-tight tracking-tight text-dark"
            >
              {copy.final.title}
            </h2>
            <a
              href="#audit-form"
              className="btn-shine relative mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-8 py-3 text-[15.5px] font-bold text-white shadow-[0_18px_38px_-18px_rgba(139,92,246,0.85)] transition hover:-translate-y-0.5"
            >
              {copy.final.button}
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
}
