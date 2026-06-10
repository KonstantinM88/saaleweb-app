export const siteConfig = {
  name: "SaaleWeb",
  domain: "saaleweb.de",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://saaleweb.de",
  founder: "Konstantin Mykhailov",
  email: "hallo@saaleweb.de",
  locations: ["Halle (Saale)", "Leipzig", "Merseburg", "Saalekreis"],
  nav: [
    { key: "services", href: "/#services" },
    { key: "industries", href: "/#industries" },
    { key: "cases", href: "/#cases" },
    { key: "pricing", href: "/#pricing" },
    { key: "blog", href: "/blog" },
    { key: "faq", href: "/#faq" },
  ],
} as const;
