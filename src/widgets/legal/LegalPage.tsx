import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import type { LegalPageContent } from "./legalContent";

export function LegalPage({
  content,
  homeLabel,
}: {
  content: LegalPageContent;
  homeLabel: string;
}) {
  return (
    <>
      <Navbar />
      <main>
        <Container>
          <Breadcrumbs items={[{ name: homeLabel, href: "/" }, { name: content.title }]} />

          <article className="mx-auto max-w-3xl pb-20 pt-6 md:pb-28 md:pt-10">
            <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-brand-pink">
              {content.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-dark md:text-4xl">
              {content.title}
            </h1>
            <p className="mt-3 text-[14px] text-muted">{content.updated}</p>

            {content.bindingNote ? (
              <p className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-muted">
                {content.bindingNote}
              </p>
            ) : null}

            <div className="mt-10 space-y-10">
              {content.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-lg font-semibold text-dark md:text-xl">{section.title}</h2>
                  {section.paragraphs?.map((paragraph, index) => (
                    <p key={index} className="mt-3 text-[15.5px] leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                  {section.list ? (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15.5px] leading-relaxed text-muted">
                      {section.list.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.paragraphsAfter?.map((paragraph, index) => (
                    <p key={index} className="mt-3 text-[15.5px] leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
