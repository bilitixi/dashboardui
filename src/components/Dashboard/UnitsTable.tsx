import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { useDevices } from '../../hooks/useDevices';
import { formatDistanceToNow } from 'date-fns';
import { Device } from '../../api/types';

interface UnitsTableProps {
  organizationId?: string;
}

function statusVariant(status: Device['status']) {
  switch (status) {
    case 'online': return 'success';
    case 'offline': return 'danger';
    case 'warning': return 'warning';
    case 'charging': return 'info';
    default: return 'neutral';
  }
}

function healthColor(health: number) {
  if (health >= 80) return 'bg-green-500';
  if (health >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function UnitsTable({ organizationId }: UnitsTableProps) {
  const { data: devices = [], isLoading } = useDevices(organizationId);
  const [sortKey, setSortKey] = useState<keyof Device>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...devices].sort((a, b) => {
    const av = a[sortKey] as string | number;
    const bv = b[sortKey] as string | number;
    return sortAsc ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
  });

  const handleSort = (key: keyof Device) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortBtn = ({ col, label }: { col: keyof Device; label: string }) => (
    <button
      onClick={() => handleSort(col)}
      className="flex items-center gap-1 text-xs text-gray-400 uppercase tracking-wider hover:text-white transition-colors"
    >
      {label}
      {sortKey === col && <span className="text-blue-400">{sortAsc ? '↑' : '↓'}</span>}
    </button>
  );

  return (
    <Card title="Fleet Units">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left pb-2 pr-4"><SortBtn col="name" label="Unit" /></th>
              <th className="text-left pb-2 pr-4"><SortBtn col="status" label="Status" /></th>
              <th className="text-left pb-2 pr-4"><SortBtn col="batteryHealth" label="Health" /></th>
              <th className="text-left pb-2 pr-4"><SortBtn col="batteryLevel" label="Level" /></th>
              <th className="text-left pb-2"><SortBtn col="lastSeen" label="Last Seen" /></th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-700/20">
                    <td colSpan={5} className="py-3">
                      <div className="h-4 bg-gray-700/30 animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              : sorted.map((device) => (
                  <tr key={device.id} className="border-b border-gray-700/20 hover:bg-gray-700/10 transition-colors">
                    <td className="py-2.5 pr-4">
                      <div className="font-medium text-gray-200">{device.name}</div>
                      <div className="text-xs text-gray-500">{device.serialNumber}</div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={statusVariant(device.status)}>{device.status}</Badge>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-200 w-8">{device.batteryHealth}%</span>
                        <ProgressBar value={device.batteryHealth} colorClass={healthColor(device.batteryHealth)} className="w-20" />
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-200 w-8">{device.batteryLevel}%</span>
                        <ProgressBar value={device.batteryLevel} colorClass="bg-blue-500" className="w-20" />
                      </div>
                    </td>
                    <td className="py-2.5 text-gray-400 text-xs">
                      {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
