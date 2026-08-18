import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Layers,
  Plus,
  ArrowRight,
  Filter,
  CheckCircle2,
  FolderKanban,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { athenaApi, FeatureItem, WbsPortfolio } from '@/services/athenaApi';
import { useToast } from '@/hooks/use-toast';

const Roadmap = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'levels' | 'wbs'>('levels');
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [wbsData, setWbsData] = useState<WbsPortfolio[]>([]);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [problem, setProblem] = useState('');
  const [businessValue, setBusinessValue] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [feats, wbs] = await Promise.all([
      athenaApi.getRoadmap(),
      athenaApi.getWbs(),
    ]);
    setFeatures(feats);
    setWbsData(wbs);
  }

  async function handleCreateFeature(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !objective) return;

    try {
      await athenaApi.createFeature({
        title,
        objective,
        problem,
        businessValue,
        priority,
      });
      toast({
        title: 'Feature criada com sucesso',
        description: 'A nova feature nasceu no nível L0_IDEA para refinamento de discovery.',
      });
      setTitle('');
      setObjective('');
      setProblem('');
      setBusinessValue('');
      setShowModal(false);
      loadData();
    } catch (err: any) {
      toast({
        title: 'Erro ao criar feature',
        description: err.message,
        variant: 'destructive',
      });
    }
  }

  const developmentLevelColumns = [
    { id: 'L0_IDEA', label: 'L0: Idea', desc: 'Concepção inicial' },
    { id: 'L1_DISCOVERY', label: 'L1: Discovery', desc: 'Hipóteses & Perguntas' },
    { id: 'L2_SPECIFICATION', label: 'L2: Spec SDD', desc: 'Contratos & Schemas' },
    { id: 'L3_READY_FOR_DEV', label: 'L3: Ready for Dev', desc: 'Plano & Tasks Prontas' },
    { id: 'L4_DEVELOPMENT', label: 'L4: Development', desc: 'Implementação Agentic' },
    { id: 'L5_VALIDATION', label: 'L5: QA & Testes', desc: 'Validação & Evidências' },
    { id: 'L6_RELEASE', label: 'L6: Release', desc: 'Checklist de Rollout' },
    { id: 'L7_OPERATE', label: 'L7: Operate', desc: 'Métricas & Aprendizado' },
  ];

  const filteredFeatures = features.filter((f) => {
    if (filterPriority !== 'ALL' && f.priority !== filterPriority) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header & Alternador de Visão */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🗺</span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Roadmap & WBS Hierárquico
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Acompanhe a maturidade de entrega (L0 a L7) e a decomposição estrutural de 7 níveis do portfólio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Seletor de Modo de Visualização */}
            <div className="flex rounded-xl bg-muted/60 p-1 border border-border">
              <button
                onClick={() => setViewMode('levels')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'levels'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Development Levels (L0-L7)
              </button>
              <button
                onClick={() => setViewMode('wbs')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'wbs'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Hierarquia WBS (7 Níveis)
              </button>
            </div>

            <Button
              onClick={() => setShowModal(true)}
              className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:from-indigo-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4" />
              Propor Nova Feature (L0)
            </Button>
          </div>
        </div>

        {/* MODO 1: Development Level Board (L0 - L7) */}
        {viewMode === 'levels' && (
          <div className="space-y-4">
            {/* Filtros */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-muted-foreground flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Prioridade:
              </span>
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                    filterPriority === p
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Kanban dos 8 Níveis */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 xl:grid-cols-8 overflow-x-auto pb-4">
              {developmentLevelColumns.map((col) => {
                const colFeatures = filteredFeatures.filter((f) => f.developmentLevel === col.id);
                return (
                  <div
                    key={col.id}
                    className="flex flex-col rounded-2xl border border-border/80 bg-muted/20 p-3 min-w-[260px]"
                  >
                    {/* Header da Coluna */}
                    <div className="mb-3 flex items-center justify-between pb-2 border-b border-border/60">
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">{col.label}</h2>
                        <p className="text-[10px] text-muted-foreground truncate">{col.desc}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs font-bold h-5 px-1.5">
                        {colFeatures.length}
                      </Badge>
                    </div>

                    {/* Cards */}
                    <div className="space-y-3 flex-1">
                      {colFeatures.length === 0 ? (
                        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border/60 text-center text-[11px] text-muted-foreground">
                          Nenhuma feature neste nível
                        </div>
                      ) : (
                        colFeatures.map((feat) => (
                          <Card
                            key={feat.id}
                            className="group border-border/80 bg-card shadow-2xs hover:border-primary/50 transition-all hover:shadow-xs"
                          >
                            <CardContent className="p-4 space-y-2">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[11px] font-mono font-bold text-primary">{feat.code}</span>
                                <Badge
                                  variant="outline"
                                  className={`text-[9px] px-1.5 capitalize ${
                                    feat.priority === 'CRITICAL'
                                      ? 'bg-destructive/10 text-destructive border-destructive/20'
                                      : feat.priority === 'HIGH'
                                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  {feat.priority}
                                </Badge>
                              </div>

                              <h3 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                {feat.title}
                              </h3>

                              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                {feat.objective}
                              </p>

                              {/* Status Operacional Separado */}
                              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px]">
                                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-muted-foreground font-semibold">
                                  Status: {feat.operationalStatus}
                                </span>
                                {feat.adrRequired && (
                                  <span className="rounded bg-amber-500/10 text-amber-600 px-1 py-0.5 font-medium">
                                    ADR
                                  </span>
                                )}
                              </div>

                              <Link to={`/features/${feat.id}`} className="block pt-1">
                                <Button size="sm" variant="ghost" className="w-full justify-between text-xs h-7 px-2">
                                  <span>Workspace 360°</span>
                                  <ArrowRight className="h-3 w-3" />
                                </Button>
                              </Link>
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
        )}

        {/* MODO 2: Hierarquia WBS (7 Níveis) */}
        {viewMode === 'wbs' && (
          <div className="space-y-4">
            {wbsData.map((portfolio) => (
              <Card key={portfolio.id} className="border-border/80 bg-card shadow-xs">
                <CardContent className="p-6 space-y-4">
                  {/* Nível 1: Portfolio */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                        🏛
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary">{portfolio.code}</span>
                          <h2 className="text-lg font-bold text-foreground">{portfolio.name}</h2>
                        </div>
                        <p className="text-xs text-muted-foreground">{portfolio.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                      {portfolio.status}
                    </Badge>
                  </div>

                  {/* Nível 2: Projetos */}
                  <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                    {portfolio.projects.map((proj) => (
                      <div key={proj.id} className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-indigo-600">{proj.code}</span>
                            <h3 className="text-sm font-bold text-foreground">{proj.name}</h3>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {proj.phases.length} Fases
                          </Badge>
                        </div>

                        {/* Nível 3: Fases & Épicos */}
                        <div className="grid gap-3 sm:grid-cols-2 pt-2">
                          {proj.phases.map((phase) => (
                            <div key={phase.id} className="rounded-lg border border-border/60 bg-background p-3 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-foreground">{phase.code}: {phase.name}</span>
                                <span className="text-[10px] text-muted-foreground">{phase.epics.length} Épicos</span>
                              </div>

                              {/* Nível 4: Épicos & Features */}
                              <div className="space-y-2 pt-1 border-t border-border/50">
                                {phase.epics.map((epic) => (
                                  <div key={epic.id} className="rounded bg-muted/40 p-2 text-xs space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-primary">{epic.code} · {epic.title}</span>
                                      <span className="text-[10px] font-mono text-muted-foreground">{epic.features.length} Features</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 pt-1">
                                      {epic.features.map((f) => (
                                        <Link key={f.id} to={`/features/${f.id}`}>
                                          <Badge variant="outline" className="text-[9px] hover:border-primary">
                                            {f.code} ({f.developmentLevel.split('_')[0]})
                                          </Badge>
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de Nova Feature (L0) */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <h2 className="text-lg font-bold text-foreground">Proposta de Nova Feature (Nível L0: Idea)</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateFeature} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Título da Feature</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Auditoria Automática de Schemas"
                    required
                    className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Objetivo Inicial</label>
                  <textarea
                    rows={2}
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="Descreva a intenção ou necessidade que originou a feature..."
                    required
                    className="w-full rounded-lg border border-input bg-background p-2.5 text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Problema a Resolver</label>
                    <input
                      type="text"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Qual dor ou gargalo ela ataca?"
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Valor de Negócio</label>
                    <input
                      type="text"
                      value={businessValue}
                      onChange={(e) => setBusinessValue(e.target.value)}
                      placeholder="Qual o retorno esperado?"
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="h-9 w-full rounded-lg border border-input bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="CRITICAL">Crítica</option>
                    <option value="HIGH">Alta</option>
                    <option value="MEDIUM">Média</option>
                    <option value="LOW">Baixa</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                    Salvar no Nível L0
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Roadmap;
