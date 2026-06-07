import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchAlarms } from '../api/client';
import { Alarm } from '../api/types';

export function useAlarms(acknowledged?: boolean): UseQueryResult<Alarm[]> {
  return useQuery<Alarm[]>({
    queryKey: ['alarms', acknowledged],
    queryFn: () => fetchAlarms(acknowledged),
    staleTime: 15000,
    refetchInterval: 15000,
  });
}
