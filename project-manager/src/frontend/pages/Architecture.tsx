import { useEffect, useState } from 'react';
import { Landmark, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Plus, Sparkles } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { athenaApi } from '@/services/athenaApi';

const Architecture = () => {
  const [adrs, setAdrs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);

  useEffect(() => {
    athenaApi.getArchitecture().then((data) => {
      setAdrs(data.adrs);
      setReviews(data.reviews);
      setDecisions(data.decisions || []);
    });
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🏛</span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Arquitetura, Domínios & ADRs
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Decisões arquiteturais registradas (ADRs), domínios de responsabilidade e revisões formais.
            </p>
          </div>
        </div>

        {/* Domínios do Sistema */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="border-border/80 bg-card">
            <CardContent className="p-4 space-y-2">
              <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-xs">
                Plano 1
              </Badge>
              <h3 className="text-sm font-bold text-foreground">Control Plane</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Governança, Roadmaps, ADRs, Especificações SDD e regras em Markdown no Git.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card">
            <CardContent className="p-4 space-y-2">
              <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-xs">
                Plano 2
              </Badge>
              <h3 className="text-sm font-bold text-foreground">Execution Plane</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Código-fonte (`project-manager/`), interface React, APIs Node.js e testes locais.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card">
            <CardContent className="p-4 space-y-2">
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                Plano 3
              </Badge>
              <h3 className="text-sm font-bold text-foreground">Operational State</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                WBS 7 Níveis, Levels L0-L7, Stories, Tasks e Auditoria persistidos no SQLite.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card">
            <CardContent className="p-4 space-y-2">
              <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/20 text-xs">
                Plano 4
              </Badge>
              <h3 className="text-sm font-bold text-foreground">Agent Runtime</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Orquestração dos 13 especialistas, roteamento de LLMs e telemetria de tool calls.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Catálogo de ADRs */}
        <Card className="border-border/80">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-foreground">Catálogo de Architecture Decision Records (ADR)</h2>
                <p className="text-xs text-muted-foreground">Decisões técnicas materiais registradas formalmente.</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {adrs.length} Registros
              </Badge>
            </div>

            <div className="space-y-4">
              {adrs.map((adr) => (
                <div
                  key={adr.id}
                  className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-primary">{adr.code}</span>
                      <h3 className="text-sm font-bold text-foreground">{adr.title}</h3>
                    </div>
                    <Badge className="self-start sm:self-auto bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                      {adr.status}
                    </Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 text-xs pt-2 border-t border-border/50">
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase">Contexto</p>
                      <p className="text-foreground mt-0.5">{adr.context}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase">Decisão</p>
                      <p className="text-foreground mt-0.5">{adr.decision}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase">Consequências</p>
                      <p className="text-foreground mt-0.5">{adr.consequences}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Registro de Decisões Táticas de Engenharia */}
        <Card className="border-border/80">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-foreground">Registro de Decisões de Engenharia</h2>
                <p className="text-xs text-muted-foreground">Decisões táticas tomadas pelos especialistas.</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {decisions.length} Decisões
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {decisions.map((dec) => (
                <div key={dec.id} className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-foreground">{dec.title}</h3>
                    <Badge variant="secondary" className="text-[10px]">{dec.status}</Badge>
                  </div>
                  <p className="text-muted-foreground">{dec.rationale}</p>
                  <span className="text-[10px] text-primary font-semibold block pt-1">Autor: {dec.author}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Architecture;
