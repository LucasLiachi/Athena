# Plano de Lançamento ProjectFlow

Atualizado em: 2026-08-05  
Sponsor e decisor final: Ronaldo Mazuhim  
Status recomendado: `HOLD` para lançamento público e `CONDITIONAL GO` para preparação de piloto fechado.

## Charter

### Objetivo

Preparar o ProjectFlow para conquistar os primeiros clientes pagantes, validando qual segmento percebe maior valor na proposta de transformar dados operacionais em clareza, previsibilidade e decisão.

### Escopo

- Produto mínimo para piloto: projetos, dashboard executivo, Timeline, riscos, capacidade e relatório financeiro.
- Correção dos fluxos críticos de múltiplos projetos e interpretação dos dados.
- Definição de ICP, oferta de piloto e mensagem de lançamento.
- Landing page e campanha orgânica para LinkedIn e Instagram.
- Instrumentação mínima do funil de aquisição e ativação.
- Processo de suporte, coleta de feedback e decisão comercial.

### Não escopo nesta baseline

- Mídia paga em escala.
- Automação comercial complexa.
- Publicação automática nas redes sociais.
- Forecast preditivo real antes de haver dados históricos suficientes.
- Expansão simultânea para todos os segmentos e canais.

### Limites

- Dados atuais são predominantemente mockados e devem ser identificados como demonstração.
- Persistência exigida nesta fase: durante a sessão, conforme decisão anterior do usuário.
- Não há evidência registrada de testes moderados com o ICP nem de analytics de ativação em produção.

## Definição de sucesso

### Resultado comercial

- Selecionar 1–2 hipóteses de ICP testáveis.
- Realizar pelo menos 10 entrevistas qualificadas antes de declarar mensagem vencedora.
- Iniciar ao menos um piloto assistido com sponsor, usuários, baseline e critério de conversão.
- Encerrar cada piloto com decisão paga, iteração ou desqualificação documentada.

### Ativação proposta

Projeto criado com nome próprio, marcos e responsáveis; usuário visualiza ou compartilha um primeiro insight de prazo, risco ou capacidade e consegue retornar ao projeto durante a sessão.

### Qualidade do produto

- Zero bloqueio crítico nos fluxos criar projeto, alternar projetos, interpretar dashboard e identificar risco.
- Dados mockados claramente rotulados.
- Estados essenciais de vazio, loading, erro e permissão cobertos quando aplicáveis.
- Critérios WCAG 2.2 AA nos fluxos de lançamento, sem blocker crítico de teclado, foco, semântica, contraste ou leitura de status.

## Workstreams e responsáveis

| Workstream | Entregável | Accountable | Responsible | Dependências |
|---|---|---|---|---|
| Governança | Charter, roadmap, gates, RAID e decision log | Ronaldo Mazuhim | Paulo Projetos | decisões do sponsor |
| Produto/UX | Scorecard, múltiplos projetos, nome dinâmico, clareza e acessibilidade | Ronaldo Mazuhim | Úrsula Usabilidade | código e critérios de ativação |
| Marketing/Vendas | ICP, oferta, message house, landing e campanha | Ronaldo Mazuhim | Marina Mercado | G2 e prioridades aprovadas |
| Qualidade | Revisão independente e recomendação GO/HOLD | Ronaldo Mazuhim | Renata Revisão | outputs dos três workstreams |
| Operação/Suporte | Canal de suporte, SLA e rotina de feedback do piloto | Ronaldo Mazuhim | a designar antes do G3 | oferta e fluxo do piloto |
| Dados | Eventos, fonte, período, atualização e funil | Ronaldo Mazuhim | a designar antes do G2 | definição de ativação |

## Roadmap: baseline e forecast

Como não há datas comerciais aprovadas, a baseline usa marcos relativos. Datas só serão fixadas no checkpoint humano.

| Marco | Baseline | Forecast atual | Evidência disponível | Status |
|---|---|---|---|---|
| M0 — arquitetura do squad | T0 | concluído | squad e pipeline validados | concluído |
| M1 — diagnóstico de prontidão | T0 + 2 dias úteis | em avaliação | auditoria UX ainda não executada | em andamento |
| M2 — correções críticas do produto | T0 + 7 dias úteis | incerto | múltiplos projetos não implementado; gaps do dashboard pendentes | em risco |
| M3 — ICP, oferta e campanha aprovados | após G2 | depende de G2 | pesquisa e referências disponíveis | bloqueado por dependência |
| M4 — piloto fechado iniciado | após G3 | não estimado | operação e analytics ainda sem owner | não iniciado |
| M5 — primeira decisão comercial | 21 dias após piloto | não estimado | depende de ativação e prova de valor | não iniciado |

## Gates G0–G4

### G0 — Tese aprovada

- Critérios: objetivo, hipótese ampla de público, proposta, sponsor e limites registrados.
- Evidências: discovery aprovado; perfil da empresa; pesquisa oficial; investigação Linear, Asana e ClickUp.
- Decisor: Ronaldo Mazuhim.
- Recomendação: `GO`.

