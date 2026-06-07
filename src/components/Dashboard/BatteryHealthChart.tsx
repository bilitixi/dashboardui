import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../ui/Card';
import { useBatteryHealthDistribution } from '../../hooks/useDevices';

const COLORS = ['#22c55e', '#4ade80', '#facc15', '#f97316', '#ef4444', '#dc2626'];

export function BatteryHealthChart() {
  const { data = [], isLoading } = useBatteryHealthDistribution();

  return (
    <Card title="Battery Health Distribution">
      {isLoading ? (
        <div className="h-48 bg-gray-700/30 animate-pulse rounded" />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#1a2740', border: '1px solid #374151', borderRadius: 8 }}
              labelStyle={{ color: '#e5e7eb' }}
              itemStyle={{ color: '#9ca3af' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((_entry: unknown, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
