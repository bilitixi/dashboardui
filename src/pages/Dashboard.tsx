import React, { useState } from 'react';
import { TopNav } from '../components/Layout/TopNav';
import { SummaryCards } from '../components/Dashboard/SummaryCards';
import { BatteryHealthChart } from '../components/Dashboard/BatteryHealthChart';
import { FleetLoadPanel } from '../components/Dashboard/FleetLoadPanel';
import { UnitsTable } from '../components/Dashboard/UnitsTable';

export default function Dashboard() {
  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f1520' }}>
      <TopNav
        selectedOrgId={selectedOrgId}
        onOrgChange={setSelectedOrgId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="px-6 py-6 space-y-6 max-w-screen-2xl mx-auto">
        <SummaryCards />
        <div className="grid grid-cols-2 gap-6">
          <BatteryHealthChart />
          <FleetLoadPanel />
        </div>
        <UnitsTable organizationId={selectedOrgId} searchQuery={searchQuery} />
      </main>
    </div>
  );
}
