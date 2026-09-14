# Link Bio Native Continuation — QA Acceptance Matrix

## Automated gates

Run from repository root:

```bash
node scripts/check-linkbio-parity.mjs
node scripts/check-linkbio-assets.mjs
node --check assets/js/script-core.js
node --check assets/js/footer.js
node --check assets/js/linkbio.js
git diff --check
```

All commands must exit 0 before a preview is called ready for review.

## Visual/browser matrix

| Viewport | Opening | Actions | Continuation | Header | Carousels | Overflow |
| --- | --- | --- | --- | --- | --- | --- |
| 320×740 | pending | pending | pending | pending | pending | pending |
| 375×812 | pending | pending | pending | pending | pending | pending |
| 390×844 | pending | pending | pending | pending | pending | pending |
| 430×932 | pending | pending | pending | pending | pending | pending |
| 768×1024 | pending | pending | pending | pending | pending | pending |
| 1024×768 | pending | pending | pending | pending | pending | pending |
| 1440×900 | pending | pending | pending | pending | pending | pending |

For every viewport capture:

- top of Link Bio after entrance settles;
- first contact actions;
- transition into Home;
- one mid-page section;
- bottom/footer.

## Interaction checks

- Lucas WhatsApp opens the exact Lucas URL.
- Cézar WhatsApp opens the exact Cézar/general URL.
- Store location opens the existing Maps URL.
- Google Review opens the direct review URL.
- Instagram, Facebook, YouTube and TikTok use existing official URLs.
- `Explore a Blue` scrolls to the native continuation.
- Header navigation operates in the single document.
- Hero previous/next/dots work once, without duplicate listeners.
- Product carousel works.
- About carousel works in normal mode and does not autoplay with reduced motion.
- FAQ details open/close.
- Service links navigate to normal top-level subpages, not nested Link Bio content.
- Floating WhatsApp is present once.
- Footer is present once.

## Console/network checks

Reject preview if any feature-owned JavaScript exception occurs, if first-party assets return 4xx/5xx, or if Link Bio loads `/` as an iframe/fetch purely to create the continuation.

Third-party telemetry noise must be recorded separately and not confused with first-party failure.

## Reduced motion

With `prefers-reduced-motion: reduce`:

- no hidden opening content;
- no entrance translate/scale sequence;
- no smooth-scroll requirement;
- no Explore arrow loop;
- no About carousel autoplay;
- manual controls remain usable.

## Performance evidence

Record facade source selected at 390 and 1440 widths. Confirm the largest facade derivative is <= 260 KB. Record layout-shift observations and verify the facade reserves intrinsic space before decode.

Do not publish a synthetic LCP/CLS number as production truth unless measured in a controlled production-like run.
