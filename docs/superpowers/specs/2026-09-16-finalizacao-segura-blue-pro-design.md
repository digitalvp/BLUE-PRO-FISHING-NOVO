# Finalização Segura BLUE PRO FISHING — Design

## Objetivo

Finalizar o projeto BLUE PRO FISHING com velocidade alta e risco operacional baixo, preservando integralmente as páginas e conteúdos já aprovados pelo cliente.

## Estado de referência

O estado atual do projeto em produção será tratado como **BASE APROVADA**. A branch `backup/base-aprovada-2026-09-16` é a referência congelada desse estado e não deve receber novos commits.

A branch de trabalho será `finalizacao/blue-pro-2026-09`. Toda mudança futura deve nascer nela ou em branches derivadas dela, nunca diretamente em `main`.

## Escopo congelado

As áreas já aprovadas pelo cliente — Home principal, Náutica, Campos, Pesca e qualquer outra rota explicitamente marcada como aprovada — não devem ser alteradas visualmente ou em conteúdo sem autorização explícita.

Isso inclui:

- textos e títulos visíveis;
- imagens aprovadas;
- CTAs;
- ordem e composição das seções;
- layout, cards e espaçamentos visíveis;
- comportamento funcional já aprovado;
- SEO visível que altere a mensagem da página.

Mudanças em CSS e JavaScript compartilhados também devem ser tratadas como potencialmente capazes de afetar páginas congeladas, mesmo quando o HTML dessas páginas não é editado.

## Link na Bio

As rotas `/linkbio/` e `/links/` permanecem separadas enquanto o cliente decide qual versão será mantida. O PR #3 não deve ser mesclado sem autorização explícita.

## Modelo operacional

O projeto será finalizado em lotes seguros com checkpoints. Cada lote segue o fluxo:

1. criar ou reutilizar branch isolada;
2. implementar apenas o escopo daquele lote;
3. executar testes técnicos relevantes;
4. revisar o diff do lote;
5. publicar Preview na Vercel;
6. validar visualmente em desktop, tablet e mobile;
7. validar que páginas congeladas não sofreram regressão;
8. só então promover a mudança para `main`;
9. testar novamente no domínio público;
10. registrar o resultado no histórico do projeto.

## Lotes de finalização

A régua operacional parte de aproximadamente 84% concluído e 16% restante, distribuído assim:

- páginas internas, galerias, fotos e organização de ativos: 6%;
- produtos, categorias e links de WhatsApp: 4%;
- fechamento da Link Bio: 2%;
- QA responsivo e funcional: 1,5%;
- SEO técnico seguro: 1,5%;
- limpeza técnica, organização e documentação: 1%.

## Decisões que podem ser tomadas sem nova aprovação

Podem ser executadas sem interromper o fluxo quando não alterarem o conteúdo aprovado:

- compressão e otimização de imagens;
- organização técnica de arquivos e diretórios;
- lazy loading e atributos técnicos de mídia;
- correção de 404, links quebrados e caminhos incorretos;
- ajustes responsivos necessários em áreas ainda não congeladas;
- SEO técnico invisível;
- acessibilidade básica;
- correções de console e erros de JavaScript;
- mensagens de WhatsApp derivadas de conteúdo comercial já aprovado;
- limpeza de código obsoleto quando não houver impacto visual/funcional.

## Trava de segurança

Se uma tarefa exigir alterar uma página ou conteúdo congelado, aquela parte deve parar e ser registrada como bloqueio. O restante do lote pode continuar.

Nenhuma melhoria estética ou editorial deve ser aplicada em área aprovada apenas por preferência técnica.

## Verificações mínimas por lote

Cada lote deve verificar, conforme aplicável:

- HTTP 200 nas rotas afetadas;
- ausência de 404/500 inesperados;
- imagens carregando corretamente;
- links internos e externos principais;
- links e mensagens de WhatsApp;
- ausência de erro relevante no console;
- ausência de overflow horizontal;
- renderização em mobile, tablet e desktop;
- integridade das páginas congeladas;
- deploy Vercel e commit efetivamente publicado.

## Regressão e rollback

Commits devem ser pequenos e separados por responsabilidade. Se um lote falhar no preview, ele não vai para produção. Se uma regressão chegar à produção, deve ser restaurado o deployment/commit anterior e a investigação continuar fora da produção.

A branch `backup/base-aprovada-2026-09-16` é a referência de recuperação completa da versão aprovada no início desta etapa.

## Participação do cliente/usuário

A execução deve evitar perguntas desnecessárias. A participação humana fica reservada a fatos ou decisões que não podem ser inferidos com segurança, como:

- fotos realmente inexistentes;
- nomes exatos de produtos que não constem nas fontes oficiais;
- informações comerciais exclusivas não documentadas;
- escolha final entre alternativas que dependam do cliente.

## Critério de conclusão

Um lote só é considerado concluído quando houver evidência fresca de testes, validação do preview, conferência das páginas congeladas e verificação pós-deploy quando publicado em produção.
