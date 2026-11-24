import Image from "next/image";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/shared/lib/cn";

/** Both frames contain real, independently captured responsive views. */
export function ProjectDevices({ desktop, mobile, name, domain, desktopLabel, mobileLabel, priority = false, className }: {
  desktop: string; mobile: string; name: string; domain: string;
  desktopLabel: string; mobileLabel: string; priority?: boolean; className?: string;
}) {
  return <div className={cn("relative isolate aspect-[4/3] overflow-hidden bg-[#f0edf5]", className)}>
    <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,#fff,transparent_65%),radial-gradient(ellipse_at_90%_90%,#e3d8f5,transparent_65%)]" />
    <div className="absolute left-[4%] top-[8%] w-[83%] overflow-hidden rounded-[10px] border border-white/90 bg-white shadow-[0_18px_40px_-18px_#30244355] sm:rounded-[14px]">
      <div className="flex h-6 items-center gap-2 border-b border-slate-100 bg-white px-2 sm:h-8 sm:px-3">
        <span aria-hidden className="flex gap-1"><i className="size-1 rounded-full bg-slate-300" /><i className="size-1 rounded-full bg-slate-300" /><i className="size-1 rounded-full bg-slate-300" /></span>
        <span className="truncate font-mono text-[7px] text-slate-500 sm:text-[10px]">{domain}</span>
      </div>
      <div className="aspect-[1200/710] overflow-hidden">
        <Image src={desktop} alt={`${name} · ${desktopLabel}`} width={1200} height={790} priority={priority} sizes="(min-width:1280px) 480px, (min-width:640px) 42vw, 82vw" className="block h-auto w-full" />
      </div>
    </div>
    <div className="absolute right-[4%] top-[14%] w-[28%] rounded-[20px] border border-white/60 bg-[#20202a] p-[4px] shadow-[0_20px_35px_-12px_#21132b80] sm:rounded-[27px] sm:p-[5px]">
      <div aria-hidden className="flex h-2 items-center justify-center sm:h-3"><span className="h-1 w-6 rounded-full bg-black sm:w-9" /></div>
      <Image src={mobile} alt={`${name} · ${mobileLabel}`} width={375} height={812} priority={priority} sizes="(min-width:1280px) 165px, (min-width:640px) 15vw, 28vw" className="block h-auto w-full rounded-[12px] sm:rounded-[18px]" />
      <div aria-hidden className="mx-auto mb-0.5 mt-1 h-0.5 w-1/3 rounded-full bg-white/50" />
    </div>
    <div className="absolute bottom-[3%] left-[5%] flex max-w-[63%] flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold text-slate-600 sm:text-[11px]">
      <span className="inline-flex items-center gap-1"><Monitor size={12} aria-hidden />{desktopLabel}</span>
      <span className="inline-flex items-center gap-1"><Smartphone size={12} aria-hidden />{mobileLabel}</span>
    </div>
  </div>;
}
