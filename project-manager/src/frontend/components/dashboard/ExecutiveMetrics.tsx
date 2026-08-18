import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import type { ExecutiveMetrics } from '@/lib/dashboardMetrics';
import StatsCard from './StatsCard';

interface ExecutiveMetricsGridProps {
  metrics: ExecutiveMetrics;
}

export default function ExecutiveMetricsGrid({ metrics }: ExecutiveMetricsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="Progresso Médio" value={`${Math.round(metrics.averageProgress)}%`} icon={TrendingUp} />
      <StatsCard title="Entregas no Prazo" value={`${metrics.onTimeProjects}/${metrics.totalProjects}`} icon={Clock} />
      <StatsCard
        title="Risco Médio"
        value={`${Math.round(metrics.averageRiskScore)}%`}
        subtitle={`${metrics.atRiskProjects} acima do limite`}
        icon={AlertTriangle}
        className="border-warning/30"
      />
      <StatsCard title="Tarefas Concluídas" value={`${metrics.completedTasks}/${metrics.totalTasks}`} icon={CheckCircle2} />
    </div>
  );
}
