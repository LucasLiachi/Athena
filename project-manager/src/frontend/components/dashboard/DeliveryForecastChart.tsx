import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import type { DeliveryForecast } from '@/lib/dashboardMetrics';

const chartConfig = {
  delay: { label: 'Atraso previsto', color: 'hsl(var(--warning))' },
} satisfies ChartConfig;

interface DeliveryForecastChartProps {
  data: DeliveryForecast[];
  onProjectSelect: (projectId: string) => void;
}

function ForecastTooltip({ forecast }: { forecast: DeliveryForecast }) {
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute right-2 top-2 z-10 grid gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground shadow-xl"
    >
      <strong>{forecast.projectName}</strong>
      <span>{forecast.delayDays} dias de diferença</span>
      <span>Risco: {forecast.riskScore}%</span>
      <span>Planejado: {new Date(`${forecast.endDate}T00:00:00`).toLocaleDateString('pt-BR')}</span>
      <span>Previsto: {new Date(`${forecast.predictedEndDate}T00:00:00`).toLocaleDateString('pt-BR')}</span>
    </div>
  );
}

export default function DeliveryForecastChart({ data, onProjectSelect }: DeliveryForecastChartProps) {
  const [activeForecast, setActiveForecast] = useState<DeliveryForecast | null>(null);

  if (data.length === 0) {
    return <p className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">Sem previsões para o período selecionado.</p>;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <>
      <div className="relative">
        <ChartContainer
          config={chartConfig}
          className="h-72 w-full aspect-auto"
          role="img"
          aria-label="Diferença entre as datas planejadas e previstas por projeto"
        >
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" dataKey="delayDays" tickFormatter={value => `${value} d`} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="projectName" width={120} tickLine={false} axisLine={false} />
            <Bar
              dataKey="delayDays"
              fill="var(--color-delay)"
              radius={4}
              cursor="pointer"
              minPointSize={4}
              isAnimationActive={!reduceMotion}
              onMouseEnter={item => setActiveForecast(item)}
              onMouseLeave={() => setActiveForecast(null)}
              onClick={item => onProjectSelect(item.projectId)}
            />
          </BarChart>
        </ChartContainer>
        {activeForecast && <ForecastTooltip forecast={activeForecast} />}
      </div>
      <div className="sr-only focus-within:not-sr-only">
        {data.map(item => (
          <button
            key={item.projectId}
            type="button"
            className="rounded px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onFocus={() => setActiveForecast(item)}
            onBlur={() => setActiveForecast(null)}
            onClick={() => onProjectSelect(item.projectId)}
          >
            Selecionar {item.projectName}
          </button>
        ))}
      </div>
    </>
  );
}
