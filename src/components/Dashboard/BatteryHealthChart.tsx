import React from 'react';
import { Card } from '../ui/Card';
import type { Device } from '../../api/types';

interface BatteryHealthChartProps {
  devices: Device[];
}

interface BatteryBucket {
  label: string;
  color: string;
  bgColor: string;
  count: number;
}

export const BatteryHealthChart: React.FC<BatteryHealthChartProps> = ({ devices }) => {
  const buckets: BatteryBucket[] = [
    { label: '95–100%', color: '#22c55e', bgColor: 'bg-green-500', count: 0 },
    { label: '90–95%', color: '#86efac', bgColor: 'bg-green-300', count: 0 },
    { label: '80–90%', color: '#f59e0b', bgColor: 'bg-yellow-500', count: 0 },
    { label: '<80% degraded', color: '#ef4444', bgColor: 'bg-red-500', count: 0 },
  ];

  devices.forEach((d) => {
    const pct = d.battery_percentage ?? 100;
    if (pct >= 95) buckets[0].count++;
    else if (pct >= 90) buckets[1].count++;
    else if (pct >= 80) buckets[2].count++;
    else buckets[3].count++;
  });

  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <Card className="flex flex-col h-full">
      <div className="text-white font-semibold text-sm mb-1">Battery health distribution</div>
      <div className="text-[#94a3b8] text-xs mb-5">Based on current battery levels</div>

      <div className="flex flex-col gap-4 flex-1 justify-center">
        {buckets.map((bucket) => {
          const widthPct = Math.round((bucket.count / maxCount) * 100);
          return (
            <div key={bucket.label} className="flex items-center gap-3">
              <div className="text-[#94a3b8] text-xs w-28 shrink-0 text-right">
                {bucket.label}
              </div>
              <div className="flex-1 bg-[#0f1520] rounded-full h-5 overflow-hidden">
                <div
                  className={`h-5 rounded-full ${bucket.bgColor} transition-all duration-700`}
                  style={{ width: bucket.count === 0 ? '4px' : `${widthPct}%`, minWidth: bucket.count > 0 ? '20px' : '0' }}
                />
              </div>
              <div className="text-white text-sm font-bold w-6 text-right shrink-0">
                {bucket.count}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-[#2a3548] flex gap-4">
        {buckets.map((bucket) => (
          <div key={bucket.label} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: bucket.color }}
            />
            <span className="text-[#94a3b8] text-[10px]">{bucket.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
