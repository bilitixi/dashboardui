import React from 'react';
import { useFleetSummary } from '../../hooks/useDevices';
import { mockMaintenanceItems } from '../../api/mockData';

export function FleetLoadPanel() {
  const { data: summary, isLoading } = useFleetSummary();

  return (
    <div style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45' }} className="rounded-xl p-6">
      <div className="text-white font-semibold text-base mb-6">Fleet load & upcoming maintenance</div>

      {/* Metrics row */}
      {isLoading || !summary ? (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ backgroundColor: '#253047' }} className="h-14 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <div style={{ color: '#64748b' }} className="text-xs uppercase tracking-widest mb-1">Avg Load</div>
            <div className="text-3xl font-bold text-white">{summary.avgLoad}%</div>
          </div>
          <div>
            <div style={{ color: '#64748b' }} className="text-xs uppercase tracking-widest mb-1">Peak Load</div>
            <div className="text-3xl font-bold" style={{ color: '#f59e0b' }}>{summary.peakLoad}%</div>
          </div>
          <div>
            <div style={{ color: '#64748b' }} className="text-xs uppercase tracking-widest mb-1">Avg Runtime</div>
            <div className="text-3xl font-bold text-white">{summary.avgRuntime}m</div>
          </div>
        </div>
      )}

      {/* Divider + maintenance list */}
      <div style={{ borderTop: '1px solid #1e2d45' }} className="pt-4">
        <div style={{ color: '#64748b' }} className="text-xs uppercase tracking-widest mb-4">
          Maintenance due · Next 3 to 6 months
        </div>
        <div className="space-y-4">
          {mockMaintenanceItems.map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }} />
                <div>
                  <div className="text-sm text-white font-medium leading-snug">{item.label}</div>
                  <div style={{ color: '#64748b' }} className="text-xs mt-0.5">{item.site}</div>
                </div>
              </div>
              <div style={{ color: '#64748b' }} className="text-sm whitespace-nowrap">{item.timeframe}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
