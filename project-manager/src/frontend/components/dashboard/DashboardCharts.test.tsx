import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Line as RechartsLine } from 'recharts';
import { teamMembers } from '@/data/mockData';
import type { DeliveryForecast, RiskPoint, WorkloadPoint } from '@/lib/dashboardMetrics';
import DeliveryForecastChart from './DeliveryForecastChart';
import PortfolioProgressChart, { ProgressTooltipValue } from './PortfolioProgressChart';
import RiskMapChart from './RiskMapChart';
import WorkloadChart from './WorkloadChart';

vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});
vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
  width: 800,
  height: 300,
  top: 0,
  right: 800,
  bottom: 300,
  left: 0,
  x: 0,
  y: 0,
  toJSON: () => ({}),
});

const forecast: DeliveryForecast = {
  projectId: '1',
  projectName: 'Athena MVP',
  endDate: '2026-03-30',
  predictedEndDate: '2026-04-11',
  delayDays: 12,
  riskScore: 72,
  status: 'at_risk',
  owner: teamMembers[0],
};

const risk: RiskPoint = {
  projectId: '1',
  projectName: 'Athena MVP',
  owner: teamMembers[0],
  progress: 52,
  riskScore: 72,
  openTasks: 4,
  status: 'at_risk',
  predictedEndDate: '2026-04-11',
};

const workload: WorkloadPoint = {
  memberId: '4',
  memberName: 'Pedro Oliveira',
  score: 7,
  lowTasks: 0,
  mediumTasks: 0,
  highTasks: 1,
  criticalTasks: 1,
};

function setReducedMotion(matches: boolean) {
  const matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)' && matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  Object.defineProperty(window, 'matchMedia', { writable: true, value: matchMedia });
  return matchMedia;
}

function getGraphic(container: HTMLElement, selector: string) {
  const graphic = container.querySelector<SVGElement>(selector);
  expect(graphic).not.toBeNull();
  return graphic as SVGElement;
}

beforeEach(() => {
  setReducedMotion(true);
});

