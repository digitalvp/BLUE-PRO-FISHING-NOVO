# Nova experiência da Link Bio — Blue Pro Fishing

## Objetivo

Substituir a continuação da Home antiga dentro de `/linkbio/` por uma experiência própria, inspirada na lógica de navegação da página `/links` da iBit, mas com identidade e conteúdo integralmente oficiais da Blue Pro Fishing.

## Escopo aprovado

- Preservar a primeira dobra atual da Link Bio como porta de entrada rápida.
- O CTA `Explore a Blue` passa a levar para uma Home exclusiva dentro da própria `/linkbio/`.
- Não alterar `main`; todo o trabalho permanece em `linkbio-v2`.
- Não implementar e-commerce, preço, carrinho ou estoque.
- Produtos/equipamentos funcionam como vitrines de categorias e direcionam para WhatsApp.
- Lucas e Cézar aparecem em cards de atendimento sem depender de fotos individuais.
- Usar somente logo, fotos, marcas, telefones e URLs oficiais já existentes no projeto/Drive.

## Direção visual

A experiência alterna dobras claras e azuis, mantendo a paleta oficial já usada na Link Bio:

- Azul profundo: `#031b3d` / `#021126`.
- Azul de destaque: `#0aa4f3`.
- Azul claro: `#72d0ff`.
- Branco/quase branco: `#f7fbff`.
- Verde somente para ações de WhatsApp.

A página deve parecer uma evolução natural da Link Bio atual, não outro projeto.

## Ordem da experiência

1. Primeira dobra da Link Bio atual.
2. `Explore a Blue`.
3. Header compacto da experiência.
4. Hero `A sua aventura começa aqui` usando material oficial.
5. Carrossel contínuo de marcas oficiais imediatamente abaixo do hero.
6. Dobra branca `Nossas categorias`: Pesca, Náutica, Camping & Lazer e Serviços.
7. Dobra branca `Produtos & Equipamentos`: cards de consulta por categoria, sem preço/carrinho.
8. Dobra azul `Viva a Blue`: posicionamento/lifestyle com foto oficial.
9. Dobra branca `Nossa loja`: fachada e fotos reais da operação, com Google Maps.
10. Dobra azul `Fale com quem entende`: Lucas e Cézar, sem fotos individuais, com WhatsApp oficial.
11. Dobra branca `Blue na Água`: acesso ao YouTube e conteúdo oficial.
12. CTA final azul + footer compacto.

## Interações

- Navegação por âncoras com scroll suave.
- Carrossel de marcas automático e contínuo, pausando em `hover/focus` e respeitando `prefers-reduced-motion`.
- CTAs de categorias/equipamentos abrem WhatsApp com mensagem contextual pré-preenchida.
- Links externos abrem em nova aba com `noopener noreferrer`.
- A experiência precisa funcionar sem JavaScript; o JS apenas melhora carrossel/menu/scroll.

## Responsividade

- Mobile first, com cards roláveis horizontalmente quando necessário.
- Desktop com grids amplos, dobras bem separadas e ritmo visual azul → branco → azul → branco.
- Sem overflow horizontal acidental.
- Imagens com `object-fit: cover`, dimensões previsíveis e carregamento lazy fora da primeira tela.

## Critérios de aceite

- `/linkbio/` não deve mais incorporar a Home antiga.
- A primeira dobra atual continua funcional.
- `Explore a Blue` leva para a nova experiência.
- Carrossel de marcas aparece logo abaixo do novo hero.
- Não existe linguagem de e-commerce (preço/carrinho/estoque).
- Todos os recursos visuais usados são oficiais do projeto.
- Lucas/Cézar funcionam sem retratos individuais.
- Desktop e mobile permanecem utilizáveis e visualmente coerentes.
