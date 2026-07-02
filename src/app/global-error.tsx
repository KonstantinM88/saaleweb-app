"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#f8fafc",
          color: "#111827",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <main
          style={{
            display: "grid",
            minHeight: "100vh",
            placeItems: "center",
            padding: "32px 18px",
          }}
        >
          <section
            style={{
              width: "min(100%, 560px)",
              border: "1px solid #e5e7eb",
              borderRadius: "28px",
              background: "rgba(255, 255, 255, 0.92)",
              boxShadow: "0 28px 80px -48px rgba(17, 24, 39, 0.55)",
              padding: "34px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                display: "grid",
                width: "52px",
                height: "52px",
                placeItems: "center",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #ff4fa3, #8b5cf6)",
                color: "#fff",
                fontSize: "30px",
                fontWeight: 900,
                lineHeight: 1,
                marginBottom: "20px",
              }}
            >
              S
            </div>
            <p
              style={{
                margin: "0 0 10px",
                color: "#8b5cf6",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              SaaleWeb
            </p>
            <h1
              style={{
                margin: "0 0 12px",
                color: "#111827",
                fontSize: "clamp(30px, 5vw, 44px)",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
              }}
            >
              Etwas ist schiefgelaufen.
            </h1>
            <p style={{ margin: "0 0 26px", color: "#64748b", fontSize: "16px", lineHeight: 1.7 }}>
              Bitte laden Sie die Seite erneut. Falls der Fehler bleibt, kontaktieren Sie SaaleWeb direkt.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <button
                onClick={reset}
                style={{
                  minHeight: "48px",
                  border: 0,
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #ff4fa3, #8b5cf6)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: 800,
                  padding: "0 22px",
                }}
                type="button"
              >
                Erneut versuchen
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Global error must stay context-free. */}
              <a
                href="/"
                style={{
                  display: "inline-flex",
                  minHeight: "48px",
                  alignItems: "center",
                  border: "1px solid #e5e7eb",
                  borderRadius: "999px",
                  color: "#111827",
                  fontSize: "15px",
                  fontWeight: 800,
                  padding: "0 22px",
                  textDecoration: "none",
                }}
              >
                Zur Startseite
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
