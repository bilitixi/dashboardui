import React from 'react';
import { Card } from '../ui/Card';
import type { Device } from '../../api/types';

interface SummaryCardsProps {
  devices: Device[];
  organizations: { id: string; name: string }[];
  selectedOrgId?: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ devices, organizations, selectedOrgId }) => {
  const total = devices.length;
  const healthy = devices.filter((d) => d.status === 'healthy').length;
  const degraded = devices.filter((d) => d.status === 'degraded' || d.status === 'critical').length;
  const healthyPct = total > 0 ? Math.round((healthy / total) * 100) : 0;

  const villageCount = selectedOrgId
    ? 1
    : organizations.length;

  const orgLabel = selectedOrgId
    ? organizations.find((o) => o.id === selectedOrgId)?.name ?? '1 village'
    : `${villageCount} villages`;

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Total monitored */}
      <Card>
        <div className="text-[#94a3b8] text-xs font-medium uppercase tracking-wider mb-3">
          Total monitored
        </div>
        <div className="text-4xl font-bold text-white mb-1">{total}</div>
        <div className="text-[#94a3b8] text-xs">{orgLabel}</div>
      </Card>

      {/* Healthy */}
      <Card>
        <div className="text-[#94a3b8] text-xs font-medium uppercase tracking-wider mb-3">
          Healthy
        </div>
        <div className="text-4xl font-bold text-white mb-1">{healthy}</div>
        <div className="text-green-400 text-xs font-medium">{healthyPct}% of fleet</div>
      </Card>

      {/* Degraded */}
      <Card highlighted>
        <div className="text-[#94a3b8] text-xs font-medium uppercase tracking-wider mb-3">
          Degraded
        </div>
        <div className="text-4xl font-bold text-white mb-1">{degraded}</div>
        <div className="text-red-400 text-xs font-medium">battery or load issues</div>
      </Card>
    </div>
  );
};
