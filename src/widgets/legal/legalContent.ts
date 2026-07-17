import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/shared/config/site";

// ---------------------------------------------------------------------------
// Phase 10: legal pages (Impressum / Datenschutzerklärung).
//
// The German version is the legally binding one; EN/RU are courtesy
// translations and say so explicitly. Provider data comes from the trade
// registration (Gewerbeanmeldung Stadt Halle, 11.06.2026) and the VAT ID
// notice of the Bundeszentralamt für Steuern (10.06.2026).
// ---------------------------------------------------------------------------

export const LEGAL_PROVIDER = {
  brand: "SaaleWeb",
  /** Official name as registered (Gewerbeanmeldung). */
  owner: "Kostiantyn Mykhailov",
  street: "Hettstedter Str. 64",
  city: "06124 Halle (Saale)",
  country: "Deutschland",
  countryEn: "Germany",
  countryRu: "Германия",
  phone: siteConfig.phone.display,
  email: "mykhailov@saaleweb.de",
  vatId: "DE462863969",
  activity: {
    de: "Webentwicklung, Webdesign",
    en: "Web development, web design",
    ru: "Веб-разработка, веб-дизайн",
  },
} as const;

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
  /** Paragraphs rendered after the list. */
  paragraphsAfter?: string[];
};

export type LegalPageContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  updated: string;
  /** Note shown for non-German locales: the German version prevails. */
  bindingNote?: string;
  sections: LegalSection[];
};

// ---------------------------------------------------------------------------
// Impressum
// ---------------------------------------------------------------------------

const impressumDe: LegalPageContent = {
  metaTitle: "Impressum | SaaleWeb – Webentwicklung & Webdesign in Halle (Saale)",
  metaDescription:
    "Impressum von SaaleWeb: Anbieterkennzeichnung gemäß § 5 DDG, Kontaktdaten, Umsatzsteuer-Identifikationsnummer und rechtliche Hinweise.",
  eyebrow: "Rechtliches",
  title: "Impressum",
  updated: "Stand: Juli 2026",
  sections: [
    {
      title: "Angaben gemäß § 5 DDG",
      paragraphs: [
        `${LEGAL_PROVIDER.brand} – ${LEGAL_PROVIDER.activity.de}`,
        `Inhaber: ${LEGAL_PROVIDER.owner} (Einzelunternehmen)`,
        `${LEGAL_PROVIDER.street}, ${LEGAL_PROVIDER.city}, ${LEGAL_PROVIDER.country}`,
      ],
    },
    {
      title: "Kontakt",
      paragraphs: [
        `Telefon: ${LEGAL_PROVIDER.phone}`,
        `E-Mail: ${LEGAL_PROVIDER.email}`,
      ],
    },
    {
      title: "Umsatzsteuer-Identifikationsnummer",
      paragraphs: [
        `Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: ${LEGAL_PROVIDER.vatId}`,
      ],
    },
    {
      title: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
      paragraphs: [
        `${LEGAL_PROVIDER.owner}, ${LEGAL_PROVIDER.street}, ${LEGAL_PROVIDER.city}`,
      ],
    },
    {
      title: "Verbraucherstreitbeilegung / Universalschlichtungsstelle",
      paragraphs: [
        "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).",
      ],
    },
    {
      title: "Haftung für Inhalte",
      paragraphs: [
        "Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
        "Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.",
      ],
    },
    {
      title: "Haftung für Links",
      paragraphs: [
        "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
        "Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren zu diesem Zeitpunkt nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.",
      ],
    },
    {
      title: "Urheberrecht",
      paragraphs: [
        "Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.",
        "Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet und Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.",
      ],
    },
  ],
};

const impressumEn: LegalPageContent = {
  metaTitle: "Imprint | SaaleWeb – Web Development & Web Design in Halle (Saale)",
  metaDescription:
    "Legal notice (Impressum) of SaaleWeb: provider identification pursuant to Section 5 DDG, contact details, VAT ID and legal information.",
  eyebrow: "Legal",
  title: "Imprint (Impressum)",
  updated: "Last updated: July 2026",
  bindingNote:
    "This is a courtesy translation. The German version of this legal notice is the legally binding one.",
  sections: [
    {
      title: "Information pursuant to Section 5 DDG",
      paragraphs: [
        `${LEGAL_PROVIDER.brand} – ${LEGAL_PROVIDER.activity.en}`,
        `Owner: ${LEGAL_PROVIDER.owner} (sole proprietorship)`,
        `${LEGAL_PROVIDER.street}, ${LEGAL_PROVIDER.city}, ${LEGAL_PROVIDER.countryEn}`,
      ],
    },
    {
      title: "Contact",
      paragraphs: [
        `Phone: ${LEGAL_PROVIDER.phone}`,
        `Email: ${LEGAL_PROVIDER.email}`,
      ],
    },
    {
      title: "VAT identification number",
      paragraphs: [
        `VAT identification number pursuant to Section 27a of the German VAT Act (UStG): ${LEGAL_PROVIDER.vatId}`,
      ],
    },
    {
      title: "Responsible for content pursuant to Section 18 (2) MStV",
      paragraphs: [
        `${LEGAL_PROVIDER.owner}, ${LEGAL_PROVIDER.street}, ${LEGAL_PROVIDER.city}`,
      ],
    },
    {
      title: "Consumer dispute resolution",
      paragraphs: [
        "We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board (Section 36 VSBG).",
      ],
    },
    {
      title: "Liability for content",
      paragraphs: [
        "As a service provider, we are responsible for our own content on these pages in accordance with general legislation. However, we are not obliged to monitor transmitted or stored third-party information or to investigate circumstances indicating unlawful activity.",
        "Obligations to remove or block the use of information under general legislation remain unaffected. Liability in this respect is only possible from the moment we become aware of a specific legal violation. Upon becoming aware of such violations, we will remove the content in question immediately.",
      ],
    },
    {
      title: "Liability for links",
      paragraphs: [
        "Our website contains links to external third-party websites over whose content we have no influence. We therefore cannot accept any liability for this external content. The respective provider or operator of the linked pages is always responsible for their content.",
        "The linked pages were checked for possible legal violations at the time of linking; unlawful content was not identifiable at that time. Permanent monitoring of the content of linked pages is not reasonable without concrete indications of a legal violation. Upon becoming aware of legal violations, we will remove such links immediately.",
      ],
    },
    {
      title: "Copyright",
      paragraphs: [
        "The content and works created by the site operator on these pages are subject to German copyright law. Reproduction, editing, distribution and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator.",
        "Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected and third-party content is marked as such. Should you nevertheless become aware of a copyright infringement, please notify us accordingly. Upon becoming aware of legal violations, we will remove such content immediately.",
      ],
    },
  ],
};

