import type { AppLocale } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";

type Copy = { title: string; text: string };
const copy: Record<string, Record<AppLocale, Copy>> = {
  "seo-optimierung": {
    de: { title: "SEO für Ihre vorhandene Website", text: "Am Anfang stehen Ihre Leistungen, die tatsächlich gesuchten Themen und der technische Zustand Ihrer Website. Daraus entsteht ein priorisierter Plan für Indexierbarkeit, Seitenstruktur, hilfreiche Inhalte und interne Links. Wir stimmen ab, welche Aufgaben wir übernehmen und wie sich die Entwicklung mit Search Console nachvollziehen lässt. Regionale Maßnahmen ergänzen diesen Plan, wenn Ihr Geschäft lokal arbeitet." },
    en: { title: "SEO for the website you already have", text: "We start with your services, relevant search topics and the technical condition of your website. This produces a prioritised plan for indexability, page structure, useful content and internal links. We agree on delivery responsibilities and how to track progress in Search Console. Local measures are added when your business serves a regional market." },
    ru: { title: "SEO сайта, который у вас уже есть", text: "Сначала разбираем услуги компании, подходящие поисковые темы и техническое состояние сайта. На этой основе составляем план индексации, структуры страниц, полезного содержания и внутренних ссылок. Согласуем распределение задач и оценку динамики через Search Console. Региональные меры добавляем с учётом фактической территории работы бизнеса." },
  },
  hosting: {
    de: { title: "Hosting passend zu Ihrer technischen Umgebung", text: "Wir prüfen Anwendung, Domain, Zugänge und vorhandenen Hosting-Vertrag, bevor wir einen Betriebsrahmen empfehlen. Gemeinsam legen wir Sicherungen, Wiederherstellung, Monitoring und Zuständigkeiten fest. Ein Umzug wird mit Domain und DNS abgestimmt. Technischer Betrieb und Änderungen an Funktionen oder Inhalten werden im Angebot nachvollziehbar beschrieben, damit laufende Kosten und Aufgaben klar bleiben." },
    en: { title: "Hosting that fits your technical environment", text: "We review your application, domain, access and existing hosting agreement before recommending an operating setup. Together we define backups, recovery, monitoring and responsibilities. Any move is coordinated with domain and DNS settings. Operations and changes to features or content are described clearly in the proposal, including ongoing costs and responsibilities." },
    ru: { title: "Хостинг под вашу техническую среду", text: "Перед рекомендацией проверяем приложение, домен, доступы и текущие условия хостинга. Согласуем резервное копирование, восстановление, мониторинг и ответственность сторон. Переезд планируем вместе с настройками домена и DNS. Эксплуатацию, изменения функций и обновление содержания отдельно описываем в предложении, чтобы были понятны регулярные расходы и задачи." },
  },
  digitalberatung: {
    de: { title: "Von der Geschäftsfrage zum umsetzbaren Plan", text: "Ausgangspunkt sind Ihre Ziele, Engpässe und vorhandenen Werkzeuge. Wir vergleichen passende Wege für Website, Buchung, Schnittstellen oder Automatisierung und ordnen sie nach Nutzen, Aufwand und Budget. Das erste Gespräch klärt die Richtung. Umfang und Preis einer vertieften Analyse oder eines Umsetzungskonzepts werden vor Beginn vereinbart." },
    en: { title: "From a business question to an actionable plan", text: "We start with your goals, bottlenecks and existing tools. We compare suitable approaches for websites, booking, integrations or automation and prioritise them by value, effort and budget. The initial conversation establishes direction. The scope and price of a detailed analysis or implementation plan are agreed before work starts." },
    ru: { title: "От бизнес-задачи к понятному плану", text: "Начинаем с целей, узких мест и текущих инструментов компании. Сравниваем подходящие решения для сайта, бронирования, интеграций и автоматизации по пользе, трудоёмкости и бюджету. Первый разговор помогает определить направление. Объём и стоимость подробного анализа или проекта реализации согласуем до начала работ." },
  },
  "ki-integration": {
    de: { title: "KI dort integrieren, wo sie im Ablauf hilft", text: "Wir beginnen mit einem konkreten Anwendungsfall und prüfen, welche Informationen und Systeme dafür benötigt werden. Ein Website-Assistent, die Verarbeitung einer Anfrage und eine Schnittstelle zum vorhandenen System haben unterschiedliche Anforderungen. Datenzugriff, erlaubte Aktionen, Fehlerbehandlung und die Übergabe an Mitarbeitende werden vor der Umsetzung festgelegt und im vereinbarten Umfang getestet." },
    en: { title: "Integrate AI where it helps your workflow", text: "We start with a concrete use case and identify the information and systems it needs. A website assistant, enquiry processing and an interface to an existing system have different requirements. Data access, permitted actions, error handling and handover to staff are defined before implementation and tested within the agreed scope." },
    ru: { title: "Интеграция ИИ под конкретный рабочий процесс", text: "Начинаем с определённого сценария и проверяем, какие данные и системы нужны для него. Ассистент сайта, обработка обращения и связь с действующей системой требуют разных решений. До реализации согласуем доступ к данным, разрешённые действия, обработку ошибок и передачу сотруднику, затем проверяем работу в утверждённом объёме." },
  },
  arztpraxen: {
    de: { title: "Patienten finden die richtige Information", text: "Für eine Praxis stehen verständliche Leistungsinformationen, Team, Sprechzeiten, Anfahrt und Kontakt im Mittelpunkt. Die Struktur hilft neuen Patienten, die passende Ansprechperson und den nächsten Schritt zu finden. Vorhandene Terminlösungen können nach technischer Prüfung eingebunden werden. Formulare, benötigte Daten und Zuständigkeiten stimmen wir gesondert mit der Praxis ab." },
    en: { title: "Help patients find the right information", text: "A practice website needs clear service information, team details, opening hours, directions and contact options. Its structure helps new patients find the right person and next step. Existing appointment tools can be integrated after technical review. Forms, required data and responsibilities are agreed separately with the practice." },
    ru: { title: "Помочь пациенту найти нужную информацию", text: "Для сайта практики важны понятные услуги, специалисты, часы приёма, маршрут и способы связи. Структура помогает новому пациенту выбрать контакт и следующий шаг. Действующий сервис записи можно подключить после технической проверки. Формы, необходимые данные и ответственность отдельно согласуем с практикой." },
  },
  immobilien: {
    de: { title: "Von der Objektinformation zur qualifizierten Anfrage", text: "Wir planen, welche Angaben Interessenten zu Objekten und Leistungen benötigen und wie sie die zuständige Kontaktperson erreichen. Bilder, Lageinformationen und Anfragewege erhalten eine klare mobile Struktur. Wenn Daten bereits in einer bestehenden Software gepflegt werden, prüfen wir eine passende Schnittstelle; Umfang und Pflegeprozess werden vorab vereinbart." },
    en: { title: "From property information to a useful enquiry", text: "We plan the property and service details prospective clients need and how they reach the right contact. Images, location information and enquiry options receive a clear mobile structure. If information is managed in existing software, we review a suitable integration and agree on its scope and maintenance process first." },
    ru: { title: "От информации об объекте к предметному обращению", text: "Определяем, какие сведения об объектах и услугах нужны клиенту и как связаться с ответственным специалистом. Фотографии, расположение и формы обращения получают понятную мобильную структуру. Если данные ведутся в действующей программе, проверяем возможность интеграции и заранее согласуем её объём и порядок обновления." },
  },
  kanzleien: {
    de: { title: "Fachgebiete und Erstkontakt verständlich erklären", text: "Mandanten sollen erkennen, welche Rechtsgebiete die Kanzlei bearbeitet, wer zuständig ist und wie ein Erstkontakt abläuft. Wir strukturieren diese Informationen mit Teamprofilen, Standortangaben und klaren Kontaktwegen. Inhalte, Qualifikationen und Formulierungen werden mit der Kanzlei abgestimmt. Eine vorhandene Terminlösung oder Kanzleisoftware wird bei Bedarf auf eine geeignete Anbindung geprüft." },
    en: { title: "Explain practice areas and the first contact", text: "Prospective clients should understand the firm's practice areas, responsible contacts and initial enquiry process. We organise that information through team profiles, location details and clear contact options. Content, qualifications and wording are agreed with the firm. Existing appointment tools or legal practice software can be reviewed for a suitable integration." },
    ru: { title: "Понятные направления работы и первое обращение", text: "Посетителю важно понять специализацию компании, ответственного специалиста и порядок первого обращения. Мы структурируем эти сведения через профили команды, адрес и способы связи. Содержание, квалификации и формулировки согласуем с компанией. При необходимости проверяем возможность связи с действующим сервисом записи или рабочей программой." },
  },
};

export function RetainedPageScope({ canonical, locale }: { canonical: string; locale: AppLocale }) {
  const content = copy[canonical]?.[locale];
  if (!content) return null;
  return (
    <section className="pb-12 pt-4 md:pb-16" data-retained-scope={canonical}>
      <Container>
        <div className="max-w-4xl rounded-2xl border border-line bg-surface p-6 md:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-dark">{content.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink">{content.text}</p>
        </div>
      </Container>
    </section>
  );
}
