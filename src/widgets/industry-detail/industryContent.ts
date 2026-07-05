/**
 * Rich, plain-language sales content per industry, keyed by a canonical key
 * resolved from the slug or the industry name. Three locales. Guarantees the
 * /branchen/[slug] page is a full landing page even without DB content.
 */

export type IndustryBlock = {
  tagline: string;
  painsTitle: string;
  pains: string[];
  solutionTitle: string;
  solution: string;
  featuresTitle: string;
  features: { title: string; desc: string }[];
  resultsTitle: string;
  results: string[];
  faq: { q: string; a: string }[];
};

type Locale = "de" | "en" | "ru";

// Resolve industry key from slug fragments or the (localised) name.
const KEYS: { key: string; match: string[] }[] = [
  { key: "hotels", match: ["hotel", "gastgeber", "pension", "otel", "gostinic"] },
  { key: "restaurants", match: ["restaurant", "gastro", "cafe", "kafe", "restoran"] },
  { key: "beauty", match: ["beauty", "salon", "friseur", "kosmetik", "salon", "krasot", "parikmaher"] },
  { key: "bau", match: ["bau", "construction", "stroitel"] },
  { key: "handwerk", match: ["handwerk", "trade", "crafts", "remesl", "master"] },
  { key: "arzt", match: ["arzt", "praxis", "clinic", "medic", "medcentr", "doctor", "vrach", "klinik", "praxen"] },
  { key: "immobilien", match: ["immobil", "estate", "makler", "nedvizh"] },
  { key: "kanzlei", match: ["kanzlei", "law", "anwalt", "legal", "jurist", "yurist", "advokat"] },
];

export function industryKeyFrom(slug: string, name: string): string {
  const hay = `-${slug.toLowerCase()}-${name.toLowerCase()}-`;
  const hit = KEYS.find((k) => k.match.some((m) => hay.includes(m)));
  return hit?.key ?? "handwerk";
}

