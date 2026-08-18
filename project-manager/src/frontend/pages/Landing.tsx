import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  FolderKanban,
  Gauge,
  Lightbulb,
  Route,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  {
    title: 'Previsibilidade do portfólio',
    description: 'Visualize o progresso, os marcos e as próximas entregas sem reunir informações dispersas.',
    icon: Gauge,
  },
  {
    title: 'Riscos antecipados',
    description: 'Reconheça atrasos e atividades críticas antes que comprometam o resultado do projeto.',
    icon: AlertTriangle,
  },
  {
    title: 'Alocação transparente',
    description: 'Entenda onde cada profissional atua e quais atividades estão sob sua responsabilidade.',
    icon: Users,
  },
  {
    title: 'Decisões data-driven',
    description: 'Reúna indicadores relevantes em uma leitura executiva clara, objetiva e acionável.',
    icon: BarChart3,
  },
];

const steps = [
  {
    title: 'Planeje',
    description: 'Organize projetos, atividades, responsáveis e prazos em um só lugar.',
    icon: FolderKanban,
  },
  {
    title: 'Acompanhe',
    description: 'Monitore progresso, riscos, entregas e alocação continuamente.',
    icon: Eye,
  },
  {
    title: 'Decida',
    description: 'Priorize ações com uma visão consolidada e baseada em dados.',
    icon: Lightbulb,
  },
];

const Landing = () => (
  <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-6 px-4 sm:px-6">
        <a href="#inicio" className="flex shrink-0 items-center gap-2.5" aria-label="Athena — início">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
            PF
          </span>
          <span className="text-lg font-bold tracking-tight">Athena</span>
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a className="transition-colors hover:text-foreground" href="#beneficios">Benefícios</a>
          <a className="transition-colors hover:text-foreground" href="#como-funciona">Como funciona</a>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">Entrar</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard">Experimentar grátis</Link>
          </Button>
        </div>
      </div>
    </header>

    <main>
      <section id="inicio" className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-32 top-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div
          data-testid="landing-hero"
          className="container mx-auto grid items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:py-24"
        >
          <div className="min-w-0 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Gestão de projetos orientada por dados
            </div>
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Transforme projetos em decisões previsíveis
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
              Conecte prazos, riscos, progresso e alocação em uma visão executiva que mostra onde agir agora e o que esperar das próximas entregas.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" asChild className="h-12 px-6 shadow-lg shadow-primary/20">
                <Link to="/dashboard">
                  Experimentar grátis
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">Explore agora, sem cadastro.</p>
            </div>
          </div>

          <div
            role="img"
            aria-label="Prévia do dashboard executivo do Athena"
            aria-hidden="false"
            className="relative min-w-0 rounded-3xl border border-border bg-card p-3 shadow-2xl shadow-primary/10 sm:p-5"
          >
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/15 via-blue-500/5 to-emerald-500/10 blur-2xl" aria-hidden="true" />
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Visão executiva</p>
                <p className="mt-1 font-semibold">Portfólio de projetos</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">Atualizado</span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ['Projetos ativos', '3'],
                ['Progresso médio', '68%'],
                ['Riscos críticos', '2'],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 rounded-xl border border-border bg-background p-3">
                  <p className="truncate text-[10px] text-muted-foreground sm:text-xs">{label}</p>
                  <p className="mt-1 text-lg font-bold sm:text-xl">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Progresso do portfólio</p>
                  <Route className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    ['Athena MVP', '78%', 'w-[78%]'],
                    ['Portal do Cliente', '56%', 'w-[56%]'],
                    ['Automação Financeira', '41%', 'w-[41%]'],
                  ].map(([name, value, width]) => (
                    <div key={name}>
                      <div className="mb-1.5 flex justify-between gap-3 text-xs">
                        <span className="truncate text-muted-foreground">{name}</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full rounded-full bg-primary ${width}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    <p className="text-xs font-semibold">Atenção necessária</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold">2 riscos</p>
                  <p className="mt-1 text-xs text-muted-foreground">podem afetar prazos</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    <p className="text-xs font-semibold">Equipe alocada</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold">6 profissionais</p>
                  <p className="mt-1 text-xs text-muted-foreground">em 3 projetos ativos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" aria-labelledby="benefits-title" className="border-y border-border bg-muted/30 py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Benefícios</p>
            <h2 id="benefits-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Informação clara para agir no momento certo</h2>
            <p className="mt-4 text-muted-foreground">Menos tempo consolidando dados. Mais clareza para priorizar decisões e proteger entregas.</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map(benefit => {
              const Icon = benefit.icon;
              return (
                <article key={benefit.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="como-funciona" aria-label="Como funciona" className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Como funciona</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Da execução à decisão em três passos</h2>
          </div>

          <div className="relative mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-border md:block" aria-hidden="true" />
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="relative rounded-2xl border border-border bg-background p-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">0{index + 1}</p>
                  <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[40px] border-white/20" />
            <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full border-[40px] border-white/20" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <Target className="mx-auto h-10 w-10" aria-hidden="true" />
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Veja seus projetos com mais clareza</h2>
            <p className="mt-4 text-primary-foreground/80">Explore o Athena agora e descubra como uma visão consolidada simplifica o acompanhamento e a tomada de decisão.</p>
            <Button size="lg" variant="secondary" asChild className="mt-8 h-12 px-6">
              <Link to="/dashboard">
                Experimentar grátis
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t border-border py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
          Athena
        </div>
        <p>© 2026 Athena. Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
);

export default Landing;
