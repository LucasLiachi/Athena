# Dashboard executivo data-driven

## Objetivo

Transformar o dashboard do ProjectFlow em uma ferramenta de acompanhamento e previsibilidade para a diretoria. A tela deve permitir entender, em poucos segundos, o desempenho do portfólio, identificar desvios e aprofundar a análise sem navegar para outra página.

## Princípio de leitura

A informação seguirá uma sequência única:

1. desempenho geral do portfólio;
2. evolução em relação ao planejamento;
3. projetos com provável desvio de prazo;
4. concentração de risco e carga operacional.

O dashboard manterá a identidade visual existente, com fundo neutro, cartões brancos, cor primária violeta e cores semânticas para sucesso, atenção e risco. A composição evitará painéis concorrentes e elementos decorativos sem função analítica.

## Estrutura da tela

### Cabeçalho e filtros globais

O cabeçalho exibirá o título “Desempenho do portfólio”, uma descrição curta e dois filtros:

- projeto: todos ou um projeto específico;
- período: 30, 60 ou 90 dias.

Os filtros afetarão todos os indicadores e gráficos. Quando um elemento de gráfico for selecionado, a tela mostrará o filtro contextual aplicado e uma ação para limpar a seleção.

### Indicadores executivos

Quatro indicadores permanecerão visíveis no topo:

- progresso médio do portfólio;
- percentual de projetos entregues ou previstos no prazo;
- risco médio do portfólio e quantidade acima do limite;
- percentual de tarefas concluídas.

Cada indicador mostrará o valor atual e um contexto curto, como variação no período ou relação entre parte e total. Não serão usados percentuais de tendência sem uma série histórica que sustente o cálculo.

### Evolução planejada versus realizada

Um gráfico de linhas mostrará a evolução acumulada do progresso planejado e realizado no período selecionado.

- O eixo horizontal representará datas.
- O eixo vertical representará progresso acumulado de 0% a 100%.
- O tooltip mostrará data, planejado, realizado e diferença em pontos percentuais.
- O gráfico destacará visualmente o desvio atual.
- Ao selecionar um projeto, a série exibirá apenas esse projeto; sem seleção, mostrará a média ponderada do portfólio.

### Previsão de entrega

Um gráfico de barras horizontais ordenará os projetos pelo desvio previsto entre a data planejada e a data estimada de conclusão.

- Valores positivos indicarão dias de atraso.
- Valores iguais ou menores que zero indicarão entrega dentro do prazo.
- O tooltip mostrará prazo original, previsão atual, desvio e nível de risco.
- O clique em uma barra filtrará os demais gráficos pelo projeto correspondente.

### Mapa de risco

Um gráfico de dispersão posicionará cada projeto por progresso e risco:

- eixo horizontal: progresso do projeto;
- eixo vertical: risco de atraso;
- tamanho da bolha: quantidade de tarefas abertas;
- cor: status do projeto.

O tooltip mostrará projeto, responsável, progresso, risco, tarefas abertas e previsão de entrega. O clique em uma bolha aplicará o projeto como filtro contextual.

### Carga por responsável

Um gráfico de barras horizontais apresentará a carga de tarefas abertas por responsável, ponderada pela prioridade:

- baixa: peso 1;
- média: peso 2;
- alta: peso 3;
- crítica: peso 4.

O tooltip mostrará a pontuação e a quantidade de tarefas por prioridade. A seleção de uma pessoa realçará os projetos e pontos do mapa de risco que dependem dela, sem alterar o filtro global de projeto.

## Dados e regras de cálculo

Os dados atuais já fornecem projetos, tarefas, responsáveis, progresso, datas e risco. Para sustentar a análise temporal e a previsão, a camada de dados do dashboard deverá expor também:

- pontos históricos de progresso planejado e realizado;
- data prevista de conclusão por projeto;
- data de referência da última atualização.

Enquanto não houver uma fonte persistida, esses campos serão adicionados aos dados simulados de forma explícita. O dashboard não calculará uma “previsão inteligente” a partir de dados insuficientes nem apresentará dados financeiros fictícios.

As métricas serão calculadas em funções puras e reutilizáveis, separadas da renderização dos gráficos. Datas serão comparadas em dias corridos e exibidas em português do Brasil.

## Interações e estados

- Tooltips serão acessíveis por ponteiro e foco de teclado.
- Elementos clicáveis terão estado selecionado visível e rótulo acessível.
- Os gráficos responderão ao tema claro e escuro.
- Em telas pequenas, os cartões formarão duas colunas e os gráficos serão empilhados.
- Sem dados, cada gráfico exibirá uma mensagem específica em vez de uma área vazia.
- Valores inválidos ou ausentes serão omitidos do cálculo e sinalizados no contexto do gráfico.
- Animações respeitarão a preferência de redução de movimento do sistema.

## Componentes

- `DashboardFilters`: controla projeto e período.
- `ExecutiveMetrics`: renderiza os quatro indicadores.
- `PortfolioProgressChart`: planejado versus realizado.
- `DeliveryForecastChart`: desvio previsto por projeto.
- `RiskMapChart`: risco, progresso e tarefas abertas.
- `WorkloadChart`: carga ponderada por responsável.
- `dashboardMetrics`: funções puras de filtragem e cálculo.

Os componentes usarão Recharts e o wrapper de gráficos já instalados no projeto. Não será adicionada uma nova dependência.

## Verificação

Testes unitários validarão os cálculos de métricas, filtros, desvio de entrega e carga ponderada. Testes de componente verificarão mudança de filtros, estados vazios e seleção cruzada. A validação final incluirá build, lint, testes automatizados e inspeção visual em larguras desktop e mobile, nos temas claro e escuro.

## Fora do escopo

- análise financeira no dashboard principal;
- modelos de inteligência artificial ou previsão estatística;
- persistência de filtros entre sessões;
- exportação de gráficos;
- criação de novas fontes de dados no Supabase.

Esses itens só serão considerados quando houver dados reais e um requisito específico para sustentá-los.
