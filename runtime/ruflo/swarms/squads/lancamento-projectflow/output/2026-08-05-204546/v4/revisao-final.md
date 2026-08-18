# Revisão Final

## Veredito

**`HOLD`** para lançamento público e para autorização de piloto fechado enquanto as alterações obrigatórias não forem executadas. Este veredito é matematicamente forçado: média 5,83 (< 7) e três critérios abaixo de 4 (UX/UI = 3, Evidência = 3, Operação = 2), o que dispara veto automático pela rubrica. Não há número inventado, fonte ausente nem mockup apresentado como resultado real — o veto não vem de desonestidade, vem de evidência ausente e prontidão de operação não resolvida. O `CONDITIONAL GO` para evolução interna do produto, já registrado pelo sponsor em `prioridades-aprovadas.md`, permanece válido como condição prévia, mas não autoriza nada público.

## Revisão 1 de 3

Primeira revisão independente deste pacote de lançamento. Ciclo registrado para rastreio de recorrência: os bloqueios de **múltiplos projetos não implementado** e **nome do Gantt hardcoded** já haviam sido reportados na revisão anterior e voltam a aparecer aqui sem correção implementada (recorrência). A auditoria UX/UI (etapa 02) foi pulada por decisão do usuário após duas falhas de gravação do subagente; o artefato `prontidao-ux.md` não existe e foi avaliado como limitação, não como achado inventado.

## Tabela de pontuação

| Critério | Nota | Justificativa |
|---|---|---|
| Governança | 9 | 100% dos gates G0–G4 têm critérios, evidências, decisor e recomendação registrados; todo workstream tem accountable único (Ronaldo Mazuhim); blockers do RAID têm ação, owner e prazo; forecast M0–M5 é comparado à baseline sem reescrita histórica. Dedução: dependências de analytics e suporte seguem com owner "a designar" e a auditoria da etapa 02 não foi executada, deixando a evidência de G2 em aberto. (`plano-lancamento.md:58-129`) |
| UX/UI | 3 | Auditoria da etapa 02 não executada; `prontidao-ux.md` inexistente. Bloqueios críticos documentados no plano: múltiplos projetos (criar/nomear/alternar) não implementado e Gantt com nome hardcoded — falham diretamente o critério de tarefa principal de G2. Não há evidência de cobertura de estados, de 80% de sucesso sem ajuda, nem de LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1 (percentil 75). Evidência ausente não recebe benefício da dúvida. (`plano-lancamento.md:98-100`, `plano-lancamento.md:123-125`) |
| Estratégia | 9 | ICP H1 completo com segmento, comprador, usuário, gatilho, dor, alternativa e desqualificação; oferta com prazo (21 dias), escopo (um portfólio real), prova de valor e próximo CTA; 3 experimentos com hipótese, owner, métrica, guardrail e data; funil conecta aquisição, ativação, conversão e retenção/receita. Dedução: guardrail do experimento 2 usa "2× média da conta" sem a média de referência definida. (`campanha-lancamento.md:11-116`) |
| Conteúdo | 9 | Primeira linha com tensão concreta e mensurável em todas as peças ("Você descobre que o projeto atrasou quando o atraso já ficou caro"); mockups rotulados em cada formato com nota de transparência; um único CTA mensurável por peça; formato e densidade nativos por canal (Reels 23 s, Stories, Feed escaneável); tom provocativo responsável, sem superlativos nem números inventados. (`campanha-lancamento.md:45-96`) |
| Evidência | 3 | A quase totalidade da evidência exigida pelos gates é planejada, não executada: 0 de 10 entrevistas qualificadas, analytics de ativação sem owner e sem verificação ponta a ponta, dashboard de funil inexistente, auditoria UX ausente, nenhum teste com ICP. O plano é honesto sobre as lacunas, mas honestidade não substitui evidência (princípio 6). (`plano-lancamento.md:34`, `plano-lancamento.md:128`) |
| Operação | 2 | Suporte do piloto com owner "a designar antes do G3" e SLA "a definir"; instrumentação/analytics com owner "a designar antes do G2"; sem responsável por incidentes nomeado; contingência não definida. O gatilho de veto "lançamento sem suporte, instrumentação ou responsável por incidentes" permanece aberto para qualquer decisão de G3. (`plano-lancamento.md:64-65`, `plano-lancamento.md:128-129`) |

**Média: 5,83** · **Menor nota: 2 (Operação)**

## Forças

- Governança madura: gates com critério, evidência e decisor nomeados, e forecast comparado à baseline sem reescrita histórica — o antipadrão "mudar a baseline" é evitado.
- Disciplina de evidência honesta: o plano e a campanha rotulam mockups em toda peça pública e recusam números de clientes/resultados garantidos — o antipadrão "hype sem prova" é evitado.
- Campanha bem estruturada: ICP com desqualificação, oferta com prova de valor, experimentos com guardrail e um CTA único por peça — os antipadrões "lançar para todos", "muitos CTAs" e "mesmo conteúdo em todos os canais" são evitados.
- A campanha aprovada mantém a publicação em `HOLD` condicionada ao G3, coerente com os gates do plano — decisão consistente entre artefatos.

## Alterações obrigatórias

Cada item informa o que corrigir, onde e como verificar a correção.

