export interface Organization {
  id: string;
  name: string;
  deviceCount: number;
}

export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  status: 'online' | 'offline' | 'warning' | 'charging';
  batteryHealth: number;
  batteryLevel: number;
  lastSeen: string;
  organizationId: string;
  model: string;
  firmwareVersion: string;
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

export interface Report {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  downloadUrl: string;
}

export interface FleetSummary {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  warningDevices: number;
  avgBatteryHealth: number;
  activeAlarms: number;
}

export interface BatteryHealthBucket {
  range: string;
  count: number;
}
