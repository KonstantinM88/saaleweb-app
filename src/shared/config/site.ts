const fallbackPhone = "+4917671764743";
const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || fallbackPhone;
const phoneE164 = contactPhone.replace(/[^\d+]/g, "");
const phoneDigits = phoneE164.replace(/\D/g, "");

function formatPhone(value: string): string {
  const normalized = value.replace(/[^\d+]/g, "");
  const match = normalized.match(/^\+49(\d{3})(\d{8})$/);

  return match ? `+49 ${match[1]} ${match[2]}` : value;
}

export const siteConfig = {
  name: "SaaleWeb",
  domain: "saaleweb.de",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://saaleweb.de",
  founder: "Konstantin Mykhailov",
  email: "hallo@saaleweb.de",
  phone: {
    display: formatPhone(contactPhone),
    e164: phoneE164,
    href: `tel:${phoneE164}`,
    whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL || `https://wa.me/${phoneDigits}`,
    telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL || `https://t.me/+${phoneDigits}`,
  },
  locations: ["Halle (Saale)", "Leipzig", "Merseburg", "Schkeuditz", "Delitzsch", "Saalekreis"],
  /**
   * Physical business address (matches Impressum / LEGAL_PROVIDER and the
   * verified Google Business Profile). Single source for NAP consistency.
   */
  address: {
    street: "Hettstedter Str. 64",
    postalCode: "06124",
    locality: "Halle (Saale)",
    region: "Sachsen-Anhalt",
    countryCode: "DE",
    country: "Deutschland",
  },
  /**
   * Google Business Profile / Google Maps integration.
   * Values below are real and extracted from the verified profile links.
   */
  googleBusiness: {
    /** Public profile short link (g.page review link without the /review suffix). */
    profileUrl: "https://g.page/r/CQgPij2bE5yLEBM",
    /** Canonical Maps location URL via CID (from the shared Maps link). */
    placeUrl: "https://maps.google.com/?cid=10059937225112162056",
    /** Official Maps Directions deep link (Maps URLs API, no key required). */
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=SaaleWeb%2C%20Hettstedter%20Str.%2064%2C%2006124%20Halle%20(Saale)",
    /** Direct "write a review" link. */
    reviewUrl: "https://g.page/r/CQgPij2bE5yLEBM/review",
    /**
     * TODO: real Place ID ("ChIJ..."), find via
     * https://developers.google.com/maps/documentation/places/web-service/place-id
     * Empty string = not set; nothing placeholder-like is emitted to production.
     */
    placeId: "",
    /** Exact location (from the shared Maps link: !1d=lng, !2d=lat). */
    latitude: 51.4738593,
    longitude: 11.9106955,
    /** Verified profile opening hours. */
    openingHours: [
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "08:00", closes: "16:00" },
      { days: ["Friday"], opens: "08:00", closes: "15:00" },
    ],
  },
  nav: [
    { key: "services", href: "/leistungen" },
    { key: "industries", href: "/branchen" },
    { key: "projects", href: "/projekte" },
    { key: "pricing", href: "/preise" },
    { key: "blog", href: "/blog" },
    { key: "contact", href: "/kontakt" },
    { key: "faq", href: "/#faq" },
  ],
} as const;
