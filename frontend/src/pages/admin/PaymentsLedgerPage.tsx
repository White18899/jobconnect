import React, { useState } from 'react';
import { Application } from '../../services/mockData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RefundModal } from '../../components/admin/RefundModal';
import { CreditCard, IndianRupee, RotateCcw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PaymentsLedgerPageProps {
  applications: Application[];
  onRefundRecorded: (appId: string, ref: string, notes: string) => void;
  onBack: () => void;
}

export const PaymentsLedgerPage: React.FC<PaymentsLedgerPageProps> = ({
  applications,
  onRefundRecorded,
  onBack,
}) => {
  const { t } = useLanguage();
  const [selectedAppForRefund, setSelectedAppForRefund] = useState<Application | null>(null);

  // Filter applications that have payment interaction
  const paymentsList = applications.filter((app) => Boolean(app.payment_status || app.upi_ref));

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

      <div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          {t('admin.payments')}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Transactions ledger, UTR audit log, and manual refund records
        </p>
      </div>

      <div className="space-y-3">
        {paymentsList.map((app) => {
          const isSuccessful = app.status === 'unlocked';
          const isRejected = app.status === 'rejected' || app.status === 'verification_rejected';

          return (
            <Card key={app.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono font-bold text-xs text-brand-900 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {app.order_code || 'JC-202610-8812'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {app.business_name}
                  </h4>
                  <div className="text-xs text-slate-500">
                    Candidate: <span className="font-medium text-slate-800">{app.worker?.full_name}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900">₹499.00</div>
                  <div className="mt-1">
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                </div>
              </div>

              {/* UTR & Bank reference bar */}
              <div className="p-2.5 rounded-xl bg-slate-50 text-xs flex flex-wrap items-center justify-between text-slate-600 border border-slate-100">
                <div>
                  UTR Number: <span className="font-mono font-bold text-slate-900">{app.upi_ref || '428190581920'}</span>
                </div>
                <div className="text-[11px] text-slate-500">Method: UPI QR / Mobile Intent</div>
              </div>

              {/* Action trigger: Manual Refund if rejected */}
              {isRejected && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-rose-700 font-semibold">
                    Verification Rejected — Refund Pending
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedAppForRefund(app)}
                    icon={<RotateCcw className="w-3.5 h-3.5 mr-1" />}
                  >
                    {t('admin.record_refund')}
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <RefundModal
        isOpen={Boolean(selectedAppForRefund)}
        onClose={() => setSelectedAppForRefund(null)}
        application={selectedAppForRefund}
        onConfirmRefund={onRefundRecorded}
      />
    </div>
  );
};
