import { siteConfig } from "@/shared/config/site";

const URL = siteConfig.url;
const ORG_ID = `${URL}/#organization`;

/** Organization — emitted once globally. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    url: URL,
    email: siteConfig.email,
    founder: { "@type": "Person", name: siteConfig.founder },
    areaServed: siteConfig.locations,
    slogan: "Websites, SEO & KI für Unternehmen",
  };
}

/** WebSite — emitted once globally per locale. */
export function websiteSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${URL}/#website`,
    url: URL,
    name: siteConfig.name,
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

/** ProfessionalService / LocalBusiness — homepage + local landing pages. */
export function localBusinessSchema(opts?: { areaServed?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": `${URL}/#localbusiness`,
    name: siteConfig.name,
    url: URL,
    email: siteConfig.email,
    priceRange: "€€",
    areaServed: opts?.areaServed ?? siteConfig.locations,
    founder: { "@type": "Person", name: siteConfig.founder },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Halle (Saale)",
      addressCountry: "DE",
    },
  };
}

export function contactPageSchema(input: {
  name: string;
  description: string;
  path: string;
  locale: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: input.name,
    description: input.description,
    url: `${URL}${input.path}`,
    inLanguage: input.locale,
    about: { "@id": ORG_ID },
    mainEntity: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      contactType: "sales",
      areaServed: "DE",
      availableLanguage: ["German", "English", "Russian"],
    },
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.founder,
    jobTitle: "Webentwickler & Gründer",
    worksFor: { "@id": ORG_ID },
    url: URL,
  };
}

export function serviceSchema(input: {
  name: string;
  description?: string;
  path: string;
  locale: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.name,
    provider: { "@id": ORG_ID },
    areaServed: siteConfig.locations,
    url: `${URL}${input.path}`,
    inLanguage: input.locale,
  };
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${URL}${it.path}`,
    })),
  };
}

export function caseStudySchema(input: {
  title: string;
  description?: string | null;
  path: string;
  locale: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.title,
    description: input.description ?? undefined,
    inLanguage: input.locale,
    image: input.image ?? undefined,
    url: `${URL}${input.path}`,
    creator: { "@id": ORG_ID },
    provider: { "@id": ORG_ID },
  };
}

export function articleSchema(input: {
  title: string;
  description?: string | null;
  path: string;
  locale: string;
  datePublished?: string | null;
  image?: string | null;
  authorName?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description ?? undefined,
    inLanguage: input.locale,
    datePublished: input.datePublished ?? undefined,
    image: input.image ?? undefined,
    mainEntityOfPage: `${URL}${input.path}`,
    url: `${URL}${input.path}`,
    author: { "@type": "Person", name: input.authorName ?? siteConfig.founder },
    publisher: { "@id": ORG_ID },
  };
}