### G1 — Oferta e mensagem prontas

- Critérios: 1–2 ICPs; dor e gatilho; piloto com prazo/escopo; prova de valor; CTA; mensagem sem promessa não comprovada.
- Evidências exigidas: entrevistas, hipóteses registradas e campanha produzida por Marina Mercado.
- Decisor: Ronaldo Mazuhim.
- Recomendação atual: `HOLD`, pois ICP e oferta ainda não foram escolhidos.

### G2 — Produto pronto para piloto

- Critérios: criar e nomear mais de um projeto; alternar projetos sem perda durante a sessão; dashboard e Timeline coerentes; dados mockados identificados; analytics essenciais; zero blocker crítico de UX/acessibilidade.
- Evidências atuais: dashboard data-driven implementado; título `Mockup` presente; teste focado do título existente.
- Lacunas observadas: múltiplos projetos não implementado; nome do Gantt ainda hardcoded; gaps de realce de responsável e efeito global do período reportados na revisão anterior; persistência apenas mockada; ausência de evidência de analytics e teste com ICP.
- Decisor: Ronaldo Mazuhim.
- Recomendação: `HOLD` até auditoria e correções críticas.

### G3 — Lançamento autorizado

- Critérios: G1 e G2 aprovados; landing e campanha aprovadas; suporte e dados com owners; contingência; checklist de publicação; dashboard de funil.
- Evidências exigidas: outputs aprovados e revisão independente sem veto.
- Decisor: Ronaldo Mazuhim.
- Recomendação atual: `HOLD`.

### G4 — Aprendizado e escala

- Critérios: funil por segmento/canal, ativação, win/loss, feedback, retenção inicial e decisão documentada.
- Opções: escalar, iterar, pausar ou encerrar a hipótese.
- Decisor: Ronaldo Mazuhim.
- Recomendação atual: não aplicável antes do piloto.

## RAID log

| Tipo | Item | Exposição/impacto | Owner | Resposta | Gatilho/prazo |
|---|---|---|---|---|---|
| Risk | Mockup ser interpretado como dado real | alta | Ronaldo Mazuhim | rotular simulações e exibir fonte/período | antes de qualquer peça pública |
| Issue | Timeline não suporta criação/alternância de vários projetos na sessão | crítico para portfólio | Úrsula Usabilidade | desenhar correção e aceite; implementar após aprovação | bloquear G2 |
| Issue | Nome do Gantt é hardcoded como `Mockup` | alto | Úrsula Usabilidade | ligar cabeçalho ao projeto selecionado | bloquear G2 |
| Risk | Dashboard sugerir interação cruzada incompleta | alta | Úrsula Usabilidade | validar realce de responsável, limpeza e período | auditoria da etapa 2 |
| Risk | Mensagem tentar atender público amplo | alta | Marina Mercado | testar 1–2 ICPs e comparar conversão/ativação | antes de G1 |
| Assumption | Diretores e PMOs valorizam risco antecipado mais que centralização de tarefas | comercial | Marina Mercado | validar em entrevistas e demos | após 10 entrevistas |
| Dependency | Analytics de ativação | alta | a designar | especificar e verificar eventos ponta a ponta | antes de G2 |
| Dependency | Suporte do piloto | alta | a designar | definir canal, SLA e escalonamento | antes de G3 |

## Dashboard executivo

| Dimensão | Estado | Evidência | Próxima ação | Owner |
|---|---|---|---|---|
| Tese | pronta | discovery e pesquisa aprovados | escolher ICP no checkpoint | Sponsor |
| Produto | em risco | dashboard avançou; Timeline tem blockers | concluir auditoria e backlog | Úrsula |
| Marketing | aguardando gate | referências e framework prontos | criar campanha após prioridades | Marina |
| Operação | não pronta | owners não definidos | nomear dados e suporte | Sponsor |
| Qualidade | aguardando outputs | rubrica disponível | revisar após campanha | Renata |

## Decision log

| Data | Contexto | Decisão | Autor | Consequência |
|---|---|---|---|---|
| 2026-08-05 | Nome anterior da Timeline | usar mockup nesta fase | Ronaldo Mazuhim | simulações devem ser identificadas |
| 2026-08-05 | Persistência de projetos | manter durante a sessão | Ronaldo Mazuhim | não exigir backend nesta baseline |
| 2026-08-05 | Squad de lançamento | arquitetura com marketing, PM, UX/UI e revisão aprovada | Ronaldo Mazuhim | pipeline autorizado |

## Decisão solicitada

Após a auditoria UX/UI, aprovar no checkpoint:

1. `CONDITIONAL GO` para preparar um piloto fechado, condicionado às correções críticas de Timeline, nome dinâmico, clareza dos mockups e validação do dashboard.
2. Priorizar inicialmente PMOs/diretores de operações de empresas com múltiplos projetos ativos como hipótese de ICP, mantendo uma segunda hipótese somente se houver acesso real a entrevistas.
3. Nomear responsáveis por analytics e suporte antes do G3.

