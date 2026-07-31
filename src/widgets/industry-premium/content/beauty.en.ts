import type { BeautyLandingContent } from "../types";

export const beautyEn: BeautyLandingContent = {
  slug: "beauty-studio-website",
  metaTitle: "Beauty studio website with online booking",
  metaDescription:
    "Website for beauty and cosmetic studios: online appointment booking around the clock, treatment pages carrying the location in the slug, price and duration per service, Local SEO for Halle and structured data for Google and AI search.",

  eyebrow: "Industry solution · Beauty & cosmetics",
  h1: "A beauty studio website that books appointments while you work",
  h1Accent: "books appointments while you work",
  lead:
    "During a treatment you cannot pick up the phone. That is exactly when clients decide. SaaleWeb builds websites for beauty and cosmetic studios so booking works without you: service, duration, price, free slots, confirmed appointment — around the clock. Salon Elen in Halle has been working this way since its relaunch.",
  heroPoints: [
    "Online booking around the clock — including at 11 pm",
    "Price and duration visible per treatment, before anyone asks",
    "Reference from Halle: Salon Elen with 43 services and its own booking flow",
  ],
  ctaPrimary: "Free first consultation",
  ctaSecondary: "Have your current site reviewed",

  heroCard: {
    badge: "Appointment confirmed",
    status: "Booked online · 23:14",
    service: "Powder Brows",
    stylistLabel: "Artist",
    stylist: "Ilona",
    when: "Thu, 18 June · 14:30",
    durationLabel: "Duration",
    duration: "120 min",
    priceLabel: "Price",
    price: "€350",
    channel: "Confirmation sent by email",
    footnote: "Illustrative layout. Services, durations and prices later come from your own calendar.",
  },

  answer: {
    eyebrow: "In brief",
    question: "Who builds beauty studio websites with online appointment booking?",
    text:
      "SaaleWeb is a digital studio based in Halle (Saale) building websites for beauty studios, cosmetic studios, nail studios, permanent make-up studios and hair salons. The focus is online booking around the clock, treatment pages with price, duration and aftercare, plus local visibility. One completed studio is publicly online: Salon Elen in Halle (Saale) with 6 service categories, 43 treatments and its own booking flow.",
    facts: [
      { label: "Provider", value: "SaaleWeb — digital studio and web agency based in Halle (Saale)" },
      { label: "Focus", value: "Online booking · treatment pages · Local SEO · GEO/AIO" },
      { label: "Region", value: "Halle, Merseburg, Leipzig, Saalekreis — projects across Germany" },
      { label: "Reference", value: "Salon Elen, Halle (Saale) — permanent make-up, lashes, microneedling" },
      { label: "Entry level", value: "Landing page from €990, multi-page website from €1,990 plus VAT" },
      { label: "Next step", value: "Free initial consultation or a review of your current website" },
    ],
  },

  problem: {
    eyebrow: "The real problem",
    title: "You work with your hands — and that is exactly when the phone rings",
    intro:
      "A beauty studio has a problem a shop does not: while you work, both hands are busy and the client is lying in front of you. Every call at 2 pm goes unanswered. Every message at 11 pm waits until the next morning.",
    items: [
      {
        title: "The call during a treatment",
        text: "You cannot answer without interrupting the treatment. Someone who does not get through rarely calls twice — they call the next studio.",
      },
      {
        title: "Message ping-pong in the evening",
        text: "“How much are Powder Brows?” — “When are you free?” — “What about Tuesday?” Four messages for one appointment, every evening, for every inquiry.",
      },
      {
        title: "Price questions that could be on the page",
        text: "If price and duration are nowhere to be found, you personally become the price list for every prospect. That costs more time than the treatment itself.",
      },
      {
        title: "Instagram only, no website",
        text: "Instagram shows results but no complete price list, no opening hours, no aftercare and no reliable booking path. And the profile does not belong to you.",
      },
      {
        title: "Double bookings and gaps",
        text: "Appointments across three channels — phone, Instagram, notepad — produce overlaps and holes in the calendar nobody fills.",
      },
      {
        title: "No-shows",
        text: "Without confirmation, reminders and clear conditions, chairs stay empty. For a treatment lasting over two hours, that is an entire working block.",
      },
    ],
    conclusion:
      "A website can take over this work. Not with more advertising, but by handling price, duration, free slots and the booking itself — even while you are pigmenting.",
  },

  booking: {
    eyebrow: "Interactive",
    title: "How a client books while you are treating someone",
    intro:
      "Three steps, no message, no phone call. Click through it — this is what your client would do at 11 pm on the sofa. The content is an example, the flow is the real one.",
    demoLabel: "Example content",
    stepLabel: "Step",
    steps: ["Choose a service", "Choose an artist", "Confirm the time"],
    servicesLabel: "Which treatment?",
    services: [
      { name: "Powder Brows", duration: "120 min", price: "€350", note: "Permanent make-up, eyebrows" },
      { name: "Hairstroke Brows", duration: "180 min", price: "€450", note: "Hair-stroke technique, very natural" },
      { name: "Lash lifting", duration: "60 min", price: "€55", note: "Optionally with tinting" },
      { name: "Microneedling", duration: "50 min", price: "€85", note: "Single treatment" },
      { name: "Hydrafacial Signature", duration: "45 min", price: "€140", note: "Deep cleansing and hydration" },
    ],
    stylistsLabel: "With whom?",
    stylists: [
      { name: "Ilona", role: "Permanent make-up, microneedling", initials: "IL" },
      { name: "Elena", role: "Lashes, brows, cosmetics", initials: "EL" },
      { name: "First available artist", role: "Earliest appointment", initials: "★" },
    ],
    slotsLabel: "When?",
    slotDate: "Thursday, 18 June",
    slots: [
      { time: "09:00" },
      { time: "10:30", taken: true },
      { time: "12:00" },
      { time: "14:30" },
      { time: "16:00", taken: true },
      { time: "17:30" },
    ],
    takenLabel: "booked",
    backLabel: "Back",
    restartLabel: "Start over",
    confirmTitle: "Appointment confirmed",
    confirmBadge: "No call, no message",
    confirmFields: {
      service: "Treatment",
      stylist: "Artist",
      when: "Appointment",
      duration: "Duration",
      price: "Price",
    },
    confirmNote:
      "The client receives an email confirmation, you see the appointment in the calendar. Reminders and cancellation windows are configurable.",
    outcomeTitle: "What this changes day to day",
    outcomes: [
      "Appointments appear in the evening and at weekends without you replying",
      "Price and duration are settled before anyone writes",
      "One calendar instead of three channels — no double bookings",
      "Reminders and clear cancellation windows reduce empty chairs",
    ],
    disclaimer:
      "This is an illustration and promises no particular number of bookings. How many appointments come in online depends on awareness, range of services, region and season.",
    cta: "Discuss a booking flow for my studio",
  },

  structure: {
    eyebrow: "The structure behind it",
    title: "One page per treatment — with the location in the slug",
    intro:
      "Nobody searches for “cosmetic studio”. People search for “powder brows Halle”, “microblading Halle price” or “microneedling Halle (Saale)”. A shared services page cannot serve those searches — each main treatment needs its own address.",
    badTitle: "Commonly built",
    badNote: "One services page with a bullet list",
    badItems: [
      "All treatments on one page, as a list",
      "Prices only on request or inside a PDF",
      "No location reference in title or address",
      "Nothing anyone could link to individually",
    ],
    goodTitle: "How we build it",
    goodNote: "One page per main treatment including the location — examples from the live project",
    goodItems: [
      { slug: "powder-brows-halle", label: "Powder Brows", price: "€350" },
      { slug: "microblading-halle", label: "Microblading / hairstroke", price: "€450" },
      { slug: "lippenpigmentierung-halle", label: "Lip pigmentation", price: "from €380" },
      { slug: "wimpernkranzverdichtung-halle", label: "Lash line enhancement", price: "from €130" },
      { slug: "permanent-make-up-augenbrauen-halle", label: "PMU eyebrows", price: "from €350" },
      { slug: "permanent-make-up-lippen-halle", label: "PMU lips", price: "from €380" },
      { slug: "lidstrich-permanent-make-up-halle", label: "Permanent eyeliner", price: "from €130" },
      { slug: "microneedling-halle", label: "Microneedling", price: "by skin goal" },
    ],
    conclusion:
      "Each of these pages has its own title, description, process, price, aftercare, FAQ and a direct booking path. That is exactly how Salon Elen is structured — which is why the studio can rank for individual treatments instead of only for its name.",
  },

  card: {
    eyebrow: "Anatomy",
    title: "A service entry that answers questions before they are asked",
    intro:
      "Most studios write the name of the treatment and a price. Clients, however, ask about duration, process, longevity, aftercare and when the touch-up is due. Put that on the page and half the message flood disappears.",
    mock: {
      category: "Permanent make-up",
      name: "Powder Brows",
      duration: "120 min",
      price: "€350",
      description:
        "A soft shading technique for naturally defined eyebrows. Shape and colour are tailored individually and drawn together before the treatment starts.",
      benefitsLabel: "The result",
      benefits: ["Defined, even shape", "Soft powder effect", "Smudge and waterproof", "No daily makeup"],
      aftercareLabel: "Aftercare",
      aftercare: "Keep dry for 7 days, no tanning bed or sauna, do not remove scabs, use sun protection.",
      touchupLabel: "Touch-up",
      touchup: "Recommended after 6 to 8 weeks, bookable separately.",
      cta: "Book an appointment",
    },
    callouts: [
      {
        key: "A",
        title: "Duration and price at the top",
        text: "The two details every client asks about first. When they sit at the top, the first message disappears entirely.",
      },
      {
        key: "B",
        title: "Process instead of ad copy",
        text: "What happens in those 120 minutes? Consultation, pre-draw, treatment. Someone who knows the process books with less hesitation.",
      },
      {
        key: "C",
        title: "The result in concrete points",
        text: "Short, verifiable statements instead of superlatives. These are exactly the sentences AI systems quote later.",
      },
      {
        key: "D",
        title: "Aftercare made visible",
        text: "Aftercare determines the result. Read on the page it lands better than explained at the reception desk afterwards.",
      },
      {
        key: "E",
        title: "Touch-up and longevity",
        text: "When is the touch-up due, how long does it last, what does it cost? These three details prevent disappointment.",
      },
      {
        key: "F",
        title: "Booking right at the service",
        text: "The button passes the chosen treatment into the booking flow — not back to the homepage.",
      },
    ],
  },

  proofs: {
    eyebrow: "From practice",
    title: "Salon Elen, Halle (Saale) — publicly online",
    intro:
      "The studio works with permanent make-up, lashes, brows, microneedling, Hydrafacial and nail design. The website was built by SaaleWeb. Try the booking flow before you talk to us — it says more than any description.",
    items: [
      {
        name: "Salon Elen — permanent-halle.de",
        url: "https://permanent-halle.de/",
        projectHref: "/en/projects/online-bookings-tripled",
        text:
          "The challenge was scale: six service categories with 43 individual treatments, each with its own duration, price, aftercare and touch-up windows. On top of that, a booking flow connecting service, artist and time slot, plus eight treatment pages for local search.",
        stats: [
          "6 categories with 43 treatments, each with duration and price",
          "Online booking around the clock: service, artist, appointment",
          "8 treatment pages with the location in the slug",
          "German, English and Russian",
          "Client account for appointments and a page for artist cooperation",
        ],
        media: {
          key: "salon-elen-projects",
          primaryAlt: "Desktop view of the Salon Elen website developed by SaaleWeb",
          secondaryAlt: "Mobile view of the Salon Elen website",
          caption: "Live views of the completed Salon Elen website on desktop and smartphone.",
        },
      },
    ],
    live: "View the website",
    caseLabel: "Project in detail",
  },

  journey: {
    eyebrow: "From scrolling to appointment",
    title: "How a client actually ends up with you",
    intro:
      "Beauty decisions happen in the evening, on the sofa, on a phone. Between the first reel and a confirmed appointment there are only a few minutes — if the website plays along.",
    guestLabel: "The client",
    siteLabel: "Your website must",
    steps: [
      {
        phase: "Wish",
        guest: "Sees a result on a friend or on Instagram and wonders whether it would work for her too.",
        site: "be found: for “powder brows Halle”, in the Google Business Profile and through the link in the Instagram bio.",
      },
      {
        phase: "Research",
        guest: "Wants to know what the treatment costs, how long it takes, whether it hurts and how long it lasts.",
        site: "show price, duration, process, longevity and aftercare directly — no message, no price list as a PDF.",
      },
      {
        phase: "Trust",
        guest: "Checks results, reviews, qualifications and whether the studio looks clean and professional.",
        site: "show real before-and-after images with consent, qualifications, hygiene and a face with a name.",
      },
      {
        phase: "Book",
        guest: "Books in the evening, often after 9 pm, in a few clicks — and expects an immediate confirmation.",
        site: "complete the booking without a follow-up question: service, artist, free slot, email confirmation.",
      },
      {
        phase: "Return",
        guest: "Needs a touch-up after six weeks, a refill after three, or the next treatment.",
        site: "state touch-up windows, allow reminders and make the follow-up booking as easy as the first.",
      },
    ],
  },

  build: {
    eyebrow: "Scope",
    title: "What we actually build for beauty studios",
    intro:
      "Not every studio needs everything. Scope is defined in the first consultation based on your range of services, number of artists, booking requirements and how much you want to maintain yourself.",
    items: [
      {
        title: "Online appointment booking",
        text: "Service, artist, free slot, confirmation. On request with a deposit, reminders and a configurable cancellation window.",
      },
      {
        title: "Services with duration and price",
        text: "Every treatment with category, duration, price, description, result, aftercare and touch-up window — maintained by you.",
      },
      {
        title: "Treatment pages with the location",
        text: "One page per main treatment with its own title, FAQ and direct booking path — the basis for local visibility.",
      },
      {
        title: "Combinations and packages",
        text: "Combo appointments and treatment packages with their own duration and price, instead of two separate bookings back to back.",
      },
      {
        title: "Several artists",
        text: "Their own profiles, services and hours. Clients can choose deliberately or take the first available artist.",
      },
      {
        title: "Before-and-after gallery",
        text: "Sorted by treatment instead of one mixed collection — with documented client consent.",
      },
      {
        title: "Instagram connected properly",
        text: "The link in the bio does not lead to the homepage but to where booking happens. Instagram stays the shop window, the website becomes the till.",
      },
      {
        title: "Client account",
        text: "View, move or repeat your own appointments — saves messages and makes follow-up bookings more likely.",
      },
      {
        title: "Local SEO and Google profile",
        text: "Consistent data, maintained services, photos, opening hours, reviews and links to the treatment pages.",
      },
      {
        title: "Structured data",
        text: "BeautySalon, services with prices, opening hours and FAQ as JSON-LD — so Google and AI systems classify your offering correctly.",
      },
      {
        title: "Multilingual content",
        text: "German, English and Russian are often sensible in Halle — Salon Elen runs trilingually, treatment descriptions included.",
      },
      {
        title: "A page for artists",
        text: "Anyone hiring needs a dedicated page with conditions and an application route. That is part of a studio presence too.",
      },
    ],
  },

  assistant: {
    eyebrow: "Optional automation",
    title: "An AI assistant that answers questions — and guides clients to booking",
    intro:
      "On request, we integrate a multilingual AI assistant that works from content approved by your studio. It answers recurring questions outside opening hours, helps visitors find their way and guides them to the right treatment, booking flow or personal consultation.",
    items: [
      {
        title: "Answers around the clock",
        text: "Prices, duration, preparation, aftercare and the booking process are explained clearly from your verified website content.",
      },
      {
        title: "Multilingual guidance",
        text: "The assistant replies in the language of the question — for example German, English or Russian.",
      },
      {
        title: "Qualify enquiries",
        text: "It identifies the treatment, goal and need for consultation, then directs the client to the right next step.",
      },
      {
        title: "Controlled handover",
        text: "For individual or sensitive questions it hands over to booking, the contact form, WhatsApp or your team instead of inventing an answer.",
      },
    ],
    guardrail:
      "The assistant does not replace professional advice, make diagnoses or give binding treatment recommendations. Medical and individual decisions expressly remain with qualified professionals.",
    pricing:
      "The AI assistant, knowledge base, handovers and optional reporting are designed and priced for the actual use case; they are not automatically included in the website packages.",
    cta: "Assess an AI assistant for my studio",
  },

  visibility: {
    eyebrow: "SEO · GEO · AIO",
    title: "Found on Google — and quotable for AI answers",
    intro:
      "Clients search by treatment and location, and increasingly they ask full questions in ChatGPT, Gemini, Claude or Perplexity. Those systems can only recommend a studio when treatments, prices, durations, process and location are unambiguous and machine-readable on a page they can reach.",
    promptsLabel: "Typical questions your website should answer",
    prompts: [
      "Powder brows Halle (Saale) — price and duration",
      "Where can I get microblading done in Halle?",
      "Microneedling Halle — how many treatments are needed?",
      "Lash extensions Halle with online booking",
      "Cosmetic studio in Halle with evening appointments",
      "Permanent make-up lips Halle — how long does it last?",
    ],
    promptsNote:
      "None of these needs a separate doorway page. Each needs a clear answer in the right place: on the treatment page, next to price and duration, in the aftercare or in the FAQ.",
    signals: [
      {
        title: "Write out prices and durations",
        text: "“Price on request” is nothing to a search engine or an AI system. A concrete figure with the duration beside it is a quotable answer.",
      },
      {
        title: "Name treatments the way people search",
        text: "Powder brows, microblading, hairstroke, lash lifting, microneedling, Hydrafacial. Writing only “eyebrow treatment” means never being found.",
      },
      {
        title: "An unambiguous entity",
        text: "Studio name, address, phone number and opening hours identical on the website, the Google profile, Instagram and directories.",
      },
      {
        title: "Answers instead of ad copy",
        text: "Short, direct paragraphs on pain, longevity, aftercare, touch-ups and contraindications — exactly the sentences that get quoted.",
      },
      {
        title: "Structured data",
        text: "JSON-LD for the studio, its services with prices and its opening hours turns prose into facts a machine can evaluate.",
      },
      {
        title: "Honest expectations",
        text: "Whether a specific system names your studio is decided by that system, not by an agency. We do not sell guarantees; we build the foundations that improve the odds.",
      },
    ],
  },

  trust: {
    eyebrow: "Trust",
    title: "In beauty, trust decides — not price",
    intro:
      "A client lets you work on her face — with pigment, needles or adhesive. The decision is not made over the lowest price, but over whether she trusts you with her face.",
    items: [
      {
        title: "Your own results, sorted by treatment",
        text: "Before-and-after images from your own studio, grouped by treatment. Borrowed or manufacturer-supplied images read as fake immediately.",
      },
      {
        title: "Qualifications made visible",
        text: "Training, courses, certificates, years in the profession. For permanent make-up and microneedling this is not decoration but the basis of the decision.",
      },
      {
        title: "Hygiene and materials",
        text: "Which pigments, which brands, which single-use items. Naming them sets you apart instantly from studios that only show results.",
      },
      {
        title: "A face with a name",
        text: "For a deeply personal service the client wants to know who will treat her. A portrait and a few honest sentences work better than any stock photo.",
      },
      {
        title: "Reviews with a source",
        text: "Real feedback from the Google Business Profile or booking portals, with a recognisable origin. No invented quotes.",
      },
      {
        title: "Clear conditions",
        text: "Cancellation window, lateness policy, deposit for long treatments. Read beforehand this looks professional; explained afterwards it looks like an excuse.",
      },
    ],
    note:
      "All trust elements only work when they are real. We do not implement invented reviews or borrowed result images — both are legally risky and, in a city like Halle, quickly noticed.",
  },

  legal: {
    eyebrow: "Reliability",
    title: "What has to be especially sound on a beauty website",
    items: [
      {
        title: "Health data in the booking form",
        text: "Questions about skin conditions, allergies, pregnancy or medication concern health data and are subject to stricter requirements than a name and phone number. We ask as little as possible online and clarify the rest in the studio.",
      },
      {
        title: "Before-and-after images",
        text: "Images of clients need documented consent that also covers the intended use. For certain treatments additional advertising restrictions may apply — that belongs to a pre-launch review.",
      },
      {
        title: "Qualification requirements",
        text: "Individual applications, laser or IPL for example, are subject to specific expertise requirements in Germany. We only advertise on the website what you actually offer and are permitted to perform.",
      },
      {
        title: "Price display",
        text: "Consumers see final prices including VAT. Combo prices, touch-up prices and package prices are presented so nothing surprises anyone at booking.",
      },
      {
        title: "Information and contraindications",
        text: "Notes on process, aftercare and cases where a treatment is not possible belong visibly on the treatment page — not only on a form in the studio.",
      },
      {
        title: "Imprint, privacy, booking data",
        text: "Complete provider identification plus documented forms, recipients and processors so your privacy policy matches the actual technical setup.",
      },
    ],
    note:
      "We implement carefully on the technical and editorial side and flag open questions. That does not replace legal advice — the final review of advertising claims, client information, consent and your privacy policy stays with you and your advisors.",
  },

  packages: {
    eyebrow: "Orientation",
    title: "Entry levels for beauty studios",
    intro:
      "The figures below are for orientation. The fixed price follows the free initial consultation and depends on the number of services, booking scope, languages and available imagery.",
    catalogName: "Beauty studio website — scope of services",
    tiers: [
      {
        name: "Compact presence",
        price: "from €600",
        minPrice: 600,
        forWhom: "A single artist with a manageable range of services",
        items: [
          "One-pager on a WordPress basis",
          "Services with price and duration",
          "Opening hours, directions, phone with one tap",
          "Google Business Profile aligned",
        ],
      },
      {
        name: "Studio landing page with booking integration",
        price: "from €990",
        minPrice: 990,
        forWhom: "Studios that want appointments without message ping-pong",
        items: [
          "Custom landing page built with React / Next.js",
          "Integration of an existing booking tool",
          "Up to two focused treatment areas",
          "Gallery and structured data",
        ],
      },
      {
        name: "Full studio presence",
        price: "from €1,990",
        minPrice: 1990,
        forWhom: "Studios with many treatments and several artists",
        items: [
          "A dedicated page per main treatment with location reference",
          "Integration of an existing booking system",
          "Additional languages as required",
          "Local SEO, GEO/AIO structure and measurability",
          "Maintainable content plus optional ongoing support",
        ],
      },
    ],
    note:
      "We plan and quote custom booking, CRM, payment or automation solutions after analysing your workflows. Photo production, additional languages and very extensive treatment catalogues also add scope. All figures exclude 19% German VAT.",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions from beauty studios",
    items: [
      {
        q: "What does a beauty studio website cost at SaaleWeb?",
        a: "For orientation: a compact WordPress one-pager starts at €600, a custom React/Next.js landing page with an existing booking-tool integration at €990, and a multi-page studio presence at €1,990 — each plus 19% VAT. We quote custom booking, CRM, payment or automation solutions after analysing the required workflows. We name the exact fixed price after the free initial consultation.",
      },
      {
        q: "Do we really need online booking?",
        a: "If you cannot answer the phone during a treatment, yes. The real gain is not the technology but the time: no messages in the evening, no answering price questions individually, no proposing slots back and forth. For very small studios with a few regular clients, an inquiry form plus a phone number can be entirely sufficient — we say so openly.",
      },
      {
        q: "We already use a booking tool. Can you integrate it?",
        a: "In most cases yes — as an embedded widget or as a link with the treatment preselected. We check what your provider supports before quoting. If the existing tool no longer covers your workflows, we can also plan a custom booking or CRM solution after a joint analysis.",
      },
      {
        q: "Do prices have to go on the website?",
        a: "In our view, yes. “Price on request” generates exactly the messages you want to get rid of, and it is not an answer for Google or AI systems. Prices also pre-qualify: someone who disagrees with the price does not write at all. For highly individual treatments we work with from-prices plus a clear explanation of what influences the final figure.",
      },
      {
        q: "Will a new website bring more clients?",
        a: "Nobody can give you a credible number in advance — it depends on awareness, range of services, region, competition and season. What reliably changes is the effort per appointment: bookings appear in the evening by themselves, price questions disappear, and the calendar lives in one place instead of three channels.",
      },
      {
        q: "Isn't Instagram enough?",
        a: "Instagram is a strong shop window but not a till. Nobody reliably finds the full price list, the duration per treatment, aftercare notes or free slots there — and the profile does not belong to you. The sensible setup is the combination: Instagram shows results, the link in the bio leads straight into booking.",
      },
      {
        q: "How should before-and-after images be handled?",
        a: "They are the strongest argument in beauty and therefore need documented consent from the client that also covers the intended use. We recommend obtaining clearance right after the treatment and recording which images may be used. For individual treatments additional advertising limits may apply — we review that together before launch.",
      },
      {
        q: "What matters most for data protection?",
        a: "The key point is health information. Questions about allergies, skin conditions, pregnancy or medication concern health data and are subject to stricter requirements than a name and phone number. We therefore keep the booking form deliberately lean and clarify medically relevant points in the studio, not online.",
      },
      {
        q: "Can several artists have their own appointments?",
        a: "Yes. Each artist can have her own services, hours and profile. Clients choose deliberately or take the first available artist — that is exactly how it works at Salon Elen.",
      },
      {
        q: "Is multilingual content worth it?",
        a: "In Halle, often yes. Salon Elen runs trilingually in German, English and Russian because the client base supports it. Whether it fits you we check against your actual appointment history rather than a gut feeling — every additional language also means translating and maintaining every treatment text.",
      },
      {
        q: "How long does a project like this take?",
        a: "A website with online booking is often live within three to five weeks, a full studio presence with many treatments usually within five to eight weeks. In our experience the biggest time factor is capturing the services: duration, price, description, aftercare and touch-up window for every single treatment.",
      },
      {
        q: "What happens after launch?",
        a: "After going live we check loading times, mobile use, the booking flow, confirmation emails and indexing. Treatments, prices, gallery and FAQ can then be extended step by step — usually driven by the questions that still arrive by message. Ongoing support is available but never a condition.",
      },
      {
        q: "Can an AI assistant answer questions about our treatments?",
        a: "Yes. A tailored assistant can explain approved information about services, prices, duration, preparation, aftercare and booking in several languages and guide visitors to the right action. It does not replace professional or medical advice, make diagnoses or give binding treatment recommendations; individual and sensitive questions are handed over to your team. Scope and cost are priced separately for the actual use case.",
      },
    ],
  },

  related: {
    eyebrow: "Read on",
    title: "Pages that fit your project",
    links: [
      {
        label: "Salon Elen",
        href: "/en/projects/online-bookings-tripled",
        description: "Beauty studio from Halle with 43 treatments and its own online booking.",
      },
      {
        label: "Booking systems",
        href: "/en/services/booking-systems",
        description: "How appointment booking and inquiries are integrated cleanly.",
      },
      {
        label: "Local SEO",
        href: "/en/services/local-seo",
        description: "Be found regionally — in Halle, Merseburg and the Saalekreis.",
      },
      {
        label: "Service provider website",
        href: "/en/industries/service-provider-website",
        description: "For other appointment-driven businesses where the calendar is the business.",
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
    title: "Show us your price list — we will show you how it turns into appointments.",
    text:
      "In the free initial consultation we look at your range of services, your current website, your Instagram presence and how appointments come in today. Afterwards you know which step is worth taking — even if the answer turns out to be no new project.",
    primary: "Free first consultation",
    secondary: "Have your current site reviewed",
    assurance: "No obligation, no contract commitment and an honest assessment, including when it argues against a project.",
  },
};
