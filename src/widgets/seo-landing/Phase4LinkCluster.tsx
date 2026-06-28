import { ArrowRight, Search } from "lucide-react";
import { Reveal } from "@/shared/ui/Reveal";
import type { Phase4Link } from "./phase4Content";

export type Phase4HubCopy = {
  eyebrow: string;
  title: string;
  lead: string;
};

export function Phase4LinkCluster({
  copy,
  links,
  compact = false,
}: {
  copy: Phase4HubCopy;
  links: Phase4Link[];
  compact?: boolean;
}) {
  if (!links.length) return null;

  return (
    <Reveal className="mt-10">
      <aside className="relative overflow-hidden rounded-[26px] border border-line bg-white p-6 shadow-[0_28px_90px_-66px_rgba(139,92,246,0.65)] md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,79,163,0.10),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.12),transparent_38%)]"
        />
        <div className="relative">
          <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-purple/20 bg-brand-soft px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.18em] text-brand-purple">
                <Search size={14} aria-hidden />
                {copy.eyebrow}
              </span>
              <h3 className="mt-4 text-[clamp(22px,3vw,34px)] font-extrabold tracking-tight text-dark">
                {copy.title}
              </h3>
              <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-muted">{copy.lead}</p>
            </div>

            <div className={compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-3"}>
              {links.map((link) => (
                <a
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="group rounded-[18px] border border-line bg-white/[0.82] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/[0.32] hover:shadow-[0_22px_72px_-58px_rgba(139,92,246,0.78)] focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-extrabold text-dark transition-colors group-hover:text-brand-purple">
                        {link.label}
                      </p>
                      {link.description && (
                        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
                          {link.description}
                        </p>
                      )}
                    </div>
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-purple transition-transform group-hover:translate-x-0.5">
                      <ArrowRight size={15} aria-hidden />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </Reveal>
  );
}
