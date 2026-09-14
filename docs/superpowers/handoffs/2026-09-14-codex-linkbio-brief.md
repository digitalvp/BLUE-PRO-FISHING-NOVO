# Codex Handoff — BLUE PRO FISHING Link Bio Native Continuation

## Start here

Worktree expected:

`C:\Users\JM\Meus sites\Blue Pro Fishing\BLUE-PRO-CODEX-linkbio-v2`

Branch: `linkbio-v2`  
Remote tracking: `origin/linkbio-v2`

Before editing:

```powershell
git fetch origin
git status --short --branch
git rev-parse HEAD
git diff --check
```

Read, in order:

1. `AGENTS.md`
2. `docs/superpowers/specs/2026-09-14-linkbio-native-continuation-design.md`
3. `docs/superpowers/plans/2026-09-14-linkbio-native-continuation.md`
4. `docs/superpowers/qa/2026-09-14-linkbio-acceptance.md`
5. root `index.html`
6. `linkbio/index.html`
7. `assets/css/linkbio.css`
8. `assets/js/script-core.js`
9. `assets/js/footer.js`

## Execution rule

Use `superpowers:subagent-driven-development` if multi-agent is available. Otherwise use `superpowers:executing-plans`. Implement the plan task-by-task, with tests before/after each task and reviewer checkpoints.

Do not redesign the canonical Home, touch `main`, merge, deploy production, alter Hostinger, invent assets/data, or remove unrelated files.

## Prepared asset target

The approved real facade must be converted without crop/stylization into:

- `/assets/img/linkbio/fachada-blue-pro-480.webp` — 480×720, <= 90 KB;
- `/assets/img/linkbio/fachada-blue-pro-768.webp` — 768×1152, <= 180 KB;
- `/assets/img/linkbio/fachada-blue-pro-1024.webp` — 1024×1536, <= 260 KB.

A prepared source package was produced during planning; if these files are not present after `git pull`, generate them from the exact approved facade source before Task 3. Do not substitute another facade image.

## First commands after reading docs

```powershell
node scripts/check-linkbio-parity.mjs
node scripts/check-linkbio-assets.mjs
```

`check-linkbio-parity.mjs` is expected to fail before native composition is implemented. `check-linkbio-assets.mjs` should pass only after the prepared derivatives are present. Do not weaken the checks to make them pass; make the implementation satisfy them.

## Completion evidence required

- automated gates all exit 0;
- screenshots at all seven target widths;
- reduced-motion screenshot/test;
- console/network notes;
- exact branch commit SHA;
- Vercel preview URL from `linkbio-v2` only;
- explicit statement that `main` and production were not changed.
