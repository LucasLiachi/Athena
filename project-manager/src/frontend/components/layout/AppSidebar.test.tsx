import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/components/theme-provider';
import AppSidebar from './AppSidebar';

describe('AppSidebar', () => {
  it('expõe os links principais das 7 áreas do Agentic PMO', () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="sidebar-test-theme">
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppSidebar />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(screen.getByRole('link', { name: /Overview/i })).toHaveAttribute('href', '/overview');
    expect(screen.getByRole('link', { name: /Roadmap & WBS/i })).toHaveAttribute('href', '/roadmap');
    expect(screen.getByRole('link', { name: /Delivery Board/i })).toHaveAttribute('href', '/delivery');
    expect(screen.getByRole('link', { name: /Architecture/i })).toHaveAttribute('href', '/architecture');
    expect(screen.getByRole('link', { name: /SDD & Specs/i })).toHaveAttribute('href', '/sdd');
    expect(screen.getByRole('link', { name: /Agents & Swarms/i })).toHaveAttribute('href', '/agents');
    expect(screen.getByRole('link', { name: /Operations & Audit/i })).toHaveAttribute('href', '/operations');
  });
});
