import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchAlarms, AlarmFilters } from '../api/client';
import { Alarm, PagedResponse } from '../api/types';

export function useAlarms(filters: AlarmFilters): UseQueryResult<PagedResponse<Alarm>> {
  return useQuery<PagedResponse<Alarm>>({
    queryKey: ['alarms', filters],
    queryFn: () => fetchAlarms(filters),
    staleTime: 15000,
    refetchInterval: 15000,
  });
}
