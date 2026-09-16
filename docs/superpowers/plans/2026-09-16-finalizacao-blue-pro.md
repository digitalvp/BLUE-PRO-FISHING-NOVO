# BLUE PRO FISHING Finalização Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Levar a BLUE PRO FISHING da base aprovada atual ao fechamento técnico, executando somente mudanças comprovadamente seguras, preservando integralmente Home, Náutica, Campos, Pesca e demais áreas aprovadas.

**Architecture:** O trabalho acontece na branch `finalizacao/blue-pro-2026-09`, usando `backup/base-aprovada-2026-09-16` como referência imutável. Cada lote deve produzir evidência objetiva, Preview Vercel e comparação contra a base antes de qualquer promoção para `main`; dados ou fotos ausentes permanecem registrados como bloqueio em vez de serem inventados.

**Tech Stack:** HTML estático, CSS, JavaScript/Node.js para scripts de manutenção e QA, GitHub, Vercel, Google Drive e navegador Opera para validação visual.

**Spec:** `docs/superpowers/specs/2026-09-16-finalizacao-segura-blue-pro-design.md`

## Global Constraints

- BASE APROVADA: commit `02b9ffda33e116d022c122c9a5f798d295085e85` e deployment Vercel `dpl_ModnwLesYC5X6BNVB5hGohMeeex3`.
- Branch congelada: `backup/base-aprovada-2026-09-16`; nunca receber novos commits.
- Branch de execução: `finalizacao/blue-pro-2026-09`; não implementar lotes diretamente em `main`.
- Home, Náutica, Campos, Pesca e qualquer outra área aprovada não podem ter texto, imagem, CTA, ordem, layout ou comportamento visível alterados sem autorização explícita.
- Alterações em `assets/css/style.css`, `assets/css/editorial.css`, `assets/css/footer.css`, `assets/js/script-core.js` e `assets/js/footer.js` são consideradas de alto risco por serem compartilhadas.
- `/linkbio/` e `/links/` permanecem independentes; não decidir nem remover uma das versões antes da escolha do cliente.
- PR #3 permanece sem merge até autorização explícita.
- Nunca substituir fotos, nomes de produtos, modelos de embarcação, informações sazonais ou regulatórias por conteúdo inferido. Material ausente deve continuar marcado como pendente.
- `00 - Backup original` do Drive é imutável.
- O domínio `blue-pro-fishing.vercel.app` pertence ao projeto antigo de outro desenvolvedor e não faz parte desta execução.
- Um lote só pode ser promovido depois de verificação técnica, Preview Vercel e comparação com a base congelada.

---

### Task 1: Guard de integridade da BASE APROVADA

**Files:**
- Create: `docs/qa/protected-baseline-2026-09-16.json`
- Create: `scripts/check-protected-baseline.mjs`
- Preserve: `index.html`
- Preserve: `pesca-camping-acessorios-palmas-to/index.html`
- Preserve: `embarcacoes-nautica-palmas-to/index.html`
- Preserve: `camping-pesca-palmas-to/index.html`
- Preserve: `assets/css/style.css`
- Preserve: `assets/css/editorial.css`
- Preserve: `assets/css/footer.css`
- Preserve: `assets/js/script-core.js`
- Preserve: `assets/js/footer.js`

**Interfaces:**
- Consumes: Git blob SHA dos arquivos no commit base `02b9ffda33e116d022c122c9a5f798d295085e85`.
- Produces: comando `node scripts/check-protected-baseline.mjs` que encerra com código 0 somente quando os arquivos protegidos continuam byte a byte iguais à base.

- [ ] **Step 1: Gravar manifesto da base protegida**

Criar JSON com `baselineCommit`, `baselineDeployment` e mapa `path -> gitBlobSha` para os nove arquivos congelados.

- [ ] **Step 2: Implementar verificador independente de Git CLI**

O script deve ler cada arquivo, calcular o SHA-1 no formato de objeto Git (`sha1("blob " + byteLength + "\0" + bytes)`) e comparar com o manifesto. Se houver arquivo ausente ou SHA diferente, imprimir `PROTECTED_BASELINE_FAIL` com os caminhos e terminar com `process.exitCode = 1`; caso contrário imprimir `PROTECTED_BASELINE_PASS`.

- [ ] **Step 3: Validar o algoritmo em fixture local**

