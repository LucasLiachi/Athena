import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Task, getTaskStatusLabel, getTaskStatusColor, getPriorityColor, getPriorityLabel } from '@/data/mockData';

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div className="space-y-2">
      {tasks.map((task, i) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group flex items-center gap-4 rounded-xl border border-white/5 bg-card/40 backdrop-blur-md p-4 transition-all hover:bg-card/60 hover:border-white/20 hover:shadow-lg shadow-sm"
        >
          {/* Progress circle */}
          <div className="relative h-9 w-9 shrink-0">
            <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke={task.progress === 100 ? 'hsl(var(--success))' : 'hsl(var(--primary))'}
                strokeWidth="3"
                strokeDasharray={`${task.progress * 0.88} 88`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground">
              {task.progress}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
          </div>

          {/* Assignee */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground ring-1 ring-white/10 shadow-sm">
              {task.assignee.avatar}
            </div>
            <span className="text-xs text-muted-foreground">{task.assignee.name.split(' ')[0]}</span>
          </div>

          {/* Priority */}
          <span className={cn('hidden md:inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide backdrop-blur-sm shadow-sm', getPriorityColor(task.priority))}>
            {getPriorityLabel(task.priority)}
          </span>

          {/* Status */}
          <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide backdrop-blur-sm shadow-sm', getTaskStatusColor(task.status))}>
            {getTaskStatusLabel(task.status)}
          </span>

          {/* Dates */}
          <div className="hidden lg:flex flex-col items-end shrink-0 w-24">
            {task.predictedEndDate && task.predictedEndDate !== task.originalEndDate ? (
              <>
                <span className="text-xs font-medium text-warning">
                  {new Date(task.predictedEndDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </span>
                <span className="text-[10px] text-muted-foreground line-through">
                  {new Date(task.originalEndDate || task.endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">
                {new Date(task.endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TaskList;
