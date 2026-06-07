import React from 'react';
import { Wifi, WifiOff, AlertTriangle, Heart } from 'lucide-react';
import { Card } from '../ui/Card';
import { useFleetSummary } from '../../hooks/useDevices';

export function SummaryCards() {
  const { data: summary, isLoading } = useFleetSummary();

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <div className="h-16 bg-gray-700/30 animate-pulse rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Online',
      value: summary.onlineDevices,
      total: summary.totalDevices,
      icon: <Wifi size={20} className="text-green-400" />,
      color: 'text-green-400',
    },
    {
      label: 'Offline',
      value: summary.offlineDevices,
      total: summary.totalDevices,
      icon: <WifiOff size={20} className="text-red-400" />,
      color: 'text-red-400',
    },
    {
      label: 'Warnings',
      value: summary.warningDevices,
      total: summary.totalDevices,
      icon: <AlertTriangle size={20} className="text-yellow-400" />,
      color: 'text-yellow-400',
    },
    {
      label: 'Avg Battery Health',
      value: `${summary.avgBatteryHealth}%`,
      icon: <Heart size={20} className="text-blue-400" />,
      color: 'text-blue-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{card.label}</span>
            {card.icon}
          </div>
          <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          {card.total !== undefined && (
            <div className="text-xs text-gray-500 mt-1">of {card.total} total</div>
          )}
        </Card>
      ))}
    </div>
  );
}
