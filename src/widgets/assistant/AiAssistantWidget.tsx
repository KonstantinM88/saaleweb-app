"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/shared/config/site";

const APPEAR_DELAY_MS = 8_000;
const MAX_CONTEXT_MESSAGES = 10;

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

function SparkIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
      <path
        d="M12 2.8 14.08 8a3 3 0 0 0 1.68 1.68L21.2 12l-5.44 2.32A3 3 0 0 0 14.08 16L12 21.2 9.92 16a3 3 0 0 0-1.68-1.68L2.8 12l5.44-2.32A3 3 0 0 0 9.92 8L12 2.8Z"
        fill="currentColor"
      />
    </svg>
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
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: labels.intro }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const whatsappHref = useMemo(
    () => withPrefilledMessage(siteConfig.phone.whatsappUrl, labels.whatsappPrefill),
    [labels.whatsappPrefill],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), APPEAR_DELAY_MS);
    return () => window.clearTimeout(timer);
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
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
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
          messages: nextMessages
            .filter((message) => message.role === "user" || message.role === "assistant")
            .slice(-MAX_CONTEXT_MESSAGES),
        }),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; answer?: string } | null;

      if (!response.ok || !payload?.ok || !payload.answer) {
        throw new Error("assistant_failed");
      }

      setMessages((current) => [...current, { role: "assistant", content: payload.answer || labels.error }]);
    } catch {
      setError(labels.error);
      setMessages((current) => [...current, { role: "assistant", content: labels.error }]);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div
      className={`pointer-events-none fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-3 flex max-w-[calc(100vw-1.5rem)] flex-col items-end sm:right-5 md:bottom-[calc(1.25rem+env(safe-area-inset-bottom))] md:right-7 ${
        open ? "z-[80]" : "z-40"
      }`}
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto mb-0 flex h-[min(620px,calc(100dvh-1.5rem))] w-[min(440px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[30px] border border-white/75 bg-white/[0.96] shadow-[0_34px_100px_-42px_rgba(17,24,39,0.72)] backdrop-blur-2xl transition duration-300 motion-reduce:transition-none sm:h-[min(680px,calc(100dvh-1.5rem))] sm:w-[min(500px,calc(100vw-2rem))] lg:h-[min(720px,calc(100dvh-2rem))] xl:w-[min(560px,calc(100vw-2rem))] ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="relative shrink-0 overflow-hidden bg-dark px-4 py-3 text-white sm:px-5">
          <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-brand-pink/40 blur-2xl" />
          <div className="absolute -bottom-12 left-12 h-28 w-28 rounded-full bg-brand-purple/40 blur-2xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 [&>svg]:h-3.5 [&>svg]:w-3.5">
                <SparkIcon />
                {labels.badge}
              </span>
              <h2 className="mt-2 text-lg font-black leading-tight">{labels.title}</h2>
              <p className="mt-1 max-w-[34rem] text-xs leading-5 text-white/[0.74]">{labels.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80 transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label={labels.close}
            >
              <span aria-hidden>{"\u00d7"}</span>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-white via-white to-surface/70 px-4 py-4 sm:px-5"
        >
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`whitespace-pre-line rounded-2xl px-4 py-3 text-[15px] leading-7 shadow-sm ${
                  message.role === "user"
                    ? "max-w-[82%] bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-[0_14px_28px_-18px_rgba(139,92,246,0.8)]"
                    : "max-w-[94%] border border-line bg-white text-slate-700"
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

        <div className="shrink-0 border-t border-line bg-white px-4 py-3 sm:px-5">
          <div className="mb-3 grid gap-1.5 sm:grid-cols-3">
            {labels.quickPrompts.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                disabled={loading}
                className="rounded-xl border border-line bg-surface px-2.5 py-1.5 text-left text-[11px] font-bold leading-snug text-slate-600 transition hover:border-brand-purple/40 hover:bg-white hover:text-brand-purple disabled:cursor-not-allowed disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

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
              rows={2}
              maxLength={1200}
              className="min-h-[52px] flex-1 resize-none rounded-2xl border border-line bg-white px-4 py-3 text-sm leading-6 text-dark outline-none transition placeholder:text-muted/70 focus:border-brand-purple/60 focus:ring-4 focus:ring-brand-purple/10"
            />
            <button
              type="submit"
              disabled={loading || input.trim().length === 0}
              className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-gradient-to-r from-brand-pink to-brand-purple text-lg font-black text-white shadow-[0_18px_38px_-20px_rgba(139,92,246,0.9)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={labels.send}
            >
              <span aria-hidden>{"\u2192"}</span>
            </button>
          </form>

          {error ? <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p> : null}

          <div className="mt-3 flex flex-wrap gap-2">
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
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{labels.privacy}</p>
        </div>
      </div>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto group ml-auto flex items-center gap-3 rounded-full border border-white/55 bg-white/[0.92] p-2 pr-3 text-dark shadow-[0_24px_70px_-30px_rgba(17,24,39,0.65)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-brand-purple/35 hover:shadow-[0_28px_80px_-28px_rgba(139,92,246,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple motion-reduce:transition-none sm:pr-4"
          aria-label={labels.open}
          aria-expanded={false}
        >
          <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-pink to-brand-purple text-white shadow-[0_16px_34px_-16px_rgba(139,92,246,0.95)] transition group-hover:scale-105">
            <span aria-hidden className="absolute inset-0 rounded-full bg-brand-pink/40 blur-xl" />
            <span className="relative">
              <SparkIcon />
            </span>
          </span>
          <span className="hidden min-w-0 pr-1 text-left sm:block">
            <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-brand-purple">
              {labels.badge}
            </span>
            <span className="mt-0.5 block max-w-[210px] text-sm font-extrabold leading-snug text-dark">
              {labels.open}
            </span>
          </span>
        </button>
      ) : null}
    </div>
  );
}
