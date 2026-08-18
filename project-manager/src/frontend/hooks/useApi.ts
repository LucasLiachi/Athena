import { useApiClient } from '@/lib/apiClient';

/**
 * Hook exposing the configured API client request function.
 * Returns a function that can be used to perform HTTP requests with the
 * base URL and API key configured in the Settings page.
 */
export const useApi = () => {
  const { request } = useApiClient();
  return request;
};
