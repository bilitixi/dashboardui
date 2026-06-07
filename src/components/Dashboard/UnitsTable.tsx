import React, { useState } from 'react';
import { useDevices } from '../../hooks/useDevices';
import { Device } from '../../api/types';
import { Upload, Download } from 'lucide-react';

interface UnitsTableProps {
  organizationId?: string;
  searchQuery?: string;
}

function StatusBadge({ status }: { status: Device['status'] }) {
  const styles: Record<Device['status'], { bg: string; color: string; dot: string }> = {
    Healthy:  { bg: '#14291f', color: '#22c55e', dot: '#22c55e' },
    Degraded: { bg: '#2a1f0a', color: '#f59e0b', dot: '#f59e0b' },
    Critical: { bg: '#2a1010', color: '#ef4444', dot: '#ef4444' },
    Offline:  { bg: '#1a1a2a', color: '#64748b', dot: '#64748b' },
  };
  const s = styles[status];
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.dot}33` }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {status}
    </span>
  );
}

function BatteryBar({ value }: { value: number }) {
  const color = value >= 90 ? '#22c55e' : value >= 80 ? '#4ade80' : value >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div style={{ backgroundColor: '#253047', width: 72 }} className="rounded-full h-2 overflow-hidden">
        <div style={{ width: `${value}%`, backgroundColor: color }} className="h-full rounded-full" />
      </div>
      <span style={{ color: '#cbd5e1' }} className="text-sm">{value}%</span>
    </div>
  );
}

export function UnitsTable({ organizationId, searchQuery = '' }: UnitsTableProps) {
  const { data: devices = [], isLoading } = useDevices(organizationId);
  const [showAll, setShowAll] = useState(false);

  const filtered = devices.filter((d) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return d.name.toLowerCase().includes(q) ||
      d.site.toLowerCase().includes(q) ||
      d.model.toLowerCase().includes(q) ||
      d.assetTag.toLowerCase().includes(q);
  });

  const displayed = showAll ? filtered : filtered.slice(0, 8);

  return (
    <div style={{ backgroundColor: '#0f1520' }}>
      {/* Table header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div style={{ color: '#64748b' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="15" rx="2" />
              <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-base">Units</span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ color: '#64748b' }} className="text-sm">
            {displayed.length} of {filtered.length}
          </span>
          <button style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45', color: '#cbd5e1' }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:border-slate-500 transition-colors">
            <Upload size={14} /> Import
          </button>
          <button style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45', color: '#cbd5e1' }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:border-slate-500 transition-colors">
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => setShowAll((v) => !v)}
            style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45', color: '#cbd5e1' }}
            className="px-3 py-1.5 rounded-lg text-sm hover:border-slate-500 transition-colors">
            {showAll ? 'Show less' : 'Show all'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45' }} className="rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #1e2d45' }}>
              {['UNIT', 'SITE', 'MODEL', 'BATTERY', 'LOAD', 'RUNTIME', 'STATUS', 'ASSET TAG'].map((col) => (
                <th key={col} style={{ color: '#64748b' }}
                  className="text-left text-xs font-medium uppercase tracking-widest px-4 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e2d4520' }}>
                    <td colSpan={8} className="px-4 py-3">
                      <div style={{ backgroundColor: '#253047' }} className="h-4 rounded animate-pulse w-full" />
                    </td>
                  </tr>
                ))
              : displayed.map((device) => (
                  <tr key={device.id}
                    style={{ borderBottom: '1px solid #1e2d4540' }}
                    className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">{device.name}</td>
                    <td className="px-4 py-3 font-semibold text-white">{device.site}</td>
                    <td style={{ color: '#94a3b8' }} className="px-4 py-3">{device.model}</td>
                    <td className="px-4 py-3"><BatteryBar value={device.battery} /></td>
                    <td style={{ color: '#cbd5e1' }} className="px-4 py-3">{device.load}%</td>
                    <td style={{ color: '#cbd5e1' }} className="px-4 py-3">{device.runtime}m</td>
                    <td className="px-4 py-3"><StatusBadge status={device.status} /></td>
                    <td style={{ color: '#64748b' }} className="px-4 py-3 font-mono text-xs">{device.assetTag}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
