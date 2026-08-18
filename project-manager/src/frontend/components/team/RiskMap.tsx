import React from 'react';
import type { TeamAllocation } from '@/lib/teamAllocation';

/**
 * Simple risk map that highlights members with a high number of allocated tasks
 * (super‑allocation). It shows a list where each member's bar color becomes red
 * when the total allocated tasks exceed a given threshold.
 */
const RiskMap: React.FC<{ allocations: TeamAllocation[]; threshold?: number }> = ({
  allocations,
  threshold = 5,
}) => {
  const totalTasksByMember = allocations.map((alloc) => ({
    name: alloc.member.name,
    count: alloc.groups.reduce((sum, g) => sum + g.tasks.length, 0),
  }));

  return (
    <div className="my-6">
      <h2 className="mb-2 text-lg font-semibold text-foreground">Mapa de risco (Super‑alocação)</h2>
      {totalTasksByMember.map((m) => {
        const isRisk = m.count > threshold;
        return (
          <div key={m.name} className="mb-2 flex items-center">
            <span className="w-32 text-sm font-medium text-foreground">{m.name}</span>
            <div className="flex-1 h-4 rounded bg-muted/20">
              <div
                className={`h-full rounded ${isRisk ? 'bg-red-500' : 'bg-primary/30'}`}
                style={{ width: `${Math.min(m.count * 10, 100)}%` }}
                title={`${m.count} tarefa(s)`}
              />
            </div>
            <span className="ml-2 text-sm text-muted-foreground">{m.count}</span>
          </div>
        );
      })}
    </div>
  );
};

export default RiskMap;
