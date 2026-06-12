"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";
import { ScrollProgress } from "@/shared/ui/ScrollProgress";
import { siteConfig } from "@/shared/config/site";
import { cn } from "@/shared/lib/cn";
import { LanguageSwitcher } from "@/features/language-switcher/LanguageSwitcher";

export function Navbar() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Locale-aware link to a homepage section (hash), works from any page.
  const sectionHref = (hash: string) =>
    locale === routing.defaultLocale ? `/#${hash}` : `/${locale}#${hash}`;

  const renderItem = (item: { key: string; href: string }, onClick?: () => void) => {
    // Section anchors (e.g. "/#cases") render as plain locale-prefixed links.
    if (item.href.startsWith("/#")) {
      const hash = item.href.slice(2);
      return (
        <a key={item.key} href={sectionHref(hash)} onClick={onClick} className="nav-link transition-colors hover:text-dark">
          {t(item.key)}
        </a>
      );
    }
    // Real localized routes go through the locale-aware Link.
    return (
      <Link
        key={item.key}
        href={item.href as "/leistungen" | "/branchen" | "/projekte" | "/preise" | "/blog"}
        onClick={onClick}
        className="nav-link transition-colors hover:text-dark"
      >
        {t(item.key)}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-line backdrop-blur-md backdrop-saturate-150 transition-[background-color,box-shadow] duration-300",
        scrolled
          ? "bg-white/90 shadow-[0_12px_32px_-20px_rgba(17,24,39,0.35)]"
          : "bg-white/80",
      )}
    >
      <Container className="flex h-[66px] items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-[19px] font-bold tracking-tight text-dark"
        >
          <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-brand text-[15px] font-extrabold text-white shadow-[0_6px_16px_-6px_rgba(255,79,163,0.6)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
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
            className="btn-shine hidden items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,79,163,0.55)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:inline-flex"
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

      <ScrollProgress />

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
