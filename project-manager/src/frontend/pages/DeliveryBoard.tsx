import { useEffect, useState } from 'react';
import {
  Kanban,
  CheckSquare,
  Filter,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bot,
  Layers,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { athenaApi, TaskItem } from '@/services/athenaApi';
import { useToast } from '@/hooks/use-toast';

const DeliveryBoard = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await athenaApi.getDeliveryTasks();
    setTasks(data);
  }

  async function handleMoveStatus(taskId: string, newStatus: string) {
    try {
      await athenaApi.updateTaskStatus(taskId, newStatus);
      toast({
        title: 'Status atualizado',
        description: `Tarefa movida para ${newStatus}`,
      });
      loadTasks();
    } catch (err: any) {
      toast({
        title: 'Erro ao atualizar tarefa',
        description: err.message,
        variant: 'destructive',
      });
    }
  }

  const columns = [
    { id: 'TODO', label: 'A Fazer (TODO)', color: 'bg-muted/40' },
    { id: 'IN_PROGRESS', label: 'Em Progresso', color: 'bg-indigo-500/5 border-indigo-500/20' },
    { id: 'IN_REVIEW', label: 'Em Revisão', color: 'bg-amber-500/5 border-amber-500/20' },
    { id: 'DONE', label: 'Concluído (DONE)', color: 'bg-emerald-500/5 border-emerald-500/20' },
    { id: 'BLOCKED', label: 'Bloqueado', color: 'bg-destructive/5 border-destructive/20' },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (filterType !== 'ALL' && t.taskType !== filterType) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📋</span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Delivery Board (Status Operacional)
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Acompanhamento de tarefas e histórias por status operacional (`TODO` a `DONE`).
            </p>
          </div>
        </div>

        {/* Filtro por TaskType */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-muted-foreground flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Tipo de Tarefa:
          </span>
          {['ALL', 'SPECIFICATION', 'IMPLEMENTATION', 'TEST', 'VALIDATION', 'ARCHITECTURE', 'RESEARCH'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
                filterType === type
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Kanban de Status Operacional */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className={`flex flex-col rounded-2xl border border-border/80 p-3 min-w-[260px] ${col.color}`}
              >
                {/* Header da Coluna */}
                <div className="mb-3 flex items-center justify-between pb-2 border-b border-border/60">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">{col.label}</h2>
                  <Badge variant="secondary" className="text-xs font-bold h-5 px-1.5">
                    {colTasks.length}
                  </Badge>
                </div>

                {/* Lista de Tasks */}
                <div className="space-y-3 flex-1">
                  {colTasks.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border/60 text-center text-[11px] text-muted-foreground">
                      Nenhuma tarefa
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <Card key={task.id} className="border-border/80 bg-card shadow-2xs hover:border-primary/40 transition-all">
                        <CardContent className="p-4 space-y-2.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-mono font-bold text-primary">{task.code}</span>
                            <Badge variant="outline" className="text-[9px] font-mono">
                              {task.taskType}
                            </Badge>
                          </div>

                          <h3 className="text-xs font-bold text-foreground line-clamp-2">{task.title}</h3>
                          <p className="text-[11px] text-muted-foreground line-clamp-2">{task.description}</p>

                          {/* Subtasks e Agente */}
                          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                            {task.assignedAgent ? (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <span>{task.assignedAgent.avatar}</span>
                                <span className="font-semibold text-foreground truncate max-w-[100px]">{task.assignedAgent.name}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-[10px]">Não atribuído</span>
                            )}

                            {task.subtasks && task.subtasks.length > 0 && (
                              <span className="text-[10px] text-muted-foreground">
                                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
                              </span>
                            )}
                          </div>

                          {/* Ações de Transição de Status */}
                          <div className="pt-1 flex gap-1">
                            {col.id !== 'TODO' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-[10px] flex-1 px-1"
                                onClick={() => handleMoveStatus(task.id, 'TODO')}
                              >
                                ← TODO
                              </Button>
                            )}
                            {col.id !== 'IN_PROGRESS' && col.id !== 'DONE' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-[10px] flex-1 px-1"
                                onClick={() => handleMoveStatus(task.id, 'IN_PROGRESS')}
                              >
                                Em Progresso
                              </Button>
                            )}
                            {col.id !== 'DONE' && (
                              <Button
                                size="sm"
                                variant="default"
                                className="h-6 text-[10px] flex-1 px-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handleMoveStatus(task.id, 'DONE')}
                              >
                                Concluir ✓
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default DeliveryBoard;
