# Blue Pro Link Bio Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar a Home antiga incorporada em `/linkbio/` por uma experiência exclusiva da Blue Pro Fishing, usando apenas ativos oficiais, sem e-commerce.

**Architecture:** A primeira dobra da Link Bio continua no `template.html`. A continuação passa a vir de `linkbio/experience.html`, estilizada por `assets/css/linkbio-experience.css` e melhorada por `assets/js/linkbio-experience.js`. O gerador deixa de copiar o `index.html` canônico e injeta a experiência própria no token `BLUE_HOME_CONTINUATION`.

**Tech Stack:** HTML semântico, CSS responsivo, JavaScript vanilla, GitHub Actions, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-14-linkbio-experience-design.md`

## Global Constraints

- Trabalhar apenas em `linkbio-v2`.
- Não alterar `main`.
- Não implementar preço, carrinho, checkout ou estoque.
- Usar somente ativos, telefones e URLs oficiais já presentes no projeto.
- WhatsApp é o destino comercial dos cards de equipamentos.
- Respeitar `prefers-reduced-motion`.

---

### Task 1: Criar a continuação exclusiva

**Files:**
- Create: `linkbio/experience.html`

**Interfaces:**
- Consumes: assets oficiais sob `/assets/...`.
- Produces: fragmento HTML injetável pelo gerador.

- [ ] **Step 1:** Criar as seções `explore-blue`, `categorias`, `equipamentos`, `viva-blue`, `loja`, `especialistas`, `blue-na-agua` e `contato-blue`.
- [ ] **Step 2:** Usar URLs oficiais de WhatsApp/Maps/YouTube.
- [ ] **Step 3:** Garantir que não existam preço, carrinho ou estoque.
- [ ] **Step 4:** Validar HTML gerado visualmente no preview.

### Task 2: Implementar identidade visual azul/branco

**Files:**
- Create: `assets/css/linkbio-experience.css`

**Interfaces:**
- Consumes: classes `bp-*` do fragmento.
- Produces: dobras alternadas, grids, cards e carrossel responsivo.

- [ ] **Step 1:** Criar tokens de cor alinhados à Link Bio atual.
- [ ] **Step 2:** Implementar hero azul/fotográfico e carrossel de marcas.
- [ ] **Step 3:** Implementar dobras brancas de categorias/equipamentos/loja/conteúdo.
- [ ] **Step 4:** Implementar dobras azuis de lifestyle/especialistas/CTA final.
- [ ] **Step 5:** Adicionar breakpoints mobile/tablet/desktop e `prefers-reduced-motion`.

### Task 3: Adicionar interações progressivas

**Files:**
- Create: `assets/js/linkbio-experience.js`

**Interfaces:**
- Consumes: `[data-bp-brand-track]`, `[data-bp-menu]`, âncoras internas.
- Produces: carrossel contínuo acessível e menu mobile.

- [ ] **Step 1:** Implementar menu mobile sem dependências.
- [ ] **Step 2:** Duplicar marcas para loop visual apenas quando JS estiver ativo.
- [ ] **Step 3:** Pausar animação em foco/hover e quando redução de movimento estiver ativa.
- [ ] **Step 4:** Rodar `node --check assets/js/linkbio-experience.js`.

### Task 4: Trocar o gerador para a nova experiência

**Files:**
- Modify: `linkbio/template.html`
- Modify: `scripts/generate-linkbio.mjs`
- Modify: `.github/workflows/linkbio-generate.yml`

**Interfaces:**
- Consumes: `linkbio/experience.html`.
- Produces: `linkbio/index.html`.

- [ ] **Step 1:** Carregar CSS/JS da experiência no template.
- [ ] **Step 2:** Alterar `Explore a Blue` para `#explore-blue`.
- [ ] **Step 3:** Fazer o gerador ler `linkbio/experience.html` em vez do body da Home canônica.
- [ ] **Step 4:** Adicionar os novos arquivos aos paths do workflow.
- [ ] **Step 5:** Executar o gerador e confirmar que a Home antiga não aparece mais.

### Task 5: Atualizar guardas e validar preview

**Files:**
- Modify: `scripts/check-linkbio-parity.mjs`

**Interfaces:**
- Consumes: `linkbio/index.html` gerado.
- Produces: falha de CI quando a nova estrutura ou URLs oficiais estiverem ausentes.

- [ ] **Step 1:** Trocar a checagem de paridade com a Home por checagem da nova estrutura própria.
- [ ] **Step 2:** Manter verificação da fachada responsiva e URLs oficiais.
- [ ] **Step 3:** Verificar ausência de termos/controles de e-commerce.
- [ ] **Step 4:** Confirmar workflow verde.
- [ ] **Step 5:** Abrir o deployment READY e fazer QA visual no Opera.
