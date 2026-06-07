import axios from 'axios';
import { Device, Alarm, Organization, FleetSummary, BatteryHealthBucket, MaintenanceItem } from './types';
import {
  mockDevices,
  mockAlarms,
  mockOrganizations,
  mockFleetSummary,
  mockBatteryHealthData,
  mockMaintenanceItems,
} from './mockData';

const BASE_URL = process.env.REACT_APP_API_URL || '';
const USE_MOCK = !BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchOrganizations(): Promise<Organization[]> {
  if (USE_MOCK) return mockOrganizations;
  const { data } = await apiClient.get<Organization[]>('/api/organizations');
  return data;
}

export async function fetchDevices(organizationId?: string): Promise<Device[]> {
  if (USE_MOCK) {
    return organizationId && organizationId !== 'org-1'
      ? mockDevices.filter((d) => d.organizationId === organizationId)
      : mockDevices;
  }
  const params: Record<string, string> = {};
  if (organizationId) params.organization_id = organizationId;
  const { data } = await apiClient.get<Device[]>('/api/devices', { params });
  return data;
}

export async function fetchAlarms(acknowledged?: boolean): Promise<Alarm[]> {
  if (USE_MOCK) {
    return acknowledged !== undefined
      ? mockAlarms.filter((a) => a.acknowledged === acknowledged)
      : mockAlarms;
  }
  const params = acknowledged !== undefined ? { acknowledged } : {};
  const { data } = await apiClient.get<Alarm[]>('/api/alarms', { params });
  return data;
}

export async function fetchFleetSummary(): Promise<FleetSummary> {
  if (USE_MOCK) return mockFleetSummary;
  const { data } = await apiClient.get<FleetSummary>('/api/reports/device-health');
  return data;
}

export async function fetchBatteryHealthDistribution(): Promise<BatteryHealthBucket[]> {
  if (USE_MOCK) return mockBatteryHealthData;
  const { data } = await apiClient.get<BatteryHealthBucket[]>('/api/reports/battery-health');
  return data;
}

export async function fetchMaintenanceItems(): Promise<MaintenanceItem[]> {
  if (USE_MOCK) return mockMaintenanceItems;
  const { data } = await apiClient.get<MaintenanceItem[]>('/api/reports/maintenance');
  return data;
}
