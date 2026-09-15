# BLUE PRO FISHING — CHECKPOINT DE VIAGEM

Data: 2026-09-15
Branch de trabalho: `linkbio-v2`
Commit validado no momento deste checkpoint: `943c000eb51d66382a700b348de9ad44890c1d8a`
Main: não alterar sem aprovação explícita.

## Estado atual

A Link Bio nova está versionada no GitHub e publicada por Preview Vercel. A primeira dobra, a continuação editorial e as alterações recentes estão em `linkbio-v2`.

Últimas mudanças já consolidadas:
- fontes oficiais Montserrat + Open Sans;
- sequência visual azul/branco nas dobras;
- números e textos explicativos removidos;
- hover dos CTAs da primeira dobra corrigido;
- carrossel de marcas movido logo após `Explore a Blue`;
- carrossel convertido para loop contínuo/infinito;
- faixa do carrossel integrada ao azul, com logos claros;
- assets reais/oficiais como regra para a implementação;
- `main` preservada.

## Regra de retomada

Se a conexão cair, não reconstruir nada por memória e não usar cópia local antiga como fonte de verdade.

1. Abrir o repositório `digitalvp/BLUE-PRO-FISHING-NOVO`.
2. Selecionar a branch `linkbio-v2`.
3. Confirmar que o HEAD é igual ou posterior ao commit acima.
4. Ler este arquivo antes de qualquer alteração.
5. Trabalhar em commits pequenos e independentes.
6. Após cada commit: executar os checks da Link Bio, aguardar o Preview Vercel e somente então seguir.
7. Nunca fazer merge em `main` durante a viagem sem aprovação explícita.

## Fila de execução segura para Codex

Executar em lote, sem redesenhar a página e sem inventar conteúdo:

1. QA responsivo da Link Bio em 320, 375, 390, 430, 768, 1024, 1366, 1440 e 1920 px.
2. Corrigir apenas problemas objetivos de overflow, alinhamento, quebra de texto, espaçamento e navegação.
3. Auditar todos os CTAs, WhatsApps, Maps, Google Review e redes sociais.
4. Auditar assets quebrados/duplicados, referências a `ChatGPT Image`, placeholders e arquivos inexistentes.
5. Auditar acessibilidade básica: foco visível, teclado, `aria-label`, alt, `prefers-reduced-motion`.
6. Auditar performance: dimensões de imagens, lazy-load abaixo da dobra, preload apenas crítico, CLS/LCP, CSS/JS morto.
7. Verificar mobile menu, scroll suave, carrossel infinito e hover/focus.
8. Gerar relatório `docs/QA-LINKBIO-FINAL.md` com somente falhas encontradas, correções aplicadas e pendências que dependem de material do cliente.

## Regras que não podem ser quebradas

- Sem e-commerce, preço, carrinho ou estoque.
- Verde somente para WhatsApp.
- Lucas e Cézar sem retratos inventados.
- Não criar logos, fachadas, produtos ou cenários fictícios.
- Usar material oficial do repositório/Drive.
- Não trocar a identidade visual aprovada.
- Não mexer na `main`.
- Não apagar backups do Drive.

## Fonte de verdade

- Código: GitHub `digitalvp/BLUE-PRO-FISHING-NOVO`.
- Branch ativa: `linkbio-v2`.
- Materiais do cliente: Google Drive Blue Pro Fishing.
- Preview: Vercel conectado ao repositório.

Este arquivo existe para permitir retomada imediata mesmo em outro computador ou após queda de conexão.