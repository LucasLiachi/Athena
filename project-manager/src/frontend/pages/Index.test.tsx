import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Index from './Index';

describe('executive dashboard', () => {
  it('filters the dashboard when a project is selected from a chart', () => {
    render(<MemoryRouter><Index /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Desempenho do portfólio' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^selecionar athena mvp$/i }));
    expect(screen.getByRole('button', { name: /limpar seleção/i })).toBeInTheDocument();
    expect(screen.getByText('1/1')).toBeInTheDocument();
  });

  it('renders all four decision views', () => {
    render(<MemoryRouter><Index /></MemoryRouter>);
    expect(screen.getByText('Evolução do portfólio')).toBeInTheDocument();
    expect(screen.getByText('Previsão de entrega')).toBeInTheDocument();
    expect(screen.getByText('Mapa de risco')).toBeInTheDocument();
    expect(screen.getByText('Carga por responsável')).toBeInTheDocument();
  });

  it('highlights a member without filtering dashboard data and clears the highlight', () => {
    render(<MemoryRouter><Index /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: /selecionar pedro oliveira/i }));
    expect(screen.getByText('Destaque: Pedro Oliveira')).toBeInTheDocument();
    expect(screen.getByText('2/4')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^selecionar athena mvp$/i }));
    fireEvent.click(screen.getByRole('button', { name: /limpar seleção/i }));
    expect(screen.queryByText('Destaque: Pedro Oliveira')).not.toBeInTheDocument();
    expect(screen.getByText('2/4')).toBeInTheDocument();
  });
});
