"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { submitContact, type ContactState } from "@/features/contact/actions";
import { BrandText } from "@/shared/ui/BrandText";

const initialState: ContactState = { status: "idle" };

type SelectOption = {
  value: string;
  label: string;
};

export function ContactPageForm() {
  const t = useTranslations("ContactPage.form");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const projectTypeOptions = t.raw("projectTypeOptions") as SelectOption[];
  const budgetOptions = t.raw("budgetOptions") as SelectOption[];

  const fieldClass =
    "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/15";
  const labelClass = "mb-2 block text-sm font-semibold text-dark";

  if (state.status === "success") {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-[0_28px_70px_-46px_rgba(16,185,129,0.65)]">
        <div aria-hidden className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-300/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-brand-purple/15 blur-3xl" />
        <div className="relative mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-white text-emerald-700 shadow-[0_18px_38px_-24px_rgba(16,185,129,0.75)] motion-safe:animate-bob">
          <CheckCircle2 size={30} aria-hidden />
        </div>
        <h3 className="relative text-2xl font-bold tracking-tight text-dark">{t("successTitle")}</h3>
        <p className="relative mx-auto mt-3 max-w-[430px] text-[15.5px] leading-relaxed text-muted">
          <BrandText text={t("successText")} />
        </p>
        <p className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
          <Sparkles size={16} aria-hidden />
          {t("successMeta")}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-[30px] border border-line bg-white p-5 shadow-[0_34px_90px_-56px_rgba(17,24,39,0.55)] sm:p-7 lg:p-8"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value="contact_page" />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="mb-6">
        <p className="text-sm font-semibold text-[#6D28D9]">{t("eyebrow")}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-dark sm:text-3xl">{t("title")}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          <BrandText text={t("lead")} />
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className={labelClass}>{t("name")}</span>
          <input name="name" required autoComplete="name" placeholder={t("namePlaceholder")} className={fieldClass} />
        </label>

        <label>
          <span className={labelClass}>{t("company")}</span>
          <input name="company" autoComplete="organization" placeholder={t("companyPlaceholder")} className={fieldClass} />
        </label>

        <label>
          <span className={labelClass}>{t("projectWebsite")}</span>
          <input
            name="projectWebsite"
            inputMode="url"
            autoComplete="url"
            placeholder={t("projectWebsitePlaceholder")}
            className={fieldClass}
          />
        </label>

        <label>
          <span className={labelClass}>{t("email")}</span>
          <input name="email" type="email" required autoComplete="email" placeholder={t("emailPlaceholder")} className={fieldClass} />
        </label>

        <label>
          <span className={labelClass}>{t("phone")}</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder={t("phonePlaceholder")} className={fieldClass} />
        </label>

        <label>
          <span className={labelClass}>{t("projectType")}</span>
          <select name="projectType" defaultValue="" className={fieldClass}>
            <option value="">{t("projectTypePlaceholder")}</option>
            {projectTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className={labelClass}>{t("budget")}</span>
          <select name="budget" defaultValue="" className={fieldClass}>
            <option value="">{t("budgetPlaceholder")}</option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className={labelClass}>{t("message")}</span>
          <textarea
            name="message"
            required
            rows={5}
            placeholder={t("messagePlaceholder")}
            className={`${fieldClass} resize-y`}
          />
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-[14px] leading-relaxed text-muted">
        <input
          required
          type="checkbox"
          name="privacy"
          value="accepted"
          className="mt-1 h-4 w-4 rounded border-line text-brand-purple focus:ring-brand-purple"
        />
        <span>{t("privacy")}</span>
      </label>

      {state.status === "error" && (
        <p className="mt-4 rounded-2xl border border-brand-pink/25 bg-brand-pink/10 px-4 py-3 text-sm font-semibold text-[#BE185D]" role="alert">
          {t("error")}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-shine mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 text-[15px] font-semibold text-white shadow-[0_18px_42px_-22px_rgba(139,92,246,0.95)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? t("sending") : t("submit")}
        <ArrowRight size={18} aria-hidden />
      </button>
    </form>
  );
}
