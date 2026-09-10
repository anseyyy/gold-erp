'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, ChevronDown, Check, UserPlus } from 'lucide-react';
import { customerApi } from '@/lib/api';

export default function CustomerSelect({
  label = 'Customer',
  value = '',
  onChange = () => {},
  placeholder = 'Select or search customer...',
  error = '',
  className = '',
  onAddCustomer,
}) {
  const [customers, setCustomers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Load customer list from customerApi (backend database)
  const loadCustomers = async () => {
    try {
      const data = await customerApi.getAll();
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data?.items && Array.isArray(data.items)) list = data.items;
      
      const names = list.map((item) => (typeof item === 'string' ? item : item.name)).filter(Boolean);
      // Remove duplicates
      const uniqueNames = Array.from(new Set(names));
      setCustomers(uniqueNames);
    } catch (err) {
      console.warn('Failed to fetch customers list for dropdown:', err);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered customer list directly by main input value
  const filteredCustomers = customers.filter((name) =>
    name.toLowerCase().includes((value || '').toLowerCase())
  );

  const handleSelect = (name) => {
    onChange(name);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
          <span>{label}</span>
          {onAddCustomer && (
            <button
              type="button"
              onClick={onAddCustomer}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              <UserPlus className="w-3 h-3" /> New Customer
            </button>
          )}
        </label>
      )}

      <div className="relative">
        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 z-10" />
        
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border rounded-lg pl-9 pr-8 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            error
              ? 'border-rose-500 dark:border-rose-500'
              : 'border-slate-200 dark:border-slate-700'
          }`}
        />

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Options Menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-1 font-sans text-xs">
            {/* Customer Options List */}
            <div className="py-1">
              {filteredCustomers.length === 0 ? (
                <div className="px-3 py-3 text-center text-slate-400 dark:text-slate-500">
                  {value ? (
                    <div>
                      <p className="text-[11px]">No customer matching "{value}".</p>
                      <button
                        type="button"
                        onClick={() => handleSelect(value)}
                        className="mt-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        Keep "{value}"
                      </button>
                    </div>
                  ) : (
                    'No customers available.'
                  )}
                </div>
              ) : (
                filteredCustomers.map((custName, idx) => {
                  const isSelected = custName.toLowerCase() === (value || '').toLowerCase();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(custName)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{custName}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })
              )}
            </div>

            {onAddCustomer && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onAddCustomer();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 hover:bg-indigo-100 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Register New Customer</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-[11px] text-rose-500 mt-0.5">{error}</p>}
    </div>
  );
}
