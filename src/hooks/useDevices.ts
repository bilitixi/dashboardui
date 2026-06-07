import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchDevices, fetchFleetSummary, fetchBatteryHealthDistribution } from '../api/client';
import { Device, FleetSummary, BatteryHealthBucket } from '../api/types';

export function useDevices(organizationId?: string): UseQueryResult<Device[]> {
  return useQuery<Device[]>({
    queryKey: ['devices', organizationId],
    queryFn: () => fetchDevices(organizationId),
    staleTime: 30000,
    refetchInterval: 30000,
  });
}

export function useFleetSummary(): UseQueryResult<FleetSummary> {
  return useQuery<FleetSummary>({
    queryKey: ['fleetSummary'],
    queryFn: fetchFleetSummary,
    staleTime: 30000,
    refetchInterval: 30000,
  });
}

export function useBatteryHealthDistribution(): UseQueryResult<BatteryHealthBucket[]> {
  return useQuery<BatteryHealthBucket[]>({
    queryKey: ['batteryHealthDistribution'],
    queryFn: fetchBatteryHealthDistribution,
    staleTime: 30000,
  });
}
