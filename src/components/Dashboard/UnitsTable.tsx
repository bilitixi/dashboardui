import React, { useState } from 'react';
import { Download, Upload, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useDevices } from '../../hooks/useDevices';
import { useLocations } from '../../hooks/useLocations';
import { Device } from '../../api/types';

interface Props { orgId: string; searchQuery?: string; }

const PAGE_SIZE = 10;

export function UnitsTable({ orgId, searchQuery = '' }: Props) {
  const [page, setPage] = useState(0);
  const [locationFilter, setLocationFilter] = useState('');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const { data: locationsData = [] } = useLocations(orgId);
  const { data, isLoading } = useDevices({
    organization_id: orgId,
    location_id: locationFilter || undefined,
    limit: 200,
  });

  // Build location label lookup
  const locationMap = new Map(locationsData.map(l => [l.id, l.label]));
  const selectedLocationLabel = locationFilter ? (locationMap.get(locationFilter) ?? locationFilter) : 'All Locations';

  const allDevices: Device[] = data?.items ?? [];
  const filtered = allDevices.filter(d => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.label.toLowerCase().includes(q) ||
      (d.hostname ?? '').toLowerCase().includes(q) ||
      (d.serial_number ?? '').toLowerCase().includes(q) ||
      (d.manufacturer ?? '').toLowerCase().includes(q) ||
      (d.model_name ?? '').toLowerCase().includes(q) ||
      d.ipv4_addresses.some(ip => ip.includes(q))
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const displayed = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleLocationChange = (locId: string) => {
    setLocationFilter(locId);
    setLocationDropdownOpen(false);
    setPage(0);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
            <rect x="2" y="7" width="20" height="15" rx="2" />
            <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
          </svg>
          <span className="text-white font-semibold">Units</span>
          <span style={{ color: '#64748b' }} className="text-sm">
            {filtered.length} of {data?.total ?? 0}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Location filter */}
          <div className="relative">
            <button
              onClick={() => setLocationDropdownOpen(v => !v)}
              style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45', color: locationFilter ? '#60a5fa' : '#94a3b8' }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:border-slate-500 transition-colors">
              {selectedLocationLabel}
              <ChevronDown size={13} style={{ color: '#64748b' }} />
            </button>
            {locationDropdownOpen && (
              <div style={{ backgroundColor: '#131d2e', border: '1px solid #1e2d45' }}
                className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-2xl z-50 overflow-hidden">
                <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
                <button
                  style={{ color: !locationFilter ? '#60a5fa' : '#cbd5e1', borderBottom: '1px solid #1e2d45' }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-500/10 transition-colors"
                  onClick={() => handleLocationChange('')}>
                  All Locations
                </button>
                {locationsData.map(loc => (
                  <button key={loc.id}
                    style={{ color: locationFilter === loc.id ? '#60a5fa' : '#cbd5e1' }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-500/10 transition-colors"
                    onClick={() => handleLocationChange(loc.id)}>
                    <div>{loc.label}</div>
                    {loc.type && <div style={{ color: '#64748b' }} className="text-xs capitalize">{loc.type}</div>}
                  </button>
                ))}
                </div>
              </div>
            )}
          </div>

          <button style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45', color: '#cbd5e1' }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:border-slate-500 transition-colors">
            <Upload size={13} /> Import
          </button>
          <button style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45', color: '#cbd5e1' }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:border-slate-500 transition-colors">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45' }} className="rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                {['UNIT', 'LOCATION', 'MODEL', 'MANUFACTURER', 'SERIAL NO.', 'HOSTNAME', 'IPv4', 'FIRMWARE', 'UPDATED'].map(col => (
                  <th key={col} style={{ color: '#64748b' }}
                    className="text-left text-xs font-medium uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1e2d4520' }}>
                      <td colSpan={9} className="px-4 py-3">
                        <div style={{ backgroundColor: '#253047' }} className="h-4 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : displayed.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center" style={{ color: '#64748b' }}>
                        No devices found
                      </td>
                    </tr>
                  )
                : displayed.map(device => (
                    <tr key={device.id} style={{ borderBottom: '1px solid #1e2d4540' }}
                      className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{device.label}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {device.location_id
                          ? <span style={{ color: '#94a3b8' }}>{locationMap.get(device.location_id) ?? device.location_id}</span>
                          : <span style={{ color: '#3a4a5e' }}>—</span>
                        }
                      </td>
                      <td style={{ color: '#94a3b8' }} className="px-4 py-3 whitespace-nowrap">
                        {device.model_name ?? '—'}
                      </td>
                      <td style={{ color: '#94a3b8' }} className="px-4 py-3 whitespace-nowrap">
                        {device.manufacturer ?? '—'}
                      </td>
                      <td style={{ color: '#64748b' }} className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                        {device.serial_number ?? '—'}
                      </td>
                      <td style={{ color: '#64748b' }} className="px-4 py-3 font-mono text-xs">
                        {device.hostname ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        {device.ipv4_addresses.length > 0
                          ? device.ipv4_addresses.map(ip => (
                              <span key={ip} style={{ backgroundColor: '#1e3a5f', color: '#93c5fd' }}
                                className="inline-block text-xs font-mono px-1.5 py-0.5 rounded mr-1">
                                {ip}
                              </span>
                            ))
                          : <span style={{ color: '#64748b' }}>—</span>}
                      </td>
                      <td style={{ color: '#64748b' }} className="px-4 py-3 text-xs font-mono whitespace-nowrap">
                        {device.firmware_version ?? '—'}
                      </td>
                      <td style={{ color: '#64748b' }} className="px-4 py-3 text-xs whitespace-nowrap">
                        {new Date(device.updated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ borderTop: '1px solid #1e2d45' }}
            className="px-4 py-3 flex items-center justify-between">
            <span style={{ color: '#64748b' }} className="text-xs">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                style={{ backgroundColor: '#0f1520', border: '1px solid #1e2d45', color: page === 0 ? '#3a4a5e' : '#cbd5e1' }}
                className="p-1.5 rounded-lg disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                style={{ backgroundColor: '#0f1520', border: '1px solid #1e2d45', color: page >= totalPages - 1 ? '#3a4a5e' : '#cbd5e1' }}
                className="p-1.5 rounded-lg disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
