import React from 'react';
import { Download, Upload, List } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import type { Device } from '../../api/types';

interface UnitsTableProps {
  devices: Device[];
  total: number;
  searchQuery: string;
}

export const UnitsTable: React.FC<UnitsTableProps> = ({ devices, total, searchQuery }) => {
  const filtered = searchQuery
    ? devices.filter(
        (d) =>
          d.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (d.hostname?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          (d.site?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          (d.asset_tag?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      )
    : devices;

  const batteryBarColor = (pct?: number): string => {
    if (!pct) return 'bg-gray-500';
    if (pct >= 95) return 'bg-green-500';
    if (pct >= 90) return 'bg-green-400';
    if (pct >= 80) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  const loadBarColor = (pct?: number): string => {
    if (!pct) return 'bg-gray-500';
    if (pct >= 80) return 'bg-red-500';
    if (pct >= 60) return 'bg-yellow-400';
    return 'bg-blue-400';
  };

  return (
    <div className="bg-[#1a2235] border border-[#2a3548] rounded-xl overflow-hidden">
      {/* Table header bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a3548]">
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold text-sm">Units</span>
          <span className="text-[#94a3b8] text-xs bg-[#0f1520] border border-[#2a3548] rounded-full px-2.5 py-0.5">
            {filtered.length} of {total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[#94a3b8] hover:text-white text-xs px-3 py-1.5 rounded-lg border border-[#2a3548] hover:border-[#3a4558] transition-colors bg-[#0f1520]">
            <Upload size={12} />
            Import
          </button>
          <button className="flex items-center gap-1.5 text-[#94a3b8] hover:text-white text-xs px-3 py-1.5 rounded-lg border border-[#2a3548] hover:border-[#3a4558] transition-colors bg-[#0f1520]">
            <Download size={12} />
            Export
          </button>
          <button className="flex items-center gap-1.5 text-[#94a3b8] hover:text-white text-xs px-3 py-1.5 rounded-lg border border-[#2a3548] hover:border-[#3a4558] transition-colors bg-[#0f1520]">
            <List size={12} />
            Show all
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a3548]">
              {['UNIT', 'SITE', 'MODEL', 'BATTERY', 'LOAD', 'RUNTIME', 'STATUS', 'ASSET TAG'].map((h) => (
                <th
                  key={h}
                  className="text-left text-[#94a3b8] text-[10px] font-medium uppercase tracking-wider px-5 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-[#94a3b8] text-sm py-10">
                  No devices found
                </td>
              </tr>
            ) : (
              filtered.map((device, idx) => (
                <tr
                  key={device.id}
                  className={`border-b border-[#2a3548] hover:bg-[#1e2a3e] transition-colors cursor-pointer ${
                    idx % 2 === 0 ? '' : 'bg-[#1a2235]/50'
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="text-white text-xs font-medium">{device.label}</div>
                    {device.hostname && (
                      <div className="text-[#94a3b8] text-[10px] mt-0.5 font-mono">{device.hostname}</div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[#94a3b8] text-xs">{device.site ?? '—'}</td>
                  <td className="px-5 py-3.5 text-[#94a3b8] text-xs max-w-[180px] truncate">
                    {device.model ?? '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <ProgressBar
                        value={device.battery_percentage ?? 0}
                        colorClass={batteryBarColor(device.battery_percentage)}
                        height="h-1.5"
                      />
                      <span className="text-xs text-white w-8 shrink-0">
                        {device.battery_percentage ?? 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <ProgressBar
                        value={device.load_percentage ?? 0}
                        colorClass={loadBarColor(device.load_percentage)}
                        height="h-1.5"
                      />
                      <span className="text-xs text-white w-8 shrink-0">
                        {device.load_percentage ?? 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#94a3b8] whitespace-nowrap">
                    {device.runtime_minutes != null ? `${device.runtime_minutes}m` : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge status={device.status} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#94a3b8] font-mono">
                    {device.asset_tag ?? '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
