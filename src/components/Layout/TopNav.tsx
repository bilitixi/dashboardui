import React, { useState } from 'react';
import { Battery, Bell, ChevronDown, RefreshCw } from 'lucide-react';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useAlarms } from '../../hooks/useAlarms';

interface TopNavProps {
  selectedOrgId: string | undefined;
  onOrgChange: (orgId: string | undefined) => void;
}

export function TopNav({ selectedOrgId, onOrgChange }: TopNavProps) {
  const { data: orgs = [] } = useOrganizations();
  const { data: alarms = [] } = useAlarms(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeAlarms = alarms.filter((a) => !a.acknowledged);
  const selectedOrg = orgs.find((o) => o.id === selectedOrgId);

  return (
    <nav className="bg-[#0d1626] border-b border-gray-700/50 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Battery className="text-blue-400" size={24} />
        <span className="text-white font-bold text-lg tracking-tight">FleetDash</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Org Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 bg-[#1a2740] border border-gray-600/50 rounded-lg px-3 py-1.5 text-sm text-gray-200 hover:border-blue-500/50 transition-colors"
          >
            <span>{selectedOrg ? selectedOrg.name : 'All Organizations'}</span>
            <ChevronDown size={14} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-[#1a2740] border border-gray-600/50 rounded-lg shadow-xl z-50">
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-blue-500/10 transition-colors"
                onClick={() => { onOrgChange(undefined); setDropdownOpen(false); }}
              >
                All Organizations
              </button>
              {orgs.map((org) => (
                <button
                  key={org.id}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-blue-500/10 transition-colors"
                  onClick={() => { onOrgChange(org.id); setDropdownOpen(false); }}
                >
                  {org.name}
                  <span className="ml-1 text-gray-500 text-xs">({org.deviceCount})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alarms bell */}
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          {activeAlarms.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {activeAlarms.length}
            </span>
          )}
        </button>

        {/* Refresh indicator */}
        <RefreshCw size={16} className="text-gray-500 animate-spin" style={{ animationDuration: '3s' }} />
      </div>
    </nav>
  );
}
