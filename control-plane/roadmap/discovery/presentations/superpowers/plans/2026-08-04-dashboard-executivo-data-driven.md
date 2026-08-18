# Dashboard executivo data-driven Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o dashboard atual por uma visão executiva interativa que explique progresso, previsibilidade, risco e carga de trabalho do portfólio.

**Architecture:** O dashboard deriva todas as visualizações de uma camada de métricas composta por funções puras. A página mantém somente o estado dos filtros e da seleção cruzada; componentes focados renderizam filtros, indicadores e gráficos com Recharts sobre os dados derivados.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Recharts 2, componentes shadcn/ui, Vitest e Testing Library.

## Global Constraints

- Reutilizar `recharts` e `src/components/ui/chart.tsx`; não adicionar dependências.
- Manter os temas claro e escuro e as cores semânticas existentes.
- Exibir datas e números em português do Brasil.
- Filtros globais: projeto e período de 30, 60 ou 90 dias.
- Clique em projeto nos gráficos aplica seleção cruzada; carga por responsável usa realce contextual separado.
- Não apresentar finanças ou previsão por IA; séries temporais e previsões serão dados simulados explícitos.
- Tooltips e seleções devem funcionar com ponteiro e teclado; respeitar `prefers-reduced-motion`.
- Preservar alterações locais não relacionadas ao dashboard.

---

### Task 1: Dados históricos e previsões explícitas

**Files:**
- Modify: `src/data/mockData.ts`
- Test: `src/data/mockData.test.ts`

**Interfaces:**
- Produces: `ProjectHistoryPoint`, `projectHistory`, `Project.predictedEndDate`, `Project.updatedAt`.
- Consumes: tipos `Project` e projetos simulados existentes.

- [ ] **Step 1: Escrever o teste que valida a integridade dos novos dados**

```ts
import { describe, expect, it } from 'vitest';
import { projectHistory, projects } from './mockData';

describe('dashboard mock data', () => {
  it('provides a dated forecast for every project', () => {
    for (const project of projects) {
      expect(project.predictedEndDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(project.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('keeps historical progress ordered and bounded', () => {
    for (const project of projects) {
      const points = projectHistory.filter(point => point.projectId === project.id);
      expect(points.length).toBeGreaterThanOrEqual(4);
      expect(points.map(point => point.date)).toEqual(
        [...points].sort((a, b) => a.date.localeCompare(b.date)).map(point => point.date),
      );
      for (const point of points) {
        expect(point.planned).toBeGreaterThanOrEqual(0);
        expect(point.planned).toBeLessThanOrEqual(100);
        expect(point.actual).toBeGreaterThanOrEqual(0);
        expect(point.actual).toBeLessThanOrEqual(100);
      }
    }
  });
});
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `npm test -- src/data/mockData.test.ts`

Expected: FAIL porque `projectHistory`, `predictedEndDate` e `updatedAt` ainda não existem.

- [ ] **Step 3: Adicionar os tipos e dados simulados mínimos**

```ts
export interface ProjectHistoryPoint {
  projectId: string;
  date: string;
  planned: number;
  actual: number;
}

export interface Project {
  // manter os campos existentes
  predictedEndDate: string;
  updatedAt: string;
}

