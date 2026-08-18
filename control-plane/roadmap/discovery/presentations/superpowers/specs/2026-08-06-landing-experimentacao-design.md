# Landing page de experimentação do ProjectFlow

Data: 2026-08-06  
Produto: ProjectFlow  
Status: design aprovado

## Objetivo

Reformular a tela inicial pública para comunicar, em linguagem executiva, como o ProjectFlow melhora acompanhamento, previsibilidade e tomada de decisão. A conversão desta versão consiste em levar o visitante diretamente à experimentação do dashboard, sem cobrança ou cadastro obrigatório.

## Público e mensagem

O conteúdo se dirige principalmente a diretores, gestores de projetos e responsáveis por portfólio. A mensagem central será `Transforme projetos em decisões previsíveis`.

A página deve apresentar resultados observáveis do uso do produto:

- visão consolidada do portfólio;
- identificação antecipada de riscos e atrasos;
- transparência sobre projetos, atividades e alocação profissional;
- decisões apoiadas por indicadores e progresso real.

Não serão feitas promessas que o produto atual não comprova, como criptografia de ponta, projetos ilimitados ou ganho quantitativo de produtividade.

## Estrutura da página

### Cabeçalho

O cabeçalho apresenta a marca padronizada como `ProjectFlow`, links internos para `Benefícios` e `Como funciona`, uma ação secundária `Entrar` e a ação principal `Experimentar grátis`.

Enquanto não houver autenticação, `Entrar` e `Experimentar grátis` apontam para `/dashboard` na mesma aba. Os links internos usam âncoras da própria página.

### Hero

O hero usa duas colunas em telas amplas e uma coluna em telas menores.

À esquerda:

- identificação curta do produto como gestão orientada por dados;
- título `Transforme projetos em decisões previsíveis`;
- texto que conecta prazo, risco, progresso e alocação;
- botão `Experimentar grátis`;
- mensagem curta informando que a exploração é imediata e sem cadastro.

À direita, uma composição visual criada com HTML e CSS representa a interface real do produto, com indicadores, progresso de portfólio, alertas e alocação. Ela é ilustrativa, acessível como elemento decorativo e não deve fingir interação.

### Benefícios

A seção `Benefícios` contém quatro resultados de negócio:

1. **Previsibilidade do portfólio:** visualizar progresso e próximas entregas.
2. **Riscos antecipados:** reconhecer atrasos e atividades críticas antes que comprometam a entrega.
3. **Alocação transparente:** entender onde profissionais e atividades estão distribuídos.
4. **Decisões data-driven:** reunir indicadores relevantes em uma leitura executiva.

Cada benefício possui ícone, título e descrição curta. Status ou significado nunca são comunicados somente por cor.

### Como funciona

A seção `Como funciona` apresenta três passos:

1. Planeje projetos e atividades.
2. Acompanhe progresso, riscos e alocação.
3. Decida com uma visão consolidada.

### Chamada final e rodapé

A chamada final reforça a experimentação direta e contém apenas `Experimentar grátis`, apontando para `/dashboard`.

O rodapé é enxuto, com marca e direitos autorais. Não exibe preço, oferta limitada ou checkout.

## Direção visual

A landing usa o sistema visual existente: Tailwind, tokens de tema, componentes shadcn e ícones Lucide já instalados. Não serão adicionadas dependências nem imagens externas.

- fundo claro com superfícies elevadas e detalhes em roxo/azul;
- verde reservado a indicadores positivos;
- tipografia e espaçamento com hierarquia executiva;
- composição visual do dashboard baseada em cards, barras e alertas;
- movimentos discretos somente com CSS e respeito a `prefers-reduced-motion`;
- responsividade completa, com preview abaixo do hero no celular;
- foco visível, navegação por teclado e textos acessíveis.

## Comportamento

- A rota pública permanece `/`.
- A rota do produto permanece `/dashboard`.
- Todos os CTAs de experimentação e o botão `Entrar` usam navegação interna para `/dashboard`.
- O `SignupPopup` deixa de ser renderizado na landing.
- O arquivo do popup pode permanecer sem uso; sua remoção está fora do escopo.
- Não haverá estado local, formulário, persistência, checkout ou integração externa nesta página.

## Arquitetura

A alteração fica concentrada em `src/pages/Landing.tsx` e seu teste. A página usa dados de apresentação definidos localmente em pequenos arrays para benefícios e passos, renderizados diretamente. Não será criado um sistema genérico de marketing, novos componentes compartilhados ou camada de dados.

`src/App.tsx` já aponta `/` para `Landing` e não precisa ser alterado.

## Testes

Os testes automatizados da landing devem verificar:

- título e proposta de valor;
- quatro benefícios e três passos;
- CTAs e `Entrar` apontando para `/dashboard`;
- âncoras de navegação para benefícios e funcionamento;
- ausência de preço, checkout, oferta limitada e diálogo de cadastro;
- presença da prévia ilustrativa sem controles falsamente interativos.

Depois dos testes focados, a entrega exige suíte completa, lint dos arquivos alterados, build de produção e `git diff --check`.

## Critérios de aceitação

1. A página inicial comunica benefícios em linguagem executiva e orientada à tomada de decisão.
2. Nenhum preço, checkout ou urgência promocional aparece.
3. Nenhum popup ou cadastro bloqueia a exploração.
4. Todos os CTAs relevantes levam diretamente ao dashboard.
5. A composição funciona em desktop, tablet e celular sem overflow.
6. A landing preserva acessibilidade básica, tema e padrões do produto.
7. Nenhuma nova dependência, backend ou persistência é adicionada.
