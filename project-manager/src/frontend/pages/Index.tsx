import { useMemo, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { projects, type Project, type TaskStatus, type ProjectStatus } from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Shield,
  Layers,
  ListChecks,
  TrendingUp,
} from 'lucide-react';

/* ───────────────────── helpers ───────────────────── */

const statusIcon: Record<ProjectStatus, { icon: typeof Clock; color: string; bg: string }> = {
  on_track: { icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34,197,94,.12)' },
  at_risk: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,.12)' },
  delayed: { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,.12)' },
  completed: { icon: CheckCircle2, color: '#6366f1', bg: 'rgba(99,102,241,.12)' },
};

const taskStatusConfig: Record<TaskStatus, { label: string; color: string; icon: typeof Clock }> = {
  todo: { label: 'A fazer', color: '#94a3b8', icon: Clock },
  in_progress: { label: 'Em progresso', color: '#f59e0b', icon: AlertTriangle },
  in_review: { label: 'Em revisão', color: '#ef4444', icon: XCircle },
  done: { label: 'Concluído', color: '#22c55e', icon: CheckCircle2 },
};

const riskLevelConfig = [
  { key: 'low' as const, label: 'Baixo', color: '#22c55e', max: 30 },
  { key: 'medium' as const, label: 'Médio', color: '#f59e0b', max: 60 },
  { key: 'high' as const, label: 'Alto', color: '#ef4444', max: 100 },
];

/* Mock budget data per project */
const budgetData: Record<string, { planned: number; actual: number }> = {
  '1': { planned: 200000, actual: 85000 },
  '2': { planned: 150000, actual: 72000 },
  '3': { planned: 80000, actual: 78000 },
  '4': { planned: 120000, actual: 18000 },
};

const formatCurrency = (val: number) =>
  val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

/* ─────────── Mini donut component ─────────── */

