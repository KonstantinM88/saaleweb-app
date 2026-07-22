export type Phase4Link = {
  label: string;
  href: string;
  description?: string;
};

export type Phase4Card = {
  title: string;
  text: string;
};

export type Phase4Faq = {
  q: string;
  a: string;
};

export type Phase4Landing = {
  slug: string;
  navLabel?: string;
  eyebrow: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  lead: string[];
  problemTitle: string;
  problems: string[];
  solutionTitle: string;
  solution: string[];
  featuresTitle: string;
  features: Phase4Card[];
  technologyTitle?: string;
  technologyText?: string;
  processTitle?: string;
  process?: Phase4Card[];
  casesTitle?: string;
  cases?: Phase4Link[];
  relatedTitle: string;
  relatedLinks: Phase4Link[];
  faq: Phase4Faq[];
  finalTitle: string;
  finalText: string;
};

export type Phase4Locale = "de" | "en" | "ru";
export type Phase4SlugMap = Record<Phase4Locale, string>;

const technologyText =
  "Wir empfehlen nicht pauschal eine Plattform. Für neue Premium-Projekte setzen wir häufig auf moderne Technologien wie Next.js und React. Bestehende WordPress-Websites können wir modernisieren, erweitern und langfristig betreuen. Entscheidend ist immer, welche Lösung Ihrem Unternehmen den größten Nutzen bringt.";

const serviceProcess: Phase4Card[] = [
  {
    title: "Analyse",
    text: "Wir prüfen Ihre aktuelle Situation, Zielgruppe, Wettbewerber, Inhalte und technische Basis.",
  },
  {
    title: "Strategie",
    text: "Aus den Erkenntnissen entsteht ein klarer Plan für Struktur, Inhalte, SEO und Nutzerführung.",
  },
  {
    title: "Umsetzung",
    text: "Design, Entwicklung, Inhalte und technische Optimierung werden sauber zusammengeführt.",
  },
  {
    title: "Launch",
    text: "Vor dem Start prüfen wir Performance, mobile Darstellung, Formulare, Tracking und Indexierung.",
  },
  {
    title: "Optimierung",
    text: "Nach dem Launch verbessern wir Inhalte, Suchbegriffe und Conversion-Punkte auf Basis echter Signale.",
  },
];

const industryProcess: Phase4Card[] = [
  {
    title: "Analyse",
    text: "Wir prüfen Branche, Zielgruppe, Wettbewerb, Inhalte, aktuelle Website und typische Kundenfragen.",
  },
  {
    title: "Strategie",
    text: "Daraus entsteht ein Plan für Struktur, Inhalte, lokale Sichtbarkeit, Vertrauen und klare Anfragewege.",
  },
  {
    title: "Umsetzung",
    text: "Design, Entwicklung, SEO-Struktur und Texte werden zu einer nutzbaren Website zusammengeführt.",
  },
  {
    title: "Launch",
    text: "Vor dem Start prüfen wir Performance, mobile Darstellung, Formulare, Indexierung und zentrale Inhalte.",
  },
  {
    title: "Weiterentwicklung",
    text: "Nach dem Launch können Inhalte, Landingpages, FAQ, Referenzen und Conversion-Punkte erweitert werden.",
  },
];

const defaultFinal = {
  finalTitle: "Lassen Sie uns prüfen, was für Ihr Unternehmen sinnvoll ist.",
  finalText:
    "In einem kostenlosen Erstgespräch klären wir, welche Lösung zu Ihrer Situation passt und welche nächsten Schritte realistisch sind.",
};

// Delta 26: shared GEO/AIO FAQ blocks reused across service, industry and city
// landing pages. Pricing follows the official 600/990/1990 EUR orientation.
const pricingFaq: Record<Phase4Locale, Phase4Faq> = {
  de: {
    q: "Was kostet ein Projekt bei SaaleWeb?",
    a: "Zur Orientierung: Ein kompakter WordPress-Onepager startet ab 600 €, eine moderne Landingpage ab 990 €, eine vollständige Unternehmenswebsite ab 1.990 €. Online-Buchung, Mehrsprachigkeit oder Integrationen sind zusätzlicher Umfang. Den genauen Festpreis klären wir im kostenlosen Erstgespräch.",
  },
  en: {
    q: "What does a project at SaaleWeb cost?",
    a: "For orientation: a compact WordPress one-pager starts at €600, a modern landing page at €990 and a full company website at €1,990. Online booking, multiple languages or integrations are additional scope. The exact fixed price is clarified in the free initial call.",
  },
  ru: {
    q: "Сколько стоит проект в SaaleWeb?",
    a: "Для ориентира: компактный WordPress one-pager — от 600 €, современный лендинг — от 990 €, полноценный корпоративный сайт — от 1 990 €. Онлайн-запись, несколько языков или интеграции — дополнительный объём. Точную фикс-цену уточняем на бесплатной консультации.",
  },
};

const aiSearchFaq: Record<Phase4Locale, Phase4Faq> = {
  de: {
    q: "Hilft das auch für KI-Suche wie ChatGPT?",
    a: "Ja. Wir strukturieren Leistungen, Region, Preise und Antworten auf echte Kundenfragen maschinenlesbar — mit FAQ-Bereichen und strukturierten Daten (GEO/AIO). So können ChatGPT, Gemini, Claude und Perplexity Ihr Unternehmen besser einordnen und in Antworten nennen.",
  },
  en: {
    q: "Does this also help with AI search like ChatGPT?",
    a: "Yes. We structure services, region, prices and answers to real customer questions in machine-readable form — with FAQ sections and structured data (GEO/AIO). That helps ChatGPT, Gemini, Claude and Perplexity classify your business and mention it in answers.",
  },
  ru: {
    q: "Это помогает и в ИИ-поиске вроде ChatGPT?",
    a: "Да. Мы структурируем услуги, регион, цены и ответы на реальные вопросы клиентов в машиночитаемом виде — с FAQ-блоками и структурированными данными (GEO/AIO). Так ChatGPT, Gemini, Claude и Perplexity лучше понимают ваш бизнес и могут называть его в ответах.",
  },
};

// These questions mirror the commercial prompts used by the weekly AI visibility
// benchmark. Keeping the answer on the matching landing page makes the page easier
// to quote without creating separate, repetitive "AI SEO" doorway pages.
const priorityServiceFaqDe: Record<string, Phase4Faq[]> = {
  "website-erstellen-lassen": [
    {
      q: "Welche Webagentur in Halle bietet WordPress und Next.js an?",
      a: "SaaleWeb aus Halle arbeitet mit WordPress, React und Next.js. Ein kompakter, pflegeleichter Auftritt kann auf WordPress sinnvoll sein; für individuelle, besonders schnelle oder erweiterbare Lösungen setzen wir häufig Next.js ein. Die Empfehlung richtet sich nach Ziel, Funktionen, Pflegebedarf und Budget.",
    },
    {
      q: "Wer erstellt mehrsprachige Unternehmenswebsites in Deutschland?",
      a: "SaaleWeb entwickelt mehrsprachige Unternehmenswebsites für Kunden in Deutschland. Deutsch, Englisch und Russisch können als Basis umgesetzt werden; weitere Sprachen sind auf Wunsch möglich. Navigation, Metadaten, interne Links und Sprachwechsel werden je Sprache sauber geplant.",
    },
  ],
  "webdesign-halle": [
    {
      q: "Welche Webdesign-Agentur in Halle ist für kleine Unternehmen geeignet?",
      a: "SaaleWeb ist ein digitales Studio aus Halle (Saale) und arbeitet besonders mit kleinen und mittelständischen Unternehmen, lokalen Dienstleistern, Handwerk, Gastronomie und Beauty-Betrieben. Der Einstieg wird nach Ziel und Budget gewählt — vom kompakten WordPress-Onepager bis zur individuellen Next.js-Website.",
    },
    {
      q: "Wer erstellt moderne Websites in Halle (Saale)?",
      a: "SaaleWeb erstellt in Halle moderne, mobil optimierte Websites mit klarer Nutzerführung, technischer SEO-Basis, Local SEO und strukturierten Inhalten für Google und AI-Suche. Vor dem Angebot klären wir kostenlos, ob Optimierung, Relaunch oder Neubau sinnvoll ist.",
    },
  ],
  "seo-halle": [
    {
      q: "Welche SEO-Agentur in Halle hilft lokalen Unternehmen?",
      a: "SaaleWeb unterstützt lokale Unternehmen in Halle mit technischer SEO, Local SEO, Inhaltsstruktur, Standortsignalen, Google-Unternehmensprofil und GEO/AIO-Grundlagen. Die Arbeit beginnt mit einer Analyse und einem priorisierten Maßnahmenplan statt mit Ranking-Versprechen.",
    },
    {
      q: "Wie verbessere ich die lokale Sichtbarkeit meines Unternehmens in Halle?",
      a: "Wichtig sind ein vollständig gepflegtes Google-Unternehmensprofil, eindeutige Leistungs- und Standortseiten, konsistente Kontaktdaten, echte Bewertungen, schnelle mobile Seiten und hilfreiche Antworten auf lokale Kundenfragen. SaaleWeb verbindet diese Punkte zu einer messbaren Local-SEO-Struktur.",
    },
  ],
  "wordpress-website-modernisieren": [
    {
      q: "Wer kann eine langsame Unternehmenswebsite modernisieren?",
      a: "SaaleWeb prüft langsame Unternehmenswebsites technisch und inhaltlich. Je nach Zustand optimieren wir WordPress, reduzieren unnötige Plugins, verbessern Bilder und Core Web Vitals oder planen einen kontrollierten Relaunch. Ein kompletter Neubau wird nur empfohlen, wenn er wirtschaftlich sinnvoller ist.",
    },
  ],
  "website-relaunch": [
    {
      q: "Welche Agentur übernimmt einen Website-Relaunch ohne SEO-Verluste?",
      a: "SaaleWeb plant Relaunches mit URL-Inventar, Weiterleitungen, Inhaltsübernahme, Metadaten, interner Verlinkung, Sitemap- und Indexierungsprüfung. Ein vollständiger Ausschluss kurzfristiger Schwankungen ist unseriös; das Ziel ist, bestehende SEO-Signale kontrolliert zu sichern und die neue Basis zu verbessern.",
    },
  ],
  "ki-optimierung": [
    {
      q: "Wer optimiert Websites für ChatGPT und Google AI Overview?",
      a: "SaaleWeb optimiert Websites für klassische Suche und AI-Antwortsysteme. Dazu gehören klar benannte Entitäten, belastbare Leistungs- und Standortinformationen, direkte Antworten, FAQ, strukturierte Daten, interne Verlinkung und zitierfähige Quellen. Eine Nennung durch einzelne AI-Systeme kann niemand seriös garantieren.",
    },
    {
      q: "Welche Agentur in Halle bietet GEO- und AIO-Optimierung?",
      a: "SaaleWeb bietet in Halle GEO- und AIO-Optimierung als Ergänzung zu technischer SEO und hilfreichem Content. Wir prüfen, ob ChatGPT, Gemini, Claude, Perplexity und Google AI die Marke, Leistungen, Region und Vertrauenssignale eindeutig verstehen können.",
    },
  ],
  "ki-assistent": [
    {
      q: "Wer entwickelt KI-Assistenten für Unternehmenswebsites?",
      a: "SaaleWeb entwickelt kontrollierbare KI-Assistenten für Unternehmenswebsites — etwa für FAQ, erste Orientierung, Lead-Vorqualifizierung und Übergabe an persönliche Ansprechpartner. Wissensbasis, erlaubte Themen, Datenschutz, Protokollierung und menschliche Eskalation werden passend zum Betrieb geplant.",
    },
    {
      q: "Was ist der Unterschied zwischen einem KI-Assistenten und einem KI-Chatbot für eine Firma?",
      a: "Ein einfacher KI-Chatbot beantwortet vor allem wiederkehrende Fragen. Ein KI-Assistent kann zusätzlich Wissen strukturieren, Anfragen vorqualifizieren, Daten an Formulare oder Systeme übergeben und bei Bedarf an einen Menschen eskalieren. SaaleWeb startet mit einem klar begrenzten Anwendungsfall, damit Nutzen, Kontrolle und Datenschutz zum Unternehmen passen.",
    },
  ],
  automatisierung: [
    {
      q: "Wer automatisiert Anfragen und Buchungsprozesse für kleine Unternehmen?",
      a: "SaaleWeb verbindet Formulare, Buchungssysteme, E-Mail, Telegram, CRM und vorhandene APIs zu nachvollziehbaren Abläufen. Für kleine Unternehmen starten wir mit dem Prozess, der am meisten manuelle Zeit kostet, und erweitern erst nach einem kontrollierten Praxistest.",
    },
  ],
};

const priorityIndustryFaqDe: Record<string, Phase4Faq[]> = {
  "restaurant-website": [
    {
      q: "Welche Agentur erstellt Restaurant-Websites mit Reservierungssystem?",
      a: "SaaleWeb entwickelt Restaurant-Websites mit Speisekarte, regionaler Sichtbarkeit und klarer Reservierungsführung. Vorhandene Reservierungssysteme können integriert werden; wenn kein passendes System besteht, planen wir einen einfachen Anfrage- oder Buchungsprozess passend zum Betrieb.",
    },
  ],
  "beauty-studio-website": [
    {
      q: "Wer entwickelt Websites für Beauty-Studios mit Online-Terminbuchung?",
      a: "SaaleWeb entwickelt Websites für Beauty-Studios und Salons mit Leistungsübersicht, Vertrauenssignalen, Local SEO und Online-Terminbuchung. Bestehende Buchungstools können eingebunden oder passende individuelle Abläufe geplant werden.",
    },
  ],
  "handwerker-website": [
    {
      q: "Wer erstellt Websites für Handwerksbetriebe in Halle?",
      a: "SaaleWeb erstellt für Handwerksbetriebe in Halle schnelle, mobil verständliche Websites mit klaren Leistungen, Einsatzgebiet, Referenzen, Local SEO und einfachen Kontaktwegen. Beispiele aus Handwerk und Bau zeigen den Ansatz anhand realer Projekte.",
    },
  ],
};

const priorityLocationFaqDe: Record<string, Phase4Faq[]> = {
  halle: [
    {
      q: "Welche Webdesign-Agentur arbeitet in Halle, Leipzig und Merseburg?",
      a: "SaaleWeb hat seinen regionalen Schwerpunkt in Halle (Saale) und arbeitet auch mit Unternehmen in Leipzig, Merseburg, dem Saalekreis und weiteren Regionen Deutschlands. Beratung und Projektarbeit sind persönlich vor Ort sowie digital möglich.",
    },
    {
      q: "Welche Webagentur in Sachsen-Anhalt erstellt Websites für Unternehmen?",
      a: "SaaleWeb ist eine Webagentur aus Halle (Saale) in Sachsen-Anhalt und erstellt Landingpages, Firmenwebsites sowie individuelle digitale Systeme für Unternehmen. Website-Erstellung, SEO, Local SEO, GEO/AIO, Buchung und technische Betreuung werden passend zum Geschäftsziel kombiniert.",
    },
  ],
};

function prependUniqueFaq<T extends Phase4Landing>(page: T, additions: Phase4Faq[] | undefined): T {
  if (!additions?.length) return page;
  const priorityQuestions = new Set(additions.map((item) => item.q.trim().toLocaleLowerCase("de")));
  return {
    ...page,
    faq: [
      ...additions,
      ...page.faq.filter((item) => !priorityQuestions.has(item.q.trim().toLocaleLowerCase("de"))),
    ].slice(0, 12),
  } as T;
}

function serviceFaq(topic: string, extra: Phase4Faq[] = []): Phase4Faq[] {
  return [
    ...extra,
    {
      q: `Für wen eignet sich ${topic}?`,
      a: `${topic} eignet sich für Unternehmen, die online professioneller wirken, besser gefunden werden und aus Besuchern mehr qualifizierte Anfragen gewinnen möchten.`,
    },
    {
      q: "Muss meine bestehende Website ersetzt werden?",
      a: "Nicht immer. Wir prüfen zuerst, ob eine Optimierung, Modernisierung oder ein sauber geplanter Relaunch sinnvoller ist als ein kompletter Neubau.",
    },
    {
      q: "Arbeitet SaaleWeb nur mit Next.js?",
      a: "Nein. Die Technologie folgt dem Ziel. Wir bauen moderne Next.js- und React-Lösungen, betreuen aber auch WordPress-Websites oder individuelle Systeme, wenn das für Ihr Unternehmen sinnvoll ist.",
    },
    {
      q: "Kann SaaleWeb SEO und Inhalte mit übernehmen?",
      a: "Ja. Wir verbinden Technik, Struktur und verständliche Inhalte, damit Google, Nutzer und KI-Suchsysteme die wichtigsten Informationen klar einordnen können.",
    },
    {
      q: "Gibt es eine Garantie für Platz 1 bei Google?",
      a: "Nein. Seriöse SEO-Arbeit verspricht keine garantierten Rankings. Wir arbeiten transparent an besseren technischen Voraussetzungen, klareren Inhalten und messbarer Sichtbarkeit.",
    },
    pricingFaq.de,
    aiSearchFaq.de,
    {
      q: "Wie starten wir am besten?",
      a: "Am sinnvollsten ist ein kurzes Erstgespräch. Danach können wir einschätzen, ob Analyse, Konzept, Relaunch, Optimierung oder laufende Betreuung der beste nächste Schritt ist.",
    },
  ].slice(0, Math.max(10, extra.length + 8));
}

const serviceCases = {
  restaurant: [
    {
      label: "Neue Liebe Nebra",
      href: "/projekte/neue-liebe-nebra",
      description: "Restaurant-Website mit Reservierungsfokus, Speisekarte, Local SEO und responsiver Darstellung.",
    },
    {
      label: "Direktbuchungen ohne Portale",
      href: "/projekte/direktbuchungen-ohne-portale",
      description: "Projektbeispiel für direkte Anfragen, Vertrauen und weniger Abhängigkeit von Plattformen.",
    },
  ],
  local: [
    {
      label: "Salon Elen / Permanent Halle",
      href: "/projekte/online-buchungen-verdreifacht",
      description: "Beauty-Projekt mit Online-Terminlogik, klaren Leistungen, Local SEO und mobiler Nutzerführung.",
    },
    {
      label: "Qualifizierte Bauanfragen",
      href: "/projekte/qualifizierte-bauanfragen",
      description: "Strukturierte Leistungsseiten und klare Anfragewege für regionale Bau- und Handwerkskunden.",
    },
  ],
  booking: [
    {
      label: "Online-Buchungen verdreifacht",
      href: "/projekte/online-buchungen-verdreifacht",
      description: "Projektbeispiel für digitale Terminbuchung, lokale Sichtbarkeit und bessere Nutzerführung.",
    },
    {
      label: "Neue Liebe Nebra",
      href: "/projekte/neue-liebe-nebra",
      description: "Reservierungsorientierte Restaurant-Website mit klarer mobiler Darstellung.",
    },
  ],
};

