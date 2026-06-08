import React from 'react';
import { Server, AlertTriangle, CheckCircle } from 'lucide-react';
import { useDeviceHealth } from '../../hooks/useReports';
import { useAlarmsSummary } from '../../hooks/useReports';

interface Props { orgId: string; }

function Skeleton() {
  return <div style={{ backgroundColor: '#1c3252' }} className="h-full rounded animate-pulse" />;
}

export function SummaryCards({ orgId }: Props) {
  const { data: health, isLoading: loadingHealth } = useDeviceHealth(orgId);
  const { data: alarmSummary, isLoading: loadingAlarms } = useAlarmsSummary(orgId);

  const critical = alarmSummary?.summary.find(s => s.severity === 'CRITICAL');
  const warning  = alarmSummary?.summary.find(s => s.severity === 'WARNING');

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total Devices */}
      <div style={{ backgroundColor: '#13263f', border: '1px solid #27425f' }} className="rounded-xl p-5 flex items-start gap-4">
        <div style={{ backgroundColor: '#1c3252', borderRadius: 12 }} className="p-3 flex-shrink-0">
          <Server size={24} style={{ color: '#4d8df5' }} />
        </div>
        <div className="flex-1 min-h-[60px]">
          {loadingHealth ? <Skeleton /> : <>
            <div style={{ color: '#9fb2cd' }} className="text-xs mb-1">Total Devices</div>
            <div className="text-4xl font-bold text-white leading-none">{health?.total_devices ?? '—'}</div>
            <div style={{ color: '#6c7f9c' }} className="text-xs mt-1.5">monitored</div>
          </>}
        </div>
      </div>

      {/* Active Alarms */}
      <div style={{
        backgroundColor: (health?.active_alarms ?? 0) > 0 ? '#1a0c10' : '#13263f',
        border: (health?.active_alarms ?? 0) > 0 ? '2px solid #f1556a55' : '1px solid #27425f',
      }} className="rounded-xl p-5 flex items-start gap-4">
        <div style={{ backgroundColor: '#1a0c10', borderRadius: 12 }} className="p-3 flex-shrink-0">
          <AlertTriangle size={24} style={{ color: '#f1556a' }} />
        </div>
        <div className="flex-1 min-h-[60px]">
          {loadingHealth ? <Skeleton /> : <>
            <div style={{ color: '#9fb2cd' }} className="text-xs mb-1">Active Alarms</div>
            <div className="text-4xl font-bold text-white leading-none">{health?.active_alarms ?? '—'}</div>
            <div style={{ color: '#f1556a' }} className="text-xs mt-1.5">need attention</div>
          </>}
        </div>
      </div>

      {/* Critical */}
      <div style={{ backgroundColor: '#13263f', border: '1px solid #27425f' }} className="rounded-xl p-5 flex items-start gap-4">
        <div style={{ backgroundColor: '#1a1004', borderRadius: 12 }} className="p-3 flex-shrink-0">
          <AlertTriangle size={24} style={{ color: '#f9a52e' }} />
        </div>
        <div className="flex-1 min-h-[60px]">
          {loadingAlarms ? <Skeleton /> : <>
            <div style={{ color: '#9fb2cd' }} className="text-xs mb-1">Critical Alarms</div>
            <div className="text-4xl font-bold text-white leading-none">{critical?.active ?? '—'}</div>
            <div style={{ color: '#6c7f9c' }} className="text-xs mt-1.5">{critical?.total ?? 0} total (24h)</div>
          </>}
        </div>
      </div>

      {/* Warnings */}
      <div style={{ backgroundColor: '#13263f', border: '1px solid #27425f' }} className="rounded-xl p-5 flex items-start gap-4">
        <div style={{ backgroundColor: '#091810', borderRadius: 12 }} className="p-3 flex-shrink-0">
          <CheckCircle size={24} style={{ color: '#34d17e' }} />
        </div>
        <div className="flex-1 min-h-[60px]">
          {loadingAlarms ? <Skeleton /> : <>
            <div style={{ color: '#9fb2cd' }} className="text-xs mb-1">Warnings</div>
            <div className="text-4xl font-bold text-white leading-none">{warning?.active ?? '—'}</div>
            <div style={{ color: '#6c7f9c' }} className="text-xs mt-1.5">{warning?.total ?? 0} total (24h)</div>
          </>}
        </div>
      </div>
    </div>
  );
}
