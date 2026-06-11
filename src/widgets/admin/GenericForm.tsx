"use client";

import { useActionState } from "react";
import { routing } from "@/i18n/routing";
import { adminInput, adminLabel, adminBtn } from "./ui";
import { ImageUpload } from "./ImageUpload";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "image";
export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  span2?: boolean;
  hint?: string;
  maxWidth?: number;
};
export type GenericState = { error?: string };
export type GenericDefaults = {
  top: Record<string, string | number | boolean>;
  translations: Record<string, Record<string, string>>;
};

const LOCALE_LABEL: Record<string, string> = { de: "Deutsch", en: "English", ru: "Русский" };

function Input({ field, name, value }: { field: Field; name: string; value: string }) {
  if (field.type === "textarea")
    return <textarea name={name} defaultValue={value} rows={4} className={adminInput} />;
  if (field.type === "select")
    return (
      <select name={name} defaultValue={value} className={adminInput}>
        <option value="">—</option>
        {field.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  return (
    <input
      type={field.type === "number" ? "number" : "text"}
      name={name}
      defaultValue={value}
      className={adminInput}
    />
  );
}

export function GenericForm({
  action,
  topFields,
  localeFields,
  defaults,
  submitLabel,
}: {
  action: (prev: GenericState, fd: FormData) => Promise<GenericState>;
  topFields: Field[];
  localeFields: Field[];
  defaults: GenericDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<GenericState, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {topFields.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {topFields.map((f) =>
            f.type === "checkbox" ? (
              <label key={f.name} className="flex items-center gap-2 pt-7 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  name={f.name}
                  defaultChecked={Boolean(defaults.top[f.name])}
                  className="h-4 w-4"
                />
                {f.label}
              </label>
            ) : f.type === "image" ? (
              <div key={f.name} className={`${adminLabel} ${f.span2 ? "sm:col-span-2" : ""}`}>
                {f.label}
                <ImageUpload
                  name={f.name}
                  defaultValue={String(defaults.top[f.name] ?? "")}
                  hint={f.hint}
                  maxWidth={f.maxWidth}
                />
              </div>
            ) : (
              <label key={f.name} className={`${adminLabel} ${f.span2 ? "sm:col-span-2" : ""}`}>
                {f.label}
                <Input field={f} name={f.name} value={String(defaults.top[f.name] ?? "")} />
              </label>
            ),
          )}
        </div>
      )}

      {routing.locales.map((locale) => {
        const tr = defaults.translations[locale] ?? {};
        return (
          <fieldset key={locale} className="rounded-xl border border-line p-4">
            <legend className="px-2 text-sm font-semibold text-brand-purple">
              {LOCALE_LABEL[locale] ?? locale}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {localeFields.map((f) =>
                f.type === "image" ? (
                  <div key={f.name} className={`${adminLabel} sm:col-span-2`}>
                    {f.label}
                    <ImageUpload
                      name={`${f.name}_${locale}`}
                      defaultValue={tr[f.name] ?? ""}
                      hint={f.hint}
                      maxWidth={f.maxWidth}
                    />
                  </div>
                ) : (
                  <label
                    key={f.name}
                    className={`${adminLabel} ${f.type === "textarea" || f.span2 ? "sm:col-span-2" : ""}`}
                  >
                    {f.label}
                    <Input field={f} name={`${f.name}_${locale}`} value={tr[f.name] ?? ""} />
                  </label>
                ),
              )}
            </div>
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
