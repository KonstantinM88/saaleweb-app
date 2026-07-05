/**
 * Rich, plain-language sales content for each service detail page, keyed by
 * a canonical service key resolved from the slug. Three locales. When a
 * service has no DB `content`, this guarantees the page is a full landing
 * page rather than a stub; DB `content` (if present) is shown additionally.
 */

export type ServiceBlock = {
  // hero
  tagline: string;
  // problem -> solution
  problemTitle: string;
  problem: string;
  solutionTitle: string;
  solution: string;
  // what's included
  includesTitle: string;
  includes: { title: string; desc: string }[];
  // outcomes (short, benefit-led)
  outcomesTitle: string;
  outcomes: string[];
  // mini FAQ
  faq: { q: string; a: string }[];
};

type Locale = "de" | "en" | "ru";

// Map a (locale) slug to a canonical content key.
const SLUG_KEYS: { key: string; match: string[] }[] = [
  { key: "local", match: ["local-seo", "lokales-seo", "lokalnoe-seo", "local"] },
  { key: "ai", match: ["ki-integration", "ai-integration", "ai-integraciya", "integraciya-ii", "ki", "-ai-", "integration"] },
  { key: "relaunch", match: ["website-relaunch", "relaunch", "redesign", "redizajn", "relonch-sajta"] },
  { key: "performance", match: ["performance", "speed", "tempo", "skorost", "proizvoditelnost"] },
  { key: "hosting", match: ["hosting", "hosting-wartung"] },
  { key: "care", match: ["wartung", "maintenance", "support", "podderzhka", "obsluzhivanie"] },
  { key: "consult", match: ["digitalberatung", "digital-consulting", "consulting", "beratung", "konsultaciya", "cifrovoj-konsalting"] },
  { key: "seo", match: ["seo-optimierung", "seo-optimization", "seo-optimizaciya", "seo"] },
  { key: "web", match: ["website-entwicklung", "web-development", "razrabotka-sajtov", "web", "entwicklung", "development", "sajt"] },
];

export function serviceKeyFromSlug(slug: string): string {
  const s = `-${slug.toLowerCase()}-`;
  const hit = SLUG_KEYS.find((k) => k.match.some((m) => s.includes(m)));
  return hit?.key ?? "web";
}

