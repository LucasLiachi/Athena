# Página de acompanhamento de alocações

Data: 2026-08-05  
Produto: ProjectFlow  
Status: design aprovado

## Objetivo

Substituir a página atual de Equipe por uma visão de acompanhamento que permita identificar rapidamente onde cada profissional está alocado, em quais projetos atua e quais atividades estão sob sua responsabilidade.

A página deve apoiar leitura executiva e tomada de decisão sem introduzir edição de alocação, persistência adicional ou um modelo artificial de capacidade.

## Escopo

### Incluído

- Preservar a rota `/team`.
- Alterar o item do menu de `Equipe` para `Alocações`.
- Exibir indicadores consolidados.
- Permitir busca e filtros.
- Mostrar uma linha por profissional em telas maiores.
- Permitir expandir o profissional para visualizar atividades agrupadas por projeto.
- Usar cards expansíveis no celular.
- Navegar para os detalhes do projeto ao selecionar seu nome.
- Derivar todas as informações de `teamMembers`, `projects` e `tasks`.
- Cobrir comportamento essencial com testes automatizados.

### Fora do escopo

- Criar, remover ou transferir alocações.
- Definir disponibilidade em horas ou percentual.
- Calcular sobrecarga sem capacidade contratada ou disponível.
- Persistir filtros ou expansões após recarregar a página.
- Criar backend, banco de dados ou novas dependências.
- Alterar os dados mockados existentes.

## Decisões de produto

### Página e navegação

A implementação substitui o conteúdo de `src/pages/Team.tsx`, preservando a rota para evitar migração desnecessária. O menu lateral apresenta o rótulo `Alocações` com o ícone atual de equipe.

O título da página será `Alocação da Equipe`, acompanhado do texto `Acompanhe profissionais, projetos e atividades em andamento`.

### Indicadores

O topo contém quatro indicadores derivados dos dados atuais:

1. **Profissionais:** total de membros cadastrados.
2. **Projetos ativos:** projetos cujo status não é `completed`.
3. **Atividades abertas:** tarefas cujo status não é `done`.
4. **Atividades críticas:** tarefas abertas cuja prioridade é `critical`.

Os indicadores não recebem tendências ou comparações históricas porque o modelo atual não fornece séries temporais adequadas.

### Filtros

A página possui três controles:

- busca textual por nome, função ou e-mail do profissional;
- seleção de projeto;
- seleção de status da atividade.

Os filtros alteram somente a visualização. O status padrão é `Todos`, e o projeto padrão é `Todos os projetos`. Um botão `Limpar filtros` aparece quando algum filtro está ativo.

Um profissional permanece visível quando satisfaz a busca e possui ao menos uma atividade compatível com os filtros de projeto/status. Sem filtros de projeto ou status, todos os profissionais são exibidos, inclusive aqueles sem atividades.

### Visão principal

Em telas médias e grandes, a visão utiliza uma tabela com as colunas:

- profissional;
- função;
- projetos ativos;
- atividades abertas;
- próxima entrega;
- ação de expandir.

`Projetos ativos` considera apenas projetos não concluídos nos quais o profissional aparece em `members` ou possui tarefas atribuídas. As atividades abertas são tarefas atribuídas cujo status não é `done`.

`Próxima entrega` mostra a menor `endDate` entre as atividades abertas visíveis. Quando não houver atividade aberta, apresenta `Sem entrega pendente`.

Não haverá classificação de carga como baixa, adequada ou sobrecarregada. A interface apresenta apenas contagens observáveis.

### Detalhes expansíveis

Ao expandir uma linha, a página mostra as atividades compatíveis com os filtros, agrupadas pelo projeto correspondente.

Cada atividade apresenta:

- título;
- status;
- prioridade;
- progresso;
- período entre `startDate` e `endDate`.

O nome do projeto é um link para `/projects/:id`. Projetos sem atividades compatíveis não aparecem na área expandida.

Se o profissional não possuir atividades, a área expandida apresenta `Nenhuma atividade atribuída`.

