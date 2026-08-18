---
task: "Governar lançamento"
order: 1
input: |
  - discovery: contexto e objetivo aprovados
  - research: frameworks e critérios pesquisados
output: |
  - launch_plan: charter, gates, roadmap, RAID e dashboard
---

# Governar lançamento

Cria a base executiva do lançamento e transforma intenção em decisões verificáveis. O plano deve ser compacto, manter baseline e forecast separados e permitir que o usuário autorize ou interrompa o avanço.

## Process

1. Extrair objetivo, escopo, não escopo, sponsor, limites e definição de sucesso.
2. Dividir trabalho em produto/UX, marketing/vendas, suporte/operação e dados.
3. Definir milestones, dependências, accountable, responsible, baseline e forecast.
4. Construir gates G0–G4 com evidências, decisor e critérios binários.
5. Registrar riscos, assumptions, issues e dependencies com owner e resposta.
6. Montar dashboard executivo e decision log.

## Output Format

```yaml
charter: {objective: "", scope: [], out_of_scope: [], success: []}
gates: [{id: G0, criteria: [], evidence: [], decision_owner: ""}]
roadmap: [{deliverable: "", accountable: "", baseline: "", forecast: ""}]
raid: [{type: risk, exposure: high, owner: "", response: ""}]
decisions: [{date: "", question: "", recommendation: ""}]
```

## Output Example

> Use como referência de qualidade, não como modelo rígido.

### Charter
- Objetivo: conquistar os primeiros clientes pagantes validando uma hipótese de ICP.
- Escopo: piloto assistido, onboarding, landing page e campanha orgânica.
- Não escopo: mídia paga em escala e automações comerciais complexas.
- Sponsor: Ronaldo Mazuhim.
- Sucesso: ao menos um piloto com ativação definida e decisão comercial documentada.

### Gate G2 — Produto pronto para piloto
- Critério: fluxo criar projeto → visualizar risco → compartilhar decisão funciona sem bloqueio.
- Evidência: teste moderado e eventos verificados.
- Decisor: sponsor.
- Recomendação: conditional go.
- Condição: identificar dados mockados até 2026-08-08.

### Risco alto
- Evento: forecast simulado ser interpretado como previsão real.
- Impacto: perda de confiança.
- Owner: Produto.
- Resposta: selo “Mockup” e explicação de fonte/período.
- Gatilho: qualquer tela pública com dado simulado sem identificação.

## Quality Criteria

- [ ] Todo gate possui decisor e evidência.
- [ ] Todo entregável crítico possui accountable único.
- [ ] Todo blocker possui ação, owner e prazo.
- [ ] Baseline e forecast aparecem separadamente.

## Veto Conditions

Reject and redo if ANY are true:
1. Há gate sem critério operacional ou autoridade de decisão.
2. Existe risco alto sem owner e resposta.
3. O plano usa percentual concluído sem evidência.