describe('dashboard charts', () => {
  it.each([
    [<PortfolioProgressChart data={[]} />, 'Sem dados de progresso para o período selecionado.'],
    [<DeliveryForecastChart data={[]} onProjectSelect={vi.fn()} />, 'Sem previsões para o período selecionado.'],
    [<RiskMapChart data={[]} onProjectSelect={vi.fn()} />, 'Sem riscos para o período selecionado.'],
    [<WorkloadChart data={[]} onMemberSelect={vi.fn()} />, 'Sem carga de trabalho para o período selecionado.'],
  ])('shows an explicit empty state', (chart, message) => {
    render(chart);

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('selects a forecast project from the accessible project control', () => {
    const onProjectSelect = vi.fn();
    render(<DeliveryForecastChart data={[forecast]} onProjectSelect={onProjectSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /selecionar athena mvp/i }));

    expect(onProjectSelect).toHaveBeenCalledWith('1');
  });

  it('shows forecast details on focus and removes the redundant chart focus stop', () => {
    render(<DeliveryForecastChart data={[forecast]} onProjectSelect={vi.fn()} />);
    const control = screen.getByRole('button', { name: /selecionar athena mvp/i });

    fireEvent.focus(control);

    expect(screen.getByText('Risco: 72%')).toBeInTheDocument();
    expect(screen.getByText('12 dias de diferença')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /datas planejadas e previstas/i })).not.toHaveAttribute('tabindex');

    fireEvent.blur(control);
    expect(screen.queryByText('Risco: 72%')).not.toBeInTheDocument();
  });

  it('shows forecast details from the pointer and selects its graphic', () => {
    const onProjectSelect = vi.fn();
    const { container } = render(<DeliveryForecastChart data={[forecast]} onProjectSelect={onProjectSelect} />);
    const bar = getGraphic(container, '.recharts-bar-rectangle path');

    fireEvent.mouseEnter(bar);
    expect(screen.getByText('Risco: 72%')).toBeInTheDocument();

    fireEvent.click(bar);
    expect(onProjectSelect).toHaveBeenCalledWith('1');
  });

  it('keeps a zero-delay project selectable from the chart', () => {
    const onProjectSelect = vi.fn();
    const { container } = render(
      <DeliveryForecastChart data={[{ ...forecast, delayDays: 0 }]} onProjectSelect={onProjectSelect} />,
    );
    const bar = getGraphic(container, '.recharts-bar-rectangle path');

    fireEvent.click(bar);

    expect(onProjectSelect).toHaveBeenCalledWith('1');
  });

  it('exposes risk context, pointer details and graphic selection', () => {
    const onProjectSelect = vi.fn();
    const { container } = render(<RiskMapChart data={[risk]} onProjectSelect={onProjectSelect} />);

    expect(screen.getByRole('button', { name: /athena mvp, risco 72%/i })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /legenda de status/i })).toBeInTheDocument();
    expect(screen.getByText('Em Risco')).toBeInTheDocument();

    const point = getGraphic(container, '.recharts-scatter-symbol path');
    fireEvent.mouseEnter(point);
    expect(screen.getByText('Status: Em Risco')).toBeInTheDocument();
    expect(screen.getByText('Previsão: 11/04/2026')).toBeInTheDocument();

    fireEvent.click(point);
    expect(onProjectSelect).toHaveBeenCalledWith('1');
  });

  it('uses the status color tokens for risk points', () => {
    const data: RiskPoint[] = [
      { ...risk, projectId: '1', progress: 20, riskScore: 20, status: 'on_track' },
      { ...risk, projectId: '2', progress: 40, riskScore: 40, status: 'at_risk' },
      { ...risk, projectId: '3', progress: 60, riskScore: 60, status: 'delayed' },
      { ...risk, projectId: '4', progress: 80, riskScore: 80, status: 'completed' },
    ];
    const { container } = render(<RiskMapChart data={data} onProjectSelect={vi.fn()} />);

    expect([...container.querySelectorAll('.recharts-scatter-symbol path')].map(point => point.getAttribute('fill')))
      .toEqual([
        'hsl(var(--primary))',
        'hsl(var(--warning))',
        'hsl(var(--destructive))',
        'hsl(var(--muted-foreground))',
      ]);
  });

  it('shows real workload counts on focus, including a zero score', () => {
    render(
      <WorkloadChart
        data={[{ ...workload, score: 0, highTasks: 0, criticalTasks: 0 }]}
        onMemberSelect={vi.fn()}
      />,
    );
    const control = screen.getByRole('button', { name: /selecionar pedro oliveira/i });

    fireEvent.focus(control);

    expect(screen.getByText('Pontuação total: 0')).toBeInTheDocument();
    expect(screen.getByText('Tarefas baixas: 0')).toBeInTheDocument();
    expect(screen.getByText('Tarefas médias: 0')).toBeInTheDocument();
    expect(screen.getByText('Tarefas altas: 0')).toBeInTheDocument();
    expect(screen.getByText('Tarefas críticas: 0')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /carga de trabalho/i })).not.toHaveAttribute('tabindex');

    fireEvent.blur(control);
    expect(screen.queryByText('Pontuação total: 0')).not.toBeInTheDocument();
  });

  it('selects a member from both accessible and graphic controls', () => {
    const onMemberSelect = vi.fn();
    const { container } = render(<WorkloadChart data={[workload]} onMemberSelect={onMemberSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /selecionar pedro oliveira/i }));
    const bar = getGraphic(container, '.recharts-bar-rectangle path');
    fireEvent.mouseEnter(bar);
    expect(screen.getByText('Tarefas críticas: 1')).toBeInTheDocument();
    fireEvent.click(bar);

    expect(onMemberSelect).toHaveBeenNthCalledWith(1, '4');
    expect(onMemberSelect).toHaveBeenNthCalledWith(2, '4');
  });

  it('uses warning only for the upper workload quartile', () => {
    const data: WorkloadPoint[] = [
      { ...workload, memberId: '1', score: 8 },
      { ...workload, memberId: '2', score: 6 },
      { ...workload, memberId: '3', score: 4 },
      { ...workload, memberId: '4', score: 2 },
    ];
    const { container } = render(<WorkloadChart data={data} onMemberSelect={vi.fn()} />);

    expect([...container.querySelectorAll('.recharts-bar-rectangle path')].map(bar => bar.getAttribute('fill')))
      .toEqual([
        'var(--color-warning)',
        'var(--color-score)',
        'var(--color-score)',
        'var(--color-score)',
      ]);
  });

  it('renders zero progress values in the portfolio tooltip', () => {
    render(<ProgressTooltipValue value={0} name="planned" />);

    expect(screen.getByText('Planejado')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('disables every portfolio line animation when reduced motion is requested', () => {
    setReducedMotion(true);
    const lineRender = vi.spyOn(RechartsLine.prototype, 'render');

    try {
      render(<PortfolioProgressChart data={[{ date: '2026-03-01', planned: 20, actual: 10 }]} />);

      expect(lineRender).toHaveBeenCalled();
      const animationValues = lineRender.mock.instances.map(line => line.props.isAnimationActive);
      expect(animationValues).toHaveLength(2);
      expect(animationValues).toEqual([false, false]);
    } finally {
      lineRender.mockRestore();
    }
  });
});