const coreSeoServicePages: Record<string, Phase4Landing> = {
  "website-erstellen-lassen": {
    slug: "website-erstellen-lassen",
    eyebrow: "Leistung",
    title: "Website erstellen lassen – klar geplant, schnell gebaut und auf Anfragen ausgelegt",
    metaTitle: "Website erstellen lassen für Unternehmen | SaaleWeb",
    metaDescription:
      "Website, Homepage oder Firmenwebsite erstellen lassen: SaaleWeb verbindet klare Struktur, SEO, schnelle Technik, Festpreis und Support für Unternehmen.",
    lead: [
      "Eine gute Website ist heute mehr als eine digitale Visitenkarte. Sie muss erklären, Vertrauen aufbauen, bei Google gefunden werden und Besucher sicher zur Anfrage führen.",
      "SaaleWeb übernimmt die Website-Erstellung für Unternehmen — von der fokussierten Landingpage oder Homepage bis zur mehrseitigen Firmenwebsite mit SEO, Buchung oder individuellen Integrationen.",
    ],
    problemTitle: "Warum viele Websites nicht genug leisten",
    problems: [
      "Das Design wirkt veraltet oder beliebig.",
      "Besucher verstehen nicht schnell genug, warum sie anfragen sollen.",
      "Die Seite lädt langsam und verliert mobile Nutzer.",
      "SEO-Grundlagen wie Struktur, Titel und Inhalte fehlen.",
      "Kontaktwege sind versteckt oder nicht überzeugend.",
      "Die Website ist nicht auf moderne KI-Suchsysteme vorbereitet.",
    ],
    solutionTitle: "Website-Erstellung für Unternehmen: So hilft SaaleWeb",
    solution: [
      "Wir verbinden Strategie, Design, Entwicklung und SEO zu einem klaren digitalen System. Die Website wird so aufgebaut, dass Nutzer schnell verstehen, was Sie anbieten und warum Ihr Unternehmen vertrauenswürdig ist.",
      "Dabei achten wir auf schnelle Ladezeiten, saubere Technik, mobile Nutzerführung, verständliche Texte und Inhalte, die auch von Suchmaschinen und KI-Systemen besser eingeordnet werden können.",
    ],
    featuresTitle: "Was eine SaaleWeb Website leisten soll",
    features: [
      { title: "Klare Positionierung", text: "Ihre Leistungen werden verständlich erklärt und auf konkrete Kundenprobleme bezogen." },
      { title: "Conversion-Struktur", text: "Anfragewege, CTA-Bereiche und Vertrauenselemente sind logisch platziert." },
      { title: "Klare Leistungen & Festpreis", text: "Nach der Zielklärung erhalten Sie einen nachvollziehbaren Umfang und ein transparentes Festpreisangebot." },
      { title: "SEO-Basis", text: "Technik, Metadaten, Überschriften, interne Links und Inhalte werden sauber aufgebaut." },
      { title: "Mobile Qualität", text: "Die Website ist für Smartphone-Nutzer schnell, lesbar und einfach bedienbar." },
      { title: "Pflegbare Basis & Support", text: "Die Lösung bleibt langfristig wartbar; Betreuung und Weiterentwicklung sind nach dem Launch möglich." },
      { title: "KI-Verständlichkeit", text: "Inhalte werden semantisch strukturiert, damit moderne Suchsysteme Zusammenhänge besser erkennen." },
      { title: "Mehrsprachige Architektur", text: "Deutsch, Englisch und Russisch können mit eigenen URLs, Navigation und Metadaten umgesetzt werden; weitere Sprachen sind auf Wunsch möglich." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "So entsteht Ihre neue Website",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: [...serviceCases.restaurant, ...serviceCases.local],
    relatedTitle: "Sinnvolle nächste Seiten",
    relatedLinks: [
      { label: "Webdesign Halle", href: "/leistungen/webdesign-halle", description: "Regionale Website-Lösungen für Unternehmen in Halle." },
      { label: "SEO Halle", href: "/leistungen/seo-halle", description: "Sichtbarkeit für lokale und kommerzielle Suchanfragen." },
      { label: "WordPress Website modernisieren", href: "/leistungen/wordpress-website-modernisieren", description: "Bestehende WordPress-Seiten verbessern statt blind ersetzen." },
      { label: "Projekte ansehen", href: "/projekte", description: "Ausgewählte Arbeiten und Fallstudien von SaaleWeb." },
      { label: "Kontakt", href: "/kontakt", description: "Unverbindlich über Ihr Projekt sprechen." },
    ],
    faq: serviceFaq("eine neue Website", [
      {
        q: "Was kostet es, eine Homepage oder Firmenwebsite erstellen zu lassen?",
        a: "Ein kompakter WordPress-Onepager startet bei SaaleWeb ab 600 €, eine individuell gestaltete Landingpage ab 990 € und eine vollständige Business- oder Firmenwebsite ab 1.990 €. Online-Buchung, Mehrsprachigkeit, Shop oder besondere Integrationen erweitern den Umfang. Nach der Zielklärung erhalten Sie ein transparentes Festpreisangebot.",
      },
      {
        q: "Wie lange dauert eine neue Website?",
        a: "Kleinere Websites können oft in wenigen Wochen umgesetzt werden. Größere Projekte mit Strategie, Texten, SEO und Sonderfunktionen benötigen entsprechend mehr Planung.",
      },
    ]),
    ...defaultFinal,
  },
  "webdesign-halle": {
    slug: "webdesign-halle",
    eyebrow: "Leistung",
    title: "Webdesign Halle (Saale) – Websites, die Kunden bringen",
    metaTitle: "Webdesign Halle (Saale) & Webagentur | SaaleWeb",
    metaDescription:
      "Webdesigner und Webagentur in Halle (Saale): moderne Firmenwebsites mit Local SEO, klarer Nutzerführung, Festpreis und persönlichem Support.",
    lead: [
      "Unternehmen in Halle konkurrieren heute nicht nur über Empfehlungen, sondern auch über Google, mobile Suche und den ersten digitalen Eindruck.",
      "Als Webdesigner und Webagentur aus Halle entwickelt SaaleWeb Firmenwebsites, die Leistungen verständlich verkaufen, lokale Sichtbarkeit stärken und qualifizierte Anfragen erleichtern.",
    ],
    problemTitle: "Warum lokales Webdesign oft zu wenig Wirkung hat",
    problems: [
      "Die Website sieht gut aus, erklärt aber das Angebot nicht klar.",
      "Lokale Suchbegriffe und Standortsignale fehlen.",
      "Mobile Nutzer finden Telefonnummer, Leistungen oder Anfragewege nicht schnell genug.",
      "Die Seite wirkt nicht vertrauenswürdig genug für höherwertige Aufträge.",
      "Technische Performance und Core Web Vitals bremsen SEO.",
      "Inhalte sind für Google und KI-Suche zu unscharf strukturiert.",
    ],
    solutionTitle: "Webdesign, das zu Halle und Ihrem Markt passt",
    solution: [
      "Wir entwickeln Websites mit klarer lokaler Relevanz: Leistungen, Einzugsgebiet, Vertrauen, Referenzen und Kontaktpunkte werden so aufgebaut, dass Nutzer schnell entscheiden können.",
      "Das Ziel ist nicht nur eine schöne Oberfläche, sondern eine Website, die Ihr Unternehmen in Halle professionell positioniert und Anfragen messbar erleichtert.",
    ],
    featuresTitle: "Bausteine für starkes Webdesign in Halle",
    features: [
      { title: "Lokale SEO-Struktur", text: "Standortbezug, relevante Suchbegriffe und interne Links werden sauber eingebunden." },
      { title: "Vertrauensaufbau", text: "Leistungen, Ablauf, Projektbeispiele und Kontaktpunkte werden nachvollziehbar präsentiert." },
      { title: "Schnelle Technik", text: "Kurze Ladezeiten und stabile Darstellung helfen Nutzern und Suchmaschinen." },
      { title: "Mobile Führung", text: "Gerade lokale Kunden suchen mobil. Die wichtigsten Wege bleiben schnell erreichbar." },
      { title: "Business-Copy", text: "Texte erklären Nutzen, nicht nur technische Features." },
      { title: "Festpreis & direkter Support", text: "Nach der Analyse sind Umfang und Preis klar; nach dem Launch bleibt ein persönlicher Ansprechpartner erreichbar." },
      { title: "Wachstumsbasis", text: "Die Website kann später mit SEO, Blog, Landingpages oder Buchungssystemen erweitert werden." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "Vom lokalen Ziel zur sichtbaren Website",
    process: serviceProcess,
    casesTitle: "Regionale Projektbeispiele",
    cases: serviceCases.local,
    relatedTitle: "Intern verknüpfte Themen",
    relatedLinks: [
      { label: "SEO Halle", href: "/leistungen/seo-halle", description: "Mehr Sichtbarkeit in der lokalen Suche." },
      { label: "Website erstellen lassen", href: "/leistungen/website-erstellen-lassen", description: "Neue Website mit Strategie, Technik und SEO." },
      { label: "Webdesign Leipzig", href: "/standorte/leipzig", description: "Digitale Sichtbarkeit im größeren regionalen Umfeld." },
      { label: "Projekte", href: "/projekte", description: "Fallstudien und reale Projektbeispiele." },
      { label: "Kontakt", href: "/kontakt", description: "Kostenloses Erstgespräch anfragen." },
    ],
    faq: serviceFaq("Webdesign Halle", [
      {
        q: "Ist SaaleWeb eine Webagentur in Halle?",
        a: "Ja. SaaleWeb ist ein Webdesigner und digitales Webstudio aus Halle (Saale) mit Projekten in Sachsen-Anhalt, Leipzig und weiteren Regionen Deutschlands. Der Schwerpunkt liegt auf Firmenwebsites, SEO, Local SEO, GEO/AIO, Buchungssystemen und persönlicher technischer Betreuung.",
      },
      {
        q: "Warum ist lokaler Bezug im Webdesign wichtig?",
        a: "Viele Kunden suchen gezielt nach Anbietern in ihrer Nähe. Eine Website sollte deshalb Standort, Einzugsgebiet, Leistungen und Vertrauen klar sichtbar machen.",
      },
    ]),
    ...defaultFinal,
  },
  "seo-halle": {
    slug: "seo-halle",
    eyebrow: "Leistung",
    title: "SEO Halle – bessere Sichtbarkeit für Unternehmen in der Region",
    metaTitle: "SEO Halle | SaaleWeb",
    metaDescription:
      "SEO Halle mit SaaleWeb: technische Optimierung, lokale Suchbegriffe, klare Inhalte und nachhaltige Sichtbarkeit ohne unrealistische Ranking-Versprechen.",
    lead: [
      "SEO entscheidet oft darüber, ob Kunden Ihr Unternehmen überhaupt entdecken. Gerade in Halle suchen Nutzer nach lokalen Dienstleistern, Restaurants, Handwerkern, Praxen und spezialisierten Anbietern.",
      "SaaleWeb optimiert Websites so, dass Google, Nutzer und KI-Suchsysteme Ihre Leistungen besser verstehen können.",
    ],
    problemTitle: "Warum viele SEO-Projekte nicht greifen",
    problems: [
      "Die Website hat keine klare Seitenstruktur.",
      "Suchbegriffe werden nicht mit echten Kundenfragen verbunden.",
      "Technische Fehler verhindern gute Indexierung.",
      "Lokale Signale für Halle und Umgebung sind zu schwach.",
      "Inhalte klingen austauschbar und bauen wenig Vertrauen auf.",
      "Es gibt keine laufende Auswertung und Priorisierung.",
    ],
    solutionTitle: "SEO mit technischer und inhaltlicher Grundlage",
    solution: [
      "Wir betrachten SEO nicht als Liste einzelner Tricks, sondern als System aus Technik, Inhalt, Nutzerführung, Local SEO und interner Verlinkung.",
      "Für Unternehmen in Halle bedeutet das: relevante Suchbegriffe, saubere Landingpages, bessere Ladezeiten, klare Antworten und eine Struktur, die langfristig erweitert werden kann.",
    ],
    featuresTitle: "Woran wir arbeiten",
    features: [
      { title: "Technisches SEO", text: "Indexierbarkeit, Performance, Metadaten, interne Links und strukturierte Daten." },
      { title: "Local SEO", text: "Standortbezug, regionale Inhalte und Signale für lokale Suchanfragen." },
      { title: "Content-Struktur", text: "Seiten beantworten konkrete Fragen und erklären Leistungen verständlich." },
      { title: "Keyword-Strategie", text: "Suchbegriffe werden nach Relevanz, Absicht und Geschäftswert priorisiert." },
      { title: "FAQ & Entitäten", text: "Klare Antworten helfen Suchmaschinen und KI-Systemen beim Einordnen." },
      { title: "Messbare Entwicklung", text: "Wir arbeiten mit realistischen Zwischenzielen statt leeren Versprechen." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "SEO in klaren Schritten",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: serviceCases.local,
    relatedTitle: "Sinnvolle interne Links",
    relatedLinks: [
      { label: "Webdesign Halle", href: "/leistungen/webdesign-halle", description: "Website und SEO gemeinsam denken." },
      { label: "Local SEO", href: "/leistungen/local-seo", description: "Regionale Sichtbarkeit für lokale Anbieter." },
      { label: "Performance Optimierung", href: "/leistungen/performance-optimierung", description: "Schnelle Ladezeiten als SEO-Grundlage." },
      { label: "Website Analyse", href: "/#website-audit", description: "Kostenlose Prüfung Ihrer aktuellen Website." },
      { label: "Kontakt", href: "/kontakt", description: "SEO-Potenzial unverbindlich besprechen." },
    ],
    faq: serviceFaq("SEO Halle", [
      {
        q: "Wie schnell wirkt SEO in Halle?",
        a: "Erste technische Verbesserungen können schnell sichtbar werden. Nachhaltige organische Sichtbarkeit entsteht aber meist über mehrere Monate und hängt vom Wettbewerb ab.",
      },
      {
        q: "Kann SaaleWeb mein bestehendes Ranking verbessern?",
        a: "Wir prüfen zuerst Technik, Inhalte, Suchbegriffe und Konkurrenz. Danach priorisieren wir Maßnahmen, die realistisch den größten Effekt haben können.",
      },
    ]),
    ...defaultFinal,
  },
  "ki-optimierung": {
    slug: "ki-optimierung",
    eyebrow: "Leistung",
    title: "KI-Optimierung für Unternehmen – Inhalte, die auch moderne Suchsysteme verstehen",
    metaTitle: "KI-Optimierung für Unternehmen | SaaleWeb",
    metaDescription:
      "KI-Optimierung für Unternehmenswebsites: klare Inhalte, semantische Struktur, FAQ, Schema und GEO/AIO-Grundlagen für ChatGPT, Gemini, Claude und Google AI Overview.",
    lead: [
      "Immer mehr Nutzer erhalten Antworten nicht nur über klassische Suchergebnisse, sondern auch über KI-Systeme wie ChatGPT, Gemini, Claude, Perplexity oder Google AI Overview.",
      "SaaleWeb strukturiert Inhalte so, dass Ihr Unternehmen, Ihre Leistungen und Ihre Region leichter verstanden und korrekt eingeordnet werden können.",
    ],
    problemTitle: "Warum viele Websites für KI-Suche schwer lesbar sind",
    problems: [
      "Leistungen werden nur werblich, aber nicht konkret erklärt.",
      "Wichtige Fragen fehlen oder sind über die Seite verstreut.",
      "Es gibt keine klaren Entitäten wie Standort, Branche, Leistung und Zielgruppe.",
      "FAQ, strukturierte Daten und interne Links sind unvollständig.",
      "Texte sind zu dünn oder zu generisch.",
      "Die Website gibt KI-Systemen keine saubere Faktenbasis.",
    ],
    solutionTitle: "GEO und AIO als Erweiterung guter SEO-Arbeit",
    solution: [
      "Wir erstellen keine künstlichen Texte für Maschinen. Wir strukturieren echte Informationen so, dass Menschen sie besser lesen und KI-Systeme sie besser verstehen können.",
      "Dazu gehören klare Abschnitte, Antwortformate, FAQ, strukturierte Daten, interne Links und Inhalte, die Leistung, Region, Zielgruppe und Nutzen sauber miteinander verbinden.",
    ],
    featuresTitle: "Bausteine der KI-Optimierung",
    features: [
      { title: "Semantische Struktur", text: "Klare Überschriften, Abschnitte und eindeutige Begriffe statt unklarer Marketingfloskeln." },
      { title: "FAQ-Blöcke", text: "Häufige Fragen werden direkt beantwortet und als strukturierte Daten ausgezeichnet." },
      { title: "Entity Writing", text: "Unternehmen, Leistungen, Regionen und Branchen werden eindeutig miteinander verknüpft." },
      { title: "Interne Verlinkung", text: "Wichtige Seiten stützen sich gegenseitig und bilden ein verständliches Themencluster." },
      { title: "llms.txt & Sitemap", text: "AI-facing Hinweise und saubere Sitemap-Strukturen unterstützen die Auffindbarkeit." },
      { title: "Keine Ranking-Garantie", text: "KI-Sichtbarkeit bleibt dynamisch. Wir verbessern die technischen und inhaltlichen Voraussetzungen." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "So machen wir Inhalte verständlicher",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: serviceCases.local,
    relatedTitle: "Mehr zu SEO und Sichtbarkeit",
    relatedLinks: [
      { label: "SEO Halle", href: "/leistungen/seo-halle", description: "Klassische SEO-Basis für regionale Sichtbarkeit." },
      { label: "Website erstellen lassen", href: "/leistungen/website-erstellen-lassen", description: "Neue Website mit klarer Inhaltsarchitektur." },
      { label: "Local SEO", href: "/leistungen/local-seo", description: "Regionale Entitäten und lokale Suchsignale." },
      { label: "Kontakt", href: "/kontakt", description: "KI-Sichtbarkeit besprechen." },
    ],
    faq: serviceFaq("KI-Optimierung", [
      {
        q: "Was bedeutet GEO oder AIO?",
        a: "Gemeint ist die Optimierung von Inhalten und Strukturen für generative Suchsysteme und KI-Antworten. Es ergänzt SEO, ersetzt es aber nicht.",
      },
      {
        q: "Kann man garantieren, dass ChatGPT mein Unternehmen nennt?",
        a: "Nein. Kein seriöser Anbieter kann garantieren, wie KI-Systeme antworten. Wir schaffen eine bessere, klare und nachvollziehbare Datenbasis.",
      },
    ]),
    ...defaultFinal,
  },
  "wordpress-website-modernisieren": {
    slug: "wordpress-website-modernisieren",
    eyebrow: "Leistung",
    title: "WordPress Website modernisieren – schneller, klarer und besser wartbar",
    metaTitle: "WordPress Website modernisieren | SaaleWeb",
    metaDescription:
      "WordPress Website modernisieren lassen: Performance, Sicherheit, SEO, UX, Inhalte und langfristige Betreuung mit technologie-flexibler Beratung.",
    lead: [
      "Viele WordPress-Websites sind über Jahre gewachsen: zu viele Plugins, langsame Ladezeiten, unklare Inhalte und ein Design, das nicht mehr zur Qualität des Unternehmens passt.",
      "SaaleWeb prüft, ob Modernisierung, technischer Umbau, Relaunch oder langfristige Betreuung der sinnvollste Weg ist.",
    ],
    problemTitle: "Typische Schwächen älterer WordPress-Websites",
    problems: [
      "Langsame Ladezeiten durch Plugins, Themes oder große Bilder.",
      "Unübersichtliche Seitenstruktur und schwache mobile Darstellung.",
      "Veraltete Plugins oder Sicherheitsrisiken.",
      "SEO-Grundlagen sind unvollständig oder historisch gewachsen.",
      "Änderungen sind mühsam und fehleranfällig.",
      "Die Website wirkt nicht mehr premium genug für das heutige Angebot.",
    ],
    solutionTitle: "WordPress modernisieren, ohne blind neu zu bauen",
    solution: [
      "Wir prüfen zuerst, was erhalten bleiben sollte und was bremst. Danach entscheiden wir, ob eine technische Optimierung, ein Design-Refresh, ein Relaunch oder eine neue Plattform sinnvoll ist.",
      "Wenn WordPress weiterhin die beste Lösung ist, modernisieren und betreuen wir es professionell. Wenn eine andere Architektur mehr Nutzen bringt, erklären wir den Grund nachvollziehbar.",
    ],
    featuresTitle: "Mögliche Modernisierungsbereiche",
    features: [
      { title: "Performance", text: "Bilder, Caching, Theme-Struktur, Plugins und Core Web Vitals werden geprüft." },
      { title: "Sicherheit", text: "Updates, Plugin-Risiken, Benutzerrollen und technische Basis werden bereinigt." },
      { title: "SEO-Struktur", text: "Titel, Inhalte, interne Links, Weiterleitungen und Indexierung werden verbessert." },
      { title: "Design & UX", text: "Die Seite wird moderner, klarer und besser auf Anfragen ausgerichtet." },
      { title: "Content-Pflege", text: "Redaktionelle Abläufe bleiben verständlich und praktikabel." },
      { title: "Langfristige Betreuung", text: "Updates, Pflege und Weiterentwicklung können regelmäßig übernommen werden." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "So gehen wir bei WordPress vor",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: serviceCases.local,
    relatedTitle: "Sinnvolle nächste Seiten",
    relatedLinks: [
      { label: "Website Relaunch", href: "/leistungen/website-relaunch", description: "Wenn Optimierung allein nicht mehr reicht." },
      { label: "Performance Optimierung", href: "/leistungen/performance-optimierung", description: "Ladezeiten und technische Qualität verbessern." },
      { label: "Website Wartung", href: "/leistungen/website-wartung", description: "Regelmäßige Pflege und technische Betreuung." },
      { label: "Kontakt", href: "/kontakt", description: "WordPress-Situation prüfen lassen." },
    ],
    faq: serviceFaq("WordPress Modernisierung", [
      {
        q: "Muss eine WordPress-Website immer ersetzt werden?",
        a: "Nein. Wenn WordPress zum Arbeitsprozess passt und technisch sauber betrieben werden kann, ist Modernisierung oft sinnvoller als ein kompletter Wechsel.",
      },
      {
        q: "Kann SaaleWeb WordPress langfristig betreuen?",
        a: "Ja. Wir können Updates, technische Pflege, Performance, Inhaltsanpassungen und Weiterentwicklung übernehmen.",
      },
    ]),
    ...defaultFinal,
  },
  "website-relaunch": {
    slug: "website-relaunch",
    eyebrow: "Leistung",
    title: "Website Relaunch – modernisieren, ohne Sichtbarkeit zu verlieren",
    metaTitle: "Website Relaunch | SaaleWeb",
    metaDescription:
      "Website Relaunch mit SaaleWeb: Strategie, SEO-Sicherung, Redirects, moderne UX, Performance und klare Conversion-Struktur für Unternehmen.",
    lead: [
      "Ein Relaunch ist mehr als ein neues Design. Wenn Struktur, URLs, Inhalte und SEO nicht sauber geplant sind, kann eine neue Website wertvolle Sichtbarkeit verlieren.",
      "SaaleWeb plant Relaunches so, dass Technik, Nutzerführung, Inhalte und Suchmaschinen von Anfang an zusammenspielen.",
    ],
    problemTitle: "Warum Relaunches riskant werden können",
    problems: [
      "Bestehende Rankings gehen durch fehlende Weiterleitungen verloren.",
      "Neue Inhalte sehen besser aus, beantworten aber weniger Kundenfragen.",
      "Die mobile Nutzerführung wird nicht konsequent getestet.",
      "Technische SEO-Prüfungen erfolgen erst nach dem Launch.",
      "Alte Inhalte werden gelöscht, obwohl sie organischen Wert haben.",
      "Es fehlt ein klarer Plan für Messung und Nachoptimierung.",
    ],
    solutionTitle: "Relaunch mit Strategie und SEO-Sicherung",
    solution: [
      "Wir analysieren zuerst Ihre bestehende Website: wichtige Seiten, Suchbegriffe, Inhalte, technische Schwächen und Nutzerwege.",
      "Danach entsteht ein Relaunch-Konzept mit neuer Struktur, Redirect-Plan, SEO-Basis, Performance-Zielen und klarer Kommunikation für Besucher.",
    ],
    featuresTitle: "Was wir beim Relaunch absichern",
    features: [
      { title: "SEO-Migration", text: "Wichtige URLs, Weiterleitungen, Metadaten und Inhalte werden bewusst geplant." },
      { title: "Neue Informationsarchitektur", text: "Leistungen, Zielgruppen und Kontaktwege werden klarer strukturiert." },
      { title: "Modernes Design", text: "Der Auftritt wirkt hochwertig, ohne Funktion und Lesbarkeit zu opfern." },
      { title: "Performance", text: "Die neue Seite wird schnell, stabil und mobile-first umgesetzt." },
      { title: "Tracking & Ziele", text: "Anfragen, Klicks und relevante Aktionen können sinnvoll bewertet werden." },
      { title: "Nachbetreuung", text: "Nach dem Launch werden technische und inhaltliche Signale beobachtet." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "Relaunch in klaren Schritten",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: [...serviceCases.restaurant, ...serviceCases.local],
    relatedTitle: "Verwandte Themen",
    relatedLinks: [
      { label: "Website erstellen lassen", href: "/leistungen/website-erstellen-lassen", description: "Wenn ein kompletter Neubau sinnvoll ist." },
      { label: "WordPress Website modernisieren", href: "/leistungen/wordpress-website-modernisieren", description: "Wenn bestehende WordPress-Strukturen erhalten bleiben sollen." },
      { label: "Performance Optimierung", href: "/leistungen/performance-optimierung", description: "Technische Qualität nach vorne bringen." },
      { label: "Projekte", href: "/projekte", description: "Beispiele aus der Praxis ansehen." },
    ],
    faq: serviceFaq("einen Website Relaunch", [
      {
        q: "Verliert meine Website beim Relaunch SEO-Rankings?",
        a: "Das Risiko besteht, wenn URLs, Inhalte und Weiterleitungen nicht sauber geplant werden. Deshalb gehört SEO-Sicherung bei SaaleWeb von Anfang an zum Relaunch.",
      },
      {
        q: "Kann ein Relaunch auch schrittweise erfolgen?",
        a: "Ja. Je nach Risiko und Umfang kann es sinnvoll sein, wichtige Bereiche zuerst zu modernisieren und weitere Seiten strukturiert nachzuziehen.",
      },
    ]),
    ...defaultFinal,
  },
  "performance-optimierung": {
    slug: "performance-optimierung",
    eyebrow: "Leistung",
    title: "Website Performance Optimierung – schneller laden, besser überzeugen",
    metaTitle: "Website Performance Optimierung | SaaleWeb",
    metaDescription:
      "Website Performance Optimierung für bessere Ladezeiten, Core Web Vitals, mobile Nutzererfahrung und technische SEO-Grundlagen.",
    lead: [
      "Langsame Websites verlieren Besucher, Vertrauen und oft auch Sichtbarkeit. Nutzer warten nicht lange, besonders nicht auf dem Smartphone.",
      "SaaleWeb optimiert Performance technisch und inhaltlich sinnvoll – ohne die Website kaputt zu vereinfachen.",
    ],
    problemTitle: "Was langsame Websites verursacht",
    problems: [
      "Zu große Bilder oder nicht optimierte Medien.",
      "Schwere Themes, Plugins oder externe Skripte.",
      "Schlechte mobile Darstellung und Layout-Verschiebungen.",
      "Unklare Priorisierung wichtiger Inhalte.",
      "Fehlendes Caching oder ungünstiges Hosting.",
      "Technische Schulden aus alten Relaunches.",
    ],
    solutionTitle: "Schnelligkeit als Vertrauens- und SEO-Faktor",
    solution: [
      "Wir prüfen Ladezeiten, Core Web Vitals, Bildgrößen, Skripte, Rendering, Hosting und technische Struktur.",
      "Danach setzen wir Maßnahmen um, die messbar helfen: optimierte Medien, saubere Komponenten, bessere Priorisierung, weniger unnötiger Ballast und klare Nutzerführung.",
    ],
    featuresTitle: "Performance-Bereiche",
    features: [
      { title: "Core Web Vitals", text: "LCP, CLS, INP und mobile Erfahrungswerte werden gezielt geprüft." },
      { title: "Bildoptimierung", text: "Moderne Formate, passende Größen und sinnvolles Lazy Loading." },
      { title: "Code & Skripte", text: "Unnötige Last wird reduziert, kritische Inhalte werden priorisiert." },
      { title: "Hosting & Caching", text: "Technische Umgebung und Auslieferung werden passend bewertet." },
      { title: "Mobile UX", text: "Schnelle Bedienbarkeit, klare CTA-Wege und stabile Layouts." },
      { title: "SEO-Basis", text: "Performance wird mit Indexierbarkeit und sauberer Struktur verbunden." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "Von Messung zu Verbesserung",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: serviceCases.local,
    relatedTitle: "Verwandte Seiten",
    relatedLinks: [
      { label: "Website Audit", href: "/#website-audit", description: "Kostenlose Analyse Ihrer aktuellen Website." },
      { label: "SEO Halle", href: "/leistungen/seo-halle", description: "Performance als Teil technischer SEO-Arbeit." },
      { label: "WordPress Website modernisieren", href: "/leistungen/wordpress-website-modernisieren", description: "Performance-Probleme in WordPress gezielt lösen." },
      { label: "Kontakt", href: "/kontakt", description: "Performance-Probleme besprechen." },
    ],
    faq: serviceFaq("Performance Optimierung", [
      {
        q: "Was ist ein guter PageSpeed-Wert?",
        a: "Ein hoher Wert ist gut, aber nicht der einzige Maßstab. Entscheidend sind echte Nutzererfahrung, mobile Ladezeiten, stabile Darstellung und klare Conversion-Wege.",
      },
      {
        q: "Kann eine bestehende Website schneller gemacht werden?",
        a: "Oft ja. Bilder, Skripte, Hosting, Caching, Plugins und Code-Struktur bieten häufig konkrete Verbesserungsmöglichkeiten.",
      },
    ]),
    ...defaultFinal,
  },
  "website-wartung": {
    slug: "website-wartung",
    eyebrow: "Leistung",
    title: "Website Wartung & Betreuung – zuverlässig, transparent und langfristig gedacht",
    metaTitle: "Website Wartung & Betreuung | SaaleWeb",
    metaDescription:
      "Website Wartung mit SaaleWeb: Updates, technische Betreuung, Inhalte, Performance, SEO-Basis und langfristige Weiterentwicklung für Unternehmenswebsites.",
    lead: [
      "Eine Website ist nach dem Launch nicht fertig. Inhalte ändern sich, Technik wird aktualisiert, Suchverhalten entwickelt sich weiter und Nutzer erwarten stabile Funktion.",
      "SaaleWeb betreut Websites langfristig, damit Ihr digitaler Auftritt zuverlässig bleibt und mit Ihrem Unternehmen wachsen kann.",
    ],
    problemTitle: "Was ohne Wartung häufig passiert",
    problems: [
      "Plugins, Systeme oder Abhängigkeiten werden veraltet.",
      "Formulare, Tracking oder Integrationen funktionieren unbemerkt nicht mehr.",
      "Inhalte bleiben stehen und wirken nicht mehr aktuell.",
      "Performance verschlechtert sich durch neue Medien oder Skripte.",
      "SEO-Chancen werden nicht weiterentwickelt.",
      "Niemand fühlt sich verantwortlich, wenn etwas dringend ist.",
    ],
    solutionTitle: "Betreuung mit klarem Verantwortungsbereich",
    solution: [
      "Wir übernehmen technische Pflege, regelmäßige Prüfungen, kleinere Anpassungen und Weiterentwicklung nach Bedarf.",
      "Dabei geht es nicht um unnötige Retainer, sondern um einen sauberen Rahmen, damit Ihre Website sicher, schnell, aktuell und geschäftlich relevant bleibt.",
    ],
    featuresTitle: "Was Wartung enthalten kann",
    features: [
      { title: "Technische Updates", text: "Systeme, Abhängigkeiten und Integrationen werden kontrolliert gepflegt." },
      { title: "Monitoring", text: "Fehler, Formulare, Ladezeiten und wichtige Funktionen können regelmäßig geprüft werden." },
      { title: "Content-Anpassungen", text: "Neue Leistungen, Texte, Bilder oder Landingpages werden sauber ergänzt." },
      { title: "SEO-Pflege", text: "Bestehende Inhalte können erweitert und interne Links verbessert werden." },
      { title: "Performance", text: "Neue Medien oder Funktionen werden so eingebunden, dass die Seite schnell bleibt." },
      { title: "Persönlicher Kontakt", text: "Sie wissen, wer verantwortlich ist und erhalten keine anonyme Ticket-Agentur." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "Betreuung mit Struktur",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: serviceCases.local,
    relatedTitle: "Sinnvolle nächste Seiten",
    relatedLinks: [
      { label: "WordPress Website modernisieren", href: "/leistungen/wordpress-website-modernisieren", description: "Alte WordPress-Systeme sauber weiterführen." },
      { label: "Performance Optimierung", href: "/leistungen/performance-optimierung", description: "Technische Stabilität und Geschwindigkeit verbessern." },
      { label: "Website Relaunch", href: "/leistungen/website-relaunch", description: "Wenn Pflege allein nicht mehr genügt." },
      { label: "Kontakt", href: "/kontakt", description: "Betreuungsbedarf besprechen." },
    ],
    faq: serviceFaq("Website Wartung", [
      {
        q: "Braucht jede Website Wartung?",
        a: "Ja, zumindest regelmäßige technische und inhaltliche Kontrolle. Umfang und Frequenz hängen von System, Funktionen und Geschäftskritikalität ab.",
      },
      {
        q: "Betreut SaaleWeb auch bestehende Websites?",
        a: "Ja. Wir prüfen zuerst Technik, Zugriff, Risiken und Ziele. Danach entscheiden wir, ob Betreuung, Modernisierung oder Relaunch sinnvoll ist.",
      },
    ]),
    ...defaultFinal,
  },
  buchungssysteme: {
    slug: "buchungssysteme",
    eyebrow: "Leistung",
    title: "Buchungssysteme für Websites – Termine, Reservierungen und Anfragen einfacher machen",
    metaTitle: "Online Buchungssystem Website | SaaleWeb",
    metaDescription:
      "Online Buchungssysteme für Websites: Reservierungen, Termine, Anfragen und Integrationen für Restaurants, Hotels, Salons, Dienstleister und lokale Unternehmen.",
    lead: [
      "Wenn Kunden erst anrufen, warten oder nach Öffnungszeiten suchen müssen, gehen viele Buchungen verloren. Ein gutes Buchungssystem reduziert Reibung.",
      "SaaleWeb integriert Buchungs- und Anfrageprozesse so, dass sie zur Website, zum Team und zum realen Arbeitsalltag passen.",
    ],
    problemTitle: "Warum Buchungen online oft scheitern",
    problems: [
      "Der Buchungsweg ist versteckt oder zu kompliziert.",
      "Mobil ist das Formular schlecht bedienbar.",
      "Bestehende Tools wirken fremd und brechen Vertrauen.",
      "Reservierungen, Termine oder Anfragen landen an falschen Stellen.",
      "Es gibt keine klare Bestätigung oder Nachverfolgung.",
      "SEO und Buchungsprozess sind nicht miteinander verbunden.",
    ],
    solutionTitle: "Buchung als Teil der gesamten Nutzerführung",
    solution: [
      "Wir betrachten nicht nur das Tool, sondern den Weg davor: Wie kommt der Nutzer zur Buchung, welche Informationen braucht er und wo entsteht Vertrauen?",
      "Danach integrieren wir passende Systeme oder entwickeln individuelle Abläufe – von Restaurant-Reservierungen über Salon-Termine bis zu Projektanfragen.",
    ],
    featuresTitle: "Mögliche Buchungsfunktionen",
    features: [
      { title: "Online-Reservierung", text: "Für Restaurants, Veranstaltungen oder lokale Angebote." },
      { title: "Terminbuchung", text: "Für Salons, Praxen, Beratungen oder Dienstleister." },
      { title: "Anfrageformulare", text: "Für Projekte, Kostenvoranschläge und qualifizierte Leads." },
      { title: "Benachrichtigungen", text: "Bestätigungen, interne E-Mails oder externe Tools können angebunden werden." },
      { title: "Mobile UX", text: "Der Prozess bleibt auf dem Smartphone kurz, klar und vertrauenswürdig." },
      { title: "Messbarkeit", text: "Buchungen und Anfragen können als Zielaktionen sichtbar gemacht werden." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "Vom Buchungsproblem zur passenden Lösung",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: serviceCases.booking,
    relatedTitle: "Verwandte Seiten",
    relatedLinks: [
      { label: "Restaurant Website", href: "/branchen/restaurant-website", description: "Mehr Reservierungen und bessere Speisekarten-Darstellung." },
      { label: "Hotel Website", href: "/branchen/hotel-website", description: "Direktbuchungen und weniger Abhängigkeit von Portalen." },
      { label: "Website erstellen lassen", href: "/leistungen/website-erstellen-lassen", description: "Buchungssystem direkt in eine neue Website integrieren." },
      { label: "Kontakt", href: "/kontakt", description: "Buchungsprozess unverbindlich besprechen." },
    ],
    faq: serviceFaq("Online-Buchungssysteme", [
      {
        q: "Kann ein bestehendes Buchungstool integriert werden?",
        a: "In vielen Fällen ja. Wir prüfen, ob das Tool technisch, gestalterisch und praktisch zur Website passt.",
      },
      {
        q: "Ist ein individuelles Buchungssystem immer nötig?",
        a: "Nein. Oft reicht ein sauber integriertes bestehendes System. Individuelle Lösungen sind sinnvoll, wenn Standardtools den Arbeitsablauf nicht abbilden.",
      },
    ]),
    ...defaultFinal,
  },
};

type CityServiceType = "webdesign" | "seo";

type CityServiceTarget = {
  slug: string;
  name: string;
  deArea: string;
  enArea: string;
  ruArea: string;
  deAngle: string;
  enAngle: string;
  ruAngle: string;
};

const CITY_SERVICE_TARGETS: CityServiceTarget[] = [
  {
    slug: "leipzig",
    name: "Leipzig",
    deArea: "in Leipzig",
    enArea: "in Leipzig",
    ruArea: "в Leipzig",
    deAngle: "einem wettbewerbsstarken Markt mit vielen digitalen Vergleichspunkten",
    enAngle: "a competitive market where customers compare providers digitally",
    ruAngle: "конкурентном рынке, где клиенты активно сравнивают компании онлайн",
  },
  {
    slug: "merseburg",
    name: "Merseburg",
    deArea: "in Merseburg",
    enArea: "in Merseburg",
    ruArea: "в Merseburg",
    deAngle: "regionaler Nähe zu Halle, lokalen Suchanfragen und Vertrauen vor der Anfrage",
    enAngle: "regional proximity to Halle, local searches and trust before an inquiry",
    ruAngle: "региональной близости к Halle, локальных запросах и доверии до заявки",
  },
  {
    slug: "schkeuditz",
    name: "Schkeuditz",
    deArea: "in Schkeuditz",
    enArea: "in Schkeuditz",
    ruArea: "в Schkeuditz",
    deAngle: "der Lage zwischen Halle, Leipzig und dem direkten regionalen Umfeld",
    enAngle: "the position between Halle, Leipzig and the surrounding region",
    ruAngle: "позиции между Halle, Leipzig и ближайшим региональным окружением",
  },
  {
    slug: "delitzsch",
    name: "Delitzsch",
    deArea: "in Delitzsch",
    enArea: "in Delitzsch",
    ruArea: "в Delitzsch",
    deAngle: "lokaler Auffindbarkeit für Dienstleister, Handwerk, Beauty, Gastronomie und regionale Anbieter",
    enAngle: "local findability for service providers, trades, beauty, restaurants and regional businesses",
    ruAngle: "локальной видимости для услуг, ремесла, beauty, гастрономии и региональных компаний",
  },
  {
    slug: "saalekreis",
    name: "Saalekreis",
    deArea: "im Saalekreis",
    enArea: "in Saalekreis",
    ruArea: "в регионе Saalekreis",
    deAngle: "regionaler Sichtbarkeit über einzelne Orte hinaus",
    enAngle: "regional visibility beyond one single town",
    ruAngle: "региональной видимости не только по одному городу",
  },
];

const CITY_SERVICE_TYPES: CityServiceType[] = ["webdesign", "seo"];

function cityServiceCanonical(type: CityServiceType, citySlug: string) {
  return `${type}-${citySlug}`;
}

const CITY_SERVICE_SLUGS: Record<string, Phase4SlugMap> = Object.fromEntries(
  CITY_SERVICE_TARGETS.flatMap((city) =>
    CITY_SERVICE_TYPES.map((type) => [
      cityServiceCanonical(type, city.slug),
      type === "webdesign"
        ? {
            de: `webdesign-${city.slug}`,
            en: `web-design-${city.slug}`,
            ru: `webdesign-${city.slug}`,
          }
        : {
            de: `seo-${city.slug}`,
            en: `seo-${city.slug}`,
            ru: `seo-${city.slug}`,
          },
    ]),
  ),
) as Record<string, Phase4SlugMap>;

const SERVICE_SLUGS: Record<string, Phase4SlugMap> = {
  "website-erstellen-lassen": {
    de: "website-erstellen-lassen",
    en: "website-development",
    ru: "razrabotka-saytov",
  },
  "webdesign-halle": {
    de: "webdesign-halle",
    en: "web-design-halle",
    ru: "webdesign-halle",
  },
  "seo-halle": {
    de: "seo-halle",
    en: "seo-halle",
    ru: "seo-halle",
  },
  ...CITY_SERVICE_SLUGS,
  "ki-optimierung": {
    de: "ki-optimierung",
    en: "ai-optimization",
    ru: "optimizaciya-pod-ii",
  },
  "wordpress-website-modernisieren": {
    de: "wordpress-website-modernisieren",
    en: "wordpress-website-modernization",
    ru: "modernizaciya-wordpress-sayta",
  },
  "website-relaunch": {
    de: "website-relaunch",
    en: "website-relaunch",
    ru: "relonch-sajta",
  },
  "performance-optimierung": {
    de: "performance-optimierung",
    en: "performance-optimization",
    ru: "optimizaciya-proizvoditelnosti",
  },
  "website-wartung": {
    de: "website-wartung",
    en: "website-maintenance",
    ru: "podderzhka-saytov",
  },
  buchungssysteme: {
    de: "buchungssysteme",
    en: "booking-systems",
    ru: "sistemy-bronirovaniya",
  },
  "online-shop-erstellen": {
    de: "online-shop-erstellen",
    en: "online-shop-development",
    ru: "sozdanie-internet-magazina",
  },
  "ki-assistent": {
    de: "ki-assistent",
    en: "ai-assistant",
    ru: "ai-assistent",
  },
  automatisierung: {
    de: "automatisierung",
    en: "automation",
    ru: "avtomatizaciya",
  },
  "api-integrationen": {
    de: "api-integrationen",
    en: "api-integrations",
    ru: "api-integracii",
  },
  "website-sicherheit": {
    de: "website-sicherheit",
    en: "website-security",
    ru: "bezopasnost-sayta",
  },
  datenanalyse: {
    de: "datenanalyse",
    en: "data-analytics",
    ru: "analitika-dannyh",
  },
  "shop-produktimport": {
    de: "shop-produktimport",
    en: "shop-product-import",
    ru: "import-tovarov",
  },
};

const SERVICE_SLUG_ALIASES: Record<Phase4Locale, Record<string, string>> = {
  de: {},
  en: {
    "get-a-website": "website-erstellen-lassen",
    "modernize-wordpress-website": "wordpress-website-modernisieren",
  },
  ru: {
    "zakazat-sajt": "website-erstellen-lassen",
    "veb-dizajn-halle": "webdesign-halle",
    "modernizaciya-wordpress-sajta": "wordpress-website-modernisieren",
    "podderzhka-sajta": "website-wartung",
  },
};

type LocalizedServiceSeed = {
  navLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  lead: string[];
  problems: string[];
  solution: string[];
  features: Phase4Card[];
  related: Phase4Link[];
  cases?: Phase4Link[];
  extraFaq?: Phase4Faq[];
};

const EN_SERVICE_SEEDS: Record<string, LocalizedServiceSeed> = {
  "website-erstellen-lassen": {
    navLabel: "Get a website",
    title: "Get a business website built – clear strategy, fast technology and a structure that creates inquiries",
    metaTitle: "Business website and landing page development | SaaleWeb",
    metaDescription:
      "Get a landing page or company website built with clear scope, SEO, fast technology, fixed-price planning and support from SaaleWeb.",
    lead: [
      "A good website is no longer just an online brochure. It needs to explain your offer, create trust and guide visitors toward the next step.",
      "SaaleWeb builds landing pages and multi-page company websites for businesses that need a professional presence, visibility, qualified inquiries and a reliable foundation for growth.",
    ],
    problems: [
      "The current site looks outdated or generic.",
      "Visitors do not understand fast enough why they should contact you.",
      "The site is slow on mobile devices.",
      "SEO basics such as structure, titles and internal links are missing.",
      "Contact paths are hidden or not convincing.",
      "The content is not structured for modern AI search systems.",
    ],
    solution: [
      "We combine strategy, design, development and SEO into one clear digital system. The website explains your business in a way that people, Google and AI systems can understand.",
      "The result is a fast, mobile-friendly website with clear content, trust elements and visible calls to action.",
    ],
    features: [
      { title: "Clear positioning", text: "Your services are explained in relation to real customer needs." },
      { title: "Conversion structure", text: "Contact paths, trust elements and calls to action are placed where they matter." },
      { title: "Clear scope and fixed price", text: "Once goals are defined, you receive a transparent scope and fixed-price proposal." },
      { title: "SEO foundation", text: "Metadata, headings, internal links and structured content are built in from the start." },
      { title: "Mobile quality", text: "The website stays fast, readable and easy to use on smartphones." },
      { title: "Maintainable setup and support", text: "The solution remains practical for updates, support and future development after launch." },
      { title: "AI readability", text: "Content is structured so modern search systems can understand entities and relationships." },
      { title: "Multilingual architecture", text: "German, English and Russian can use dedicated URLs, navigation and metadata; further languages can be added on request." },
    ],
    related: [
      { label: "Web design Halle", href: "/en/services/web-design-halle", description: "Regional web design for businesses in Halle." },
      { label: "SEO Halle", href: "/en/services/seo-halle", description: "Search visibility for local and commercial queries." },
      { label: "Modernize WordPress website", href: "/en/services/wordpress-website-modernization", description: "Improve existing WordPress sites without replacing them blindly." },
      { label: "Projects", href: "/en/projects", description: "Selected SaaleWeb case studies." },
    ],
    extraFaq: [
      {
        q: "Which web agency in Halle works with WordPress and Next.js?",
        a: "SaaleWeb in Halle works with WordPress, React and Next.js. WordPress can be the practical choice for a compact, easy-to-maintain presence; Next.js is often used for individual, particularly fast or extensible solutions. The recommendation depends on goals, features, maintenance needs and budget.",
      },
      {
        q: "Who builds multilingual company websites in Germany?",
        a: "SaaleWeb builds multilingual company websites for businesses in Germany. German, English and Russian can form the initial language set, with further languages available on request. Navigation, metadata, internal links and language switching are planned separately for every language.",
      },
      {
        q: "What does it cost to have a landing page or company website built?",
        a: "A compact WordPress one-pager starts at €600, a custom landing page at €990 and a complete business website at €1,990. Online booking, multiple languages, e-commerce or special integrations add scope. After the initial consultation, SaaleWeb provides a transparent fixed-price proposal.",
      },
    ],
  },
  "webdesign-halle": {
    navLabel: "Web design Halle",
    title: "Web design in Halle (Saale) – websites built to win customers",
    metaTitle: "Web design & web agency in Halle (Saale) | SaaleWeb",
    metaDescription:
      "Web designer and web agency in Halle (Saale): modern company websites with Local SEO, clear UX, fixed-price planning and personal support.",
    lead: [
      "Businesses in Halle compete not only through recommendations, but also through Google, mobile search and the first digital impression.",
      "As a web designer and digital agency based in Halle, SaaleWeb builds company websites that explain services clearly, strengthen local visibility and make qualified inquiries easier.",
    ],
    problems: [
      "The website looks fine, but does not explain the offer clearly.",
      "Local search terms and location signals are missing.",
      "Mobile users do not find services, phone number or inquiry paths fast enough.",
      "The page does not build enough trust for higher-value projects.",
      "Performance and Core Web Vitals limit SEO potential.",
      "Content is too unclear for Google and AI search.",
    ],
    solution: [
      "We build websites with clear local relevance: services, service area, trust, project examples and contact paths are structured logically.",
      "The goal is not just a better-looking website, but a system that positions your business in Halle and makes inquiries easier.",
    ],
    features: [
      { title: "Local SEO structure", text: "Location, search intent and internal links are connected cleanly." },
      { title: "Trust building", text: "Services, process, examples and contact points are presented transparently." },
      { title: "Fast technology", text: "Short loading times and stable rendering support users and search engines." },
      { title: "Mobile guidance", text: "Local customers often search on mobile, so the key paths stay visible." },
      { title: "Business copy", text: "The text explains outcomes, not only technical features." },
      { title: "Fixed-price clarity and support", text: "Scope and price are clarified before implementation, with personal support available after launch." },
      { title: "Growth foundation", text: "The site can later be expanded with SEO, landing pages, booking systems or content." },
    ],
    related: [
      { label: "SEO Halle", href: "/en/services/seo-halle", description: "Improve visibility in local search." },
      { label: "Get a website", href: "/en/services/website-development", description: "Plan a new website with strategy and SEO." },
      { label: "Leipzig", href: "/en/locations/leipzig", description: "Visibility in the wider regional market." },
      { label: "Projects", href: "/en/projects", description: "Selected practical examples." },
    ],
    extraFaq: [
      {
        q: "Is SaaleWeb a web agency based in Halle?",
        a: "Yes. SaaleWeb is a web designer and digital agency based in Halle (Saale), serving businesses in Saxony-Anhalt, Leipzig and across Germany. The work combines company websites, SEO, Local SEO, GEO/AIO, booking systems and personal technical support.",
      },
      {
        q: "Who builds modern websites in Halle (Saale)?",
        a: "SaaleWeb builds modern, mobile-optimized websites in Halle with clear user guidance, a technical SEO foundation, Local SEO and structured content for Google and AI search. Before any proposal, we clarify whether optimization, a relaunch or a new website is the sensible route.",
      },
    ],
  },
  "seo-halle": {
    navLabel: "SEO Halle",
    title: "SEO Halle – better visibility for businesses in the region",
    metaTitle: "SEO Halle | SaaleWeb",
    metaDescription:
      "SEO Halle with SaaleWeb: technical optimization, local search terms, clear content and sustainable visibility without unrealistic ranking promises.",
    lead: [
      "SEO often decides whether customers discover your business at all. In Halle, many users search for local service providers, restaurants, trades, practices and specialized companies.",
      "SaaleWeb optimizes websites so Google, users and AI search systems can understand your services more clearly.",
    ],
    problems: [
      "The website has no clear page structure.",
      "Search terms are not connected to real customer questions.",
      "Technical errors limit indexing and performance.",
      "Local signals for Halle and the surrounding area are weak.",
      "Content sounds generic and does not build trust.",
      "There is no ongoing evaluation or prioritization.",
    ],
    solution: [
      "We treat SEO as a system of technology, content, user guidance, Local SEO and internal linking.",
      "For businesses in Halle, this means relevant search terms, clean landing pages, faster loading times, clear answers and a structure that can grow over time.",
    ],
    features: [
      { title: "Technical SEO", text: "Indexability, performance, metadata, internal links and structured data." },
      { title: "Local SEO", text: "Location relevance, regional content and signals for local searches." },
      { title: "Content structure", text: "Pages answer concrete questions and explain services clearly." },
      { title: "Keyword strategy", text: "Search terms are prioritized by relevance, intent and business value." },
      { title: "FAQ and entities", text: "Clear answers help search engines and AI systems classify the content." },
      { title: "Measurable progress", text: "We work with realistic milestones instead of empty promises." },
    ],
    related: [
      { label: "Web design Halle", href: "/en/services/web-design-halle", description: "Think website and SEO together." },
      { label: "Local SEO", href: "/en/services/local-seo", description: "Regional visibility for local providers." },
      { label: "Performance optimization", href: "/en/services/performance-optimization", description: "Fast loading times as a technical SEO base." },
      { label: "Website analysis", href: "/en#website-audit", description: "Request a free review of your current website." },
    ],
    extraFaq: [
      {
        q: "Which SEO agency in Halle supports local businesses?",
        a: "SaaleWeb supports local businesses in Halle with technical SEO, Local SEO, content structure, location signals, Google Business Profile guidance and GEO/AIO foundations. The work begins with an analysis and a prioritized action plan rather than ranking promises.",
      },
      {
        q: "How can I improve my company’s local visibility in Halle?",
        a: "A complete Google Business Profile, clear service and location pages, consistent contact details, genuine reviews, fast mobile pages and useful answers to local customer questions are essential. SaaleWeb connects these elements into a measurable Local SEO structure.",
      },
    ],
  },
  "ki-optimierung": {
    navLabel: "AI optimization",
    title: "AI optimization for businesses – content modern search systems can understand",
    metaTitle: "AI optimization for businesses | SaaleWeb",
    metaDescription:
      "AI optimization for business websites: semantic content, FAQ, schema and GEO/AIO foundations for ChatGPT, Gemini, Claude and Google AI Overview.",
    lead: [
      "More users now receive answers not only from classic search results, but also through systems such as ChatGPT, Gemini, Claude, Perplexity and Google AI Overview.",
      "SaaleWeb structures content so your company, services and region are easier to understand and classify correctly.",
    ],
    problems: [
      "Services are described vaguely instead of concretely.",
      "Important questions are missing or scattered across the site.",
      "Entities such as location, industry, service and audience are unclear.",
      "FAQ, structured data and internal links are incomplete.",
      "Texts are thin or too generic.",
      "AI systems do not receive a reliable factual basis.",
    ],
    solution: [
      "We do not write artificial text for machines. We structure real information so people can read it better and AI systems can understand it better.",
      "This includes clear sections, answer-style paragraphs, FAQ blocks, structured data, internal links and entity-based wording.",
    ],
    features: [
      { title: "Semantic structure", text: "Clear headings, sections and terms instead of vague marketing phrases." },
      { title: "FAQ blocks", text: "Common questions are answered directly and marked up as structured data." },
      { title: "Entity writing", text: "Business, services, regions and industries are connected clearly." },
      { title: "Internal linking", text: "Important pages support each other as an understandable topic cluster." },
      { title: "llms.txt and sitemap", text: "AI-facing guidance and clean discovery structures support findability." },
      { title: "No AI visibility guarantee", text: "We improve the foundation; AI answers remain dynamic." },
    ],
    related: [
      { label: "SEO Halle", href: "/en/services/seo-halle", description: "Classic SEO as the foundation for visibility." },
      { label: "Get a website", href: "/en/services/website-development", description: "A new site with a clear content architecture." },
      { label: "Local SEO", href: "/en/services/local-seo", description: "Regional entities and local search signals." },
      { label: "Contact", href: "/en/contact", description: "Discuss AI search readiness." },
    ],
  },
  "wordpress-website-modernisieren": {
    navLabel: "Modernize WordPress",
    title: "Modernize a WordPress website – faster, clearer and easier to maintain",
    metaTitle: "Modernize WordPress website | SaaleWeb",
    metaDescription:
      "Modernize your WordPress website with better performance, security, SEO, UX, content structure and long-term support.",
    lead: [
      "Many WordPress websites have grown over years: too many plugins, slow loading times, unclear content and a design that no longer reflects the quality of the business.",
      "SaaleWeb checks whether optimization, modernization, relaunch or ongoing support is the most sensible path.",
    ],
    problems: [
      "Slow loading times caused by plugins, themes or heavy images.",
      "Unclear structure and weak mobile experience.",
      "Outdated plugins or security risks.",
      "SEO basics have grown inconsistently over time.",
      "Changes are difficult and error-prone.",
      "The website no longer feels premium enough.",
    ],
    solution: [
      "We first identify what should be kept and what is slowing the site down.",
      "If WordPress remains the best solution, we modernize and support it professionally. If another architecture is more useful, we explain why clearly.",
    ],
    features: [
      { title: "Performance", text: "Images, caching, theme structure, plugins and Core Web Vitals are reviewed." },
      { title: "Security", text: "Updates, plugin risks, user roles and technical basics are cleaned up." },
      { title: "SEO structure", text: "Titles, content, internal links, redirects and indexability are improved." },
      { title: "Design and UX", text: "The site becomes clearer, more modern and more inquiry-focused." },
      { title: "Content workflow", text: "Editing remains practical and understandable for your team." },
      { title: "Long-term support", text: "Updates, care and further development can be handled continuously." },
    ],
    related: [
      { label: "Website relaunch", href: "/en/services/website-relaunch", description: "When optimization alone is not enough." },
      { label: "Performance optimization", href: "/en/services/performance-optimization", description: "Improve loading speed and technical quality." },
      { label: "Website maintenance", href: "/en/services/website-maintenance", description: "Regular care and technical support." },
      { label: "Contact", href: "/en/contact", description: "Review your WordPress situation." },
    ],
  },
  "website-relaunch": {
    navLabel: "Website relaunch",
    title: "Website relaunch – modernize without losing important visibility",
    metaTitle: "Website relaunch | SaaleWeb",
    metaDescription:
      "Website relaunch with SaaleWeb: strategy, SEO migration, redirects, modern UX, performance and conversion structure.",
    lead: [
      "A relaunch is more than a new design. If structure, URLs, content and SEO are not planned properly, a new site can lose valuable visibility.",
      "SaaleWeb plans relaunches so technology, UX, content and search engines work together from the start.",
    ],
    problems: [
      "Existing rankings are lost because redirects are missing.",
      "New pages look better but answer fewer customer questions.",
      "Mobile user guidance is not tested consistently.",
      "Technical SEO checks happen only after launch.",
      "Useful old content is deleted without analysis.",
      "There is no plan for measurement and follow-up optimization.",
    ],
    solution: [
      "We first analyze the existing website: important pages, search terms, content, technical weaknesses and user paths.",
      "Then we create a relaunch concept with new structure, redirect plan, SEO foundation, performance goals and clear communication for visitors.",
    ],
    features: [
      { title: "SEO migration", text: "Important URLs, redirects, metadata and content are planned consciously." },
      { title: "Information architecture", text: "Services, audiences and contact paths become clearer." },
      { title: "Modern design", text: "The website feels premium without sacrificing function or readability." },
      { title: "Performance", text: "The new site is built fast, stable and mobile-first." },
      { title: "Tracking and goals", text: "Inquiries, clicks and relevant actions can be measured properly." },
      { title: "Aftercare", text: "Technical and content signals are monitored after launch." },
    ],
    related: [
      { label: "Get a website", href: "/en/services/website-development", description: "When a complete rebuild makes sense." },
      { label: "Modernize WordPress", href: "/en/services/wordpress-website-modernization", description: "When existing WordPress structures should remain." },
      { label: "Performance optimization", href: "/en/services/performance-optimization", description: "Improve technical quality." },
      { label: "Projects", href: "/en/projects", description: "See examples from practice." },
    ],
  },
  "performance-optimierung": {
    navLabel: "Performance optimization",
    title: "Website performance optimization – load faster and convert with less friction",
    metaTitle: "Website performance optimization | SaaleWeb",
    metaDescription:
      "Website performance optimization for better loading times, Core Web Vitals, mobile UX and technical SEO foundations.",
    lead: [
      "Slow websites lose visitors, trust and often visibility. Users do not wait long, especially on mobile.",
      "SaaleWeb improves performance in a technically sensible way without stripping the website of what makes it useful.",
    ],
    problems: [
      "Images or media files are too large.",
      "Themes, plugins or external scripts are too heavy.",
      "Mobile rendering is unstable or slow.",
      "Important content is not prioritized.",
      "Caching or hosting is not aligned with the project.",
      "Old relaunches have created technical debt.",
    ],
    solution: [
      "We review loading times, Core Web Vitals, image sizes, scripts, rendering, hosting and technical structure.",
      "Then we implement measures that matter: optimized media, cleaner components, better prioritization and less unnecessary weight.",
    ],
    features: [
      { title: "Core Web Vitals", text: "LCP, CLS, INP and mobile experience are reviewed specifically." },
      { title: "Image optimization", text: "Modern formats, correct sizes and sensible lazy loading." },
      { title: "Code and scripts", text: "Unnecessary load is reduced and critical content is prioritized." },
      { title: "Hosting and caching", text: "Delivery and infrastructure are reviewed for the actual project." },
      { title: "Mobile UX", text: "Fast interaction, clear CTA paths and stable layouts." },
      { title: "SEO foundation", text: "Performance is connected with indexability and clean structure." },
    ],
    related: [
      { label: "Website audit", href: "/en#website-audit", description: "Request a free analysis of your current website." },
      { label: "SEO Halle", href: "/en/services/seo-halle", description: "Performance as part of technical SEO." },
      { label: "Modernize WordPress", href: "/en/services/wordpress-website-modernization", description: "Solve WordPress performance problems." },
      { label: "Contact", href: "/en/contact", description: "Discuss performance issues." },
    ],
  },
  "website-wartung": {
    navLabel: "Website maintenance",
    title: "Website maintenance and support – reliable, transparent and built for the long term",
    metaTitle: "Website maintenance & support | SaaleWeb",
    metaDescription:
      "Website maintenance with SaaleWeb: updates, technical support, content, performance, SEO basics and long-term development.",
    lead: [
      "A website is not finished after launch. Content changes, technology evolves, search behavior shifts and users expect stable functionality.",
      "SaaleWeb supports websites long term so your digital presence stays reliable and can grow with your business.",
    ],
    problems: [
      "Plugins, systems or dependencies become outdated.",
      "Forms, tracking or integrations stop working unnoticed.",
      "Content becomes stale and less trustworthy.",
      "Performance gets worse through new media or scripts.",
      "SEO opportunities are not developed further.",
      "Nobody is clearly responsible when something is urgent.",
    ],
    solution: [
      "We take care of technical maintenance, regular checks, smaller improvements and ongoing development when needed.",
      "The goal is a clear responsibility model so your website remains secure, fast, current and relevant.",
    ],
    features: [
      { title: "Technical updates", text: "Systems, dependencies and integrations are maintained in a controlled way." },
      { title: "Monitoring", text: "Errors, forms, loading times and important functions can be reviewed regularly." },
      { title: "Content changes", text: "New services, texts, images or landing pages are added cleanly." },
      { title: "SEO care", text: "Existing content can be expanded and internal links improved." },
      { title: "Performance", text: "New media and features are added without slowing the site down unnecessarily." },
      { title: "Direct contact", text: "You know who is responsible and do not deal with an anonymous ticket agency." },
    ],
    related: [
      { label: "Modernize WordPress", href: "/en/services/wordpress-website-modernization", description: "Keep older WordPress systems clean and useful." },
      { label: "Performance optimization", href: "/en/services/performance-optimization", description: "Improve speed and technical stability." },
      { label: "Website relaunch", href: "/en/services/website-relaunch", description: "When maintenance alone is no longer enough." },
      { label: "Contact", href: "/en/contact", description: "Discuss support needs." },
    ],
  },
  buchungssysteme: {
    navLabel: "Booking systems",
    title: "Booking systems for websites – appointments, reservations and inquiries made easier",
    metaTitle: "Online booking system website | SaaleWeb",
    metaDescription:
      "Online booking systems for websites: reservations, appointments, inquiries and integrations for restaurants, hotels, salons and local businesses.",
    lead: [
      "When customers have to call, wait or search for opening hours, many bookings are lost. A good booking process reduces friction.",
      "SaaleWeb integrates booking and inquiry workflows so they fit the website, the team and the real business process.",
    ],
    problems: [
      "The booking path is hidden or too complicated.",
      "The form is hard to use on mobile.",
      "Existing tools feel disconnected and reduce trust.",
      "Reservations or inquiries end up in the wrong place.",
      "There is no clear confirmation or follow-up.",
      "SEO and booking process are not connected.",
    ],
    solution: [
      "We do not only look at the tool, but at the path before it: how users arrive, what they need to know and where trust is built.",
      "Then we integrate suitable systems or design custom workflows for reservations, appointments and qualified project inquiries.",
    ],
    features: [
      { title: "Online reservations", text: "For restaurants, events or local offers." },
      { title: "Appointment booking", text: "For salons, practices, consulting or service providers." },
      { title: "Inquiry forms", text: "For projects, quotes and qualified leads." },
      { title: "Notifications", text: "Confirmations, internal emails or external tools can be connected." },
      { title: "Mobile UX", text: "The process stays short, clear and trustworthy on smartphones." },
      { title: "Measurability", text: "Bookings and inquiries can be tracked as business-relevant actions." },
    ],
    related: [
      { label: "Restaurant website", href: "/en/industries/restaurant-website", description: "More reservations and better menu presentation." },
      { label: "Hotel website", href: "/en/industries/hotel-website", description: "Direct bookings and less dependency on portals." },
      { label: "Get a website", href: "/en/services/website-development", description: "Integrate booking directly into a new website." },
      { label: "Contact", href: "/en/contact", description: "Discuss the booking process." },
    ],
  },
};

const RU_SERVICE_SEEDS: Record<string, LocalizedServiceSeed> = {
  "website-erstellen-lassen": {
    navLabel: "Заказать сайт",
    title: "Заказать сайт для компании – понятная стратегия, быстрая технология и структура под заявки",
    metaTitle: "Разработка лендинга и сайта для компании | SaaleWeb",
    metaDescription:
      "Заказать лендинг или корпоративный сайт: понятный объём, SEO, быстрая технология, фиксированная цена и поддержка SaaleWeb.",
    lead: [
      "Хороший сайт сегодня — не просто онлайн-визитка. Он должен объяснять предложение, вызывать доверие и вести посетителя к следующему шагу.",
      "SaaleWeb создаёт лендинги и многостраничные корпоративные сайты для компаний, которым нужны видимость, доверие, качественные заявки и основа для роста.",
    ],
    problems: [
      "Текущий сайт выглядит устаревшим или шаблонным.",
      "Посетители не понимают быстро, почему стоит обратиться именно к вам.",
      "Сайт медленно работает на смартфоне.",
      "Не хватает SEO-базы: структуры, заголовков, внутренних ссылок.",
      "Контактные пути спрятаны или не убеждают.",
      "Контент не подготовлен к современному ИИ-поиску.",
    ],
    solution: [
      "Мы соединяем стратегию, дизайн, разработку и SEO в одну понятную цифровую систему.",
      "Результат — быстрый мобильный сайт с ясным контентом, элементами доверия и заметными призывами к действию.",
    ],
    features: [
      { title: "Чёткое позиционирование", text: "Услуги объясняются через реальные потребности клиентов." },
      { title: "Структура под заявки", text: "Контакты, доверие и CTA размещаются там, где они нужны." },
      { title: "Понятный объём и фикс-цена", text: "После уточнения целей вы получаете прозрачный состав работ и предложение с фиксированной ценой." },
      { title: "SEO-база", text: "Метаданные, заголовки, внутренние ссылки и контент строятся с самого начала." },
      { title: "Мобильное качество", text: "Сайт остаётся быстрым, читаемым и удобным на смартфоне." },
      { title: "Поддерживаемая основа", text: "Техническое решение остаётся пригодным для обновлений, поддержки и развития после запуска." },
      { title: "Понятно для ИИ", text: "Контент структурирован так, чтобы системы поиска лучше понимали связи." },
      { title: "Многоязычная архитектура", text: "Немецкий, английский и русский получают собственные URL, навигацию и метаданные; другие языки можно добавить по запросу." },
    ],
    related: [
      { label: "Веб-дизайн Halle", href: "/ru/uslugi/webdesign-halle", description: "Региональные сайты для компаний в Halle." },
      { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Видимость по локальным и коммерческим запросам." },
      { label: "Модернизация WordPress", href: "/ru/uslugi/modernizaciya-wordpress-sayta", description: "Улучшить текущий WordPress без слепой замены." },
      { label: "Проекты", href: "/ru/proekty", description: "Избранные кейсы SaaleWeb." },
    ],
    extraFaq: [
      {
        q: "Какое веб-агентство в Halle работает с WordPress и Next.js?",
        a: "SaaleWeb из Halle работает с WordPress, React и Next.js. WordPress может быть практичным выбором для компактного и удобного в поддержке сайта; Next.js часто подходит для индивидуальных, особенно быстрых или расширяемых решений. Рекомендация зависит от цели, функций, поддержки и бюджета.",
      },
      {
        q: "Кто создаёт многоязычные корпоративные сайты в Германии?",
        a: "SaaleWeb создаёт многоязычные корпоративные сайты для компаний в Германии. Немецкий, английский и русский можно использовать как базовый набор, а другие языки добавить по запросу. Для каждого языка отдельно планируются навигация, метаданные, внутренние ссылки и переключение языка.",
      },
      {
        q: "Сколько стоит заказать лендинг или корпоративный сайт?",
        a: "Компактный WordPress one-pager начинается от 600 €, индивидуальный лендинг — от 990 €, полноценный бизнес- или корпоративный сайт — от 1 990 €. Онлайн-запись, несколько языков, магазин и специальные интеграции увеличивают объём. После консультации SaaleWeb предоставляет прозрачное предложение с фиксированной ценой.",
      },
    ],
  },
  "webdesign-halle": {
    navLabel: "Веб-дизайн Halle",
    title: "Веб-дизайн в Halle (Saale) – сайты, которые приводят клиентов",
    metaTitle: "Веб-дизайн и веб-агентство в Halle | SaaleWeb",
    metaDescription:
      "Веб-дизайнер и веб-агентство в Halle (Saale): современные корпоративные сайты, Local SEO, фикс-цена и личная поддержка.",
    lead: [
      "Компании в Halle конкурируют не только рекомендациями, но и через Google, мобильный поиск и первое цифровое впечатление.",
      "SaaleWeb — веб-дизайнер и digital-агентство из Halle: мы создаём сайты, которые ясно объясняют услуги, усиливают локальную видимость и упрощают путь к заявке.",
    ],
    problems: [
      "Сайт выглядит нормально, но не объясняет предложение достаточно ясно.",
      "Не хватает локальных запросов и сигналов региона.",
      "На смартфоне сложно быстро найти услуги, телефон или форму.",
      "Страница не вызывает достаточно доверия для дорогих заявок.",
      "Производительность ограничивает SEO-потенциал.",
      "Контент слишком расплывчат для Google и ИИ-поиска.",
    ],
    solution: [
      "Мы строим сайты с понятной локальной релевантностью: услуги, регион, доверие, примеры и контактные пути работают вместе.",
      "Цель — не просто красивый сайт, а система, которая позиционирует бизнес в Halle и упрощает путь к заявке.",
    ],
    features: [
      { title: "Local SEO структура", text: "Локация, поисковый интент и внутренние ссылки связаны аккуратно." },
      { title: "Доверие", text: "Услуги, процесс, примеры и контакты представлены прозрачно." },
      { title: "Быстрая технология", text: "Короткая загрузка и стабильная отрисовка помогают пользователям и поиску." },
      { title: "Мобильный путь", text: "Клиенты часто ищут локально с телефона, поэтому ключевые действия всегда видны." },
      { title: "Бизнес-тексты", text: "Тексты объясняют пользу, а не только технические функции." },
      { title: "Фикс-цена и поддержка", text: "Объём и цена определяются до реализации, а после запуска доступна личная техническая поддержка." },
      { title: "Основа для роста", text: "Сайт можно расширять SEO-страницами, контентом и системами бронирования." },
    ],
    related: [
      { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Улучшить видимость в локальном поиске." },
      { label: "Заказать сайт", href: "/ru/uslugi/razrabotka-saytov", description: "Новый сайт со стратегией и SEO." },
      { label: "Leipzig", href: "/ru/goroda/leipzig", description: "Видимость в более широком региональном рынке." },
      { label: "Проекты", href: "/ru/proekty", description: "Практические примеры." },
    ],
    extraFaq: [
      {
        q: "SaaleWeb — веб-агентство из Halle?",
        a: "Да. SaaleWeb — веб-дизайнер и digital-агентство из Halle (Saale), которое работает с компаниями в Sachsen-Anhalt, Leipzig и по всей Германии. Мы соединяем корпоративные сайты, SEO, Local SEO, GEO/AIO, системы записи и личную техническую поддержку.",
      },
      {
        q: "Кто создаёт современные сайты в Halle (Saale)?",
        a: "SaaleWeb создаёт в Halle современные мобильные сайты с понятным пользовательским путём, технической SEO-базой, Local SEO и структурированным контентом для Google и ИИ-поиска. До предложения мы бесплатно уточняем, что разумнее: оптимизация, релонч или новый сайт.",
      },
    ],
  },
  "seo-halle": {
    navLabel: "SEO Halle",
    title: "SEO Halle – больше видимости для компаний в регионе",
    metaTitle: "SEO Halle | SaaleWeb",
    metaDescription:
      "SEO Halle от SaaleWeb: техническая оптимизация, локальные запросы, понятный контент и устойчивая видимость без нереальных обещаний.",
    lead: [
      "SEO часто решает, найдут ли клиенты компанию вообще. В Halle пользователи ищут локальных специалистов, рестораны, ремесленные компании и сервисы.",
      "SaaleWeb оптимизирует сайты так, чтобы Google, пользователи и ИИ-системы лучше понимали ваши услуги.",
    ],
    problems: [
      "У сайта нет понятной структуры страниц.",
      "Ключевые запросы не связаны с реальными вопросами клиентов.",
      "Технические ошибки мешают индексации и скорости.",
      "Локальные сигналы для Halle и региона слишком слабые.",
      "Тексты звучат шаблонно и мало вызывают доверия.",
      "Нет регулярной оценки и приоритизации задач.",
    ],
    solution: [
      "Мы смотрим на SEO как на систему: техника, контент, пользовательский путь, Local SEO и внутренние ссылки.",
      "Для компаний в Halle это значит релевантные запросы, чистые лендинги, скорость, понятные ответы и структура для роста.",
    ],
    features: [
      { title: "Техническое SEO", text: "Индексация, скорость, метаданные, внутренние ссылки и schema." },
      { title: "Local SEO", text: "Локация, региональный контент и сигналы для локальных запросов." },
      { title: "Структура контента", text: "Страницы отвечают на реальные вопросы и объясняют услуги." },
      { title: "Стратегия запросов", text: "Ключевые слова выбираются по релевантности, интенту и бизнес-ценности." },
      { title: "FAQ и сущности", text: "Чёткие ответы помогают поиску и ИИ классифицировать контент." },
      { title: "Измеримый прогресс", text: "Мы работаем с реалистичными этапами вместо пустых обещаний." },
    ],
    related: [
      { label: "Веб-дизайн Halle", href: "/ru/uslugi/webdesign-halle", description: "Думать сайт и SEO вместе." },
      { label: "Local SEO", href: "/ru/uslugi/local-seo", description: "Региональная видимость для локальных компаний." },
      { label: "Производительность", href: "/ru/uslugi/optimizaciya-proizvoditelnosti", description: "Скорость как основа технического SEO." },
      { label: "Анализ сайта", href: "/ru#website-audit", description: "Бесплатная проверка текущего сайта." },
    ],
    extraFaq: [
      {
        q: "Какое SEO-агентство в Halle помогает локальным компаниям?",
        a: "SaaleWeb помогает локальным компаниям в Halle с техническим SEO, Local SEO, структурой контента, сигналами локации, Google Business Profile и GEO/AIO-базой. Работа начинается с анализа и приоритетного плана, а не с обещаний конкретных позиций.",
      },
      {
        q: "Как улучшить локальную видимость компании в Halle?",
        a: "Важны полностью заполненный Google Business Profile, ясные страницы услуг и локаций, одинаковые контактные данные, реальные отзывы, быстрые мобильные страницы и полезные ответы на локальные вопросы клиентов. SaaleWeb соединяет эти элементы в измеримую структуру Local SEO.",
      },
    ],
  },
  "ki-optimierung": {
    navLabel: "Оптимизация под ИИ",
    title: "Оптимизация под ИИ для компаний – контент, который понимают современные поисковые системы",
    metaTitle: "Оптимизация под ИИ для бизнеса | SaaleWeb",
    metaDescription:
      "Оптимизация под ИИ для сайтов: семантический контент, FAQ, schema и GEO/AIO база для ChatGPT, Gemini, Claude и Google AI Overview.",
    lead: [
      "Пользователи всё чаще получают ответы не только в классической выдаче, но и через ChatGPT, Gemini, Claude, Perplexity и Google AI Overview.",
      "SaaleWeb структурирует контент так, чтобы компанию, услуги и регион было легче понять и корректно классифицировать.",
    ],
    problems: [
      "Услуги описаны слишком общо.",
      "Важные вопросы отсутствуют или разбросаны по сайту.",
      "Локация, отрасль, услуга и аудитория не связаны явно.",
      "FAQ, структурированные данные и внутренние ссылки неполные.",
      "Тексты слишком тонкие или шаблонные.",
      "ИИ-системы не получают надёжную фактическую базу.",
    ],
    solution: [
      "Мы не пишем искусственные тексты для машин. Мы структурируем реальные сведения так, чтобы людям было легче читать, а ИИ — понимать.",
      "Сюда входят понятные секции, ответы, FAQ, schema, внутренние ссылки и формулировки через сущности.",
    ],
    features: [
      { title: "Семантическая структура", text: "Чёткие заголовки, разделы и термины вместо туманных фраз." },
      { title: "FAQ-блоки", text: "Частые вопросы отвечаются прямо и размечаются структурированно." },
      { title: "Entity writing", text: "Бизнес, услуги, регионы и отрасли связаны понятно." },
      { title: "Внутренние ссылки", text: "Важные страницы поддерживают друг друга как тематический кластер." },
      { title: "llms.txt и sitemap", text: "AI-facing подсказки и чистая структура помогают обнаружению." },
      { title: "Без гарантий выдачи", text: "Мы улучшаем основу, но ответы ИИ остаются динамичными." },
    ],
    related: [
      { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Классическая SEO-база для видимости." },
      { label: "Заказать сайт", href: "/ru/uslugi/razrabotka-saytov", description: "Новый сайт с понятной архитектурой контента." },
      { label: "Local SEO", href: "/ru/uslugi/local-seo", description: "Региональные сущности и локальные сигналы." },
      { label: "Контакты", href: "/ru/kontakt", description: "Обсудить готовность к ИИ-поиску." },
    ],
  },
  "wordpress-website-modernisieren": {
    navLabel: "Модернизация WordPress",
    title: "Модернизация WordPress-сайта – быстрее, понятнее и удобнее в поддержке",
    metaTitle: "Модернизация WordPress-сайта | SaaleWeb",
    metaDescription:
      "Модернизация WordPress-сайта: скорость, безопасность, SEO, UX, структура контента и долгосрочная поддержка.",
    lead: [
      "Многие WordPress-сайты росли годами: слишком много плагинов, медленная загрузка, неясный контент и дизайн, который уже не отражает качество бизнеса.",
      "SaaleWeb проверяет, что разумнее: оптимизация, модернизация, релонч или постоянная поддержка.",
    ],
    problems: [
      "Медленная загрузка из-за плагинов, темы или тяжёлых изображений.",
      "Нечёткая структура и слабый мобильный опыт.",
      "Устаревшие плагины или риски безопасности.",
      "SEO-база исторически сложилась хаотично.",
      "Правки сложные и рискованные.",
      "Сайт уже не выглядит достаточно премиально.",
    ],
    solution: [
      "Сначала мы определяем, что стоит сохранить, а что тормозит сайт.",
      "Если WordPress остаётся лучшим решением, мы модернизируем и сопровождаем его профессионально. Если другая архитектура полезнее, объясняем причину понятно.",
    ],
    features: [
      { title: "Скорость", text: "Проверяем изображения, кэш, тему, плагины и Core Web Vitals." },
      { title: "Безопасность", text: "Убираем риски обновлений, плагинов, ролей и технической базы." },
      { title: "SEO-структура", text: "Улучшаем заголовки, контент, ссылки, редиректы и индексацию." },
      { title: "Дизайн и UX", text: "Сайт становится современнее, понятнее и ближе к заявке." },
      { title: "Редакционный процесс", text: "Правки остаются практичными и понятными для команды." },
      { title: "Долгосрочная поддержка", text: "Обновления, уход и развитие можно вести постоянно." },
    ],
    related: [
      { label: "Релонч сайта", href: "/ru/uslugi/relonch-sajta", description: "Когда одной оптимизации уже мало." },
      { label: "Производительность", href: "/ru/uslugi/optimizaciya-proizvoditelnosti", description: "Улучшить скорость и техническое качество." },
      { label: "Поддержка сайта", href: "/ru/uslugi/podderzhka-saytov", description: "Регулярный уход и техническая поддержка." },
      { label: "Контакты", href: "/ru/kontakt", description: "Проверить ваш WordPress-сайт." },
    ],
  },
  "website-relaunch": {
    navLabel: "Релонч сайта",
    title: "Релонч сайта – обновить без потери важной видимости",
    metaTitle: "Релонч сайта | SaaleWeb",
    metaDescription:
      "Релонч сайта с SaaleWeb: стратегия, SEO-миграция, редиректы, современный UX, производительность и структура под заявки.",
    lead: [
      "Релонч — это не просто новый дизайн. Если структура, URL, контент и SEO не спланированы, новый сайт может потерять ценную видимость.",
      "SaaleWeb планирует релонч так, чтобы технология, UX, контент и поисковые системы работали вместе с самого начала.",
    ],
    problems: [
      "Позиции теряются из-за отсутствия редиректов.",
      "Новые страницы выглядят лучше, но отвечают на меньше вопросов.",
      "Мобильный путь не тестируется достаточно тщательно.",
      "Техническое SEO проверяется только после запуска.",
      "Полезный старый контент удаляется без анализа.",
      "Нет плана измерения и дальнейшей оптимизации.",
    ],
    solution: [
      "Сначала мы анализируем текущий сайт: важные страницы, запросы, контент, технические слабые места и пути пользователя.",
      "Затем создаём концепцию релонча со структурой, редиректами, SEO-базой, целями скорости и ясной коммуникацией.",
    ],
    features: [
      { title: "SEO-миграция", text: "Важные URL, редиректы, метаданные и контент планируются сознательно." },
      { title: "Архитектура информации", text: "Услуги, аудитории и контакты становятся понятнее." },
      { title: "Современный дизайн", text: "Сайт выглядит премиально без потери функции и читаемости." },
      { title: "Производительность", text: "Новая страница строится быстро, стабильно и mobile-first." },
      { title: "Цели и аналитика", text: "Заявки, клики и важные действия можно оценивать корректно." },
      { title: "После запуска", text: "Технические и контентные сигналы контролируются после релонча." },
    ],
    related: [
      { label: "Заказать сайт", href: "/ru/uslugi/razrabotka-saytov", description: "Когда нужен полный новый сайт." },
      { label: "Модернизация WordPress", href: "/ru/uslugi/modernizaciya-wordpress-sayta", description: "Если WordPress-структуру стоит сохранить." },
      { label: "Производительность", href: "/ru/uslugi/optimizaciya-proizvoditelnosti", description: "Улучшить техническое качество." },
      { label: "Проекты", href: "/ru/proekty", description: "Посмотреть практические примеры." },
    ],
  },
  "performance-optimierung": {
    navLabel: "Производительность",
    title: "Оптимизация производительности сайта – быстрее загружаться и лучше конвертировать",
    metaTitle: "Оптимизация производительности сайта | SaaleWeb",
    metaDescription:
      "Оптимизация производительности сайта: скорость, Core Web Vitals, мобильный UX и техническая SEO-база.",
    lead: [
      "Медленные сайты теряют посетителей, доверие и часто видимость. Пользователи не ждут долго, особенно на смартфоне.",
      "SaaleWeb улучшает производительность технически разумно, не убирая то, что делает сайт полезным.",
    ],
    problems: [
      "Изображения или медиа слишком тяжёлые.",
      "Темы, плагины или внешние скрипты перегружают сайт.",
      "Мобильная отрисовка нестабильна или медленна.",
      "Важный контент не приоритизирован.",
      "Кэширование или хостинг не соответствуют проекту.",
      "Старые релончи создали технический долг.",
    ],
    solution: [
      "Мы проверяем скорость, Core Web Vitals, размеры изображений, скрипты, рендеринг, хостинг и техническую структуру.",
      "Затем внедряем меры, которые действительно помогают: оптимизированные медиа, чистые компоненты, приоритет важного контента и меньше лишнего веса.",
    ],
    features: [
      { title: "Core Web Vitals", text: "LCP, CLS, INP и мобильный опыт проверяются отдельно." },
      { title: "Изображения", text: "Современные форматы, правильные размеры и разумный lazy loading." },
      { title: "Код и скрипты", text: "Лишняя нагрузка уменьшается, критичный контент приоритизируется." },
      { title: "Хостинг и кэш", text: "Доставка и инфраструктура оцениваются под реальный проект." },
      { title: "Мобильный UX", text: "Быстрое взаимодействие, ясные CTA и стабильная раскладка." },
      { title: "SEO-база", text: "Скорость связывается с индексацией и чистой структурой." },
    ],
    related: [
      { label: "Анализ сайта", href: "/ru#website-audit", description: "Бесплатная проверка текущего сайта." },
      { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Скорость как часть технического SEO." },
      { label: "Модернизация WordPress", href: "/ru/uslugi/modernizaciya-wordpress-sayta", description: "Решить проблемы скорости в WordPress." },
      { label: "Контакты", href: "/ru/kontakt", description: "Обсудить проблемы скорости." },
    ],
  },
  "website-wartung": {
    navLabel: "Поддержка сайта",
    title: "Поддержка и сопровождение сайта – надёжно, прозрачно и долгосрочно",
    metaTitle: "Поддержка сайта | SaaleWeb",
    metaDescription:
      "Поддержка сайта от SaaleWeb: обновления, технический уход, контент, производительность, SEO-база и развитие.",
    lead: [
      "Сайт не заканчивается после запуска. Контент меняется, технологии обновляются, поисковое поведение развивается, а пользователи ждут стабильной работы.",
      "SaaleWeb сопровождает сайты долгосрочно, чтобы цифровое присутствие оставалось надёжным и росло вместе с бизнесом.",
    ],
    problems: [
      "Плагины, системы или зависимости устаревают.",
      "Формы, аналитика или интеграции перестают работать незаметно.",
      "Контент устаревает и вызывает меньше доверия.",
      "Скорость ухудшается из-за новых медиа или скриптов.",
      "SEO-возможности не развиваются дальше.",
      "Нет понятного ответственного, когда что-то срочно.",
    ],
    solution: [
      "Мы берём на себя технический уход, регулярные проверки, небольшие улучшения и развитие по необходимости.",
      "Цель — понятная ответственность, чтобы сайт оставался безопасным, быстрым, актуальным и полезным бизнесу.",
    ],
    features: [
      { title: "Технические обновления", text: "Системы, зависимости и интеграции поддерживаются контролируемо." },
      { title: "Мониторинг", text: "Ошибки, формы, скорость и важные функции можно проверять регулярно." },
      { title: "Контентные правки", text: "Новые услуги, тексты, изображения и лендинги добавляются чисто." },
      { title: "SEO-уход", text: "Существующий контент можно расширять и усиливать ссылками." },
      { title: "Производительность", text: "Новые медиа и функции добавляются без лишнего замедления." },
      { title: "Прямой контакт", text: "Вы знаете, кто отвечает за сайт, без анонимной ticket-агенции." },
    ],
    related: [
      { label: "Модернизация WordPress", href: "/ru/uslugi/modernizaciya-wordpress-sayta", description: "Чисто вести старые WordPress-системы." },
      { label: "Производительность", href: "/ru/uslugi/optimizaciya-proizvoditelnosti", description: "Улучшить скорость и стабильность." },
      { label: "Релонч сайта", href: "/ru/uslugi/relonch-sajta", description: "Когда поддержки уже недостаточно." },
      { label: "Контакты", href: "/ru/kontakt", description: "Обсудить сопровождение." },
    ],
  },
  buchungssysteme: {
    navLabel: "Системы бронирования",
    title: "Системы бронирования для сайтов – записи, резервации и заявки проще",
    metaTitle: "Система онлайн-бронирования для сайта | SaaleWeb",
    metaDescription:
      "Системы онлайн-бронирования для сайтов: резервации, записи, заявки и интеграции для ресторанов, отелей, салонов и локального бизнеса.",
    lead: [
      "Если клиенту нужно звонить, ждать или искать часы работы, часть бронирований теряется. Хороший процесс записи снижает трение.",
      "SaaleWeb интегрирует бронирования и заявки так, чтобы они подходили сайту, команде и реальному рабочему процессу.",
    ],
    problems: [
      "Путь к бронированию спрятан или слишком сложен.",
      "Форма неудобна на смартфоне.",
      "Сторонний инструмент выглядит чужеродно и снижает доверие.",
      "Брони или заявки попадают не туда.",
      "Нет понятного подтверждения или follow-up.",
      "SEO и процесс бронирования не связаны.",
    ],
    solution: [
      "Мы смотрим не только на инструмент, но и на путь до него: как пользователь приходит, что ему нужно знать и где возникает доверие.",
      "Затем интегрируем подходящие системы или проектируем индивидуальные процессы для резерваций, записей и квалифицированных заявок.",
    ],
    features: [
      { title: "Онлайн-резервации", text: "Для ресторанов, событий и локальных предложений." },
      { title: "Запись на услуги", text: "Для салонов, практик, консультаций и сервисов." },
      { title: "Формы заявок", text: "Для проектов, расчётов и квалифицированных лидов." },
      { title: "Уведомления", text: "Подтверждения, внутренние письма и внешние инструменты можно связать." },
      { title: "Мобильный UX", text: "Процесс остаётся коротким, ясным и вызывающим доверие." },
      { title: "Измеримость", text: "Брони и заявки можно отслеживать как важные бизнес-действия." },
    ],
    related: [
      { label: "Сайт ресторана", href: "/ru/otrasli/sayt-dlya-restorana", description: "Больше резерваций и понятная подача меню." },
      { label: "Сайт отеля", href: "/ru/otrasli/sayt-dlya-otelya", description: "Прямые брони и меньше зависимости от порталов." },
      { label: "Заказать сайт", href: "/ru/uslugi/razrabotka-saytov", description: "Встроить бронирование сразу в новый сайт." },
      { label: "Контакты", href: "/ru/kontakt", description: "Обсудить процесс бронирования." },
    ],
  },
};

const SERVICE_CASES_BY_LOCALE: Record<Phase4Locale, Phase4Link[]> = {
  de: [],
  en: [
    {
      label: "Neue Liebe Nebra",
      href: "/en/projects/neue-liebe-nebra",
      description: "Restaurant website with reservation focus, menu, Local SEO and responsive presentation.",
    },
    {
      label: "Salon Elen / Permanent Halle",
      href: "/en/projects/online-bookings-tripled",
      description: "Beauty studio with online appointment logic, clear services, Local SEO and mobile user guidance.",
    },
  ],
  ru: [
    {
      label: "Neue Liebe Nebra",
      href: "/ru/proekty/neue-liebe-nebra",
      description: "Сайт ресторана с фокусом на бронирование, меню, Local SEO и адаптивную подачу.",
    },
    {
      label: "Salon Elen / Permanent Halle",
      href: "/ru/proekty/onlajn-zapisi-vyrosli-vtroe",
      description: "Beauty Studio с онлайн-записью, понятными услугами, Local SEO и удобным мобильным путём.",
    },
  ],
};

type Phase5ServiceInput = {
  topic: string;
  navLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  lead: string[];
  problems: string[];
  solution: string[];
  features: Phase4Card[];
  related: Phase4Link[];
  cases?: Phase4Link[];
  extraFaq?: Phase4Faq[];
};

const phase5Labels: Record<
  Phase4Locale,
  {
    eyebrow: string;
    problemTitle: string;
    solutionTitle: string;
    featuresTitle: string;
    technologyTitle: string;
    technologyText: string;
    processTitle: string;
    process: Phase4Card[];
    casesTitle: string;
    relatedTitle: string;
    finalTitle: string;
    finalText: string;
  }
> = {
  de: {
    eyebrow: "Leistung",
    problemTitle: "Typische Probleme",
    solutionTitle: "Wie SaaleWeb hilft",
    featuresTitle: "Was wir für Sie umsetzen",
    technologyTitle: "Die Technologie folgt dem Ziel",
    technologyText:
      "Die Technologie folgt dem Ziel – nicht umgekehrt. Ob moderne Next.js-Plattform, professionell betreute WordPress-Website, individuelle Webanwendung, API-Integration oder Automatisierung: Entscheidend ist nicht das Framework, sondern der Nutzen für Ihr Unternehmen.",
    processTitle: "So entsteht eine sinnvolle Lösung",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    relatedTitle: "Sinnvolle nächste Seiten",
    finalTitle: "Lassen Sie uns prüfen, was für Ihr Unternehmen sinnvoll ist.",
    finalText:
      "Im kostenlosen Erstgespräch klären wir Ziel, Aufwand und die realistisch beste nächste Maßnahme.",
  },
  en: {
    eyebrow: "Service",
    problemTitle: "Typical problems",
    solutionTitle: "How SaaleWeb helps",
    featuresTitle: "What we can implement for you",
    technologyTitle: "Technology follows the goal",
    technologyText:
      "Technology follows the business goal, not the other way around. We can build modern Next.js platforms, professionally maintained WordPress websites, custom web applications, API integrations or automation workflows. The deciding factor is the business value, not the framework.",
    processTitle: "A clear path from idea to useful system",
    process: [
      { title: "Analysis", text: "We review goals, current setup, customer paths, data and technical constraints." },
      { title: "Concept", text: "You receive a clear plan for structure, functions, content and realistic implementation." },
      { title: "Implementation", text: "Design, development, integrations and content are connected into one stable solution." },
      { title: "Launch", text: "Before launch we check performance, mobile UX, forms, tracking and indexability." },
      { title: "Support", text: "After launch we improve the system based on real signals and business priorities." },
    ],
    casesTitle: "Relevant project examples",
    relatedTitle: "Useful next pages",
    finalTitle: "Let’s check what makes sense for your business.",
    finalText:
      "In the free first consultation we clarify your goal, realistic effort and the best next step.",
  },
  ru: {
    eyebrow: "Услуга",
    problemTitle: "Типичные проблемы",
    solutionTitle: "Как помогает SaaleWeb",
    featuresTitle: "Что мы можем реализовать",
    technologyTitle: "Технология следует цели",
    technologyText:
      "Технология следует бизнес-цели, а не наоборот. Мы можем разработать современную платформу на Next.js, профессионально поддерживать WordPress-сайт, создать индивидуальное веб-приложение, API-интеграцию или автоматизацию. Важнее всего польза для бизнеса, а не название фреймворка.",
    processTitle: "Понятный путь от идеи до рабочей системы",
    process: [
      { title: "Анализ", text: "Проверяем цели, текущую систему, путь клиента, данные и технические ограничения." },
      { title: "Концепция", text: "Формируем понятный план структуры, функций, контента и реалистичной реализации." },
      { title: "Реализация", text: "Объединяем дизайн, разработку, интеграции и контент в стабильное решение." },
      { title: "Запуск", text: "Перед запуском проверяем скорость, мобильность, формы, аналитику и индексацию." },
      { title: "Поддержка", text: "После запуска улучшаем систему по реальным сигналам и бизнес-приоритетам." },
    ],
    casesTitle: "Подходящие примеры проектов",
    relatedTitle: "Полезные следующие страницы",
    finalTitle: "Давайте проверим, что имеет смысл для вашего бизнеса.",
    finalText:
      "На бесплатной консультации уточним цель, реалистичный объём работ и лучший следующий шаг.",
  },
};

const PHASE5_SERVICE_CONTENT: Record<Phase4Locale, Record<string, Phase5ServiceInput>> = {
  de: {
    "online-shop-erstellen": {
      topic: "Online-Shops",
      navLabel: "Online-Shop erstellen",
      title: "Online-Shop erstellen lassen – klar strukturiert, schnell und auf Verkäufe vorbereitet",
      metaTitle: "Online-Shop erstellen lassen | SaaleWeb",
      metaDescription:
        "Online-Shop erstellen lassen mit SaaleWeb: Produktstruktur, mobile UX, SEO-Grundlage, Importprozesse, Checkout-Vertrauen und langfristige Wartbarkeit.",
      lead: [
        "Ein Online-Shop muss mehr leisten als Produkte anzeigen. Kunden brauchen Orientierung, Vertrauen, schnelle Ladezeiten und einen einfachen Weg zum Kauf.",
        "SaaleWeb entwickelt Shops, die zu Sortiment, Team und Wachstum passen – von klarer Produktstruktur bis zu Importen, Schnittstellen und SEO-Basis.",
      ],
      problems: [
        "Kategorien, Filter oder Produktdaten sind unklar aufgebaut.",
        "Mobile Nutzer verlieren Vertrauen oder brechen im Checkout ab.",
        "Produktpflege kostet zu viel Zeit, weil Importe fehlen.",
        "SEO für Kategorien und Produkte wird erst nachträglich bedacht.",
      ],
      solution: [
        "Wir planen Shop-Struktur, Produktlogik, Inhalte und technische Basis gemeinsam, damit der Shop verständlich, schnell und wartbar bleibt.",
        "Je nach Ziel integrieren wir Zahlungswege, Produktimporte, CRM- oder Warenwirtschafts-Schnittstellen und klare Analysepunkte.",
      ],
      features: [
        { title: "Shop-Struktur", text: "Kategorien, Produktseiten, Filter und Navigation werden auf Kaufentscheidungen ausgerichtet." },
        { title: "Produktdaten", text: "CSV-, XML- oder API-Importe können vorbereitet, bereinigt und wiederholbar gemacht werden." },
        { title: "Checkout-Vertrauen", text: "Kontakt, Versand, Zahlungswege und Sicherheit werden klar kommuniziert." },
        { title: "SEO-Basis", text: "Kategorie- und Produktseiten erhalten saubere Titel, Inhalte und interne Links." },
      ],
      related: [
        { label: "Shop-Produktimport", href: "/leistungen/shop-produktimport", description: "Produktdaten sauber übernehmen und aktualisieren." },
        { label: "API-Integrationen", href: "/leistungen/api-integrationen", description: "Shop mit Tools, Warenwirtschaft oder CRM verbinden." },
        { label: "Website-Sicherheit", href: "/leistungen/website-sicherheit", description: "Technische Grundlagen und vertrauenswürdige Abläufe stärken." },
        { label: "Kontakt", href: "/kontakt", description: "Shop-Projekt unverbindlich besprechen." },
      ],
      cases: serviceCases.restaurant,
    },
    "ki-assistent": {
      topic: "KI-Assistenten",
      navLabel: "KI-Assistent",
      title: "KI-Assistent und KI-Chatbot für Unternehmen – hilfreich, kontrollierbar und sinnvoll integriert",
      metaTitle: "KI-Assistent & KI-Chatbot für Unternehmen | SaaleWeb",
      metaDescription:
        "KI-Assistent oder KI-Chatbot für Firmen: FAQ, Lead-Vorqualifizierung, Wissensstruktur, Prozessintegration und kontrollierte Übergabe an Menschen.",
      lead: [
        "KI ist nur dann sinnvoll, wenn sie echte Fragen schneller klärt oder interne Arbeit reduziert.",
        "SaaleWeb entwickelt KI-Assistenten und KI-Chatbots für Unternehmen so, dass Wissensbasis, erlaubte Themen, Anfragewege und menschliche Übergabe zum realen Geschäftsprozess passen.",
      ],
      problems: [
        "Kunden stellen wiederholt ähnliche Fragen, bevor sie anfragen.",
        "Interne Informationen liegen verstreut in Dokumenten, E-Mails oder Tabellen.",
        "KI-Tools wirken losgelöst von Website und Geschäftsprozess.",
        "Es fehlt ein klarer Rahmen, welche Antworten automatisiert werden dürfen.",
      ],
      solution: [
        "Wir strukturieren Wissen, definieren sinnvolle Einsatzbereiche und integrieren KI dort, wo sie Nutzern oder Team wirklich hilft.",
        "Dabei bleiben Transparenz, redaktionelle Kontrolle und sichere Übergabe an Menschen wichtiger als Showeffekte.",
      ],
      features: [
        { title: "FAQ-Assistent", text: "Häufige Fragen können verständlich vorbereitet und auf Anfragewege abgestimmt werden." },
        { title: "Lead-Vorbereitung", text: "Anfragen können vorqualifiziert werden, ohne den persönlichen Kontakt zu ersetzen." },
        { title: "Wissensstruktur", text: "Leistungen, Dokumente und Abläufe werden so geordnet, dass KI sie besser nutzen kann." },
        { title: "Kontrollierte Übergabe", text: "Bei sensiblen Themen wird klar an das Team weitergeleitet." },
      ],
      related: [
        { label: "Automatisierung", href: "/leistungen/automatisierung", description: "KI sinnvoll mit Abläufen verbinden." },
        { label: "API-Integrationen", href: "/leistungen/api-integrationen", description: "KI mit bestehenden Tools verbinden." },
        { label: "Datenanalyse", href: "/leistungen/datenanalyse", description: "Daten strukturiert auswerten und nutzbar machen." },
        { label: "Kontakt", href: "/kontakt", description: "KI-Einsatz realistisch prüfen." },
      ],
      cases: serviceCases.local,
    },
    automatisierung: {
      topic: "Automatisierung",
      navLabel: "Automatisierung",
      title: "Automatisierung für Websites und Geschäftsprozesse – weniger manuelle Arbeit, klarere Abläufe",
      metaTitle: "Automatisierung für Unternehmen | SaaleWeb",
      metaDescription:
        "Automatisierung für Website, Leads, CRM, E-Mail, Daten und Geschäftsprozesse. SaaleWeb verbindet digitale Abläufe sauber und nachvollziehbar.",
      lead: [
        "Viele Unternehmen verlieren Zeit durch wiederholte manuelle Aufgaben: kopieren, nachfragen, sortieren, weiterleiten.",
        "SaaleWeb automatisiert ausgewählte Abläufe so, dass Team, Website und Tools besser zusammenarbeiten.",
      ],
      problems: [
        "Anfragen landen in verschiedenen Postfächern oder Tools.",
        "Follow-ups werden vergessen oder zu spät verschickt.",
        "Daten werden mehrfach manuell übertragen.",
        "Es fehlt Überblick, welche Anfrage welchen Status hat.",
      ],
      solution: [
        "Wir analysieren den bestehenden Ablauf und automatisieren nur die Schritte, die messbar Zeit sparen oder Fehler reduzieren.",
        "Dabei achten wir auf einfache Wartung, klare Zuständigkeiten und nachvollziehbare Übergaben.",
      ],
      features: [
        { title: "Lead-Flows", text: "Formulare, E-Mails, CRM und Benachrichtigungen können sauber verbunden werden." },
        { title: "Follow-up", text: "Bestätigungen, interne Aufgaben und Erinnerungen werden verlässlicher ausgelöst." },
        { title: "Datenübergabe", text: "Daten aus Website, Shop oder Tools werden kontrolliert weitergegeben." },
        { title: "Prozessklarheit", text: "Automatisierung bleibt verständlich und dokumentiert." },
      ],
      related: [
        { label: "KI-Assistent", href: "/leistungen/ki-assistent", description: "Automatisierung mit hilfreicher KI kombinieren." },
        { label: "API-Integrationen", href: "/leistungen/api-integrationen", description: "Tools und Datenquellen verbinden." },
        { label: "Datenanalyse", href: "/leistungen/datenanalyse", description: "Abläufe sichtbar und auswertbar machen." },
        { label: "Kontakt", href: "/kontakt", description: "Automatisierungspotenzial prüfen." },
      ],
      cases: serviceCases.booking,
    },
    "api-integrationen": {
      topic: "API-Integrationen",
      navLabel: "API-Integrationen",
      title: "API-Integrationen – Website, Shop, CRM und Datenquellen sauber verbinden",
      metaTitle: "API-Integrationen | SaaleWeb",
      metaDescription:
        "API-Integrationen für Websites, Shops, CRM, Buchungssysteme und Datenquellen. SaaleWeb verbindet Systeme pragmatisch und wartbar.",
      lead: [
        "Eine Website wird stärker, wenn sie nicht isoliert arbeitet, sondern sinnvoll mit bestehenden Tools verbunden ist.",
        "SaaleWeb plant und entwickelt API-Integrationen, die Datenflüsse vereinfachen und manuelle Arbeit reduzieren.",
      ],
      problems: [
        "Website, CRM, Shop oder Buchungssystem arbeiten getrennt voneinander.",
        "Daten müssen manuell übertragen oder korrigiert werden.",
        "Bestehende Schnittstellen sind unklar dokumentiert.",
        "Fehler fallen erst auf, wenn Kunden oder Team betroffen sind.",
      ],
      solution: [
        "Wir prüfen vorhandene APIs, definieren sichere Datenflüsse und bauen Integrationen so, dass sie im Alltag nachvollziehbar bleiben.",
        "Wichtige Fehlerfälle, Benachrichtigungen und Datenschutzanforderungen werden bereits im Konzept berücksichtigt.",
      ],
      features: [
        { title: "Tool-Verbindung", text: "CRM, Kalender, Shop, Newsletter, Buchung oder interne Systeme können angebunden werden." },
        { title: "Datenlogik", text: "Felder, Formate und Übergaben werden sauber gemappt." },
        { title: "Fehlerbehandlung", text: "Wichtige Ausfälle oder unvollständige Daten werden sichtbar." },
        { title: "Dokumentation", text: "Die Integration bleibt verständlich und später erweiterbar." },
      ],
      related: [
        { label: "Automatisierung", href: "/leistungen/automatisierung", description: "Integrationen in echte Abläufe einbetten." },
        { label: "Online-Shop erstellen", href: "/leistungen/online-shop-erstellen", description: "Shop und Backend sinnvoll verbinden." },
        { label: "Shop-Produktimport", href: "/leistungen/shop-produktimport", description: "Produktdaten über Dateien oder APIs übernehmen." },
        { label: "Kontakt", href: "/kontakt", description: "Schnittstelle besprechen." },
      ],
      cases: serviceCases.booking,
    },
    "website-sicherheit": {
      topic: "Website-Sicherheit",
      navLabel: "Website-Sicherheit",
      title: "Website-Sicherheit – technische Grundlagen, Updates und Vertrauen sauber absichern",
      metaTitle: "Website-Sicherheit | SaaleWeb",
      metaDescription:
        "Website-Sicherheit für Unternehmensseiten und WordPress: Updates, technische Härtung, Backups, Formularschutz, Monitoring und vertrauenswürdige Basis.",
      lead: [
        "Sicherheit bedeutet für viele Unternehmen vor allem: Die Website soll zuverlässig funktionieren, Vertrauen schaffen und keine unnötigen Risiken öffnen.",
        "SaaleWeb kümmert sich um die praktischen Grundlagen für professionelle Websites, Shops und WordPress-Systeme.",
      ],
      problems: [
        "Updates, Plugins oder Abhängigkeiten bleiben zu lange ungeprüft.",
        "Formulare sind anfällig für Spam oder unklare Datenflüsse.",
        "Backups, SSL, Weiterleitungen oder Servereinstellungen sind nicht sauber dokumentiert.",
        "Kunden verlieren Vertrauen, wenn Warnungen, Fehler oder Ausfälle sichtbar werden.",
      ],
      solution: [
        "Wir prüfen die technische Basis, schließen typische Schwachstellen im Website-Betrieb und richten nachvollziehbare Pflegeprozesse ein.",
        "Der Fokus liegt auf professioneller Website-Absicherung, Wartbarkeit und klarer Verantwortung – nicht auf überzogenen Enterprise-Cybersecurity-Versprechen.",
      ],
      features: [
        { title: "Updates & Pflege", text: "WordPress, Plugins, Themes oder App-Abhängigkeiten werden kontrolliert betreut." },
        { title: "Backups & Wiederherstellung", text: "Sinnvolle Sicherungen reduzieren Risiko bei Fehlern oder Ausfällen." },
        { title: "Formularschutz", text: "Kontakt- und Lead-Formulare werden gegen einfache Spam- und Missbrauchsmuster geschützt." },
        { title: "Technische Basis", text: "SSL, Weiterleitungen, Header und Zugänge werden pragmatisch geprüft." },
      ],
      related: [
        { label: "Website-Wartung", href: "/leistungen/website-wartung", description: "Regelmäßige Pflege statt einmaliger Aktion." },
        { label: "WordPress modernisieren", href: "/leistungen/wordpress-website-modernisieren", description: "Bestehende WordPress-Systeme sauber betreuen." },
        { label: "API-Integrationen", href: "/leistungen/api-integrationen", description: "Schnittstellen kontrolliert anbinden." },
        { label: "Kontakt", href: "/kontakt", description: "Website-Sicherheit prüfen lassen." },
      ],
      cases: serviceCases.local,
    },
    datenanalyse: {
      topic: "Datenanalyse",
      navLabel: "Datenanalyse",
      title: "Datenanalyse für Website, SEO und Prozesse – bessere Entscheidungen aus echten Signalen",
      metaTitle: "Datenanalyse für Website und SEO | SaaleWeb",
      metaDescription:
        "Datenanalyse für Websites, SEO, Leads und Prozesse: Dashboards, Auswertung, Tracking-Konzept und verständliche Handlungsempfehlungen.",
      lead: [
        "Daten helfen nur, wenn sie verständlich sind und zu konkreten Entscheidungen führen.",
        "SaaleWeb richtet Analysen so aus, dass Unternehmer sehen, welche Inhalte, Kanäle und Prozesse wirklich relevant sind.",
      ],
      problems: [
        "Zahlen liegen in verschiedenen Tools, aber niemand erkennt die nächste Maßnahme.",
        "SEO-, Lead- und Website-Daten werden getrennt betrachtet.",
        "Tracking ist unvollständig oder nicht datenschutzbewusst geplant.",
        "Berichte sind technisch, aber nicht handlungsorientiert.",
      ],
      solution: [
        "Wir definieren sinnvolle Kennzahlen, bringen Datenquellen zusammen und übersetzen Ergebnisse in klare nächste Schritte.",
        "Der Fokus liegt auf Orientierung, nicht auf Datenmenge.",
      ],
      features: [
        { title: "Tracking-Konzept", text: "Wichtige Ziele wie Anfragen, Buchungen oder Downloads werden nachvollziehbar geplant." },
        { title: "SEO-Auswertung", text: "Suchanfragen, Seitenstruktur und Content-Chancen werden verständlich bewertet." },
        { title: "Lead-Analyse", text: "Kontaktwege und Anfragequalität werden sichtbarer." },
        { title: "Dashboards", text: "Auswertungen bleiben kompakt, lesbar und entscheidungsorientiert." },
      ],
      related: [
        { label: "SEO Halle", href: "/leistungen/seo-halle", description: "Sichtbarkeit aus Daten gezielt verbessern." },
        { label: "Automatisierung", href: "/leistungen/automatisierung", description: "Daten in Prozesse überführen." },
        { label: "Website analysieren", href: "/#website-audit", description: "Kostenlosen Website-Audit starten." },
        { label: "Kontakt", href: "/kontakt", description: "Auswertung besprechen." },
      ],
      cases: serviceCases.local,
    },
    "shop-produktimport": {
      topic: "Shop-Produktimporte",
      navLabel: "Shop-Produktimport",
      title: "Shop-Produktimport – Produktdaten sauber übernehmen, strukturieren und aktualisieren",
      metaTitle: "Shop-Produktimport | SaaleWeb",
      metaDescription:
        "Shop-Produktimport für CSV, XML, Excel und API-Daten: Produktdaten bereinigen, strukturieren, importieren und wartbar aktualisieren.",
      lead: [
        "Produktdaten entscheiden darüber, ob ein Shop verständlich, auffindbar und pflegbar bleibt.",
        "SaaleWeb hilft, Produktdaten aus Dateien oder Schnittstellen sauber in Shop-Strukturen zu bringen.",
      ],
      problems: [
        "Lieferantendaten sind uneinheitlich, unvollständig oder schwer importierbar.",
        "Bilder, Varianten, Preise oder Kategorien passen nicht zum Shop.",
        "Manuelle Produktpflege kostet zu viel Zeit.",
        "SEO-relevante Produktinformationen fehlen oder sind zu dünn.",
      ],
      solution: [
        "Wir analysieren Datenquellen, bereinigen Felder, planen Kategorien und richten wiederholbare Importlogik ein.",
        "Bei Bedarf werden Produktdaten mit SEO-Grundlagen, Bildern, Varianten und internen Links verbunden.",
      ],
      features: [
        { title: "CSV, XML, Excel", text: "Typische Lieferantenformate können geprüft und für den Import vorbereitet werden." },
        { title: "API-Importe", text: "Wenn Schnittstellen vorhanden sind, können Produktdaten automatisierter übernommen werden." },
        { title: "Datenbereinigung", text: "Felder, Kategorien, Varianten und Bilder werden konsistenter strukturiert." },
        { title: "Shop-SEO", text: "Produkt- und Kategoriedaten werden suchmaschinenfreundlicher vorbereitet." },
      ],
      related: [
        { label: "Online-Shop erstellen", href: "/leistungen/online-shop-erstellen", description: "Shop mit sauberer Produktstruktur aufbauen." },
        { label: "API-Integrationen", href: "/leistungen/api-integrationen", description: "Produktdaten per Schnittstelle anbinden." },
        { label: "Datenanalyse", href: "/leistungen/datenanalyse", description: "Datenqualität und Performance auswerten." },
        { label: "Kontakt", href: "/kontakt", description: "Importumfang prüfen." },
      ],
      cases: serviceCases.restaurant,
    },
  },
  en: {
    "online-shop-erstellen": {
      topic: "online shops",
      navLabel: "Online shop development",
      title: "Online shop development – clear structure, fast UX and a trustworthy buying path",
      metaTitle: "Online shop development | SaaleWeb",
      metaDescription:
        "Online shop development with product structure, mobile UX, SEO foundation, import workflows, checkout trust and maintainable technology.",
      lead: [
        "An online shop has to do more than show products. Customers need orientation, trust, speed and a simple path to purchase.",
        "SaaleWeb builds shops that fit the product range, team and growth plan — including imports, integrations and SEO foundations.",
      ],
      problems: [
        "Categories, filters or product data are unclear.",
        "Mobile users lose trust or drop out during checkout.",
        "Product maintenance takes too much manual work.",
        "SEO for categories and products is added too late.",
      ],
      solution: [
        "We plan shop structure, product logic, content and technical foundation together so the system remains fast, understandable and maintainable.",
        "Depending on the goal, we connect payments, product imports, CRM, inventory systems or analytics points.",
      ],
      features: [
        { title: "Shop structure", text: "Categories, product pages, filters and navigation are planned around buying decisions." },
        { title: "Product data", text: "CSV, XML or API imports can be prepared, cleaned and made repeatable." },
        { title: "Checkout trust", text: "Contact, shipping, payment and safety information are communicated clearly." },
        { title: "SEO foundation", text: "Category and product pages get clean titles, content and internal links." },
      ],
      related: [
        { label: "Shop product import", href: "/en/services/shop-product-import", description: "Import and update product data cleanly." },
        { label: "API integrations", href: "/en/services/api-integrations", description: "Connect the shop to tools or inventory systems." },
        { label: "Website security", href: "/en/services/website-security", description: "Strengthen trust and technical basics." },
        { label: "Contact", href: "/en/contact", description: "Discuss the shop project." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.en,
    },
    "ki-assistent": {
      topic: "AI assistants",
      navLabel: "AI assistant",
      title: "AI assistant and AI chatbot for businesses – useful, controlled and integrated with purpose",
      metaTitle: "AI assistant & AI chatbot for businesses | SaaleWeb",
      metaDescription:
        "AI assistant or AI chatbot for a business: FAQ support, lead qualification, knowledge structure, process integration and controlled human handover.",
      lead: [
        "AI is useful only when it answers real questions faster or reduces internal work.",
        "SaaleWeb develops AI assistants and chatbots so their knowledge, allowed topics, inquiry paths and human handover fit the real business process.",
      ],
      problems: [
        "Customers ask the same questions before they can make an inquiry.",
        "Internal knowledge is spread across documents, emails or tables.",
        "AI tools feel detached from the website and real business process.",
        "There is no clear boundary for what should be automated.",
      ],
      solution: [
        "We structure knowledge, define useful use cases and integrate AI where it helps users or the team.",
        "Transparency, editorial control and human handover matter more than show effects.",
      ],
      features: [
        { title: "FAQ assistant", text: "Common questions can be prepared and aligned with inquiry paths." },
        { title: "Lead preparation", text: "Requests can be prequalified without replacing personal contact." },
        { title: "Knowledge structure", text: "Services, documents and processes are organized for reliable use." },
        { title: "Controlled handover", text: "Sensitive topics can be routed clearly to the team." },
      ],
      related: [
        { label: "Automation", href: "/en/services/automation", description: "Connect AI with practical workflows." },
        { label: "API integrations", href: "/en/services/api-integrations", description: "Connect AI to existing tools." },
        { label: "Data analytics", href: "/en/services/data-analytics", description: "Make data structured and useful." },
        { label: "Contact", href: "/en/contact", description: "Check a realistic AI use case." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.en,
      extraFaq: [
        {
          q: "What is the difference between an AI assistant and an AI chatbot for a business?",
          a: "A basic chatbot mainly answers recurring questions. An AI assistant can also structure knowledge, qualify inquiries, pass data to forms or systems and escalate to a person. SaaleWeb starts with one clearly bounded use case so value, control and privacy fit the business.",
        },
      ],
    },
    automatisierung: {
      topic: "automation",
      navLabel: "Automation",
      title: "Automation for websites and business processes – less manual work, clearer workflows",
      metaTitle: "Automation for businesses | SaaleWeb",
      metaDescription:
        "Automation for website leads, CRM, email, data and business processes. SaaleWeb connects digital workflows cleanly and pragmatically.",
      lead: [
        "Many businesses lose time through repeated manual work: copying, asking, sorting and forwarding.",
        "SaaleWeb automates selected workflows so the website, team and tools work better together.",
      ],
      problems: [
        "Inquiries land in different inboxes or tools.",
        "Follow-ups are forgotten or sent too late.",
        "Data is copied manually several times.",
        "There is no clear overview of inquiry status.",
      ],
      solution: [
        "We analyze the current process and automate only the steps that save time or reduce errors.",
        "The result stays understandable, maintainable and clearly assigned.",
      ],
      features: [
        { title: "Lead flows", text: "Forms, email, CRM and notifications can be connected cleanly." },
        { title: "Follow-up", text: "Confirmations, tasks and reminders are triggered more reliably." },
        { title: "Data handover", text: "Data from websites, shops or tools is passed on in a controlled way." },
        { title: "Process clarity", text: "Automation remains documented and easy to understand." },
      ],
      related: [
        { label: "AI assistant", href: "/en/services/ai-assistant", description: "Combine automation with useful AI." },
        { label: "API integrations", href: "/en/services/api-integrations", description: "Connect tools and data sources." },
        { label: "Data analytics", href: "/en/services/data-analytics", description: "Make workflows measurable." },
        { label: "Contact", href: "/en/contact", description: "Review automation potential." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.en,
    },
    "api-integrationen": {
      topic: "API integrations",
      navLabel: "API integrations",
      title: "API integrations – connect website, shop, CRM and data sources cleanly",
      metaTitle: "API integrations | SaaleWeb",
      metaDescription:
        "API integrations for websites, shops, CRM, booking systems and data sources. SaaleWeb connects systems pragmatically and maintainably.",
      lead: [
        "A website becomes stronger when it is connected with the tools your business already uses.",
        "SaaleWeb plans and builds API integrations that simplify data flows and reduce manual work.",
      ],
      problems: [
        "Website, CRM, shop or booking system are disconnected.",
        "Data has to be copied or corrected manually.",
        "Existing interfaces are poorly documented.",
        "Errors become visible only when customers or the team are affected.",
      ],
      solution: [
        "We review available APIs, define reliable data flows and build integrations that remain understandable in daily work.",
        "Important error handling, notifications and privacy requirements are included in the concept.",
      ],
      features: [
        { title: "Tool connection", text: "CRM, calendar, shop, newsletter, booking or internal systems can be connected." },
        { title: "Data logic", text: "Fields, formats and handovers are mapped cleanly." },
        { title: "Error handling", text: "Important failures or incomplete data become visible." },
        { title: "Documentation", text: "The integration remains understandable and extendable." },
      ],
      related: [
        { label: "Automation", href: "/en/services/automation", description: "Turn integrations into real workflows." },
        { label: "Online shop development", href: "/en/services/online-shop-development", description: "Connect shop and backend." },
        { label: "Shop product import", href: "/en/services/shop-product-import", description: "Import product data from files or APIs." },
        { label: "Contact", href: "/en/contact", description: "Discuss the interface." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.en,
    },
    "website-sicherheit": {
      topic: "website security",
      navLabel: "Website security",
      title: "Website security – practical technical basics, updates and trust",
      metaTitle: "Website security | SaaleWeb",
      metaDescription:
        "Website security for business websites and WordPress: updates, practical hardening, backups, form protection, monitoring and a trustworthy technical base.",
      lead: [
        "For most businesses, website security means reliability, trust and avoiding unnecessary risk.",
        "SaaleWeb takes care of practical foundations for professional websites, shops and WordPress systems.",
      ],
      problems: [
        "Updates, plugins or dependencies remain unchecked too long.",
        "Forms are exposed to spam or unclear data flows.",
        "Backups, SSL, redirects or server settings are not documented.",
        "Visible warnings, errors or downtime damage trust.",
      ],
      solution: [
        "We review the technical base, close typical website-operation gaps and set up understandable maintenance routines.",
        "The focus is practical website protection and responsibility, not exaggerated enterprise cybersecurity claims.",
      ],
      features: [
        { title: "Updates and care", text: "WordPress, plugins, themes or app dependencies are maintained in a controlled way." },
        { title: "Backups", text: "Useful backups reduce risk when errors or outages occur." },
        { title: "Form protection", text: "Contact and lead forms are protected against simple spam patterns." },
        { title: "Technical basics", text: "SSL, redirects, headers and access are reviewed pragmatically." },
      ],
      related: [
        { label: "Website maintenance", href: "/en/services/website-maintenance", description: "Regular care instead of a one-off fix." },
        { label: "WordPress modernization", href: "/en/services/wordpress-website-modernization", description: "Improve and maintain existing WordPress systems." },
        { label: "API integrations", href: "/en/services/api-integrations", description: "Connect interfaces in a controlled way." },
        { label: "Contact", href: "/en/contact", description: "Review website security." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.en,
    },
    datenanalyse: {
      topic: "data analytics",
      navLabel: "Data analytics",
      title: "Data analytics for websites, SEO and processes – better decisions from real signals",
      metaTitle: "Data analytics for website and SEO | SaaleWeb",
      metaDescription:
        "Data analytics for websites, SEO, leads and processes: dashboards, reporting, tracking concepts and clear recommendations.",
      lead: [
        "Data helps only when it is understandable and leads to concrete decisions.",
        "SaaleWeb sets up analytics so business owners can see which content, channels and processes matter.",
      ],
      problems: [
        "Numbers are spread across tools, but the next action is unclear.",
        "SEO, lead and website data are viewed separately.",
        "Tracking is incomplete or not planned with privacy in mind.",
        "Reports are technical but not action-oriented.",
      ],
      solution: [
        "We define useful metrics, connect data sources and translate findings into clear next steps.",
        "The focus is orientation, not data overload.",
      ],
      features: [
        { title: "Tracking concept", text: "Important goals like inquiries, bookings or downloads are planned clearly." },
        { title: "SEO analysis", text: "Queries, page structure and content opportunities are evaluated understandably." },
        { title: "Lead analysis", text: "Contact paths and inquiry quality become more visible." },
        { title: "Dashboards", text: "Reports stay compact, readable and decision-oriented." },
      ],
      related: [
        { label: "SEO Halle", href: "/en/services/seo-halle", description: "Improve visibility based on signals." },
        { label: "Automation", href: "/en/services/automation", description: "Turn data into workflows." },
        { label: "Website audit", href: "/en#website-audit", description: "Start a free website audit." },
        { label: "Contact", href: "/en/contact", description: "Discuss analytics." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.en,
    },
    "shop-produktimport": {
      topic: "shop product imports",
      navLabel: "Shop product import",
      title: "Shop product import – clean, structured and repeatable product data",
      metaTitle: "Shop product import | SaaleWeb",
      metaDescription:
        "Shop product import for CSV, XML, Excel and API data: clean, structure, import and update product information in a maintainable way.",
      lead: [
        "Product data determines whether a shop stays understandable, searchable and maintainable.",
        "SaaleWeb helps bring product data from files or interfaces into clean shop structures.",
      ],
      problems: [
        "Supplier data is inconsistent, incomplete or hard to import.",
        "Images, variants, prices or categories do not fit the shop.",
        "Manual product maintenance takes too much time.",
        "SEO-relevant product information is missing or too thin.",
      ],
      solution: [
        "We analyze data sources, clean fields, plan categories and set up repeatable import logic.",
        "If needed, product data is connected with SEO basics, images, variants and internal links.",
      ],
      features: [
        { title: "CSV, XML, Excel", text: "Typical supplier formats can be reviewed and prepared for import." },
        { title: "API imports", text: "When interfaces are available, product data can be imported more automatically." },
        { title: "Data cleanup", text: "Fields, categories, variants and images are structured more consistently." },
        { title: "Shop SEO", text: "Product and category data is prepared with search visibility in mind." },
      ],
      related: [
        { label: "Online shop development", href: "/en/services/online-shop-development", description: "Build a shop with a clean product structure." },
        { label: "API integrations", href: "/en/services/api-integrations", description: "Connect product data through interfaces." },
        { label: "Data analytics", href: "/en/services/data-analytics", description: "Evaluate data quality and performance." },
        { label: "Contact", href: "/en/contact", description: "Review import scope." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.en,
    },
  },
  ru: {
    "online-shop-erstellen": {
      topic: "интернет-магазина",
      navLabel: "Интернет-магазин",
      title: "Создание интернет-магазина — понятная структура, быстрая работа и доверительный путь к покупке",
      metaTitle: "Создание интернет-магазина | SaaleWeb",
      metaDescription:
        "Создание интернет-магазина: структура товаров, мобильный UX, SEO-база, импорт данных, доверие в checkout и поддерживаемая технология.",
      lead: [
        "Интернет-магазин должен не просто показывать товары. Клиенту нужны понятная навигация, доверие, скорость и простой путь к покупке.",
        "SaaleWeb создаёт магазины под ассортимент, команду и рост: от структуры каталога до импортов, интеграций и SEO-базы.",
      ],
      problems: [
        "Категории, фильтры или товарные данные построены непонятно.",
        "Мобильные пользователи теряют доверие или уходят на этапе покупки.",
        "Обновление товаров занимает слишком много ручной работы.",
        "SEO для категорий и товаров вспоминают слишком поздно.",
      ],
      solution: [
        "Мы планируем структуру магазина, логику товаров, контент и техническую основу вместе, чтобы система была быстрой и поддерживаемой.",
        "При необходимости подключаем оплату, импорт товаров, CRM, складские системы или понятные точки аналитики.",
      ],
      features: [
        { title: "Структура магазина", text: "Категории, страницы товаров, фильтры и навигация строятся вокруг решения о покупке." },
        { title: "Товарные данные", text: "CSV, XML или API-импорты можно подготовить, очистить и сделать повторяемыми." },
        { title: "Доверие в checkout", text: "Контакты, доставка, оплата и безопасность объясняются ясно." },
        { title: "SEO-база", text: "Категории и товары получают чистые заголовки, контент и внутренние ссылки." },
      ],
      related: [
        { label: "Импорт товаров", href: "/ru/uslugi/import-tovarov", description: "Чисто перенести и обновлять товарные данные." },
        { label: "API-интеграции", href: "/ru/uslugi/api-integracii", description: "Связать магазин с инструментами или складом." },
        { label: "Безопасность сайта", href: "/ru/uslugi/bezopasnost-sayta", description: "Укрепить доверие и техническую основу." },
        { label: "Контакты", href: "/ru/kontakt", description: "Обсудить проект магазина." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.ru,
    },
    "ki-assistent": {
      topic: "ИИ-ассистента",
      navLabel: "ИИ-ассистент",
      title: "ИИ-ассистент и ИИ-чатбот для бизнеса — полезно, контролируемо и без лишнего шума",
      metaTitle: "ИИ-ассистент и ИИ-чатбот для бизнеса | SaaleWeb",
      metaDescription:
        "ИИ-ассистент или чатбот для компании: FAQ, квалификация заявок, структура знаний, интеграция в процессы и передача человеку.",
      lead: [
        "ИИ имеет смысл только тогда, когда быстрее отвечает на реальные вопросы или снижает внутреннюю нагрузку.",
        "SaaleWeb разрабатывает ИИ-ассистентов и чатботов так, чтобы база знаний, разрешённые темы, путь заявки и передача человеку соответствовали реальному процессу компании.",
      ],
      problems: [
        "Клиенты задают одни и те же вопросы до отправки заявки.",
        "Внутренние знания разбросаны по документам, письмам и таблицам.",
        "ИИ-инструменты не связаны с сайтом и реальным процессом.",
        "Нет чётких границ, что можно автоматизировать.",
      ],
      solution: [
        "Мы структурируем знания, определяем полезные сценарии и интегрируем ИИ там, где он помогает клиентам или команде.",
        "Прозрачность, редакционный контроль и передача человеку важнее показательных эффектов.",
      ],
      features: [
        { title: "FAQ-ассистент", text: "Частые вопросы можно подготовить и связать с путями заявки." },
        { title: "Подготовка заявок", text: "Запросы можно предварительно квалифицировать, не заменяя личный контакт." },
        { title: "Структура знаний", text: "Услуги, документы и процессы организуются для надёжного использования." },
        { title: "Контролируемая передача", text: "Чувствительные темы направляются к команде." },
      ],
      related: [
        { label: "Автоматизация", href: "/ru/uslugi/avtomatizaciya", description: "Связать ИИ с практическими процессами." },
        { label: "API-интеграции", href: "/ru/uslugi/api-integracii", description: "Подключить ИИ к существующим инструментам." },
        { label: "Аналитика данных", href: "/ru/uslugi/analitika-dannyh", description: "Сделать данные структурированными и полезными." },
        { label: "Контакты", href: "/ru/kontakt", description: "Проверить реалистичный сценарий ИИ." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.ru,
      extraFaq: [
        {
          q: "Чем ИИ-ассистент отличается от ИИ-чатбота для компании?",
          a: "Простой чатбот в основном отвечает на повторяющиеся вопросы. ИИ-ассистент может также структурировать знания, квалифицировать заявки, передавать данные в формы или системы и подключать сотрудника. SaaleWeb начинает с одного чётко ограниченного сценария, чтобы польза, контроль и приватность соответствовали бизнесу.",
        },
      ],
    },
    automatisierung: {
      topic: "автоматизации",
      navLabel: "Автоматизация",
      title: "Автоматизация для сайта и бизнес-процессов — меньше ручной работы, понятнее поток",
      metaTitle: "Автоматизация для бизнеса | SaaleWeb",
      metaDescription:
        "Автоматизация для заявок, CRM, email, данных и бизнес-процессов. SaaleWeb соединяет цифровые процессы понятно и прагматично.",
      lead: [
        "Многие компании теряют время на повторяющихся задачах: копировать, уточнять, сортировать, пересылать.",
        "SaaleWeb автоматизирует выбранные шаги так, чтобы сайт, команда и инструменты работали согласованно.",
      ],
      problems: [
        "Заявки попадают в разные почтовые ящики и инструменты.",
        "Follow-up забывают или отправляют слишком поздно.",
        "Данные несколько раз переносятся вручную.",
        "Нет понятного обзора статуса заявок.",
      ],
      solution: [
        "Мы анализируем текущий процесс и автоматизируем только шаги, которые экономят время или уменьшают ошибки.",
        "Результат остаётся понятным, поддерживаемым и с ясной ответственностью.",
      ],
      features: [
        { title: "Lead-процессы", text: "Формы, email, CRM и уведомления можно связать аккуратно." },
        { title: "Follow-up", text: "Подтверждения, задачи и напоминания запускаются надёжнее." },
        { title: "Передача данных", text: "Данные из сайта, магазина или инструментов передаются контролируемо." },
        { title: "Прозрачность", text: "Автоматизация остаётся документированной и понятной." },
      ],
      related: [
        { label: "ИИ-ассистент", href: "/ru/uslugi/ai-assistent", description: "Соединить автоматизацию с полезным ИИ." },
        { label: "API-интеграции", href: "/ru/uslugi/api-integracii", description: "Связать инструменты и источники данных." },
        { label: "Аналитика данных", href: "/ru/uslugi/analitika-dannyh", description: "Сделать процессы измеримыми." },
        { label: "Контакты", href: "/ru/kontakt", description: "Проверить потенциал автоматизации." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.ru,
    },
    "api-integrationen": {
      topic: "API-интеграций",
      navLabel: "API-интеграции",
      title: "API-интеграции — связать сайт, магазин, CRM и источники данных",
      metaTitle: "API-интеграции | SaaleWeb",
      metaDescription:
        "API-интеграции для сайтов, магазинов, CRM, систем бронирования и источников данных. SaaleWeb соединяет системы прагматично и поддерживаемо.",
      lead: [
        "Сайт становится сильнее, когда он не работает отдельно, а связан с инструментами компании.",
        "SaaleWeb планирует и разрабатывает API-интеграции, которые упрощают поток данных и уменьшают ручную работу.",
      ],
      problems: [
        "Сайт, CRM, магазин или система бронирования не связаны.",
        "Данные приходится копировать или исправлять вручную.",
        "Существующие интерфейсы плохо документированы.",
        "Ошибки становятся заметны только для клиентов или команды.",
      ],
      solution: [
        "Мы проверяем доступные API, определяем надёжные потоки данных и создаём интеграции, понятные в ежедневной работе.",
        "Ошибки, уведомления и требования к данным учитываются уже в концепции.",
      ],
      features: [
        { title: "Связь инструментов", text: "CRM, календарь, магазин, рассылки, бронирование или внутренние системы можно подключить." },
        { title: "Логика данных", text: "Поля, форматы и передача данных аккуратно сопоставляются." },
        { title: "Обработка ошибок", text: "Важные сбои или неполные данные становятся видимыми." },
        { title: "Документация", text: "Интеграция остаётся понятной и расширяемой." },
      ],
      related: [
        { label: "Автоматизация", href: "/ru/uslugi/avtomatizaciya", description: "Превратить интеграции в рабочие процессы." },
        { label: "Интернет-магазин", href: "/ru/uslugi/sozdanie-internet-magazina", description: "Связать магазин и внутренние системы." },
        { label: "Импорт товаров", href: "/ru/uslugi/import-tovarov", description: "Загружать товарные данные из файлов или API." },
        { label: "Контакты", href: "/ru/kontakt", description: "Обсудить интерфейс." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.ru,
    },
    "website-sicherheit": {
      topic: "безопасности сайта",
      navLabel: "Безопасность сайта",
      title: "Безопасность сайта — практическая техническая основа, обновления и доверие",
      metaTitle: "Безопасность сайта | SaaleWeb",
      metaDescription:
        "Безопасность сайта для корпоративных сайтов и WordPress: обновления, базовая защита, резервные копии, защита форм, мониторинг и доверительная основа.",
      lead: [
        "Для большинства компаний безопасность сайта означает надёжность, доверие и отсутствие лишних рисков.",
        "SaaleWeb занимается практической основой для профессиональных сайтов, магазинов и WordPress-систем.",
      ],
      problems: [
        "Обновления, плагины или зависимости слишком долго не проверяются.",
        "Формы открыты для спама или неясных потоков данных.",
        "Backups, SSL, редиректы или серверные настройки не задокументированы.",
        "Предупреждения, ошибки или простои снижают доверие.",
      ],
      solution: [
        "Мы проверяем техническую основу, закрываем типичные проблемы эксплуатации сайта и настраиваем понятный уход.",
        "Фокус — практическая защита сайта и ответственность, а не завышенные обещания enterprise-cybersecurity.",
      ],
      features: [
        { title: "Обновления и уход", text: "WordPress, плагины, темы или зависимости приложения сопровождаются контролируемо." },
        { title: "Резервные копии", text: "Продуманные backups снижают риск при ошибках или сбоях." },
        { title: "Защита форм", text: "Контактные и lead-формы защищаются от простых спам-паттернов." },
        { title: "Техническая база", text: "SSL, редиректы, headers и доступы проверяются прагматично." },
      ],
      related: [
        { label: "Поддержка сайтов", href: "/ru/uslugi/podderzhka-saytov", description: "Регулярный уход вместо разовой правки." },
        { label: "Модернизация WordPress", href: "/ru/uslugi/modernizaciya-wordpress-sayta", description: "Улучшать и сопровождать существующий WordPress." },
        { label: "API-интеграции", href: "/ru/uslugi/api-integracii", description: "Подключать интерфейсы контролируемо." },
        { label: "Контакты", href: "/ru/kontakt", description: "Проверить безопасность сайта." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.ru,
    },
    datenanalyse: {
      topic: "аналитики данных",
      navLabel: "Аналитика данных",
      title: "Аналитика данных для сайта, SEO и процессов — решения на основе реальных сигналов",
      metaTitle: "Аналитика данных для сайта и SEO | SaaleWeb",
      metaDescription:
        "Аналитика данных для сайтов, SEO, заявок и процессов: dashboards, отчёты, tracking-концепция и понятные рекомендации.",
      lead: [
        "Данные помогают только тогда, когда они понятны и ведут к конкретным решениям.",
        "SaaleWeb настраивает аналитику так, чтобы предприниматель видел, какие страницы, каналы и процессы действительно важны.",
      ],
      problems: [
        "Цифры разбросаны по разным инструментам, но следующий шаг неясен.",
        "SEO, заявки и данные сайта анализируются отдельно.",
        "Tracking неполный или не учитывает приватность.",
        "Отчёты технические, но не помогают действовать.",
      ],
      solution: [
        "Мы определяем полезные метрики, соединяем источники данных и переводим выводы в понятные следующие шаги.",
        "Фокус — ориентация, а не перегрузка цифрами.",
      ],
      features: [
        { title: "Tracking-концепция", text: "Важные цели вроде заявок, бронирований или скачиваний планируются понятно." },
        { title: "SEO-анализ", text: "Запросы, структура страниц и контентные возможности оцениваются простым языком." },
        { title: "Lead-анализ", text: "Пути контакта и качество заявок становятся видимее." },
        { title: "Dashboards", text: "Отчёты остаются компактными, читаемыми и ориентированными на решения." },
      ],
      related: [
        { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Улучшать видимость по реальным сигналам." },
        { label: "Автоматизация", href: "/ru/uslugi/avtomatizaciya", description: "Переводить данные в процессы." },
        { label: "Анализ сайта", href: "/ru#website-audit", description: "Запустить бесплатную проверку сайта." },
        { label: "Контакты", href: "/ru/kontakt", description: "Обсудить аналитику." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.ru,
    },
    "shop-produktimport": {
      topic: "импорта товаров",
      navLabel: "Импорт товаров",
      title: "Импорт товаров в интернет-магазин — чистые, структурированные и повторяемые данные",
      metaTitle: "Импорт товаров в интернет-магазин | SaaleWeb",
      metaDescription:
        "Импорт товаров для CSV, XML, Excel и API: очистка, структура, загрузка и поддерживаемое обновление товарных данных.",
      lead: [
        "Товарные данные определяют, будет ли магазин понятным, найденным и удобным в сопровождении.",
        "SaaleWeb помогает перенести данные из файлов или интерфейсов в чистую структуру магазина.",
      ],
      problems: [
        "Данные поставщиков непоследовательные, неполные или плохо импортируются.",
        "Изображения, варианты, цены или категории не подходят к магазину.",
        "Ручное обновление товаров занимает слишком много времени.",
        "SEO-важная информация по товарам отсутствует или слишком слабая.",
      ],
      solution: [
        "Мы анализируем источники, очищаем поля, планируем категории и настраиваем повторяемую логику импорта.",
        "При необходимости товарные данные связываются с SEO-базой, изображениями, вариантами и внутренними ссылками.",
      ],
      features: [
        { title: "CSV, XML, Excel", text: "Типовые форматы поставщиков можно проверить и подготовить к импорту." },
        { title: "API-импорт", text: "Если интерфейсы доступны, товары можно загружать более автоматизированно." },
        { title: "Очистка данных", text: "Поля, категории, варианты и изображения структурируются последовательнее." },
        { title: "Shop SEO", text: "Данные товаров и категорий готовятся с учётом поисковой видимости." },
      ],
      related: [
        { label: "Интернет-магазин", href: "/ru/uslugi/sozdanie-internet-magazina", description: "Создать магазин с чистой структурой товаров." },
        { label: "API-интеграции", href: "/ru/uslugi/api-integracii", description: "Подключить товарные данные через интерфейсы." },
        { label: "Аналитика данных", href: "/ru/uslugi/analitika-dannyh", description: "Оценивать качество данных и результат." },
        { label: "Контакты", href: "/ru/kontakt", description: "Проверить объём импорта." },
      ],
      cases: SERVICE_CASES_BY_LOCALE.ru,
    },
  },
};

function phase5Faq(locale: Phase4Locale, topic: string, extra: Phase4Faq[] = []): Phase4Faq[] {
  const common: Record<Phase4Locale, Phase4Faq[]> = {
    de: [
      {
        q: `Für wen eignet sich ${topic}?`,
        a: `${topic} eignet sich für Unternehmen, die digitale Abläufe professioneller, sichtbarer und besser wartbar machen möchten.`,
      },
      {
        q: "Ist die erste Beratung kostenlos?",
        a: "Ja. Das Erstgespräch ist kostenlos und unverbindlich. Wir prüfen Ziel, Ausgangslage und sinnvolle nächste Schritte.",
      },
      {
        q: "Arbeitet SaaleWeb nur mit einer bestimmten Technologie?",
        a: "Nein. Die Technologie folgt dem Ziel. Wir empfehlen Next.js, WordPress, individuelle Entwicklung, API oder Automatisierung nur, wenn es zum Nutzen passt.",
      },
      {
        q: "Kann eine bestehende Website erweitert werden?",
        a: "Ja. Häufig ist eine Modernisierung, Integration oder gezielte Erweiterung sinnvoller als ein kompletter Neubau.",
      },
      {
        q: "Gibt es garantierte Rankings oder Umsätze?",
        a: "Nein. Seriöse digitale Arbeit verspricht keine garantierten Rankings oder Umsätze. Wir verbessern Struktur, Technik, Inhalte und Messbarkeit transparent.",
      },
    ],
    en: [
      {
        q: `Who is ${topic} suitable for?`,
        a: `${topic} is suitable for businesses that want a more professional, visible and maintainable digital setup.`,
      },
      {
        q: "Is the first consultation free?",
        a: "Yes. The first consultation is free and non-binding. We review goals, current situation and useful next steps.",
      },
      {
        q: "Does SaaleWeb work with one fixed technology?",
        a: "No. Technology follows the goal. We recommend Next.js, WordPress, custom development, APIs or automation only when it serves the business case.",
      },
      {
        q: "Can an existing website be extended?",
        a: "Yes. Modernization, integration or a focused extension is often more sensible than rebuilding everything.",
      },
      {
        q: "Do you guarantee rankings or revenue?",
        a: "No. Serious digital work does not guarantee fixed rankings or revenue. We improve structure, technology, content and measurability transparently.",
      },
    ],
    ru: [
      {
        q: `Кому подходит услуга ${topic}?`,
        a: `Она подходит компаниям, которые хотят сделать цифровую систему профессиональнее, заметнее и проще в сопровождении.`,
      },
      {
        q: "Первая консультация бесплатная?",
        a: "Да. Первый разговор бесплатный и ни к чему не обязывает. Мы проверяем цель, текущую ситуацию и разумные следующие шаги.",
      },
      {
        q: "SaaleWeb работает только с одной технологией?",
        a: "Нет. Технология следует цели. Мы рекомендуем Next.js, WordPress, индивидуальную разработку, API или автоматизацию только тогда, когда это полезно бизнесу.",
      },
      {
        q: "Можно расширить существующий сайт?",
        a: "Да. Часто модернизация, интеграция или точечное расширение разумнее, чем полная переделка.",
      },
      {
        q: "Вы гарантируете позиции или выручку?",
        a: "Нет. Серьёзная цифровая работа не гарантирует фиксированные позиции или выручку. Мы прозрачно улучшаем структуру, технологию, контент и измеримость.",
      },
    ],
  };
  return [...extra, ...common[locale], pricingFaq[locale], aiSearchFaq[locale]].slice(
    0,
    Math.max(8, extra.length + 6),
  );
}

function localizedServiceSlug(canonicalSlug: string, locale: Phase4Locale) {
  return SERVICE_SLUGS[canonicalSlug]?.[locale] ?? canonicalSlug;
}

function localizedAuditHref(locale: Phase4Locale) {
  if (locale === "en") return "/en/free-website-audit";
  if (locale === "ru") return "/ru/besplatnyy-audit-sayta";
  return "/kostenlose-website-analyse";
}

function localizedContactHref(locale: Phase4Locale) {
  if (locale === "en") return "/en/contact";
  if (locale === "ru") return "/ru/kontakt";
  return "/kontakt";
}

function localizedProjectsHref(locale: Phase4Locale) {
  if (locale === "en") return "/en/projects";
  if (locale === "ru") return "/ru/proekty";
  return "/projekte";
}

function localizedCityServicePage(canonicalSlug: string, locale: Phase4Locale): Phase4Landing | null {
  const match = /^(webdesign|seo)-(.+)$/.exec(canonicalSlug);
  if (!match) return null;

  const type = match[1] as CityServiceType;
  const city = CITY_SERVICE_TARGETS.find((item) => item.slug === match[2]);
  const slug = CITY_SERVICE_SLUGS[canonicalSlug]?.[locale];
  if (!city || !slug) return null;

  const label = phase5Labels[locale];
  const isWebdesign = type === "webdesign";
  const cityName = city.name;
  const area = locale === "de" ? city.deArea : locale === "en" ? city.enArea : city.ruArea;
  const angle = locale === "de" ? city.deAngle : locale === "en" ? city.enAngle : city.ruAngle;
  const partnerCanonical = cityServiceCanonical(isWebdesign ? "seo" : "webdesign", city.slug);
  const partnerSlug = localizedServiceSlug(partnerCanonical, locale);
  const pageSlug = localizedServiceSlug(canonicalSlug, locale);
  const websiteSlug = localizedServiceSlug("website-erstellen-lassen", locale);
  const aiSlug = localizedServiceSlug("ki-optimierung", locale);
  const performanceSlug = localizedServiceSlug("performance-optimierung", locale);

  const cases = locale === "de" ? serviceCases.local : SERVICE_CASES_BY_LOCALE[locale];

  if (locale === "de") {
    const serviceName = isWebdesign ? `Webdesign ${cityName}` : `SEO ${cityName}`;
    return {
      slug: pageSlug,
      navLabel: serviceName,
      eyebrow: "Lokale Leistung",
      title: isWebdesign
        ? `Webdesign ${cityName} – moderne Websites für Sichtbarkeit, Vertrauen und Anfragen`
        : `SEO ${cityName} – Local SEO, GEO und AI Search für mehr regionale Sichtbarkeit`,
      metaTitle: isWebdesign
        ? `Webdesign ${cityName} | Website erstellen lassen`
        : `SEO ${cityName} | Local SEO, GEO & AI Search`,
      metaDescription: isWebdesign
        ? `Webdesign ${cityName}: SaaleWeb erstellt schnelle, klare Websites mit Local SEO, GEO/AIO-Struktur und Anfragefokus für Unternehmen ${area}.`
        : `SEO ${cityName}: SaaleWeb verbessert technische SEO, Local SEO, Inhalte, strukturierte Daten und AI-Search-Verständlichkeit für Unternehmen ${area}.`,
      lead: isWebdesign
        ? [
            `Unternehmen ${area} brauchen heute mehr als eine schöne Website. Entscheidend ist, ob Besucher sofort verstehen, warum sie Ihnen vertrauen und anfragen sollen.`,
            `SaaleWeb entwickelt Websites mit klarer regionaler Struktur für ${angle}: schnell, mobil, SEO-bewusst und vorbereitet für moderne KI-Suche.`,
          ]
        : [
            `SEO ${cityName} bedeutet nicht nur Keywords. Entscheidend ist, ob Google, Nutzer und KI-Systeme Ihre Leistungen, Region und fachliche Relevanz eindeutig verstehen.`,
            `SaaleWeb verbindet technische SEO, Local SEO, Content-Struktur, FAQ, interne Links und GEO/AIO-Grundlagen für Unternehmen ${area}.`,
          ],
      problemTitle: isWebdesign
        ? `Warum viele Websites ${area} zu wenig Wirkung haben`
        : `Warum SEO ${area} oft nicht planbar genug wirkt`,
      problems: isWebdesign
        ? [
            "Leistungen werden zu allgemein beschrieben und unterscheiden sich kaum vom Wettbewerb.",
            "Der regionale Bezug ist nicht klar genug in Struktur, Texten und internen Links sichtbar.",
            "Mobile Nutzer finden Kontakt, Leistungen oder Vertrauen nicht schnell genug.",
            "Die Website wirkt optisch moderner als inhaltlich überzeugend — oder umgekehrt.",
            "Performance, Metadaten, Überschriften und strukturierte Daten werden erst nachträglich betrachtet.",
            "Inhalte sind für Google, ChatGPT, Gemini, Claude und Perplexity nicht eindeutig genug aufgebaut.",
          ]
        : [
            "Es gibt keine klare Seitenstruktur für Leistungen, Zielgruppen und regionale Suchintentionen.",
            "Lokale Suchbegriffe werden nicht mit echten Kundenfragen und Anfragewegen verbunden.",
            "Technische Themen wie Indexierung, Ladezeit, Meta-Daten und interne Links bremsen Sichtbarkeit.",
            "FAQ, Referenzen, Preise und Standortsignale sind nicht maschinenlesbar genug strukturiert.",
            "Google Business Profile, Website-Inhalte und Landingpages arbeiten nicht sauber zusammen.",
            "Es fehlen Prioritäten, Messpunkte und realistische nächste Schritte.",
          ],
      solutionTitle: isWebdesign
        ? `Webdesign ${cityName} mit klarer Business-Logik`
        : `SEO ${cityName} als System aus Technik, Inhalt und Vertrauen`,
      solution: isWebdesign
        ? [
            `Wir planen die Website nicht als Einzelbild, sondern als digitales System: Startseite, Leistungsseiten, lokale Signale, FAQ, Projektbeispiele und Kontaktwege greifen zusammen.`,
            `So entsteht ein Auftritt, der ${area} professionell wirkt, regionale Suchintentionen aufnimmt und Besucher ohne Umwege zur Anfrage führt.`,
          ]
        : [
            "Wir prüfen zuerst, welche Suchintentionen geschäftlich relevant sind und welche technischen oder inhaltlichen Hürden Sichtbarkeit verhindern.",
            `Danach entsteht ein priorisierter SEO-Plan für ${cityName}: technische Basis, Local SEO, Landingpages, strukturierte Inhalte, FAQ, interne Verlinkung und messbare Entwicklung.`,
          ],
      featuresTitle: isWebdesign
        ? `Was starkes Webdesign ${area} leisten sollte`
        : `Was SEO ${area} konkret umfasst`,
      features: isWebdesign
        ? [
            { title: "Klare Positionierung", text: "Die Website erklärt schnell, für wen Sie arbeiten, was Sie anbieten und warum das relevant ist." },
            { title: "Lokale Struktur", text: "Ort, Einzugsgebiet, Leistungen und interne Links werden sinnvoll verbunden." },
            { title: "Conversion-Führung", text: "Kontakt, Telefon, Formular, WhatsApp oder Terminlogik bleiben sichtbar und nachvollziehbar." },
            { title: "SEO-Basis", text: "Meta-Daten, Überschriften, Performance, strukturierte Daten und FAQ werden mitgedacht." },
            { title: "Mobile Qualität", text: "Smartphone-Nutzer erhalten kurze Wege, gute Lesbarkeit und schnelle Ladezeiten." },
            { title: "GEO/AIO-Vorbereitung", text: "Inhalte beantworten reale Fragen und helfen KI-Suchsystemen, Ihr Unternehmen korrekt einzuordnen." },
          ]
        : [
            { title: "Technische SEO", text: "Indexierung, Ladezeit, Core Web Vitals, Meta-Daten, interne Links und strukturierte Daten." },
            { title: "Local SEO", text: "Regionale Suchintentionen, Standortbezug, Einzugsgebiet und vertrauensbildende Inhalte." },
            { title: "Content-Architektur", text: "Leistungsseiten, FAQ, Preise, Prozess und Referenzen werden klar zusammengeführt." },
            { title: "AI Search / GEO", text: "Inhalte werden so formuliert, dass auch KI-Systeme Entitäten und Zusammenhänge verstehen." },
            { title: "Prioritätenplan", text: "Wir starten mit den Maßnahmen, die für Sichtbarkeit und Anfragen realistisch den größten Hebel haben." },
            { title: "Messbarkeit", text: "Wichtige Seiten, Anfragen und Entwicklung werden nachvollziehbar ausgewertet." },
          ],
      technologyTitle: "Die passende Technologie für Ihr Ziel",
      technologyText,
      processTitle: isWebdesign ? "Vom lokalen Ziel zur sichtbaren Website" : "Von Analyse zu messbarer Sichtbarkeit",
      process: serviceProcess,
      casesTitle: "Passende Projektbeispiele",
      cases,
      relatedTitle: "Sinnvolle nächste Seiten",
      relatedLinks: [
        {
          label: isWebdesign ? `SEO ${cityName}` : `Webdesign ${cityName}`,
          href: serviceHref(locale, partnerSlug),
          description: isWebdesign
            ? "Sichtbarkeit, Local SEO und AI-Search-Struktur ergänzend zur Website planen."
            : "Website-Struktur, Design und Conversion gemeinsam mit SEO denken.",
        },
        {
          label: cityName,
          href: locationHref(locale, city.slug),
          description: `Standortseite für regionale Sichtbarkeit ${area}.`,
        },
        {
          label: isWebdesign ? "Website erstellen lassen" : "KI-Optimierung",
          href: serviceHref(locale, isWebdesign ? websiteSlug : aiSlug),
          description: isWebdesign
            ? "Neue Website mit Strategie, SEO und sauberer technischer Basis planen."
            : "Inhalte für ChatGPT, Gemini, Claude, Perplexity und Google AI Overview strukturieren.",
        },
        {
          label: "Kostenlose Website-Analyse",
          href: localizedAuditHref(locale),
          description: "Aktuelle Website auf Sichtbarkeit, Technik und Anfragewege prüfen lassen.",
        },
        {
          label: "Kontakt",
          href: localizedContactHref(locale),
          description: "Unverbindlich über Ziel, Umfang und nächste Schritte sprechen.",
        },
      ],
      faq: cityServiceFaq(locale, city, type),
      finalTitle: "Lassen Sie uns prüfen, welche Seite wirklich sinnvoll ist.",
      finalText:
        "Im kostenlosen Erstgespräch klären wir Ziel, Wettbewerb, aktuelles Setup und realistische nächste Schritte — ohne Verkaufsdruck.",
    };
  }

  const en = locale === "en";
  const serviceName = isWebdesign
    ? en
      ? `Web design ${cityName}`
      : `Веб-дизайн ${cityName}`
    : `SEO ${cityName}`;

  return {
    slug: pageSlug,
    navLabel: serviceName,
    eyebrow: en ? "Local service" : "Локальная услуга",
    title: isWebdesign
      ? en
        ? `Web design ${cityName} – modern websites for visibility, trust and inquiries`
        : `Веб-дизайн ${cityName} — современные сайты для видимости, доверия и заявок`
      : en
        ? `SEO ${cityName} – Local SEO, GEO and AI Search for regional visibility`
        : `SEO ${cityName} — Local SEO, GEO и AI Search для региональной видимости`,
    metaTitle: isWebdesign
      ? en
        ? `Web design ${cityName} | Get a website built`
        : `Веб-дизайн ${cityName} | Создание сайта`
      : en
        ? `SEO ${cityName} | Local SEO, GEO & AI Search`
        : `SEO ${cityName} | Local SEO, GEO и AI Search`,
    metaDescription: isWebdesign
      ? en
        ? `Web design ${cityName}: SaaleWeb builds fast, clear websites with Local SEO, GEO/AIO structure and inquiry-focused UX for businesses ${area}.`
        : `Веб-дизайн ${cityName}: SaaleWeb создаёт быстрые и понятные сайты с Local SEO, GEO/AIO-структурой и фокусом на заявки для компаний ${area}.`
      : en
        ? `SEO ${cityName}: technical SEO, Local SEO, structured content, FAQ, schema and AI-search readability for businesses ${area}.`
        : `SEO ${cityName}: техническое SEO, Local SEO, структурированный контент, FAQ, schema и понятность для AI-поиска для компаний ${area}.`,
    lead: isWebdesign
      ? en
        ? [
            `Businesses ${area} need more than a nice layout. The website must explain the offer quickly, build trust and guide visitors toward an inquiry.`,
            `SaaleWeb builds websites for ${angle}: fast, mobile-friendly, SEO-aware and ready for modern AI search systems.`,
          ]
        : [
            `Компаниям ${area} нужен не просто красивый сайт. Сайт должен быстро объяснять предложение, вызывать доверие и вести посетителя к заявке.`,
            `SaaleWeb создаёт сайты с учётом ${angle}: быстро, удобно на мобильных устройствах, с SEO-базой и подготовкой к AI-поиску.`,
          ]
      : en
        ? [
            `SEO ${cityName} is not only about keywords. Google, users and AI systems need to understand your services, region and relevance clearly.`,
            `SaaleWeb combines technical SEO, Local SEO, content structure, FAQ, internal links and GEO/AIO foundations for businesses ${area}.`,
          ]
        : [
            `SEO ${cityName} — это не только ключевые слова. Google, пользователи и AI-системы должны ясно понимать ваши услуги, регион и релевантность.`,
            `SaaleWeb объединяет техническое SEO, Local SEO, структуру контента, FAQ, внутренние ссылки и GEO/AIO-основу для компаний ${area}.`,
          ],
    problemTitle: label.problemTitle,
    problems: isWebdesign
      ? en
        ? [
            "Services sound too generic and do not stand out from competitors.",
            "The local context is not visible enough in structure, copy and internal links.",
            "Mobile users do not find contact, services or trust signals fast enough.",
            "Design, content and SEO foundation are not planned as one system.",
            "Performance, metadata, headings and structured data are handled too late.",
            "Content is not clear enough for Google, ChatGPT, Gemini, Claude and Perplexity.",
          ]
        : [
            "Услуги описаны слишком общо и не отличаются от конкурентов.",
            "Локальный контекст недостаточно виден в структуре, текстах и внутренних ссылках.",
            "Пользователи с телефона не находят быстро контакт, услуги и сигналы доверия.",
            "Дизайн, контент и SEO-база не спланированы как единая система.",
            "Скорость, metadata, заголовки и структурированные данные учитываются слишком поздно.",
            "Контент недостаточно понятен для Google, ChatGPT, Gemini, Claude и Perplexity.",
          ]
      : en
        ? [
            "There is no clear page structure for services, audiences and regional search intent.",
            "Local search terms are not connected to real customer questions and inquiry paths.",
            "Indexability, speed, metadata and internal links limit visibility.",
            "FAQ, references, prices and location signals are not structured clearly enough.",
            "Google Business Profile, website content and landing pages do not work together.",
            "Priorities, measurement and realistic next steps are missing.",
          ]
        : [
            "Нет понятной структуры страниц под услуги, аудитории и региональные поисковые намерения.",
            "Локальные запросы не связаны с реальными вопросами клиентов и путём к заявке.",
            "Индексация, скорость, metadata и внутренние ссылки ограничивают видимость.",
            "FAQ, референсы, цены и сигналы региона структурированы недостаточно ясно.",
            "Google Business Profile, сайт и landing pages не работают как единая система.",
            "Не хватает приоритетов, измеримости и реалистичных следующих шагов.",
          ],
    solutionTitle: label.solutionTitle,
    solution: isWebdesign
      ? en
        ? [
            "We plan the website as a digital system: homepage, service pages, local signals, FAQ, case examples and contact paths work together.",
            `That creates a presence ${area} that feels professional, addresses regional intent and guides visitors toward an inquiry without friction.`,
          ]
        : [
            "Мы планируем сайт как цифровую систему: главная, страницы услуг, локальные сигналы, FAQ, кейсы и контактные пути работают вместе.",
            `Так компания ${area} выглядит профессионально, отвечает на региональные запросы и ведёт посетителей к заявке без лишних шагов.`,
          ]
      : en
        ? [
            "We first identify which search intents matter commercially and which technical or content barriers prevent visibility.",
            `Then we create a prioritized SEO plan for ${cityName}: technical foundation, Local SEO, landing pages, structured content, FAQ, internal linking and measurable progress.`,
          ]
        : [
            "Сначала определяем, какие запросы имеют бизнес-смысл и какие технические или контентные барьеры мешают видимости.",
            `После этого формируем приоритетный SEO-план для ${cityName}: техническая база, Local SEO, landing pages, структурированный контент, FAQ, внутренние ссылки и измеримое развитие.`,
          ],
    featuresTitle: label.featuresTitle,
    features: isWebdesign
      ? en
        ? [
            { title: "Clear positioning", text: "The website explains who you help, what you offer and why it matters." },
            { title: "Local structure", text: "Location, service area, services and internal links are connected logically." },
            { title: "Conversion guidance", text: "Contact, phone, form, WhatsApp or booking paths remain visible and credible." },
            { title: "SEO foundation", text: "Metadata, headings, performance, structured data and FAQ are planned from the start." },
            { title: "Mobile quality", text: "Smartphone users get short paths, readable content and fast loading times." },
            { title: "GEO/AIO readiness", text: "Content answers real questions and helps AI search systems classify the business." },
          ]
        : [
            { title: "Чёткое позиционирование", text: "Сайт объясняет, кому вы помогаете, что предлагаете и почему это важно." },
            { title: "Локальная структура", text: "Локация, зона работы, услуги и внутренние ссылки связаны логично." },
            { title: "Путь к заявке", text: "Контакт, телефон, форма, WhatsApp или запись остаются видимыми и понятными." },
            { title: "SEO-база", text: "Metadata, заголовки, скорость, structured data и FAQ планируются с начала." },
            { title: "Мобильное качество", text: "Пользователь с телефона получает короткий путь, читаемый контент и быструю загрузку." },
            { title: "Готовность к GEO/AIO", text: "Контент отвечает на реальные вопросы и помогает AI-поиску классифицировать бизнес." },
          ]
      : en
        ? [
            { title: "Technical SEO", text: "Indexing, loading speed, Core Web Vitals, metadata, internal links and structured data." },
            { title: "Local SEO", text: "Regional intent, location relevance, service area and trust-building content." },
            { title: "Content architecture", text: "Service pages, FAQ, prices, process and references are connected clearly." },
            { title: "AI Search / GEO", text: "Content is written so AI systems can understand entities and relationships." },
            { title: "Priority roadmap", text: "We start with the actions that realistically create the strongest leverage." },
            { title: "Measurability", text: "Important pages, inquiries and progress can be evaluated clearly." },
          ]
        : [
            { title: "Техническое SEO", text: "Индексация, скорость, Core Web Vitals, metadata, внутренние ссылки и structured data." },
            { title: "Local SEO", text: "Региональные намерения, связь с локацией, зона работы и контент доверия." },
            { title: "Архитектура контента", text: "Страницы услуг, FAQ, цены, процесс и референсы связаны понятно." },
            { title: "AI Search / GEO", text: "Контент написан так, чтобы AI-системы понимали сущности и связи." },
            { title: "Приоритетный план", text: "Начинаем с действий, которые реалистично дают самый сильный рычаг." },
            { title: "Измеримость", text: "Важные страницы, заявки и развитие можно понятно оценивать." },
          ],
    technologyTitle: label.technologyTitle,
    technologyText: label.technologyText,
    processTitle: en
      ? isWebdesign
        ? "From local goal to visible website"
        : "From analysis to measurable visibility"
      : isWebdesign
        ? "От локальной цели к видимому сайту"
        : "От анализа к измеримой видимости",
    process: label.process,
    casesTitle: label.casesTitle,
    cases,
    relatedTitle: label.relatedTitle,
    relatedLinks: [
      {
        label: isWebdesign ? `SEO ${cityName}` : serviceName.replace("SEO", en ? "Web design" : "Веб-дизайн"),
        href: serviceHref(locale, partnerSlug),
        description: isWebdesign
          ? en
            ? "Plan visibility, Local SEO and AI-search structure together with the website."
            : "Планировать видимость, Local SEO и AI-search структуру вместе с сайтом."
          : en
            ? "Connect website structure, design and conversion with SEO."
            : "Связать структуру сайта, дизайн и конверсию с SEO.",
      },
      {
        label: cityName,
        href: locationHref(locale, city.slug),
        description: en ? `Location page for regional visibility ${area}.` : `Страница локации для региональной видимости ${area}.`,
      },
      {
        label: isWebdesign ? (en ? "Get a website built" : "Создание сайта") : en ? "AI optimization" : "AI-оптимизация",
        href: serviceHref(locale, isWebdesign ? websiteSlug : aiSlug),
        description: isWebdesign
          ? en
            ? "Plan a new website with strategy, SEO and a clean technical foundation."
            : "Спланировать новый сайт со стратегией, SEO и чистой технической базой."
          : en
            ? "Structure content for ChatGPT, Gemini, Claude, Perplexity and Google AI Overview."
            : "Структурировать контент для ChatGPT, Gemini, Claude, Perplexity и Google AI Overview.",
      },
      {
        label: isWebdesign ? (en ? "Performance optimization" : "Оптимизация скорости") : en ? "Free website audit" : "Бесплатный аудит сайта",
        href: isWebdesign ? serviceHref(locale, performanceSlug) : localizedAuditHref(locale),
        description: isWebdesign
          ? en
            ? "Improve loading speed and technical quality."
            : "Улучшить скорость загрузки и техническое качество."
          : en
            ? "Check the current website for visibility, technology and inquiry paths."
            : "Проверить текущий сайт на видимость, технику и пути заявки.",
      },
      {
        label: en ? "Projects" : "Проекты",
        href: localizedProjectsHref(locale),
        description: en ? "View selected practical examples." : "Посмотреть выбранные практические примеры.",
      },
      {
        label: en ? "Contact" : "Контакты",
        href: localizedContactHref(locale),
        description: en ? "Discuss goals, scope and next steps without obligation." : "Обсудить цель, объём и следующие шаги без обязательств.",
      },
    ],
    faq: cityServiceFaq(locale, city, type),
    finalTitle: label.finalTitle,
    finalText: label.finalText,
  };
}

function cityServiceFaq(locale: Phase4Locale, city: CityServiceTarget, type: CityServiceType): Phase4Faq[] {
  const cityName = city.name;
  const isWebdesign = type === "webdesign";

  if (locale === "de") {
    return [
      {
        q: isWebdesign
          ? `Was kostet Webdesign ${cityName}?`
          : `Was kostet SEO ${cityName}?`,
        a: isWebdesign
          ? "Zur Orientierung: ein kompakter WordPress-Onepager startet ab 600 €, eine moderne Landingpage ab 990 € und eine vollständige Unternehmenswebsite ab 1.990 €. Lokale SEO-Seiten, Mehrsprachigkeit, Online-Buchung oder Integrationen sind zusätzlicher Umfang. Den genauen Festpreis klären wir nach Ziel und Inhalt."
          : "SEO wird nach Ausgangslage, Wettbewerb, technischer Basis und Content-Umfang kalkuliert. Für einfache Optimierungen ist der Aufwand deutlich geringer als für laufende Local-SEO-Strategien mit Landingpages, FAQ, Content und Monitoring. Nach einer kurzen Analyse nennen wir einen transparenten Festpreis.",
      },
      {
        q: isWebdesign
          ? `Ist SEO bei einer Website für ${cityName} enthalten?`
          : `Wie schnell wirkt SEO in ${cityName}?`,
        a: isWebdesign
          ? "Die technische und strukturelle SEO-Basis ist Teil der Website-Arbeit: Überschriften, Meta-Daten, Performance, interne Links, FAQ und strukturierte Daten. Laufende SEO-Optimierung oder zusätzliche Stadt-/Leistungsseiten planen wir separat."
          : "Technische Korrekturen können schnell Wirkung zeigen, nachhaltige organische Sichtbarkeit entsteht aber meistens über mehrere Monate. Entscheidend sind Wettbewerb, bestehende Website, Inhalte, lokale Signale und konsequente Weiterentwicklung.",
      },
      {
        q: `Hilft das auch für Kunden aus der Umgebung von ${cityName}?`,
        a: "Ja. Wir bauen keine dünnen Keyword-Seiten, sondern verbinden Leistungen, Einzugsgebiet, Referenzen und Kontaktwege sinnvoll. So bleibt die regionale Sichtbarkeit glaubwürdig und nutzerfreundlich.",
      },
      pricingFaq.de,
      {
        q: "Hilft das auch für KI-Suche wie ChatGPT, Gemini oder Perplexity?",
        a: `Ja. Wir strukturieren Leistungen, Region, Preise, FAQ und Unternehmensinformationen so, dass klassische Suchmaschinen und KI-Systeme Ihr Angebot ${city.deArea} besser einordnen können. Eine Garantie für KI-Antworten gibt es nicht, aber die Grundlage wird deutlich sauberer.`,
      },
      {
        q: "Kann eine bestehende Website zuerst geprüft werden?",
        a: "Ja. Die kostenlose Website-Analyse ist oft der sinnvollste Start. Danach sehen wir, ob Optimierung, Relaunch, neue Landingpages oder laufende Betreuung den besten nächsten Schritt darstellen.",
      },
      {
        q: "Wie starten wir konkret?",
        a: "Mit einem kurzen Erstgespräch. Wir klären Ziel, Zielgruppe, aktuelle Website, regionale Suchbegriffe und gewünschte Funktionen. Danach erhalten Sie eine klare Empfehlung mit realistischem Aufwand.",
      },
    ];
  }

  if (locale === "en") {
    return [
      {
        q: isWebdesign
          ? `What does web design ${cityName} cost?`
          : `What does SEO ${cityName} cost?`,
        a: isWebdesign
          ? "For orientation: a compact WordPress one-pager starts at €600, a modern landing page at €990 and a full company website at €1,990. Local SEO pages, multiple languages, online booking or integrations add scope. The exact fixed price depends on goals and content."
          : "SEO depends on the current website, competition, technical foundation and content scope. A focused optimization is smaller than an ongoing Local SEO strategy with landing pages, FAQ, content and monitoring. After a short analysis we give a transparent fixed price.",
      },
      {
        q: isWebdesign
          ? `Is SEO included in a website for ${cityName}?`
          : `How fast does SEO work in ${cityName}?`,
        a: isWebdesign
          ? "The technical and structural SEO foundation is part of the website work: headings, metadata, performance, internal links, FAQ and structured data. Ongoing SEO or additional city/service pages are planned separately."
          : "Technical fixes can show effects quickly, but sustainable organic visibility usually develops over several months. Competition, existing content, local signals and consistent improvement matter.",
      },
      {
        q: `Does this also help with customers around ${cityName}?`,
        a: "Yes. We do not build thin keyword pages. We connect services, service area, references and contact paths in a useful way so regional visibility stays credible and user-friendly.",
      },
      pricingFaq.en,
      {
        q: "Does this also help with AI search such as ChatGPT, Gemini or Perplexity?",
        a: `Yes. We structure services, region, prices, FAQ and company information so classic search engines and AI systems can classify your offer ${city.enArea} more clearly. AI answers cannot be guaranteed, but the foundation becomes much stronger.`,
      },
      {
        q: "Can an existing website be reviewed first?",
        a: "Yes. The free website audit is often the best start. We then see whether optimization, relaunch, new landing pages or ongoing support is the right next step.",
      },
      {
        q: "How do we start?",
        a: "With a short initial call. We clarify goals, audience, current website, regional search terms and needed functions. Afterwards you receive a clear recommendation with realistic effort.",
      },
    ];
  }

  return [
    {
      q: isWebdesign
        ? `Сколько стоит веб-дизайн ${cityName}?`
        : `Сколько стоит SEO ${cityName}?`,
      a: isWebdesign
        ? "Для ориентира: компактный WordPress one-pager — от 600 €, современный лендинг — от 990 €, полноценный корпоративный сайт — от 1 990 €. Local SEO страницы, несколько языков, онлайн-запись или интеграции добавляют объём. Точная фикс-цена зависит от целей и контента."
        : "SEO зависит от текущего сайта, конкуренции, технической базы и объёма контента. Точечная оптимизация меньше по объёму, чем постоянная Local SEO стратегия с landing pages, FAQ, контентом и мониторингом. После короткого анализа мы называем прозрачную фикс-цену.",
    },
    {
      q: isWebdesign
        ? `SEO входит в сайт для ${cityName}?`
        : `Как быстро начинает работать SEO в ${cityName}?`,
      a: isWebdesign
        ? "Техническая и структурная SEO-база входит в работу над сайтом: заголовки, metadata, скорость, внутренние ссылки, FAQ и structured data. Постоянное SEO или дополнительные страницы город+услуга планируются отдельно."
        : "Технические исправления могут дать эффект быстрее, но стабильная органическая видимость обычно развивается несколько месяцев. Важны конкуренция, существующий контент, локальные сигналы и последовательная доработка.",
    },
    {
      q: `Это поможет привлекать клиентов рядом с ${cityName}?`,
      a: "Да. Мы не делаем тонкие keyword-страницы. Мы связываем услуги, зону работы, референсы и контактные пути так, чтобы региональная видимость оставалась убедительной и полезной для пользователя.",
    },
    pricingFaq.ru,
    {
      q: "Это помогает и в AI-поиске вроде ChatGPT, Gemini или Perplexity?",
      a: `Да. Мы структурируем услуги, регион, цены, FAQ и информацию о компании так, чтобы поисковики и AI-системы лучше понимали предложение ${city.ruArea}. Гарантировать ответы AI нельзя, но основа становится намного сильнее.`,
    },
    {
      q: "Можно сначала проверить существующий сайт?",
      a: "Да. Бесплатный аудит сайта часто является лучшим стартом. После него понятно, что разумнее: оптимизация, релонч, новые landing pages или сопровождение.",
    },
    {
      q: "Как начать?",
      a: "С короткой консультации. Мы уточним цель, аудиторию, текущий сайт, региональные запросы и нужные функции. После этого вы получите понятную рекомендацию с реалистичным объёмом.",
    },
  ];
}

function buildPhase5ServicePage(canonicalSlug: string, locale: Phase4Locale): Phase4Landing | null {
  const data = PHASE5_SERVICE_CONTENT[locale]?.[canonicalSlug];
  const slug = SERVICE_SLUGS[canonicalSlug]?.[locale];
  if (!data || !slug) return null;
  const labels = phase5Labels[locale];

  return {
    slug,
    navLabel: data.navLabel,
    eyebrow: labels.eyebrow,
    title: data.title,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    lead: data.lead,
    problemTitle: labels.problemTitle,
    problems: data.problems,
    solutionTitle: labels.solutionTitle,
    solution: data.solution,
    featuresTitle: labels.featuresTitle,
    features: data.features,
    technologyTitle: labels.technologyTitle,
    technologyText: labels.technologyText,
    processTitle: labels.processTitle,
    process: labels.process,
    casesTitle: labels.casesTitle,
    cases: data.cases ?? SERVICE_CASES_BY_LOCALE[locale],
    relatedTitle: labels.relatedTitle,
    relatedLinks: data.related,
    faq: phase5Faq(locale, data.topic, data.extraFaq),
    finalTitle: labels.finalTitle,
    finalText: labels.finalText,
  };
}

const phase5GermanServicePages = Object.fromEntries(
  Object.keys(PHASE5_SERVICE_CONTENT.de).flatMap((canonical) => {
    const page = buildPhase5ServicePage(canonical, "de");
    return page ? [[canonical, page]] : [];
  }),
) as Record<string, Phase4Landing>;

export const seoServicePages: Record<string, Phase4Landing> = {
  ...coreSeoServicePages,
  ...phase5GermanServicePages,
};

function localizedServicePage(canonicalSlug: string, locale: Phase4Locale): Phase4Landing | null {
  const cityServicePage = localizedCityServicePage(canonicalSlug, locale);
  if (cityServicePage) {
    return locale === "de"
      ? prependUniqueFaq(cityServicePage, priorityServiceFaqDe[canonicalSlug])
      : cityServicePage;
  }

  if (locale === "de") {
    const page = seoServicePages[canonicalSlug];
    return page
      ? prependUniqueFaq(
          { ...page, navLabel: page.navLabel ?? page.title.split(" – ")[0] },
          priorityServiceFaqDe[canonicalSlug],
        )
      : null;
  }

  const phase5Page = buildPhase5ServicePage(canonicalSlug, locale);
  if (phase5Page) return phase5Page;

  const seed = (locale === "en" ? EN_SERVICE_SEEDS : RU_SERVICE_SEEDS)[canonicalSlug];
  const slug = SERVICE_SLUGS[canonicalSlug]?.[locale];
  if (!seed || !slug) return null;

  const en = locale === "en";
  return {
    slug,
    navLabel: seed.navLabel,
    eyebrow: en ? "Service" : "Услуга",
    title: seed.title,
    metaTitle: seed.metaTitle,
    metaDescription: seed.metaDescription,
    lead: seed.lead,
    problemTitle: en ? "Why many websites underperform" : "Почему сайты часто работают слабее, чем должны",
    problems: seed.problems,
    solutionTitle: en ? "How SaaleWeb helps" : "Как помогает SaaleWeb",
    solution: seed.solution,
    featuresTitle: en ? "What this page is built to achieve" : "Что должна решать эта страница",
    features: seed.features,
    technologyTitle: en ? "The right technology for your goal" : "Правильная технология под вашу цель",
    technologyText: en
      ? "We do not recommend one platform by default. For new premium projects we often use modern technologies such as Next.js and React. Existing WordPress websites can be modernized, extended and supported long term. The deciding factor is always which solution creates the greatest value for your business."
      : "Мы не рекомендуем одну платформу по умолчанию. Для новых премиальных проектов часто используем современные технологии вроде Next.js и React. Существующие WordPress-сайты можно модернизировать, расширять и сопровождать. Решает всегда то, какое решение приносит бизнесу наибольшую пользу.",
    processTitle: en ? "A clear process from analysis to optimization" : "Понятный процесс от анализа до оптимизации",
    process: en
      ? [
          { title: "Analysis", text: "We review goals, audience, competitors, content and technical foundation." },
          { title: "Strategy", text: "A clear plan defines structure, content, SEO and user guidance." },
          { title: "Implementation", text: "Design, development, content and technical optimization are connected cleanly." },
          { title: "Launch", text: "Before launch we check performance, mobile UX, forms, tracking and indexability." },
          { title: "Optimization", text: "After launch we improve content, search terms and conversion points based on real signals." },
        ]
      : [
          { title: "Анализ", text: "Проверяем цели, аудиторию, конкурентов, контент и техническую основу." },
          { title: "Стратегия", text: "Формируем понятный план структуры, контента, SEO и пользовательского пути." },
          { title: "Реализация", text: "Соединяем дизайн, разработку, контент и техническую оптимизацию." },
          { title: "Запуск", text: "Перед запуском проверяем скорость, мобильность, формы, аналитику и индексацию." },
          { title: "Оптимизация", text: "После запуска улучшаем контент, запросы и точки конверсии по реальным сигналам." },
        ],
    casesTitle: en ? "Relevant project examples" : "Подходящие примеры проектов",
    cases: seed.cases ?? SERVICE_CASES_BY_LOCALE[locale],
    relatedTitle: en ? "Useful next pages" : "Полезные следующие страницы",
    relatedLinks: seed.related,
    faq: [
      ...(seed.extraFaq ?? []),
      ...(en
        ? [
            {
              q: "Is the first consultation free?",
              a: "Yes. The first conversation is free and non-binding. We clarify the goal, current situation and realistic next steps.",
            },
            {
              q: "Does SaaleWeb only work with Next.js?",
              a: "No. Technology follows the goal. We build modern Next.js and React solutions, but also modernize and support WordPress websites when that is the better fit.",
            },
            {
              q: "Is SEO included?",
              a: "The technical and structural SEO foundation is part of modern website work. Broader SEO and Local SEO can be planned as a separate focus.",
            },
            {
              q: "Can you guarantee Google rankings?",
              a: "No. Serious SEO does not guarantee a fixed ranking. We improve the technical and content foundation for better visibility.",
            },
            {
              q: "Can an existing website be improved first?",
              a: "Yes. We review whether optimization, modernization or a relaunch is the most sensible next step.",
            },
            {
              q: "How does the project start?",
              a: "We start with a short consultation and, if useful, a website analysis covering performance, SEO, user guidance and technical basics.",
            },
          ]
        : [
            {
              q: "Первая консультация бесплатная?",
              a: "Да. Первый разговор бесплатный и ни к чему не обязывает. Мы уточняем цель, текущую ситуацию и реалистичные следующие шаги.",
            },
            {
              q: "SaaleWeb работает только с Next.js?",
              a: "Нет. Технология следует цели. Мы создаём современные решения на Next.js и React, но также модернизируем и сопровождаем WordPress, если это лучше для клиента.",
            },
            {
              q: "SEO входит в работу?",
              a: "Техническая и структурная SEO-база входит в современную работу над сайтом. Более широкое SEO и Local SEO можно планировать отдельно.",
            },
            {
              q: "Можно гарантировать позиции в Google?",
              a: "Нет. Серьёзное SEO не обещает фиксированное место. Мы улучшаем техническую и контентную основу для лучшей видимости.",
            },
            {
              q: "Можно сначала улучшить существующий сайт?",
              a: "Да. Мы проверяем, что разумнее: оптимизация, модернизация или полноценный релонч.",
            },
            {
              q: "Как начинается проект?",
              a: "С короткой консультации и, если полезно, анализа сайта: скорость, SEO, пользовательский путь и техническая база.",
            },
          ]),
      pricingFaq[locale],
      aiSearchFaq[locale],
    ],
    finalTitle: en
      ? "Let’s check what makes sense for your business."
      : "Давайте проверим, что имеет смысл для вашего бизнеса.",
    finalText: en
      ? "In a free first consultation we clarify which solution fits your situation and which next steps are realistic."
      : "На бесплатной консультации мы уточним, какое решение подходит вашей ситуации и какие следующие шаги реалистичны.",
  };
}

function serviceCanonicalFromSlug(locale: Phase4Locale, slug: string): string | null {
  const alias = SERVICE_SLUG_ALIASES[locale]?.[slug];
  if (alias) return alias;
  return (
    Object.entries(SERVICE_SLUGS).find(([, slugs]) => slugs[locale] === slug)?.[0] ?? null
  );
}

export const seoServiceSlugs = Object.keys(SERVICE_SLUGS);

export function getSeoServiceStaticParams() {
  const canonicalParams = Object.values(SERVICE_SLUGS).flatMap((slugs) =>
    (Object.entries(slugs) as [Phase4Locale, string][]).map(([locale, slug]) => ({ locale, slug })),
  );
  const aliasParams = (Object.entries(SERVICE_SLUG_ALIASES) as [Phase4Locale, Record<string, string>][]).flatMap(
    ([locale, aliases]) => Object.keys(aliases).map((slug) => ({ locale, slug })),
  );
  return [...canonicalParams, ...aliasParams];
}

export function getSeoServiceSlugMap(canonicalSlug: string): Phase4SlugMap | null {
  return SERVICE_SLUGS[canonicalSlug] ?? null;
}

export function getSeoServiceSlugGroups(): Phase4SlugMap[] {
  return Object.values(SERVICE_SLUGS);
}

export function getSeoServiceSlugMapByLocalizedSlug(locale: string, slug: string): Phase4SlugMap | null {
  if (!isPhase4Locale(locale)) return null;
  const canonical = serviceCanonicalFromSlug(locale, slug);
  return canonical ? SERVICE_SLUGS[canonical] : null;
}

export function getSeoServicePage(slug: string, locale: string = "de") {
  if (!isPhase4Locale(locale)) return null;
  const canonical = serviceCanonicalFromSlug(locale, slug) ?? slug;
  return localizedServicePage(canonical, locale);
}

function industryFaq(industry: string, extra: Phase4Faq[] = []): Phase4Faq[] {
  return [
    ...extra,
    {
      q: `Warum braucht ${industry} eine spezialisierte Website?`,
      a: "Weil Besucher je nach Branche sehr unterschiedliche Fragen haben. Eine gute Website erklärt Leistungen, Vertrauen, Ablauf und Kontaktwege so, wie Kunden es in dieser Branche erwarten.",
    },
    {
      q: "Kann SaaleWeb auch bestehende Inhalte übernehmen?",
      a: "Ja. Bestehende Texte, Bilder und Referenzen können geprüft, neu strukturiert und bei Bedarf erweitert werden.",
    },
    {
      q: "Sind SEO und Local SEO enthalten?",
      a: "Die technische und strukturelle SEO-Basis wird mitgedacht. Je nach Ziel kann daraus ein eigenes SEO- oder Local-SEO-Paket entstehen.",
    },
    {
      q: "Kann die Website später erweitert werden?",
      a: "Ja. Zusätzliche Landingpages, FAQ, Blogbeiträge, Buchungssysteme oder Projektbereiche können später ergänzt werden.",
    },
    {
      q: "Gibt es feste Umsatzversprechen?",
      a: "Nein. SaaleWeb macht keine unrealistischen Umsatz- oder Ranking-Versprechen. Ziel ist eine bessere digitale Grundlage für Vertrauen, Sichtbarkeit und Anfragen.",
    },
    pricingFaq.de,
    aiSearchFaq.de,
    {
      q: "Wie läuft der Start ab?",
      a: "Wir beginnen mit einem kostenlosen Gespräch, prüfen Ziele und aktuelle Website und schlagen dann eine realistische Vorgehensweise vor.",
    },
  ].slice(0, Math.max(10, extra.length + 8));
}

export const seoIndustryPages: Record<string, Phase4Landing> = {
  "restaurant-website": {
    slug: "restaurant-website",
    eyebrow: "Branchenlösung",
    title: "Website für Restaurants – mehr Reservierungen, mehr Sichtbarkeit, mehr Vertrauen",
    metaTitle: "Website für Restaurants | SaaleWeb",
    metaDescription:
      "Restaurant Website von SaaleWeb: Speisekarte, Reservierungen, Local SEO, mobile Nutzerführung und klare Inhalte für mehr direkte Anfragen.",
    lead: [
      "Gäste entscheiden häufig mobil und schnell: Speisekarte, Öffnungszeiten, Reservierung und Atmosphäre müssen sofort verständlich sein.",
      "SaaleWeb entwickelt Restaurant-Websites, die Genuss, Vertrauen und direkte Reservierungen klar zusammenführen.",
    ],
    problemTitle: "Typische Probleme bei Restaurant-Websites",
    problems: [
      "Die Speisekarte ist veraltet, als PDF versteckt oder mobil schlecht lesbar.",
      "Öffnungszeiten, Reservierung und Kontakt sind nicht schnell erreichbar.",
      "Bilder vermitteln nicht die Qualität des Restaurants.",
      "Lokale Sichtbarkeit in Google und Maps ist zu schwach.",
      "Events, Nachrichten oder saisonale Angebote fehlen.",
      "Reservierungen laufen zu stark über fremde Plattformen.",
    ],
    solutionTitle: "Wie SaaleWeb Restaurants unterstützt",
    solution: [
      "Wir bauen Websites, die Gäste schnell zur richtigen Entscheidung führen: Speisekarte, Reservierung, Atmosphäre, Bewertungen, Standort und Kontakt.",
      "Die Seite wird mobile-first, lokal sichtbar und so strukturiert, dass Gäste und Suchsysteme die wichtigsten Informationen sofort finden.",
    ],
    featuresTitle: "Wichtige Funktionen",
    features: [
      { title: "Digitale Speisekarte", text: "Aktuell, mobil lesbar und ohne umständliche PDF-Suche." },
      { title: "Reservierungsfokus", text: "Klare CTA-Wege für Tischreservierungen und Anfragen." },
      { title: "Local SEO", text: "Standort, Küche, Region und relevante Suchbegriffe werden sauber verbunden." },
      { title: "Events & News", text: "Saisonale Angebote oder Veranstaltungen können sichtbar gemacht werden." },
      { title: "Starke Bildsprache", text: "Gerichte und Atmosphäre werden hochwertig präsentiert." },
      { title: "Mehrsprachigkeit", text: "Deutsch, Englisch, Russisch und weitere Sprachen sind je nach Zielgruppe möglich." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "Vom Restaurantprofil zur Reservierungsseite",
    process: industryProcess,
    casesTitle: "Passende Restaurant-Projekte",
    cases: serviceCases.restaurant,
    relatedTitle: "Sinnvolle interne Links",
    relatedLinks: [
      { label: "Neue Liebe Nebra", href: "/projekte/neue-liebe-nebra", description: "Restaurant-Projekt mit Reservierungsfokus." },
      { label: "Buchungssysteme", href: "/leistungen/buchungssysteme", description: "Reservierungen und Anfragen besser digital abbilden." },
      { label: "Local SEO", href: "/leistungen/local-seo", description: "Regional gefunden werden." },
      { label: "Kontakt", href: "/kontakt", description: "Restaurant-Website besprechen." },
    ],
    faq: industryFaq("ein Restaurant", [
      {
        q: "Kann die Speisekarte selbst gepflegt werden?",
        a: "Ja. Je nach Lösung kann die Speisekarte später einfach aktualisiert werden, ohne jedes Mal eine technische Änderung zu beauftragen.",
      },
      {
        q: "Kann eine Reservierung integriert werden?",
        a: "Ja. Wir integrieren bestehende Reservierungstools oder planen einen passenden Buchungsweg direkt in der Website.",
      },
    ]),
    ...defaultFinal,
  },
  "hotel-website": {
    slug: "hotel-website",
    eyebrow: "Branchenlösung",
    title: "Hotel Website – mehr Direktbuchungen und weniger Abhängigkeit von Portalen",
    metaTitle: "Hotel Website erstellen lassen | SaaleWeb",
    metaDescription:
      "Hotel Website mit Direktbuchungsfokus, Local SEO, Zimmerpräsentation, Performance und Vertrauen für Gäste aus der Region und darüber hinaus.",
    lead: [
      "Hotels brauchen Websites, die Vertrauen aufbauen und Gäste zur direkten Anfrage oder Buchung führen.",
      "SaaleWeb entwickelt Hotel-Websites, die Zimmer, Lage, Leistungen und Buchungswege klar präsentieren.",
    ],
    problemTitle: "Was viele Hotel-Websites ausbremst",
    problems: [
      "Gäste buchen über Portale, obwohl eine Direktbuchung möglich wäre.",
      "Zimmer, Angebote und Lage werden nicht überzeugend präsentiert.",
      "Die mobile Ansicht ist langsam oder unübersichtlich.",
      "Bewertungen, Vertrauen und regionale Vorteile sind zu schwach sichtbar.",
      "Buchungswege sind kompliziert oder technisch nicht sauber eingebunden.",
      "SEO für lokale und touristische Suchanfragen ist unvollständig.",
    ],
    solutionTitle: "Direktbuchungen besser vorbereiten",
    solution: [
      "Wir strukturieren die Hotel-Website so, dass Gäste schnell verstehen, warum sie direkt bei Ihnen buchen sollten.",
      "Dazu gehören starke Zimmerseiten, klare Buchungswege, lokale Sichtbarkeit, schnelle Ladezeiten und Inhalte, die Suchmaschinen und KI-Systeme gut einordnen können.",
    ],
    featuresTitle: "Wichtige Funktionen",
    features: [
      { title: "Direktbuchung", text: "Buchungssysteme oder Anfragewege werden prominent und vertrauenswürdig integriert." },
      { title: "Zimmer & Angebote", text: "Leistungen, Bilder und Vorteile werden übersichtlich dargestellt." },
      { title: "Regionale Sichtbarkeit", text: "Hotel-Suchanfragen in Stadt und Umgebung werden in der Struktur berücksichtigt." },
      { title: "Mehrsprachigkeit", text: "Weitere Sprachen können passend zur Zielgruppe ergänzt werden." },
      { title: "Performance", text: "Schnelle Ladezeiten helfen mobilen Gästen und Suchmaschinen." },
      { title: "Vertrauenssignale", text: "Bewertungen, Lage, Ausstattung und Kontakt werden klar sichtbar." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "Vom Gastinteresse zur Direktbuchung",
    process: industryProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: [
      {
        label: "Direktbuchungen ohne Portale",
        href: "/projekte/direktbuchungen-ohne-portale",
        description: "Projektbeispiel für direkte Anfragen und weniger Plattformabhängigkeit.",
      },
    ],
    relatedTitle: "Sinnvolle interne Links",
    relatedLinks: [
      { label: "Buchungssysteme", href: "/leistungen/buchungssysteme", description: "Digitale Buchungswege sauber integrieren." },
      { label: "Local SEO", href: "/leistungen/local-seo", description: "Regional und touristisch besser auffindbar werden." },
      { label: "Website Relaunch", href: "/leistungen/website-relaunch", description: "Bestehende Hotel-Website modernisieren." },
      { label: "Kontakt", href: "/kontakt", description: "Hotel-Website unverbindlich besprechen." },
    ],
    faq: industryFaq("ein Hotel", [
      {
        q: "Kann ein vorhandenes Hotel-Buchungssystem angebunden werden?",
        a: "In vielen Fällen ja. Wir prüfen die technische Einbindung und achten darauf, dass der Buchungsweg vertrauenswürdig und mobil gut nutzbar bleibt.",
      },
      {
        q: "Hilft eine Hotel-Website gegen Portalabhängigkeit?",
        a: "Sie ersetzt Portale nicht automatisch, kann aber Direktbuchungen besser vorbereiten und Gästen einen klaren Grund geben, direkt anzufragen.",
      },
    ]),
    ...defaultFinal,
  },
  "beauty-studio-website": {
    slug: "beauty-studio-website",
    eyebrow: "Branchenlösung",
    title: "Website für Beauty Studios – Termine, Vertrauen und lokale Sichtbarkeit",
    metaTitle: "Website für Beauty Studio | SaaleWeb",
    metaDescription:
      "Beauty Studio Website mit Online-Terminbuchung, Leistungsübersicht, Local SEO, Bildern, Vertrauen und mobiler Nutzerführung.",
    lead: [
      "Beauty-Kundinnen vergleichen Leistungen, Bilder, Preise und Verfügbarkeit oft direkt am Smartphone.",
      "SaaleWeb entwickelt Websites für Beauty Studios, die Vertrauen schaffen und Terminbuchungen einfacher machen.",
    ],
    problemTitle: "Was Beauty-Websites häufig fehlt",
    problems: [
      "Leistungen und Preise sind unklar oder schwer vergleichbar.",
      "Termine können nicht einfach online angefragt werden.",
      "Bilder zeigen nicht genug Qualität und Atmosphäre.",
      "Lokale Suchanfragen werden nicht gezielt bedient.",
      "Die Website wirkt nicht hochwertig genug für Premium-Leistungen.",
      "Mobile Nutzer verlieren sich zwischen Instagram, Maps und Website.",
    ],
    solutionTitle: "Eine Website, die aus Interesse Termine macht",
    solution: [
      "Wir strukturieren Leistungen, Ergebnisse, Vertrauen und Buchungswege so, dass Besucherinnen schneller entscheiden können.",
      "Die Website kann mit Online-Terminbuchung, mehrsprachigen Inhalten, Local SEO und klaren Angebotsseiten erweitert werden.",
    ],
    featuresTitle: "Wichtige Funktionen",
    features: [
      { title: "Leistungsübersicht", text: "Angebote, Preise und Dauer werden verständlich erklärt." },
      { title: "Online-Termine", text: "Terminbuchung oder Anfrage wird prominent und mobil nutzbar eingebunden." },
      { title: "Bildwirkung", text: "Ergebnisse, Studio und Atmosphäre werden hochwertig präsentiert." },
      { title: "Local SEO", text: "Standort, Einzugsgebiet und lokale Suchbegriffe werden sauber integriert." },
      { title: "Vertrauensaufbau", text: "Ablauf, Hygiene, Beratung und Erfahrung werden klar kommuniziert." },
      { title: "Pflege & Aktionen", text: "Neue Leistungen oder Aktionen können später ergänzt werden." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "Vom Studio-Angebot zur Terminseite",
    process: industryProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: serviceCases.booking,
    relatedTitle: "Sinnvolle interne Links",
    relatedLinks: [
      { label: "Buchungssysteme", href: "/leistungen/buchungssysteme", description: "Termine online einfacher machen." },
      { label: "Local SEO", href: "/leistungen/local-seo", description: "Im Einzugsgebiet besser gefunden werden." },
      { label: "Website erstellen lassen", href: "/leistungen/website-erstellen-lassen", description: "Neue Website für Studio oder Salon planen." },
      { label: "Kontakt", href: "/kontakt", description: "Beauty-Website besprechen." },
    ],
    faq: industryFaq("ein Beauty Studio", [
      {
        q: "Kann eine Online-Terminbuchung integriert werden?",
        a: "Ja. Wir können vorhandene Tools integrieren oder einen passenden Anfrageweg direkt in die Website einbauen.",
      },
      {
        q: "Sind Vorher-Nachher-Bilder sinnvoll?",
        a: "Wenn sie rechtlich und fachlich sauber eingesetzt werden, können Bilder Vertrauen aufbauen. Wir achten auf eine seriöse Darstellung.",
      },
    ]),
    ...defaultFinal,
  },
  "bauunternehmen-website": {
    slug: "bauunternehmen-website",
    eyebrow: "Branchenlösung",
    title: "Website für Bauunternehmen – Vertrauen, Referenzen und qualifizierte Anfragen",
    metaTitle: "Website für Bauunternehmen | SaaleWeb",
    metaDescription:
      "Website für Bauunternehmen mit Leistungsseiten, Referenzen, Local SEO, Anfrageführung und professioneller Darstellung für qualifizierte Bauanfragen.",
    lead: [
      "Bei Bauleistungen geht es um hohe Investitionen und Vertrauen. Eine Website muss Kompetenz, Referenzen und klare Anfragewege sichtbar machen.",
      "SaaleWeb entwickelt Websites für Bauunternehmen, die Leistungen verständlich erklären und passende Anfragen vorbereiten.",
    ],
    problemTitle: "Typische Schwächen bei Bau-Websites",
    problems: [
      "Referenzen sind nicht strukturiert oder kaum sichtbar.",
      "Leistungen werden zu allgemein beschrieben.",
      "Regionale Suchbegriffe und Einzugsgebiete fehlen.",
      "Anfragen sind unqualifiziert, weil wichtige Informationen nicht abgefragt werden.",
      "Die Website wirkt veraltet und baut wenig Vertrauen auf.",
      "Mobile Nutzer finden keinen klaren nächsten Schritt.",
    ],
    solutionTitle: "Digitale Vertrauensbasis für Baukunden",
    solution: [
      "Wir bauen eine Struktur aus Leistungsseiten, Referenzen, Einzugsgebiet, Anfrageführung und klaren Entscheidungshilfen.",
      "So können Interessenten besser einschätzen, ob Ihr Unternehmen zum Projekt passt, bevor sie Kontakt aufnehmen.",
    ],
    featuresTitle: "Wichtige Funktionen",
    features: [
      { title: "Referenzbereich", text: "Projekte werden mit Bildern, Kontext und Leistungen verständlich gezeigt." },
      { title: "Leistungsseiten", text: "Jede wichtige Leistung erhält eine klare, suchfähige Struktur." },
      { title: "Qualifizierte Anfrage", text: "Formulare fragen relevante Projektdaten ab, ohne Nutzer zu überfordern." },
      { title: "Local SEO", text: "Einzugsgebiet, Region und Suchbegriffe werden sauber eingebunden." },
      { title: "Vertrauen", text: "Ablauf, Erfahrung, Qualitätsanspruch und Kontaktwege werden sichtbar." },
      { title: "Performance", text: "Bilder und Medien werden so optimiert, dass die Website schnell bleibt." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "Vom Leistungsprofil zur Anfrage-Website",
    process: industryProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: [
      {
        label: "Qualifizierte Bauanfragen",
        href: "/projekte/qualifizierte-bauanfragen",
        description: "Projektbeispiel für regionale Bau- und Handwerksanfragen.",
      },
    ],
    relatedTitle: "Sinnvolle interne Links",
    relatedLinks: [
      { label: "Website erstellen lassen", href: "/leistungen/website-erstellen-lassen", description: "Neue Website für erklärungsbedürftige Leistungen." },
      { label: "SEO Halle", href: "/leistungen/seo-halle", description: "Regionale Sichtbarkeit für Bauleistungen." },
      { label: "Handwerker Website", href: "/branchen/handwerker-website", description: "Verwandte Anforderungen im Handwerk." },
      { label: "Kontakt", href: "/kontakt", description: "Bau-Website besprechen." },
    ],
    faq: industryFaq("ein Bauunternehmen", [
      {
        q: "Wie kann eine Website qualifizierte Bauanfragen fördern?",
        a: "Durch klare Leistungsseiten, Referenzen, Einzugsgebiet, realistische Anfrageformulare und Inhalte, die Erwartungen früh klären.",
      },
      {
        q: "Sollten Referenzen auf der Website gezeigt werden?",
        a: "Ja, wenn sie sauber aufbereitet sind. Referenzen helfen Interessenten, Qualität, Erfahrung und passende Projektarten besser einzuschätzen.",
      },
    ]),
    ...defaultFinal,
  },
  "handwerker-website": {
    slug: "handwerker-website",
    eyebrow: "Branchenlösung",
    title: "Website für Handwerker – lokal sichtbar und vertrauenswürdig auftreten",
    metaTitle: "Website für Handwerker | SaaleWeb",
    metaDescription:
      "Handwerker Website mit Local SEO, Leistungsstruktur, Referenzen, klarer Anfrageführung und moderner mobiler Darstellung.",
    lead: [
      "Viele Handwerksbetriebe leben von Empfehlungen. Trotzdem prüfen neue Kunden heute fast immer zuerst online, ob ein Betrieb zuverlässig wirkt.",
      "SaaleWeb entwickelt Handwerker-Websites, die regionale Sichtbarkeit, Vertrauen und klare Anfragen zusammenbringen.",
    ],
    problemTitle: "Was Handwerks-Websites oft ausbremst",
    problems: [
      "Die Website wirkt älter als die tatsächliche Qualität des Betriebs.",
      "Leistungen und Einzugsgebiet sind nicht klar sichtbar.",
      "Referenzen, Bilder und Spezialisierungen fehlen.",
      "Google findet die richtigen Leistungsseiten nicht.",
      "Anfragen kommen unstrukturiert und ohne Kontext.",
      "Mobile Nutzer finden Telefonnummer oder Kontaktformular nicht schnell.",
    ],
    solutionTitle: "Eine digitale Basis für regionale Anfragen",
    solution: [
      "Wir machen sichtbar, welche Leistungen Sie anbieten, in welcher Region Sie arbeiten und warum Kunden Ihrem Betrieb vertrauen können.",
      "Die Website wird schnell, mobil, lokal ausgerichtet und so aufgebaut, dass Anfragen besser vorbereitet sind.",
    ],
    featuresTitle: "Wichtige Funktionen",
    features: [
      { title: "Leistungsstruktur", text: "Jede Kernleistung wird klar erklärt und intern sinnvoll verlinkt." },
      { title: "Einzugsgebiet", text: "Region, Orte und lokale Relevanz werden sichtbar gemacht." },
      { title: "Referenzen", text: "Bilder, Projekte und Spezialisierungen schaffen Vertrauen." },
      { title: "Anfrageführung", text: "Kontaktwege fragen relevante Informationen ab und bleiben einfach." },
      { title: "Local SEO", text: "Suchbegriffe, Standort und Google-Signale werden sauber verbunden." },
      { title: "Pflege", text: "Neue Projekte und Leistungen können später ergänzt werden." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "Vom Betrieb zur sichtbaren Website",
    process: industryProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: [
      {
        label: "Glaserei Schubert",
        href: "/projekte/glaserei-schubert",
        description: "Reales Projektbeispiel für Fachleistungen, Referenzen, Local SEO und digitale Vertrauensbildung.",
      },
      {
        label: "SorgfaltBau",
        href: "/projekte/qualifizierte-bauanfragen",
        description: "Reales Projektbeispiel für klare Bauleistungen und qualifizierte regionale Anfragen.",
      },
    ],
    relatedTitle: "Sinnvolle interne Links",
    relatedLinks: [
      { label: "Glaserei Website", href: "/branchen/glaserei-website", description: "Spezialisierte Anforderungen für Glasereien." },
      { label: "Local SEO", href: "/leistungen/local-seo", description: "Im Einzugsgebiet besser gefunden werden." },
      { label: "Website Wartung", href: "/leistungen/website-wartung", description: "Website langfristig aktuell halten." },
      { label: "Kontakt", href: "/kontakt", description: "Handwerker-Website besprechen." },
    ],
    faq: industryFaq("einen Handwerksbetrieb", [
      {
        q: "Braucht ein Handwerksbetrieb wirklich eine moderne Website?",
        a: "Ja, wenn neue Kunden online prüfen, ob der Betrieb vertrauenswürdig, erreichbar und passend für ihr Anliegen ist.",
      },
      {
        q: "Kann die Website auch kleine Betriebe unterstützen?",
        a: "Ja. Gerade kleine Betriebe profitieren von klaren Leistungen, lokalem Bezug und einer professionellen Darstellung ohne unnötige Komplexität.",
      },
    ]),
    ...defaultFinal,
  },
  "glaserei-website": {
    slug: "glaserei-website",
    eyebrow: "Branchenlösung",
    title: "Website für Glasereien – Qualität, Referenzen und Spezialleistungen klar zeigen",
    metaTitle: "Website für Glaserei | SaaleWeb",
    metaDescription:
      "Website für Glasereien mit Referenzen, Leistungsseiten, Local SEO, Vertrauen, mobiler Darstellung und klarer Anfrageführung.",
    lead: [
      "Glasereien müssen online mehr zeigen als eine Telefonnummer. Kunden möchten Qualität, Spezialisierung, regionale Nähe und Beispiele sehen.",
      "SaaleWeb entwickelt Glaserei-Websites, die Leistungen verständlich strukturieren und Vertrauen vor der ersten Anfrage aufbauen.",
    ],
    problemTitle: "Was Glaserei-Websites häufig fehlt",
    problems: [
      "Spezialleistungen wie Glasduschen, Spiegel, Reparaturen oder Sonderanfertigungen sind nicht klar getrennt.",
      "Referenzen und Bilder zeigen die Qualität nicht ausreichend.",
      "Regionale Suchanfragen werden nicht gezielt bedient.",
      "Kontaktwege fragen zu wenig Kontext ab.",
      "Die mobile Darstellung wirkt unmodern oder langsam.",
      "Google und KI-Systeme erkennen Leistungen und Einzugsgebiet nicht eindeutig.",
    ],
    solutionTitle: "Eine klare Struktur für lokale Fachkompetenz",
    solution: [
      "Wir strukturieren die Website nach Leistungen, Einsatzbereichen, Referenzen und Region. So verstehen Nutzer schneller, ob Ihre Glaserei zum Anliegen passt.",
      "Gleichzeitig stärken wir technische SEO, Local SEO und Inhalte, damit relevante Suchanfragen besser bedient werden können.",
    ],
    featuresTitle: "Wichtige Funktionen",
    features: [
      { title: "Leistungsseiten", text: "Reparaturen, Innenausbau, Glasduschen, Spiegel oder Spezialglas können getrennt erklärt werden." },
      { title: "Referenzen", text: "Bilder und Projektkontext zeigen Qualität und Einsatzbereiche." },
      { title: "Local SEO", text: "Region, Einzugsgebiet und Suchbegriffe werden sinnvoll integriert." },
      { title: "Anfrageformular", text: "Kunden können Maße, Bilder oder Anliegen strukturiert übermitteln." },
      { title: "Vertrauen", text: "Ablauf, Erfahrung und Beratung werden klar kommuniziert." },
      { title: "Mobile Geschwindigkeit", text: "Die Seite bleibt schnell, auch wenn viele Bilder genutzt werden." },
    ],
    technologyTitle: "Die passende Technologie für Ihr Ziel",
    technologyText,
    processTitle: "Von Fachleistung zu klarer Anfrage",
    process: industryProcess,
    casesTitle: "Passendes Projektbeispiel",
    cases: [
      {
        label: "Glaserei Schubert",
        href: "/projekte/glaserei-schubert",
        description: "Projektbeispiel für lokale Fachkompetenz, klare Leistungsstruktur und digitale Vertrauensbildung.",
      },
    ],
    relatedTitle: "Sinnvolle interne Links",
    relatedLinks: [
      { label: "Handwerker Website", href: "/branchen/handwerker-website", description: "Grundlagen für regionale Handwerksbetriebe." },
      { label: "SEO Halle", href: "/leistungen/seo-halle", description: "Sichtbarkeit für lokale Fachleistungen." },
      { label: "Website erstellen lassen", href: "/leistungen/website-erstellen-lassen", description: "Neue Website mit klarer Struktur planen." },
      { label: "Kontakt", href: "/kontakt", description: "Glaserei-Website besprechen." },
    ],
    faq: industryFaq("eine Glaserei", [
      {
        q: "Welche Inhalte sind für eine Glaserei wichtig?",
        a: "Leistungen, Einsatzbereiche, Referenzen, Einzugsgebiet, Ablauf und Kontaktmöglichkeiten sollten klar sichtbar sein.",
      },
      {
        q: "Kann eine Website spezielle Glaserei-Leistungen besser sichtbar machen?",
        a: "Ja. Separate Leistungsseiten helfen Nutzern, Google und KI-Systemen, einzelne Angebote wie Glasduschen, Reparaturen oder Sonderanfertigungen genauer zu verstehen.",
      },
    ]),
    ...defaultFinal,
  },
  "dienstleister-website": {
    slug: "dienstleister-website",
    eyebrow: "Branchenlösung",
    title: "Website für Dienstleister – besser gefunden werden und mehr qualifizierte Anfragen erhalten",
    metaTitle: "Website für Dienstleister | Sichtbarkeit, Vertrauen & neue Anfragen",
    metaDescription:
      "SaaleWeb entwickelt Websites für lokale Dienstleister mit klarer Positionierung, SEO-Struktur, Anfragefokus und professioneller mobiler Nutzerführung.",
    lead: [
      "Lokale Dienstleister müssen online schnell Vertrauen schaffen. Kunden möchten verstehen, welche Leistungen angeboten werden, warum sie diesem Anbieter vertrauen können und wie sie unkompliziert Kontakt aufnehmen.",
      "Eine professionelle Website macht genau diesen Entscheidungsprozess einfacher: Sie erklärt Leistungen klar, beantwortet typische Fragen und führt Besucher zu einer passenden Anfrage.",
    ],
    problemTitle: "Warum viele Websites lokaler Dienstleister nicht genug leisten",
    problems: [
      "Die Positionierung ist unklar und klingt austauschbar.",
      "Leistungen werden zu allgemein oder zu technisch beschrieben.",
      "Es fehlen lokale SEO-Signale für Stadt, Region und Einzugsgebiet.",
      "Kontaktwege sind nicht klar genug oder wirken unverbindlich.",
      "Die mobile Nutzerführung ist zu langsam oder unübersichtlich.",
      "Referenzen, Vertrauen und konkrete Nutzenargumente sind zu schwach sichtbar.",
    ],
    solutionTitle: "Wie SaaleWeb Dienstleister digital stärkt",
    solution: [
      "SaaleWeb entwickelt Websites für Dienstleister, die Leistungen verständlich erklären, Vertrauen aufbauen und Anfragen erleichtern.",
      "Die Inhalte werden so strukturiert, dass Kunden, Suchmaschinen und moderne KI-Systeme das Angebot, den regionalen Bezug und den nächsten Schritt besser verstehen.",
    ],
    featuresTitle: "Wichtige Funktionen für Dienstleister-Websites",
    features: [
      { title: "Klare Leistungsseiten", text: "Jede wichtige Leistung bekommt eine verständliche Struktur mit Nutzen, Ablauf und nächstem Schritt." },
      { title: "Anfragefokus", text: "Kontaktformulare und CTA-Wege werden so geplant, dass qualifizierte Anfragen leichter entstehen." },
      { title: "Local SEO", text: "Stadt, Region, Servicegebiet und relevante Suchbegriffe werden natürlich in die Struktur eingebunden." },
      { title: "Trust-Elemente", text: "Referenzen, Erfahrung, Ablauf, Beratung und häufige Fragen schaffen Sicherheit vor dem ersten Kontakt." },
      { title: "Mobile Nutzerführung", text: "Besucher finden Leistungen, Kontakt, FAQ und Entscheidungshilfen schnell auf dem Smartphone." },
      { title: "AI-ready Content", text: "Klare Begriffe, semantische Überschriften und FAQ helfen Suchsystemen, das Angebot einzuordnen." },
    ],
    technologyTitle: "Die Technologie folgt dem Ziel – nicht umgekehrt",
    technologyText,
    processTitle: "Vom Dienstleistungsangebot zur Anfrage-Website",
    process: industryProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: [
      {
        label: "Salon Elen / Permanent Halle",
        href: "/projekte/online-buchungen-verdreifacht",
        description: "Projektbeispiel für klare Leistungen, Online-Terminlogik und lokale Sichtbarkeit.",
      },
      {
        label: "Qualifizierte Bauanfragen",
        href: "/projekte/qualifizierte-bauanfragen",
        description: "Projektbeispiel für Vertrauen, Leistungsstruktur und qualifizierte regionale Anfragen.",
      },
    ],
    relatedTitle: "Sinnvolle interne Links",
    relatedLinks: [
      { label: "Website erstellen lassen", href: "/leistungen/website-erstellen-lassen", description: "Neue Website mit klarer Struktur und Anfragefokus planen." },
      { label: "SEO Halle", href: "/leistungen/seo-halle", description: "Regionale SEO-Basis für lokale Dienstleister." },
      { label: "Local SEO", href: "/leistungen/local-seo", description: "Im Einzugsgebiet besser gefunden werden." },
      { label: "Website Audit", href: "/#website-audit", description: "Bestehende Website kostenlos prüfen lassen." },
      { label: "Kontakt", href: "/kontakt", description: "Dienstleister-Website unverbindlich besprechen." },
    ],
    faq: industryFaq("einen lokalen Dienstleister", [
      {
        q: "Was braucht eine gute Website für Dienstleister?",
        a: "Sie braucht eine klare Positionierung, verständliche Leistungsseiten, lokale SEO-Signale, Vertrauen, FAQ und einen einfachen Weg zur Anfrage.",
      },
      {
        q: "Kann eine Dienstleister-Website auch ohne Online-Shop mehr Anfragen bringen?",
        a: "Ja. Für viele lokale Dienstleister ist nicht ein Shop entscheidend, sondern eine klare Erklärung der Leistungen, Vertrauen und ein einfacher Kontaktweg.",
      },
    ]),
    ...defaultFinal,
  },
};

const INDUSTRY_SLUGS: Record<string, Phase4SlugMap> = {
  "restaurant-website": {
    de: "restaurant-website",
    en: "restaurant-website",
    ru: "sayt-dlya-restorana",
  },
  "hotel-website": {
    de: "hotel-website",
    en: "hotel-website",
    ru: "sayt-dlya-otelya",
  },
  "beauty-studio-website": {
    de: "beauty-studio-website",
    en: "beauty-studio-website",
    ru: "sayt-dlya-salona-krasoty",
  },
  "bauunternehmen-website": {
    de: "bauunternehmen-website",
    en: "construction-company-website",
    ru: "sayt-dlya-stroitelnoy-kompanii",
  },
  "handwerker-website": {
    de: "handwerker-website",
    en: "craftsmen-website",
    ru: "sayt-dlya-masterov",
  },
  "glaserei-website": {
    de: "glaserei-website",
    en: "glazier-website",
    ru: "sayt-dlya-stekolnoy-masterskoy",
  },
  "dienstleister-website": {
    de: "dienstleister-website",
    en: "service-provider-website",
    ru: "sayt-dlya-sfery-uslug",
  },
};

const INDUSTRY_SLUG_ALIASES: Record<Phase4Locale, Record<string, string>> = {
  de: {},
  en: {
    "tradesman-website": "handwerker-website",
    "glazing-company-website": "glaserei-website",
  },
  ru: {
    "sajt-restorana": "restaurant-website",
    "sajt-otelya": "hotel-website",
    "sajt-beauty-studii": "beauty-studio-website",
    "sajt-stroitelnoj-kompanii": "bauunternehmen-website",
    "sajt-remeslennika": "handwerker-website",
    "sajt-glaserei": "glaserei-website",
  },
};

type LocalizedIndustrySeed = {
  navLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  lead: string[];
  problems: string[];
  solution: string[];
  features: Phase4Card[];
  related: Phase4Link[];
  cases?: Phase4Link[];
  extraFaq?: Phase4Faq[];
};

const EN_INDUSTRY_SEEDS: Record<string, LocalizedIndustrySeed> = {
  "restaurant-website": {
    navLabel: "Restaurant website",
    title: "Restaurant website – more reservations, more visibility and more trust",
    metaTitle: "Restaurant website | SaaleWeb",
    metaDescription:
      "Restaurant website by SaaleWeb: menu, reservations, Local SEO, mobile user guidance and clear content for more direct inquiries.",
    lead: [
      "Guests often decide quickly on mobile: menu, opening hours, reservations and atmosphere must be clear immediately.",
      "SaaleWeb builds restaurant websites that connect appetite, trust and direct reservations.",
    ],
    problems: [
      "The menu is outdated, hidden as a PDF or hard to read on mobile.",
      "Opening hours, reservation and contact are not visible fast enough.",
      "Images do not show the quality of the restaurant.",
      "Local visibility in Google and Maps is weak.",
      "Events, news or seasonal offers are missing.",
      "Reservations depend too much on external platforms.",
    ],
    solution: [
      "We structure menu, reservations, atmosphere, reviews, location and contact so guests can decide faster.",
      "The website is mobile-first, locally visible and easy for search systems to understand.",
    ],
    features: [
      { title: "Digital menu", text: "Current, mobile-friendly and no hidden PDF search." },
      { title: "Reservation focus", text: "Clear calls to action for table reservations and inquiries." },
      { title: "Local SEO", text: "Location, cuisine, region and relevant search terms are connected." },
      { title: "Events and news", text: "Seasonal offers and events can be made visible." },
      { title: "Strong visuals", text: "Food and atmosphere are presented professionally." },
      { title: "Languages as needed", text: "German, English, Russian and more can be added for your audience." },
    ],
    related: [
      { label: "Neue Liebe Nebra", href: "/en/projects/neue-liebe-nebra", description: "Restaurant project with reservation focus." },
      { label: "Booking systems", href: "/en/services/booking-systems", description: "Make reservations and inquiries easier online." },
      { label: "Local SEO", href: "/en/services/local-seo", description: "Become easier to find regionally." },
      { label: "Contact", href: "/en/contact", description: "Discuss your restaurant website." },
    ],
  },
  "hotel-website": {
    navLabel: "Hotel website",
    title: "Hotel website – more direct bookings and less dependency on portals",
    metaTitle: "Hotel website | SaaleWeb",
    metaDescription:
      "Hotel website with direct booking focus, Local SEO, room presentation, performance and trust for guests from the region and beyond.",
    lead: [
      "Hotels need websites that build trust and guide guests toward a direct inquiry or booking.",
      "SaaleWeb builds hotel websites that present rooms, location, services and booking paths clearly.",
    ],
    problems: [
      "Guests book through portals although direct booking would be possible.",
      "Rooms, offers and location are not presented convincingly.",
      "The mobile view is slow or confusing.",
      "Reviews, trust and regional advantages are not visible enough.",
      "Booking paths are complicated or poorly integrated.",
      "SEO for local and travel-related searches is incomplete.",
    ],
    solution: [
      "We structure the website so guests quickly understand why they should book directly with you.",
      "Strong room pages, clear booking paths, local visibility, speed and structured content work together.",
    ],
    features: [
      { title: "Direct booking", text: "Booking systems or inquiry paths are integrated prominently and reliably." },
      { title: "Rooms and offers", text: "Services, images and advantages are presented clearly." },
      { title: "Regional visibility", text: "Hotel searches in your city and area are reflected in the structure." },
      { title: "Multilingual content", text: "Additional languages can be added for the right guest groups." },
      { title: "Performance", text: "Fast loading times help mobile guests and search engines." },
      { title: "Trust signals", text: "Reviews, location, amenities and contact are made easy to see." },
    ],
    related: [
      { label: "Booking systems", href: "/en/services/booking-systems", description: "Integrate digital booking paths cleanly." },
      { label: "Local SEO", href: "/en/services/local-seo", description: "Become more visible regionally and for travel searches." },
      { label: "Website relaunch", href: "/en/services/website-relaunch", description: "Modernize an existing hotel website." },
      { label: "Contact", href: "/en/contact", description: "Discuss a hotel website." },
    ],
  },
  "beauty-studio-website": {
    navLabel: "Beauty studio website",
    title: "Beauty studio website – appointments, trust and local visibility",
    metaTitle: "Beauty studio website | SaaleWeb",
    metaDescription:
      "Beauty studio website with online appointments, service overview, Local SEO, images, trust and mobile user guidance.",
    lead: [
      "Beauty clients compare services, images, prices and availability directly on their smartphones.",
      "SaaleWeb builds websites for beauty studios that create trust and make appointments easier.",
    ],
    problems: [
      "Services and prices are unclear.",
      "Appointments cannot be requested easily online.",
      "Images do not show enough quality and atmosphere.",
      "Local searches are not addressed properly.",
      "The website does not feel premium enough for the services.",
      "Mobile users move between Instagram, Maps and the website without guidance.",
    ],
    solution: [
      "We structure services, results, trust and booking paths so visitors can decide faster.",
      "The website can be expanded with online booking, multilingual content, Local SEO and clear service pages.",
    ],
    features: [
      { title: "Service overview", text: "Offers, prices and duration are explained clearly." },
      { title: "Online appointments", text: "Booking or inquiry paths are visible and mobile-friendly." },
      { title: "Image impact", text: "Results, studio and atmosphere are presented professionally." },
      { title: "Local SEO", text: "Location, service area and local search terms are integrated." },
      { title: "Trust building", text: "Process, hygiene, consultation and experience are communicated clearly." },
      { title: "Campaign-ready", text: "New services and offers can be added later." },
    ],
    related: [
      { label: "Booking systems", href: "/en/services/booking-systems", description: "Make online appointments easier." },
      { label: "Local SEO", href: "/en/services/local-seo", description: "Get found in your service area." },
      { label: "Get a website", href: "/en/services/website-development", description: "Plan a new site for a studio or salon." },
      { label: "Contact", href: "/en/contact", description: "Discuss your beauty website." },
    ],
  },
  "bauunternehmen-website": {
    navLabel: "Construction website",
    title: "Website for construction companies – trust, references and qualified inquiries",
    metaTitle: "Construction company website | SaaleWeb",
    metaDescription:
      "Construction company website with service pages, references, Local SEO, inquiry guidance and professional presentation.",
    lead: [
      "Construction services involve high-value decisions and trust. A website must show competence, references and clear inquiry paths.",
      "SaaleWeb builds websites for construction companies that explain services and prepare better inquiries.",
    ],
    problems: [
      "References are not structured or visible enough.",
      "Services are described too generally.",
      "Regional search terms and service areas are missing.",
      "Inquiries are unqualified because important information is not requested.",
      "The website feels outdated and does not build enough trust.",
      "Mobile users do not see a clear next step.",
    ],
    solution: [
      "We build a structure of service pages, references, region, inquiry guidance and decision support.",
      "Prospects can better judge whether your company fits their project before contacting you.",
    ],
    features: [
      { title: "Reference section", text: "Projects are shown with images, context and services." },
      { title: "Service pages", text: "Every important service receives a clear, searchable structure." },
      { title: "Qualified inquiry", text: "Forms collect relevant project information without overwhelming users." },
      { title: "Local SEO", text: "Region, service area and search terms are integrated cleanly." },
      { title: "Trust", text: "Process, experience, quality standards and contact paths become visible." },
      { title: "Performance", text: "Images and media are optimized so the site stays fast." },
    ],
    related: [
      { label: "Get a website", href: "/en/services/website-development", description: "A new website for complex services." },
      { label: "SEO Halle", href: "/en/services/seo-halle", description: "Regional visibility for construction services." },
      { label: "Craftsmen website", href: "/en/industries/craftsmen-website", description: "Related needs in skilled trades." },
      { label: "Contact", href: "/en/contact", description: "Discuss a construction website." },
    ],
  },
  "handwerker-website": {
    navLabel: "Craftsmen website",
    title: "Website for craftsmen – locally visible and trustworthy",
    metaTitle: "Craftsmen website | SaaleWeb",
    metaDescription:
      "Tradesman website with Local SEO, service structure, references, clear inquiry guidance and modern mobile presentation.",
    lead: [
      "Many trades businesses grow through recommendations. Still, new customers almost always check online whether a business feels reliable.",
      "SaaleWeb builds trades websites that connect regional visibility, trust and clear inquiries.",
    ],
    problems: [
      "The website looks older than the actual quality of the business.",
      "Services and service area are not clear.",
      "References, images and specializations are missing.",
      "Google does not find the right service pages.",
      "Inquiries arrive without useful context.",
      "Mobile users do not find phone or form fast enough.",
    ],
    solution: [
      "We make visible which services you offer, where you work and why customers can trust your business.",
      "The website is fast, mobile, locally oriented and built to prepare inquiries better.",
    ],
    features: [
      { title: "Service structure", text: "Every core service is explained and linked logically." },
      { title: "Service area", text: "Region, cities and local relevance are made visible." },
      { title: "References", text: "Images, projects and specializations build trust." },
      { title: "Inquiry guidance", text: "Contact paths collect useful context and stay simple." },
      { title: "Local SEO", text: "Search terms, location and Google signals are connected." },
      { title: "Maintainability", text: "New projects and services can be added later." },
    ],
    related: [
      { label: "Glazier website", href: "/en/industries/glazier-website", description: "Specialized requirements for glazing companies." },
      { label: "Local SEO", href: "/en/services/local-seo", description: "Get found in your service area." },
      { label: "Website maintenance", href: "/en/services/website-maintenance", description: "Keep the website current long term." },
      { label: "Contact", href: "/en/contact", description: "Discuss a trades website." },
    ],
    extraFaq: [
      {
        q: "Who builds websites for trades businesses in Halle?",
        a: "SaaleWeb builds fast, mobile-friendly websites for trades businesses in Halle with clear services, service areas, references, Local SEO and simple contact paths. Real glazing and construction projects show how the approach works in practice.",
      },
    ],
    cases: [
      {
        label: "Glaserei Schubert",
        href: "/en/projects/glaserei-schubert",
        description: "Real project example for specialist services, references, Local SEO and digital trust.",
      },
      {
        label: "SorgfaltBau",
        href: "/en/projects/qualified-construction-leads",
        description: "Real project example for clear construction services and qualified regional inquiries.",
      },
    ],
  },
  "glaserei-website": {
    navLabel: "Glazier website",
    title: "Website for glaziers – show quality, references and specialist services clearly",
    metaTitle: "Glazier website | SaaleWeb",
    metaDescription:
      "Website for glazing companies with references, service pages, Local SEO, trust, mobile presentation and clear inquiry guidance.",
    lead: [
      "Glazing companies need to show more than a phone number online. Customers want quality, specialization, regional proximity and examples.",
      "SaaleWeb builds glazing company websites that structure services clearly and create trust before the first inquiry.",
    ],
    problems: [
      "Specialist services are not separated clearly.",
      "References and images do not show quality enough.",
      "Regional searches are not targeted.",
      "Contact paths collect too little context.",
      "The mobile presentation feels outdated or slow.",
      "Search and AI systems do not understand services and region clearly.",
    ],
    solution: [
      "We structure the website by services, use cases, references and region.",
      "At the same time we strengthen technical SEO, Local SEO and content so relevant searches are addressed more clearly.",
    ],
    features: [
      { title: "Service pages", text: "Repairs, interiors, glass showers, mirrors or special glass can be explained separately." },
      { title: "References", text: "Images and project context show quality and use cases." },
      { title: "Local SEO", text: "Region, service area and search terms are integrated meaningfully." },
      { title: "Inquiry form", text: "Customers can submit measurements, images or their request in a structured way." },
      { title: "Trust", text: "Process, experience and consultation are communicated clearly." },
      { title: "Mobile speed", text: "The site remains fast even when many images are used." },
    ],
    related: [
      { label: "Craftsmen website", href: "/en/industries/craftsmen-website", description: "Digital basics for regional trades businesses." },
      { label: "SEO Halle", href: "/en/services/seo-halle", description: "Visibility for local specialist services." },
      { label: "Get a website", href: "/en/services/website-development", description: "Plan a new website with clear structure." },
      { label: "Contact", href: "/en/contact", description: "Discuss a glazing company website." },
    ],
    cases: [
      {
        label: "Glaserei Schubert",
        href: "/en/projects/glaserei-schubert",
        description: "Project example for local specialist expertise, clear service structure and digital trust.",
      },
    ],
  },
  "dienstleister-website": {
    navLabel: "Service provider website",
    title: "Website for service providers – become easier to find and receive better inquiries",
    metaTitle: "Service provider website | Visibility, trust and new inquiries",
    metaDescription:
      "SaaleWeb builds websites for local service providers with clear positioning, SEO structure, inquiry focus and professional mobile user guidance.",
    lead: [
      "Local service providers need to build trust quickly online. Visitors want to understand what is offered, why the provider is credible and how they can make contact without friction.",
      "A professional website makes that decision easier by explaining services clearly, answering common questions and guiding visitors toward a qualified inquiry.",
    ],
    problems: [
      "The positioning feels unclear or interchangeable.",
      "Services are described too generally or too technically.",
      "Local SEO signals for city, region and service area are missing.",
      "Contact paths are not clear enough or feel non-committal.",
      "Mobile users do not find the right next step fast enough.",
      "References, proof and practical benefits are not visible enough.",
    ],
    solution: [
      "SaaleWeb builds websites for service providers that explain services clearly, create trust and make inquiries easier.",
      "The content is structured so customers, search engines and modern AI systems can better understand the offer, local relevance and next step.",
    ],
    features: [
      { title: "Clear service pages", text: "Each core service receives a useful structure with benefits, process and next step." },
      { title: "Inquiry focus", text: "Forms and calls to action are planned so qualified inquiries become easier." },
      { title: "Local SEO", text: "City, region, service area and relevant search intent are integrated naturally." },
      { title: "Trust signals", text: "References, process, experience and FAQ create confidence before first contact." },
      { title: "Mobile guidance", text: "Visitors find services, contact, FAQ and decision help quickly on smartphones." },
      { title: "AI-ready content", text: "Clear terms, semantic headings and FAQ help search systems classify the offer." },
    ],
    related: [
      { label: "Website development", href: "/en/services/website-development", description: "Plan a new website with clear inquiry paths." },
      { label: "SEO Halle", href: "/en/services/seo-halle", description: "Regional SEO foundation for local providers." },
      { label: "Local SEO", href: "/en/services/local-seo", description: "Become more visible in your service area." },
      { label: "Website audit", href: "/en#website-audit", description: "Review the current website free of charge." },
      { label: "Contact", href: "/en/contact", description: "Discuss a service provider website." },
    ],
    cases: [
      {
        label: "Salon Elen / Permanent Halle",
        href: "/en/projects/online-bookings-tripled",
        description: "Project example for services, booking logic and local visibility.",
      },
      {
        label: "Qualified construction leads",
        href: "/en/projects/qualified-construction-leads",
        description: "Project example for trust, service structure and qualified regional inquiries.",
      },
    ],
  },
};

function ruIndustryFromEn(seed: LocalizedIndustrySeed, overrides: Partial<LocalizedIndustrySeed>): LocalizedIndustrySeed {
  return { ...seed, ...overrides };
}

const RU_INDUSTRY_SEEDS: Record<string, LocalizedIndustrySeed> = {
  "restaurant-website": ruIndustryFromEn(EN_INDUSTRY_SEEDS["restaurant-website"], {
    navLabel: "Сайт ресторана",
    title: "Сайт для ресторана – больше бронирований, видимости и доверия",
    metaTitle: "Сайт для ресторана | SaaleWeb",
    metaDescription:
      "Сайт ресторана от SaaleWeb: меню, бронирование, Local SEO, мобильный UX и понятный контент для прямых заявок.",
    lead: [
      "Гости часто принимают решение быстро и с телефона: меню, часы работы, бронь и атмосфера должны быть понятны сразу.",
      "SaaleWeb создаёт сайты ресторанов, которые соединяют аппетитную подачу, доверие и прямые бронирования.",
    ],
    problems: [
      "Меню устарело, спрятано в PDF или плохо читается на телефоне.",
      "Часы работы, бронь и контакт не видны достаточно быстро.",
      "Фотографии не передают качество ресторана.",
      "Локальная видимость в Google и Maps слабая.",
      "События, новости или сезонные предложения не показаны.",
      "Бронирования слишком зависят от внешних платформ.",
    ],
    solution: [
      "Мы структурируем меню, бронь, атмосферу, отзывы, локацию и контакты так, чтобы гости быстрее принимали решение.",
      "Сайт строится mobile-first, с локальной видимостью и понятной структурой для поисковых систем.",
    ],
    features: [
      { title: "Цифровое меню", text: "Актуальное, удобное на телефоне и без спрятанного PDF." },
      { title: "Фокус на бронь", text: "Понятные CTA для резервации столика и заявок." },
      { title: "Local SEO", text: "Локация, кухня, регион и поисковые запросы связаны чисто." },
      { title: "События и новости", text: "Сезонные предложения и мероприятия можно показать отдельно." },
      { title: "Сильные визуалы", text: "Блюда и атмосфера представлены профессионально." },
      { title: "Языки по необходимости", text: "Deutsch, English, Russisch и другие языки можно добавить под аудиторию." },
    ],
    related: [
      { label: "Neue Liebe Nebra", href: "/ru/proekty/neue-liebe-nebra", description: "Ресторанный проект с фокусом на бронирование." },
      { label: "Системы бронирования", href: "/ru/uslugi/sistemy-bronirovaniya", description: "Сделать брони и заявки проще онлайн." },
      { label: "Local SEO", href: "/ru/uslugi/local-seo", description: "Стать заметнее в регионе." },
      { label: "Контакты", href: "/ru/kontakt", description: "Обсудить сайт ресторана." },
    ],
  }),
  "hotel-website": ruIndustryFromEn(EN_INDUSTRY_SEEDS["hotel-website"], {
    navLabel: "Сайт отеля",
    title: "Сайт отеля – больше прямых бронирований и меньше зависимости от порталов",
    metaTitle: "Сайт отеля | SaaleWeb",
    metaDescription:
      "Сайт отеля с фокусом на прямые брони, Local SEO, презентацию номеров, скорость и доверие гостей.",
    lead: [
      "Отелям нужен сайт, который вызывает доверие и ведёт гостей к прямой заявке или бронированию.",
      "SaaleWeb создаёт сайты отелей, где номера, локация, услуги и путь бронирования представлены ясно.",
    ],
    problems: [
      "Гости бронируют через порталы, хотя могли бы напрямую.",
      "Номера, предложения и локация показаны недостаточно убедительно.",
      "Мобильная версия медленная или запутанная.",
      "Отзывы, доверие и региональные преимущества плохо видны.",
      "Путь бронирования сложный или плохо встроен.",
      "SEO для локальных и туристических запросов неполное.",
    ],
    solution: [
      "Мы структурируем сайт так, чтобы гости быстро понимали, почему стоит бронировать напрямую.",
      "Страницы номеров, путь бронирования, локальная видимость, скорость и структурированный контент работают вместе.",
    ],
    features: [
      { title: "Прямое бронирование", text: "Системы бронирования или формы заявки интегрируются заметно и надёжно." },
      { title: "Номера и предложения", text: "Услуги, фото и преимущества представлены понятно." },
      { title: "Региональная видимость", text: "Поисковые запросы по городу и региону учитываются в структуре." },
      { title: "Многоязычность", text: "Дополнительные языки можно добавить под целевые группы гостей." },
      { title: "Производительность", text: "Быстрая загрузка помогает гостям с телефона и поиску." },
      { title: "Сигналы доверия", text: "Отзывы, локация, оснащение и контакты легко найти." },
    ],
    related: [
      { label: "Системы бронирования", href: "/ru/uslugi/sistemy-bronirovaniya", description: "Чисто интегрировать цифровой путь бронирования." },
      { label: "Local SEO", href: "/ru/uslugi/local-seo", description: "Стать заметнее в регионе и туристическом поиске." },
      { label: "Релонч сайта", href: "/ru/uslugi/relonch-sajta", description: "Модернизировать существующий сайт отеля." },
      { label: "Контакты", href: "/ru/kontakt", description: "Обсудить сайт отеля." },
    ],
  }),
  "beauty-studio-website": ruIndustryFromEn(EN_INDUSTRY_SEEDS["beauty-studio-website"], {
    navLabel: "Сайт beauty-студии",
    title: "Сайт для beauty-студии – записи, доверие и локальная видимость",
    metaTitle: "Сайт beauty-студии | SaaleWeb",
    metaDescription:
      "Сайт beauty-студии с онлайн-записью, услугами, Local SEO, визуалами, доверием и мобильным UX.",
    lead: [
      "Клиенты beauty-сферы сравнивают услуги, фото, цены и доступность прямо со смартфона.",
      "SaaleWeb создаёт сайты для beauty-студий, которые вызывают доверие и упрощают запись.",
    ],
    problems: [
      "Услуги и цены неясны.",
      "Нельзя удобно запросить запись онлайн.",
      "Фото не показывают качество и атмосферу.",
      "Локальные запросы не закрыты.",
      "Сайт выглядит недостаточно премиально для услуг.",
      "Пользователь теряется между Instagram, Maps и сайтом.",
    ],
    solution: [
      "Мы структурируем услуги, результаты, доверие и путь записи так, чтобы посетители быстрее принимали решение.",
      "Сайт можно расширить онлайн-записью, многоязычностью, Local SEO и понятными страницами услуг.",
    ],
    features: [
      { title: "Обзор услуг", text: "Предложения, цены и длительность объяснены понятно." },
      { title: "Онлайн-запись", text: "Запись или заявка видны и удобны на телефоне." },
      { title: "Визуальный эффект", text: "Результаты, студия и атмосфера поданы профессионально." },
      { title: "Local SEO", text: "Локация, регион и локальные запросы интегрированы." },
      { title: "Доверие", text: "Процесс, гигиена, консультация и опыт объяснены ясно." },
      { title: "Готовность к акциям", text: "Новые услуги и предложения можно добавлять позже." },
    ],
    related: [
      { label: "Системы бронирования", href: "/ru/uslugi/sistemy-bronirovaniya", description: "Упростить онлайн-запись." },
      { label: "Local SEO", href: "/ru/uslugi/local-seo", description: "Быть заметнее в своём регионе." },
      { label: "Заказать сайт", href: "/ru/uslugi/razrabotka-saytov", description: "Спланировать новый сайт для студии." },
      { label: "Контакты", href: "/ru/kontakt", description: "Обсудить сайт beauty-студии." },
    ],
  }),
  "bauunternehmen-website": ruIndustryFromEn(EN_INDUSTRY_SEEDS["bauunternehmen-website"], {
    navLabel: "Сайт строительной компании",
    title: "Сайт для строительной компании – доверие, референсы и качественные заявки",
    metaTitle: "Сайт строительной компании | SaaleWeb",
    metaDescription:
      "Сайт строительной компании со страницами услуг, референсами, Local SEO, заявками и профессиональной презентацией.",
    lead: [
      "Строительные услуги связаны с крупными решениями и доверием. Сайт должен показывать компетенцию, референсы и понятный путь заявки.",
      "SaaleWeb создаёт сайты для строительных компаний, которые объясняют услуги и готовят более качественные заявки.",
    ],
    problems: [
      "Референсы плохо структурированы или мало видны.",
      "Услуги описаны слишком общо.",
      "Региональные запросы и зона работы не показаны.",
      "Заявки приходят без нужного контекста.",
      "Сайт выглядит устаревшим и мало вызывает доверия.",
      "На телефоне нет понятного следующего шага.",
    ],
    solution: [
      "Мы строим структуру из страниц услуг, референсов, региона, формы заявки и аргументов доверия.",
      "Клиенты лучше понимают, подходит ли компания их проекту, ещё до первого контакта.",
    ],
    features: [
      { title: "Референсы", text: "Проекты показаны с фото, контекстом и услугами." },
      { title: "Страницы услуг", text: "Каждая важная услуга получает понятную поисковую структуру." },
      { title: "Квалифицированная заявка", text: "Форма собирает важные данные проекта без перегруза." },
      { title: "Local SEO", text: "Регион, зона работы и запросы интегрируются чисто." },
      { title: "Доверие", text: "Процесс, опыт, качество и контакты становятся видимыми." },
      { title: "Производительность", text: "Фото и медиа оптимизированы, чтобы сайт оставался быстрым." },
    ],
    related: [
      { label: "Заказать сайт", href: "/ru/uslugi/razrabotka-saytov", description: "Новый сайт для сложных услуг." },
      { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Региональная видимость строительных услуг." },
      { label: "Сайт для мастеров", href: "/ru/otrasli/sayt-dlya-masterov", description: "Похожие задачи в ремесленных сферах." },
      { label: "Контакты", href: "/ru/kontakt", description: "Обсудить сайт строительной компании." },
    ],
  }),
  "handwerker-website": ruIndustryFromEn(EN_INDUSTRY_SEEDS["handwerker-website"], {
    navLabel: "Сайт ремесленника",
    title: "Сайт для ремесленников – локальная видимость и доверие",
    metaTitle: "Сайт ремесленника | SaaleWeb",
    metaDescription:
      "Сайт ремесленника с Local SEO, структурой услуг, референсами, понятной заявкой и современной мобильной подачей.",
    lead: [
      "Многие ремесленные компании растут через рекомендации. Но новые клиенты почти всегда проверяют онлайн, выглядит ли компания надёжно.",
      "SaaleWeb создаёт сайты для ремесленников, которые соединяют региональную видимость, доверие и понятные заявки.",
    ],
    problems: [
      "Сайт выглядит старее, чем реальное качество работы.",
      "Услуги и зона работы неясны.",
      "Нет референсов, фото и специализаций.",
      "Google не находит нужные страницы услуг.",
      "Заявки приходят без полезного контекста.",
      "На телефоне сложно быстро найти телефон или форму.",
    ],
    solution: [
      "Мы показываем, какие услуги вы предлагаете, где работаете и почему клиент может доверять компании.",
      "Сайт быстрый, мобильный, локально ориентированный и лучше готовит заявки.",
    ],
    features: [
      { title: "Структура услуг", text: "Каждая ключевая услуга объясняется и логично связывается ссылками." },
      { title: "Регион работы", text: "Города, регион и локальная релевантность видны на сайте." },
      { title: "Референсы", text: "Фото, проекты и специализации вызывают доверие." },
      { title: "Путь заявки", text: "Контактные формы собирают контекст и остаются простыми." },
      { title: "Local SEO", text: "Запросы, локация и Google-сигналы связаны." },
      { title: "Поддерживаемость", text: "Новые проекты и услуги можно добавлять позже." },
    ],
    related: [
      { label: "Сайт стекольной мастерской", href: "/ru/otrasli/sayt-dlya-stekolnoy-masterskoy", description: "Специализированные задачи для стекольных компаний." },
      { label: "Local SEO", href: "/ru/uslugi/local-seo", description: "Быть заметнее в зоне работы." },
      { label: "Поддержка сайта", href: "/ru/uslugi/podderzhka-saytov", description: "Держать сайт актуальным долгосрочно." },
      { label: "Контакты", href: "/ru/kontakt", description: "Обсудить сайт ремесленной компании." },
    ],
    extraFaq: [
      {
        q: "Кто создаёт сайты для ремесленных компаний в Halle?",
        a: "SaaleWeb создаёт для ремесленных компаний в Halle быстрые и удобные на телефоне сайты с понятными услугами, регионом работы, референсами, Local SEO и простыми контактными путями. Реальные проекты Glaserei и строительной компании показывают этот подход на практике.",
      },
    ],
    cases: [
      {
        label: "Glaserei Schubert",
        href: "/ru/proekty/glaserei-schubert",
        description: "Реальный пример проекта с понятными услугами, референсами, Local SEO и цифровым доверием.",
      },
      {
        label: "SorgfaltBau",
        href: "/ru/proekty/kvalificirovannye-zayavki",
        description: "Реальный пример проекта с ясными строительными услугами и качественными региональными заявками.",
      },
    ],
  }),
  "glaserei-website": ruIndustryFromEn(EN_INDUSTRY_SEEDS["glaserei-website"], {
    navLabel: "Сайт Glaserei",
    title: "Сайт для Glaserei – качество, референсы и специальные услуги в понятной структуре",
    metaTitle: "Сайт Glaserei | SaaleWeb",
    metaDescription:
      "Сайт для Glaserei со страницами услуг, референсами, Local SEO, доверием, мобильной подачей и понятной заявкой.",
    lead: [
      "Стекольной компании важно показать онлайн больше, чем телефон: качество, специализацию, региональную близость и примеры.",
      "SaaleWeb создаёт сайты для Glaserei, которые понятно структурируют услуги и вызывают доверие до первой заявки.",
    ],
    problems: [
      "Специализированные услуги не разделены ясно.",
      "Референсы и фото недостаточно показывают качество.",
      "Региональные запросы не закрыты.",
      "Контактные формы собирают мало контекста.",
      "Мобильная версия выглядит устаревшей или медленной.",
      "Поиск и ИИ плохо понимают услуги и регион.",
    ],
    solution: [
      "Мы структурируем сайт по услугам, случаям применения, референсам и региону.",
      "Одновременно усиливаем техническое SEO, Local SEO и контент, чтобы релевантные запросы закрывались понятнее.",
    ],
    features: [
      { title: "Страницы услуг", text: "Ремонт, интерьер, душевые, зеркала и спецстекло можно объяснить отдельно." },
      { title: "Референсы", text: "Фото и контекст проектов показывают качество и применение." },
      { title: "Local SEO", text: "Регион, зона работы и запросы интегрированы осмысленно." },
      { title: "Форма заявки", text: "Клиенты могут передать размеры, фото или задачу структурированно." },
      { title: "Доверие", text: "Процесс, опыт и консультация объяснены ясно." },
      { title: "Мобильная скорость", text: "Сайт остаётся быстрым даже при большом количестве изображений." },
    ],
    related: [
      { label: "Сайт для мастеров", href: "/ru/otrasli/sayt-dlya-masterov", description: "Цифровая база для локальных ремесленных компаний." },
      { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Видимость для локальных специальных услуг." },
      { label: "Заказать сайт", href: "/ru/uslugi/razrabotka-saytov", description: "Спланировать сайт с понятной структурой." },
      { label: "Контакты", href: "/ru/kontakt", description: "Обсудить сайт Glaserei." },
    ],
    cases: [
      {
        label: "Glaserei Schubert",
        href: "/ru/proekty/glaserei-schubert",
        description: "Пример проекта для локальной экспертности, понятной структуры услуг и цифрового доверия.",
      },
    ],
  }),
  "dienstleister-website": ruIndustryFromEn(EN_INDUSTRY_SEEDS["dienstleister-website"], {
    navLabel: "Сайт для сферы услуг",
    title: "Сайт для сферы услуг — лучше находиться в поиске и получать более качественные заявки",
    metaTitle: "Сайт для сферы услуг | Видимость, доверие и новые заявки",
    metaDescription:
      "SaaleWeb разрабатывает сайты для локальных сервисных компаний с понятным позиционированием, SEO-структурой, фокусом на заявки и удобной мобильной подачей.",
    lead: [
      "Локальным сервисным компаниям важно быстро вызывать доверие онлайн. Клиенты хотят понять, какие услуги вы предлагаете, почему вам можно доверять и как удобно связаться.",
      "Профессиональный сайт упрощает это решение: понятно объясняет услуги, отвечает на частые вопросы и ведёт посетителя к осмысленной заявке.",
    ],
    problems: [
      "Позиционирование звучит размыто и не отличает компанию от конкурентов.",
      "Услуги описаны слишком общо или слишком технически.",
      "Не хватает локальных SEO-сигналов для города, региона и зоны работы.",
      "Контактные пути неочевидны или не вызывают желания оставить заявку.",
      "На смартфоне посетитель не находит быстро следующий шаг.",
      "Референсы, доверие и практическая польза показаны слишком слабо.",
    ],
    solution: [
      "SaaleWeb создаёт сайты для сервисных компаний, которые понятно объясняют услуги, формируют доверие и упрощают получение заявок.",
      "Контент структурируется так, чтобы клиенты, поисковые системы и современные AI-сервисы лучше понимали предложение, региональный контекст и следующий шаг.",
    ],
    features: [
      { title: "Понятные страницы услуг", text: "Каждая ключевая услуга получает структуру с пользой, процессом и следующим шагом." },
      { title: "Фокус на заявки", text: "Формы и CTA планируются так, чтобы клиенту было проще оставить осмысленную заявку." },
      { title: "Local SEO", text: "Город, регион, зона работы и поисковые запросы встроены в структуру естественно." },
      { title: "Сигналы доверия", text: "Референсы, процесс, опыт и FAQ снижают неопределённость до первого контакта." },
      { title: "Мобильная логика", text: "Посетитель быстро находит услуги, контакт, FAQ и аргументы для решения на смартфоне." },
      { title: "AI-ready контент", text: "Чёткие термины, семантические заголовки и FAQ помогают поисковым системам понять предложение." },
    ],
    related: [
      { label: "Разработка сайтов", href: "/ru/uslugi/razrabotka-saytov", description: "Спланировать новый сайт с понятным путём к заявке." },
      { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Региональная SEO-база для локальных компаний." },
      { label: "Local SEO", href: "/ru/uslugi/local-seo", description: "Быть заметнее в зоне работы." },
      { label: "Анализ сайта", href: "/ru#website-audit", description: "Бесплатно проверить текущий сайт." },
      { label: "Контакты", href: "/ru/kontakt", description: "Обсудить сайт для сферы услуг." },
    ],
    cases: [
      {
        label: "Salon Elen / Permanent Halle",
        href: "/ru/proekty/onlajn-zapisi-vyrosli-vtroe",
        description: "Пример проекта для услуг, онлайн-записи и локальной видимости.",
      },
      {
        label: "Квалифицированные заявки",
        href: "/ru/proekty/kvalificirovannye-zayavki",
        description: "Пример проекта для доверия, структуры услуг и региональных заявок.",
      },
    ],
  }),
};

function localizedIndustryPage(canonicalSlug: string, locale: Phase4Locale): Phase4Landing | null {
  if (locale === "de") {
    const page = seoIndustryPages[canonicalSlug];
    return page
      ? prependUniqueFaq(
          { ...page, navLabel: page.navLabel ?? page.title.split(" – ")[0] },
          priorityIndustryFaqDe[canonicalSlug],
        )
      : null;
  }

  const seed = (locale === "en" ? EN_INDUSTRY_SEEDS : RU_INDUSTRY_SEEDS)[canonicalSlug];
  const slug = INDUSTRY_SLUGS[canonicalSlug]?.[locale];
  if (!seed || !slug) return null;

  const en = locale === "en";
  return {
    slug,
    navLabel: seed.navLabel,
    eyebrow: en ? "Industry solution" : "Отраслевое решение",
    title: seed.title,
    metaTitle: seed.metaTitle,
    metaDescription: seed.metaDescription,
    lead: seed.lead,
    problemTitle: en ? "Why many websites in this industry do not perform well enough" : "Почему многие сайты в этой отрасли работают недостаточно эффективно",
    problems: seed.problems,
    solutionTitle: en ? "How SaaleWeb strengthens this industry digitally" : "Как SaaleWeb усиливает эту отрасль в digital",
    solution: seed.solution,
    featuresTitle: en ? "Important features for this industry" : "Важные функции для этой отрасли",
    features: seed.features,
    technologyTitle: en ? "Technology follows the goal – not the other way around" : "Технология следует цели, а не наоборот",
    technologyText: en
      ? "We do not position SaaleWeb as only a Next.js or only a WordPress agency. The technology follows the goal: modern Next.js and React platforms, professionally supported WordPress websites or custom integrations are selected based on business value."
      : "SaaleWeb — не только Next.js- и не только WordPress-агентство. Технология следует цели: современные платформы Next.js и React, профессионально сопровождаемые WordPress-сайты или индивидуальные интеграции выбираются по пользе для бизнеса.",
    processTitle: en ? "From industry context to inquiry-ready website" : "От отраслевого контекста к сайту, готовому к заявкам",
    process: en
      ? [
          { title: "Analysis", text: "We review the industry, customer questions, competitors, existing content and current website." },
          { title: "Strategy", text: "Services, trust signals, region, SEO structure and inquiry paths are organized clearly." },
          { title: "Implementation", text: "Design, content, development and technical SEO are connected into one usable system." },
          { title: "Launch", text: "The page is checked for performance, mobile use, forms and indexability." },
          { title: "Development", text: "After launch, content, landing pages, FAQ, references and conversion points can be expanded." },
        ]
      : [
          { title: "Анализ", text: "Изучаем отрасль, вопросы клиентов, конкурентов, текущий контент и сайт." },
          { title: "Стратегия", text: "Выстраиваем услуги, доверие, регион, SEO-структуру и путь к заявке." },
          { title: "Реализация", text: "Соединяем дизайн, контент, разработку и техническую SEO-базу в одну систему." },
          { title: "Запустить", text: "Проверяем скорость, мобильность, формы и индексацию." },
          { title: "Развитие", text: "После запуска можно расширять контент, лендинги, FAQ, референсы и точки конверсии." },
        ],
    casesTitle: en ? "Relevant project examples" : "Подходящие примеры проектов",
    cases: seed.cases ?? SERVICE_CASES_BY_LOCALE[locale],
    relatedTitle: en ? "Useful related pages" : "Полезные связанные страницы",
    relatedLinks: seed.related,
    faq: [
      ...(seed.extraFaq ?? []),
      ...(en
      ? [
          {
            q: "Why does this industry need a specialized website?",
            a: "Because visitors ask different questions depending on the industry. A good website explains services, trust, process and contact paths in the right context.",
          },
          {
            q: "Can existing content be reused?",
            a: "Yes. Existing text, images and references can be reviewed, restructured and expanded where useful.",
          },
          {
            q: "Are SEO and Local SEO included?",
            a: "The technical and structural SEO foundation is considered from the start. A broader SEO package can be planned separately.",
          },
          {
            q: "Can the website be expanded later?",
            a: "Yes. Additional landing pages, FAQ, blog posts, booking systems or project areas can be added later.",
          },
          {
            q: "Does SaaleWeb promise fixed revenue or rankings?",
            a: "No. We do not make unrealistic promises. The goal is a better digital foundation for trust, visibility and inquiries.",
          },
          pricingFaq.en,
          aiSearchFaq.en,
          {
            q: "How do we start?",
            a: "We begin with a free first call, review your goals and current website, then propose a realistic next step.",
          },
        ]
      : [
          {
            q: "Почему отрасли нужен специализированный сайт?",
            a: "Потому что в каждой отрасли посетители задают разные вопросы. Хороший сайт объясняет услуги, доверие, процесс и контактные пути в правильном контексте.",
          },
          {
            q: "Можно использовать существующий контент?",
            a: "Да. Существующие тексты, фото и референсы можно проверить, переструктурировать и при необходимости расширить.",
          },
          {
            q: "SEO и Local SEO учитываются?",
            a: "Техническая и структурная SEO-база учитывается с самого начала. Более широкое SEO можно планировать отдельно.",
          },
          {
            q: "Сайт можно расширять позже?",
            a: "Да. Позже можно добавить лендинги, FAQ, блог, системы бронирования или раздел проектов.",
          },
          {
            q: "SaaleWeb обещает фиксированный доход или позиции?",
            a: "Нет. Мы не даём нереалистичных обещаний. Цель — лучшая цифровая база для доверия, видимости и заявок.",
          },
          pricingFaq.ru,
          aiSearchFaq.ru,
          {
            q: "Как начать?",
            a: "Начинаем с бесплатного разговора, проверяем цели и текущий сайт, затем предлагаем реалистичный следующий шаг.",
          },
        ]),
    ],
    finalTitle: en
      ? "Let’s check what is sensible for your industry."
      : "Давайте проверим, что разумно для вашей отрасли.",
    finalText: en
      ? "In a free first consultation we clarify what your customers need to see before they contact you."
      : "На бесплатной консультации уточним, что вашим клиентам нужно увидеть перед заявкой.",
  };
}

function industryCanonicalFromSlug(locale: Phase4Locale, slug: string): string | null {
  return (
    Object.entries(INDUSTRY_SLUGS).find(([, slugs]) => slugs[locale] === slug)?.[0] ??
    INDUSTRY_SLUG_ALIASES[locale][slug] ??
    null
  );
}

export const seoIndustrySlugs = Object.keys(seoIndustryPages);

export function getSeoIndustryStaticParams() {
  return Object.values(INDUSTRY_SLUGS).flatMap((slugs) =>
    (Object.entries(slugs) as [Phase4Locale, string][]).map(([locale, slug]) => ({ locale, slug })),
  );
}

export function getSeoIndustrySlugMap(canonicalSlug: string): Phase4SlugMap | null {
  return INDUSTRY_SLUGS[canonicalSlug] ?? null;
}

export function getSeoIndustrySlugGroups(): Phase4SlugMap[] {
  return Object.values(INDUSTRY_SLUGS);
}

export function getSeoIndustrySlugMapByLocalizedSlug(locale: string, slug: string): Phase4SlugMap | null {
  if (!isPhase4Locale(locale)) return null;
  const canonical = industryCanonicalFromSlug(locale, slug);
  return canonical ? INDUSTRY_SLUGS[canonical] : null;
}

export function getSeoIndustryPage(slug: string, locale: string = "de") {
  if (!isPhase4Locale(locale)) return null;
  const canonical = industryCanonicalFromSlug(locale, slug) ?? slug;
  return localizedIndustryPage(canonical, locale);
}

function cityFaq(city: string): Phase4Faq[] {
  return [
    {
      q: `Warum ist Webdesign in ${city} für lokale Unternehmen wichtig?`,
      a: `Viele Kunden prüfen Anbieter in ${city} zuerst online. Eine klare Website hilft, Vertrauen aufzubauen, Leistungen zu erklären und den nächsten Kontakt einfacher zu machen.`,
    },
    {
      q: `Unterstützt SaaleWeb auch SEO in ${city}?`,
      a: `Ja. Wir verbinden technische SEO, lokale Inhalte, interne Links und strukturierte Daten, damit Ihr Unternehmen in ${city} und Umgebung besser eingeordnet werden kann.`,
    },
    {
      q: "Kann eine bestehende WordPress-Website weiter genutzt werden?",
      a: "Ja, wenn das sinnvoll ist. SaaleWeb kann WordPress modernisieren, betreuen oder bei Bedarf eine neue technische Grundlage empfehlen.",
    },
    {
      q: "Welche Branchen unterstützt SaaleWeb regional?",
      a: "Typische Projekte entstehen für Restaurants, Hotels, Beauty Studios, Handwerksbetriebe, Bauunternehmen, Glasereien und lokale Dienstleister.",
    },
    {
      q: "Ist eine persönliche Zusammenarbeit möglich?",
      a: "Ja. Die Zusammenarbeit ist persönlich, direkt und transparent. Viele Abstimmungen funktionieren effizient online, ohne den regionalen Bezug zu verlieren.",
    },
    pricingFaq.de,
    {
      q: `Wird mein Unternehmen in ${city} auch in KI-Antworten genannt?`,
      a: `Die Chance steigt, wenn Leistungen, der Standortbezug zu ${city} und Antworten auf Kundenfragen maschinenlesbar strukturiert sind. Genau diese GEO/AIO-Basis bauen wir mit FAQ-Bereichen und strukturierten Daten auf — für Google und KI-Systeme wie ChatGPT, Gemini und Perplexity.`,
    },
    {
      q: "Wie startet ein regionales Website-Projekt?",
      a: "Mit einem kostenlosen Erstgespräch und einer kurzen Analyse Ihrer Ziele, Zielgruppe, aktuellen Website und wichtigsten regionalen Suchanfragen.",
    },
  ];
}

const locationServices: Phase4Card[] = [
  { title: "Webdesign", text: "Moderne Websites, die professionell wirken und Anfragen erleichtern." },
  { title: "SEO & Local SEO", text: "Struktur, Inhalte und Standortsignale für bessere regionale Sichtbarkeit." },
  { title: "WordPress Modernisierung", text: "Bestehende Websites verbessern, wenn WordPress die passende Lösung bleibt." },
  { title: "Performance", text: "Schnelle Ladezeiten und stabile mobile Nutzung als technische Grundlage." },
  { title: "Betreuung", text: "Laufende Pflege, Erweiterung und Optimierung nach dem Launch." },
  { title: "KI-Suche", text: "Inhalte so strukturieren, dass moderne KI-Systeme Zusammenhänge besser erkennen." },
];

const locationIndustries: Phase4Card[] = [
  { title: "Restaurants & Hotels", text: "Reservierungen, Direktbuchungen, Speisekarten und lokale Sichtbarkeit." },
  { title: "Beauty & Gesundheit", text: "Terminbuchung, Vertrauen, Leistungen und mobile Nutzerführung." },
  { title: "Handwerk & Glaserei", text: "Referenzen, Einzugsgebiet, Fachleistungen und qualifizierte Anfragen." },
  { title: "Bau & lokale Dienste", text: "Leistungsseiten, Projektbeispiele und klare Anfrageprozesse." },
];

const locationIndustriesByLocale: Record<Phase4Locale, Phase4Card[]> = {
  de: locationIndustries,
  en: [
    { title: "Restaurants & hotels", text: "Reservations, direct bookings, menus and local visibility." },
    { title: "Beauty & health", text: "Online booking, trust, service clarity and mobile user guidance." },
    { title: "Trades & glazing", text: "References, service area, specialist services and qualified inquiries." },
    { title: "Construction & local services", text: "Service pages, project examples and clear inquiry paths." },
  ],
  ru: [
    { title: "Рестораны и отели", text: "Бронирования, прямые заявки, меню и локальная видимость." },
    { title: "Beauty и здоровье", text: "Онлайн-запись, доверие, понятные услуги и удобный мобильный путь." },
    { title: "Ремесло и Glaserei", text: "Референсы, зона работы, специализация и квалифицированные заявки." },
    { title: "Строительство и локальные услуги", text: "Страницы услуг, примеры проектов и понятный путь заявки." },
  ],
};

export const locationPages: Record<string, Phase4Landing & { cityName: string; nearby: Phase4Link[] }> = {
  halle: {
    slug: "halle",
    cityName: "Halle (Saale)",
    eyebrow: "Standort",
    title: "Webdesign in Halle (Saale) für Unternehmen, die online sichtbar werden möchten",
    metaTitle: "Webagentur & Webdesign Halle (Saale) | SaaleWeb",
    metaDescription:
      "Webagentur in Halle (Saale), Sachsen-Anhalt: Webdesign, Firmenwebsites, SEO und digitale Systeme für Sichtbarkeit, Vertrauen und Anfragen.",
    lead: [
      "Halle ist für SaaleWeb der wichtigste regionale Bezugspunkt. Viele Unternehmen hier haben starke Leistungen, aber eine Website, die diese Stärke online nicht klar genug zeigt.",
      "Als Webagentur aus Halle entwickeln wir Firmenwebsites, SEO-Strukturen und Inhalte, die lokale Kunden schneller verstehen und Such- sowie AI-Systeme eindeutig einordnen können.",
    ],
    problemTitle: "Lokale Herausforderung in Halle",
    problems: [
      "Kunden vergleichen Anbieter in Halle direkt über Google und Maps.",
      "Viele Websites erklären Leistungen nicht konkret genug.",
      "Lokale Suchbegriffe und Stadtbezug fehlen häufig.",
      "Mobile Besucher finden Kontaktwege nicht schnell genug.",
      "Referenzen und Vertrauen werden zu schwach sichtbar.",
      "KI-Suchsysteme erkennen Unternehmensprofil und Region nicht eindeutig.",
    ],
    solutionTitle: "Webagentur in Halle: die SaaleWeb Lösung",
    solution: [
      "Wir verbinden Webdesign Halle, Website-Erstellung für Unternehmen, SEO Halle, Local SEO und klare Conversion-Struktur. Die Website soll nicht nur gut aussehen, sondern verständlich verkaufen und Vertrauen aufbauen.",
      "Dazu gehören regionale Inhalte, saubere Technik, schnelle Ladezeiten, strukturierte Daten, FAQ-Bereiche und interne Links zu Leistungen, Branchen und Projekten.",
    ],
    featuresTitle: "Relevante Leistungen in Halle",
    features: locationServices,
    technologyTitle: "Technologie folgt dem Ziel",
    technologyText,
    processTitle: "So entsteht regionale Sichtbarkeit",
    process: serviceProcess,
    casesTitle: "Projektbeispiele aus passenden Branchen",
    cases: [...serviceCases.restaurant, ...serviceCases.local],
    relatedTitle: "Nahe Standorte und nächste Themen",
    nearby: [
      { label: "Leipzig", href: "/standorte/leipzig", description: "Webdesign und SEO im größeren regionalen Markt." },
      { label: "Merseburg", href: "/standorte/merseburg", description: "Sichtbarkeit im südlichen Umfeld von Halle." },
      { label: "Saalekreis", href: "/standorte/saalekreis", description: "Regionale Reichweite über Halle hinaus." },
    ],
    relatedLinks: [
      { label: "Webdesign Halle", href: "/leistungen/webdesign-halle", description: "Kommerzielle Landingpage für regionale Webdesign-Anfragen." },
      { label: "SEO Halle", href: "/leistungen/seo-halle", description: "Organische Sichtbarkeit in Halle verbessern." },
      { label: "Website erstellen lassen", href: "/leistungen/website-erstellen-lassen", description: "Neue Website strategisch planen." },
    ],
    faq: cityFaq("Halle"),
    ...defaultFinal,
  },
  leipzig: {
    slug: "leipzig",
    cityName: "Leipzig",
    eyebrow: "Standort",
    title: "Webdesign Leipzig – moderne Websites für einen stark umkämpften Markt",
    metaTitle: "Webdesign Leipzig & SEO Leipzig | SaaleWeb",
    metaDescription:
      "Webdesign Leipzig und SEO Leipzig für Unternehmen, die sich in einem dynamischen Markt klar positionieren und online sichtbarer werden möchten.",
    lead: [
      "Leipzig ist digital anspruchsvoll und wettbewerbsstark. Wer hier online sichtbar sein möchte, braucht eine Website, die schnell erklärt, Vertrauen aufbaut und klar zur Anfrage führt.",
      "SaaleWeb unterstützt Unternehmen aus Leipzig mit Webdesign, SEO, Local SEO und strukturierten Inhalten für klassische und KI-gestützte Suche.",
    ],
    problemTitle: "Wettbewerb und Sichtbarkeit in Leipzig",
    problems: [
      "Viele Anbieter konkurrieren um ähnliche lokale Suchbegriffe.",
      "Austauschbare Websites verlieren gegen klar positionierte Wettbewerber.",
      "Mobile Suchanfragen erfordern schnelle und eindeutige Nutzerwege.",
      "SEO-Inhalte sind oft zu allgemein und nicht entscheidungsnah.",
      "Branchen- und Standortsignale werden nicht sauber verbunden.",
      "KI-Systeme benötigen klare, verlässliche Informationen.",
    ],
    solutionTitle: "Klare Positionierung für Leipzig",
    solution: [
      "Wir entwickeln Website-Strukturen, die Leistungen, Zielgruppe, Standort und Vertrauen deutlich verbinden.",
      "Für Leipzig achten wir besonders auf Differenzierung: Warum sollte ein Kunde genau Ihr Unternehmen wählen und welche Informationen braucht er vor der Anfrage?",
    ],
    featuresTitle: "Relevante Leistungen in Leipzig",
    features: locationServices,
    technologyTitle: "Technologie folgt dem Ziel",
    technologyText,
    processTitle: "Von Positionierung zu Sichtbarkeit",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: [...serviceCases.restaurant, ...serviceCases.local],
    relatedTitle: "Nahe Standorte und nächste Themen",
    nearby: [
      { label: "Schkeuditz", href: "/standorte/schkeuditz", description: "Regionale Nähe zwischen Leipzig und Halle." },
      { label: "Delitzsch", href: "/standorte/delitzsch", description: "Lokale Sichtbarkeit nördlich von Leipzig." },
      { label: "Halle (Saale)", href: "/standorte/halle", description: "Hauptregion und persönlicher Bezug von SaaleWeb." },
    ],
    relatedLinks: [
      { label: "Website erstellen lassen", href: "/leistungen/website-erstellen-lassen", description: "Neue Website mit Strategie und SEO-Basis." },
      { label: "KI-Optimierung", href: "/leistungen/ki-optimierung", description: "Inhalte für moderne KI-Suche strukturieren." },
      { label: "Projekte", href: "/projekte", description: "Ausgewählte Arbeiten ansehen." },
    ],
    faq: cityFaq("Leipzig"),
    ...defaultFinal,
  },
  merseburg: {
    slug: "merseburg",
    cityName: "Merseburg",
    eyebrow: "Standort",
    title: "Webdesign Merseburg – regionale Sichtbarkeit für Unternehmen im Saalekreis",
    metaTitle: "Webdesign Merseburg & SEO | SaaleWeb",
    metaDescription:
      "Webdesign und SEO für Merseburg: moderne Websites, Local SEO, klare Leistungsseiten und digitale Kundengewinnung für regionale Unternehmen.",
    lead: [
      "In Merseburg suchen Kunden häufig gezielt nach regionalen Anbietern, die schnell erreichbar und vertrauenswürdig wirken.",
      "SaaleWeb hilft Unternehmen, ihre Leistungen klarer zu präsentieren und in der lokalen Suche besser verstanden zu werden.",
    ],
    problemTitle: "Lokale Sichtbarkeit in Merseburg",
    problems: [
      "Viele Betriebe werden online nicht so professionell wahrgenommen, wie sie tatsächlich arbeiten.",
      "Leistungen und Einzugsgebiet sind zu ungenau beschrieben.",
      "Suchanfragen aus Merseburg und Saalekreis werden nicht gezielt bedient.",
      "Referenzen, Bilder und Vertrauen fehlen im richtigen Moment.",
      "Kontaktwege sind nicht mobil optimiert.",
      "Die Website ist technisch oder inhaltlich nicht auf Wachstum vorbereitet.",
    ],
    solutionTitle: "Klare Website-Struktur für Merseburg",
    solution: [
      "Wir entwickeln Websites, die regionale Nähe, Leistungsqualität und Kontaktwege klar verbinden.",
      "Für Merseburg sind besonders Local SEO, mobile Nutzerführung und verständliche Leistungsseiten wichtig, damit Besucher schneller Vertrauen fassen.",
    ],
    featuresTitle: "Relevante Leistungen in Merseburg",
    features: locationServices,
    technologyTitle: "Technologie folgt dem Ziel",
    technologyText,
    processTitle: "Von lokaler Analyse zur Website",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: serviceCases.local,
    relatedTitle: "Nahe Standorte und nächste Themen",
    nearby: [
      { label: "Halle (Saale)", href: "/standorte/halle", description: "Webdesign und SEO im direkten regionalen Umfeld." },
      { label: "Saalekreis", href: "/standorte/saalekreis", description: "Sichtbarkeit über Merseburg hinaus." },
      { label: "Leipzig", href: "/standorte/leipzig", description: "Erweiterter Markt mit stärkerem Wettbewerb." },
    ],
    relatedLinks: [
      { label: "Local SEO", href: "/leistungen/local-seo", description: "Regionale Suchanfragen besser bedienen." },
      { label: "Handwerker Website", href: "/branchen/handwerker-website", description: "Regionale Betriebe klar präsentieren." },
      { label: "Kontakt", href: "/kontakt", description: "Projekt in Merseburg besprechen." },
    ],
    faq: cityFaq("Merseburg"),
    ...defaultFinal,
  },
  schkeuditz: {
    slug: "schkeuditz",
    cityName: "Schkeuditz",
    eyebrow: "Standort",
    title: "Webdesign Schkeuditz – sichtbar zwischen Halle, Leipzig und regionalem Umfeld",
    metaTitle: "Webdesign Schkeuditz & SEO | SaaleWeb",
    metaDescription:
      "Webdesign und SEO für Schkeuditz: Websites, Local SEO, Performance und klare digitale Positionierung zwischen Halle und Leipzig.",
    lead: [
      "Schkeuditz liegt in einem regional interessanten Umfeld zwischen Halle und Leipzig. Für Unternehmen kann eine klare digitale Positionierung hier besonders wichtig sein.",
      "SaaleWeb entwickelt Websites, die Standortnähe, Leistung und Vertrauen verständlich zusammenbringen.",
    ],
    problemTitle: "Sichtbarkeit zwischen zwei Märkten",
    problems: [
      "Unternehmen konkurrieren mit Anbietern aus Halle, Leipzig und dem direkten Umfeld.",
      "Die Website macht nicht klar, für welche Region Leistungen angeboten werden.",
      "Lokale Suchbegriffe sind nicht strukturiert abgedeckt.",
      "Mobile Nutzer erhalten zu wenig schnelle Orientierung.",
      "Branchenkompetenz und Referenzen werden nicht deutlich genug gezeigt.",
      "Inhalte sind für KI-Suche und Google zu wenig eindeutig.",
    ],
    solutionTitle: "Regionale Positionierung für Schkeuditz",
    solution: [
      "Wir bauen eine Website-Struktur, die Schkeuditz, umliegende Orte und relevante Leistungen sinnvoll verbindet.",
      "So entsteht ein digitaler Auftritt, der lokale Kunden abholt und gleichzeitig die Nähe zu Halle und Leipzig berücksichtigt.",
    ],
    featuresTitle: "Relevante Leistungen in Schkeuditz",
    features: locationServices,
    technologyTitle: "Technologie folgt dem Ziel",
    technologyText,
    processTitle: "Von regionaler Lage zur digitalen Struktur",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: serviceCases.local,
    relatedTitle: "Nahe Standorte und nächste Themen",
    nearby: [
      { label: "Leipzig", href: "/standorte/leipzig", description: "Stärkerer Wettbewerb und größere Reichweite." },
      { label: "Halle (Saale)", href: "/standorte/halle", description: "Regionaler Hauptbezug von SaaleWeb." },
      { label: "Delitzsch", href: "/standorte/delitzsch", description: "Lokale Sichtbarkeit im nördlichen Umfeld." },
    ],
    relatedLinks: [
      { label: "SEO Halle", href: "/leistungen/seo-halle", description: "Regionale SEO-Basis verstehen." },
      { label: "Performance Optimierung", href: "/leistungen/performance-optimierung", description: "Schnelle Websites für mobile Nutzer." },
      { label: "Kontakt", href: "/kontakt", description: "Website-Projekt in Schkeuditz besprechen." },
    ],
    faq: cityFaq("Schkeuditz"),
    ...defaultFinal,
  },
  delitzsch: {
    slug: "delitzsch",
    cityName: "Delitzsch",
    eyebrow: "Standort",
    title: "Webdesign Delitzsch – moderne Websites für lokale Anbieter und Dienstleister",
    metaTitle: "Webdesign Delitzsch & SEO | SaaleWeb",
    metaDescription:
      "Webdesign Delitzsch und SEO für lokale Unternehmen: klare Websites, regionale Sichtbarkeit, Vertrauen und qualifizierte Anfragen.",
    lead: [
      "In Delitzsch zählt lokale Auffindbarkeit besonders für Dienstleister, Handwerk, Gastronomie und regionale Anbieter.",
      "SaaleWeb entwickelt Websites, die professionell wirken, Leistungen verständlich erklären und die lokale Suche gezielt unterstützen.",
    ],
    problemTitle: "Warum lokale Anbieter online oft unter Wert erscheinen",
    problems: [
      "Die Website ist älter als die tatsächliche Qualität des Unternehmens.",
      "Leistungen, Öffnungszeiten oder Kontaktwege sind nicht sofort klar.",
      "Regionale Suchbegriffe für Delitzsch und Umgebung fehlen.",
      "Referenzen und Kundenvertrauen werden zu wenig genutzt.",
      "Mobile Besucher erhalten keine klare Führung zur Anfrage.",
      "Suchmaschinen erkennen Branche und Region nicht eindeutig.",
    ],
    solutionTitle: "Digitale Klarheit für Delitzsch",
    solution: [
      "Wir erstellen Websites, die lokale Stärken sichtbar machen und unnötige Komplexität vermeiden.",
      "Mit klaren Leistungsseiten, Local SEO, schneller Technik und strukturierten Inhalten entsteht eine solide Grundlage für regionale Anfragen.",
    ],
    featuresTitle: "Relevante Leistungen in Delitzsch",
    features: locationServices,
    technologyTitle: "Technologie folgt dem Ziel",
    technologyText,
    processTitle: "Vom lokalen Angebot zur Anfrage",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: serviceCases.local,
    relatedTitle: "Nahe Standorte und nächste Themen",
    nearby: [
      { label: "Leipzig", href: "/standorte/leipzig", description: "Größerer Markt mit stärkerer digitaler Konkurrenz." },
      { label: "Schkeuditz", href: "/standorte/schkeuditz", description: "Sichtbarkeit im regionalen Zwischenraum." },
      { label: "Halle (Saale)", href: "/standorte/halle", description: "Hauptregion und SaaleWeb Bezugspunkt." },
    ],
    relatedLinks: [
      { label: "Website erstellen lassen", href: "/leistungen/website-erstellen-lassen", description: "Neue Website strategisch aufbauen." },
      { label: "Local SEO", href: "/leistungen/local-seo", description: "Lokale Suchanfragen stärker nutzen." },
      { label: "Kontakt", href: "/kontakt", description: "Projekt in Delitzsch besprechen." },
    ],
    faq: cityFaq("Delitzsch"),
    ...defaultFinal,
  },
  saalekreis: {
    slug: "saalekreis",
    cityName: "Saalekreis",
    eyebrow: "Standort",
    title: "Webdesign im Saalekreis – regionale Sichtbarkeit über einzelne Orte hinaus",
    metaTitle: "Webdesign Saalekreis & SEO | SaaleWeb",
    metaDescription:
      "Webdesign und SEO im Saalekreis: moderne Websites, Local SEO, regionale Landingpages und klare digitale Systeme für Unternehmen.",
    lead: [
      "Im Saalekreis suchen Kunden nicht immer nur nach einem einzelnen Ort. Viele Entscheidungen entstehen über regionale Nähe, Vertrauen und passende Spezialisierung.",
      "SaaleWeb entwickelt Websites, die Einzugsgebiet, Leistungen und lokale Relevanz verständlich verbinden.",
    ],
    problemTitle: "Regionale Sichtbarkeit im Saalekreis",
    problems: [
      "Die Website nennt den Einzugsbereich nicht klar genug.",
      "Leistungsseiten sind zu allgemein und nicht regional verknüpft.",
      "Lokale Suchanfragen aus verschiedenen Orten bleiben ungenutzt.",
      "Kunden erkennen nicht schnell, ob der Anbieter in ihrer Region arbeitet.",
      "Referenzen aus dem Umfeld werden zu schwach eingesetzt.",
      "Die Inhalte sind für Google und KI-Systeme nicht eindeutig strukturiert.",
    ],
    solutionTitle: "Regionale Struktur statt einzelner Keyword-Seiten",
    solution: [
      "Wir erstellen keine dünnen Ortsseiten, sondern eine saubere regionale Architektur: Leistungen, Branchen, Einzugsgebiet, Referenzen und Kontaktwege greifen ineinander.",
      "So kann die Website im Saalekreis glaubwürdig sichtbar werden, ohne künstliches Keyword-Stuffing.",
    ],
    featuresTitle: "Relevante Leistungen im Saalekreis",
    features: locationServices,
    technologyTitle: "Technologie folgt dem Ziel",
    technologyText,
    processTitle: "Von Region zu Themenstruktur",
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: serviceCases.local,
    relatedTitle: "Nahe Standorte und nächste Themen",
    nearby: [
      { label: "Halle (Saale)", href: "/standorte/halle", description: "Zentraler regionaler Bezugspunkt." },
      { label: "Merseburg", href: "/standorte/merseburg", description: "Wichtiger Standort im Saalekreis." },
      { label: "Leipzig", href: "/standorte/leipzig", description: "Erweiterter Markt in der Nähe." },
    ],
    relatedLinks: [
      { label: "Webdesign Halle", href: "/leistungen/webdesign-halle", description: "Starker lokaler Bezug im regionalen Zentrum." },
      { label: "SEO Halle", href: "/leistungen/seo-halle", description: "SEO-Grundlage für regionale Sichtbarkeit." },
      { label: "Handwerker Website", href: "/branchen/handwerker-website", description: "Regionale Fachbetriebe klar positionieren." },
    ],
    faq: cityFaq("Saalekreis"),
    ...defaultFinal,
  },
};

export const locationSlugs = Object.keys(locationPages);

function localizedLocationPage(slug: string, locale: Phase4Locale) {
  const base = locationPages[slug];
  if (!base) return null;
  if (locale === "de") return prependUniqueFaq(base, priorityLocationFaqDe[slug]);

  const en = locale === "en";
  const city = base.cityName;
  const locationPath = (targetSlug: string) =>
    locale === "en" ? `/en/locations/${targetSlug}` : `/ru/goroda/${targetSlug}`;

  return {
    ...base,
    eyebrow: en ? "Location" : "Локация",
    title: en
      ? `Web design in ${city} for businesses that want to become visible online`
      : `Веб-дизайн в ${city} для компаний, которым нужна онлайн-видимость`,
    metaTitle: en
      ? `Web design ${city} & SEO | SaaleWeb`
      : `Веб-дизайн ${city} и SEO | SaaleWeb`,
    metaDescription: en
      ? `Web design, SEO and modern websites for businesses in ${city}: SaaleWeb builds digital systems for visibility, trust and qualified inquiries.`
      : `Веб-дизайн, SEO и современные сайты для компаний в ${city}: SaaleWeb создаёт цифровые системы для видимости, доверия и заявок.`,
    lead: en
      ? [
          `Many customers in ${city} search online first, even when they want to work with a local business nearby.`,
          "SaaleWeb builds websites, SEO structures and content that help local customers understand your offer faster and help search systems classify it more clearly.",
        ]
      : [
          `Многие клиенты в ${city} сначала ищут онлайн, даже если хотят обратиться к локальной компании рядом.`,
          "SaaleWeb создаёт сайты, SEO-структуры и контент, которые помогают клиентам быстрее понять предложение, а поисковым системам — лучше его классифицировать.",
        ],
    problemTitle: en ? `Local digital challenges in ${city}` : `Локальные цифровые задачи в ${city}`,
    problems: en
      ? [
          `Customers compare providers in ${city} directly through Google and Maps.`,
          "Many websites do not explain services concretely enough.",
          "Local search terms and regional relevance are often missing.",
          "Mobile visitors do not find contact paths fast enough.",
          "References and trust signals are not visible at the right moment.",
          "AI search systems need clearer information about business, region and services.",
        ]
      : [
          `Клиенты сравнивают компании в ${city} напрямую через Google и Maps.`,
          "Многие сайты объясняют услуги недостаточно конкретно.",
          "Локальные запросы и региональная релевантность часто отсутствуют.",
          "На смартфоне посетители не находят контактные пути достаточно быстро.",
          "Референсы и доверие не видны в нужный момент.",
          "ИИ-поиску нужны более ясные данные о бизнесе, регионе и услугах.",
        ],
    solutionTitle: en ? `SaaleWeb solution for ${city}` : `Решение SaaleWeb для ${city}`,
    solution: en
      ? [
          `We connect web design, SEO, Local SEO and conversion structure for ${city}. The website should not only look good, but explain clearly and create trust.`,
          "This includes regional content, clean technology, fast loading times, structured data, FAQ sections and internal links to services, industries and projects.",
        ]
      : [
          `Мы соединяем веб-дизайн, SEO, Local SEO и структуру конверсии для ${city}. Сайт должен не только выглядеть хорошо, но и понятно объяснять предложение и вызывать доверие.`,
          "Сюда входят региональный контент, чистая технология, быстрая загрузка, структурированные данные, FAQ и внутренние ссылки на услуги, отрасли и проекты.",
        ],
    featuresTitle: en ? `Relevant services in ${city}` : `Актуальные услуги в ${city}`,
    features: en
      ? [
          { title: "Web design", text: "Modern websites that look professional and make inquiries easier." },
          { title: "SEO & Local SEO", text: "Structure, content and location signals for better regional visibility." },
          { title: "WordPress modernization", text: "Improve existing websites when WordPress remains the right solution." },
          { title: "Performance", text: "Fast loading times and stable mobile use as a technical foundation." },
          { title: "Support", text: "Ongoing maintenance, expansion and optimization after launch." },
          { title: "AI search", text: "Content structured so modern AI systems can better recognize relationships." },
        ]
      : [
          { title: "Веб-дизайн", text: "Современные сайты, которые выглядят профессионально и упрощают заявки." },
          { title: "SEO и Local SEO", text: "Структура, контент и сигналы локации для лучшей региональной видимости." },
          { title: "Модернизация WordPress", text: "Улучшение существующих сайтов, если WordPress остаётся подходящим решением." },
          { title: "Производительность", text: "Быстрая загрузка и стабильная мобильная работа как техническая база." },
          { title: "Поддержка", text: "Постоянный уход, расширение и оптимизация после запуска." },
          { title: "ИИ-поиск", text: "Контент структурирован так, чтобы ИИ-системы лучше распознавали связи." },
        ],
    technologyTitle: en ? "Technology follows the goal" : "Технология следует цели",
    technologyText: en
      ? "The right platform depends on the business goal. SaaleWeb can build modern Next.js and React websites, modernize WordPress websites or connect individual systems when that creates more value."
      : "Подходящая платформа зависит от бизнес-цели. SaaleWeb может создавать современные сайты на Next.js и React, модернизировать WordPress или подключать индивидуальные системы, если это даёт больше пользы.",
    processTitle: en ? "How regional visibility is created" : "Как создаётся региональная видимость",
    process: en
      ? [
          { title: "Analyze", text: "We review business goals, competitors, local searches and the current website." },
          { title: "Structure", text: "Services, locations, industries and trust elements are organized clearly." },
          { title: "Build", text: "Design, content, SEO and technology are implemented as one system." },
          { title: "Launch", text: "Performance, mobile UX, forms and indexability are checked before launch." },
          { title: "Improve", text: "Regional content and conversion paths can be expanded after launch." },
        ]
      : [
          { title: "Анализ", text: "Проверяем цели, конкурентов, локальные запросы и текущий сайт." },
          { title: "Структура", text: "Услуги, локации, отрасли и доверие выстраиваются понятно." },
          { title: "Создание", text: "Дизайн, контент, SEO и технология реализуются как одна система." },
          { title: "Запуск", text: "До запуска проверяем скорость, мобильность, формы и индексацию." },
          { title: "Улучшение", text: "Региональный контент и пути заявки можно расширять после запуска." },
        ],
    casesTitle: en ? "Relevant project examples" : "Подходящие примеры проектов",
    cases: SERVICE_CASES_BY_LOCALE[locale],
    relatedTitle: en ? "Nearby locations and next topics" : "Ближайшие локации и следующие темы",
    nearby: base.nearby.map((link) => {
      const targetSlug = link.href.split("/").pop() ?? "";
      return {
        label: link.label,
        href: locationPath(targetSlug),
        description: en ? "Nearby service area for regional visibility." : "Ближайшая зона работы для региональной видимости.",
      };
    }),
    relatedLinks: en
      ? [
          { label: "Web design Halle", href: "/en/services/web-design-halle", description: "Regional web design and clear user guidance." },
          { label: "SEO Halle", href: "/en/services/seo-halle", description: "Technical and local SEO for better visibility." },
          { label: "Get a website", href: "/en/services/website-development", description: "Plan a new website with strategy and SEO foundation." },
        ]
      : [
          { label: "Веб-дизайн Halle", href: "/ru/uslugi/webdesign-halle", description: "Региональный веб-дизайн и понятный пользовательский путь." },
          { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Техническое и локальное SEO для лучшей видимости." },
          { label: "Заказать сайт", href: "/ru/uslugi/razrabotka-saytov", description: "Спланировать новый сайт со стратегией и SEO-базой." },
        ],
    faq: en
      ? [
          {
            q: `Why is web design in ${city} important for local businesses?`,
            a: `Many customers check providers in ${city} online first. A clear website builds trust, explains services and makes the next contact easier.`,
          },
          {
            q: `Does SaaleWeb also support SEO in ${city}?`,
            a: `Yes. We connect technical SEO, local content, internal links and structured data so your business in ${city} can be classified more clearly.`,
          },
          {
            q: "Can an existing WordPress website be used further?",
            a: "Yes, when that is sensible. SaaleWeb can modernize, support or recommend a new technical foundation depending on the goal.",
          },
          {
            q: "Which industries does SaaleWeb support regionally?",
            a: "Typical projects include restaurants, hotels, beauty studios, trades, construction companies, glazing businesses and local service providers.",
          },
          {
            q: "Is collaboration possible remotely?",
            a: "Yes. Most coordination works efficiently online while keeping a clear regional focus.",
          },
          pricingFaq.en,
          {
            q: `Can my business in ${city} appear in AI answers?`,
            a: `The chances rise when services, the local context of ${city} and answers to customer questions are structured in machine-readable form. That is exactly the GEO/AIO base we build with FAQ sections and structured data — for Google and AI systems like ChatGPT, Gemini and Perplexity.`,
          },
          {
            q: "How does a regional website project start?",
            a: "With a free first consultation and a short analysis of goals, audience, current website and relevant local search terms.",
          },
        ]
      : [
          {
            q: `Почему веб-дизайн в ${city} важен для локального бизнеса?`,
            a: `Многие клиенты сначала проверяют компании в ${city} онлайн. Понятный сайт вызывает доверие, объясняет услуги и упрощает следующий контакт.`,
          },
          {
            q: `SaaleWeb помогает с SEO в ${city}?`,
            a: `Да. Мы соединяем техническое SEO, локальный контент, внутренние ссылки и структурированные данные, чтобы бизнес в ${city} был понятнее для поиска.`,
          },
          {
            q: "Можно дальше использовать существующий WordPress-сайт?",
            a: "Да, если это разумно. SaaleWeb может модернизировать, сопровождать или предложить новую техническую основу в зависимости от цели.",
          },
          {
            q: "С какими отраслями SaaleWeb работает в регионе?",
            a: "Типичные проекты: рестораны, отели, beauty-студии, ремесленные компании, строительство, Glaserei и локальные сервисы.",
          },
          {
            q: "Можно работать удалённо?",
            a: "Да. Большинство согласований удобно проводить онлайн, сохраняя региональный фокус.",
          },
          pricingFaq.ru,
          {
            q: `Может ли мой бизнес в ${city} попадать в ответы ИИ?`,
            a: `Шансы растут, когда услуги, привязка к ${city} и ответы на вопросы клиентов структурированы машиночитаемо. Именно такую GEO/AIO-базу мы строим с FAQ-блоками и структурированными данными — для Google и ИИ-систем вроде ChatGPT, Gemini и Perplexity.`,
          },
          {
            q: "Как начинается региональный проект сайта?",
            a: "С бесплатной консультации и короткого анализа целей, аудитории, текущего сайта и релевантных локальных запросов.",
          },
        ],
    finalTitle: en
      ? "Let’s check what is sensible for your business."
      : "Давайте проверим, что имеет смысл для вашего бизнеса.",
    finalText: en
      ? "In a free first consultation we clarify which solution fits your region, audience and current website."
      : "На бесплатной консультации уточним, какое решение подходит вашему региону, аудитории и текущему сайту.",
  };
}

export function getLocationPage(slug: string, locale: string = "de") {
  if (!isPhase4Locale(locale)) return null;
  return localizedLocationPage(slug, locale);
}

export function getLocationIndustries(locale: string = "de") {
  const l = isPhase4Locale(locale) ? locale : "de";
  return locationIndustriesByLocale[l];
}

export function getPhase4ServiceLinks(locale: string): Phase4Link[] {
  const l = isPhase4Locale(locale) ? locale : "de";
  return Object.keys(SERVICE_SLUGS)
    .map((canonical) => localizedServicePage(canonical, l))
    .filter((page): page is Phase4Landing => Boolean(page))
    .map((page) => ({
      label: page.navLabel ?? page.title.split(" – ")[0],
      href: serviceHref(l, page.slug),
      description: page.metaDescription,
    }));
}

export function getPhase4IndustryLinks(locale: string): Phase4Link[] {
  const l = isPhase4Locale(locale) ? locale : "de";
  return Object.keys(INDUSTRY_SLUGS)
    .map((canonical) => localizedIndustryPage(canonical, l))
    .filter((page): page is Phase4Landing => Boolean(page))
    .map((page) => ({
      label: page.navLabel ?? page.title.split(" – ")[0],
      href: industryHref(l, page.slug),
      description: page.metaDescription,
    }));
}

export function getPhase4LocationLinks(locale: string): Phase4Link[] {
  const l = isPhase4Locale(locale) ? locale : "de";
  return locationSlugs
    .map((slug) => localizedLocationPage(slug, l))
    .filter((page): page is Phase4Landing & { cityName: string; nearby: Phase4Link[] } => Boolean(page))
    .map((page) => ({
      label: page.cityName,
      href: locationHref(l, page.slug),
      description: page.metaDescription,
    }));
}

export function serviceHref(locale: Phase4Locale, slug: string) {
  if (locale === "en") return `/en/services/${slug}`;
  if (locale === "ru") return `/ru/uslugi/${slug}`;
  return `/leistungen/${slug}`;
}

export function industryHref(locale: Phase4Locale, slug: string) {
  if (locale === "en") return `/en/industries/${slug}`;
  if (locale === "ru") return `/ru/otrasli/${slug}`;
  return `/branchen/${slug}`;
}

export function locationHref(locale: Phase4Locale, slug: string) {
  if (locale === "en") return `/en/locations/${slug}`;
  if (locale === "ru") return `/ru/goroda/${slug}`;
  return `/standorte/${slug}`;
}

function isPhase4Locale(locale: string): locale is Phase4Locale {
  return locale === "de" || locale === "en" || locale === "ru";
}
