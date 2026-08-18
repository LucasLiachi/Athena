import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Tickets from './Tickets';
import { mockTickets } from '@/data/mockData';
import { ApiConfigProvider } from '@/contexts/ApiConfigContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';

const renderPage = () =>
  render(
    <AuthProvider>
      <ApiConfigProvider>
        <TooltipProvider>
          <MemoryRouter>
            <Tickets />
          </MemoryRouter>
        </TooltipProvider>
      </ApiConfigProvider>
    </AuthProvider>
  );

describe('Tickets Page', () => {
  it('renders the tickets list properly', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Tickets' })).toBeInTheDocument();

    // Check if tickets are rendered
    mockTickets.forEach((ticket) => {
      expect(screen.getByText(ticket.title)).toBeInTheDocument();
      expect(screen.getByText(ticket.id)).toBeInTheDocument();
    });
  });

  it('filters tickets by search term', () => {
    renderPage();

    const searchInput = screen.getByPlaceholderText('Buscar por ID ou título...');
    fireEvent.change(searchInput, { target: { value: 'Erro de acesso' } });

    expect(screen.getByText('Erro de acesso no Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Atualizar logo na tela de login')).not.toBeInTheDocument();
  });

  it('opens ticket details when a ticket is clicked', () => {
    renderPage();

    const ticketCard = screen.getByText('Erro de acesso no Dashboard').closest('.p-4');
    expect(ticketCard).toBeInTheDocument();

    fireEvent.click(ticketCard!);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText('Alguns usuários reportaram erro 403 ao tentar acessar o dashboard principal.')
    ).toBeInTheDocument();
  });
});
