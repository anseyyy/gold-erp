'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function AddCustomerModal({
  isOpen,
  onClose,
  newCustomerName,
  setNewCustomerName,
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Customer"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Customer Name"
          type="text"
          placeholder="e.g. PT Emas Utama / John Doe"
          value={newCustomerName}
          onChange={(e) => setNewCustomerName(e.target.value)}
          required
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="pastelPrimary" icon={Plus}>
            Save Customer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
