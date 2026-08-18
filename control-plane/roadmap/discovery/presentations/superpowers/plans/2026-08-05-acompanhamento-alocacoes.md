# Página de Acompanhamento de Alocações — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a tela de Equipe por uma página responsiva que mostre profissionais, projetos e atividades atribuídas, com filtros e detalhes expansíveis.

**Architecture:** Uma função pura em `src/lib/teamAllocation.ts` transforma `teamMembers`, `projects` e filtros em uma visão única usada pela interface. `Team.tsx` mantém somente os filtros e IDs expandidos; desktop e mobile consomem o mesmo resultado derivado. A rota `/team` é preservada e apenas o rótulo do menu muda para `Alocações`.

**Tech Stack:** React 18, TypeScript, React Router, Tailwind CSS, componentes shadcn já instalados, Vitest e Testing Library.

## Global Constraints

- Preservar a rota `/team`.
- Não adicionar dependências, backend, persistência ou store global.
- Não permitir edição de alocação nesta versão.
- Não calcular carga, disponibilidade ou sobrecarga sem dados reais de capacidade.
- Derivar todas as informações de `teamMembers`, `projects` e `tasks`.
- Mostrar status e prioridade por texto, nunca somente por cor.
- Exibir tabela em desktop e cards em telas menores.
- Manter profissionais sem tarefas na visão sem filtros de projeto ou status.
- Tratar tarefa com projeto inexistente sem quebrar a página.
- Usar TDD e commits pequenos por tarefa.

---

## File Structure

- Create `src/lib/teamAllocation.ts`: tipos e função pura de agregação, filtragem, agrupamento e próxima entrega.
- Create `src/lib/teamAllocation.test.ts`: testes unitários da regra derivada.
- Modify `src/pages/Team.tsx`: indicadores, filtros, tabela, cards e expansão.
- Create `src/pages/Team.test.tsx`: testes de integração da página.
- Modify `src/components/layout/AppSidebar.tsx`: alterar somente o rótulo do menu.

### Task 1: Derivar a visão de alocações

**Files:**
- Create: `src/lib/teamAllocation.ts`
- Test: `src/lib/teamAllocation.test.ts`

**Interfaces:**
- Consumes: `TeamMember`, `Project`, `Task`, `TaskStatus` de `src/data/mockData.ts`.
- Produces: `buildTeamAllocations(members, projects, filters): TeamAllocation[]`.
- Produces: `TeamAllocationFilters`, `TeamAllocation`, `ProjectActivityGroup`.
- Produces: `formatAllocationDate(value?: string): string`.

- [ ] **Step 1: Escrever o teste de agregação e ordenação**

```ts
import { describe, expect, it } from 'vitest';
import { projects, teamMembers } from '@/data/mockData';
import { buildTeamAllocations, formatAllocationDate } from './teamAllocation';

describe('buildTeamAllocations', () => {
  it('agrega projetos, atividades abertas e próxima entrega por profissional', () => {
    const allocations = buildTeamAllocations(teamMembers, projects, {
      search: '',
      projectId: 'all',
      taskStatus: 'all',
    });

    const carlos = allocations.find(({ member }) => member.name === 'Carlos Souza');

    expect(carlos?.activeProjects.map(({ id }) => id)).toEqual(['1']);
    expect(carlos?.openTasks.map(({ id }) => id)).toEqual(['t4']);
    expect(carlos?.nextDelivery).toBe('2026-03-10');
  });
});
```

- [ ] **Step 2: Executar o teste para confirmar falha**

Run: `npm test -- src/lib/teamAllocation.test.ts`

Expected: FAIL porque `./teamAllocation` ainda não existe.

- [ ] **Step 3: Implementar tipos e agregação mínima**

