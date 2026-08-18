---
task: "Revisar lançamento"
order: 1
input: |
  - launch_plan: plano de governança
  - ux_readiness: scorecard e blockers
  - approved_campaign: campanha aprovada pelo usuário
output: |
  - review: pontuação, alterações e veredito
---

# Revisar lançamento

Revisa o pacote completo com uma rubrica objetiva. Uma média boa não neutraliza uma falha crítica; todo bloqueio precisa de correção, owner e condição verificável.

## Process

1. Carregar todos os artefatos e critérios antes de pontuar.
2. Ler plano, UX e campanha integralmente.
3. Pontuar estratégia, governança, UX, conteúdo, evidência e operação de 1 a 10.
4. Aplicar veto se qualquer critério ficar abaixo de 4 ou houver falha crítica.
5. Separar alterações obrigatórias de sugestões não bloqueantes.
6. Emitir GO, CONDITIONAL GO ou HOLD e indicar próximo gate.

## Output Format

```yaml
revision: 1
scores: [{criterion: "", score: 0, justification: ""}]
overall: 0
lowest_score: 0
required_changes: []
suggestions: []
verdict: "GO | CONDITIONAL GO | HOLD"
```

## Output Example

> Use como referência de qualidade, não como modelo rígido.

### Veredito: CONDITIONAL GO
Revisão: 1 de 3
Média: 7,5/10
Menor nota: 5/10

| Critério | Nota | Justificativa |
|---|---:|---|
| Governança | 8 | Gates, owners e baseline estão explícitos. |
| UX | 5 | Fluxo de múltiplos projetos ainda bloqueia comparação. |
| Campanha | 8 | ICP, oferta e CTA são específicos. |
| Evidência | 7 | Mockups estão marcados, mas faltam testes com ICP. |
| Operação | 9 | Suporte e escalonamento têm responsáveis. |

Alteração obrigatória: permitir dois projetos na Timeline e preservar estado durante a sessão. Aceite: criar, alternar e editar ambos sem perda.

Sugestão não bloqueante: reduzir o segundo parágrafo do LinkedIn para melhorar escaneabilidade.

Próxima decisão: repetir G2 após evidência do aceite.

## Quality Criteria

- [ ] Toda nota tem justificativa específica.
- [ ] Toda nota abaixo de 7 tem correção indicada.
- [ ] Média e menor nota determinam corretamente o veredito.
- [ ] Revisão informa ciclo e próximo passo.

## Veto Conditions

Reject and redo if ANY are true:
1. Existe nota sem justificativa ou alteração sem localização.
2. Critério abaixo de 4 recebe GO.
3. Alterações obrigatórias e sugestões estão misturadas.

