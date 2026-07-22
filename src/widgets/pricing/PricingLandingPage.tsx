import { ArrowRight, Check, CircleHelp, Compass, FileText, Gauge, Link as LinkIcon, ShieldCheck, Sparkles } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/shared/ui/Button";
import { BrandText } from "@/shared/ui/BrandText";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { cn } from "@/shared/lib/cn";
import { getContactHref } from "@/shared/lib/contactHref";
import { getAuditHref, getLocalizedHref, getLocalizedSlugHref } from "@/shared/lib/localizedPath";
import { FaqAccordion } from "@/widgets/faq/FaqAccordion";

type PackageKey = "lightStart" | "starter" | "business" | "individual";

type PricingPackageCopy = {
  name: string;
  badge: string;
  subtitle: string;
  technology: string;
  bestFor: string;
  description: string;
  includedTitle: string;
  included: string[];
  seoTitle?: string;
  seoText?: string;
  notIncludedTitle?: string;
  notIncluded?: string[];
  examplesTitle?: string;
  examples?: string[];
  cta: string;
  note?: string;
};

type ComparisonRow = {
  label: string;
  values: Record<PackageKey, string>;
};

type PricingLandingCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string[];
  primaryCta: string;
  secondaryCta: string;
  trustLine: string;
  pricingNote: string;
  packagesTitle: string;
  packagesLead: string;
  packageCopies: Record<PackageKey, PricingPackageCopy>;
  seoTitle: string;
  seoIntro: string;
  seoCards: { label: string; title: string; text: string }[];
  comparisonTitle: string;
  comparisonRows: ComparisonRow[];
  comparisonCtas: Record<PackageKey, string>;
  transparencyTitle: string;
  transparencyText: string;
  transparencyListTitle: string;
  transparencyList: string[];
  transparencyNote: string;
  trustTitle: string;
  trustText: string;
  trustCards: { title: string; text: string }[];
  linksTitle: string;
  linksLead: string;
  linkLabels: Record<
    | "services"
    | "website"
    | "wordpress"
    | "shop"
    | "seo"
    | "maintenance"
    | "assistant"
    | "projects"
    | "industries"
    | "contact"
    | "audit",
    string
  >;
  auditTitle: string;
  auditText: string;
  auditCta: string;
  auditMicrocopy: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
};

type PricingUiLabels = {
  businessFirst: string;
  principle: string;
  comparison: string;
  transparency: string;
  links: string;
  option: string;
  price: string;
  cta: string;
};

const uiLabels: Record<AppLocale, PricingUiLabels> = {
  de: {
    businessFirst: "Business First",
    principle: "Die Technologie folgt dem Ziel.",
    comparison: "Vergleich",
    transparency: "Transparenz",
    links: "Links",
    option: "Option",
    price: "Preis",
    cta: "CTA",
  },
  en: {
    businessFirst: "Business First",
    principle: "Technology follows the goal.",
    comparison: "Comparison",
    transparency: "Transparency",
    links: "Links",
    option: "Option",
    price: "Price",
    cta: "CTA",
  },
  ru: {
    businessFirst: "Business First",
    principle: "Технология следует цели.",
    comparison: "Сравнение",
    transparency: "Прозрачность",
    links: "Ссылки",
    option: "Вариант",
    price: "Цена",
    cta: "CTA",
  },
};