export const projectHistory: ProjectHistoryPoint[] = [
  { projectId: '1', date: '2026-02-01', planned: 0, actual: 0 },
  { projectId: '1', date: '2026-02-15', planned: 24, actual: 20 },
  { projectId: '1', date: '2026-03-01', planned: 48, actual: 38 },
  { projectId: '1', date: '2026-03-15', planned: 72, actual: 52 },
  { projectId: '2', date: '2026-01-15', planned: 0, actual: 0 },
  { projectId: '2', date: '2026-02-01', planned: 25, actual: 22 },
  { projectId: '2', date: '2026-03-01', planned: 70, actual: 50 },
  { projectId: '2', date: '2026-03-15', planned: 92, actual: 55 },
  { projectId: '3', date: '2026-01-10', planned: 0, actual: 0 },
  { projectId: '3', date: '2026-01-25', planned: 35, actual: 40 },
  { projectId: '3', date: '2026-02-05', planned: 70, actual: 75 },
  { projectId: '3', date: '2026-02-15', planned: 100, actual: 100 },
  { projectId: '4', date: '2026-03-01', planned: 0, actual: 0 },
  { projectId: '4', date: '2026-03-06', planned: 5, actual: 4 },
  { projectId: '4', date: '2026-03-10', planned: 10, actual: 9 },
  { projectId: '4', date: '2026-03-15', planned: 15, actual: 15 },
];
```

Em cada projeto, definir previsões explícitas e `updatedAt: '2026-03-15'`. Usar `predictedEndDate: '2026-04-11'` no projeto 1, `'2026-03-27'` no projeto 2 e a própria `endDate` nos projetos 3 e 4.

- [ ] **Step 4: Executar o teste de dados**

Run: `npm test -- src/data/mockData.test.ts`

Expected: PASS.

- [ ] **Step 5: Commitar a camada de dados**

```bash
git add src/data/mockData.ts src/data/mockData.test.ts
git commit -m "feat: add dashboard history and forecasts"
```

---

### Task 2: Métricas e filtragem do dashboard

**Files:**
- Create: `src/lib/dashboardMetrics.ts`
- Test: `src/lib/dashboardMetrics.test.ts`

**Interfaces:**
- Consumes: `Project`, `ProjectHistoryPoint`, `TaskPriority` de `src/data/mockData.ts`.
- Produces: `DashboardPeriod`, `ExecutiveMetrics`, `DeliveryForecast`, `RiskPoint`, `WorkloadPoint`, `filterDashboardData`, `calculateExecutiveMetrics`, `buildPortfolioProgress`, `buildDeliveryForecast`, `buildRiskMap`, `buildWorkload`.

- [ ] **Step 1: Escrever testes para período, métricas e desvio de entrega**

```ts
import { describe, expect, it } from 'vitest';
import { projectHistory, projects } from '@/data/mockData';
import {
  buildDeliveryForecast,
  buildPortfolioProgress,
  calculateExecutiveMetrics,
  filterDashboardData,
} from './dashboardMetrics';

describe('dashboard metrics', () => {
  it('filters projects and history with one shared selection', () => {
    const result = filterDashboardData(projects, projectHistory, {
      projectId: '1', period: 90, referenceDate: '2026-03-15',
    });
    expect(result.projects.map(project => project.id)).toEqual(['1']);
    expect(result.history.every(point => point.projectId === '1')).toBe(true);
  });

  it('calculates executive totals without invented trends', () => {
    const metrics = calculateExecutiveMetrics(projects);
    expect(metrics.totalProjects).toBe(4);
    expect(metrics.atRiskProjects).toBe(2);
    expect(metrics.completedTasks).toBe(6);
    expect(metrics.totalTasks).toBe(15);
  });

  it('sorts forecasts by delay descending', () => {
    const forecast = buildDeliveryForecast(projects);
    expect(forecast[0]).toMatchObject({ projectId: '1', delayDays: 12 });
    expect(forecast[1]).toMatchObject({ projectId: '2', delayDays: 7 });
  });

  it('aggregates planned and actual progress by date', () => {
    const points = buildPortfolioProgress(projects, projectHistory);
    expect(points.at(-1)).toEqual(expect.objectContaining({ date: '2026-03-15' }));
    expect(points.every(point => point.planned >= 0 && point.actual >= 0)).toBe(true);
  });
});
```

- [ ] **Step 2: Executar e confirmar a falha**

Run: `npm test -- src/lib/dashboardMetrics.test.ts`

Expected: FAIL com módulo `dashboardMetrics` não encontrado.

- [ ] **Step 3: Implementar tipos, datas e métricas puras**

```ts
import type { Project, ProjectHistoryPoint, TaskPriority } from '@/data/mockData';