const impressumRu: LegalPageContent = {
  metaTitle: "Impressum | SaaleWeb — веб-разработка и веб-дизайн в Halle (Saale)",
  metaDescription:
    "Impressum (выходные данные) SaaleWeb: идентификация поставщика услуг согласно § 5 DDG, контактные данные, идентификационный номер плательщика НДС и правовая информация.",
  eyebrow: "Правовая информация",
  title: "Impressum (выходные данные)",
  updated: "Актуально на: июль 2026",
  bindingNote:
    "Это перевод для удобства. Юридически обязательной является немецкая версия этой страницы.",
  sections: [
    {
      title: "Сведения согласно § 5 DDG",
      paragraphs: [
        `${LEGAL_PROVIDER.brand} — ${LEGAL_PROVIDER.activity.ru}`,
        `Владелец: ${LEGAL_PROVIDER.owner} (индивидуальный предприниматель)`,
        `${LEGAL_PROVIDER.street}, ${LEGAL_PROVIDER.city}, ${LEGAL_PROVIDER.countryRu}`,
      ],
    },
    {
      title: "Контакт",
      paragraphs: [
        `Телефон: ${LEGAL_PROVIDER.phone}`,
        `E-mail: ${LEGAL_PROVIDER.email}`,
      ],
    },
    {
      title: "Идентификационный номер плательщика НДС",
      paragraphs: [
        `Идентификационный номер плательщика НДС согласно § 27a Закона о налоге с оборота (UStG): ${LEGAL_PROVIDER.vatId}`,
      ],
    },
    {
      title: "Ответственный за содержание согласно § 18 абз. 2 MStV",
      paragraphs: [
        `${LEGAL_PROVIDER.owner}, ${LEGAL_PROVIDER.street}, ${LEGAL_PROVIDER.city}`,
      ],
    },
    {
      title: "Разрешение потребительских споров",
      paragraphs: [
        "Мы не готовы и не обязаны участвовать в процедурах разрешения споров в потребительском арбитраже (§ 36 VSBG).",
      ],
    },
    {
      title: "Ответственность за содержание",
      paragraphs: [
        "Как поставщик услуг мы несём ответственность за собственный контент на этих страницах в соответствии с общим законодательством. При этом мы не обязаны отслеживать переданную или сохранённую стороннюю информацию или расследовать обстоятельства, указывающие на противоправную деятельность.",
        "Обязательства по удалению или блокировке использования информации согласно общему законодательству остаются в силе. Ответственность в этом отношении возможна только с момента, когда нам стало известно о конкретном правонарушении. При обнаружении соответствующих нарушений мы незамедлительно удалим такой контент.",
      ],
    },
    {
      title: "Ответственность за ссылки",
      paragraphs: [
        "Наш сайт содержит ссылки на внешние сайты третьих лиц, на содержание которых мы не можем влиять. Поэтому мы не можем принять на себя ответственность за этот сторонний контент. За содержание страниц, на которые ведут ссылки, всегда отвечает их соответствующий поставщик или оператор.",
        "На момент размещения ссылок связанные страницы были проверены на возможные правонарушения; противоправный контент на тот момент не был обнаружен. Постоянный контроль содержания связанных страниц без конкретных признаков правонарушения не является разумно осуществимым. При обнаружении правонарушений мы незамедлительно удалим такие ссылки.",
      ],
    },
    {
      title: "Авторское право",
      paragraphs: [
        "Контент и произведения, созданные оператором сайта, подпадают под действие немецкого авторского права. Воспроизведение, обработка, распространение и любое использование за пределами авторского права требуют письменного согласия соответствующего автора или создателя.",
        "Если контент на этом сайте создан не оператором, авторские права третьих лиц соблюдаются, а сторонний контент помечается как таковой. Если вы всё же обнаружите нарушение авторских прав, просим сообщить нам об этом. При обнаружении нарушений мы незамедлительно удалим такой контент.",
      ],
    },
  ],
};

export const IMPRESSUM_CONTENT: Record<AppLocale, LegalPageContent> = {
  de: impressumDe,
  en: impressumEn,
  ru: impressumRu,
};

// ---------------------------------------------------------------------------
// Datenschutzerklärung
// ---------------------------------------------------------------------------

