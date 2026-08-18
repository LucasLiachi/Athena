import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { PortfolioProgressPoint } from '@/lib/dashboardMetrics';

const chartConfig = {
  planned: { label: 'Planejado', color: 'hsl(var(--primary))' },
  actual: { label: 'Realizado', color: 'hsl(var(--warning))' },
} satisfies ChartConfig;

const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: 'short',
});

interface ProgressTooltipValueProps {
  value: string | number | (string | number)[];
  name: string | number;
}

export function ProgressTooltipValue({ value, name }: ProgressTooltipValueProps) {
  const label = chartConfig[name as keyof typeof chartConfig]?.label ?? name;

  return (
    <>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium tabular-nums text-foreground">{Number(value).toLocaleString('pt-BR')}%</span>
    </>
  );
}

const progressTooltipFormatter = (
  value: string | number | (string | number)[],
  name: string | number,
) => <ProgressTooltipValue value={value} name={name} />;

interface PortfolioProgressChartProps {
  data: PortfolioProgressPoint[];
}

export default function PortfolioProgressChart({ data }: PortfolioProgressChartProps) {
  if (data.length === 0) {
    return <p className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">Sem dados de progresso para o período selecionado.</p>;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <ChartContainer
      config={chartConfig}
      className="h-72 w-full aspect-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      role="img"
      aria-label="Evolução do progresso planejado e realizado"
      tabIndex={0}
    >
      <LineChart data={data} accessibilityLayer margin={{ left: 4, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatDate} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tickFormatter={value => `${value}%`} tickLine={false} axisLine={false} />
        <ChartTooltip
          content={(
            <ChartTooltipContent
              labelFormatter={value => formatDate(String(value))}
              formatter={progressTooltipFormatter}
            />
          )}
        />
        <Line
          dataKey="planned"
          type="monotone"
          stroke="var(--color-planned)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={!reduceMotion}
        />
        <Line
          dataKey="actual"
          type="monotone"
          stroke="var(--color-actual)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={!reduceMotion}
        />
      </LineChart>
    </ChartContainer>
  );
}
