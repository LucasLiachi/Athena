import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/components/theme-provider';
import Overview from './Overview';
import Roadmap from './Roadmap';
import Agents from './Agents';

describe('Governance Pages', () => {
  it('renderiza o cockpit do Overview com as métricas e pipeline da Control Tower', async () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="gov-test-theme">
        <MemoryRouter>
          <Overview />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText(/ROADMAP • EXECUÇÃO ÁGIL • DESENVOLVIMENTO/i)).toBeInTheDocument();
    expect(screen.getByText(/Seção 01: Roadmap Estratégico/i)).toBeInTheDocument();
    expect(screen.getByText(/Seção 02: Hierarquia do Trabalho/i)).toBeInTheDocument();
    expect(screen.getByText(/Seção 03: Níveis de Dev/i)).toBeInTheDocument();
  });

  it('renderiza o Roadmap com as colunas de ciclo de vida', async () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="gov-test-theme">
        <MemoryRouter>
          <Roadmap />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText(/Roadmap & WBS Hierárquico/i)).toBeInTheDocument();
    expect(screen.getByText(/Propor Nova Feature/i)).toBeInTheDocument();
  });

  it('renderiza o Catálogo de Agentes e Swarm Desk', async () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="gov-test-theme">
        <MemoryRouter>
          <Agents />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText(/Catálogo de Especialistas \(13 Personas\) & Swarm Desk/i)).toBeInTheDocument();
  });
});