```ts
import type { Project, Task, TaskStatus, TeamMember } from '@/data/mockData';

export interface TeamAllocationFilters {
  search: string;
  projectId: string;
  taskStatus: TaskStatus | 'all';
}

export interface ProjectActivityGroup {
  project: Project;
  tasks: Task[];
}

export interface TeamAllocation {
  member: TeamMember;
  activeProjects: Project[];
  visibleTasks: Task[];
  openTasks: Task[];
  nextDelivery?: string;
  groups: ProjectActivityGroup[];
}

export function formatAllocationDate(value?: string) {
  if (!value) return 'Data não informada';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? 'Data não informada'
    : new Intl.DateTimeFormat('pt-BR').format(date);
}

export function buildTeamAllocations(
  members: TeamMember[],
  projects: Project[],
  filters: TeamAllocationFilters,
): TeamAllocation[] {
  const projectById = new Map(projects.map(project => [project.id, project]));

  return members.map(member => {
    const assignedTasks = projects.flatMap(project => project.tasks)
      .filter(task => task.assignee.id === member.id);
    const visibleTasks = assignedTasks.filter(task =>
      (filters.projectId === 'all' || task.projectId === filters.projectId) &&
      (filters.taskStatus === 'all' || task.status === filters.taskStatus)
    );
    const openTasks = visibleTasks.filter(task => task.status !== 'done');
    const activeProjects = projects.filter(project =>
      project.status !== 'completed' &&
      (project.members.some(person => person.id === member.id) ||
        assignedTasks.some(task => task.projectId === project.id))
    );
    const groups = [...new Set(visibleTasks.map(task => task.projectId))]
      .map(projectId => ({
        project: projectById.get(projectId),
        tasks: visibleTasks.filter(task => task.projectId === projectId),
      }))
      .filter((group): group is ProjectActivityGroup => Boolean(group.project));

    return {
      member,
      activeProjects,
      visibleTasks,
      openTasks,
      nextDelivery: openTasks.map(task => task.endDate).sort()[0],
      groups,
    };
  }).filter(allocation => {
    const term = filters.search.trim().toLowerCase();
    const matchesSearch = !term || [
      allocation.member.name,
      allocation.member.role,
      allocation.member.email,
    ].some(value => value.toLowerCase().includes(term));
    const requiresTaskMatch = filters.projectId !== 'all' || filters.taskStatus !== 'all';
    return matchesSearch && (!requiresTaskMatch || allocation.visibleTasks.length > 0);
  });
}
```

- [ ] **Step 4: Executar o teste e confirmar sucesso**

Run: `npm test -- src/lib/teamAllocation.test.ts`

Expected: PASS.

- [ ] **Step 5: Adicionar casos de filtros, agrupamento e dados inválidos**

```ts
it('mantém profissionais sem tarefas quando não há filtro de projeto ou status', () => {
  const member = { id: 'empty', name: 'Sem Tarefas', email: 'empty@test.dev', role: 'Analista', avatar: 'ST' };
  const result = buildTeamAllocations([member], projects, {
    search: '', projectId: 'all', taskStatus: 'all',
  });
  expect(result).toHaveLength(1);
  expect(result[0].visibleTasks).toEqual([]);
});

it('ignora no agrupamento uma tarefa cujo projeto não existe', () => {
  const orphan = { ...projects[0].tasks[0], projectId: 'missing' };
  const source = [{ ...projects[0], tasks: [orphan] }];
  const result = buildTeamAllocations(teamMembers, source, {
    search: '', projectId: 'all', taskStatus: 'all',
  });
  expect(result.find(item => item.member.id === orphan.assignee.id)?.groups).toEqual([]);
});

it('formata datas válidas e protege datas ausentes ou inválidas', () => {
  expect(formatAllocationDate('2026-03-10')).toBe('10/03/2026');
  expect(formatAllocationDate()).toBe('Data não informada');
  expect(formatAllocationDate('invalid')).toBe('Data não informada');
});
```

```ts
it('aplica busca, projeto e status', () => {
  const bySearch = buildTeamAllocations(teamMembers, projects, {
    search: 'designer', projectId: 'all', taskStatus: 'all',
  });
  expect(bySearch.map(item => item.member.name)).toEqual(['Marina Costa']);

  const byProjectAndStatus = buildTeamAllocations(teamMembers, projects, {
    search: '', projectId: '2', taskStatus: 'in_progress',
  });
  expect(byProjectAndStatus.map(item => item.member.name)).toEqual(['Pedro Oliveira']);
  expect(byProjectAndStatus[0].groups[0].project.id).toBe('2');
});
```

- [ ] **Step 6: Rodar a suíte unitária final**

Run: `npm test -- src/lib/teamAllocation.test.ts`

Expected: todos os testes em `teamAllocation.test.ts` passam.

