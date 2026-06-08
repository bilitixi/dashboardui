import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import {
  fetchAlarmsSummary, fetchDeviceHealth, fetchPowerUsage, PowerUsageFilters,
  fetchSyncStatus, triggerBootstrap, triggerIncrementalSync,
} from '../api/client';
import {
  AlarmsSummaryReport, DeviceHealthReport, PowerUsageReport, SyncStatusResponse,
} from '../api/types';

export function useAlarmsSummary(orgId: string, hours = 24): UseQueryResult<AlarmsSummaryReport> {
  return useQuery<AlarmsSummaryReport>({
    queryKey: ['alarmsSummary', orgId, hours],
    queryFn: () => fetchAlarmsSummary(orgId, hours),
    staleTime: 60000,
    refetchInterval: 60000,
    enabled: !!orgId,
  });
}

export function useDeviceHealth(orgId: string): UseQueryResult<DeviceHealthReport> {
  return useQuery<DeviceHealthReport>({
    queryKey: ['deviceHealth', orgId],
    queryFn: () => fetchDeviceHealth(orgId),
    staleTime: 30000,
    refetchInterval: 30000,
    enabled: !!orgId,
  });
}

export function usePowerUsage(filters: PowerUsageFilters): UseQueryResult<PowerUsageReport> {
  return useQuery<PowerUsageReport>({
    queryKey: ['powerUsage', filters],
    queryFn: () => fetchPowerUsage(filters),
    staleTime: 60000,
    refetchInterval: 60000,
    enabled: !!filters.organization_id,
  });
}

export function useSyncStatus(): UseQueryResult<SyncStatusResponse> {
  return useQuery<SyncStatusResponse>({
    queryKey: ['syncStatus'],
    queryFn: fetchSyncStatus,
    staleTime: 30000,
    refetchInterval: 30000,
  });
}

export function useBootstrap() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: triggerBootstrap,
    onSuccess: () => qc.invalidateQueries(),
  });
}

export function useIncrementalSync() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: triggerIncrementalSync,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['syncStatus'] }),
  });
}
