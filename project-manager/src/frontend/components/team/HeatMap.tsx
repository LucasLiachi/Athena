import React from 'react';
import type { TeamAllocation } from '@/lib/teamAllocation';
import { format } from 'date-fns';

/**
 * Mapa de calor simples que exibe a quantidade de tarefas alocadas
 * para cada membro ao longo dos últimos 30 dias.
 * Cada célula tem a cor intensificada de acordo com o número de tarefas
 * atribuídas para aquele dia.
 */
const HeatMap: React.FC<{ allocations: TeamAllocation[] }> = ({ allocations }) => {
  // gerar array de datas dos últimos 30 dias
  const days: Date[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  // cria mapa: memberId -> dateString -> count
  const memberDateMap: Record<string, Record<string, number>> = {};
  allocations.forEach((alloc) => {
    const memberId = alloc.member.id;
    if (!memberDateMap[memberId]) memberDateMap[memberId] = {};
    alloc.groups.forEach((group) => {
      group.tasks.forEach((task) => {
        const start = new Date(task.startDate);
        const end = new Date(task.endDate);
        // considerar cada dia dentro do intervalo
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateKey = format(d, 'yyyy-MM-dd');
          if (!memberDateMap[memberId][dateKey]) memberDateMap[memberId][dateKey] = 0;
          memberDateMap[memberId][dateKey]++;
        }
      });
    });
  });

  // função para escolher cor baseada na contagem (0-5+)
  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted/20';
    if (count === 1) return 'bg-primary/10';
    if (count === 2) return 'bg-primary/20';
    if (count === 3) return 'bg-primary/30';
    if (count === 4) return 'bg-primary/40';
    return 'bg-primary/60'; // 5 ou mais
  };

  return (
    <div className="overflow-x-auto py-4">
      <div className="grid grid-cols-[auto_repeat(30,_minmax(20px,_1fr))] gap-1 items-center">
        {/* Header com datas */}
        <div className="text-sm font-medium text-muted-foreground">Membro</div>
        {days.map((d) => (
          <div key={format(d, 'yyyy-MM-dd')} className="text-xs text-muted-foreground text-center">
            {format(d, 'dd/MM')}
          </div>
        ))}
        {/* linhas por membro */}
        {allocations.map((alloc) => {
          const memberId = alloc.member.id;
          return (
            <React.Fragment key={memberId}>
              <div className="text-sm font-medium text-foreground">{alloc.member.name}</div>
              {days.map((d) => {
                const key = format(d, 'yyyy-MM-dd');
                const count = memberDateMap[memberId][key] ?? 0;
                return (
                  <div
                    key={key}
                    className={`h-5 w-5 rounded ${getColor(count)}`}
                    title={`${alloc.member.name} - ${format(d, 'dd/MM/yyyy')}: ${count} tarefa(s)`}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default HeatMap;
