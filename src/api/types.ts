export interface Organization {
  id: string;
  name: string;
  deviceCount: number;
}

export interface Device {
  id: string;
  name: string;
  site: string;
  model: string;
  serialNumber: string;
  assetTag: string;
  status: 'Healthy' | 'Degraded' | 'Critical' | 'Offline';
  battery: number;   // 0-100%
  load: number;      // 0-100%
  runtime: number;   // minutes
  organizationId: string;
}

export interface Alarm {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface FleetSummary {
  totalDevices: number;
  villages: number;
  healthyDevices: number;
  healthyPercent: number;
  degradedDevices: number;
  avgLoad: number;
  peakLoad: number;
  avgRuntime: number; // minutes
}

export interface BatteryHealthBucket {
  range: string;
  count: number;
  color: string;
  max: number; // for bar width calculation
}

export interface MaintenanceItem {
  label: string;
  site: string;
  timeframe: string;
  color: string;
}