const copy = {
  de: {
    metaTitle: "Preise für Websites, SEO & digitale Lösungen | SaaleWeb",
    metaDescription:
      "Transparente Einstiegspreise für WordPress-Onepager, React/Next.js Landingpages, Business Websites, SEO, Betreuung und digitale Lösungen von SaaleWeb.",
    eyebrow: "Preise",
    title: "Preise für Websites und digitale Lösungen, die zu Ihrem Ziel passen.",
    lead: [
      "Jedes Unternehmen startet an einem anderen Punkt. Manche brauchen zuerst einen einfachen professionellen Online-Auftritt. Andere benötigen eine performante Website, SEO-Struktur, Buchungssysteme, Automatisierung oder individuelle Funktionen.",
      "Deshalb bietet SaaleWeb transparente Einstiegspakete – und erweitert jedes Projekt nur dort, wo es für Ihr Unternehmen wirklich sinnvoll ist.",
    ],
    primaryCta: "Kostenloses Erstgespräch",
    secondaryCta: "Website analysieren lassen",
    trustLine: "Unverbindlich. Verständlich. Mit klarem Blick auf Ihr Geschäft.",
    pricingNote:
      "Alle Preise sind Einstiegspreise und abhängig von Umfang, Inhalten, Funktionen und gewünschter Betreuung. Preise zzgl. 19 % MwSt., sofern nicht anders angegeben.",
    packagesTitle: "Vier klare Wege zum passenden digitalen System",
    packagesLead:
      "Vom schnellen WordPress-Einstieg bis zur individuellen Lösung: Die Technologie folgt dem Ziel – nicht umgekehrt.",
    packageCopies: {
      lightStart: {
        name: "Leichter Start",
        badge: "WordPress Onepager",
        subtitle: "Der schnelle professionelle Einstieg für kleine Unternehmen und Selbstständige.",
        technology: "WordPress",
        bestFor:
          "Kleine Unternehmen, Selbstständige und lokale Anbieter, die schnell seriös online sichtbar werden möchten.",
        description:
          "Ein kompakter, professioneller Onepager auf WordPress-Basis. Ideal, wenn Sie zunächst einen klaren Online-Auftritt benötigen, ohne direkt ein umfangreiches individuelles System aufzubauen.",
        includedTitle: "Enthalten",
        included: [
          "1 professionelle Onepage-Website",
          "WordPress-Basis",
          "Responsive Design",
          "Startseite mit klarer Struktur",
          "Leistungen / Angebot",
          "Kontaktbereich",
          "Kontaktformular",
          "Basis-SEO",
          "Grundlegende GEO / AIO-Struktur",
          "Technische Grundeinstellungen",
          "Datenschutz- und Impressumsverlinkung",
          "Kurze Einweisung zur einfachen Pflege",
        ],
        seoTitle: "Basis-SEO / GEO / AIO einfach erklärt",
        seoText:
          "Ihre Seite wird technisch und inhaltlich so vorbereitet, dass Google und moderne KI-Systeme Ihr Unternehmen besser einordnen können. Dazu gehören klare Überschriften, verständliche Leistungsbeschreibungen, lokale Signale, Meta-Daten und eine saubere Seitenstruktur.",
        notIncludedTitle: "Nicht automatisch enthalten",
        notIncluded: [
          "Individuelles Designsystem",
          "Mehrsprachige Versionen",
          "Online-Shop",
          "Buchungssystem",
          "Komplexe Automatisierungen",
          "Umfangreiche Texterstellung",
          "Laufende Betreuung",
        ],
        cta: "Leichten Start anfragen",
        note: "Ideal, wenn Sie schnell professionell online gehen möchten.",
      },
      starter: {
        name: "Starter Landingpage",
        badge: "React / Next.js",
        subtitle: "Moderne Landingpage für mehr Vertrauen, Performance und Anfragen.",
        technology: "React / Next.js",
        bestFor:
          "Unternehmen, die mehr Wert auf individuelle Gestaltung, Performance, klare Nutzerführung und bessere technische Grundlage legen.",
        description:
          "Eine moderne Landingpage auf React / Next.js-Basis mit hochwertiger Gestaltung, klarer Struktur und Fokus auf Sichtbarkeit, Vertrauen und Anfragen.",
        includedTitle: "Enthalten",
        included: [
          "1 hochwertige Landingpage",
          "6–9 professionelle Inhaltsbereiche",
          "Individuelles Layout im SaaleWeb-Premiumstil",
          "Responsive Design",
          "Klare Nutzerführung",
          "Conversion-orientierte CTA-Struktur",
          "Basis-SEO",
          "Grundlegende GEO / AIO-Struktur",
          "Performance-Optimierung",
          "Technische Meta-Daten",
          "Strukturierte Überschriften",
          "FAQ-Bereich",
          "Kontakt- oder Anfrageformular",
          "Deployment-Unterstützung",
        ],
        seoTitle: "SEO / GEO / AIO einfach erklärt",
        seoText:
          "Wir strukturieren Inhalte so, dass nicht nur Besucher, sondern auch Suchmaschinen und moderne KI-Systeme besser verstehen, wer Sie sind, was Sie anbieten und für welche Region oder Branche Ihre Leistungen relevant sind.",
        cta: "Starter Landingpage anfragen",
        note: "Ideal für Unternehmen, die mehr als eine einfache Web-Visitenkarte möchten.",
      },
      business: {
        name: "Business Website",
        badge: "Mehrseitige Website",
        subtitle: "Professionelle Unternehmenswebsite für Sichtbarkeit, Vertrauen und Wachstum.",
        technology: "React / Next.js oder WordPress",
        bestFor:
          "Unternehmen, die Leistungen, Referenzen, Branchen, Standorte oder mehrere Angebote professionell darstellen möchten.",
        description:
          "Eine mehrseitige Website mit klarer Struktur, professioneller Präsentation, SEO-Grundlage und Erweiterungsmöglichkeiten für langfristiges Wachstum.",
        includedTitle: "Enthalten",
        included: [
          "Mehrseitige Website",
          "Individuelle Seitenstruktur",
          "Leistungsseiten",
          "Kontakt- und Anfrageprozesse",
          "Basis-SEO",
          "GEO / AIO-Grundstruktur",
          "Local SEO Grundlagen",
          "Performance-Optimierung",
          "FAQ-Bereiche",
          "Strukturierte Daten, wo sinnvoll",
          "Projekt- oder Referenzbereiche",
          "Skalierbare Inhaltsstruktur",
        ],
        cta: "Business Website besprechen",
      },
      individual: {
        name: "Individuelles System",
        badge: "Individuelles Angebot",
        subtitle: "Für Online-Shops, Portale, Buchungssysteme, Automatisierung und spezielle Funktionen.",
        technology: "Individuell nach Ziel",
        bestFor: "Unternehmen, die mehr benötigen als eine klassische Website.",
        description:
          "Wenn Ihr Projekt spezielle Funktionen, Datenprozesse, Buchungssysteme, Schnittstellen oder Automatisierungen benötigt, entwickelt SaaleWeb eine passende individuelle Lösung.",
        includedTitle: "Mögliche Bausteine",
        included: [
          "Konzept und technische Planung",
          "Individuelle UX- und Funktionsstruktur",
          "Skalierbare technische Basis",
          "SEO- und Performance-Grundlagen",
          "Saubere Schnittstellenplanung",
          "Launch- und Übergabeunterstützung",
        ],
        examplesTitle: "Beispiele",
        examples: [
          "Online-Shop",
          "Buchungssystem",
          "Kundenportal",
          "API-Integration",
          "Datenimport / Export",
          "KI-Assistent",
          "Automatisierungen",
          "WordPress-Plugin",
          "Individuelle Webanwendung",
        ],
        cta: "Projekt besprechen",
      },
    },
    seoTitle: "Was bedeutet Basis-SEO, GEO und AIO?",
    seoIntro:
      "Viele Begriffe klingen technisch. Entscheidend ist aber der Nutzen: Ihre Website soll verständlich aufgebaut sein – für Menschen, Suchmaschinen und moderne KI-Systeme.",
    seoCards: [
      {
        label: "SEO",
        title: "Besser bei Google gefunden werden",
        text: "Wir achten auf saubere Meta-Daten, klare Überschriften, verständliche Inhalte, schnelle Ladezeiten und eine Struktur, die Suchmaschinen gut erfassen können.",
      },
      {
        label: "GEO",
        title: "Für moderne KI-Suche verständlich sein",
        text: "GEO bedeutet, Inhalte so aufzubauen, dass KI-Systeme Zusammenhänge besser erkennen können – zum Beispiel Leistungen, Branchen, Standorte, häufige Fragen und klare Antworten.",
      },
      {
        label: "AIO",
        title: "Inhalte für Menschen und KI optimieren",
        text: "AIO verbindet klassische Suchmaschinenoptimierung mit klaren, strukturierten Inhalten. Ihre Website soll nicht nur gut aussehen, sondern auch verständlich erklären, was Ihr Unternehmen anbietet.",
      },
    ],
    comparisonTitle: "Welches Paket passt zu Ihrem Unternehmen?",
    comparisonRows: [
      { label: "Technologie", values: { lightStart: "WordPress", starter: "React / Next.js", business: "React / Next.js oder WordPress", individual: "Individuell nach Ziel" } },
      { label: "Umfang", values: { lightStart: "Onepager", starter: "Landingpage mit 6–9 Bereichen", business: "Mehrseitige Website", individual: "Individuelle Lösung" } },
      { label: "Ideal für", values: { lightStart: "Schneller Einstieg", starter: "Mehr Vertrauen und Anfragen", business: "Professioneller Unternehmensauftritt", individual: "Komplexe Funktionen" } },
      { label: "SEO / GEO / AIO", values: { lightStart: "Basis", starter: "Basis Plus", business: "Erweitert", individual: "Individuell" } },
      { label: "Erweiterbarkeit", values: { lightStart: "Begrenzt", starter: "Gut", business: "Sehr gut", individual: "Maximal flexibel" } },
    ],
    comparisonCtas: { lightStart: "Anfragen", starter: "Anfragen", business: "Besprechen", individual: "Projekt planen" },
    transparencyTitle: "Transparent von Anfang an.",
    transparencyText:
      "Damit Preise fair bleiben, werden Leistungen klar getrennt. So bezahlen Sie nur das, was Ihr Projekt wirklich braucht.",
    transparencyListTitle: "Nicht automatisch enthalten",
    transparencyList: [
      "Hosting- und Domainkosten",
      "Externe Lizenzen oder Premium-Plugins",
      "Professionelle Fotos oder Videos",
      "Umfangreiche Texterstellung",
      "Laufende Wartung",
      "Zusätzliche Sprachversionen",
      "Komplexe Integrationen",
      "Online-Shop-Funktionen",
      "Rechtliche Prüfung von Impressum / Datenschutz",
    ],
    transparencyNote: "Diese Leistungen können bei Bedarf ergänzt oder separat angeboten werden.",
    trustTitle: "Warum keine festen Endpreise für jedes Projekt?",
    trustText:
      "Eine Website kann einfach sein – oder ein vollständiges digitales System mit SEO-Struktur, Automatisierung, Buchung, Daten, Inhalten und Betreuung. Deshalb arbeitet SaaleWeb mit klaren Einstiegspreisen und transparenten Angeboten nach Projektumfang.",
    trustCards: [
      { title: "Klare Einstiegspakete", text: "Sie sehen sofort, ab welchem Budget ein Projekt realistisch starten kann." },
      { title: "Individuelle Erweiterungen", text: "Nur sinnvolle Funktionen werden ergänzt – nicht alles, was technisch möglich wäre." },
      { title: "Business First", text: "Die Empfehlung richtet sich nach Ihrem Ziel, nicht nach einer bestimmten Technologie." },
    ],
    linksTitle: "Sinnvolle nächste Seiten",
    linksLead: "Wenn Sie genauer planen möchten, helfen diese Seiten bei der Einordnung von Umfang, Technologie und Ziel.",
    linkLabels: {
      services: "Leistungen",
      website: "Website erstellen lassen",
      wordpress: "WordPress Website modernisieren",
      shop: "Online-Shop erstellen",
      seo: "SEO Halle",
      maintenance: "Website Wartung",
      assistant: "KI-Assistent",
      projects: "Projekte",
      industries: "Branchen",
      contact: "Kontakt",
      audit: "Website Audit",
    },
    auditTitle: "Nicht sicher, welches Paket passt?",
    auditText:
      "Wir prüfen Ihre aktuelle Situation, Ihre Website, Ihre Ziele und den sinnvollsten nächsten Schritt. Danach wissen Sie besser, ob ein WordPress-Onepager, eine React / Next.js Landingpage, eine Business Website oder eine individuelle Lösung sinnvoll ist.",
    auditCta: "Kostenlose Website-Analyse anfragen",
    auditMicrocopy: "Unverbindlich. Persönlich geprüft. Klare Empfehlung statt Verkaufsdruck.",
    faqTitle: "Häufige Fragen zu Website-Preisen",
    faq: [
      {
        q: "Was kostet eine professionelle Website in Halle?",
        a: "Bei SaaleWeb startet ein kompakter WordPress-Onepager ab 600 €, eine individuelle React-/Next.js-Landingpage ab 990 € und eine mehrseitige Business-Website ab 1.990 €. Funktionen wie Online-Buchung, Mehrsprachigkeit, Shop oder Automatisierung werden nach Umfang kalkuliert. Nach dem kostenlosen Erstgespräch erhalten Sie ein transparentes Angebot; die Preise verstehen sich zzgl. 19 % MwSt.",
      },
      {
        q: "Warum gibt es Preise „ab“ und keine festen Endpreise?",
        a: "Weil Umfang, Inhalte, Funktionen, Sprachen, SEO-Tiefe und technische Anforderungen je nach Projekt unterschiedlich sind. Nach einem kurzen Erstgespräch erhalten Sie ein transparentes Angebot.",
      },
      {
        q: "Was ist der Unterschied zwischen „Leichter Start“ und „Starter Landingpage“?",
        a: "„Leichter Start“ ist ein kompakter WordPress-Onepager für den schnellen Einstieg. Die „Starter Landingpage“ wird individueller auf React / Next.js-Basis umgesetzt und bietet mehr Möglichkeiten für Performance, Gestaltung und Erweiterbarkeit.",
      },
      {
        q: "Ist WordPress schlechter als React / Next.js?",
        a: "Nein. WordPress kann für einfache oder pflegeleichte Projekte sehr sinnvoll sein. React / Next.js ist stärker, wenn Performance, individuelle Gestaltung, Skalierbarkeit oder komplexere Funktionen wichtig sind.",
      },
      {
        q: "Was bedeutet Basis-SEO?",
        a: "Basis-SEO umfasst technische und inhaltliche Grundlagen wie Meta-Daten, Überschriftenstruktur, mobile Darstellung, Ladezeit, klare Inhalte und Indexierbarkeit.",
      },
      {
        q: "Was bedeutet GEO oder AIO?",
        a: "GEO und AIO beschreiben eine strukturierte Inhaltsoptimierung für moderne Suchsysteme und KI-Antworten. Ziel ist, Inhalte klar, verständlich und thematisch gut einordenbar zu machen.",
      },
      {
        q: "Kann später aus einem WordPress-Onepager eine größere Website werden?",
        a: "Ja, je nach Aufbau kann eine WordPress-Seite erweitert werden. Wenn später mehr Performance, individuelle Funktionen oder komplexere Struktur benötigt werden, kann auch ein Relaunch sinnvoll sein.",
      },
      {
        q: "Sind Texte im Preis enthalten?",
        a: "Grundlegende Struktur und einfache Textanpassungen sind je nach Paket enthalten. Umfangreiche Texterstellung, SEO-Texte oder mehrsprachige Inhalte werden separat kalkuliert.",
      },
      {
        q: "Sind Wartung und Betreuung enthalten?",
        a: "Laufende Wartung ist nicht automatisch enthalten, kann aber als monatliche Betreuung ergänzt werden.",
      },
      {
        q: "Kann ich meine bestehende Website modernisieren lassen?",
        a: "Ja. SaaleWeb analysiert bestehende Websites und empfiehlt, ob Optimierung, WordPress-Modernisierung oder ein kompletter Relaunch sinnvoller ist.",
      },
      {
        q: "Wie starte ich am besten?",
        a: "Am einfachsten über ein kostenloses Erstgespräch oder eine Website-Analyse. Danach erhalten Sie eine klare Empfehlung für den nächsten sinnvollen Schritt.",
      },
    ],
  },
  en: {
    metaTitle: "Pricing for Websites, SEO & Digital Solutions | SaaleWeb",
    metaDescription:
      "Transparent starting prices for WordPress one-page websites, React/Next.js landing pages, business websites, SEO, maintenance and digital solutions by SaaleWeb.",
    eyebrow: "Pricing",
    title: "Pricing for websites and digital solutions that fit your goal.",
    lead: [
      "Every business starts from a different point. Some first need a simple professional online presence. Others need a high-performance website, SEO structure, booking systems, automation or custom functions.",
      "That is why SaaleWeb offers transparent starting packages and only expands a project where it truly makes sense for your business.",
    ],
    primaryCta: "Free first consultation",
    secondaryCta: "Request website audit",
    trustLine: "Non-binding. Understandable. Focused on your business.",
    pricingNote:
      "All prices are starting prices and depend on scope, content, functions and desired support. Prices plus 19% VAT where applicable.",
    packagesTitle: "Four clear paths to the right digital system",
    packagesLead:
      "From a fast WordPress start to a custom solution: technology follows the goal, not the other way around.",
    packageCopies: {
      lightStart: {
        name: "Easy Start",
        badge: "WordPress one-pager",
        subtitle: "A fast professional start for small businesses and self-employed providers.",
        technology: "WordPress",
        bestFor: "Small businesses, self-employed professionals and local providers that want to appear credible online quickly.",
        description:
          "A compact professional one-page website based on WordPress. Ideal when you first need a clear online presence without immediately building a larger custom system.",
        includedTitle: "Included",
        included: [
          "1 professional one-page website",
          "WordPress foundation",
          "Responsive design",
          "Homepage with clear structure",
          "Services / offer",
          "Contact section",
          "Contact form",
          "Basic SEO",
          "Basic GEO / AIO structure",
          "Technical basic settings",
          "Privacy and legal links",
          "Short handover for easy editing",
        ],
        seoTitle: "Basic SEO / GEO / AIO in simple terms",
        seoText:
          "The page is prepared technically and structurally so Google and modern AI systems can classify your business more clearly. This includes clear headings, understandable service descriptions, local signals, metadata and clean page structure.",
        notIncludedTitle: "Not included by default",
        notIncluded: [
          "Custom design system",
          "Multilingual versions",
          "Online shop",
          "Booking system",
          "Complex automation",
          "Extensive copywriting",
          "Ongoing support",
        ],
        cta: "Request Easy Start",
        note: "Ideal if you want to go online professionally and quickly.",
      },
      starter: {
        name: "Starter Landing Page",
        badge: "React / Next.js",
        subtitle: "Modern landing page for more trust, performance and inquiries.",
        technology: "React / Next.js",
        bestFor:
          "Businesses that value individual design, performance, clear user guidance and a stronger technical foundation.",
        description:
          "A modern React / Next.js landing page with premium design, clear structure and a focus on visibility, trust and inquiries.",
        includedTitle: "Included",
        included: [
          "1 premium landing page",
          "6–9 professional content sections",
          "Individual layout in the SaaleWeb premium style",
          "Responsive design",
          "Clear user guidance",
          "Conversion-oriented CTA structure",
          "Basic SEO",
          "Basic GEO / AIO structure",
          "Performance optimization",
          "Technical metadata",
          "Structured headings",
          "FAQ section",
          "Contact or inquiry form",
          "Deployment support",
        ],
        seoTitle: "SEO / GEO / AIO in simple terms",
        seoText:
          "We structure content so visitors, search engines and modern AI systems can better understand who you are, what you offer and for which region or industry your services are relevant.",
        cta: "Request Starter Landing Page",
        note: "Ideal for businesses that need more than a simple web business card.",
      },
      business: {
        name: "Business Website",
        badge: "Multi-page website",
        subtitle: "Professional company website for visibility, trust and growth.",
        technology: "React / Next.js or WordPress",
        bestFor: "Businesses that want to present services, references, industries, locations or several offers professionally.",
        description:
          "A multi-page website with clear structure, professional presentation, SEO foundation and room to grow over time.",
        includedTitle: "Included",
        included: [
          "Multi-page website",
          "Individual page structure",
          "Service pages",
          "Contact and inquiry processes",
          "Basic SEO",
          "GEO / AIO foundation",
          "Local SEO basics",
          "Performance optimization",
          "FAQ sections",
          "Structured data where useful",
          "Project or reference areas",
          "Scalable content structure",
        ],
        cta: "Discuss Business Website",
      },
      individual: {
        name: "Custom System",
        badge: "Individual proposal",
        subtitle: "For online shops, portals, booking systems, automation and special functions.",
        technology: "Selected around the goal",
        bestFor: "Businesses that need more than a classic website.",
        description:
          "If your project needs special functions, data processes, booking systems, interfaces or automation, SaaleWeb develops a fitting custom solution.",
        includedTitle: "Possible modules",
        included: [
          "Concept and technical planning",
          "Custom UX and function structure",
          "Scalable technical foundation",
          "SEO and performance basics",
          "Clean interface planning",
          "Launch and handover support",
        ],
        examplesTitle: "Examples",
        examples: [
          "Online shop",
          "Booking system",
          "Customer portal",
          "API integration",
          "Data import / export",
          "AI assistant",
          "Automation",
          "WordPress plugin",
          "Custom web application",
        ],
        cta: "Discuss project",
      },
    },
    seoTitle: "What do basic SEO, GEO and AIO mean?",
    seoIntro:
      "Many terms sound technical. The business value matters more: your website should be understandable for people, search engines and modern AI systems.",
    seoCards: [
      {
        label: "SEO",
        title: "Become easier to find on Google",
        text: "We take care of clean metadata, clear headings, understandable content, fast loading times and a structure that search engines can process well.",
      },
      {
        label: "GEO",
        title: "Be understandable for modern AI search",
        text: "GEO means structuring content so AI systems can recognize relationships more clearly, such as services, industries, locations, common questions and clear answers.",
      },
      {
        label: "AIO",
        title: "Optimize content for people and AI",
        text: "AIO combines classic SEO with clear structured content. The website should not only look good, but also explain what your business offers in an understandable way.",
      },
    ],
    comparisonTitle: "Which package fits your business?",
    comparisonRows: [
      { label: "Technology", values: { lightStart: "WordPress", starter: "React / Next.js", business: "React / Next.js or WordPress", individual: "Selected around the goal" } },
      { label: "Scope", values: { lightStart: "One-pager", starter: "Landing page with 6–9 sections", business: "Multi-page website", individual: "Custom solution" } },
      { label: "Ideal for", values: { lightStart: "Fast entry", starter: "More trust and inquiries", business: "Professional company presence", individual: "Complex functions" } },
      { label: "SEO / GEO / AIO", values: { lightStart: "Basic", starter: "Basic Plus", business: "Advanced", individual: "Custom" } },
      { label: "Expandability", values: { lightStart: "Limited", starter: "Good", business: "Very good", individual: "Maximum flexibility" } },
    ],
    comparisonCtas: { lightStart: "Request", starter: "Request", business: "Discuss", individual: "Plan project" },
    transparencyTitle: "Transparent from the beginning.",
    transparencyText:
      "To keep pricing fair, services are separated clearly. You only pay for what your project really needs.",
    transparencyListTitle: "Not automatically included",
    transparencyList: [
      "Hosting and domain costs",
      "External licenses or premium plugins",
      "Professional photos or videos",
      "Extensive copywriting",
      "Ongoing maintenance",
      "Additional language versions",
      "Complex integrations",
      "Online shop functions",
      "Legal review of imprint / privacy policy",
    ],
    transparencyNote: "These services can be added or offered separately if needed.",
    trustTitle: "Why no fixed final price for every project?",
    trustText:
      "A website can be simple or become a complete digital system with SEO structure, automation, booking, data, content and support. SaaleWeb therefore works with clear starting prices and transparent proposals based on project scope.",
    trustCards: [
      { title: "Clear entry packages", text: "You see immediately from which budget a project can realistically start." },
      { title: "Individual extensions", text: "Only useful functions are added, not everything that would be technically possible." },
      { title: "Business first", text: "The recommendation follows your goal, not a specific technology." },
    ],
    linksTitle: "Useful next pages",
    linksLead: "These pages help you understand scope, technology and the right next step in more detail.",
    linkLabels: {
      services: "Services",
      website: "Website development",
      wordpress: "Modernize WordPress website",
      shop: "Online shop development",
      seo: "SEO Halle",
      maintenance: "Website maintenance",
      assistant: "AI assistant",
      projects: "Projects",
      industries: "Industries",
      contact: "Contact",
      audit: "Website audit",
    },
    auditTitle: "Not sure which package fits?",
    auditText:
      "We review your current situation, website, goals and the most sensible next step. After that you will know whether a WordPress one-pager, React / Next.js landing page, Business Website or custom solution makes sense.",
    auditCta: "Request free website analysis",
    auditMicrocopy: "Non-binding. Personally reviewed. Clear recommendation instead of sales pressure.",
    faqTitle: "Frequently asked questions about website pricing",
    faq: [
      {
        q: "How much does a professional website in Halle cost?",
        a: "At SaaleWeb, a compact WordPress one-pager starts at €600, an individual React/Next.js landing page at €990 and a multi-page business website at €1,990. Online booking, multiple languages, shops or automation are calculated according to scope. You receive a transparent proposal after the free initial call; prices exclude 19% VAT.",
      },
      {
        q: "Why are prices listed as “from” and not fixed final prices?",
        a: "Scope, content, functions, languages, SEO depth and technical requirements differ from project to project. After a short first call you receive a transparent proposal.",
      },
      {
        q: "What is the difference between Easy Start and Starter Landing Page?",
        a: "Easy Start is a compact WordPress one-pager for a fast start. Starter Landing Page is built more individually on React / Next.js and offers more room for performance, design and expandability.",
      },
      {
        q: "Is WordPress worse than React / Next.js?",
        a: "No. WordPress can be very useful for simple or easy-to-maintain projects. React / Next.js is stronger when performance, custom design, scalability or more complex functions matter.",
      },
      {
        q: "What does basic SEO mean?",
        a: "Basic SEO covers technical and content foundations such as metadata, heading structure, mobile display, loading speed, clear content and indexability.",
      },
      {
        q: "What do GEO and AIO mean?",
        a: "GEO and AIO describe structured content optimization for modern search systems and AI answers. The goal is to make content clear, understandable and easier to classify thematically.",
      },
      {
        q: "Can a WordPress one-pager become a larger website later?",
        a: "Yes, depending on the setup a WordPress site can be expanded. If more performance, custom functions or complex structure are needed later, a relaunch can also make sense.",
      },
      {
        q: "Is copywriting included in the price?",
        a: "Basic structure and simple text adjustments are included depending on the package. Extensive copywriting, SEO text or multilingual content is calculated separately.",
      },
      {
        q: "Are maintenance and support included?",
        a: "Ongoing maintenance is not automatically included, but can be added as monthly support.",
      },
      {
        q: "Can my existing website be modernized?",
        a: "Yes. SaaleWeb analyzes existing websites and recommends whether optimization, WordPress modernization or a full relaunch makes more sense.",
      },
      {
        q: "What is the best way to start?",
        a: "The easiest way is a free first consultation or a website analysis. After that you receive a clear recommendation for the next sensible step.",
      },
    ],
  },
  ru: {
    metaTitle: "Цены на сайты, SEO и цифровые решения | SaaleWeb",
    metaDescription:
      "Прозрачные стартовые цены на WordPress-лендинги, React/Next.js лендинги, бизнес-сайты, SEO, поддержку и цифровые решения от SaaleWeb.",
    eyebrow: "Цены",
    title: "Цены на сайты и digital-решения, которые подходят вашей цели.",
    lead: [
      "Каждый бизнес стартует с разной точки. Кому-то сначала нужен простой профессиональный онлайн-вид. Другим нужна быстрая сайт-структура, SEO, бронирование, автоматизация или индивидуальные функции.",
      "Поэтому SaaleWeb предлагает прозрачные стартовые пакеты и расширяет проект только там, где это действительно полезно для бизнеса.",
    ],
    primaryCta: "Бесплатная консультация",
    secondaryCta: "Проверить сайт",
    trustLine: "Без обязательств. Понятно. С фокусом на ваш бизнес.",
    pricingNote:
      "Все цены являются стартовыми и зависят от объёма, контента, функций и желаемого сопровождения. Цены указаны без 19 % НДС, если не указано иное.",
    packagesTitle: "Четыре понятных пути к подходящей digital-системе",
    packagesLead:
      "От быстрого старта на WordPress до индивидуального решения: технология следует цели, а не наоборот.",
    packageCopies: {
      lightStart: {
        name: "Лёгкий старт",
        badge: "WordPress Onepager",
        subtitle: "Быстрый профессиональный старт для малого бизнеса и самозанятых специалистов.",
        technology: "WordPress",
        bestFor: "Малый бизнес, самозанятые и локальные компании, которым нужно быстро и серьёзно появиться онлайн.",
        description:
          "Компактный профессиональный одностраничный сайт на WordPress. Подходит, если сначала нужен понятный онлайн-вид без сложной индивидуальной системы.",
        includedTitle: "Включено",
        included: [
          "1 профессиональный одностраничный сайт",
          "WordPress-база",
          "Адаптивный дизайн",
          "Главная страница с понятной структурой",
          "Услуги / предложение",
          "Контактный блок",
          "Контактная форма",
          "Базовое SEO",
          "Базовая GEO / AIO-структура",
          "Технические базовые настройки",
          "Ссылки на Impressum и Datenschutz",
          "Короткое введение для простой поддержки",
        ],
        seoTitle: "Базовое SEO / GEO / AIO простыми словами",
        seoText:
          "Страница технически и структурно готовится так, чтобы Google и современные AI-системы лучше понимали ваш бизнес. Сюда входят понятные заголовки, описания услуг, локальные сигналы, метаданные и чистая структура страницы.",
        notIncludedTitle: "Не включено автоматически",
        notIncluded: [
          "Индивидуальная дизайн-система",
          "Многоязычные версии",
          "Интернет-магазин",
          "Система бронирования",
          "Сложные автоматизации",
          "Объёмное написание текстов",
          "Постоянное сопровождение",
        ],
        cta: "Запросить лёгкий старт",
        note: "Подходит, если нужно быстро и профессионально выйти онлайн.",
      },
      starter: {
        name: "Starter Landingpage",
        badge: "React / Next.js",
        subtitle: "Современный лендинг для доверия, производительности и заявок.",
        technology: "React / Next.js",
        bestFor:
          "Компании, которым важны индивидуальная подача, скорость, понятный путь пользователя и более сильная техническая база.",
        description:
          "Современный лендинг на React / Next.js с премиальной подачей, понятной структурой и фокусом на видимость, доверие и заявки.",
        includedTitle: "Включено",
        included: [
          "1 качественный лендинг",
          "6–9 профессиональных контентных блоков",
          "Индивидуальный layout в премиальном стиле SaaleWeb",
          "Адаптивный дизайн",
          "Понятная навигация пользователя",
          "CTA-структура для конверсии",
          "Базовое SEO",
          "Базовая GEO / AIO-структура",
          "Оптимизация производительности",
          "Технические метаданные",
          "Структурированные заголовки",
          "FAQ-блок",
          "Контактная форма или форма заявки",
          "Поддержка при deployment",
        ],
        seoTitle: "SEO / GEO / AIO простыми словами",
        seoText:
          "Мы структурируем контент так, чтобы посетители, поисковые системы и современные AI-сервисы лучше понимали, кто вы, что предлагаете и для какого региона или отрасли ваши услуги релевантны.",
        cta: "Запросить Starter Landingpage",
        note: "Подходит компаниям, которым нужно больше, чем простая web-визитка.",
      },
      business: {
        name: "Business Website",
        badge: "Многостраничный сайт",
        subtitle: "Профессиональный сайт компании для видимости, доверия и роста.",
        technology: "React / Next.js или WordPress",
        bestFor: "Компании, которым нужно профессионально показать услуги, референсы, отрасли, локации или несколько предложений.",
        description:
          "Многостраничный сайт с понятной структурой, профессиональной презентацией, SEO-базой и возможностью развития.",
        includedTitle: "Включено",
        included: [
          "Многостраничный сайт",
          "Индивидуальная структура страниц",
          "Страницы услуг",
          "Контактные и заявочные сценарии",
          "Базовое SEO",
          "GEO / AIO-основа",
          "Основы Local SEO",
          "Оптимизация производительности",
          "FAQ-блоки",
          "Структурированные данные, где это уместно",
          "Проектные или референс-блоки",
          "Масштабируемая структура контента",
        ],
        cta: "Обсудить Business Website",
      },
      individual: {
        name: "Индивидуальная система",
        badge: "Индивидуальное предложение",
        subtitle: "Для магазинов, порталов, бронирования, автоматизации и специальных функций.",
        technology: "Индивидуально под цель",
        bestFor: "Компании, которым нужно больше, чем классический сайт.",
        description:
          "Если проекту нужны специальные функции, процессы данных, бронирование, интерфейсы или автоматизация, SaaleWeb разрабатывает подходящее индивидуальное решение.",
        includedTitle: "Возможные модули",
        included: [
          "Концепция и техническое планирование",
          "Индивидуальная UX- и функциональная структура",
          "Масштабируемая техническая база",
          "SEO- и performance-основа",
          "Планирование чистых интеграций",
          "Поддержка запуска и передачи",
        ],
        examplesTitle: "Примеры",
        examples: [
          "Интернет-магазин",
          "Система бронирования",
          "Клиентский портал",
          "API-интеграция",
          "Импорт / экспорт данных",
          "AI-ассистент",
          "Автоматизации",
          "WordPress-плагин",
          "Индивидуальное web-приложение",
        ],
        cta: "Обсудить проект",
      },
    },
    seoTitle: "Что означают базовое SEO, GEO и AIO?",
    seoIntro:
      "Многие термины звучат технически. Важнее польза: сайт должен быть понятен людям, поисковым системам и современным AI-сервисам.",
    seoCards: [
      {
        label: "SEO",
        title: "Лучше находиться в Google",
        text: "Мы учитываем чистые метаданные, понятные заголовки, ясный контент, быструю загрузку и структуру, которую поисковые системы могут корректно обработать.",
      },
      {
        label: "GEO",
        title: "Быть понятнее для современного AI-поиска",
        text: "GEO означает структуру контента, в которой AI-системам проще распознавать связи: услуги, отрасли, локации, частые вопросы и понятные ответы.",
      },
      {
        label: "AIO",
        title: "Оптимизировать контент для людей и AI",
        text: "AIO соединяет классическое SEO с понятным структурированным контентом. Сайт должен не только хорошо выглядеть, но и ясно объяснять, что предлагает компания.",
      },
    ],
    comparisonTitle: "Какой пакет подходит вашему бизнесу?",
    comparisonRows: [
      { label: "Технология", values: { lightStart: "WordPress", starter: "React / Next.js", business: "React / Next.js или WordPress", individual: "Индивидуально под цель" } },
      { label: "Объём", values: { lightStart: "Onepager", starter: "Лендинг с 6–9 блоками", business: "Многостраничный сайт", individual: "Индивидуальное решение" } },
      { label: "Подходит для", values: { lightStart: "Быстрый старт", starter: "Больше доверия и заявок", business: "Профессиональный сайт компании", individual: "Сложные функции" } },
      { label: "SEO / GEO / AIO", values: { lightStart: "База", starter: "База плюс", business: "Расширенно", individual: "Индивидуально" } },
      { label: "Расширяемость", values: { lightStart: "Ограниченная", starter: "Хорошая", business: "Очень хорошая", individual: "Максимально гибкая" } },
    ],
    comparisonCtas: { lightStart: "Запросить", starter: "Запросить", business: "Обсудить", individual: "Спланировать" },
    transparencyTitle: "Прозрачно с самого начала.",
    transparencyText:
      "Чтобы цены оставались справедливыми, услуги разделяются понятно. Вы платите только за то, что действительно нужно проекту.",
    transparencyListTitle: "Не включено автоматически",
    transparencyList: [
      "Хостинг и домен",
      "Внешние лицензии или premium-плагины",
      "Профессиональные фото или видео",
      "Объёмное написание текстов",
      "Постоянная поддержка",
      "Дополнительные языковые версии",
      "Сложные интеграции",
      "Функции интернет-магазина",
      "Юридическая проверка Impressum / Datenschutz",
    ],
    transparencyNote: "Эти услуги можно добавить при необходимости или предложить отдельно.",
    trustTitle: "Почему нет фиксированной финальной цены для каждого проекта?",
    trustText:
      "Сайт может быть простым, а может стать полноценной digital-системой с SEO-структурой, автоматизацией, бронированием, данными, контентом и поддержкой. Поэтому SaaleWeb работает с понятными стартовыми ценами и прозрачными предложениями по объёму проекта.",
    trustCards: [
      { title: "Понятные стартовые пакеты", text: "Сразу видно, с какого бюджета проект может реалистично стартовать." },
      { title: "Индивидуальные расширения", text: "Добавляются только полезные функции, а не всё, что технически возможно." },
      { title: "Business First", text: "Рекомендация зависит от вашей цели, а не от одной конкретной технологии." },
    ],
    linksTitle: "Полезные следующие страницы",
    linksLead: "Эти страницы помогают точнее понять объём, технологию и следующий шаг.",
    linkLabels: {
      services: "Услуги",
      website: "Разработка сайтов",
      wordpress: "Модернизация WordPress",
      shop: "Создание интернет-магазина",
      seo: "SEO Halle",
      maintenance: "Поддержка сайта",
      assistant: "AI-ассистент",
      projects: "Проекты",
      industries: "Отрасли",
      contact: "Контакты",
      audit: "Анализ сайта",
    },
    auditTitle: "Не уверены, какой пакет подходит?",
    auditText:
      "Мы проверим вашу текущую ситуацию, сайт, цели и самый разумный следующий шаг. После этого будет понятнее, подходит ли WordPress-Onepager, React / Next.js Landingpage, Business Website или индивидуальное решение.",
    auditCta: "Запросить бесплатный анализ сайта",
    auditMicrocopy: "Без обязательств. Проверяется лично. Чёткая рекомендация вместо давления продаж.",
    faqTitle: "Частые вопросы о ценах на сайты",
    faq: [
      {
        q: "Сколько стоит профессиональный сайт в Halle?",
        a: "В SaaleWeb компактный WordPress one-pager стоит от 600 €, индивидуальный лендинг на React/Next.js — от 990 €, а многостраничный бизнес-сайт — от 1 990 €. Онлайн-запись, мультиязычность, магазин и автоматизация рассчитываются по объёму. После бесплатной консультации вы получаете прозрачное предложение; цены указаны без 19 % НДС.",
      },
      {
        q: "Почему цены указаны «от», а не как фиксированная финальная сумма?",
        a: "Потому что объём, контент, функции, языки, глубина SEO и технические требования отличаются от проекта к проекту. После короткой консультации вы получаете прозрачное предложение.",
      },
      {
        q: "В чём разница между «Лёгким стартом» и Starter Landingpage?",
        a: "«Лёгкий старт» — компактный WordPress-Onepager для быстрого старта. Starter Landingpage реализуется индивидуальнее на React / Next.js и даёт больше возможностей для скорости, дизайна и расширения.",
      },
      {
        q: "WordPress хуже, чем React / Next.js?",
        a: "Нет. WordPress может быть очень разумным выбором для простых или легко поддерживаемых проектов. React / Next.js сильнее, когда важны скорость, индивидуальная подача, масштабируемость или более сложные функции.",
      },
      {
        q: "Что означает базовое SEO?",
        a: "Базовое SEO включает технические и контентные основы: метаданные, структуру заголовков, мобильную подачу, скорость загрузки, понятный контент и индексируемость.",
      },
      {
        q: "Что означают GEO и AIO?",
        a: "GEO и AIO описывают структурную оптимизацию контента для современных поисковых систем и AI-ответов. Цель — сделать контент понятным, ясным и тематически легко распознаваемым.",
      },
      {
        q: "Можно ли позже расширить WordPress-Onepager до большего сайта?",
        a: "Да, в зависимости от структуры WordPress-страницу можно расширять. Если позже понадобятся большая скорость, индивидуальные функции или сложная структура, может быть разумен релонч.",
      },
      {
        q: "Тексты входят в цену?",
        a: "Базовая структура и простые текстовые корректировки входят в зависимости от пакета. Объёмное написание текстов, SEO-тексты или многоязычный контент рассчитываются отдельно.",
      },
      {
        q: "Входит ли поддержка и обслуживание?",
        a: "Постоянная поддержка не включена автоматически, но её можно добавить как ежемесячное сопровождение.",
      },
      {
        q: "Можно модернизировать существующий сайт?",
        a: "Да. SaaleWeb анализирует существующие сайты и рекомендует, что разумнее: оптимизация, модернизация WordPress или полный релонч.",
      },
      {
        q: "Как лучше начать?",
        a: "Проще всего начать с бесплатной консультации или анализа сайта. После этого вы получите понятную рекомендацию по следующему шагу.",
      },
    ],
  },
} satisfies Record<AppLocale, PricingLandingCopy>;

