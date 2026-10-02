import React, { useState } from 'react';
import { Application } from '../../services/mockData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ChecklistModal } from '../../components/admin/ChecklistModal';
import { EmptyState } from '../../components/common/EmptyState';
import {
  CheckSquare,
  ShieldCheck,
  Building,
  User,
  CreditCard,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface VerificationDetailPageProps {
  applications: Application[];
  onApprove: (appId: string) => void;
  onReject: (appId: string, reason: string) => void;
  onBack: () => void;
}

export const VerificationDetailPage: React.FC<VerificationDetailPageProps> = ({
  applications,
  onApprove,
  onReject,
  onBack,
}) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'pending' | 'unlocked' | 'rejected' | 'all'>('pending');
  const [selectedAppForReview, setSelectedAppForReview] = useState<Application | null>(null);

  const filtered = applications.filter((app) => {
    if (filter === 'pending') return app.status === 'pending_verification';
    if (filter === 'unlocked') return app.status === 'unlocked';
    if (filter === 'rejected') return app.status === 'rejected' || app.status === 'verification_rejected';
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto pb-16 space-y-4">
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            {t('admin.queue')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Inspect ₹499 payments, verify identity & shop authenticity, and approve unlocks
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'pending', label: 'Pending Review' },
          { id: 'unlocked', label: 'Approved & Unlocked' },
          { id: 'rejected', label: 'Rejected' },
          { id: 'all', label: 'All Records' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === tab.id
                ? 'bg-brand-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Verification Items List */}
      {filtered.length > 0 ? (
        <div className="space-y-3.5">
          {filtered.map((app) => {
            const worker = app.worker;
            const isPending = app.status === 'pending_verification';

            return (
              <Card key={app.id} className="space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-brand-900 bg-blue-50 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                      Order: {app.order_code || 'JC-202610-8812'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-heading mt-1">
                      {app.job_title}
                    </h3>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                {/* Dual verification view: Worker vs Employer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Worker Box */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                      <User className="w-3.5 h-3.5 text-brand-900" />
                      <span>Worker Identity Proof</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Name: </span>
                      <span className="font-semibold text-slate-900">{worker?.full_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Masked ID: </span>
                      <span className="font-mono font-bold text-slate-900">{worker?.id_number_masked}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Skills: </span>
                      <span className="font-medium text-slate-800">{worker?.skills.join(', ')}</span>
                    </div>
                  </div>

                  {/* Employer Box */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                      <Building className="w-3.5 h-3.5 text-brand-900" />
                      <span>Employer Business Proof</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Shop: </span>
                      <span className="font-semibold text-slate-900">{app.business_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Owner: </span>
                      <span className="font-semibold text-slate-900">{app.contact_person || 'Owner'}</span>
                    </div>
                    <div className="line-clamp-1">
                      <span className="text-slate-500">Address: </span>
                      <span className="font-medium text-slate-800">{app.exact_address || app.location_area}</span>
                    </div>
                  </div>
                </div>

                {/* Payment & UTR reference bar */}
                <div className="flex flex-wrap items-center justify-between text-xs p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-700" />
                    <span>
                      Fee: <b>₹499 Paid</b> | UTR:{' '}
                      <b className="font-mono text-slate-900">{app.upi_ref || '428190581920'}</b>
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-800">Screenshot: receipt.jpg</span>
                </div>

                {/* Review Checklist Button */}
                {isPending && (
                  <div className="pt-1">
                    <Button
                      fullWidth
                      size="md"
                      variant="primary"
                      onClick={() => setSelectedAppForReview(app)}
                      icon={<CheckSquare className="w-4 h-4 mr-1" />}
                    >
                      Review 5-Point Checklist & Decide
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<CheckSquare className="w-8 h-8" />}
          title="No verification items found"
          description="All verification requests in this tab have been processed."
        />
      )}

      {/* Checklist & Approval Modal */}
      <ChecklistModal
        isOpen={Boolean(selectedAppForReview)}
        onClose={() => setSelectedAppForReview(null)}
        application={selectedAppForReview}
        onApprove={(appId) => {
          onApprove(appId);
          setSelectedAppForReview(null);
        }}
        onReject={(appId, reason) => {
          onReject(appId, reason);
          setSelectedAppForReview(null);
        }}
      />
    </div>
  );
};
