# Link Bio Editorial Oficial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a Home pós-Link Bio em uma vitrine editorial premium usando somente identidade e fotografias oficiais já existentes.

**Architecture:** A primeira dobra da Link Bio permanece intacta. `linkbio/experience.html` define a nova experiência; `assets/css/linkbio-experience.css` concentra o sistema visual; `assets/js/linkbio-experience.js` mantém apenas menu, marquee e navegação suave. `scripts/generate-linkbio.mjs` continua compondo `linkbio/index.html` automaticamente.

**Tech Stack:** HTML5, CSS3, JavaScript vanilla, GitHub Actions, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-15-linkbio-editorial-oficial-design.md`

## Global Constraints
- Trabalhar somente na branch `linkbio-v2`.
- Não alterar `main`.
- Não usar imagens geradas por IA na experiência nova.
- Usar logo oficial e fotos reais já existentes no repositório/Drive.
- Não adicionar e-commerce, preço, estoque, compra, carrinho ou checkout.
- Preservar URLs oficiais de WhatsApp, Maps, avaliação e YouTube.

---

### Task 1: Guardas de conteúdo oficial

**Files:**
- Modify: `scripts/check-linkbio-parity.mjs`

**Interfaces:**
- Consumes: `linkbio/index.html` gerado.
- Produces: falha de CI se a experiência não usar assets oficiais mínimos ou se referenciar imagem “ChatGPT Image”.

- [ ] **Step 1: Write the failing test**
Adicionar verificações exigindo `logo-blue-pro-mescla.svg`, `DSC09357.jpg`, `DSC09379.jpg`, `DSC09403.jpg`, `DSC09481.jpg` e proibindo `ChatGPT Image`.

- [ ] **Step 2: Run test to verify it fails**
Run: `node scripts/check-linkbio-parity.mjs`
Expected: FAIL enquanto a experiência antiga não contiver todos os assets oficiais exigidos.

- [ ] **Step 3: Commit**
`git commit -m "test(linkbio): exige assets oficiais na experiencia"`

### Task 2: Reescrever a experiência editorial

**Files:**
- Modify: `linkbio/experience.html`

**Interfaces:**
- Consumes: assets oficiais já presentes em `assets/`.
- Produces: seções `explore-blue`, `categorias`, `equipamentos`, `viva-blue`, `loja`, `especialistas`, `blue-na-agua`, `contato-blue` na ordem validada pelo CI.

- [ ] **Step 1: Implement minimal HTML that satisfies the design**
Criar header, hero real, faixa de marcas, categorias fotográficas, bloco editorial azul, equipamentos sem e-commerce, loja/galeria, conteúdo/YouTube, atendimento textual e footer.

- [ ] **Step 2: Run test**
Run: `node scripts/generate-linkbio.mjs && node scripts/check-linkbio-parity.mjs`
Expected: PASS.

- [ ] **Step 3: Commit**
`git commit -m "feat(linkbio): refaz experiencia com conteudo oficial"`

### Task 3: Sistema visual editorial

**Files:**
- Modify: `assets/css/linkbio-experience.css`

**Interfaces:**
- Consumes: classes do novo `experience.html`.
- Produces: layout responsivo azul/branco, grids assimétricos, tratamento fotográfico e foco visível.

- [ ] **Step 1: Implement CSS**
Substituir o visual de cards genéricos por composição editorial, reduzir raios/sombras, limitar títulos, alternar azul/branco e priorizar fotografia.

- [ ] **Step 2: Verify syntax/source guards**
Run: `node scripts/check-linkbio-parity.mjs && node scripts/check-linkbio-assets.mjs && node --check assets/js/linkbio-experience.js && git diff --check`
Expected: PASS.

- [ ] **Step 3: Commit**
`git commit -m "style(linkbio): aplica visual editorial oficial"`

### Task 4: QA em preview

**Files:**
- Verify only.

**Interfaces:**
- Consumes: deployment automático da branch `linkbio-v2`.
- Produces: confirmação visual e funcional desktop.

- [ ] **Step 1: Confirm GitHub Actions success**
Verificar `Generate Link Bio` com todos os passos verdes.

- [ ] **Step 2: Confirm Vercel READY**
Abrir o deployment do commit gerado.

- [ ] **Step 3: Visual QA**
Conferir primeira dobra preservada, transição para hero editorial, marcas, categorias, loja, conteúdo e atendimento; testar âncoras principais.

- [ ] **Step 4: Verify main unchanged**
Ler SHA da branch `main` e confirmar que não mudou por esta implementação.
