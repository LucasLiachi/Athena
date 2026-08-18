import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DashboardPeriod = number;

interface DashboardState {
  projectId: string;
  period: DashboardPeriod;
  memberId: string | null;
  setProjectId: (id: string) => void;
  setPeriod: (p: DashboardPeriod) => void;
  setMemberId: (id: string | null) => void;
  clearSelection: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      projectId: 'all',
      period: 90,
      memberId: null,
      setProjectId: (id) => set({ projectId: id }),
      setPeriod: (p) => set({ period: p }),
      setMemberId: (id) => set({ memberId: id }),
      clearSelection: () => set({ projectId: 'all', memberId: null }),
    }),
    {
      name: 'dashboard-store', // key in localStorage
    }
  )
);
