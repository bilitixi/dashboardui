import axios from 'axios';
import {
  Organization, Location, Device, PagedResponse, Alarm,
  AlarmsSummaryReport, DeviceHealthReport, PowerUsageReport,
  SyncStatusResponse,
} from './types';
import {
  mockOrganizations, mockLocations, mockDevicesPage, mockAlarms,
  mockAlarmsSummary, mockDeviceHealth, mockPowerUsage, mockSyncStatus,
} from './mockData';

const BASE_URL = process.env.REACT_APP_API_URL || '';
const USE_MOCK = !BASE_URL;

const api = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } });

// ── Organizations ─────────────────────────────────────────────────────────────
export async function fetchOrganizations(): Promise<Organization[]> {
  if (USE_MOCK) return mockOrganizations;
  const { data } = await api.get<Organization[]>('/api/ecostruxure/organizations');
  return data;
}

// ── Locations ─────────────────────────────────────────────────────────────────
export async function fetchLocations(organization_id: string): Promise<Location[]> {
  if (USE_MOCK) return mockLocations.filter(l => l.organization_id === organization_id);
  const { data } = await api.get<Location[]>('/api/ecostruxure/locations', { params: { organization_id } });
  return data;
}

// ── Devices ───────────────────────────────────────────────────────────────────
export interface DeviceFilters {
  organization_id: string;
  location_id?: string;
  limit?: number;
  offset?: number;
}

export async function fetchDevices(filters: DeviceFilters): Promise<PagedResponse<Device>> {
  if (USE_MOCK) return mockDevicesPage(filters.organization_id, filters.location_id, filters.limit, filters.offset);
  const { data } = await api.get<PagedResponse<Device>>('/api/ecostruxure/devices', { params: filters });
  return data;
}

// ── Alarms ────────────────────────────────────────────────────────────────────
export interface AlarmFilters {
  organization_id: string;
  severity?: 'CRITICAL' | 'WARNING' | 'INFO';
  status?: 'active' | 'cleared';
  limit?: number;
  offset?: number;
}

export async function fetchAlarms(filters: AlarmFilters): Promise<PagedResponse<Alarm>> {
  if (USE_MOCK) {
    let items = [...mockAlarms];
    if (filters.severity) items = items.filter(a => a.severity === filters.severity);
    if (filters.status === 'active')  items = items.filter(a => a.cleared_time === null);
    if (filters.status === 'cleared') items = items.filter(a => a.cleared_time !== null);
    const offset = filters.offset ?? 0;
    const limit  = filters.limit  ?? 50;
    return { items: items.slice(offset, offset + limit), total: items.length, limit, offset };
  }
  const { data } = await api.get<PagedResponse<Alarm>>('/api/ecostruxure/alarms', { params: filters });
  return data;
}

// ── Reports ───────────────────────────────────────────────────────────────────
export async function fetchAlarmsSummary(
  organization_id: string, timeframe_hours = 24
): Promise<AlarmsSummaryReport> {
  if (USE_MOCK) return mockAlarmsSummary(organization_id);
  const { data } = await api.get<AlarmsSummaryReport>('/api/ecostruxure/reports/alarms-summary', {
    params: { organization_id, timeframe_hours },
  });
  return data;
}

export async function fetchDeviceHealth(organization_id: string): Promise<DeviceHealthReport> {
  if (USE_MOCK) return mockDeviceHealth(organization_id);
  const { data } = await api.get<DeviceHealthReport>('/api/ecostruxure/reports/device-health', {
    params: { organization_id },
  });
  return data;
}

export interface PowerUsageFilters {
  organization_id: string;
  timeframe_hours?: number;
  unit?: string; // optional unit filter e.g. 'W', 'V', '%'
}

export async function fetchPowerUsage(filters: PowerUsageFilters): Promise<PowerUsageReport> {
  if (USE_MOCK) return mockPowerUsage(filters.organization_id);
  const { data } = await api.get<PowerUsageReport>('/api/ecostruxure/reports/power-usage', { params: filters });
  return data;
}

// ── Sync ──────────────────────────────────────────────────────────────────────
export async function fetchSyncStatus(): Promise<SyncStatusResponse> {
  if (USE_MOCK) return mockSyncStatus;
  const { data } = await api.get<SyncStatusResponse>('/api/ecostruxure/sync/status');
  return data;
}

export async function triggerBootstrap(): Promise<{ status: string }> {
  if (USE_MOCK) return { status: 'bootstrap_started' };
  const { data } = await api.post<{ status: string }>('/api/ecostruxure/sync/bootstrap');
  return data;
}

export async function triggerIncrementalSync(org_id: string): Promise<{ status: string }> {
  if (USE_MOCK) return { status: 'incremental_sync_started' };
  const { data } = await api.post<{ status: string }>(`/api/ecostruxure/sync/incremental/${org_id}`);
  return data;
}
