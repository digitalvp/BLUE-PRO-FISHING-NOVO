# BLUE PRO FISHING — Link Bio Native Continuation Design

**Date:** 2026-09-14  
**Branch:** `linkbio-v2`  
**Repository:** `digitalvp/BLUE-PRO-FISHING-NOVO`  
**Status:** Approved architecture; implementation pending

## Goal

Replace the current iframe-based Link Bio continuation with a native single-document experience that keeps the Blue Pro Fishing Home as the canonical source, preserves the validated content/order, improves first-fold usability, reduces media cost, and keeps the public site compatible with static hosting.

## Non-negotiable constraints

- Do not modify `main`, merge to `main`, deploy production, or touch Hostinger during implementation.
- Work only in the isolated `linkbio-v2` worktree/branch until explicit approval.
- Do not invent or replace brand data, copy, products, brands, contact data, URLs, legal data, videos, maps, or imagery.
- Use the original Blue Pro logo already in the repository.
- Use the real facade photo supplied by the user; preserve its 2:3 portrait proportion and content.
- No stretch, geometric distortion, aggressive crop, generative recreation, fake lighting, or brand alteration.
- Preserve the real Home sequence and content from the canonical root `index.html`.
- Final public output remains static HTML/CSS/JS/assets and must not require Node, Vercel runtime, SSR, a framework, or server-side includes.
- Respect `prefers-reduced-motion` across the Link Bio opening and all continued Home interactions.

## Source of truth

The root `index.html` is the canonical Home. The generated Link Bio continuation must consume that source rather than maintain a second manually edited copy of the Home.

Current canonical Home sequence to preserve:

1. shared header / navigation;
2. hero carousel;
3. hero benefits and WhatsApp CTA;
4. brands;
5. institutional video;
6. products/categories;
7. services/solutions;
8. about/gallery/Instagram;
9. FAQ;
10. contact/social/map;
11. shared footer;
12. floating WhatsApp action.

If the canonical `index.html` changes later, the generator must preserve its new order automatically. Do not hard-code a different editorial ordering in the Link Bio.

## Chosen architecture

### Build-time native composition

Use a small development-time generator that writes `linkbio/index.html` from two sources:

- a Link Bio opening template owned by `linkbio/`;
- canonical Home fragments read from root `index.html`.

The generated page is a normal static HTML document. No iframe, runtime fetch of `/`, or DOM cloning is permitted for the continuation.

### Why this architecture

It gives a single scroll/document, normal sticky positioning, normal navigation, SEO-visible content, deterministic initialization, and lower runtime complexity while preserving the Home as the canonical content source. It avoids the iframe's height synchronization, nested navigation, double viewport, eager duplicate document load, and blank-space regression.

## File boundaries

- `index.html`: canonical Home; only narrowly-scoped correctness fixes and non-rendering extraction markers are allowed if the generator requires them.
- `linkbio/template.html`: Link Bio-specific opening shell and insertion token for the canonical continuation.
- `linkbio/index.html`: generated deployable output; never hand-edit canonical Home content here.
- `assets/css/linkbio.css`: styles only Link Bio-owned opening/transition elements. All selectors must be scoped under `.linkbio-page` or another Link Bio root to prevent global leakage.
- `assets/js/linkbio.js`: Link Bio-only enhancement for stagger/reveal/scroll behavior. The page must remain usable without it.
- `scripts/generate-linkbio.mjs`: deterministic build-time composition.
- `scripts/check-linkbio-parity.mjs`: source-level guard that verifies native continuation and canonical section order.
- `scripts/check-linkbio-assets.mjs`: verifies responsive facade derivatives and file budgets.
- `assets/img/linkbio/`: optimized derivatives of the exact approved facade photo.

## First fold

The opening must contain, in this priority order:

- original Blue Pro logo;
- title: `A REFERÊNCIA` / `EM PESCA EM PALMAS`;
- category line: `Pesca • Náutica • Camping • Lazer`;
- real facade image;
- `Falar com Lucas` and `Falar com Cézar`;
- `Conheça a loja`;
- `Avaliar no Google`;
- Instagram, Facebook, YouTube and TikTok;
- `EXPLORE A BLUE ↓`.

There is no `Acessar o site` button. Scrolling is the transition into the canonical site.

### Responsive priority

The opening must not force the full facade image to consume nearly an entire mobile viewport before the contact actions. Preserve the full photo but reduce its displayed dimensions. The two WhatsApp actions should appear as early as practical without hiding or cropping the facade.

Targets:

- 320×740: Lucas/Cézar reachable with minimal initial scroll and no horizontal overflow.
- 375×812, 390×844, 430×932: contact actions should be visually prioritized and not start below approximately one full viewport solely because of the image.
- 768×1024: facade must not occupy ~800px of vertical space.
- 1024×768 and 1440×900: use a wider/asymmetric composition so title, image and actions fit coherently without phone-card appearance.

Do not use a fixed viewport-height layout that clips content on short devices.

## Facade media contract

