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

const defaultFinal = {
  finalTitle: "Lassen Sie uns prüfen, was für Ihr Unternehmen sinnvoll ist.",
  finalText:
    "In einem kostenlosen Erstgespräch klären wir, welche Lösung zu Ihrer Situation passt und welche nächsten Schritte realistisch sind.",
};

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
    {
      q: "Wie starten wir am besten?",
      a: "Am sinnvollsten ist ein kurzes Erstgespräch. Danach können wir einschätzen, ob Analyse, Konzept, Relaunch, Optimierung oder laufende Betreuung der beste nächste Schritt ist.",
    },
  ].slice(0, Math.max(6, extra.length + 4));
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
      label: "Glaserei Schubert",
      href: "/projekte/glaserei-schubert",
      description: "Lokale Sichtbarkeit und vertrauensbildende Projektstruktur für einen regionalen Fachbetrieb.",
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

export const seoServicePages: Record<string, Phase4Landing> = {
  "website-erstellen-lassen": {
    slug: "website-erstellen-lassen",
    eyebrow: "Leistung",
    title: "Website erstellen lassen – klar geplant, schnell gebaut und auf Anfragen ausgelegt",
    metaTitle: "Website erstellen lassen | SaaleWeb",
    metaDescription:
      "Website erstellen lassen mit SaaleWeb: moderne Technik, klare Struktur, SEO, schnelle Ladezeiten und eine Website, die Vertrauen und Anfragen erzeugt.",
    lead: [
      "Eine gute Website ist heute mehr als eine digitale Visitenkarte. Sie muss erklären, Vertrauen aufbauen, bei Google gefunden werden und Besucher sicher zur Anfrage führen.",
      "SaaleWeb entwickelt Websites für Unternehmen, die online professioneller auftreten und planbar mehr qualifizierte Kontakte gewinnen möchten.",
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
    solutionTitle: "Wie SaaleWeb hilft",
    solution: [
      "Wir verbinden Strategie, Design, Entwicklung und SEO zu einem klaren digitalen System. Die Website wird so aufgebaut, dass Nutzer schnell verstehen, was Sie anbieten und warum Ihr Unternehmen vertrauenswürdig ist.",
      "Dabei achten wir auf schnelle Ladezeiten, saubere Technik, mobile Nutzerführung, verständliche Texte und Inhalte, die auch von Suchmaschinen und KI-Systemen besser eingeordnet werden können.",
    ],
    featuresTitle: "Was eine SaaleWeb Website leisten soll",
    features: [
      { title: "Klare Positionierung", text: "Ihre Leistungen werden verständlich erklärt und auf konkrete Kundenprobleme bezogen." },
      { title: "Conversion-Struktur", text: "Anfragewege, CTA-Bereiche und Vertrauenselemente sind logisch platziert." },
      { title: "SEO-Basis", text: "Technik, Metadaten, Überschriften, interne Links und Inhalte werden sauber aufgebaut." },
      { title: "Mobile Qualität", text: "Die Website ist für Smartphone-Nutzer schnell, lesbar und einfach bedienbar." },
      { title: "Pflegbare Inhalte", text: "Je nach Projekt erhalten Sie eine Lösung, die langfristig wartbar bleibt." },
      { title: "KI-Verständlichkeit", text: "Inhalte werden semantisch strukturiert, damit moderne Suchsysteme Zusammenhänge besser erkennen." },
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
        q: "Was kostet es, eine Website erstellen zu lassen?",
        a: "Das hängt von Umfang, Inhalt, Funktionen und Betreuung ab. SaaleWeb arbeitet mit transparenten Festpreisen, sobald Ziele und Anforderungen klar sind.",
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
    title: "Webdesign Halle – digitale Lösungen für mehr Sichtbarkeit und Anfragen",
    metaTitle: "Webdesign Halle | SaaleWeb",
    metaDescription:
      "Webdesign Halle für Unternehmen: moderne Websites, Local SEO, klare Nutzerführung und technische Qualität für mehr Vertrauen und qualifizierte Anfragen.",
    lead: [
      "Unternehmen in Halle konkurrieren heute nicht nur über Empfehlungen, sondern auch über Google, mobile Suche und den ersten digitalen Eindruck.",
      "SaaleWeb entwickelt Webdesign für Halle, das professionell aussieht, verständlich verkauft und lokale Sichtbarkeit gezielt unterstützt.",
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
        a: "SaaleWeb ist ein digitales Studio mit Fokus auf Halle, Leipzig und die umliegende Region. Der Schwerpunkt liegt auf Websites, SEO, Local SEO und KI-Sichtbarkeit für Unternehmen.",
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

const SERVICE_SLUGS: Record<string, Phase4SlugMap> = {
  "website-erstellen-lassen": {
    de: "website-erstellen-lassen",
    en: "get-a-website",
    ru: "zakazat-sajt",
  },
  "webdesign-halle": {
    de: "webdesign-halle",
    en: "web-design-halle",
    ru: "veb-dizajn-halle",
  },
  "seo-halle": {
    de: "seo-halle",
    en: "seo-halle",
    ru: "seo-halle",
  },
  "ki-optimierung": {
    de: "ki-optimierung",
    en: "ai-optimization",
    ru: "optimizaciya-pod-ii",
  },
  "wordpress-website-modernisieren": {
    de: "wordpress-website-modernisieren",
    en: "modernize-wordpress-website",
    ru: "modernizaciya-wordpress-sajta",
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
    ru: "podderzhka-sajta",
  },
  buchungssysteme: {
    de: "buchungssysteme",
    en: "booking-systems",
    ru: "sistemy-bronirovaniya",
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
    title: "Get a website built – clear strategy, fast technology and a structure that creates inquiries",
    metaTitle: "Get a website built | SaaleWeb",
    metaDescription:
      "Get a professional website built with SaaleWeb: strategy, SEO foundation, fast loading times, clear UX and a structure designed for trust and inquiries.",
    lead: [
      "A good website is no longer just an online brochure. It needs to explain your offer, create trust and guide visitors toward the next step.",
      "SaaleWeb builds websites for businesses that want a professional digital presence and a reliable foundation for visibility, inquiries and long-term growth.",
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
      { title: "SEO foundation", text: "Metadata, headings, internal links and structured content are built in from the start." },
      { title: "Mobile quality", text: "The website stays fast, readable and easy to use on smartphones." },
      { title: "Maintainable setup", text: "The technical solution remains practical for updates and future growth." },
      { title: "AI readability", text: "Content is structured so modern search systems can understand entities and relationships." },
    ],
    related: [
      { label: "Web design Halle", href: "/en/services/web-design-halle", description: "Regional web design for businesses in Halle." },
      { label: "SEO Halle", href: "/en/services/seo-halle", description: "Search visibility for local and commercial queries." },
      { label: "Modernize WordPress website", href: "/en/services/modernize-wordpress-website", description: "Improve existing WordPress sites without replacing them blindly." },
      { label: "Projects", href: "/en/projects", description: "Selected SaaleWeb case studies." },
    ],
  },
  "webdesign-halle": {
    navLabel: "Web design Halle",
    title: "Web design Halle – digital solutions for more visibility, trust and inquiries",
    metaTitle: "Web design Halle | SaaleWeb",
    metaDescription:
      "Web design Halle for businesses: modern websites, Local SEO, clear user guidance and technical quality for more trust and qualified inquiries.",
    lead: [
      "Businesses in Halle compete not only through recommendations, but also through Google, mobile search and the first digital impression.",
      "SaaleWeb creates web design for Halle that looks professional, explains clearly and supports local visibility.",
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
      { title: "Growth foundation", text: "The site can later be expanded with SEO, landing pages, booking systems or content." },
    ],
    related: [
      { label: "SEO Halle", href: "/en/services/seo-halle", description: "Improve visibility in local search." },
      { label: "Get a website", href: "/en/services/get-a-website", description: "Plan a new website with strategy and SEO." },
      { label: "Leipzig", href: "/en/locations/leipzig", description: "Visibility in the wider regional market." },
      { label: "Projects", href: "/en/projects", description: "Selected practical examples." },
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
      { label: "Website analysis", href: "/en/#website-audit", description: "Request a free review of your current website." },
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
      { label: "Get a website", href: "/en/services/get-a-website", description: "A new site with a clear content architecture." },
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
      { label: "Get a website", href: "/en/services/get-a-website", description: "When a complete rebuild makes sense." },
      { label: "Modernize WordPress", href: "/en/services/modernize-wordpress-website", description: "When existing WordPress structures should remain." },
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
      { label: "Website audit", href: "/en/#website-audit", description: "Request a free analysis of your current website." },
      { label: "SEO Halle", href: "/en/services/seo-halle", description: "Performance as part of technical SEO." },
      { label: "Modernize WordPress", href: "/en/services/modernize-wordpress-website", description: "Solve WordPress performance problems." },
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
      { label: "Modernize WordPress", href: "/en/services/modernize-wordpress-website", description: "Keep older WordPress systems clean and useful." },
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
      { label: "Get a website", href: "/en/services/get-a-website", description: "Integrate booking directly into a new website." },
      { label: "Contact", href: "/en/contact", description: "Discuss the booking process." },
    ],
  },
};

const RU_SERVICE_SEEDS: Record<string, LocalizedServiceSeed> = {
  "website-erstellen-lassen": {
    navLabel: "Заказать сайт",
    title: "Заказать сайт – понятная стратегия, быстрая технология и структура под заявки",
    metaTitle: "Заказать сайт | SaaleWeb",
    metaDescription:
      "Заказать профессиональный сайт в SaaleWeb: стратегия, SEO-база, быстрая загрузка, понятная структура и фокус на доверие и заявки.",
    lead: [
      "Хороший сайт сегодня — не просто онлайн-визитка. Он должен объяснять предложение, вызывать доверие и вести посетителя к следующему шагу.",
      "SaaleWeb создаёт сайты для компаний, которым нужно профессиональное цифровое присутствие, видимость и больше качественных заявок.",
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
      { title: "SEO-база", text: "Метаданные, заголовки, внутренние ссылки и контент строятся с самого начала." },
      { title: "Мобильное качество", text: "Сайт остаётся быстрым, читаемым и удобным на смартфоне." },
      { title: "Поддерживаемая основа", text: "Техническое решение остаётся пригодным для обновлений и роста." },
      { title: "Понятно для ИИ", text: "Контент структурирован так, чтобы системы поиска лучше понимали связи." },
    ],
    related: [
      { label: "Веб-дизайн Halle", href: "/ru/uslugi/veb-dizajn-halle", description: "Региональные сайты для компаний в Halle." },
      { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Видимость по локальным и коммерческим запросам." },
      { label: "Модернизация WordPress", href: "/ru/uslugi/modernizaciya-wordpress-sajta", description: "Улучшить текущий WordPress без слепой замены." },
      { label: "Проекты", href: "/ru/proekty", description: "Избранные кейсы SaaleWeb." },
    ],
  },
  "webdesign-halle": {
    navLabel: "Веб-дизайн Halle",
    title: "Веб-дизайн Halle – цифровые решения для видимости, доверия и заявок",
    metaTitle: "Веб-дизайн Halle | SaaleWeb",
    metaDescription:
      "Веб-дизайн Halle для компаний: современные сайты, Local SEO, понятная навигация и техническое качество для доверия и заявок.",
    lead: [
      "Компании в Halle конкурируют не только рекомендациями, но и через Google, мобильный поиск и первое цифровое впечатление.",
      "SaaleWeb создаёт веб-дизайн для Halle, который выглядит профессионально, понятно объясняет предложение и поддерживает локальную видимость.",
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
      { title: "Основа для роста", text: "Сайт можно расширять SEO-страницами, контентом и системами бронирования." },
    ],
    related: [
      { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Улучшить видимость в локальном поиске." },
      { label: "Заказать сайт", href: "/ru/uslugi/zakazat-sajt", description: "Новый сайт со стратегией и SEO." },
      { label: "Leipzig", href: "/ru/lokacii/leipzig", description: "Видимость в более широком региональном рынке." },
      { label: "Проекты", href: "/ru/proekty", description: "Практические примеры." },
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
      { label: "Веб-дизайн Halle", href: "/ru/uslugi/veb-dizajn-halle", description: "Думать сайт и SEO вместе." },
      { label: "Local SEO", href: "/ru/uslugi/local-seo", description: "Региональная видимость для локальных компаний." },
      { label: "Производительность", href: "/ru/uslugi/optimizaciya-proizvoditelnosti", description: "Скорость как основа технического SEO." },
      { label: "Анализ сайта", href: "/ru/#website-audit", description: "Бесплатная проверка текущего сайта." },
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
      { label: "Заказать сайт", href: "/ru/uslugi/zakazat-sajt", description: "Новый сайт с понятной архитектурой контента." },
      { label: "Local SEO", href: "/ru/uslugi/local-seo", description: "Региональные сущности и локальные сигналы." },
      { label: "Контакты", href: "/ru/kontakty", description: "Обсудить готовность к ИИ-поиску." },
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
      { label: "Поддержка сайта", href: "/ru/uslugi/podderzhka-sajta", description: "Регулярный уход и техническая поддержка." },
      { label: "Контакты", href: "/ru/kontakty", description: "Проверить ваш WordPress-сайт." },
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
      { label: "Заказать сайт", href: "/ru/uslugi/zakazat-sajt", description: "Когда нужен полный новый сайт." },
      { label: "Модернизация WordPress", href: "/ru/uslugi/modernizaciya-wordpress-sajta", description: "Если WordPress-структуру стоит сохранить." },
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
      { label: "Анализ сайта", href: "/ru/#website-audit", description: "Бесплатная проверка текущего сайта." },
      { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Скорость как часть технического SEO." },
      { label: "Модернизация WordPress", href: "/ru/uslugi/modernizaciya-wordpress-sajta", description: "Решить проблемы скорости в WordPress." },
      { label: "Контакты", href: "/ru/kontakty", description: "Обсудить проблемы скорости." },
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
      { label: "Модернизация WordPress", href: "/ru/uslugi/modernizaciya-wordpress-sajta", description: "Чисто вести старые WordPress-системы." },
      { label: "Производительность", href: "/ru/uslugi/optimizaciya-proizvoditelnosti", description: "Улучшить скорость и стабильность." },
      { label: "Релонч сайта", href: "/ru/uslugi/relonch-sajta", description: "Когда поддержки уже недостаточно." },
      { label: "Контакты", href: "/ru/kontakty", description: "Обсудить сопровождение." },
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
      { label: "Сайт ресторана", href: "/ru/otrasli/sajt-restorana", description: "Больше резерваций и понятная подача меню." },
      { label: "Сайт отеля", href: "/ru/otrasli/sajt-otelya", description: "Прямые брони и меньше зависимости от порталов." },
      { label: "Заказать сайт", href: "/ru/uslugi/zakazat-sajt", description: "Встроить бронирование сразу в новый сайт." },
      { label: "Контакты", href: "/ru/kontakty", description: "Обсудить процесс бронирования." },
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
      label: "Glaserei Schubert",
      href: "/en/projects/glaserei-schubert",
      description: "Local specialist business with clear structure and digital trust building.",
    },
  ],
  ru: [
    {
      label: "Neue Liebe Nebra",
      href: "/ru/proekty/neue-liebe-nebra",
      description: "Сайт ресторана с фокусом на бронирование, меню, Local SEO и адаптивную подачу.",
    },
    {
      label: "Glaserei Schubert",
      href: "/ru/proekty/glaserei-schubert",
      description: "Локальная ремесленная компания с понятной структурой и цифровым доверием.",
    },
  ],
};

function localizedServicePage(canonicalSlug: string, locale: Phase4Locale): Phase4Landing | null {
  if (locale === "de") {
    const page = seoServicePages[canonicalSlug];
    return page ? { ...page, navLabel: page.navLabel ?? page.title.split(" – ")[0] } : null;
  }

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
  return (
    Object.entries(SERVICE_SLUGS).find(([, slugs]) => slugs[locale] === slug)?.[0] ?? null
  );
}

export const seoServiceSlugs = Object.keys(seoServicePages);

export function getSeoServiceStaticParams() {
  return Object.values(SERVICE_SLUGS).flatMap((slugs) =>
    (Object.entries(slugs) as [Phase4Locale, string][]).map(([locale, slug]) => ({ locale, slug })),
  );
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
    {
      q: "Wie läuft der Start ab?",
      a: "Wir beginnen mit einem kostenlosen Gespräch, prüfen Ziele und aktuelle Website und schlagen dann eine realistische Vorgehensweise vor.",
    },
  ].slice(0, Math.max(6, extra.length + 4));
}

export const seoIndustryPages: Record<string, Phase4Landing> = {
  "restaurant-website": {
    slug: "restaurant-website",
    eyebrow: "Branche",
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
    process: serviceProcess,
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
    eyebrow: "Branche",
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
    process: serviceProcess,
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
    eyebrow: "Branche",
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
    process: serviceProcess,
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
    eyebrow: "Branche",
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
    process: serviceProcess,
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
    eyebrow: "Branche",
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
    process: serviceProcess,
    casesTitle: "Passende Projektbeispiele",
    cases: serviceCases.local,
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
    eyebrow: "Branche",
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
    process: serviceProcess,
    casesTitle: "Passendes Projektbeispiel",
    cases: [
      {
        label: "Glaserei Schubert",
        href: "/projekte/glaserei-schubert",
        description: "Fallstudie für lokale Fachkompetenz, klare Projektstruktur und digitale Vertrauensbildung.",
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
};

const INDUSTRY_SLUGS: Record<string, Phase4SlugMap> = {
  "restaurant-website": {
    de: "restaurant-website",
    en: "restaurant-website",
    ru: "sajt-restorana",
  },
  "hotel-website": {
    de: "hotel-website",
    en: "hotel-website",
    ru: "sajt-otelya",
  },
  "beauty-studio-website": {
    de: "beauty-studio-website",
    en: "beauty-studio-website",
    ru: "sajt-beauty-studii",
  },
  "bauunternehmen-website": {
    de: "bauunternehmen-website",
    en: "construction-company-website",
    ru: "sajt-stroitelnoj-kompanii",
  },
  "handwerker-website": {
    de: "handwerker-website",
    en: "tradesman-website",
    ru: "sajt-remeslennika",
  },
  "glaserei-website": {
    de: "glaserei-website",
    en: "glazing-company-website",
    ru: "sajt-glaserei",
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
      { label: "Get a website", href: "/en/services/get-a-website", description: "Plan a new site for a studio or salon." },
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
      { label: "Get a website", href: "/en/services/get-a-website", description: "A new website for complex services." },
      { label: "SEO Halle", href: "/en/services/seo-halle", description: "Regional visibility for construction services." },
      { label: "Tradesman website", href: "/en/industries/tradesman-website", description: "Related needs in skilled trades." },
      { label: "Contact", href: "/en/contact", description: "Discuss a construction website." },
    ],
  },
  "handwerker-website": {
    navLabel: "Tradesman website",
    title: "Website for tradesmen – locally visible and trustworthy",
    metaTitle: "Tradesman website | SaaleWeb",
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
      { label: "Glazing company website", href: "/en/industries/glazing-company-website", description: "Specialized requirements for glazing companies." },
      { label: "Local SEO", href: "/en/services/local-seo", description: "Get found in your service area." },
      { label: "Website maintenance", href: "/en/services/website-maintenance", description: "Keep the website current long term." },
      { label: "Contact", href: "/en/contact", description: "Discuss a trades website." },
    ],
  },
  "glaserei-website": {
    navLabel: "Glazing company website",
    title: "Website for glazing companies – show quality, references and specialist services clearly",
    metaTitle: "Glazing company website | SaaleWeb",
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
      { label: "Tradesman website", href: "/en/industries/tradesman-website", description: "Digital basics for regional trades businesses." },
      { label: "SEO Halle", href: "/en/services/seo-halle", description: "Visibility for local specialist services." },
      { label: "Get a website", href: "/en/services/get-a-website", description: "Plan a new website with clear structure." },
      { label: "Contact", href: "/en/contact", description: "Discuss a glazing company website." },
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
      { label: "Контакты", href: "/ru/kontakty", description: "Обсудить сайт ресторана." },
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
      { label: "Контакты", href: "/ru/kontakty", description: "Обсудить сайт отеля." },
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
      { label: "Заказать сайт", href: "/ru/uslugi/zakazat-sajt", description: "Спланировать новый сайт для студии." },
      { label: "Контакты", href: "/ru/kontakty", description: "Обсудить сайт beauty-студии." },
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
      { label: "Заказать сайт", href: "/ru/uslugi/zakazat-sajt", description: "Новый сайт для сложных услуг." },
      { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Региональная видимость строительных услуг." },
      { label: "Сайт ремесленника", href: "/ru/otrasli/sajt-remeslennika", description: "Похожие задачи в ремесленных сферах." },
      { label: "Контакты", href: "/ru/kontakty", description: "Обсудить сайт строительной компании." },
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
      { label: "Сайт Glaserei", href: "/ru/otrasli/sajt-glaserei", description: "Специализированные задачи для стекольных компаний." },
      { label: "Local SEO", href: "/ru/uslugi/local-seo", description: "Быть заметнее в зоне работы." },
      { label: "Поддержка сайта", href: "/ru/uslugi/podderzhka-sajta", description: "Держать сайт актуальным долгосрочно." },
      { label: "Контакты", href: "/ru/kontakty", description: "Обсудить сайт ремесленной компании." },
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
      { label: "Сайт ремесленника", href: "/ru/otrasli/sajt-remeslennika", description: "Цифровая база для локальных ремесленных компаний." },
      { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Видимость для локальных специальных услуг." },
      { label: "Заказать сайт", href: "/ru/uslugi/zakazat-sajt", description: "Спланировать сайт с понятной структурой." },
      { label: "Контакты", href: "/ru/kontakty", description: "Обсудить сайт Glaserei." },
    ],
  }),
};

function localizedIndustryPage(canonicalSlug: string, locale: Phase4Locale): Phase4Landing | null {
  if (locale === "de") {
    const page = seoIndustryPages[canonicalSlug];
    return page ? { ...page, navLabel: page.navLabel ?? page.title.split(" – ")[0] } : null;
  }

  const seed = (locale === "en" ? EN_INDUSTRY_SEEDS : RU_INDUSTRY_SEEDS)[canonicalSlug];
  const slug = INDUSTRY_SLUGS[canonicalSlug]?.[locale];
  if (!seed || !slug) return null;

  const en = locale === "en";
  return {
    slug,
    navLabel: seed.navLabel,
    eyebrow: en ? "Industry" : "Отрасль",
    title: seed.title,
    metaTitle: seed.metaTitle,
    metaDescription: seed.metaDescription,
    lead: seed.lead,
    problemTitle: en ? "Typical industry challenges" : "Типичные задачи отрасли",
    problems: seed.problems,
    solutionTitle: en ? "How SaaleWeb supports this industry" : "Как SaaleWeb помогает этой отрасли",
    solution: seed.solution,
    featuresTitle: en ? "Relevant website features" : "Важные функции сайта",
    features: seed.features,
    technologyTitle: en ? "The right technology for the business goal" : "Правильная технология под бизнес-цель",
    technologyText: en
      ? "We do not position SaaleWeb as only a Next.js or only a WordPress agency. The technology follows the goal: modern Next.js and React platforms, professionally supported WordPress websites or custom integrations are selected based on business value."
      : "SaaleWeb — не только Next.js- и не только WordPress-агентство. Технология следует цели: современные платформы Next.js и React, профессионально сопровождаемые WordPress-сайты или индивидуальные интеграции выбираются по пользе для бизнеса.",
    processTitle: en ? "From industry context to inquiry-ready website" : "От отраслевого контекста к сайту, готовому к заявкам",
    process: en
      ? [
          { title: "Understand", text: "We review the industry, customer questions and existing digital presence." },
          { title: "Structure", text: "Services, trust signals, region and inquiry paths are organized clearly." },
          { title: "Build", text: "Design, content, SEO and technical implementation are connected." },
          { title: "Launch", text: "The page is checked for performance, mobile use, forms and indexability." },
          { title: "Improve", text: "Content, links and conversion points can be improved after launch." },
        ]
      : [
          { title: "Понять", text: "Изучаем отрасль, вопросы клиентов и текущее цифровое присутствие." },
          { title: "Структурировать", text: "Услуги, доверие, регион и путь заявки выстраиваются понятно." },
          { title: "Создать", text: "Соединяем дизайн, контент, SEO и техническую реализацию." },
          { title: "Запустить", text: "Проверяем скорость, мобильность, формы и индексацию." },
          { title: "Улучшать", text: "После запуска можно усиливать контент, ссылки и конверсию." },
        ],
    casesTitle: en ? "Relevant project examples" : "Подходящие примеры проектов",
    cases: seed.cases ?? SERVICE_CASES_BY_LOCALE[locale],
    relatedTitle: en ? "Useful related pages" : "Полезные связанные страницы",
    relatedLinks: seed.related,
    faq: en
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
          {
            q: "Как начать?",
            a: "Начинаем с бесплатного разговора, проверяем цели и текущий сайт, затем предлагаем реалистичный следующий шаг.",
          },
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
  return Object.entries(INDUSTRY_SLUGS).find(([, slugs]) => slugs[locale] === slug)?.[0] ?? null;
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
    metaTitle: "Webdesign Halle (Saale) & SEO | SaaleWeb",
    metaDescription:
      "Webdesign Halle (Saale), SEO Halle und moderne Websites für lokale Unternehmen: SaaleWeb entwickelt digitale Systeme für Sichtbarkeit, Vertrauen und Anfragen.",
    lead: [
      "Halle ist für SaaleWeb der wichtigste regionale Bezugspunkt. Viele Unternehmen hier haben starke Leistungen, aber eine Website, die diese Stärke online nicht klar genug zeigt.",
      "Wir entwickeln Websites, SEO-Strukturen und Inhalte, die lokale Kunden schneller verstehen und Suchsysteme besser einordnen können.",
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
    solutionTitle: "SaaleWeb Lösung für Halle",
    solution: [
      "Wir verbinden Webdesign Halle, SEO Halle, Local SEO und klare Conversion-Struktur. Die Website soll nicht nur gut aussehen, sondern verständlich verkaufen und Vertrauen aufbauen.",
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
  if (locale === "de") return base;

  const en = locale === "en";
  const city = base.cityName;
  const locationPath = (targetSlug: string) =>
    locale === "en" ? `/en/locations/${targetSlug}` : `/ru/lokacii/${targetSlug}`;

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
          { label: "Get a website", href: "/en/services/get-a-website", description: "Plan a new website with strategy and SEO foundation." },
        ]
      : [
          { label: "Веб-дизайн Halle", href: "/ru/uslugi/veb-dizajn-halle", description: "Региональный веб-дизайн и понятный пользовательский путь." },
          { label: "SEO Halle", href: "/ru/uslugi/seo-halle", description: "Техническое и локальное SEO для лучшей видимости." },
          { label: "Заказать сайт", href: "/ru/uslugi/zakazat-sajt", description: "Спланировать новый сайт со стратегией и SEO-базой." },
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
  if (locale === "ru") return `/ru/lokacii/${slug}`;
  return `/standorte/${slug}`;
}

function isPhase4Locale(locale: string): locale is Phase4Locale {
  return locale === "de" || locale === "en" || locale === "ru";
}
