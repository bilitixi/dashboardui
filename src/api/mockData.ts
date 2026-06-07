import type { Organization, Device, Alarm, AlarmsSummary, DeviceHealth, PowerUsage } from './types';

export const mockOrganizations: Organization[] = [
  { id: 'org-1', name: 'Auckland Villages', slug: 'auckland-villages' },
  { id: 'org-2', name: 'Wellington Network', slug: 'wellington-network' },
  { id: 'org-3', name: 'Christchurch Grid', slug: 'christchurch-grid' },
];

export const mockDevices: Device[] = [
  {
    id: 'dev-1',
    organization_id: 'org-1',
    label: 'UPS-UNIT-42',
    hostname: '192.168.1.42',
    model: 'APC Smart-UPS AP9620RM',
    status: 'healthy',
    asset_tag: 'AKL-042',
    site: 'Auckland-East',
    battery_percentage: 97,
    load_percentage: 34,
    runtime_minutes: 180,
  },
  {
    id: 'dev-2',
    organization_id: 'org-1',
    label: 'UPS-UNIT-07',
    hostname: '192.168.1.7',
    model: 'APC Smart-UPS 3000',
    status: 'healthy',
    asset_tag: 'AKL-007',
    site: 'Auckland-Central',
    battery_percentage: 96,
    load_percentage: 45,
    runtime_minutes: 150,
  },
  {
    id: 'dev-3',
    organization_id: 'org-1',
    label: 'UPS-UNIT-15',
    hostname: '192.168.1.15',
    model: 'APC Back-UPS Pro 1500',
    status: 'degraded',
    asset_tag: 'AKL-015',
    site: 'Auckland-North',
    battery_percentage: 83,
    load_percentage: 62,
    runtime_minutes: 95,
  },
  {
    id: 'dev-4',
    organization_id: 'org-1',
    label: 'UPS-UNIT-28',
    hostname: '192.168.2.28',
    model: 'APC Smart-UPS AP9620RM',
    status: 'healthy',
    asset_tag: 'WLG-028',
    site: 'Auckland-South',
    battery_percentage: 99,
    load_percentage: 28,
    runtime_minutes: 240,
  },
  {
    id: 'dev-5',
    organization_id: 'org-2',
    label: 'UPS-UNIT-53',
    hostname: '192.168.2.53',
    model: 'APC Smart-UPS 5000',
    status: 'critical',
    asset_tag: 'WLG-053',
    site: 'Wellington-CBD',
    battery_percentage: 71,
    load_percentage: 88,
    runtime_minutes: 40,
  },
  {
    id: 'dev-6',
    organization_id: 'org-2',
    label: 'UPS-UNIT-61',
    hostname: '192.168.2.61',
    model: 'APC Smart-UPS AP9620RM',
    status: 'healthy',
    asset_tag: 'WLG-061',
    site: 'Wellington-North',
    battery_percentage: 93,
    load_percentage: 41,
    runtime_minutes: 130,
  },
  {
    id: 'dev-7',
    organization_id: 'org-2',
    label: 'UPS-UNIT-34',
    hostname: '192.168.3.34',
    model: 'APC Back-UPS Pro 1000',
    status: 'degraded',
    asset_tag: 'WLG-034',
    site: 'Wellington-South',
    battery_percentage: 86,
    load_percentage: 55,
    runtime_minutes: 110,
  },
  {
    id: 'dev-8',
    organization_id: 'org-3',
    label: 'UPS-UNIT-19',
    hostname: '192.168.3.19',
    model: 'APC Smart-UPS 3000',
    status: 'healthy',
    asset_tag: 'CHC-019',
    site: 'Christchurch-East',
    battery_percentage: 95,
    load_percentage: 38,
    runtime_minutes: 165,
  },
  {
    id: 'dev-9',
    organization_id: 'org-3',
    label: 'UPS-UNIT-77',
    hostname: '192.168.3.77',
    model: 'APC Smart-UPS AP9620RM',
    status: 'healthy',
    asset_tag: 'CHC-077',
    site: 'Christchurch-CBD',
    battery_percentage: 98,
    load_percentage: 22,
    runtime_minutes: 210,
  },
  {
    id: 'dev-10',
    organization_id: 'org-3',
    label: 'UPS-UNIT-88',
    hostname: '192.168.3.88',
    model: 'APC Back-UPS Pro 1500',
    status: 'degraded',
    asset_tag: 'CHC-088',
    site: 'Christchurch-West',
    battery_percentage: 78,
    load_percentage: 67,
    runtime_minutes: 75,
  },
];

export const mockAlarms: Alarm[] = [
  {
    id: 'alm-1',
    organization_id: 'org-2',
    device_id: 'dev-5',
    severity: 'critical',
    status: 'active',
    message: 'Battery level critically low (<75%)',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'alm-2',
    organization_id: 'org-1',
    device_id: 'dev-3',
    severity: 'warning',
    status: 'active',
    message: 'High load detected (>60%)',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'alm-3',
    organization_id: 'org-3',
    device_id: 'dev-10',
    severity: 'warning',
    status: 'active',
    message: 'Battery degraded (<80%)',
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
];

export function getMockAlarmsSummary(org_id?: string): AlarmsSummary {
  const alarms = org_id ? mockAlarms.filter((a) => a.organization_id === org_id) : mockAlarms;
  return {
    critical: alarms.filter((a) => a.severity === 'critical' && a.status === 'active').length,
    warning: alarms.filter((a) => a.severity === 'warning' && a.status === 'active').length,
    info: alarms.filter((a) => a.severity === 'info' && a.status === 'active').length,
    total: alarms.filter((a) => a.status === 'active').length,
  };
}

export function getMockDeviceHealth(org_id?: string): DeviceHealth {
  const devices = org_id ? mockDevices.filter((d) => d.organization_id === org_id) : mockDevices;
  return {
    total_devices: devices.length,
    active_alarms: mockAlarms.filter(
      (a) => a.status === 'active' && (!org_id || a.organization_id === org_id)
    ).length,
  };
}

export function getMockPowerUsage(org_id?: string): PowerUsage {
  const devices = org_id ? mockDevices.filter((d) => d.organization_id === org_id) : mockDevices;
  const loads = devices.map((d) => d.load_percentage ?? 0);
  const runtimes = devices.map((d) => d.runtime_minutes ?? 0);
  const avg_load = Math.round(loads.reduce((a, b) => a + b, 0) / loads.length);
  const peak_load = Math.max(...loads);
  const avg_runtime = Math.round(runtimes.reduce((a, b) => a + b, 0) / runtimes.length);
  return { avg_load, peak_load, avg_runtime };
}