const C: Record<string, Record<Locale, IndustryBlock>> = {
  hotels: {
    de: {
      tagline: "Mehr Direktbuchungen — weniger Provision an die Buchungsportale.",
      painsTitle: "Das kostet Sie heute Geld",
      pains: [
        "Booking & Co. nehmen bis zu 18 % Provision pro Buchung.",
        "Gäste finden Ihr Hotel online schwer oder buchen über Dritte.",
        "Die alte Seite zeigt keine freien Zimmer und kein Vertrauen.",
      ],
      solutionTitle: "Unsere Lösung für Ihr Hotel",
      solution:
        "Wir bauen eine Website, die Gäste direkt bei Ihnen buchen lässt — schnell, mobil und vertrauenswürdig. Mit Direktbuchung, ansprechenden Bildern und lokaler Sichtbarkeit holen Sie Buchungen aus den Portalen zurück.",
      featuresTitle: "Das ist dabei",
      features: [
        { title: "Direktbuchung", desc: "Anbindung an Ihr Buchungssystem — ohne Portal-Provision." },
        { title: "Bildstarke Präsentation", desc: "Zimmer und Ambiente, die Lust auf den Aufenthalt machen." },
        { title: "Lokal gefunden", desc: "Sichtbar bei „Hotel in …“ und auf Google Maps." },
        {
          title: "Mehrsprachig nach Bedarf",
          desc: "DE/EN/RU sind inklusive — weitere Sprachen ergänzen wir passend zu Ihren Gästen.",
        },
      ],
      resultsTitle: "Das bringt es Ihnen",
      results: ["Mehr Direktbuchungen", "Weniger Provisionskosten", "Gäste aus Ihrer Region und darüber hinaus"],
      faq: [
        { q: "Können Sie mein Buchungssystem anbinden?", a: "In der Regel ja — wir integrieren gängige Buchungstools, damit Gäste direkt bei Ihnen buchen." },
        { q: "Lohnt sich das gegenüber Booking?", a: "Jede Direktbuchung spart Provision. Schon wenige pro Monat rechnen sich schnell." },
        { q: "Was kostet eine Hotel-Website?", a: "Das hängt vom Umfang ab: Eine moderne Präsentationsseite mit Zimmern, Bildern und Anfrage startet meist ab 990 €. Mit Direktbuchung, Mehrsprachigkeit und Portal-Anbindung liegt das Projekt eher ab 1.990 € oder wird individuell kalkuliert — immer als Festpreis nach dem kostenlosen Erstgespräch." },
        { q: "Wie finden Gäste aus Halle und Leipzig mein Haus?", a: "Über lokales SEO: Wir optimieren die Seite für Suchanfragen wie „Hotel Halle Saale“ oder „Pension Saalekreis“, verknüpfen sie mit Ihrem Google Business Profil und sorgen für konsistente Daten auf Google Maps." },
        { q: "Empfehlen KI-Systeme wie ChatGPT mein Hotel?", a: "Die Chance steigt deutlich, wenn die Website klare Fakten liefert: Lage, Zimmer, Ausstattung, Preise und Antworten auf typische Gästefragen. Genau diese GEO/AIO-Struktur bauen wir ein — mit FAQ-Bereichen und strukturierten Daten." },
        { q: "Brauche ich mehrere Sprachen?", a: "Für internationale Gäste lohnt sich das fast immer. Deutsch, Englisch und Russisch sind inklusive — jede Sprachversion mit eigenen URLs und sauberem hreflang, damit Google und KI-Suchen die richtige Version anzeigen." },
      ],
    },
    en: {
      tagline: "More direct bookings — less commission to the booking portals.",
      painsTitle: "What it costs you today",
      pains: [
        "Booking & co. take up to 18 % commission per booking.",
        "Guests struggle to find your hotel online or book via third parties.",
        "The old site shows no availability and builds no trust.",
      ],
      solutionTitle: "Our solution for your hotel",
      solution:
        "We build a website that lets guests book directly with you — fast, mobile and trustworthy. With direct booking, appealing photos and local visibility you win bookings back from the portals.",
      featuresTitle: "What's included",
      features: [
        { title: "Direct booking", desc: "Connected to your booking system — no portal commission." },
        { title: "Photo-rich presentation", desc: "Rooms and atmosphere that make people want to stay." },
        { title: "Found locally", desc: "Visible for 'hotel in …' and on Google Maps." },
        {
          title: "Multilingual as needed",
          desc: "DE/EN/RU are included — we add further languages to match your guests.",
        },
      ],
      resultsTitle: "What you get",
      results: ["More direct bookings", "Lower commission costs", "Guests from your region and beyond"],
      faq: [
        { q: "Can you connect my booking system?", a: "Usually yes — we integrate common booking tools so guests book directly with you." },
        { q: "Is it worth it versus Booking?", a: "Every direct booking saves commission. Even a few a month pay off quickly." },
        { q: "What does a hotel website cost?", a: "It depends on scope: a modern presentation site with rooms, photos and an inquiry path usually starts at €990. With direct booking, multiple languages and portal connections, the project tends to start at €1,990 or is quoted individually — always as a fixed price after the free initial call." },
        { q: "How do guests from Halle and Leipzig find my hotel?", a: "Through local SEO: we optimize the site for searches like 'hotel Halle Saale' or 'guesthouse Saalekreis', connect it with your Google Business Profile and keep your data consistent on Google Maps." },
        { q: "Will AI systems like ChatGPT recommend my hotel?", a: "The chances rise clearly when the website delivers clear facts: location, rooms, amenities, prices and answers to typical guest questions. That is exactly the GEO/AIO structure we build in — with FAQ sections and structured data." },
        { q: "Do I need multiple languages?", a: "For international guests it is almost always worth it. German, English and Russian are included — each language version with its own URLs and clean hreflang, so Google and AI search show the right version." },
      ],
    },
    ru: {
      tagline: "Больше прямых броней — меньше комиссии площадкам бронирования.",
      painsTitle: "Что сегодня стоит вам денег",
      pains: [
        "Booking и др. берут до 18 % комиссии за бронь.",
        "Гостям трудно найти ваш отель или они бронируют через посредников.",
        "Старый сайт не показывает свободные номера и не вызывает доверия.",
      ],
      solutionTitle: "Наше решение для вашего отеля",
      solution:
        "Делаем сайт, на котором гости бронируют напрямую у вас — быстро, на телефоне и с доверием. Прямое бронирование, привлекательные фото и локальная видимость возвращают брони с площадок.",
      featuresTitle: "Что входит",
      features: [
        { title: "Прямое бронирование", desc: "Подключение к вашей системе — без комиссии площадок." },
        { title: "Яркая презентация", desc: "Номера и атмосфера, ради которых хочется приехать." },
        { title: "Находят локально", desc: "Видно по «отель в …» и на Google Maps." },
        {
          title: "Мультиязычность под ваших гостей",
          desc: "DE/EN/RU включены — добавим другие языки с учётом вашей аудитории.",
        },
      ],
      resultsTitle: "Что вы получаете",
      results: ["Больше прямых броней", "Меньше расходов на комиссию", "Гости из региона и не только"],
      faq: [
        { q: "Подключите мою систему бронирования?", a: "Обычно да — интегрируем популярные инструменты, чтобы гости бронировали напрямую." },
        { q: "Выгоднее ли это, чем Booking?", a: "Каждая прямая бронь экономит комиссию. Даже несколько в месяц быстро окупаются." },
        { q: "Сколько стоит сайт отеля?", a: "Зависит от объёма: современный презентационный сайт с номерами, фото и формой запроса — обычно от 990 €. С прямым бронированием, несколькими языками и интеграциями проект чаще начинается от 1 990 € или считается индивидуально — всегда фикс-цена после бесплатной консультации." },
        { q: "Как гости из Галле и Лейпцига найдут мой отель?", a: "Через локальное SEO: оптимизируем сайт под запросы вроде «Hotel Halle Saale» или «Pension Saalekreis», связываем его с профилем Google Business и следим за консистентностью данных на Google Maps." },
        { q: "Порекомендует ли ChatGPT мой отель?", a: "Шансы заметно растут, когда сайт даёт ясные факты: расположение, номера, оснащение, цены и ответы на типичные вопросы гостей. Именно такую GEO/AIO-структуру мы и строим — с FAQ-блоками и структурированными данными." },
        { q: "Нужно ли несколько языков?", a: "Для международных гостей — почти всегда да. Немецкий, английский и русский включены: каждая языковая версия со своими URL и корректным hreflang, чтобы Google и ИИ-поиск показывали нужную версию." },
      ],
    },
  },

  restaurants: {
    de: {
      tagline: "Mehr Reservierungen und Bestellungen — direkt über Ihre Seite.",
      painsTitle: "Das kennen viele Gastronomen",
      pains: [
        "Gäste suchen die Speisekarte und finden nur ein altes PDF.",
        "Reservierungen laufen umständlich über das Telefon.",
        "Lieferportale kassieren hohe Provisionen mit.",
      ],
      solutionTitle: "Unsere Lösung für Ihr Restaurant",
      solution:
        "Eine appetitliche, schnelle Website mit aktueller Speisekarte, einfacher Online-Reservierung und Bestellmöglichkeit. So kommen mehr Gäste an den Tisch — und mehr Bestellungen ohne hohe Portalgebühren.",
      featuresTitle: "Das ist dabei",
      features: [
        { title: "Digitale Speisekarte", desc: "Jederzeit aktuell — Sie pflegen sie selbst." },
        { title: "Online-Reservierung", desc: "Tische buchen rund um die Uhr, ohne Telefonstress." },
        { title: "Appetitliche Bilder", desc: "Gerichte und Ambiente, die hungrig machen." },
        { title: "Lokal sichtbar", desc: "Gefunden bei „Restaurant in …“ und auf Google Maps." },
      ],
      resultsTitle: "Das bringt es Ihnen",
      results: ["Mehr Reservierungen", "Weniger Telefon-Aufwand", "Treue Stammgäste"],
      faq: [
        { q: "Kann ich die Speisekarte selbst ändern?", a: "Ja — über einen einfachen Admin-Bereich, jederzeit und ohne Technikwissen." },
        { q: "Geht auch Online-Reservierung?", a: "Ja, wir binden eine einfache Reservierung oder ein bestehendes Tool ein." },
        { q: "Was kostet eine Restaurant-Website?", a: "Eine appetitliche Website mit Speisekarte, Bildern und Kontakt startet meist ab 990 €; ein sehr kompakter Onepager ist ab 600 € möglich. Mit Online-Reservierung, Bestellfunktion oder Mehrsprachigkeit liegt das Projekt eher ab 1.990 € oder wird individuell kalkuliert." },
        { q: "Wie werde ich bei „Restaurant Halle“ gefunden?", a: "Mit lokalem SEO: schnelle Seite, aktuelle Speisekarte als Text statt PDF, Öffnungszeiten, strukturierte Daten und ein gepflegtes Google Business Profil — so erscheinen Sie in der lokalen Suche und auf Google Maps." },
        { q: "Empfehlen KI-Systeme wie ChatGPT mein Restaurant?", a: "Gäste fragen KI heute direkt: „Wo gut essen in Halle?“ Genannt werden Restaurants mit klaren Angaben zu Küche, Preisen, Öffnungszeiten und Atmosphäre. Wir strukturieren genau diese Inhalte maschinenlesbar (GEO/AIO)." },
        { q: "Komme ich von den hohen Portal-Provisionen weg?", a: "Schrittweise ja: Direkte Reservierungen und Bestellungen über die eigene Website sparen Provision bei jeder Buchung. Zusammen mit Google Business Profil und lokaler Sichtbarkeit wird Ihre Seite zum eigenen Kanal — unabhängig von Portalen." },
      ],
    },
    en: {
      tagline: "More reservations and orders — straight through your site.",
      painsTitle: "Many restaurateurs know this",
      pains: [
        "Guests look for the menu and only find an old PDF.",
        "Reservations are clumsy and run only by phone.",
        "Delivery portals take high commissions.",
      ],
      solutionTitle: "Our solution for your restaurant",
      solution:
        "An appetising, fast website with an up-to-date menu, easy online reservations and ordering. More guests at the table — and more orders without high portal fees.",
      featuresTitle: "What's included",
      features: [
        { title: "Digital menu", desc: "Always current — you maintain it yourself." },
        { title: "Online reservations", desc: "Book tables around the clock, no phone stress." },
        { title: "Appetising photos", desc: "Dishes and atmosphere that make people hungry." },
        { title: "Locally visible", desc: "Found for 'restaurant in …' and on Google Maps." },
      ],
      resultsTitle: "What you get",
      results: ["More reservations", "Less phone effort", "Loyal regulars"],
      faq: [
        { q: "Can I edit the menu myself?", a: "Yes — via a simple admin area, any time and with no tech knowledge." },
        { q: "Is online reservation possible?", a: "Yes, we add a simple reservation flow or integrate your existing tool." },
        { q: "What does a restaurant website cost?", a: "An appetizing website with menu, photos and contact usually starts at €990; a very compact one-pager is possible from €600. With online reservation, ordering or multiple languages, the project tends to start at €1,990 or is quoted individually." },
        { q: "How do I get found for 'restaurant Halle'?", a: "With local SEO: a fast site, a current menu as text instead of PDF, opening hours, structured data and a well-maintained Google Business Profile — so you appear in local search and on Google Maps." },
        { q: "Will AI systems like ChatGPT recommend my restaurant?", a: "Guests now ask AI directly: 'Where to eat well in Halle?' The restaurants mentioned have clear information on cuisine, prices, opening hours and atmosphere. We structure exactly this content in machine-readable form (GEO/AIO)." },
        { q: "Can I get away from high portal commissions?", a: "Step by step, yes: direct reservations and orders via your own website save commission on every booking. Together with your Google Business Profile and local visibility, your site becomes your own channel — independent of portals." },
      ],
    },
    ru: {
      tagline: "Больше броней и заказов — прямо через ваш сайт.",
      painsTitle: "Это знакомо многим рестораторам",
      pains: [
        "Гости ищут меню и находят лишь старый PDF.",
        "Брони идут неудобно — только по телефону.",
        "Сервисы доставки забирают высокую комиссию.",
      ],
      solutionTitle: "Наше решение для вашего ресторана",
      solution:
        "Аппетитный быстрый сайт с актуальным меню, простой онлайн-бронью и заказом. Больше гостей за столами — и больше заказов без высоких комиссий площадок.",
      featuresTitle: "Что входит",
      features: [
        { title: "Цифровое меню", desc: "Всегда актуальное — вы ведёте его сами." },
        { title: "Онлайн-бронь", desc: "Столики бронируют круглосуточно, без телефона." },
        { title: "Аппетитные фото", desc: "Блюда и атмосфера, от которых хочется есть." },
        { title: "Локальная видимость", desc: "Находят по «ресторан в …» и на Google Maps." },
      ],
      resultsTitle: "Что вы получаете",
      results: ["Больше броней", "Меньше звонков", "Лояльные постоянные гости"],
      faq: [
        { q: "Смогу сам менять меню?", a: "Да — через простую админ-панель, в любой момент и без технических знаний." },
        { q: "Возможна онлайн-бронь?", a: "Да, добавим простую бронь или подключим ваш инструмент." },
        { q: "Сколько стоит сайт ресторана?", a: "Аппетитный сайт с меню, фото и контактами — обычно от 990 €; совсем компактный one-pager возможен от 600 €. С онлайн-бронированием, заказами или несколькими языками проект чаще начинается от 1 990 € или считается индивидуально." },
        { q: "Как попасть в выдачу по «Restaurant Halle»?", a: "Через локальное SEO: быстрый сайт, актуальное меню текстом вместо PDF, часы работы, структурированные данные и ухоженный профиль Google Business — так вы появляетесь в локальном поиске и на Google Maps." },
        { q: "Порекомендует ли ChatGPT мой ресторан?", a: "Гости сегодня спрашивают ИИ напрямую: «Где вкусно поесть в Галле?» Называют рестораны с ясной информацией о кухне, ценах, часах работы и атмосфере. Мы структурируем именно этот контент в машиночитаемом виде (GEO/AIO)." },
        { q: "Можно ли уйти от высоких комиссий порталов?", a: "Постепенно — да: прямые брони и заказы через собственный сайт экономят комиссию с каждого заказа. Вместе с профилем Google Business и локальной видимостью сайт становится вашим собственным каналом — независимым от порталов." },
      ],
    },
  },

  beauty: {
    de: {
      tagline: "Volle Terminkalender — Kundinnen buchen online, rund um die Uhr.",
      painsTitle: "Das bremst viele Salons",
      pains: [
        "Termine nur per Telefon — verpasste Anrufe sind verlorene Kundinnen.",
        "Neue Kundinnen finden Sie online kaum.",
        "Keine schönen Vorher-Nachher-Bilder, die überzeugen.",
      ],
      solutionTitle: "Unsere Lösung für Ihren Salon",
      solution:
        "Eine stylische Website mit Online-Terminbuchung, Leistungsübersicht und echten Ergebnissen in Bildern. So buchen Kundinnen selbstständig — auch abends und am Wochenende — und Ihr Kalender füllt sich.",
      featuresTitle: "Das ist dabei",
      features: [
        { title: "Online-Termine", desc: "Buchung rund um die Uhr — weniger Telefon, mehr Termine." },
        { title: "Leistungen & Preise", desc: "Klar dargestellt, damit Kundinnen sofort verstehen." },
        { title: "Vorher-Nachher", desc: "Echte Ergebnisse, die Vertrauen schaffen." },
        { title: "Lokal gefunden", desc: "Sichtbar bei „Friseur/Kosmetik in …“." },
      ],
      resultsTitle: "Das bringt es Ihnen",
      results: ["Mehr gebuchte Termine", "Weniger Telefon-Stress", "Neue Kundinnen aus der Region"],
      faq: [
        { q: "Welches Buchungstool nutzen Sie?", a: "Wir binden ein einfaches Online-Buchungstool ein, das zu Ihrem Salon passt." },
        { q: "Kann ich Preise selbst ändern?", a: "Ja, Leistungen und Preise pflegen Sie jederzeit selbst." },
        { q: "Was kostet eine Website für Salon oder Studio?", a: "Eine moderne Website/Landingpage mit Leistungen, Bildern, Vertrauen und SEO-Basis startet meist ab 990 €; ein sehr kompakter Onepager ab 600 €. Online-Terminbuchung, mehrere Sprachen oder Integrationen sind zusätzlicher Umfang — solche Projekte liegen eher ab 1.990 € oder werden individuell kalkuliert." },
        { q: "Wie werde ich bei „Friseur Halle“ oder „Kosmetik Leipzig“ gefunden?", a: "Mit lokalem SEO: klare Leistungsseiten, Preise, Bewertungen, strukturierte Daten und ein gepflegtes Google Business Profil. So erscheinen Sie in der lokalen Suche, auf Google Maps — und zunehmend in KI-Antworten." },
        { q: "Empfehlen KI-Systeme wie ChatGPT meinen Salon?", a: "Kundinnen fragen KI bereits nach Salon-Empfehlungen. Genannt wird, wer klare, maschinenlesbare Angaben zu Leistungen, Preisen, Lage und Terminen liefert. Diese GEO/AIO-Struktur bauen wir mit FAQ und strukturierten Daten ein." },
        { q: "Reduziert Online-Buchung wirklich meinen Aufwand?", a: "Ja: Kundinnen buchen rund um die Uhr, automatische Bestätigungen reduzieren Telefonzeit und No-Shows. Instagram bleibt Ihr Schaufenster — die Website wandelt Follower in feste Termine um." },
      ],
    },
    en: {
      tagline: "A full calendar — clients book online, around the clock.",
      painsTitle: "What slows many salons down",
      pains: [
        "Appointments only by phone — missed calls are lost clients.",
        "New clients barely find you online.",
        "No nice before/after photos that convince.",
      ],
      solutionTitle: "Our solution for your salon",
      solution:
        "A stylish website with online booking, a clear service list and real results in photos. Clients book themselves — even evenings and weekends — and your calendar fills up.",
      featuresTitle: "What's included",
      features: [
        { title: "Online booking", desc: "Booking around the clock — less phone, more appointments." },
        { title: "Services & prices", desc: "Clearly shown so clients understand instantly." },
        { title: "Before/after", desc: "Real results that build trust." },
        { title: "Found locally", desc: "Visible for 'hairdresser/beauty in …'." },
      ],
      resultsTitle: "What you get",
      results: ["More booked appointments", "Less phone stress", "New clients from the region"],
      faq: [
        { q: "Which booking tool do you use?", a: "We integrate a simple online booking tool that fits your salon." },
        { q: "Can I change prices myself?", a: "Yes, you maintain services and prices yourself any time." },
        { q: "What does a salon or studio website cost?", a: "A modern website/landing page with services, images, trust elements and an SEO base usually starts at €990; a very compact one-pager from €600. Online booking, multiple languages or integrations are additional scope — such projects tend to start at €1,990 or are quoted individually." },
        { q: "How do I get found for 'hairdresser Halle' or 'cosmetics Leipzig'?", a: "With local SEO: clear service pages, prices, reviews, structured data and a well-maintained Google Business Profile. That's how you appear in local search, on Google Maps — and increasingly in AI answers." },
        { q: "Will AI systems like ChatGPT recommend my salon?", a: "Clients already ask AI for salon recommendations. The ones mentioned provide clear, machine-readable information on services, prices, location and appointments. We build in exactly this GEO/AIO structure with FAQ and structured data." },
        { q: "Does online booking really reduce my workload?", a: "Yes: clients book around the clock, automatic confirmations reduce phone time and no-shows. Instagram stays your shop window — the website turns followers into booked appointments." },
      ],
    },
    ru: {
      tagline: "Полная запись — клиентки бронируют онлайн круглосуточно.",
      painsTitle: "Что тормозит многие салоны",
      pains: [
        "Запись только по телефону — пропущенный звонок = потерянная клиентка.",
        "Новые клиентки почти не находят вас онлайн.",
        "Нет красивых фото «до/после», которые убеждают.",
      ],
      solutionTitle: "Наше решение для вашего салона",
      solution:
        "Стильный сайт с онлайн-записью, списком услуг и реальными результатами в фото. Клиентки записываются сами — даже вечером и в выходные — и календарь заполняется.",
      featuresTitle: "Что входит",
      features: [
        { title: "Онлайн-запись", desc: "Бронь круглосуточно — меньше телефона, больше записей." },
        { title: "Услуги и цены", desc: "Понятно показаны, чтобы клиентка сразу всё поняла." },
        { title: "До/после", desc: "Реальные результаты, вызывающие доверие." },
        { title: "Находят локально", desc: "Видно по «парикмахер/косметология в …»." },
      ],
      resultsTitle: "Что вы получаете",
      results: ["Больше записей", "Меньше телефонного стресса", "Новые клиентки из региона"],
      faq: [
        { q: "Какой инструмент записи используете?", a: "Подключаем простой онлайн-инструмент записи под ваш салон." },
        { q: "Смогу сам менять цены?", a: "Да, услуги и цены вы ведёте сами в любой момент." },
        { q: "Сколько стоит сайт салона или студии?", a: "Современный сайт/лендинг с услугами, фото, доверием и SEO-базой — обычно от 990 €; совсем компактный one-pager — от 600 €. Онлайн-запись, несколько языков или интеграции — дополнительный объём: такие проекты чаще от 1 990 € или считаются индивидуально." },
        { q: "Как попасть в выдачу по «Friseur Halle» или «Kosmetik Leipzig»?", a: "Через локальное SEO: понятные страницы услуг, цены, отзывы, структурированные данные и ухоженный профиль Google Business. Так вы появляетесь в локальном поиске, на Google Maps — и всё чаще в ответах ИИ." },
        { q: "Порекомендует ли ChatGPT мой салон?", a: "Клиентки уже спрашивают ИИ о рекомендациях салонов. Называют тех, у кого ясная машиночитаемая информация об услугах, ценах, расположении и записи. Именно такую GEO/AIO-структуру мы и встраиваем — с FAQ и структурированными данными." },
        { q: "Онлайн-запись правда снижает нагрузку?", a: "Да: клиенты записываются круглосуточно, автоматические подтверждения сокращают телефонное время и «неявки». Instagram остаётся вашей витриной — сайт превращает подписчиков в записанных клиентов." },
      ],
    },
  },

  bau: {
    de: {
      tagline: "Qualifizierte Bauanfragen — statt Anrufe, die nichts bringen.",
      painsTitle: "Das kennen Bauunternehmen",
      pains: [
        "Viele Anfragen passen nicht zum Angebot — Zeitverschwendung.",
        "Referenzprojekte sind online nicht sichtbar.",
        "Die Seite wirkt nicht seriös genug für größere Aufträge.",
      ],
      solutionTitle: "Unsere Lösung für Ihr Bauunternehmen",
      solution:
        "Eine seriöse Website, die Ihre Referenzen zeigt und gezielt passende Anfragen bringt. Klare Leistungen, überzeugende Projektbilder und einfache Kontaktwege sorgen für qualifizierte Anfragen statt unpassender Anrufe.",
      featuresTitle: "Das ist dabei",
      features: [
        { title: "Referenz-Projekte", desc: "Ihre besten Arbeiten überzeugen neue Kunden." },
        { title: "Klare Leistungen", desc: "Damit nur passende Anfragen reinkommen." },
        { title: "Seriöser Auftritt", desc: "Vertrauen für größere Aufträge." },
        { title: "Anfrage-Formular", desc: "Einfacher Weg für ernsthafte Interessenten." },
      ],
      resultsTitle: "Das bringt es Ihnen",
      results: ["Qualifiziertere Anfragen", "Weniger Zeitverschwendung", "Größere und bessere Aufträge"],
      faq: [
        { q: "Können Sie meine Projekte einpflegen?", a: "Ja — wir präsentieren Ihre Referenzen und Sie ergänzen neue selbst." },
        { q: "Bekomme ich passendere Anfragen?", a: "Durch klare Leistungen und gezielte Inhalte ja — weniger unpassende Anrufe." },
        { q: "Was kostet eine Website für ein Bauunternehmen?", a: "Eine überzeugende Unternehmensseite mit Leistungen, Referenzen und Anfrageweg startet meist ab 990 €. Mit mehreren Leistungsseiten, Projektgalerie, SEO-Landingpages oder Mehrsprachigkeit liegt das Projekt eher ab 1.990 € oder wird individuell kalkuliert — als transparenter Festpreis." },
        { q: "Wie werde ich bei „Bauunternehmen Halle“ gefunden?", a: "Mit lokalem SEO: eigene Seiten je Leistung, Referenzen mit Ortsbezug (Halle, Leipzig, Saalekreis), strukturierte Daten und ein gepflegtes Google Business Profil — so erscheinen Sie genau dort, wo Bauherren suchen." },
        { q: "Nennen KI-Systeme wie ChatGPT mein Unternehmen?", a: "Zunehmend ja — wenn Leistungen, Region, Referenzen und Ansprechpartner maschinenlesbar strukturiert sind. Wir bereiten genau diese Inhalte für Google und KI-Suche auf (GEO/AIO), inklusive FAQ und strukturierten Daten." },
        { q: "Bringen Referenzprojekte wirklich größere Aufträge?", a: "Ja: Bauherren und Architekten prüfen vor der Anfrage Ihre bisherigen Projekte. Eine gepflegte Projektgalerie mit Fakten, Bildern und Ergebnis schafft Vertrauen — und zieht Anfragen an, die zu Ihrer Größe passen." },
      ],
    },
    en: {
      tagline: "Qualified construction enquiries — instead of calls that lead nowhere.",
      painsTitle: "What construction firms know",
      pains: [
        "Many enquiries don't fit your offering — a waste of time.",
        "Reference projects aren't visible online.",
        "The site doesn't look serious enough for bigger jobs.",
      ],
      solutionTitle: "Our solution for your construction firm",
      solution:
        "A serious website that shows your references and brings the right enquiries. Clear services, convincing project photos and simple contact paths produce qualified enquiries instead of unfit calls.",
      featuresTitle: "What's included",
      features: [
        { title: "Reference projects", desc: "Your best work convinces new clients." },
        { title: "Clear services", desc: "So only fitting enquiries come in." },
        { title: "Serious presence", desc: "Trust for larger contracts." },
        { title: "Enquiry form", desc: "An easy path for serious prospects." },
      ],
      resultsTitle: "What you get",
      results: ["More qualified enquiries", "Less wasted time", "Bigger and better contracts"],
      faq: [
        { q: "Can you add my projects?", a: "Yes — we present your references and you add new ones yourself." },
        { q: "Will I get better-fitting enquiries?", a: "With clear services and targeted content, yes — fewer unfit calls." },
        { q: "What does a construction company website cost?", a: "A convincing company site with services, references and an inquiry path usually starts at €990. With several service pages, a project gallery, SEO landing pages or multiple languages, the project tends to start at €1,990 or is quoted individually — as a transparent fixed price." },
        { q: "How do I get found for 'construction company Halle'?", a: "With local SEO: dedicated pages per service, references with local context (Halle, Leipzig, Saalekreis), structured data and a well-maintained Google Business Profile — so you appear exactly where clients search." },
        { q: "Will AI systems like ChatGPT mention my company?", a: "Increasingly yes — when services, region, references and contacts are structured in machine-readable form. We prepare exactly this content for Google and AI search (GEO/AIO), including FAQ and structured data." },
        { q: "Do reference projects really bring bigger contracts?", a: "Yes: clients and architects check your past projects before inquiring. A well-maintained project gallery with facts, photos and results builds trust — and attracts inquiries that match your company's scale." },
      ],
    },
    ru: {
      tagline: "Квалифицированные заявки на стройку — вместо пустых звонков.",
      painsTitle: "Это знакомо строительным компаниям",
      pains: [
        "Много заявок не по профилю — пустая трата времени.",
        "Референс-проекты не видны онлайн.",
        "Сайт выглядит недостаточно солидно для крупных заказов.",
      ],
      solutionTitle: "Наше решение для строительной компании",
      solution:
        "Солидный сайт, который показывает ваши работы и приводит подходящие заявки. Чёткие услуги, убедительные фото проектов и простые формы контакта дают квалифицированные заявки вместо неподходящих звонков.",
      featuresTitle: "Что входит",
      features: [
        { title: "Референс-проекты", desc: "Ваши лучшие работы убеждают новых клиентов." },
        { title: "Чёткие услуги", desc: "Чтобы приходили только подходящие заявки." },
        { title: "Солидный вид", desc: "Доверие для крупных заказов." },
        { title: "Форма заявки", desc: "Простой путь для серьёзных клиентов." },
      ],
      resultsTitle: "Что вы получаете",
      results: ["Более качественные заявки", "Меньше потерь времени", "Крупнее и лучше заказы"],
      faq: [
        { q: "Можете добавить мои проекты?", a: "Да — оформим ваши работы, а новые вы добавляете сами." },
        { q: "Будут ли заявки точнее?", a: "С чёткими услугами и контентом — да, меньше неподходящих звонков." },
        { q: "Сколько стоит сайт строительной компании?", a: "Убедительный сайт компании с услугами, референсами и путём заявки — обычно от 990 €. С несколькими страницами услуг, галереей проектов, SEO-лендингами или мультиязычностью проект чаще от 1 990 € или считается индивидуально — прозрачная фикс-цена." },
        { q: "Как попасть в выдачу по «Bauunternehmen Halle»?", a: "Через локальное SEO: отдельные страницы под каждую услугу, референсы с географией (Галле, Лейпциг, Заалекрайс), структурированные данные и ухоженный профиль Google Business — вы появляетесь именно там, где ищут заказчики." },
        { q: "Назовёт ли ChatGPT мою компанию?", a: "Всё чаще да — когда услуги, регион, референсы и контакты структурированы машиночитаемо. Мы готовим именно этот контент для Google и ИИ-поиска (GEO/AIO), включая FAQ и структурированные данные." },
        { q: "Референсы правда приносят крупные заказы?", a: "Да: заказчики и архитекторы изучают ваши проекты до обращения. Ухоженная галерея проектов с фактами, фото и результатом создаёт доверие — и притягивает заявки, соответствующие масштабу вашей компании." },
      ],
    },
  },

  handwerk: {
    de: {
      tagline: "Regionale Aufträge — Kunden aus Ihrer Umgebung finden Sie zuerst.",
      painsTitle: "Das bremst viele Handwerker",
      pains: [
        "Kunden finden den Nachbarn, aber nicht Sie.",
        "Keine Zeit fürs Telefon, während Sie auf der Baustelle sind.",
        "Mundpropaganda allein reicht für volle Auftragsbücher nicht.",
      ],
      solutionTitle: "Unsere Lösung für Ihren Betrieb",
      solution:
        "Eine schlanke, schnelle Website, die Sie regional ganz oben zeigt — mit Ihren Leistungen, Arbeitsproben und einem einfachen Anfrage-Weg. So kommen Aufträge rein, auch wenn Sie gerade keine Zeit zum Telefonieren haben.",
      featuresTitle: "Das ist dabei",
      features: [
        { title: "Regional gefunden", desc: "Sichtbar bei „… in Ihrer Stadt“ und auf Google Maps." },
        { title: "Arbeitsproben", desc: "Bilder Ihrer Arbeit schaffen sofort Vertrauen." },
        { title: "Einfache Anfrage", desc: "Kunden erreichen Sie mit einem Klick." },
        { title: "Mobil optimiert", desc: "Perfekt für Kunden, die unterwegs suchen." },
      ],
      resultsTitle: "Das bringt es Ihnen",
      results: ["Mehr regionale Aufträge", "Anfragen ohne Telefonstress", "Volle Auftragsbücher"],
      faq: [
        { q: "Ich habe wenig Zeit — geht das trotzdem?", a: "Gerade dann. Wir nehmen Ihnen die Arbeit ab und Anfragen kommen schriftlich rein." },
        { q: "Brauche ich viele Bilder?", a: "Ein paar gute Arbeitsproben reichen. Beim Aufbereiten helfen wir." },
        { q: "Was kostet eine Handwerker-Website?", a: "Ein sehr kompakter Onepager mit Leistungen und Kontakt startet ab 600 €, eine moderne Landingpage ab 990 €. Mehrere Leistungsseiten, SEO-Landingpages je Ort oder Anfrageformulare mit Foto-Upload sind zusätzlicher Umfang — eher ab 1.990 € oder individuell." },
        { q: "Wie werde ich bei „Dachdecker Merseburg“ oder „Elektriker Halle“ gefunden?", a: "Mit lokalen SEO-Landingpages: eine Seite je Leistung und Ort, dazu strukturierte Daten und ein gepflegtes Google Business Profil. So erscheinen Sie genau bei den Suchanfragen, die Aufträge bringen." },
        { q: "Nennen KI-Systeme wie ChatGPT meinen Betrieb?", a: "Immer öfter ja — wenn Leistungen, Einsatzgebiet und Kontakt klar und maschinenlesbar auf der Website stehen. Diese GEO/AIO-Struktur bauen wir ein, inklusive FAQ mit echten Kundenfragen." },
        { q: "Lohnt sich eine eigene Seite pro Leistung?", a: "Ja, das ist einer der stärksten Hebel: Eine Seite für „Badsanierung“, eine für „Heizungswartung“ — jede rankt für ihre eigene Suchanfrage und beantwortet genau die Fragen dieser Kunden. Anfragen werden dadurch passender und leichter zu kalkulieren." },
      ],
    },
    en: {
      tagline: "Regional jobs — local customers find you first.",
      painsTitle: "What slows many tradespeople down",
      pains: [
        "Customers find your neighbour, but not you.",
        "No time for the phone while you're on site.",
        "Word of mouth alone doesn't fill the order book.",
      ],
      solutionTitle: "Our solution for your business",
      solution:
        "A lean, fast website that puts you at the top regionally — with your services, work samples and an easy enquiry path. Jobs come in even when you have no time to take calls.",
      featuresTitle: "What's included",
      features: [
        { title: "Found regionally", desc: "Visible for '… in your town' and on Google Maps." },
        { title: "Work samples", desc: "Photos of your work build instant trust." },
        { title: "Easy enquiry", desc: "Customers reach you with one click." },
        { title: "Mobile-optimised", desc: "Perfect for customers searching on the go." },
      ],
      resultsTitle: "What you get",
      results: ["More regional jobs", "Enquiries without phone stress", "A full order book"],
      faq: [
        { q: "I have little time — does this still work?", a: "Especially then. We do the work and enquiries arrive in writing." },
        { q: "Do I need many photos?", a: "A few good work samples are enough. We help prepare them." },
        { q: "What does a tradesman website cost?", a: "A very compact one-pager with services and contact starts at €600, a modern landing page at €990. Several service pages, SEO landing pages per town or inquiry forms with photo upload are additional scope — tending toward €1,990+ or an individual quote." },
        { q: "How do I get found for 'roofer Merseburg' or 'electrician Halle'?", a: "With local SEO landing pages: one page per service and town, plus structured data and a well-maintained Google Business Profile. That way you appear exactly for the searches that bring contracts." },
        { q: "Will AI systems like ChatGPT mention my business?", a: "More and more often, yes — when services, service area and contact are clear and machine-readable on the website. We build in this GEO/AIO structure, including an FAQ with real customer questions." },
        { q: "Is a dedicated page per service worth it?", a: "Yes, it's one of the strongest levers: one page for 'bathroom renovation', one for 'heating maintenance' — each ranks for its own search and answers exactly those customers' questions. Inquiries become a better fit and easier to quote." },
      ],
    },
    ru: {
      tagline: "Заказы из вашего района — местные клиенты находят вас первыми.",
      painsTitle: "Что тормозит многих мастеров",
      pains: [
        "Клиенты находят соседа, а не вас.",
        "Нет времени на телефон, пока вы на объекте.",
        "Одного сарафанного радио мало для полного портфеля заказов.",
      ],
      solutionTitle: "Наше решение для вашего дела",
      solution:
        "Лёгкий быстрый сайт, который выводит вас в топ по району — с услугами, примерами работ и простой формой заявки. Заказы приходят, даже когда вам некогда отвечать на звонки.",
      featuresTitle: "Что входит",
      features: [
        { title: "Находят по району", desc: "Видно по «… в вашем городе» и на Google Maps." },
        { title: "Примеры работ", desc: "Фото ваших работ сразу вызывают доверие." },
        { title: "Простая заявка", desc: "Клиенты пишут вам в один клик." },
        { title: "Оптимизация под телефон", desc: "Идеально для тех, кто ищет на ходу." },
      ],
      resultsTitle: "Что вы получаете",
      results: ["Больше заказов по району", "Заявки без телефонного стресса", "Полный портфель заказов"],
      faq: [
        { q: "У меня мало времени — это сработает?", a: "Именно тогда и сработает. Работу берём на себя, заявки приходят письменно." },
        { q: "Нужно много фото?", a: "Хватит нескольких хороших примеров. С подготовкой поможем." },
        { q: "Сколько стоит сайт для ремесленного бизнеса?", a: "Совсем компактный one-pager с услугами и контактами — от 600 €, современный лендинг — от 990 €. Несколько страниц услуг, SEO-лендинги по городам или формы заявок с загрузкой фото — дополнительный объём: скорее от 1 990 € или индивидуально." },
        { q: "Как попасть в выдачу по «Dachdecker Merseburg» или «Elektriker Halle»?", a: "Через локальные SEO-лендинги: отдельная страница на каждую услугу и город, плюс структурированные данные и ухоженный профиль Google Business. Так вы появляетесь именно по тем запросам, которые приносят заказы." },
        { q: "Назовёт ли ChatGPT мою мастерскую?", a: "Всё чаще да — когда услуги, зона выезда и контакты ясно и машиночитаемо указаны на сайте. Эту GEO/AIO-структуру мы встраиваем, включая FAQ с реальными вопросами клиентов." },
        { q: "Стоит ли делать отдельную страницу на каждую услугу?", a: "Да, это один из сильнейших рычагов: страница про «ремонт ванной», страница про «обслуживание отопления» — каждая ранжируется по своему запросу и отвечает именно на вопросы этих клиентов. Заявки становятся точнее и их проще считать." },
      ],
    },
  },

  arzt: {
    de: {
      tagline: "Neue Patienten — und weniger Anrufe dank Online-Terminen.",
      painsTitle: "Das kennen viele Praxen",
      pains: [
        "Das Telefon klingelt ständig — die Mitarbeiter sind überlastet.",
        "Neue Patienten finden die Praxis online schwer.",
        "Wichtige Infos (Zeiten, Leistungen) sind veraltet.",
      ],
      solutionTitle: "Unsere Lösung für Ihre Praxis",
      solution:
        "Eine ruhige, vertrauenswürdige Website mit Online-Terminanfrage, klaren Informationen und guter lokaler Sichtbarkeit. Das entlastet Ihr Team und bringt neue Patienten, ohne dass das Telefon heißläuft.",
      featuresTitle: "Das ist dabei",
      features: [
        { title: "Online-Terminanfrage", desc: "Entlastet das Telefon und Ihr Praxisteam." },
        { title: "Klare Informationen", desc: "Sprechzeiten, Leistungen, Anfahrt — immer aktuell." },
        { title: "Vertrauensvoller Auftritt", desc: "Seriös und ruhig, passend zur Praxis." },
        { title: "Lokal sichtbar", desc: "Gefunden bei „Praxis/Arzt in …“." },
      ],
      resultsTitle: "Das bringt es Ihnen",
      results: ["Neue Patienten", "Weniger Telefon-Last", "Entlastetes Praxisteam"],
      faq: [
        { q: "Ist Online-Terminbuchung möglich?", a: "Ja, wir binden eine einfache Terminanfrage oder Ihr bestehendes System ein." },
        { q: "Ist das DSGVO-konform?", a: "Ja, Datenschutz steht bei Praxis-Websites bei uns an erster Stelle." },
        { q: "Was kostet eine Praxis-Website?", a: "Eine moderne Praxisseite mit Leistungen, Team, Öffnungszeiten und Terminanfrage startet meist ab 990 €. Online-Terminbuchung, mehrere Sprachen oder zusätzliche Leistungsseiten sind erweiterter Umfang — eher ab 1.990 € oder individuell kalkuliert." },
        { q: "Wie finden Patienten aus Halle meine Praxis?", a: "Über lokales SEO: klare Leistungsseiten, konsistente Öffnungszeiten, strukturierte Daten und ein gepflegtes Google Business Profil. So erscheinen Sie bei Suchen wie „Zahnarzt Halle“ oder „Hausarzt Saalekreis“ und auf Google Maps." },
        { q: "Nennen KI-Systeme wie ChatGPT meine Praxis?", a: "Patienten fragen KI zunehmend nach Praxen in ihrer Nähe. Genannt wird, wer Leistungen, Sprechzeiten, Kontakt und Anfahrt klar und maschinenlesbar bereitstellt — genau diese GEO/AIO-Struktur setzen wir um." },
        { q: "Welche Inhalte braucht eine gute Praxis-Website?", a: "Leistungen verständlich erklärt, Team mit Gesichtern, Sprechzeiten, Anfahrt und ein einfacher Weg zur Terminanfrage. Wir strukturieren das patientenfreundlich und datensparsam — Formulare fragen nur ab, was wirklich nötig ist." },
      ],
    },
    en: {
      tagline: "New patients — and fewer calls thanks to online appointments.",
      painsTitle: "What many practices know",
      pains: [
        "The phone rings constantly — staff are overloaded.",
        "New patients struggle to find the practice online.",
        "Key info (hours, services) is out of date.",
      ],
      solutionTitle: "Our solution for your practice",
      solution:
        "A calm, trustworthy website with online appointment requests, clear information and good local visibility. It relieves your team and brings new patients without the phone running hot.",
      featuresTitle: "What's included",
      features: [
        { title: "Online appointments", desc: "Relieves the phone and your practice team." },
        { title: "Clear information", desc: "Hours, services, directions — always current." },
        { title: "Trustworthy presence", desc: "Serious and calm, fitting a practice." },
        { title: "Locally visible", desc: "Found for 'practice/doctor in …'." },
      ],
      resultsTitle: "What you get",
      results: ["New patients", "Less phone load", "A relieved practice team"],
      faq: [
        { q: "Is online booking possible?", a: "Yes, we add a simple appointment request or integrate your existing system." },
        { q: "Is it GDPR-compliant?", a: "Yes, data protection comes first for practice websites with us." },
        { q: "What does a practice website cost?", a: "A modern practice site with services, team, opening hours and appointment requests usually starts at €990. Online appointment booking, multiple languages or additional service pages are extended scope — tending toward €1,990+ or an individual quote." },
        { q: "How do patients from Halle find my practice?", a: "Through local SEO: clear service pages, consistent opening hours, structured data and a well-maintained Google Business Profile. That's how you appear for searches like 'dentist Halle' or 'GP Saalekreis' and on Google Maps." },
        { q: "Will AI systems like ChatGPT mention my practice?", a: "Patients increasingly ask AI for practices nearby. The ones mentioned provide services, consultation hours, contact and directions in clear, machine-readable form — exactly the GEO/AIO structure we implement." },
        { q: "What content does a good practice website need?", a: "Services explained in plain language, a team with faces, consultation hours, directions and an easy path to an appointment request. We structure it patient-friendly and data-minimal — forms only ask for what is really needed." },
      ],
    },
    ru: {
      tagline: "Новые пациенты — и меньше звонков благодаря онлайн-записи.",
      painsTitle: "Это знакомо многим клиникам",
      pains: [
        "Телефон звонит без конца — сотрудники перегружены.",
        "Новым пациентам трудно найти клинику онлайн.",
        "Важная информация (часы, услуги) устарела.",
      ],
      solutionTitle: "Наше решение для вашей клиники",
      solution:
        "Спокойный, вызывающий доверие сайт с онлайн-записью, понятной информацией и хорошей локальной видимостью. Это разгружает команду и приводит новых пациентов без перегруженного телефона.",
      featuresTitle: "Что входит",
      features: [
        { title: "Онлайн-запись", desc: "Разгружает телефон и вашу команду." },
        { title: "Понятная информация", desc: "Часы приёма, услуги, как добраться — всегда актуально." },
        { title: "Вызывающий доверие вид", desc: "Солидно и спокойно, как и подобает клинике." },
        { title: "Локальная видимость", desc: "Находят по «клиника/врач в …»." },
      ],
      resultsTitle: "Что вы получаете",
      results: ["Новые пациенты", "Меньше нагрузки на телефон", "Разгруженная команда"],
      faq: [
        { q: "Возможна онлайн-запись?", a: "Да, добавим простую запись или подключим вашу систему." },
        { q: "Это соответствует GDPR?", a: "Да, защита данных для сайтов клиник у нас на первом месте." },
        { q: "Сколько стоит сайт врачебной практики?", a: "Современный сайт практики с услугами, командой, часами приёма и запросом на приём — обычно от 990 €. Онлайн-запись, несколько языков или дополнительные страницы услуг — расширенный объём: скорее от 1 990 € или индивидуально." },
        { q: "Как пациенты из Галле найдут мою практику?", a: "Через локальное SEO: понятные страницы услуг, консистентные часы приёма, структурированные данные и ухоженный профиль Google Business. Так вы появляетесь по запросам вроде «Zahnarzt Halle» или «Hausarzt Saalekreis» и на Google Maps." },
        { q: "Назовёт ли ChatGPT мою практику?", a: "Пациенты всё чаще спрашивают ИИ о практиках рядом. Называют тех, кто ясно и машиночитаемо указывает услуги, часы приёма, контакты и проезд — именно такую GEO/AIO-структуру мы и реализуем." },
        { q: "Какой контент нужен хорошему сайту практики?", a: "Услуги простым языком, команда с лицами, часы приёма, проезд и простой путь к записи. Мы структурируем это удобно для пациентов и с минимумом данных — формы запрашивают только действительно необходимое." },
      ],
    },
  },

  immobilien: {
    de: {
      tagline: "Mehr Leads — Käufer und Verkäufer finden direkt zu Ihnen.",
      painsTitle: "Das kennen Makler",
      pains: [
        "Objekte versinken in großen Portalen zwischen der Konkurrenz.",
        "Verkäufer wählen den Makler, der online überzeugt.",
        "Anfragen kommen unstrukturiert und schwer nachzuverfolgen.",
      ],
      solutionTitle: "Unsere Lösung für Ihr Maklerbüro",
      solution:
        "Eine hochwertige Website, die Ihre Objekte glänzen lässt und Vertrauen bei Eigentümern aufbaut. Mit klarer Objektdarstellung, Bewertungs-Anfrage und starker lokaler Präsenz gewinnen Sie mehr und bessere Leads.",
      featuresTitle: "Das ist dabei",
      features: [
        { title: "Objekt-Präsentation", desc: "Immobilien hochwertig und übersichtlich dargestellt." },
        { title: "Bewertungs-Anfrage", desc: "Eigentümer fordern eine Einschätzung direkt bei Ihnen an." },
        { title: "Vertrauen schaffen", desc: "Referenzen und Bewertungen überzeugen Verkäufer." },
        { title: "Lokal stark", desc: "Sichtbar bei „Makler/Immobilien in …“." },
      ],
      resultsTitle: "Das bringt es Ihnen",
      results: ["Mehr qualifizierte Leads", "Mehr Verkaufsmandate", "Ein hochwertiger Markenauftritt"],
      faq: [
        { q: "Können Objekte automatisch erscheinen?", a: "Je nach System binden wir Ihre Objektdaten an oder Sie pflegen sie einfach selbst." },
        { q: "Hilft das beim Gewinnen von Verkäufern?", a: "Ja — ein hochwertiger Auftritt und Bewertungs-Anfragen schaffen Vertrauen bei Eigentümern." },
        { q: "Was kostet eine Makler-Website?", a: "Eine hochwertige Präsenz mit Leistungen, Referenzen und Kontakt startet meist ab 990 €. Objektdarstellung, automatische Listings, Bewertungs-Leadseiten oder Mehrsprachigkeit sind erweiterter Umfang — eher ab 1.990 € oder individuell kalkuliert." },
        { q: "Wie werde ich bei „Immobilienmakler Halle“ gefunden?", a: "Mit lokalem SEO: klare Leistungsseiten für Verkauf und Vermietung, Ortsbezug zu Halle, Leipzig und dem Saalekreis, strukturierte Daten und ein gepflegtes Google Business Profil." },
        { q: "Nennen KI-Systeme wie ChatGPT mein Maklerbüro?", a: "Eigentümer fragen KI bereits nach Makler-Empfehlungen. Genannt wird, wer Leistungen, Region, Referenzen und Kontakt maschinenlesbar strukturiert — genau diese GEO/AIO-Basis bauen wir auf." },
        { q: "Wie gewinne ich mehr Verkäufer-Anfragen?", a: "Mit einer eigenen Leadseite, z. B. „Was ist meine Immobilie wert?“: Eigentümer hinterlassen ihre Daten für eine Einschätzung, Sie erhalten qualifizierte Verkäufer-Kontakte — der wertvollste Anfragetyp für Makler." },
      ],
    },
    en: {
      tagline: "More leads — buyers and sellers come straight to you.",
      painsTitle: "What estate agents know",
      pains: [
        "Listings drown among competitors on big portals.",
        "Sellers pick the agent who convinces online.",
        "Enquiries arrive unstructured and hard to track.",
      ],
      solutionTitle: "Our solution for your agency",
      solution:
        "A premium website that makes your listings shine and builds trust with owners. With clear property presentation, valuation requests and strong local presence you win more and better leads.",
      featuresTitle: "What's included",
      features: [
        { title: "Property presentation", desc: "Listings shown in a premium, clear way." },
        { title: "Valuation request", desc: "Owners request an estimate directly from you." },
        { title: "Build trust", desc: "References and reviews convince sellers." },
        { title: "Locally strong", desc: "Visible for 'estate agent/property in …'." },
      ],
      resultsTitle: "What you get",
      results: ["More qualified leads", "More selling mandates", "A premium brand presence"],
      faq: [
        { q: "Can listings appear automatically?", a: "Depending on your system we connect your data, or you maintain it easily yourself." },
        { q: "Does it help win sellers?", a: "Yes — a premium presence and valuation requests build trust with owners." },
        { q: "What does a real estate agent website cost?", a: "A high-quality presence with services, references and contact usually starts at €990. Property presentation, automatic listings, valuation lead pages or multiple languages are extended scope — tending toward €1,990+ or an individual quote." },
        { q: "How do I get found for 'real estate agent Halle'?", a: "With local SEO: clear service pages for sales and rentals, local context for Halle, Leipzig and Saalekreis, structured data and a well-maintained Google Business Profile." },
        { q: "Will AI systems like ChatGPT mention my agency?", a: "Owners already ask AI for agent recommendations. The ones mentioned structure services, region, references and contact in machine-readable form — exactly the GEO/AIO base we build." },
        { q: "How do I win more seller inquiries?", a: "With a dedicated lead page, e.g. 'What is my property worth?': owners leave their details for an estimate and you receive qualified seller contacts — the most valuable inquiry type for agents." },
      ],
    },
    ru: {
      tagline: "Больше лидов — покупатели и продавцы приходят прямо к вам.",
      painsTitle: "Это знакомо риелторам",
      pains: [
        "Объекты тонут среди конкурентов на крупных порталах.",
        "Продавцы выбирают риелтора, который убеждает онлайн.",
        "Заявки приходят хаотично и их трудно отслеживать.",
      ],
      solutionTitle: "Наше решение для вашего агентства",
      solution:
        "Премиальный сайт, на котором ваши объекты выглядят выигрышно и который вызывает доверие у собственников. Чёткая презентация объектов, запрос оценки и сильное локальное присутствие приносят больше качественных лидов.",
      featuresTitle: "Что входит",
      features: [
        { title: "Презентация объектов", desc: "Недвижимость показана премиально и наглядно." },
        { title: "Запрос оценки", desc: "Собственники запрашивают оценку прямо у вас." },
        { title: "Доверие", desc: "Референсы и отзывы убеждают продавцов." },
        { title: "Сильно локально", desc: "Видно по «риелтор/недвижимость в …»." },
      ],
      resultsTitle: "Что вы получаете",
      results: ["Больше качественных лидов", "Больше мандатов на продажу", "Премиальный бренд"],
      faq: [
        { q: "Объекты могут появляться автоматически?", a: "В зависимости от системы подключим ваши данные или вы легко ведёте их сами." },
        { q: "Поможет привлекать продавцов?", a: "Да — премиальный вид и запрос оценки создают доверие у собственников." },
        { q: "Сколько стоит сайт риелтора?", a: "Качественная презентация с услугами, референсами и контактами — обычно от 990 €. Показ объектов, автоматические листинги, лид-страницы оценки или мультиязычность — расширенный объём: скорее от 1 990 € или индивидуально." },
        { q: "Как попасть в выдачу по «Immobilienmakler Halle»?", a: "Через локальное SEO: понятные страницы услуг по продаже и аренде, географическая привязка к Галле, Лейпцигу и Заалекрайсу, структурированные данные и ухоженный профиль Google Business." },
        { q: "Назовёт ли ChatGPT моё агентство?", a: "Собственники уже спрашивают ИИ о рекомендациях риелторов. Называют тех, кто машиночитаемо структурирует услуги, регион, референсы и контакты — именно эту GEO/AIO-базу мы и строим." },
        { q: "Как получать больше заявок от продавцов?", a: "Через отдельную лид-страницу, например «Сколько стоит моя недвижимость?»: собственники оставляют данные для оценки, вы получаете квалифицированные контакты продавцов — самый ценный тип заявок для риелтора." },
      ],
    },
  },

  kanzlei: {
    de: {
      tagline: "Mandanten gewinnen — mit einem Auftritt, der Vertrauen schafft.",
      painsTitle: "Das kennen Kanzleien",
      pains: [
        "Mandanten wählen die Kanzlei, die seriös und kompetent wirkt.",
        "Die alte Seite wird der Reputation nicht gerecht.",
        "Erstanfragen sind kompliziert und schrecken ab.",
      ],
      solutionTitle: "Unsere Lösung für Ihre Kanzlei",
      solution:
        "Eine seriöse, klare Website, die Ihre Fachgebiete und Kompetenz hervorhebt und Erstkontakt einfach macht. So gewinnen Sie das Vertrauen passender Mandanten — diskret, professionell und DSGVO-konform.",
      featuresTitle: "Das ist dabei",
      features: [
        { title: "Fachgebiete klar", desc: "Mandanten sehen sofort, ob Sie der richtige Partner sind." },
        { title: "Seriöser Auftritt", desc: "Ein Design, das Kompetenz und Vertrauen ausstrahlt." },
        { title: "Einfacher Erstkontakt", desc: "Diskrete Anfrage mit wenigen Klicks." },
        { title: "DSGVO-konform", desc: "Datenschutz und Vertraulichkeit von Anfang an." },
      ],
      resultsTitle: "Das bringt es Ihnen",
      results: ["Mehr passende Mandanten", "Ein seriöser, moderner Auftritt", "Einfacher Erstkontakt"],
      faq: [
        { q: "Wirkt das seriös genug?", a: "Ja — wir gestalten bewusst zurückhaltend und professionell, passend zu Ihrer Kanzlei." },
        { q: "Ist Vertraulichkeit gewährleistet?", a: "Datenschutz und DSGVO-Konformität haben bei uns höchste Priorität." },
        { q: "Was kostet eine Kanzlei-Website?", a: "Eine seriöse Kanzleiseite mit Rechtsgebieten, Team und Kontakt startet meist ab 990 €. Eigene Seiten je Rechtsgebiet, Mehrsprachigkeit oder Online-Terminanfrage sind erweiterter Umfang — eher ab 1.990 € oder individuell kalkuliert." },
        { q: "Wie werde ich bei „Anwalt Halle“ gefunden?", a: "Mit lokalem SEO: eine eigene Seite je Rechtsgebiet — z. B. „Anwalt Arbeitsrecht Halle“ — dazu strukturierte Daten und ein gepflegtes Google Business Profil. So erscheinen Sie genau bei den Suchen Ihrer Mandanten." },
        { q: "Nennen KI-Systeme wie ChatGPT meine Kanzlei?", a: "Mandanten fragen KI zunehmend nach passenden Kanzleien. Genannt wird, wer Rechtsgebiete, Standort und Kontakt klar und maschinenlesbar strukturiert — genau diese GEO/AIO-Basis setzen wir um, inklusive FAQ mit typischen Mandantenfragen." },
        { q: "Lohnt sich eine Seite pro Rechtsgebiet?", a: "Ja: Jede Rechtsgebietsseite rankt für ihre eigene Suchanfrage, beantwortet die Fragen genau dieser Mandanten und qualifiziert Anfragen vor. Das spart Ihnen Erstgespräche, die nicht zu Ihrer Ausrichtung passen." },
      ],
    },
    en: {
      tagline: "Win clients — with a presence that builds trust.",
      painsTitle: "What law firms know",
      pains: [
        "Clients pick the firm that looks serious and competent.",
        "The old site doesn't match the firm's reputation.",
        "Initial enquiries are complicated and off-putting.",
      ],
      solutionTitle: "Our solution for your firm",
      solution:
        "A serious, clear website that highlights your practice areas and expertise and makes first contact easy. You earn the trust of the right clients — discreet, professional and GDPR-compliant.",
      featuresTitle: "What's included",
      features: [
        { title: "Clear practice areas", desc: "Clients instantly see if you're the right partner." },
        { title: "Serious presence", desc: "A design that radiates competence and trust." },
        { title: "Easy first contact", desc: "A discreet enquiry in a few clicks." },
        { title: "GDPR-compliant", desc: "Data protection and confidentiality from the start." },
      ],
      resultsTitle: "What you get",
      results: ["More fitting clients", "A serious, modern presence", "Easy first contact"],
      faq: [
        { q: "Will it look serious enough?", a: "Yes — we design deliberately restrained and professional, fitting your firm." },
        { q: "Is confidentiality ensured?", a: "Data protection and GDPR compliance are our top priority." },
        { q: "What does a law firm website cost?", a: "A serious firm website with practice areas, team and contact usually starts at €990. Dedicated pages per practice area, multiple languages or online appointment requests are extended scope — tending toward €1,990+ or an individual quote." },
        { q: "How do I get found for 'lawyer Halle'?", a: "With local SEO: a dedicated page per practice area — e.g. 'employment lawyer Halle' — plus structured data and a well-maintained Google Business Profile. That way you appear exactly for your clients' searches." },
        { q: "Will AI systems like ChatGPT mention my firm?", a: "Clients increasingly ask AI for suitable law firms. The ones mentioned structure practice areas, location and contact clearly and machine-readably — exactly the GEO/AIO base we implement, including an FAQ with typical client questions." },
        { q: "Is a page per practice area worth it?", a: "Yes: each practice-area page ranks for its own search, answers exactly those clients' questions and pre-qualifies inquiries. That saves you initial consultations that don't match your focus." },
      ],
    },
    ru: {
      tagline: "Привлекайте клиентов — с сайтом, который вызывает доверие.",
      painsTitle: "Это знакомо юридическим фирмам",
      pains: [
        "Клиенты выбирают фирму, которая выглядит солидно и компетентно.",
        "Старый сайт не соответствует репутации.",
        "Первичные обращения сложны и отпугивают.",
      ],
      solutionTitle: "Наше решение для вашей фирмы",
      solution:
        "Солидный, понятный сайт, который подчёркивает ваши практики и компетентность и упрощает первый контакт. Вы завоёвываете доверие подходящих клиентов — деликатно, профессионально и по GDPR.",
      featuresTitle: "Что входит",
      features: [
        { title: "Чёткие практики", desc: "Клиент сразу видит, тот ли вы партнёр." },
        { title: "Солидный вид", desc: "Дизайн, излучающий компетентность и доверие." },
        { title: "Простой первый контакт", desc: "Деликатная заявка в пару кликов." },
        { title: "Соответствие GDPR", desc: "Защита данных и конфиденциальность с самого начала." },
      ],
      resultsTitle: "Что вы получаете",
      results: ["Больше подходящих клиентов", "Солидный современный вид", "Простой первый контакт"],
      faq: [
        { q: "Будет выглядеть достаточно солидно?", a: "Да — оформляем сдержанно и профессионально, под вашу фирму." },
        { q: "Обеспечена ли конфиденциальность?", a: "Защита данных и соответствие GDPR — наш высший приоритет." },
        { q: "Сколько стоит сайт юридической канцелярии?", a: "Солидный сайт канцелярии с областями права, командой и контактами — обычно от 990 €. Отдельные страницы по областям права, мультиязычность или онлайн-запрос на консультацию — расширенный объём: скорее от 1 990 € или индивидуально." },
        { q: "Как попасть в выдачу по «Anwalt Halle»?", a: "Через локальное SEO: отдельная страница на каждую область права — например «Anwalt Arbeitsrecht Halle» — плюс структурированные данные и ухоженный профиль Google Business. Так вас находят именно ваши будущие доверители." },
        { q: "Назовёт ли ChatGPT мою канцелярию?", a: "Доверители всё чаще спрашивают ИИ о подходящих канцеляриях. Называют тех, кто ясно и машиночитаемо структурирует области права, локацию и контакты — именно эту GEO/AIO-базу мы реализуем, включая FAQ с типичными вопросами." },
        { q: "Стоит ли страница на каждую область права?", a: "Да: каждая такая страница ранжируется по своему запросу, отвечает на вопросы именно этих доверителей и предварительно квалифицирует обращения. Это экономит вам первичные консультации не по профилю." },
      ],
    },
  },
};

export function industryContent(slug: string, name: string, locale: string): IndustryBlock {
  const key = industryKeyFrom(slug, name);
  const loc = (["de", "en", "ru"].includes(locale) ? locale : "de") as Locale;
  return (C[key] ?? C.handwerk)[loc];
}
