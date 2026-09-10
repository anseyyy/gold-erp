'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { UserPlus, Users } from 'lucide-react';

export default function PartnerHeader({ partners = [], onAddPartner }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddPartner?.(name.trim());
    setName('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Partners Account</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Equity share distribution and partner ledger transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <Users className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-1" />
            {partners.map((p, idx) => (
              <Badge key={idx} variant="indigo" className="text-xs px-2 py-0.5 font-bold">
                {p.name}
              </Badge>
            ))}
          </div>

          <Button
            variant="pastelPrimary"
            icon={UserPlus}
            onClick={() => setIsOpen(true)}
          >
            Add Partner
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Partner"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Partner Name"
            type="text"
            placeholder="e.g. Partner C"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="pastelPrimary">
              Save Partner
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}