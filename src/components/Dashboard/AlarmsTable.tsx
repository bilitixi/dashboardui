import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAlarms } from '../../hooks/useAlarms';
import { Alarm } from '../../api/types';

interface Props { orgId: string; }

const PAGE_SIZE = 8;

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    CRITICAL: { bg: '#1a0c10', color: '#f1556a', border: '#f1556a33' },
    WARNING:  { bg: '#1a1404', color: '#f9a52e', border: '#f9a52e33' },
    INFO:     { bg: '#091828', color: '#5b9dff', border: '#5b9dff33' },
    OK:       { bg: '#091810', color: '#34d17e', border: '#34d17e33' },
  };
  const key = (severity ?? '').toUpperCase();
  const s = map[key] ?? { bg: '#13263f', color: '#9fb2cd', border: '#9fb2cd33' };
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {severity}
    </span>
  );
}

function StatusBadge({ alarm }: { alarm: Alarm }) {
  const active = alarm.cleared_time === null;
  return (
    <span style={{
      backgroundColor: active ? '#1a0c10' : '#1a2a1a',
      color: active ? '#f1556a' : '#34d17e',
      border: `1px solid ${active ? '#f1556a33' : '#34d17e33'}`,
    }} className="inline-block px-2 py-0.5 rounded-full text-xs font-medium">
      {active ? 'Active' : 'Cleared'}
    </span>
  );
}

export function AlarmsTable({ orgId }: Props) {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<'all' | 'active' | 'cleared'>('all');

  const { data, isLoading } = useAlarms({
    organization_id: orgId,
    status: filter === 'all' ? undefined : filter,
    limit: 200,
  });

  const alarms = data?.items ?? [];
  const totalPages = Math.ceil(alarms.length / PAGE_SIZE);
  const displayed = alarms.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold">Alarms</span>
          <span style={{ color: '#6c7f9c' }} className="text-sm">{data?.total ?? 0} total</span>
        </div>
        <div style={{ backgroundColor: '#13263f', border: '1px solid #27425f' }}
          className="flex rounded-lg overflow-hidden text-sm">
          {(['all', 'active', 'cleared'] as const).map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(0); }}
              style={{
                backgroundColor: filter === f ? '#1c3252' : 'transparent',
                color: filter === f ? '#eef3fb' : '#6c7f9c',
              }}
              className="px-3 py-1.5 capitalize transition-colors">
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#13263f', border: '1px solid #27425f' }} className="rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #27425f' }}>
              {['SEVERITY', 'LABEL', 'MESSAGE', 'ACTIVATED', 'CLEARED', 'STATUS', 'REACTIVATIONS'].map(col => (
                <th key={col} style={{ color: '#6c7f9c' }}
                  className="text-left text-xs font-medium uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #27425f20' }}>
                    <td colSpan={7} className="px-4 py-3">
                      <div style={{ backgroundColor: '#1c3252' }} className="h-4 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              : displayed.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center" style={{ color: '#6c7f9c' }}>
                      No alarms found
                    </td>
                  </tr>
                )
              : displayed.map(alarm => (
                  <tr key={alarm.id} style={{ borderBottom: '1px solid #27425f40' }}
                    className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3"><SeverityBadge severity={alarm.severity} /></td>
                    <td className="px-4 py-3 font-medium text-white">{alarm.label ?? '—'}</td>
                    <td style={{ color: '#9fb2cd' }} className="px-4 py-3 max-w-xs truncate">
                      {alarm.message ?? '—'}
                    </td>
                    <td style={{ color: '#6c7f9c' }} className="px-4 py-3 text-xs whitespace-nowrap">
                      {new Date(alarm.activated_time).toLocaleString()}
                    </td>
                    <td style={{ color: '#6c7f9c' }} className="px-4 py-3 text-xs whitespace-nowrap">
                      {alarm.cleared_time ? new Date(alarm.cleared_time).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3"><StatusBadge alarm={alarm} /></td>
                    <td className="px-4 py-3 text-center">
                      <span style={{
                        color: alarm.alarm_reactivation_count > 0 ? '#f9a52e' : '#6c7f9c',
                        fontWeight: alarm.alarm_reactivation_count > 0 ? 600 : 400,
                      }}>{alarm.alarm_reactivation_count}</span>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>

        {totalPages > 1 && (
          <div style={{ borderTop: '1px solid #27425f' }}
            className="px-4 py-3 flex items-center justify-between">
            <span style={{ color: '#6c7f9c' }} className="text-xs">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                style={{ backgroundColor: '#0c1b30', border: '1px solid #27425f', color: page === 0 ? '#27425f' : '#eef3fb' }}
                className="p-1.5 rounded-lg disabled:cursor-not-allowed">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                style={{ backgroundColor: '#0c1b30', border: '1px solid #27425f', color: page >= totalPages - 1 ? '#27425f' : '#eef3fb' }}
                className="p-1.5 rounded-lg disabled:cursor-not-allowed">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
