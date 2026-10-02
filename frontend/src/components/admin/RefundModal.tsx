import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Application } from '../../services/mockData';
import { AlertCircle, IndianRupee, RotateCcw } from 'lucide-react';

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onConfirmRefund: (appId: string, refundRef: string, notes: string) => void;
}

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  application,
  onConfirmRefund,
}) => {
  const [refundRef, setRefundRef] = useState('');
  const [notes, setNotes] = useState('Full ₹499 refunded to employer UPI handle upon verification rejection');
  const [loading, setLoading] = useState(false);

  if (!application) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundRef.trim()) return;
    setLoading(true);
    onConfirmRefund(application.id, refundRef.trim(), notes.trim());
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Manual Refund (₹499)" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            Please process the ₹499 refund directly in your bank or UPI gateway app, then record the transaction reference here to update the ledger.
          </p>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Employer:</span>
            <span className="font-semibold text-slate-800">{application.business_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Original UTR:</span>
            <span className="font-mono font-bold text-slate-800">{application.upi_ref}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Refund Amount:</span>
            <span className="font-bold text-rose-700">₹499</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Refund Transaction ID / UTR <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            value={refundRef}
            onChange={(e) => setRefundRef(e.target.value)}
            placeholder="e.g. REF-UPI-90182412"
            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-brand-900 text-sm font-mono outline-hidden"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Internal Refund Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-brand-900 text-xs outline-hidden"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            loading={loading}
            icon={<RotateCcw className="w-4 h-4 mr-1" />}
          >
            Mark as Refunded
          </Button>
        </div>
      </form>
    </Modal>
  );
};
