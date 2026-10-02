import React, { useState } from 'react';
import { Application, Job } from '../../services/mockData';
import { ApplicantCard } from '../../components/employer/ApplicantCard';
import { PaymentModal } from '../../components/employer/PaymentModal';
import { UnlockedWorkerView } from '../../components/employer/UnlockedWorkerView';
import { EmptyState } from '../../components/common/EmptyState';
import { Users, Filter } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ApplicantsPageProps {
  applications: Application[];
  jobs: Job[];
  selectedJobId?: string;
  onAcceptApplicant: (appId: string) => void;
  onRejectApplicant: (appId: string) => void;
  onPaymentSubmitted: (appId: string, utr: string) => void;
}

export const ApplicantsPage: React.FC<ApplicantsPageProps> = ({
  applications,
  jobs,
  selectedJobId,
  onAcceptApplicant,
  onRejectApplicant,
  onPaymentSubmitted,
}) => {
  const { t } = useLanguage();

  const [activeJobFilter, setActiveJobFilter] = useState<string>(selectedJobId || 'all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [paymentModalApp, setPaymentModalApp] = useState<Application | null>(null);
  const [unlockedWorkerViewApp, setUnlockedWorkerViewApp] = useState<Application | null>(null);

  if (unlockedWorkerViewApp) {
    return (
      <UnlockedWorkerView
        application={unlockedWorkerViewApp}
        onBack={() => setUnlockedWorkerViewApp(null)}
      />
    );
  }

  const filteredApps = applications.filter((app) => {
    const matchesJob = activeJobFilter === 'all' || app.job_id === activeJobFilter;
    const matchesStatus =
      activeStatusFilter === 'all' ||
      (activeStatusFilter === 'pending' && app.status === 'pending_verification') ||
      (activeStatusFilter === 'unlocked' && app.status === 'unlocked') ||
      (activeStatusFilter === 'applied' && app.status === 'applied');
    return matchesJob && matchesStatus;
  });

  return (
    <div className="max-w-xl mx-auto pb-28 space-y-4">
      <div className="pt-1">
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          {t('nav.applicants')}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Review candidates, accept profiles, and unlock verified contact numbers
        </p>
      </div>

      {/* Filter by Job dropdown */}
      <div className="flex flex-col sm:flex-row gap-2 text-xs">
        <select
          value={activeJobFilter}
          onChange={(e) => setActiveJobFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden shadow-2xs"
        >
          <option value="all">All Jobs ({applications.length} applicants)</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All' },
            { id: 'applied', label: 'New Applied' },
            { id: 'pending', label: 'Pending Check' },
            { id: 'unlocked', label: 'Unlocked' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStatusFilter(st.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                activeStatusFilter === st.id
                  ? 'bg-brand-900 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applicants List */}
      {filteredApps.length > 0 ? (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <ApplicantCard
              key={app.id}
              application={app}
              onAccept={(a) => onAcceptApplicant(a.id)}
              onReject={(a) => onRejectApplicant(a.id)}
              onPay={(a) => setPaymentModalApp(a)}
              onViewUnlocked={(a) => setUnlockedWorkerViewApp(a)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="No applicants found"
          description="There are currently no worker applications matching your selected filters."
        />
      )}

      {/* ₹499 UPI QR Payment Modal */}
      <PaymentModal
        isOpen={Boolean(paymentModalApp)}
        onClose={() => setPaymentModalApp(null)}
        application={paymentModalApp}
        onPaymentSubmitted={(appId, utr) => {
          onPaymentSubmitted(appId, utr);
          setPaymentModalApp(null);
        }}
      />
    </div>
  );
};
