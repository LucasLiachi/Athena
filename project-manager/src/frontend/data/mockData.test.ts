import { describe, expect, it } from 'vitest';
import { projectHistory, projects } from './mockData';

describe('dashboard mock data', () => {
  it('provides a dated forecast for every project', () => {
    for (const project of projects) {
      expect(project.predictedEndDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(project.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('keeps historical progress ordered and bounded', () => {
    for (const project of projects) {
      const points = projectHistory.filter(point => point.projectId === project.id);
      expect(points.length).toBeGreaterThanOrEqual(4);
      expect(points.map(point => point.date)).toEqual(
        [...points].sort((a, b) => a.date.localeCompare(b.date)).map(point => point.date),
      );
      for (const point of points) {
        expect(point.planned).toBeGreaterThanOrEqual(0);
        expect(point.planned).toBeLessThanOrEqual(100);
        expect(point.actual).toBeGreaterThanOrEqual(0);
        expect(point.actual).toBeLessThanOrEqual(100);
      }
    }
  });
});
