# Inventário de materiais pendentes — 16/09/2026

## Regra desta auditoria

Este documento separa ausência real de material de pendência técnica. Nenhum item abaixo autoriza alteração nas páginas congeladas. Home, Acampamento/Pesca/Acessórios, Embarcações/Náutica e Camping/Pesca permanecem byte a byte protegidas pela BASE APROVADA até autorização explícita.

## Fonte técnica atual

O sistema de fotos existente em `scripts/atualizar-fotos-paginas.mjs` define dez slots: `pesca`, `iscas-linhas-acessorios`, `oculos-vestuario`, `camping`, `modelo-01`, `modelo-02`, `modelo-03`, `caiaques`, `garmin` e `manutencao`.

`FOTOS-DAS-PAGINAS.md` confirma que os três modelos de embarcação ainda aguardam confirmação de nomes e características e que a rotina de fotos não converte nem comprime os arquivos.

## Estado por bloco

| Bloco | Estado no repositório / página atual | Evidência de material no Drive | Ação segura agora |
|---|---|---|---|
| Pesca | usa imagem atual aprovada como fallback | há acervo amplo da loja, mas não é necessário substituir a imagem aprovada | preservar |
| Iscas, linhas e acessórios | imagem fallback presente; texto específico marcado como pendente | busca no Drive localizou material chamado `2-iscas-artificiais-loja-de-pesca-em-palmas-temporada-de-pesca.png` e peças de campanha; isso não prova que sejam a foto editorial aprovada nem fornece automaticamente o texto faltante | registrar candidato; não substituir sozinho |
| Óculos e vestuário | foto e conteúdo marcados como pendentes | busca nominal não encontrou imagem claramente identificada como óculos/vestuário | bloqueado por material identificado |
| Camping | imagem fallback presente; texto específico marcado como pendente | há peça `4-camping-em-palmas-loja-de-pesca-e-equipamentos-outdoor.png` e outras peças promocionais; não assumir que sejam o ativo editorial definitivo | registrar candidato; não substituir sozinho |
| Embarcação modelo 01 | nome, foto e características pendentes | não foi localizado arquivo com identificação inequívoca do modelo 01 real disponível | bloqueado por nome/foto/dados reais |
| Embarcação modelo 02 | nome, foto e características pendentes | não foi localizado arquivo com identificação inequívoca do modelo 02 real disponível | bloqueado por nome/foto/dados reais |
| Embarcação modelo 03 | nome, foto e características pendentes | não foi localizado arquivo com identificação inequívoca do modelo 03 real disponível | bloqueado por nome/foto/dados reais |
| Caiaques | página atual já usa foto aprovada da loja | Drive contém pasta `8 - Caiaque Barba Negra` e imagens `1 - Caiaque.png`, `2 - Modelo.png`, `3 - Caiaque.png`; há também peça `blue-pro-fishing-caiaques-barcos-acessorios-palmas-to.png` | material candidato existe, mas página congelada permanece intacta |
| Garmin marítimo | foto marcada como pendente | busca nominal por imagem Garmin não retornou ativo claramente identificado | bloqueado por foto identificada |
| Manutenção náutica | foto marcada como pendente | não há ativo claramente identificado nesta auditoria | bloqueado por foto identificada |

## Camping / Pesca — destinos

A página atual mantém quatro blocos com `PENDÊNCIA DE ASSET/DADO`: Lago de Palmas / Represa de Lajeado, Parque Estadual do Cantão / Caseara, Rio Javaés / Ilha do Bananal e Lago de Peixe Angical. O próprio HTML registra que texto aprovado e fotografia identificada aguardam fornecimento.

O calendário também mantém corretamente a informação de que dados sazonais e regulatórios aguardam validação. Não serão criados períodos permitidos, restrições, espécies ou regras por inferência.

O Javaé Camp já está ligado ao Instagram oficial no código atual e não é pendência técnica deste lote.

## Produtos e catálogo

A árvore `assets/img/produtos/` contém arquivos que não devem ser tratados automaticamente como catálogo real. Alguns ativos de demonstração/placeholder podem ter nomes de categorias, mas nome de arquivo não comprova produto, estoque, preço, especificação ou disponibilidade.

Para uma futura ficha específica de produto ser publicável, exigir conjuntamente: nome exato, categoria, foto correspondente e informação comercial oficialmente documentada. Até isso existir, a Home aprovada permanece como está e `/e-commerce-teste/` continua sendo demonstração isolada/noindex.

## Conclusão operacional

Há material candidato no Drive para caiaques, iscas e camping, porém a identificação disponível não é suficiente para substituir silenciosamente ativos de páginas congeladas. As pendências de modelos náuticos, óculos/vestuário, Garmin, manutenção, textos editoriais específicos e conteúdo dos quatro destinos continuam sendo dependências reais de material/decisão, não falhas de desenvolvimento.