export type DashboardPeriod = 30 | 60 | 90;
export interface DashboardSelection {
  projectId: string;
  period: DashboardPeriod;
  referenceDate: string;
}

const priorityWeight: Record<TaskPriority, number> = {
  low: 1, medium: 2, high: 3, critical: 4,
};

export const differenceInCalendarDays = (end: string, start: string) =>
  Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000);

export function filterDashboardData(
  projects: Project[], history: ProjectHistoryPoint[], selection: DashboardSelection,
) {
  const start = new Date(`${selection.referenceDate}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() - selection.period);
  const filteredProjects = selection.projectId === 'all'
    ? projects
    : projects.filter(project => project.id === selection.projectId);
  const ids = new Set(filteredProjects.map(project => project.id));
  return {
    projects: filteredProjects,
    history: history.filter(point => ids.has(point.projectId) && Date.parse(point.date) >= start.getTime()),
  };
}
```

Implementar `calculateExecutiveMetrics` com média simples de `project.progress`, média de `riskScore`, projetos com `riskScore > 50`, projetos com `predictedEndDate <= endDate` e contagens de tarefas. Implementar `buildDeliveryForecast` usando `differenceInCalendarDays(predictedEndDate, endDate)` e ordenação decrescente. Implementar `buildRiskMap` com `openTasks`, `progress`, `riskScore`, `status` e `owner`. Implementar `buildWorkload` somando `priorityWeight` somente para tarefas diferentes de `done` e agrupando pelo responsável.

Para `buildPortfolioProgress`, agrupar os pontos pela data, considerar somente projetos selecionados e calcular a média aritmética de `planned` e `actual`, arredondada para uma casa decimal.

- [ ] **Step 4: Completar testes de risco e carga**

```ts
it('weights only open tasks in workload', () => {
  const workload = buildWorkload(projects);
  expect(workload.find(item => item.memberId === '4')).toEqual(
    expect.objectContaining({ memberName: 'Pedro Oliveira', score: 7 }),
  );
  expect(workload).toEqual([...workload].sort((a, b) => b.score - a.score));
});

it('maps project risk with open task volume', () => {
  expect(buildRiskMap(projects).find(item => item.projectId === '1')).toEqual(
    expect.objectContaining({ progress: 52, riskScore: 72, openTasks: 4 }),
  );
});
```

- [ ] **Step 5: Executar os testes**

Run: `npm test -- src/lib/dashboardMetrics.test.ts`

Expected: PASS.

- [ ] **Step 6: Commitar as métricas**

```bash
git add src/lib/dashboardMetrics.ts src/lib/dashboardMetrics.test.ts
git commit -m "feat: derive executive dashboard metrics"
```

---

### Task 3: Filtros globais e indicadores executivos

**Files:**
- Create: `src/components/dashboard/DashboardFilters.tsx`
- Create: `src/components/dashboard/ExecutiveMetrics.tsx`
- Test: `src/components/dashboard/DashboardControls.test.tsx`

**Interfaces:**
- Consumes: `Project[]`, `DashboardPeriod`, `ExecutiveMetrics`.
- Produces: `DashboardFilters({ projects, projectId, period, onProjectChange, onPeriodChange, onClear })` e `ExecutiveMetricsGrid({ metrics })`.

- [ ] **Step 1: Escrever o teste de interação dos filtros**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DashboardFilters from './DashboardFilters';
import { projects } from '@/data/mockData';

it('changes period and clears contextual selection', () => {
  const onPeriodChange = vi.fn();
  const onClear = vi.fn();
  render(
    <DashboardFilters
      projects={projects}
      projectId="1"
      period={90}
      onProjectChange={vi.fn()}
      onPeriodChange={onPeriodChange}
      onClear={onClear}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: /período/i }));
  fireEvent.click(screen.getByRole('option', { name: '30 dias' }));
  expect(onPeriodChange).toHaveBeenCalledWith(30);
  fireEvent.click(screen.getByRole('button', { name: /limpar seleção/i }));
  expect(onClear).toHaveBeenCalled();
});
```

- [ ] **Step 2: Executar e confirmar a falha**

Run: `npm test -- src/components/dashboard/DashboardControls.test.tsx`

Expected: FAIL porque os componentes ainda não existem.

- [ ] **Step 3: Implementar filtros com os `Select` existentes**

```tsx
const periods = [30, 60, 90] as const;

