import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { mockOrganizations } from '../api/mockData';

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      try {
        return await api.getOrganizations();
      } catch {
        return mockOrganizations;
      }
    },
    refetchInterval: 30000,
  });
}
