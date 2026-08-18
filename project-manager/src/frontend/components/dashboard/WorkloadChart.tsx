import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import type { WorkloadPoint } from '@/lib/dashboardMetrics';

const chartConfig = {
  score: { label: 'Pontuação total', color: 'hsl(var(--primary))' },
  warning: { label: 'Quartil superior', color: 'hsl(var(--warning))' },
} satisfies ChartConfig;

interface WorkloadChartProps {
  data: WorkloadPoint[];
  onMemberSelect: (memberId: string) => void;
}

function WorkloadTooltip({ workload }: { workload: WorkloadPoint }) {
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute right-2 top-2 z-10 grid gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground shadow-xl"
    >
      <strong>{workload.memberName}</strong>
      <span>Pontuação total: {workload.score}</span>
      <span>Tarefas baixas: {workload.lowTasks}</span>
      <span>Tarefas médias: {workload.mediumTasks}</span>
      <span>Tarefas altas: {workload.highTasks}</span>
      <span>Tarefas críticas: {workload.criticalTasks}</span>
    </div>
  );
}

export default function WorkloadChart({ data, onMemberSelect }: WorkloadChartProps) {
  const [activeWorkload, setActiveWorkload] = useState<WorkloadPoint | null>(null);

  if (data.length === 0) {
    return <p className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">Sem carga de trabalho para o período selecionado.</p>;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const warningCount = Math.max(1, Math.ceil(data.length / 4));
  const warningMembers = new Set(
    [...data].sort((first, second) => second.score - first.score).slice(0, warningCount).map(item => item.memberId),
  );

  return (
    <>
      <div className="relative">
        <ChartContainer
          config={chartConfig}
          className="h-72 w-full aspect-auto"
          role="img"
          aria-label="Carga de trabalho por responsável"
        >
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" dataKey="score" tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="memberName" width={120} tickLine={false} axisLine={false} />
            <Bar
              dataKey="score"
              radius={4}
              cursor="pointer"
              isAnimationActive={!reduceMotion}
              onMouseEnter={item => setActiveWorkload(item)}
              onMouseLeave={() => setActiveWorkload(null)}
              onClick={item => onMemberSelect(item.memberId)}
            >
              {data.map(item => (
                <Cell
                  key={item.memberId}
                  fill={warningMembers.has(item.memberId) ? 'var(--color-warning)' : 'var(--color-score)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        {activeWorkload && <WorkloadTooltip workload={activeWorkload} />}
      </div>
      <div className="sr-only focus-within:not-sr-only">
        {data.map(item => (
          <button
            key={item.memberId}
            type="button"
            className="rounded px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onFocus={() => setActiveWorkload(item)}
            onBlur={() => setActiveWorkload(null)}
            onClick={() => onMemberSelect(item.memberId)}
          >
            Selecionar {item.memberName}, pontuação {item.score}
          </button>
        ))}
      </div>
    </>
  );
}
