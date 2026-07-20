"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, LoaderCircle, ShieldCheck, TriangleAlert } from "lucide-react";
import type { TurnstileAction } from "./turnstile";

const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

type WidgetId = string;
type WidgetStatus = "loading" | "ready" | "verified" | "error";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: TurnstileAction;
      language: string;
      theme: "light";
      size: "flexible";
      appearance: "always";
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      "timeout-callback": () => void;
    },
  ) => WidgetId;
  reset: (widgetId: WidgetId) => void;
  remove: (widgetId: WidgetId) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileField({
  action,
  serverError = false,
  resetSignal,
}: {
  action: TurnstileAction;
  serverError?: boolean;
  resetSignal?: unknown;
}) {
  const t = useTranslations("Captcha");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<WidgetId | null>(null);
  const mountedRef = useRef(false);
  const [status, setStatus] = useState<WidgetStatus>("loading");
  const [recoveredAfterServerError, setRecoveredAfterServerError] = useState(false);

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile || widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action,
      language: locale,
      theme: "light",
      size: "flexible",
      appearance: "always",
      callback: () => {
        setStatus("verified");
        setRecoveredAfterServerError(true);
      },
      "error-callback": () => setStatus("error"),
      "expired-callback": () => setStatus("ready"),
      "timeout-callback": () => setStatus("ready"),
    });
    setStatus("ready");
  }, [action, locale]);

  useEffect(() => {
    renderWidget();

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      setStatus("ready");
      setRecoveredAfterServerError(false);
    }
  }, [resetSignal]);

  if (!siteKey) return null;

  const hasServerError = serverError && !recoveredAfterServerError;
  const hasError = hasServerError || status === "error";

  return (
    <fieldset
      className={`rounded-2xl border px-4 pb-4 pt-3 transition ${
        hasError ? "border-brand-pink/60 bg-brand-pink/5" : "border-line bg-surface/70"
      }`}
    >
      <legend className="flex items-center gap-2 px-1 text-[13px] font-bold text-dark">
        <ShieldCheck className="h-4 w-4 text-[#6D28D9]" aria-hidden />
        {t("label")}
      </legend>

      <p className="mb-3 text-[12.5px] leading-relaxed text-muted">{t("hint")}</p>
      <div ref={containerRef} className="min-h-[65px] w-full overflow-hidden rounded-xl" />

      <div className="mt-2 flex items-start gap-2 text-[12.5px] leading-relaxed" aria-live="polite">
        {hasError ? (
          <>
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#BE185D]" aria-hidden />
            <span className="font-semibold text-[#BE185D]">
              {hasServerError ? t("error") : t("loadError")}
            </span>
          </>
        ) : status === "verified" ? (
          <>
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <span className="font-semibold text-emerald-700">{t("verified")}</span>
          </>
        ) : status === "ready" ? (
          <>
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6D28D9]" aria-hidden />
            <span className="text-muted">{t("ready")}</span>
          </>
        ) : (
          <>
            <LoaderCircle className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-[#6D28D9]" aria-hidden />
            <span className="text-muted">{t("loading")}</span>
          </>
        )}
      </div>

      <Script
        id="saaleweb-turnstile"
        src={TURNSTILE_SCRIPT}
        strategy="afterInteractive"
        onReady={renderWidget}
        onError={() => setStatus("error")}
      />
    </fieldset>
  );
}