const packageOrder: PackageKey[] = ["lightStart", "starter", "business", "individual"];

const serviceSlugs = {
  website: { de: "website-erstellen-lassen", en: "website-development", ru: "razrabotka-saytov" },
  wordpress: {
    de: "wordpress-website-modernisieren",
    en: "wordpress-website-modernization",
    ru: "modernizaciya-wordpress-sayta",
  },
  shop: { de: "online-shop-erstellen", en: "online-shop-development", ru: "sozdanie-internet-magazina" },
  seo: { de: "seo-halle", en: "seo-halle", ru: "seo-halle" },
  maintenance: { de: "website-wartung", en: "website-maintenance", ru: "podderzhka-saytov" },
  assistant: { de: "ki-assistent", en: "ai-assistant", ru: "ai-assistent" },
} satisfies Record<string, Record<AppLocale, string>>;

export function getPricingLandingCopy(locale: AppLocale) {
  return copy[locale];
}

export function priceToMinPrice(price: string): number | undefined {
  const match = price.match(/\d[\d\s.,]*/);
  if (!match) return undefined;
  const normalized = match[0].replace(/[^\d]/g, "");
  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

export function getPricingOfferItems(locale: AppLocale, starterPrice: string, businessPrice: string) {
  const c = copy[locale];
  const prices: Record<PackageKey, string> = {
    lightStart: locale === "en" ? "from €600" : locale === "ru" ? "от 600 €" : "ab 600 €",
    starter: starterPrice,
    business: businessPrice,
    individual: locale === "en" ? "Individual proposal" : locale === "ru" ? "Индивидуальное предложение" : "Individuelles Angebot",
  };

  return packageOrder.map((key) => ({
    name: c.packageCopies[key].name,
    description: c.packageCopies[key].description,
    price: prices[key],
    minPrice: priceToMinPrice(prices[key]),
  }));
}

function buildInternalLinks(locale: AppLocale, labels: PricingLandingCopy["linkLabels"]) {
  return [
    { label: labels.services, href: getLocalizedHref(locale, "services") },
    { label: labels.website, href: getLocalizedSlugHref(locale, "services", serviceSlugs.website[locale]) },
    { label: labels.wordpress, href: getLocalizedSlugHref(locale, "services", serviceSlugs.wordpress[locale]) },
    { label: labels.shop, href: getLocalizedSlugHref(locale, "services", serviceSlugs.shop[locale]) },
    { label: labels.seo, href: getLocalizedSlugHref(locale, "services", serviceSlugs.seo[locale]) },
    { label: labels.maintenance, href: getLocalizedSlugHref(locale, "services", serviceSlugs.maintenance[locale]) },
    { label: labels.assistant, href: getLocalizedSlugHref(locale, "services", serviceSlugs.assistant[locale]) },
    { label: labels.projects, href: getLocalizedHref(locale, "projects") },
    { label: labels.industries, href: getLocalizedHref(locale, "industries") },
    { label: labels.contact, href: getLocalizedHref(locale, "contact") },
    { label: labels.audit, href: getAuditHref(locale) },
  ];
}

export function PricingLandingPage({
  locale,
  starterPrice,
  businessPrice,
}: {
  locale: AppLocale;
  starterPrice: string;
  businessPrice: string;
}) {
  const c = copy[locale];
  const labels = uiLabels[locale];
  const contactHref = getContactHref(locale);
  const auditHref = getAuditHref(locale);
  const prices: Record<PackageKey, string> = {
    lightStart: locale === "en" ? "from €600" : locale === "ru" ? "от 600 €" : "ab 600 €",
    starter: starterPrice,
    business: businessPrice,
    individual: locale === "en" ? "Individual proposal" : locale === "ru" ? "Индивидуальное предложение" : "Individuelles Angebot",
  };
  const links = buildInternalLinks(locale, c.linkLabels);
  const directAnswer = c.faq[0];
  const remainingFaq = directAnswer ? c.faq.slice(1) : c.faq;

  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-8 md:pb-20 md:pt-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,79,163,0.10),transparent_34%),radial-gradient(circle_at_86%_0%,rgba(139,92,246,0.14),transparent_32%),linear-gradient(180deg,#fff_0%,#f7f8fb_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(17,24,39,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,24,39,0.045)_1px,transparent_1px)] bg-[size:56px_56px] opacity-60 [mask-image:radial-gradient(ellipse_82%_58%_at_50%_0%,#000_22%,transparent_76%)]" />
        </div>

        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="hero-stagger">
              <span className="eyebrow">{c.eyebrow}</span>
              <h1 className="mt-4 max-w-4xl text-[clamp(34px,5.2vw,64px)] font-extrabold leading-[1.04] tracking-tight text-dark">
                {c.title}
              </h1>
              <div className="mt-6 grid max-w-2xl gap-4 text-[clamp(17px,1.8vw,20px)] leading-relaxed text-muted">
                {c.lead.map((paragraph) => (
                  <p key={paragraph}>
                    <BrandText text={paragraph} />
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={contactHref}>{c.primaryCta}</Button>
                <Button href={auditHref} variant="ghost">
                  {c.secondaryCta}
                </Button>
              </div>
              <p className="mt-5 text-[14px] font-semibold text-ink">
                <BrandText text={c.trustLine} />
              </p>
            </div>

            <Reveal direction="zoom" delay={80}>
              <div className="relative overflow-hidden rounded-[30px] border border-white bg-white/[0.90] p-5 shadow-[0_34px_100px_-62px_rgba(139,92,246,0.75)] backdrop-blur md:p-6">
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,79,163,0.14),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.16),transparent_36%)]" />
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-line" />
                      <span className="h-2.5 w-2.5 rounded-full bg-line" />
                      <span className="h-2.5 w-2.5 rounded-full bg-line" />
                    </div>
                    <span className="rounded-full border border-line bg-white px-3 py-1.5 font-mono text-xs text-muted">
                      saaleweb.de/preise
                    </span>
                  </div>

                  <div className="rounded-[24px] border border-line bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
                        <Compass size={23} aria-hidden />
                      </span>
                      <div>
                        <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-brand-purple">
                          {labels.businessFirst}
                        </p>
                        <p className="mt-1 text-[18px] font-extrabold text-dark">{labels.principle}</p>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-3">
                      {packageOrder.map((key) => {
                        const isQuotePrice = key === "individual" || !/\d/.test(prices[key]);

                        return (
                          <div
                            key={key}
                            className={cn(
                              "grid min-w-0 gap-2 rounded-2xl bg-surface px-4 py-3",
                              isQuotePrice
                                ? "grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                                : "grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
                            )}
                          >
                            <div className="min-w-0">
                              <p className="text-[13px] font-extrabold text-dark">{c.packageCopies[key].name}</p>
                              <p className="text-[12px] font-semibold text-muted">{c.packageCopies[key].technology}</p>
                            </div>
                            <p
                              className={cn(
                                "min-w-0 font-extrabold text-brand-purple",
                                isQuotePrice
                                  ? "w-fit max-w-full rounded-full bg-white px-3 py-1.5 text-left text-[12px] leading-tight shadow-sm ring-1 ring-brand-purple/10 [overflow-wrap:anywhere] [text-wrap:balance] sm:max-w-[160px] sm:text-right"
                                  : "shrink-0 text-right text-[14px]",
                              )}
                            >
                              {prices[key]}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Keep the principal price answer visible in HTML before the detailed package comparison. */}
      {directAnswer ? (
        <section className="border-y border-line bg-white py-10 md:py-14" aria-labelledby="pricing-direct-answer-title">
          <Container>
            <Reveal>
              <div className="grid gap-7 rounded-[26px] border border-line bg-surface/70 p-6 shadow-sm md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <span className="eyebrow">{c.eyebrow}</span>
                  <h2
                    id="pricing-direct-answer-title"
                    className="mt-4 text-[clamp(25px,3.2vw,38px)] font-extrabold leading-tight tracking-tight text-dark"
                  >
                    {directAnswer.q}
                  </h2>
                  <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-muted">
                    <BrandText text={directAnswer.a} />
                  </p>
                  <a
                    href="#pricing-packages"
                    className="group mt-5 inline-flex items-center gap-2 text-[14px] font-bold text-brand-purple underline-offset-4 hover:underline"
                  >
                    {c.packagesTitle}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </a>
                </div>

                <dl className="grid gap-3 sm:grid-cols-2">
                  {packageOrder.map((key) => (
                    <div key={key} className="min-w-0 rounded-2xl border border-line bg-white p-4">
                      <dt className="text-[13px] font-extrabold leading-snug text-dark">{c.packageCopies[key].name}</dt>
                      <dd className="mt-2 break-words text-[15px] font-extrabold leading-tight text-brand-purple">
                        {prices[key]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </Container>
        </section>
      ) : null}

      <section id="pricing-packages" className="py-16 md:py-24">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <span className="eyebrow">{c.eyebrow}</span>
            <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
              {c.packagesTitle}
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">
              <BrandText text={c.packagesLead} />
            </p>
          </Reveal>

          <div className="relative left-1/2 grid w-[min(1500px,calc(100vw-2rem))] -translate-x-1/2 items-stretch gap-5 sm:w-[min(1500px,calc(100vw-3rem))] md:grid-cols-2 xl:grid-cols-4">
            {packageOrder.map((key, index) => (
              <PricingPackageCard
                key={key}
                packageKey={key}
                pkg={c.packageCopies[key]}
                price={prices[key]}
                featured={key === "starter"}
                contactHref={contactHref}
                delay={index * 70}
              />
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-3xl rounded-2xl border border-line bg-surface px-5 py-4 text-center text-[13.5px] font-semibold leading-relaxed text-muted">
            <BrandText text={c.pricingNote} />
          </p>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <span className="eyebrow">SEO / GEO / AIO</span>
            <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
              {c.seoTitle}
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">
              <BrandText text={c.seoIntro} />
            </p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {c.seoCards.map((card, index) => (
              <Reveal key={card.label} delay={index * 70} className="h-full">
                <article className="h-full rounded-[22px] border border-line bg-white p-6 shadow-sm">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-purple">
                    {index === 0 ? <Gauge size={21} aria-hidden /> : index === 1 ? <Sparkles size={21} aria-hidden /> : <FileText size={21} aria-hidden />}
                  </div>
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-purple">{card.label}</p>
                  <h3 className="mt-2 text-[18px] font-extrabold text-dark">{card.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
                    <BrandText text={card.text} />
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <span className="eyebrow">{labels.comparison}</span>
            <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
              {c.comparisonTitle}
            </h2>
          </Reveal>
          <ComparisonSection copy={c} labels={labels} prices={prices} contactHref={contactHref} />
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal>
              <div className="h-full rounded-[26px] border border-line bg-white p-6 shadow-card md:p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
                  <ShieldCheck size={22} aria-hidden />
                </span>
                <h2 className="mt-5 text-[clamp(26px,3.4vw,40px)] font-extrabold tracking-tight text-dark">
                  {c.transparencyTitle}
                </h2>
                <p className="mt-4 text-[16px] leading-relaxed text-muted">
                  <BrandText text={c.transparencyText} />
                </p>
                <p className="mt-5 rounded-2xl bg-surface p-4 text-[14.5px] font-semibold leading-relaxed text-ink">
                  <BrandText text={c.transparencyNote} />
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="h-full rounded-[26px] border border-line bg-white p-6 shadow-card md:p-8">
                <h3 className="text-[20px] font-extrabold text-dark">{c.transparencyListTitle}</h3>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {c.transparencyList.map((item) => (
                    <li key={item} className="flex gap-3 text-[14.5px] leading-relaxed text-muted">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-pink" />
                      <BrandText text={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <span className="eyebrow">{labels.transparency}</span>
            <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
              {c.trustTitle}
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">
              <BrandText text={c.trustText} />
            </p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {c.trustCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 70} className="h-full">
                <article className="card-border-glow h-full rounded-[22px] border border-line bg-white p-6 shadow-sm">
                  <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-purple">
                    <Check size={21} aria-hidden />
                  </span>
                  <h3 className="text-[18px] font-extrabold text-dark">{card.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
                    <BrandText text={card.text} />
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <Reveal className="mb-9 max-w-3xl">
            <span className="eyebrow">{labels.links}</span>
            <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
              {c.linksTitle}
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">
              <BrandText text={c.linksLead} />
            </p>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {links.map((link, index) => (
              <Reveal key={link.href} delay={(index % 4) * 45}>
                <a
                  href={link.href}
                  className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 py-3.5 text-[14px] font-extrabold text-dark transition-all hover:-translate-y-0.5 hover:border-brand-purple/20 hover:text-brand-purple hover:shadow-sm"
                >
                  <span>{link.label}</span>
                  <LinkIcon size={15} className="shrink-0 text-brand-purple" aria-hidden />
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] border border-line bg-white p-6 shadow-[0_34px_100px_-68px_rgba(139,92,246,0.7)] md:p-9">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,79,163,0.13),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.13),transparent_36%)]" />
              <div className="relative grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-purple">
                    <CircleHelp size={22} aria-hidden />
                  </span>
                  <h2 className="mt-5 text-[clamp(26px,3.6vw,42px)] font-extrabold tracking-tight text-dark">
                    {c.auditTitle}
                  </h2>
                  <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">
                    <BrandText text={c.auditText} />
                  </p>
                  <p className="mt-4 text-[13.5px] font-semibold text-ink">
                    <BrandText text={c.auditMicrocopy} />
                  </p>
                </div>
                <Button href={auditHref}>{c.auditCta}</Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
              {c.faqTitle}
            </h2>
          </Reveal>
          <FaqAccordion items={remainingFaq} />
        </Container>
      </section>
    </>
  );
}

function PricingPackageCard({
  packageKey,
  pkg,
  price,
  featured,
  contactHref,
  delay,
}: {
  packageKey: PackageKey;
  pkg: PricingPackageCopy;
  price: string;
  featured: boolean;
  contactHref: string;
  delay: number;
}) {
  const isBusiness = packageKey === "business";
  const isQuotePrice = packageKey === "individual" || !/\d/.test(price);
  const priceSizeClass = isQuotePrice
    ? "text-[clamp(16px,3.7vw,19px)] leading-snug break-words [overflow-wrap:anywhere] [text-wrap:balance] hyphens-auto"
    : "text-[clamp(34px,4vw,46px)] leading-none";

  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={cn(
          "relative flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 sm:p-6",
          featured
            ? "bg-dark text-white shadow-[0_30px_90px_-62px_rgba(15,23,42,0.95)]"
            : isBusiness
              ? "border border-brand-purple/25 bg-[linear-gradient(180deg,#fff_0%,rgba(250,247,255,0.98)_48%,rgba(255,255,255,0.94)_100%)] shadow-[0_30px_100px_-72px_rgba(139,92,246,0.95)] ring-1 ring-brand-purple/10 hover:border-brand-purple/40 hover:shadow-[0_34px_110px_-70px_rgba(139,92,246,0.95)]"
              : "card-border-glow border border-line bg-white hover:shadow-[0_26px_80px_-58px_rgba(139,92,246,0.78)]",
        )}
      >
        {featured && (
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_95%_0%,rgba(255,79,163,0.26),transparent_34%),radial-gradient(circle_at_0%_100%,rgba(139,92,246,0.24),transparent_35%)]" />
        )}
        {isBusiness && !featured && (
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_0%,rgba(139,92,246,0.16),transparent_35%),radial-gradient(circle_at_0%_88%,rgba(255,79,163,0.10),transparent_32%)]" />
        )}
        <div className="relative flex h-full min-w-0 flex-col">
          <span
            className={cn(
              "inline-flex max-w-full rounded-full px-3 py-1.5 text-left text-[12px] font-extrabold uppercase leading-tight tracking-[0.14em] [overflow-wrap:anywhere]",
              featured
                ? "bg-white/[0.10] text-brand-pink ring-1 ring-white/[0.14]"
                : isBusiness
                  ? "bg-white text-brand-purple shadow-sm ring-1 ring-brand-purple/20"
                  : "bg-brand-soft text-brand-purple",
            )}
          >
            {pkg.badge}
          </span>
          <h3 className={cn("mt-5 min-w-0 break-words text-[clamp(21px,5.7vw,24px)] font-extrabold leading-tight tracking-tight lg:min-h-[58px]", isBusiness && "text-[clamp(22px,5.7vw,25px)]")}>
            {pkg.name}
          </h3>
          <p className={cn("mt-2 text-[14.5px] leading-relaxed lg:min-h-[86px]", featured ? "text-gray-300" : "text-muted")}>
            <BrandText text={pkg.subtitle} />
          </p>
          <div
            className={cn(
              "mt-5 flex w-full max-w-full min-w-0 font-extrabold tracking-tight",
              isQuotePrice
                ? "min-h-0 items-center rounded-2xl border border-brand-purple/[0.14] bg-brand-soft px-4 py-3 text-dark shadow-sm"
                : "min-h-[64px] items-end",
              priceSizeClass,
              isBusiness && !featured && "bg-brand bg-clip-text text-transparent",
            )}
          >
            <span className="block min-w-0 max-w-full">{price}</span>
          </div>
          <p className={cn("mt-3 min-h-[18px] text-[13px] font-bold", featured ? "text-brand-pink" : "text-brand-purple")}>
            {pkg.technology}
          </p>
          <div
            className={cn(
              "mt-5 rounded-2xl p-4 text-[14px] leading-relaxed",
              featured
                ? "bg-white/[0.08] text-gray-200"
                : isBusiness
                  ? "bg-white/[0.84] text-ink shadow-sm ring-1 ring-brand-purple/10"
                  : "bg-surface text-ink",
            )}
          >
            <BrandText text={pkg.bestFor} />
          </div>
          <p className={cn("mt-4 text-[14.5px] leading-relaxed", featured ? "text-gray-300" : "text-muted")}>
            <BrandText text={pkg.description} />
          </p>

          <div className="mt-6">
            <p className={cn("text-[13px] font-extrabold uppercase tracking-[0.14em]", featured ? "text-brand-pink" : "text-brand-purple")}>
              {pkg.includedTitle}
            </p>
            <ul className="mt-3 grid gap-2.5">
              {pkg.included.map((item) => (
                <li key={item} className={cn("flex gap-2.5 text-[14px] leading-relaxed", featured ? "text-gray-200" : "text-ink")}>
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" aria-hidden />
                  <BrandText text={item} />
                </li>
              ))}
            </ul>
          </div>

          {pkg.seoText && (
            <div className={cn("mt-6 rounded-2xl p-4 text-[13.5px] leading-relaxed", featured ? "bg-white/[0.08] text-gray-300" : "bg-brand-soft text-ink")}>
              <p className={cn("mb-2 font-extrabold", featured ? "text-white" : "text-dark")}>{pkg.seoTitle}</p>
              <BrandText text={pkg.seoText} />
            </div>
          )}

          {pkg.notIncluded?.length ? (
            <details className={cn("mt-5 rounded-2xl border p-4", featured ? "border-white/[0.14] text-gray-300" : "border-line text-muted")}>
              <summary className={cn("cursor-pointer text-[13.5px] font-extrabold", featured ? "text-gray-100" : "text-dark")}>
                {pkg.notIncludedTitle}
              </summary>
              <ul className="mt-3 grid gap-2 text-[13.5px] leading-relaxed">
                {pkg.notIncluded.map((item) => (
                  <li key={item}>– {item}</li>
                ))}
              </ul>
            </details>
          ) : null}

          {pkg.examples?.length ? (
            <div className="mt-5">
              <p className={cn("text-[13px] font-extrabold uppercase tracking-[0.14em]", featured ? "text-brand-pink" : "text-brand-purple")}>
                {pkg.examplesTitle}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pkg.examples.map((item) => (
                  <span key={item} className={cn("rounded-full border px-3 py-1.5 text-[12.5px] font-bold", featured ? "border-white/[0.14] bg-white/[0.08] text-gray-100" : "border-line bg-surface text-dark")}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {pkg.note && (
            <p className={cn("mt-5 text-[13.5px] font-semibold", featured ? "text-gray-300" : "text-muted")}>
              <BrandText text={pkg.note} />
            </p>
          )}

          <div className="mt-auto pt-6">
            <Button href={contactHref} variant={featured ? "primary" : isBusiness ? "dark" : "ghost"} className="w-full">
              {pkg.cta}
              <ArrowRight size={16} aria-hidden />
            </Button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ComparisonSection({
  copy,
  labels,
  prices,
  contactHref,
}: {
  copy: PricingLandingCopy;
  labels: PricingUiLabels;
  prices: Record<PackageKey, string>;
  contactHref: string;
}) {
  const priceRow: ComparisonRow = {
    label: labels.price,
    values: {
      lightStart: prices.lightStart,
      starter: prices.starter,
      business: prices.business,
      individual: prices.individual,
    },
  };
  const rows = [...copy.comparisonRows, priceRow];

  return (
    <>
      <div className="hidden overflow-hidden rounded-[24px] border border-line bg-white shadow-card lg:block">
        <div className="grid grid-cols-[1.05fr_repeat(4,1fr)] border-b border-line bg-surface">
          <div className="px-5 py-4 text-[13px] font-extrabold uppercase tracking-[0.14em] text-muted">{labels.option}</div>
          {packageOrder.map((key) => (
            <div key={key} className="px-5 py-4 text-[14px] font-extrabold text-dark">
              {copy.packageCopies[key].name}
            </div>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1.05fr_repeat(4,1fr)] border-b border-line last:border-b-0">
            <div className="bg-surface px-5 py-4 text-[13px] font-extrabold uppercase tracking-[0.14em] text-muted">
              {row.label}
            </div>
            {packageOrder.map((key) => (
              <div key={key} className="px-5 py-4 text-[14px] font-semibold leading-relaxed text-ink">
                {row.values[key]}
              </div>
            ))}
          </div>
        ))}
        <div className="grid grid-cols-[1.05fr_repeat(4,1fr)] bg-surface">
          <div className="px-5 py-4 text-[13px] font-extrabold uppercase tracking-[0.14em] text-muted">{labels.cta}</div>
          {packageOrder.map((key) => (
            <div key={key} className="px-5 py-4">
              <a href={contactHref} className="inline-flex items-center gap-1.5 text-[14px] font-extrabold text-brand-purple hover:text-brand-pink">
                {copy.comparisonCtas[key]}
                <ArrowRight size={14} aria-hidden />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:hidden">
        {packageOrder.map((key) => (
          <article key={key} className="rounded-[22px] border border-line bg-white p-5 shadow-sm">
            <h3 className="text-[19px] font-extrabold text-dark">{copy.packageCopies[key].name}</h3>
            <p className="mt-1 text-[14px] font-extrabold text-brand-purple">{prices[key]}</p>
            <div className="mt-4 grid gap-3">
              {rows.map((row) => (
                <div key={row.label} className="rounded-2xl bg-surface p-3">
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-muted">{row.label}</p>
                  <p className="mt-1 text-[14px] font-semibold text-ink">{row.values[key]}</p>
                </div>
              ))}
            </div>
            <Button href={contactHref} variant="ghost" className="mt-5 w-full">
              {copy.comparisonCtas[key]}
            </Button>
          </article>
        ))}
      </div>
    </>
  );
}
