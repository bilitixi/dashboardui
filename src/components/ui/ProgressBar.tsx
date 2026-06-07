import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  colorClass?: string;
  height?: string;
}

function getColorClass(value: number): string {
  if (value >= 95) return 'bg-green-500';
  if (value >= 90) return 'bg-green-400';
  if (value >= 80) return 'bg-yellow-400';
  return 'bg-red-500';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  colorClass,
  height = 'h-1.5',
}) => {
  const color = colorClass ?? getColorClass(value);
  return (
    <div className={`w-full bg-[#2a3548] rounded-full ${height} overflow-hidden`}>
      <div
        className={`${height} rounded-full ${color} transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};
