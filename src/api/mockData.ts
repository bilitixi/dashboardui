import {
  Organization, Device, PagedResponse, Alarm,
  AlarmsSummaryReport, DeviceHealthReport, PowerUsageReport,
  SyncStatusResponse,
} from './types';

const now = new Date().toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

export const mockOrganizations: Organization[] = [
  { id: 'org-1', label: 'Auckland Villages', address: '1 Queen St, Auckland', inventory_object_type: 'organization', updated_at: now },
  { id: 'org-2', label: 'Highlands Region', address: '5 Highland Rd, Hamilton', inventory_object_type: 'organization', updated_at: now },
  { id: 'org-3', label: 'Hibiscus Coast', address: '12 Coast Ave, Whangaparaoa', inventory_object_type: 'organization', updated_at: now },
];

export const mockDevices: Device[] = [
  { id: 'd-001', organization_id: 'org-1', location_id: 'loc-1', parent_id: null, label: 'UPS-UNIT-42', inventory_object_type: 'device', model_name: 'APC Smart-UPS AP9620RM', device_note: null, serial_number: 'SN-10001', hostname: 'ups-unit-42', firmware_version: '1.4.2', hardware_version: '2.0', part_number: 'AP9620RM', manufacturer: 'APC', ipv4_addresses: ['192.168.1.101'], ipv6_addresses: [], mac_addresses: ['00:1A:2B:3C:4D:5E'], gateway_ids: [], updated_at: hoursAgo(1) },
  { id: 'd-002', organization_id: 'org-1', location_id: 'loc-1', parent_id: null, label: 'UPS-UNIT-07', inventory_object_type: 'device', model_name: 'APC Smart-UPS 3000', device_note: 'Server room primary', serial_number: 'SN-10002', hostname: 'ups-unit-07', firmware_version: '1.4.0', hardware_version: '2.0', part_number: 'SU3000', manufacturer: 'APC', ipv4_addresses: ['192.168.1.102'], ipv6_addresses: [], mac_addresses: ['00:1A:2B:3C:4D:5F'], gateway_ids: [], updated_at: hoursAgo(2) },
  { id: 'd-003', organization_id: 'org-1', location_id: 'loc-2', parent_id: null, label: 'UPS-UNIT-15', inventory_object_type: 'device', model_name: 'APC Smart-UPS AP9630', device_note: null, serial_number: 'SN-10003', hostname: 'ups-unit-15', firmware_version: '1.3.9', hardware_version: '1.5', part_number: 'AP9630', manufacturer: 'APC', ipv4_addresses: ['192.168.1.103'], ipv6_addresses: [], mac_addresses: ['00:1A:2B:3C:4D:60'], gateway_ids: [], updated_at: hoursAgo(3) },
  { id: 'd-004', organization_id: 'org-2', location_id: 'loc-3', parent_id: null, label: 'UPS-UNIT-23', inventory_object_type: 'device', model_name: 'APC Smart-UPS 1500', device_note: 'Network closet', serial_number: 'SN-20001', hostname: 'ups-unit-23', firmware_version: '1.4.1', hardware_version: '2.0', part_number: 'SU1500', manufacturer: 'APC', ipv4_addresses: ['10.0.1.50'], ipv6_addresses: [], mac_addresses: ['00:AA:BB:CC:DD:01'], gateway_ids: [], updated_at: hoursAgo(1) },
  { id: 'd-005', organization_id: 'org-2', location_id: 'loc-3', parent_id: null, label: 'UPS-UNIT-31', inventory_object_type: 'device', model_name: 'APC Smart-UPS AP9620RM', device_note: null, serial_number: 'SN-20002', hostname: 'ups-unit-31', firmware_version: '1.4.2', hardware_version: '2.0', part_number: 'AP9620RM', manufacturer: 'APC', ipv4_addresses: ['10.0.1.51'], ipv6_addresses: [], mac_addresses: ['00:AA:BB:CC:DD:02'], gateway_ids: [], updated_at: hoursAgo(4) },
  { id: 'd-006', organization_id: 'org-3', location_id: 'loc-4', parent_id: null, label: 'UPS-UNIT-55', inventory_object_type: 'device', model_name: 'APC Smart-UPS 3000', device_note: null, serial_number: 'SN-30001', hostname: 'ups-unit-55', firmware_version: '1.4.2', hardware_version: '2.0', part_number: 'SU3000', manufacturer: 'APC', ipv4_addresses: ['172.16.0.10'], ipv6_addresses: [], mac_addresses: ['00:FF:EE:DD:CC:01'], gateway_ids: [], updated_at: hoursAgo(2) },
  { id: 'd-007', organization_id: 'org-3', location_id: 'loc-4', parent_id: null, label: 'UPS-UNIT-68', inventory_object_type: 'device', model_name: 'APC Smart-UPS 1500', device_note: 'Legacy unit', serial_number: 'SN-30002', hostname: 'ups-unit-68', firmware_version: '1.3.8', hardware_version: '1.5', part_number: 'SU1500', manufacturer: 'APC', ipv4_addresses: ['172.16.0.11'], ipv6_addresses: [], mac_addresses: ['00:FF:EE:DD:CC:02'], gateway_ids: [], updated_at: hoursAgo(6) },
  { id: 'd-008', organization_id: 'org-1', location_id: 'loc-2', parent_id: null, label: 'UPS-UNIT-74', inventory_object_type: 'device', model_name: 'APC Smart-UPS AP9630', device_note: null, serial_number: 'SN-10004', hostname: 'ups-unit-74', firmware_version: '1.4.2', hardware_version: '2.0', part_number: 'AP9630', manufacturer: 'APC', ipv4_addresses: ['192.168.1.104'], ipv6_addresses: [], mac_addresses: ['00:1A:2B:3C:4D:61'], gateway_ids: [], updated_at: hoursAgo(1) },
];