- [ ] **Step 7: Commitar a lógica derivada**

```bash
git add src/lib/teamAllocation.ts src/lib/teamAllocation.test.ts
git commit -m "feat: derive team activity allocations"
```

### Task 2: Construir a página responsiva

**Files:**
- Modify: `src/pages/Team.tsx`
- Create: `src/pages/Team.test.tsx`

**Interfaces:**
- Consumes: `buildTeamAllocations`, `TeamAllocationFilters` da Task 1.
- Consumes: `teamMembers`, `projects`, `getTaskStatusLabel`, `getTaskStatusColor`, `getPriorityLabel`, `getPriorityColor`.
- Produces: página `/team` com indicadores, filtros, tabela/cards e expansão acessível.

- [ ] **Step 1: Escrever o teste de indicadores e profissionais**

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Team from './Team';

const renderPage = () => render(
  <MemoryRouter>
    <Team />
  </MemoryRouter>
);

describe('Team allocation page', () => {
  it('mostra indicadores e todos os profissionais inicialmente', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Alocação da Equipe' })).toBeInTheDocument();
    expect(screen.getByText('Profissionais')).toBeInTheDocument();
    expect(screen.getByText('Projetos ativos')).toBeInTheDocument();
    expect(screen.getByText('Atividades abertas')).toBeInTheDocument();
    expect(screen.getByText('Atividades críticas')).toBeInTheDocument();
    expect(screen.getByText('Ana Silva')).toBeInTheDocument();
    expect(screen.getByText('Rafael Lima')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Executar o teste para confirmar falha**

Run: `npm test -- src/pages/Team.test.tsx`

Expected: FAIL porque a página atual ainda usa o título `Equipe` e não possui os indicadores.

- [ ] **Step 3: Implementar composição mínima da página**

Em `Team.tsx`:

```tsx
const [search, setSearch] = useState('');
const [projectId, setProjectId] = useState('all');
const [taskStatus, setTaskStatus] = useState<TaskStatus | 'all'>('all');
const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

const allocations = useMemo(() => buildTeamAllocations(teamMembers, projects, {
  search,
  projectId,
  taskStatus,
}), [search, projectId, taskStatus]);

const activeProjects = projects.filter(project => project.status !== 'completed');
const openTasks = projects.flatMap(project => project.tasks).filter(task => task.status !== 'done');
const criticalTasks = openTasks.filter(task => task.priority === 'critical');
```

Renderizar:

- cabeçalho e subtítulo aprovados;
- grid de quatro cards de indicadores;
- busca com `<label htmlFor="allocation-search">`;
- selects nativos ou componentes `Select` já instalados para projeto e status;
- tabela com `hidden md:table`;
- cards com `md:hidden`;
- botão de expansão com `aria-expanded` e nome do profissional;
- detalhes agrupados por projeto;
- estado sem resultados e botão de limpar filtros.

Usar `formatAllocationDate` da Task 1 para todas as datas apresentadas:

```ts
formatAllocationDate(allocation.nextDelivery)
```

Se `teamMembers.length === 0`, mostrar `Nenhum profissional cadastrado`. Se há profissionais, mas `allocations.length === 0`, mostrar `Nenhuma alocação encontrada` e o botão para limpar filtros.

- [ ] **Step 4: Executar o teste básico e confirmar sucesso**

Run: `npm test -- src/pages/Team.test.tsx`

Expected: PASS no teste de indicadores e profissionais.

- [ ] **Step 5: Escrever testes de filtros, expansão e navegação**

```tsx
import { fireEvent } from '@testing-library/react';

it('filtra por busca e permite limpar os filtros', () => {
  renderPage();
  fireEvent.change(screen.getByLabelText('Buscar profissional'), { target: { value: 'Julia' } });
  expect(screen.getByText('Julia Santos')).toBeInTheDocument();
  expect(screen.queryByText('Carlos Souza')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
  expect(screen.getByText('Carlos Souza')).toBeInTheDocument();
});

it('expande atividades agrupadas e cria links para os projetos', () => {
  renderPage();
  fireEvent.click(screen.getByRole('button', { name: 'Ver atividades de Carlos Souza' }));
  expect(screen.getByText('Implementar dashboard')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'ProjectFlow MVP' })).toHaveAttribute('href', '/projects/1');
});

it('filtra por projeto e status e mostra o estado vazio', () => {
  renderPage();
  fireEvent.change(screen.getByLabelText('Projeto'), { target: { value: '4' } });
  fireEvent.change(screen.getByLabelText('Status da atividade'), { target: { value: 'done' } });
  expect(screen.getByText('Nenhuma alocação encontrada')).toBeInTheDocument();
});

it('recolhe as atividades abertas', () => {
  renderPage();
  const trigger = screen.getByRole('button', { name: 'Ver atividades de Carlos Souza' });
  fireEvent.click(trigger);
  expect(screen.getByText('Implementar dashboard')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Ocultar atividades de Carlos Souza' }));
  expect(screen.queryByText('Implementar dashboard')).not.toBeInTheDocument();
});
```

- [ ] **Step 6: Implementar os blocos de interface exigidos pelos testes**

```tsx
const clearFilters = () => {
  setSearch('');
  setProjectId('all');
  setTaskStatus('all');
};

const toggleMember = (memberId: string) => {
  setExpandedIds(current => {
    const next = new Set(current);
    next.has(memberId) ? next.delete(memberId) : next.add(memberId);
    return next;
  });
};
```

Usar `getTaskStatusLabel`, `getTaskStatusColor`, `getPriorityLabel` e `getPriorityColor` para os badges. Usar `<Link to={`/projects/${group.project.id}`}>` nos títulos de projeto. Renderizar a mesma lista de grupos no detalhe desktop e mobile; não criar um sistema genérico de tabela ou filtros.

- [ ] **Step 7: Executar testes da página e lógica**

Run: `npm test -- src/pages/Team.test.tsx src/lib/teamAllocation.test.ts`

Expected: todos os testes passam.

- [ ] **Step 8: Commitar a página**

```bash
git add src/pages/Team.tsx src/pages/Team.test.tsx
git commit -m "feat: show team project allocations"
```

### Task 3: Integrar navegação e verificar a entrega

**Files:**
- Modify: `src/components/layout/AppSidebar.tsx`
- Create: `src/components/layout/AppSidebar.test.tsx`

**Interfaces:**
- Consumes: rota existente `/team` em `src/App.tsx`.
- Produces: menu com rótulo `Alocações`, sem alteração de rota.

- [ ] **Step 1: Adicionar asserção do rótulo de navegação**

Criar `src/components/layout/AppSidebar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/components/theme-provider';
import AppSidebar from './AppSidebar';

describe('AppSidebar', () => {
  it('expõe Alocações na rota existente de equipe', () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="sidebar-test-theme">
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByRole('link', { name: 'Alocações' })).toHaveAttribute('href', '/team');
    expect(screen.queryByRole('link', { name: 'Equipe' })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Executar o teste para confirmar falha**

Run: `npm test -- src/components/layout/AppSidebar.test.tsx`

Expected: FAIL porque o menu ainda exibe `Equipe`.

- [ ] **Step 3: Alterar somente o rótulo do menu**

Em `src/components/layout/AppSidebar.tsx`:

```tsx
{ to: '/team', icon: Users, label: 'Alocações' },
```

Não alterar `src/App.tsx`; a rota já satisfaz a especificação.

- [ ] **Step 4: Executar testes focados**

Run: `npm test -- src/pages/Team.test.tsx src/lib/teamAllocation.test.ts src/components/layout/AppSidebar.test.tsx`

Expected: todos os testes passam.

- [ ] **Step 5: Executar a suíte completa**

Run: `npm test`

Expected: todos os testes passam. Se houver falha preexistente, registrar arquivo, teste e evidência sem alterar escopo.

- [ ] **Step 6: Executar lint e build**

Run: `npm run lint`

Expected: nenhuma nova falha nos arquivos alterados; registrar separadamente falhas preexistentes.

Run: `npm run build`

Expected: build concluído com sucesso.

- [ ] **Step 7: Verificar escopo do diff**

Run: `git status --short && git diff --check`

Expected: somente arquivos da página de alocações e alterações preexistentes do usuário; nenhum whitespace error novo.

- [ ] **Step 8: Commitar integração final**

```bash
git add src/components/layout/AppSidebar.tsx src/components/layout/AppSidebar.test.tsx
git commit -m "feat: expose allocations in navigation"
```