1. **Executar a auditoria UX/UI (etapa 02) e produzir `prontidao-ux.md`** — Nota UX/UI 3. Onde: fluxos críticos de G2 (criar projeto, alternar projetos, interpretar dashboard, identificar risco). Como verificar: arquivo `prontidao-ux.md` criado em `output/.../v2/` com checklist WCAG 2.2 AA por fluxo (teclado, foco, semântica, contraste, status), cobertura de estados (sucesso/vazio/loading/erro/permissão), resultado de teste de tarefa com meta de 80% de sucesso sem ajuda e medição LCP/INP/CLS no percentil 75 quando houver dados de campo; artefato datado e assinado por Úrsula Usabilidade. Sem este artefato a dimensão permanece abaixo de 4.
2. **Implementar múltiplos projetos e nome dinâmico do Gantt** — Nota UX/UI 3 (tarefa principal). Onde: G2 (`plano-lancamento.md:98`) e RAID (`plano-lancamento.md:123-124`). Como verificar: criar e nomear mais de um projeto, alternar entre projetos sem perda durante a sessão e conferir que o cabeçalho do Gantt exibe o nome do projeto selecionado (remover o nome hardcoded `Mockup`); reprodução manual registrada com data e resultado.
3. **Nomear owners de operação e instrumentação** — Nota Operação 2. Onde: workstreams (`plano-lancamento.md:64-65`) e dependências do RAID (`plano-lancamento.md:128-129`). Como verificar: os campos "a designar" são substituídos por nome e prazo concretos; definidos canal de suporte, SLA e escalonamento; evento de ativação especificado e verificado ponta a ponta; responsável por incidentes nomeado.
4. **Produzir evidência de pesquisa e instrumentação real** — Nota Evidência 3. Onde: meta "10 entrevistas qualificadas" (`plano-lancamento.md:41`) e dependência de analytics (`plano-lancamento.md:128`). Como verificar: registro de entrevistas com data, perfil e descoberta de cada uma; dashboard de funil com eventos confirmados e fonte/período visíveis antes de qualquer declaração de mensagem vencedora.
5. **Reavaliar o escopo de prontidão com a nova prioridade do sponsor** — Onde: `prioridades-aprovadas.md:9-18`. A página de acompanhamento de atividades (alocação por profissional, projeto e atividade) muda o escopo de G2. Como verificar: especificação da página aprovada pelo sponsor antes de implementação e gates/roadmap do plano atualizados refletindo o novo escopo.

## Sugestões não bloqueantes

- Definir a média de referência da conta para o guardrail "cliques ≥ 2× média" do experimento 2 antes de medir (`campanha-lancamento.md:116`).
- Preencher os campos de desqualificação e gatilho da hipótese 2 quando ela for ativada por acesso a entrevistas (`campanha-lancamento.md:21-23`).
- Definir o formato do registro de "decisão antecipada documentada" que servirá de prova de valor do piloto (`campanha-lancamento.md:30`).
- Registrar a decisão de pular a etapa 02 no decision log do plano de lançamento, para que o rastro de decisão fique em um único artefato (`plano-lancamento.md:141-147`).
- Adicionar UTM/link de rastreio ao CTA-pergunta do LinkedIn para tornar a conversa qualificada mensurável por canal (`campanha-lancamento.md:66`).

## Gatilhos de veto

- **Gatilho acionado (veto automático):** critérios abaixo de 4 — UX/UI = 3, Evidência = 3 e Operação = 2. A rubrica manda rejeitar independentemente da média.
- **Gatilho em risco (aberto para G3):** lançamento sem suporte, instrumentação ou responsável por incidentes — todos os três seguem sem owner nomeado. Qualquer tentativa de autorizar G3 antes da alteração obrigatória 3 reincide o veto.
- **Gatilhos NÃO acionados (verificado):** não há número inventado, fonte ausente, mockup apresentado como resultado real, nem promessa pública incompatível com o produto — a campanha rotula mockups e não promete resultados garantidos.

## Caminho para aprovação

Reaprovação exige, nesta ordem:

1. `prontidao-ux.md` criado com auditoria real da etapa 02 e correções de múltiplos projetos + Gantt dinâmico verificadas (UX/UI ≥ 4 e G2 liberável).
2. Owners de suporte, analytics e incidentes nomeados com SLA e prazo (Operação ≥ 4 e gatilho de G3 fechado).
3. 10 entrevistas qualificadas e dashboard de funil instrumentado (Evidência ≥ 4).
4. Especificação da página de acompanhamento de atividades aprovada e escopo de G2 reavaliado.

Com esses quatro itens, a nota mínima plausível das dimensões bloqueadas sobe para ~5 e a média pode atingir ≥ 7, permitindo `CONDITIONAL GO` para piloto fechado; `GO` para lançamento público segue exigindo G1, G2 e G3 aprovados com revisão independente sem veto.

## Próxima decisão

**Gate: G2 — Produto pronto para piloto** (`plano-lancamento.md:96-102`), precedido pela auditoria UX/UI da etapa 02 e pela reavaliação de prontidão com a nova página de acompanhamento de atividades. Decisor: Ronaldo Mazuhim. Decisão esperada: aprovar as alterações obrigatórias 1 a 5, nomear owners e reagendar o checkpoint com o artefato `prontidao-ux.md` em mãos. Esta revisão será a 2 de 3 no próximo ciclo.
