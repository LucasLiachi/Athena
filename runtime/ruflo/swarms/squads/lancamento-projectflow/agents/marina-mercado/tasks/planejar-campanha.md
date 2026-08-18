---
task: "Planejar campanha"
order: 1
input: |
  - approved_priorities: segmento, produto e restrições aprovadas
  - tone_of_voice: opções de tom do ProjectFlow
output: |
  - gtm_strategy: ICP, oferta, funil e experimentos
  - campaign_kit: landing page e conteúdos multicanal
---

# Planejar campanha

Cria uma estratégia de primeiros clientes e um pacote multicanal baseado em evidência. Antes do texto final, recomenda um tom, apresenta as seis opções do arquivo de voz e espera a escolha do usuário.

## Process

1. Ler prioridades aprovadas, pesquisa, investigação e tons disponíveis.
2. Recomendar um tom e obter escolha humana antes da redação.
3. Definir 1–2 hipóteses de ICP, proposta de valor, oferta e desqualificação.
4. Produzir três hooks com drivers e estruturas diferentes; obter seleção.
5. Criar landing, LinkedIn, Feed, Reels e Stories em formatos nativos.
6. Definir funil, métricas, experimentos e regra de decisão.

## Output Format

```yaml
tone: ""
icp: [{segment: "", buyer: "", trigger: "", pain: "", disqualifiers: []}]
offer: {promise: "", proof: [], pilot: "", cta: ""}
campaign: {landing: {}, linkedin: {}, instagram_feed: {}, reels: {}, stories: {}}
experiments: [{hypothesis: "", owner: "", metric: "", guardrail: "", decision_date: ""}]
```

## Output Example

> Use como referência de qualidade, não como modelo rígido.

### ICP inicial
- Segmento: PMOs e operações de empresas de serviços com 5–30 projetos ativos.
- Comprador: diretor de operações ou PMO.
- Gatilho: reunião executiva depende de consolidação manual.
- Dor: risco aparece tarde e capacidade é realocada por percepção.
- Desqualificação: equipe sem rotina mínima de atualização de projetos.

### Oferta
- Piloto assistido de 21 dias com um portfólio real.
- Prova de valor: identificar ao menos uma decisão antecipada de prazo, risco ou capacidade.
- CTA: solicitar diagnóstico do portfólio.

### LinkedIn
Hook: “Você descobre que o projeto atrasou quando o atraso já ficou caro.”
Corpo: contraste entre status e previsibilidade, seguido de três decisões possíveis.
CTA: “Qual informação falta hoje na sua reunião de portfólio?”

### Experimento
- Hipótese: PMOs respondem mais ao risco antecipado que à centralização de tarefas.
- Métrica: conversas qualificadas por 100 contas abordadas.
- Guardrail: taxa de desqualificação por falta de processo.
- Decisão: após 10 entrevistas qualificadas.

## Quality Criteria

- [ ] Tom e hook são aprovados antes do corpo final.
- [ ] Cada peça tem um CTA e uma função no funil.
- [ ] Toda promessa possui prova ou rótulo de hipótese.
- [ ] Cada formato segue comportamento nativo do canal.

## Veto Conditions

Reject and redo if ANY are true:
1. Conteúdo final é escrito sem escolha de tom e hook.
2. Métrica simulada aparece como resultado real.
3. ICP é definido como público amplo ou “todas as empresas”.