// ---------------------------------------------------------------------------
// Content. Kept compact but genuinely useful; written for non-technical owners.
// ---------------------------------------------------------------------------
const CONTENT: Record<string, Record<Locale, ServiceBlock>> = {
  web: {
    de: {
      tagline: "Eine Website, die Ihr Unternehmen verkauft — Tag und Nacht.",
      problemTitle: "Kennen Sie das?",
      problem:
        "Viele Websites sehen nett aus, bringen aber keine Anfragen: Sie laden langsam, wirken auf dem Handy unübersichtlich und niemand findet sie bei Google. So gehen jeden Monat Kunden an den Wettbewerb verloren.",
      solutionTitle: "Unsere Lösung",
      solution:
        "Wir bauen eine moderne, blitzschnelle Website, die auf jedem Gerät perfekt aussieht und gezielt zu Anfragen führt. Klare Struktur, überzeugende Texte und sichtbare Kontaktwege — damit aus Besuchern echte Kunden werden.",
      includesTitle: "Das ist alles dabei",
      includes: [
        { title: "Individuelles Design", desc: "Passend zu Ihrer Marke — kein Baukasten-Look von der Stange." },
        { title: "Perfekt auf dem Handy", desc: "Über die Hälfte Ihrer Besucher kommt vom Smartphone. Dort sieht alles top aus." },
        { title: "Für Google gebaut", desc: "Saubere Technik und Inhalte, damit Sie gefunden werden." },
        { title: "Eigener Admin-Bereich", desc: "Texte, Bilder und Beiträge ändern Sie später selbst — ganz einfach." },
      ],
      outcomesTitle: "Das bringt es Ihnen",
      outcomes: ["Mehr Anfragen über Ihre Seite", "Professioneller erster Eindruck", "Unabhängig von Agenturen pflegbar"],
      faq: [
        { q: "Wie lange dauert es?", a: "Die meisten Seiten sind in 3 bis 6 Wochen online. Das Tempo hängt vor allem von Ihren Inhalten ab — dabei helfen wir aktiv." },
        { q: "Kann ich Texte später selbst ändern?", a: "Ja. Sie bekommen einen einfachen Admin-Bereich und ändern Inhalte ohne technisches Wissen." },
        { q: "Gehört die Seite mir?", a: "Zu 100 %. Code, Inhalte und Domain gehören Ihnen — keine versteckten Gebühren." },
        { q: "Was kostet eine neue Website?", a: "Zur Orientierung: Ein kompakter WordPress-Onepager startet ab 600 €, eine moderne Landingpage ab 990 €, eine vollständige Unternehmenswebsite ab 1.990 €. Den genauen Festpreis klären wir im kostenlosen Erstgespräch." },
        { q: "Ist die Website auch für KI-Suche vorbereitet?", a: "Ja. Wir strukturieren Leistungen, Region und Antworten auf Kundenfragen maschinenlesbar — mit FAQ-Bereichen und strukturierten Daten (GEO/AIO). So können ChatGPT, Gemini, Claude und Perplexity Ihr Unternehmen einordnen und nennen." },
        { q: "Geht die Website auch mehrsprachig?", a: "Ja. Deutsch, Englisch und Russisch gehören zur Basis, weitere Sprachen auf Anfrage. Jede Sprachversion erhält eigene URLs und saubere hreflang-Verknüpfungen." },
      ],
    },
    en: {
      tagline: "A website that sells your business — day and night.",
      problemTitle: "Sound familiar?",
      problem:
        "Many websites look nice but bring no enquiries: they load slowly, feel cluttered on mobile and nobody finds them on Google. Every month customers go to the competition instead.",
      solutionTitle: "Our solution",
      solution:
        "We build a modern, lightning-fast website that looks perfect on every device and guides visitors to get in touch. Clear structure, convincing copy and visible contact paths — so visitors become real customers.",
      includesTitle: "Everything included",
      includes: [
        { title: "Custom design", desc: "Tailored to your brand — no off-the-shelf builder look." },
        { title: "Perfect on mobile", desc: "Over half your visitors come from a phone. There everything looks great." },
        { title: "Built for Google", desc: "Clean tech and content so you get found." },
        { title: "Your own admin area", desc: "Change texts, images and posts yourself later — easily." },
      ],
      outcomesTitle: "What you get",
      outcomes: ["More enquiries through your site", "A professional first impression", "Editable without an agency"],
      faq: [
        { q: "How long does it take?", a: "Most sites go live in 3 to 6 weeks. The pace mainly depends on your content — and we actively help." },
        { q: "Can I edit texts myself later?", a: "Yes. You get a simple admin area and change content with no technical knowledge." },
        { q: "Does the site belong to me?", a: "100 %. Code, content and domain are yours — no hidden fees." },
        { q: "What does a new website cost?", a: "For orientation: a compact WordPress one-pager starts at €600, a modern landing page at €990, a full company website at €1,990. The exact fixed price is clarified in the free initial call." },
        { q: "Is the website prepared for AI search too?", a: "Yes. We structure services, region and answers to customer questions in machine-readable form — with FAQ sections and structured data (GEO/AIO). That helps ChatGPT, Gemini, Claude and Perplexity classify and mention your business." },
        { q: "Can the website be multilingual?", a: "Yes. German, English and Russian are part of the base setup, further languages on request. Each language version gets its own URLs and clean hreflang links." },
      ],
    },
    ru: {
      tagline: "Сайт, который продаёт ваш бизнес — днём и ночью.",
      problemTitle: "Знакомо?",
      problem:
        "Многие сайты выглядят неплохо, но не приносят заявок: медленно грузятся, неудобны на телефоне, и их не находят в Google. Каждый месяц клиенты уходят к конкурентам.",
      solutionTitle: "Наше решение",
      solution:
        "Мы делаем современный, молниеносный сайт, который идеально смотрится на любом устройстве и ведёт посетителя к заявке. Чёткая структура, убедительные тексты и заметные кнопки контакта — чтобы посетители становились клиентами.",
      includesTitle: "Всё включено",
      includes: [
        { title: "Индивидуальный дизайн", desc: "Под ваш бренд — без шаблонного вида конструктора." },
        { title: "Идеально на телефоне", desc: "Больше половины посетителей — со смартфона. Там всё выглядит отлично." },
        { title: "Сделано под Google", desc: "Чистая техника и контент, чтобы вас находили." },
        { title: "Своя админ-панель", desc: "Тексты, фото и статьи меняете сами — легко." },
      ],
      outcomesTitle: "Что вы получаете",
      outcomes: ["Больше заявок через сайт", "Профессиональное первое впечатление", "Правки без агентства"],
      faq: [
        { q: "Сколько занимает?", a: "Большинство сайтов выходят за 3–6 недель. Темп зависит в основном от контента — мы активно помогаем." },
        { q: "Смогу сам менять тексты?", a: "Да. Вы получаете простую админ-панель и меняете контент без технических знаний." },
        { q: "Сайт принадлежит мне?", a: "На 100 %. Код, контент и домен — ваши, без скрытых платежей." },
        { q: "Сколько стоит новый сайт?", a: "Для ориентира: компактный WordPress one-pager — от 600 €, современный лендинг — от 990 €, полноценный корпоративный сайт — от 1 990 €. Точную фикс-цену уточняем на бесплатной консультации." },
        { q: "Сайт будет готов к ИИ-поиску?", a: "Да. Мы структурируем услуги, регион и ответы на вопросы клиентов машиночитаемо — с FAQ-блоками и структурированными данными (GEO/AIO). Так ChatGPT, Gemini, Claude и Perplexity понимают и называют ваш бизнес." },
        { q: "Можно сделать сайт многоязычным?", a: "Да. Немецкий, английский и русский входят в базу, другие языки — по запросу. Каждая языковая версия получает собственные URL и корректные hreflang-связи." },
      ],
    },
  },

  seo: {
    de: {
      tagline: "Ganz oben bei Google — genau dort, wo Ihre Kunden suchen.",
      problemTitle: "Das Problem",
      problem:
        "Wenn Sie bei Google nicht auf Seite 1 stehen, existieren Sie für die meisten Kunden nicht. Wer Sie nicht findet, kann Sie nicht beauftragen — und Anzeigen kosten dauerhaft Geld.",
      solutionTitle: "Unsere Lösung",
      solution:
        "Wir bringen Ihre Seite nachhaltig nach oben: mit sauberer Technik, den richtigen Suchbegriffen und Inhalten, die Google liebt. So gewinnen Sie Besucher, ohne für jeden Klick zu bezahlen.",
      includesTitle: "Das ist alles dabei",
      includes: [
        { title: "Technische Optimierung", desc: "Schnelligkeit, Struktur und Fehlerfreiheit — die Basis für gute Rankings." },
        { title: "Keyword-Strategie", desc: "Wir finden die Begriffe, nach denen Ihre Kunden wirklich suchen." },
        { title: "Inhalte, die ranken", desc: "Texte, die Fragen Ihrer Kunden beantworten und Vertrauen schaffen." },
        { title: "Messbare Berichte", desc: "Sie sehen schwarz auf weiß, wie Ihre Sichtbarkeit wächst." },
      ],
      outcomesTitle: "Das bringt es Ihnen",
      outcomes: ["Mehr Besucher ohne Werbekosten", "Bessere Platzierungen bei Google", "Nachhaltiges Wachstum statt Strohfeuer"],
      faq: [
        { q: "Wie schnell sehe ich Ergebnisse?", a: "Erste Verbesserungen oft in 4 bis 8 Wochen; nachhaltige Spitzenplätze brauchen einige Monate. SEO wirkt dauerhaft." },
        { q: "Garantieren Sie Platz 1?", a: "Seriöses SEO garantiert keine Platzierung, aber wir arbeiten transparent auf messbares Wachstum hin." },
        { q: "Brauche ich eine neue Website?", a: "Nicht zwingend. Oft holen wir aus Ihrer bestehenden Seite schon viel heraus." },
        { q: "Was kostet SEO bei SaaleWeb?", a: "Das hängt vom Umfang ab — von der gezielten Optimierung einer bestehenden Seite bis zu eigenen SEO-Landingpages je Leistung. Nach einer kostenlosen Analyse erhalten Sie ein transparentes Festpreis-Angebot. Bei neuen Websites ist die technische SEO-Basis bereits enthalten." },
        { q: "Reicht klassisches SEO noch — was ist mit ChatGPT?", a: "Beides gehört heute zusammen. Dieselbe klare Struktur, die Google versteht, hilft auch KI-Systemen wie ChatGPT, Gemini und Perplexity, Ihr Unternehmen einzuordnen. Deshalb verbinden wir SEO mit GEO/AIO: FAQ, strukturierte Daten und eindeutige Leistungsseiten." },
        { q: "Macht ihr auch SEO-Landingpages je Leistung und Ort?", a: "Ja, das ist einer der stärksten Hebel: eine eigene Seite z. B. für „Badsanierung Halle“ oder „Webdesign Leipzig“ rankt für genau diese Suchanfrage und beantwortet die Fragen genau dieser Kunden." },
      ],
    },
    en: {
      tagline: "Top of Google — exactly where your customers are searching.",
      problemTitle: "The problem",
      problem:
        "If you're not on page 1 of Google, you don't exist for most customers. Those who can't find you can't hire you — and ads cost money every single day.",
      solutionTitle: "Our solution",
      solution:
        "We move your site up to stay: with clean tech, the right search terms and content Google loves. You win visitors without paying for every click.",
      includesTitle: "Everything included",
      includes: [
        { title: "Technical optimisation", desc: "Speed, structure and a clean codebase — the basis for good rankings." },
        { title: "Keyword strategy", desc: "We find the terms your customers actually search for." },
        { title: "Content that ranks", desc: "Copy that answers your customers' questions and builds trust." },
        { title: "Measurable reports", desc: "You see in black and white how your visibility grows." },
      ],
      outcomesTitle: "What you get",
      outcomes: ["More visitors without ad spend", "Better Google rankings", "Lasting growth, not a quick spike"],
      faq: [
        { q: "How fast will I see results?", a: "First improvements often in 4 to 8 weeks; lasting top spots take a few months. SEO keeps working." },
        { q: "Do you guarantee rank 1?", a: "Reputable SEO guarantees no position, but we work transparently towards measurable growth." },
        { q: "Do I need a new website?", a: "Not necessarily. We can often get a lot out of your existing site." },
        { q: "What does SEO at SaaleWeb cost?", a: "It depends on scope — from targeted optimization of an existing site to dedicated SEO landing pages per service. After a free analysis you receive a transparent fixed-price proposal. For new websites the technical SEO base is already included." },
        { q: "Is classic SEO still enough — what about ChatGPT?", a: "Both belong together today. The same clear structure Google understands also helps AI systems like ChatGPT, Gemini and Perplexity classify your business. That's why we combine SEO with GEO/AIO: FAQ, structured data and unambiguous service pages." },
        { q: "Do you build SEO landing pages per service and town?", a: "Yes, that's one of the strongest levers: a dedicated page e.g. for 'bathroom renovation Halle' or 'web design Leipzig' ranks for exactly that search and answers exactly those customers' questions." },
      ],
    },
    ru: {
      tagline: "В топе Google — там, где ищут ваши клиенты.",
      problemTitle: "Проблема",
      problem:
        "Если вас нет на 1-й странице Google, для большинства клиентов вы не существуете. Кто не нашёл — не закажет, а реклама стоит денег каждый день.",
      solutionTitle: "Наше решение",
      solution:
        "Мы выводим сайт вверх надолго: чистая техника, правильные запросы и контент, который любит Google. Вы получаете посетителей, не платя за каждый клик.",
      includesTitle: "Всё включено",
      includes: [
        { title: "Техническая оптимизация", desc: "Скорость, структура и отсутствие ошибок — основа хороших позиций." },
        { title: "Стратегия ключевых слов", desc: "Находим запросы, которые действительно вводят ваши клиенты." },
        { title: "Контент, который ранжируется", desc: "Тексты, отвечающие на вопросы клиентов и вызывающие доверие." },
        { title: "Понятные отчёты", desc: "Вы видите чёрным по белому, как растёт ваша видимость." },
      ],
      outcomesTitle: "Что вы получаете",
      outcomes: ["Больше посетителей без рекламы", "Лучшие позиции в Google", "Устойчивый рост, а не вспышка"],
      faq: [
        { q: "Когда будут результаты?", a: "Первые улучшения часто за 4–8 недель; устойчивый топ — несколько месяцев. SEO работает постоянно." },
        { q: "Гарантируете 1-е место?", a: "Честное SEO не гарантирует позицию, но мы прозрачно работаем на измеримый рост." },
        { q: "Нужен новый сайт?", a: "Не обязательно. Часто мы многое вытягиваем и из текущего сайта." },
        { q: "Сколько стоит SEO в SaaleWeb?", a: "Зависит от объёма — от точечной оптимизации существующего сайта до отдельных SEO-лендингов под услуги. После бесплатного анализа вы получаете прозрачное предложение с фикс-ценой. В новых сайтах техническая SEO-база уже включена." },
        { q: "Классического SEO ещё достаточно — а как же ChatGPT?", a: "Сегодня это единое целое. Та же ясная структура, которую понимает Google, помогает и ИИ-системам — ChatGPT, Gemini, Perplexity — понять ваш бизнес. Поэтому мы соединяем SEO с GEO/AIO: FAQ, структурированные данные и однозначные страницы услуг." },
        { q: "Делаете SEO-лендинги под услугу и город?", a: "Да, это один из сильнейших рычагов: отдельная страница, например, «Badsanierung Halle» или «Webdesign Leipzig» ранжируется именно по этому запросу и отвечает на вопросы именно этих клиентов." },
      ],
    },
  },

  local: {
    de: {
      tagline: "Gefunden von Kunden direkt aus Ihrer Region.",
      problemTitle: "Das Problem",
      problem:
        "Ihre Kunden suchen „in der Nähe“ — Friseur, Handwerker, Restaurant. Wer bei Google Maps und in der lokalen Suche nicht auftaucht, verliert diese Kunden an den Betrieb um die Ecke.",
      solutionTitle: "Unsere Lösung",
      solution:
        "Wir machen Sie lokal sichtbar: optimiertes Google-Unternehmensprofil, lokale Suchbegriffe für Halle, Leipzig & Umgebung und mehr echte Bewertungen. So landen Anrufe und Wegbeschreibungen bei Ihnen.",
      includesTitle: "Das ist alles dabei",
      includes: [
        { title: "Google-Unternehmensprofil", desc: "Vollständig optimiert für Maps und die lokale Suche." },
        { title: "Regionale Suchbegriffe", desc: "Sichtbar genau dort, wo Ihre Nachbarn suchen." },
        { title: "Bewertungs-Strategie", desc: "Mehr positive Bewertungen, die Vertrauen schaffen." },
        { title: "Lokale Inhalte", desc: "Seiten für Ihre Stadt und Stadtteile, die Google bevorzugt." },
      ],
      outcomesTitle: "Das bringt es Ihnen",
      outcomes: ["Mehr Anrufe und Wegbeschreibungen", "Top bei Google Maps", "Kunden aus Ihrer Umgebung"],
      faq: [
        { q: "Für wen lohnt sich Local SEO?", a: "Für alle mit Kunden vor Ort: Gastronomie, Salons, Handwerk, Praxen, Kanzleien und Einzelhandel." },
        { q: "Brauche ich viele Bewertungen?", a: "Sie helfen sehr. Wir zeigen Ihnen einen einfachen Weg, regelmäßig echte Bewertungen zu bekommen." },
        { q: "Funktioniert das in Halle und Leipzig?", a: "Genau dafür sind wir da — wir kennen die Region und richten alles lokal aus." },
        { q: "Was kostet Local SEO?", a: "Das hängt vom Ausgangspunkt ab und wird oft mit Website-Arbeit kombiniert. Nach einem kostenlosen Blick auf Ihre aktuelle lokale Sichtbarkeit erhalten Sie ein transparentes Festpreis-Angebot." },
        { q: "Gehört das Google Business Profil dazu?", a: "Ja. Wir richten das Profil ein oder optimieren es, verknüpfen es sauber mit der Website und sorgen für konsistente Unternehmensdaten — ein wichtiger Faktor für lokale Rankings und Google Maps." },
        { q: "Hilft Local SEO auch in KI-Antworten?", a: "Ja. Wenn Leistungen, Standort und Öffnungszeiten maschinenlesbar strukturiert sind, können KI-Systeme wie ChatGPT und Perplexity Ihr Unternehmen bei lokalen Fragen wie „Friseur in Halle“ einordnen und nennen." },
      ],
    },
    en: {
      tagline: "Found by customers right from your area.",
      problemTitle: "The problem",
      problem:
        "Your customers search 'near me' — hairdresser, tradesperson, restaurant. If you're not on Google Maps and local search, you lose them to the business around the corner.",
      solutionTitle: "Our solution",
      solution:
        "We make you locally visible: an optimised Google Business Profile, local search terms for Halle, Leipzig & the region, and more genuine reviews. So calls and directions land with you.",
      includesTitle: "Everything included",
      includes: [
        { title: "Google Business Profile", desc: "Fully optimised for Maps and local search." },
        { title: "Regional search terms", desc: "Visible exactly where your neighbours search." },
        { title: "Review strategy", desc: "More positive reviews that build trust." },
        { title: "Local content", desc: "Pages for your city and districts that Google favours." },
      ],
      outcomesTitle: "What you get",
      outcomes: ["More calls and directions", "Top on Google Maps", "Customers from your area"],
      faq: [
        { q: "Who is local SEO for?", a: "Anyone with local customers: hospitality, salons, trades, clinics, law firms and retail." },
        { q: "Do I need lots of reviews?", a: "They help a lot. We show you a simple way to get genuine reviews regularly." },
        { q: "Does it work in Halle and Leipzig?", a: "That's exactly what we do — we know the region and tune everything locally." },
        { q: "What does local SEO cost?", a: "It depends on the starting point and is often combined with website work. After a free look at your current local visibility you receive a transparent fixed-price proposal." },
        { q: "Is the Google Business Profile included?", a: "Yes. We set up or optimize the profile, link it cleanly with the website and keep business data consistent — an important factor for local rankings and Google Maps." },
        { q: "Does local SEO help in AI answers too?", a: "Yes. When services, location and opening hours are structured in machine-readable form, AI systems like ChatGPT and Perplexity can classify and mention your business for local questions like 'hairdresser in Halle'." },
      ],
    },
    ru: {
      tagline: "Вас находят клиенты прямо из вашего района.",
      problemTitle: "Проблема",
      problem:
        "Ваши клиенты ищут «рядом» — парикмахер, мастер, ресторан. Кто не виден в Google Maps и локальном поиске, теряет их в пользу бизнеса за углом.",
      solutionTitle: "Наше решение",
      solution:
        "Делаем вас заметными локально: оптимизированный профиль в Google, локальные запросы по Галле, Лейпцигу и окрестностям и больше реальных отзывов. Звонки и маршруты приходят к вам.",
      includesTitle: "Всё включено",
      includes: [
        { title: "Профиль в Google", desc: "Полностью оптимизирован для Maps и локального поиска." },
        { title: "Региональные запросы", desc: "Видно именно там, где ищут ваши соседи." },
        { title: "Стратегия отзывов", desc: "Больше положительных отзывов, вызывающих доверие." },
        { title: "Локальный контент", desc: "Страницы по вашему городу и районам, которые любит Google." },
      ],
      outcomesTitle: "Что вы получаете",
      outcomes: ["Больше звонков и маршрутов", "Топ на Google Maps", "Клиенты из вашего района"],
      faq: [
        { q: "Кому нужно локальное SEO?", a: "Всем с клиентами поблизости: кафе, салоны, ремёсла, клиники, юристы и розница." },
        { q: "Нужно много отзывов?", a: "Они сильно помогают. Покажем простой способ регулярно получать реальные отзывы." },
        { q: "Это работает в Галле и Лейпциге?", a: "Именно для этого мы и есть — знаем регион и настраиваем всё локально." },
        { q: "Сколько стоит локальное SEO?", a: "Зависит от исходной точки и часто комбинируется с работой над сайтом. После бесплатного взгляда на вашу текущую локальную видимость вы получаете прозрачное предложение с фикс-ценой." },
        { q: "Профиль Google Business входит?", a: "Да. Мы настраиваем или оптимизируем профиль, аккуратно связываем его с сайтом и следим за консистентностью данных компании — важный фактор локального ранжирования и Google Maps." },
        { q: "Локальное SEO помогает и в ответах ИИ?", a: "Да. Когда услуги, локация и часы работы структурированы машиночитаемо, ИИ-системы вроде ChatGPT и Perplexity могут понять и назвать ваш бизнес при локальных вопросах вроде «парикмахер в Галле»." },
      ],
    },
  },

  ai: {
    de: {
      tagline: "Empfohlen von ChatGPT, Gemini & Co. — der nächste Schritt der Sichtbarkeit.",
      problemTitle: "Das Problem",
      problem:
        "Immer mehr Menschen fragen ChatGPT oder Gemini statt Google. Wenn die KI Ihr Unternehmen nicht kennt, empfiehlt sie den Wettbewerb — und Sie verlieren Kunden, ohne es zu merken.",
      solutionTitle: "Unsere Lösung",
      solution:
        "Wir bereiten Ihre Website so auf, dass KI-Assistenten Ihre Inhalte verstehen, zitieren und weiterempfehlen. So sind Sie auch in der neuen, KI-gestützten Suche präsent — bevor es die Konkurrenz ist.",
      includesTitle: "Das ist alles dabei",
      includes: [
        { title: "KI-lesbare Struktur", desc: "Klar strukturierte Inhalte und Daten, die Assistenten sauber erfassen." },
        { title: "Strukturierte Daten", desc: "Technische Markierungen, mit denen KI Ihr Angebot eindeutig versteht." },
        { title: "Vertrauens-Signale", desc: "Klare Fakten, FAQ und Beweise, die zitiert werden." },
        { title: "Zukunftssicher", desc: "Vorsprung in einem Feld, das die meisten noch ignorieren." },
      ],
      outcomesTitle: "Das bringt es Ihnen",
      outcomes: ["Sichtbar in der KI-Suche", "Empfehlungen statt Konkurrenz", "Vorsprung vor dem Wettbewerb"],
      faq: [
        { q: "Ist das nicht zu früh?", a: "Im Gegenteil — wer jetzt startet, sichert sich den Vorsprung, solange es die meisten noch ignorieren." },
        { q: "Wie messen Sie das?", a: "Wir prüfen, ob und wie KI-Assistenten Ihr Unternehmen nennen, und optimieren gezielt nach." },
        { q: "Brauche ich dafür eine neue Seite?", a: "Oft genügt eine Optimierung Ihrer bestehenden Inhalte und Struktur." },
        { q: "Was kostet eine KI-Integration?", a: "Das hängt vom Anwendungsfall ab — vom Website-Assistenten bis zur Prozess-Automatisierung. Im kostenlosen Erstgespräch klären wir Ziel und Umfang, danach erhalten Sie ein transparentes Festpreis-Angebot." },
        { q: "Was kann KI konkret für mein Unternehmen tun?", a: "Zum Beispiel: ein Website-Assistent, der Kundenfragen rund um die Uhr beantwortet und Anfragen vorqualifiziert, automatische Benachrichtigungen und Berichte, oder die Automatisierung wiederkehrender Abläufe. Wir empfehlen nur, was messbaren Nutzen bringt." },
        { q: "Wie steht es um den Datenschutz?", a: "Wir richten KI-Lösungen datensparsam ein: Es werden nur die Informationen verarbeitet, die für den Zweck nötig sind, und sensible Daten gehören nicht in den Chat. Die Einrichtung erfolgt nach DSGVO-Grundsätzen." },
      ],
    },
    en: {
      tagline: "Recommended by ChatGPT, Gemini & co. — the next step in visibility.",
      problemTitle: "The problem",
      problem:
        "More and more people ask ChatGPT or Gemini instead of Google. If the AI doesn't know your business, it recommends the competition — and you lose customers without noticing.",
      solutionTitle: "Our solution",
      solution:
        "We prepare your website so AI assistants understand, cite and recommend your content. That keeps you present in the new AI-powered search — before your competitors are.",
      includesTitle: "Everything included",
      includes: [
        { title: "AI-readable structure", desc: "Clearly structured content and data assistants can parse cleanly." },
        { title: "Structured data", desc: "Technical markup so AI understands your offering unambiguously." },
        { title: "Trust signals", desc: "Clear facts, FAQs and proof that get quoted." },
        { title: "Future-proof", desc: "A head start in a field most still ignore." },
      ],
      outcomesTitle: "What you get",
      outcomes: ["Visible in AI search", "Recommendations instead of competitors", "A lead over the competition"],
      faq: [
        { q: "Isn't it too early?", a: "Quite the opposite — starting now secures your lead while most still ignore it." },
        { q: "How do you measure it?", a: "We check whether and how AI assistants mention your business and optimise accordingly." },
        { q: "Do I need a new site?", a: "Often optimising your existing content and structure is enough." },
        { q: "What does an AI integration cost?", a: "It depends on the use case — from a website assistant to process automation. In the free initial call we clarify goal and scope, then you receive a transparent fixed-price proposal." },
        { q: "What can AI concretely do for my business?", a: "For example: a website assistant that answers customer questions around the clock and pre-qualifies inquiries, automatic notifications and reports, or automation of recurring workflows. We only recommend what brings measurable value." },
        { q: "What about data protection?", a: "We set up AI solutions in a data-minimal way: only the information needed for the purpose is processed, and sensitive data does not belong in the chat. The setup follows GDPR principles." },
      ],
    },
    ru: {
      tagline: "Рекомендуют ChatGPT, Gemini и другие — следующий шаг видимости.",
      problemTitle: "Проблема",
      problem:
        "Всё больше людей спрашивают ChatGPT или Gemini вместо Google. Если ИИ не знает ваш бизнес, он рекомендует конкурентов — и вы теряете клиентов незаметно.",
      solutionTitle: "Наше решение",
      solution:
        "Готовим сайт так, чтобы ИИ-ассистенты понимали, цитировали и рекомендовали ваш контент. Вы присутствуете в новом ИИ-поиске — раньше конкурентов.",
      includesTitle: "Всё включено",
      includes: [
        { title: "Структура для ИИ", desc: "Чётко структурированный контент и данные, которые ассистенты читают без ошибок." },
        { title: "Структурированные данные", desc: "Техническая разметка, чтобы ИИ однозначно понимал ваше предложение." },
        { title: "Сигналы доверия", desc: "Понятные факты, FAQ и доказательства, которые цитируют." },
        { title: "Готовность к будущему", desc: "Фора в области, которую большинство пока игнорирует." },
      ],
      outcomesTitle: "Что вы получаете",
      outcomes: ["Видимость в ИИ-поиске", "Рекомендации вместо конкурентов", "Фора перед конкурентами"],
      faq: [
        { q: "Не рано ли?", a: "Наоборот — начав сейчас, вы закрепляете фору, пока большинство это игнорирует." },
        { q: "Как вы это измеряете?", a: "Проверяем, упоминают ли ИИ-ассистенты ваш бизнес, и целенаправленно оптимизируем." },
        { q: "Нужен новый сайт?", a: "Часто достаточно оптимизировать имеющийся контент и структуру." },
        { q: "Сколько стоит интеграция ИИ?", a: "Зависит от сценария — от ассистента на сайте до автоматизации процессов. На бесплатной консультации уточняем цель и объём, затем вы получаете прозрачное предложение с фикс-ценой." },
        { q: "Что ИИ может сделать для моего бизнеса конкретно?", a: "Например: ассистент на сайте, который круглосуточно отвечает на вопросы клиентов и предквалифицирует заявки, автоматические уведомления и отчёты, автоматизация повторяющихся процессов. Мы рекомендуем только то, что даёт измеримую пользу." },
        { q: "Как с защитой данных?", a: "Мы настраиваем ИИ-решения по принципу минимума данных: обрабатывается только необходимая для цели информация, а чувствительные данные не относятся к чату. Настройка выполняется по принципам GDPR." },
      ],
    },
  },

  relaunch: {
    de: {
      tagline: "Aus einer veralteten Seite wird ein modernes System — ohne Ranking-Verlust.",
      problemTitle: "Das Problem",
      problem:
        "Ihre alte Website ist langsam, schwer zu pflegen und nicht mehr zeitgemäß. Ein Neustart macht Angst: Verliere ich meine Google-Platzierungen und bekannte Adressen?",
      solutionTitle: "Unsere Lösung",
      solution:
        "Wir modernisieren Ihre Seite sorgfältig und behalten dabei Ihre Rankings: saubere Weiterleitungen, übernommene Inhalte und ein frisches, schnelles Design. Sie gewinnen Tempo und Vertrauen, ohne Sichtbarkeit zu verlieren.",
      includesTitle: "Das ist alles dabei",
      includes: [
        { title: "Sichere Weiterleitungen", desc: "Alte Adressen leiten sauber weiter — Ihre Rankings bleiben erhalten." },
        { title: "Inhalte übernommen", desc: "Wir retten und verbessern Ihre bestehenden Texte und Bilder." },
        { title: "Frisches, schnelles Design", desc: "Moderner Auftritt mit Ladezeiten unter einer Sekunde." },
        { title: "Einfache Pflege", desc: "Künftig ändern Sie Inhalte selbst — ohne Entwickler." },
      ],
      outcomesTitle: "Das bringt es Ihnen",
      outcomes: ["Moderner Auftritt ohne Ranking-Verlust", "Schneller und sicherer", "Endlich leicht zu pflegen"],
      faq: [
        { q: "Verliere ich meine Google-Position?", a: "Nein — mit sauberen Weiterleitungen sichern wir Ihre Rankings beim Umzug." },
        { q: "Können Sie Inhalte übernehmen?", a: "Ja, wir übernehmen und verbessern Ihre bestehenden Texte und Bilder." },
        { q: "Wie lange dauert ein Relaunch?", a: "Meist 3 bis 6 Wochen, je nach Umfang Ihrer bisherigen Seite." },
        { q: "Was kostet ein Relaunch?", a: "Wie ein Neubau — nach Umfang: eine moderne Landingpage ab 990 €, eine vollständige Unternehmenswebsite ab 1.990 €, ein kompakter Onepager ab 600 €. Die Übernahme bewährter Inhalte planen wir mit ein; den Festpreis klären wir im kostenlosen Erstgespräch." },
        { q: "Gibt es vorher eine Analyse?", a: "Ja, kostenlos: Wir schauen auf Ladezeit, mobile Darstellung, Google-Sichtbarkeit und Anfragewege Ihrer aktuellen Seite. Erst danach empfehlen wir, ob Optimierung oder Relaunch der bessere Weg ist." },
        { q: "Wird der Relaunch auch für KI-Suche optimiert?", a: "Ja. Ein Relaunch ist die beste Gelegenheit, die GEO/AIO-Basis gleich richtig aufzubauen: klare Leistungsseiten, FAQ-Bereiche und strukturierte Daten, die Google und KI-Systeme wie ChatGPT sauber lesen können." },
      ],
    },
    en: {
      tagline: "Turn an outdated site into a modern system — without losing rankings.",
      problemTitle: "The problem",
      problem:
        "Your old website is slow, hard to maintain and dated. A restart feels risky: will I lose my Google rankings and known URLs?",
      solutionTitle: "Our solution",
      solution:
        "We modernise your site carefully and keep your rankings: clean redirects, migrated content and a fresh, fast design. You gain speed and trust without losing visibility.",
      includesTitle: "Everything included",
      includes: [
        { title: "Safe redirects", desc: "Old URLs redirect cleanly — your rankings are preserved." },
        { title: "Content migrated", desc: "We rescue and improve your existing texts and images." },
        { title: "Fresh, fast design", desc: "A modern look with load times under one second." },
        { title: "Easy upkeep", desc: "From now on you edit content yourself — no developer needed." },
      ],
      outcomesTitle: "What you get",
      outcomes: ["Modern look without losing rankings", "Faster and safer", "Finally easy to maintain"],
      faq: [
        { q: "Will I lose my Google position?", a: "No — with clean redirects we protect your rankings during the move." },
        { q: "Can you migrate content?", a: "Yes, we take over and improve your existing texts and images." },
        { q: "How long does a relaunch take?", a: "Usually 3 to 6 weeks, depending on the size of your current site." },
        { q: "What does a relaunch cost?", a: "Like a new build — by scope: a modern landing page from €990, a full company website from €1,990, a compact one-pager from €600. Migrating proven content is part of the plan; the fixed price is clarified in the free initial call." },
        { q: "Is there an analysis beforehand?", a: "Yes, free of charge: we look at load time, mobile view, Google visibility and inquiry paths of your current site. Only then do we recommend whether optimization or a relaunch is the better path." },
        { q: "Is the relaunch optimized for AI search too?", a: "Yes. A relaunch is the best opportunity to build the GEO/AIO base right from the start: clear service pages, FAQ sections and structured data that Google and AI systems like ChatGPT can read cleanly." },
      ],
    },
    ru: {
      tagline: "Устаревший сайт превращаем в современную систему — без потери позиций.",
      problemTitle: "Проблема",
      problem:
        "Старый сайт медленный, трудный в обслуживании и несовременный. Перезапуск пугает: не потеряю ли я позиции в Google и привычные адреса?",
      solutionTitle: "Наше решение",
      solution:
        "Аккуратно модернизируем сайт и сохраняем позиции: корректные редиректы, перенос контента и свежий быстрый дизайн. Вы получаете скорость и доверие, не теряя видимости.",
      includesTitle: "Всё включено",
      includes: [
        { title: "Безопасные редиректы", desc: "Старые адреса корректно перенаправляются — позиции сохраняются." },
        { title: "Перенос контента", desc: "Сохраняем и улучшаем ваши тексты и изображения." },
        { title: "Свежий быстрый дизайн", desc: "Современный вид с загрузкой меньше секунды." },
        { title: "Простое обслуживание", desc: "Дальше меняете контент сами — без разработчика." },
      ],
      outcomesTitle: "Что вы получаете",
      outcomes: ["Современный вид без потери позиций", "Быстрее и безопаснее", "Наконец-то легко обновлять"],
      faq: [
        { q: "Потеряю ли позиции в Google?", a: "Нет — корректными редиректами мы защищаем позиции при переезде." },
        { q: "Можете перенести контент?", a: "Да, переносим и улучшаем имеющиеся тексты и изображения." },
        { q: "Сколько длится перезапуск?", a: "Обычно 3–6 недель в зависимости от объёма текущего сайта." },
        { q: "Сколько стоит редизайн/перезапуск?", a: "Как новый проект — по объёму: современный лендинг от 990 €, полноценный корпоративный сайт от 1 990 €, компактный one-pager от 600 €. Перенос работающего контента закладываем в план; фикс-цену уточняем на бесплатной консультации." },
        { q: "Будет ли анализ перед стартом?", a: "Да, бесплатно: смотрим скорость загрузки, мобильный вид, видимость в Google и пути заявок текущего сайта. Только после этого рекомендуем — оптимизация или полноценный перезапуск." },
        { q: "Перезапуск оптимизируется и под ИИ-поиск?", a: "Да. Релонч — лучшая возможность сразу правильно выстроить GEO/AIO-базу: понятные страницы услуг, FAQ-блоки и структурированные данные, которые чисто читают Google и ИИ-системы вроде ChatGPT." },
      ],
    },
  },

  performance: {
    de: {
      tagline: "Ladezeiten unter einer Sekunde — gut für Kunden und für Google.",
      problemTitle: "Das Problem",
      problem:
        "Lädt eine Seite langsam, springen Besucher ab, bevor sie überhaupt etwas gesehen haben. Jede Sekunde Wartezeit kostet Anfragen — und Google straft langsame Seiten mit schlechteren Platzierungen ab.",
      solutionTitle: "Unsere Lösung",
      solution:
        "Wir machen Ihre Seite blitzschnell: optimierte Bilder, sauberer Code und modernes Hosting. Das Ergebnis sind Top-Werte bei den Google Core Web Vitals — und zufriedene Besucher, die bleiben.",
      includesTitle: "Das ist alles dabei",
      includes: [
        { title: "Optimierte Bilder", desc: "Gestochen scharf, aber winzig in der Dateigröße." },
        { title: "Sauberer Code", desc: "Nur das, was nötig ist — nichts, was bremst." },
        { title: "Core Web Vitals", desc: "Top-Werte in Googles offizieller Geschwindigkeitsmessung." },
        { title: "Schnelles Hosting", desc: "Weltweit ausgeliefert, damit es überall schnell ist." },
      ],
      outcomesTitle: "Das bringt es Ihnen",
      outcomes: ["Weniger Absprünge", "Bessere Google-Bewertung", "Mehr zufriedene Besucher"],
      faq: [
        { q: "Wie schnell wird meine Seite?", a: "Wir zielen auf Ladezeiten unter einer Sekunde und Bestwerte bei den Core Web Vitals." },
        { q: "Geht das auch für bestehende Seiten?", a: "Oft ja — wir analysieren Ihre Seite und beheben gezielt die Bremsen." },
        { q: "Warum ist Tempo so wichtig?", a: "Schnelle Seiten halten Besucher, erhöhen Anfragen und ranken bei Google besser." },
        { q: "Was kostet die Performance-Optimierung?", a: "Das hängt vom Zustand der aktuellen Seite ab. Nach einer kostenlosen Messung erhalten Sie ein transparentes Festpreis-Angebot mit den wichtigsten Hebeln zuerst." },
        { q: "Welche Werte sind realistisch?", a: "Wir arbeiten auf sehr gute Lighthouse- und PageSpeed-Werte hin und messen transparent vorher/nachher. Die genauen Zahlen hängen von Technik und Inhalten Ihrer Seite ab — Versprechen ohne Messung machen wir nicht." },
        { q: "Hilft Tempo auch für SEO und KI-Suche?", a: "Ja, doppelt: Ladezeit ist ein Rankingfaktor und schnelle Seiten konvertieren besser. Zudem können Crawler und KI-Systeme schlanke, saubere Seiten leichter vollständig erfassen." },
      ],
    },
    en: {
      tagline: "Load times under one second — great for customers and for Google.",
      problemTitle: "The problem",
      problem:
        "If a page loads slowly, visitors leave before they've seen anything. Every second of waiting costs enquiries — and Google penalises slow pages with worse rankings.",
      solutionTitle: "Our solution",
      solution:
        "We make your site lightning fast: optimised images, clean code and modern hosting. The result is top Core Web Vitals scores — and happy visitors who stay.",
      includesTitle: "Everything included",
      includes: [
        { title: "Optimised images", desc: "Razor sharp, yet tiny in file size." },
        { title: "Clean code", desc: "Only what's needed — nothing that slows you down." },
        { title: "Core Web Vitals", desc: "Top scores in Google's official speed metrics." },
        { title: "Fast hosting", desc: "Delivered worldwide so it's quick everywhere." },
      ],
      outcomesTitle: "What you get",
      outcomes: ["Fewer bounces", "Better Google score", "More happy visitors"],
      faq: [
        { q: "How fast will my site be?", a: "We target load times under one second and best scores on Core Web Vitals." },
        { q: "Does it work for existing sites?", a: "Often yes — we analyse your site and fix the bottlenecks precisely." },
        { q: "Why does speed matter so much?", a: "Fast sites keep visitors, increase enquiries and rank better on Google." },
        { q: "What does performance optimization cost?", a: "It depends on the state of the current site. After a free measurement you receive a transparent fixed-price proposal with the biggest levers first." },
        { q: "Which scores are realistic?", a: "We work toward very good Lighthouse and PageSpeed scores and measure transparently before/after. Exact numbers depend on your site's technology and content — we don't make promises without measuring." },
        { q: "Does speed help SEO and AI search too?", a: "Yes, twice over: load time is a ranking factor and fast pages convert better. In addition, crawlers and AI systems can capture lean, clean pages more completely." },
      ],
    },
    ru: {
      tagline: "Загрузка меньше секунды — хорошо для клиентов и для Google.",
      problemTitle: "Проблема",
      problem:
        "Если страница грузится медленно, посетители уходят, не успев ничего увидеть. Каждая секунда ожидания стоит заявок — а Google понижает медленные сайты в выдаче.",
      solutionTitle: "Наше решение",
      solution:
        "Делаем сайт молниеносным: оптимизированные изображения, чистый код и современный хостинг. Результат — топовые показатели Core Web Vitals и довольные посетители, которые остаются.",
      includesTitle: "Всё включено",
      includes: [
        { title: "Оптимизированные изображения", desc: "Чёткие, но крошечные по размеру файла." },
        { title: "Чистый код", desc: "Только нужное — ничего, что тормозит." },
        { title: "Core Web Vitals", desc: "Топовые значения в официальной метрике скорости Google." },
        { title: "Быстрый хостинг", desc: "Доставка по всему миру, чтобы было быстро везде." },
      ],
      outcomesTitle: "Что вы получаете",
      outcomes: ["Меньше отказов", "Лучшая оценка Google", "Больше довольных посетителей"],
      faq: [
        { q: "Насколько быстрым будет сайт?", a: "Целимся в загрузку меньше секунды и лучшие значения Core Web Vitals." },
        { q: "Подходит для существующих сайтов?", a: "Часто да — анализируем сайт и точечно убираем тормоза." },
        { q: "Почему скорость так важна?", a: "Быстрые сайты удерживают посетителей, повышают заявки и лучше ранжируются." },
        { q: "Сколько стоит оптимизация скорости?", a: "Зависит от состояния текущего сайта. После бесплатного замера вы получаете прозрачное предложение с фикс-ценой — сначала самые сильные рычаги." },
        { q: "Какие показатели реалистичны?", a: "Мы работаем на очень хорошие показатели Lighthouse и PageSpeed и прозрачно замеряем «до/после». Точные цифры зависят от технологии и контента вашего сайта — обещаний без замеров мы не даём." },
        { q: "Скорость помогает SEO и ИИ-поиску?", a: "Да, вдвойне: скорость загрузки — фактор ранжирования, а быстрые страницы лучше конвертируют. Кроме того, краулеры и ИИ-системы легче и полнее считывают лёгкие, чистые страницы." },
      ],
    },
  },

  hosting: {
    de: {
      tagline: "Sicheres, blitzschnelles Hosting — Sie müssen sich um nichts kümmern.",
      problemTitle: "Das Problem",
      problem:
        "Billiges Hosting ist langsam, fällt aus und ist ein Sicherheitsrisiko. Technische Probleme kosten Sie Nerven, Zeit und im schlimmsten Fall den Zugriff auf Ihre eigene Website.",
      solutionTitle: "Unsere Lösung",
      solution:
        "Wir hosten Ihre Seite auf moderner, weltweit verteilter Infrastruktur — schnell, sicher und stabil. Backups, Verschlüsselung und Monitoring laufen automatisch im Hintergrund. Sie kümmern sich um Ihr Geschäft, wir um die Technik.",
      includesTitle: "Das ist alles dabei",
      includes: [
        { title: "Weltweit schnell", desc: "Ihre Seite wird nah am Besucher ausgeliefert — überall flott." },
        { title: "Sicher & verschlüsselt", desc: "SSL, Schutzmaßnahmen und DSGVO-konforme Einrichtung." },
        { title: "Automatische Backups", desc: "Regelmäßige Sicherungen — Ihre Daten sind nie verloren." },
        { title: "Monitoring", desc: "Wir bemerken Probleme oft, bevor Sie es tun." },
      ],
      outcomesTitle: "Das bringt es Ihnen",
      outcomes: ["Keine technischen Sorgen", "Sicher und immer erreichbar", "Schnell für alle Besucher"],
      faq: [
        { q: "Muss ich mich um etwas kümmern?", a: "Nein — Einrichtung, Sicherheit und Backups übernehmen wir komplett." },
        { q: "Sind meine Daten sicher?", a: "Ja: Verschlüsselung, regelmäßige Backups und DSGVO-konforme Einrichtung gehören dazu." },
        { q: "Was, wenn etwas ausfällt?", a: "Unser Monitoring schlägt früh Alarm, und wir reagieren schnell." },
        { q: "Was kostet das Hosting?", a: "Das hängt vom Setup ab und wird als transparenter monatlicher Betrag vereinbart — ohne versteckte Kosten. Im kostenlosen Erstgespräch klären wir, welches Paket zu Ihrer Website passt." },
        { q: "Was ist im Hosting enthalten?", a: "Schnelle, sichere Infrastruktur, SSL-Verschlüsselung, regelmäßige Backups, Monitoring und technische Updates. Sie haben einen direkten Ansprechpartner statt einer anonymen Hotline." },
        { q: "Können Sie meine bestehende Website umziehen?", a: "Ja. Wir planen den Umzug sauber, koordinieren Domain und DNS und halten die Ausfallzeit minimal. Danach läuft die Seite auf einer schnellen, gepflegten Umgebung." },
      ],
    },
    en: {
      tagline: "Secure, lightning-fast hosting — you don't have to worry about a thing.",
      problemTitle: "The problem",
      problem:
        "Cheap hosting is slow, goes down and is a security risk. Technical problems cost you nerves, time and — in the worst case — access to your own website.",
      solutionTitle: "Our solution",
      solution:
        "We host your site on modern, globally distributed infrastructure — fast, secure and stable. Backups, encryption and monitoring run automatically in the background. You focus on your business, we handle the tech.",
      includesTitle: "Everything included",
      includes: [
        { title: "Fast worldwide", desc: "Your site is delivered close to each visitor — quick everywhere." },
        { title: "Secure & encrypted", desc: "SSL, protection and a GDPR-compliant setup." },
        { title: "Automatic backups", desc: "Regular backups — your data is never lost." },
        { title: "Monitoring", desc: "We often spot issues before you do." },
      ],
      outcomesTitle: "What you get",
      outcomes: ["No technical worries", "Secure and always reachable", "Fast for every visitor"],
      faq: [
        { q: "Do I have to manage anything?", a: "No — setup, security and backups are fully handled by us." },
        { q: "Is my data safe?", a: "Yes: encryption, regular backups and a GDPR-compliant setup are included." },
        { q: "What if something goes down?", a: "Our monitoring alerts us early and we respond quickly." },
        { q: "What does hosting cost?", a: "It depends on the setup and is agreed as a transparent monthly amount — no hidden costs. In the free initial call we clarify which package fits your website." },
        { q: "What is included in hosting?", a: "Fast, secure infrastructure, SSL encryption, regular backups, monitoring and technical updates. You have one direct contact person instead of an anonymous hotline." },
        { q: "Can you migrate my existing website?", a: "Yes. We plan the migration cleanly, coordinate domain and DNS and keep downtime minimal. Afterwards your site runs on a fast, well-maintained environment." },
      ],
    },
    ru: {
      tagline: "Безопасный, молниеносный хостинг — вам не нужно ни о чём заботиться.",
      problemTitle: "Проблема",
      problem:
        "Дешёвый хостинг медленный, падает и небезопасен. Технические проблемы стоят нервов, времени, а в худшем случае — доступа к собственному сайту.",
      solutionTitle: "Наше решение",
      solution:
        "Размещаем сайт на современной, распределённой по миру инфраструктуре — быстро, безопасно и стабильно. Резервные копии, шифрование и мониторинг работают автоматически. Вы занимаетесь бизнесом, мы — техникой.",
      includesTitle: "Всё включено",
      includes: [
        { title: "Быстро по всему миру", desc: "Сайт доставляется близко к посетителю — везде шустро." },
        { title: "Безопасно и зашифровано", desc: "SSL, защита и настройка по GDPR." },
        { title: "Автоматические бэкапы", desc: "Регулярные копии — данные не потеряются." },
        { title: "Мониторинг", desc: "Часто замечаем проблемы раньше вас." },
      ],
      outcomesTitle: "Что вы получаете",
      outcomes: ["Никаких технических забот", "Безопасно и всегда доступно", "Быстро для всех посетителей"],
      faq: [
        { q: "Нужно ли мне чем-то заниматься?", a: "Нет — настройку, безопасность и бэкапы берём на себя полностью." },
        { q: "Мои данные в безопасности?", a: "Да: шифрование, регулярные бэкапы и настройка по GDPR включены." },
        { q: "Что, если что-то упадёт?", a: "Мониторинг предупреждает заранее, и мы быстро реагируем." },
        { q: "Сколько стоит хостинг?", a: "Зависит от конфигурации и оформляется как прозрачная ежемесячная сумма — без скрытых расходов. На бесплатной консультации уточняем, какой пакет подходит вашему сайту." },
        { q: "Что входит в хостинг?", a: "Быстрая и безопасная инфраструктура, SSL-шифрование, регулярные бэкапы, мониторинг и технические обновления. У вас один прямой контакт вместо анонимной горячей линии." },
        { q: "Перенесёте мой существующий сайт?", a: "Да. Мы аккуратно планируем переезд, координируем домен и DNS и сводим простой к минимуму. После этого сайт работает в быстрой и ухоженной среде." },
      ],
    },
  },

  care: {
    de: {
      tagline: "Updates, Sicherheit und Support — damit Ihre Seite dauerhaft Anfragen bringt.",
      problemTitle: "Das Problem",
      problem:
        "Eine Website ist nicht „einmal fertig“. Ohne Pflege wird sie unsicher, veraltet und langsam — und bei Problemen erreichen Sie niemanden. Genau dann verlieren Sie Kunden.",
      solutionTitle: "Unsere Lösung",
      solution:
        "Wir kümmern uns laufend um Ihre Seite: regelmäßige Updates, Sicherheitschecks, Backups und schnelle Hilfe bei Fragen. Auf Wunsch optimieren wir kontinuierlich weiter, damit Ihre Seite immer besser wird.",
      includesTitle: "Das ist alles dabei",
      includes: [
        { title: "Regelmäßige Updates", desc: "Technik und Inhalte bleiben aktuell und sicher." },
        { title: "Sicherheit & Backups", desc: "Schutz und Sicherungen, damit nichts verloren geht." },
        { title: "Schneller Support", desc: "Ein fester Ansprechpartner, der Ihre Seite kennt." },
        { title: "Laufende Optimierung", desc: "Kleine Verbesserungen, die über die Zeit viel bewirken." },
      ],
      outcomesTitle: "Das bringt es Ihnen",
      outcomes: ["Immer aktuell und sicher", "Hilfe, wenn Sie sie brauchen", "Eine Seite, die mitwächst"],
      faq: [
        { q: "Brauche ich das wirklich?", a: "Wenn Ihre Seite Kunden bringen soll: ja. Pflege hält sie sicher, schnell und aktuell." },
        { q: "Wie schnell bekomme ich Hilfe?", a: "Sie haben einen festen Ansprechpartner und bekommen zeitnah Antwort." },
        { q: "Kann ich jederzeit kündigen?", a: "Ja, die Betreuung ist flexibel und fair — keine langen Bindungen." },
        { q: "Was kostet die Wartung?", a: "Wartungspakete werden nach Umfang als transparenter monatlicher Festpreis vereinbart. Nach einem kurzen Blick auf Ihre Website empfehlen wir das passende Paket — ohne Überdimensionierung." },
        { q: "Was ist in der Wartung enthalten?", a: "Je nach Paket: technische Updates, Sicherheits-Checks, Backups, Monitoring und ein Kontingent für kleine Anpassungen. So bleibt die Seite schnell, sicher und aktuell." },
        { q: "Übernehmen Sie auch die Inhaltspflege?", a: "Ja, auf Wunsch: Texte, Bilder, Preise oder Neuigkeiten können wir im Rahmen des Pakets pflegen. Alternativ zeigen wir Ihnen, wie Sie Inhalte selbst im CMS ändern." },
      ],
    },
    en: {
      tagline: "Updates, security and support — so your site keeps bringing enquiries.",
      problemTitle: "The problem",
      problem:
        "A website is never 'done'. Without care it becomes insecure, outdated and slow — and when problems hit, there's no one to call. That's exactly when you lose customers.",
      solutionTitle: "Our solution",
      solution:
        "We look after your site continuously: regular updates, security checks, backups and quick help when you have questions. On request we keep optimising so your site keeps getting better.",
      includesTitle: "Everything included",
      includes: [
        { title: "Regular updates", desc: "Tech and content stay current and secure." },
        { title: "Security & backups", desc: "Protection and backups so nothing gets lost." },
        { title: "Fast support", desc: "A dedicated contact who knows your site." },
        { title: "Ongoing optimisation", desc: "Small improvements that add up over time." },
      ],
      outcomesTitle: "What you get",
      outcomes: ["Always current and secure", "Help when you need it", "A site that grows with you"],
      faq: [
        { q: "Do I really need this?", a: "If your site should bring customers: yes. Care keeps it secure, fast and current." },
        { q: "How fast do I get help?", a: "You have a dedicated contact and get a timely response." },
        { q: "Can I cancel anytime?", a: "Yes, the care plan is flexible and fair — no long lock-ins." },
        { q: "What does maintenance cost?", a: "Maintenance packages are agreed by scope as a transparent fixed monthly price. After a short look at your website we recommend the fitting package — without oversizing." },
        { q: "What is included in maintenance?", a: "Depending on the package: technical updates, security checks, backups, monitoring and a quota for small changes. That keeps the site fast, secure and up to date." },
        { q: "Do you also maintain content?", a: "Yes, on request: texts, images, prices or news can be maintained as part of the package. Alternatively, we show you how to edit content yourself in the CMS." },
      ],
    },
    ru: {
      tagline: "Обновления, безопасность и поддержка — чтобы сайт постоянно приносил заявки.",
      problemTitle: "Проблема",
      problem:
        "Сайт не бывает «готов навсегда». Без обслуживания он становится небезопасным, устаревшим и медленным — а при проблемах некому позвонить. Именно тогда вы теряете клиентов.",
      solutionTitle: "Наше решение",
      solution:
        "Постоянно заботимся о сайте: регулярные обновления, проверки безопасности, бэкапы и быстрая помощь по вопросам. По желанию продолжаем оптимизировать, чтобы сайт становился лучше.",
      includesTitle: "Всё включено",
      includes: [
        { title: "Регулярные обновления", desc: "Техника и контент остаются актуальными и безопасными." },
        { title: "Безопасность и бэкапы", desc: "Защита и копии, чтобы ничего не потерялось." },
        { title: "Быстрая поддержка", desc: "Постоянный контакт, который знает ваш сайт." },
        { title: "Постоянная оптимизация", desc: "Маленькие улучшения, которые со временем дают много." },
      ],
      outcomesTitle: "Что вы получаете",
      outcomes: ["Всегда актуально и безопасно", "Помощь, когда нужно", "Сайт, который растёт с вами"],
      faq: [
        { q: "Это действительно нужно?", a: "Если сайт должен приводить клиентов — да. Обслуживание держит его безопасным, быстрым и актуальным." },
        { q: "Как быстро будет помощь?", a: "У вас постоянный контакт, ответ приходит оперативно." },
        { q: "Можно отказаться в любой момент?", a: "Да, обслуживание гибкое и честное — без долгих обязательств." },
        { q: "Сколько стоит поддержка?", a: "Пакеты поддержки оформляются по объёму как прозрачная фиксированная ежемесячная цена. После короткого взгляда на ваш сайт рекомендуем подходящий пакет — без избыточности." },
        { q: "Что входит в поддержку?", a: "В зависимости от пакета: технические обновления, проверки безопасности, бэкапы, мониторинг и квота на небольшие правки. Так сайт остаётся быстрым, безопасным и актуальным." },
        { q: "Берёте ли на себя обновление контента?", a: "Да, по желанию: тексты, изображения, цены или новости можем обновлять в рамках пакета. Либо покажем, как менять контент самостоятельно в CMS." },
      ],
    },
  },

  consult: {
    de: {
      tagline: "Ein klarer Plan für Ihr digitales Wachstum — verständlich erklärt.",
      problemTitle: "Das Problem",
      problem:
        "Online-Marketing wirkt oft wie ein Dschungel aus Fachbegriffen. Ohne klaren Plan verbrennt man Geld für Maßnahmen, die nichts bringen — und weiß am Ende nicht, was wirklich funktioniert.",
      solutionTitle: "Unsere Lösung",
      solution:
        "Wir schauen uns Ihr Geschäft, Ihre Ziele und Ihren Markt an und geben Ihnen einen klaren, verständlichen Fahrplan: Was bringt am meisten, in welcher Reihenfolge — und was Sie sich sparen können. Ehrlich und ohne Fachchinesisch.",
      includesTitle: "Das ist alles dabei",
      includes: [
        { title: "Analyse Ihrer Lage", desc: "Wir schauen ehrlich, wo Sie online stehen und was fehlt." },
        { title: "Wettbewerbs-Blick", desc: "Was machen andere — und wo ist Ihre Chance?" },
        { title: "Klarer Fahrplan", desc: "Priorisierte Schritte mit erwartbarem Nutzen." },
        { title: "Verständlich erklärt", desc: "Keine Fachbegriffe — Sie verstehen jede Empfehlung." },
      ],
      outcomesTitle: "Das bringt es Ihnen",
      outcomes: ["Sicherheit bei Entscheidungen", "Kein verschwendetes Budget", "Ein Plan, den Sie verstehen"],
      faq: [
        { q: "Für wen lohnt sich das?", a: "Für alle, die online wachsen wollen, aber nicht sicher sind, wo sie anfangen sollen." },
        { q: "Muss ich danach bei Ihnen buchen?", a: "Nein. Sie bekommen einen klaren Plan — die Umsetzung entscheiden Sie selbst." },
        { q: "Wie läuft das ab?", a: "Ein Gespräch, eine kurze Analyse und ein verständlicher Fahrplan mit Prioritäten." },
        { q: "Was kostet die Digitalberatung?", a: "Das Erstgespräch ist kostenlos und unverbindlich. Weiterführende Beratung vereinbaren wir transparent als Festpreis nach Aufwand — Sie wissen vorher genau, was Sie bekommen." },
        { q: "Was bekomme ich konkret aus der Beratung?", a: "Eine ehrliche Einschätzung Ihrer aktuellen Situation, priorisierte Empfehlungen mit Begründung und realistische nächste Schritte — inklusive Budget-Orientierung, z. B. Landingpage ab 990 € oder Unternehmenswebsite ab 1.990 €." },
        { q: "Setzen Sie die Empfehlungen auch um?", a: "Auf Wunsch ja — aber die Beratung ist ergebnisoffen. Sie können die Empfehlungen auch mit einem anderen Dienstleister oder intern umsetzen; die Unterlagen gehören Ihnen." },
      ],
    },
    en: {
      tagline: "A clear plan for your digital growth — explained in plain language.",
      problemTitle: "The problem",
      problem:
        "Online marketing often feels like a jungle of jargon. Without a clear plan you burn money on things that don't work — and in the end you don't know what actually helps.",
      solutionTitle: "Our solution",
      solution:
        "We look at your business, goals and market and give you a clear, understandable roadmap: what brings the most, in which order — and what you can skip. Honest and without jargon.",
      includesTitle: "Everything included",
      includes: [
        { title: "Analysis of your situation", desc: "We honestly assess where you stand online and what's missing." },
        { title: "Competitor view", desc: "What others do — and where your opportunity lies." },
        { title: "A clear roadmap", desc: "Prioritised steps with expected benefit." },
        { title: "Explained plainly", desc: "No jargon — you understand every recommendation." },
      ],
      outcomesTitle: "What you get",
      outcomes: ["Confidence in your decisions", "No wasted budget", "A plan you understand"],
      faq: [
        { q: "Who is this for?", a: "Anyone who wants to grow online but isn't sure where to start." },
        { q: "Do I have to book you afterwards?", a: "No. You get a clear plan — you decide on the implementation yourself." },
        { q: "How does it work?", a: "A call, a short analysis and an understandable roadmap with priorities." },
        { q: "What does the digital consulting cost?", a: "The first call is free and non-binding. Further consulting is agreed transparently as a fixed price by effort — you know exactly what you get beforehand." },
        { q: "What do I concretely get from the consulting?", a: "An honest assessment of your current situation, prioritized recommendations with reasoning and realistic next steps — including budget orientation, e.g. landing page from €990 or company website from €1,990." },
        { q: "Do you also implement the recommendations?", a: "On request, yes — but the consulting is open-ended. You can also implement the recommendations with another provider or internally; the documents belong to you." },
      ],
    },
    ru: {
      tagline: "Понятный план цифрового роста — без сложных терминов.",
      problemTitle: "Проблема",
      problem:
        "Онлайн-маркетинг часто похож на джунгли из терминов. Без чёткого плана деньги уходят на то, что не работает — и в итоге непонятно, что реально помогает.",
      solutionTitle: "Наше решение",
      solution:
        "Изучаем ваш бизнес, цели и рынок и даём понятный план: что даст больше всего, в каком порядке — и на чём можно сэкономить. Честно и без сложных терминов.",
      includesTitle: "Всё включено",
      includes: [
        { title: "Анализ вашей ситуации", desc: "Честно смотрим, где вы в онлайне и чего не хватает." },
        { title: "Взгляд на конкурентов", desc: "Что делают другие — и где ваша возможность." },
        { title: "Понятный план", desc: "Приоритезированные шаги с ожидаемой пользой." },
        { title: "Объясняем простыми словами", desc: "Без терминов — вы понимаете каждую рекомендацию." },
      ],
      outcomesTitle: "Что вы получаете",
      outcomes: ["Уверенность в решениях", "Никакого слитого бюджета", "План, который вам понятен"],
      faq: [
        { q: "Кому это подходит?", a: "Всем, кто хочет расти онлайн, но не уверен, с чего начать." },
        { q: "Обязательно ли потом заказывать у вас?", a: "Нет. Вы получаете план — реализацию решаете сами." },
        { q: "Как проходит?", a: "Разговор, короткий анализ и понятный план с приоритетами." },
        { q: "Сколько стоит цифровой консалтинг?", a: "Первая консультация бесплатна и ни к чему не обязывает. Дальнейший консалтинг оформляем прозрачно как фикс-цену по объёму — вы заранее точно знаете, что получите." },
        { q: "Что я конкретно получу от консультации?", a: "Честную оценку текущей ситуации, приоритизированные рекомендации с обоснованием и реалистичные следующие шаги — включая ориентир бюджета, например лендинг от 990 € или корпоративный сайт от 1 990 €." },
        { q: "Вы и реализуете рекомендации?", a: "По желанию — да, но консультация ни к чему не привязана. Рекомендации можно реализовать и с другим подрядчиком или своими силами; материалы принадлежат вам." },
      ],
    },
  },
};

export function serviceContent(slug: string, locale: string): ServiceBlock {
  const key = serviceKeyFromSlug(slug);
  const loc = (["de", "en", "ru"].includes(locale) ? locale : "de") as Locale;
  return (CONTENT[key] ?? CONTENT.web)[loc];
}
