import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { useAlarmsSummary } from '../../hooks/useReports';

interface Props { orgId: string; }

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#f1556a',
  WARNING:  '#f9a52e',
  INFO:     '#5b9dff',
  OK:       '#34d17e',
};

const STATUS_COLORS = {
  Active:  '#f1556a',
  Cleared: '#5b9dff',
};

const WINDOWS = [
  { label: 'Last 24 hours', hours: 24 },
  { label: 'Last 7 days',   hours: 168 },
];

export function AlarmsSummaryChart({ orgId }: Props) {
  const [selectedHours, setSelectedHours] = useState(24);
  const { data, isLoading } = useAlarmsSummary(orgId, selectedHours);

  const chartData = (data?.summary ?? []).map(s => ({
    severity: s.severity,
    Active: s.active,
    Cleared: s.total - s.active,
    total: s.total,
  }));

  const selectedLabel = WINDOWS.find(w => w.hours === selectedHours)?.label ?? 'Last 24 hours';

  return (
    <div style={{ backgroundColor: '#13263f', border: '1px solid #27425f' }} className="rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-white font-semibold text-base">Alarms by severity</span>
        <select
          value={selectedHours}
          onChange={e => setSelectedHours(Number(e.target.value))}
          style={{
            backgroundColor: '#0c1b30',
            border: '1px solid #27425f',
            color: '#9fb2cd',
            borderRadius: 8,
            padding: '4px 10px',
            fontSize: 12,
            outline: 'none',
            cursor: 'pointer',
          }}>
          {WINDOWS.map(w => (
            <option key={w.hours} value={w.hours}>{w.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div style={{ backgroundColor: '#1c3252' }} className="h-48 rounded animate-pulse" />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c3252" vertical={false} />
              <XAxis dataKey="severity" tick={{ fill: '#9fb2cd', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9fb2cd', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#13263f', border: '1px solid #27425f', borderRadius: 8 }}
                labelStyle={{ color: '#eef3fb', fontWeight: 600 }}
                itemStyle={{ color: '#9fb2cd' }}
              />
              <Bar dataKey="Active" stackId="a" radius={[0, 0, 0, 0]} fill={STATUS_COLORS.Active}>
                {chartData.map(entry => (
                  <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity] ?? STATUS_COLORS.Active} />
                ))}
              </Bar>
              <Bar dataKey="Cleared" stackId="a" fill={STATUS_COLORS.Cleared} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-end">
            {Object.entries(STATUS_COLORS).map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                <span style={{ color: '#9fb2cd' }} className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Summary pills */}
      {!isLoading && (
        <div className="flex gap-3 mt-4">
          {(data?.summary ?? []).map(s => (
            <div key={s.severity} style={{ backgroundColor: '#0c1b30', border: `1px solid ${SEVERITY_COLORS[s.severity] ?? '#6c7f9c'}33` }}
              className="flex-1 rounded-lg p-3 text-center">
              <div className="text-xs font-medium mb-1" style={{ color: SEVERITY_COLORS[s.severity] ?? '#6c7f9c' }}>{s.severity}</div>
              <div className="text-2xl font-bold" style={{ color: STATUS_COLORS.Active }}>{s.active}</div>
              <div className="text-xs mt-0.5">
                <span style={{ color: STATUS_COLORS.Cleared }}>{s.total - s.active} cleared</span>
                <span style={{ color: '#27425f' }}> / {s.total} total</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
