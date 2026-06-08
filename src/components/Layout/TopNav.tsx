import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, Home, Moon, Search, Plus, RefreshCw } from 'lucide-react';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useAlarms } from '../../hooks/useAlarms';
import { useBootstrap } from '../../hooks/useReports';

interface TopNavProps {
  selectedOrgId: string;
  onOrgChange: (orgId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function TopNav({ selectedOrgId, onOrgChange, searchQuery, onSearchChange }: TopNavProps) {
  const { data: orgs = [] } = useOrganizations();
  const { data: alarmsPage } = useAlarms({ organization_id: selectedOrgId, status: 'active', limit: 1 });
  const bootstrap = useBootstrap();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const activeCount = alarmsPage?.total ?? 0;
  const selectedOrg = orgs.find(o => o.id === selectedOrgId);

  return (
    <nav style={{ backgroundColor: '#0d1626', borderBottom: '1px solid #1e2d45' }}
      className="px-6 py-3 flex items-center justify-between gap-3">

      {/* Brand */}
      <div className="flex-shrink-0">
        <div className="text-white font-bold text-xl leading-none tracking-tight">UPS</div>
        <div style={{ color: '#64748b' }} className="text-xs mt-0.5">APC uninterruptible power supplies</div>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
        <input
          type="text"
          placeholder="Search unit, MAC, IP, room..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          style={{ backgroundColor: '#131d2e', border: '1px solid #1e2d45', color: '#cbd5e1' }}
          className="w-full rounded-lg pl-8 pr-3 py-1.5 text-sm outline-none placeholder-slate-600"
        />
      </div>

      {/* Live indicator */}
      <div style={{ backgroundColor: '#0d1f1a', border: '1px solid #1a3a2a', color: '#4ade80' }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Live · {time}
      </div>

      {/* Bootstrap CTA */}
      <button
        onClick={() => bootstrap.mutate()}
        disabled={bootstrap.isPending}
        style={{ backgroundColor: '#f59e0b', color: '#000' }}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap flex-shrink-0 hover:brightness-110 disabled:opacity-60 transition-all">
        {bootstrap.isPending
          ? <RefreshCw size={14} className="animate-spin" />
          : <Plus size={14} strokeWidth={2.5} />}
        {bootstrap.isPending ? 'Syncing...' : 'Request a service or quote'}
      </button>

      {/* Org selector */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setDropdownOpen(v => !v)}
          style={{ backgroundColor: '#131d2e', border: '1px solid #1e2d45', color: '#cbd5e1' }}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:border-slate-500 transition-colors">
          <Home size={13} style={{ color: '#64748b' }} />
          <span className="font-mono">{selectedOrg ? selectedOrg.id : 'All Organizations'}</span>
          <ChevronDown size={13} style={{ color: '#64748b' }} />
        </button>
        {dropdownOpen && (
          <div style={{ backgroundColor: '#131d2e', border: '1px solid #1e2d45' }}
            className="absolute right-0 top-full mt-1 w-56 rounded-lg shadow-2xl z-50 overflow-hidden">
            {/* All orgs option */}
            <button
              style={{ color: !selectedOrgId ? '#60a5fa' : '#cbd5e1', borderBottom: '1px solid #1e2d45' }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-500/10 transition-colors font-medium"
              onClick={() => { onOrgChange(''); setDropdownOpen(false); }}>
              🏠 All Organizations
            </button>
            {orgs.length === 0 ? (
              <div style={{ color: '#64748b' }} className="px-3 py-3 text-sm text-center">
                No organizations found.<br />
                <span className="text-xs">Run bootstrap sync first.</span>
              </div>
            ) : (
              orgs.map(org => (
                <button key={org.id}
                  style={{ color: selectedOrgId === org.id ? '#60a5fa' : '#cbd5e1' }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-500/10 transition-colors"
                  onClick={() => { onOrgChange(org.id); setDropdownOpen(false); }}>
                  <div className="font-mono text-xs">{org.id}</div>
                  <div style={{ color: '#64748b' }} className="text-xs truncate">{org.label}</div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bell */}
      <button className="relative flex-shrink-0" style={{ color: '#64748b' }}>
        <Bell size={20} />
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold">
            {activeCount > 99 ? '99+' : activeCount}
          </span>
        )}
      </button>

      {/* Dark toggle */}
      <button style={{ color: '#64748b', backgroundColor: '#131d2e', border: '1px solid #1e2d45' }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm flex-shrink-0">
        <Moon size={13} />
        <span style={{ color: '#cbd5e1' }}>Light</span>
      </button>

      {/* User */}
      <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold select-none">SP</div>
        <span className="text-sm text-white hidden lg:block">Sai Pan</span>
        <ChevronDown size={13} style={{ color: '#64748b' }} />
      </div>
    </nav>
  );
}
