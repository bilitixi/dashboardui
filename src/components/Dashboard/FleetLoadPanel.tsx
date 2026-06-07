import React from 'react';
import { Zap, Thermometer, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { usePowerUsage } from '../../hooks/useReports';
import { PowerSensorStat } from '../../api/types';

interface Props { orgId: string; }

const unitIcon = (unit: string) => {
  if (unit === 'W' || unit === 'kW') return <Zap size={14} />;
  if (unit === '°C') return <Thermometer size={14} />;
  return null;
};

function StatBar({ stat }: { stat: PowerSensorStat }) {
  const range = stat.max - stat.min || 1;
  const avgPct = ((stat.avg - stat.min) / range) * 100;

  return (
    <div style={{ backgroundColor: '#0f1520', border: '1px solid #1e2d45' }} className="rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ color: '#64748b' }}>{unitIcon(stat.unit)}</span>
          <span className="text-sm font-medium text-white">{stat.name}</span>
          <span style={{ backgroundColor: '#1e2d45', color: '#94a3b8' }}
            className="text-xs px-1.5 py-0.5 rounded font-mono">{stat.unit}</span>
        </div>
        <span className="text-lg font-bold text-white">{stat.avg.toFixed(1)}</span>
      </div>

      {/* Min-avg-max bar */}
      <div style={{ backgroundColor: '#253047' }} className="relative h-2 rounded-full overflow-visible mb-2">
        <div style={{ left: `${avgPct}%`, backgroundColor: '#3b82f6' }}
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full -ml-1.5 ring-2 ring-[#1a2235]" />
        <div style={{ width: `${avgPct}%`, backgroundColor: '#1e3a5f' }} className="h-full rounded-full" />
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
          <TrendingDown size={11} /><span>{stat.min.toFixed(1)} min</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
          <Minus size={11} /><span>{stat.avg.toFixed(1)} avg</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
          <TrendingUp size={11} /><span>{stat.max.toFixed(1)} max</span>
        </div>
      </div>
    </div>
  );
}

export function PowerUsagePanel({ orgId }: Props) {
  const { data, isLoading } = usePowerUsage(orgId);

  return (
    <div style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45' }} className="rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-white font-semibold text-base">Power & sensor metrics</span>
        <span style={{ color: '#64748b' }} className="text-xs">24h avg</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map(i => (
            <div key={i} style={{ backgroundColor: '#253047' }} className="h-20 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (data?.sensors ?? []).length === 0 ? (
        <div style={{ color: '#64748b' }} className="text-center py-10 text-sm">No sensor data available</div>
      ) : (
        <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 340 }}>
          {(data?.sensors ?? []).map(stat => <StatBar key={stat.name} stat={stat} />)}
        </div>
      )}
    </div>
  );
}
