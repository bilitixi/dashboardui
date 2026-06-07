import React, { useState } from 'react';
import { TopNav } from '../components/Layout/TopNav';
import { SummaryCards } from '../components/Dashboard/SummaryCards';
import { BatteryHealthChart } from '../components/Dashboard/BatteryHealthChart';
import { FleetLoadPanel } from '../components/Dashboard/FleetLoadPanel';
import { UnitsTable } from '../components/Dashboard/UnitsTable';
import { useOrganizations } from '../hooks/useOrganizations';
import { useDevices } from '../hooks/useDevices';
import { usePowerUsage } from '../hooks/useReports';

export const Dashboard: React.FC = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const { data: organizations = [] } = useOrganizations();
  const { data: devicesData } = useDevices({
    organization_id: selectedOrgId,
    limit: 100,
  });
  const { data: powerUsage } = usePowerUsage(selectedOrgId);

  const devices = devicesData?.items ?? [];
  const total = devicesData?.total ?? 0;

  return (
    <div className="min-h-screen bg-[#0f1520] flex flex-col">
      <TopNav
        organizations={organizations}
        selectedOrgId={selectedOrgId}
        onSelectOrg={setSelectedOrgId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
      />

      <main className="flex-1 px-6 py-5 flex flex-col gap-5 max-w-[1600px] w-full mx-auto">
        {/* Summary cards */}
        <SummaryCards
          devices={devices}
          organizations={organizations}
          selectedOrgId={selectedOrgId}
        />

        {/* Middle row: Chart + Fleet panel */}
        <div className="grid grid-cols-2 gap-4" style={{ minHeight: 280 }}>
          <BatteryHealthChart devices={devices} />
          <FleetLoadPanel powerUsage={powerUsage} devices={devices} />
        </div>

        {/* Units table */}
        <UnitsTable devices={devices} total={total} searchQuery={searchQuery} />
      </main>
    </div>
  );
};
