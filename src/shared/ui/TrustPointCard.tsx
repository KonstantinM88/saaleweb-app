import type { LucideIcon } from "lucide-react";

export type TrustPointCardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export function TrustPointCard({ icon: Icon, title, text }: TrustPointCardProps) {
  return (
    <article className="group h-full rounded-[18px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/25 hover:shadow-[0_22px_62px_-44px_rgba(139,92,246,0.48)]">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand-purple transition-all duration-300 group-hover:bg-brand group-hover:text-white">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="text-base font-extrabold text-dark">{title}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{text}</p>
    </article>
  );
}
