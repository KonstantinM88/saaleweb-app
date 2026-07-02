"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { subscribeToNewsletter, type NewsletterState } from "@/features/newsletter/actions";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

const initialState: NewsletterState = { status: "idle" };

export function NewsletterForm({ variant = "footer" }: { variant?: "footer" | "banner" }) {
  const locale = useLocale();
  const t = useTranslations("Newsletter");
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  const done = state.status === "success" || state.status === "already";

  return (
    <div className={variant === "banner" ? "mx-auto max-w-xl" : "max-w-md"}>
      {done ? (
        <p
          className={cn(
            "rounded-xl border px-4 py-3 text-[14px]",
            "border-brand-purple/30 bg-brand-purple/5 text-dark",
          )}
          role="status"
        >
          {state.status === "already" ? t("already") : t("success")}
        </p>
      ) : (
        <form action={formAction} className="grid gap-2.5">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <label className="sr-only" htmlFor={`newsletter-email-${variant}`}>
              {t("placeholder")}
            </label>
            <input
              id={`newsletter-email-${variant}`}
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={t("placeholder")}
              className="h-11 w-full rounded-xl border border-line bg-white px-4 text-[14.5px] text-dark outline-none transition-colors placeholder:text-muted focus:border-brand-purple"
            />
            <button
              type="submit"
              disabled={pending}
              className="h-11 shrink-0 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple px-5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? t("submitting") : t("button")}
            </button>
          </div>

          {/* Honeypot */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <input type="hidden" name="locale" value={locale} />

          {state.status === "error" ? (
            <p className="text-[13px] text-brand-pink" role="alert">
              {t("error")}
            </p>
          ) : null}

          <p className="text-[12.5px] leading-relaxed text-muted">
            {t("privacyHint")}{" "}
            <Link href="/datenschutz" className="underline underline-offset-2 hover:text-brand-pink">
              {t("privacyLink")}
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
