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
