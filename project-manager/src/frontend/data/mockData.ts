export type ProjectStatus = 'on_track' | 'at_risk' | 'delayed' | 'completed';
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignee: TeamMember;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string;
  endDate: string;
  originalEndDate?: string;
  predictedEndDate?: string;
  progress: number;
  dependencies?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  progress: number;
  owner: TeamMember;
  members: TeamMember[];
  tasks: Task[];
  riskScore: number;
  predictedEndDate: string;
  updatedAt: string;
}

export interface ProjectHistoryPoint {
  projectId: string;
  date: string;
  planned: number;
  actual: number;
}

export const teamMembers: TeamMember[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@company.com', role: 'Gerente de Projetos', avatar: 'AS' },
  { id: '2', name: 'Carlos Souza', email: 'carlos@company.com', role: 'Desenvolvedor', avatar: 'CS' },
  { id: '3', name: 'Marina Costa', email: 'marina@company.com', role: 'Designer', avatar: 'MC' },
  { id: '4', name: 'Pedro Oliveira', email: 'pedro@company.com', role: 'Desenvolvedor', avatar: 'PO' },
  { id: '5', name: 'Julia Santos', email: 'julia@company.com', role: 'QA', avatar: 'JS' },
  { id: '6', name: 'Rafael Lima', email: 'rafael@company.com', role: 'DevOps', avatar: 'RL' },
];

const makeTasks = (projectId: string): Task[] => {
  const taskSets: Record<string, Task[]> = {
    '1': [
      { id: 't1', projectId: '1', title: 'Definir arquitetura do sistema', description: 'Documentar arquitetura técnica', assignee: teamMembers[1], status: 'done', priority: 'high', startDate: '2026-02-01', endDate: '2026-02-10', progress: 100 },
      { id: 't2', projectId: '1', title: 'Criar wireframes', description: 'Design de todas as telas', assignee: teamMembers[2], status: 'done', priority: 'high', startDate: '2026-02-05', endDate: '2026-02-15', progress: 100, dependencies: ['t1'] },
      { id: 't3', projectId: '1', title: 'Desenvolver API de autenticação', description: 'JWT + OAuth', assignee: teamMembers[3], status: 'in_progress', priority: 'critical', startDate: '2026-02-15', endDate: '2026-03-05', progress: 65, dependencies: ['t1'] },
      { id: 't4', projectId: '1', title: 'Implementar dashboard', description: 'Frontend do dashboard principal', assignee: teamMembers[1], status: 'in_progress', priority: 'high', startDate: '2026-02-20', endDate: '2026-03-10', progress: 40, dependencies: ['t2'] },
      { id: 't5', projectId: '1', title: 'Integração com SendGrid', description: 'Envio de notificações por email', assignee: teamMembers[5], status: 'todo', priority: 'medium', startDate: '2026-03-05', endDate: '2026-03-15', progress: 0, dependencies: ['t3'] },
      { id: 't6', projectId: '1', title: 'Testes de integração', description: 'Testes E2E', assignee: teamMembers[4], status: 'todo', priority: 'high', startDate: '2026-03-10', endDate: '2026-03-20', progress: 0, dependencies: ['t4', 't5'] },
    ],
    '2': [
      { id: 't7', projectId: '2', title: 'Pesquisa de mercado', description: 'Análise de concorrentes', assignee: teamMembers[0], status: 'done', priority: 'high', startDate: '2026-01-15', endDate: '2026-01-30', progress: 100 },
      { id: 't8', projectId: '2', title: 'Design do novo layout', description: 'Redesign completo', assignee: teamMembers[2], status: 'in_review', priority: 'critical', startDate: '2026-02-01', endDate: '2026-02-20', progress: 90, dependencies: ['t7'] },
      { id: 't9', projectId: '2', title: 'Migração de dados', description: 'Migrar dados para nova estrutura', assignee: teamMembers[3], status: 'in_progress', priority: 'high', startDate: '2026-02-15', endDate: '2026-03-10', progress: 30, dependencies: ['t7'] },
      { id: 't10', projectId: '2', title: 'Testes de performance', description: 'Load testing', assignee: teamMembers[4], status: 'todo', priority: 'medium', startDate: '2026-03-10', endDate: '2026-03-20', progress: 0, dependencies: ['t9'] },
    ],
    '3': [
      { id: 't11', projectId: '3', title: 'Configurar CI/CD', description: 'Pipeline de deploy', assignee: teamMembers[5], status: 'done', priority: 'critical', startDate: '2026-01-10', endDate: '2026-01-20', progress: 100 },
      { id: 't12', projectId: '3', title: 'Implementar módulo de relatórios', description: 'Relatórios em PDF', assignee: teamMembers[1], status: 'done', priority: 'high', startDate: '2026-01-20', endDate: '2026-02-10', progress: 100, dependencies: ['t11'] },
      { id: 't13', projectId: '3', title: 'Deploy em produção', description: 'Release final', assignee: teamMembers[5], status: 'done', priority: 'critical', startDate: '2026-02-10', endDate: '2026-02-15', progress: 100, dependencies: ['t12'] },
    ],
    '4': [
      { id: 't14', projectId: '4', title: 'Levantamento de requisitos', description: 'Entrevistas com stakeholders', assignee: teamMembers[0], status: 'in_progress', priority: 'high', startDate: '2026-03-01', endDate: '2026-03-15', progress: 50 },
      { id: 't15', projectId: '4', title: 'Prototipação', description: 'Protótipo de alta fidelidade', assignee: teamMembers[2], status: 'todo', priority: 'medium', startDate: '2026-03-15', endDate: '2026-04-01', progress: 0, dependencies: ['t14'] },
    ],
  };
  const tasks = taskSets[projectId] || [];
  return tasks.map(t => ({
    ...t,
    originalEndDate: t.endDate,
  }));
};