function RiskDonut({ value, total, color, label }: { value: number; total: number; color: string; label: string }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  const data = [
    { name: 'value', v: value },
    { name: 'rest', v: Math.max(total - value, 0) },
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="v"
              cx="50%"
              cy="50%"
              innerRadius={24}
              outerRadius={36}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
          {pct}%
        </span>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

/* ─────────── Performance gauge ─────────── */

function PerformanceGauge({ progress, status }: { progress: number; status: ProjectStatus }) {
  const cfg = statusIcon[status];
  const Icon = cfg.icon;
  const gaugeData = [
    { name: 'progress', v: progress },
    { name: 'remaining', v: 100 - progress },
  ];

  const statusLabels: Record<ProjectStatus, string> = {
    on_track: 'No prazo',
    at_risk: 'Em risco',
    delayed: 'Atrasado',
    completed: 'Concluído',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-32 w-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey="v"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={58}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill={cfg.color} />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="h-5 w-5 mb-0.5" style={{ color: cfg.color }} />
          <span className="text-xl font-bold text-foreground">{progress.toFixed(0)}%</span>
        </div>
      </div>
      <span
        className="rounded-full px-3 py-1 text-xs font-semibold"
        style={{ backgroundColor: cfg.bg, color: cfg.color }}
      >
        {statusLabels[status]}
      </span>
    </div>
  );
}

/* ─────────── Horizontal status bars ─────────── */

function StatusBars({ counts, total }: { counts: { label: string; value: number; color: string; icon: typeof Clock }[]; total: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      {counts.map((item) => {
        const pct = total === 0 ? 0 : (item.value / total) * 100;
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: item.color + '20' }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
            </div>
            <span className="w-6 text-right text-sm font-bold text-foreground">{item.value}</span>
            <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */

const Index = () => {
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const filteredProjects = useMemo(() => {
    if (selectedProjectId === 'all') return projects;
    return projects.filter((p) => p.id === selectedProjectId);
  }, [selectedProjectId]);

  /* ── Compute aggregated data ── */
  const dashboard = useMemo(() => {
    const allTasks = filteredProjects.flatMap((p) => p.tasks);
    const totalTasks = allTasks.length;

    // Performance
    const avgProgress =
      filteredProjects.length === 0
        ? 0
        : filteredProjects.reduce((s, p) => s + p.progress, 0) / filteredProjects.length;

    const dominantStatus: ProjectStatus =
      filteredProjects.some((p) => p.status === 'delayed')
        ? 'delayed'
        : filteredProjects.some((p) => p.status === 'at_risk')
          ? 'at_risk'
          : filteredProjects.every((p) => p.status === 'completed')
            ? 'completed'
            : 'on_track';

    // Tasks by status
    const tasksByStatus: Record<TaskStatus, number> = { todo: 0, in_progress: 0, in_review: 0, done: 0 };
    allTasks.forEach((t) => { tasksByStatus[t.status]++; });

    // Budget
    const budgetPlanned = filteredProjects.reduce((s, p) => s + (budgetData[p.id]?.planned ?? 0), 0);
    const budgetActual = filteredProjects.reduce((s, p) => s + (budgetData[p.id]?.actual ?? 0), 0);

    // Risks by level
    const riskCounts = { low: 0, medium: 0, high: 0 };
    filteredProjects.forEach((p) => {
      if (p.riskScore <= 30) riskCounts.low++;
      else if (p.riskScore <= 60) riskCounts.medium++;
      else riskCounts.high++;
    });

    // Risk table items
    const riskItems = filteredProjects
      .filter((p) => p.status !== 'completed')
      .map((p) => {
        const level = p.riskScore <= 30 ? 'low' : p.riskScore <= 60 ? 'medium' : 'high';
        const overdueTasks = p.tasks.filter(
          (t) => t.status !== 'done' && t.endDate < new Date().toISOString().split('T')[0]
        );
        const riskDescription =
          p.riskScore > 60
            ? 'Projeto com alto risco de atraso'
            : p.riskScore > 30
              ? 'Atenção necessária nos prazos'
              : 'Projeto dentro do esperado';
        const impact =
          overdueTasks.length > 0
            ? `${overdueTasks.length} tarefa(s) atrasada(s)`
            : 'Nenhum impacto identificado';
        return {
          projectName: p.name,
          riskScore: p.riskScore,
          level,
          description: riskDescription,
          impact,
          owner: p.owner.name,
        };
      });

    return {
      avgProgress,
      dominantStatus,
      tasksByStatus,
      totalTasks,
      budgetPlanned,
      budgetActual,
      riskCounts,
      riskItems,
      totalProjects: filteredProjects.length,
    };
  }, [filteredProjects]);

  const taskStatusBars = (['done', 'in_review', 'in_progress', 'todo'] as TaskStatus[]).map((status) => ({
    label: taskStatusConfig[status].label,
    value: dashboard.tasksByStatus[status],
    color: taskStatusConfig[status].color,
    icon: taskStatusConfig[status].icon,
  }));

  /* Etapas = unique project stages (we simulate from task groups) */
  const etapaBars = [
    { label: 'Concluídas', value: filteredProjects.filter((p) => p.status === 'completed').length, color: '#22c55e', icon: CheckCircle2 },
    { label: 'No Prazo', value: filteredProjects.filter((p) => p.status === 'on_track').length, color: '#3b82f6', icon: Clock },
    { label: 'Em Risco', value: filteredProjects.filter((p) => p.status === 'at_risk').length, color: '#f59e0b', icon: AlertTriangle },
    { label: 'Atrasadas', value: filteredProjects.filter((p) => p.status === 'delayed').length, color: '#ef4444', icon: XCircle },
  ];

  const filteredRiskItems = useMemo(() => {
    if (riskFilter === 'all') return dashboard.riskItems;
    return dashboard.riskItems.filter((item) => item.level === riskFilter);
  }, [dashboard.riskItems, riskFilter]);

  const riskLevelLabel: Record<string, string> = { low: 'Baixo', medium: 'Médio', high: 'Alto' };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Dashboard — Gerenciamento de Projeto
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Visão consolidada de performance, etapas, atividades, orçamento e riscos.
            </p>
          </div>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-[240px]" aria-label="Filtrar projeto">
              <SelectValue placeholder="Todos os projetos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os projetos</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.header>

        {/* ══════════ TOP ROW: 4 Cards ══════════ */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          {/* ── 1. Performance ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="relative overflow-hidden border-border/60 h-full">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5" />
              <CardContent className="flex flex-col items-center justify-center py-6">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" /> Performance
                </p>
                <PerformanceGauge progress={dashboard.avgProgress} status={dashboard.dominantStatus} />
              </CardContent>
            </Card>
          </motion.div>

          {/* ── 2. Etapas ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border/60 h-full">
              <CardContent className="py-6">
                <p className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" /> Etapas
                </p>
                <StatusBars counts={etapaBars} total={dashboard.totalProjects} />
              </CardContent>
            </Card>
          </motion.div>

          {/* ── 3. Atividades ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-border/60 h-full">
              <CardContent className="py-6">
                <p className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <ListChecks className="h-3.5 w-3.5" /> Atividades
                </p>
                <StatusBars counts={taskStatusBars} total={dashboard.totalTasks} />
              </CardContent>
            </Card>
          </motion.div>

          {/* ── 4. Orçamentos ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="relative overflow-hidden border-border/60 h-full">
              <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-success/5" />
              <CardContent className="flex flex-col justify-center gap-5 py-6">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5" /> Orçamentos
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Planejado</p>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(dashboard.budgetPlanned)}</p>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <p className="text-xs text-muted-foreground">Realizado</p>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(dashboard.budgetActual)}</p>
                  </div>
                  {/* Budget usage bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Utilização</span>
                      <span>
                        {dashboard.budgetPlanned === 0
                          ? '0%'
                          : `${Math.round((dashboard.budgetActual / dashboard.budgetPlanned) * 100)}%`}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor:
                            dashboard.budgetActual / dashboard.budgetPlanned > 0.9
                              ? '#ef4444'
                              : dashboard.budgetActual / dashboard.budgetPlanned > 0.7
                                ? '#f59e0b'
                                : '#22c55e',
                        }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((dashboard.budgetActual / dashboard.budgetPlanned) * 100, 100)}%`,
                        }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ══════════ MID ROW: Progresso dos Projetos ══════════ */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <Card className="border-border/60">
            <CardContent className="py-6">
              <p className="mb-5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" /> Progresso dos Projetos
              </p>

              <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                {/* ── Left: Horizontal bar ranking ── */}
                <div className="flex flex-col gap-4">
                  {[...filteredProjects]
                    .sort((a, b) => b.progress - a.progress)
                    .map((project, idx) => {
                      const cfg = statusIcon[project.status];
                      const StatusIcon = cfg.icon;
                      const statusLabels: Record<ProjectStatus, string> = {
                        on_track: 'No prazo',
                        at_risk: 'Em risco',
                        delayed: 'Atrasado',
                        completed: 'Concluído',
                      };
                      return (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.06 }}
                          className="group"
                        >
                          <div className="mb-1.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                {idx + 1}
                              </span>
                              <span className="text-sm font-semibold text-foreground">{project.name}</span>
                              <span
                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                                style={{ backgroundColor: cfg.bg, color: cfg.color }}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {statusLabels[project.status]}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">{project.owner.name}</span>
                              <span className="min-w-[48px] text-right text-sm font-bold text-foreground">
                                {project.progress}%
                              </span>
                            </div>
                          </div>
                          <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
                            <motion.div
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${cfg.color}cc, ${cfg.color})`,
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 1, delay: idx * 0.08, ease: 'easeOut' }}
                            />
                            {/* Glow effect */}
                            <motion.div
                              className="absolute inset-y-0 left-0 rounded-full opacity-30 blur-sm"
                              style={{ backgroundColor: cfg.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 1, delay: idx * 0.08, ease: 'easeOut' }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                </div>

                {/* ── Right: Summary donut ── */}
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border/40 bg-muted/30 p-5">
                  <div className="relative h-36 w-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[...filteredProjects]
                            .sort((a, b) => b.progress - a.progress)
                            .map((p) => ({ name: p.name, value: p.progress }))}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={38}
                          outerRadius={60}
                          startAngle={90}
                          endAngle={-270}
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                        >
                          {[...filteredProjects]
                            .sort((a, b) => b.progress - a.progress)
                            .map((p) => (
                              <Cell key={p.id} fill={statusIcon[p.status].color} />
                            ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-foreground">{filteredProjects.length}</span>
                      <span className="text-[10px] text-muted-foreground">projetos</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col gap-1.5 text-xs">
                    {[...filteredProjects]
                      .sort((a, b) => b.progress - a.progress)
                      .map((p) => (
                        <div key={p.id} className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: statusIcon[p.status].color }}
                          />
                          <span className="text-muted-foreground truncate max-w-[180px]">{p.name}</span>
                          <span className="ml-auto font-bold text-foreground">{p.progress}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="border-border/60">
            <CardContent className="py-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <AlertTriangle className="h-3.5 w-3.5" /> Riscos
                </p>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-[160px]" aria-label="Filtrar risco">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="low">Baixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                {/* ── Left: Donut charts ── */}
                <div className="flex flex-col gap-5 rounded-xl border border-border/40 bg-muted/30 p-4">
                  {riskLevelConfig.map((level) => (
                    <RiskDonut
                      key={level.key}
                      value={dashboard.riskCounts[level.key]}
                      total={dashboard.totalProjects}
                      color={level.color}
                      label={level.label}
                    />
                  ))}
                </div>

                {/* ── Right: Risk table ── */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Projeto</th>
                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risco</th>
                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descrição do risco</th>
                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Impacto</th>
                        <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Responsável</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRiskItems.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground">
                            Nenhum risco encontrado para o filtro selecionado.
                          </td>
                        </tr>
                      ) : (
                        filteredRiskItems.map((item, idx) => (
                          <motion.tr
                            key={item.projectName}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-b border-border/40 last:border-0"
                          >
                            <td className="py-3 pr-4 font-medium text-foreground">{item.projectName}</td>
                            <td className="py-3 pr-4">
                              <span
                                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                style={{
                                  backgroundColor:
                                    riskLevelConfig.find((r) => r.key === item.level)!.color + '18',
                                  color: riskLevelConfig.find((r) => r.key === item.level)!.color,
                                }}
                              >
                                {item.riskScore}% — {riskLevelLabel[item.level]}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-muted-foreground">{item.description}</td>
                            <td className="py-3 pr-4 text-muted-foreground">{item.impact}</td>
                            <td className="py-3 text-muted-foreground">{item.owner}</td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Index;
