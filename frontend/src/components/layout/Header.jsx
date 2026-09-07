'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Search, Bell, Sun, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Badge from '@/components/ui/Badge';

export default function Header({ onOpenMobileMenu }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const getBreadcrumb = () => {
    if (!pathname || pathname === '/dashboard') return 'Dashboard';
    const parts = pathname.split('/').filter(Boolean);
    return parts
      .map((p) => p.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()))
      .join(' / ');
  };

  return (
    <header className="h-16 bg-white border-b border-[#E8EAF0] sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between">
      {/* Left section: Mobile menu toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs font-medium text-slate-400">Pages</span>
          <h2 className="text-sm font-bold text-slate-800">{getBreadcrumb()}</h2>
        </div>
      </div>

      {/* Center section: Search input */}
      <div className="hidden md:flex items-center max-w-xs w-full">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions, accounts..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right section: Icons & User Dropdown */}
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
        </button>

        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors" title="Pastel Light Mode Active">
          <Sun className="w-4 h-4 text-amber-500" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1"></div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Admin'}</p>
              <Badge variant={user?.role === 'owner' ? 'indigo' : 'emerald'} className="text-[9px] py-0 px-1 mt-0.5">
                {user?.role || 'owner'}
              </Badge>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E8EAF0] rounded-lg shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-[#E8EAF0]">
                <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile Settings</span>
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 border-t border-[#E8EAF0]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
