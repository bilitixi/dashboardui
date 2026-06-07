import axios from 'axios';
import { Device, Alarm, Organization, FleetSummary, BatteryHealthBucket } from './types';
import {
  mockDevices,
  mockAlarms,
  mockOrganizations,
  mockFleetSummary,
  mockBatteryHealthData,
} from './mockData';

const BASE_URL = process.env.REACT_APP_API_URL || '';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const USE_MOCK = !BASE_URL;

export async function fetchOrganizations(): Promise<Organization[]> {
  if (USE_MOCK) return mockOrganizations;
  const { data } = await apiClient.get<Organization[]>('/organizations');
  return data;
}

export async function fetchDevices(organizationId?: string): Promise<Device[]> {
  if (USE_MOCK) {
    return organizationId
      ? mockDevices.filter((d) => d.organizationId === organizationId)
      : mockDevices;
  }
  const params = organizationId ? { organizationId } : {};
  const { data } = await apiClient.get<Device[]>('/devices', { params });
  return data;
}

export async function fetchAlarms(acknowledged?: boolean): Promise<Alarm[]> {
  if (USE_MOCK) {
    return acknowledged !== undefined
      ? mockAlarms.filter((a) => a.acknowledged === acknowledged)
      : mockAlarms;
  }
  const params = acknowledged !== undefined ? { acknowledged } : {};
  const { data } = await apiClient.get<Alarm[]>('/alarms', { params });
  return data;
}

export async function fetchFleetSummary(): Promise<FleetSummary> {
  if (USE_MOCK) return mockFleetSummary;
  const { data } = await apiClient.get<FleetSummary>('/fleet/summary');
  return data;
}

export async function fetchBatteryHealthDistribution(): Promise<BatteryHealthBucket[]> {
  if (USE_MOCK) return mockBatteryHealthData;
  const { data } = await apiClient.get<BatteryHealthBucket[]>('/fleet/battery-health');
  return data;
}
