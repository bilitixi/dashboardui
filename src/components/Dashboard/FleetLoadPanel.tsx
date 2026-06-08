import React, { useState } from 'react';
import { Zap, Thermometer, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { usePowerUsage } from '../../hooks/useReports';
import { PowerSensorStat } from '../../api/types';

interface Props { orgId: string; }

const UNIT_FILTERS = ['All', 'W', 'kW', 'V', 'A', '%', '°C'];

const unitIcon = (unit: string) => {
  if (unit === 'W' || unit === 'kW') return <Zap size={13} />;
  if (unit === '°C') return <Thermometer size={13} />;
  if (unit === 'A') return <Activity size={13} />;
  return null;
};

function StatBar({ stat }: { stat: PowerSensorStat }) {
  const hasData = stat.count > 0 && stat.avg !== null && stat.min !== null && stat.max !== null;
  const range = hasData ? (stat.max! - stat.min!) || 1 : 1;
  const avgPct = hasData ? ((stat.avg! - stat.min!) / range) * 100 : 0;

  return (
    <div style={{ backgroundColor: '#0f1520', border: '1px solid #1e2d45' }} className="rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ color: '#64748b' }}>{unitIcon(stat.unit)}</span>
          <span className="text-sm font-medium text-white">{stat.name}</span>
          <span style={{ backgroundColor: '#1e2d45', color: '#94a3b8' }}
            className="text-xs px-1.5 py-0.5 rounded font-mono">{stat.unit}</span>
        </div>
        <div className="flex items-center gap-2">
          {hasData
            ? <span className="text-lg font-bold text-white">{stat.avg!.toFixed(1)}</span>
            : <span style={{ color: '#64748b' }} className="text-sm italic">no data</span>
          }
          <span style={{ color: '#64748b' }} className="text-xs">{stat.count} pts</span>
        </div>
      </div>

      {/* Min-avg-max bar */}
      <div style={{ backgroundColor: '#253047' }} className="relative h-2 rounded-full overflow-visible mb-2">
        {hasData && (
          <>
            <div style={{ width: `${avgPct}%`, backgroundColor: '#1e3a5f' }} className="h-full rounded-full" />
            <div style={{ left: `${avgPct}%`, backgroundColor: '#3b82f6' }}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full -ml-1.5 ring-2 ring-[#1a2235]" />
          </>
        )}
      </div>

      <div className="flex justify-between">
        {hasData ? (
          <>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
              <TrendingDown size={11} /><span>{stat.min!.toFixed(1)} min</span>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
              <Minus size={11} /><span>{stat.avg!.toFixed(1)} avg</span>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
              <TrendingUp size={11} /><span>{stat.max!.toFixed(1)} max</span>
            </div>
          </>
        ) : (
          <span style={{ color: '#3a4a5e' }} className="text-xs">No measurements in timeframe</span>
        )}
      </div>
    </div>
  );
}

export function PowerUsagePanel({ orgId }: Props) {
  const [unitFilter, setUnitFilter] = useState('All');

  const { data, isLoading } = usePowerUsage({
    organization_id: orgId,
    timeframe_hours: 24,
    unit: unitFilter === 'All' ? undefined : unitFilter,
  });

  const sensors = data?.sensors ?? [];
  const withData    = sensors.filter(s => s.count > 0);
  const withoutData = sensors.filter(s => s.count === 0);

  return (
    <div style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45' }} className="rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-white font-semibold text-base">Power & sensor metrics</span>
          <span style={{ color: '#64748b' }} className="text-xs ml-2">24h avg</span>
        </div>
        <div style={{ color: '#64748b' }} className="text-xs">
          {withData.length}/{sensors.length} sensors active
        </div>
      </div>

      {/* Unit filter tabs */}
      <div style={{ backgroundColor: '#0f1520', border: '1px solid #1e2d45' }}
        className="flex rounded-lg overflow-hidden text-xs mb-4 flex-wrap">
        {UNIT_FILTERS.map(u => (
          <button key={u} onClick={() => setUnitFilter(u)}
            style={{
              backgroundColor: unitFilter === u ? '#253047' : 'transparent',
              color: unitFilter === u ? '#e2e8f0' : '#64748b',
            }}
            className="px-3 py-1.5 transition-colors">
            {u}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map(i => (
            <div key={i} style={{ backgroundColor: '#253047' }} className="h-20 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : sensors.length === 0 ? (
        <div style={{ color: '#64748b' }} className="text-center py-10 text-sm">
          No sensors found for this organization
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 360 }}>
          {/* Sensors with data first */}
          {withData.map(stat => <StatBar key={stat.sensor_id} stat={stat} />)}
          {/* Sensors with no measurements at bottom, collapsed */}
          {withoutData.length > 0 && (
            <details className="mt-2">
              <summary style={{ color: '#3a4a5e' }}
                className="text-xs cursor-pointer hover:text-slate-400 transition-colors list-none">
                {withoutData.length} sensor{withoutData.length > 1 ? 's' : ''} with no data in timeframe ▸
              </summary>
              <div className="space-y-3 mt-3">
                {withoutData.map(stat => <StatBar key={stat.sensor_id} stat={stat} />)}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
