import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Kanban,
  Landmark,
  FileCode2,
  Bot,
  ShieldAlert,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  Cpu,
  Layers,
  AlertTriangle,
  FolderKanban,
  Activity,
  Sparkles,
  Link2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Check,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { athenaApi, OverviewData } from '@/services/athenaApi';

const Overview = () => {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados locais para interatividade rápida na Torre de Controle
  const [activeTabWbs, setActiveTabWbs] = useState<'all' | 'stories' | 'subtasks'>('all');
  const [selectedMaturityLevel, setSelectedMaturityLevel] = useState('L4');

  useEffect(() => {
    athenaApi.getOverview().then((data) => {
      setOverview(data);
      setLoading(false);
    });
  }, []);

  // Dados do JSON Estruturado (AuraManage PMO Control Tower)
  const operationalKpis = [
    { label: 'VELOCIDADE', value: '42 pts', icon: TrendingUp, color: 'text-purple-400 bg-purple-500/10' },
    { label: 'BURNDOWN', value: '128 pts', icon: Activity, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'FEATURES L4+', value: '12', icon: Layers, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'BLOQUEIOS', value: '7', icon: AlertCircle, color: 'text-red-400 bg-red-500/10' },
    { label: 'RISCO ALTO', value: '3', icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/10' },
    { label: 'CYCLE TIME', value: '6.2 dias', icon: Clock, color: 'text-cyan-400 bg-cyan-500/10' },
  ];

  const strategicPortfolios = [
    {
      name: 'PORTFÓLIO A',
      desc: 'Plataforma Principal',
      tag: 'Core Platform',
      color: 'border-indigo-500/40 bg-indigo-500/5',
      initiatives: [
        { name: 'Iniciativa A1: Core Engine 2.0', q: 'Q2/25', status: 'Concluído' },
        { name: 'Iniciativa A2: Dashboard Inteligente', q: 'Q3/25', status: 'Em Andamento' },
        { name: 'Iniciativa A3: Telemetria Multi-Model', q: 'Q4/25', status: 'Planejado' },
      ],
    },
    {
      name: 'PORTFÓLIO B',
      desc: 'Novos Produtos',
      tag: 'Innovation',
      color: 'border-purple-500/40 bg-purple-500/5',
      initiatives: [
        { name: 'Iniciativa B1: Aura Copilot Assistant', q: 'Q3/25', status: 'Em Andamento' },
        { name: 'Iniciativa B2: Automação No-Code', q: 'Q4/25', status: 'Planejado' },
        { name: 'Iniciativa B3: Mobile Companion App', q: 'Q1/26', status: 'Planejado' },
      ],
    },
    {
      name: 'PORTFÓLIO C',
      desc: 'Infraestrutura',
      tag: 'Infra & Sec',
      color: 'border-cyan-500/40 bg-cyan-500/5',
      initiatives: [
        { name: 'Iniciativa C1: Migração SQLite Local', q: 'Q2/25', status: 'Concluído' },
        { name: 'Iniciativa C2: Gate Enforcement Engine', q: 'Q3/25', status: 'Em Andamento' },
        { name: 'Iniciativa C3: Zero Trust Security Sandbox', q: 'Q1/26', status: 'Planejado' },
      ],
    },
  ];

  const maturityLevels = [
    { code: 'L0', name: 'IDEA', desc: 'Hipótese inicial registrada', gate: 'Ideia identificada', status: 'completed' },
    { code: 'L1', name: 'DISCOVERY', desc: 'Problema e oportunidade investigados', gate: 'Problema validado', status: 'completed' },
    { code: 'L2', name: 'SPECIFICATION', desc: 'Escopo, requisitos e critérios definidos', gate: 'Especificação aprovada', status: 'completed' },
    { code: 'L3', name: 'READY FOR DEV', desc: 'Arquitetura, estimativa e dependências', gate: 'Ready for Development', status: 'completed' },
    { code: 'L4', name: 'DEVELOPMENT', desc: 'Implementação e testes internos', gate: 'Implementação concluída', status: 'in_progress', active: true },
    { code: 'L5', name: 'VALIDATION / QA', desc: 'Testes, qualidade e aceite', gate: 'Aceite validado', status: 'pending' },
    { code: 'L6', name: 'RELEASE', desc: 'Entrega preparada para produção', gate: 'Release aprovado', status: 'pending' },
    { code: 'L7', name: 'OPERATE / MEASURE', desc: 'Monitoramento, métricas e melhoria', gate: 'Operação estabilizada', status: 'pending' },
  ];

  const agileKanbanColumns = [
    {
      title: 'TO DO',
      count: 8,
      color: 'border-slate-500/30 bg-slate-500/5',
      cards: ['US-105: Configurar permissões', 'US-106: Ajustar responsividade', 'US-107: Validar acessibilidade'],
    },
    {
      title: 'DOING',
      count: 4,
      color: 'border-indigo-500/30 bg-indigo-500/5',
      cards: ['US-102: Filtros dinâmicos', 'US-108: Integração com API'],
    },
    {
      title: 'REVIEW',
      count: 3,
      color: 'border-amber-500/30 bg-amber-500/5',
      cards: ['US-103: Gráficos interativos', 'US-109: Testes E2E'],
    },
    {
      title: 'DONE',
      count: 5,
      color: 'border-emerald-500/30 bg-emerald-500/5',
      cards: ['US-101: Criar layout base', 'US-104: Exportar dados'],
    },
  ];

  const criticalDependencies = [
    { id: 'F3.2', desc: 'Widgets Inteligentes bloqueiam E1.2', severity: 'critical', badge: 'CRÍTICA' },
    { id: 'F3.3', desc: 'Relatórios Avançados aguardam dados do F3.1', severity: 'high', badge: 'ALTA' },
    { id: 'F4.1', desc: 'Automação de E-mails aguarda API externa', severity: 'medium', badge: 'MÉDIA' },
  ];

  const openRisks = [
    { id: 'R1', desc: 'Atraso na API de pagamento', impact: 'ALTO', color: 'text-red-400 bg-red-500/10' },
    { id: 'R2', desc: 'Dependência de equipe UX', impact: 'MÉDIO', color: 'text-amber-400 bg-amber-500/10' },
    { id: 'R3', desc: 'Performance em produção', impact: 'MÉDIO', color: 'text-amber-400 bg-amber-500/10' },
  ];

  const recentDecisions = [
    { id: 'D-45', desc: 'Arquitetura de microsserviços aprovada', tag: 'Arquitetura' },
    { id: 'D-44', desc: 'Padrão de design definido (Atomic UI)', tag: 'Design' },
    { id: 'D-43', desc: 'Ferramenta de BI selecionada', tag: 'Produto' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* HEADER INSTITUCIONAL: AURA MANAGE / ATHENA CONTROL TOWER */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/80 p-5 backdrop-blur-md shadow-xs lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-2.5 py-0.5 text-[11px]">
                AURAMANAGE • PMO CONTROL TOWER
              </Badge>
              <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground border-border">
                ESTRATÉGIA → ENTREGA → EXECUÇÃO
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-semibold">
                ● Live Control Plane
              </Badge>
            </div>
            <h1 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
              ROADMAP • EXECUÇÃO ÁGIL • DESENVOLVIMENTO
            </h1>
            <p className="text-xs text-muted-foreground">
              Sistema operacional de gestão que separa estritamente a <strong>Hierarquia do Trabalho</strong> do <strong>Nível de Maturidade</strong> (L0 a L7).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <Link to="/roadmap">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
                <Compass className="h-3.5 w-3.5" />
                Roadmap
              </Button>
            </Link>
            <Link to="/delivery">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
                <Kanban className="h-3.5 w-3.5" />
                Delivery Board
              </Button>
            </Link>
            <Link to="/agents">
              <Button size="sm" className="gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md text-xs h-8">
                <Bot className="h-3.5 w-3.5" />
                13 Agentes
              </Button>
            </Link>
          </div>
        </div>

        {/* BARRA DE MÉTRICAS OPERACIONAIS (6 KPIs) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {operationalKpis.map((kpi) => (
            <Card key={kpi.label} className="border-border/70 bg-card/60 shadow-2xs hover:border-primary/40 transition-colors">
              <CardContent className="p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{kpi.label}</span>
                  <kpi.icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="text-lg font-black text-foreground">{kpi.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* GRID CENTRAL: ESTRATÉGIA + HIERARQUIA + NÍVEIS L0-L7 */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* COLUNA ESQUERDA / CENTRO (8 COLS): Roadmap Estratégico & Hierarquia WBS */}
          <div className="space-y-6 lg:col-span-8">
            {/* SEÇÃO 01: ROADMAP ESTRATÉGICO */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Compass className="h-4 w-4 text-indigo-500" /> Seção 01: Roadmap Estratégico
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      Quando e em qual horizonte estratégico as iniciativas serão desenvolvidas (2025/2026: Q2, Q3, Q4, Q1).
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    3 Portfólios Ativos
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {strategicPortfolios.map((p) => (
                    <div key={p.name} className={`rounded-xl border p-3.5 space-y-2.5 ${p.color}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-foreground">{p.name}</span>
                        <span className="rounded bg-background/80 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-muted-foreground">
                          {p.tag}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{p.desc}</p>

                      <div className="space-y-1.5 pt-1 border-t border-border/40">
                        {p.initiatives.map((init) => (
                          <div key={init.name} className="flex items-center justify-between rounded bg-background/70 p-1.5 text-[10px]">
                            <span className="font-medium text-foreground truncate pr-1">{init.name}</span>
                            <span className="font-mono text-[9px] text-primary shrink-0 font-bold">{init.q}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SEÇÃO 02: HIERARQUIA DO TRABALHO (WBS 7 NÍVEIS) */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <FolderKanban className="h-4 w-4 text-purple-500" /> Seção 02: Hierarquia do Trabalho (WBS)
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      Decomposição do trabalho: Projeto → Fase → Epic → Feature → Stories → Subtasks.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono bg-purple-500/10 text-purple-400 border-purple-500/20">
                    O que será entregue
                  </Badge>
                </div>

                {/* Exemplo Estruturado da WBS */}
                <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
                  {/* Trilha Hierárquica */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                    <span className="rounded bg-indigo-500/20 text-indigo-400 px-2 py-0.5 font-bold">Projeto: Plataforma Principal</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="rounded bg-purple-500/20 text-purple-400 px-2 py-0.5 font-bold">Fase 3: Execução</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="rounded bg-cyan-500/20 text-cyan-400 px-2 py-0.5 font-bold">E3: Dashboard Inteligente</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 font-bold">F3.1: Dashboard Personalizável</span>
                  </div>

                  {/* Stories & Subtasks */}
                  <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-border/50">
                    {/* Stories */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Stories Vinculadas:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['US-101: Criar layout base', 'US-102: Filtros dinâmicos', 'US-103: Gráficos interativos', 'US-104: Exportar dados'].map((us) => (
                          <div key={us} className="rounded bg-background p-1.5 text-[10px] font-mono text-foreground border border-border/50 truncate">
                            {us}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subtasks */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Subtasks Operacionais:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['ST-201: Componente filtro', 'ST-202: Conectar API', 'ST-203: Tratamento dados', 'ST-204: Testes unitários'].map((st) => (
                          <div key={st} className="rounded bg-background p-1.5 text-[10px] font-mono text-muted-foreground border border-border/50 truncate">
                            ✓ {st}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEÇÃO 04: EXECUÇÃO ÁGIL (KANBAN TO DO / DOING / REVIEW / DONE) */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Kanban className="h-4 w-4 text-emerald-500" /> Seção 04: Execução Ágil (Kanban)
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      Como está sendo executado no dia a dia operacional.
                    </p>
                  </div>
                  <Link to="/delivery" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                    Abrir Delivery Board <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  {agileKanbanColumns.map((col) => (
                    <div key={col.title} className={`rounded-xl border p-3 space-y-2 ${col.color}`}>
                      <div className="flex items-center justify-between pb-1 border-b border-border/40">
                        <span className="text-[11px] font-black text-foreground">{col.title}</span>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-mono">
                          {col.count}
                        </Badge>
                      </div>
                      <div className="space-y-1.5">
                        {col.cards.map((c) => (
                          <div key={c} className="rounded bg-background/90 p-2 text-[10px] text-foreground font-medium border border-border/60 shadow-2xs">
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* COLUNA DIREITA (4 COLS): Pipeline Vertical de Maturidade (L0 a L7) */}
          <div className="space-y-6 lg:col-span-4">
            <Card className="border-border/80 bg-card shadow-xs h-full">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" /> Seção 03: Níveis de Dev
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      Quão madura está a entrega (Pipeline L0 - L7).
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                    Ativo: L4
                  </Badge>
                </div>

                {/* Pipeline Vertical com Portões de Entrada e Saída */}
                <div className="space-y-2">
                  {maturityLevels.map((lvl, index) => {
                    const isCurrent = lvl.code === 'L4';
                    const isDone = ['L0', 'L1', 'L2', 'L3'].includes(lvl.code);

                    return (
                      <div
                        key={lvl.code}
                        className={`rounded-xl border p-2.5 transition-all text-xs ${
                          isCurrent
                            ? 'border-primary bg-primary/10 shadow-sm'
                            : isDone
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-border/60 bg-muted/20 opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                                isDone
                                  ? 'bg-emerald-500 text-white'
                                  : isCurrent
                                  ? 'bg-primary text-white animate-pulse'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {isDone ? '✓' : lvl.code.replace('L', '')}
                            </span>
                            <span className="font-bold text-foreground">{lvl.code}: {lvl.name}</span>
                          </div>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-mono uppercase ${
                              isDone
                                ? 'text-emerald-500 font-semibold'
                                : isCurrent
                                ? 'text-primary font-bold'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {isDone ? 'Concluído' : isCurrent ? 'Em Andamento' : 'Pendente'}
                          </span>
                        </div>

                        <p className="text-[10px] text-muted-foreground mt-1 pl-7">{lvl.desc}</p>
                        <p className="text-[9px] text-primary/80 font-mono pl-7 mt-0.5">
                          Gate: <strong>{lvl.gate}</strong>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PAINÉIS OPERACIONAIS INFERIORES: DEPENDÊNCIAS, RISCOS, DECISÕES & SAÚDE */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* SEÇÃO 05: DEPENDÊNCIAS CRÍTICAS */}
          <Card className="border-border/80 bg-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5 text-red-400" /> Dependências Críticas
                </h3>
                <span className="text-[10px] font-mono text-red-400 font-bold">{criticalDependencies.length}</span>
              </div>
              <div className="space-y-2">
                {criticalDependencies.map((dep) => (
                  <div key={dep.id} className="rounded-lg bg-muted/30 p-2 text-[11px] space-y-0.5 border border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-primary">{dep.id}</span>
                      <Badge variant="outline" className="text-[8px] bg-red-500/10 text-red-400 border-red-500/20 font-bold">
                        {dep.badge}
                      </Badge>
                    </div>
                    <p className="text-foreground leading-tight">{dep.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEÇÃO 06: RISCOS EM ABERTO */}
          <Card className="border-border/80 bg-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Riscos em Aberto
                </h3>
                <span className="text-[10px] font-mono text-amber-400 font-bold">{openRisks.length}</span>
              </div>
              <div className="space-y-2">
                {openRisks.map((risk) => (
                  <div key={risk.id} className="rounded-lg bg-muted/30 p-2 text-[11px] space-y-0.5 border border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-400">{risk.id}</span>
                      <Badge variant="outline" className="text-[8px] font-bold">
                        Impacto: {risk.impact}
                      </Badge>
                    </div>
                    <p className="text-foreground leading-tight">{risk.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEÇÃO 07: DECISÕES RECENTES */}
          <Card className="border-border/80 bg-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Decisões Recentes
                </h3>
                <span className="text-[10px] font-mono text-indigo-400 font-bold">{recentDecisions.length}</span>
              </div>
              <div className="space-y-2">
                {recentDecisions.map((dec) => (
                  <div key={dec.id} className="rounded-lg bg-muted/30 p-2 text-[11px] space-y-0.5 border border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-indigo-400">{dec.id}</span>
                      <span className="text-[9px] text-muted-foreground">{dec.tag}</span>
                    </div>
                    <p className="text-foreground leading-tight">{dec.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEÇÃO 08: MÉTRICAS GERAIS & SAÚDE DO PORTFÓLIO */}
          <Card className="border-border/80 bg-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-400" /> Saúde do Portfólio
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">72% ON TRACK</span>
              </div>
              <div className="space-y-2.5 pt-1 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-emerald-400 font-semibold">No prazo</span>
                    <strong className="text-foreground">72%</strong>
                  </div>
                  <Progress value={72} className="h-1.5 bg-muted [&>div]:bg-emerald-500" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-amber-400 font-semibold">Atenção</span>
                    <strong className="text-foreground">18%</strong>
                  </div>
                  <Progress value={18} className="h-1.5 bg-muted [&>div]:bg-amber-500" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-red-400 font-semibold">Atrasado</span>
                    <strong className="text-foreground">10%</strong>
                  </div>
                  <Progress value={10} className="h-1.5 bg-muted [&>div]:bg-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FOOTER INSTITUCIONAL: 3 PILARES DA CONTROL TOWER */}
        <div className="grid gap-4 sm:grid-cols-3 pt-2">
          <div className="rounded-xl border border-border/60 bg-muted/10 p-3 text-center space-y-0.5">
            <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
              1. Governança por Gates
            </span>
            <p className="text-[10px] text-muted-foreground">Cada nível possui critérios claros de entrada e saída.</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/10 p-3 text-center space-y-0.5">
            <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
              2. Transparência Total
            </span>
            <p className="text-[10px] text-muted-foreground">Estratégia 100% conectada à execução operacional.</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/10 p-3 text-center space-y-0.5">
            <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
              3. Entrega Contínua de Valor
            </span>
            <p className="text-[10px] text-muted-foreground">Do planejamento à operação e melhoria contínua.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Overview;
