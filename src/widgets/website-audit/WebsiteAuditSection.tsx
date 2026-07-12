"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BarChart3, Compass, Gauge, Sparkles } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { submitContact, type ContactState } from "@/features/contact/actions";
import { useTrackFormSuccess } from "@/features/analytics/useTrackFormSuccess";

type AuditPoint = {
  title: string;
  text: string;
};

const initialState: ContactState = { status: "idle" };
const icons = [Gauge, BarChart3, Compass, Sparkles];

export function WebsiteAuditSection() {
  const t = useTranslations("WebsiteAudit");
  const locale = useLocale();
  const points = t.raw("points") as AuditPoint[];
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  useTrackFormSuccess(state.status, "website_audit");

  const inputCls =
    "w-full rounded-xl border border-line bg-white/[0.9] px-4 py-3 text-[15px] text-ink outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20";

  return (
    <section
      id="website-audit"
      className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fb_50%,#ffffff_100%)] py-16 md:py-24"
      aria-labelledby="website-audit-title"
    >
      <Container>
        <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/[0.82] p-5 shadow-[0_34px_100px_-66px_rgba(139,92,246,0.72)] backdrop-blur md:p-8 lg:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(620px 320px at 0% 0%, rgba(255,79,163,0.14), transparent 62%), radial-gradient(620px 320px at 100% 100%, rgba(139,92,246,0.14), transparent 62%)",
            }}
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div>
              <span className="eyebrow">{t("eyebrow")}</span>
              <h2
                id="website-audit-title"
                className="mt-4 max-w-2xl text-[clamp(30px,4.5vw,52px)] font-extrabold leading-tight tracking-tight text-dark"
              >
                {t("title")}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink">{t("subtitle")}</p>
              <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-muted">{t("text")}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {points.map((point, index) => {
                  const Icon = icons[index] ?? Sparkles;

                  return (
                    <article
                      key={point.title}
                      className="rounded-[18px] border border-line bg-white/[0.86] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/25 hover:shadow-[0_22px_62px_-48px_rgba(139,92,246,0.58)]"
                    >
                      <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-brand-soft text-brand-purple">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <h3 className="font-extrabold text-dark">{point.title}</h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{point.text}</p>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-line bg-white p-5 shadow-[0_26px_82px_-58px_rgba(15,23,42,0.55)] md:p-6">
              {state.status === "success" ? (
                <div className="grid min-h-[360px] place-items-center text-center">
                  <div>
                    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700">
                      ✓
                    </div>
                    <h3 className="text-xl font-extrabold text-dark">{t("successTitle")}</h3>
                    <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-muted">
                      {t("successText")}
                    </p>
                  </div>
                </div>
              ) : (
                <form action={formAction} className="grid gap-3">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="source" value="website_audit" />
                  <input type="hidden" name="projectType" value="Website Audit" />
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden
                  />
                  <input name="name" required placeholder={t("name")} className={inputCls} />
                  <input name="email" type="email" required placeholder={t("email")} className={inputCls} />
                  <input
                    name="projectWebsite"
                    required
                    placeholder={t("website")}
                    className={inputCls}
                  />
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={t("message")}
                    className={inputCls}
                  />
                  {state.status === "error" && (
                    <p className="text-sm font-semibold text-brand-pink">{t("error")}</p>
                  )}
                  <button
                    type="submit"
                    disabled={pending}
                    className="btn-shine mt-2 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-5 py-3 text-[15px] font-bold text-white shadow-[0_18px_38px_-18px_rgba(139,92,246,0.85)] transition hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {pending ? t("sending") : t("button")}
                  </button>
                  <p className="text-center text-[12.5px] font-semibold text-muted">{t("trust")}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
