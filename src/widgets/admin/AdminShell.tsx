"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/shared/ui/BrandLogo";
import { AdminLanguageSwitch } from "./AdminLanguageSwitch";
import { AdminSidebar } from "./Sidebar";

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-dvh lg:flex">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-white/95 px-4 shadow-sm backdrop-blur lg:hidden">
        <div className="flex items-center gap-2.5">
          <BrandLogo variant="icon" size="sm" />
          <span className="font-bold text-dark">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <AdminLanguageSwitch compact />
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl border border-line bg-white text-dark transition hover:bg-surface"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="admin-mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <AdminSidebar email={email} className="sticky top-0 hidden h-dvh lg:flex" />

      <div
        className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-dark/40 backdrop-blur-sm transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        />
        <div
          id="admin-mobile-navigation"
          className={`absolute inset-y-0 left-0 w-[min(88vw,320px)] transform bg-white shadow-2xl transition-transform duration-200 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="absolute right-3 top-3 z-10">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid size-9 place-items-center rounded-lg border border-line bg-white text-dark"
              aria-label="Close menu"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </div>
          <AdminSidebar
            email={email}
            className="h-dvh w-full border-r-0 pt-1"
            onNavigate={() => setMenuOpen(false)}
            showLanguageSwitch
          />
        </div>
      </div>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10" id="admin-main">
        {children}
      </main>
    </div>
  );
}
