import type { AppLocale } from "@/i18n/routing";

type ProjectFaqItem = { q: string; a: string };

type ProjectFaqContent = {
  title: string;
  intro: string;
  items: ProjectFaqItem[];
};

// These are editorial answers for the five published case studies. Add a new
// entry only after checking the actual project scope; never infer a measured
// speed, ranking or conversion gain from a technology label.
const projectFaq: Record<string, Record<AppLocale, ProjectFaqContent>> = {
  "online-buchungen-verdreifacht": {
    de: {
      title: "Fragen zum Projekt Salon Elen",
      intro: "Was die Lösung für Besucherinnen und den Salon konkret einfacher macht.",
      items: [
        {
          q: "Wie finden Kundinnen die passende Behandlung und einen Termin?",
          a: "Die Leistungen sind verständlich gegliedert und mit einem klaren Weg zur Online-Terminbuchung verbunden. So lässt sich erst die Behandlung einordnen und anschließend der nächste Schritt wählen.",
        },
        {
          q: "Was wurde für die mobile Nutzung verbessert?",
          a: "Leistungsinformationen, Terminweg und Kontakt sind auch auf kleinen Bildschirmen gut erreichbar. Die mehrsprachige Nutzerführung hilft zusätzlich Menschen, die sich auf Deutsch, Englisch oder Russisch informieren möchten.",
        },
        {
          q: "Wie wurden Ladezeit, lokale Suche und KI-Antworten berücksichtigt?",
          a: "Die technische Umsetzung berücksichtigt mobile Nutzung und Performance; konkrete Ladezeitwerte werden hier nicht behauptet. Eigenständige Informationen zu Behandlungen und der Bezug zu Halle helfen Suchsystemen, das Angebot einzuordnen, ohne eine Position oder KI-Erwähnung zu garantieren.",
        },
      ],
    },
    en: {
      title: "Questions about the Salon Elen project",
      intro: "How the solution makes the next step clearer for visitors and the salon.",
      items: [
        {
          q: "How do clients find a treatment and book an appointment?",
          a: "Services are organised clearly and connected to a direct online booking path. Visitors can understand a treatment first, then choose the next step.",
        },
        {
          q: "What was considered for mobile visitors?",
          a: "Service information, booking and contact remain easy to reach on a small screen. The multilingual journey also helps people who prefer German, English or Russian.",
        },
        {
          q: "How were loading speed, local search and AI answers considered?",
          a: "The technical implementation considers mobile use and performance; no specific loading-speed result is claimed here. Clear treatment information and the Halle location help search systems understand the offer without guaranteeing a ranking or AI mention.",
        },
      ],
    },
    ru: {
      title: "Вопросы о проекте Salon Elen",
      intro: "Что помогает посетителям и салону быстрее перейти к нужному действию.",
      items: [
        {
          q: "Как клиенту выбрать услугу и записаться?",
          a: "Услуги понятно сгруппированы и связаны с онлайн-записью. Посетитель может сначала разобраться в процедуре, а затем выбрать следующий шаг.",
        },
        {
          q: "Что учтено для пользователей смартфонов?",
          a: "Информация об услугах, запись и контакт доступны и на небольшом экране. Многоязычный путь помогает тем, кому удобнее читать на немецком, английском или русском.",
        },
        {
          q: "Как учтены скорость, локальный поиск и ответы ИИ?",
          a: "Техническая реализация учитывает мобильное использование и производительность; конкретные показатели загрузки здесь не заявлены. Сведения о процедурах и связь с Галле помогают поисковым системам понять предложение без гарантии позиции или упоминания в ответе ИИ.",
        },
      ],
    },
  },
  "neue-liebe-nebra": {
    de: {
      title: "Fragen zum Projekt Neue Liebe",
      intro: "Der Weg von der Restaurant-Entdeckung zur Reservierung.",
      items: [
        {
          q: "Wie finden Gäste Speisekarte, Veranstaltungen und Reservierung?",
          a: "Die Restaurant-Website verbindet Atmosphäre, Speisekarte und aktuelle Angebote mit einem gut erkennbaren Reservierungsweg. Gäste müssen die wichtigsten Informationen nicht über mehrere fremde Plattformen zusammensuchen.",
        },
        {
          q: "Was bringt die Gestaltung auf dem Smartphone?",
          a: "Menü, Öffnungsinformationen und Reservierung sind für die mobile Nutzung übersichtlich angeordnet. Der visuelle Auftritt zeigt das Restaurant, ohne den Weg zur Entscheidung zu verdecken.",
        },
        {
          q: "Wie wurden Ladezeit und lokale Auffindbarkeit berücksichtigt?",
          a: "Die Umsetzung berücksichtigt mobile Performance; eine konkrete Ladezeitmessung wird hier nicht als Projektergebnis ausgegeben. Restaurant, Speisekarte, Veranstaltungen und Standort Nebra sind als klare Themen dargestellt, damit auch Such- und KI-Systeme das Angebot verstehen können, ohne Sichtbarkeit oder Buchungen zu garantieren.",
        },
      ],
    },
    en: {
      title: "Questions about the Neue Liebe project",
      intro: "From discovering the restaurant to making a reservation.",
      items: [
        {
          q: "How do guests find the menu, events and reservations?",
          a: "The restaurant site connects atmosphere, menu and current offers with a clear reservation path. Guests can find essential information without piecing it together across external platforms.",
        },
        {
          q: "What does the design offer on a phone?",
          a: "The menu, opening information and reservation path are arranged for mobile use. The visual presentation shows the restaurant while keeping the next action clear.",
        },
        {
          q: "How were loading speed and local discoverability considered?",
          a: "The implementation considers mobile performance; no specific loading-time measurement is presented as a project result. Restaurant, menu, events and Nebra are clear topics that search and AI systems can interpret, without a promise of visibility or booking gains.",
        },
      ],
    },
    ru: {
      title: "Вопросы о проекте Neue Liebe",
      intro: "Путь от знакомства с рестораном до бронирования.",
      items: [
        {
          q: "Где гость найдёт меню, события и бронирование?",
          a: "Сайт объединяет атмосферу ресторана, меню и актуальные предложения с понятным путём к бронированию. Основную информацию не приходится собирать по сторонним площадкам.",
        },
        {
          q: "Чем удобен дизайн на телефоне?",
          a: "Меню, часы работы и путь к бронированию расположены с учётом мобильного использования. Визуальная подача показывает ресторан и не скрывает главное действие.",
        },
        {
          q: "Как учтены скорость и локальная видимость?",
          a: "Реализация учитывает мобильную производительность; конкретный результат замера скорости здесь не заявлен. Ресторан, меню, события и расположение в Небре представлены как понятные темы для поисковых и ИИ-систем без обещания роста видимости или бронирований.",
        },
      ],
    },
  },
  "direktbuchungen-ohne-portale": {
    de: {
      title: "Fragen zur Waldschlösschen-Projektvorschau",
      intro: "Was die interaktive Vorschau zeigt und was noch kein gemessener Betriebserfolg ist.",
      items: [
        {
          q: "Ist dies bereits die veröffentlichte Hotel-Website?",
          a: "Nein. Gezeigt wird eine interaktive Projektvorschau für Hotel und Restaurant. Sie macht Gestaltung, Inhaltsstruktur und Buchungswege nachvollziehbar, ohne einen produktiven Buchungsbetrieb zu behaupten.",
        },
        {
          q: "Wie führt die Vorschau zu direkten Anfragen und Buchungen?",
          a: "Zimmer, Restaurant und Angebote erhalten klar erkennbare Einstiege. Gäste können von der passenden Information zu einer direkten Buchungs- oder Kontaktmöglichkeit wechseln, statt erst ein Portal suchen zu müssen.",
        },
        {
          q: "Was ist für mobile Nutzung und Auffindbarkeit vorbereitet?",
          a: "Die Vorschau ordnet Angebote und regionale Informationen auch für kleine Bildschirme verständlich. Diese Inhaltsbasis kann spätere SEO/GEO/AIO-Arbeit unterstützen; Ladezeiten, Rankings und Direktbuchungen der Live-Version sind damit nicht belegt.",
        },
      ],
    },
    en: {
      title: "Questions about the Waldschlösschen preview",
      intro: "What the interactive preview demonstrates and what is not yet a measured live result.",
      items: [
        {
          q: "Is this already the published hotel website?",
          a: "No. This is an interactive preview for the hotel and restaurant. It demonstrates design, content structure and booking paths without presenting the preview as a live booking operation.",
        },
        {
          q: "How does the preview guide direct inquiries and bookings?",
          a: "Rooms, restaurant and offers have clear entry points. Guests can move from the relevant information to a direct booking or contact option without first looking for a portal.",
        },
        {
          q: "What is prepared for mobile use and discoverability?",
          a: "The preview organises offers and regional information for smaller screens. This content foundation can support later SEO and AI search work; it does not prove live speed, rankings or direct-booking results.",
        },
      ],
    },
    ru: {
      title: "Вопросы о превью Waldschlösschen",
      intro: "Что показывает интерактивная версия и какие результаты ещё не измерены.",
      items: [
        {
          q: "Это уже опубликованный сайт отеля?",
          a: "Нет. Это интерактивная проектная версия для отеля и ресторана. Она показывает дизайн, структуру содержания и путь к бронированию, но не выдаётся за работающую систему бронирования.",
        },
        {
          q: "Как превью ведёт к прямому запросу или бронированию?",
          a: "Для номеров, ресторана и предложений предусмотрены понятные входы. Гость может перейти от нужной информации к прямому бронированию или связи без поиска агрегатора.",
        },
        {
          q: "Что подготовлено для смартфонов и поиска?",
          a: "Предложения и региональная информация организованы и для небольших экранов. Эта основа может помочь дальнейшей SEO/GEO/AIO-работе, но не доказывает скорость, позиции или прямые бронирования опубликованного сайта.",
        },
      ],
    },
  },
  "qualifizierte-bauanfragen": {
    de: {
      title: "Fragen zum Projekt SorgfaltBau",
      intro: "Wie die Website Bauleistungen erklärt und den Kontakt erleichtert.",
      items: [
        {
          q: "Wie erkennen Interessenten, welche Bauleistungen angeboten werden?",
          a: "Die Leistungen werden in einer klaren Inhaltsstruktur statt in einer allgemeinen Werbeaussage präsentiert. So können Interessenten das passende Thema finden und ihren Bedarf genauer beschreiben.",
        },
        {
          q: "Was erleichtert eine qualifizierte Anfrage?",
          a: "Leistungsinformationen und Kontaktwege sind miteinander verbunden und auch mobil gut lesbar. Der nächste Schritt bleibt sichtbar, nachdem sich ein Besucher über das Angebot informiert hat.",
        },
        {
          q: "Welche Grundlage für Ladezeit und SEO/GEO/AIO wurde berücksichtigt?",
          a: "Mobile Lesbarkeit und Performance gehören zur technischen Planung; konkrete Geschwindigkeitswerte sind hier nicht belegt. Verständliche Leistungsinhalte, regionale Einordnung und eine saubere Seitenstruktur helfen Menschen und Suchsystemen bei der Orientierung, ohne eine Position oder Zahl an Bauanfragen zu versprechen.",
        },
      ],
    },
    en: {
      title: "Questions about the SorgfaltBau project",
      intro: "How the website explains construction services and makes contact easier.",
      items: [
        {
          q: "How can visitors identify the right construction service?",
          a: "Services are presented in a clear content structure instead of a broad marketing claim. Visitors can find the relevant topic and describe their needs more precisely.",
        },
        {
          q: "What makes a useful inquiry easier?",
          a: "Service information and contact paths are connected and readable on mobile. The next step remains clear after someone has explored the offer.",
        },
        {
          q: "What foundation supports loading speed and SEO or AI search?",
          a: "Mobile readability and performance are part of the technical plan; specific speed figures are not evidenced here. Clear services, regional context and page structure help people and search systems navigate the offer without promising a rank or number of inquiries.",
        },
      ],
    },
    ru: {
      title: "Вопросы о проекте SorgfaltBau",
      intro: "Как сайт объясняет строительные услуги и упрощает обращение.",
      items: [
        {
          q: "Как посетителю понять, какие строительные услуги доступны?",
          a: "Услуги представлены в понятной структуре вместо общей рекламной фразы. Человек может найти подходящее направление и точнее описать свою задачу.",
        },
        {
          q: "Что помогает отправить содержательный запрос?",
          a: "Описание услуг связано с контактными действиями и читается на телефоне. После знакомства с предложением посетителю понятен следующий шаг.",
        },
        {
          q: "Какая основа для скорости и SEO/GEO/AIO учтена?",
          a: "Мобильная читаемость и производительность входят в техническую задачу; конкретные показатели скорости здесь не подтверждены. Описания услуг, региональный контекст и структура страниц помогают людям и поисковым системам ориентироваться без обещания позиции или числа заявок.",
        },
      ],
    },
  },
  "glaserei-schubert": {
    de: {
      title: "Fragen zur Glaserei-Schubert-Projektvorschau",
      intro: "Die Stärken der Handwerkspräsentation und der Status der Vorschau.",
      items: [
        {
          q: "Ist die gezeigte Glaserei-Website bereits live?",
          a: "Gezeigt wird eine interaktive Projektvorschau. Sie veranschaulicht, wie Leistungen, Referenzen und Kontaktwege für eine Glaserei strukturiert werden können; daraus leiten wir keine veröffentlichten Geschäftsergebnisse ab.",
        },
        {
          q: "Wie finden Kunden eine passende Leistung oder Referenz?",
          a: "Leistungsbereiche und Projektbeispiele sind getrennt und gut lesbar angeordnet. Wer eine konkrete Glasarbeit sucht, kann sich orientieren und anschließend Kontakt aufnehmen.",
        },
        {
          q: "Was ist für Ladezeit, mobile Nutzung und lokale Suche vorgesehen?",
          a: "Die Vorschau setzt auf mobile Lesbarkeit, klare Kontaktwege und eine auf Performance ausgerichtete Umsetzung; gemessene Ladezeiten einer Live-Version liegen hier nicht vor. Leistungs- und Standortinformationen bilden eine Grundlage für Local SEO und verständliche KI-Antworten, ohne ein Ranking zu versprechen.",
        },
      ],
    },
    en: {
      title: "Questions about the Glaserei Schubert preview",
      intro: "The strengths of the trade-business presentation and the preview status.",
      items: [
        {
          q: "Is the showcased glazing website already live?",
          a: "This is an interactive project preview. It shows how services, references and contact paths can be structured for a glazing business; it is not evidence of published business results.",
        },
        {
          q: "How do clients find a service or relevant reference?",
          a: "Service areas and project examples are separated and easy to read. Someone looking for a particular glazing service can orient themselves, then get in touch.",
        },
        {
          q: "What supports loading speed, mobile use and local search?",
          a: "The preview prioritises mobile readability, clear contact paths and a performance-aware implementation; there is no measured live-site speed result here. Service and location information provide a foundation for local SEO and understandable AI answers, without promising a ranking.",
        },
      ],
    },
    ru: {
      title: "Вопросы о превью Glaserei Schubert",
      intro: "Сильные стороны презентации мастерской и статус проектной версии.",
      items: [
        {
          q: "Показанный сайт стекольной мастерской уже опубликован?",
          a: "Это интерактивная проектная версия. Она показывает, как можно организовать услуги, примеры работ и контакты мастерской; подтверждённых бизнес-результатов опубликованного сайта из неё не следует.",
        },
        {
          q: "Как клиент найдёт нужную услугу или пример работы?",
          a: "Направления работы и примеры проектов разделены и читаются без труда. Человек может сориентироваться в конкретной задаче и затем связаться с мастерской.",
        },
        {
          q: "Что учтено для скорости, смартфонов и локального поиска?",
          a: "В превью сделан акцент на мобильной читаемости, понятной связи и производительности; замеров скорости опубликованного сайта здесь нет. Сведения об услугах и местоположении создают основу для Local SEO и понятных ответов ИИ без обещания позиции.",
        },
      ],
    },
  },
};

export function getProjectFaq(locale: AppLocale, canonicalSlug: string) {
  return projectFaq[canonicalSlug]?.[locale] ?? null;
}
