import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchOrganizations } from '../api/client';
import { Organization } from '../api/types';

export function useOrganizations(): UseQueryResult<Organization[]> {
  return useQuery<Organization[]>({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
    staleTime: 60000,
  });
}
