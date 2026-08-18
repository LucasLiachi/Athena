import { Plus } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { projects } from '@/data/mockData';

const Projects = () => {
  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
          <p className="mt-1 text-sm text-muted-foreground">{projects.length} projetos no total</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Novo Projeto
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} delay={i} />
        ))}
      </div>
    </AppLayout>
  );
};

export default Projects;
