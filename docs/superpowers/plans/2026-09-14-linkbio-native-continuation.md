# Link Bio Native Continuation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Link Bio iframe continuation with a native, static, single-document experience that preserves the canonical Home while improving first-fold usability, animation, performance and maintainability.

**Architecture:** Keep root `index.html` as the canonical Home and generate `linkbio/index.html` at development/build time from a Link Bio opening template plus canonical Home fragments. Runtime contains no iframe, no fetch of `/` for DOM composition and no duplicate script initialization. Link Bio-specific CSS/JS stays scoped; canonical Home CSS/JS continues to power canonical sections.

**Tech Stack:** Static HTML5, CSS3, vanilla JavaScript, Node.js built-ins for generation/QA, existing Vercel preview, static Hostinger-compatible output.

**Spec:** `docs/superpowers/specs/2026-09-14-linkbio-native-continuation-design.md`

## Global Constraints

- Do not modify `main`, merge to `main`, deploy production or touch Hostinger.
- Work only on `linkbio-v2` until explicit approval.
- Preserve real Blue Pro data, copy, links, videos, brands, products and imagery.
- Use original logo and exact real facade photo derivatives prepared in `assets/img/linkbio/`.
- Final output must be static-host compatible and must not require Node at runtime.
- Root `index.html` remains canonical Home source.
- No iframe or runtime Home DOM fetch/clone for continuation.
- Respect `prefers-reduced-motion` in Link Bio and About carousel autoplay.
- Do not refactor unrelated Home code.

---

### Task 1: Lock source-level acceptance guards

**Files:**
- Test: `scripts/check-linkbio-parity.mjs`
- Test: `scripts/check-linkbio-assets.mjs`
- Read: `index.html`
- Read: `linkbio/index.html`

**Interfaces:**
- Consumes: current root Home and Link Bio source files.
- Produces: two zero-dependency Node commands that fail on iframe architecture, section-order drift, missing direct links or facade asset-budget regressions.

- [ ] **Step 1: Run the prepared failing parity guard**

```bash
node scripts/check-linkbio-parity.mjs
```

Expected before implementation: non-zero exit with at least `iframe is forbidden` because current `linkbio/index.html` embeds `/`.

- [ ] **Step 2: Run the prepared asset guard**

```bash
node scripts/check-linkbio-assets.mjs
```

Expected after prepared assets are present: exit 0 and printed byte sizes for 480/768/1024 WebP files. If this fails, do not change thresholds; inspect missing/corrupt assets.

- [ ] **Step 3: Record baseline git state**

```bash
git status --short --branch
git diff --check
```

Expected: only intentionally prepared docs/tests/assets differ from the previous branch tip; `git diff --check` exits 0.

- [ ] **Step 4: Commit the guardrail/preparation baseline if not already committed**

```bash
git add docs/superpowers scripts/check-linkbio-parity.mjs scripts/check-linkbio-assets.mjs assets/img/linkbio
git commit -m "chore(linkbio): prepara plano testes e assets responsivos"
```

Expected: one isolated preparation commit; no `main` movement.

---

### Task 2: Create deterministic Link Bio generator and template

**Files:**
- Create: `linkbio/template.html`
- Create: `scripts/generate-linkbio.mjs`
- Modify narrowly if required: `index.html`
- Generate: `linkbio/index.html`
- Test: `scripts/check-linkbio-parity.mjs`

**Interfaces:**
- Consumes: root `index.html`, `linkbio/template.html` token `<!-- BLUE_HOME_CONTINUATION -->`.
- Produces: CLI `node scripts/generate-linkbio.mjs`; deployable `linkbio/index.html` with native canonical continuation.

- [ ] **Step 1: Copy the current approved opening into a template and replace the iframe section with one insertion token**

`linkbio/template.html` must contain exactly one:

```html
<!-- BLUE_HOME_CONTINUATION -->
```

It must contain no `<iframe` and no runtime `fetch('/')`.

- [ ] **Step 2: Add narrow extraction markers to canonical Home only if deterministic extraction cannot be achieved safely without them**

Allowed non-rendering markers:

```html
<!-- LINKBIO_CANONICAL_START -->
...
<!-- LINKBIO_CANONICAL_END -->
```

