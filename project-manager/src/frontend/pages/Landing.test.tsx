import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Landing from './Landing';

const renderPage = () => render(
  <MemoryRouter>
    <Landing />
  </MemoryRouter>,
);

describe('Landing', () => {
  it('apresenta a proposta de valor e os benefícios executivos', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Transforme projetos em decisões previsíveis' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Previsibilidade do portfólio' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Riscos antecipados' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Alocação transparente' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Decisões data-driven' })).toBeInTheDocument();
  });

  it('leva todas as ações do produto diretamente ao dashboard', () => {
    renderPage();

    const links = screen.getAllByRole('link', { name: /Experimentar grátis|Entrar/ });
    expect(links.length).toBeGreaterThanOrEqual(3);
    links.forEach(link => expect(link).toHaveAttribute('href', '/dashboard'));
  });

  it('expõe navegação interna e o fluxo de três passos', () => {
    renderPage();

    expect(screen.getByRole('link', { name: 'Benefícios' })).toHaveAttribute('href', '#beneficios');
    expect(screen.getByRole('link', { name: 'Como funciona' })).toHaveAttribute('href', '#como-funciona');
    const flow = screen.getByRole('region', { name: 'Como funciona' });
    expect(within(flow).getByText('Planeje')).toBeInTheDocument();
    expect(within(flow).getByText('Acompanhe')).toBeInTheDocument();
    expect(within(flow).getByText('Decida')).toBeInTheDocument();
  });

  it('remove preço, checkout, urgência e cadastro obrigatório', () => {
    renderPage();

    expect(screen.queryByText(/R\$|TEMPO LIMITADO|Plano de Inauguração/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText(/Cadastrar e Explorar/i)).not.toBeInTheDocument();
  });

  it('marca a prévia do produto como ilustração não interativa', () => {
    renderPage();

    expect(screen.getByRole('img', { name: 'Prévia do dashboard executivo do Athena' })).toHaveAttribute('aria-hidden', 'false');
    expect(screen.queryByRole('button', { name: /alerta|progresso|alocação/i })).not.toBeInTheDocument();
  });

  it('possui regiões estruturais e composição responsiva', () => {
    renderPage();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByTestId('landing-hero')).toHaveClass('lg:grid-cols-[1fr_0.95fr]');
  });
});