### Responsividade

Em telas menores, a tabela é substituída por cards. Cada card mantém as mesmas informações resumidas e o mesmo conteúdo expansível. Filtros ocupam uma coluna e permanecem acessíveis por rótulos visíveis.

## Arquitetura

### Componentes

A solução mínima utiliza:

- `Team.tsx` como composição da página e estado dos filtros;
- um módulo puro `src/lib/teamAllocation.ts` para derivar a visão;
- componentes locais pequenos somente quando reduzirem repetição clara entre tabela e cards.

Não será criada uma camada genérica de repositório, store global ou contexto. Os dados atuais são importados diretamente de `mockData`.

### Modelo derivado

O módulo puro expõe uma função que recebe membros, projetos e filtros e retorna uma lista de alocações. Cada item contém:

- membro;
- projetos ativos relacionados;
- atividades visíveis;
- atividades abertas;
- próxima entrega;
- atividades agrupadas por projeto.

O mesmo retorno alimenta tabela e cards, evitando regras duplicadas na interface.

### Estado local

A página mantém apenas:

- `search`;
- `projectId`;
- `taskStatus`;
- conjunto de IDs expandidos.

Os dados derivados são calculados com `useMemo`. A expansão não altera filtros nem dados.

## Acessibilidade

- Busca e seletores possuem rótulos associados.
- Botão de expansão informa `aria-expanded` e o profissional relacionado.
- Status e prioridade usam texto além de cor.
- Links de projeto têm nome descritivo.
- A ordem de foco acompanha a ordem visual.
- O conteúdo expandido permanece acessível por teclado.
- O estado sem resultados informa o motivo e oferece limpar filtros.

## Estados e tratamento de ausência de dados

- **Sem profissionais:** mostrar mensagem de cadastro indisponível nesta versão.
- **Sem resultado de filtros:** informar `Nenhuma alocação encontrada` e oferecer `Limpar filtros`.
- **Profissional sem atividade:** manter o profissional na visão padrão e mostrar contagem zero.
- **Tarefa com projeto não encontrado:** ignorar o agrupamento inválido sem quebrar a página.
- **Data inválida:** exibir `Data não informada`.

Não há loading ou erro remoto porque a página usa dados locais síncronos.

## Testes

### Lógica derivada

- agrega projetos e tarefas por profissional;
- exclui tarefas concluídas das atividades abertas;
- encontra a próxima entrega corretamente;
- aplica busca, projeto e status;
- mantém profissionais sem tarefas na visão sem filtros;
- agrupa atividades pelo projeto correto;
- lida com tarefa cujo projeto não existe.

### Integração da página

- renderiza os quatro indicadores;
- mostra todos os profissionais inicialmente;
- filtra por busca, projeto e status;
- limpa filtros;
- expande e recolhe atividades;
- mostra o estado sem resultados;
- gera links corretos para detalhes do projeto.

## Critérios de aceite

1. O menu mostra `Alocações` e mantém a rota `/team`.
2. A página mostra os quatro indicadores calculados a partir de `mockData`.
3. Cada profissional exibe projetos ativos, atividades abertas e próxima entrega.
4. A expansão mostra atividades agrupadas por projeto com status, prioridade, progresso e período.
5. Busca e filtros funcionam em conjunto e podem ser limpos.
6. Profissionais sem tarefas permanecem visíveis quando não há filtro de projeto/status.
7. O layout funciona como tabela em desktop e cards no celular.
8. Todos os controles são utilizáveis por teclado e não dependem apenas de cor.
9. Nenhuma dependência ou persistência nova é adicionada.
10. Testes da lógica e integração passam, assim como o build do projeto.

## Impacto no lançamento

Esta página melhora a visibilidade operacional do piloto, mas não representa gestão de capacidade. Qualquer comunicação pública deve usar `acompanhamento de alocações e atividades`, evitando prometer balanceamento automático ou previsão de disponibilidade até que o produto tenha dados reais de capacidade.

