import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ticket, getTicketStatusLabel, getTicketStatusColor, getPriorityLabel, getPriorityColor } from '@/data/mockData';
import { MessageSquare, Clock, User, Hash, Sparkles, Loader2 } from 'lucide-react';
import { useAiService } from '@/services/aiService';

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
}

const TicketDetail = ({ ticket, onClose }: TicketDetailProps) => {
  const { generateCompletion } = useAiService();
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await generateCompletion([
        { role: 'system', content: 'Você é um assistente de suporte técnico. Forneça uma sugestão rápida e direta (1-2 parágrafos) de como resolver ou quais são os próximos passos para o ticket fornecido.' },
        { role: 'user', content: `Título: ${ticket.title}\nDescrição: ${ticket.description}\nPrioridade: ${ticket.priority}` }
      ]);
      setAiAnalysis(result);
    } catch (error: any) {
      setAiAnalysis(`Erro ao conectar com a IA: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
              <Hash className="w-3 h-3" /> {ticket.id}
            </span>
            <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded-full ${getTicketStatusColor(ticket.status)}`}>
              {getTicketStatusLabel(ticket.status)}
            </span>
            <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded-full ${getPriorityColor(ticket.priority)}`}>
              {getPriorityLabel(ticket.priority)}
            </span>
          </div>
          <DialogTitle className="text-xl leading-tight">{ticket.title}</DialogTitle>
          <DialogDescription className="mt-4 text-base text-foreground/80">
            {ticket.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-6 py-4 border-y border-border my-2">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><User className="w-4 h-4"/> Criado por</span>
              <span className="font-medium">{ticket.createdBy.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><User className="w-4 h-4"/> Responsável</span>
              <span className="font-medium">{ticket.assignee ? ticket.assignee.name : 'Não atribuído'}</span>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4"/> Criado em</span>
              <span className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4"/> Atualizado em</span>
              <span className="font-medium">{new Date(ticket.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {aiAnalysis && (
          <div className="bg-primary/5 border border-primary/20 rounded-md p-4 text-sm mb-4">
            <div className="flex items-center gap-2 font-semibold text-primary mb-2">
              <Sparkles className="w-4 h-4" /> Sugestão da IA
            </div>
            <div className="text-foreground/90 whitespace-pre-wrap">{aiAnalysis}</div>
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <Button 
            variant="secondary" 
            className="gap-2 text-primary" 
            onClick={handleAiAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isAnalyzing ? 'Analisando...' : 'Analisar com IA'}
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Fechar</Button>
            <Button className="gap-2"><MessageSquare className="w-4 h-4" /> Adicionar Comentário</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetail;
