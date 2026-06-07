import React, { useState } from 'react';
import { TopNav } from '../components/Layout/TopNav';
import { SummaryCards } from '../components/Dashboard/SummaryCards';
import { BatteryHealthChart } from '../components/Dashboard/BatteryHealthChart';
import { FleetLoadPanel } from '../components/Dashboard/FleetLoadPanel';
import { UnitsTable } from '../components/Dashboard/UnitsTable';

export default function Dashboard() {
  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-[#0f1520]">
      <TopNav selectedOrgId={selectedOrgId} onOrgChange={setSelectedOrgId} />
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <SummaryCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BatteryHealthChart />
          <FleetLoadPanel />
        </div>
        <UnitsTable organizationId={selectedOrgId} />
      </main>
    </div>
  );
}
