"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCheck, ChevronRight, Mail, Monitor, RotateCcw, Smartphone, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export type RelaunchDemoCopy = {
  label: string; title: string; intro: string; before: string; after: string; mobile: string; desktop: string;
  steps: { title: string; text: string }[]; hint: string; note: string;
  business: string; businessType: string; region: string; nav: string;
  oldTitle: string; oldText: string; oldCta: string; oldContactTitle: string; oldContactText: string;
  newEyebrow: string; newTitle: string; newText: string; newCta: string; reassurance: string; projectLabel: string;
  servicesTitle: string; services: string[]; timingTitle: string; timings: string[];
  next: string; back: string; summary: string; summaryText: string; serviceLabel: string; timingLabel: string; reset: string; demoOnly: string;
};

/** A labelled fictional concept. Choices stay in component memory; no lead is sent or saved. */
export function BeforeAfter({ copy }: { copy: RelaunchDemoCopy }) {
  const [modern, setModern] = useState(true);
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [step, setStep] = useState(0);
  const [service, setService] = useState<number | null>(null);
  const [timing, setTiming] = useState<number | null>(null);
  const panelTitle = useRef<HTMLHeadingElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const interacted = useRef(false);
  useEffect(() => {
    if (step > 0) { interacted.current = true; panelTitle.current?.focus({ preventScroll: true }); }
    else if (interacted.current) startButton.current?.focus({ preventScroll: true });
  }, [step]);
  const reset = () => { setStep(0); setService(null); setTiming(null); };
  const focusClass = "outline-hidden focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2";
  const actionClass = cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#173f36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#24594c] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500", focusClass);

  return <div id="relaunch-demo" data-relaunch-demo className="scroll-mt-24 overflow-hidden rounded-[28px] border border-[#ddd9e4] bg-white shadow-[0_35px_90px_-55px_#281b4966]">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-7">
      <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6D28D9]"><Sparkles size={15} aria-hidden />{copy.label}</span>
      <div role="group" aria-label={copy.title} className="flex rounded-xl bg-[#f2f0f6] p-1">
        {[false, true].map(value => <button key={String(value)} type="button" aria-pressed={modern === value} onClick={() => { setModern(value); reset(); }} className={cn("min-h-11 rounded-lg px-4 text-sm font-bold transition", modern === value ? "bg-white text-dark shadow-sm" : "text-gray-700 hover:text-dark", focusClass)}>{value ? copy.after : copy.before}</button>)}
      </div>
    </div>
    <div className="grid lg:grid-cols-[0.8fr_1.5fr]">
      <div className="order-2 flex min-w-0 flex-col px-5 py-7 sm:px-8 lg:order-1 lg:py-10">
        <span className="font-mono text-xs font-bold text-[#6D28D9]">{modern ? "02 / " + copy.after : "01 / " + copy.before}</span>
        <h3 className="mt-4 max-w-md text-[clamp(25px,3vw,35px)] font-extrabold leading-[1.15] tracking-tight text-dark">{copy.title}</h3>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{copy.intro}</p>
        <ol className="mt-7 grid gap-5">
          {copy.steps.map((item, index) => <li key={item.title} className="flex items-start gap-3">
            <span className={cn("mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold", modern ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500")}>{index + 1}</span>
            <div><p className="text-sm font-bold text-dark">{item.title}</p><p className="mt-1 text-[13px] leading-relaxed text-muted">{item.text}</p></div>
          </li>)}
        </ol>
        <p className="mt-7 flex items-start gap-2 rounded-xl bg-[#f4effb] px-4 py-3 text-[13px] font-semibold leading-relaxed text-[#5b21b6]"><ArrowRight size={16} className="mt-0.5 shrink-0" aria-hidden />{copy.hint}</p>
        <p className="mt-5 text-xs leading-relaxed text-muted">{copy.note}</p>
      </div>
      <div className="order-1 min-w-0 bg-[#19232c] px-3 pb-7 pt-5 sm:px-7 lg:order-2 lg:py-7">
        <div role="group" aria-label={`${copy.mobile} / ${copy.desktop}`} className="mb-5 flex justify-center gap-2">
          {(["mobile", "desktop"] as const).map(value => <button key={value} type="button" aria-pressed={device === value} onClick={() => setDevice(value)} className={cn("inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition", device === value ? "border-white/50 bg-white text-[#19232c]" : "border-white/20 text-white/80 hover:border-white/60", "outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#19232c]")}>{value === "mobile" ? <Smartphone size={15} aria-hidden /> : <Monitor size={15} aria-hidden />}{copy[value]}</button>)}
        </div>
        <div data-demo-device={device} data-demo-version={modern ? "after" : "before"} className={cn("@container mx-auto overflow-hidden bg-[#faf8f3] shadow-[0_20px_50px_-15px_#0008] transition-[max-width,border-radius] duration-300 motion-reduce:transition-none", device === "mobile" ? "max-w-[340px] rounded-[30px] border-[6px] border-[#080d12]" : "max-w-[760px] rounded-xl border border-white/20")}>
          {device === "mobile" ? <div aria-hidden className="flex h-5 items-center justify-center bg-[#080d12]"><span className="h-1.5 w-14 rounded-full bg-[#26303a]" /></div> : <div aria-hidden className="flex h-7 items-center gap-1.5 bg-white px-3"><i className="size-1.5 rounded-full bg-slate-300" /><i className="size-1.5 rounded-full bg-slate-300" /><i className="size-1.5 rounded-full bg-slate-300" /><span className="ml-3 text-[9px] text-slate-400">{copy.business} · {copy.label}</span></div>}
          <div className={cn("min-h-[535px]", !modern && "bg-[#e9e7e2]")}>
            <div className={cn("flex items-center justify-between gap-3 border-b px-4 py-4", modern ? "border-[#dfdfd4]" : "border-slate-400 bg-[#d7d5cf]")}>
              <span className={cn("text-sm font-bold tracking-tight", modern ? "text-[#173f36]" : "font-serif text-slate-700")}>{copy.business}<span className="mt-0.5 block text-[8px] font-normal uppercase tracking-[0.13em]">{copy.businessType}</span></span>
              <span className="text-[10px] text-[#44534c]">{copy.nav}</span>
            </div>
            {step === 0 ? modern ? <div>
              <div className="px-5 pb-5 pt-6 @lg:grid @lg:grid-cols-[1.1fr_1fr] @lg:items-center @lg:gap-5">
                <div><p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#506c5a]">{copy.newEyebrow}</p><h4 className="mt-3 text-[29px] font-semibold leading-[1.07] tracking-[-0.035em] text-[#173f36] @lg:text-[34px]">{copy.newTitle}</h4><p className="mt-3 text-xs leading-relaxed text-[#546157]">{copy.newText}</p><button ref={startButton} type="button" onClick={() => setStep(1)} className={cn(actionClass, "mt-5 w-full @lg:w-auto")}>{copy.newCta}<ArrowRight size={16} aria-hidden /></button><p className="mt-2 flex items-center gap-1.5 text-[9px] text-[#546157]"><Check size={12} aria-hidden />{copy.reassurance}</p></div>
                <div className="relative mt-5 overflow-hidden rounded-2xl bg-[#e5e4d9] @lg:mt-0">
                  <HouseIllustration />
                  <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2.5 py-1 text-[8px] font-semibold text-[#173f36]">{copy.projectLabel}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-[#dfdfd4] px-5 py-3 text-[10px] text-[#506356]"><span className="size-1.5 shrink-0 rounded-full bg-[#54795d]" />{copy.region}</div>
              <div className="hidden grid-cols-3 gap-2 px-5 pb-5 @lg:grid">{copy.services.map((label, index) => <button key={label} type="button" onClick={() => { setService(index); setStep(2); }} className={cn("rounded-xl border border-[#d9ddd3] bg-white p-3 text-left text-xs font-semibold text-[#173f36] hover:border-[#173f36]", focusClass)}><span className="mb-3 block font-mono text-[9px] text-[#70816d]">0{index + 1}</span>{label}<ArrowRight size={13} className="mt-3" aria-hidden /></button>)}</div>
            </div> : <div className="px-5 py-7 font-serif text-slate-700"><p className="text-xs">{copy.region}</p><h4 className="mt-5 text-2xl font-bold leading-tight">{copy.oldTitle}</h4><p className="mt-5 text-sm leading-relaxed">{copy.oldText}</p><div className="mt-6 border-y border-slate-400/50 py-4 text-sm">{copy.services.join(" · ")}</div><button ref={startButton} type="button" onClick={() => setStep(1)} className={cn("mt-7 inline-flex min-h-11 items-center gap-2 text-sm text-blue-800 underline", focusClass)}>{copy.oldCta}<ChevronRight size={14} aria-hidden /></button></div>
            : <div className="px-5 py-6" aria-live="polite">
              <p className="mb-4 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#506c5a]">{copy.label}{modern && ` · ${Math.min(step, 3)} / 3`}</p>
              <h4 ref={panelTitle} tabIndex={-1} className="text-[23px] font-bold leading-tight tracking-tight text-[#173f36] outline-hidden">{!modern ? copy.oldContactTitle : step === 1 ? copy.servicesTitle : step === 2 ? copy.timingTitle : copy.summary}</h4>
              {!modern ? <><Mail size={27} className="mt-6 text-slate-500" aria-hidden /><p className="mt-4 text-sm leading-relaxed text-slate-600">{copy.oldContactText}</p></> : step < 3 ? <>
                <div role="group" aria-label={step === 1 ? copy.servicesTitle : copy.timingTitle} className="mt-5 grid gap-2">
                  {(step === 1 ? copy.services : copy.timings).map((option, index) => { const selected = (step === 1 ? service : timing) === index; return <button key={option} type="button" aria-pressed={selected} onClick={() => step === 1 ? setService(index) : setTiming(index)} className={cn("flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left text-xs font-semibold transition", selected ? "border-[#173f36] bg-[#e7eee8] text-[#173f36]" : "border-[#d9ddd3] bg-white text-[#546157] hover:border-[#728576]", focusClass)}>{option}<span aria-hidden className={cn("grid size-4 shrink-0 place-items-center rounded-full border", selected ? "border-[#173f36] bg-[#173f36] text-white" : "border-slate-300")}>{selected && <Check size={10} />}</span></button>; })}
                </div>
                <button type="button" disabled={step === 1 ? service === null : timing === null} onClick={() => setStep(step + 1)} className={cn(actionClass, "mt-5 w-full")}>{copy.next}<ArrowRight size={15} aria-hidden /></button>
              </> : <><CheckCheck size={30} className="mt-5 text-[#173f36]" aria-hidden /><p className="mt-3 text-xs leading-relaxed text-[#546157]">{copy.summaryText}</p><dl className="mt-5 space-y-3 rounded-xl border border-[#d9ddd3] bg-white p-4 text-xs"><div><dt className="text-[#546157]">{copy.serviceLabel}</dt><dd className="mt-1 font-bold text-[#173f36]">{copy.services[service ?? 0]}</dd></div><div><dt className="text-[#546157]">{copy.timingLabel}</dt><dd className="mt-1 font-bold text-[#173f36]">{copy.timings[timing ?? 0]}</dd></div></dl></>}
              <button type="button" onClick={() => step > 1 && modern ? setStep(step - 1) : reset()} className={cn("mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#173f36]", focusClass)}><ArrowLeft size={13} aria-hidden />{copy.back}</button>
              <p className="mt-4 border-t border-[#d9ddd3] pt-3 text-[10px] leading-relaxed text-[#667269]">{copy.demoOnly}</p>
            </div>}
          </div>
        </div>
        <button type="button" onClick={reset} className="mx-auto mt-4 flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs text-white/80 outline-hidden hover:text-white focus-visible:ring-2 focus-visible:ring-white"><RotateCcw size={13} aria-hidden />{copy.reset}</button>
      </div>
    </div>
  </div>;
}

/** Code-native concept illustration, not a claimed client project or photograph. */
function HouseIllustration() {
  return <svg viewBox="0 0 400 220" className="block aspect-[20/11] w-full" aria-hidden>
    <rect width="400" height="220" fill="#e7e5d9" /><circle cx="322" cy="48" r="29" fill="#f5efd9" />
    <path d="M0 165Q100 140 200 161T400 152V220H0Z" fill="#c4c9b4" />
    <path d="M78 103 183 41 286 103V181H78Z" fill="#f8f6ee" /><path d="m57 105 126-77 126 77-9 13-117-69-117 69Z" fill="#34463e" />
    <path d="M183 49 277 105V181H183Z" fill="#dedcd0" /><rect x="112" y="115" width="45" height="66" rx="1" fill="#526a61" /><path d="M134 115V181M112 147H157" stroke="#c0c9bd" strokeWidth="2" />
    <rect x="206" y="111" width="46" height="32" fill="#788d7b" /><path d="M229 111V143" stroke="#d4dbca" strokeWidth="2" />
    <path d="m98 181 65 0 32 39H54Z" fill="#e1dccb" /><path d="M298 184V85M290 111q-35-12-14-42 15-18 23-36 32 31 34 57 2 31-35 21" fill="#6f8366" />
    <path d="M298 184V100" stroke="#415444" strokeWidth="4" /><path d="M0 188H400" stroke="#abb59e" strokeWidth="2" />
    <path d="M20 183q4-22 15-22t15 22M327 185q7-29 22-29t22 29" fill="#81956f" />
  </svg>;
}
