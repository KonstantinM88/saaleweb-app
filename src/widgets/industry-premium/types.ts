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
    /** Live project URL — external, opens the real deliverable. */
    liveUrl: string;
    liveLabel: string;
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

/* ────────────────────────────────────────────────────────────────
   Delta 35 — restaurant industry.

   The restaurant's defining artifact is its menu, so the content model
   carries a real menu structure (categories, dishes, allergens, badges)
   instead of the hotel's booking/commission blocks.
   ──────────────────────────────────────────────────────────────── */

export type MenuDish = {
  name: string;
  description: string;
  price: string;
  /** Short labels such as "Vegetarisch" or "Empfehlung". */
  badges: string[];
  /** Allergen letter code as used on restaurant menus, e.g. "A, G". */
  allergens?: string;
  /**
   * Optional real photo under /public (e.g. "/images/industries/dish.webp").
   * When absent the showcase renders an annotated placeholder slot instead.
   */
  image?: string;
  imageAlt?: string;
  /**
   * Optional short WebM clip. It is loaded only after the visitor activates
   * the dish photo, so menu media does not increase the initial page payload.
   */
  video?: string;
};

export type MenuCategory = {
  name: string;
  /** Human-readable count, e.g. "9 Positionen". */
  count: string;
  note: string;
  dishes: MenuDish[];
};

export type MenuProof = {
  name: string;
  /** Live project URL — external. */
  url: string;
  /** Internal case-study path. */
  projectHref: string;
  text: string;
  stats: string[];
};

export type RestaurantLandingContent = {
  slug: string;
  metaTitle: string;
  metaDescription: string;

  eyebrow: string;
  h1: string;
  h1Accent: string;
  lead: string;
  heroPoints: string[];
  ctaPrimary: string;
  ctaSecondary: string;

  /** Hero mock-up: a single dish entry, the smallest unit of a menu. */
  heroCard: {
    badge: string;
    image: string;
    imageAlt: string;
    video: string;
    category: string;
    name: string;
    description: string;
    price: string;
    allergenLabel: string;
    allergens: string;
    badges: string[];
    footnote: string;
  };

  answer: {
    eyebrow: string;
    question: string;
    text: string;
    facts: PremiumFact[];
  };

  pdfProblem: {
    eyebrow: string;
    title: string;
    intro: string;
    problems: PremiumItem[];
    conclusion: string;
  };

  menu: {
    eyebrow: string;
    title: string;
    intro: string;
    demoLabel: string;
    categoriesLabel: string;
    allergenLabel: string;
    videoLabel: string;
    closeVideoLabel: string;
    videoUnsupported: string;
    categories: MenuCategory[];
    featuresTitle: string;
    features: PremiumItem[];
    proofTitle: string;
    proofIntro: string;
    proofs: MenuProof[];
    proofLive: string;
    proofCase: string;
  };

  reservation: {
    eyebrow: string;
    title: string;
    intro: string;
    items: PremiumItem[];
    honesty: string;
  };

  journey: {
    eyebrow: string;
    title: string;
    intro: string;
    guestLabel: string;
    siteLabel: string;
    steps: PremiumJourneyStep[];
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

  events: {
    eyebrow: string;
    title: string;
    intro: string;
    items: PremiumItem[];
  };

  legal: {
    eyebrow: string;
    title: string;
    items: PremiumItem[];
    note: string;
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