Place them so the extracted content includes the shared Home header, main canonical content, footer and floating WhatsApp exactly once. Do not reorder or rewrite the enclosed content.

- [ ] **Step 3: Write generator with Node built-ins only**

Start from:

```js
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const HOME = path.join(ROOT, 'index.html');
const TEMPLATE = path.join(ROOT, 'linkbio', 'template.html');
const OUTPUT = path.join(ROOT, 'linkbio', 'index.html');
```

It must:

1. read Home/template as UTF-8;
2. extract canonical fragment deterministically;
3. convert fragment-local `href="assets/`, `src="assets/` and `srcset="assets/` references to root-relative `/assets/` where required;
4. preserve external URLs and root-relative URLs unchanged;
5. insert fragment at the single token;
6. fail if token or extraction markers occur zero or more than once;
7. write only when output content actually changes;
8. print `linkbio/index.html generated` on success.

- [ ] **Step 4: Generate output**

```bash
node scripts/generate-linkbio.mjs
```

Expected: exit 0; generated `linkbio/index.html` contains no iframe and contains canonical section IDs.

- [ ] **Step 5: Run parity guard**

```bash
node scripts/check-linkbio-parity.mjs
```

Expected: exit 0 for architecture/order/link invariants.

- [ ] **Step 6: Commit generator/template/output**

```bash
git add index.html linkbio/template.html linkbio/index.html scripts/generate-linkbio.mjs
git commit -m "feat(linkbio): gera continuacao nativa da home"
```

---

### Task 3: Rebuild first fold around early actions and responsive facade

**Files:**
- Modify: `linkbio/template.html`
- Modify: `assets/css/linkbio.css`
- Generate: `linkbio/index.html`
- Assets: `assets/img/linkbio/fachada-blue-pro-480.webp`, `fachada-blue-pro-768.webp`, `fachada-blue-pro-1024.webp`

**Interfaces:**
- Consumes: prepared facade derivatives and existing official URLs.
- Produces: first fold that keeps facade proportional while making contact actions materially earlier on mobile.

- [ ] **Step 1: Use responsive facade markup with intrinsic dimensions**

```html
<img
  src="/assets/img/linkbio/fachada-blue-pro-768.webp"
  srcset="/assets/img/linkbio/fachada-blue-pro-480.webp 480w,
          /assets/img/linkbio/fachada-blue-pro-768.webp 768w,
          /assets/img/linkbio/fachada-blue-pro-1024.webp 1024w"
  sizes="(max-width: 430px) min(76vw, 360px), (max-width: 768px) min(58vw, 440px), 520px"
  width="768"
  height="1152"
  alt="Fachada da Blue Pro Fishing em Palmas, Tocantins"
  fetchpriority="high"
  decoding="async">
```

Do not use `object-fit: cover` on this image.

- [ ] **Step 2: Scope all opening CSS**

Every new visual selector must start from `.linkbio-page` or a `.linkbio-*` class owned by the opening. Remove unscoped resets that alter canonical Home typography/layout after native continuation.

- [ ] **Step 3: Mobile composition**

For <= 430px:

- logo/title/categories;
- facade displayed at a constrained proportional width;
- Lucas + Cézar side-by-side when both labels fit at >= 390px; allow stack at narrower widths if needed;
- store/review actions immediately after;
- socials and Explore.

No fixed `100vh` clipping. No horizontal overflow at 320px.

- [ ] **Step 4: Tablet/desktop composition**

At >= 900px, use CSS grid with copy/actions and facade as separate columns. Avoid a narrow centered phone-card appearance. Keep opening visually compact enough that actions are visible at 1024×768 and Explore is reasonably near the first viewport at 1440×900.

- [ ] **Step 5: Regenerate and run guards**

```bash
node scripts/generate-linkbio.mjs
node scripts/check-linkbio-parity.mjs
node scripts/check-linkbio-assets.mjs
git diff --check
```

Expected: all exit 0.

- [ ] **Step 6: Commit first-fold implementation**

```bash
git add linkbio/template.html linkbio/index.html assets/css/linkbio.css
git commit -m "feat(linkbio): prioriza contatos e fachada responsiva"
```

---

### Task 4: Implement restrained entrance animation and reduced motion

