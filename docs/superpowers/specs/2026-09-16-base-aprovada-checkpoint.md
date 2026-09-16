# Checkpoint — BASE APROVADA BLUE PRO FISHING

Data: 2026-09-16

## Referências congeladas

- Repositório: `digitalvp/BLUE-PRO-FISHING-NOVO`
- Commit da BASE APROVADA em `main`: `02b9ffda33e116d022c122c9a5f798d295085e85`
- Branch congelada: `backup/base-aprovada-2026-09-16`
- Branch de finalização: `finalizacao/blue-pro-2026-09`
- Projeto Vercel atual: `blue-pro-fishing`
- Project ID Vercel: `prj_96BMKMadYnw6147ZPaeLMC0VUA6O`
- Deployment de produção da BASE APROVADA: `dpl_ModnwLesYC5X6BNVB5hGohMeeex3`
- Estado do deployment: `READY`
- Domínio de produção atual: `https://blue-pro-fishing-novo.vercel.app/`
- Link Bio atual: `https://blue-pro-fishing-novo.vercel.app/linkbio/`
- Link Bio 2: `https://blue-pro-fishing-novo.vercel.app/links/`
- PR #3: permanecer separado e sem merge até autorização explícita.

## Regra de preservação

Home principal, Náutica, Campos, Pesca e demais áreas já aprovadas são tratadas como congeladas. Mudanças futuras devem ser desenvolvidas fora de `main`, validadas em preview e comparadas contra esta base antes de produção.

Mudanças em CSS ou JavaScript compartilhados também devem ser consideradas capazes de gerar regressão nessas páginas, mesmo quando o HTML congelado não for alterado.

## Regra de rollback

Se uma mudança futura gerar regressão em produção, o ponto de restauração técnico é o commit `02b9ffda33e116d022c122c9a5f798d295085e85` e o deployment `dpl_ModnwLesYC5X6BNVB5hGohMeeex3`.

## Observação

O endereço `https://blue-pro-fishing.vercel.app/` pertence ao projeto antigo de outro desenvolvedor e não faz parte da infraestrutura atual da BLUE PRO FISHING trabalhada neste repositório.
