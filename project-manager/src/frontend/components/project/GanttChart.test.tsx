import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import GanttChart from './GanttChart';

describe('GanttChart', () => {
  it('shows the current project name', () => {
    render(<GanttChart />);

    expect(screen.getByText('Mockup')).toBeInTheDocument();
    expect(screen.queryByText('Solar BPM — Implantação v2')).not.toBeInTheDocument();
  });
});
