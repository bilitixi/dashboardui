// ── Exact shapes returned by the FastAPI backend ──────────────────────────────

export interface Organization {
  id: string;
  label: string;
  address: string | null;
  inventory_object_type: string;
  updated_at: string;
}

export interface Device {
  id: string;
  organization_id: string;
  location_id: string | null;
  parent_id: string | null;
  label: string;
  inventory_object_type: string;
  model_name: string | null;
  device_note: string | null;
  serial_number: string | null;
  hostname: string | null;
  firmware_version: string | null;
  hardware_version: string | null;
  part_number: string | null;
  manufacturer: string | null;
  ipv4_addresses: string[];
  ipv6_addresses: string[];
  mac_addresses: string[];
  gateway_ids: string[];
  updated_at: string;
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface Alarm {
  id: string;
  device_id: string;
  label: string | null;
  message: string | null;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  activated_time: string;
  cleared_time: string | null;
  alarm_reactivation_count: number;
  muted_when_processed: boolean;
  updated_at: string;
}

export interface Sensor {
  id: string;
  device_id: string;
  name: string;
  unit: string | null;
  updated_at: string;
}

export interface Measurement {
  id: number;
  sensor_id: string;
  numeric_value: number | null;
  string_value: string | null;
  timestamp: string;
  offset: string | null;
  created_at: string;
}

// ── Report response shapes ────────────────────────────────────────────────────

export interface AlarmSeveritySummary {
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  total: number;
  active: number;
}

export interface AlarmsSummaryReport {
  organization_id: string;
  timeframe_hours: number;
  summary: AlarmSeveritySummary[];
}

export interface DeviceHealthReport {
  organization_id: string;
  total_devices: number;
  active_alarms: number;
}

export interface PowerSensorStat {
  name: string;
  unit: string;
  avg: number;
  max: number;
  min: number;
}

export interface PowerUsageReport {
  organization_id: string;
  timeframe_hours: number;
  sensors: PowerSensorStat[];
}

// ── Sync status ───────────────────────────────────────────────────────────────

export interface OrgSyncStatus {
  organization_id: string;
  inventory_offset: number;
  alarm_offset: number;
  sensor_offset: number;
  last_sync_time: string | null;
  last_sync_status: 'SUCCESS' | 'FAILED' | 'PENDING';
  last_error_message: string | null;
}

export interface SyncStatusResponse {
  organizations: OrgSyncStatus[];
}
