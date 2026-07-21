"use client";

import { useAdminLocale } from "@/features/admin/AdminLocaleProvider";
import type { AdminLocale } from "@/features/admin/i18n";
import { cn } from "@/shared/lib/cn";

const options: { value: AdminLocale; label: string; title: string }[] = [
  { value: "de", label: "DE", title: "Deutsch" },
  { value: "ru", label: "RU", title: "Русский" },
];

export function AdminLanguageSwitch({
  compact = false,
  onChange,
}: {
  compact?: boolean;
  onChange?: () => void;
}) {
  const { locale, pending, setLocale } = useAdminLocale();

  return (
    <div
      className="inline-flex rounded-xl border border-line bg-surface p-1"
      role="group"
      aria-label={locale === "ru" ? "Язык админ-панели" : "Sprache des Admin-Bereichs"}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          title={option.title}
          disabled={pending}
          aria-pressed={locale === option.value}
          onClick={() => {
            setLocale(option.value);
            onChange?.();
          }}
          className={cn(
            "rounded-lg font-bold transition-colors disabled:opacity-60",
            compact ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs",
            locale === option.value
              ? "bg-white text-brand-purple shadow-sm"
              : "text-muted hover:text-dark",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
