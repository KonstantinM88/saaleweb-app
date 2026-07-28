import type { RestaurantLandingContent } from "../types";

export const restaurantEn: RestaurantLandingContent = {
  slug: "restaurant-website",
  metaTitle: "Restaurant website with a digital menu",
  metaDescription:
    "Restaurant website with a digital menu instead of a PDF: dishes with photo, price and allergens, categories, a short path to reservations, Local SEO for Halle, Leipzig and Saale-Unstrut plus structured data for Google and AI search.",

  eyebrow: "Industry solution · Gastronomy",
  h1: "A restaurant website with a menu that actually makes people hungry",
  h1Accent: "menu that actually makes people hungry",
  lead:
    "The menu is the most important page a restaurant has — and on most websites it is a PDF from last year. SaaleWeb builds it as its own maintainable page: dishes with photo, description, price and allergens, sorted into categories, readable on a phone in seconds and connected directly to the reservation path.",
  heroPoints: [
    "Update the menu yourself — no agency appointment, no new PDF",
    "Dishes with photo, price, allergens and labels such as vegetarian",
    "Two real references from the region: Waldschlösschen and Neue Liebe",
  ],
  ctaPrimary: "Free first consultation",
  ctaSecondary: "Have your current site reviewed",

  heroCard: {
    badge: "This is one dish entry",
    image: "/images/industries/restaurant-menu/flammkuchen-spargel.webp",
    imageAlt: "Tarte flambée with green asparagus from the Waldschlösschen menu",
    video: "/images/industries/restaurant-menu/flammkuchen-spargel.webm",
    category: "Seasonal",
    name: "Tarte flambée with green asparagus",
    description: "Wild garlic cream, red onions, spring leek and grilled asparagus from a farm in the region.",
    price: "€16.90",
    allergenLabel: "Allergens",
    allergens: "A, G, L",
    badges: ["Vegetarian", "Recommended"],
    footnote: "Example content. Dishes, prices, images and labelling later come from your own menu.",
  },

  answer: {
    eyebrow: "In brief",
    question: "Who builds restaurant websites with a digital menu?",
    text:
      "SaaleWeb is a digital studio based in Halle (Saale) building websites for restaurants, inns, cafés and event gastronomy. The focus is the menu as its own maintainable and indexable page — with dishes, images, prices, allergen labelling and categories — plus a short path to a table reservation. Two completed examples are publicly online: the Waldschlösschen restaurant in Nebra and Neue Liebe in Nebra (Unstrut).",
    facts: [
      { label: "Provider", value: "SaaleWeb — digital studio and web agency based in Halle (Saale)" },
      { label: "Focus", value: "Digital menu · reservations · Local SEO · GEO/AIO" },
      { label: "Region", value: "Halle, Leipzig, Merseburg, Saalekreis, Saale-Unstrut" },
      { label: "References", value: "Waldschlösschen Nebra · Neue Liebe Nebra (Unstrut)" },
      { label: "Entry level", value: "Landing page from €990, multi-page restaurant website from €1,990 plus VAT" },
      { label: "Next step", value: "Free initial consultation or a review of your current website" },
    ],
  },

  pdfProblem: {
    eyebrow: "The real problem",
    title: "A menu as a PDF costs you guests — every evening",
    intro:
      "Almost every guest checks the menu before visiting. Usually on a phone, usually on the move, usually right before deciding. This is exactly where most restaurant websites fail — not because of the design, but because of a file format.",
    problems: [
      {
        title: "A PDF is unreadable on a phone",
        text: "The guest has to zoom, pan, zoom again. Someone hungry and in a hurry gives up after a few seconds and looks at the place next door instead.",
      },
      {
        title: "Google cannot see the dishes",
        text: "Content inside a PDF is captured poorly and is almost impossible to structure. Searches for individual dishes, categories or a style of cooking find nothing.",
      },
      {
        title: "AI systems have nothing to quote",
        text: "When someone asks ChatGPT or Google for a nearby restaurant with vegetarian options, the answer needs readable, unambiguous data — not a document behind a download link.",
      },
      {
        title: "Every change costs time",
        text: "New price, seasonal menu, a dish sold out: if each change means re-typesetting and re-uploading a document, in the end nothing gets updated at all.",
      },
      {
        title: "Outdated prices annoy guests",
        text: "When the online menu says €14.50 and the plate costs €16.90, an avoidable conflict starts right at the table.",
      },
      {
        title: "Instagram is not a menu",
        text: "Many businesses maintain only the social channel. Guests find atmosphere there, but no complete menu, no opening hours and no reliable way to reserve.",
      },
    ],
    conclusion:
      "A digital menu solves all of it at once: readable on mobile, usable for search engines and AI systems, editable by your own team in minutes and connected directly to reservations.",
  },

  menu: {
    eyebrow: "The centrepiece",
    title: "The digital menu",
    intro:
      "This is how a menu works for guests, Google and AI systems at the same time: switchable categories, every dish with image, description, price and labelling. Try the categories below — the content is an example, the structure is real.",
    demoLabel: "Example content",
    categoriesLabel: "Choose a category",
    allergenLabel: "Allergens",
    videoLabel: "Watch this dish",
    closeVideoLabel: "Close video",
    videoUnsupported: "Your browser does not support this video.",
    categories: [
      {
        name: "Seasonal",
        count: "4 items",
        note: "A rotating seasonal menu — asparagus in spring, game and pumpkin in autumn.",
        dishes: [
          {
            name: "Tarte flambée with green asparagus",
            description: "Wild garlic cream, red onions, spring leek and grilled asparagus from a farm in the region.",
            price: "€16.90",
            badges: ["Vegetarian", "Recommended"],
            allergens: "A, G, L",
            image: "/images/industries/restaurant-menu/flammkuchen-spargel.webp",
            imageAlt: "Tarte flambée with green asparagus, red onions and spring leek",
            video: "/images/industries/restaurant-menu/flammkuchen-spargel.webm",
          },
          {
            name: "Cream of asparagus soup with house bread",
            description: "With asparagus pieces and a hint of nutmeg, served with bread from our own kitchen.",
            price: "€8.50",
            badges: ["Vegetarian"],
            allergens: "A, G",
            image: "/images/industries/restaurant-menu/spargel-kokos-chilisuppe.webp",
            imageAlt: "Creamy asparagus soup with asparagus pieces and house-baked bread",
            video: "/images/industries/restaurant-menu/spargel-kokos-chilisuppe.webm",
          },
          {
            name: "White asparagus with pork schnitzel",
            description: "With hollandaise sauce or breadcrumb butter, served with boiled potatoes.",
            price: "€26.50",
            badges: [],
            allergens: "A, C, G",
            image: "/images/industries/restaurant-menu/stangenspargel-schweineschnitzel.webp",
            imageAlt: "White asparagus with pork schnitzel, hollandaise and potatoes",
            video: "/images/industries/restaurant-menu/stangenspargel-schweineschnitzel.webm",
          },
          {
            name: "Asparagus panna cotta with strawberries",
            description: "A light dessert from the seasonal menu, with fresh strawberries from the region.",
            price: "€9.90",
            badges: ["Vegetarian"],
            allergens: "G",
            image: "/images/industries/restaurant-menu/spargel-panna-cotta.webp",
            imageAlt: "Asparagus panna cotta with fresh strawberries",
            video: "/images/industries/restaurant-menu/spargel-panna-cotta.webm",
          },
        ],
      },
      {
        name: "Starters",
        count: "3 items",
        note: "Classics to begin with — each one stating what it is served with.",
        dishes: [
          {
            name: "Solyanka, house style",
            description: "Hearty and slightly sour, served with bread and a spoonful of sour cream.",
            price: "€7.50",
            badges: [],
            allergens: "A, G",
            image: "/images/industries/restaurant-menu/soljanka.webp",
            imageAlt: "House-style solyanka with sour cream and bread",
            video: "/images/industries/restaurant-menu/soljanka.webm",
          },
          {
            name: "Würzfleisch au gratin",
            description: "Pork ragout gratinated with cheese and served with bread.",
            price: "€7.50",
            badges: [],
            allergens: "A, G",
            image: "/images/industries/restaurant-menu/wuerzfleisch.webp",
            imageAlt: "Creamy pork ragout gratinated with cheese",
            video: "/images/industries/restaurant-menu/wuerzfleisch.webm",
          },
          {
            name: "Warm pretzel bites with Obazda",
            description: "Warm lye pastry with a creamy beer-cheese dip and red onions.",
            price: "€6.90",
            badges: ["Vegetarian"],
            allergens: "A, G",
            image: "/images/industries/restaurant-menu/brezelknusper-obazda.webp",
            imageAlt: "Warm pretzel bites with creamy Obazda and red onions",
            video: "/images/industries/restaurant-menu/brezelknusper-obazda.webm",
          },
        ],
      },
      {
        name: "Main courses",
        count: "4 items",
        note: "The dishes people search for most — each with its own description.",
        dishes: [
          {
            name: "Juicy pork schnitzel",
            description: "Served with creamy mushrooms and house-made fries.",
            price: "€16.50",
            badges: [],
            allergens: "A, C, G",
            image: "/images/industries/restaurant-menu/saftiges-schweineschnitzel.webp",
            imageAlt: "Juicy pork schnitzel with creamy mushrooms and fries",
            video: "/images/industries/restaurant-menu/saftiges-schweineschnitzel.webm",
          },
          {
            name: "Grilled sirloin steak",
            description: "With braised onions, herb butter and fried potatoes.",
            price: "€28.50",
            badges: ["Recommended"],
            allergens: "G",
            image: "/images/industries/restaurant-menu/rinderrueckensteak-grill.webp",
            imageAlt: "Grilled sirloin steak with braised onions and fried potatoes",
            video: "/images/industries/restaurant-menu/rinderrueckensteak-grill.webm",
          },
          {
            name: "Vegetable pan with herb cream",
            description: "Seasonal vegetables from the region, with croquettes or boiled potatoes.",
            price: "€14.50",
            badges: ["Vegetarian", "Lactose-free possible"],
            allergens: "G",
            image: "/images/industries/restaurant-menu/gemuesepfanne-kraeuterrahm.webp",
            imageAlt: "Seasonal vegetable pan with herb cream, croquettes and potatoes",
            video: "/images/industries/restaurant-menu/gemuesepfanne-kraeuterrahm.webm",
          },
          {
            name: "Fried fish with remoulade",
            description: "Served with house-made remoulade and fried potatoes.",
            price: "€13.50",
            badges: [],
            allergens: "A, C, D",
            image: "/images/industries/restaurant-menu/backfisch-remoulade.webp",
            imageAlt: "Crispy fried fish with house-made remoulade and fried potatoes",
            video: "/images/industries/restaurant-menu/backfisch-remoulade.webm",
          },
        ],
      },
      {
        name: "Wine & drinks",
        count: "3 items",
        note: "Wines from Saale-Unstrut, regional beers and alcohol-free alternatives.",
        dishes: [
          {
            name: "Pinot Blanc dry, Saale-Unstrut",
            description: "From Germany's northernmost quality wine region. 0.2 l.",
            price: "€6.50",
            badges: ["Regional"],
            allergens: "O",
            image: "/images/industries/restaurant-menu/weissburgunder-saale-unstrut.webp",
            imageAlt: "Chilled Pinot Blanc served in a wine glass",
            video: "/images/industries/restaurant-menu/weissburgunder-saale-unstrut.webm",
          },
          {
            name: "Regional draught lager",
            description: "Mild, malty and full-bodied. 0.5 l.",
            price: "€4.50",
            badges: ["Regional"],
            allergens: "A",
            image: "/images/industries/restaurant-menu/regionales-landbier.webp",
            imageAlt: "Freshly poured regional draught lager",
            video: "/images/industries/restaurant-menu/regionales-landbier.webm",
          },
          {
            name: "House-made lemonade",
            description: "Lemon, mint and cool sparkling water. 0.4 l.",
            price: "€4.90",
            badges: ["Alcohol-free"],
            image: "/images/industries/restaurant-menu/hausgemachte-limonade.webp",
            imageAlt: "House-made lemonade with lemon, mint, ice and sparkling water",
            video: "/images/industries/restaurant-menu/hausgemachte-limonade.webm",
          },
        ],
      },
    ],
    featuresTitle: "What this menu does technically",
    features: [
      {
        title: "Its own URL instead of a download",
        text: "The menu is a real page with its own address, title and description — linkable, shareable and indexable by Google.",
      },
      {
        title: "Categories and filters",
        text: "Starters, mains, desserts, drinks, seasonal menu: guests jump straight to what they want instead of scrolling twelve pages.",
      },
      {
        title: "Image and video clip per dish",
        text: "A good photo sells a dish better than any description. At Waldschlösschen a short clip sits behind many of the images.",
      },
      {
        title: "Allergens and labelling",
        text: "Allergen data plus vegetarian, vegan, lactose-free or gluten-free sit directly on the dish — not in a footnote on page four.",
      },
      {
        title: "Prices changed in minutes",
        text: "Price adjustment, new dish, change of season: you edit it yourself in the admin area and the page is immediately current.",
      },
      {
        title: "Connected to reservations",
        text: "From any point in the menu there is a visible path to a table request — exactly when the appetite is there.",
      },
      {
        title: "Multilingual when needed",
        text: "German and English as a base, Russian or further languages depending on your guests — dish names and descriptions included.",
      },
      {
        title: "Structured data for menus",
        text: "Menu, MenuSection and MenuItem as JSON-LD: that is what allows Google and AI systems to understand individual dishes, categories and prices in the first place.",
      },
    ],
    proofTitle: "Two menus we built, both publicly online",
    proofIntro:
      "Both projects were built by SaaleWeb and are live. Look at the menus before you talk to us — that says more than any description.",
    proofs: [
      {
        name: "Waldschlösschen Nebra",
        url: "https://waldschlosschen-08.vercel.app/de/restaurant",
        projectHref: "/en/projects/direct-bookings-without-portals",
        text:
          "Hotel and restaurant in one presence. The menu is organised by category, every dish carries an image, description, price and allergen data, and many dishes additionally have a short video clip. The menu is maintained by the business itself and changes with the season.",
        stats: [
          "12 categories from asparagus season to spirits",
          "More than 120 items with price and description",
          "Photo and short clip on many dishes",
          "Allergens and vegetarian labelling on the dish",
        ],
      },
      {
        name: "Neue Liebe Nebra (Unstrut)",
        url: "https://www.neueliebe-nebra.de/menu",
        projectHref: "/en/projects/neue-liebe-nebra",
        text:
          "Restaurant with terrace, dance and events. The menu lives on its own URL, is bilingual, filterable by category and connected directly to reservations. On the menu page itself an FAQ answers typical guest questions.",
        stats: [
          "Its own /menu URL with its own metadata",
          "8 category filters from starters to beer & drinks",
          "German and English",
          "FAQ directly on the menu page",
        ],
      },
    ],
    proofLive: "View live",
    proofCase: "Project in detail",
  },

  reservation: {
    eyebrow: "The second step",
    title: "From appetite to reservation — without a detour",
    intro:
      "The best menu achieves little if all that follows is a phone number in the footer. We build the reservation path to fit the business — not every restaurant needs a booking system.",
    items: [
      {
        title: "Call with one tap",
        text: "On a phone the number is a link. For many businesses the telephone remains the best channel — it just has to be instantly reachable.",
      },
      {
        title: "A structured inquiry form",
        text: "Date, time, number of guests, occasion, requests such as terrace or a high chair. The request arrives complete instead of being clarified over five callbacks.",
      },
      {
        title: "Your existing reservation tool",
        text: "If you already use one, we integrate it — as an embedded widget or as a link with pre-filled details. You keep your system.",
      },
      {
        title: "WhatsApp and messengers",
        text: "For many guests the fastest route. On request with a prepared message so the inquiry already carries the right details.",
      },
      {
        title: "Groups and celebrations separated",
        text: "A birthday party for 30 is not a table reservation. Larger occasions get their own form with menu preference and time frame.",
      },
      {
        title: "Opening hours that are correct",
        text: "Regular hours, last orders, closing days and public holidays — maintained identically on the website and in the Google Business Profile.",
      },
    ],
    honesty:
      "We do not sell reservation software and we will not sell you a system you do not need. For many restaurants in the region a clean form plus a phone number is entirely sufficient — and carries no monthly fee.",
  },

  journey: {
    eyebrow: "Guest journey",
    title: "How a guest actually finds you",
    intro:
      "Between the first impulse and a reserved table there are rarely more than ten minutes — and almost always a phone. Each phase makes a different demand on your website.",
    guestLabel: "The guest",
    siteLabel: "Your website must",
    steps: [
      {
        phase: "Impulse",
        guest: "Is hungry, has an occasion or visitors — and searches for a restaurant in Halle, Merseburg or along the Saale-Unstrut.",
        site: "appear at all: a maintained Google Business Profile, current photos, a named style of cooking and a clear location.",
      },
      {
        phase: "Check the menu",
        guest: "Opens the menu — by far the most common reason anyone visits a restaurant website.",
        site: "show the menu immediately and readably on mobile: categories, dishes, prices, allergens. No download, no zooming.",
      },
      {
        phase: "Does it fit?",
        guest: "Checks opening hours, terrace, parking, whether children are welcome and whether there is something vegetarian.",
        site: "answer those questions before they are asked — on the page, not on the phone.",
      },
      {
        phase: "Reserve",
        guest: "Wants a table now — usually in the evening, often for today or tomorrow, almost always from a phone.",
        site: "offer a visible, short path: call with one tap, a form, or your reservation tool.",
      },
      {
        phase: "Afterwards",
        guest: "Has been there, recommends the place, writes a review or comes back for the next occasion.",
        site: "make reviews visible, offer events and celebrations and prepare the next occasion.",
      },
    ],
  },

  build: {
    eyebrow: "Scope",
    title: "What we actually build for restaurants",
    intro:
      "Not every business needs everything. Scope is defined in the first consultation based on style of cooking, size, event business and how much you want to maintain yourself.",
    items: [
      {
        title: "Digital menu",
        text: "Its own page with categories, dishes, images, prices, allergens and labelling — maintained by your own team.",
      },
      {
        title: "Seasonal and rotating menus",
        text: "Asparagus, game, a Christmas menu or a lunch offer as separate sections that can be switched on and off again.",
      },
      {
        title: "Reservation path",
        text: "Phone with one tap, a structured form, integration of your tool or messenger — whatever fits your operation.",
      },
      {
        title: "Atmosphere and rooms",
        text: "Dining room, terrace, beer garden, fireplace room or private room with their own images and descriptions instead of one shared gallery.",
      },
      {
        title: "Events and celebrations",
        text: "Weddings, corporate parties, birthdays and Christmas events as separate pages with capacities, format and an inquiry form.",
      },
      {
        title: "Opening hours and closing days",
        text: "Regular hours, last orders, holidays and annual closures — maintained cleanly and aligned with the Google profile.",
      },
      {
        title: "Real reviews",
        text: "Guest voices from Google, Tripadvisor or other sources with a recognisable origin. No invented quotes.",
      },
      {
        title: "Local SEO and Google profile",
        text: "Consistent contact data, the menu link in the profile, attributes such as terrace or accessibility, photos and questions & answers.",
      },
      {
        title: "Structured data",
        text: "Restaurant, Menu, MenuSection, MenuItem, opening hours and FAQ as JSON-LD — the foundation for Google and AI answers.",
      },
      {
        title: "Speed on a phone",
        text: "Images are compressed properly and delivered in modern formats. A menu with 120 dishes may still load fast.",
      },
      {
        title: "Multilingual content",
        text: "German and English as a base, Russian or further languages depending on your guests — dishes included.",
      },
      {
        title: "Vouchers and offers",
        text: "Gift vouchers, lunch deals or seasonal campaigns as maintainable sections that match the occasion.",
      },
    ],
  },

  visibility: {
    eyebrow: "SEO · GEO · AIO",
    title: "Found on Google — and quotable for AI answers",
    intro:
      "Guests stopped typing keywords a while ago; they ask questions — in Google, in Maps and increasingly in ChatGPT, Gemini, Claude or Perplexity. Those systems can only recommend a restaurant when kitchen, menu, location and opening hours are unambiguous and machine-readable on a page they can reach.",
    promptsLabel: "Typical questions your website should answer",
    prompts: [
      "Restaurant in Halle (Saale) with a terrace and regional cooking",
      "Where can you eat well in Nebra or along the Unstrut?",
      "Restaurant with vegetarian options in Merseburg",
      "Inn for a company party for 40 people in the Saalekreis",
      "Which restaurant in Halle is open on Sundays?",
      "Restaurant with Saale-Unstrut wines and a beer garden",
    ],
    promptsNote:
      "None of these needs a separate doorway page. Each needs a clear answer in the right place: on the menu page, in the opening hours, on the events page or in the FAQ.",
    signals: [
      {
        title: "Dishes as data, not as an image",
        text: "When dishes, categories and prices exist as text and structured data, a system can read them. A photographed menu card is invisible to search and AI.",
      },
      {
        title: "An unambiguous entity",
        text: "Name, address, phone number and opening hours are identical on the website, the Google profile and the portals. Contradictions are the most common cause of hesitant answers.",
      },
      {
        title: "Name your style of cooking",
        text: "Regional, German, seasonal, vegetarian, game, tarte flambée: what you do not write down, nobody can associate with you.",
      },
      {
        title: "Local grounding",
        text: "Directions, parking, proximity to Arche Nebra, the wine route, the station or the city centre — information guests look for that anchors you regionally.",
      },
      {
        title: "Being current",
        text: "Changed opening hours, annual closures, the seasonal menu. Outdated details damage AI answers more than they damage classic search results.",
      },
      {
        title: "Honest expectations",
        text: "Whether a specific system names your restaurant is decided by that system, not by an agency. We do not sell guarantees; we build the foundations that improve the odds.",
      },
    ],
  },

  events: {
    eyebrow: "Often underestimated",
    title: "Celebrations and events are the second revenue channel",
    intro:
      "A wedding, a company Christmas party or a birthday with 40 guests is worth more to many businesses than an average evening. Yet most websites give it a single sentence.",
    items: [
      {
        title: "A page per occasion",
        text: "Wedding, corporate party, birthday, funeral reception, Christmas party: separate pages with their own search terms instead of one line in a paragraph.",
      },
      {
        title: "Capacities and rooms",
        text: "How many people fit in the hall, the private room, on the terrace? That number is often the first question — and rarely answered.",
      },
      {
        title: "Menu suggestions and format",
        text: "Sample menus, packages and a rough schedule give confidence before anyone picks up the phone.",
      },
      {
        title: "An inquiry form with the right fields",
        text: "Date, number of guests, occasion, budget range, catering, technical needs. A complete inquiry saves both sides several calls.",
      },
      {
        title: "Photos of real events",
        text: "A festively set hall convinces more than any text — provided the images come from your own house.",
      },
      {
        title: "Seasonal visibility",
        text: "Christmas parties are searched for in September, weddings a year ahead. These pages have to be online and findable early.",
      },
    ],
  },

  legal: {
    eyebrow: "Reliability",
    title: "What should be correct on a restaurant website",
    items: [
      {
        title: "Allergen labelling",
        text: "For food sold loose, the 14 allergens subject to labelling must be accessible to guests. The website can carry that information clearly; factual accuracy stays with the kitchen.",
      },
      {
        title: "Additives",
        text: "Declarations such as colourant, preservative or flavour enhancer belong visibly with the dish. We build the fields, you maintain the content.",
      },
      {
        title: "Price display",
        text: "Guests see final prices including VAT. The menu should show the same state online and in the house — otherwise the conflict happens at the table.",
      },
      {
        title: "Opening hours and closing days",
        text: "Wrong hours are the most common cause of disappointed guests and poor reviews. Website and Google profile are therefore maintained together.",
      },
      {
        title: "Images and rights",
        text: "Your own photos are legally safe and simply work better. For images of guests or events we make sure consent is properly handled.",
      },
      {
        title: "Imprint, privacy, reviews",
        text: "Complete provider identification, documented forms and recipients, and real reviews with a recognisable source. Invented testimonials are legally risky.",
      },
    ],
    note:
      "We implement carefully on the technical and editorial side and flag open questions. That does not replace legal or food-law advice — the final review of labelling, price presentation and your privacy policy stays with you and your advisors.",
  },

  packages: {
    eyebrow: "Orientation",
    title: "Entry levels for restaurant projects",
    intro:
      "The figures below are for orientation. The fixed price follows the free initial consultation and depends on menu size, languages, event business and available imagery.",
    catalogName: "Restaurant website — scope of services",
    tiers: [
      {
        name: "Compact presence",
        price: "from €600",
        minPrice: 600,
        forWhom: "Café or small business with a manageable menu",
        items: [
          "One-pager on a WordPress basis",
          "Menu as a readable page instead of a PDF",
          "Opening hours, directions, phone with one tap",
          "Google Business Profile aligned",
        ],
      },
      {
        name: "Restaurant with a digital menu",
        price: "from €990",
        minPrice: 990,
        forWhom: "Restaurants where the menu is the most important page",
        items: [
          "Individual build with Next.js",
          "Digital menu with categories, images and allergens",
          "Dishes and prices maintained by your team",
          "Reservation path and structured data for Google and AI search",
        ],
      },
      {
        name: "Full gastronomy website",
        price: "from €1,990",
        minPrice: 1990,
        forWhom: "Businesses with events, rooms, seasonal menus or an attached hotel",
        items: [
          "Food menu, seasonal menus and drinks list maintained separately",
          "Dedicated pages for celebrations, rooms and occasions",
          "German, English and Russian",
          "Local SEO, GEO/AIO structure and measurability",
          "Maintainable content plus optional ongoing support",
        ],
      },
    ],
    note:
      "All figures exclude 19% German VAT. Additional scope such as food photography, video clips per dish, copywriting in several languages or special integrations is calculated separately.",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions from the restaurant trade",
    items: [
      {
        q: "What does a restaurant website cost at SaaleWeb?",
        a: "For orientation: a compact WordPress one-pager starts at €600, a restaurant website with a digital menu at €990, and a full gastronomy website with events and rooms at €1,990 — each plus 19% VAT. Food photography, video clips per dish and further languages add scope. We name the exact fixed price after the free initial consultation.",
      },
      {
        q: "Can we really maintain the menu ourselves?",
        a: "Yes, and that is the whole point. Dishes, descriptions, prices, categories, images and labelling are edited in the admin area and the page is immediately current. That is exactly how the Waldschlösschen menu works, changing with every season.",
      },
      {
        q: "Why is a PDF menu a problem?",
        a: "A PDF is hard to read on a phone, almost impossible to structure and is evaluated far less well by search engines and AI systems. Then there is the practical point: if every price change means re-typesetting a document, in the end nothing gets updated.",
      },
      {
        q: "Do we need a photo of every dish?",
        a: "Not necessarily, but images work hard. A good photo sells a dish better than three lines of description. A sensible start is the 10 to 15 most important dishes; the rest of the menu can stay text-based and be extended later. Food photography is not part of the base scope and is calculated separately.",
      },
      {
        q: "Can short videos of dishes be embedded?",
        a: "Yes. At Waldschlösschen many dishes have a short clip behind the image that plays on tap. Technically that is no problem as long as the clips are short and properly compressed so the menu stays fast.",
      },
      {
        q: "How are allergens displayed?",
        a: "As a field directly on the dish, using the letter code common in Germany, complemented by labels such as vegetarian, vegan, lactose-free or gluten-free. For food sold loose, the allergens subject to labelling must be accessible to guests. We build the structure; the kitchen is responsible for factual accuracy.",
      },
      {
        q: "Can we keep using our existing reservation tool?",
        a: "Yes. We integrate an existing tool as an embedded widget or as a link with pre-filled details. If you do not use one yet, we often recommend a structured form plus telephone — enough for many businesses in the region and with no monthly cost.",
      },
      {
        q: "How long does a restaurant website project take?",
        a: "A compact build is often finished in two to four weeks, a full gastronomy website usually in four to eight weeks. In our experience the biggest time factor is not the technology but capturing the menu, imagery and approvals from the business.",
      },
      {
        q: "Will our restaurant then also be named in ChatGPT or Google AI Overview?",
        a: "The chance rises considerably when style of cooking, dishes, prices, opening hours, location and answers to typical guest questions are unambiguous and machine-readable on your website — with structured data for the restaurant and its menu plus FAQ sections. Whether a specific system names your business is decided by that system; no one can seriously guarantee it.",
      },
      {
        q: "Is a website worth it when we already have Instagram and Google?",
        a: "Both channels are valuable, but neither replaces a website. Nobody reliably finds a complete menu on Instagram, the Google profile carries no event description, and neither platform belongs to you. The website is where menu, opening hours, celebrations and reservations come together completely and permanently.",
      },
      {
        q: "How do you handle reviews?",
        a: "We embed real reviews with a recognisable source, for example from the Google Business Profile or Tripadvisor. We do not implement invented quotes or polished averages — they are legally risky and destroy exactly the trust they are meant to build.",
      },
      {
        q: "What happens after launch?",
        a: "After going live we check loading times, mobile use, forms, indexing and the reservation paths. Menu, seasonal offers, event pages and FAQ can then be extended step by step. Ongoing support is available but never a condition — the website belongs to you.",
      },
    ],
  },

  related: {
    eyebrow: "Read on",
    title: "Pages that fit your project",
    links: [
      {
        label: "Neue Liebe Nebra",
        href: "/en/projects/neue-liebe-nebra",
        description: "Restaurant website with a bilingual menu and reservation focus.",
      },
      {
        label: "Waldschlösschen",
        href: "/en/projects/direct-bookings-without-portals",
        description: "Hotel and restaurant with a self-maintained seasonal menu in one presence.",
      },
      {
        label: "Booking systems",
        href: "/en/services/booking-systems",
        description: "Integrate reservations and inquiries cleanly.",
      },
      {
        label: "Local SEO",
        href: "/en/services/local-seo",
        description: "Be found regionally — in Halle, Merseburg and along the Saale-Unstrut.",
      },
      {
        label: "Hotel website",
        href: "/en/industries/hotel-website",
        description: "For businesses that rent rooms alongside the restaurant.",
      },
      {
        label: "Pricing",
        href: "/en/pricing",
        description: "Entry levels, scope and how a fixed price is calculated.",
      },
    ],
  },

  final: {
    title: "Show us your menu — we will show you how it works online.",
    text:
      "In the free initial consultation we look at your menu, your current website, your reservation path and your Google profile. Afterwards you know which step is worth taking — even if the answer turns out to be no new project.",
    primary: "Free first consultation",
    secondary: "Have your current site reviewed",
    assurance: "No obligation, no contract commitment and an honest assessment, including when it argues against a project.",
  },
};
