import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchLocations } from '../api/client';
import { Location } from '../api/types';

export function useLocations(organizationId: string): UseQueryResult<Location[]> {
  return useQuery<Location[]>({
    queryKey: ['locations', organizationId],
    queryFn: () => fetchLocations(organizationId),
    staleTime: 60000,
    enabled: !!organizationId,
  });
}
