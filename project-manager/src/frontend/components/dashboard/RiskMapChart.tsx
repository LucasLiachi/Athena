import { useState } from 'react';
import { CartesianGrid, Cell, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { getStatusLabel } from '@/data/mockData';
import type { RiskPoint } from '@/lib/dashboardMetrics';

const chartConfig = {
  risk: { label: 'Risco', color: 'hsl(var(--warning))' },
  tasks: { label: 'Tarefas abertas', color: 'hsl(var(--primary))' },
} satisfies ChartConfig;

const statusColors: Record<RiskPoint['status'], string> = {
  on_track: 'hsl(var(--primary))',
  at_risk: 'hsl(var(--warning))',
  delayed: 'hsl(var(--destructive))',
  completed: 'hsl(var(--muted-foreground))',
};

const statuses: RiskPoint['status'][] = ['on_track', 'at_risk', 'delayed', 'completed'];

interface RiskMapChartProps {
  data: RiskPoint[];
  onProjectSelect: (projectId: string) => void;
}

function RiskTooltip({ risk }: { risk: RiskPoint }) {
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute right-2 top-2 z-10 grid gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground shadow-xl"
    >
      <strong>{risk.projectName}</strong>
      <span>Status: {getStatusLabel(risk.status)}</span>
      <span>Responsável: {risk.owner.name}</span>
      <span>Progresso: {risk.progress}%</span>
      <span>Risco: {risk.riskScore}%</span>
      <span>Tarefas abertas: {risk.openTasks}</span>
      <span>Previsão: {new Date(`${risk.predictedEndDate}T00:00:00`).toLocaleDateString('pt-BR')}</span>
    </div>
  );
}

export default function RiskMapChart({ data, onProjectSelect }: RiskMapChartProps) {
  const [activeRisk, setActiveRisk] = useState<RiskPoint | null>(null);

  if (data.length === 0) {
    return <p className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">Sem riscos para o período selecionado.</p>;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <>
      <div className="relative">
        <ChartContainer
          config={chartConfig}
          className="h-72 w-full aspect-auto"
          role="img"
          aria-label="Mapa de risco por progresso dos projetos"
        >
          <ScatterChart margin={{ top: 12, right: 12, bottom: 8, left: 4 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="progress" name="Progresso" unit="%" domain={[0, 100]} tickLine={false} />
            <YAxis type="number" dataKey="riskScore" name="Risco" unit="%" domain={[0, 100]} tickLine={false} />
            <ZAxis type="number" dataKey="openTasks" name="Tarefas abertas" range={[80, 400]} />
            <Scatter
              data={data}
              cursor="pointer"
              isAnimationActive={!reduceMotion}
              onMouseEnter={item => setActiveRisk(item)}
              onMouseLeave={() => setActiveRisk(null)}
              onClick={item => onProjectSelect(item.projectId)}
            >
              {data.map(item => <Cell key={item.projectId} fill={statusColors[item.status]} />)}
            </Scatter>
          </ScatterChart>
        </ChartContainer>
        {activeRisk && <RiskTooltip risk={activeRisk} />}
      </div>
      <ul aria-label="Legenda de status" className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {statuses.map(status => (
          <li key={status} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColors[status] }} />
            {getStatusLabel(status)}
          </li>
        ))}
      </ul>
      <div className="sr-only focus-within:not-sr-only">
        {data.map(item => (
          <button
            key={item.projectId}
            type="button"
            className="rounded px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onFocus={() => setActiveRisk(item)}
            onBlur={() => setActiveRisk(null)}
            onClick={() => onProjectSelect(item.projectId)}
          >
            Selecionar {item.projectName}, risco {item.riskScore}%
          </button>
        ))}
      </div>
    </>
  );
}
