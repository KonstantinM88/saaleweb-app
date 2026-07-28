/**
 * Delta 34 — premium industry landing template.
 *
 * The generic Phase-4 landing (see `@/widgets/seo-landing`) covers every
 * industry with the same card grid. For high-value industries we want a page
 * that speaks the industry's own language: its economics, its artifacts, its
 * customer journey. This type describes that richer content model.
 *
 * Content stays fully trilingual and hand-written per locale — no machine
 * translation of marketing copy, no invented figures. Prices follow the
 * official 600 / 990 / 1.990 EUR orientation only.
 */

export type PremiumLocale = "de" | "en" | "ru";

export type PremiumFact = { label: string; value: string };
export type PremiumItem = { title: string; text: string };
export type PremiumFaq = { q: string; a: string };
export type PremiumLink = { label: string; href: string; description: string };

export type PremiumJourneyStep = {
  /** Short phase label shown next to the ordinal, e.g. "Inspiration". */
  phase: string;
  /** What the guest is doing in this phase. */
  guest: string;
  /** What the website has to deliver in this phase. */
  site: string;
};

export type PremiumCallout = {
  /** Letter marker (A–F) that maps onto the annotated mock-up. */
  key: string;
  title: string;
  text: string;
};

export type PremiumTier = {
  name: string;
  price: string;
  /** Numeric floor for OfferCatalog structured data. */
  minPrice: number;
  forWhom: string;
  items: string[];
};

export type PremiumColumn = {
  tone: "portal" | "direct";
  title: string;
  subtitle: string;
  pros: string[];
  cons: string[];
};

export type HotelLandingContent = {
  slug: string;
  metaTitle: string;
  metaDescription: string;

  eyebrow: string;
  h1: string;
  /** Phrase inside `h1` that receives the brass underline. Must occur in h1. */
  h1Accent: string;
  lead: string;
  heroPoints: string[];
  ctaPrimary: string;
  ctaSecondary: string;

  /** Hero mock-up: a hotel booking bar, the most recognisable artifact. */
  bookingBar: {
    badge: string;
    arrival: string;
    arrivalValue: string;
    departure: string;
    departureValue: string;
    guests: string;
    guestsValue: string;
    submit: string;
    previewHint: string;
    note: string;
    rateLabel: string;
    rateValue: string;
    rateHint: string;
  };

  /** GEO/AIO answer block: one quotable paragraph plus machine-readable facts. */
  answer: {
    eyebrow: string;
    question: string;
    text: string;
    facts: PremiumFact[];
  };

  channels: {
    eyebrow: string;
    title: string;
    intro: string;
    columns: PremiumColumn[];
    conclusion: string;
    prosLabel: string;
    consLabel: string;
  };

  calculator: {
    eyebrow: string;
    title: string;
    intro: string;
    rateLabel: string;
    bookingsLabel: string;
    commissionLabel: string;
    shiftLabel: string;
    perMonth: string;
    perYear: string;
    calculationLabel: string;
    commissionResult: string;
    commissionHint: string;
    shiftResult: string;
    shiftHint: string;
    disclaimer: string;
    cta: string;
  };

  journey: {
    eyebrow: string;
    title: string;
    intro: string;
    guestLabel: string;
    siteLabel: string;
    steps: PremiumJourneyStep[];
  };

  roomPage: {
    eyebrow: string;
    title: string;
    intro: string;
    mock: {
      category: string;
      name: string;
      size: string;
      occupancy: string;
      imageAlt: string;
      price: string;
      priceNote: string;
      amenities: string[];
      cta: string;
      cancellation: string;
      perk: string;
    };
    callouts: PremiumCallout[];
  };

  build: {
    eyebrow: string;
    title: string;
    intro: string;
    items: PremiumItem[];
  };

  visibility: {
    eyebrow: string;
    title: string;
    intro: string;
    promptsLabel: string;
    prompts: string[];
    promptsNote: string;
    signals: PremiumItem[];
  };

  tech: {
    eyebrow: string;
    title: string;
    intro: string;
    items: PremiumItem[];
    honesty: string;
    stack: string[];
  };

  legal: {
    eyebrow: string;
    title: string;
    items: PremiumItem[];
    note: string;
  };

  reference: {
    eyebrow: string;
    title: string;
    text: string;
    bullets: string[];
    linkLabel: string;
    linkHref: string;
  };

  packages: {
    eyebrow: string;
    title: string;
    intro: string;
    tiers: PremiumTier[];
    note: string;
    catalogName: string;
  };

  faq: {
    eyebrow: string;
    title: string;
    items: PremiumFaq[];
  };

  related: {
    eyebrow: string;
    title: string;
    links: PremiumLink[];
  };

  final: {
    title: string;
    text: string;
    primary: string;
    secondary: string;
    assurance: string;
  };
};
