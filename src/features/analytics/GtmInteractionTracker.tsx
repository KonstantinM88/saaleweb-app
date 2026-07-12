"use client";

import { useEffect } from "react";
import {
  GTM_EVENT_NAMES,
  trackGtmEvent,
  type GtmEventName,
} from "./gtm";

const EVENT_SET = new Set<string>(GTM_EVENT_NAMES);

function explicitEvent(element: HTMLElement): GtmEventName | null {
  const name = element.dataset.gtmEvent;
  return name && EVENT_SET.has(name) ? (name as GtmEventName) : null;
}

function linkEvent(url: URL): GtmEventName | null {
  if (url.protocol === "tel:") return "phone_click";
  if (url.protocol === "mailto:") return "email_click";
  if (/(^|\.)wa\.me$|(^|\.)whatsapp\.com$/i.test(url.hostname)) return "whatsapp_click";
  if (/(^|\.)t\.me$|(^|\.)telegram\.me$/i.test(url.hostname)) return "telegram_click";
  if (url.origin !== window.location.origin && /^https?:$/.test(url.protocol)) return "outbound_link";
  return null;
}

/**
 * Lightweight delegated tracking: no observer per link. Future controls can
 * opt in with data-gtm-event="booking_click" (or another typed event name).
 */
export function GtmInteractionTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const explicitTarget = target.closest<HTMLElement>("[data-gtm-event]");
      const explicit = explicitTarget ? explicitEvent(explicitTarget) : null;
      if (explicit && explicitTarget) {
        trackGtmEvent(explicit, {
          element_text: explicitTarget.textContent?.trim().slice(0, 160),
          page_path: window.location.pathname,
        });
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      const trackedEvent = linkEvent(url);
      if (!trackedEvent) return;
      trackGtmEvent(trackedEvent, {
        link_url: url.href,
        link_domain: url.hostname || undefined,
        link_text: anchor.textContent?.trim().slice(0, 160),
        page_path: window.location.pathname,
      });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    const sent = new Set<number>();
    const thresholds = [25, 50, 75, 90];
    let frame = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const depth = Math.round((window.scrollY / scrollable) * 100);
        for (const threshold of thresholds) {
          if (depth < threshold || sent.has(threshold)) continue;
          sent.add(threshold);
          trackGtmEvent("scroll_depth", {
            percent_scrolled: threshold,
            page_path: window.location.pathname,
          });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