Executar um teste temporário com um arquivo conhecido e comparar o SHA produzido pelo algoritmo com um SHA Git calculado para o mesmo conteúdo. O teste precisa falhar depois de modificar um byte e passar ao restaurar.

- [ ] **Step 4: Verificar a branch pelo GitHub**

Comparar `backup/base-aprovada-2026-09-16` com `finalizacao/blue-pro-2026-09`. Os nove arquivos protegidos não podem aparecer entre os arquivos modificados.

- [ ] **Step 5: Commit lógico**

Mensagem: `test: protege base aprovada contra regressao`.

### Task 2: Auditoria factual das pendências e materiais

**Files:**
- Create: `docs/qa/pending-materials-2026-09-16.md`
- Read only: `FOTOS-DAS-PAGINAS.md`
- Read only: `scripts/atualizar-fotos-paginas.mjs`
- Read only: pastas sob `assets/img/paginas/`
- Read only: Google Drive `03 - Fotos e vídeos` e `04 - Materiais do cliente`.

**Interfaces:**
- Consumes: arquivos reais do repositório e materiais oficiais localizáveis no Drive.
- Produces: inventário separando `disponível e identificável`, `placeholder técnico`, `ausente` e `depende de decisão do cliente`.

- [ ] **Step 1: Inventariar os slots de fotos existentes**

Usar exatamente os dez slots definidos em `scripts/atualizar-fotos-paginas.mjs`: pesca; iscas-linhas-acessorios; oculos-vestuario; camping; modelo-01; modelo-02; modelo-03; caiaques; garmin; manutencao.

- [ ] **Step 2: Conferir o repositório**

Para cada slot, registrar se há JPG/JPEG/PNG/WEBP real ou somente `.gitkeep`/fallback. Não tratar imagens do catálogo de demonstração como comprovação de produto disponível.

- [ ] **Step 3: Conferir o Drive oficial**

Pesquisar os materiais por assunto e só considerar utilizável quando o arquivo puder ser associado sem ambiguidade ao slot correspondente. Arquivo genérico ou gerado por IA não substitui foto real pedida pelo briefing.

- [ ] **Step 4: Registrar bloqueios sem editar páginas aprovadas**

Os blocos que continuarem sem foto/texto/modelo real permanecem como pendência. Não rodar `atualizar-fotos-paginas.mjs` se isso alterar uma página que está congelada sem autorização específica.

- [ ] **Step 5: Commit lógico**

Mensagem: `docs: inventaria materiais pendentes da finalizacao`.

### Task 3: Infraestrutura de QA sem alteração visual

**Files:**
- Create: `scripts/qa-static.mjs`
- Preserve: arquivos HTML/CSS/JS de produção.

**Interfaces:**
- Consumes: árvore estática do projeto.
- Produces: relatório de validação estrutural executável com Node sem navegador.

- [ ] **Step 1: Implementar scanner de rotas públicas**

O scanner deve validar existência de `index.html`, `pesca-camping-acessorios-palmas-to/index.html`, `embarcacoes-nautica-palmas-to/index.html`, `camping-pesca-palmas-to/index.html`, `politica-de-privacidade/index.html`, `termos-de-uso/index.html`, `linkbio/index.html`, `links/index.html` e `links/source.html`.

- [ ] **Step 2: Validar referências locais determinísticas**

Extrair `src`, `href`, `url(...)` e arquivos locais referenciados. Ignorar URLs externas `http:`, `https:`, `mailto:`, `tel:`, `wa.me`, hashes internos e `data:`. Para cada caminho local, confirmar arquivo de destino quando determinável estaticamente.

- [ ] **Step 3: Detectar riscos conhecidos**

Falhar em referência pública a `localhost`, `127.0.0.1`, caminho absoluto de máquina local ou arquivo inexistente. Reportar separadamente dependências de `vercel.app`/`github.com` sem automaticamente alterar conteúdo.

- [ ] **Step 4: Verificar HTML mínimo**

Cada rota pública deve ter exatamente um `<h1>` ou, no caso de `/links/`, seguir sua estrutura atual documentada sem impor remodelagem; todas devem ter `<title>` e `meta viewport`.

- [ ] **Step 5: Rodar o guard da Task 1 junto com o scanner**

Comandos:

```bash
node scripts/check-protected-baseline.mjs
node scripts/qa-static.mjs
```

Esperado antes de avançar: ambos encerram com código 0.

- [ ] **Step 6: Commit lógico**

Mensagem: `test: adiciona auditoria estatica do site`.

