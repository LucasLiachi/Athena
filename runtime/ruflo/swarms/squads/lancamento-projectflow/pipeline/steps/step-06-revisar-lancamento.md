---
execution: subagent
agent: renata-revisao
inputFile: squads/lancamento-projectflow/output/campanha-aprovada.md
outputFile: squads/lancamento-projectflow/output/revisao-final.md
model_tier: powerful
on_reject: 4
---

# Step 06: Revisar lançamento

## Context Loading

- `squads/lancamento-projectflow/output/plano-lancamento.md` — governança.
- `squads/lancamento-projectflow/output/prontidao-ux.md` — produto e UX.
- `squads/lancamento-projectflow/output/campanha-aprovada.md` — conteúdo aprovado.
- `squads/lancamento-projectflow/pipeline/data/quality-criteria.md` — rubrica.
- `squads/lancamento-projectflow/pipeline/data/anti-patterns.md` — vetos.

## Instructions

### Process

1. Ler todos os artefatos integralmente antes de pontuar.
2. Avaliar governança, UX, estratégia, conteúdo, evidência e operação.
3. Dar nota de 1 a 10 com justificativa e localização para cada dimensão.
4. Aplicar veto a falha crítica ou critério abaixo de 4.
5. Separar alterações obrigatórias de sugestões não bloqueantes.
6. Emitir GO, CONDITIONAL GO ou HOLD e indicar próximo passo.

## Output Format

O output MUST seguir esta estrutura:

```markdown
# Revisão Final
## Veredito
## Revisão N de 3
## Tabela de pontuação
## Forças
## Alterações obrigatórias
## Sugestões não bloqueantes
## Gatilhos de veto
## Caminho para aprovação
## Próxima decisão
```

## Output Example

# Revisão Final

## Veredito
CONDITIONAL GO

## Revisão 1 de 3
- Média: 7,5/10.
- Menor nota: 5/10.

| Critério | Nota | Justificativa |
|---|---:|---|
| Governança | 8 | Gates e owners completos. |
| UX | 5 | Múltiplos projetos ainda bloqueiam comparação. |
| Campanha | 8 | ICP e CTA específicos. |
| Evidência | 7 | Mockups marcados; faltam testes de ICP. |

## Alteração obrigatória
Corrigir múltiplos projetos e comprovar o aceite antes do G3.

## Sugestão não bloqueante
Reduzir o texto intermediário do LinkedIn.

## Próxima decisão
Repetir G2 após evidência da correção.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Nota aparece sem justificativa específica.
2. Critério abaixo de 4 recebe aprovação.
3. Alteração obrigatória não informa correção verificável.

## Quality Criteria

- [ ] Média e menor nota estão calculadas.
- [ ] Veredito corresponde à rubrica.
- [ ] Feedback bloqueante e opcional estão separados.
- [ ] Ciclo e caminho para aprovação estão registrados.