export default function DashboardFilters(props: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={props.projectId} onValueChange={props.onProjectChange}>
        <SelectTrigger aria-label="Projeto" className="w-[220px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os projetos</SelectItem>
          {props.projects.map(project => (
            <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={String(props.period)} onValueChange={value => props.onPeriodChange(Number(value) as DashboardPeriod)}>
        <SelectTrigger aria-label="Período" className="w-[140px]"><SelectValue /></SelectTrigger>
        <SelectContent>{periods.map(period => <SelectItem key={period} value={String(period)}>{period} dias</SelectItem>)}</SelectContent>
      </Select>
      {props.projectId !== 'all' && <Button variant="ghost" onClick={props.onClear}>Limpar seleção</Button>}
    </div>
  );
}
```

- [ ] **Step 4: Implementar os quatro indicadores sem tendências fictícias**

`ExecutiveMetricsGrid` deve reutilizar a interface atual de `StatsCard` e renderizar: progresso médio (`56%`), entregas no prazo (`2/4`), risco médio (`39%`, subtítulo `2 acima do limite`) e tarefas concluídas (`6/15`). Passar `className="border-warning/30"` ao cartão de risco e não alterar `StatsCard`.

- [ ] **Step 5: Executar o teste e o lint dos arquivos**

Run: `npm test -- src/components/dashboard/DashboardControls.test.tsx && npx eslint src/components/dashboard/DashboardFilters.tsx src/components/dashboard/ExecutiveMetrics.tsx`

Expected: PASS e nenhum erro de lint.

- [ ] **Step 6: Commitar os controles executivos**

```bash
git add src/components/dashboard/DashboardFilters.tsx src/components/dashboard/ExecutiveMetrics.tsx src/components/dashboard/DashboardControls.test.tsx
git commit -m "feat: add dashboard filters and executive metrics"
```

---

### Task 4: Gráficos interativos de acompanhamento e previsão

**Files:**
- Create: `src/components/dashboard/PortfolioProgressChart.tsx`
- Create: `src/components/dashboard/DeliveryForecastChart.tsx`
- Create: `src/components/dashboard/RiskMapChart.tsx`
- Create: `src/components/dashboard/WorkloadChart.tsx`
- Test: `src/components/dashboard/DashboardCharts.test.tsx`

**Interfaces:**
- Consumes: os tipos de saída de `dashboardMetrics` e callbacks `onProjectSelect(projectId)` e `onMemberSelect(memberId)`.
- Produces: quatro gráficos responsivos com tooltip, estado vazio, foco e clique.

- [ ] **Step 1: Escrever os testes de renderização, seleção e estado vazio**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DeliveryForecastChart from './DeliveryForecastChart';
import RiskMapChart from './RiskMapChart';

it('shows an explicit empty state', () => {
  render(<DeliveryForecastChart data={[]} onProjectSelect={vi.fn()} />);
  expect(screen.getByText('Sem previsões para o período selecionado.')).toBeInTheDocument();
});

it('selects a forecast project from the accessible project control', () => {
  const onProjectSelect = vi.fn();
  render(<DeliveryForecastChart data={[{
    projectId: '1', projectName: 'ProjectFlow MVP', plannedEndDate: '2026-03-30',
    predictedEndDate: '2026-04-11', delayDays: 12, riskScore: 72,
  }]} onProjectSelect={onProjectSelect} />);
  fireEvent.click(screen.getByRole('button', { name: /selecionar projectflow mvp/i }));
  expect(onProjectSelect).toHaveBeenCalledWith('1');
});

it('exposes each risk point as a keyboard control', () => {
  render(<RiskMapChart data={[{
    projectId: '1', projectName: 'ProjectFlow MVP', owner: 'Ana Silva', progress: 52,
    riskScore: 72, openTasks: 4, status: 'at_risk', predictedEndDate: '2026-04-11',
  }]} onProjectSelect={vi.fn()} />);
  expect(screen.getByRole('button', { name: /projectflow mvp, risco 72%/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Executar e confirmar a falha**

Run: `npm test -- src/components/dashboard/DashboardCharts.test.tsx`

Expected: FAIL porque os quatro componentes não existem.

- [ ] **Step 3: Implementar o gráfico planejado versus realizado**

Usar `ChartContainer`, `LineChart`, `CartesianGrid`, `XAxis`, `YAxis`, `Line`, `ChartTooltip` e `ChartTooltipContent`. Configuração:

```tsx
const chartConfig = {
  planned: { label: 'Planejado', color: 'hsl(var(--primary))' },
  actual: { label: 'Realizado', color: 'hsl(var(--warning))' },
} satisfies ChartConfig;
```

Formatar o eixo X com `toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })`, limitar Y a `[0, 100]` e desativar animações quando `matchMedia('(prefers-reduced-motion: reduce)').matches`.

- [ ] **Step 4: Implementar previsão e mapa de risco com seleção acessível**

`DeliveryForecastChart` usa `BarChart` horizontal, eixo numérico de dias e barras com `var(--color-delay)`. `RiskMapChart` usa `ScatterChart`, eixos de progresso e risco de 0 a 100, tamanho visual derivado de tarefas abertas e cor por status.

Além do clique Recharts, renderizar uma lista de botões visualmente discretos abaixo de cada gráfico para garantir navegação por teclado:

```tsx
<div className="sr-only focus-within:not-sr-only">
  {data.map(item => (
    <button key={item.projectId} onClick={() => onProjectSelect(item.projectId)}>
      Selecionar {item.projectName}, risco {item.riskScore}%
    </button>
  ))}