### Task 4: SEO técnico seguro e dependente do domínio

**Files:**
- Potential Create: `robots.txt`
- Potential Create: `sitemap.xml`
- Do not modify protected HTML merely para reescrever canonical/OG.

**Interfaces:**
- Consumes: lista real de rotas públicas e definição do domínio de publicação final.
- Produces: SEO técnico que não altera texto ou layout aprovado.

- [ ] **Step 1: Auditar estado atual**

Confirmar que `robots.txt` e `sitemap.xml` não existem antes de criá-los e registrar canonicals/OG relativos já presentes no HTML.

- [ ] **Step 2: Não inventar domínio definitivo**

Enquanto o domínio final da publicação definitiva não estiver confirmado, não converter canonicals/OG relativos em URLs absolutas e não gerar sitemap com hostname assumido.

- [ ] **Step 3: Preparar `robots.txt` somente se a política de indexação estiver clara**

Quando aplicável, permitir páginas públicas e manter `/e-commerce-teste/` fora de indexação. Não publicar regra que exponha demonstração ou force indexação do ambiente temporário contra a estratégia final.

- [ ] **Step 4: Gerar sitemap apenas após hostname final confirmado**

Incluir somente Home, as três páginas editoriais aprovadas, Política e Termos e a versão de Link Bio escolhida para indexação. Não listar `/e-commerce-teste/`; não listar simultaneamente `/linkbio/` e `/links/` enquanto o cliente ainda não escolheu a versão definitiva.

- [ ] **Step 5: Reexecutar guard e QA estático**

Qualquer alteração que toque arquivo protegido cancela este lote.

### Task 5: Produtos, categorias e WhatsApp sem inventar catálogo

**Files:**
- Read only até haver dados exatos: `assets/img/produtos/`
- Read only: `e-commerce-teste/index.html`
- Potential Create: documentação/inventário de catálogo, nunca publicação de nomes inventados.

**Interfaces:**
- Consumes: produto real identificável por nome/foto/categoria em material oficial.
- Produces: itens aptos a futura publicação com mensagem de WhatsApp específica.

- [ ] **Step 1: Separar placeholder de produto real**

Imagens duplicadas/placeholder não contam como catálogo real, mesmo que o nome do arquivo sugira categoria.

- [ ] **Step 2: Construir inventário somente com fatos comprovados**

Para cada item publicável exigir: nome exato, categoria, foto correspondente e vendedor/número ou regra comercial já documentada.

- [ ] **Step 3: Gerar mensagem de WhatsApp somente a partir do item comprovado**

Formato operacional: `Olá! Vi [nome exato do item] no site da Blue Pro Fishing e gostaria de mais informações.`. Não incluir preço, estoque, especificação ou disponibilidade sem fonte.

- [ ] **Step 4: Não transformar a demonstração em e-commerce real**

`/e-commerce-teste/` continua isolado/noindex até decisão explícita. Não criar checkout, carrinho ou preço por inferência.

### Task 6: Link Bio — manter as duas opções estáveis

**Files:**
- Preserve: `linkbio/`
- Preserve: `links/`
- Preserve: `links/source.html`

**Interfaces:**
- Consumes: decisão futura do cliente entre as duas versões.
- Produces: evidência comparativa, sem escolher pelo cliente.

- [ ] **Step 1: Verificar HTTP/estrutura das duas rotas no Preview**

Rotas: `/linkbio/` e `/links/`.

- [ ] **Step 2: Verificar assets e links principais**

Confirmar imagens, WhatsApp, Google Review já configurado, redes e navegação sem 404.

- [ ] **Step 3: Preservar isolamento**

Não refatorar `/links/` para remover o loader `source.html` nesta finalização enquanto a versão ainda estiver em avaliação, salvo erro funcional comprovado.

- [ ] **Step 4: Manter PR #3 sem merge**

Nenhuma ação de merge faz parte deste plano.

### Task 7: Preview Vercel e QA visual/funcional

**Files:**
- No production file change required para iniciar.
- Evidence: registrar deployment/URLs e resultado no histórico do projeto.

**Interfaces:**
- Consumes: head aprovado da `finalizacao/blue-pro-2026-09`.
- Produces: Preview Vercel validado antes de qualquer promoção.

- [ ] **Step 1: Identificar o deployment da branch**

Listar deployments do projeto `prj_96BMKMadYnw6147ZPaeLMC0VUA6O` e selecionar o que tiver `githubCommitRef=finalizacao/blue-pro-2026-09` e o SHA atual da branch.

