"use client";

import { useActionState } from "react";
import { routing } from "@/i18n/routing";
import { adminInput, adminLabel, adminBtn } from "./ui";

export type PostState = { error?: string };
export type PostTranslation = { title: string; slug: string; excerpt: string; content: string };
export type PostDefaults = {
  coverImage: string;
  readingTime: string;
  published: boolean;
  publishedAt: string;
  categoryId: string;
  authorId: string;
  translations: Record<string, PostTranslation>;
};
export type Option = { value: string; label: string };

const LOCALE_LABEL: Record<string, string> = { de: "Deutsch", en: "English", ru: "Русский" };

export function PostForm({
  action,
  defaults,
  categories,
  authors,
  submitLabel,
}: {
  action: (prev: PostState, fd: FormData) => Promise<PostState>;
  defaults: PostDefaults;
  categories: Option[];
  authors: Option[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<PostState, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={adminLabel}>
          Kategorie
          <select name="categoryId" defaultValue={defaults.categoryId} className={adminInput}>
            <option value="">— keine —</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className={adminLabel}>
          Autor
          <select name="authorId" defaultValue={defaults.authorId} className={adminInput}>
            <option value="">— keiner —</option>
            {authors.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
        <label className={adminLabel}>
          Cover-URL
          <input name="coverImage" defaultValue={defaults.coverImage} className={adminInput} />
        </label>
        <label className={adminLabel}>
          Lesezeit (Min.)
          <input
            type="number"
            name="readingTime"
            defaultValue={defaults.readingTime}
            className={adminInput}
          />
        </label>
        <label className={adminLabel}>
          Veröffentlicht am
          <input
            type="date"
            name="publishedAt"
            defaultValue={defaults.publishedAt}
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

      {routing.locales.map((locale) => {
        const tr = defaults.translations[locale] ?? { title: "", slug: "", excerpt: "", content: "" };
        return (
          <fieldset key={locale} className="rounded-xl border border-line p-4">
            <legend className="px-2 text-sm font-semibold text-brand-purple">
              {LOCALE_LABEL[locale] ?? locale}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={adminLabel}>
                Titel
                <input name={`title_${locale}`} defaultValue={tr.title} className={adminInput} />
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
                rows={8}
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
