# Onebbau portfolio cover

Generated with the built-in imagegen tool on 2026-11-25, using three local
image references. The selected result was visually reviewed, then converted
to WebP without changing its composition.

- Final asset: `public/images/cases/onebbau-monitor-phone-v1.webp`
- Dimensions: 1536 × 1024 (3:2), RGB, no alpha.
- Size: 106,524 bytes.
- Original generated PNG: `C:/Users/user/.codex/generated_images/01a0fe20-b85b-7a43-b54a-c84ab60c0e2d/exec-7ed2afda-f3ee-4acd-9d9c-1e8e02eb2105.png`.
- Actual desktop input: `public/images/project-captures/2026-11-25/onebbau.webp`.
- Actual mobile input: `public/images/project-captures/2026-11-25/onebbau-mobile.webp`.
- Composition reference only: `public/images/cases/glaserei-schubert.webp`.

The generated device presentation is an illustrative portfolio cover, not
an audit or evidence of performance/results. At the owner's follow-up request,
the same cover is used on the project detail hero and in its social/CreativeWork
image metadata. The hero keeps the complete 3:2 image without cropping either
device. Actual independent desktop/mobile screenshots remain in the gallery;
their files are unchanged. The cover has localized DE/EN/RU alternative text.
No factual project copy, canonical URL or sitemap URL was replaced.

## Exact final prompt

```text
Use case: product-mockup / compositing. Generate ONE finished premium web-agency portfolio cover, landscape 3:2 composition. Input image 1 is the ACTUAL Onebbau desktop website and input image 2 is its ACTUAL mobile website: use these as screen inserts, retaining their appearance, orange/white palette, real hero photograph, Onebbau wordmark and German page content. Input image 3 is ONLY the composition / device photography style reference; do NOT copy its website, cityscape, testimonials, stars or written claims. Primary request: match the portfolio's existing monitor-and-phone mockup style. Photorealistic large elegant dark-bezel desktop monitor on a brushed-silver pedestal on a clean pale warm-gray desk; a complete black smartphone standing upright in the foreground at the right, overlapping just the lower-right monitor edge. Entire monitor including stand and entire phone visible, generous but not excessive margin, devices fill about 88% of the image width. Screen 1 fills the monitor naturally, desktop hero and navigation visible; screen 2 fills the phone naturally with its real mobile layout. Main German headline is 'Onebbau – Bau- und Handwerksleistungen in Halle (Saale)'; orange button 'Kostenlose Beratung anfragen'. Prefer preserving the provided actual screen images to inventing UI. Quiet softly lit architectural studio background, off-white on left blending to warm light-gray on right, subtle realistic device reflections, soft daylight from left, delicate contact shadows, polished expensive product photography, very crisp edges. Balanced and legible when displayed as a small 3:2 project thumbnail. No other objects, no extra floating panels, no charts, no badges, no percentage growth numbers, no stars, no fabricated results, no text outside the device screens, no watermarks. Do not change the identity of the Onebbau site.
```

## Validation

HTTP checks on the owner's localhost:3000 confirm the new WebP returns 200,
all three localized project indexes reference it. The first index-only revision
passed sequential typecheck, lint and the production Webpack build (250 pages).
Detail-page follow-up evidence is saved under
`docs/audits/2026-11-25-onebbau-detail-mockup-*`; index browser evidence is under
`docs/audits/2026-11-25-onebbau-mockup-*`.

Final detail revision: sequential `npm run typecheck`, `npm run lint` and
`npm run build` all exited 0 (Webpack, 250 static pages). Localized detail
GETs return 200 and contain the mockup plus both actual gallery captures.
Browser 1280/390 checks confirm loaded cover, 3:2 container and no horizontal
overflow. Own tab25 closed and viewport reset; owner's dev PID22852/3000
preserved. No task server or temporary files were created.

Assessment: better visual consistency with the existing monitor/phone covers;
this is not a measured SEO, conversion or performance improvement.
Changes remain local without commit, push, CMS write or deployment.
