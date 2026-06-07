import React from 'react';
import { useFleetSummary } from '../../hooks/useDevices';
import { Battery, CheckCircle, AlertTriangle } from 'lucide-react';

export function SummaryCards() {
  const { data: summary, isLoading } = useFleetSummary();

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45' }}
            className="rounded-xl p-6 h-36 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Total monitored */}
      <div style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45' }} className="rounded-xl p-6 flex items-start gap-4">
        <div style={{ backgroundColor: '#1e3a5f', borderRadius: 12 }} className="p-3 flex-shrink-0">
          <Battery size={28} style={{ color: '#60a5fa' }} />
        </div>
        <div>
          <div style={{ color: '#94a3b8' }} className="text-sm mb-1">Total monitored</div>
          <div className="text-5xl font-bold text-white leading-none">{summary.totalDevices}</div>
          <div style={{ color: '#64748b' }} className="text-sm mt-2">{summary.villages} villages</div>
        </div>
      </div>

      {/* Healthy */}
      <div style={{ backgroundColor: '#1a2235', border: '1px solid #1e2d45' }} className="rounded-xl p-6 flex items-start gap-4">
        <div style={{ backgroundColor: '#14291f', borderRadius: 12 }} className="p-3 flex-shrink-0">
          <CheckCircle size={28} style={{ color: '#22c55e' }} />
        </div>
        <div>
          <div style={{ color: '#94a3b8' }} className="text-sm mb-1">Healthy</div>
          <div className="text-5xl font-bold text-white leading-none">{summary.healthyDevices}</div>
          <div style={{ color: '#22c55e' }} className="text-sm mt-2">{summary.healthyPercent}% of fleet</div>
        </div>
      </div>

      {/* Degraded */}
      <div style={{ backgroundColor: '#2a1a1a', border: '2px solid #7f1d1d' }} className="rounded-xl p-6 flex items-start gap-4">
        <div style={{ backgroundColor: '#3b1212', borderRadius: 12 }} className="p-3 flex-shrink-0">
          <AlertTriangle size={28} style={{ color: '#ef4444' }} />
        </div>
        <div>
          <div style={{ color: '#94a3b8' }} className="text-sm mb-1">Degraded</div>
          <div className="text-5xl font-bold text-white leading-none">{summary.degradedDevices}</div>
          <div style={{ color: '#ef4444' }} className="text-sm mt-2">battery or load</div>
        </div>
      </div>
    </div>
  );
}