const datenschutzDe: LegalPageContent = {
  metaTitle: "Datenschutzerklärung | SaaleWeb – Webentwicklung & Webdesign in Halle (Saale)",
  metaDescription:
    "Datenschutzerklärung von SaaleWeb: eigene cookielose Statistik, einwilligungsbasierte Google-Analytics-Nutzung und Ihre Datenschutzrechte.",
  eyebrow: "Rechtliches",
  title: "Datenschutzerklärung",
  updated: "Stand: Juli 2026",
  sections: [
    {
      title: "1. Überblick und Grundsätze",
      paragraphs: [
        "Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Website ist bewusst datensparsam aufgebaut. Wir verwenden keine Werbenetzwerke. Neben unserer eigenen cookielosen Reichweitenmessung setzen wir Google Analytics 4 über Google Tag Manager ausschließlich nach Ihrer Einwilligung und mit deaktivierter Werbepersonalisierung ein. Personenbezogene Daten verarbeiten wir nur, soweit dies für die Bereitstellung der Website, die Analyse mit Ihrer Einwilligung und die Bearbeitung Ihrer Anfragen erforderlich ist.",
        "Diese Erklärung informiert Sie gemäß der Datenschutz-Grundverordnung (DSGVO) darüber, welche Daten wir verarbeiten, zu welchen Zwecken, auf welcher Rechtsgrundlage und welche Rechte Ihnen zustehen.",
      ],
    },
    {
      title: "2. Verantwortlicher",
      paragraphs: [
        `Verantwortlicher im Sinne der DSGVO ist: ${LEGAL_PROVIDER.owner}, ${LEGAL_PROVIDER.brand}, ${LEGAL_PROVIDER.street}, ${LEGAL_PROVIDER.city}, ${LEGAL_PROVIDER.country}.`,
        `Telefon: ${LEGAL_PROVIDER.phone} · E-Mail: ${LEGAL_PROVIDER.email}`,
        "Ein Datenschutzbeauftragter ist nicht bestellt, da die gesetzlichen Voraussetzungen für eine Bestellungspflicht nicht vorliegen.",
      ],
    },
    {
      title: "3. Hosting und Server-Logdateien",
      paragraphs: [
        "Diese Website wird bei Hostinger (Hostinger operations, UAB, Švitrigailos g. 34, 03230 Vilnius, Litauen) innerhalb der Europäischen Union gehostet. Mit dem Anbieter besteht ein Vertrag über Auftragsverarbeitung gemäß Art. 28 DSGVO.",
        "Beim Aufruf der Website verarbeitet der Server automatisch technische Zugriffsdaten (Server-Logdateien): IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene Seite, übertragene Datenmenge, Browsertyp und -version, Betriebssystem sowie die zuvor besuchte Seite (Referrer-URL).",
        "Diese Daten dienen der technischen Bereitstellung, der Stabilität und der Sicherheit der Website (z. B. Abwehr von Angriffen) und werden nach kurzer Zeit automatisch gelöscht. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO).",
      ],
    },
    {
      title: "4. Datenbank",
      paragraphs: [
        "Inhalte der Website sowie über das Kontaktformular übermittelte Anfragen werden in einer Datenbank des Anbieters Neon (Neon, Inc.) gespeichert. Die Datenbank wird in der Region Frankfurt am Main (Deutschland, EU) betrieben; die Daten verbleiben damit in der Europäischen Union. Mit dem Anbieter besteht ein Vertrag über Auftragsverarbeitung gemäß Art. 28 DSGVO einschließlich EU-Standardvertragsklauseln.",
      ],
    },
    {
      title: "5. Kontaktformular und Anfragen",
      paragraphs: [
        "Wenn Sie uns über das Kontaktformular oder per E-Mail eine Anfrage senden, verarbeiten wir die von Ihnen angegebenen Daten: Name, E-Mail-Adresse, optional Telefonnummer und Unternehmen sowie Ihre Nachricht.",
        "Die Verarbeitung erfolgt zur Bearbeitung Ihrer Anfrage und für mögliche Anschlussfragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen bzw. Vertragserfüllung) sowie im Übrigen unser berechtigtes Interesse an der Beantwortung von Anfragen (Art. 6 Abs. 1 lit. f DSGVO).",
        "Wenn Sie den KI-Assistenten nutzen, speichern wir den Gesprächsverlauf zusammen mit technischen Kontextdaten (IP-Adresse, technische Besucherkennung, User-Agent, Sprachversion, aufgerufene Seite und – sofern vom Hosting- oder Proxy-Anbieter übermittelt – Land, Region oder Stadt). Dies dient der Beantwortung Ihrer Anfrage, Qualitätskontrolle, Missbrauchserkennung und Sperrung von Spam-IP-Adressen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; soweit daraus eine konkrete Anfrage entsteht, zusätzlich Art. 6 Abs. 1 lit. b DSGVO.",
        "Ihre Angaben werden gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten (z. B. aus Handels- oder Steuerrecht) entgegenstehen.",
      ],
    },
    {
      title: "6. E-Mail-Benachrichtigungen und SMTP-Versand",
      paragraphs: [
        "Für den Versand interner Benachrichtigungs-E-Mails über neue Anfragen sowie von Newsletter-Bestätigungs-E-Mails nutzen wir das geschäftliche E-Mail-Postfach mykhailov@saaleweb.de und den SMTP-Server von Hostinger. Dabei können die für die jeweilige E-Mail erforderlichen Daten (z. B. E-Mail-Adresse, Name, Nachricht, Sprache und technische Versanddaten) durch Hostinger verarbeitet werden.",
        "Hostinger verarbeitet diese Daten als technischer E-Mail- und Hosting-Dienstleister nach seinen Datenschutz- und Auftragsverarbeitungsbedingungen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO für die Bearbeitung von Anfragen, Art. 6 Abs. 1 lit. f DSGVO für eine zuverlässige technische Zustellung und bei Newsletter-Bestätigungen Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.",
      ],
    },
    {
      title: "7. Newsletter (Double-Opt-In)",
      paragraphs: [
        "Sie können unseren Newsletter mit Praxistipps zu Websites, lokalem SEO und KI-Sichtbarkeit abonnieren. Dafür verarbeiten wir Ihre E-Mail-Adresse sowie die gewählte Sprachversion.",
        "Die Anmeldung erfolgt im Double-Opt-In-Verfahren: Nach der Eintragung erhalten Sie eine E-Mail mit einem Bestätigungslink. Erst mit dieser Bestätigung ist die Anmeldung wirksam; unbestätigte Eintragungen werden nicht beliefert. Der Versand der Bestätigungs- und Newsletter-E-Mails erfolgt über das in Abschnitt 6 beschriebene geschäftliche SMTP-Postfach.",
        "Rechtsgrundlage der Verarbeitung ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können die Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen – über den Abmeldelink in jeder Newsletter-E-Mail oder formlos per E-Mail an uns. Bei der Abmeldung wird Ihre E-Mail-Adresse aus dem Verteiler gelöscht.",
      ],
    },
    {
      title: "8. Reichweitenmessung ohne Cookies (First-Party-Statistik)",
      paragraphs: [
        "Wir erheben anonyme Nutzungsstatistiken mit einer eigenen, datenschutzfreundlichen Lösung – ohne Drittanbieter, ohne Cookies und ohne Speicherung oder Auslesen von Informationen auf Ihrem Endgerät. Ein Zugriff im Sinne des § 25 TDDDG findet nicht statt; eine Einwilligung ist daher nicht erforderlich.",
        "Erfasst werden: aufgerufene Seite, Sprachversion, Referrer (verweisende Seite) sowie ein technischer Besucherwert. Dieser Wert wird serverseitig als Einweg-Hash (SHA-256) aus dem aktuellen Datum, der IP-Adresse, dem Browser-User-Agent und einem geheimen Zufallswert (Salt) gebildet. Die IP-Adresse selbst wird nicht gespeichert; der Hash ändert sich täglich und lässt keine Rückverfolgung auf eine Person und kein seitenübergreifendes Tracking zu. Zugriffe bekannter Bots werden verworfen.",
        "Zweck ist die statistische Auswertung der Nutzung unserer Website (z. B. welche Seiten wie häufig aufgerufen werden). Rechtsgrundlage ist unser berechtigtes Interesse an der Analyse und Verbesserung unseres Angebots (Art. 6 Abs. 1 lit. f DSGVO).",
      ],
    },
    {
      title: "9. Google-Dienste: Tag Manager, Analytics 4 und Maps-Rezensionen",
      paragraphs: [
        "Auf den öffentlichen Seiten ist Google Tag Manager eingebunden. Anbieter für Nutzer im Europäischen Wirtschaftsraum ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Der Tag Manager verwaltet die technische Ausspielung von Analyse-Tags und übermittelt dabei technische Verbindungsdaten, insbesondere IP-Adresse, Browser- und Geräteinformationen sowie Zeitpunkt und aufgerufene URL an Google.",
        "Google Analytics 4 wird über den Tag Manager im erweiterten Einwilligungsmodus gesteuert. Vor Ihrer Auswahl sind analytics_storage, ad_storage, ad_user_data und ad_personalization standardmäßig auf „denied“ gesetzt; Google kann dabei technisch eingeschränkte, cookielose Signale empfangen. Cookie-basierte Messung wird erst nach Ihrer freiwilligen Zustimmung aktiviert. Wir messen dann insbesondere Seitenaufrufe, ungefähren Standort, Gerätetyp, Referrer sowie Interaktionen wie Formularabschlüsse, Kontakt- und Messenger-Klicks, Scrolltiefe und das Öffnen des KI-Assistenten. Werbespeicherung und personalisierte Werbung bleiben deaktiviert.",
        "Rechtsgrundlage ist Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Sie können Ihre Entscheidung jederzeit über die Schaltfläche „Datenschutz-Einstellungen“ mit Wirkung für die Zukunft ändern. Die Auswahl selbst wird im Local Storage gespeichert. Google kann Daten auch auf Servern außerhalb der EU verarbeiten; hierfür gelten die von Google bereitgestellten Datenschutzbedingungen und Übermittlungsmechanismen. Weitere Informationen finden Sie unter https://policies.google.com/privacy.",
        "Im Bereich der Kundenstimmen zeigen wir derzeit zwei im Juli 2026 von uns direkt im öffentlichen Google-Unternehmensprofil geprüfte Rezensionstexte und die dort sichtbare Bewertung von 5,0 Sternen. Der deutsche Originaltext wird für die englische und russische Sprachversion redaktionell übersetzt und dort ausdrücklich als Übersetzung gekennzeichnet. Solange der automatische Abruf nicht aktiviert ist, entsteht beim Laden dieses Abschnitts keine Verbindung zu Google. Nach Aktivierung kann die aktuelle Rezensionenauswahl zusätzlich serverseitig über die Google Places API abgerufen werden; der Browser stellt dabei für Rezensionstext und Autorenbild weiterhin keine direkte Google-Verbindung her und die API-Inhalte werden weder in unserer Datenbank noch in einem Anwendungscache gespeichert. Erst wenn Sie einen Google-Maps-, Autoren-, Melde- oder Bewertungs-Link öffnen, verlassen Sie unsere Website und stellen selbst eine Verbindung zu Google her. Zweck und Rechtsgrundlage sind die transparente Darstellung öffentlich verfügbarer Kundenerfahrungen und unser berechtigtes Interesse an der Vertrauensbildung (Art. 6 Abs. 1 lit. f DSGVO). Es gelten zusätzlich die Google Maps Platform Terms unter https://cloud.google.com/maps-platform/terms und die Google-Datenschutzhinweise unter https://policies.google.com/privacy.",
      ],
    },
    {
      title: "10. Cookies und lokale Speicherung",
      paragraphs: [
        "Analyse-Cookies oder vergleichbare Kennungen von Google Analytics dürfen nur nach Ihrer ausdrücklichen Einwilligung gesetzt beziehungsweise ausgelesen werden. Ohne Zustimmung bleibt die Analysespeicherung deaktiviert.",
        "Technisch notwendige Speicherungen können für die Sprachauswahl, die Anmeldung autorisierter Administratoren und das Merken Ihrer Datenschutzentscheidung erfolgen. Sie sind für die angeforderte Funktion erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG); Rechtsgrundlage der damit verbundenen Verarbeitung ist Art. 6 Abs. 1 lit. f DSGVO.",
        "Der KI-Assistent kann zusätzlich eine zufällig erzeugte technische Besucherkennung im Local Storage Ihres Browsers speichern, damit Folgefragen demselben Gespräch zugeordnet werden können. Die Kennung enthält keine Nachrichtentexte und keine Kontaktdaten.",
      ],
    },
    {
      title: "11. SSL-/TLS-Verschlüsselung",
      paragraphs: [
        "Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie z. B. Anfragen über das Kontaktformular, eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie an dem Präfix „https://“ und dem Schloss-Symbol in der Adresszeile Ihres Browsers.",
      ],
    },
    {
      title: "12. Ihre Rechte",
      paragraphs: ["Ihnen stehen bezüglich Ihrer personenbezogenen Daten folgende Rechte zu:"],
      list: [
        "Recht auf Auskunft über die verarbeiteten Daten (Art. 15 DSGVO)",
        "Recht auf Berichtigung unrichtiger Daten (Art. 16 DSGVO)",
        "Recht auf Löschung (Art. 17 DSGVO)",
        "Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)",
        "Recht auf Datenübertragbarkeit (Art. 20 DSGVO)",
        "Widerspruchsrecht gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)",
        "Recht auf Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)",
      ],
      paragraphsAfter: [
        `Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung an: ${LEGAL_PROVIDER.email}`,
        "Darüber hinaus haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Zuständig für uns ist der Landesbeauftragte für den Datenschutz Sachsen-Anhalt, Otto-von-Guericke-Str. 34a, 39104 Magdeburg.",
      ],
    },
    {
      title: "13. Speicherdauer, Bereitstellungspflicht und automatisierte Entscheidungen",
      paragraphs: [
        "Soweit in dieser Erklärung keine speziellere Speicherdauer genannt ist, verbleiben personenbezogene Daten bei uns, bis der Zweck der Verarbeitung entfällt oder Sie ein Lösch- bzw. Widerspruchsrecht ausüben – vorbehaltlich gesetzlicher Aufbewahrungsfristen (insbesondere aus Handels- und Steuerrecht).",
        "Die Bereitstellung personenbezogener Daten ist weder gesetzlich noch vertraglich vorgeschrieben; ohne Angabe von Kontaktdaten können wir Anfragen jedoch nicht beantworten. Eine automatisierte Entscheidungsfindung einschließlich Profiling im Sinne von Art. 22 DSGVO findet nicht statt.",
      ],
    },
    {
      title: "14. Aktualität und Änderung dieser Datenschutzerklärung",
      paragraphs: [
        "Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn sich die Rechtslage, die Website oder die eingesetzten Dienste ändern. Es gilt die jeweils auf dieser Seite veröffentlichte Fassung.",
      ],
    },
  ],
};

