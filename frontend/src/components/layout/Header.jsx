'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Search, Bell, Sun, Moon, ChevronDown, User, LogOut, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/lib/darkmode';
import Badge from '@/components/ui/Badge';
import { customerApi, customerLedgerApi } from '@/lib/api';

export default function Header({ onOpenMobileMenu }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  // Global search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [customerResults, setCustomerResults] = useState([]);

  const searchContainerRef = useRef(null);

  const getBreadcrumb = () => {
    if (!pathname || pathname === '/dashboard') return 'Dashboard';
    const parts = pathname.split('/').filter(Boolean);
    return parts
      .map((p) => p.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()))
      .join(' / ');
  };

  // Perform customer search on typing
  useEffect(() => {
    if (!searchQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCustomerResults([]);
      setIsSearchOpen(false);
      return;
    }

    let active = true;
    Promise.allSettled([
      customerLedgerApi.getAll(),
      customerApi.getAll(),
    ]).then(([ledgerRes, custRes]) => {
      if (!active) return;
      const q = searchQuery.toLowerCase().trim();

      const ledgerItems = ledgerRes.status === 'fulfilled' ? ledgerRes.value?.items || [] : [];
      const custItems = custRes.status === 'fulfilled' ? custRes.value?.items || [] : [];

      const map = new Map();

      ledgerItems.forEach((c) => {
        if (c.customerName) {
          map.set(c.customerName.toLowerCase(), c);
        }
      });

      custItems.forEach((c) => {
        const name = typeof c === 'string' ? c : c.name || c.customerName;
        if (name && !map.has(name.toLowerCase())) {
          map.set(name.toLowerCase(), {
            customerName: name,
            totalOrders: 0,
            totalBuyOrders: 0,
            totalSellOrders: 0,
          });
        }
      });

      const allCustomers = Array.from(map.values());
      const matches = allCustomers.filter((c) =>
        c.customerName?.toLowerCase().includes(q)
      );

      setCustomerResults(matches);
      setIsSearchOpen(true);
    });

    return () => {
      active = false;
    };
  }, [searchQuery]);

  // Click outside listener for search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectCustomer = (customerName) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/customer-ledger/${encodeURIComponent(customerName)}`);
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-[#E8EAF0] dark:border-slate-800 sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between transition-colors">
      {/* Left section: Mobile menu toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Pages</span>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{getBreadcrumb()}</h2>
        </div>
      </div>

      {/* Center section: Interactive Live Search input with Customer Dropdown */}
      <div className="hidden md:flex items-center max-w-sm w-full relative" ref={searchContainerRef}>
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
            placeholder="Search customers (e.g. NRK), transactions..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
          />
        </div>

        {/* Live Search Results Dropdown Popup */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden text-xs">
            <div className="p-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Matching Customers</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{customerResults.length} found</span>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {customerResults.length === 0 ? (
                <div className="p-4 text-center text-slate-400 font-medium">
                  No customer records found matching &ldquo;{searchQuery}&ldquo;
                </div>
              ) : (
                customerResults.map((c) => (
                  <button
                    key={c.customerName}
                    onClick={() => handleSelectCustomer(c.customerName)}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-indigo-50/50 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-black flex items-center justify-center border border-indigo-100 dark:border-indigo-800/80 shrink-0 group-hover:scale-105 transition-transform">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {c.customerName}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                          {c.totalOrders || 0} Total Orders ({c.totalBuyOrders || 0} Buys, {c.totalSellOrders || 0} Sells)
                        </p>
                      </div>
                    </div>
                    <Badge variant="indigo" className="text-[10px] ml-2 shrink-0 font-bold">
                      Open Ledger
                    </Badge>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right section: Icons & User Dropdown */}
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{user?.name || 'Admin'}</p>
              <Badge variant={user?.role === 'owner' ? 'indigo' : 'emerald'} className="text-[9px] py-0 px-1 mt-0.5">
                {user?.role || 'owner'}
              </Badge>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-[#E8EAF0] dark:border-slate-800 rounded-lg shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-[#E8EAF0] dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{user?.name}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile Settings</span>
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-t border-[#E8EAF0] dark:border-slate-800"
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