**Files:**
- Create: `assets/js/linkbio.js`
- Modify: `linkbio/template.html`
- Modify: `assets/css/linkbio.css`
- Generate: `linkbio/index.html`

**Interfaces:**
- Consumes: elements annotated with `data-linkbio-enter` and optional `--linkbio-delay`.
- Produces: one enhancement script that adds `.is-linkbio-ready` once and never owns canonical Home carousels/listeners.

- [ ] **Step 1: Add declarative entrance hooks**

Opening-only elements receive `data-linkbio-enter` and CSS custom delay values. Canonical Home continuation must not receive these attributes during generation.

- [ ] **Step 2: Implement one-shot readiness script**

```js
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const reveal = () => document.documentElement.classList.add('is-linkbio-ready');
if (reduceMotion.matches) reveal();
else requestAnimationFrame(reveal);
```

No DOM cloning, Home fetch, interval, resize observer or carousel logic belongs in this file.

- [ ] **Step 3: Add CSS animation and reduced-motion override**

Normal: opacity 0 -> 1 and `translateY(18px)` -> 0 over 450–700ms using custom delays. Optional image scale must never exceed `1.015`.

```css
@media (prefers-reduced-motion: reduce) {
  .linkbio-page [data-linkbio-enter] {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .linkbio-page .linkbio-explore-arrow {
    animation: none;
  }
}
```

- [ ] **Step 4: Regenerate and syntax-check**

```bash
node scripts/generate-linkbio.mjs
node --check assets/js/linkbio.js
node scripts/check-linkbio-parity.mjs
git diff --check
```

Expected: all exit 0.

- [ ] **Step 5: Commit animation**

```bash
git add assets/js/linkbio.js assets/css/linkbio.css linkbio/template.html linkbio/index.html
git commit -m "feat(linkbio): adiciona entrada suave com reduced motion"
```

---

### Task 5: Fix only canonical Home correctness issues required by native integration

**Files:**
- Modify: `index.html` around institutional video closing structure
- Modify: `assets/js/script-core.js` around About carousel autoplay
- Generate: `linkbio/index.html`

**Interfaces:**
- Consumes: canonical Home behavior.
- Produces: valid section structure and reduced-motion-safe About carousel used by both `/` and `/linkbio/`.

- [ ] **Step 1: Confirm malformed video structure before editing**

Inspect the closing tags surrounding `section.video-presentation`. If the grid div is missing its close, add exactly the missing `</div>` before `</section>` and no unrelated markup changes.

- [ ] **Step 2: Make About autoplay honor the existing reduced motion query**

Where About carousel starts/restarts autoplay, guard interval creation with the existing `reducedMotionQuery.matches`. Manual previous/next/dot actions must remain functional.

- [ ] **Step 3: Syntax/source verification**

```bash
node --check assets/js/script-core.js
node scripts/generate-linkbio.mjs
node scripts/check-linkbio-parity.mjs
git diff --check
```

Expected: all exit 0.

- [ ] **Step 4: Manual direct-Home smoke test before Link Bio test**

Open `/` at desktop and mobile. Confirm hero, benefits, products, About, FAQ and header still work. With reduced motion, confirm About image does not auto-advance for at least 8 seconds while manual controls still work.

- [ ] **Step 5: Commit scoped correctness fixes**

```bash
git add index.html assets/js/script-core.js linkbio/index.html
git commit -m "fix(home): corrige markup e reduced motion exigidos pela linkbio"
```

---

### Task 6: Restore Link Bio metadata and remove obsolete runtime architecture

**Files:**
- Modify: `linkbio/template.html`
- Modify: `assets/js/footer.js` only if an obsolete Link Bio-specific compatibility block still exists and generated markup no longer needs it
- Review candidates only after proving unused: `assets/css/lb-*.css`, `assets/js/lb-*.js`
- Generate: `linkbio/index.html`

**Interfaces:**
- Produces: self-contained Link Bio head metadata and no legacy iframe/DOM-composition compatibility dependency.

- [ ] **Step 1: Add Link Bio-specific metadata to template head**

```html
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="Blue Pro Fishing • Palmas - TO">
<meta property="og:description" content="Contatos oficiais da Blue Pro Fishing e experiência completa da loja em Palmas - TO.">
<meta name="twitter:card" content="summary_large_image">
```

