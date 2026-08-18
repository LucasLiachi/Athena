import type { Project } from '@/data/mockData';
import type { DashboardPeriod } from '@/lib/dashboardMetrics';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const periods = [30, 60, 90] as const;

interface DashboardFiltersProps {
  projects: Project[];
  projectId: string;
  period: DashboardPeriod;
  onProjectChange: (projectId: string) => void;
  onPeriodChange: (period: DashboardPeriod) => void;
  onClear: () => void;
}

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
        <SelectTrigger aria-label="Período" className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periods.map(period => <SelectItem key={period} value={String(period)}>{period} dias</SelectItem>)}
        </SelectContent>
      </Select>
      {props.projectId !== 'all' && <Button variant="ghost" onClick={props.onClear}>Limpar seleção</Button>}
    </div>
  );
}
