"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/ui/Container";
import { siteConfig } from "@/shared/config/site";
import { LanguageSwitcher } from "@/features/language-switcher/LanguageSwitcher";

export function Navbar() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

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
          {siteConfig.nav.map((item) => (
            <Link key={item.key} href={item.href} className="transition-colors hover:text-brand-pink">
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3.5">
          <LanguageSwitcher />
          <Link
            href="/#contact"
            className="hidden items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,79,163,0.55)] transition-all hover:-translate-y-0.5 sm:inline-flex"
          >
            {t("cta")}
          </Link>
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
          <Container className="flex flex-col py-3">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-[15px] font-medium text-gray-700"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-[15px] font-semibold text-white"
            >
              {t("cta")}
            </Link>
          </Container>
        </nav>
      )}
    </header>
  );
}