export const mockDevicesPage = (orgId?: string, limit = 50, offset = 0): PagedResponse<Device> => {
  const filtered = orgId ? mockDevices.filter(d => d.organization_id === orgId) : mockDevices;
  return { items: filtered.slice(offset, offset + limit), total: filtered.length, limit, offset };
};

export const mockAlarms: Alarm[] = [
  { id: 'a-001', device_id: 'd-001', label: 'Battery Low', message: 'Battery charge below 20%', severity: 'CRITICAL', activated_time: hoursAgo(2), cleared_time: null, alarm_reactivation_count: 2, muted_when_processed: false, updated_at: hoursAgo(2) },
  { id: 'a-002', device_id: 'd-004', label: 'High Load', message: 'Output load exceeded 80%', severity: 'CRITICAL', activated_time: hoursAgo(5), cleared_time: null, alarm_reactivation_count: 0, muted_when_processed: false, updated_at: hoursAgo(5) },
  { id: 'a-003', device_id: 'd-003', label: 'Battery Aging', message: 'Battery age exceeds recommended service life', severity: 'WARNING', activated_time: hoursAgo(12), cleared_time: null, alarm_reactivation_count: 1, muted_when_processed: false, updated_at: hoursAgo(12) },
  { id: 'a-004', device_id: 'd-007', label: 'Firmware Outdated', message: 'Firmware version 1.3.8 is outdated', severity: 'WARNING', activated_time: hoursAgo(24), cleared_time: null, alarm_reactivation_count: 0, muted_when_processed: true, updated_at: hoursAgo(24) },
  { id: 'a-005', device_id: 'd-002', label: 'Input Voltage High', message: 'Input voltage above threshold', severity: 'WARNING', activated_time: hoursAgo(3), cleared_time: hoursAgo(1), alarm_reactivation_count: 0, muted_when_processed: false, updated_at: hoursAgo(1) },
  { id: 'a-006', device_id: 'd-005', label: 'Temperature Warning', message: 'Internal temperature above 35°C', severity: 'INFO', activated_time: hoursAgo(8), cleared_time: hoursAgo(6), alarm_reactivation_count: 0, muted_when_processed: false, updated_at: hoursAgo(6) },
  { id: 'a-007', device_id: 'd-006', label: 'Self-Test Passed', message: 'Scheduled self-test completed successfully', severity: 'INFO', activated_time: hoursAgo(18), cleared_time: hoursAgo(18), alarm_reactivation_count: 0, muted_when_processed: false, updated_at: hoursAgo(18) },
];

export const mockAlarmsSummary = (orgId: string): AlarmsSummaryReport => ({
  organization_id: orgId,
  timeframe_hours: 24,
  summary: [
    { severity: 'CRITICAL', total: 10, active: 2 },
    { severity: 'WARNING',  total: 25, active: 5 },
    { severity: 'INFO',     total: 50, active: 0 },
  ],
});

export const mockDeviceHealth = (orgId: string): DeviceHealthReport => ({
  organization_id: orgId,
  total_devices: mockDevices.filter(d => !orgId || d.organization_id === orgId).length || mockDevices.length,
  active_alarms: mockAlarms.filter(a => a.cleared_time === null).length,
});

export const mockPowerUsage = (orgId: string): PowerUsageReport => ({
  organization_id: orgId,
  timeframe_hours: 24,
  sensors: [
    { name: 'Output Power',   unit: 'W',   avg: 1250.5, max: 2000.0, min: 800.0 },
    { name: 'Input Voltage',  unit: 'V',   avg: 230.2,  max: 240.0,  min: 220.0 },
    { name: 'Battery Charge', unit: '%',   avg: 87.4,   max: 100.0,  min: 61.0  },
    { name: 'Load',           unit: '%',   avg: 45.1,   max: 82.0,   min: 28.0  },
    { name: 'Temperature',    unit: '°C',  avg: 28.3,   max: 37.0,   min: 22.0  },
  ],
});

export const mockSyncStatus: SyncStatusResponse = {
  organizations: mockOrganizations.map((org, i) => ({
    organization_id: org.id,
    inventory_offset: 150 + i * 50,
    alarm_offset: 75 + i * 20,
    sensor_offset: 30 + i * 10,
    last_sync_time: hoursAgo(i + 1),
    last_sync_status: i === 1 ? 'FAILED' : 'SUCCESS',
    last_error_message: i === 1 ? 'Rate limit exceeded, retry in 60s' : null,
  })),
};
