import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import TaskList from '@/components/project/TaskList';
import GanttChart from '@/components/project/GanttChart';
import { projects, getStatusBg, getStatusLabel } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { recalculateSchedule } from '@/lib/schedule';
import Tickets from '@/pages/Tickets';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);
  const [view, setView] = useState<'tasks' | 'gantt' | 'tickets'>('tasks');

  const recalculatedTasks = useMemo(() => {
    return project ? recalculateSchedule(project.tasks) : [];
  }, [project]);

  if (!project) {
    return (
      <AppLayout>
        <p className="text-muted-foreground">Projeto não encontrado.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Back */}
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
          </div>
          <span className={cn('rounded-full px-3 py-1.5 text-xs font-medium', getStatusBg(project.status))}>
            {getStatusLabel(project.status)}
          </span>
        </div>

        {/* Meta bar */}
        <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(project.startDate).toLocaleDateString('pt-BR')} — {new Date(project.endDate).toLocaleDateString('pt-BR')}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {project.members.length} membros
          </span>
          {project.riskScore > 50 && (
            <span className="flex items-center gap-1.5 text-warning">
              <AlertTriangle className="h-4 w-4" />
              Risco: {project.riskScore}%
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="mt-4 max-w-md">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progresso geral</span>
            <span className="font-medium text-foreground">{project.progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className={cn('h-2 rounded-full transition-all', project.riskScore > 60 ? 'bg-warning' : 'bg-primary')} style={{ width: `${project.progress}%` }} />
          </div>
        </div>
      </motion.div>

      {/* View toggle */}
      <div className="mb-6 flex items-center gap-1 rounded-lg bg-secondary p-1 w-fit">
        <button
          onClick={() => setView('tasks')}
          className={cn('rounded-md px-4 py-1.5 text-xs font-medium transition-colors', view === 'tasks' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
        >
          Tarefas
        </button>
        <button
          onClick={() => setView('gantt')}
          className={cn('rounded-md px-4 py-1.5 text-xs font-medium transition-colors', view === 'gantt' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
        >
          Timeline
        </button>
        <button
          onClick={() => setView('tickets')}
          className={cn('rounded-md px-4 py-1.5 text-xs font-medium transition-colors', view === 'tickets' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
        >
          Tickets
        </button>
      </div>

      {/* Content */}
      {view === 'tasks' ? (
        <TaskList tasks={recalculatedTasks} />
      ) : view === 'gantt' ? (
        <GanttChart />
      ) : (
        <Tickets isEmbedded projectId={project.id} />
      )}
    </AppLayout>
  );
};

export default ProjectDetail;
