import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Team from './Team';

const renderPage = () => render(
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Team />
  </MemoryRouter>,
);

describe('Team allocation page', () => {
  it('mostra indicadores e todos os profissionais inicialmente', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Alocação da Equipe' })).toBeInTheDocument();
    expect(screen.getByText('Acompanhe profissionais, projetos e atividades em andamento')).toBeInTheDocument();
    expect(screen.getByText('Profissionais')).toBeInTheDocument();
    expect(screen.getAllByText('Projetos ativos')).toHaveLength(2);
    expect(screen.getAllByText('Atividades abertas')).toHaveLength(2);
    expect(screen.getByText('Atividades críticas')).toBeInTheDocument();

    const indicators = screen.getByRole('region', { name: 'Indicadores da equipe' });
    for (const [label, value] of [
      ['Profissionais', '6'],
      ['Projetos ativos', '3'],
      ['Atividades abertas', '9'],
      ['Atividades críticas', '2'],
    ]) {
      const metric = within(indicators).getByText(label).parentElement;
      expect(within(metric!).getByText(value)).toBeInTheDocument();
    }
    expect(within(indicators).getByText('a fazer, em andamento ou em revisão')).toBeInTheDocument();
    expect(screen.getAllByText('Ana Silva')).toHaveLength(2);
    expect(screen.getAllByText('Rafael Lima')).toHaveLength(2);
  });

  it('mantém cards até lg e libera a tabela completa em telas maiores', () => {
    renderPage();

    const table = screen.getByRole('table');
    expect(table).toHaveClass('hidden', 'lg:table');
    expect(table.parentElement).toHaveClass('hidden', 'overflow-x-auto', 'lg:block');
    expect(screen.getByRole('region', { name: 'Alocações em cards' })).toHaveClass('lg:hidden');
  });

  it('separa função de profissional na tabela e expande por todas as colunas', () => {
    renderPage();

    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader').map(header => header.textContent)).toEqual([
      'Profissional',
      'Função',
      'Projetos ativos',
      'Atividades abertas',
      'Próxima entrega',
      'Detalhes',
    ]);

    fireEvent.click(within(table).getByRole('button', { name: 'Ver atividades de Carlos Souza' }));
    expect(within(table).getByText('Implementar dashboard').closest('td')).toHaveAttribute('colspan', '6');
  });

  it('mostra ausência de entrega pendente sem alterar o fallback de data inválida', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('Status da atividade'), { target: { value: 'done' } });

    expect(screen.getAllByText('Sem entrega pendente').length).toBeGreaterThan(0);
    expect(screen.queryByText('Data não informada')).not.toBeInTheDocument();
  });

  it('mantém nome acessível completo e texto visual curto no botão dos cards', () => {
    renderPage();

    const cards = screen.getByRole('region', { name: 'Alocações em cards' });
    const button = within(cards).getByRole('button', { name: 'Ver atividades de Carlos Souza' });
    expect(button).toHaveAttribute('aria-label', 'Ver atividades de Carlos Souza');
    expect(button).toHaveTextContent(/^Ver atividades$/);
  });

  it('oculta as iniciais decorativas dos avatares da leitura assistiva', () => {
    renderPage();

    for (const initials of screen.getAllByText('CS')) {
      expect(initials).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('filtra por busca e permite limpar os filtros', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('Buscar profissional'), { target: { value: 'Julia' } });
    expect(screen.getAllByText('Julia Santos')).toHaveLength(2);
    expect(screen.queryByText('Carlos Souza')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(screen.getAllByText('Carlos Souza')).toHaveLength(2);
  });

  it('distribui filtros e botão em um grid fluido sem mínimos fixos', () => {
    renderPage();

    const search = screen.getByLabelText('Buscar profissional');
    fireEvent.change(search, { target: { value: 'Julia' } });

    const clearButton = screen.getByRole('button', { name: 'Limpar filtros' });
    const filterGrid = search.closest('.grid');
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveClass('self-end');
    expect(filterGrid).toHaveClass('sm:grid-cols-2', 'xl:grid-cols-4', 'xl:items-end');
    expect(filterGrid).not.toHaveClass('lg:grid-cols-[minmax(16rem,1fr)_minmax(12rem,0.7fr)_minmax(12rem,0.7fr)_auto]');
    for (const field of Array.from(filterGrid!.children).slice(0, 3)) {
      expect(field).toHaveClass('min-w-0');
    }
  });

  it('expande e recolhe atividades agrupadas com link para o projeto', () => {
    renderPage();

    const triggers = screen.getAllByRole('button', { name: 'Ver atividades de Carlos Souza' });
    expect(triggers).toHaveLength(2);
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(triggers[0]);
    expect(screen.getAllByText('Implementar dashboard')).toHaveLength(2);
    for (const link of screen.getAllByRole('link', { name: 'Athena MVP' })) {
      expect(link).toHaveAttribute('href', '/projects/1');
    }

    const collapseTriggers = screen.getAllByRole('button', { name: 'Ocultar atividades de Carlos Souza' });
    expect(collapseTriggers[0]).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(collapseTriggers[0]);
    expect(screen.queryByText('Implementar dashboard')).not.toBeInTheDocument();
  });

  it('mostra estado vazio ao combinar projeto sem atividades concluídas', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('Projeto'), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText('Status da atividade'), { target: { value: 'done' } });

    expect(screen.getByText('Nenhuma alocação encontrada')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpar filtros' })).toBeInTheDocument();
  });
});
