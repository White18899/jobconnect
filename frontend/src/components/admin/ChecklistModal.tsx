import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Application } from '../../services/mockData';
import { CheckSquare, ShieldCheck, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onApprove: (appId: string, notes?: string) => void;
  onReject: (appId: string, reason: string) => void;
}

export const ChecklistModal: React.FC<ChecklistModalProps> = ({
  isOpen,
  onClose,
  application,
  onApprove,
  onReject,
}) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'review' | 'reject'>('review');
  const [rejectReason, setRejectReason] = useState('');

  // 5 checklist items
  const [checks, setChecks] = useState({
    documentsClear: true,
    nameMatched: true,
    selfieMatched: true,
    shopExists: true,
    noDuplicate: true,
  });

  if (!application) return null;

  const allChecksPassed = Object.values(checks).every(Boolean);

  const handleApprove = () => {
    onApprove(application.id);
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onReject(application.id, rejectReason.trim());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'review' ? t('admin.checklist_title') : 'Reject Verification'}
      maxWidth="lg"
    >
      {mode === 'review' ? (
        <div className="space-y-4">
          {/* Item details */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Job:</span>
              <span className="font-bold text-slate-900">{application.job_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Employer:</span>
              <span className="font-semibold text-slate-800">{application.business_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Worker:</span>
              <span className="font-semibold text-slate-800">{application.worker?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">UTR Reference:</span>
              <span className="font-mono font-bold text-brand-900">{application.upi_ref || '428190581920'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fee Amount:</span>
              <span className="font-bold text-emerald-700">₹499 (Received)</span>
            </div>
          </div>

          {/* 5-Point Verification Checklist */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Admin Compliance Checklist:
            </h4>

            {[
              { id: 'documentsClear', label: t('admin.check_docs') },
              { id: 'nameMatched', label: t('admin.check_name') },
              { id: 'selfieMatched', label: t('admin.check_selfie') },
              { id: 'shopExists', label: t('admin.check_shop') },
              { id: 'noDuplicate', label: t('admin.check_duplicate') },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50/60 cursor-pointer transition select-none"
              >
                <input
                  type="checkbox"
                  checked={(checks as any)[item.id]}
                  onChange={(e) =>
                    setChecks({ ...checks, [item.id]: e.target.checked })
                  }
                  className="w-5 h-5 rounded-md text-brand-900 border-slate-300 focus:ring-brand-900 mt-0.5"
                />
                <span className="text-xs font-semibold text-slate-800">{item.label}</span>
              </label>
            ))}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-3">
            <Button
              variant="danger"
              size="md"
              className="w-1/3"
              onClick={() => setMode('reject')}
            >
              {t('admin.reject')}
            </Button>
            <Button
              variant="success"
              size="md"
              className="w-2/3"
              disabled={!allChecksPassed}
              onClick={handleApprove}
              icon={<ShieldCheck className="w-5 h-5" />}
            >
              {t('admin.approve')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>
              Rejecting will mark the application as <b>verification_rejected</b> and flag the ₹499 fee for refund according to the refund policy.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Specify Rejection Reason <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Shop signboard name does not match Udyam document, or selfie does not match photo ID."
              className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-brand-900 text-xs outline-hidden"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button variant="secondary" size="md" onClick={() => setMode('review')}>
              Back
            </Button>
            <Button
              variant="danger"
              size="md"
              fullWidth
              disabled={!rejectReason.trim()}
              onClick={handleReject}
            >
              Confirm Rejection & Flag Refund
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
