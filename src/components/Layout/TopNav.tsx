import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, Home, Moon, Search, Plus } from 'lucide-react';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useAlarms } from '../../hooks/useAlarms';

interface TopNavProps {
  selectedOrgId: string | undefined;
  onOrgChange: (orgId: string | undefined) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function TopNav({ selectedOrgId, onOrgChange, searchQuery, onSearchChange }: TopNavProps) {
  const { data: orgs = [] } = useOrganizations();
  const { data: alarms = [] } = useAlarms(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const activeAlarms = alarms.filter((a) => !a.acknowledged);
  const selectedOrg = orgs.find((o) => o.id === selectedOrgId);
  const orgLabel = selectedOrg ? selectedOrg.name : 'All Villages';

  return (
    <nav style={{ backgroundColor: '#0d1626', borderBottom: '1px solid #1e2d45' }}
      className="px-6 py-3 flex items-center justify-between gap-4">

      {/* Brand */}
      <div className="flex-shrink-0">
        <div className="text-white font-bold text-xl leading-none tracking-tight">UPS</div>
        <div style={{ color: '#64748b' }} className="text-xs mt-0.5 whitespace-nowrap">APC uninterruptible power supplies</div>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
        <input
          type="text"
          placeholder="Search MAC, IP, room..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ backgroundColor: '#131d2e', border: '1px solid #1e2d45', color: '#cbd5e1' }}
          className="w-full rounded-lg pl-9 pr-3 py-1.5 text-sm outline-none placeholder-slate-600"
        />
      </div>

      {/* Live indicator */}
      <div style={{ backgroundColor: '#0d1f1a', border: '1px solid #1a3a2a', color: '#4ade80' }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Live · {time}
      </div>

      {/* CTA */}
      <button style={{ backgroundColor: '#f59e0b', color: '#000' }}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap flex-shrink-0 hover:brightness-110 transition-all">
        <Plus size={15} strokeWidth={2.5} />
        Request a service or quote
      </button>

      {/* Village selector */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          style={{ backgroundColor: '#131d2e', border: '1px solid #1e2d45', color: '#cbd5e1' }}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:border-slate-500 transition-colors"
        >
          <Home size={14} style={{ color: '#64748b' }} />
          <span>{orgLabel}</span>
          <ChevronDown size={14} style={{ color: '#64748b' }} />
        </button>
        {dropdownOpen && (
          <div style={{ backgroundColor: '#131d2e', border: '1px solid #1e2d45' }}
            className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-2xl z-50 overflow-hidden">
            {orgs.map((org) => (
              <button
                key={org.id}
                style={{ color: '#cbd5e1' }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-500/10 transition-colors"
                onClick={() => { onOrgChange(org.id); setDropdownOpen(false); }}
              >
                {org.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bell */}
      <button className="relative flex-shrink-0" style={{ color: '#64748b' }}>
        <Bell size={20} />
        {activeAlarms.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold">
            {activeAlarms.length}
          </span>
        )}
      </button>

      {/* Dark mode toggle */}
      <button style={{ color: '#64748b', backgroundColor: '#131d2e', border: '1px solid #1e2d45' }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm flex-shrink-0 hover:border-slate-500 transition-colors">
        <Moon size={14} />
        <span style={{ color: '#cbd5e1' }}>Light</span>
      </button>

      {/* User */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">SP</div>
        <div className="hidden sm:block">
          <div className="text-sm font-medium text-white leading-none">Sai Pan</div>
        </div>
        <ChevronDown size={14} style={{ color: '#64748b' }} />
      </div>
    </nav>
  );
}
