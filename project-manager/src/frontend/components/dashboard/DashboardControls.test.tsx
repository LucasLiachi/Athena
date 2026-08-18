import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DashboardFilters from './DashboardFilters';
import ExecutiveMetricsGrid from './ExecutiveMetrics';
import { projects } from '@/data/mockData';
import type { ExecutiveMetrics } from '@/lib/dashboardMetrics';

describe('DashboardFilters', () => {
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

    fireEvent.click(screen.getByRole('combobox', { name: /período/i }));
    fireEvent.click(screen.getByRole('option', { name: '30 dias' }));
    expect(onPeriodChange).toHaveBeenCalledWith(30);
    fireEvent.click(screen.getByRole('button', { name: /limpar seleção/i }));
    expect(onClear).toHaveBeenCalled();
  });
});

describe('ExecutiveMetricsGrid', () => {
  it('renders the executive metrics without trends', () => {
    const metrics: ExecutiveMetrics = {
      totalProjects: 4,
      atRiskProjects: 2,
      averageProgress: 56,
      averageRiskScore: 39,
      onTimeProjects: 2,
      completedTasks: 6,
      totalTasks: 15,
    };

    render(<ExecutiveMetricsGrid metrics={metrics} />);

    expect(screen.getByText('56%')).toBeInTheDocument();
    expect(screen.getByText('2/4')).toBeInTheDocument();
    expect(screen.getByText('39%')).toBeInTheDocument();
    expect(screen.getByText('2 acima do limite')).toBeInTheDocument();
    expect(screen.getByText('6/15')).toBeInTheDocument();
    expect(screen.queryByText(/↑|↓/)).not.toBeInTheDocument();
  });
});
