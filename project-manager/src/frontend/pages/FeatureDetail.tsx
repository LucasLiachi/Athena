import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  Landmark,
  FileCode2,
  Bot,
  Play,
  Lock,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ListTodo,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { athenaApi, FeatureItem, AgentItem } from '@/services/athenaApi';
import { useToast } from '@/hooks/use-toast';

const FeatureDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [feature, setFeature] = useState<FeatureItem | null>(null);
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'discovery' | 'risks_decisions' | 'architecture' | 'sdd' | 'tasks' | 'runs' | 'audit'
  >('overview');
  const [executingTaskId, setExecutingTaskId] = useState<string | null>(null);

  useEffect(() => {
    loadFeature();
    athenaApi.getAgents().then(setAgents);
  }, [id]);

  async function loadFeature() {
    if (!id) return;
    try {
      const data = await athenaApi.getFeature(id);
      setFeature(data);
    } catch {
      const all = await athenaApi.getRoadmap();
      const found = all.find((f) => f.id === id || f.code === id) || all[0];
      setFeature(found);
    }
  }

  async function handlePromoteLevel(targetLevel: string) {
    if (!feature) return;
    try {
      await athenaApi.promoteFeatureLevel(feature.id, targetLevel);
      toast({
        title: 'Level de Desenvolvimento Promovido!',
        description: `Feature avançou para o nível ${targetLevel}.`,
      });
      loadFeature();
    } catch (err: any) {
      toast({
        title: 'Bloqueio de Quality Gate',
        description: err.message,
        variant: 'destructive',
      });
    }
  }

  async function handleExecuteTask(taskId: string, agentId: string) {
    setExecutingTaskId(taskId);
    try {
      await athenaApi.triggerAgentRun(agentId, feature?.id, taskId);
      toast({
        title: 'Execução concluída com sucesso',
        description: 'Agente especialista concluiu a tarefa e registrou a evidência.',
      });
      loadFeature();
    } finally {
      setExecutingTaskId(null);
    }
  }

  if (!feature) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Carregando Feature Workspace 360°...
        </div>
      </AppLayout>
    );
  }

  const nextLevelMap: Record<string, string> = {
    L0_IDEA: 'L1_DISCOVERY',
    L1_DISCOVERY: 'L2_SPECIFICATION',
    L2_SPECIFICATION: 'L3_READY_FOR_DEV',
    L3_READY_FOR_DEV: 'L4_DEVELOPMENT',
    L4_DEVELOPMENT: 'L5_VALIDATION',
    L5_VALIDATION: 'L6_RELEASE',
    L6_RELEASE: 'L7_OPERATE',
  };

  const nextLevel = nextLevelMap[feature.developmentLevel];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link to="/roadmap" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-xs font-mono font-bold text-primary">{feature.code}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-xs text-muted-foreground truncate">{feature.title}</span>
        </div>

        {/* Feature Header Card */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="outline" className="font-mono text-xs font-bold bg-primary/10 text-primary border-primary/20">
                    {feature.code}
                  </Badge>
                  {/* SEPARAÇÃO LEVEL vs STATUS */}
                  <Badge className="text-xs font-semibold bg-indigo-600 text-white uppercase">
                    Level: {feature.developmentLevel.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-mono font-semibold">
                    Status: {feature.operationalStatus}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize ${
                      feature.priority === 'CRITICAL'
                        ? 'bg-destructive/10 text-destructive border-destructive/20'
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}
                  >
                    Prioridade: {feature.priority}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{feature.title}</h1>
              </div>

              {/* Botão de Promoção de Level com Quality Gate */}
              {nextLevel && (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    onClick={() => handlePromoteLevel(nextLevel)}
                    className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:from-indigo-700 hover:to-purple-700 text-xs h-9"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    Promover para {nextLevel.replace('_', ' ')}
                  </Button>
                </div>
              )}
            </div>

            {/* Abas 360° da Feature */}
            <div className="flex flex-wrap gap-1.5 border-t border-border/60 pt-4 text-xs">
              {[
                { id: 'overview', label: '1. Visão Geral' },
                { id: 'discovery', label: '2. Discovery & Perguntas' },
                { id: 'risks_decisions', label: '3. Riscos & Decisões' },
                { id: 'architecture', label: '4. Arquitetura & ADR' },
                { id: 'sdd', label: '5. SDD Spec Kit' },
                { id: 'tasks', label: '6. Tasks & Subtasks' },
                { id: 'runs', label: '7. Runs de Agentes' },
                { id: 'audit', label: '8. Auditoria & Violações' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CONTEÚDO DAS ABAS */}

        {/* ABA 1: Visão Geral */}
        {activeTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Objetivo de Negócio
                    </h2>
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      {feature.objective}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-border/60 text-xs">
                    <div>
                      <h3 className="font-bold text-muted-foreground uppercase mb-1">Problema a Resolver</h3>
                      <p className="text-foreground">{feature.problem || 'Não especificado.'}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-muted-foreground uppercase mb-1">Valor de Negócio</h3>
                      <p className="text-foreground">{feature.businessValue || 'Não especificado.'}</p>
                    </div>
                  </div>

                  {feature.context && (
                    <div className="pt-3 border-t border-border/60">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase mb-1.5">Contexto & Pesquisa</h3>
                      <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                        {feature.context}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Painel Lateral de Governança */}
            <div className="space-y-4">
              <Card className="border-border/80 bg-card">
                <CardContent className="p-5 space-y-3 text-xs">
                  <h3 className="font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-primary" /> Informações de Governança
                  </h3>
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Responsável (Owner):</span>
                      <strong className="text-foreground">{feature.owner || 'Não atribuído'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Impacto Arquitetural:</span>
                      <strong className="text-foreground capitalize">{feature.architecturalImpact || 'Médio'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ADR Obrigatório:</span>
                      <strong className="text-foreground">{feature.adrRequired ? 'SIM' : 'NÃO'}</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ABA 2: Discovery & Perguntas */}
        {activeTab === 'discovery' && (
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" /> Perguntas em Aberto (L1 Discovery)
                </h3>
                <div className="space-y-2">
                  {feature.questions && feature.questions.length > 0 ? (
                    feature.questions.map((q) => (
                      <div key={q.id} className="rounded-lg bg-muted/40 p-3 space-y-1 text-xs">
                        <div className="flex items-start gap-2">
                          <span className={q.resolved ? 'text-emerald-500' : 'text-amber-500'}>
                            {q.resolved ? '✓' : '•'}
                          </span>
                          <p className="font-medium text-foreground">{q.question}</p>
                        </div>
                        {q.answer && (
                          <p className="text-[11px] text-muted-foreground pl-4 border-l-2 border-primary/30 mt-1">
                            <strong>R:</strong> {q.answer}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">Nenhuma pergunta aberta registrada.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" /> Suposições & Hipóteses
                </h3>
                <div className="space-y-2">
                  {feature.assumptions && feature.assumptions.length > 0 ? (
                    feature.assumptions.map((a) => (
                      <div key={a.id} className="rounded-lg bg-muted/40 p-3 text-xs">
                        <div className="flex items-start gap-2">
                          <span className={a.validated ? 'text-emerald-500' : 'text-purple-500'}>
                            {a.validated ? '✓' : '•'}
                          </span>
                          <p className="font-medium text-foreground">{a.assumption}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">Nenhuma suposição registrada.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ABA 3: Riscos & Decisões */}
        {activeTab === 'risks_decisions' && (
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Matriz de Riscos
                </h3>
                <div className="space-y-2">
                  {feature.risks && feature.risks.length > 0 ? (
                    feature.risks.map((r) => (
                      <div key={r.id} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">{r.title}</span>
                          <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600">
                            Impacto: {r.impact}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">Mitigação: {r.mitigation}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">Nenhum risco registrado para esta feature.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500" /> Registro de Decisões Táticas
                </h3>
                <div className="space-y-2">
                  {feature.decisions && feature.decisions.length > 0 ? (
                    feature.decisions.map((d) => (
                      <div key={d.id} className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">{d.title}</span>
                          <Badge variant="secondary" className="text-[10px]">{d.status}</Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{d.rationale}</p>
                        <span className="text-[10px] text-muted-foreground block">Autor: {d.author}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">Nenhuma decisão registrada.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ABA 4: Arquitetura & ADR */}
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" /> Architecture Decision Records (ADRs)
                  </h3>
                  <Badge variant="outline" className="text-xs font-mono">
                    Impacto: {feature.architecturalImpact || 'Médio'}
                  </Badge>
                </div>

                {feature.adrs && feature.adrs.length > 0 ? (
                  feature.adrs.map((adr) => (
                    <div key={adr.id} className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-primary">{adr.code} · {adr.title}</span>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                          {adr.status}
                        </Badge>
                      </div>
                      <p className="text-foreground">Decisão: {adr.decision}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">Nenhum ADR formal vinculado a esta feature.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ABA 5: SDD Spec Kit */}
        {activeTab === 'sdd' && (
          <div className="space-y-4">
            {feature.specs && feature.specs.length > 0 ? (
              feature.specs.map((spec) => (
                <Card key={spec.id}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-primary font-bold">SPEC v{spec.version}</span>
                        <h2 className="text-sm font-bold text-foreground">{spec.title}</h2>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                        {spec.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase">Comportamento Observável (spec.md)</h3>
                      <pre className="rounded-xl bg-muted/40 p-3 text-xs font-mono text-foreground whitespace-pre-wrap">
                        {spec.specDoc}
                      </pre>
                    </div>

                    {spec.designDoc && (
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase">Solução Técnica (design.md)</h3>
                        <pre className="rounded-xl bg-muted/40 p-3 text-xs font-mono text-foreground whitespace-pre-wrap">
                          {spec.designDoc}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-xs text-muted-foreground">
                  Nenhum Spec Kit aprovado anexado ainda. A Spec Architect gera os artefatos no nível L2.
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ABA 6: Tasks & Subtasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-primary" /> Decomposição de Tarefas Atômicas
                </h3>

                <div className="space-y-3">
                  {feature.tasks && feature.tasks.length > 0 ? (
                    feature.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-mono font-bold text-primary">{task.code}</span>
                              <Badge variant="outline" className="text-[9px] font-mono">
                                {task.taskType}
                              </Badge>
                              <Badge variant={task.status === 'DONE' ? 'default' : 'secondary'} className="text-[9px]">
                                {task.status}
                              </Badge>
                            </div>
                            <h4 className="text-xs font-bold text-foreground">{task.title}</h4>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{task.description}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            {task.assignedAgent && (
                              <div className="flex items-center gap-1 text-xs bg-background px-2.5 py-1 rounded-lg border">
                                <span>{task.assignedAgent.avatar}</span>
                                <span className="font-semibold text-foreground">{task.assignedAgent.name}</span>
                              </div>
                            )}

                            <Button
                              size="sm"
                              onClick={() => handleExecuteTask(task.id, task.assignedAgent?.id || 'orchestrator')}
                              disabled={executingTaskId === task.id || task.status === 'DONE'}
                              className="text-xs h-7"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              {executingTaskId === task.id ? 'Executando...' : task.status === 'DONE' ? 'Concluída' : 'Executar'}
                            </Button>
                          </div>
                        </div>

                        {/* Subtasks */}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="pt-2 border-t border-border/50 grid gap-1.5 sm:grid-cols-2 text-xs">
                            {task.subtasks.map((st) => (
                              <div key={st.id} className="flex items-center gap-2 text-muted-foreground">
                                <span className={st.completed ? 'text-emerald-500' : 'text-slate-400'}>
                                  {st.completed ? '☑' : '☐'}
                                </span>
                                <span>{st.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-6">
                      Nenhuma tarefa atômica gerada ainda. As tasks são decompostas a partir de L3 (Ready for Dev).
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ABA 7: Runs de Agentes */}
        {activeTab === 'runs' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" /> Histórico de Execuções dos Especialistas
                </h3>

                {feature.agentRuns && feature.agentRuns.length > 0 ? (
                  feature.agentRuns.map((run) => (
                    <div key={run.id} className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{run.agent?.avatar}</span>
                          <span className="font-bold text-foreground">{run.agent?.name}</span>
                        </div>
                        <span className="font-mono text-muted-foreground">{run.tokensUsed} tokens · ${run.costUsd} USD</span>
                      </div>
                      <p className="text-foreground bg-background p-3 rounded-lg border font-mono">{run.outputResult}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-6">Nenhum run registrado.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ABA 8: Auditoria & Violações */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Trilha de Auditoria & Violações
                </h3>

                {feature.auditEvents && feature.auditEvents.length > 0 ? (
                  feature.auditEvents.map((evt) => (
                    <div key={evt.id} className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">{evt.action}</span>
                        <span className="text-muted-foreground text-[10px]">{new Date(evt.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-foreground">{evt.details}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-6">Nenhum evento registrado.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default FeatureDetail;
