import { Device, Alarm, Organization, FleetSummary, BatteryHealthBucket } from './types';

export const mockOrganizations: Organization[] = [
  { id: 'org-1', name: 'Acme Corp', deviceCount: 42 },
  { id: 'org-2', name: 'Beta Industries', deviceCount: 27 },
  { id: 'org-3', name: 'Gamma Solutions', deviceCount: 15 },
];

export const mockDevices: Device[] = [
  { id: 'd-001', name: 'Unit Alpha-01', serialNumber: 'SN-10001', status: 'online', batteryHealth: 95, batteryLevel: 82, lastSeen: new Date().toISOString(), organizationId: 'org-1', model: 'ProPack X200', firmwareVersion: '2.4.1' },
  { id: 'd-002', name: 'Unit Alpha-02', serialNumber: 'SN-10002', status: 'warning', batteryHealth: 71, batteryLevel: 45, lastSeen: new Date(Date.now() - 300000).toISOString(), organizationId: 'org-1', model: 'ProPack X200', firmwareVersion: '2.4.1' },
  { id: 'd-003', name: 'Unit Beta-01', serialNumber: 'SN-20001', status: 'offline', batteryHealth: 88, batteryLevel: 12, lastSeen: new Date(Date.now() - 3600000).toISOString(), organizationId: 'org-2', model: 'ProPack X100', firmwareVersion: '2.3.9' },
  { id: 'd-004', name: 'Unit Beta-02', serialNumber: 'SN-20002', status: 'charging', batteryHealth: 92, batteryLevel: 67, lastSeen: new Date().toISOString(), organizationId: 'org-2', model: 'ProPack X100', firmwareVersion: '2.4.0' },
  { id: 'd-005', name: 'Unit Gamma-01', serialNumber: 'SN-30001', status: 'online', batteryHealth: 78, batteryLevel: 91, lastSeen: new Date().toISOString(), organizationId: 'org-3', model: 'ProPack X300', firmwareVersion: '2.4.1' },
  { id: 'd-006', name: 'Unit Alpha-03', serialNumber: 'SN-10003', status: 'online', batteryHealth: 55, batteryLevel: 73, lastSeen: new Date().toISOString(), organizationId: 'org-1', model: 'ProPack X200', firmwareVersion: '2.4.1' },
  { id: 'd-007', name: 'Unit Alpha-04', serialNumber: 'SN-10004', status: 'warning', batteryHealth: 62, batteryLevel: 38, lastSeen: new Date(Date.now() - 600000).toISOString(), organizationId: 'org-1', model: 'ProPack X200', firmwareVersion: '2.3.9' },
  { id: 'd-008', name: 'Unit Beta-03', serialNumber: 'SN-20003', status: 'online', batteryHealth: 99, batteryLevel: 100, lastSeen: new Date().toISOString(), organizationId: 'org-2', model: 'ProPack X100', firmwareVersion: '2.4.1' },
];

export const mockAlarms: Alarm[] = [
  { id: 'a-001', deviceId: 'd-002', deviceName: 'Unit Alpha-02', type: 'warning', message: 'Battery health below 75%', timestamp: new Date(Date.now() - 300000).toISOString(), acknowledged: false },
  { id: 'a-002', deviceId: 'd-003', deviceName: 'Unit Beta-01', type: 'critical', message: 'Device offline for over 1 hour', timestamp: new Date(Date.now() - 3600000).toISOString(), acknowledged: false },
  { id: 'a-003', deviceId: 'd-006', deviceName: 'Unit Alpha-03', type: 'warning', message: 'Battery health below 60%', timestamp: new Date(Date.now() - 900000).toISOString(), acknowledged: true },
  { id: 'a-004', deviceId: 'd-007', deviceName: 'Unit Alpha-04', type: 'warning', message: 'Battery level critically low', timestamp: new Date(Date.now() - 600000).toISOString(), acknowledged: false },
];

export const mockFleetSummary: FleetSummary = {
  totalDevices: 84,
  onlineDevices: 61,
  offlineDevices: 12,
  warningDevices: 11,
  avgBatteryHealth: 79,
  activeAlarms: 3,
};

export const mockBatteryHealthData: BatteryHealthBucket[] = [
  { range: '90-100%', count: 28 },
  { range: '80-89%', count: 19 },
  { range: '70-79%', count: 15 },
  { range: '60-69%', count: 12 },
  { range: '50-59%', count: 7 },
  { range: '<50%', count: 3 },
];