export const projects: Project[] = [
  {
    id: '1', name: 'Athena MVP', description: 'Desenvolvimento da plataforma de gestão de projetos', status: 'at_risk',
    startDate: '2026-02-01', endDate: '2026-03-30', progress: 52,
    owner: teamMembers[0], members: [teamMembers[0], teamMembers[1], teamMembers[2], teamMembers[3], teamMembers[4], teamMembers[5]],
    tasks: makeTasks('1'), riskScore: 72, predictedEndDate: '2026-04-11', updatedAt: '2026-03-15',
  },
  {
    id: '2', name: 'Redesign Plataforma Web', description: 'Modernização da interface do produto principal', status: 'at_risk',
    startDate: '2026-01-15', endDate: '2026-03-20', progress: 55,
    owner: teamMembers[2], members: [teamMembers[0], teamMembers[2], teamMembers[3], teamMembers[4]],
    tasks: makeTasks('2'), riskScore: 65, predictedEndDate: '2026-03-27', updatedAt: '2026-03-15',
  },
  {
    id: '3', name: 'Sistema de Relatórios', description: 'Módulo de geração de relatórios automatizados', status: 'completed',
    startDate: '2026-01-10', endDate: '2026-02-15', progress: 100,
    owner: teamMembers[1], members: [teamMembers[1], teamMembers[5]],
    tasks: makeTasks('3'), riskScore: 0, predictedEndDate: '2026-02-15', updatedAt: '2026-03-15',
  },
  {
    id: '4', name: 'App Mobile v2', description: 'Nova versão do aplicativo mobile com funcionalidades offline', status: 'on_track',
    startDate: '2026-03-01', endDate: '2026-05-30', progress: 15,
    owner: teamMembers[0], members: [teamMembers[0], teamMembers[2]],
    tasks: makeTasks('4'), riskScore: 20, predictedEndDate: '2026-05-30', updatedAt: '2026-03-15',
  },
];

export const projectHistory: ProjectHistoryPoint[] = [
  { projectId: '1', date: '2026-02-01', planned: 0, actual: 0 },
  { projectId: '1', date: '2026-02-15', planned: 24, actual: 20 },
  { projectId: '1', date: '2026-03-01', planned: 48, actual: 38 },
  { projectId: '1', date: '2026-03-15', planned: 72, actual: 52 },
  { projectId: '2', date: '2026-01-15', planned: 0, actual: 0 },
  { projectId: '2', date: '2026-02-01', planned: 25, actual: 22 },
  { projectId: '2', date: '2026-03-01', planned: 70, actual: 50 },
  { projectId: '2', date: '2026-03-15', planned: 92, actual: 55 },
  { projectId: '3', date: '2026-01-10', planned: 0, actual: 0 },
  { projectId: '3', date: '2026-01-25', planned: 35, actual: 40 },
  { projectId: '3', date: '2026-02-05', planned: 70, actual: 75 },
  { projectId: '3', date: '2026-02-15', planned: 100, actual: 100 },
  { projectId: '4', date: '2026-03-01', planned: 0, actual: 0 },
  { projectId: '4', date: '2026-03-06', planned: 5, actual: 4 },
  { projectId: '4', date: '2026-03-10', planned: 10, actual: 9 },
  { projectId: '4', date: '2026-03-15', planned: 15, actual: 15 },
];

