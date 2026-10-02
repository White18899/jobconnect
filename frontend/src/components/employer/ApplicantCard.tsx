import React from 'react';
import { Application } from '../../services/mockData';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { User, Phone, CheckCircle, XCircle, CreditCard, ShieldCheck, Lock, Unlock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ApplicantCardProps {
  application: Application;
  onAccept: (app: Application) => void;
  onReject: (app: Application) => void;
  onPay: (app: Application) => void;
  onViewUnlocked: (app: Application) => void;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({
  application,
  onAccept,
  onReject,
  onPay,
  onViewUnlocked,
}) => {
  const { t } = useLanguage();
  const worker = application.worker;
  const isUnlocked = application.status === 'unlocked';
  const isAccepted = application.status === 'accepted';
  const isPending = application.status === 'pending_verification';

  if (!worker) return null;

  return (
    <Card className={`mb-3.5 ${isUnlocked ? 'border-emerald-300 bg-emerald-50/20' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-brand-900 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            {worker.full_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-base font-bold text-slate-900 font-heading">
                {worker.full_name}
              </h4>
              {worker.verification_status === 'verified' && (
                <span title="Verified Worker">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Applied for: <span className="font-semibold text-slate-800">{application.job_title}</span>
            </p>
          </div>
        </div>

        <StatusBadge status={application.status} />
      </div>

      {/* Skills Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {worker.skills.map((skill, i) => (
          <span
            key={i}
            className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Worker Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-2xl border border-slate-100 mb-3">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Experience</span>
          <span className="font-semibold text-slate-800">{worker.experience_years} Years</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Preferred Area</span>
          <span className="font-semibold text-slate-800">{worker.preferred_area}, {worker.city}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Government ID</span>
          <span className="font-semibold text-slate-800">{worker.id_number_masked}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Status</span>
          <span className="font-semibold text-slate-800 flex items-center gap-1">
            {isUnlocked ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5" /> Revealed
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Hidden (+91 98***)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Action Buttons based on Application Status */}
      <div className="pt-2 border-t border-slate-100">
        {application.status === 'applied' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-1/3"
              onClick={() => onReject(application)}
              icon={<XCircle className="w-4 h-4 text-rose-600" />}
            >
              {t('employer.reject_worker')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="w-2/3"
              onClick={() => onAccept(application)}
              icon={<CheckCircle className="w-4 h-4" />}
            >
              {t('employer.accept_worker')}
            </Button>
          </div>
        )}

        {isAccepted && (
          <div className="space-y-2">
            <div className="text-xs text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
              Candidate accepted! Pay the one-time <b>₹499 verification fee</b> to submit for admin verification and unlock their phone number.
            </div>
            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={() => onPay(application)}
              icon={<CreditCard className="w-4 h-4" />}
            >
              {t('employer.proceed_payment')}
            </Button>
          </div>
        )}

        {isPending && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>₹499 Fee Paid (UTR: <b>{application.upi_ref || '428190581920'}</b>)</span>
            </div>
            <span className="font-semibold text-amber-800">Reviewing Docs...</span>
          </div>
        )}

        {isUnlocked && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <Unlock className="w-4 h-4 text-emerald-600" />
              <span>Contact Unlocked!</span>
            </div>
            <Button
              variant="success"
              size="sm"
              onClick={() => onViewUnlocked(application)}
              icon={<Phone className="w-3.5 h-3.5" />}
            >
              Call Worker Now
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
