import React from 'react';
import { useBatteryHealthDistribution } from '../../hooks/useDevices';

export function BatteryHealthChart() {
  const { data = [], isLoading } = useBatteryHealthDistribution();
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45' }} className="rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-white font-semibold text-base">Battery health distribution</span>
        <span style={{ color: '#64748b' }} className="text-sm">
          {data.reduce((s, d) => s + d.count, 0)} units · %
        </span>
      </div>

      {/* Bars */}
      {isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ backgroundColor: '#253047' }} className="h-6 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((bucket) => {
            const pct = (bucket.count / maxCount) * 100;
            return (
              <div key={bucket.range} className="flex items-center gap-4">
                {/* Label */}
                <div style={{ color: '#94a3b8', minWidth: 110 }} className="text-sm text-right">
                  {bucket.range}
                </div>
                {/* Bar track */}
                <div style={{ backgroundColor: '#253047', flex: 1 }} className="rounded-full h-3 overflow-hidden">
                  <div
                    style={{ width: `${pct}%`, backgroundColor: bucket.color, transition: 'width 0.6s ease' }}
                    className="h-full rounded-full"
                  />
                </div>
                {/* Count */}
                <div style={{ color: '#cbd5e1', minWidth: 28 }} className="text-sm text-right font-medium">
                  {bucket.count}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
