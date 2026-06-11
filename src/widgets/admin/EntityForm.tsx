"use client";

import { useActionState } from "react";
import { routing } from "@/i18n/routing";
import { adminInput, adminLabel, adminBtn } from "./ui";
import { ImageUpload } from "./ImageUpload";

export type EntityState = { error?: string };
export type EntityTranslation = {
  name: string;
  slug: string;
  excerpt: string;
  content: string;
};
export type EntityDefaults = {
  primary: string;
  order: number;
  published: boolean;
  coverImage?: string;
  translations: Record<string, EntityTranslation>;
};

const LOCALE_LABEL: Record<string, string> = { de: "Deutsch", en: "English", ru: "Русский" };

export function EntityForm({
  action,
  defaults,
  primaryName,
  primaryLabel,
  submitLabel,
}: {
  action: (prev: EntityState, fd: FormData) => Promise<EntityState>;
  defaults: EntityDefaults;
  primaryName: string;
  primaryLabel: string;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<EntityState, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className={adminLabel}>
          {primaryLabel}
          <input name={primaryName} defaultValue={defaults.primary} className={adminInput} />
        </label>
        <label className={adminLabel}>
          Reihenfolge
          <input
            type="number"
            name="order"
            defaultValue={defaults.order}
            className={adminInput}
          />
        </label>
        <label className="flex items-center gap-2 pt-7 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="published"
            defaultChecked={defaults.published}
            className="h-4 w-4"
          />
          Veröffentlicht
        </label>
      </div>

      <div className={adminLabel}>
        Cover-Bild (optional)
        <ImageUpload
          name="coverImage"
          defaultValue={defaults.coverImage ?? ""}
          hint="800x600 px"
          maxWidth={1000}
        />
      </div>

      {routing.locales.map((locale) => {
        const tr = defaults.translations[locale] ?? { name: "", slug: "", excerpt: "", content: "" };
        return (
          <fieldset key={locale} className="rounded-xl border border-line p-4">
            <legend className="px-2 text-sm font-semibold text-brand-purple">
              {LOCALE_LABEL[locale] ?? locale}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={adminLabel}>
                Name
                <input name={`name_${locale}`} defaultValue={tr.name} className={adminInput} />
              </label>
              <label className={adminLabel}>
                Slug
                <input name={`slug_${locale}`} defaultValue={tr.slug} className={adminInput} />
              </label>
            </div>
            <label className={`${adminLabel} mt-4`}>
              Kurzbeschreibung
              <textarea
                name={`excerpt_${locale}`}
                defaultValue={tr.excerpt}
                rows={2}
                className={adminInput}
              />
            </label>
            <label className={`${adminLabel} mt-4`}>
              Inhalt (Markdown)
              <textarea
                name={`content_${locale}`}
                defaultValue={tr.content}
                rows={6}
                className={adminInput}
              />
            </label>
          </fieldset>
        );
      })}

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className={adminBtn}>
        {pending ? "…" : submitLabel}
      </button>
    </form>
  );
}
