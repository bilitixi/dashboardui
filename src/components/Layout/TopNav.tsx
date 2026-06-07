import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, Moon, Sun, Search, Zap } from 'lucide-react';
import { format } from 'date-fns';
import type { Organization } from '../../api/types';

interface TopNavProps {
  organizations: Organization[];
  selectedOrgId: string | undefined;
  onSelectOrg: (id: string | undefined) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  organizations,
  selectedOrgId,
  onSelectOrg,
  searchQuery,
  onSearchChange,
  darkMode,
  onToggleDark,
}) => {
  const [now, setNow] = useState(new Date());
  const [orgOpen, setOrgOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const selectedOrg = organizations.find((o) => o.id === selectedOrgId);

  return (
    <header className="bg-[#131d2e] border-b border-[#2a3548] px-6 py-3 flex items-center gap-4 sticky top-0 z-50">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3 min-w-0 mr-2">
        <div className="flex items-center justify-center w-9 h-9 bg-yellow-500/20 rounded-lg">
          <Zap size={18} className="text-yellow-400" />
        </div>
        <div className="leading-tight">
          <div className="text-white font-bold text-sm tracking-wide">UPS</div>
          <div className="text-[#94a3b8] text-[10px] truncate max-w-[160px]">
            APC uninterruptible power supplies
          </div>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search MAC, IP, room..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0f1520] border border-[#2a3548] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#3a4558]"
          />
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#0f1520] border border-[#2a3548] rounded-lg text-xs whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[#94a3b8]">Live</span>
          <span className="text-white font-mono">{format(now, 'HH:mm:ss')}</span>
        </div>

        {/* CTA button */}
        <button className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap transition-colors">
          + Request a service or quote
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 ml-2">
        {/* Org/Village selector */}
        <div className="relative">
          <button
            onClick={() => setOrgOpen(!orgOpen)}
            className="flex items-center gap-2 bg-[#0f1520] border border-[#2a3548] rounded-lg px-3 py-2 text-xs text-white hover:border-[#3a4558] transition-colors"
          >
            <span>{selectedOrg?.name ?? 'All villages'}</span>
            <ChevronDown size={12} className="text-[#94a3b8]" />
          </button>
          {orgOpen && (
            <div className="absolute right-0 top-full mt-1 bg-[#1a2235] border border-[#2a3548] rounded-lg py-1 min-w-[180px] z-50 shadow-xl">
              <button
                onClick={() => { onSelectOrg(undefined); setOrgOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs hover:bg-[#2a3548] transition-colors ${!selectedOrgId ? 'text-yellow-400' : 'text-white'}`}
              >
                All villages
              </button>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => { onSelectOrg(org.id); setOrgOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-[#2a3548] transition-colors ${selectedOrgId === org.id ? 'text-yellow-400' : 'text-white'}`}
                >
                  {org.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bell */}
        <button className="relative p-2 rounded-lg hover:bg-[#2a3548] transition-colors">
          <Bell size={16} className="text-[#94a3b8]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Dark toggle */}
        <button
          onClick={onToggleDark}
          className="p-2 rounded-lg hover:bg-[#2a3548] transition-colors"
        >
          {darkMode ? (
            <Sun size={16} className="text-[#94a3b8]" />
          ) : (
            <Moon size={16} className="text-[#94a3b8]" />
          )}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
          U
        </div>
      </div>
    </header>
  );
};
