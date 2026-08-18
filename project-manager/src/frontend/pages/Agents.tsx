import { useEffect, useState } from 'react';
import {
  Bot,
  Play,
  Cpu,
  ShieldCheck,
  Coins,
  Sparkles,
  Terminal,
  Activity,
  CheckCircle2,
  Lock,
  Wrench,
  Layers,
  Filter,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { athenaApi, AgentItem } from '@/services/athenaApi';
import { useToast } from '@/hooks/use-toast';

const Agents = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentItem | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    const data = await athenaApi.getAgents();
    setAgents(data);
    if (data.length > 0 && !selectedAgent) {
      setSelectedAgent(data[0]);
    }
  }

  async function handleExecute() {
    if (!selectedAgent) return;
    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const run = await athenaApi.triggerAgentRun(
        selectedAgent.id,
        undefined,
        undefined,
        promptInput || `Execução de tarefa autônoma pelo especialista [${selectedAgent.name}] sob o escopo: ${selectedAgent.scope}`
      );
      setExecutionResult(run);
      toast({
        title: `Execução de ${selectedAgent.name} concluída!`,
        description: `Consumo: ${run.tokensUsed} tokens ($${run.costUsd} USD).`,
      });
      loadAgents();
    } finally {
      setIsExecuting(false);
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🤖</span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Catálogo de Especialistas (13 Personas) & Swarm Desk
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Equipe de 13 papéis de engenharia agentic com matriz de permissões por tipo de tarefa e quality gates.
            </p>
          </div>
        </div>

        {/* Grade dos 13 Agentes */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {agents.map((agent) => {
            const isSelected = selectedAgent?.id === agent.id;
            let allowedTasks: string[] = [];
            try {
              allowedTasks = JSON.parse(agent.allowedTaskTypes || '[]');
            } catch {}

            return (
              <Card
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`cursor-pointer transition-all duration-200 border-2 ${
                  isSelected
                    ? 'border-primary shadow-md shadow-primary/10 bg-card'
                    : 'border-border/80 bg-card/60 hover:border-primary/40'
                }`}
              >
                <CardContent className="p-4 space-y-3">
                  {/* Persona Header */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 text-2xl shadow-xs">
                      {agent.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-bold text-foreground truncate">{agent.name}</h3>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      </div>
                      <p className="text-[11px] font-medium text-primary mt-0.5 truncate">{agent.role}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{agent.description}</p>
                    </div>
                  </div>

                  {/* TaskTypes Permitidos */}
                  <div className="pt-2 border-t border-border/50 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Tipos de Tarefas Permitidas:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {allowedTasks.map((t) => (
                        <span key={t} className="rounded bg-primary/10 text-primary px-1.5 py-0.5 text-[9px] font-mono font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Detalhes de Orçamento & Modelo */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/50 text-[10px]">
                    <div className="rounded bg-muted/40 p-1.5">
                      <span className="text-muted-foreground block">Budget:</span>
                      <strong className="text-foreground">{agent.tokenBudget / 1000}k</strong>
                    </div>
                    <div className="rounded bg-muted/40 p-1.5">
                      <span className="text-muted-foreground block">Policy:</span>
                      <strong className="text-foreground truncate block">{agent.modelPolicy.split('/')[0]}</strong>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isSelected ? 'default' : 'outline'}
                    className="w-full text-[11px] h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAgent(agent);
                    }}
                  >
                    {isSelected ? 'Especialista Selecionado' : 'Selecionar'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Swarm Live Monitor / Execution Desk */}
        {selectedAgent && (
          <Card className="border-border/80 bg-card shadow-md">
            <CardContent className="p-6 space-y-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedAgent.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">
                        Console de Despacho: {selectedAgent.name}
                      </h2>
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                        {selectedAgent.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Quality Gate Individual: <strong>{selectedAgent.qualityGate}</strong>
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:from-indigo-700 hover:to-purple-700 text-xs"
                >
                  <Play className="h-4 w-4" />
                  {isExecuting ? 'Executando Tarefa...' : 'Disparar Agente Especialista'}
                </Button>
              </div>

              {/* Input de Prompt */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Instrução ou Tarefa para {selectedAgent.name}
                </label>
                <textarea
                  rows={2}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder={`Digite a instrução específica para ${selectedAgent.name}...`}
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>

              {/* Live Output & Tool Calls */}
              {executionResult && (
                <div className="space-y-4 rounded-xl border border-border/80 bg-muted/20 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-primary" /> Resultado da Execução
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                      <span>Tokens: <strong>{executionResult.tokensUsed}</strong></span>
                      <span>•</span>
                      <span>Custo: <strong>${executionResult.costUsd} USD</strong></span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-background p-4 text-xs font-mono text-foreground whitespace-pre-wrap border border-border/60">
                    {executionResult.outputResult}
                  </div>

                  {executionResult.toolCalls && executionResult.toolCalls.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border/60">
                      <h4 className="text-[11px] font-bold text-muted-foreground uppercase">
                        Tool Calls Executadas no Runtime
                      </h4>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {executionResult.toolCalls.map((tc: any) => (
                          <div key={tc.id} className="rounded-lg border border-border/60 bg-background/80 p-3 text-xs font-mono space-y-1">
                            <div className="flex items-center justify-between text-primary font-bold">
                              <span>⚡ {tc.toolName}</span>
                              <span className="text-muted-foreground font-normal text-[10px]">{tc.latencyMs}ms</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate">Args: {tc.arguments}</p>
                            <p className="text-[11px] text-emerald-600 font-semibold truncate">Status: {tc.status}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Agents;
