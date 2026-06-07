import React from 'react';
import { Server, AlertTriangle, CheckCircle } from 'lucide-react';
import { useDeviceHealth } from '../../hooks/useReports';
import { useAlarmsSummary } from '../../hooks/useReports';

interface Props { orgId: string; }

function Skeleton() {
  return <div style={{ backgroundColor: '#253047' }} className="h-full rounded animate-pulse" />;
}

export function SummaryCards({ orgId }: Props) {
  const { data: health, isLoading: loadingHealth } = useDeviceHealth(orgId);
  const { data: alarmSummary, isLoading: loadingAlarms } = useAlarmsSummary(orgId);

  const critical = alarmSummary?.summary.find(s => s.severity === 'CRITICAL');
  const warning  = alarmSummary?.summary.find(s => s.severity === 'WARNING');

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total Devices */}
      <div style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45' }} className="rounded-xl p-5 flex items-start gap-4">
        <div style={{ backgroundColor: '#1e3a5f', borderRadius: 12 }} className="p-3 flex-shrink-0">
          <Server size={24} style={{ color: '#60a5fa' }} />
        </div>
        <div className="flex-1 min-h-[60px]">
          {loadingHealth ? <Skeleton /> : <>
            <div style={{ color: '#94a3b8' }} className="text-xs mb-1">Total Devices</div>
            <div className="text-4xl font-bold text-white leading-none">{health?.total_devices ?? '—'}</div>
            <div style={{ color: '#64748b' }} className="text-xs mt-1.5">monitored</div>
          </>}
        </div>
      </div>

      {/* Active Alarms */}
      <div style={{
        backgroundColor: (health?.active_alarms ?? 0) > 0 ? '#2a1a1a' : '#1a2235',
        border: (health?.active_alarms ?? 0) > 0 ? '2px solid #7f1d1d' : '1px solid #1e2d45',
      }} className="rounded-xl p-5 flex items-start gap-4">
        <div style={{ backgroundColor: '#3b1212', borderRadius: 12 }} className="p-3 flex-shrink-0">
          <AlertTriangle size={24} style={{ color: '#ef4444' }} />
        </div>
        <div className="flex-1 min-h-[60px]">
          {loadingHealth ? <Skeleton /> : <>
            <div style={{ color: '#94a3b8' }} className="text-xs mb-1">Active Alarms</div>
            <div className="text-4xl font-bold text-white leading-none">{health?.active_alarms ?? '—'}</div>
            <div style={{ color: '#ef4444' }} className="text-xs mt-1.5">need attention</div>
          </>}
        </div>
      </div>

      {/* Critical */}
      <div style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45' }} className="rounded-xl p-5 flex items-start gap-4">
        <div style={{ backgroundColor: '#2a1810', borderRadius: 12 }} className="p-3 flex-shrink-0">
          <AlertTriangle size={24} style={{ color: '#f97316' }} />
        </div>
        <div className="flex-1 min-h-[60px]">
          {loadingAlarms ? <Skeleton /> : <>
            <div style={{ color: '#94a3b8' }} className="text-xs mb-1">Critical Alarms</div>
            <div className="text-4xl font-bold text-white leading-none">{critical?.active ?? '—'}</div>
            <div style={{ color: '#64748b' }} className="text-xs mt-1.5">{critical?.total ?? 0} total (24h)</div>
          </>}
        </div>
      </div>

      {/* Warnings */}
      <div style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45' }} className="rounded-xl p-5 flex items-start gap-4">
        <div style={{ backgroundColor: '#1f2010', borderRadius: 12 }} className="p-3 flex-shrink-0">
          <CheckCircle size={24} style={{ color: '#22c55e' }} />
        </div>
        <div className="flex-1 min-h-[60px]">
          {loadingAlarms ? <Skeleton /> : <>
            <div style={{ color: '#94a3b8' }} className="text-xs mb-1">Warnings</div>
            <div className="text-4xl font-bold text-white leading-none">{warning?.active ?? '—'}</div>
            <div style={{ color: '#64748b' }} className="text-xs mt-1.5">{warning?.total ?? 0} total (24h)</div>
          </>}
        </div>
      </div>
    </div>
  );
}
