import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchDevices, DeviceFilters } from '../api/client';
import { Device, PagedResponse } from '../api/types';

export function useDevices(filters: DeviceFilters): UseQueryResult<PagedResponse<Device>> {
  return useQuery<PagedResponse<Device>>({
    queryKey: ['devices', filters],
    queryFn: () => fetchDevices(filters),
    staleTime: 30000,
    refetchInterval: 30000,
  });
}
