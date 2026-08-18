import { Fragment, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FolderKanban,
  ListTodo,
  Search,
  Users,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  getPriorityColor,
  getPriorityLabel,
  getTaskStatusColor,
  getTaskStatusLabel,
  projects,
  teamMembers,
  type TaskStatus,
} from '@/data/mockData';
import {
  buildTeamAllocations,
  formatAllocationDate,
  formatNextDelivery,
  type TeamAllocation,
} from '@/lib/teamAllocation';
import HeatMap from '@/components/team/HeatMap';
import RiskMap from '@/components/team/RiskMap';

const ActivityDetails = ({ allocation }: { allocation: TeamAllocation }) => (
  <div className="space-y-4">
    {allocation.groups.length === 0 ? (
      <p className="text-sm text-muted-foreground">Nenhuma atividade atribuída.</p>
    ) : allocation.groups.map(group => (
      <section key={group.project.id} className="rounded-lg border border-border bg-background p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Link
            to={`/projects/${group.project.id}`}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            {group.project.name}
          </Link>
          <span className="text-xs text-muted-foreground">
            {group.tasks.length} {group.tasks.length === 1 ? 'atividade' : 'atividades'}
          </span>
        </div>

        <div className="space-y-3">
          {group.tasks.map(task => (
            <article key={task.id} className="rounded-md bg-muted/40 p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-sm font-medium text-foreground">{task.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getTaskStatusColor(task.status)}>{getTaskStatusLabel(task.status)}</Badge>
                  <Badge className={getPriorityColor(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-xs text-muted-foreground sm:grid-cols-[1fr_auto_auto] sm:items-end">
                <div>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span>Progresso</span>
                    <span className="font-medium text-foreground">{task.progress}%</span>
                  </div>
                  <Progress
                    value={task.progress}
                    className="h-2"
                    aria-label={`Progresso de ${task.title}: ${task.progress}%`}
                  />
                </div>
                <p><span className="font-medium text-foreground">Início:</span> {formatAllocationDate(task.startDate)}</p>
                <p><span className="font-medium text-foreground">Fim:</span> {formatAllocationDate(task.endDate)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    ))}
  </div>
);

const Team = () => {
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
  const hasFilters = Boolean(search || projectId !== 'all' || taskStatus !== 'all');

  const clearFilters = () => {
    setSearch('');
    setProjectId('all');
    setTaskStatus('all');
  };

  const toggleMember = (memberId: string) => {
    setExpandedIds(current => {
      const next = new Set(current);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  };

  const expansionButton = (allocation: TeamAllocation) => {
    const expanded = expandedIds.has(allocation.member.id);

    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-expanded={expanded}
        aria-label={`${expanded ? 'Ocultar' : 'Ver'} atividades de ${allocation.member.name}`}
        onClick={() => toggleMember(allocation.member.id)}
      >
        {expanded ? <ChevronUp /> : <ChevronDown />}
        {expanded ? 'Ocultar atividades' : 'Ver atividades'}
      </Button>
    );
  };

  const metrics = [
    { label: 'Profissionais', value: teamMembers.length, detail: 'cadastrados na equipe', icon: Users },
    { label: 'Projetos ativos', value: activeProjects.length, detail: 'em acompanhamento', icon: FolderKanban },
    { label: 'Atividades abertas', value: openTasks.length, detail: 'a fazer, em andamento ou em revisão', icon: ListTodo },
    { label: 'Atividades críticas', value: criticalTasks.length, detail: 'exigem atenção', icon: AlertTriangle },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-foreground">Alocação da Equipe</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe profissionais, projetos e atividades em andamento
          </p>
        </header>

        <section aria-label="Indicadores da equipe" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(metric => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.detail}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <Card>
          <CardContent className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:items-end">
              <div className="min-w-0">
                <label htmlFor="allocation-search" className="mb-2 block text-sm font-medium text-foreground">
                  Buscar profissional
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="allocation-search"
                    type="search"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Nome, cargo ou e-mail"
                    className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <label htmlFor="allocation-project" className="mb-2 block text-sm font-medium text-foreground">Projeto</label>
                <select
                  id="allocation-project"
                  value={projectId}
                  onChange={event => setProjectId(event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">Todos os projetos</option>
                  {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>
              </div>

              <div className="min-w-0">
                <label htmlFor="allocation-status" className="mb-2 block text-sm font-medium text-foreground">Status da atividade</label>
                <select
                  id="allocation-status"
                  value={taskStatus}
                  onChange={event => setTaskStatus(event.target.value as TaskStatus | 'all')}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">Todos os status</option>
                  <option value="todo">A Fazer</option>
                  <option value="in_progress">Em Progresso</option>
                  <option value="in_review">Em Revisão</option>
                  <option value="done">Concluído</option>
                </select>
              </div>

              {hasFilters && allocations.length > 0 && (
                <Button type="button" variant="outline" onClick={clearFilters} className="self-end">Limpar filtros</Button>
              )}
            </div>
          </CardContent>
        </Card>

{/* Visualizações de alocação */}
<HeatMap allocations={allocations} />
<RiskMap allocations={allocations} />

        {teamMembers.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">Nenhum profissional cadastrado</CardContent>
          </Card>
        ) : allocations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
              <div>
                <p className="font-semibold text-foreground">Nenhuma alocação encontrada</p>
                <p className="mt-1 text-sm text-muted-foreground">Ajuste os filtros para visualizar outros profissionais.</p>
              </div>
              <Button type="button" variant="outline" onClick={clearFilters}>Limpar filtros</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-xl border border-border bg-card lg:block">
              <table className="hidden w-full text-sm lg:table">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Profissional</th>
                    <th className="px-5 py-3 font-medium">Função</th>
                    <th className="px-5 py-3 font-medium">Projetos ativos</th>
                    <th className="px-5 py-3 font-medium">Atividades abertas</th>
                    <th className="px-5 py-3 font-medium">Próxima entrega</th>
                    <th className="px-5 py-3 text-right font-medium">Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map(allocation => {
                    const expanded = expandedIds.has(allocation.member.id);
                    return (
                      <Fragment key={allocation.member.id}>
                        <tr className="border-t border-border first:border-t-0">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                {allocation.member.avatar}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{allocation.member.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">{allocation.member.role}</td>
                          <td className="px-5 py-4 text-foreground">{allocation.activeProjects.length}</td>
                          <td className="px-5 py-4 text-foreground">{allocation.openTasks.length}</td>
                          <td className="px-5 py-4 text-muted-foreground">{formatNextDelivery(allocation.openTasks.length, allocation.nextDelivery)}</td>
                          <td className="px-5 py-4 text-right">{expansionButton(allocation)}</td>
                        </tr>
                        {expanded && (
                          <tr className="border-t border-border bg-muted/20">
                            <td colSpan={6} className="px-5 py-4"><ActivityDetails allocation={allocation} /></td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <section aria-label="Alocações em cards" className="space-y-4 lg:hidden">
              {allocations.map(allocation => {
                const expanded = expandedIds.has(allocation.member.id);
                return (
                  <Card key={allocation.member.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {allocation.member.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground">{allocation.member.name}</p>
                          <p className="text-sm text-muted-foreground">{allocation.member.role}</p>
                        </div>
                      </div>

                      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-3 text-center">
                        <div>
                          <dt className="text-[11px] text-muted-foreground">Projetos</dt>
                          <dd className="mt-1 font-semibold text-foreground">{allocation.activeProjects.length}</dd>
                        </div>
                        <div>
                          <dt className="text-[11px] text-muted-foreground">Abertas</dt>
                          <dd className="mt-1 font-semibold text-foreground">{allocation.openTasks.length}</dd>
                        </div>
                        <div>
                          <dt className="text-[11px] text-muted-foreground">Entrega</dt>
                          <dd className="mt-1 text-xs font-semibold text-foreground">{formatNextDelivery(allocation.openTasks.length, allocation.nextDelivery)}</dd>
                        </div>
                      </dl>

                      <div className="mt-3 flex justify-end">{expansionButton(allocation)}</div>
                      {expanded && <div className="mt-4"><ActivityDetails allocation={allocation} /></div>}
                    </CardContent>
                  </Card>
                );
              })}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Team;
