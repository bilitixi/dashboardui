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

  // Auto-select first org once orgs load (only if user hasn't manually picked one)
  React.useEffect(() => {
    if (orgs.length > 0 && selectedOrgId === '') {
      setSelectedOrgId(orgs[0].id);
    }
  }, [orgs, selectedOrgId]);

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

  if (orgs.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f1520' }}>
        <TopNav selectedOrgId="" onOrgChange={setSelectedOrgId} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
          <div style={{ color: '#3b82f6', fontSize: 48 }} className="mb-4">⚡</div>
          <div className="text-white text-xl font-semibold mb-2">No organizations found</div>
          <div style={{ color: '#64748b' }} className="text-sm text-center max-w-sm">
            Your database is empty. Run a bootstrap sync to fetch data from EcoStruxure.
          </div>
          <code style={{ backgroundColor: '#1a2235', color: '#4ade80', border: '1px solid #1e2d45' }}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-mono">
            POST /api/sync/bootstrap
          </code>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f1520' }}>
      <TopNav
        selectedOrgId={selectedOrgId}
        onOrgChange={setSelectedOrgId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="px-6 py-6 space-y-6 max-w-screen-2xl mx-auto">
        <SummaryCards orgId={orgId} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlarmsSummaryChart orgId={orgId} />
          <PowerUsagePanel orgId={orgId} />
        </div>

        <AlarmsTable orgId={orgId} />

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
