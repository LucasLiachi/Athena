import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import GanttChart from '@/components/project/GanttChart';
import { projects } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Timeline = () => {
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const activeProjects = projects.filter(p => p.status !== 'completed');

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timeline Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Visão consolidada de todas as tarefas ativas</p>
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por projeto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os projetos</SelectItem>
              {projects.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedProject === 'all' ? (
        <GanttChart />
      ) : (
        <div>
          {(() => {
            const project = projects.find(p => p.id === selectedProject);
            if (!project) return <p className="text-muted-foreground">Projeto não encontrado.</p>;
            if (project.tasks.length === 0) return <p className="text-muted-foreground">Este projeto não possui tarefas.</p>;
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <h2 className="text-lg font-semibold text-foreground">{project.name}</h2>
                  <span className="text-sm text-muted-foreground">· {project.tasks.length} tarefas</span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-border bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tarefa</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Responsável</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Prioridade</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Início</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fim</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Progresso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.tasks.map(task => {
                        const statusColors: Record<string, string> = {
                          todo: 'bg-muted text-muted-foreground',
                          in_progress: 'bg-primary/10 text-primary',
                          in_review: 'bg-warning/10 text-warning',
                          done: 'bg-success/10 text-success',
                        };
                        const statusLabels: Record<string, string> = {
                          todo: 'A Fazer',
                          in_progress: 'Em Progresso',
                          in_review: 'Em Revisão',
                          done: 'Concluído',
                        };
                        const priorityLabels: Record<string, string> = {
                          low: 'Baixa', medium: 'Média', high: 'Alta', critical: 'Crítica',
                        };
                        return (
                          <tr key={task.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-medium text-foreground">{task.title}</td>
                            <td className="px-4 py-3 text-muted-foreground">{task.assignee.name}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[task.status]}`}>
                                {statusLabels[task.status]}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{priorityLabels[task.priority]}</td>
                            <td className="px-4 py-3 text-muted-foreground">{new Date(task.startDate).toLocaleDateString('pt-BR')}</td>
                            <td className="px-4 py-3 text-muted-foreground">{new Date(task.endDate).toLocaleDateString('pt-BR')}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                                  <div className="h-full rounded-full bg-primary" style={{ width: `${task.progress}%` }} />
                                </div>
                                <span className="text-xs text-muted-foreground">{task.progress}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </AppLayout>
  );
};

export default Timeline;
