"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, RotateCcw, Sparkles } from "lucide-react";
import type { BeautyLandingContent } from "./types";

type Props = {
  copy: BeautyLandingContent["booking"];
  ctaHref: string;
};

/**
 * Delta 37 — the signature element of the beauty landing page.
 *
 * A working miniature of the booking flow SaaleWeb ships (see the live Salon
 * Elen site): service, artist, slot, confirmation. The point of the interaction
 * is emotional rather than informational — a studio owner who cannot answer the
 * phone during a treatment gets to watch an appointment appear without her.
 *
 * The demo makes no claim about booking volume; the disclaimer stays visible
 * below the result.
 */
export function BookingFlowDemo({ copy, ctaHref }: Props) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<number | null>(null);
  const [stylist, setStylist] = useState<number | null>(null);
  const [slot, setSlot] = useState<number | null>(null);

  const chosenService = service === null ? null : copy.services[service];
  const chosenStylist = stylist === null ? null : copy.stylists[stylist];
  const chosenSlot = slot === null ? null : copy.slots[slot];
  const confirmed = step === 3;

  function reset() {
    setStep(0);
    setService(null);
    setStylist(null);
    setSlot(null);
  }

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:gap-8">
      {/* ── The flow itself ──────────────────────────────────── */}
      <div className="bty-panel min-w-0 rounded-[26px] p-6 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ol className="flex min-w-0 flex-wrap items-center gap-2">
            {copy.steps.map((label, index) => {
              const state = confirmed || index < step ? "done" : index === step ? "current" : "todo";
              return (
                <li key={label} className="flex items-center gap-2">
                  <span className={`bty-step bty-step--${state}`}>
                    {state === "done" ? <Check size={12} aria-hidden /> : index + 1}
                  </span>
                  <span
                    className={`text-[12.5px] font-semibold ${
                      state === "current" ? "text-white" : "text-white/45"
                    }`}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
          <span className="bty-demo-badge">{copy.demoLabel}</span>
        </div>

        <div className="mt-7 min-w-0">
          {step === 0 ? (
            <fieldset className="min-w-0 border-0 p-0">
              <legend className="mb-4 text-[15px] font-bold text-white">{copy.servicesLabel}</legend>
              <div className="grid gap-2.5">
                {copy.services.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setService(index);
                      setStep(1);
                    }}
                    className="bty-option group flex min-w-0 items-center gap-4 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-[15px] font-bold text-white">{item.name}</span>
                      <span className="mt-0.5 block break-words text-[12.5px] text-white/50">{item.note}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="bty-figure block text-[15px] font-extrabold text-[#F0BFCF]">
                        {item.price}
                      </span>
                      <span className="mt-0.5 flex items-center justify-end gap-1 text-[12px] text-white/45">
                        <Clock size={11} aria-hidden />
                        {item.duration}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 1 ? (
            <fieldset className="min-w-0 border-0 p-0">
              <legend className="mb-4 text-[15px] font-bold text-white">{copy.stylistsLabel}</legend>
              <div className="grid gap-2.5">
                {copy.stylists.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setStylist(index);
                      setStep(2);
                    }}
                    className="bty-option flex min-w-0 items-center gap-4 text-left"
                  >
                    <span aria-hidden className="bty-avatar">
                      {item.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-[15px] font-bold text-white">{item.name}</span>
                      <span className="mt-0.5 block break-words text-[12.5px] text-white/50">{item.role}</span>
                    </span>
                    <ArrowRight size={16} className="shrink-0 text-white/35" aria-hidden />
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 2 ? (
            <fieldset className="min-w-0 border-0 p-0">
              <legend className="mb-1 text-[15px] font-bold text-white">{copy.slotsLabel}</legend>
              <p className="mb-4 text-[13px] text-white/50">{copy.slotDate}</p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {copy.slots.map((item, index) => (
                  <button
                    key={item.time}
                    type="button"
                    disabled={item.taken}
                    onClick={() => {
                      setSlot(index);
                      setStep(3);
                    }}
                    className={`bty-slot ${item.taken ? "bty-slot--taken" : ""}`}
                  >
                    <span className="bty-figure block text-[15px] font-extrabold">{item.time}</span>
                    {item.taken ? (
                      <span className="mt-0.5 block text-[11px] font-semibold">{copy.takenLabel}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          {confirmed ? (
            <div className="grid place-items-center py-8 text-center">
              <span aria-hidden className="bty-done">
                <Check size={26} />
              </span>
              <p className="mt-5 text-[17px] font-extrabold text-white">{copy.confirmTitle}</p>
              <p className="mt-2 text-[13.5px] text-white/50">{copy.confirmBadge}</p>
            </div>
          ) : null}
        </div>

        {step > 0 ? (
          <div className="mt-7 flex flex-wrap gap-3 border-t border-white/[0.10] pt-5">
            {!confirmed ? (
              <button type="button" onClick={() => setStep(step - 1)} className="bty-ghost">
                <ArrowLeft size={14} aria-hidden />
                {copy.backLabel}
              </button>
            ) : null}
            <button type="button" onClick={reset} className="bty-ghost">
              <RotateCcw size={14} aria-hidden />
              {copy.restartLabel}
            </button>
          </div>
        ) : null}
      </div>

      {/* ── The resulting appointment ────────────────────────── */}
      <div className="grid min-w-0 content-start gap-5">
        <article aria-live="polite" className="bty-card min-w-0 rounded-[26px] p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-[15.5px] font-extrabold text-[#3A1B2A]">
              <Sparkles size={16} className="text-[#B5527A]" aria-hidden />
              {copy.confirmTitle}
            </h3>
            {confirmed ? <span className="bty-chip-done">{copy.confirmBadge}</span> : null}
          </div>

          <dl className="mt-5 grid gap-0">
            <Row label={copy.confirmFields.service} value={chosenService?.name} />
            <Row label={copy.confirmFields.stylist} value={chosenStylist?.name} />
            <Row label={copy.confirmFields.when} value={chosenSlot ? `${copy.slotDate} · ${chosenSlot.time}` : undefined} />
            <Row label={copy.confirmFields.duration} value={chosenService?.duration} />
            <Row label={copy.confirmFields.price} value={chosenService?.price} accent />
          </dl>

          <p className="mt-4 border-t border-[#B5527A]/20 pt-4 text-[13.5px] leading-relaxed text-[#6B4356]">
            {copy.confirmNote}
          </p>
        </article>

        <div className="min-w-0 rounded-[26px] border border-[#B5527A]/25 bg-[#B5527A]/[0.07] p-6 md:p-7">
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#A2416A]">
            {copy.outcomeTitle}
          </p>
          <ul className="mt-4 grid gap-2.5">
            {copy.outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-2.5 break-words text-[14.5px] leading-relaxed text-[#3A1B2A]">
                <Check size={16} className="mt-0.5 shrink-0 text-[#B5527A]" aria-hidden />
                {outcome}
              </li>
            ))}
          </ul>
          <a
            href={ctaHref}
            className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#3A1B2A] px-5 py-3 text-[14.5px] font-semibold text-[#F8E7EE] transition-all hover:-translate-y-0.5 hover:bg-[#57283E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5527A] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {copy.cta}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden
            />
          </a>
        </div>

        <p className="break-words text-[12.5px] leading-relaxed text-white/45">{copy.disclaimer}</p>
      </div>
    </div>
  );
}

function Row({ label, value, accent = false }: { label: string; value?: string; accent?: boolean }) {
  return (
    <div className="grid gap-1 border-t border-[#B5527A]/20 py-3 sm:grid-cols-[112px_1fr] sm:gap-4">
      <dt className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#A2416A]">{label}</dt>
      <dd
        className={`break-words text-[14.5px] font-semibold leading-snug ${
          value ? (accent ? "bty-figure text-[#B5527A]" : "text-[#3A1B2A]") : "text-[#6B4356]/40"
        }`}
      >
        {value ?? "—"}
      </dd>
    </div>
  );
}
