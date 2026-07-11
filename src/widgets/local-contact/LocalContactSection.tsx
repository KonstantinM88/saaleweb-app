import { MapPin, Clock, Phone, Mail, Navigation, Map, Star, BadgeCheck } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/shared/config/site";
import type { AppLocale } from "@/i18n/routing";
import { ConsentMap, TrackedAction } from "./LocalContactClient";
import { getLocalContactCopy } from "./localContactContent";

/**
 * Delta 31 — local Google Business Profile section for the contact page:
 * NAP card, opening hours, six action links (all tracked) and a
 * privacy-friendly click-to-load Google Map.
 */
export function LocalContactSection({ locale }: { locale: AppLocale }) {
  const copy = getLocalContactCopy(locale);
  const gb = siteConfig.googleBusiness;
  const address = siteConfig.address;

  return (
    <section className="py-16 md:py-24" aria-labelledby="local-contact-title" id="standort">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h2
            id="local-contact-title"
            className="mt-4 text-[clamp(29px,4vw,48px)] font-bold tracking-tight text-dark"
          >
            {copy.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ink">{copy.intro}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="rounded-[26px] border border-line bg-white p-6 shadow-[0_26px_82px_-58px_rgba(15,23,42,0.4)] md:p-7">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-purple">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-[13px] font-bold uppercase tracking-wide text-muted">
                  {copy.addressLabel}
                </h3>
                <p className="mt-1 font-extrabold text-dark">{siteConfig.name}</p>
                <p className="text-[15px] leading-relaxed text-ink">
                  {address.street}
                  <br />
                  {address.postalCode} {address.locality}
                  <br />
                  {address.country}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-purple">
                <Clock className="h-5 w-5" aria-hidden />
              </span>
              <div className="w-full">
                <h3 className="text-[13px] font-bold uppercase tracking-wide text-muted">
                  {copy.hoursLabel}
                </h3>
                <dl className="mt-1 grid gap-1">
                  {copy.hours.map((row) => (
                    <div key={row.label} className="flex justify-between gap-4 text-[15px]">
                      <dt className="text-ink">{row.label}</dt>
                      <dd className="font-bold text-dark">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted">
                  <BadgeCheck className="h-4 w-4 text-brand-purple" aria-hidden />
                  {copy.byAppointment}
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
              <TrackedAction
                href={siteConfig.phone.href}
                event="click_phone"
                locale={locale}
                ariaLabel={copy.aria.call}
                external={false}
                primary
              >
                <Phone className="h-4 w-4" aria-hidden />
                {copy.actions.call}
              </TrackedAction>
              <TrackedAction
                href={`mailto:${siteConfig.email}`}
                event="click_email"
                locale={locale}
                ariaLabel={copy.aria.email}
                external={false}
              >
                <Mail className="h-4 w-4" aria-hidden />
                {copy.actions.email}
              </TrackedAction>
              <TrackedAction
                href={gb.directionsUrl}
                event="click_directions"
                locale={locale}
                ariaLabel={copy.aria.directions}
              >
                <Navigation className="h-4 w-4" aria-hidden />
                {copy.actions.directions}
              </TrackedAction>
              <TrackedAction
                href={gb.placeUrl}
                event="click_google_maps"
                locale={locale}
                ariaLabel={copy.aria.openMaps}
              >
                <Map className="h-4 w-4" aria-hidden />
                {copy.actions.openMaps}
              </TrackedAction>
              <TrackedAction
                href={gb.profileUrl}
                event="click_google_business_profile"
                locale={locale}
                ariaLabel={copy.aria.profile}
              >
                <BadgeCheck className="h-4 w-4" aria-hidden />
                {copy.actions.profile}
              </TrackedAction>
              <TrackedAction
                href={gb.reviewUrl}
                event="click_google_review"
                locale={locale}
                ariaLabel={copy.aria.review}
              >
                <Star className="h-4 w-4" aria-hidden />
                {copy.actions.review}
              </TrackedAction>
            </div>
          </div>

          <div>
            <ConsentMap
              locale={locale}
              loadLabel={copy.map.loadLabel}
              privacyNote={copy.map.privacyNote}
              mapTitle={copy.map.mapTitle}
            />
            <p className="mt-3 text-center text-[14px]">
              <a
                href={gb.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={copy.aria.directions}
                className="font-bold text-brand-purple underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
              >
                {copy.map.textLink} →
              </a>
            </p>
            <p className="mt-4 text-center text-[14px] text-muted">
              {copy.localLink.before}
              <Link
                href={{ pathname: "/standorte/[slug]", params: { slug: "halle" } }}
                className="font-bold text-brand-purple underline-offset-4 hover:underline"
              >
                {copy.localLink.label}
              </Link>
              {copy.localLink.after}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
