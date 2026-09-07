'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
    },
    info: {
      bg: 'bg-sky-50 border-sky-200 text-sky-800',
      icon: Info,
      iconColor: 'text-sky-600',
    },
  };

  const current = styles[type] || styles.success;
  const IconComponent = current.icon;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${current.bg}`}>
        <IconComponent className={`w-5 h-5 shrink-0 ${current.iconColor}`} />
        <p className="text-xs font-semibold">{message}</p>
        {onClose && (
          <button onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
