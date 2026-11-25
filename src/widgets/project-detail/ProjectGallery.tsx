"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, Monitor, Smartphone, X } from "lucide-react";

type GalleryImage = { url: string; alt: string | null; width: number | null; height: number | null };

/** Original captures keep their intrinsic proportions in both previews and the viewer. */
export function ProjectGallery({ items, name, domain }: { items: GalleryImage[]; name: string; domain: string }) {
  const t = useTranslations("Projects.galleryViews");
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const open = selected !== null;
  const current = selected === null ? null : items[selected];
  const isMobile = (item: GalleryImage) => Boolean(item.width && item.height && item.height > item.width);
  const label = (item: GalleryImage) => t(isMobile(item) ? "mobile" : "desktop");

  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const { overflow, paddingRight } = document.body.style;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    if (gutter > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + gutter}px`;
    document.body.style.overflow = "hidden";
    element.showModal();
    closeButton.current?.focus();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  function move(direction: number) {
    setSelected((index) => index === null ? null : (index + direction + items.length) % items.length);
  }

  return <>
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <h2 className="text-[clamp(26px,3.4vw,42px)] font-bold leading-tight tracking-tight text-dark">{t("title")}</h2>
      <p className="mt-4 text-[16px] leading-relaxed text-muted">{t("intro")}</p>
    </div>

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
      {items.map((item, index) => {
        const mobile = isMobile(item);
        const DeviceIcon = mobile ? Smartphone : Monitor;
        return <figure key={item.url} className="group flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-line bg-white shadow-[0_12px_40px_-28px_#30244350]">
          <button
            type="button"
            onClick={() => setSelected(index)}
            aria-label={t("enlarge", { view: label(item) })}
            aria-haspopup="dialog"
            className="relative flex flex-1 items-center justify-center bg-[radial-gradient(ellipse_at_25%_15%,#fff_0%,#f2edf8_55%,#e7e5ef_100%)] px-5 py-8 outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-purple sm:px-8 sm:py-10"
          >
            <span aria-hidden className="absolute left-5 top-4 font-mono text-[10px] font-semibold tracking-[.16em] text-slate-500">0{index + 1} / {mobile ? "MOBILE" : "DESKTOP"}</span>
            <span className={mobile
              ? "relative mt-5 block w-full max-w-[210px] rounded-[32px] border border-slate-600 bg-[#1a1a23] p-[5px] shadow-[0_22px_36px_-16px_#27213280] transition-transform duration-300 motion-safe:group-hover:-translate-y-1"
              : "mt-5 block w-full overflow-hidden rounded-[12px] border border-white bg-white shadow-[0_22px_36px_-20px_#27213280] transition-transform duration-300 motion-safe:group-hover:-translate-y-1"}>
              {mobile ? <span aria-hidden className="flex h-4 items-center justify-center"><span className="h-1 w-10 rounded-full bg-black" /></span>
                : <span aria-hidden className="flex h-8 items-center gap-3 border-b border-slate-200 bg-[#faf9fc] px-3">
                  <span className="flex gap-1"><i className="size-1.5 rounded-full bg-slate-300" /><i className="size-1.5 rounded-full bg-slate-300" /><i className="size-1.5 rounded-full bg-slate-300" /></span>
                  <span className="truncate font-mono text-[10px] text-slate-500">{domain}</span>
                </span>}
              <Image src={item.url} alt={item.alt ?? name} width={item.width ?? 1432} height={item.height ?? 943}
                sizes={mobile ? "210px" : "(min-width:1280px) 660px, (min-width:1024px) 55vw, 90vw"}
                className={`block h-auto w-full ${mobile ? "rounded-[23px]" : ""}`} />
              {mobile && <span aria-hidden className="mx-auto my-1.5 block h-0.5 w-12 rounded-full bg-white/50" />}
            </span>
            <span aria-hidden className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full border border-white/80 bg-white/90 text-slate-700 shadow-sm transition-colors group-hover:text-brand-purple"><Maximize2 size={15} /></span>
          </button>
          <figcaption className="flex items-start gap-3 border-t border-line px-5 py-5 sm:px-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-purple"><DeviceIcon size={19} aria-hidden /></span>
            <span><span className="block text-[17px] font-bold text-dark">{label(item)}</span><span className="mt-1 block text-[13.5px] leading-relaxed text-muted">{t(mobile ? "mobileDescription" : "desktopDescription")}</span></span>
          </figcaption>
        </figure>;
      })}
    </div>
    <p className="mt-5 text-center text-[12px] text-muted">{t("hint")}</p>

    <dialog ref={dialog} aria-labelledby={titleId}
      onClose={() => setSelected(null)}
      onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      }}
      className="project-gallery-dialog fixed inset-0 m-auto max-h-[calc(100dvh-24px)] w-[calc(100%-24px)] max-w-6xl overflow-auto rounded-[22px] border border-white/15 bg-[#151522] p-0 text-white shadow-2xl backdrop:bg-[#10101a]/85 backdrop:backdrop-blur-md"
    >
      {current && <>
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
          <h3 id={titleId} className="min-w-0 text-sm font-semibold"><span className="block truncate">{name}</span><span className="mt-0.5 block text-xs font-normal text-slate-300">{label(current)} · {(selected ?? 0) + 1} / {items.length}</span></h3>
          <button ref={closeButton} type="button" aria-label={t("close")} onClick={() => dialog.current?.close()} className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/20 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><X size={21} aria-hidden /></button>
        </header>
        <div className="flex min-h-48 items-center justify-center bg-[#0c0c14] p-3 sm:p-5">
          <Image src={current.url} alt={current.alt ?? name} width={current.width ?? 1432} height={current.height ?? 943} sizes="(min-width:1280px) 1100px, 95vw" className="block h-auto max-h-[calc(100dvh-210px)] w-auto max-w-full object-contain" />
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:px-6">
          <a href={current.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm text-white underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{t("original")}<ArrowUpRight size={15} aria-hidden /></a>
          <div className="flex gap-2">
            <button type="button" aria-label={t("previous")} onClick={() => move(-1)} className="grid size-11 place-items-center rounded-xl border border-white/20 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ArrowLeft size={19} aria-hidden /></button>
            <button type="button" aria-label={t("next")} onClick={() => move(1)} className="grid size-11 place-items-center rounded-xl border border-white/20 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ArrowRight size={19} aria-hidden /></button>
          </div>
        </footer>
      </>}
    </dialog>
  </>;
}
