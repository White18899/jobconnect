import React from 'react';
import { Application } from '../../services/mockData';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { MapPin, Phone, Lock, Unlock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ApplicationItemProps {
  application: Application;
  onViewUnlocked: (app: Application) => void;
  onViewJob: (app: Application) => void;
}

export const ApplicationItem: React.FC<ApplicationItemProps> = ({
  application,
  onViewUnlocked,
  onViewJob,
}) => {
  const { t } = useLanguage();
  const isUnlocked = application.status === 'unlocked';
  const isPending = application.status === 'pending_verification';

  return (
    <Card
      className={`mb-3.5 transition-all ${
        isUnlocked ? 'border-emerald-300 bg-emerald-50/20' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            {application.job_category}
          </span>
          <h3 className="text-base font-bold text-slate-900 font-heading">
            {application.job_title}
          </h3>
          <p className="text-xs text-slate-600 font-medium">{application.business_name}</p>
        </div>

        <StatusBadge status={application.status} />
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 my-2">
        <MapPin className="w-3.5 h-3.5 text-slate-400" />
        <span>
          {isUnlocked && application.exact_address
            ? application.exact_address
            : `${application.location_area}, ${application.location_city}`}
        </span>
      </div>

      {/* Conditional Unlock Banner */}
      {isUnlocked ? (
        <div className="mt-3 p-3 rounded-2xl bg-emerald-100/60 border border-emerald-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-emerald-900 font-semibold">
            <Unlock className="w-4 h-4 text-emerald-700" />
            <span>Shop address & Call contact unlocked!</span>
          </div>
          <Button
            size="sm"
            variant="success"
            onClick={() => onViewUnlocked(application)}
          >
            {t('applications.view_unlocked')}
          </Button>
        </div>
      ) : isPending ? (
        <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <p className="font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Employer paid ₹499 verification fee
          </p>
          <p className="text-[11px] text-amber-700 mt-0.5">
            Admin is reviewing business documents. Details unlock once approved.
          </p>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            Contact & address locked
          </span>
          <button
            onClick={() => onViewJob(application)}
            className="text-brand-900 font-bold hover:underline flex items-center gap-1"
          >
            Job Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </Card>
  );
};
