import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project, getStatusBg, getStatusLabel } from '@/data/mockData';

interface ProjectCardProps {
  project: Project;
  delay?: number;
}

const ProjectCard = ({ project, delay = 0 }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.4 }}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{project.description}</p>
        </div>
        <span className={cn('ml-3 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium', getStatusBg(project.status))}>
          {getStatusLabel(project.status)}
        </span>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium text-foreground">{project.progress}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted">
          <div
            className={cn(
              'h-1.5 rounded-full transition-all',
              project.progress >= 100 ? 'bg-success' : project.riskScore > 60 ? 'bg-warning' : 'bg-primary'
            )}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(project.endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {project.members.length}
        </span>
        <span className="ml-auto text-xs">
          {project.tasks.filter(t => t.status === 'done').length}/{project.tasks.length} tarefas
        </span>
      </div>

      {/* Avatars */}
      <div className="mt-3 flex -space-x-2">
        {project.members.slice(0, 4).map((m) => (
          <div key={m.id} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-secondary text-[10px] font-medium text-secondary-foreground">
            {m.avatar}
          </div>
        ))}
        {project.members.length > 4 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium text-muted-foreground">
            +{project.members.length - 4}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
