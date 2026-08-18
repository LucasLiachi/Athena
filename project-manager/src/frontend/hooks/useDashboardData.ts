import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';

type Project = {
  id: string;
  name: string;
  updatedAt: string;
  // ... other fields as needed
};

type ProjectHistory = {
  projectId: string;
  // ... other fields
};

type TeamMember = {
  id: string;
  name: string;
  // ... other fields
};

interface DashboardData {
  projects: Project[];
  projectHistory: ProjectHistory[];
  teamMembers: TeamMember[];
}

/**
 * Hook to fetch all necessary data for the dashboard.
 * It uses the `useApi` client (configured through Settings) and `react-query`
 * for caching, background refetching and error handling.
 *
 * The returned object mirrors the shape expected by `src/pages/Index.tsx`:
 *   - `data` contains `{ projects, projectHistory, teamMembers }`
 *   - `isLoading` signals the loading state
 *   - `isError` signals any request failure
 */
const useDashboardData = () => {
  const api = useApi();

  const fetchData = async (): Promise<DashboardData> => {
    const [projects, projectHistory, teamMembers] = await Promise.all([
      api<Project[]>('GET', '/projects'),
      api<ProjectHistory[]>('GET', '/project-history'),
      api<TeamMember[]>('GET', '/team-members'),
    ]);
    return { projects, projectHistory, teamMembers };
  };

  const query = useQuery<DashboardData, Error>({
    queryKey: ['dashboardData'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export default useDashboardData;
