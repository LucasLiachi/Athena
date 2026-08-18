---
execution: inline
agent: paulo-projetos
outputFile: squads/lancamento-projectflow/output/plano-lancamento.md
---

# Step 01: Governar lançamento

## Context Loading

- `squads/lancamento-projectflow/_build/discovery.yaml` — objetivo e escopo aprovados.
- `squads/lancamento-projectflow/pipeline/data/research-brief.md` — pesquisa operacional.
- `squads/lancamento-projectflow/pipeline/data/domain-framework.md` — gates e métricas.
- `_opensquad/_memory/company.md` — proposta do ProjectFlow.

## Instructions

### Process

1. Definir charter com objetivo, escopo, não escopo, sponsor, limites e sucesso.
2. Criar workstreams de produto/UX, marketing/vendas, operação/suporte e dados.
3. Organizar entregáveis, milestones, baseline, forecast, responsáveis e dependências.
4. Definir gates G0–G4 com critérios, evidências, decisor e opções de decisão.
5. Registrar RAID e decision log.
6. Apresentar recomendação inicial e salvar o plano completo.

## Output Format

O output MUST seguir esta estrutura:

```markdown
# Plano de Lançamento ProjectFlow
## Charter
## Definição de sucesso
## Workstreams e responsáveis
## Roadmap: baseline e forecast
## Gates G0–G4
## RAID log
## Dashboard executivo
## Decision log
## Decisão solicitada
```

## Output Example

# Plano de Lançamento ProjectFlow

## Charter
- Objetivo: validar o primeiro ICP e conquistar clientes pagantes.
- Escopo: piloto assistido, produto essencial e campanha orgânica.
- Não escopo: mídia paga em escala.
- Sponsor: Ronaldo Mazuhim.

## Gate G2
- Decisão: conditional go.
- Evidência: fluxo crítico funcional com mockup identificado.
- Condição: validar múltiplos projetos durante a sessão.
- Decisor: sponsor.
- Data: 2026-08-11.

## Risco alto
- Evento: dado simulado ser confundido com forecast real.
- Impacto: perda de confiança.
- Owner: Produto.
- Resposta: rotular mockups e documentar fonte.

## Decisão solicitada
Aprovar as correções de severidade alta antes da campanha pública.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Há gate sem evidência, decisor ou critério operacional.
2. Há blocker crítico sem owner e prazo.
3. Baseline e forecast são misturados.

## Quality Criteria

- [ ] Plano é consumível em até 10 minutos.
- [ ] Todo entregável crítico tem accountable único.
- [ ] Todos os riscos altos têm resposta e gatilho.
- [ ] A decisão solicitada aparece de forma explícita.

