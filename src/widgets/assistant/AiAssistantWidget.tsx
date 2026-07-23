"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AppLocale } from "@/i18n/routing";
import { trackGtmEvent } from "@/features/analytics/gtm";
import { getLeadAttributionForSubmission } from "@/features/analytics/attribution.client";
import { trackLeadConversion } from "@/features/analytics/trackLeadConversion";
import type { LeadConversionEvent } from "@/features/analytics/attribution";
import { ASSISTANT_SESSION_IDLE_MS, assistantSessionNow } from "@/features/assistant/session";
import { siteConfig } from "@/shared/config/site";
import { BrandMonogram } from "@/shared/ui/BrandLogo";

const APPEAR_DELAY_MS = 8_000;
const LOGO_NUDGE_DELAY_MS = 30_000;
const MAX_CONTEXT_MESSAGES = 16;
const VISITOR_STORAGE_KEY = "saaleweb_assistant_visitor";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type AiAssistantWidgetLabels = {
  aria: string;
  badge: string;
  title: string;
  subtitle: string;
  intro: string;
  placeholder: string;
  send: string;
  close: string;
  open: string;
  loading: string;
  error: string;
  privacy: string;
  contact: string;
  whatsapp: string;
  whatsappPrefill: string;
  quickPrompts: string[];
};

