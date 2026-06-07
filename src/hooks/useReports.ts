import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import {
  getMockAlarmsSummary,
  getMockDeviceHealth,
  getMockPowerUsage,
} from '../api/mockData';

export function useDeviceHealth(organization_id?: string) {
  return useQuery({
    queryKey: ['device-health', organization_id],
    queryFn: async () => {
      try {
        return await api.getDeviceHealth({ organization_id });
      } catch {
        return getMockDeviceHealth(organization_id);
      }
    },
    refetchInterval: 30000,
  });
}

export function useAlarmsSummary(organization_id?: string) {
  return useQuery({
    queryKey: ['alarms-summary', organization_id],
    queryFn: async () => {
      try {
        return await api.getAlarmsSummary({ organization_id, timeframe_hours: 24 });
      } catch {
        return getMockAlarmsSummary(organization_id);
      }
    },
    refetchInterval: 30000,
  });
}

export function usePowerUsage(organization_id?: string) {
  return useQuery({
    queryKey: ['power-usage', organization_id],
    queryFn: async () => {
      try {
        return await api.getPowerUsage({ organization_id, timeframe_hours: 24 });
      } catch {
        return getMockPowerUsage(organization_id);
      }
    },
    refetchInterval: 30000,
  });
}