export const getStatusColor = (status: ProjectStatus) => {
  const map: Record<ProjectStatus, string> = {
    on_track: 'text-success',
    at_risk: 'text-warning',
    delayed: 'text-destructive',
    completed: 'text-muted-foreground',
  };
  return map[status];
};

export const getStatusBg = (status: ProjectStatus) => {
  const map: Record<ProjectStatus, string> = {
    on_track: 'bg-success/10 text-success',
    at_risk: 'bg-warning/10 text-warning',
    delayed: 'bg-destructive/10 text-destructive',
    completed: 'bg-muted text-muted-foreground',
  };
  return map[status];
};

export const getStatusLabel = (status: ProjectStatus) => {
  const map: Record<ProjectStatus, string> = {
    on_track: 'No Prazo',
    at_risk: 'Em Risco',
    delayed: 'Atrasado',
    completed: 'Concluído',
  };
  return map[status];
};

export const getTaskStatusLabel = (status: TaskStatus) => {
  const map: Record<TaskStatus, string> = {
    todo: 'A Fazer',
    in_progress: 'Em Progresso',
    in_review: 'Em Revisão',
    done: 'Concluído',
  };
  return map[status];
};

export const getTaskStatusColor = (status: TaskStatus) => {
  const map: Record<TaskStatus, string> = {
    todo: 'bg-muted text-muted-foreground',
    in_progress: 'bg-info/10 text-info',
    in_review: 'bg-warning/10 text-warning',
    done: 'bg-success/10 text-success',
  };
  return map[status];
};

export const getPriorityColor = (priority: TaskPriority) => {
  const map: Record<TaskPriority, string> = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-info/10 text-info',
    high: 'bg-warning/10 text-warning',
    critical: 'bg-destructive/10 text-destructive',
  };
  return map[priority];
};

export const getPriorityLabel = (priority: TaskPriority) => {
  const map: Record<TaskPriority, string> = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    critical: 'Crítica',
  };
  return map[priority];
};



export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TaskPriority;
  projectId?: string;
  assignee?: TeamMember;
  createdBy: TeamMember;
  createdAt: string;
  updatedAt: string;
}

export const mockTickets: Ticket[] = [
  {
    id: 'TK-101',
    title: 'Erro de acesso no Dashboard',
    description: 'Alguns usuários reportaram erro 403 ao tentar acessar o dashboard principal.',
    status: 'open',
    priority: 'high',
    projectId: '1',
    createdBy: teamMembers[4],
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-03-12T10:00:00Z',
  },
  {
    id: 'TK-102',
    title: 'Atualizar logo na tela de login',
    description: 'Precisamos trocar a logo antiga pela nova identidade visual.',
    status: 'in_progress',
    priority: 'medium',
    projectId: '2',
    assignee: teamMembers[2],
    createdBy: teamMembers[0],
    createdAt: '2026-03-10T14:30:00Z',
    updatedAt: '2026-03-11T09:15:00Z',
  },
  {
    id: 'TK-103',
    title: 'Relatório mensal não foi gerado',
    description: 'O cronjob de relatórios parece ter falhado neste último final de semana.',
    status: 'resolved',
    priority: 'critical',
    projectId: '3',
    assignee: teamMembers[5],
    createdBy: teamMembers[1],
    createdAt: '2026-03-08T08:00:00Z',
    updatedAt: '2026-03-09T16:45:00Z',
  }
];

export const getTicketStatusLabel = (status: TicketStatus) => {
  const map: Record<TicketStatus, string> = {
    open: 'Aberto',
    in_progress: 'Em Andamento',
    waiting: 'Aguardando',
    resolved: 'Resolvido',
    closed: 'Fechado',
  };
  return map[status];
};

export const getTicketStatusColor = (status: TicketStatus) => {
  const map: Record<TicketStatus, string> = {
    open: 'bg-destructive/10 text-destructive',
    in_progress: 'bg-info/10 text-info',
    waiting: 'bg-warning/10 text-warning',
    resolved: 'bg-success/10 text-success',
    closed: 'bg-muted text-muted-foreground',
  };
  return map[status];
};
