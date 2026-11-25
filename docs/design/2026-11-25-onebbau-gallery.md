# Onebbau gallery revision

Owner requested a designed gallery rather than fixed-ratio screenshot boxes.
The code-owned Onebbau case now uses `ProjectGallery`; existing CMS galleries
retain their current rendering. No image was regenerated, edited or discarded.

## Presentation

- Asymmetric desktop composition: browser preview and a separate phone frame.
- On small screens the cards stack. Each original capture retains its intrinsic
  width/height ratio through `next/image` (`h-auto w-full`), without an aspect-ratio
  box cropping or squeezing the mobile capture into landscape.
- Original views are clearly labelled and have localized DE/EN/RU captions.
- Hover movement uses transforms and respects reduced motion.
- A native modal dialog offers a larger contain-fit view, original-file link,
  previous/next buttons and arrow-key navigation. Escape/close dismiss it.
  Background document is inert while modal; focus returns to its trigger and
  body scroll/padding are restored. Native cursor styling is scoped to the
  dialog, which renders above the decorative cursor layer.
- Gallery messages are passed through a local `NextIntlClientProvider` only
  around this component. A first HTTP check found the layout intentionally
  omits the Projects namespace; this was corrected without adding that payload
  to every page. All three localized HTTP checks now return translated headings,
  two original image references and the viewer markup (200).

## Verification

Sequential final typecheck, lint and production Webpack build all exited 0
(250 static pages). `git diff --check` passes.
Browser DE 1280/390, RU 320 and EN 390 confirms loaded images, contain-fit viewer
and no document/modal horizontal overflow. DE Escape restores trigger focus
and clears the scroll lock. The desktop viewer shows a visible native pointer.
Desktop image measures 647x426, mobile 198x428, preserving original proportions
within image-optimizer/pixel rounding. ArrowRight changes desktop to mobile.
Evidence: `docs/audits/2026-11-25-onebbau-gallery-*`.

Browser connection initially failed to attach new tabs; after recovery the
actual gallery and viewer checks above succeeded and screenshots were saved.
An immediate read after the EN Next button click captured the prior render;
it is marked as an observation, not a successful assertion. Keyboard ArrowRight
navigation was independently verified. Own tab26 closed/viewport reset;
no task server or temporary files created. Owner's dev PID22852/3000 preserved.

Assessment: better visual hierarchy and inspectability; no measured SEO,
conversion or performance gain. No dependency, environment, database, canonical
or sitemap changes. Work remains local without staging, commit, push or deploy.
