import React, { useState } from 'react';
import { TopNav } from '../components/Layout/TopNav';
import { SummaryCards } from '../components/Dashboard/SummaryCards';
import { AlarmsSummaryChart } from '../components/Dashboard/BatteryHealthChart';
import { PowerUsagePanel } from '../components/Dashboard/FleetLoadPanel';
import { UnitsTable } from '../components/Dashboard/UnitsTable';
import { AlarmsTable } from '../components/Dashboard/AlarmsTable';
import { SyncStatusPanel } from '../components/Dashboard/SyncStatus';
import { useOrganizations } from '../hooks/useOrganizations';

export default function Dashboard() {
  const { data: orgs = [], isLoading: orgsLoading } = useOrganizations();
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Default to first org once loaded
  const orgId = selectedOrgId || orgs[0]?.id || '';

  if (orgsLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f1520' }}
        className="flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div style={{ color: '#64748b' }} className="text-sm">Loading organizations...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f1520' }}>
      <TopNav
        selectedOrgId={orgId}
        onOrgChange={setSelectedOrgId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="px-6 py-6 space-y-6 max-w-screen-2xl mx-auto">
        {/* Row 1 — Summary KPIs */}
        <SummaryCards orgId={orgId} />

        {/* Row 2 — Alarms chart + Power metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlarmsSummaryChart orgId={orgId} />
          <PowerUsagePanel orgId={orgId} />
        </div>

        {/* Row 3 — Alarms table */}
        <AlarmsTable orgId={orgId} />

        {/* Row 4 — Devices table + Sync status */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <UnitsTable orgId={orgId} searchQuery={searchQuery} />
          </div>
          <SyncStatusPanel />
        </div>
      </main>
    </div>
  );
}
