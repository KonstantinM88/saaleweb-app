# AI visibility — Stage 2 authority and evidence

## Goal

Stage 2 strengthens the reason why a search engine or answer engine should
trust and cite an existing SaaleWeb page. It does not create more near-duplicate
URLs. It makes authorship, freshness, methodology and verifiable evidence
visible to visitors and consistent in structured data.

## Implemented authority signals

- The founder is one connected `Person` entity with the stable ID
  `https://saaleweb.de/#founder`.
- `Organization`, `LocalBusiness`, commercial `WebPage` and `BlogPosting`
  structured data refer to that same entity instead of creating unrelated
  anonymous Person nodes.
- Existing commercial service, industry and location landing pages show a
  compact evidence block with:
  - the responsible expert;
  - the actual editorial review date;
  - the editorial basis;
  - links to real project pages and the public Google Business Profile;
  - a clear statement that rankings and AI mentions cannot be guaranteed.
- Blog articles expose the database-backed publication and modification dates,
  the localized author role and biography, and the same evidence methodology.
- `BlogPosting.dateModified` uses the real `BlogPost.updatedAt` value.
- `public/llms.txt` summarizes the same authority and verification facts for
  machine readers.

## Editorial review date

The shared date is stored in:

```text
src/shared/config/editorial.ts
```

Change `EDITORIAL_REVIEW_DATE` only after a genuine review of the shared
commercial claims, internal and external links, published prices, service area
and methodology. Never update it merely to make pages look fresh.

Blog dates remain independent: the publication date and `updatedAt` come from
the database record.

## Evidence policy

Allowed evidence includes:

- a published project that can be opened on SaaleWeb;
- a real external client website or clearly labelled project preview;
- a public Google Business Profile or owner-verified public review;
- a reproducible technical audit;
- official platform documentation.

Do not invent client results, awards, rankings, review counts or AI citations.
Do not add `AggregateRating` merely because testimonials are visible. Structured
claims must match current public evidence and applicable schema requirements.

## Validation

After a material editorial update:

1. Confirm the visible author, date and evidence links in DE, EN and RU.
2. Validate the JSON-LD graph and make sure the Person ID is not duplicated with
   conflicting names.
3. Re-run typecheck, lint and the production build.
4. Submit only materially changed priority URLs through IndexNow.
5. Keep the 20 benchmark questions unchanged and compare the next weekly run
   with the baseline.

## What to improve next

Use the first completed benchmark to identify prompts where SaaleWeb is either
mentioned without a link or a competitor is cited. Improve the owning page with
specific original evidence for that query. Avoid adding generic text to every
page when only one intent needs stronger proof.
