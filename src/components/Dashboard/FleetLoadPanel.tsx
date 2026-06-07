import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAlarms } from '../../hooks/useAlarms';
import { formatDistanceToNow } from 'date-fns';
import { Alarm } from '../../api/types';

export function FleetLoadPanel() {
  const { data, isLoading } = useAlarms();
  const alarms: Alarm[] = data ?? [];

  const activeAlarms = alarms.filter((a: Alarm) => !a.acknowledged);

  return (
    <Card title={`Active Alarms (${activeAlarms.length})`}>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-700/30 animate-pulse rounded" />
          ))}
        </div>
      ) : activeAlarms.length === 0 ? (
        <div className="text-center text-gray-500 py-6 text-sm">No active alarms</div>
      ) : (
        <div className="space-y-2">
          {activeAlarms.map((alarm) => (
            <div
              key={alarm.id}
              className="flex items-start justify-between gap-2 p-2 rounded-lg bg-gray-800/40 border border-gray-700/30"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant={alarm.type === 'critical' ? 'danger' : alarm.type === 'warning' ? 'warning' : 'info'}>
                    {alarm.type}
                  </Badge>
                  <span className="text-xs text-gray-300 font-medium truncate">{alarm.deviceName}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{alarm.message}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatDistanceToNow(new Date(alarm.timestamp), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
