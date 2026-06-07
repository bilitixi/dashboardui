import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { mockDevices } from '../api/mockData';

export function useDevices(params?: { organization_id?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['devices', params],
    queryFn: async () => {
      try {
        return await api.getDevices(params);
      } catch {
        const filtered = params?.organization_id
          ? mockDevices.filter((d) => d.organization_id === params.organization_id)
          : mockDevices;
        return { items: filtered, total: filtered.length, limit: 100, offset: 0 };
      }
    },
    refetchInterval: 30000,
  });
}
