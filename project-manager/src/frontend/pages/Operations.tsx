import { useEffect, useState } from 'react';
import { Cpu, Coins, ShieldAlert, ShieldCheck, Activity, Terminal, Layers, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { athenaApi, OverviewData } from '@/services/athenaApi';

const Operations = () => {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [operationsData, setOperationsData] = useState<any | null>(null);

  useEffect(() => {
    athenaApi.getOverview().then(setOverview);
    athenaApi.getOperations().then(setOperationsData);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">⚙</span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Operações, Governança & Auditoria Ativa
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Monitoramento ativo de violações de ciclo de vida, telemetria de tokens e integridade operacional.
            </p>
          </div>
        </div>

        {/* Cards de Métricas Operacionais */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border/80 bg-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-2xl bg-indigo-500/10 p-3.5 text-indigo-600">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Multi-Model Router</p>
                <p className="text-xl font-bold text-foreground mt-1">13 Especialistas</p>
                <p className="text-xs text-muted-foreground">Claude 3.5 · Gemini 1.5 · GPT-4o</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-2xl bg-amber-500/10 p-3.5 text-amber-600">
                <Coins className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Consumo Acumulado</p>
                <p className="text-xl font-bold text-foreground mt-1">{(overview?.totalTokens || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">${overview?.totalCostUsd || 0} USD</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-2xl bg-red-500/10 p-3.5 text-red-600">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Motor de Auditoria</p>
                <p className="text-xl font-bold text-foreground mt-1">{overview?.unresolvedViolationsCount || 0} Violações</p>
                <p className="text-xs text-amber-500 font-medium">Portões sob monitoramento</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Ativo de Violações de Governança */}
        <Card className="border-border/80 bg-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500" /> Violações de Governança Identificadas
                </h2>
                <p className="text-xs text-muted-foreground">
                  Regras automáticas para evitar tarefas sem especificação, código sem task ou assumptions não validadas.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {overview?.activeViolations && overview.activeViolations.length > 0 ? (
                overview.activeViolations.map((v) => (
                  <div
                    key={v.id}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold">
                          {v.violation}
                        </Badge>
                        <span className="text-xs font-bold text-foreground">Origem: {v.source}</span>
                      </div>
                      <p className="text-xs text-foreground">{v.details}</p>
                    </div>

                    <Badge className="text-[10px] bg-amber-500 text-white self-start sm:self-auto">
                      Severidade: {v.severity}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center text-xs text-emerald-600 font-semibold">
                  ✓ Nenhuma violação ativa detectada pelo Auditor Sentinel.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trilha de Eventos de Auditoria */}
        <Card className="border-border/80">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-foreground">Trilha Imutável de Auditoria</h2>
                <p className="text-xs text-muted-foreground">Histórico de avanços de portões de maturidade e eventos.</p>
              </div>
            </div>

            <div className="space-y-3">
              {overview?.recentAudits && overview.recentAudits.length > 0 ? (
                overview.recentAudits.map((audit) => (
                  <div
                    key={audit.id}
                    className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/70 bg-muted/20 p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px] text-primary font-bold">
                          {audit.action}
                        </Badge>
                        <span className="text-xs font-semibold text-foreground">{audit.details}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Responsável: <strong>{audit.actor}</strong></p>
                    </div>

                    <span className="text-[10px] font-mono text-muted-foreground self-end sm:self-auto">
                      {new Date(audit.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-6">Nenhum evento registrado.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Operations;
