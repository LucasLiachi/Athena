---
task: "Auditar prontidão UX/UI"
order: 1
input: |
  - launch_plan: plano e fluxos prioritários
  - product: aplicação e código do ProjectFlow
output: |
  - ux_scorecard: avaliação por fluxo
  - prioritized_backlog: correções com aceite
---

# Auditar prontidão UX/UI

Avalia a experiência do lançamento por tarefas reais, não por preferência estética. O resultado é um scorecard de prontidão e um backlog que separa bloqueios, correções importantes e melhorias cosméticas.

## Process

1. Mapear os fluxos criar projeto, alimentar dados, interpretar dashboard, avaliar timeline e compartilhar decisão.
2. Inspecionar hierarquia, clareza, estados, responsividade e consistência.
3. Verificar teclado, foco, semântica, contraste e leitura de status segundo WCAG 2.2 AA.
4. Avaliar loading, vazio, erro, permissão e recuperação.
5. Conferir eventos do funil e definição de ativação.
6. Priorizar achados por severidade, frequência, impacto e esforço.

## Output Format

```yaml
activation_event: ""
flows: [{name: "", readiness: 0, evidence: [], blockers: []}]
findings: [{severity: critical, evidence: "", impact: "", fix: "", acceptance: ""}]
launch_recommendation: "GO | CONDITIONAL GO | HOLD"
```

## Output Example

> Use como referência de qualidade, não como modelo rígido.

### Evento de ativação
Projeto criado com marcos e responsáveis, seguido da visualização ou compartilhamento do primeiro insight de risco.

### Fluxo: criar projeto
- Prontidão: 6/10.
- Evidência: Timeline mantém somente um projeto ativo por sessão.
- Impacto: gestor não consegue comparar portfólio.
- Severidade: alta.
- Correção: permitir múltiplas instâncias e seleção persistente durante a sessão.
- Aceite: criar dois projetos, alternar entre ambos e preservar nomes/estados até recarregar.

### Acessibilidade
- Achado: alerta depende de cor.
- Correção: adicionar ícone, texto e nome acessível.
- Aceite: status compreensível em escala de cinza e por leitor de tela.

### Recomendação
CONDITIONAL GO para piloto fechado após correções de severidade alta.

## Quality Criteria

- [ ] Cada achado contém evidência, impacto, correção e aceite.
- [ ] Todos os estados relevantes são avaliados.
- [ ] Acessibilidade e responsividade fazem parte do score.
- [ ] Mockups e dados simulados são identificados.

## Veto Conditions

Reject and redo if ANY are true:
1. A auditoria chama a interface de intuitiva sem evidência.
2. Falha crítica de tarefa ou acessibilidade é classificada como cosmética.
3. Recomendação não corresponde aos blockers listados.