function withPrefilledMessage(url: string, message: string): string {
  if (/[?&]text=/.test(url)) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}text=${encodeURIComponent(message)}`;
}

function AssistantLogoMark({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <BrandMonogram className="h-full w-full" />
    </span>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 32 32" fill="none" aria-hidden focusable="false">
      <path
        d="M16.04 3.2A12.82 12.82 0 0 0 5.15 22.88L3.8 28l5.25-1.27A12.82 12.82 0 1 0 16.04 3.2Z"
        fill="currentColor"
      />
      <path
        d="M11.83 9.55c-.31-.68-.62-.69-.9-.7h-.76c-.27 0-.7.1-1.07.5-.37.4-1.4 1.36-1.4 3.33 0 1.96 1.43 3.86 1.63 4.13.2.27 2.77 4.42 6.83 6.02 3.38 1.33 4.07 1.06 4.8 1 .73-.07 2.38-.97 2.72-1.9.34-.94.34-1.74.24-1.9-.1-.17-.37-.27-.77-.47-.4-.2-2.38-1.17-2.75-1.3-.37-.14-.64-.2-.9.2-.27.4-1.04 1.3-1.27 1.57-.24.27-.47.3-.87.1-.4-.2-1.68-.62-3.2-1.98-1.18-1.05-1.98-2.35-2.22-2.75-.23-.4-.02-.62.18-.82.18-.18.4-.47.6-.7.2-.24.27-.4.4-.67.14-.27.07-.5-.03-.7-.1-.2-.88-2.17-1.26-2.96Z"
        fill="white"
      />
    </svg>
  );
}

function readableMessage(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function AiAssistantWidget({
  locale,
  labels,
  contactHref,
}: {
  locale: AppLocale;
  labels: AiAssistantWidgetLabels;
  contactHref: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [logoNudge, setLogoNudge] = useState(false);
  const [pageScrolled, setPageScrolled] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: labels.intro }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const visitorIdRef = useRef<string | undefined>(undefined);
  const leadEventTrackedRef = useRef(false);
  const requestInFlightRef = useRef(false);
  const lastInteractionAtRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const whatsappHref = useMemo(
    () => withPrefilledMessage(siteConfig.phone.whatsappUrl, labels.whatsappPrefill),
    [labels.whatsappPrefill],
  );
  const showQuickPrompts = messages.length === 1 && !loading;

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), APPEAR_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted || hasOpened) return;

    const timer = window.setTimeout(() => {
      setLogoNudge(true);
    }, LOGO_NUDGE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [hasOpened, mounted]);

  useEffect(() => {
    if (!mounted) return;

    let frameId = 0;
    const updateScrollState = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => setPageScrolled(window.scrollY > 24));
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.cancelAnimationFrame(frameId);
    };
  }, [mounted]);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY);
      if (existing) {
        visitorIdRef.current = existing;
        return;
      }

      const next =
        typeof window.crypto?.randomUUID === "function"
          ? window.crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      window.localStorage.setItem(VISITOR_STORAGE_KEY, next);
      visitorIdRef.current = next;
    } catch {
      visitorIdRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage(nextText?: string) {
    const text = (nextText || input).trim();
    if (!text || loading || requestInFlightRef.current) return;
    requestInFlightRef.current = true;

    const now = assistantSessionNow();
    const sessionExpired =
      lastInteractionAtRef.current !== null &&
      now - lastInteractionAtRef.current >= ASSISTANT_SESSION_IDLE_MS;
    const currentMessages: ChatMessage[] = sessionExpired
      ? [{ role: "assistant", content: labels.intro }]
      : messages;
    const nextMessages: ChatMessage[] = [...currentMessages, { role: "user", content: text }];
    lastInteractionAtRef.current = now;
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          pagePath: window.location.pathname,
          visitorId: visitorIdRef.current,
          attribution: getLeadAttributionForSubmission(),
          messages: nextMessages
            .filter((message) => message.role === "user" || message.role === "assistant")
            .slice(-MAX_CONTEXT_MESSAGES),
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        answer?: string;
        leadCreated?: boolean;
        conversion?: LeadConversionEvent;
      } | null;

      if (!response.ok || !payload?.ok || !payload.answer) {
        throw new Error("assistant_failed");
      }

      setMessages((current) => [...current, { role: "assistant", content: payload.answer || labels.error }]);
      lastInteractionAtRef.current = assistantSessionNow();
      if (payload.leadCreated && payload.conversion && !leadEventTrackedRef.current) {
        leadEventTrackedRef.current = true;
        trackLeadConversion(payload.conversion);
      }
    } catch {
      setError(labels.error);
      setMessages((current) => [...current, { role: "assistant", content: labels.error }]);
    } finally {
      requestInFlightRef.current = false;
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div
      className={`pointer-events-none fixed bottom-[calc(0.25rem+env(safe-area-inset-bottom))] left-1 right-1 flex max-w-none flex-col items-stretch sm:bottom-[calc(0.75rem+env(safe-area-inset-bottom))] sm:left-auto sm:right-5 sm:max-w-[calc(100vw-2rem)] sm:items-end md:bottom-[calc(1.25rem+env(safe-area-inset-bottom))] md:right-7 ${
        open ? "z-[80]" : "z-40"
      }`}
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto mb-0 flex h-[calc(100dvh-1.25rem)] max-h-[760px] min-h-0 w-full flex-col overflow-hidden rounded-[22px] border border-white/75 bg-white/[0.96] shadow-[0_34px_100px_-42px_rgba(17,24,39,0.72)] backdrop-blur-2xl transition duration-300 motion-reduce:transition-none max-[380px]:h-[calc(100dvh-0.85rem)] sm:h-[min(680px,calc(100dvh-1.5rem))] sm:w-[min(500px,calc(100vw-2rem))] sm:rounded-[30px] sm:min-h-[520px] lg:h-[min(720px,calc(100dvh-2rem))] xl:w-[min(560px,calc(100vw-2rem))] ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="relative shrink-0 overflow-hidden bg-dark px-4 py-3 text-white sm:px-5 sm:py-3">
          <div className="absolute -right-8 -top-12 h-24 w-24 rounded-full bg-brand-pink/40 blur-2xl" />
          <div className="absolute -bottom-14 left-12 h-24 w-24 rounded-full bg-brand-purple/40 blur-2xl" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0 pr-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/80 sm:px-3 sm:text-[10px]">
                <AssistantLogoMark className="grid h-3.5 w-3.5 shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-sm sm:h-4 sm:w-4" />
                {labels.badge}
              </span>
              <h2 className="mt-2 text-[21px] font-black leading-[1.1] sm:text-lg">{labels.title}</h2>
              <p className="mt-1.5 max-h-[3.1em] max-w-[34rem] overflow-hidden text-[12px] leading-[1.55] text-white/[0.76] sm:max-h-none sm:text-xs sm:leading-5">
                {labels.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-xs font-bold text-white/80 transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-auto sm:w-auto sm:px-3 sm:py-1.5"
              aria-label={labels.close}
            >
              <span aria-hidden>{"\u00d7"}</span>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-gradient-to-b from-white via-white to-surface/70 px-3 py-3 sm:space-y-3 sm:px-5 sm:py-4"
        >
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`whitespace-pre-line rounded-2xl px-3.5 py-3 text-[15px] leading-7 shadow-sm sm:px-4 sm:py-3.5 sm:text-[15px] sm:leading-7 ${
                  message.role === "user"
                    ? "max-w-[90%] bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-[0_14px_28px_-18px_rgba(139,92,246,0.8)] sm:max-w-[82%]"
                    : "w-full border border-line bg-white text-slate-700 sm:max-w-[94%]"
                }`}
              >
                {readableMessage(message.content)}
              </div>
            </div>
          ))}
          {loading ? (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-pink" />
              {labels.loading}
            </div>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-line bg-white px-3.5 py-3 sm:px-5 sm:py-3">
          {showQuickPrompts ? (
            <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mb-3 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
              {labels.quickPrompts.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  className="max-w-[84vw] shrink-0 rounded-xl border border-line bg-surface px-3.5 py-2 text-left text-[12px] font-bold leading-snug text-slate-600 transition hover:border-brand-purple/40 hover:bg-white hover:text-brand-purple disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-none sm:px-2.5 sm:py-1.5 sm:text-[11px]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="flex items-end gap-2"
          >
            <label className="sr-only" htmlFor="ai-assistant-input">
              {labels.placeholder}
            </label>
            <textarea
              id="ai-assistant-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={labels.placeholder}
              rows={1}
              maxLength={1200}
              className="min-h-[54px] flex-1 resize-none rounded-2xl border border-line bg-white px-4 py-3.5 text-[16px] leading-6 text-dark outline-none transition placeholder:text-muted/70 focus:border-brand-purple/60 focus:ring-4 focus:ring-brand-purple/10 sm:min-h-[52px] sm:py-3 sm:text-sm"
            />
            <button
              type="submit"
              disabled={loading || input.trim().length === 0}
              className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-2xl bg-gradient-to-r from-brand-pink to-brand-purple text-lg font-black text-white shadow-[0_18px_38px_-20px_rgba(139,92,246,0.9)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:h-[52px] sm:w-[52px]"
              aria-label={labels.send}
            >
              <span aria-hidden>{"\u2192"}</span>
            </button>
          </form>

          {error ? <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p> : null}

          <div className="mt-2 flex flex-wrap gap-2">
            <a
              href={contactHref}
              className="rounded-full bg-dark px-3.5 py-2 text-xs font-extrabold text-white transition hover:-translate-y-0.5"
            >
              {labels.contact}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/25 bg-[#25D366]/10 px-3.5 py-2 text-xs font-extrabold text-[#128C7E] transition hover:-translate-y-0.5"
            >
              <WhatsAppIcon />
              {labels.whatsapp}
            </a>
          </div>
          <p className="mt-2 max-h-[2.6em] overflow-hidden text-[10.5px] leading-snug text-slate-500 sm:mt-3 sm:max-h-none sm:text-[11px] sm:leading-relaxed">{labels.privacy}</p>
        </div>
      </div>

      {!open ? (
        <button
          type="button"
          onClick={() => {
            setHasOpened(true);
            setLogoNudge(false);
            setOpen(true);
            trackGtmEvent("ai_assistant_open", {
              page_path: window.location.pathname,
              widget_locale: locale,
            });
          }}
          className={`assistant-glass-trigger pointer-events-auto group ml-auto flex self-end items-center gap-3 rounded-full p-1.5 pr-3 text-white transition duration-500 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple motion-reduce:transition-none sm:pr-4 ${
            pageScrolled ? "assistant-glass-trigger--scrolled" : ""
          }`}
          aria-label={labels.open}
          aria-expanded={false}
        >
          <span
            className={`assistant-glass-orb relative z-[2] grid h-12 w-12 shrink-0 place-items-center rounded-full transition duration-500 group-hover:scale-105 sm:h-13 sm:w-13 ${
              logoNudge ? "assistant-logo-nudge" : ""
            }`}
          >
            <span aria-hidden className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-brand-purple/15" />
            <AssistantLogoMark className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full sm:h-10 sm:w-10" />
          </span>
          <span className="relative z-[2] hidden min-w-0 pr-1 text-left sm:block">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-fuchsia-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.85)]" aria-hidden />
              {labels.badge}
            </span>
            <span className="mt-0.5 block max-w-[210px] text-sm font-extrabold leading-snug text-white">
              {labels.open}
            </span>
          </span>
        </button>
      ) : null}
    </div>
  );
}