const datenschutzEn: LegalPageContent = {
  metaTitle: "Privacy Policy | SaaleWeb – Web Development & Web Design in Halle (Saale)",
  metaDescription:
    "SaaleWeb privacy policy: first-party cookie-free statistics, consent-based Google Analytics and your data protection rights.",
  eyebrow: "Legal",
  title: "Privacy Policy",
  updated: "Last updated: July 2026",
  bindingNote:
    "This is a courtesy translation. The German version of this privacy policy is the legally binding one.",
  sections: [
    {
      title: "1. Overview and principles",
      paragraphs: [
        "Protecting your personal data matters to us. This website is deliberately data-minimal and does not use advertising networks. In addition to our own cookie-free audience measurement, we use Google Analytics 4 through Google Tag Manager only with your consent and with advertising personalisation disabled. We process personal data only where necessary to provide the website, perform consented analytics and handle your inquiries.",
        "In accordance with the General Data Protection Regulation (GDPR), this policy informs you about which data we process, for which purposes, on which legal basis, and which rights you have.",
      ],
    },
    {
      title: "2. Controller",
      paragraphs: [
        `The controller within the meaning of the GDPR is: ${LEGAL_PROVIDER.owner}, ${LEGAL_PROVIDER.brand}, ${LEGAL_PROVIDER.street}, ${LEGAL_PROVIDER.city}, ${LEGAL_PROVIDER.countryEn}.`,
        `Phone: ${LEGAL_PROVIDER.phone} · Email: ${LEGAL_PROVIDER.email}`,
        "No data protection officer has been appointed, as the legal requirements for a mandatory appointment are not met.",
      ],
    },
    {
      title: "3. Hosting and server log files",
      paragraphs: [
        "This website is hosted by Hostinger (Hostinger operations, UAB, Švitrigailos g. 34, 03230 Vilnius, Lithuania) within the European Union. A data processing agreement pursuant to Art. 28 GDPR is in place with the provider.",
        "When you access the website, the server automatically processes technical access data (server log files): IP address, date and time of the request, page accessed, amount of data transferred, browser type and version, operating system and the previously visited page (referrer URL).",
        "This data serves the technical provision, stability and security of the website (e.g. defence against attacks) and is automatically deleted after a short period. The legal basis is our legitimate interest in secure and stable operation (Art. 6(1)(f) GDPR).",
      ],
    },
    {
      title: "4. Database",
      paragraphs: [
        "Website content and inquiries submitted via the contact form are stored in a database operated by Neon (Neon, Inc.). The database runs in the Frankfurt am Main region (Germany, EU); the data therefore remains within the European Union. A data processing agreement pursuant to Art. 28 GDPR, including EU standard contractual clauses, is in place with the provider.",
      ],
    },
    {
      title: "5. Contact form and inquiries",
      paragraphs: [
        "If you send us an inquiry via the contact form or by email, we process the data you provide: name, email address, optionally phone number and company, and your message.",
        "Processing takes place to handle your inquiry and for possible follow-up questions. The legal basis is Art. 6(1)(b) GDPR (pre-contractual measures or contract performance) and, in addition, our legitimate interest in answering inquiries (Art. 6(1)(f) GDPR).",
        "If you use the AI assistant, we store the conversation history together with technical context data (IP address, technical visitor identifier, user agent, language version, page accessed and – where transmitted by the hosting or proxy provider – country, region or city). This is used to answer your request, review quality, detect misuse and block spam IP addresses. The legal basis is Art. 6(1)(f) GDPR; where this results in a concrete inquiry, Art. 6(1)(b) GDPR also applies.",
        "Your details are deleted as soon as they are no longer required for processing and no statutory retention obligations (e.g. under commercial or tax law) prevent deletion.",
      ],
    },
    {
      title: "6. Email notifications and SMTP delivery",
      paragraphs: [
        "We use the business email mailbox mykhailov@saaleweb.de and Hostinger's SMTP server to send internal notification emails about new inquiries and newsletter confirmation emails. The data required for the respective email (for example email address, name, message, language and technical delivery data) may be processed by Hostinger.",
        "Hostinger processes this data as a technical email and hosting provider under its privacy and data processing terms. The legal basis is Art. 6(1)(b) GDPR for handling inquiries, Art. 6(1)(f) GDPR for reliable technical delivery and, for newsletter confirmations, your consent pursuant to Art. 6(1)(a) GDPR.",
      ],
    },
    {
      title: "7. Newsletter (double opt-in)",
      paragraphs: [
        "You can subscribe to our newsletter with practical tips on websites, local SEO and AI visibility. For this purpose we process your email address and the selected language version.",
        "Subscription uses the double opt-in procedure: after signing up, you receive an email with a confirmation link. The subscription only becomes effective with this confirmation; unconfirmed sign-ups do not receive the newsletter. Confirmation and newsletter emails are sent via the business SMTP mailbox described in section 6.",
        "The legal basis for the processing is your consent (Art. 6(1)(a) GDPR). You can withdraw your consent at any time with effect for the future – via the unsubscribe link in every newsletter email or informally by emailing us. Upon unsubscribing, your email address is deleted from the list.",
      ],
    },
    {
      title: "8. Cookie-free reach measurement (first-party statistics)",
      paragraphs: [
        "We collect anonymous usage statistics with our own privacy-friendly solution – without third parties, without cookies and without storing or reading information on your device. No access within the meaning of Section 25 TDDDG takes place; consent is therefore not required.",
        "The following is recorded: page accessed, language version, referrer (referring page) and a technical visitor value. This value is generated server-side as a one-way hash (SHA-256) from the current date, the IP address, the browser user agent and a secret random value (salt). The IP address itself is not stored; the hash changes daily and does not allow identification of a person or cross-site tracking. Requests from known bots are discarded.",
        "The purpose is the statistical evaluation of the use of our website (e.g. which pages are accessed how often). The legal basis is our legitimate interest in analysing and improving our services (Art. 6(1)(f) GDPR).",
      ],
    },
    {
      title: "9. Google services: Tag Manager, Analytics 4 and Maps reviews",
      paragraphs: [
        "Google Tag Manager is integrated on the public pages. For users in the European Economic Area, the provider is Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Tag Manager controls the technical delivery of analytics tags and may transmit technical connection data, particularly IP address, browser and device information, time and the URL accessed, to Google.",
        "Google Analytics 4 is controlled through Tag Manager in advanced consent mode. Before you make a choice, analytics_storage, ad_storage, ad_user_data and ad_personalization are set to “denied” by default; Google may receive technically restricted cookieless signals in this state. Cookie-based measurement is activated only after your voluntary consent. We then measure page views, approximate location, device type, referrer and interactions such as successful form submissions, contact and messenger clicks, scroll depth and opening the AI assistant. Advertising storage and personalised advertising remain disabled.",
        "The legal basis is your consent under Art. 6(1)(a) GDPR and Section 25(1) TDDDG. You can change your decision at any time for the future using the “Privacy settings” button. The choice itself is stored in local storage. Google may also process data on servers outside the EU; Google's applicable data protection terms and transfer mechanisms apply. More information is available at https://policies.google.com/privacy.",
        "In the client testimonials section, we currently show two review texts and the 5.0-star rating that we checked directly in the public Google Business Profile in July 2026. The German originals are editorially translated for the English and Russian versions and are explicitly labelled as translations. Until automatic retrieval is enabled, loading this section does not establish a connection to Google. Once enabled, the current review selection may additionally be requested server-side through the Google Places API; the browser still does not establish a direct Google connection for review text or author images, and API content is stored neither in our database nor in an application cache. Only when you open a Google Maps, author, reporting or write-review link do you leave our website and connect to Google yourself. The purpose and legal basis are the transparent presentation of publicly available client experiences and our legitimate interest in building trust (Art. 6(1)(f) GDPR). The Google Maps Platform Terms at https://cloud.google.com/maps-platform/terms and Google's privacy policy at https://policies.google.com/privacy also apply.",
      ],
    },
    {
      title: "10. Cookies and local storage",
      paragraphs: [
        "Google Analytics cookies or comparable identifiers may only be set or read after your explicit consent. Analytics storage remains disabled without consent.",
        "Technically necessary storage may be used for language selection, authorised administrator login and remembering your privacy choice. It is required for the requested function (Section 25(2) no. 2 TDDDG); the legal basis for the associated processing is Art. 6(1)(f) GDPR.",
        "The AI assistant may additionally store a randomly generated technical visitor identifier in your browser's local storage so that follow-up questions can be assigned to the same conversation. The identifier does not contain message texts or contact details.",
      ],
    },
    {
      title: "11. SSL/TLS encryption",
      paragraphs: [
        "For security reasons and to protect the transmission of confidential content, such as inquiries via the contact form, this website uses SSL/TLS encryption. You can recognise an encrypted connection by the prefix \u201chttps://\u201d and the lock symbol in your browser's address bar.",
      ],
    },
    {
      title: "12. Your rights",
      paragraphs: ["You have the following rights regarding your personal data:"],
      list: [
        "Right of access to the processed data (Art. 15 GDPR)",
        "Right to rectification of inaccurate data (Art. 16 GDPR)",
        "Right to erasure (Art. 17 GDPR)",
        "Right to restriction of processing (Art. 18 GDPR)",
        "Right to data portability (Art. 20 GDPR)",
        "Right to object to processing based on Art. 6(1)(f) GDPR (Art. 21 GDPR)",
        "Right to withdraw consent with effect for the future (Art. 7(3) GDPR)",
      ],
      paragraphsAfter: [
        `To exercise your rights, an informal message to ${LEGAL_PROVIDER.email} is sufficient.`,
        "You also have the right to lodge a complaint with a data protection supervisory authority (Art. 77 GDPR). The authority responsible for us is the State Commissioner for Data Protection of Saxony-Anhalt (Landesbeauftragter für den Datenschutz Sachsen-Anhalt), Otto-von-Guericke-Str. 34a, 39104 Magdeburg, Germany.",
      ],
    },
    {
      title: "13. Storage period, obligation to provide data, automated decisions",
      paragraphs: [
        "Unless a more specific storage period is stated in this policy, personal data remains with us until the purpose of processing ceases to apply or you exercise a right to erasure or objection – subject to statutory retention periods (in particular under commercial and tax law).",
        "The provision of personal data is neither legally nor contractually required; however, we cannot answer inquiries without contact details. Automated decision-making, including profiling within the meaning of Art. 22 GDPR, does not take place.",
      ],
    },
    {
      title: "14. Validity and changes to this privacy policy",
      paragraphs: [
        "We reserve the right to adapt this privacy policy if the legal situation, the website or the services used change. The version published on this page at the respective time applies.",
      ],
    },
  ],
};

