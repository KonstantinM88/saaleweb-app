"use client";

import { useState, type ReactNode } from "react";
import { trackEvent, type LocalSeoEvent } from "@/features/analytics/trackEvent";
import { siteConfig } from "@/shared/config/site";

/** External/action link that reports a local-SEO click event on activation. */
export function TrackedAction({
  href,
  event,
  locale,
  ariaLabel,
  external = true,
  primary = false,
  children,
}: {
  href: string;
  event: LocalSeoEvent;
  locale: string;
  ariaLabel: string;
  external?: boolean;
  primary?: boolean;
  children: ReactNode;
}) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-bold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple";
  const style = primary
    ? "btn-shine bg-brand text-white shadow-[0_18px_38px_-18px_rgba(139,92,246,0.85)]"
    : "border border-line bg-white text-dark hover:border-brand-purple/40";

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      onClick={() => trackEvent(event, locale)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${base} ${style}`}
    >
      {children}
    </a>
  );
}

/**
 * Privacy-friendly Google Maps: a static placeholder with address and a
 * "load map" button; the iframe (keyless maps embed) is injected only after
 * an explicit user interaction, so no Google request happens on page load.
 */
export function ConsentMap({
  locale,
  loadLabel,
  privacyNote,
  mapTitle,
}: {
  locale: string;
  loadLabel: string;
  privacyNote: string;
  mapTitle: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const gb = siteConfig.googleBusiness;
  const embedSrc = `https://www.google.com/maps?q=${gb.latitude},${gb.longitude}&z=16&hl=${locale}&output=embed`;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] border border-line bg-surface sm:aspect-[16/9]">
      {loaded ? (
        <iframe
          src={embedSrc}
          title={mapTitle}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center p-6 text-center"
          style={{
            background:
              "radial-gradient(560px 300px at 12% 0%, rgba(255,79,163,0.10), transparent 60%), radial-gradient(560px 300px at 88% 100%, rgba(139,92,246,0.12), transparent 60%)",
          }}
        >
          <div className="max-w-sm">
            <p className="font-extrabold text-dark">{siteConfig.name}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">
              {siteConfig.address.street}
              <br />
              {siteConfig.address.postalCode} {siteConfig.address.locality},{" "}
              {siteConfig.address.country}
            </p>
            <button
              type="button"
              onClick={() => {
                setLoaded(true);
                trackEvent("load_google_maps", locale);
              }}
              className="btn-shine mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-[14px] font-bold text-white shadow-[0_18px_38px_-18px_rgba(139,92,246,0.85)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
            >
              {loadLabel}
            </button>
            <p className="mt-3 text-[12px] leading-relaxed text-muted">{privacyNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}
