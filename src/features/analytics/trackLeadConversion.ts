"use client";

import type { LeadConversionEvent } from "./attribution";
import { trackGtmEvent } from "./gtm";
import { trackEvent } from "./trackEvent";

/** Emits only non-PII conversion dimensions after confirmed database creation. */
export function trackLeadConversion(conversion: LeadConversionEvent, audit = false): void {
  const parameters = {
    form_name: conversion.formName,
    lead_source: conversion.leadSource,
    lead_medium: conversion.leadMedium,
    lead_channel: conversion.leadChannel,
    lead_campaign: conversion.leadCampaign,
    page_path: conversion.pagePath,
    locale: conversion.locale,
    device_category: conversion.deviceCategory,
  };
  trackGtmEvent("form_submit", parameters);
  trackEvent("form_submit", conversion.locale);
  if (audit) {
    trackGtmEvent("audit_request", parameters);
    trackEvent("audit_request", conversion.locale);
  }
}
