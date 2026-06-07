export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface Device {
  id: string;
  organization_id: string;
  location_id?: string;
  label: string;
  hostname?: string;
  model?: string;
  firmware?: string;
  status: 'healthy' | 'degraded' | 'critical' | 'offline';
  asset_tag?: string;
  site?: string;
  battery_percentage?: number;
  load_percentage?: number;
  runtime_minutes?: number;
}

export interface Alarm {
  id: string;
  organization_id: string;
  device_id: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'resolved';
  message: string;
  created_at: string;
}

export interface Sensor {
  id: string;
  device_id: string;
  name: string;
  type: string;
  unit?: string;
}

export interface Measurement {
  id: string;
  sensor_id: string;
  value: number;
  timestamp: string;
}

export interface AlarmsSummary {
  critical: number;
  warning: number;
  info: number;
  total: number;
}

export interface DeviceHealth {
  total_devices: number;
  active_alarms: number;
}

export interface PowerUsage {
  avg_load: number;
  peak_load: number;
  avg_runtime: number;
}

export interface SyncStatus {
  organization_id: string;
  last_sync?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
