import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Kanban,
  Landmark,
  FileCode2,
  Bot,
  Cpu,
  Moon,
  Sun,
  ShieldAlert,
  Sparkles,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

export const pmoNavItems = [
  { to: '/overview', icon: LayoutDashboard, label: 'Overview', badge: 'Cockpit' },
  { to: '/roadmap', icon: Compass, label: 'Roadmap & WBS', badge: 'L0-L7' },
  { to: '/delivery', icon: Kanban, label: 'Delivery Board', badge: 'Tasks' },
  { to: '/architecture', icon: Landmark, label: 'Architecture', badge: 'ADRs' },
  { to: '/sdd', icon: FileCode2, label: 'SDD & Specs', badge: 'Spec Kit' },
  { to: '/agents', icon: Bot, label: 'Agents & Swarms', badge: '13 Personas' },
  { to: '/operations', icon: Cpu, label: 'Operations & Audit', badge: 'Compliance' },
];

const AppSidebar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center border-r border-border bg-sidebar/95 backdrop-blur-md py-5 lg:w-64 overflow-y-auto">
      {/* Brand Header */}
      <div className="mb-6 flex items-center gap-3 px-4 w-full">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-indigo-500/20 shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="hidden lg:block min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-foreground">ATHENA</span>
            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">PMO</span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">Agentic Operating System</p>
        </div>
      </div>

      {/* Nav Principal */}
      <div className="w-full px-2 lg:px-3 mb-6">
        <p className="hidden lg:block text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wider mb-2 px-3">
          Gestão de Portfólio & Engenharia
        </p>
        <nav className="flex flex-col gap-1.5">
          {pmoNavItems.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to === '/overview' && location.pathname === '/dashboard') ||
              (item.to === '/roadmap' && location.pathname.startsWith('/features'));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  'justify-center lg:justify-start',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-semibold'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <span className="hidden lg:block truncate flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      'hidden lg:inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-tight',
                      isActive
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Development Level Reference */}
      <div className="hidden lg:block w-full px-3 mb-4">
        <div className="rounded-xl border border-border/80 bg-card/60 p-3 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-bold text-foreground">Gates de Maturidade</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            L0 (Idea) → L3 (Ready) → L4 (Dev) → L7 (Operate). Nenhuma task sem Spec aprovada.
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-auto px-3 w-full flex flex-col gap-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center justify-center lg:justify-start gap-3 rounded-xl px-3 py-2 text-xs font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 shrink-0 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 shrink-0 text-indigo-400" />
          )}
          <span className="hidden lg:block">Alternar Tema ({theme === 'dark' ? 'Escuro' : 'Claro'})</span>
        </button>

        <div className="hidden lg:flex items-center justify-between rounded-xl border border-border bg-card p-2.5 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              🦉
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">Athena Prime</p>
              <p className="text-[10px] text-emerald-500 font-medium">Orchestrator Online</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
