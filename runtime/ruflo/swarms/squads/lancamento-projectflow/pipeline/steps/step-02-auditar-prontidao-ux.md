---
execution: subagent
agent: ursula-usabilidade
inputFile: squads/lancamento-projectflow/output/v1/plano-lancamento.md
outputFile: squads/lancamento-projectflow/output/prontidao-ux.md
model_tier: powerful
---

# Step 02: Auditar prontidão UX/UI

## Context Loading

- `squads/lancamento-projectflow/output/plano-lancamento.md` — prioridades e gates.
- `squads/lancamento-projectflow/pipeline/data/quality-criteria.md` — metas e vetos.
- `squads/lancamento-projectflow/pipeline/data/anti-patterns.md` — falhas a evitar.
- `src/` — implementação atual do produto.

## Instructions

### Process

1. Mapear os fluxos críticos que sustentam ativação e decisão executiva.
2. Inspecionar implementação e comportamento em estados de sucesso e falha.
3. Avaliar hierarquia, compreensão, responsividade, acessibilidade e performance.
4. Verificar se dados mockados são identificados e se métricas têm contexto.
5. Priorizar achados com severidade, evidência, impacto, correção e aceite.
6. Recomendar GO, CONDITIONAL GO ou HOLD para o piloto.

## Output Format

O output MUST seguir esta estrutura:

```markdown
# Prontidão UX/UI
## Evento de ativação
## Fluxos críticos e notas
## Achados críticos
## Achados importantes
## Acessibilidade e performance
## Instrumentação
## Backlog priorizado
## Recomendação de lançamento
```

## Output Example

# Prontidão UX/UI

## Evento de ativação
Projeto criado com marcos e primeiro insight de risco visualizado.

## Fluxo: múltiplos projetos
- Nota: 5/10.
- Evidência: apenas uma instância aparece na Timeline.
- Impacto: gestor não compara portfólio.
- Severidade: alta.
- Correção: criar e alternar projetos com estado preservado na sessão.
- Aceite: dois projetos mantêm nome e progresso ao alternar.

## Acessibilidade
- Achado: alerta depende de vermelho.
- Correção: adicionar texto, ícone e nome acessível.
- Aceite: status compreensível sem cor e por leitor de tela.

## Recomendação
CONDITIONAL GO após correções altas.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Achado não possui evidência, impacto e critério de aceite.
2. Falha crítica é classificada como cosmética.
3. Recomendação contradiz blockers encontrados.

## Quality Criteria

- [ ] Todos os fluxos críticos possuem nota.
- [ ] Estados vazio, loading, erro e permissão foram considerados.
- [ ] Acessibilidade integra o gate.
- [ ] Backlog está ordenado por impacto no lançamento.
