import { useEffect, useState } from 'react';
import { FileCode2, CheckCircle2, ListTodo, ShieldCheck, Layers, FileText } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { athenaApi } from '@/services/athenaApi';

const SDD = () => {
  const [specs, setSpecs] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    athenaApi.getSdd().then((data) => {
      setSpecs(data.specs);
      setPlans(data.plans);
      setTasks(data.tasks);
    });
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📐</span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                SDD Workspace (Spec-Driven Development)
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Especificações formais (`spec.md`), Soluções técnicas (`design.md`) e Planos decompostos (`plan.md`).
            </p>
          </div>
        </div>

        {/* Spec Kits */}
        <div className="space-y-6">
          {specs.map((spec) => (
            <Card key={spec.id} className="border-border/80 bg-card shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                      📐
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-primary">{spec.feature?.code}</span>
                        <h2 className="text-base font-bold text-foreground">{spec.title}</h2>
                      </div>
                      <p className="text-xs text-muted-foreground">Versão: v{spec.version}</p>
                    </div>
                  </div>

                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                    {spec.status}
                  </Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-primary" /> Comportamento Observável (spec.md)
                    </h3>
                    <pre className="rounded-xl bg-muted/30 p-3 text-xs font-mono text-foreground whitespace-pre-wrap border border-border/50">
                      {spec.specDoc}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-indigo-500" /> Solução Técnica (design.md)
                    </h3>
                    <pre className="rounded-xl bg-muted/30 p-3 text-xs font-mono text-foreground whitespace-pre-wrap border border-border/50">
                      {spec.designDoc || '# Design Doc\nNenhum design técnico anexado.'}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default SDD;
