"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Wrench,
  Building2,
  Newspaper,
  FolderKanban,
  Layers,
  BadgeEuro,
  HelpCircle,
  Star,
  Users,
  Tags,
  Search,
  LogOut,
  MailCheck,
  Bot,
  Radar,
} from "lucide-react";
import { logout } from "@/features/auth/actions";
import { BrandLogo } from "@/shared/ui/BrandLogo";
import { cn } from "@/shared/lib/cn";

const items = [
  { href: "/admin", label: "Übersicht", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Anfragen", icon: Inbox },
  { href: "/admin/newsletter", label: "Newsletter", icon: MailCheck },
  { href: "/admin/assistant", label: "AI-Dialoge", icon: Bot },
  { href: "/admin/ai-visibility", label: "AI-видимость", icon: Radar },
  { href: "/admin/services", label: "Leistungen", icon: Wrench },
  { href: "/admin/industries", label: "Branchen", icon: Building2 },
  { href: "/admin/projects", label: "Projekte", icon: FolderKanban },
  { href: "/admin/project-categories", label: "Projekt-Kat.", icon: Layers },
  { href: "/admin/pricing", label: "Preise", icon: BadgeEuro },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/categories", label: "Kategorien", icon: Tags },
  { href: "/admin/authors", label: "Autoren", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/seo", label: "SEO", icon: Search },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-[230px] shrink-0 flex-col border-r border-line bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <BrandLogo variant="icon" size="sm" />
        <span className="font-bold text-dark">Admin</span>
      </div>
      <nav className="flex-1 px-3">
        {items.map((it) => {
          const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-brand-soft text-brand-purple" : "text-gray-600 hover:bg-surface",
              )}
            >
              <Icon size={17} />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-line p-3">
        <p className="truncate px-3 pb-2 text-xs text-muted">{email}</p>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-surface"
          >
            <LogOut size={17} />
            Abmelden
          </button>
        </form>
      </div>
    </aside>
  );
}
