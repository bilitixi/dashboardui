import { Device, Alarm, Organization, FleetSummary, BatteryHealthBucket, MaintenanceItem } from './types';

export const mockOrganizations: Organization[] = [
  { id: 'org-1', name: 'All Villages', deviceCount: 93 },
  { id: 'org-2', name: 'Auckland-East', deviceCount: 28 },
  { id: 'org-3', name: 'Highlands', deviceCount: 22 },
  { id: 'org-4', name: 'Hibiscus Coast', deviceCount: 18 },
  { id: 'org-5', name: 'Northshore', deviceCount: 15 },
  { id: 'org-6', name: 'Westgate', deviceCount: 10 },
];

export const mockDevices: Device[] = [
  { id: 'd-001', name: 'UPS-UNIT-42', site: 'Auckland-East', model: 'APC Smart-UPS AP9620RM', serialNumber: 'SN-10001', assetTag: 'AE-UPS-0001', status: 'Degraded', battery: 91, load: 38, runtime: 34, organizationId: 'org-2' },
  { id: 'd-002', name: 'UPS-UNIT-07', site: 'Auckland-East', model: 'APC Smart-UPS 3000', serialNumber: 'SN-10002', assetTag: 'AE-UPS-0007', status: 'Healthy', battery: 98, load: 42, runtime: 55, organizationId: 'org-2' },
  { id: 'd-003', name: 'UPS-UNIT-15', site: 'Highlands', model: 'APC Smart-UPS AP9630', serialNumber: 'SN-20001', assetTag: 'HL-UPS-0015', status: 'Healthy', battery: 96, load: 51, runtime: 48, organizationId: 'org-3' },
  { id: 'd-004', name: 'UPS-UNIT-23', site: 'Highlands', model: 'APC Smart-UPS 1500', serialNumber: 'SN-20002', assetTag: 'HL-UPS-0023', status: 'Degraded', battery: 77, load: 66, runtime: 22, organizationId: 'org-3' },
  { id: 'd-005', name: 'UPS-UNIT-31', site: 'Hibiscus Coast', model: 'APC Smart-UPS AP9620RM', serialNumber: 'SN-30001', assetTag: 'HC-UPS-0031', status: 'Healthy', battery: 99, load: 35, runtime: 62, organizationId: 'org-4' },
  { id: 'd-006', name: 'UPS-UNIT-55', site: 'Hibiscus Coast', model: 'APC Smart-UPS 3000', serialNumber: 'SN-30002', assetTag: 'HC-UPS-0055', status: 'Healthy', battery: 95, load: 44, runtime: 50, organizationId: 'org-4' },
  { id: 'd-007', name: 'UPS-UNIT-68', site: 'Northshore', model: 'APC Smart-UPS AP9630', serialNumber: 'SN-40001', assetTag: 'NS-UPS-0068', status: 'Healthy', battery: 93, load: 29, runtime: 71, organizationId: 'org-5' },
  { id: 'd-008', name: 'UPS-UNIT-74', site: 'Westgate', model: 'APC Smart-UPS 1500', serialNumber: 'SN-50001', assetTag: 'WG-UPS-0074', status: 'Critical', battery: 61, load: 82, runtime: 11, organizationId: 'org-6' },
  { id: 'd-009', name: 'UPS-UNIT-12', site: 'Auckland-East', model: 'APC Smart-UPS 3000', serialNumber: 'SN-10003', assetTag: 'AE-UPS-0012', status: 'Healthy', battery: 97, load: 40, runtime: 58, organizationId: 'org-2' },
  { id: 'd-010', name: 'UPS-UNIT-88', site: 'Northshore', model: 'APC Smart-UPS AP9620RM', serialNumber: 'SN-40002', assetTag: 'NS-UPS-0088', status: 'Healthy', battery: 100, load: 33, runtime: 67, organizationId: 'org-5' },
];

export const mockAlarms: Alarm[] = [
  { id: 'a-001', deviceId: 'd-001', deviceName: 'UPS-UNIT-42', type: 'warning', message: 'Battery health below 95%', timestamp: new Date(Date.now() - 300000).toISOString(), acknowledged: false },
  { id: 'a-002', deviceId: 'd-004', deviceName: 'UPS-UNIT-23', type: 'warning', message: 'High load detected', timestamp: new Date(Date.now() - 3600000).toISOString(), acknowledged: false },
  { id: 'a-003', deviceId: 'd-008', deviceName: 'UPS-UNIT-74', type: 'critical', message: 'Battery critically low', timestamp: new Date(Date.now() - 600000).toISOString(), acknowledged: false },
];

export const mockFleetSummary: FleetSummary = {
  totalDevices: 93,
  villages: 37,
  healthyDevices: 87,
  healthyPercent: 94,
  degradedDevices: 6,
  avgLoad: 45,
  peakLoad: 61,
  avgRuntime: 47,
};

export const mockBatteryHealthData: BatteryHealthBucket[] = [
  { range: '95-100%', count: 58, color: '#22c55e', max: 58 },
  { range: '90-95%',  count: 29, color: '#4ade80', max: 58 },
  { range: '80-90%',  count: 4,  color: '#f59e0b', max: 58 },
  { range: '<80% degraded', count: 2, color: '#ef4444', max: 58 },
];

export const mockMaintenanceItems: MaintenanceItem[] = [
  { label: 'Battery replacement, 6 Smart-UPS units', site: 'Auckland-East, Highlands', timeframe: '~3 months', color: '#f59e0b' },
  { label: 'UPS end-of-life refresh, 3 units', site: 'Hibiscus Coast', timeframe: '~5 months', color: '#f59e0b' },
  { label: 'Firmware update, fleet wide', site: 'All villages', timeframe: '~6 months', color: '#3b82f6' },
];