Only include `og:image`/`twitter:image` if the chosen URL references an existing approved real Blue Pro image. Do not create a fake social asset.

- [ ] **Step 2: Remove obsolete Link Bio review-button replacement only if template already contains the direct review anchor**

Keep `footer.js` year update. Do not remove shared footer behavior.

- [ ] **Step 3: Prove experimental `lb-*` files unused before deletion**

Run repository search for each `lb-*.css/js` filename. Delete only files with zero active HTML/JS/CSS references and no documented dependency. If any reference exists, leave the file and record it for later cleanup.

- [ ] **Step 4: Regenerate and verify**

```bash
node scripts/generate-linkbio.mjs
node scripts/check-linkbio-parity.mjs
node --check assets/js/footer.js
git diff --check
```

Expected: all exit 0.

- [ ] **Step 5: Commit metadata/legacy cleanup**

```bash
git add linkbio/template.html linkbio/index.html assets/js/footer.js assets/css assets/js
git commit -m "chore(linkbio): restaura metadata e remove legado comprovadamente inutilizado"
```

Review staged diff before committing to ensure no unrelated asset deletion entered the commit.

---

### Task 7: Browser QA across required viewports

**Files:**
- Use: `docs/superpowers/qa/2026-09-14-linkbio-acceptance.md`
- Evidence only: screenshot directory outside repo unless project conventions specify otherwise

**Interfaces:**
- Produces: reproducible visual/functional evidence; no feature code unless a failing case sends execution back to its owning task.

- [ ] **Step 1: Start local static server**

```bash
python -m http.server 8080
```

from repository root.

- [ ] **Step 2: Test 320×740, 375×812, 390×844, 430×932**

For each: capture top, actions, transition, mid-page and footer; verify no horizontal overflow; record whether Lucas/Cézar appear at an acceptable distance from top.

- [ ] **Step 3: Test 768×1024, 1024×768, 1440×900**

Verify no phone-card desktop composition, proportional facade, header behavior, native continuation, footer and Explore transition.

- [ ] **Step 4: Functional test**

Test exact quick-action links, header anchors, hero controls, products, About controls, FAQ, service subpage navigation and floating WhatsApp. Confirm service navigation leaves `/linkbio/` normally rather than nesting.

- [ ] **Step 5: Reduced-motion test**

Emulate reduced motion. Verify opening shows immediately, Explore arrow loop stops, About carousel does not auto-advance for >= 8 seconds, manual controls work.

- [ ] **Step 6: Console/network test**

Reject any feature-owned uncaught exception or first-party 4xx/5xx. Record third-party telemetry separately.

- [ ] **Step 7: Re-run automated gates**

```bash
node scripts/check-linkbio-parity.mjs
node scripts/check-linkbio-assets.mjs
node --check assets/js/linkbio.js
node --check assets/js/script-core.js
node --check assets/js/footer.js
git diff --check
```

Expected: all exit 0.

---

### Task 8: Vercel preview and final branch-only review

**Files:**
- No source changes unless QA discovers a concrete regression.

**Interfaces:**
- Produces: READY Vercel preview tied to `linkbio-v2` and an evidence summary; never production.

- [ ] **Step 1: Confirm branch isolation before push**

```bash
git branch --show-current
git status --short --branch
git log -1 --oneline
```

Expected branch: `linkbio-v2`.

- [ ] **Step 2: Push branch only**

```bash
git push origin linkbio-v2
```

Do not push `main`.

- [ ] **Step 3: Wait for Vercel preview READY and test `/linkbio/` on that deployment**

Repeat at minimum 390×844 and 1440×900 against preview. Confirm first-party network success and that preview commit SHA matches branch HEAD.

- [ ] **Step 4: Produce final review summary**

Report:

- branch HEAD SHA;
- preview URL;
- automated gate results;
- seven viewport results;
- reduced-motion result;
- facade selected asset/byte size at mobile and desktop;
- any known limitation;
- explicit `main unchanged / production unchanged` statement.

- [ ] **Step 5: STOP for user approval**

Do not merge, retarget production or prepare Hostinger deployment without explicit approval.
