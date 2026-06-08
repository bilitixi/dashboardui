import React from 'react';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useSyncStatus, useIncrementalSync } from '../../hooks/useReports';
import { OrgSyncStatus } from '../../api/types';
import { useOrganizations } from '../../hooks/useOrganizations';

function StatusIcon({ status }: { status: OrgSyncStatus['last_sync_status'] }) {
  if (status === 'SUCCESS') return <CheckCircle size={16} style={{ color: '#34d17e' }} />;
  if (status === 'FAILED')  return <XCircle size={16} style={{ color: '#f1556a' }} />;
  return <Clock size={16} style={{ color: '#f9a52e' }} />;
}

export function SyncStatusPanel() {
  const { data, isLoading } = useSyncStatus();
  const { data: orgs = [] } = useOrganizations();
  const syncMutation = useIncrementalSync();

  const orgLabel = (id: string) => orgs.find(o => o.id === id)?.label ?? id;

  return (
    <div style={{ backgroundColor: '#13263f', border: '1px solid #27425f' }} className="rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-white font-semibold text-base">Sync status</span>
        <span style={{ color: '#6c7f9c' }} className="text-xs flex items-center gap-1">
          <RefreshCw size={11} /> Auto-refreshes every 30s
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map(i => (
            <div key={i} style={{ backgroundColor: '#1c3252' }} className="h-16 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (data?.organizations ?? []).length === 0 ? (
        <div style={{ color: '#6c7f9c' }} className="text-center py-8 text-sm">No sync data available</div>
      ) : (
        <div className="space-y-3">
          {(data?.organizations ?? []).map(org => (
            <div key={org.organization_id}
              style={{ backgroundColor: '#0c1b30', border: '1px solid #27425f' }}
              className="rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusIcon status={org.last_sync_status} />
                  <span className="text-sm font-medium text-white">{orgLabel(org.organization_id)}</span>
                  <span style={{
                    backgroundColor: org.last_sync_status === 'SUCCESS' ? '#091810' : org.last_sync_status === 'FAILED' ? '#1a0c10' : '#1a1404',
                    color: org.last_sync_status === 'SUCCESS' ? '#34d17e' : org.last_sync_status === 'FAILED' ? '#f1556a' : '#f9a52e',
                  }} className="text-xs px-2 py-0.5 rounded-full font-medium">
                    {org.last_sync_status}
                  </span>
                </div>
                <button
                  onClick={() => syncMutation.mutate(org.organization_id)}
                  disabled={syncMutation.isPending}
                  style={{ backgroundColor: '#1c3252', color: '#4d8df5', border: '1px solid #1c3252' }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium hover:brightness-125 disabled:opacity-50 transition-all">
                  <RefreshCw size={11} className={syncMutation.isPending ? 'animate-spin' : ''} />
                  Sync
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                {[
                  { label: 'Inventory', value: org.inventory_offset },
                  { label: 'Alarms', value: org.alarm_offset },
                  { label: 'Sensors', value: org.sensor_offset },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ color: '#6c7f9c' }}>{item.label} offset</div>
                    <div style={{ color: '#9fb2cd' }} className="font-mono font-medium">{item.value}</div>
                  </div>
                ))}
              </div>

              {org.last_sync_time && (
                <div style={{ color: '#6c7f9c' }} className="text-xs mt-2">
                  Last sync: {new Date(org.last_sync_time).toLocaleString()}
                </div>
              )}
              {org.last_error_message && (
                <div style={{ backgroundColor: '#1a0c10', color: '#f1556a', border: '1px solid #f1556a33' }}
                  className="mt-2 text-xs px-3 py-2 rounded-lg">
                  {org.last_error_message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