const datenschutzRu: LegalPageContent = {
  metaTitle: "Политика конфиденциальности | SaaleWeb — веб-разработка и веб-дизайн в Halle (Saale)",
  metaDescription:
    "Политика конфиденциальности SaaleWeb: собственная аналитика без cookies, Google Analytics по согласию и ваши права на защиту данных.",
  eyebrow: "Правовая информация",
  title: "Политика конфиденциальности (Datenschutzerklärung)",
  updated: "Актуально на: июль 2026",
  bindingNote:
    "Это перевод для удобства. Юридически обязательной является немецкая версия этой политики.",
  sections: [
    {
      title: "1. Обзор и принципы",
      paragraphs: [
        "Защита ваших персональных данных важна для нас. Сайт построен по принципу минимизации данных и не использует рекламные сети. Помимо собственной аналитики без cookies, мы используем Google Analytics 4 через Google Tag Manager только с вашего согласия и с отключённой рекламной персонализацией. Персональные данные обрабатываются только в объёме, необходимом для работы сайта, согласованной аналитики и обработки обращений.",
        "В соответствии с Общим регламентом по защите данных (GDPR/DSGVO) эта политика информирует вас о том, какие данные мы обрабатываем, для каких целей, на каком правовом основании и какие права вам принадлежат.",
      ],
    },
    {
      title: "2. Ответственный за обработку данных",
      paragraphs: [
        `Ответственным в смысле GDPR является: ${LEGAL_PROVIDER.owner}, ${LEGAL_PROVIDER.brand}, ${LEGAL_PROVIDER.street}, ${LEGAL_PROVIDER.city}, ${LEGAL_PROVIDER.countryRu}.`,
        `Телефон: ${LEGAL_PROVIDER.phone} · E-mail: ${LEGAL_PROVIDER.email}`,
        "Инспектор по защите данных не назначен, поскольку установленные законом условия для обязательного назначения не выполняются.",
      ],
    },
    {
      title: "3. Хостинг и серверные лог-файлы",
      paragraphs: [
        "Сайт размещён у провайдера Hostinger (Hostinger operations, UAB, Švitrigailos g. 34, 03230 Вильнюс, Литва) на территории Европейского союза. С провайдером заключён договор на обработку данных по поручению согласно ст. 28 GDPR.",
        "При открытии сайта сервер автоматически обрабатывает технические данные доступа (серверные лог-файлы): IP-адрес, дату и время запроса, открытую страницу, объём переданных данных, тип и версию браузера, операционную систему и предыдущую посещённую страницу (referrer).",
        "Эти данные служат технической работе, стабильности и безопасности сайта (например, защите от атак) и автоматически удаляются через короткое время. Правовое основание — наш законный интерес в безопасной и стабильной работе (ст. 6 (1)(f) GDPR).",
      ],
    },
    {
      title: "4. База данных",
      paragraphs: [
        "Контент сайта и обращения, отправленные через контактную форму, хранятся в базе данных провайдера Neon (Neon, Inc.). База данных работает в регионе Франкфурт-на-Майне (Германия, ЕС); данные таким образом остаются на территории Европейского союза. С провайдером заключён договор на обработку данных по поручению согласно ст. 28 GDPR, включая стандартные договорные положения ЕС.",
      ],
    },
    {
      title: "5. Контактная форма и обращения",
      paragraphs: [
        "Если вы отправляете нам запрос через контактную форму или по электронной почте, мы обрабатываем указанные вами данные: имя, адрес электронной почты, при желании телефон и название компании, а также ваше сообщение.",
        "Обработка выполняется для ответа на ваше обращение и возможных уточняющих вопросов. Правовое основание — ст. 6 (1)(b) GDPR (преддоговорные меры или исполнение договора), а также наш законный интерес в ответе на обращения (ст. 6 (1)(f) GDPR).",
        "Если вы используете AI-ассистента, мы сохраняем историю диалога вместе с техническими контекстными данными: IP-адресом, техническим идентификатором посетителя, user-agent, языковой версией, открытой страницей и — если эти данные передаются hosting- или proxy-провайдером — страной, регионом или городом. Это нужно для ответа на запрос, контроля качества, выявления злоупотреблений и блокировки спам-IP. Правовое основание — ст. 6 (1)(f) GDPR; если из диалога возникает конкретное обращение, дополнительно применяется ст. 6 (1)(b) GDPR.",
        "Ваши данные удаляются, как только они перестают быть необходимыми для обработки и этому не препятствуют законные сроки хранения (например, по торговому или налоговому праву).",
      ],
    },
    {
      title: "6. E-mail-уведомления и SMTP-отправка",
      paragraphs: [
        "Для отправки внутренних уведомлений о новых обращениях и писем подтверждения подписки мы используем рабочий почтовый ящик mykhailov@saaleweb.de и SMTP-сервер Hostinger. При этом Hostinger может обрабатывать данные, необходимые для соответствующего письма, например e-mail, имя, сообщение, язык и технические данные доставки.",
        "Hostinger обрабатывает эти данные как технический поставщик e-mail и hosting-услуг согласно своим условиям конфиденциальности и обработки данных. Правовое основание — ст. 6 (1)(b) GDPR для обработки обращений, ст. 6 (1)(f) GDPR для надёжной технической доставки, а для подтверждения подписки — ваше согласие согласно ст. 6 (1)(a) GDPR.",
      ],
    },
    {
      title: "7. Рассылка (double opt-in)",
      paragraphs: [
        "Вы можете подписаться на нашу рассылку с практическими советами о сайтах, локальном SEO и видимости в ИИ. Для этого мы обрабатываем ваш адрес электронной почты и выбранную языковую версию.",
        "Подписка оформляется по процедуре double opt-in: после регистрации вы получаете письмо со ссылкой подтверждения. Подписка вступает в силу только после этого подтверждения; неподтверждённые адреса рассылку не получают. Письма подтверждения и выпуски рассылки отправляются через рабочий SMTP-ящик, описанный в разделе 6.",
        "Правовое основание обработки — ваше согласие (ст. 6 (1)(a) GDPR). Вы можете отозвать согласие в любой момент с действием на будущее — по ссылке отписки в каждом письме рассылки или сообщением нам в свободной форме. При отписке ваш адрес электронной почты удаляется из списка.",
      ],
    },
    {
      title: "8. Статистика посещений без cookies (first-party)",
      paragraphs: [
        "Мы собираем анонимную статистику использования с помощью собственного, дружелюбного к приватности решения — без третьих сторон, без cookies и без сохранения или чтения информации на вашем устройстве. Доступ в смысле § 25 TDDDG не осуществляется, поэтому согласие не требуется.",
        "Фиксируются: открытая страница, языковая версия, referrer (ссылающаяся страница) и технический идентификатор посетителя. Этот идентификатор формируется на сервере как односторонний хеш (SHA-256) из текущей даты, IP-адреса, user-agent браузера и секретного случайного значения (salt). Сам IP-адрес не сохраняется; хеш меняется ежедневно и не позволяет ни идентифицировать человека, ни отслеживать его на других сайтах. Запросы известных ботов отбрасываются.",
        "Цель — статистическая оценка использования сайта (например, какие страницы открываются и как часто). Правовое основание — наш законный интерес в анализе и улучшении нашего предложения (ст. 6 (1)(f) GDPR).",
      ],
    },
    {
      title: "9. Сервисы Google: Tag Manager, Analytics 4 и отзывы Maps",
      paragraphs: [
        "На публичных страницах подключён Google Tag Manager. Для пользователей в Европейской экономической зоне поставщиком является Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Tag Manager управляет технической загрузкой аналитических тегов и может передавать Google технические данные соединения, в частности IP-адрес, сведения о браузере и устройстве, время и открытый URL.",
        "Google Analytics 4 управляется через Tag Manager в расширенном режиме согласия. До вашего выбора параметры analytics_storage, ad_storage, ad_user_data и ad_personalization по умолчанию имеют значение «denied»; в этом состоянии Google может получать технически ограниченные сигналы без cookies. Аналитика на основе cookies активируется только после добровольного согласия. После этого измеряются просмотры страниц, примерное местоположение, тип устройства, referrer и взаимодействия: успешная отправка форм, клики по контактам и мессенджерам, глубина прокрутки и открытие AI-ассистента. Рекламное хранение и персонализированная реклама остаются отключёнными.",
        "Правовое основание — ваше согласие согласно ст. 6 (1)(a) GDPR и § 25 (1) TDDDG. Решение можно в любое время изменить на будущее кнопкой «Настройки конфиденциальности». Сам выбор сохраняется в localStorage. Google также может обрабатывать данные на серверах за пределами ЕС; применяются условия защиты данных и механизмы передачи Google. Подробнее: https://policies.google.com/privacy.",
        "В блоке отзывов сейчас отображаются два текста и рейтинг 5,0, которые мы непосредственно проверили в публичном профиле компании Google в июле 2026 года. Немецкие оригиналы редакционно переведены для английской и русской версий и явно обозначены как переводы. Пока автоматическая загрузка не активирована, при открытии этого блока соединение с Google не устанавливается. После активации актуальная подборка может дополнительно запрашиваться на сервере через Google Places API; браузер по-прежнему не соединяется с Google напрямую для загрузки текста или фото автора, а API-контент не сохраняется ни в нашей базе, ни в кеше приложения. Только при открытии ссылки Google Maps, профиля автора, жалобы или добавления отзыва вы покидаете наш сайт и самостоятельно соединяетесь с Google. Цель и правовое основание — прозрачное отображение публично доступного клиентского опыта и наш законный интерес в укреплении доверия (ст. 6 (1)(f) GDPR). Дополнительно применяются условия Google Maps Platform https://cloud.google.com/maps-platform/terms и политика конфиденциальности Google https://policies.google.com/privacy.",
      ],
    },
    {
      title: "10. Cookies и локальное хранилище",
      paragraphs: [
        "Аналитические cookies или сопоставимые идентификаторы Google Analytics могут устанавливаться или считываться только после вашего явного согласия. Без согласия аналитическое хранение остаётся отключённым.",
        "Технически необходимое хранение может использоваться для выбора языка, входа авторизованных администраторов и запоминания решения о конфиденциальности. Оно необходимо для запрошенной функции (§ 25 (2) № 2 TDDDG); правовое основание связанной обработки — ст. 6 (1)(f) GDPR.",
        "AI-ассистент также может сохранять в localStorage браузера случайно созданный технический идентификатор посетителя, чтобы последующие вопросы можно было связать с тем же диалогом. Этот идентификатор не содержит тексты сообщений или контактные данные.",
      ],
    },
    {
      title: "11. SSL/TLS-шифрование",
      paragraphs: [
        "В целях безопасности и для защиты передачи конфиденциального содержимого, например обращений через контактную форму, сайт использует SSL/TLS-шифрование. Зашифрованное соединение можно узнать по префиксу «https://» и значку замка в адресной строке браузера.",
      ],
    },
    {
      title: "12. Ваши права",
      paragraphs: ["В отношении ваших персональных данных вам принадлежат следующие права:"],
      list: [
        "Право на доступ к обрабатываемым данным (ст. 15 GDPR)",
        "Право на исправление неверных данных (ст. 16 GDPR)",
        "Право на удаление (ст. 17 GDPR)",
        "Право на ограничение обработки (ст. 18 GDPR)",
        "Право на переносимость данных (ст. 20 GDPR)",
        "Право на возражение против обработки на основании ст. 6 (1)(f) GDPR (ст. 21 GDPR)",
        "Право на отзыв данного согласия с действием на будущее (ст. 7 (3) GDPR)",
      ],
      paragraphsAfter: [
        `Для реализации своих прав достаточно сообщения в свободной форме на адрес: ${LEGAL_PROVIDER.email}`,
        "Кроме того, вы имеете право подать жалобу в надзорный орган по защите данных (ст. 77 GDPR). Компетентный для нас орган — Уполномоченный по защите данных земли Саксония-Анхальт (Landesbeauftragter für den Datenschutz Sachsen-Anhalt), Otto-von-Guericke-Str. 34a, 39104 Магдебург, Германия.",
      ],
    },
    {
      title: "13. Срок хранения, обязанность предоставления данных, автоматизированные решения",
      paragraphs: [
        "Если в этой политике не указан более конкретный срок хранения, персональные данные остаются у нас до тех пор, пока не отпадёт цель обработки или вы не воспользуетесь правом на удаление или возражение — с учётом законных сроков хранения (в частности, по торговому и налоговому праву).",
        "Предоставление персональных данных не является ни законодательной, ни договорной обязанностью; однако без контактных данных мы не сможем ответить на обращение. Автоматизированное принятие решений, включая профилирование в смысле ст. 22 GDPR, не осуществляется.",
      ],
    },
    {
      title: "14. Актуальность и изменение этой политики",
      paragraphs: [
        "Мы оставляем за собой право адаптировать эту политику при изменении правовой ситуации, сайта или используемых сервисов. Действует версия, опубликованная на этой странице в соответствующий момент.",
      ],
    },
  ],
};

export const DATENSCHUTZ_CONTENT: Record<AppLocale, LegalPageContent> = {
  de: datenschutzDe,
  en: datenschutzEn,
  ru: datenschutzRu,
};