- [ ] **Step 2: Exigir estado READY**

Se o deployment falhar, ler build logs e corrigir na branch. Não promover.

- [ ] **Step 3: Verificar rotas essenciais**

No Preview, validar Home, três páginas editoriais, Política, Termos, `/linkbio/` e `/links/`.

- [ ] **Step 4: QA visual em quatro larguras de referência**

Validar pelo menos 390, 768, 1366 e 1440 px. Conferir overflow horizontal, imagens quebradas, menu, footer, CTA/WhatsApp e console. Se o conector não permitir uma largura específica, registrar a limitação sem declarar que aquele viewport passou.

- [ ] **Step 5: Comparar arquivos congelados com a BASE APROVADA**

Rodar `node scripts/check-protected-baseline.mjs` quando o ambiente local estiver disponível e, independentemente disso, usar comparação GitHub entre a branch backup e a branch de finalização. Qualquer mudança inesperada em arquivo congelado bloqueia promoção.

### Task 8: Limpeza técnica segura

**Files:**
- Modify/Delete somente arquivos provadamente não referenciados.
- Never mass-delete `assets/` sem prova de ausência de referência.

**Interfaces:**
- Consumes: relatório do `qa-static.mjs` e busca de referências no repositório.
- Produces: redução de lixo técnico sem mudança perceptível no site.

- [ ] **Step 1: Auditar duplicados e arquivos pesados**

Listar candidatos, tamanho, SHA e referências. Arquivos usados pela base aprovada ficam fora do lote, mesmo que grandes.

- [ ] **Step 2: Exigir prova dupla antes de remover**

Um arquivo só pode ser removido quando não houver referência em HTML/CSS/JS/JSON e quando sua remoção não alterar o resultado das rotas do Preview.

- [ ] **Step 3: Reexecutar QA estático, guard e Preview**

Se surgir 404, imagem quebrada ou diferença em página congelada, reverter o candidato específico.

- [ ] **Step 4: Commit lógico por grupo pequeno**

Mensagem deve identificar exatamente o grupo removido; não usar um commit gigante para limpeza heterogênea.

### Task 9: Promoção e pós-deploy

**Files:**
- No file edit required; operação de versionamento/deploy.

**Interfaces:**
- Consumes: lote com evidência técnica e visual aprovada.
- Produces: `main` atualizada somente com lote seguro e registro de rollback.

- [ ] **Step 1: Comparar `main` com a branch antes da promoção**

Confirmar que não entrou mudança externa inesperada desde o início do lote. Se `main` avançou, reconciliar fora de produção antes de continuar.

- [ ] **Step 2: Confirmar arquivos congelados**

Nenhum dos nove arquivos protegidos pode ter SHA diferente da base, exceto se houver autorização explícita do usuário para uma mudança específica.

- [ ] **Step 3: Promover somente o lote validado**

Usar fast-forward quando possível; nunca force push em `main`.

- [ ] **Step 4: Confirmar Vercel Production READY e SHA associado**

O deployment de produção deve apontar ao commit promovido.

- [ ] **Step 5: Pós-deploy no domínio público**

Repetir as rotas essenciais e verificar que `/linkbio/` e `/links/` continuam acessíveis até decisão do cliente.

- [ ] **Step 6: Registrar no Drive**

Adicionar registro cronológico ao `Resumo de Alterações — Continuação 02` com: arquivos alterados, commit, deployment, testes realmente executados, limitações e bloqueios de material.

## Ordem de execução

Executar Tasks 1–3 primeiro porque criam as travas objetivas. Em seguida executar auditorias das Tasks 4–6 e somente aplicar mudanças quando houver dados suficientes e nenhuma violação do escopo congelado. Task 7 é obrigatória para qualquer lote publicável; Task 8 vem depois de a árvore estar mapeada; Task 9 só acontece para lotes que passem integralmente pelas verificações.

## Estado esperado ao final

O projeto deve terminar com a versão atualmente aprovada preservada, ferramentas de proteção e QA versionadas, pendências de material claramente separadas de pendências técnicas, Link Bio preservada em ambas as opções até decisão do cliente e nenhum conteúdo comercial inventado. O que depender exclusivamente de foto, nome de modelo, texto aprovado ou decisão final do cliente permanece explicitamente bloqueado em vez de ser mascarado como concluído.
