import React from 'react';

interface BadgeProps {
  status: 'healthy' | 'degraded' | 'critical' | 'offline';
  label?: string;
}

const statusConfig = {
  healthy: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400', label: 'Healthy' },
  degraded: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400', label: 'Degraded' },
  critical: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400', label: 'Critical' },
  offline: { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400', label: 'Offline' },
};

export const Badge: React.FC<BadgeProps> = ({ status, label }) => {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {label ?? config.label}
    </span>
  );
};
