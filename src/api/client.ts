import axios from 'axios';
import type {
  Organization,
  Device,
  Alarm,
  Sensor,
  Measurement,
  AlarmsSummary,
  DeviceHealth,
  PowerUsage,
  SyncStatus,
  PaginatedResponse,
} from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const api = {
  getOrganizations: (): Promise<Organization[]> =>
    apiClient.get('/api/organizations').then((r) => r.data),

  getDevices: (params?: {
    organization_id?: string;
    location_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<Device>> =>
    apiClient.get('/api/devices', { params }).then((r) => r.data),

  getAlarms: (params?: {
    organization_id?: string;
    severity?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<Alarm>> =>
    apiClient.get('/api/alarms', { params }).then((r) => r.data),

  getSensors: (device_id: string): Promise<Sensor[]> =>
    apiClient.get(`/api/sensors/${device_id}`).then((r) => r.data),

  getMeasurements: (
    sensor_id: string,
    params?: { start_time?: string; end_time?: string; limit?: number; offset?: number }
  ): Promise<PaginatedResponse<Measurement>> =>
    apiClient.get(`/api/measurements/${sensor_id}`, { params }).then((r) => r.data),

  getAlarmsSummary: (params?: {
    organization_id?: string;
    timeframe_hours?: number;
  }): Promise<AlarmsSummary> =>
    apiClient.get('/api/reports/alarms-summary', { params }).then((r) => r.data),

  getDeviceHealth: (params?: { organization_id?: string }): Promise<DeviceHealth> =>
    apiClient.get('/api/reports/device-health', { params }).then((r) => r.data),

  getPowerUsage: (params?: {
    organization_id?: string;
    timeframe_hours?: number;
  }): Promise<PowerUsage> =>
    apiClient.get('/api/reports/power-usage', { params }).then((r) => r.data),

  getSyncStatus: (): Promise<SyncStatus[]> =>
    apiClient.get('/api/sync/status').then((r) => r.data),

  triggerBootstrap: (): Promise<void> =>
    apiClient.post('/api/sync/bootstrap').then((r) => r.data),

  triggerIncremental: (org_id: string): Promise<void> =>
    apiClient.post(`/api/sync/incremental/${org_id}`).then((r) => r.data),
};
