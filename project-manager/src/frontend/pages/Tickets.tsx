import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter } from 'lucide-react';
import { mockTickets, getTicketStatusLabel, getTicketStatusColor, getPriorityLabel, getPriorityColor, Ticket } from '@/data/mockData';
import TicketDetail from '@/components/tickets/TicketDetail';

interface TicketsProps {
  isEmbedded?: boolean;
  projectId?: string;
}

const Tickets = ({ isEmbedded = false, projectId }: TicketsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filteredTickets = mockTickets.filter(ticket => 
    (projectId ? ticket.projectId === projectId : true) &&
    (ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const content = (
    <div className={isEmbedded ? "w-full" : ""}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tickets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie solicitações de suporte e demandas {projectId ? 'deste espaço' : 'internas'}.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Ticket
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Buscar por ID ou título..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredTickets.map(ticket => (
          <Card 
            key={ticket.id} 
            className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => setSelectedTicket(ticket)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-muted-foreground">{ticket.id}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getTicketStatusColor(ticket.status)}`}>
                  {getTicketStatusLabel(ticket.status)}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getPriorityColor(ticket.priority)}`}>
                  {getPriorityLabel(ticket.priority)}
                </span>
              </div>
              <h3 className="font-semibold text-foreground truncate">{ticket.title}</h3>
              <p className="text-sm text-muted-foreground truncate mt-1">{ticket.description}</p>
            </div>
            
            <div className="flex flex-col sm:items-end shrink-0 text-xs text-muted-foreground gap-1">
              <span>Criado por {ticket.createdBy.name}</span>
              <span>Em {new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
          </Card>
        ))}
        {filteredTickets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
            Nenhum ticket encontrado.
          </div>
        )}
      </div>

      {selectedTicket && (
        <TicketDetail 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </div>
  );

  return isEmbedded ? content : <AppLayout>{content}</AppLayout>;
};

export default Tickets;
