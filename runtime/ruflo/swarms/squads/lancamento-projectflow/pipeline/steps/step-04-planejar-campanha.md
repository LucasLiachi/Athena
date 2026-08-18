---
execution: inline
agent: marina-mercado
inputFile: squads/lancamento-projectflow/output/prioridades-aprovadas.md
outputFile: squads/lancamento-projectflow/output/campanha-lancamento.md
---

# Step 04: Planejar campanha

## Context Loading

- `squads/lancamento-projectflow/output/prioridades-aprovadas.md` — decisões humanas.
- `squads/lancamento-projectflow/pipeline/data/tone-of-voice.md` — seis tons.
- `squads/lancamento-projectflow/pipeline/data/output-examples.md` — referências.
- `squads/lancamento-projectflow/_investigations/consolidated-analysis.md` — padrões competitivos.
- `_opensquad/_memory/company.md` — marca e proposta.

## Instructions

### Process

1. Recomendar um tom e pedir escolha entre as seis opções antes da escrita final.
2. Definir ICP, proposta de valor, oferta inicial e critérios de desqualificação.
3. Apresentar três hooks com estruturas e drivers distintos; aguardar seleção.
4. Criar message house e landing page orientada à conversão.
5. Criar peças nativas para LinkedIn, Feed, Reels e Stories.
6. Definir funil, eventos, experimentos, owners e datas de decisão.

## Output Format

O output MUST seguir esta estrutura:

```markdown
# Campanha de Lançamento
## Tom escolhido
## ICP e desqualificação
## Proposta de valor e oferta
## Message house
## Landing page
## LinkedIn
## Instagram Feed
## Instagram Reels
## Instagram Stories
## Funil e experimentos
## Calendário e responsáveis
```

## Output Example

# Campanha de Lançamento

## Tom escolhido
Executivo analítico.

## ICP
PMOs de empresas de serviços com 5–30 projetos ativos e consolidação manual.

## Oferta
Piloto assistido de 21 dias com prova de uma decisão antecipada.

## LinkedIn
Hook: “Você descobre que o projeto atrasou quando o atraso já ficou caro.”
Corpo: status explica o presente; previsibilidade orienta a próxima ação.
CTA: “Qual informação falta na sua reunião de portfólio?”

## Reel
0–2 s: alerta de risco.
2–15 s: dado vira decisão.
15–25 s: demo e CTA.
Observação na tela: dados de mockup.

## Experimento
Hipótese: risco antecipado gera mais conversas que centralização de tarefas.
Decisão: após 10 entrevistas qualificadas.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Conteúdo final foi escrito sem escolha de tom e hook.
2. Métrica simulada é apresentada como resultado real.
3. Alguma peça tem mais de um CTA principal.

## Quality Criteria

- [ ] ICP e oferta são específicos e testáveis.
- [ ] Cada formato segue seu comportamento nativo.
- [ ] Toda promessa possui prova ou rótulo de hipótese.
- [ ] Experimentos têm métrica, guardrail e data.

