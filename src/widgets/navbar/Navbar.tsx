"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";
import { siteConfig } from "@/shared/config/site";
import { LanguageSwitcher } from "@/features/language-switcher/LanguageSwitcher";

export function Navbar() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  // Locale-aware link to a homepage section (hash), works from any page.
  const sectionHref = (hash: string) =>
    locale === routing.defaultLocale ? `/#${hash}` : `/${locale}#${hash}`;

  const renderItem = (item: { key: string; href: string }, onClick?: () => void) => {
    // Section anchors (e.g. "/#cases") render as plain locale-prefixed links.
    if (item.href.startsWith("/#")) {
      const hash = item.href.slice(2);
      return (
        <a key={item.key} href={sectionHref(hash)} onClick={onClick} className="transition-colors hover:text-brand-pink">
          {t(item.key)}
        </a>
      );
    }
    // Real localized routes go through the locale-aware Link.
    return (
      <Link
        key={item.key}
        href={item.href as "/leistungen" | "/branchen" | "/blog"}
        onClick={onClick}
        className="transition-colors hover:text-brand-pink"
      >
        {t(item.key)}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-md backdrop-saturate-150">
      <Container className="flex h-[66px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-[19px] font-bold tracking-tight text-dark">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-brand text-[15px] font-extrabold text-white shadow-[0_6px_16px_-6px_rgba(255,79,163,0.6)]">
            S
          </span>
          SaaleWeb
        </Link>

        <nav className="hidden items-center gap-8 text-[15px] font-medium text-gray-700 md:flex">
          {siteConfig.nav.map((item) => renderItem(item))}
        </nav>

        <div className="flex items-center gap-3.5">
          <LanguageSwitcher />
          <a
            href={sectionHref("contact")}
            className="hidden items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,79,163,0.55)] transition-all hover:-translate-y-0.5 sm:inline-flex"
          >
            {t("cta")}
          </a>
          <button
            type="button"
            className="text-dark md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-line bg-white md:hidden">
          <Container className="flex flex-col py-3 [&_a]:py-2.5 [&_a]:text-[15px] [&_a]:font-medium [&_a]:text-gray-700">
            {siteConfig.nav.map((item) => renderItem(item, () => setOpen(false)))}
            <a
              href={sectionHref("contact")}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 !text-white"
            >
              {t("cta")}
            </a>
          </Container>
        </nav>
      )}
    </header>
  );
}
