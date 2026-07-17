import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// ---------------------------------------------------------------------------
// SaaleWeb blog content sync (Phase 9 content layer).
//
// Upserts real SEO/GEO articles for the Halle/Leipzig market into the
// database so they are editable from /admin/blog. Repeatable by design:
// posts are matched by their per-locale slugs, categories by key, and the
// author by name. Running the script again overwrites title/excerpt/content
// of the managed posts with the source-of-truth text below, so do not rerun
// it after manual admin edits unless you intend to reset those articles.
// ---------------------------------------------------------------------------

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const locales = ["de", "en", "ru"] as const;
type Locale = (typeof locales)[number];

type CategorySeed = {
  key: string;
  translations: Record<Locale, { name: string; slug: string }>;
};

type PostTranslationSeed = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
};

type PostSeed = {
  /** Stable human identifier for logs; equals the German slug. */
  key: string;
  categoryKey: string;
  coverImage: string;
  publishedAt: string;
  translations: Record<Locale, PostTranslationSeed>;
};

const categories: CategorySeed[] = [
  {
    key: "seo",
    translations: {
      de: { name: "SEO", slug: "seo" },
      en: { name: "SEO", slug: "seo" },
      ru: { name: "SEO", slug: "seo" },
    },
  },
  {
    key: "webdesign",
    translations: {
      de: { name: "Webdesign", slug: "webdesign" },
      en: { name: "Web Design", slug: "web-design" },
      ru: { name: "Веб-дизайн", slug: "veb-dizajn" },
    },
  },
  {
    key: "ki-suche",
    translations: {
      de: { name: "KI & Zukunft der Suche", slug: "ki-suche" },
      en: { name: "AI & Search", slug: "ai-search" },
      ru: { name: "ИИ и поиск", slug: "ii-i-poisk" },
    },
  },
  {
    key: "praxis",
    translations: {
      de: { name: "Praxis & Wachstum", slug: "praxis" },
      en: { name: "Business Growth", slug: "business-growth" },
      ru: { name: "Рост бизнеса", slug: "rost-biznesa" },
    },
  },
];

