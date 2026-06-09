"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
import { submitContact, type ContactState } from "@/features/contact/actions";

const initialState: ContactState = { status: "idle" };

export function Contact() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20";

  return (
    <section id="contact" className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] bg-dark p-10 md:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(600px 320px at 15% 0%, rgba(255,79,163,0.28), transparent 60%), radial-gradient(500px 300px at 90% 100%, rgba(139,92,246,0.26), transparent 60%)",
            }}
          />
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-brand-pink">
                {t("eyebrow")}
              </span>
              <h2 className="mt-3 text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-white">
                {t("title")}
              </h2>
              <p className="mt-4 max-w-md text-[17px] text-gray-400">{t("lead")}</p>
            </div>

            {state.status === "success" ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white">
                <div className="mb-2 text-2xl">✓</div>
                <p className="font-semibold">{t("success")}</p>
              </div>
            ) : (
              <form action={formAction} className="grid gap-3">
                <input type="hidden" name="locale" value={locale} />
                {/* honeypot */}
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
                <input name="company" placeholder={t("company")} className={inputCls} />
                <textarea name="message" required rows={4} placeholder={t("message")} className={inputCls} />
                {state.status === "error" && (
                  <p className="text-sm text-brand-pink">{t("error")}</p>
                )}
                <button
                  type="submit"
                  disabled={pending}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {pending ? t("sending") : t("submit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
