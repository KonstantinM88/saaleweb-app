"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/features/contact/actions";
import { useTrackFormSuccess } from "@/features/analytics/useTrackFormSuccess";
import { useLeadAttributionSubmission } from "@/features/analytics/useLeadAttributionSubmission";
import { TurnstileField } from "@/features/captcha/TurnstileField";
import type { AuditLandingCopy } from "./auditContent";

const initialState: ContactState = { status: "idle" };

export function AuditLeadForm({ copy, locale }: { copy: AuditLandingCopy["form"]; locale: string }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const { enrichFormData } = useLeadAttributionSubmission();
  useTrackFormSuccess(state, "website_audit");

  const action = (formData: FormData) => {
    enrichFormData(formData);
    formAction(formData);
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20";

  if (state.status === "success") {
    return (
      <div className="grid min-h-[420px] place-items-center text-center" role="status">
        <div>
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700">
            ✓
          </div>
          <h3 className="text-xl font-extrabold text-dark">{copy.successTitle}</h3>
          <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-muted">{copy.successText}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value="website_audit" />
      <input type="hidden" name="projectType" value="Website Audit (Landing)" />
      {/* Honeypot: must stay empty */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <label className="grid gap-1.5">
        <span className="text-[13px] font-bold text-dark">{copy.labels.name} *</span>
        <input name="name" required autoComplete="name" className={inputCls} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-[13px] font-bold text-dark">{copy.labels.company}</span>
        <input name="company" autoComplete="organization" className={inputCls} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-[13px] font-bold text-dark">{copy.labels.website} *</span>
        <input name="projectWebsite" required inputMode="url" className={inputCls} placeholder="https:// / @instagram" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-[13px] font-bold text-dark">{copy.labels.email} *</span>
          <input name="email" type="email" required autoComplete="email" className={inputCls} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[13px] font-bold text-dark">{copy.labels.phone}</span>
          <input name="phone" inputMode="tel" autoComplete="tel" className={inputCls} />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="text-[13px] font-bold text-dark">{copy.labels.message}</span>
        <textarea name="message" rows={3} className={inputCls} />
      </label>

      <TurnstileField
        action="website_audit"
        serverError={state.status === "error" && state.message === "captcha"}
        resetSignal={state}
      />

      {state.status === "error" && state.message !== "captcha" && (
        <p className="text-sm font-semibold text-brand-pink" role="alert">
          {copy.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-shine mt-1 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-5 py-3 text-[15px] font-bold text-white shadow-[0_18px_38px_-18px_rgba(139,92,246,0.85)] transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? copy.sending : copy.submit}
      </button>
      <p className="text-center text-[12.5px] font-semibold text-muted">{copy.privacyNote}</p>
    </form>
  );
}
