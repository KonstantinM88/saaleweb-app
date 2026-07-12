/** Builds Consent Mode v2 defaults inserted by the public root layout. */
export function googleConsentDefaultsCode(measurementId: string): string {
  return `
    (function () {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.dataLayer.push({
        ga_measurement_id: ${JSON.stringify(measurementId)},
        site_name: "SaaleWeb",
        app_router: true
      });
      window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500
      });
      try {
        if (window.localStorage.getItem("saaleweb_analytics_consent") === "granted") {
          window.gtag("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
          });
        }
      } catch (_) {}
    })();
  `;
}
