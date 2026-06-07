import React from 'react';
import { Card } from '../ui/Card';
import { Calendar, Clock } from 'lucide-react';
import type { PowerUsage } from '../../api/types';
import type { Device } from '../../api/types';

interface MaintenanceItem {
  id: string;
  label: string;
  site: string;
  daysUntil: number;
}

interface FleetLoadPanelProps {
  powerUsage?: PowerUsage;
  devices: Device[];
}

function getMaintenanceSchedule(devices: Device[]): MaintenanceItem[] {
  // Generate mock maintenance schedule based on battery levels
  return devices
    .filter((d) => (d.battery_percentage ?? 100) < 90)
    .slice(0, 4)
    .map((d, i) => ({
      id: d.id,
      label: d.label,
      site: d.site ?? 'Unknown',
      daysUntil: (i + 1) * 7 + Math.floor(Math.random() * 5),
    }));
}

interface MetricBoxProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

const MetricBox: React.FC<MetricBoxProps> = ({ label, value, sub, color = 'text-white' }) => (
  <div className="bg-[#0f1520] rounded-lg p-3 flex flex-col gap-1">
    <div className="text-[#94a3b8] text-[10px] uppercase tracking-wider font-medium">{label}</div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    {sub && <div className="text-[#94a3b8] text-[10px]">{sub}</div>}
  </div>
);

export const FleetLoadPanel: React.FC<FleetLoadPanelProps> = ({ powerUsage, devices }) => {
  const avgLoad = powerUsage?.avg_load ?? 0;
  const peakLoad = powerUsage?.peak_load ?? 0;
  const avgRuntime = powerUsage?.avg_runtime ?? 0;
  const maintenance = getMaintenanceSchedule(devices);

  const loadColor =
    avgLoad >= 80 ? 'text-red-400' : avgLoad >= 60 ? 'text-yellow-400' : 'text-green-400';

  return (
    <Card className="flex flex-col h-full">
      <div className="text-white font-semibold text-sm mb-1">Fleet load & upcoming maintenance</div>
      <div className="text-[#94a3b8] text-xs mb-4">Live metrics + next scheduled service</div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <MetricBox
          label="AVG LOAD"
          value={`${avgLoad}%`}
          sub="across fleet"
          color={loadColor}
        />
        <MetricBox
          label="PEAK LOAD"
          value={`${peakLoad}%`}
          sub="highest unit"
          color={peakLoad >= 80 ? 'text-red-400' : 'text-yellow-400'}
        />
        <MetricBox
          label="AVG RUNTIME"
          value={`${avgRuntime}m`}
          sub="on battery"
          color="text-blue-400"
        />
      </div>

      {/* Maintenance list */}
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={13} className="text-[#94a3b8]" />
        <span className="text-[#94a3b8] text-xs font-medium uppercase tracking-wider">
          Upcoming maintenance
        </span>
      </div>

      {maintenance.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[#94a3b8] text-xs">
          No maintenance scheduled
        </div>
      ) : (
        <div className="flex flex-col gap-2 flex-1">
          {maintenance.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-[#0f1520] rounded-lg px-3 py-2.5"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-white text-xs font-medium">{item.label}</span>
                <span className="text-[#94a3b8] text-[10px]">{item.site}</span>
              </div>
              <div className="flex items-center gap-1.5 text-yellow-400 text-xs">
                <Clock size={11} />
                <span>in {item.daysUntil}d</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