</div>
```

- [ ] **Step 5: Implementar a carga por responsável**

Usar `BarChart` horizontal e `onMemberSelect`. O tooltip deve listar pontuação total e contagem de tarefas baixa, média, alta e crítica. Usar warning apenas quando a pontuação estiver no quartil superior; os demais itens usam primary.

- [ ] **Step 6: Executar testes e lint dos gráficos**

Run: `npm test -- src/components/dashboard/DashboardCharts.test.tsx && npx eslint src/components/dashboard/*Chart.tsx`

Expected: PASS e nenhum erro de lint.

- [ ] **Step 7: Commitar os gráficos**

```bash
git add src/components/dashboard/*Chart.tsx src/components/dashboard/DashboardCharts.test.tsx
git commit -m "feat: add interactive executive charts"
```

---

### Task 5: Composição da página e seleção cruzada

**Files:**
- Modify: `src/pages/Index.tsx`
- Test: `src/pages/Index.test.tsx`
- Modify: `src/test/setup.ts`

**Interfaces:**
- Consumes: todos os componentes e funções das tarefas 1–4.
- Produces: dashboard final na rota `/` com filtros globais, seleção cruzada de projeto e realce de responsável.

- [ ] **Step 1: Preparar o ambiente de teste para gráficos responsivos**

Adicionar ao `src/test/setup.ts`:

```ts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'ResizeObserver', { value: ResizeObserverMock });
```

- [ ] **Step 2: Escrever o teste de integração da página**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Index from './Index';

it('filters the dashboard when a project is selected from a chart', () => {
  render(<MemoryRouter><Index /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Desempenho do portfólio' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /selecionar projectflow mvp/i }));
  expect(screen.getByRole('button', { name: /limpar seleção/i })).toBeInTheDocument();
  expect(screen.getByText('1/1')).toBeInTheDocument();
});

it('renders all four decision views', () => {
  render(<MemoryRouter><Index /></MemoryRouter>);
  expect(screen.getByText('Evolução do portfólio')).toBeInTheDocument();
  expect(screen.getByText('Previsão de entrega')).toBeInTheDocument();
  expect(screen.getByText('Mapa de risco')).toBeInTheDocument();
  expect(screen.getByText('Carga por responsável')).toBeInTheDocument();
});
```

- [ ] **Step 3: Executar e confirmar a falha**

Run: `npm test -- src/pages/Index.test.tsx`

Expected: FAIL porque a página ainda usa cards de projeto e alertas.

- [ ] **Step 4: Substituir a composição do dashboard**

Manter no `Index` apenas estes estados:

```tsx
const [projectId, setProjectId] = useState('all');
const [period, setPeriod] = useState<DashboardPeriod>(90);
const [memberId, setMemberId] = useState<string | null>(null);
```

Derivar dados com `useMemo`, usando a data de atualização mais recente como `referenceDate`. Organizar o JSX em cabeçalho com filtros, `ExecutiveMetricsGrid`, grade superior `PortfolioProgressChart` + `DeliveryForecastChart` e grade inferior `RiskMapChart` + `WorkloadChart`. Usar `grid gap-6 xl:grid-cols-2`; em telas menores, os gráficos permanecem empilhados.

`onProjectSelect` deve atualizar `projectId`. `onClear` retorna `projectId` para `all` e `memberId` para `null`. `memberId` não filtra dados: é repassado aos gráficos como propriedade de destaque.

- [ ] **Step 5: Executar o teste de integração**

Run: `npm test -- src/pages/Index.test.tsx`

Expected: PASS.

- [ ] **Step 6: Executar toda a suíte e build**

Run: `npm test && npm run lint && npm run build`

Expected: todos os testes passam, ESLint sem erros e build Vite concluído.

- [ ] **Step 7: Inspecionar visualmente**

Iniciar `npm run dev` e verificar `/` em 1440 px, 768 px e 390 px, nos temas claro e escuro. Confirmar: ausência de rolagem horizontal; tooltips legíveis; controles alcançáveis por teclado; filtros atualizam todos os números; seleção pode ser limpa; gráficos exibem estado vazio quando aplicável.

- [ ] **Step 8: Commitar a página final**

```bash
git add src/pages/Index.tsx src/pages/Index.test.tsx src/test/setup.ts
git commit -m "feat: deliver data-driven executive dashboard"
```

---

### Task 6: Revisão final de regressões e documentação

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: dashboard implementado e comandos existentes do projeto.
- Produces: documentação curta das métricas simuladas e verificação final reproduzível.

- [ ] **Step 1: Documentar a origem dos dados do dashboard**

Adicionar ao README uma seção “Dashboard executivo” informando que histórico de progresso e previsão de término estão em `src/data/mockData.ts`, são dados demonstrativos e deverão ser substituídos por dados persistidos mantendo as mesmas interfaces.

- [ ] **Step 2: Rodar a verificação final em ambiente limpo do processo**

Run: `npm test && npm run lint && npm run build && git diff --check`

Expected: comandos concluídos com código 0 e sem erros de whitespace.

- [ ] **Step 3: Revisar o diff exclusivamente do dashboard**

Run: `git diff HEAD~5 -- src/data/mockData.ts src/lib/dashboardMetrics.ts src/components/dashboard src/pages/Index.tsx src/test/setup.ts README.md`

Expected: nenhum dado financeiro fictício, dependência nova, tendência sem histórico ou alteração fora do escopo.

- [ ] **Step 4: Commitar a documentação**

```bash
git add README.md
git commit -m "docs: explain executive dashboard data"
```
