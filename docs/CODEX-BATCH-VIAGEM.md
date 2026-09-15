# CODEX — LOTE SEGURO DE VIAGEM — BLUE PRO FISHING

Objetivo: avançar o máximo possível mesmo com internet instável, sem depender de arquivos locais e sem exigir confirmações entre microtarefas.

## Contexto obrigatório
- Repo: `digitalvp/BLUE-PRO-FISHING-NOVO`
- Branch: `linkbio-v2`
- Ler primeiro: `docs/CHECKPOINT-VIAGEM-2026-09-15.md`
- NÃO alterar `main`.
- NÃO redesenhar a experiência aprovada.
- NÃO inventar imagem, logo, produto, vendedor, endereço ou copy genérica.
- Usar somente assets oficiais já existentes no repositório/Drive.

## Regra de execução resiliente
Para cada item abaixo:
1. inspecionar o estado atual;
2. fazer a menor alteração necessária;
3. executar os checks relevantes;
4. `git diff --check`;
5. commit independente com mensagem clara;
6. continuar para o próximo item somente depois do commit.

Não agrupar tudo em um único commit. A meta é permitir retomada exata após qualquer queda de conexão.

## Lote A — Link Bio final
1. QA visual/responsivo em 320, 375, 390, 430, 768, 1024, 1366, 1440 e 1920 px.
2. Corrigir overflow horizontal, cortes de imagem ruins, quebras de título, alinhamentos e espaçamentos inconsistentes.
3. Conferir primeira dobra e continuação como uma experiência única.
4. Confirmar sequência cromática aprovada e contraste adequado.
5. Confirmar carrossel de marcas em loop contínuo, sem buraco e sem salto perceptível.
6. Confirmar menu sticky/mobile e navegação por âncoras.
7. Conferir hover/focus de todos os CTAs.
8. Conferir que WhatsApp é o único uso de verde.

## Lote B — Funcionalidade
1. Testar Lucas WhatsApp.
2. Testar Cézar WhatsApp.
3. Testar Maps/Como chegar.
4. Testar Avaliar no Google.
5. Testar Instagram, Facebook, YouTube e TikTok.
6. Verificar anchors internos e scroll suave.
7. Verificar menu mobile e Escape.
8. Verificar comportamento com `prefers-reduced-motion`.

## Lote C — Assets e conteúdo
1. Procurar referências quebradas ou arquivos inexistentes.
2. Procurar `ChatGPT Image`, placeholder, lorem ipsum ou copy de rascunho.
3. Não substituir material ausente por IA.
4. Detectar imagens duplicadas ou muito pesadas.
5. Confirmar alt text útil nas imagens reais.
6. Preservar logo e identidade oficiais.

## Lote D — Performance e qualidade
1. Garantir width/height onde fizer sentido para evitar CLS.
2. Lazy-load abaixo da dobra.
3. Não lazy-load do conteúdo visual crítico da primeira dobra.
4. Revisar preload para manter somente o necessário.
5. Detectar CSS/JS morto específico da Link Bio.
6. Validar JS com `node --check`.
7. Rodar todos os scripts `scripts/check-linkbio-*.mjs` existentes.
8. Rodar `git diff --check`.

## Lote E — relatório final
Criar `docs/QA-LINKBIO-FINAL.md` contendo:
- commit inicial do lote;
- commits produzidos;
- testes executados;
- falhas encontradas;
- correções aplicadas;
- pendências dependentes de material/decisão do cliente;
- URL do Preview Vercel mais recente, se disponível.

## Limites
- Sem merge para `main`.
- Sem Hostinger.
- Sem e-commerce.
- Sem apagar backups.
- Sem mover/reorganizar arquivos do Drive de forma destrutiva.
- Sem mudanças grandes de copy ou direção visual sem solicitação explícita.

Ao terminar, deixar a branch limpa, todos os commits enviados ao GitHub e o relatório salvo. Se houver qualquer bloqueio, registrar no relatório e seguir para as tarefas independentes restantes em vez de parar todo o lote.