Approved source photo is portrait 2:3. Generate and use responsive WebP derivatives with unchanged content:

- `assets/img/linkbio/fachada-blue-pro-480.webp` — 480×720, target <= 90 KB;
- `assets/img/linkbio/fachada-blue-pro-768.webp` — 768×1152, target <= 180 KB;
- `assets/img/linkbio/fachada-blue-pro-1024.webp` — 1024×1536, target <= 260 KB.

Use explicit `width`/`height`, `srcset`, `sizes`, `decoding="async"`, and `fetchpriority="high"` for the first-fold image. Use `object-fit: contain` only if the image is placed inside a constrained media box; do not crop it via `cover`.

## Animation contract

Normal mode sequence:

1. logo: opacity + small upward translation;
2. title/category copy;
3. facade: opacity + small upward translation, optional imperceptible scale <= 1.015;
4. Lucas;
5. Cézar;
6. store location;
7. Google review;
8. social icons;
9. Explore CTA.

Use approximately 60–100 ms stagger between action items and 450–700 ms durations. No scroll hijacking, flashing, gaming/neon treatment, large parallax, or permanent heavy animation. The Explore arrow may use a restrained loop.

With `prefers-reduced-motion: reduce`, all entrance transforms and autoplay/continuous motion controlled by this feature must stop; content is immediately visible. The preexisting About carousel must also stop autoplay in reduced-motion mode.

## Native continuation contract

The continuation must:

- be in the same document as the Link Bio opening;
- contain one canonical Home header/navigation, one Home main content flow, one footer and one floating WhatsApp action;
- not create duplicate IDs;
- not initialize global carousels/listeners twice;
- preserve existing product, brand, video, service, about, FAQ, contact and footer content;
- resolve all asset URLs correctly from `/linkbio/`;
- open real subpages normally rather than inside nested navigation;
- preserve sticky/fixed behavior in the outer document.

The generator may normalize relative `assets/...` URLs to root-relative `/assets/...` in the copied canonical fragment when required by `/linkbio/` path depth. External URLs remain unchanged.

## CSS isolation

`assets/css/linkbio.css` must not define unscoped global visual resets for `html`, `body`, `a`, `img`, `button`, `*`, headings or shared Home classes unless the rule is required and proven not to alter Home continuation behavior.

Prefer `.linkbio-page .linkbio-*` selectors. The canonical Home continues to use its existing global styles.

## Correctness fixes allowed in canonical Home

Only two current issues are in scope because they directly affect native integration:

1. fix the malformed closing structure in the institutional video section if validation confirms it;
2. make About carousel autoplay respect `prefers-reduced-motion`.

Do not refactor unrelated Home code during this feature.

## Metadata

Restore Link Bio-specific Open Graph/Twitter metadata in the generated `<head>`. Do not fabricate a social image. Use an existing real Blue Pro image that is already approved for sharing, or omit image metadata until an approved social image exists.

## Performance requirements

- Remove iframe eager loading and iframe resize observers/timeouts.
- Responsive facade source should be <= 260 KB at its largest prepared size.
- Reserve image dimensions to reduce layout shift.
- Do not eagerly start media that is well below the fold solely because Link Bio loaded.
- Preserve existing lazy loading where present.
- No additional framework or runtime dependency.
- Generated static output must work on Vercel preview and plain static Hostinger hosting.

The large hero and About gallery files are a separate optimization surface. This feature may improve loading attributes/pathing when directly required, but must not recompress or replace unrelated canonical media without a separate, verified asset task.

## Acceptance tests

Automated source checks must verify at minimum:

- `linkbio/index.html` contains no `<iframe`;
- no runtime `fetch('/')` or equivalent Home DOM clone is used for continuation;
- canonical section IDs appear in the same order as root Home;
- `#inicio`, `#marcas`, `#video`, `#produtos`, `#servicos`, `#sobre`, `#faq`, `#contato` occur once in generated Link Bio output;
- Lucas, Cézar, Maps and direct Google Review URLs remain exact;
- responsive facade assets exist and respect byte budgets;
- generated Link Bio uses responsive facade `srcset` and explicit intrinsic dimensions;
- `git diff --check` passes;
- relevant JS passes `node --check`.

Browser QA must cover 320, 375, 390, 430, 768, 1024 and 1440 widths, plus reduced-motion mode. Capture screenshots for each target, inspect console/network, test scroll, links, header, carousels, FAQ, map/video embeds, subpage navigation and floating WhatsApp.

## Explicit non-goals

- Redesigning the canonical Home.
- Replacing or inventing Blue Pro brand assets.
- E-commerce implementation.
- Global SEO overhaul.
- Merging cleanup branch work.
- Hostinger production deployment.
- Reorganizing unrelated JavaScript/CSS.

## Rollback

All work remains isolated on `linkbio-v2`. Before final promotion, keep a pre-native-composition branch/tag or commit reference. A rollback is simply restoring the previous `linkbio/index.html`, `linkbio.css`, and Link Bio-specific generator assets; `main` remains untouched until explicit approval.
