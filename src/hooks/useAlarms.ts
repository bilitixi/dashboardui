import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { mockAlarms } from '../api/mockData';

export function useAlarms(params?: {
  organization_id?: string;
  severity?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['alarms', params],
    queryFn: async () => {
      try {
        return await api.getAlarms(params);
      } catch {
        let filtered = mockAlarms;
        if (params?.organization_id)
          filtered = filtered.filter((a) => a.organization_id === params.organization_id);
        if (params?.severity) filtered = filtered.filter((a) => a.severity === params.severity);
        if (params?.status) filtered = filtered.filter((a) => a.status === params.status);
        return { items: filtered, total: filtered.length, limit: 100, offset: 0 };
      }
    },
    refetchInterval: 30000,
  });
}