function readingTimeFromContent(content: string): number {
  const words = content
    .replace(/[#>*_\-|]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(3, Math.round(words / 190));
}

async function ensureAuthor(): Promise<string> {
  const existing = await prisma.author.findFirst({
    where: { name: "Konstantin Mykhailov" },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.author.create({
    data: {
      name: "Konstantin Mykhailov",
      translations: {
        create: [
          { locale: "de", role: "Gründer", bio: "Webentwickler und Gründer von SaaleWeb." },
          { locale: "en", role: "Founder", bio: "Web developer and founder of SaaleWeb." },
          { locale: "ru", role: "Основатель", bio: "Веб-разработчик и основатель SaaleWeb." },
        ],
      },
    },
  });
  return created.id;
}

async function upsertCategories(): Promise<Map<string, string>> {
  const ids = new Map<string, string>();
  for (const category of categories) {
    const row = await prisma.blogCategory.upsert({
      where: { key: category.key },
      update: {},
      create: { key: category.key },
    });
    ids.set(category.key, row.id);

    for (const locale of locales) {
      const t = category.translations[locale];
      const existing = await prisma.blogCategoryTranslation.findFirst({
        where: { categoryId: row.id, locale },
        select: { id: true },
      });
      if (existing) {
        await prisma.blogCategoryTranslation.update({
          where: { id: existing.id },
          data: { name: t.name, slug: t.slug },
        });
      } else {
        await prisma.blogCategoryTranslation.create({
          data: { categoryId: row.id, locale, name: t.name, slug: t.slug },
        });
      }
    }
  }
  return ids;
}

async function findExistingPostId(post: PostSeed): Promise<string | null> {
  for (const locale of locales) {
    const match = await prisma.blogPostTranslation.findFirst({
      where: { locale, slug: post.translations[locale].slug },
      select: { postId: true },
    });
    if (match) return match.postId;
  }
  return null;
}

async function upsertPost(post: PostSeed, authorId: string, categoryIds: Map<string, string>) {
  const categoryId = categoryIds.get(post.categoryKey);
  if (!categoryId) throw new Error(`Unknown category key: ${post.categoryKey}`);

  const readingTime = readingTimeFromContent(post.translations.de.content);
  const base = {
    authorId,
    categoryId,
    coverImage: post.coverImage,
    readingTime,
    published: true,
    publishedAt: new Date(post.publishedAt),
  };

  const existingId = await findExistingPostId(post);
  const postId = existingId
    ? (await prisma.blogPost.update({ where: { id: existingId }, data: base })).id
    : (await prisma.blogPost.create({ data: base })).id;

  for (const locale of locales) {
    const t = post.translations[locale];
    const existing = await prisma.blogPostTranslation.findFirst({
      where: { postId, locale },
      select: { id: true },
    });
    if (existing) {
      await prisma.blogPostTranslation.update({
        where: { id: existing.id },
        data: { title: t.title, slug: t.slug, excerpt: t.excerpt, content: t.content },
      });
    } else {
      await prisma.blogPostTranslation.create({
        data: { postId, locale, title: t.title, slug: t.slug, excerpt: t.excerpt, content: t.content },
      });
    }
  }

  console.log(`${existingId ? "updated" : "created"} post: ${post.key} (readingTime ${readingTime} min)`);
}

async function main() {
  const authorId = await ensureAuthor();
  const categoryIds = await upsertCategories();
  for (const post of posts) {
    await upsertPost(post, authorId, categoryIds);
  }
  console.log(`Blog content sync complete: ${posts.length} posts, ${categories.length} categories.`);
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

const posts: PostSeed[] = [
  {
    key: "lokales-seo-halle",
    categoryKey: "seo",
    coverImage: "/images/blog/local-seo-halle-leipzig.webp",
    publishedAt: "2026-06-30T08:00:00.000Z",
    translations: {
      de: {
        title: "Lokales SEO in Halle & Leipzig: Der komplette Leitfaden für 2026",
        slug: "lokales-seo-halle",
        excerpt:
          "Wie lokale Unternehmen in Halle (Saale), Leipzig und dem Saalekreis 2026 bei Google und in KI-Suchen gefunden werden – mit konkreten Schritten statt Theorie.",
        content: `Wenn ein Gast in Halle „Restaurant in der Nähe" sucht oder eine Bauherrin in Leipzig „Bauunternehmen Empfehlung" eingibt, entscheidet sich in wenigen Sekunden, welches Unternehmen die Anfrage bekommt. Lokales SEO ist kein Trick und keine einmalige Einstellung – es ist die Summe aus einem gepflegten Google-Unternehmensprofil, einer schnellen Website mit klaren lokalen Signalen und echten Bewertungen.

Dieser Leitfaden zeigt Schritt für Schritt, was 2026 in der Region Halle, Leipzig, Merseburg und Saalekreis wirklich funktioniert.

## Warum lokales SEO 2026 wichtiger ist als je zuvor

Drei Entwicklungen verändern gerade die lokale Suche:

- **Google zeigt lokale Ergebnisse prominenter.** Das Local Pack mit Karte und drei Unternehmen steht bei fast jeder Suche mit lokaler Absicht ganz oben – noch vor den klassischen Ergebnissen.
- **KI-Suchen empfehlen konkrete Unternehmen.** ChatGPT, Gemini und Perplexity beantworten Fragen wie „Welcher Friseur in Halle ist gut?" mit konkreten Namen. Wer dort nicht auftaucht, existiert für diese Nutzer nicht.
- **Mobile Suche dominiert.** Der Großteil lokaler Suchanfragen kommt vom Smartphone – oft mit direkter Kauf- oder Besuchsabsicht.

Für ein lokales Unternehmen heißt das: Sichtbarkeit in der eigenen Stadt ist planbar geworden. Sie folgt klaren Regeln.

## Schritt 1: Das Google-Unternehmensprofil als Fundament

Das Google-Unternehmensprofil (früher Google My Business) ist der wichtigste einzelne Hebel im lokalen SEO. Es entscheidet, ob Sie im Local Pack und auf Google Maps erscheinen.

Die Basics, die viele Unternehmen in der Region noch nicht sauber haben:

- Vollständige und **exakt einheitliche** Angaben zu Name, Adresse und Telefonnummer – überall im Netz identisch geschrieben
- Die richtige Hauptkategorie plus passende Nebenkategorien
- Aktuelle Öffnungszeiten, auch an Feiertagen
- Eigene Fotos statt Stockbilder: Team, Räume, Arbeitsergebnisse
- Eine Beschreibung, die Leistungen und Einzugsgebiet konkret benennt

Wie Sie das Profil im Detail optimieren, haben wir in einer eigenen [Anleitung zum Google-Unternehmensprofil](/blog/google-unternehmensprofil-optimieren) zusammengefasst.

## Schritt 2: Eine Website, die lokale Signale sendet

Das Unternehmensprofil bringt Sichtbarkeit – die Website macht daraus Anfragen. Google bewertet dabei, wie klar Ihre Website den lokalen Bezug kommuniziert:

- **Standort im Titel und in Überschriften.** „Glaserei in Halle (Saale)" statt nur „Glaserei".
- **Eine eigene Seite pro Leistung.** Wer Webdesign, SEO und Wartung anbietet, braucht drei Seiten – nicht einen Absatz für alles.
- **Lokale Inhalte.** Projekte aus der Region, Anfahrt, Einzugsgebiet, regionale Referenzen.
- **Strukturierte Daten (Schema.org).** LocalBusiness-Markup hilft Google und KI-Systemen, Ihr Unternehmen eindeutig zuzuordnen.
- **Ladezeit und Mobilfreundlichkeit.** Eine langsame Website verliert Rankings und Besucher gleichzeitig.

Genau diese Struktur bauen wir bei jedem Projekt von Anfang an ein – mehr dazu unter [SEO in Halle](/leistungen/seo-halle) und [Webdesign Halle](/leistungen/webdesign-halle).

## Schritt 3: Bewertungen systematisch aufbauen

Bewertungen sind für lokale Rankings und für die Kaufentscheidung gleichermaßen entscheidend. Studien zeigen konstant: Menschen vertrauen Google-Bewertungen fast so stark wie persönlichen Empfehlungen.

So bauen Sie Bewertungen nachhaltig auf:

1. **Fragen Sie im richtigen Moment.** Direkt nach einem gelungenen Projekt oder Besuch ist die Bereitschaft am höchsten.
2. **Machen Sie es einfach.** Ein QR-Code auf der Rechnung oder ein direkter Link per Nachricht senkt die Hürde.
3. **Antworten Sie auf jede Bewertung.** Auch auf kritische – sachlich und lösungsorientiert. Google wertet aktive Profile besser.
4. **Kaufen Sie niemals Bewertungen.** Gekaufte Rezensionen sind erkennbar, riskant und zerstören Vertrauen.

## Schritt 4: Lokale Inhalte, die Fragen beantworten

Google und KI-Suchen bevorzugen Unternehmen, die Fragen ihrer Kunden tatsächlich beantworten. Für die Region heißt das konkret:

- Was kostet die Leistung? (Eine ehrliche Preisspanne schlägt Schweigen – siehe unser Beitrag zu [Website-Kosten in Halle](/blog/was-kostet-eine-website-in-halle).)
- Wie läuft die Zusammenarbeit ab?
- Welche Projekte gab es in Halle, Leipzig oder Merseburg?
- Welche Fragen stellen Kunden immer wieder?

Jede dieser Fragen kann eine eigene Seite oder ein Blogbeitrag sein. So entsteht über Monate ein Inhaltsfundament, das sowohl klassische Suche als auch KI-Antworten speist.

## Schritt 5: Regionale Verzeichnisse und Konsistenz

Einträge in relevanten Verzeichnissen (Branchenbücher, Handwerkskammer, regionale Portale) stärken die lokale Zuordnung – aber nur, wenn die Unternehmensdaten überall identisch sind. Ein Rechtschreibfehler in der Straße oder eine alte Telefonnummer in einem Verzeichnis schwächt das Vertrauen der Suchmaschine in Ihre Daten.

## Häufige Fehler, die wir in der Region immer wieder sehen

- Das Unternehmensprofil wurde einmal angelegt und seit Jahren nicht angefasst
- Die Website hat keine einzelnen Leistungsseiten, sondern nur „Leistungen" als Sammelseite
- Öffnungszeiten auf Google und Website widersprechen sich
- Bewertungen bleiben unbeantwortet
- Die Website lädt auf dem Smartphone spürbar langsam

Jeder dieser Punkte ist einzeln lösbar – zusammen entscheiden sie über Platz 1 oder Seite 2.

## Fazit: Lokales SEO ist ein System, kein Zufall

Wer in Halle, Leipzig und dem Saalekreis gefunden werden will, braucht drei Dinge: ein gepflegtes Google-Unternehmensprofil, eine schnelle Website mit klaren lokalen Signalen und einen stetigen Fluss echter Bewertungen. Alles drei ist planbar – und genau deshalb ein fairer Wettbewerbsvorteil für Unternehmen, die es ernst nehmen.

Sie möchten wissen, wo Ihr Unternehmen heute steht? Wir prüfen Website und Sichtbarkeit kostenlos und zeigen die drei wichtigsten Hebel: [Kostenlose Website-Analyse anfragen](/kontakt).`,
      },
      en: {
        title: "Local SEO in Halle & Leipzig: The Complete 2026 Guide",
        slug: "local-seo-halle",
        excerpt:
          "How local businesses in Halle (Saale), Leipzig and the Saalekreis region get found on Google and in AI search in 2026 – with concrete steps instead of theory.",
        content: `When a guest in Halle searches for "restaurant near me" or a homeowner in Leipzig types "construction company recommendation", it takes seconds to decide which business gets the inquiry. Local SEO is not a trick and not a one-time setting – it is the sum of a well-maintained Google Business Profile, a fast website with clear local signals, and genuine reviews.

This guide shows step by step what actually works in the Halle, Leipzig, Merseburg and Saalekreis region in 2026.

## Why local SEO matters more than ever in 2026

Three developments are reshaping local search right now:

- **Google shows local results more prominently.** The Local Pack with map and three businesses sits at the top of almost every search with local intent – above the classic results.
- **AI search recommends specific businesses.** ChatGPT, Gemini and Perplexity answer questions like "Which hairdresser in Halle is good?" with concrete names. If you do not appear there, you do not exist for those users.
- **Mobile search dominates.** Most local searches come from smartphones – often with direct intent to buy or visit.

For a local business this means: visibility in your own city has become plannable. It follows clear rules.

## Step 1: The Google Business Profile as your foundation

The Google Business Profile is the single most important lever in local SEO. It decides whether you appear in the Local Pack and on Google Maps.

The basics many businesses in the region still get wrong:

- Complete and **exactly consistent** name, address and phone details – written identically everywhere online
- The right primary category plus fitting secondary categories
- Up-to-date opening hours, including holidays
- Your own photos instead of stock images: team, premises, finished work
- A description that names services and service area concretely

We have summarised how to optimise the profile in detail in a dedicated [Google Business Profile guide](/en/blog/optimize-google-business-profile).

## Step 2: A website that sends local signals

The Business Profile brings visibility – the website turns it into inquiries. Google evaluates how clearly your website communicates its local context:

- **Location in titles and headings.** "Glazier in Halle (Saale)" instead of just "Glazier".
- **One dedicated page per service.** If you offer web design, SEO and maintenance, you need three pages – not one paragraph for everything.
- **Local content.** Projects from the region, directions, service area, regional references.
- **Structured data (Schema.org).** LocalBusiness markup helps Google and AI systems identify your business unambiguously.
- **Loading speed and mobile friendliness.** A slow website loses rankings and visitors at the same time.

We build exactly this structure into every project from day one – learn more under [SEO in Halle](/en/services/seo-halle) and [Web design Halle](/en/services/web-design-halle).

## Step 3: Building reviews systematically

Reviews are decisive for local rankings and for buying decisions alike. Studies consistently show that people trust Google reviews almost as much as personal recommendations.

How to build reviews sustainably:

1. **Ask at the right moment.** Right after a successful project or visit, willingness is highest.
2. **Make it easy.** A QR code on the invoice or a direct link by message lowers the barrier.
3. **Reply to every review.** Including critical ones – factual and solution-oriented. Google favours active profiles.
4. **Never buy reviews.** Purchased reviews are detectable, risky and destroy trust.

## Step 4: Local content that answers questions

Google and AI search prefer businesses that actually answer their customers' questions. For our region this means concretely:

- What does the service cost? (An honest price range beats silence – see our article on [website costs in Halle](/en/blog/website-cost-in-halle).)
- How does the collaboration work?
- Which projects were completed in Halle, Leipzig or Merseburg?
- Which questions do customers ask again and again?

Each of these questions can become its own page or blog post. Over months, this creates a content foundation that feeds both classic search and AI answers.

## Step 5: Regional directories and consistency

Listings in relevant directories (business registers, chamber of crafts, regional portals) strengthen local attribution – but only if your business data is identical everywhere. A spelling mistake in the street name or an old phone number in one directory weakens the search engine's trust in your data.

## Common mistakes we keep seeing in the region

- The Business Profile was created once and untouched for years
- The website has no individual service pages, only a collective "Services" page
- Opening hours on Google and the website contradict each other
- Reviews remain unanswered
- The website loads noticeably slowly on smartphones

Each of these points is solvable on its own – together they decide between position 1 and page 2.

## Conclusion: local SEO is a system, not luck

If you want to be found in Halle, Leipzig and the Saalekreis, you need three things: a well-maintained Google Business Profile, a fast website with clear local signals, and a steady flow of genuine reviews. All three are plannable – and that is exactly why they are a fair competitive advantage for businesses that take them seriously.

Want to know where your business stands today? We check your website and visibility free of charge and show you the three most important levers: [request a free website analysis](/en/contact).`,
      },
      ru: {
        title: "Локальное SEO в Halle и Leipzig: полное руководство на 2026 год",
        slug: "lokalnoe-seo-halle",
        excerpt:
          "Как локальному бизнесу в Halle (Saale), Leipzig и регионе Saalekreis находиться в Google и AI-поиске в 2026 году — конкретные шаги вместо теории.",
        content: `Когда гость в Halle ищет «ресторан рядом», а владелица дома в Leipzig вводит «строительная компания рекомендации», за несколько секунд решается, какая компания получит заявку. Локальное SEO — это не трюк и не разовая настройка. Это сумма трёх вещей: ухоженного профиля в Google, быстрого сайта с понятными локальными сигналами и настоящих отзывов.

Это руководство по шагам показывает, что реально работает в регионе Halle, Leipzig, Merseburg и Saalekreis в 2026 году.

## Почему локальное SEO важно как никогда

Три тенденции меняют локальный поиск прямо сейчас:

- **Google показывает локальные результаты заметнее.** Локальный блок с картой и тремя компаниями стоит выше классической выдачи почти в каждом запросе с локальным намерением.
- **AI-поиск рекомендует конкретные компании.** ChatGPT, Gemini и Perplexity отвечают на вопросы вроде «какой парикмахер в Halle хороший?» конкретными названиями. Кого там нет — того для этих пользователей не существует.
- **Мобильный поиск доминирует.** Большинство локальных запросов приходит со смартфона — часто с прямым намерением купить или прийти.

Для локального бизнеса это значит: видимость в своём городе стала управляемой. Она подчиняется понятным правилам.

## Шаг 1: профиль Google как фундамент

Бизнес-профиль Google — самый важный отдельный рычаг локального SEO. Он решает, попадёте ли вы в локальный блок и на Google Maps.

База, которую многие компании региона до сих пор не сделали аккуратно:

- Полные и **строго одинаковые** название, адрес и телефон — везде в интернете написанные идентично
- Правильная основная категория плюс подходящие дополнительные
- Актуальные часы работы, включая праздники
- Собственные фотографии вместо стоковых: команда, помещение, результаты работ
- Описание, где конкретно названы услуги и зона обслуживания

Как оптимизировать профиль в деталях, мы разобрали в отдельной [инструкции по бизнес-профилю Google](/ru/blog/optimizaciya-google-biznes-profilya).

## Шаг 2: сайт, который посылает локальные сигналы

Профиль даёт видимость — сайт превращает её в заявки. Google оценивает, насколько ясно сайт показывает локальный контекст:

- **Город в заголовках и тайтлах.** «Стекольная мастерская в Halle (Saale)», а не просто «Стекольная мастерская».
- **Отдельная страница под каждую услугу.** Если вы предлагаете веб-дизайн, SEO и поддержку — нужно три страницы, а не один абзац на всё.
- **Локальный контент.** Проекты из региона, схема проезда, зона обслуживания, региональные референсы.
- **Структурированные данные (Schema.org).** Разметка LocalBusiness помогает Google и AI-системам однозначно идентифицировать компанию.
- **Скорость и мобильность.** Медленный сайт теряет и позиции, и посетителей одновременно.

Именно такую структуру мы закладываем в каждый проект с самого начала — подробнее в разделах [SEO в Halle](/ru/uslugi/seo-halle) и [Веб-дизайн Halle](/ru/uslugi/webdesign-halle).

## Шаг 3: системная работа с отзывами

Отзывы одинаково важны и для локальных позиций, и для решения о покупке. Исследования стабильно показывают: люди доверяют отзывам в Google почти так же, как личным рекомендациям.

Как выстроить поток отзывов:

1. **Просите в правильный момент.** Сразу после удачного проекта или визита готовность максимальна.
2. **Сделайте это простым.** QR-код на счёте или прямая ссылка в сообщении снижают барьер.
3. **Отвечайте на каждый отзыв.** Включая критические — по делу и с решением. Google выше ценит активные профили.
4. **Никогда не покупайте отзывы.** Купленные отзывы распознаются, это рискованно и разрушает доверие.

## Шаг 4: локальный контент, отвечающий на вопросы

Google и AI-поиск отдают предпочтение компаниям, которые реально отвечают на вопросы клиентов. Для нашего региона это конкретно:

- Сколько стоит услуга? (Честная вилка цен лучше молчания — см. нашу статью о [стоимости сайта в Halle](/ru/blog/skolko-stoit-sajt-v-halle).)
- Как проходит совместная работа?
- Какие проекты были в Halle, Leipzig или Merseburg?
- Какие вопросы клиенты задают снова и снова?

Каждый такой вопрос может стать отдельной страницей или статьёй. Так за месяцы формируется контентный фундамент, который питает и классический поиск, и ответы ИИ.

## Шаг 5: региональные каталоги и консистентность

Записи в релевантных каталогах (бизнес-справочники, ремесленная палата, региональные порталы) усиливают локальную привязку — но только если данные компании везде идентичны. Опечатка в названии улицы или старый телефон в одном каталоге снижают доверие поисковика к вашим данным.

## Типичные ошибки, которые мы видим в регионе снова и снова

- Профиль Google создан один раз и годами не обновлялся
- На сайте нет отдельных страниц услуг — только общая «Услуги»
- Часы работы в Google и на сайте противоречат друг другу
- Отзывы остаются без ответов
- Сайт заметно медленно грузится на смартфоне

Каждый из этих пунктов решается по отдельности — вместе они определяют разницу между первым местом и второй страницей.

## Вывод: локальное SEO — это система, а не удача

Чтобы вас находили в Halle, Leipzig и Saalekreis, нужны три вещи: ухоженный профиль Google, быстрый сайт с ясными локальными сигналами и постоянный поток настоящих отзывов. Все три управляемы — и именно поэтому это честное конкурентное преимущество для компаний, которые относятся к этому серьёзно.

Хотите узнать, где ваша компания сейчас? Мы бесплатно проверим сайт и видимость и покажем три главных рычага: [запросить бесплатный аудит сайта](/ru/kontakt).`,
      },
    },
  },
  {
    key: "was-kostet-eine-website-in-halle",
    categoryKey: "praxis",
    coverImage: "/images/blog/website-kosten.webp",
    publishedAt: "2026-06-18T08:00:00.000Z",
    translations: {
      de: {
        title: "Was kostet eine Website in Halle (Saale)? Ehrliche Preise 2026",
        slug: "was-kostet-eine-website-in-halle",
        excerpt:
          "Von 600 € bis fünfstellig: Was eine professionelle Website in Halle und Leipzig 2026 wirklich kostet, wovon der Preis abhängt – und wo sich Sparen rächt.",
        content: `„Was kostet eine Website?" ist die häufigste Frage in unseren Erstgesprächen – und die ehrliche Antwort lautet: Es kommt darauf an, was die Website leisten soll. Eine Visitenkarte im Netz kostet etwas anderes als ein System, das planbar Anfragen bringt.

Damit Sie realistisch kalkulieren können, legen wir hier unsere Preislogik offen – mit echten Zahlen für die Region Halle, Leipzig und Saalekreis.

## Die kurze Antwort: typische Preisspannen 2026

| Website-Typ | Typischer Preis | Für wen geeignet |
| --- | --- | --- |
| WordPress-Onepager | ab 600 € | Solide Online-Präsenz mit kleinem Budget |
| Landingpage (React/Next.js) | ab 990 € | Ein Angebot, ein Ziel: Anfragen |
| Business-Website | ab 1.990 € | Mehrere Leistungen, lokales SEO, Wachstum |
| Individuelles System | auf Anfrage | Buchungen, Shop, Kundenportal, Automatisierung |

Alle Details zu unseren Paketen finden Sie transparent auf der [Preisseite](/preise).

## Wovon der Preis wirklich abhängt

Zwei Websites können äußerlich ähnlich aussehen und trotzdem das Fünffache auseinanderliegen. Die Unterschiede stecken in Faktoren, die man auf den ersten Blick nicht sieht:

- **Umfang und Struktur.** Fünf Seiten oder fünfundzwanzig? Eine Leistung oder acht Leistungsseiten mit eigener SEO-Ausrichtung?
- **Inhalte.** Liefern Sie fertige Texte und Fotos – oder entstehen Texte, die verkaufen, erst im Projekt?
- **SEO-Fundament.** Saubere Technik, strukturierte Daten, lokale Optimierung für Halle und Leipzig: Das entscheidet, ob die Website gefunden wird.
- **Funktionen.** Kontaktformular ist Standard. Online-Buchung, Mehrsprachigkeit, Anbindung an Ihre Software – das ist Systemarbeit.
- **Individualität.** Ein angepasstes Theme ist günstiger als ein Design, das exakt zu Ihrer Marke und Ihren Kunden entwickelt wird.

## Warum die billigste Website oft die teuerste ist

Wir sehen regelmäßig Unternehmen aus der Region, die zum zweiten oder dritten Mal für ihre Website bezahlen. Das Muster ist fast immer gleich: Ein sehr günstiges Angebot, ein hübsches Ergebnis – und dann passiert nichts. Keine Rankings, keine Anfragen, keine Möglichkeit, Inhalte selbst zu pflegen.

Die versteckten Kosten einer Billig-Website:

1. **Unsichtbarkeit.** Ohne SEO-Fundament bleibt die Website ein Schaufenster in einer Seitengasse.
2. **Umbaukosten.** Fehlende Struktur lässt sich später oft nur durch einen [Relaunch](/leistungen/website-relaunch) beheben.
3. **Laufende Abhängigkeit.** Jede kleine Änderung kostet extra, weil das System niemand versteht.

Eine Website ist eine Investition mit Rendite-Erwartung: Sie soll Anfragen bringen. Daran sollte sich der Preis messen – nicht an der Seitenzahl.

## Laufende Kosten: womit Sie rechnen sollten

Neben dem einmaligen Projektpreis gibt es laufende Posten, die seriös eingeplant werden sollten:

- **Domain und Hosting:** je nach Setup etwa 10–40 € pro Monat
- **Wartung und Updates:** Sicherheit, Backups, kleine Anpassungen – siehe [Website-Wartung](/leistungen/website-wartung)
- **Weiterentwicklung:** Inhalte, neue Leistungsseiten, saisonale Aktionen

Bei modernen Systemen ohne Plugin-Wildwuchs sind die laufenden Kosten deutlich niedriger und besser planbar als bei gewachsenen Altsystemen.

## Wie Sie Angebote vergleichen, ohne auf Äpfel und Birnen hereinzufallen

Stellen Sie jedem Anbieter dieselben fünf Fragen:

1. Ist lokales SEO für Halle/Leipzig im Preis enthalten – oder „später möglich"?
2. Wem gehören Website, Domain und Inhalte nach dem Projekt?
3. Kann ich Texte und Bilder selbst ändern?
4. Wie schnell lädt die Website nachweisbar auf dem Smartphone?
5. Was kostet eine typische Änderung nach dem Launch?

Die Antworten trennen zuverlässig seriöse Angebote von Lockpreisen.

## Fazit: Der richtige Preis ist der, der sich rechnet

Eine professionelle Website für ein lokales Unternehmen in Halle beginnt 2026 realistisch bei 600 € für einen soliden Einstieg und liegt für ein wachstumsfähiges Business-Setup meist zwischen 2.000 € und 6.000 €. Entscheidend ist nicht die Zahl auf dem Angebot, sondern die Frage: Bringt diese Website planbar Anfragen?

Genau das rechnen wir gern konkret für Ihr Unternehmen durch – unverbindlich und mit klarer Empfehlung, welches Paket wirklich passt: [Erstgespräch anfragen](/kontakt).`,
      },
      en: {
        title: "What Does a Website Cost in Halle (Saale)? Honest 2026 Prices",
        slug: "website-cost-in-halle",
        excerpt:
          "From €600 to five figures: what a professional website really costs in Halle and Leipzig in 2026, what drives the price – and where saving backfires.",
        content: `"What does a website cost?" is the most common question in our first conversations – and the honest answer is: it depends on what the website is supposed to achieve. An online business card costs something different from a system that reliably brings inquiries.

So you can budget realistically, here is our pricing logic in the open – with real numbers for the Halle, Leipzig and Saalekreis region.

## The short answer: typical price ranges in 2026

| Website type | Typical price | Best suited for |
| --- | --- | --- |
| WordPress one-pager | from €600 | A solid online presence on a small budget |
| Landing page (React/Next.js) | from €990 | One offer, one goal: inquiries |
| Business website | from €1,990 | Multiple services, local SEO, growth |
| Custom system | on request | Bookings, shop, client portal, automation |

You can find all package details transparently on our [pricing page](/en/pricing).

## What actually drives the price

Two websites can look similar on the surface and still differ by a factor of five. The differences hide in factors you do not see at first glance:

- **Scope and structure.** Five pages or twenty-five? One service or eight service pages, each with its own SEO focus?
- **Content.** Do you deliver finished texts and photos – or are texts that sell created within the project?
- **SEO foundation.** Clean technology, structured data, local optimisation for Halle and Leipzig: this decides whether the website gets found.
- **Features.** A contact form is standard. Online booking, multiple languages, integration with your software – that is systems work.
- **Individuality.** An adapted theme costs less than a design developed precisely for your brand and your customers.

## Why the cheapest website is often the most expensive

We regularly meet businesses from the region paying for their website for the second or third time. The pattern is almost always the same: a very cheap offer, a pretty result – and then nothing happens. No rankings, no inquiries, no way to maintain content yourself.

The hidden costs of a bargain website:

1. **Invisibility.** Without an SEO foundation, the website remains a shop window in a side alley.
2. **Rebuild costs.** Missing structure can often only be fixed later through a [relaunch](/en/services/website-relaunch).
3. **Ongoing dependency.** Every small change costs extra because nobody understands the system.

A website is an investment with an expected return: it should bring inquiries. The price should be measured against that – not against the page count.

## Running costs: what to plan for

Besides the one-time project price, there are ongoing items that should be budgeted seriously:

- **Domain and hosting:** roughly €10–40 per month depending on the setup
- **Maintenance and updates:** security, backups, small adjustments – see [website maintenance](/en/services/website-maintenance)
- **Further development:** content, new service pages, seasonal campaigns

With modern systems free of plugin sprawl, running costs are significantly lower and more predictable than with legacy setups grown over years.

## How to compare offers without falling for apples and oranges

Ask every provider the same five questions:

1. Is local SEO for Halle/Leipzig included in the price – or "possible later"?
2. Who owns the website, domain and content after the project?
3. Can I change texts and images myself?
4. How fast does the website verifiably load on a smartphone?
5. What does a typical change cost after launch?

The answers reliably separate serious offers from teaser prices.

## Conclusion: the right price is the one that pays off

A professional website for a local business in Halle realistically starts at €600 in 2026 for a solid entry and mostly lands between €2,000 and €6,000 for a growth-ready business setup. What matters is not the number on the quote, but the question: does this website reliably bring inquiries?

We are happy to calculate exactly that for your business – without obligation and with a clear recommendation on which package truly fits: [request an initial consultation](/en/contact).`,
      },
      ru: {
        title: "Сколько стоит сайт в Halle (Saale)? Честные цены 2026",
        slug: "skolko-stoit-sajt-v-halle",
        excerpt:
          "От 600 € до пятизначных сумм: сколько реально стоит профессиональный сайт в Halle и Leipzig в 2026 году, от чего зависит цена — и где экономия оборачивается убытком.",
        content: `«Сколько стоит сайт?» — самый частый вопрос на первых встречах. Честный ответ: зависит от того, что сайт должен делать. Визитка в интернете стоит одних денег, а система, которая стабильно приносит заявки, — других.

Чтобы вы могли считать реалистично, мы открыто показываем нашу ценовую логику — с настоящими цифрами для региона Halle, Leipzig и Saalekreis.

## Короткий ответ: типичные вилки цен в 2026 году

| Тип сайта | Типичная цена | Кому подходит |
| --- | --- | --- |
| WordPress-onepager | от 600 € | Достойное присутствие в сети при небольшом бюджете |
| Лендинг (React/Next.js) | от 990 € | Одно предложение, одна цель: заявки |
| Бизнес-сайт | от 1 990 € | Несколько услуг, локальное SEO, рост |
| Индивидуальная система | по запросу | Бронирования, магазин, кабинет клиента, автоматизация |

Все детали пакетов прозрачно собраны на [странице цен](/ru/ceny).

## От чего цена зависит на самом деле

Два сайта могут выглядеть похоже и при этом отличаться по цене в пять раз. Разница прячется в том, что не видно с первого взгляда:

- **Объём и структура.** Пять страниц или двадцать пять? Одна услуга или восемь страниц услуг, каждая со своим SEO-фокусом?
- **Контент.** Вы приносите готовые тексты и фото — или продающие тексты создаются в проекте?
- **SEO-фундамент.** Чистая техническая база, структурированные данные, локальная оптимизация под Halle и Leipzig — от этого зависит, найдут ли сайт вообще.
- **Функции.** Контактная форма — стандарт. Онлайн-бронирование, мультиязычность, интеграция с вашими программами — это уже системная работа.
- **Индивидуальность.** Адаптированный шаблон дешевле, чем дизайн, разработанный точно под ваш бренд и ваших клиентов.

## Почему самый дешёвый сайт часто оказывается самым дорогим

Мы регулярно встречаем компании из региона, которые платят за сайт во второй или третий раз. Сценарий почти всегда один: очень дешёвое предложение, симпатичный результат — и дальше ничего. Ни позиций, ни заявок, ни возможности самостоятельно менять контент.

Скрытые издержки дешёвого сайта:

1. **Невидимость.** Без SEO-фундамента сайт остаётся витриной в глухом переулке.
2. **Стоимость переделки.** Отсутствие структуры позже чаще всего лечится только [релончем](/ru/uslugi/relonch-sajta).
3. **Постоянная зависимость.** Любое мелкое изменение стоит денег, потому что систему никто не понимает.

Сайт — это инвестиция с ожидаемой отдачей: он должен приносить заявки. Именно этим стоит мерить цену, а не количеством страниц.

## Текущие расходы: на что закладывать бюджет

Помимо разовой стоимости проекта есть регулярные статьи, которые стоит планировать всерьёз:

- **Домен и хостинг:** в зависимости от конфигурации примерно 10–40 € в месяц
- **Поддержка и обновления:** безопасность, бэкапы, мелкие правки — см. [поддержку сайтов](/ru/uslugi/podderzhka-saytov)
- **Развитие:** контент, новые страницы услуг, сезонные акции

У современных систем без нагромождения плагинов текущие расходы заметно ниже и предсказуемее, чем у старых разросшихся конфигураций.

## Как сравнивать предложения и не путать тёплое с мягким

Задайте каждому исполнителю одни и те же пять вопросов:

1. Локальное SEO под Halle/Leipzig входит в цену — или «можно потом»?
2. Кому после проекта принадлежат сайт, домен и контент?
3. Смогу ли я сам менять тексты и картинки?
4. Как быстро сайт доказуемо грузится на смартфоне?
5. Сколько стоит типичная правка после запуска?

Ответы надёжно отделяют серьёзные предложения от цен-приманок.

## Вывод: правильная цена — та, которая окупается

Профессиональный сайт для локального бизнеса в Halle в 2026 году реалистично начинается от 600 € за достойный старт, а готовая к росту бизнес-конфигурация чаще всего стоит от 2 000 € до 6 000 €. Решает не цифра в смете, а вопрос: приносит ли этот сайт заявки предсказуемо?

Именно это мы с удовольствием посчитаем конкретно для вашей компании — без обязательств и с честной рекомендацией, какой пакет действительно подходит: [запросить первую консультацию](/ru/kontakt).`,
      },
    },
  },
  {
    key: "google-unternehmensprofil-optimieren",
    categoryKey: "seo",
    coverImage: "/images/blog/google-unternehmensprofil.webp",
    publishedAt: "2026-05-28T08:00:00.000Z",
    translations: {
      de: {
        title: "Google-Unternehmensprofil optimieren: Die Anleitung für lokale Unternehmen",
        slug: "google-unternehmensprofil-optimieren",
        excerpt:
          "Das Google-Unternehmensprofil entscheidet, wer im Local Pack steht. Diese Anleitung zeigt Punkt für Punkt, wie Sie Ihr Profil 2026 richtig aufsetzen und pflegen.",
        content: `Bevor ein Kunde Ihre Website sieht, sieht er meistens Ihr Google-Unternehmensprofil: in der Karten-Box über den Suchergebnissen, auf Google Maps, in der Seitenleiste bei der Suche nach Ihrem Namen. Für lokale Unternehmen in Halle, Leipzig und Umgebung ist dieses Profil das wichtigste kostenlose Marketinginstrument überhaupt – und gleichzeitig das am häufigsten vernachlässigte.

Diese Anleitung führt durch alle Stellschrauben, sortiert nach Wirkung.

## Grundlage: Profil beanspruchen und verifizieren

Falls noch nicht geschehen: Suchen Sie Ihr Unternehmen bei Google und beanspruchen Sie das Profil über „Inhaber dieses Unternehmens?". Die Verifizierung läuft je nach Branche per Video, Telefon oder Postkarte. Ohne Verifizierung können Sie weder Angaben ändern noch auf Bewertungen antworten – dieser Schritt hat absolute Priorität.

## Die Kategorien: der unterschätzte Ranking-Hebel

Die **Hauptkategorie** ist eines der stärksten Ranking-Signale im lokalen Umfeld. Wählen Sie die spezifischste Kategorie, die zutrifft: „Italienisches Restaurant" schlägt „Restaurant", „Glaserei" schlägt „Handwerker".

Ergänzen Sie danach **Nebenkategorien** für weitere relevante Leistungen – aber nur solche, die Sie tatsächlich anbieten. Falsche Kategorien verwässern die Zuordnung und können zu irrelevanten Anfragen führen.

## NAP-Konsistenz: Name, Adresse, Telefonnummer

Google gleicht Ihre Angaben mit dem gesamten Netz ab: Website, Verzeichnisse, soziale Netzwerke. Jede Abweichung – „Str." hier, „Straße" dort, alte Rufnummer im Branchenbuch – senkt das Vertrauen in Ihre Daten.

Die Regel ist simpel: Legen Sie **eine** verbindliche Schreibweise fest und verwenden Sie sie überall identisch. Auf der eigenen Website gehört sie zusätzlich als strukturierte Daten (LocalBusiness-Schema) hinterlegt – so wie wir es bei jedem [SEO-Projekt in Halle](/leistungen/seo-halle) standardmäßig einbauen.

## Fotos: eigene Bilder schlagen jedes Stockfoto

Profile mit eigenen, aktuellen Fotos erhalten messbar mehr Klicks und Routenanfragen. Was funktioniert:

- Außenansicht (hilft beim Wiederfinden vor Ort)
- Innenräume und Arbeitsplätze
- Team bei der Arbeit
- Ergebnisse: fertige Projekte, Gerichte, Frisuren – je nach Branche
- Regelmäßig neue Bilder statt einer einmaligen Ladung

Vermeiden Sie Stockfotos vollständig. Nutzer erkennen sie sofort, und Google kann sie ebenfalls einordnen.

## Leistungen, Produkte und die Beschreibung

Pflegen Sie den Bereich **Leistungen** vollständig – jede Leistung, die Kunden suchen könnten, gehört hinein, gern mit kurzer Beschreibung und Preisrahmen. Die **Unternehmensbeschreibung** (750 Zeichen) sollte konkret beantworten: Was bieten Sie, für wen, in welchem Gebiet? Nennen Sie Halle, Leipzig oder Ihr Einzugsgebiet ausdrücklich – aber schreiben Sie für Menschen, nicht für den Algorithmus.

## Bewertungen: sammeln und beantworten

Bewertungen beeinflussen Ranking und Klickrate gleichzeitig. Zwei Gewohnheiten machen den Unterschied:

1. **Aktiv und regelmäßig um Bewertungen bitten** – am wirksamsten direkt nach einem gelungenen Auftrag, per Link oder QR-Code.
2. **Jede Bewertung beantworten**, positive kurz und persönlich, kritische sachlich mit Lösungsangebot. Ein Profil, dessen Inhaber sichtbar reagiert, wirkt auf Kunden und Suchmaschine gleichermaßen lebendig.

Wie Sie den Bewertungsaufbau in Ihre Abläufe integrieren, haben wir im [großen Leitfaden zum lokalen SEO](/blog/lokales-seo-halle) beschrieben.

## Beiträge und Aktualität

Google-Beiträge (Angebote, Neuigkeiten, Veranstaltungen) halten das Profil aktiv. Sie müssen kein Content-Feuerwerk zünden – ein Beitrag alle zwei bis vier Wochen reicht, um Aktualität zu signalisieren: neues Projekt, saisonales Angebot, geänderte Zeiten.

Prüfen Sie außerdem quartalsweise: Stimmen Öffnungszeiten, Feiertagszeiten, Telefonnummer und Website-Link noch?

## Die Verbindung zur Website

Das Profil gewinnt Sichtbarkeit, die Website macht daraus Anfragen – beide müssen zusammenpassen. Verlinken Sie idealerweise nicht pauschal auf die Startseite, sondern auf die Seite, die zur gesuchten Leistung passt. Dafür braucht die Website eine saubere Struktur mit eigenen Leistungsseiten – der häufigste Umbaupunkt, den wir bei [Website-Projekten](/leistungen/website-erstellen-lassen) in der Region beheben.

## Checkliste zum Abschluss

- Profil verifiziert und im eigenen Zugriff
- Spezifische Hauptkategorie plus passende Nebenkategorien
- NAP überall identisch, auf der Website als Schema hinterlegt
- Mindestens zehn eigene Fotos, regelmäßig ergänzt
- Leistungen vollständig gepflegt, Beschreibung mit lokalem Bezug
- Bewertungsprozess etabliert, alle Bewertungen beantwortet
- Öffnungszeiten aktuell, Beiträge alle paar Wochen

Wer diese Punkte konsequent umsetzt, steht in den meisten Branchen der Region bereits vor dem Großteil des Wettbewerbs.

Sie möchten wissen, wie Ihr Profil und Ihre Website heute abschneiden? Wir prüfen beides kostenlos: [Website-Analyse anfragen](/kontakt).`,
      },
      en: {
        title: "Optimizing Your Google Business Profile: The Guide for Local Businesses",
        slug: "optimize-google-business-profile",
        excerpt:
          "The Google Business Profile decides who appears in the Local Pack. This guide walks through how to set up and maintain your profile correctly in 2026, point by point.",
        content: `Before a customer sees your website, they usually see your Google Business Profile: in the map box above the search results, on Google Maps, in the sidebar when searching your name. For local businesses in Halle, Leipzig and the surrounding area, this profile is the single most important free marketing tool – and at the same time the most neglected one.

This guide walks through every lever, sorted by impact.

## Foundation: claim and verify the profile

If you have not done so: search for your business on Google and claim the profile via "Own this business?". Depending on the industry, verification runs via video, phone or postcard. Without verification you can neither change details nor reply to reviews – this step has absolute priority.

## Categories: the underrated ranking lever

The **primary category** is one of the strongest ranking signals in local search. Choose the most specific category that applies: "Italian restaurant" beats "Restaurant", "Glazier" beats "Craftsman".

Then add **secondary categories** for further relevant services – but only ones you actually offer. Wrong categories dilute attribution and can lead to irrelevant inquiries.

## NAP consistency: name, address, phone number

Google cross-checks your details against the entire web: website, directories, social networks. Every deviation – "St." here, "Street" there, an old phone number in a business directory – lowers trust in your data.

The rule is simple: define **one** binding spelling and use it identically everywhere. On your own website it should additionally be embedded as structured data (LocalBusiness schema) – exactly what we build into every [SEO project in Halle](/en/services/seo-halle) by default.

## Photos: your own images beat any stock photo

Profiles with own, current photos measurably receive more clicks and direction requests. What works:

- Exterior view (helps people find you on site)
- Interiors and workplaces
- The team at work
- Results: finished projects, dishes, haircuts – depending on the industry
- New images regularly instead of a one-time upload

Avoid stock photos entirely. Users recognise them instantly, and Google can classify them too.

## Services, products and the description

Maintain the **Services** section completely – every service customers might search for belongs there, ideally with a short description and price range. The **business description** (750 characters) should answer concretely: what do you offer, for whom, in which area? Name Halle, Leipzig or your service area explicitly – but write for people, not for the algorithm.

## Reviews: collect and answer

Reviews influence ranking and click-through rate at the same time. Two habits make the difference:

1. **Ask for reviews actively and regularly** – most effectively right after a successful job, via link or QR code.
2. **Answer every review**, positive ones briefly and personally, critical ones factually with a solution offer. A profile whose owner visibly responds appears alive to customers and search engine alike.

How to integrate review building into your routines is covered in our [complete local SEO guide](/en/blog/local-seo-halle).

## Posts and freshness

Google posts (offers, news, events) keep the profile active. You do not need content fireworks – one post every two to four weeks is enough to signal freshness: a new project, a seasonal offer, changed hours.

Additionally, check quarterly: are opening hours, holiday hours, phone number and website link still correct?

## The connection to your website

The profile wins visibility, the website turns it into inquiries – both have to fit together. Ideally, do not link generically to the homepage but to the page matching the searched service. That requires a website with clean structure and dedicated service pages – the most common rebuild we tackle in [website projects](/en/services/website-development) across the region.

## Final checklist

- Profile verified and under your own control
- Specific primary category plus fitting secondary categories
- NAP identical everywhere, embedded as schema on the website
- At least ten own photos, added to regularly
- Services fully maintained, description with local context
- Review process established, all reviews answered
- Opening hours current, posts every few weeks

Implementing these points consistently already puts you ahead of most competitors in the region in most industries.

Want to know how your profile and website score today? We check both free of charge: [request a website analysis](/en/contact).`,
      },
      ru: {
        title: "Оптимизация бизнес-профиля Google: инструкция для локального бизнеса",
        slug: "optimizaciya-google-biznes-profilya",
        excerpt:
          "Бизнес-профиль Google решает, кто попадёт в локальный блок выдачи. Инструкция по пунктам: как правильно настроить и вести профиль в 2026 году.",
        content: `Прежде чем клиент увидит ваш сайт, он обычно видит ваш бизнес-профиль Google: в блоке с картой над результатами поиска, на Google Maps, в панели справа при поиске по названию. Для локального бизнеса в Halle, Leipzig и окрестностях этот профиль — самый важный бесплатный маркетинговый инструмент. И одновременно самый заброшенный.

Эта инструкция проходит по всем настройкам в порядке их влияния.

## База: заявить права и пройти верификацию

Если ещё не сделали: найдите свою компанию в Google и заявите права через «Вы владелец этой компании?». Верификация проходит по видео, телефону или открыткой — в зависимости от отрасли. Без неё нельзя ни менять данные, ни отвечать на отзывы, поэтому этот шаг — абсолютный приоритет.

## Категории: недооценённый рычаг ранжирования

**Основная категория** — один из сильнейших сигналов локального ранжирования. Выбирайте самую конкретную из подходящих: «Итальянский ресторан» сильнее, чем «Ресторан», «Стекольная мастерская» сильнее, чем «Мастерская».

Затем добавьте **дополнительные категории** для остальных актуальных услуг — но только тех, что вы реально оказываете. Лишние категории размывают привязку и приводят нерелевантные обращения.

## Консистентность NAP: название, адрес, телефон

Google сверяет ваши данные со всем интернетом: сайтом, каталогами, соцсетями. Каждое расхождение — «ул.» здесь, «улица» там, старый номер в справочнике — снижает доверие к вашим данным.

Правило простое: зафиксируйте **одно** каноническое написание и используйте его везде идентично. На собственном сайте оно дополнительно должно лежать в структурированных данных (схема LocalBusiness) — именно так мы делаем в каждом [SEO-проекте в Halle](/ru/uslugi/seo-halle) по умолчанию.

## Фотографии: свои снимки сильнее любого стока

Профили с собственными свежими фото получают измеримо больше кликов и запросов маршрута. Что работает:

- Вид снаружи (помогает найти вас на месте)
- Интерьеры и рабочие места
- Команда за работой
- Результаты: готовые проекты, блюда, стрижки — в зависимости от отрасли
- Регулярные новые снимки вместо одной разовой загрузки

Стоковые фото исключите полностью. Пользователи распознают их мгновенно, и Google тоже умеет их классифицировать.

## Услуги, товары и описание

Полностью заполните раздел **Услуги** — туда должно попасть всё, что клиенты могут искать, желательно с коротким описанием и ценовым ориентиром. **Описание компании** (750 знаков) должно конкретно отвечать: что вы предлагаете, кому, в какой зоне? Явно называйте Halle, Leipzig или свою зону обслуживания — но пишите для людей, а не для алгоритма.

## Отзывы: собирать и отвечать

Отзывы влияют и на позиции, и на кликабельность одновременно. Разницу делают две привычки:

1. **Активно и регулярно просить отзывы** — эффективнее всего сразу после удачного заказа, по ссылке или QR-коду.
2. **Отвечать на каждый отзыв**: на положительные коротко и лично, на критические — по делу и с предложением решения. Профиль, где владелец заметно реагирует, выглядит живым и для клиентов, и для поисковика.

Как встроить сбор отзывов в рабочие процессы, мы разобрали в [большом руководстве по локальному SEO](/ru/blog/lokalnoe-seo-halle).

## Публикации и актуальность

Публикации в Google (акции, новости, события) поддерживают профиль активным. Контент-фейерверк не нужен: одной публикации раз в две-четыре недели достаточно, чтобы сигнализировать свежесть — новый проект, сезонное предложение, изменённые часы.

Дополнительно раз в квартал проверяйте: актуальны ли часы работы, праздничный график, телефон и ссылка на сайт?

## Связка с сайтом

Профиль приносит видимость, сайт превращает её в заявки — они должны работать в паре. В идеале ссылайтесь не на главную страницу вообще, а на страницу, соответствующую искомой услуге. Для этого сайту нужна чистая структура с отдельными страницами услуг — самая частая доработка, которую мы делаем в [проектах по созданию сайтов](/ru/uslugi/razrabotka-saytov) в регионе.

## Итоговый чек-лист

- Профиль верифицирован и под вашим контролем
- Конкретная основная категория плюс подходящие дополнительные
- NAP везде идентичен, на сайте — в виде схемы
- Минимум десять собственных фото, регулярно пополняются
- Услуги заполнены полностью, описание с локальной привязкой
- Процесс сбора отзывов налажен, все отзывы с ответами
- Часы работы актуальны, публикации раз в несколько недель

Кто последовательно закрывает эти пункты, в большинстве отраслей региона уже впереди основной массы конкурентов.

Хотите узнать, как ваш профиль и сайт выглядят сегодня? Проверим и то и другое бесплатно: [запросить аудит сайта](/ru/kontakt).`,
      },
    },
  },
  {
    key: "sichtbarkeit-in-ki-suche",
    categoryKey: "ki-suche",
    coverImage: "/images/blog/ki-suche-sichtbarkeit.webp",
    publishedAt: "2026-06-25T08:00:00.000Z",
    translations: {
      de: {
        title: "In ChatGPT, Gemini & Perplexity gefunden werden: KI-Suche für lokale Unternehmen",
        slug: "sichtbarkeit-in-ki-suche",
        excerpt:
          "Immer mehr Menschen fragen KI-Assistenten statt Google. Was das für lokale Unternehmen in Halle und Leipzig bedeutet – und wie Ihre Website in KI-Antworten auftaucht.",
        content: `„Welches Hotel in Halle ist für eine Geschäftsreise zu empfehlen?" – solche Fragen stellen Menschen heute nicht mehr nur Google, sondern zunehmend ChatGPT, Gemini, Perplexity oder Claude. Die Antwort ist kein Ranking mit zehn Links, sondern eine direkte Empfehlung mit zwei, drei konkreten Namen.

Für lokale Unternehmen ist das eine grundlegende Verschiebung: Wer in diesen Antworten vorkommt, gewinnt Kunden, bevor die klassische Suche überhaupt stattfindet. Die gute Nachricht: Sichtbarkeit in KI-Antworten ist beeinflussbar – und die Grundlagen dafür können Sie heute legen.

## Wie KI-Systeme lokale Empfehlungen bilden

KI-Assistenten erfinden ihre Empfehlungen nicht. Sie stützen sich auf:

- **Trainingsdaten**: Inhalte, die zum Zeitpunkt des Modelltrainings öffentlich verfügbar waren
- **Live-Suche**: Aktuelle Systeme suchen bei lokalen Fragen zusätzlich im Web und werten Treffer aus
- **Strukturierte Quellen**: Google-Unternehmensprofile, Verzeichnisse, Bewertungsportale, Schema.org-Daten

Vereinfacht gilt: KI-Systeme empfehlen Unternehmen, die im Netz **eindeutig identifizierbar, inhaltlich klar beschrieben und durch Dritte bestätigt** sind. Das nennt man inzwischen GEO (Generative Engine Optimization) oder AIO (AI Optimization) – gemeint ist dasselbe: die eigene Auffindbarkeit in KI-Antworten systematisch verbessern.

## Der wichtigste Grundsatz: KI-Optimierung baut auf gutem SEO auf

Wer bei Google lokal unsichtbar ist, wird auch von KI-Systemen selten empfohlen. Die Signale überschneiden sich stark:

- Ein vollständiges, aktives Google-Unternehmensprofil
- Eine schnelle Website mit klarer Struktur
- Echte Bewertungen in relevanter Zahl
- Konsistente Unternehmensdaten im gesamten Netz

Alles, was im [Leitfaden zum lokalen SEO](/blog/lokales-seo-halle) steht, ist zugleich das Fundament der KI-Sichtbarkeit. Darauf setzen dann KI-spezifische Maßnahmen auf.

## Maßnahme 1: Inhalte, die Fragen wörtlich beantworten

KI-Systeme extrahieren Antworten. Eine Website, die Fragen direkt und vollständig beantwortet, wird deutlich häufiger als Quelle verwendet als eine, die nur Schlagworte aneinanderreiht.

Konkret bedeutet das:

- **FAQ-Bereiche** mit echten Kundenfragen und substanziellen Antworten
- **Klare Aussagen statt Marketing-Nebel**: „Wir erstellen Websites ab 600 €, typische Projektdauer drei bis sechs Wochen" ist KI-verwertbar. „Ihr Partner für digitale Exzellenz" ist es nicht.
- **Eine Seite pro Thema**: Jede Leistung, jede Branche, jeder Standort mit eigener, inhaltlich vollständiger Seite

## Maßnahme 2: Strukturierte Daten als Maschinen-Klartext

Schema.org-Markup übersetzt Ihre Inhalte in ein Format, das Maschinen fehlerfrei lesen: LocalBusiness mit Adresse und Öffnungszeiten, Service für Leistungen, FAQPage für Fragen, Review-Daten für Bewertungen.

Für Menschen unsichtbar, für KI-Systeme Gold wert – denn strukturierte Daten beseitigen Mehrdeutigkeit. Genau deshalb gehört vollständiges Markup bei uns zu jedem Projekt, von der [Website-Erstellung](/leistungen/website-erstellen-lassen) bis zur gezielten [KI-Optimierung](/leistungen/ki-optimierung).

## Maßnahme 3: Erwähnungen durch Dritte

KI-Systeme gewichten Bestätigung von außen: Bewertungen, Verzeichniseinträge, regionale Presse, Branchenportale. Ein Unternehmen, das nur auf der eigenen Website existiert, ist für ein Sprachmodell schwer einzuordnen.

Realistische Schritte für die Region:

1. Bewertungen auf Google kontinuierlich aufbauen und beantworten
2. Einträge in relevanten Branchen- und Regionalverzeichnissen pflegen
3. Lokale Kooperationen und Projektberichte sichtbar machen

## Maßnahme 4: Technisch lesbar bleiben

Was ein KI-Crawler nicht lesen kann, kann er nicht empfehlen. Prüfenswert:

- Inhalte müssen als echter Text im HTML stehen, nicht nur in Bildern oder komplexen Skripten
- Schnelle Ladezeiten – Crawler haben Budgets
- Eine saubere Seitenstruktur mit logischen Überschriften
- Aktualität: veraltete Angaben (alte Preise, alte Öffnungszeiten) landen sonst in KI-Antworten

## Was Sie realistisch erwarten können

KI-Sichtbarkeit ist kein Schalter, sondern ein Prozess. Unsere Erfahrung aus Projekten in Halle und Leipzig: Unternehmen mit sauberem lokalem SEO-Fundament, klaren Inhalten und aktiver Bewertungsbasis tauchen innerhalb einiger Monate zunehmend in KI-Antworten zu regionalen Fragen auf. Wer früh anfängt, besetzt die Empfehlungsplätze, bevor der Wettbewerb das Thema versteht.

## Fazit

Die Suche verschiebt sich – von zehn blauen Links zu direkten Antworten. Lokale Unternehmen, die jetzt in klare Inhalte, strukturierte Daten und echte Reputation investieren, werden in beiden Welten gefunden: bei Google und in den KI-Assistenten ihrer Kunden.

Wir prüfen gern, wie sichtbar Ihr Unternehmen heute in Suche und KI-Antworten ist – kostenlos und mit konkreten nächsten Schritten: [Analyse anfragen](/kontakt).`,
      },
      en: {
        title: "Getting Found in ChatGPT, Gemini & Perplexity: AI Search for Local Businesses",
        slug: "ai-search-visibility",
        excerpt:
          "More and more people ask AI assistants instead of Google. What that means for local businesses in Halle and Leipzig – and how your website shows up in AI answers.",
        content: `"Which hotel in Halle would you recommend for a business trip?" – people no longer ask only Google such questions, but increasingly ChatGPT, Gemini, Perplexity or Claude. The answer is not a ranking with ten links, but a direct recommendation with two or three specific names.

For local businesses this is a fundamental shift: whoever appears in these answers wins customers before the classic search even happens. The good news: visibility in AI answers can be influenced – and you can lay the groundwork today.

## How AI systems form local recommendations

AI assistants do not invent their recommendations. They rely on:

- **Training data**: content publicly available at the time the model was trained
- **Live search**: current systems additionally search the web for local questions and evaluate the results
- **Structured sources**: Google Business Profiles, directories, review platforms, Schema.org data

Simplified: AI systems recommend businesses that are **unambiguously identifiable online, clearly described in substance, and confirmed by third parties**. This is now called GEO (Generative Engine Optimization) or AIO (AI Optimization) – both mean the same thing: systematically improving your discoverability in AI answers.

## The most important principle: AI optimization builds on good SEO

A business locally invisible on Google is rarely recommended by AI systems either. The signals overlap heavily:

- A complete, active Google Business Profile
- A fast website with clear structure
- Genuine reviews in relevant numbers
- Consistent business data across the entire web

Everything in our [local SEO guide](/en/blog/local-seo-halle) is simultaneously the foundation of AI visibility. AI-specific measures then build on top.

## Measure 1: content that answers questions literally

AI systems extract answers. A website that answers questions directly and completely gets used as a source far more often than one stringing together buzzwords.

Concretely this means:

- **FAQ sections** with real customer questions and substantial answers
- **Clear statements instead of marketing fog**: "We build websites from €600, typical project duration three to six weeks" is AI-usable. "Your partner for digital excellence" is not.
- **One page per topic**: every service, every industry, every location with its own substantively complete page

## Measure 2: structured data as machine-readable plain language

Schema.org markup translates your content into a format machines read without errors: LocalBusiness with address and opening hours, Service for offerings, FAQPage for questions, review data for ratings.

Invisible to humans, gold for AI systems – because structured data removes ambiguity. That is exactly why complete markup is part of every project we deliver, from [website development](/en/services/website-development) to dedicated [AI optimization](/en/services/ai-optimization).

## Measure 3: third-party mentions

AI systems weight external confirmation: reviews, directory listings, regional press, industry portals. A business that only exists on its own website is hard for a language model to place.

Realistic steps for our region:

1. Continuously build and answer Google reviews
2. Maintain listings in relevant industry and regional directories
3. Make local collaborations and project reports visible

## Measure 4: staying technically readable

What an AI crawler cannot read, it cannot recommend. Worth checking:

- Content must exist as real text in the HTML, not only in images or complex scripts
- Fast loading times – crawlers have budgets
- A clean page structure with logical headings
- Freshness: outdated details (old prices, old opening hours) otherwise end up in AI answers

## What you can realistically expect

AI visibility is not a switch, it is a process. Our experience from projects in Halle and Leipzig: businesses with a clean local SEO foundation, clear content and an active review base increasingly appear in AI answers to regional questions within a few months. Those who start early occupy the recommendation slots before competitors understand the topic.

## Conclusion

Search is shifting – from ten blue links to direct answers. Local businesses investing now in clear content, structured data and genuine reputation will be found in both worlds: on Google and in their customers' AI assistants.

We are happy to check how visible your business is in search and AI answers today – free of charge and with concrete next steps: [request an analysis](/en/contact).`,
      },
      ru: {
        title: "Как попасть в ответы ChatGPT, Gemini и Perplexity: AI-поиск для локального бизнеса",
        slug: "vidimost-v-ai-poiske",
        excerpt:
          "Всё больше людей спрашивают AI-ассистентов вместо Google. Что это значит для локального бизнеса в Halle и Leipzig — и как ваш сайт попадает в ответы ИИ.",
        content: `«Какой отель в Halle посоветуешь для командировки?» — такие вопросы люди сегодня задают уже не только Google, но всё чаще ChatGPT, Gemini, Perplexity или Claude. Ответом становится не выдача из десяти ссылок, а прямая рекомендация с двумя-тремя конкретными названиями.

Для локального бизнеса это фундаментальный сдвиг: кто попадает в эти ответы, получает клиентов ещё до того, как случится классический поиск. Хорошая новость: на видимость в ответах ИИ можно влиять — и фундамент для этого можно заложить уже сегодня.

## Как AI-системы формируют локальные рекомендации

AI-ассистенты не выдумывают рекомендации. Они опираются на:

- **Обучающие данные** — контент, публично доступный на момент обучения модели
- **Живой поиск** — современные системы при локальных вопросах дополнительно ищут в интернете и анализируют результаты
- **Структурированные источники** — бизнес-профили Google, каталоги, платформы отзывов, данные Schema.org

Упрощённо: AI-системы рекомендуют компании, которые в интернете **однозначно идентифицируются, содержательно описаны и подтверждены третьими сторонами**. Это направление теперь называют GEO (Generative Engine Optimization) или AIO (AI Optimization) — суть одна: системно улучшать свою находимость в ответах ИИ.

## Главный принцип: AI-оптимизация строится на хорошем SEO

Кто локально невидим в Google, того редко рекомендуют и AI-системы. Сигналы сильно пересекаются:

- Полный и активный бизнес-профиль Google
- Быстрый сайт с ясной структурой
- Настоящие отзывы в значимом количестве
- Консистентные данные компании по всему интернету

Всё, что описано в нашем [руководстве по локальному SEO](/ru/blog/lokalnoe-seo-halle), одновременно является фундаментом AI-видимости. Поверх него строятся уже специфические меры.

## Мера 1: контент, который отвечает на вопросы буквально

AI-системы извлекают ответы. Сайт, который отвечает на вопросы прямо и полно, используется как источник заметно чаще, чем сайт из нанизанных лозунгов.

Конкретно это значит:

- **FAQ-разделы** с настоящими вопросами клиентов и содержательными ответами
- **Ясные утверждения вместо маркетингового тумана**: «Делаем сайты от 600 €, типичный срок проекта три-шесть недель» — ИИ может это использовать. «Ваш партнёр в мире цифрового совершенства» — нет.
- **Одна страница на одну тему**: каждая услуга, каждая отрасль, каждый город — со своей содержательно полной страницей

## Мера 2: структурированные данные — машинный «чистый текст»

Разметка Schema.org переводит ваш контент в формат, который машины читают без ошибок: LocalBusiness с адресом и часами работы, Service для услуг, FAQPage для вопросов, данные отзывов для рейтингов.

Для людей невидимо, для AI-систем — на вес золота, потому что структурированные данные убирают неоднозначность. Именно поэтому полная разметка входит у нас в каждый проект — от [создания сайта](/ru/uslugi/razrabotka-saytov) до целевой [оптимизации под ИИ](/ru/uslugi/optimizaciya-pod-ii).

## Мера 3: упоминания третьих сторон

AI-системы взвешивают внешнее подтверждение: отзывы, записи в каталогах, региональную прессу, отраслевые порталы. Компанию, существующую только на собственном сайте, языковой модели трудно классифицировать.

Реалистичные шаги для региона:

1. Постоянно наращивать отзывы в Google и отвечать на них
2. Поддерживать записи в релевантных отраслевых и региональных каталогах
3. Делать заметными локальные партнёрства и кейсы

## Мера 4: оставаться технически читаемым

Что AI-краулер не может прочитать, то он не может рекомендовать. Стоит проверить:

- Контент должен существовать как настоящий текст в HTML, а не только в картинках и сложных скриптах
- Быстрая загрузка — у краулеров есть бюджеты
- Чистая структура страниц с логичными заголовками
- Актуальность: устаревшие данные (старые цены, старые часы работы) иначе попадут в ответы ИИ

## Чего ожидать реалистично

AI-видимость — не выключатель, а процесс. Наш опыт проектов в Halle и Leipzig: компании с чистым локальным SEO-фундаментом, ясным контентом и активной базой отзывов в течение нескольких месяцев всё чаще появляются в ответах ИИ на региональные вопросы. Кто начинает рано, занимает рекомендательные места до того, как конкуренты поймут тему.

## Вывод

Поиск смещается — от десяти синих ссылок к прямым ответам. Локальный бизнес, который сейчас инвестирует в ясный контент, структурированные данные и настоящую репутацию, будут находить в обоих мирах: в Google и в AI-ассистентах его клиентов.

Мы с удовольствием проверим, насколько ваша компания видима в поиске и ответах ИИ сегодня — бесплатно и с конкретными следующими шагами: [запросить анализ](/ru/kontakt).`,
      },
    },
  },
  {
    key: "restaurant-website-mehr-reservierungen",
    categoryKey: "praxis",
    coverImage: "/images/blog/restaurant-website.webp",
    publishedAt: "2026-06-11T08:00:00.000Z",
    translations: {
      de: {
        title: "Restaurant-Website 2026: Mehr Reservierungen ohne Portal-Provisionen",
        slug: "restaurant-website-mehr-reservierungen",
        excerpt:
          "Warum Restaurants in Halle und Leipzig mit der eigenen Website mehr direkte Reservierungen gewinnen – und welche fünf Elemente dafür entscheidend sind.",
        content: `Viele Restaurants in der Region kennen das Rechenspiel: Die Tische sind voll, aber ein spürbarer Teil des Umsatzes fließt als Provision an Buchungsportale und Lieferplattformen – bei gleichzeitig wachsender Abhängigkeit von deren Regeln und Rankings. Die eigene Website ist der einzige Kanal, der vollständig Ihnen gehört. Richtig aufgebaut, wird sie zur wichtigsten Quelle direkter Reservierungen.

## Wie Gäste heute ein Restaurant auswählen

Der typische Weg zur Reservierung in Halle oder Leipzig sieht 2026 so aus:

1. Suche auf dem Smartphone: „Restaurant Halle Innenstadt" oder eine Empfehlung aus ChatGPT oder Google Maps
2. Blick auf Bewertungen und Fotos im Google-Profil
3. Klick auf die Website: Speisekarte, Ambiente, Preise prüfen
4. Reservierung – wenn es einfach geht. Sonst: zurück zur Liste, nächstes Restaurant.

Jeder Bruch in dieser Kette kostet Gäste. Eine PDF-Speisekarte, die auf dem Handy nicht lesbar ist, eine fehlende Online-Reservierung, veraltete Öffnungszeiten – all das sind stille Umsatzverluste, die in keiner Kasse auftauchen.

## Die fünf Elemente einer Restaurant-Website, die Reservierungen bringt

### 1. Reservierung in maximal zwei Klicks

Der Reservieren-Button gehört sichtbar in den Kopfbereich – auf jeder Seite. Ob dahinter ein integriertes Buchungstool oder ein eigenes System steht, hängt vom Betrieb ab; wichtig ist, dass der Gast nicht suchen muss. Welche Lösung wann sinnvoll ist, zeigen wir unter [Buchungssysteme](/leistungen/buchungssysteme).

### 2. Die Speisekarte als echte Webseite

Die Speisekarte ist die meistbesuchte Seite jeder Restaurant-Website – und gleichzeitig die am häufigsten vernachlässigte. Als eingebettetes PDF ist sie auf dem Smartphone mühsam und für Google sowie KI-Assistenten praktisch unsichtbar. Als echte HTML-Seite mit Gerichten, Beschreibungen und Preisen wird sie lesbar, durchsuchbar und KI-tauglich: Wenn jemand Perplexity fragt „Wo gibt es gute hausgemachte Pasta in Halle?", kann nur eine lesbare Karte die Antwort liefern.

### 3. Fotos, die Appetit machen

Gäste entscheiden mit den Augen. Eigene, professionelle Bilder von Gerichten und Räumen wirken stärker als jeder Werbetext. Stockfotos erkennen Gäste sofort – und sie zerstören genau das Vertrauen, das eine Reservierung braucht.

### 4. Lokale Sichtbarkeit als System

Restaurant-Suchen sind fast immer lokal. Deshalb gelten alle Regeln aus unserem [Leitfaden zum lokalen SEO](/blog/lokales-seo-halle) hier verschärft: gepflegtes Google-Unternehmensprofil mit aktuellen Zeiten, konsistente Daten, aktive Bewertungsarbeit und strukturierte Daten (Restaurant-Schema mit Küche, Preisspanne und Öffnungszeiten), damit Suchmaschinen und KI-Systeme Ihr Haus korrekt einordnen.

### 5. Aktualität ohne Agentur-Abhängigkeit

Wochenkarte, saisonale Menüs, Feiertagszeiten: Eine Restaurant-Website lebt von Aktualität. Das funktioniert nur, wenn das Team Inhalte selbst pflegen kann – in Minuten, ohne Entwickler. Ein pflegbares Content-System ist deshalb bei Gastronomie-Projekten keine Option, sondern Voraussetzung.

## Portale ergänzen, nicht ersetzen

Es geht nicht darum, Buchungsportale abzuschalten – sie bleiben ein Reichweitenkanal, gerade für Touristen. Das Ziel ist die Verschiebung des Verhältnisses: Stammgäste und lokale Suchende sollen direkt reservieren. Schon eine moderate Verschiebung der Reservierungen vom Portal zur eigenen Website spart im Jahr oft einen vierstelligen Provisionsbetrag – Geld, das im Betrieb bleibt.

Wie so etwas konkret aussieht, zeigt unser Projekt mit einem Restaurant in der Region: mehr direkte Reservierungen über eine schnelle, lokal optimierte Website – nachzulesen unter [unseren Projekten](/projekte).

## Häufige Fehler auf Restaurant-Websites

- Speisekarte nur als PDF oder Foto
- Kein Reservieren-Button im sichtbaren Bereich
- Öffnungszeiten auf Website und Google widersprechen sich
- Musik, Intro-Animationen oder schwere Slider, die mobil alles ausbremsen
- Keine Antwort auf Bewertungen – positive wie kritische

## Fazit

Eine Restaurant-Website ist kein Aushängeschild, sondern ein Reservierungskanal. Schnell, mobil exzellent, mit lesbarer Speisekarte, sichtbarem Reservieren-Button und lokalem SEO-Fundament wird sie zum profitabelsten Marketinginstrument des Hauses – ganz ohne Provision.

Mehr zur Branchenlösung finden Sie unter [Restaurant-Website](/branchen/restaurant-website). Oder wir schauen direkt gemeinsam auf Ihre Website: [kostenlose Analyse anfragen](/kontakt).`,
      },
      en: {
        title: "Restaurant Website 2026: More Reservations Without Portal Commissions",
        slug: "restaurant-website-more-reservations",
        excerpt:
          "Why restaurants in Halle and Leipzig win more direct reservations with their own website – and which five elements are decisive.",
        content: `Many restaurants in the region know the math: the tables are full, but a noticeable share of revenue flows to booking portals and delivery platforms as commission – while dependency on their rules and rankings keeps growing. Your own website is the only channel that fully belongs to you. Built correctly, it becomes your most important source of direct reservations.

## How guests choose a restaurant today

The typical path to a reservation in Halle or Leipzig looks like this in 2026:

1. Search on the smartphone: "restaurant Halle city centre" or a recommendation from ChatGPT or Google Maps
2. A look at reviews and photos in the Google profile
3. Click through to the website: check menu, atmosphere, prices
4. Reservation – if it is easy. Otherwise: back to the list, next restaurant.

Every break in this chain costs guests. A PDF menu unreadable on the phone, no online reservation, outdated opening hours – all of these are silent revenue losses that never show up in any till.

## The five elements of a restaurant website that brings reservations

### 1. Reservation in two clicks at most

The reserve button belongs visibly in the header – on every page. Whether an integrated booking tool or a custom system sits behind it depends on the operation; what matters is that guests never have to search. We show which solution fits when under [booking systems](/en/services/booking-systems).

### 2. The menu as a real web page

The menu is the most visited page of every restaurant website – and at the same time the most neglected one. As an embedded PDF it is tedious on smartphones and practically invisible to Google and AI assistants. As a real HTML page with dishes, descriptions and prices, it becomes readable, searchable and AI-ready: if someone asks Perplexity "Where can I get good homemade pasta in Halle?", only a readable menu can supply the answer.

### 3. Photos that create appetite

Guests decide with their eyes. Your own professional photos of dishes and rooms work harder than any advertising copy. Guests recognise stock photos instantly – and they destroy exactly the trust a reservation requires.

### 4. Local visibility as a system

Restaurant searches are almost always local. That is why all rules from our [local SEO guide](/en/blog/local-seo-halle) apply here with extra weight: a well-maintained Google Business Profile with current hours, consistent data, active review work and structured data (Restaurant schema with cuisine, price range and opening hours) so search engines and AI systems classify your place correctly.

### 5. Freshness without agency dependency

Weekly specials, seasonal menus, holiday hours: a restaurant website lives on freshness. That only works if your team can maintain content themselves – in minutes, without a developer. A maintainable content system is therefore not optional in gastronomy projects; it is a precondition.

## Complement portals, do not replace them

The goal is not to switch off booking portals – they remain a reach channel, especially for tourists. The goal is shifting the ratio: regulars and local searchers should book directly. Even a moderate shift of reservations from portal to your own website often saves a four-figure commission amount per year – money that stays in the business.

What this looks like concretely is shown by our project with a restaurant in the region: more direct reservations through a fast, locally optimised website – documented among [our projects](/en/projects).

## Common mistakes on restaurant websites

- Menu only as PDF or photo
- No reserve button above the fold
- Opening hours on website and Google contradicting each other
- Music, intro animations or heavy sliders slowing everything down on mobile
- No replies to reviews – positive or critical

## Conclusion

A restaurant website is not a signboard, it is a reservation channel. Fast, excellent on mobile, with a readable menu, a visible reserve button and a local SEO foundation, it becomes the most profitable marketing instrument of the house – entirely commission-free.

Find out more about our industry solution under [restaurant website](/en/industries/restaurant-website). Or let us look at your website together right away: [request a free analysis](/en/contact).`,
      },
      ru: {
        title: "Сайт ресторана в 2026: больше бронирований без комиссий порталам",
        slug: "sajt-restorana-bolshe-bronirovanij",
        excerpt:
          "Почему рестораны в Halle и Leipzig получают больше прямых бронирований через собственный сайт — и какие пять элементов для этого решающие.",
        content: `Многие рестораны региона знают эту арифметику: столы заняты, но ощутимая часть выручки уходит комиссиями порталам бронирования и платформам доставки — при растущей зависимости от их правил и рейтингов. Собственный сайт — единственный канал, который полностью принадлежит вам. Построенный правильно, он становится главным источником прямых бронирований.

## Как гости выбирают ресторан сегодня

Типичный путь к бронированию в Halle или Leipzig в 2026 году выглядит так:

1. Поиск со смартфона: «ресторан Halle центр» или рекомендация из ChatGPT или Google Maps
2. Взгляд на отзывы и фото в профиле Google
3. Переход на сайт: посмотреть меню, атмосферу, цены
4. Бронирование — если это просто. Иначе: назад к списку, следующий ресторан.

Каждый разрыв в этой цепочке стоит гостей. Меню в PDF, нечитаемое с телефона, отсутствие онлайн-бронирования, устаревшие часы работы — всё это тихие потери выручки, которых не видно ни в одной кассе.

## Пять элементов сайта ресторана, который приносит бронирования

### 1. Бронирование максимум в два клика

Кнопка «Забронировать» должна быть заметна в шапке — на каждой странице. Что за ней стоит — интегрированный сервис или собственная система — зависит от заведения; важно, чтобы гостю не приходилось искать. Какое решение когда уместно, мы показываем в разделе [системы бронирования](/ru/uslugi/sistemy-bronirovaniya).

### 2. Меню как настоящая веб-страница

Меню — самая посещаемая страница любого ресторанного сайта и одновременно самая заброшенная. Встроенный PDF мучителен на смартфоне и практически невидим для Google и AI-ассистентов. Настоящая HTML-страница с блюдами, описаниями и ценами читаема, индексируема и пригодна для ИИ: если кто-то спросит Perplexity «где в Halle хорошая домашняя паста?», ответ может дать только читаемое меню.

### 3. Фотографии, вызывающие аппетит

Гости решают глазами. Собственные профессиональные снимки блюд и залов работают сильнее любого рекламного текста. Стоковые фото гости распознают мгновенно — и они разрушают именно то доверие, которое нужно для бронирования.

### 4. Локальная видимость как система

Поиск ресторана почти всегда локален. Поэтому все правила из нашего [руководства по локальному SEO](/ru/blog/lokalnoe-seo-halle) действуют здесь с удвоенной силой: ухоженный профиль Google с актуальными часами, консистентные данные, активная работа с отзывами и структурированные данные (схема Restaurant с кухней, ценовым диапазоном и часами работы), чтобы поисковики и AI-системы правильно классифицировали заведение.

### 5. Актуальность без зависимости от агентства

Меню недели, сезонные предложения, праздничный график: сайт ресторана живёт актуальностью. Это работает только тогда, когда команда может обновлять контент сама — за минуты, без разработчика. Удобная система управления контентом в ресторанных проектах — не опция, а условие.

## Порталы дополнять, а не заменять

Цель не в том, чтобы отключить порталы бронирования — они остаются каналом охвата, особенно для туристов. Цель — сместить соотношение: постоянные гости и локальный поиск должны бронировать напрямую. Даже умеренный сдвиг бронирований с портала на собственный сайт часто экономит четырёхзначную сумму комиссий в год — деньги, которые остаются в заведении.

Как это выглядит на практике, показывает наш проект с рестораном региона: больше прямых бронирований через быстрый, локально оптимизированный сайт — подробности в [наших проектах](/ru/proekty).

## Типичные ошибки на сайтах ресторанов

- Меню только в PDF или фотографией
- Нет кнопки бронирования на первом экране
- Часы работы на сайте и в Google противоречат друг другу
- Музыка, интро-анимации и тяжёлые слайдеры, тормозящие всё на мобильном
- Отзывы без ответов — и положительные, и критические

## Вывод

Сайт ресторана — не вывеска, а канал бронирований. Быстрый, отличный на мобильном, с читаемым меню, заметной кнопкой бронирования и локальным SEO-фундаментом он становится самым прибыльным маркетинговым инструментом заведения — совершенно без комиссий.

Подробнее об отраслевом решении — на странице [сайт для ресторана](/ru/otrasli/sayt-dlya-restorana). Или посмотрим на ваш сайт вместе прямо сейчас: [запросить бесплатный анализ](/ru/kontakt).`,
      },
    },
  },
  {
    key: "nextjs-vs-wordpress",
    categoryKey: "webdesign",
    coverImage: "/images/blog/wordpress-oder-nextjs.webp",
    publishedAt: "2026-05-21T08:00:00.000Z",
    translations: {
      de: {
        title: "WordPress oder Next.js? Welche Technologie zu Ihrem Unternehmen passt",
        slug: "nextjs-vs-wordpress",
        excerpt:
          "Beide Technologien haben ihren Platz. Ein ehrlicher Vergleich für Unternehmer in Halle und Leipzig – ohne Dogma, dafür mit klaren Entscheidungskriterien.",
        content: `Kaum eine Frage wird in Erstgesprächen so oft gestellt wie diese: „Brauche ich WordPress – oder etwas Moderneres?" Die ehrliche Antwort ist unbequem für jeden, der einfache Wahrheiten verkaufen will: **Es hängt von Ihrem Ziel ab.** Wir arbeiten mit beiden Technologien und setzen sie bewusst unterschiedlich ein. Dieser Beitrag erklärt, wann welche Basis die richtige ist.

## Worüber wir eigentlich sprechen

**WordPress** ist das meistgenutzte Website-System der Welt: ein ausgereiftes Redaktionssystem mit riesigem Ökosystem aus Themes und Plugins. **Next.js** ist ein modernes Framework auf React-Basis, mit dem Websites als individuelle Anwendungen entwickelt werden – vom Design bis zur Funktion maßgeschneidert.

Der Unterschied ist weniger „alt gegen neu" als vielmehr **Baukasten mit Ausbaustufen gegen individuelle Entwicklung**.

## Der ehrliche Vergleich

| Kriterium | WordPress | Next.js |
| --- | --- | --- |
| Einstiegskosten | niedriger (ab 600 €) | höher (ab 990 €) |
| Geschwindigkeit | gut, mit Pflegeaufwand | sehr hoch, von Haus aus |
| Design-Freiheit | Theme-basiert, anpassbar | vollständig individuell |
| Pflege durch den Inhaber | vertraute Oberfläche | eigenes Admin-Panel, aufgeräumt |
| Laufender Wartungsbedarf | regelmäßig (Updates, Plugins) | gering |
| Individuelle Funktionen | über Plugins, mit Grenzen | ohne Kompromisse entwickelbar |
| SEO-Basis | solide, plugin-abhängig | technisch vollständig kontrollierbar |

## Wann WordPress die richtige Wahl ist

WordPress spielt seine Stärken aus, wenn Budget und Anspruch in einem bestimmten Verhältnis stehen:

- **Ein solider Webauftritt soll schnell und bezahlbar online.** Unser Einstiegspaket auf WordPress-Basis startet bei 600 € – bewusst kalkuliert für Unternehmen am Anfang.
- **Das Team kennt WordPress bereits.** Eingespielte Redaktionsabläufe sind ein echter Wert.
- **Standardanforderungen dominieren.** Leistungen zeigen, Kontakt ermöglichen, gelegentlich Neuigkeiten – dafür ist WordPress seit Jahren bewährt.

Wichtig ist dann die Qualität der Umsetzung: schlankes Setup statt Plugin-Sammlung, sauberes Theme, regelmäßige Pflege. Ein vernachlässigtes WordPress ist das eigentliche Problem hinter den meisten schlechten Erfahrungen – nicht WordPress selbst. Für gewachsene Installationen bieten wir deshalb gezielt [WordPress-Modernisierung](/leistungen/wordpress-website-modernisieren) an.

## Wann Next.js die bessere Basis ist

Next.js lohnt sich dort, wo die Website als Wachstumsinstrument arbeiten soll:

- **Geschwindigkeit als Wettbewerbsvorteil.** Ladezeit beeinflusst Rankings und Konversion messbar. Next.js liefert Bestwerte ohne Optimierungs-Plugins.
- **Individuelles Design und Markenauftritt.** Wenn die Website sich sichtbar vom Baukasten-Standard abheben soll.
- **Besondere Funktionen.** Buchungssysteme, Mehrsprachigkeit, Kundenportale, Anbindungen an Ihre Software – individuell entwickelt statt zusammengesteckt.
- **Langfristig niedrige Betriebskosten.** Kein Plugin-Zoo bedeutet weniger Updates, weniger Sicherheitsflächen, weniger Überraschungen.

Unsere eigene Website und die meisten [Kundenprojekte](/projekte) laufen auf dieser Basis – inklusive mehrsprachiger Inhalte und eigenem Admin-Bereich, in dem Kunden Texte, Bilder und Beiträge selbst pflegen.

## Die drei Fragen, die die Entscheidung klären

1. **Was soll die Website leisten?** Präsenz zeigen – oder aktiv Anfragen generieren und Prozesse abbilden?
2. **Wie individuell muss sie sein?** Ein gutes Theme reicht oft. Ein eigenes Erlebnis braucht Entwicklung.
3. **Wie sieht das Budget über drei Jahre aus?** Einstiegspreis plus laufende Pflege ergibt das ehrliche Bild – nicht der Projektpreis allein.

Wer diese Fragen beantwortet, hat die Technologie-Frage meist schon gelöst. Eine Übersicht der Pakete mit beiden Ansätzen finden Sie auf unserer [Preisseite](/preise).

## Fazit: Technologie folgt dem Ziel

WordPress und Next.js sind Werkzeuge – keines davon ist pauschal „besser". Ein Unternehmen am Anfang fährt mit einem sauber aufgesetzten WordPress oft goldrichtig. Ein Unternehmen, das digital wachsen will und die Website als Anfragen-Maschine versteht, bekommt mit Next.js die stärkere Grundlage.

Unsere Empfehlung richtet sich nach Ihrem Ziel, nicht nach unserer Vorliebe. Welche Basis zu Ihrem Vorhaben passt, klären wir gern in einem unverbindlichen Gespräch: [Erstgespräch anfragen](/kontakt).`,
      },
      en: {
        title: "WordPress or Next.js? Which Technology Fits Your Business",
        slug: "nextjs-vs-wordpress",
        excerpt:
          "Both technologies have their place. An honest comparison for business owners in Halle and Leipzig – no dogma, just clear decision criteria.",
        content: `Hardly any question comes up in first conversations as often as this one: "Do I need WordPress – or something more modern?" The honest answer is inconvenient for anyone selling simple truths: **it depends on your goal.** We work with both technologies and deliberately use them differently. This article explains when which foundation is the right one.

## What we are actually talking about

**WordPress** is the most used website system in the world: a mature content management system with a huge ecosystem of themes and plugins. **Next.js** is a modern React-based framework used to build websites as individual applications – tailored from design to functionality.

The difference is less "old versus new" and more **a construction kit with expansion levels versus individual development**.

## The honest comparison

| Criterion | WordPress | Next.js |
| --- | --- | --- |
| Entry cost | lower (from €600) | higher (from €990) |
| Speed | good, with upkeep | very high, out of the box |
| Design freedom | theme-based, adaptable | fully individual |
| Owner-managed content | familiar interface | own clean admin panel |
| Ongoing maintenance | regular (updates, plugins) | low |
| Custom features | via plugins, with limits | buildable without compromise |
| SEO foundation | solid, plugin-dependent | fully controllable technically |

## When WordPress is the right choice

WordPress plays to its strengths when budget and requirements sit in a certain balance:

- **A solid web presence should go online quickly and affordably.** Our WordPress-based entry package starts at €600 – deliberately calculated for businesses at the beginning.
- **The team already knows WordPress.** Established editorial routines are real value.
- **Standard requirements dominate.** Showing services, enabling contact, occasional news – WordPress has been proven for this for years.

What matters then is the quality of implementation: a lean setup instead of a plugin collection, a clean theme, regular care. A neglected WordPress is the actual problem behind most bad experiences – not WordPress itself. For grown installations we therefore specifically offer [WordPress modernization](/en/services/wordpress-website-modernization).

## When Next.js is the better foundation

Next.js pays off where the website is supposed to work as a growth instrument:

- **Speed as a competitive advantage.** Loading time measurably influences rankings and conversion. Next.js delivers top scores without optimisation plugins.
- **Individual design and brand presence.** When the website should visibly stand out from construction-kit standards.
- **Special functionality.** Booking systems, multiple languages, client portals, integrations with your software – individually developed instead of plugged together.
- **Low long-term operating costs.** No plugin zoo means fewer updates, fewer attack surfaces, fewer surprises.

Our own website and most [client projects](/en/projects) run on this foundation – including multilingual content and a dedicated admin area where clients maintain texts, images and posts themselves.

## The three questions that settle the decision

1. **What should the website achieve?** Show presence – or actively generate inquiries and map processes?
2. **How individual does it have to be?** A good theme is often enough. A distinct experience needs development.
3. **What does the budget look like over three years?** Entry price plus ongoing care gives the honest picture – not the project price alone.

Answering these questions usually settles the technology question too. You will find an overview of packages using both approaches on our [pricing page](/en/pricing).

## Conclusion: technology follows the goal

WordPress and Next.js are tools – neither is universally "better". A business at the beginning is often perfectly served by a cleanly set-up WordPress. A business that wants to grow digitally and understands its website as an inquiry machine gets the stronger foundation with Next.js.

Our recommendation follows your goal, not our preference. We are happy to clarify which foundation fits your project in a no-obligation conversation: [request an initial consultation](/en/contact).`,
      },
      ru: {
        title: "WordPress или Next.js? Какая технология подходит вашему бизнесу",
        slug: "nextjs-vs-wordpress",
        excerpt:
          "У обеих технологий есть своё место. Честное сравнение для предпринимателей в Halle и Leipzig — без догм, с ясными критериями выбора.",
        content: `Едва ли какой-то вопрос звучит на первых встречах чаще: «Мне нужен WordPress — или что-то посовременнее?» Честный ответ неудобен для тех, кто продаёт простые истины: **зависит от вашей цели.** Мы работаем с обеими технологиями и осознанно применяем их по-разному. Эта статья объясняет, когда какая база правильная.

## О чём вообще речь

**WordPress** — самая используемая система для сайтов в мире: зрелая CMS с огромной экосистемой тем и плагинов. **Next.js** — современный фреймворк на базе React, на котором сайты разрабатываются как индивидуальные приложения — от дизайна до функций под заказ.

Разница не столько «старое против нового», сколько **конструктор с уровнями расширения против индивидуальной разработки**.

## Честное сравнение

| Критерий | WordPress | Next.js |
| --- | --- | --- |
| Стартовая цена | ниже (от 600 €) | выше (от 990 €) |
| Скорость | хорошая, требует ухода | очень высокая из коробки |
| Свобода дизайна | на основе тем, настраивается | полностью индивидуальная |
| Самостоятельное ведение | привычный интерфейс | собственная аккуратная админка |
| Регулярное обслуживание | постоянное (обновления, плагины) | минимальное |
| Индивидуальные функции | через плагины, с ограничениями | разрабатываются без компромиссов |
| SEO-база | достойная, зависит от плагинов | технически полностью контролируема |

## Когда WordPress — правильный выбор

WordPress раскрывает свои сильные стороны при определённом соотношении бюджета и задач:

- **Достойное присутствие в сети нужно быстро и доступно.** Наш стартовый пакет на WordPress начинается от 600 € — осознанно рассчитан на компании в начале пути.
- **Команда уже знает WordPress.** Отлаженные редакционные процессы — реальная ценность.
- **Преобладают стандартные задачи.** Показать услуги, дать возможность связаться, иногда публиковать новости — для этого WordPress проверен годами.

Дальше решает качество реализации: компактная конфигурация вместо коллекции плагинов, чистая тема, регулярный уход. Заброшенный WordPress — вот настоящая причина большинства плохих историй, а не WordPress сам по себе. Для разросшихся установок мы отдельно предлагаем [модернизацию WordPress](/ru/uslugi/modernizaciya-wordpress-sayta).

## Когда Next.js — база сильнее

Next.js окупается там, где сайт должен работать как инструмент роста:

- **Скорость как конкурентное преимущество.** Время загрузки измеримо влияет на позиции и конверсию. Next.js выдаёт максимальные показатели без плагинов-оптимизаторов.
- **Индивидуальный дизайн и образ бренда.** Когда сайт должен заметно выделяться на фоне конструкторов.
- **Особые функции.** Системы бронирования, мультиязычность, кабинеты клиентов, интеграции с вашими программами — разрабатываются индивидуально, а не собираются из кусков.
- **Низкие эксплуатационные расходы вдолгую.** Нет зоопарка плагинов — меньше обновлений, меньше поверхностей атаки, меньше сюрпризов.

Наш собственный сайт и большинство [клиентских проектов](/ru/proekty) работают на этой базе — включая мультиязычный контент и собственную админку, где клиенты сами ведут тексты, изображения и статьи.

## Три вопроса, которые решают выбор

1. **Что сайт должен делать?** Показывать присутствие — или активно генерировать заявки и отражать процессы?
2. **Насколько индивидуальным он должен быть?** Хорошей темы часто достаточно. Особый опыт требует разработки.
3. **Как выглядит бюджет на три года?** Стартовая цена плюс регулярный уход дают честную картину — а не цена проекта сама по себе.

Кто ответил на эти вопросы, обычно уже решил и вопрос технологии. Обзор пакетов с обоими подходами — на нашей [странице цен](/ru/ceny).

## Вывод: технология следует за целью

WordPress и Next.js — инструменты, и ни один не «лучше» в вакууме. Компании в начале пути аккуратно настроенный WordPress часто подходит идеально. Компания, которая хочет расти в цифре и видит сайт машиной заявок, получает с Next.js более сильный фундамент.

Наша рекомендация исходит из вашей цели, а не из наших предпочтений. Какая база подходит вашей задаче — разберём в необязывающем разговоре: [запросить консультацию](/ru/kontakt).`,
      },
    },
  },
  {
    key: "website-relaunch-checkliste",
    categoryKey: "webdesign",
    coverImage: "/images/blog/website-relaunch.webp",
    publishedAt: "2026-06-04T08:00:00.000Z",
    translations: {
      de: {
        title: "Website-Relaunch 2026: Wann er sich lohnt und wie Sie Ihre Rankings behalten",
        slug: "website-relaunch-checkliste",
        excerpt:
          "Ein Relaunch kann Anfragen vervielfachen – oder mühsam aufgebaute Google-Rankings zerstören. Wann sich der Neustart lohnt und welche Checkliste Verluste verhindert.",
        content: `Ein Website-Relaunch ist wie ein Umzug des Geschäfts: richtig geplant eine enorme Chance, schlecht geplant ein teurer Weg, Stammkunden zu verlieren. Der Unterschied liegt selten im Design – sondern in der Vorbereitung. Dieser Beitrag zeigt, wann ein Relaunch wirklich fällig ist, und liefert die Checkliste, mit der Rankings und Anfragen den Umzug überleben.

## Woran Sie erkennen, dass ein Relaunch fällig ist

Nicht jede ältere Website braucht einen Neustart. Diese Signale sprechen dafür:

- **Die Website bringt keine Anfragen**, obwohl Besucher kommen – Struktur und Inhalte überzeugen nicht
- **Mobil ist sie mühsam**: kleines Menü, langsames Laden, Formulare kaum bedienbar
- **Inhalte lassen sich nicht selbst pflegen** – jede Änderung braucht einen Dienstleister
- **Die Technik bremst**: veraltete Systeme, Sicherheitswarnungen, Plugins ohne Updates
- **Das Unternehmen hat sich weiterentwickelt**, die Website zeigt noch den Stand von vor fünf Jahren

Trifft nur ein Punkt zu, reicht oft gezielte Überarbeitung – etwa eine [Performance-Optimierung](/leistungen/performance-optimierung). Treffen mehrere zu, ist der Relaunch meist wirtschaftlicher als jahrelanges Flickwerk.

## Die größte Gefahr: Rankings verlieren

Google hat Ihre bisherigen Seiten über Jahre bewertet und eingeordnet. Bei einem Relaunch ändern sich häufig Adressen, Struktur und Inhalte gleichzeitig – für die Suchmaschine sieht das ohne Vorbereitung wie eine neue, unbekannte Website aus. Die Folge: Sichtbarkeitsverluste, die Monate kosten können.

Genau das ist vermeidbar. Die folgenden Punkte sind der Kern jeder professionellen Relaunch-Planung.

## Die Relaunch-Checkliste zum Schutz Ihrer Sichtbarkeit

### Vor dem Relaunch

1. **Bestandsaufnahme aller Seiten und Rankings.** Welche Seiten bringen heute Besucher und Anfragen? Diese Seiten sind Ihr Kapital.
2. **Vollständige Weiterleitungs-Tabelle.** Jede alte Adresse bekommt ein permanentes 301-Redirect-Ziel auf der neuen Website – einzeln geplant, nicht pauschal auf die Startseite.
3. **Inhalte sichern und verbessern.** Gut rankende Texte werden übernommen und ausgebaut, nicht ersatzlos gestrichen.
4. **Struktur mit SEO-Blick planen.** Eine Seite pro Leistung, klare lokale Signale für Halle und Leipzig – die Prinzipien aus unserem [Leitfaden zum lokalen SEO](/blog/lokales-seo-halle) gehören in die Architektur, nicht in die Nacharbeit.

### Zum Launch

5. **Weiterleitungen live testen** – jede wichtige alte Adresse einzeln.
6. **Technisches Fundament prüfen**: Sitemap eingereicht, strukturierte Daten aktiv, Ladezeiten gemessen, Mobildarstellung kontrolliert.
7. **Google-Unternehmensprofil aktualisieren**, falls sich Adressen oder Leistungsseiten geändert haben.

### Nach dem Relaunch

8. **Sichtbarkeit beobachten.** Rankings und Anfragen in den ersten Wochen aktiv verfolgen, Crawling-Fehler zügig beheben.
9. **Nicht sofort nachjustieren.** Kleinere Schwankungen nach einem Relaunch sind normal – Panik-Änderungen verschlimmern sie.

## Relaunch als Chance: mehr als ein neues Design

Wer schon umbaut, sollte die Gelegenheit nutzen. Ein Relaunch ist der ideale Zeitpunkt für:

- **Ein pflegbares Content-System**, mit dem Ihr Team Inhalte selbst aktualisiert
- **Mehrsprachigkeit**, wenn Ihre Kundschaft international ist
- **Messbarkeit**: saubere, datenschutzfreundliche Statistik statt Blindflug
- **KI-Lesbarkeit**: strukturierte Daten und klare Inhalte, damit auch ChatGPT und Perplexity Ihr Angebot korrekt wiedergeben

So wird aus dem Neuanstrich ein echtes Upgrade des Anfragen-Kanals – die Details dazu finden Sie unter [Website-Relaunch](/leistungen/website-relaunch).

## Fazit

Ein Relaunch lohnt sich, wenn die bestehende Website Wachstum nachweislich bremst – und er gelingt, wenn Weiterleitungen, Inhalte und Struktur vor dem Launch geplant werden statt danach. Dann behalten Sie Ihre Rankings und gewinnen eine Website, die endlich mitarbeitet.

Sie überlegen, ob sich ein Relaunch für Ihr Unternehmen rechnet? Wir analysieren Ihre bestehende Website kostenlos und sagen ehrlich, ob ein Neustart nötig ist – oder gezielte Verbesserungen reichen: [Analyse anfragen](/kontakt).`,
      },
      en: {
        title: "Website Relaunch 2026: When It Pays Off and How to Keep Your Rankings",
        slug: "website-relaunch-checklist",
        excerpt:
          "A relaunch can multiply inquiries – or destroy hard-earned Google rankings. When a restart makes sense and which checklist prevents losses.",
        content: `A website relaunch is like moving your business premises: planned well, an enormous opportunity; planned badly, an expensive way to lose regular customers. The difference rarely lies in the design – it lies in the preparation. This article shows when a relaunch is truly due and delivers the checklist that lets rankings and inquiries survive the move.

## How to tell a relaunch is due

Not every older website needs a restart. These signals speak for it:

- **The website brings no inquiries** although visitors arrive – structure and content fail to convince
- **Mobile use is tedious**: tiny menus, slow loading, forms barely usable
- **Content cannot be maintained in-house** – every change requires a service provider
- **The technology holds you back**: outdated systems, security warnings, plugins without updates
- **The business has evolved** while the website still shows the state of five years ago

If only one point applies, targeted improvement is often enough – for example a [performance optimization](/en/services/performance-optimization). If several apply, a relaunch is usually more economical than years of patchwork.

## The biggest danger: losing rankings

Google has evaluated and classified your existing pages over years. In a relaunch, addresses, structure and content often change at the same time – without preparation, that looks like a new, unknown website to the search engine. The consequence: visibility losses that can cost months.

Exactly this is avoidable. The following points are the core of every professional relaunch plan.

## The relaunch checklist to protect your visibility

### Before the relaunch

1. **Inventory of all pages and rankings.** Which pages bring visitors and inquiries today? Those pages are your capital.
2. **A complete redirect table.** Every old address gets a permanent 301 redirect target on the new website – planned individually, not dumped onto the homepage.
3. **Secure and improve content.** Well-ranking texts are carried over and expanded, not deleted without replacement.
4. **Plan the structure with SEO in mind.** One page per service, clear local signals for Halle and Leipzig – the principles from our [local SEO guide](/en/blog/local-seo-halle) belong in the architecture, not in the cleanup afterwards.

### At launch

5. **Test redirects live** – every important old address individually.
6. **Check the technical foundation**: sitemap submitted, structured data active, loading times measured, mobile rendering verified.
7. **Update the Google Business Profile** if addresses or service pages have changed.

### After the relaunch

8. **Monitor visibility.** Actively track rankings and inquiries in the first weeks, fix crawling errors promptly.
9. **Do not readjust immediately.** Minor fluctuations after a relaunch are normal – panic changes make them worse.

## Relaunch as opportunity: more than a new design

If you are rebuilding anyway, use the moment. A relaunch is the ideal time for:

- **A maintainable content system** letting your team update content themselves
- **Multiple languages** if your customers are international
- **Measurability**: clean, privacy-friendly statistics instead of flying blind
- **AI readability**: structured data and clear content so ChatGPT and Perplexity represent your offer correctly

That turns a repaint into a genuine upgrade of your inquiry channel – details under [website relaunch](/en/services/website-relaunch).

## Conclusion

A relaunch pays off when the existing website demonstrably slows growth – and it succeeds when redirects, content and structure are planned before launch rather than after. Then you keep your rankings and gain a website that finally pulls its weight.

Wondering whether a relaunch adds up for your business? We analyse your current website free of charge and tell you honestly whether a restart is needed – or whether targeted improvements suffice: [request an analysis](/en/contact).`,
      },
      ru: {
        title: "Релонч сайта в 2026: когда он окупается и как сохранить позиции в Google",
        slug: "relonch-sajta-checklist",
        excerpt:
          "Релонч может умножить заявки — или разрушить позиции в Google, заработанные годами. Когда перезапуск оправдан и какой чек-лист защищает от потерь.",
        content: `Релонч сайта — как переезд магазина: при хорошем плане это огромная возможность, при плохом — дорогой способ потерять постоянных клиентов. Разница редко в дизайне — она в подготовке. Эта статья показывает, когда релонч действительно назрел, и даёт чек-лист, с которым позиции и заявки переживают переезд.

## Как понять, что релонч назрел

Не каждому возрастному сайту нужен перезапуск. За релонч говорят такие сигналы:

- **Сайт не приносит заявок**, хотя посетители есть — структура и контент не убеждают
- **С мобильного им мучительно пользоваться**: мелкое меню, медленная загрузка, формы едва работают
- **Контент нельзя обновлять самостоятельно** — каждая правка требует подрядчика
- **Технологии тормозят**: устаревшие системы, предупреждения безопасности, плагины без обновлений
- **Бизнес развился**, а сайт всё ещё показывает состояние пятилетней давности

Если совпадает один пункт, часто хватает точечной доработки — например, [оптимизации производительности](/ru/uslugi/optimizaciya-proizvoditelnosti). Если несколько — релонч обычно экономичнее многолетних заплаток.

## Главная опасность: потерять позиции

Google годами оценивал и классифицировал ваши страницы. При релонче адреса, структура и контент часто меняются одновременно — без подготовки для поисковика это выглядит как новый, незнакомый сайт. Последствие: потери видимости, которые могут стоить месяцев.

Именно этого можно избежать. Пункты ниже — ядро любого профессионального плана релонча.

## Чек-лист релонча для защиты видимости

### До релонча

1. **Инвентаризация всех страниц и позиций.** Какие страницы сегодня приносят посетителей и заявки? Эти страницы — ваш капитал.
2. **Полная таблица редиректов.** Каждый старый адрес получает постоянный 301-редирект на целевую страницу нового сайта — спланированный индивидуально, а не скопом на главную.
3. **Сохранить и улучшить контент.** Хорошо ранжирующиеся тексты переносятся и развиваются, а не удаляются без замены.
4. **Планировать структуру с прицелом на SEO.** Одна страница на услугу, ясные локальные сигналы для Halle и Leipzig — принципы из нашего [руководства по локальному SEO](/ru/blog/lokalnoe-seo-halle) должны быть в архитектуре, а не в доработках потом.

### В момент запуска

5. **Проверить редиректы вживую** — каждый важный старый адрес по отдельности.
6. **Проверить техническую базу**: sitemap отправлен, структурированные данные активны, скорость измерена, мобильное отображение проверено.
7. **Обновить бизнес-профиль Google**, если изменились адреса или страницы услуг.

### После релонча

8. **Следить за видимостью.** В первые недели активно отслеживать позиции и заявки, быстро чинить ошибки сканирования.
9. **Не крутить настройки сразу.** Небольшие колебания после релонча нормальны — панические правки их только усугубляют.

## Релонч как возможность: больше, чем новый дизайн

Раз уж перестраивать — используйте момент. Релонч — идеальное время для:

- **Удобной системы управления контентом**, чтобы команда обновляла сайт сама
- **Мультиязычности**, если ваши клиенты международные
- **Измеримости**: аккуратная, дружелюбная к приватности статистика вместо полёта вслепую
- **Читаемости для ИИ**: структурированные данные и ясный контент, чтобы ChatGPT и Perplexity корректно передавали ваше предложение

Так косметический ремонт превращается в реальный апгрейд канала заявок — детали на странице [релонч сайта](/ru/uslugi/relonch-sajta).

## Вывод

Релонч окупается, когда существующий сайт доказуемо тормозит рост, — и удаётся, когда редиректы, контент и структура спланированы до запуска, а не после. Тогда вы сохраняете позиции и получаете сайт, который наконец работает на вас.

Думаете, окупится ли релонч для вашей компании? Мы бесплатно проанализируем текущий сайт и честно скажем, нужен ли перезапуск — или хватит точечных улучшений: [запросить анализ](/ru/kontakt).`,
      },
    },
  },
];

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
