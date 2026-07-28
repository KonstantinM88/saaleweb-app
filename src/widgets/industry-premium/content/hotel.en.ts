import type { HotelLandingContent } from "../types";

export const hotelEn: HotelLandingContent = {
  slug: "hotel-website",
  metaTitle: "Hotel website development — more direct bookings",
  metaDescription:
    "Hotel website built around direct bookings: individual room pages, your existing booking engine connected, Local SEO for Halle, Leipzig and Saalekreis, multilingual content and structured data for Google and AI search.",

  eyebrow: "Industry solution · Hospitality",
  h1: "A hotel website that leads guests to a direct booking",
  h1Accent: "direct booking",
  lead:
    "Portals bring reach — and take commission. A hotel website by SaaleWeb makes the direct path visible, fast and trustworthy: individual room pages, your booking engine connected, honest prices, real reviews and content that Google and AI systems can interpret correctly.",
  heroPoints: [
    "Your existing booking engine is connected, not replaced",
    "Visible in Halle, Leipzig, Merseburg and the Saalekreis district",
    "German, English and Russian for trade-fair and business guests",
  ],
  ctaPrimary: "Free first consultation",
  ctaSecondary: "Have your current site reviewed",

  bookingBar: {
    badge: "Your own website",
    arrival: "Check-in",
    arrivalValue: "Fri, 12 June",
    departure: "Check-out",
    departureValue: "Sun, 14 June",
    guests: "Guests",
    guestsValue: "2 adults",
    submit: "Check availability",
    previewHint: "Interactive booking example · new tab",
    note: "Booked directly: no portal commission, guest data stays with you.",
    rateLabel: "Comfort double room",
    rateValue: "from €118",
    rateHint: "Illustrative layout — rates and categories come from your own system.",
  },

  answer: {
    eyebrow: "In brief",
    question: "Who builds hotel websites focused on direct bookings?",
    text:
      "SaaleWeb is a digital studio based in Halle (Saale) building websites for hotels, guesthouses, country hotels and conference houses. The focus is the direct booking path: individual room and package pages, integration of the existing booking engine, mobile speed, local visibility and structured data so Google and AI answer systems understand the property, its location, amenities and offers correctly. Portals are not abandoned — they are balanced by a strong channel of your own.",
    facts: [
      { label: "Provider", value: "SaaleWeb — digital studio and web agency based in Halle (Saale)" },
      { label: "Focus", value: "Direct bookings · room pages · Local SEO · GEO/AIO" },
      { label: "Region", value: "Halle, Leipzig, Merseburg, Saalekreis — projects across Germany" },
      { label: "Languages", value: "German, English, Russian — more on request" },
      { label: "Entry level", value: "Landing page from €990, multi-page hotel website from €1,990 plus VAT" },
      { label: "Next step", value: "Free initial consultation or a review of your current website" },
    ],
  },

  channels: {
    eyebrow: "Channel strategy",
    title: "Portal or direct booking? Both — with a better ratio",
    intro:
      "For many properties, booking portals are the most important first contact. They deliver reach among guests who do not know your house yet. The price is commission, very little guest data and a comparison environment where your property sits next to twenty others. Your own website is the channel where you set the rules. The goal is therefore rarely to abandon portals, but to win a larger share of direct bookings.",
    prosLabel: "Strengths",
    consLabel: "Costs & limits",
    columns: [
      {
        tone: "portal",
        title: "Booking portals",
        subtitle: "Reach on someone else's ground",
        pros: [
          "Visibility among guests who have never heard of your property",
          "Borrowed trust from well-known platform brands",
          "International reach without your own advertising budget",
        ],
        cons: [
          "Commission on every booking, double-digit depending on model and contract",
          "Guest data and communication stay with the platform",
          "Direct price comparison with properties in your own neighbourhood",
          "Your house is sorted by platform criteria, not by your arguments",
        ],
      },
      {
        tone: "direct",
        title: "Your own website",
        subtitle: "The channel you control",
        pros: [
          "No commission to third parties — the margin stays in the house",
          "Guest data for confirmation, follow-up and returning-guest care",
          "Your own packages, weekend offers, conference and group rates",
          "Your story, your images, your order of arguments",
        ],
        cons: [
          "Visibility has to be built: Local SEO, business profile, content",
          "Trust only grows with real photos, real reviews and clear conditions",
          "The booking path must be integrated cleanly and work on mobile",
        ],
      },
    ],
    conclusion:
      "A realistic goal is not zero commission but a shift: guests who already found you through a portal, Google Maps or a recommendation should find the better, faster and clearer booking path on your own website.",
  },

  calculator: {
    eyebrow: "Worked example",
    title: "What does your portal share cost per year?",
    intro:
      "The calculation below is deliberately simple and uses your own numbers. It does not replace a proper business case and promises no outcome — it only shows the order of magnitude involved in shifting bookings towards the direct channel.",
    rateLabel: "Average accommodation revenue per booking",
    bookingsLabel: "Portal bookings per month",
    commissionLabel: "Commission rate",
    shiftLabel: "Share of portal bookings that would move to direct booking",
    perMonth: "per month",
    perYear: "per year",
    calculationLabel: "Calculation",
    commissionResult: "Commission volume",
    commissionHint: "Amount paid to portals per year under these assumptions.",
    shiftResult: "Potential portal commission avoided",
    shiftHint:
      "Gross portal commission that would mathematically no longer be paid to the portal at this shift.",
    disclaimer:
      "Simplified example, no warranty. Your actual conditions are defined in your portal contract; commission rates, cancellation rates, payment fees and marketing costs differ per property. Nobody can guarantee a specific shift in your booking mix.",
    cta: "Discuss these numbers with us",
  },

  journey: {
    eyebrow: "Guest journey",
    title: "From the first search result to a confirmed booking",
    intro:
      "Guests rarely decide on a single page. They search, compare, check whether they can trust you, book and — at best — come back. Each phase makes a different demand on your website, so we build it in that order.",
    guestLabel: "The guest",
    siteLabel: "Your website must",
    steps: [
      {
        phase: "Search",
        guest: "Searches Google or Maps, or asks an AI system for a place to stay in Halle, Leipzig or near the exhibition grounds.",
        site: "be findable: a maintained Google Business Profile, clear location content and structured data about the property, its location and amenities.",
      },
      {
        phase: "Compare",
        guest: "Opens several tabs — portal, your website, reviews — and compares rooms, rates, location and breakfast.",
        site: "show within seconds which room categories exist, what they cost and what is included — no PDF, no detours.",
      },
      {
        phase: "Trust",
        guest: "Checks whether the property looks real, well kept and reliable: photos, reviews, contact details, cancellation terms.",
        site: "deliver real images, visible reviews, a named contact, a one-tap phone number and transparent conditions.",
      },
      {
        phase: "Book",
        guest: "Wants to book in a few steps on a phone — usually in the evening, often on the move, rarely at a desktop.",
        site: "lead straight into your booking engine with the dates pre-filled, without loading gaps or broken forms.",
      },
      {
        phase: "Return",
        guest: "Remembers the property, recommends it or books the next trip again.",
        site: "keep the relationship alive: confirmation, optional newsletter, packages and offers for returning guests.",
      },
    ],
  },

  roomPage: {
    eyebrow: "Anatomy",
    title: "A room page that answers questions before they are asked",
    intro:
      "Many hotel websites show rooms only as an image slider on one collective page. That leaves every category without its own indexable address — and leaves guests without the details they actually decide on. We build one page per category with this structure:",
    mock: {
      category: "Room category",
      name: "Comfort double room",
      size: "24 m²",
      occupancy: "up to 2 guests + extra bed",
      imageAlt: "Bright double room with two beds and large windows",
      price: "from €118",
      priceNote: "per night, incl. VAT, plus local levies where applicable",
      amenities: ["Breakfast available", "Free Wi-Fi", "On-site parking", "Air conditioning", "Step-free access"],
      cta: "Check dates & book",
      cancellation: "Free cancellation until 6 pm on the day of arrival",
      perk: "Direct booker benefit: late check-out subject to availability",
    },
    callouts: [
      {
        key: "A",
        title: "Category, size, occupancy",
        text: "Square metres, maximum occupancy and bed configuration sit at the top — the details families and business travellers filter by first.",
      },
      {
        key: "B",
        title: "Real photos, not stock",
        text: "Images of the actual room, properly compressed and with descriptive alt text. Stock imagery costs trust exactly where trust is being formed.",
      },
      {
        key: "C",
        title: "A price with honest small print",
        text: "From-rate, VAT note and local levies, breakfast as an option. Prices shown to consumers have to make the final amount recognisable.",
      },
      {
        key: "D",
        title: "Machine-readable amenities",
        text: "Amenities as a structured list — readable for guests and usable for Google and AI systems answering a query like “hotel with parking”.",
      },
      {
        key: "E",
        title: "Booking CTA with context",
        text: "The button passes category and selected dates to your booking engine. On a phone it stays reachable while scrolling.",
      },
      {
        key: "F",
        title: "Conditions and direct-booker benefit",
        text: "Cancellation rules plus one concrete reason why booking here beats the portal — both at the decision point, not buried in the footer.",
      },
    ],
  },

  build: {
    eyebrow: "Scope",
    title: "What we actually build for hotels",
    intro:
      "Not every property needs everything. Scope is defined in the first consultation based on room count, target guests, existing systems and how much you want to maintain yourself.",
    items: [
      {
        title: "Room and category pages",
        text: "One URL per category with size, occupancy, amenities, images, from-rate and its own booking call to action — indexable and individually linkable.",
      },
      {
        title: "Booking engine integration",
        text: "Your existing engine is connected: as a deep link with pre-filled dates, as an embedded widget, or as a structured inquiry form if no engine is in use.",
      },
      {
        title: "Packages and offers",
        text: "Weekend packages, spa and wellness offers, trade-fair and conference rates, holiday arrangements — as maintainable pages that can rank on their own.",
      },
      {
        title: "Direct booker benefits",
        text: "One visible, concrete reason to book direct: an upgrade subject to availability, late check-out, parking or a welcome drink — aligned with your portal contracts.",
      },
      {
        title: "Multilingual content",
        text: "German, English and Russian as a base — relevant for trade-fair guests from Leipzig, industrial clients around Leuna and Schkopau and international travellers.",
      },
      {
        title: "Speed on a phone",
        text: "Most hotel research happens on mobile in the evening. Images, fonts and scripts are delivered so the page stays usable even on a weak connection.",
      },
      {
        title: "Reviews and trust",
        text: "Real reviews from your Google Business Profile, awards, a contact person with a face and a name. No invented voices, no purchased stars.",
      },
      {
        title: "Local SEO and Google Business Profile",
        text: "Consistent contact data, maintained attributes, photos, questions and answers, connected with location content for Halle, Leipzig, Merseburg and the Saalekreis.",
      },
      {
        title: "Structured data for hotels",
        text: "LodgingBusiness, room categories, amenity features, opening and check-in times plus FAQ as JSON-LD — the basis for systems being able to quote your property correctly.",
      },
      {
        title: "Group, corporate and conference inquiries",
        text: "A dedicated form covering dates, number of rooms, catering and technical requirements — so inquiries arrive complete instead of over five emails.",
      },
      {
        title: "Restaurant, spa and events",
        text: "If the property is more than rooms, those areas get their own pages and their own search terms instead of a mention in a paragraph.",
      },
      {
        title: "Maintenance without an agency appointment",
        text: "Rates, packages, images and text can be updated by your team. On request we take over ongoing maintenance as part of a support agreement.",
      },
    ],
  },

  visibility: {
    eyebrow: "SEO · GEO · AIO",
    title: "Found on Google — and quotable for AI answers",
    intro:
      "Guests no longer search with keywords alone. They ask full questions — in Google, in Maps and increasingly in ChatGPT, Gemini, Claude or Perplexity. Those systems can only name a property when the facts are unambiguous, current and machine-readable on a page they are allowed to reach.",
    promptsLabel: "Typical questions your website should answer",
    prompts: [
      "Hotel in Halle (Saale) with parking and breakfast",
      "Where to stay during the Handel Festival in Halle",
      "Conference hotel near Leuna and Merseburg",
      "Hotel between Halle and the Leipzig exhibition grounds",
      "Family room in the Saalekreis with free cancellation",
      "Which hotel in Halle accepts dogs?",
    ],
    promptsNote:
      "None of these needs a separate doorway page. Each needs a clear answer in the right place: on the room page, in the FAQ, in the amenity data or on a package page.",
    signals: [
      {
        title: "An unambiguous entity",
        text: "Name, address, phone number and opening hours are identical on the website, the Google profile and the portals. Contradictions are the most common reason systems treat a property cautiously.",
      },
      {
        title: "Answers instead of ad copy",
        text: "Short, direct paragraphs on check-in times, parking, breakfast, pets, accessibility and cancellation — exactly the sentences that can be quoted.",
      },
      {
        title: "Structured data",
        text: "JSON-LD for the property, room categories, amenities and FAQ. That turns prose into facts a machine can evaluate.",
      },
      {
        title: "Local grounding",
        text: "Directions, distances to the main station, exhibition grounds, old town and industrial sites, plus the parking situation — information guests genuinely look for and that anchors your property regionally.",
      },
      {
        title: "Being current",
        text: "Seasonal packages, maintained rates and reviewed content. Outdated details damage AI answers more than they damage classic search results.",
      },
      {
        title: "Honest expectations",
        text: "Whether a specific system names your property is decided by that system, not by an agency. We do not sell guarantees; we build the foundations that improve the odds.",
      },
    ],
  },

  tech: {
    eyebrow: "Technology",
    title: "We connect your systems instead of replacing them",
    intro:
      "Most properties already run a property management system, a channel manager and a booking engine. That landscape has grown over the years and works in daily operations. Our job is the website in front of it — not a replacement behind it.",
    items: [
      {
        title: "Booking engine (IBE)",
        text: "Connected as a deep link with pre-filled dates and category, as an embedded widget or as a redirect — depending on what your provider supports.",
      },
      {
        title: "Channel manager and PMS",
        text: "Availability and rates stay in your system. The website points to it instead of creating a second source of truth.",
      },
      {
        title: "Payment and deposits",
        text: "Payment steps run through your booking engine or payment provider. We make sure the handover feels seamless and visibly secure.",
      },
      {
        title: "Forms as a fallback",
        text: "For groups, conferences, long stays or properties without an engine: structured inquiry forms delivered by email and optionally by messenger.",
      },
      {
        title: "Measurability",
        text: "We make visible how many visitors start the booking path, which pages produce inquiries and where traffic comes from — privacy-friendly and without unnecessary profiling.",
      },
      {
        title: "Technical basis",
        text: "For new projects we often use Next.js and React. A well-maintained WordPress can remain the right choice when maintenance effort and budget point that way.",
      },
    ],
    honesty:
      "We are not a PMS vendor and not a booking platform. If your booking engine cannot be integrated properly, we say so before quoting — and propose a realistic path instead of selling a rebuild of your entire system landscape.",
    stack: ["Next.js", "React", "WordPress", "Booking engine integration", "Structured data", "Multilingual setup"],
  },

  legal: {
    eyebrow: "Reliability",
    title: "What should be legally sound on a hotel website",
    items: [
      {
        title: "Price display",
        text: "Consumers have to be able to recognise the final price. From-rates, VAT, breakfast and local levies are presented so nothing surprises the guest during booking.",
      },
      {
        title: "Cancellation and withdrawal",
        text: "Accommodation for a specific date is generally exempt from the statutory right of withdrawal — your own cancellation terms take that role, so they belong next to the booking button.",
      },
      {
        title: "Rate parity clauses",
        text: "Whether you may offer a lower rate on your own website depends on your portal contracts. Narrow best-price clauses have been challenged in German courts, but the assessment of your specific contract belongs to your legal advisor.",
      },
      {
        title: "Data protection for booking data",
        text: "Booking and inquiry data is personal data. We document forms, recipients, storage locations and embedded services so your privacy policy reflects the actual technical reality.",
      },
      {
        title: "Imprint and reachability",
        text: "Complete provider identification, working contact paths and accessible operation are part of the basics — not a surcharge.",
      },
      {
        title: "Reviews",
        text: "We display real reviews with a traceable source. Invented testimonials and polished averages are legally risky and destroy exactly the trust they are meant to create.",
      },
    ],
    note:
      "We implement carefully on the technical and editorial side and flag open questions. That does not replace legal advice — the final review of your contracts, price presentation and privacy policy stays with your lawyer.",
  },

  reference: {
    eyebrow: "From practice",
    title: "Waldschlösschen — hotel and restaurant in one presence",
    text:
      "For Waldschlösschen we created an interactive project preview presenting hotel, restaurant and offers at a premium level, working very well on mobile and guiding guests clearly toward direct booking and contact paths.",
    bullets: [
      "Hotel and restaurant areas with their own content instead of one shared page",
      "Offers and packages visible where guests actually decide",
      "Mobile guidance with clear paths to booking and contact",
    ],
    linkLabel: "View the project",
    linkHref: "/en/projects/direct-bookings-without-portals",
    liveUrl: "https://waldschlosschen-08.vercel.app/de/hotel",
    liveLabel: "View live",
  },

  packages: {
    eyebrow: "Orientation",
    title: "Entry levels for hotel projects",
    intro:
      "The figures below are for orientation. The fixed price follows the free initial consultation and depends on room count, languages, booking integration and content scope.",
    catalogName: "Hotel website — scope of services",
    tiers: [
      {
        name: "Compact presence",
        price: "from €600",
        minPrice: 600,
        forWhom: "Guesthouse or small property with few categories",
        items: [
          "One-pager on a WordPress basis",
          "Room overview, location, contact",
          "Link to your existing booking engine",
          "Google Business Profile aligned",
        ],
      },
      {
        name: "Direct booking landing page",
        price: "from €990",
        minPrice: 990,
        forWhom: "Properties that need one strong channel for direct bookings",
        items: [
          "Individual landing page built with Next.js",
          "Booking bar and connected booking engine",
          "Two to three room categories with dedicated sections",
          "Structured data and FAQ for Google and AI search",
        ],
      },
      {
        name: "Full hotel website",
        price: "from €1,990",
        minPrice: 1990,
        forWhom: "Hotels with several categories, packages and conference business",
        items: [
          "A dedicated page per room category and package",
          "German, English and Russian",
          "Group, conference and corporate inquiries with a structured form",
          "Local SEO, GEO/AIO structure and measurability",
          "Maintainable content plus optional ongoing support",
        ],
      },
    ],
    note:
      "All figures exclude 19% German VAT. Additional scope such as photo production, copywriting in several languages, further languages or special integrations is calculated separately.",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions hoteliers ask us",
    items: [
      {
        q: "What does a hotel website cost at SaaleWeb?",
        a: "For orientation: a compact WordPress one-pager starts at €600, a direct booking landing page at €990 and a full hotel website at €1,990 — each plus 19% VAT. Multilingual content, photo production, many room categories or special integrations add scope. We name the exact fixed price after the free initial consultation.",
      },
      {
        q: "Can our existing booking engine be connected?",
        a: "In most cases yes. The usual routes are a deep link with pre-filled dates, an embedded booking widget or a clean redirect. We check what your provider supports before quoting and say so openly if a proper integration is not technically possible.",
      },
      {
        q: "How many direct bookings will a new website bring?",
        a: "Nobody can give you a credible number in advance. The outcome depends on location, price level, reviews, season, competition and your portal contracts. We build the preconditions — findability, trust, a short booking path — and make it measurable how many visitors actually start the booking process.",
      },
      {
        q: "How long does a hotel website project take?",
        a: "A landing page is often live within two to four weeks, a multi-page hotel website usually within four to eight weeks. In our experience the biggest time factor is not the technology but images, texts and approvals from the property.",
      },
      {
        q: "Can we maintain rates and packages ourselves?",
        a: "Yes. Content such as packages, images, texts and from-rates is built to be editable. Availability and daily rates stay in your booking system so no second price source appears. On request we handle maintenance as part of a support agreement.",
      },
      {
        q: "Do we really need a multilingual website?",
        a: "That depends on your guests. For properties with trade-fair, conference or industrial guests around Leipzig, Leuna and Schkopau, English usually makes sense; Russian depends on your guest mix. We check this against your actual booking history rather than a gut feeling.",
      },
      {
        q: "How does Local SEO help a hotel in Halle (Saale)?",
        a: "A large share of hotel search is location-driven: proximity to the main station, the old town, the exhibition grounds or an industrial site. We combine a fully maintained Google Business Profile, consistent contact data, real reviews, directions and parking information plus location references on the website into a solid local structure.",
      },
      {
        q: "Will our property then also be named in ChatGPT or Google AI Overview?",
        a: "The chance rises considerably when amenities, location, prices, conditions and answers to typical guest questions are unambiguous and machine-readable on your website — with FAQ sections and structured data. Whether a specific system names your property is decided by that system; no one can seriously guarantee it.",
      },
      {
        q: "May we be cheaper on our own website than on the portal?",
        a: "That depends on your contracts. Narrow best-price clauses used by booking portals have been challenged in German courts, but the situation is contract-specific. Many properties therefore work with direct-booker benefits — an upgrade, late check-out or parking — instead of undercutting on price. The legal assessment of your contract belongs to your legal advisor.",
      },
      {
        q: "How do you handle reviews?",
        a: "We embed real reviews with a recognisable source, usually from the Google Business Profile. We do not implement invented testimonials, purchased stars or filtered averages — they are legally risky and destroy exactly the trust they are meant to build.",
      },
      {
        q: "What matters for data protection with booking and inquiry data?",
        a: "Booking and inquiry data is personal data. We document which forms exist, where the data flows, which external services are embedded and where processing happens, so your privacy policy reflects the actual technical setup. The final legal review stays with you.",
      },
      {
        q: "What happens after launch?",
        a: "After going live we check loading times, mobile use, forms, indexing and the booking paths. Content, packages, landing pages and FAQ can then be expanded step by step. Ongoing support is available but never a condition — the website belongs to you.",
      },
    ],
  },

  related: {
    eyebrow: "Read on",
    title: "Pages that fit your project",
    links: [
      {
        label: "Booking systems",
        href: "/en/services/booking-systems",
        description: "How booking and inquiry paths are integrated cleanly.",
      },
      {
        label: "Local SEO",
        href: "/en/services/local-seo",
        description: "Regional visibility for guests from Halle, Leipzig and the Saalekreis.",
      },
      {
        label: "Website relaunch",
        href: "/en/services/website-relaunch",
        description: "Modernise an existing hotel website without losing SEO signals.",
      },
      {
        label: "Restaurant website",
        href: "/en/industries/restaurant-website",
        description: "For properties where kitchen and reservations play their own role.",
      },
      {
        label: "Web design in Halle (Saale)",
        href: "/en/locations/halle",
        description: "What regional visibility means for businesses on the ground.",
      },
      {
        label: "Pricing",
        href: "/en/pricing",
        description: "Entry levels, scope and how a fixed price is calculated.",
      },
    ],
  },

  final: {
    title: "Let's talk about your share of direct bookings.",
    text:
      "In the free initial consultation we look at your property, your current website, your booking engine and your portal situation. Afterwards you know which step is worth taking — even if the answer turns out to be no new project.",
    primary: "Free first consultation",
    secondary: "Have your current site reviewed",
    assurance: "No obligation, no contract commitment and an honest assessment, including when it argues against a project.",
  },
};
